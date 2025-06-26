import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ParkingPrivate, UserLocation } from '../types/parking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { X, MapPin, Euro, Clock, Camera, Accessibility } from 'lucide-react';

interface AddParkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (parking: Omit<ParkingPrivate, 'id'>) => void;
  userLocation: UserLocation | null;
}

export const AddParkingModal: React.FC<AddParkingModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  userLocation,
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    prezzo: '',
    orariDisponibilita: '',
    accessibileDisabili: false,
    useCurrentLocation: true,
    customLat: '',
    customLng: '',
    foto1: null as File | null,
    foto2: null as File | null,
    foto3: null as File | null,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Errore",
        description: "La foto deve essere inferiore a 5MB",
        variant: "destructive",
      });
      return;
    }
    setFormData(prev => ({ ...prev, [field]: file }));
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

    if (!formData.useCurrentLocation) {
      if (!formData.customLat || !formData.customLng) {
        toast({
          title: "Errore",
          description: "Inserisci le coordinate se non usi la posizione attuale",
          variant: "destructive",
        });
        return false;
      }
    } else if (!userLocation) {
      toast({
        title: "Errore",
        description: "Posizione non disponibile. Inserisci le coordinate manualmente.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.foto1) {
      toast({
        title: "Errore",
        description: "È obbligatoria almeno una foto del parcheggio",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!currentUser) return;

    setLoading(true);

    try {
      // Simulate photo upload (in real app, upload to storage service)
      const fotoURL = formData.foto1 ? `https://images.unsplash.com/photo-${Date.now()}?auto=format&fit=crop&w=800&h=600` : undefined;
      const foto2URL = formData.foto2 ? `https://images.unsplash.com/photo-${Date.now() + 1}?auto=format&fit=crop&w=800&h=600` : undefined;
      const foto3URL = formData.foto3 ? `https://images.unsplash.com/photo-${Date.now() + 2}?auto=format&fit=crop&w=800&h=600` : undefined;

      const newParkingData: Omit<ParkingPrivate, 'id'> = {
        ownerId: currentUser.uid,
        name: formData.name.trim(),
        lat: formData.useCurrentLocation ? userLocation!.lat : parseFloat(formData.customLat),
        lng: formData.useCurrentLocation ? userLocation!.lng : parseFloat(formData.customLng),
        fotoURL,
        foto2URL,
        foto3URL,
        prezzo: parseFloat(formData.prezzo),
        orariDisponibilita: formData.orariDisponibilita.trim(),
        accessibileDisabili: formData.accessibileDisabili,
        isActive: true,
        createdAt: new Date(),
      };

      onAdd(newParkingData);

      toast({
        title: "Parcheggio aggiunto!",
        description: "Il tuo parcheggio privato è stato aggiunto con successo.",
      });

      // Reset form
      setFormData({
        name: '',
        prezzo: '',
        orariDisponibilita: '',
        accessibileDisabili: false,
        useCurrentLocation: true,
        customLat: '',
        customLng: '',
        foto1: null,
        foto2: null,
        foto3: null,
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Errore",
        description: "Impossibile aggiungere il parcheggio. Riprova.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-park-surface border-gray-600 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-white text-xl font-semibold">
            Aggiungi Parcheggio Privato
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

            {/* Posizione */}
            <div className="space-y-3">
              <Label className="text-white">Posizione</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.useCurrentLocation}
                  onCheckedChange={(checked) => handleInputChange('useCurrentLocation', checked)}
                  className="border-gray-600"
                />
                <span className="text-white text-sm">
                  Usa posizione attuale {userLocation && `(${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})`}
                </span>
              </div>
              
              {!formData.useCurrentLocation && (
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    step="any"
                    value={formData.customLat}
                    onChange={(e) => handleInputChange('customLat', e.target.value)}
                    placeholder="Latitudine"
                    className="bg-park-card border-gray-600 text-white placeholder-gray-400"
                  />
                  <Input
                    type="number"
                    step="any"
                    value={formData.customLng}
                    onChange={(e) => handleInputChange('customLng', e.target.value)}
                    placeholder="Longitudine"
                    className="bg-park-card border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              )}
            </div>

            {/* Foto */}
            <div className="space-y-3">
              <Label className="text-white flex items-center space-x-2">
                <Camera className="w-4 h-4 text-park-mint" />
                <span>Foto del Parcheggio (max 3) *</span>
              </Label>
              
              {[1, 2, 3].map((num) => (
                <div key={num} className="space-y-2">
                  <Label className="text-gray-300 text-sm">
                    Foto {num} {num === 1 && '(obbligatoria)'}
                  </Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(`foto${num}`, e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-park-mint file:text-park-dark hover:file:bg-opacity-80"
                  />
                  {formData[`foto${num}` as keyof typeof formData] && (
                    <p className="text-xs text-park-mint">
                      ✓ {(formData[`foto${num}` as keyof typeof formData] as File)?.name}
                    </p>
                  )}
                </div>
              ))}
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
                {loading ? 'Salvataggio...' : 'Salva Parcheggio'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};