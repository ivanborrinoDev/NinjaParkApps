import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AddParkingModal } from "./AddParkingModal";

interface MyParkingPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyParkingPage({ isOpen, onClose }: MyParkingPageProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddParking, setShowAddParking] = useState(false);

  // Fetch user's parking spots
  const { data: hostParkingSpots = [], isLoading } = useQuery({
    queryKey: [`/api/parking-spots/host/${user?.id}`],
    queryFn: () => fetch(`/api/parking-spots/host/${user?.id}`).then(res => res.json()),
    enabled: !!user?.id && isOpen,
  });

  // Fetch user's bookings
  const { data: userBookings = [] } = useQuery({
    queryKey: [`/api/bookings/user/${user?.id}`],
    queryFn: () => fetch(`/api/bookings/user/${user?.id}`).then(res => res.json()),
    enabled: !!user?.id && isOpen,
  });

  const deleteParkingMutation = useMutation({
    mutationFn: (parkingId: number) => 
      fetch(`/api/parking-spots/${parkingId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/parking-spots/host/${user?.id}`] });
      toast({
        title: "Successo",
        description: "Parcheggio eliminato con successo.",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Impossibile eliminare il parcheggio.",
        variant: "destructive",
      });
    },
  });

  if (!isOpen) return null;

  const handleDeleteParking = (parkingId: number) => {
    if (confirm("Sei sicuro di voler eliminare questo parcheggio?")) {
      deleteParkingMutation.mutate(parkingId);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="absolute inset-4 bg-ninja-gray rounded-3xl shadow-2xl border border-gray-600 overflow-hidden">
        {/* Header */}
        <div className="bg-ninja-gray-light px-6 py-4 border-b border-gray-600 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {user?.role === "host" ? "I Miei Parcheggi" : "Le Mie Prenotazioni"}
          </h2>
          <div className="flex items-center space-x-3">
            {user?.role === "host" && (
              <button
                onClick={() => setShowAddParking(true)}
                className="bg-ninja-mint hover:bg-ninja-mint-dark text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Aggiungi
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-full overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : user?.role === "host" ? (
            // Host view - Show owned parking spots
            <div className="space-y-4">
              {hostParkingSpots.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-ninja-gray-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Nessun parcheggio</h3>
                  <p className="text-gray-400 mb-4">Inizia a guadagnare aggiungendo il tuo primo parcheggio</p>
                  <button
                    onClick={() => setShowAddParking(true)}
                    className="bg-ninja-mint hover:bg-ninja-mint-dark text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    Aggiungi Parcheggio
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {hostParkingSpots.map((spot: any) => (
                    <div key={spot.id} className="bg-ninja-gray-light rounded-2xl p-4 border border-gray-600">
                      <div className="flex items-start space-x-4">
                        {/* Parking spot image */}
                        <div className="w-20 h-20 bg-ninja-gray rounded-xl overflow-hidden flex-shrink-0">
                          {spot.images && spot.images.length > 0 ? (
                            <img 
                              src={spot.images[0]} 
                              alt={spot.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling!.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-full h-full flex items-center justify-center ${spot.images && spot.images.length > 0 ? 'hidden' : 'flex'}`}
                          >
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">{spot.name}</h3>
                          <p className="text-gray-400 text-sm mb-2">{spot.address}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-ninja-mint font-medium">€{spot.pricePerHour}/ora</span>
                            {spot.rating && (
                              <div className="flex items-center">
                                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-gray-300">{spot.rating}</span>
                              </div>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              spot.isAvailable 
                                ? "bg-green-500/20 text-green-400" 
                                : "bg-red-500/20 text-red-400"
                            }`}>
                              {spot.isAvailable ? "Disponibile" : "Non disponibile"}
                            </span>
                          </div>
                          {spot.features && spot.features.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {spot.features.slice(0, 3).map((feature: string, index: number) => (
                                <span key={index} className="bg-ninja-gray text-gray-300 px-2 py-1 rounded-lg text-xs">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button 
                            className="text-gray-400 hover:text-ninja-mint transition-colors p-2"
                            title="Modifica"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteParking(spot.id)}
                            className="text-gray-400 hover:text-red-400 transition-colors p-2"
                            title="Elimina"
                            disabled={deleteParkingMutation.isPending}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Guest view - Show bookings
            <div className="space-y-4">
              {userBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-ninja-gray-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Nessuna prenotazione</h3>
                  <p className="text-gray-400">Le tue prenotazioni appariranno qui</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {userBookings.map((booking: any) => (
                    <div key={booking.id} className="bg-ninja-gray-light rounded-2xl p-4 border border-gray-600">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-white">Prenotazione #{booking.id}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === "confirmed" 
                                ? "bg-green-500/20 text-green-400" 
                                : booking.status === "cancelled"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}>
                              {booking.status === "confirmed" ? "Confermata" : 
                               booking.status === "cancelled" ? "Annullata" : "Completata"}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 space-y-1">
                            <p><span className="text-gray-300">Inizio:</span> {new Date(booking.startTime).toLocaleString('it-IT')}</p>
                            <p><span className="text-gray-300">Fine:</span> {new Date(booking.endTime).toLocaleString('it-IT')}</p>
                            <p><span className="text-gray-300">Prezzo:</span> <span className="text-ninja-mint font-medium">€{booking.totalPrice}</span></p>
                          </div>
                        </div>
                        {booking.status === "confirmed" && (
                          <button className="text-gray-400 hover:text-red-400 transition-colors p-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Parking Modal */}
      <AddParkingModal 
        isOpen={showAddParking} 
        onClose={() => {
          setShowAddParking(false);
          queryClient.invalidateQueries({ queryKey: [`/api/parking-spots/host/${user?.id}`] });
        }} 
      />
    </div>
  );
}