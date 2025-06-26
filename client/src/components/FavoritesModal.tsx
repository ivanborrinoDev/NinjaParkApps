
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, MapPin, Heart, Star } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { ParkingPrivate } from '../types/parking';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  parkings: ParkingPrivate[];
  onParkingSelect: (parking: ParkingPrivate) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  parkings,
  onParkingSelect,
}) => {
  const { favorites, toggleFavorite } = useFavorites();

  if (!isOpen) return null;

  const favoriteParkings = parkings.filter(parking => 
    favorites.some(fav => fav.parkingId === parking.id)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-park-surface rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-montserrat font-bold text-white">
              Parcheggi Preferiti
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-park-card rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {favoriteParkings.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                Nessun preferito ancora
              </h3>
              <p className="text-gray-500">
                Aggiungi parcheggi ai preferiti toccando il cuore ❤️
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteParkings.map((parking) => (
                <Card key={parking.id} className="bg-park-card border-gray-600 hover:border-park-mint transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div 
                        className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0"
                        style={{
                          backgroundImage: `url(${parking.fotoURL || 'https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'})`
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-white mb-1">
                              {parking.name}
                            </h3>
                            <div className="flex items-center space-x-3 text-sm text-gray-400 mb-2">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>0.2 mi away</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400" />
                                <span>4.8</span>
                              </div>
                            </div>
                            <p className="text-lg font-bold text-park-mint">
                              ${parking.prezzo.toFixed(2)}/ora
                            </p>
                          </div>
                          <button
                            onClick={() => toggleFavorite(parking.id)}
                            className="p-1 rounded-full hover:bg-park-surface transition-colors"
                          >
                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                          </button>
                        </div>
                        <Button
                          onClick={() => {
                            onParkingSelect(parking);
                            onClose();
                          }}
                          className="w-full mt-3 bg-park-mint text-park-dark hover:bg-opacity-90"
                          size="sm"
                        >
                          Visualizza sulla mappa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
