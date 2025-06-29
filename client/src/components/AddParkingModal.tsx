import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AddParkingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const weekDays = [
  { id: "monday", label: "Lunedì" },
  { id: "tuesday", label: "Martedì" },
  { id: "wednesday", label: "Mercoledì" },
  { id: "thursday", label: "Giovedì" },
  { id: "friday", label: "Venerdì" },
  { id: "saturday", label: "Sabato" },
  { id: "sunday", label: "Domenica" },
];

export function AddParkingModal({ isOpen, onClose }: AddParkingModalProps) {
  const { user } = useAuth();
  const { userLocation } = useApp();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerHour: "",
    pricePerWeek: "",
    dynamicPricing: false,
    peakHourMultiplier: "1.5",
    latitude: userLocation?.lat.toString() || "",
    longitude: userLocation?.lng.toString() || "",
    address: "",
    availabilityDays: [] as string[],
    availabilityStartTime: "08:00",
    availabilityEndTime: "20:00",
    isAccessible: false,
    features: [] as string[],
    imageUrls: [] as string[],
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const availableFeatures = [
    "Coperto", "Videosorveglianza", "Illuminato", "Custodito", 
    "Ricarica elettrica", "Sicuro", "Vicino metro", "Centro città"
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per aggiungere un parcheggio.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.pricePerHour || !formData.address || formData.availabilityDays.length === 0) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi obbligatori.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/parking-spots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          address: formData.address,
          latitude: formData.latitude,
          longitude: formData.longitude,
          pricePerHour: formData.pricePerHour,
          features: selectedFeatures,
          imageUrls: formData.imageUrls,
          hostId: user.id,
          availabilityDays: formData.availabilityDays,
          availabilityStartTime: formData.availabilityStartTime,
          availabilityEndTime: formData.availabilityEndTime,
          isAccessible: formData.isAccessible,
          isAvailable: true,
        }),
      });

      if (response.ok) {
        toast({
          title: "Successo!",
          description: "Parcheggio aggiunto con successo.",
        });
        onClose();
        // Reset form
        setFormData({
          name: "",
          description: "",
          pricePerHour: "",
          latitude: userLocation?.lat.toString() || "",
          longitude: userLocation?.lng.toString() || "",
          address: "",
          availabilityDays: [],
          availabilityStartTime: "08:00",
          availabilityEndTime: "20:00",
          isAccessible: false,
          features: [],
          imageUrls: [],
        });
        setSelectedFeatures([]);
      } else {
        throw new Error("Errore durante il salvataggio");
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile salvare il parcheggio. Riprova.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (dayId: string) => {
    setFormData(prev => ({
      ...prev,
      availabilityDays: prev.availabilityDays.includes(dayId)
        ? prev.availabilityDays.filter(d => d !== dayId)
        : [...prev.availabilityDays, dayId]
    }));
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
          toast({
            title: "Posizione aggiornata",
            description: "Posizione corrente impostata.",
          });
        },
        () => {
          toast({
            title: "Errore",
            description: "Impossibile ottenere la posizione.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
          <h2 className="text-xl font-semibold text-white">Aggiungi Parcheggio</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6 h-full overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome Parcheggio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome Parcheggio *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ninja-mint"
                placeholder="es. Garage Centro Città"
                required
              />
            </div>

            {/* Descrizione */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrizione
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ninja-mint h-24"
                placeholder="Descrivi il tuo parcheggio..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Foto Parcheggio
              </label>
              <div className="space-y-3">
                {imagePreview && (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview("");
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-600 border-dashed rounded-xl cursor-pointer hover:border-ninja-mint transition-colors">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xs text-gray-400">Carica foto</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prezzo Orario (€) *
                </label>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  value={formData.pricePerHour}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerHour: e.target.value }))}
                  className="w-full px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ninja-mint"
                  placeholder="5.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prezzo Settimanale (€)
                </label>
                <input
                  type="number"
                  step="5.00"
                  min="0"
                  value={formData.pricePerWeek}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerWeek: e.target.value }))}
                  className="w-full px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ninja-mint"
                  placeholder="150.00"
                />
              </div>
            </div>

            {/* Dynamic Pricing */}
            <div className="bg-ninja-gray-light rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-white font-medium">Prezzi Dinamici</label>
                <input
                  type="checkbox"
                  checked={formData.dynamicPricing}
                  onChange={(e) => setFormData(prev => ({ ...prev, dynamicPricing: e.target.checked }))}
                  className="w-5 h-5 text-ninja-mint bg-ninja-gray-light border-gray-600 rounded focus:ring-ninja-mint focus:ring-2"
                />
              </div>
              <p className="text-gray-400 text-sm mb-3">Aumenta automaticamente i prezzi durante le ore di punta</p>
              {formData.dynamicPricing && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Moltiplicatore Ore di Punta
                  </label>
                  <select
                    value={formData.peakHourMultiplier}
                    onChange={(e) => setFormData(prev => ({ ...prev, peakHourMultiplier: e.target.value }))}
                    className="w-full px-4 py-3 bg-ninja-gray border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ninja-mint"
                  >
                    <option value="1.25">1.25x (+25%)</option>
                    <option value="1.5">1.5x (+50%)</option>
                    <option value="1.75">1.75x (+75%)</option>
                    <option value="2">2x (+100%)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Indirizzo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Indirizzo *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ninja-mint"
                placeholder="Via Roma 123, Milano"
                required
              />
            </div>

            {/* Posizione */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Posizione
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                  className="px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ninja-mint"
                  placeholder="Latitudine"
                />
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                  className="px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ninja-mint"
                  placeholder="Longitudine"
                />
              </div>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="mt-2 text-ninja-mint hover:text-ninja-mint-dark text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Usa posizione corrente
              </button>
            </div>

            {/* Giorni Disponibilità */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Giorni di Disponibilità *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {weekDays.map((day) => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.availabilityDays.includes(day.id)
                        ? "bg-ninja-mint text-white"
                        : "bg-ninja-gray-light text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orari */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Orario Inizio
                </label>
                <input
                  type="time"
                  value={formData.availabilityStartTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, availabilityStartTime: e.target.value }))}
                  className="w-full px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ninja-mint"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Orario Fine
                </label>
                <input
                  type="time"
                  value={formData.availabilityEndTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, availabilityEndTime: e.target.value }))}
                  className="w-full px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ninja-mint"
                />
              </div>
            </div>

            {/* Caratteristiche */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Caratteristiche
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableFeatures.map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedFeatures.includes(feature)
                        ? "bg-ninja-mint text-white"
                        : "bg-ninja-gray-light text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessibilità */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="accessible"
                checked={formData.isAccessible}
                onChange={(e) => setFormData(prev => ({ ...prev, isAccessible: e.target.checked }))}
                className="w-5 h-5 text-ninja-mint bg-ninja-gray-light border-gray-600 rounded focus:ring-ninja-mint focus:ring-2"
              />
              <label htmlFor="accessible" className="text-gray-300 font-medium">
                Accessibile a persone con disabilità
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ninja-mint hover:bg-ninja-mint-dark text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {loading ? "Salvando..." : "Salva Parcheggio"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}