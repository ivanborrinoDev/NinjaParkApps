import React, { useState, useEffect } from 'react';
import { ParkingPrivate } from '../types/parking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { X, MapPin, Euro, Clock, Accessibility } from 'lucide-react';

interface EditParkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  parking: ParkingPrivate | null;
  onUpdate: (parkingId: string, updates: Partial<ParkingPrivate>) => void;
}

export const EditParkingModal: React.FC<EditParkingModalProps> = ({
  isOpen,
  onClose,
  parking,
  onUpdate,
}) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    prezzo: '',
    orariDisponibilita: '',
    accessibileDisabili: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (parking && isOpen) {
      setFormData({
        name: parking.name,
        prezzo: parking.prezzo.toString(),
        orariDisponibilita: parking.orariDisponibilita,
        accessibileDisabili: parking.accessibileDisabili,
      });
    }
  }, [parking, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Errore",
        description: "Il nome del parcheggio è obbligatorio",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.prezzo || parseFloat(formData.prezzo) <= 0) {
      toast({
        title: "Errore",
        description: "Inserisci un prezzo valido",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.orariDisponibilita.trim()) {
      toast({
        title: "Errore",
        description: "Gli orari di disponibilità sono obbligatori",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !parking) return;

    setLoading(true);

    try {
      const updates: Partial<ParkingPrivate> = {
        name: formData.name.trim(),
        prezzo: parseFloat(formData.prezzo),
        orariDisponibilita: formData.orariDisponibilita.trim(),
        accessibileDisabili: formData.accessibileDisabili,
      };

      onUpdate(parking.id, updates);

      toast({
        title: "Parcheggio aggiornato!",
        description: "Le modifiche sono state salvate con successo.",
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il parcheggio. Riprova.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !parking) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-park-surface border-gray-600 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-white text-xl font-semibold">
            Modifica Parcheggio
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome Parcheggio */}
            <div className="space-y-2">
              <Label className="text-white flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-park-mint" />
                <span>Nome Parcheggio *</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="es. Garage Via Roma"
                className="bg-park-card border-gray-600 text-white placeholder-gray-400"
                maxLength={50}
              />
            </div>

            {/* Prezzo */}
            <div className="space-y-2">
              <Label className="text-white flex items-center space-x-2">
                <Euro className="w-4 h-4 text-park-mint" />
                <span>Prezzo Orario (€) *</span>
              </Label>
              <Input
                type="number"
                step="0.50"
                min="0.50"
                max="100"
                value={formData.prezzo}
                onChange={(e) => handleInputChange('prezzo', e.target.value)}
                placeholder="es. 2.50"
                className="bg-park-card border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            {/* Orari Disponibilità */}
            <div className="space-y-2">
              <Label className="text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-park-mint" />
                <span>Orari di Disponibilità *</span>
              </Label>
              <Textarea
                value={formData.orariDisponibilita}
                onChange={(e) => handleInputChange('orariDisponibilita', e.target.value)}
                placeholder="es. Lun-Ven 8:00-20:00, Sab 9:00-18:00"
                className="bg-park-card border-gray-600 text-white placeholder-gray-400 resize-none"
                rows={3}
                maxLength={200}
              />
            </div>

            {/* Accessibilità */}
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.accessibileDisabili}
                onCheckedChange={(checked) => handleInputChange('accessibileDisabili', checked)}
                className="border-gray-600"
              />
              <Label className="text-white flex items-center space-x-2">
                <Accessibility className="w-4 h-4 text-park-mint" />
                <span>Accessibile a disabili</span>
              </Label>
            </div>

            {/* Info Note */}
            <div className="bg-park-card rounded-lg p-4">
              <p className="text-gray-400 text-sm">
                <strong className="text-white">Nota:</strong> Le modifiche alla posizione e alle foto 
                non sono disponibili in questa versione. Contatta il supporto se necessario.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-park-card text-white border-gray-600 hover:bg-gray-600"
                disabled={loading}
              >
                Annulla
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-park-mint text-park-dark hover:bg-opacity-90"
                disabled={loading}
              >
                {loading ? 'Salvataggio...' : 'Salva Modifiche'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};