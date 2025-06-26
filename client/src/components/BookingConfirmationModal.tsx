import React from 'react';
import { Booking } from '../types/booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, Calendar, Clock, Euro, MapPin, CreditCard } from 'lucide-react';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  if (!isOpen || !booking) return null;

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('it-IT', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (start: Date, end: Date) => {
    const duration = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60);
    return `${duration.toFixed(1)} ore`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-park-surface border-gray-600 max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-white text-2xl font-bold">
            Prenotazione Confermata!
          </CardTitle>
          <p className="text-gray-400 mt-2">
            La tua prenotazione è stata elaborata con successo
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Booking Details */}
          <div className="bg-park-card rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Dettagli Prenotazione</h3>
              <span className="text-park-mint text-sm font-medium">
                #{booking.id.slice(-8).toUpperCase()}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-park-mint flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">{booking.parkingName}</p>
                  <p className="text-gray-400 text-sm">Parcheggio privato</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-park-mint flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Inizio</p>
                  <p className="text-gray-400 text-sm">{formatDateTime(booking.startDateTime)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-park-mint flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Fine</p>
                  <p className="text-gray-400 text-sm">{formatDateTime(booking.endDateTime)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Euro className="w-5 h-5 text-park-mint flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Durata e Costo</p>
                  <p className="text-gray-400 text-sm">
                    {formatDuration(booking.startDateTime, booking.endDateTime)} • {booking.totalCost.toFixed(2)} €
                  </p>
                </div>
              </div>

              {booking.paymentIntentId && (
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-park-mint flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Pagamento</p>
                    <p className="text-gray-400 text-sm">
                      Elaborato con successo • {booking.paymentIntentId.slice(-8)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="bg-green-900 bg-opacity-50 border border-green-500 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-green-400 font-medium">Prenotazione Attiva</p>
                <p className="text-green-300 text-sm">
                  Riceverai una notifica prima dell'inizio
                </p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-park-card rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">Note Importanti</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="text-park-mint mt-1">•</span>
                <span>Arrivi entro 15 minuti dall'orario prenotato</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-park-mint mt-1">•</span>
                <span>Puoi annullare fino a 1 ora prima dell'inizio</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-park-mint mt-1">•</span>
                <span>Controlla "Le Mie Prenotazioni" per i dettagli</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <Button
            onClick={onClose}
            className="w-full bg-park-mint text-park-dark py-4 rounded-xl font-medium text-lg hover:bg-opacity-90"
          >
            Perfetto, Grazie!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};