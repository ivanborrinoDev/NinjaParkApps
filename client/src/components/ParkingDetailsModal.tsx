import React from 'react';
import { ParkingPrivate } from '../types/parking';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Shield, Video, Car, Heart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';

interface ParkingDetailsModalProps {
  parking: ParkingPrivate | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (parking: ParkingPrivate) => void;
}

export const ParkingDetailsModal: React.FC<ParkingDetailsModalProps> = ({
  parking,
  isOpen,
  onClose,
  onBook,
}) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  
  if (!isOpen || !parking) return null;

  const defaultImage = "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
  const isCurrentlyFavorite = isFavorite(parking.id);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-park-surface rounded-t-3xl shadow-2xl">
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
        </div>
        
        <div className="px-6 pb-6">
          {/* Parking Image */}
          <div 
            className="w-full h-48 rounded-xl mb-4 bg-cover bg-center"
            style={{
              backgroundImage: `url(${parking.fotoURL || defaultImage})`
            }}
          />
          
          {/* Parking Info */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-montserrat font-bold text-white">
                  {parking.name}
                </h3>
                <button
                  onClick={() => toggleFavorite(parking.id)}
                  className="p-2 rounded-full hover:bg-park-card transition-colors"
                >
                  <Heart 
                    className={`w-6 h-6 ${
                      isCurrentlyFavorite 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-park-mint" />
                  <span className="text-sm">0.2 mi away</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">4.8 (124 reviews)</span>
                </div>
              </div>
            </div>
            
            {/* Price */}
            <Card className="bg-park-card border-gray-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Hourly Rate</p>
                    <p className="text-2xl font-bold text-park-mint">
                      ${parking.prezzo.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Available</p>
                    <p className="text-white font-medium">24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Features */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-park-card rounded-lg p-3 text-center border border-gray-600">
                <Shield className="w-6 h-6 text-park-mint mb-2 mx-auto" />
                <p className="text-xs text-gray-300">Secure</p>
              </div>
              <div className="bg-park-card rounded-lg p-3 text-center border border-gray-600">
                <Video className="w-6 h-6 text-park-mint mb-2 mx-auto" />
                <p className="text-xs text-gray-300">CCTV</p>
              </div>
              <div className="bg-park-card rounded-lg p-3 text-center border border-gray-600">
                <Car className="w-6 h-6 text-park-mint mb-2 mx-auto" />
                <p className="text-xs text-gray-300">Covered</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 bg-park-card text-white border-gray-600 py-4 rounded-xl font-medium hover:bg-gray-600"
              >
                Close
              </Button>
              <Button
                onClick={() => onBook(parking)}
                className="flex-1 bg-park-mint text-park-dark py-4 rounded-xl font-medium hover:bg-opacity-90 transition-colors"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
