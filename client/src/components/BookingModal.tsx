import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  parkingSpot: any;
}

export function BookingModal({ isOpen, onClose, parkingSpot }: BookingModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: "",
    startTime: "09:00",
    endDate: "",
    endTime: "17:00",
    bookingType: "hourly" as "hourly" | "weekly",
  });

  if (!isOpen || !parkingSpot) return null;

  const calculatePrice = () => {
    if (!bookingData.startDate || !bookingData.startTime || !bookingData.endDate || !bookingData.endTime) {
      return 0;
    }

    const startDateTime = new Date(`${bookingData.startDate}T${bookingData.startTime}`);
    const endDateTime = new Date(`${bookingData.endDate}T${bookingData.endTime}`);
    
    if (endDateTime <= startDateTime) {
      return 0;
    }

    const diffInMs = endDateTime.getTime() - startDateTime.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    return Math.round(diffInHours * parseFloat(parkingSpot.pricePerHour) * 100) / 100;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per prenotare.",
        variant: "destructive",
      });
      return;
    }

    if (!bookingData.startDate || !bookingData.startTime || !bookingData.endDate || !bookingData.endTime) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi della prenotazione.",
        variant: "destructive",
      });
      return;
    }

    const startDateTime = new Date(`${bookingData.startDate}T${bookingData.startTime}`);
    const endDateTime = new Date(`${bookingData.endDate}T${bookingData.endTime}`);
    
    if (endDateTime <= startDateTime) {
      toast({
        title: "Errore",
        description: "L'orario di fine deve essere successivo a quello di inizio.",
        variant: "destructive",
      });
      return;
    }

    if (startDateTime < new Date()) {
      toast({
        title: "Errore",
        description: "Non puoi prenotare nel passato.",
        variant: "destructive",
      });
      return;
    }

    const totalPrice = calculatePrice();

    setLoading(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parkingSpotId: parkingSpot.id,
          guestId: user.id,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          totalPrice: totalPrice.toString(),
          status: "confirmed",
        }),
      });

      if (response.ok) {
        toast({
          title: "Prenotazione confermata!",
          description: `Parcheggio prenotato per €${totalPrice}. Riceverai un'email di conferma.`,
        });
        onClose();
        // Reset form
        setBookingData({
          startDate: "",
          startTime: "09:00",
          endDate: "",
          endTime: "17:00",
        });
      } else {
        throw new Error("Errore durante la prenotazione");
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile completare la prenotazione. Riprova.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = calculatePrice();
  const isValidBooking = totalPrice > 0;

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="absolute bottom-0 left-0 right-0 bg-ninja-gray rounded-t-3xl shadow-2xl border-t border-gray-600 transform translate-y-0 transition-transform duration-300 max-h-[90vh] overflow-y-auto">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-500 rounded-full"></div>
        </div>
        
        {/* Parking Image */}
        <div className="px-6">
          <div className="rounded-2xl overflow-hidden mb-4">
            <img 
              src={parkingSpot.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"} 
              alt={parkingSpot.name}
              className="w-full h-32 object-cover" 
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="px-6 pb-8">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Prenota Parcheggio</h3>
            <p className="text-gray-400">{parkingSpot.name}</p>
            <p className="text-ninja-mint font-semibold">€{parkingSpot.pricePerHour}/ora</p>
          </div>

          <form onSubmit={handleBooking} className="space-y-6">
            {/* Booking Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo di Prenotazione
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBookingData(prev => ({ ...prev, bookingType: "hourly" }))}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                    bookingData.bookingType === "hourly"
                      ? "bg-ninja-mint text-white"
                      : "bg-ninja-gray-light text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Oraria
                </button>
                <button
                  type="button"
                  onClick={() => setBookingData(prev => ({ ...prev, bookingType: "weekly" }))}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                    bookingData.bookingType === "weekly"
                      ? "bg-ninja-mint text-white"
                      : "bg-ninja-gray-light text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Settimanale
                </button>
              </div>
            </div>

            {/* Data e Ora Inizio */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data Inizio
                </label>
                <input
                  type="date"
                  min={today}
                  value={bookingData.startDate}
                  onChange={(e) => setBookingData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ninja-mint"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ora Inizio
                </label>
                <input
                  type="time"
                  value={bookingData.startTime}
                  onChange={(e) => setBookingData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ninja-mint"
                  required
                />
              </div>
            </div>

            {/* Data e Ora Fine */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data Fine
                </label>
                <input
                  type="date"
                  min={bookingData.startDate || today}
                  value={bookingData.endDate}
                  onChange={(e) => setBookingData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ninja-mint"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ora Fine
                </label>
                <input
                  type="time"
                  value={bookingData.endTime}
                  onChange={(e) => setBookingData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ninja-mint"
                  required
                />
              </div>
            </div>

            {/* Riepilogo Prezzo */}
            <div className="bg-ninja-gray-light rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Costo totale</p>
                  <p className="text-3xl font-bold text-ninja-mint">
                    {isValidBooking ? `€${totalPrice.toFixed(2)}` : "€0.00"}
                  </p>
                </div>
                <div className="text-right">
                  {isValidBooking && (
                    <div className="text-sm text-gray-400">
                      <p>{Math.round(calculatePrice() / parseFloat(parkingSpot.pricePerHour) * 100) / 100} ore</p>
                      <p>€{parkingSpot.pricePerHour}/ora</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Disponibilità */}
            {parkingSpot.availabilityDays && (
              <div className="bg-ninja-gray-light rounded-2xl p-4">
                <h4 className="text-white font-medium mb-2">Orari di disponibilità</h4>
                <div className="text-sm text-gray-400">
                  <p>Giorni: {parkingSpot.availabilityDays?.join(", ") || "Non specificati"}</p>
                  <p>Orario: {parkingSpot.availabilityStartTime || "00:00"} - {parkingSpot.availabilityEndTime || "23:59"}</p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-4 px-6 bg-ninja-gray-light text-white font-semibold rounded-xl hover:bg-gray-600 transition-colors"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={loading || !isValidBooking}
                className="py-4 px-6 bg-ninja-mint hover:bg-ninja-mint-dark text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                )}
                {loading ? "Prenotando..." : "Paga e Prenota"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}