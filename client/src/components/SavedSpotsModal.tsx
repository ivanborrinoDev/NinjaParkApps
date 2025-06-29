
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SavedSpotsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock saved spots data
const mockSavedSpots = [
  {
    id: 1,
    name: "Downtown Secure Parking",
    address: "123 Main Street, Downtown",
    pricePerHour: 5.50,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    distance: "0.3 km",
    features: ["Secure", "Covered", "24/7 Security"]
  },
  {
    id: 2,
    name: "City Hall Parking",
    address: "Downtown Plaza",
    pricePerHour: 3.50,
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    distance: "0.8 km",
    features: ["Security", "24/7"]
  }
];

export function SavedSpotsModal({ isOpen, onClose }: SavedSpotsModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedSpots, setSavedSpots] = useState(mockSavedSpots);

  if (!isOpen) return null;

  const removeSavedSpot = (spotId: number) => {
    setSavedSpots(prev => prev.filter(spot => spot.id !== spotId));
    toast({
      title: "Rimosso dai preferiti",
      description: "Il parcheggio è stato rimosso dalla lista dei preferiti.",
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-ninja-gray shadow-2xl border-l border-gray-600 transform translate-x-0 transition-transform duration-300">
        {/* Header */}
        <div className="bg-ninja-gray-light px-6 py-4 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Saved Spots</h2>
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
          {savedSpots.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p>No saved spots yet</p>
              <p className="text-sm mt-1">Save your favorite parking spots for quick access</p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedSpots.map((spot) => (
                <div key={spot.id} className="bg-ninja-gray-light rounded-xl overflow-hidden">
                  <img 
                    src={spot.imageUrl} 
                    alt={spot.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-semibold">{spot.name}</h3>
                        <p className="text-gray-400 text-sm">{spot.address}</p>
                        <p className="text-gray-400 text-sm">{spot.distance} away</p>
                      </div>
                      <button
                        onClick={() => removeSavedSpot(spot.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-ninja-mint font-semibold">€{spot.pricePerHour}/ora</span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-gray-300 text-sm">{spot.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {spot.features.map((feature, index) => (
                        <span key={index} className="bg-ninja-mint/20 text-ninja-mint px-2 py-1 rounded-lg text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <button className="w-full bg-ninja-mint hover:bg-ninja-mint-dark text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
