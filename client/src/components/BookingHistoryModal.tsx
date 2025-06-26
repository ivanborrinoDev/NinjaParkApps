import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Booking } from '../types/booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { X, Calendar, Clock, Euro, MapPin, CheckCircle, XCircle, AlertCircle, Star } from 'lucide-react';

interface BookingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onReviewBooking?: (booking: Booking) => void;
}

export const BookingHistoryModal: React.FC<BookingHistoryModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onReviewBooking,
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const userBookings = bookings.filter(b => b.userId === currentUser?.uid);

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'pending':
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confermata';
      case 'cancelled':
        return 'Annullata';
      case 'completed':
        return 'Completata';
      case 'pending':
      default:
        return 'In attesa';
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-900 text-green-300';
      case 'cancelled':
        return 'bg-red-900 text-red-300';
      case 'completed':
        return 'bg-blue-900 text-blue-300';
      case 'pending':
      default:
        return 'bg-yellow-900 text-yellow-300';
    }
  };

  const canCancelBooking = (booking: Booking) => {
    const now = new Date();
    const startTime = new Date(booking.startDateTime);
    const timeDiff = startTime.getTime() - now.getTime();
    const hoursUntilStart = timeDiff / (1000 * 60 * 60);
    
    return booking.status === 'confirmed' && hoursUntilStart > 1;
  };

  const canReview = (booking: Booking) => {
    return booking.status === 'completed';
  };

  const handleCancelBooking = (booking: Booking) => {
    if (!canCancelBooking(booking)) {
      toast({
        title: "Impossibile annullare",
        description: "Puoi annullare solo fino a 1 ora prima dell'inizio",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Sei sicuro di voler annullare la prenotazione per ${booking.parkingName}?`)) {
      return;
    }

    onCancelBooking(booking.id);
    toast({
      title: "Prenotazione annullata",
      description: "La tua prenotazione è stata annullata con successo",
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (start: Date, end: Date) => {
    const duration = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60);
    return `${duration.toFixed(1)} ore`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-park-surface border-gray-600 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-white text-xl font-semibold">
            Cronologia Prenotazioni ({userBookings.length})
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {userBookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-park-card rounded-full mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-park-mint" />
              </div>
              <h3 className="text-white text-lg font-medium mb-2">
                Nessuna prenotazione
              </h3>
              <p className="text-gray-400 mb-4">
                Non hai ancora effettuato nessuna prenotazione
              </p>
              <Button
                onClick={onClose}
                className="bg-park-mint text-park-dark hover:bg-opacity-90"
              >
                Trova un Parcheggio
              </Button>
            </div>
          ) : (
            userBookings
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((booking) => (
                <Card
                  key={booking.id}
                  className="bg-park-card border-gray-600"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-medium flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-park-mint" />
                          <span>{booking.parkingName}</span>
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          Prenotazione #{booking.id.slice(-8)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(booking.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <div>
                          <p className="font-medium">Inizio</p>
                          <p>{formatDateTime(booking.startDateTime)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <div>
                          <p className="font-medium">Fine</p>
                          <p>{formatDateTime(booking.endDateTime)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-600">
                      <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <span>{formatDuration(booking.startDateTime, booking.endDateTime)}</span>
                        <span className="flex items-center space-x-1">
                          <Euro className="w-3 h-3" />
                          <span className="font-medium text-park-mint">{booking.totalCost.toFixed(2)} €</span>
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        {canReview(booking) && onReviewBooking && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onReviewBooking(booking)}
                            className="text-park-mint border-park-mint hover:bg-park-mint hover:text-park-dark"
                          >
                            <Star className="w-4 h-4 mr-1" />
                            Recensione
                          </Button>
                        )}
                        
                        {canCancelBooking(booking) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelBooking(booking)}
                            className="text-red-400 border-red-600 hover:bg-red-900 hover:text-red-300"
                          >
                            Annulla
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};