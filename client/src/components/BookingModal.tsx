import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ParkingPrivate } from '../types/parking';
import { BookingFormData, Booking } from '../types/booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { X, Calendar, Clock, Euro, CreditCard } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  parking: ParkingPrivate | null;
  onBookingSuccess: (booking: Booking) => void;
  existingBookings: Booking[];
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  parking,
  onBookingSuccess,
  existingBookings,
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState<BookingFormData>({
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  const [totalCost, setTotalCost] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);

  // Initialize form with current date/time
  useEffect(() => {
    if (isOpen && parking) {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      const formatTime = (date: Date) => date.toTimeString().slice(0, 5);

      setFormData({
        startDate: formatDate(now),
        startTime: formatTime(now),
        endDate: formatDate(oneHourLater),
        endTime: formatTime(oneHourLater),
      });
    }
  }, [isOpen, parking]);

  // Calculate cost when form data changes
  useEffect(() => {
    if (!parking || !formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      setTotalCost(0);
      setDuration(0);
      return;
    }

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    if (endDateTime <= startDateTime) {
      setTotalCost(0);
      setDuration(0);
      return;
    }

    const durationHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
    const cost = durationHours * parking.prezzo;

    setDuration(durationHours);
    setTotalCost(cost);
  }, [formData, parking]);

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const checkAvailability = (startDateTime: Date, endDateTime: Date) => {
    if (!parking) return false;

    // Check existing bookings for this parking spot
    const conflictingBookings = existingBookings.filter(booking => {
      if (booking.parkingId !== parking.id || booking.status === 'cancelled') {
        return false;
      }

      const bookingStart = new Date(booking.startDateTime);
      const bookingEnd = new Date(booking.endDateTime);

      // Check for any overlap
      return (
        (startDateTime >= bookingStart && startDateTime < bookingEnd) ||
        (endDateTime > bookingStart && endDateTime <= bookingEnd) ||
        (startDateTime <= bookingStart && endDateTime >= bookingEnd)
      );
    });

    return conflictingBookings.length === 0;
  };

  const isWithinOperatingHours = (startDateTime: Date, endDateTime: Date) => {
    if (!parking) return false;

    // For demo purposes, we'll do basic validation
    // In a real app, you'd parse the orariDisponibilita string properly
    const orari = parking.orariDisponibilita.toLowerCase();
    
    if (orari.includes('24/7') || orari.includes('24h')) {
      return true;
    }

    // Basic check for common patterns
    const startHour = startDateTime.getHours();
    const endHour = endDateTime.getHours();

    // If parking hours contain specific time ranges, validate them
    if (orari.includes('6:00') || orari.includes('06:00')) {
      return startHour >= 6 && endHour <= 22;
    }

    // Default validation - assume reasonable hours
    return startHour >= 6 && endHour <= 23;
  };

  const validateForm = () => {
    if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      toast({
        title: "Errore",
        description: "Seleziona data e ora di inizio e fine",
        variant: "destructive",
      });
      return false;
    }

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
    const now = new Date();

    if (startDateTime < now) {
      toast({
        title: "Errore",
        description: "Non puoi prenotare nel passato",
        variant: "destructive",
      });
      return false;
    }

    if (endDateTime <= startDateTime) {
      toast({
        title: "Errore",
        description: "L'ora di fine deve essere successiva a quella di inizio",
        variant: "destructive",
      });
      return false;
    }

    if (duration < 0.5) {
      toast({
        title: "Errore",
        description: "La prenotazione minima è di 30 minuti",
        variant: "destructive",
      });
      return false;
    }

    if (duration > 24) {
      toast({
        title: "Errore",
        description: "La prenotazione massima è di 24 ore",
        variant: "destructive",
      });
      return false;
    }

    if (!isWithinOperatingHours(startDateTime, endDateTime)) {
      toast({
        title: "Errore",
        description: "L'orario selezionato non è disponibile per questo parcheggio",
        variant: "destructive",
      });
      return false;
    }

    if (!checkAvailability(startDateTime, endDateTime)) {
      toast({
        title: "Parcheggio non disponibile",
        description: "Il parcheggio è già prenotato in questo orario. Seleziona un orario diverso.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleBooking = async () => {
    if (!validateForm() || !parking || !currentUser) return;

    setLoading(true);

    try {
      // Create booking object
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      const booking: Booking = {
        id: `booking_${Date.now()}`,
        userId: currentUser.uid,
        parkingId: parking.id,
        parkingName: parking.name,
        startDateTime,
        endDateTime,
        totalCost,
        status: 'pending',
        createdAt: new Date(),
      };

      // In a real app, this would create a Stripe payment intent
      // For demo purposes, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful payment
      const confirmedBooking: Booking = {
        ...booking,
        status: 'confirmed',
        paymentIntentId: `pi_${Date.now()}`,
      };

      onBookingSuccess(confirmedBooking);

      toast({
        title: "Prenotazione confermata!",
        description: `Il tuo parcheggio è stato prenotato per ${duration.toFixed(1)} ore`,
      });

      onClose();
      
      // Reset form
      setFormData({
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
      });

    } catch (error: any) {
      toast({
        title: "Errore nel pagamento",
        description: "Impossibile completare la prenotazione. Riprova.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !parking) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-park-surface border-gray-600 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-white text-xl font-semibold">
            Prenota Parcheggio
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Parking Info */}
          <div className="bg-park-card rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">{parking.name}</h3>
            <div className="flex items-center justify-between text-sm text-gray-300">
              <span className="flex items-center space-x-1">
                <Euro className="w-4 h-4" />
                <span>{parking.prezzo.toFixed(2)} €/ora</span>
              </span>
              <span>{parking.orariDisponibilita}</span>
            </div>
          </div>

          {/* Date and Time Selection */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-park-mint" />
                  <span>Data Inizio</span>
                </Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="bg-park-card border-gray-600 text-white"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-park-mint" />
                  <span>Ora Inizio</span>
                </Label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className="bg-park-card border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Data Fine</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="bg-park-card border-gray-600 text-white"
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Ora Fine</Label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="bg-park-card border-gray-600 text-white"
                />
              </div>
            </div>
          </div>

          {/* Cost Summary */}
          {totalCost > 0 && (
            <div className="bg-park-card rounded-lg p-4 border border-park-mint">
              <div className="flex items-center justify-between text-white mb-2">
                <span>Durata:</span>
                <span className="font-medium">{duration.toFixed(1)} ore</span>
              </div>
              <div className="flex items-center justify-between text-white mb-2">
                <span>Tariffa oraria:</span>
                <span className="font-medium">{parking.prezzo.toFixed(2)} €</span>
              </div>
              <hr className="border-gray-600 my-2" />
              <div className="flex items-center justify-between text-park-mint text-lg font-bold">
                <span>Totale:</span>
                <span>{totalCost.toFixed(2)} €</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-park-card text-white border-gray-600 hover:bg-gray-600"
              disabled={loading}
            >
              Annulla
            </Button>
            <Button
              onClick={handleBooking}
              className="flex-1 bg-park-mint text-park-dark hover:bg-opacity-90 flex items-center justify-center space-x-2"
              disabled={loading || totalCost <= 0}
            >
              <CreditCard className="w-4 h-4" />
              <span>{loading ? 'Elaborazione...' : `Paga ${totalCost.toFixed(2)} €`}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};