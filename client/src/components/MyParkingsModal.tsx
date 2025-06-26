import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ParkingPrivate } from '../types/parking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { X, MapPin, Euro, Clock, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface MyParkingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  parkings: ParkingPrivate[];
  onUpdate: (parkingId: string, updates: Partial<ParkingPrivate>) => void;
  onDelete: (parkingId: string) => void;
  onEdit?: (parking: ParkingPrivate) => void;
}

export const MyParkingsModal: React.FC<MyParkingsModalProps> = ({
  isOpen,
  onClose,
  parkings,
  onUpdate,
  onDelete,
  onEdit,
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const myParkings = parkings.filter(p => p.ownerId === currentUser?.uid);

  const handleToggleActive = (parking: ParkingPrivate) => {
    onUpdate(parking.id, { isActive: !parking.isActive });
    toast({
      title: parking.isActive ? "Parcheggio nascosto" : "Parcheggio pubblicato",
      description: parking.isActive 
        ? "Il parcheggio non sarà più visibile agli altri utenti"
        : "Il parcheggio è ora visibile agli altri utenti",
    });
  };

  const handleDelete = async (parkingId: string, parkingName: string) => {
    if (deletingId) return;
    
    if (!confirm(`Sei sicuro di voler eliminare "${parkingName}"? Questa azione non può essere annullata.`)) {
      return;
    }

    setDeletingId(parkingId);
    try {
      onDelete(parkingId);
      toast({
        title: "Parcheggio eliminato",
        description: "Il parcheggio è stato eliminato definitivamente.",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile eliminare il parcheggio. Riprova.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-park-surface border-gray-600 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-white text-xl font-semibold">
            I Miei Parcheggi ({myParkings.length})
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
          {myParkings.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-park-card rounded-full mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-park-mint" />
              </div>
              <h3 className="text-white text-lg font-medium mb-2">
                Nessun parcheggio aggiunto
              </h3>
              <p className="text-gray-400 mb-4">
                Aggiungi il tuo primo parcheggio privato per iniziare a guadagnare
              </p>
              <Button
                onClick={onClose}
                className="bg-park-mint text-park-dark hover:bg-opacity-90"
              >
                Aggiungi Parcheggio
              </Button>
            </div>
          ) : (
            myParkings.map((parking) => (
              <Card
                key={parking.id}
                className={`bg-park-card border-gray-600 ${!parking.isActive ? 'opacity-60' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Photo */}
                    <div
                      className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{
                        backgroundImage: `url(${parking.fotoURL || 'https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200'})`
                      }}
                    />
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-white font-medium truncate">
                            {parking.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-300 mt-1">
                            <span className="flex items-center space-x-1">
                              <Euro className="w-3 h-3" />
                              <span>{parking.prezzo.toFixed(2)}/h</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{parking.orariDisponibilita.length > 20 
                                ? parking.orariDisponibilita.substring(0, 20) + '...' 
                                : parking.orariDisponibilita}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              parking.isActive 
                                ? 'bg-green-900 text-green-300' 
                                : 'bg-gray-600 text-gray-300'
                            }`}>
                              {parking.isActive ? 'Attivo' : 'Nascosto'}
                            </span>
                            {parking.accessibileDisabili && (
                              <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded-full text-xs font-medium">
                                Accessibile
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-600">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(parking)}
                        className="text-gray-300 border-gray-600 hover:bg-gray-600"
                      >
                        {parking.isActive ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-1" />
                            Nascondi
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            Pubblica
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-300 border-gray-600 hover:bg-gray-600"
                        onClick={() => onEdit?.(parking)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Modifica
                      </Button>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(parking.id, parking.name)}
                      disabled={deletingId === parking.id}
                      className="text-red-400 border-red-600 hover:bg-red-900 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      {deletingId === parking.id ? 'Eliminando...' : 'Elimina'}
                    </Button>
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