import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ParkingPrivate } from '../types/parking';
import { Booking } from '../types/booking';
import { Review } from '../types/review';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { X, User, Edit, Camera, MapPin, Calendar, Star, ChevronRight } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMyParkingsClick: () => void;
  onBookingHistoryClick: () => void;
  userParkings: ParkingPrivate[];
  userBookings: Booking[];
  userReviews: Review[];
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onMyParkingsClick,
  onBookingHistoryClick,
  userParkings,
  userBookings,
  userReviews,
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
  });

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile
    toast({
      title: "Profilo aggiornato",
      description: "Le modifiche sono state salvate con successo",
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAverageRating = () => {
    if (userReviews.length === 0) return 0;
    return userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length;
  };

  const getCompletedBookings = () => {
    return userBookings.filter(booking => booking.status === 'completed').length;
  };

  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-park-surface border-gray-600 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-white text-xl font-semibold">
            Profilo Utente
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
          {/* Profile Header */}
          <div className="bg-park-card rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" alt={currentUser.displayName || 'User'} />
                  <AvatarFallback className="bg-park-mint text-park-dark text-xl font-bold">
                    {getInitials(currentUser.displayName || currentUser.email)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-park-mint text-park-dark p-0 hover:bg-opacity-80"
                  onClick={() => toast({ title: "Funzionalità in arrivo", description: "Cambio foto profilo disponibile presto" })}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editForm.displayName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Nome completo"
                      className="bg-park-surface border-gray-600 text-white"
                    />
                    <Input
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Email"
                      className="bg-park-surface border-gray-600 text-white"
                      disabled
                    />
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={handleSaveProfile}
                        className="bg-park-mint text-park-dark hover:bg-opacity-80"
                      >
                        Salva
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        Annulla
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h2 className="text-white text-xl font-semibold">
                        {currentUser.displayName || 'Utente NinjaPark'}
                      </h2>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditForm({
                            displayName: currentUser.displayName || '',
                            email: currentUser.email || '',
                          });
                          setIsEditing(true);
                        }}
                        className="text-gray-400 hover:text-white p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-gray-400 mb-3">{currentUser.email}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-medium">
                          {getAverageRating().toFixed(1)}
                        </span>
                        <span className="text-gray-400">
                          ({userReviews.length} recensioni)
                        </span>
                      </div>
                      <Badge variant="outline" className="text-park-mint border-park-mint">
                        {getCompletedBookings()} prenotazioni completate
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-park-card border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-park-mint mb-1">
                  {userParkings.length}
                </div>
                <div className="text-sm text-gray-400">Parcheggi</div>
              </CardContent>
            </Card>
            <Card className="bg-park-card border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-park-mint mb-1">
                  {userBookings.length}
                </div>
                <div className="text-sm text-gray-400">Prenotazioni</div>
              </CardContent>
            </Card>
            <Card className="bg-park-card border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-park-mint mb-1">
                  {userReviews.length}
                </div>
                <div className="text-sm text-gray-400">Recensioni</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg">Gestione Account</h3>
            
            <button
              onClick={() => {
                onMyParkingsClick();
                onClose();
              }}
              className="w-full bg-park-card hover:bg-gray-600 transition-colors rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-park-mint bg-opacity-20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-park-mint" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">I Miei Parcheggi</div>
                  <div className="text-gray-400 text-sm">
                    Gestisci i tuoi {userParkings.length} parcheggi
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => {
                onBookingHistoryClick();
                onClose();
              }}
              className="w-full bg-park-card hover:bg-gray-600 transition-colors rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-park-mint bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-park-mint" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">Le Mie Prenotazioni</div>
                  <div className="text-gray-400 text-sm">
                    Cronologia di {userBookings.length} prenotazioni
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Recent Activity */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg">Attività Recente</h3>
            
            {userReviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-park-card rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">
                    {new Date(review.timestamp).toLocaleDateString('it-IT')}
                  </span>
                </div>
                <p className="text-white text-sm mb-2">{review.comment}</p>
                <p className="text-gray-400 text-xs">
                  Recensione per: {userParkings.find(p => p.id === review.parkingId)?.name || 'Parcheggio'}
                </p>
              </div>
            ))}

            {userReviews.length === 0 && (
              <div className="bg-park-card rounded-lg p-6 text-center">
                <Star className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">Nessuna recensione ancora</p>
                <p className="text-gray-500 text-sm">
                  Le tue recensioni appariranno qui
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};