import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { X, MapPin, Car, Clock } from 'lucide-react';
import { publicParkingService } from '../lib/publicParkingService';
import { notificationService } from '../lib/notificationService';

interface ParkingReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: { lat: number; lng: number } | null;
  onReportSuccess: () => void;
}

export const ParkingReportModal: React.FC<ParkingReportModalProps> = ({
  isOpen,
  onClose,
  userLocation,
  onReportSuccess,
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<'blue' | 'white' | null>(null);
  const [isReporting, setIsReporting] = useState(false);

  if (!isOpen) return null;

  const handleReport = async () => {
    if (!currentUser || !userLocation || !selectedType) {
      toast({
        title: "Errore",
        description: "Seleziona il tipo di parcheggio e assicurati che la posizione sia disponibile",
        variant: "destructive",
      });
      return;
    }

    setIsReporting(true);

    try {
      const spotId = await publicParkingService.reportLeavingParking(
        currentUser.uid,
        userLocation.lat,
        userLocation.lng,
        selectedType
      );

      // Try to send notifications to nearby users (fallback if service not available)
      try {
        await notificationService.sendParkingAvailableNotification(
          userLocation.lat,
          userLocation.lng,
          selectedType
        );
      } catch (notificationError) {
        console.log('Notification service not available, continuing without notifications');
      }

      toast({
        title: "Segnalazione Inviata! 🎉",
        description: "Grazie per aver segnalato il parcheggio disponibile. Altri utenti nelle vicinanze riceveranno una notifica.",
      });

      onReportSuccess();
      onClose();
      setSelectedType(null);
    } catch (error) {
      console.error('Error reporting parking:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la segnalazione",
        variant: "destructive",
      });
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-park-surface border-park-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-montserrat text-white">
            Sto Andando Via
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

        <CardContent className="space-y-6">
          <div className="text-center">
            <Car className="w-12 h-12 text-park-mint mx-auto mb-3" />
            <p className="text-gray-300 text-sm">
              Stai liberando un parcheggio? Aiuta altri utenti segnalando la disponibilità!
            </p>
          </div>

          {userLocation && (
            <div className="bg-park-card rounded-lg p-3">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-park-mint" />
                <span>Posizione: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-white font-medium">Tipo di parcheggio:</label>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedType('blue')}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  selectedType === 'blue'
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-gray-600 bg-park-card text-gray-300 hover:border-blue-400'
                }`}
              >
                <div className="w-8 h-8 bg-blue-500 rounded mx-auto mb-2"></div>
                <div className="font-medium">Strisce Blu</div>
                <div className="text-xs opacity-75">A pagamento</div>
              </button>

              <button
                onClick={() => setSelectedType('white')}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  selectedType === 'white'
                    ? 'border-gray-300 bg-gray-300/20 text-gray-200'
                    : 'border-gray-600 bg-park-card text-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="w-8 h-8 bg-white rounded mx-auto mb-2"></div>
                <div className="font-medium">Strisce Bianche</div>
                <div className="text-xs opacity-75">Gratuito</div>
              </button>
            </div>
          </div>

          <div className="bg-park-mint/10 border border-park-mint/30 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-park-mint mt-0.5" />
              <div className="text-xs text-park-mint">
                <strong>Info:</strong> Il parcheggio sarà visibile come disponibile (verde) per 10 minuti, 
                poi diventerà incerto (grigio) finché qualcuno non conferma di averlo preso.
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Annulla
            </Button>
            <Button
              onClick={handleReport}
              disabled={!selectedType || isReporting}
              className="flex-1 bg-park-mint text-park-dark hover:bg-park-mint/90"
            >
              {isReporting ? 'Segnalando...' : 'Segnala Disponibilità'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};