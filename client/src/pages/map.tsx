import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleMaps } from '../components/GoogleMaps';
import { ParkingDetailsModal } from '../components/ParkingDetailsModal';
import { ProfileDropdown } from '../components/ProfileDropdown';
import { ParkingReportModal } from '../components/ParkingReportModal';
import { UserBadgesModal } from '../components/UserBadgesModal';
import { AddParkingModal } from '../components/AddParkingModal';
import { NotificationsModal } from '../components/NotificationsModal';
import { SettingsModal } from '../components/SettingsModal';
import { MyParkingsModal } from '../components/MyParkingsModal';
import { BookingModal } from '../components/BookingModal';
import { BookingHistoryModal } from '../components/BookingHistoryModal';
import { BookingConfirmationModal } from '../components/BookingConfirmationModal';
import { ProfileModal } from '../components/ProfileModal';
import { ReviewModal } from '../components/ReviewModal';
import { EditParkingModal } from '../components/EditParkingModal';
import { FavoritesModal } from '../components/FavoritesModal';
import { ParkingPrivate, UserLocation } from '../types/parking';
import { PublicParkingSpot } from '../types/publicParking';
import { Booking } from '../types/booking';
import { Review } from '../types/review';
import { publicParkingService } from '../lib/publicParkingService';
import { useLocation } from 'wouter';
import { Car, User, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { notificationService } from '../lib/notificationService';

// Sample parking data for Modena demo
const sampleParkings: ParkingPrivate[] = [
  {
    id: "1",
    ownerId: "user123",
    name: "Garage Centro Storico",
    lat: 44.6450,
    lng: 10.9200,
    fotoURL: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    prezzo: 2.50,
    orariDisponibilita: "24/7",
    accessibileDisabili: true,
    isActive: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: "2",
    ownerId: "user456",
    name: "Parcheggio Via Farini",
    lat: 44.6485,
    lng: 10.9280,
    fotoURL: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    prezzo: 1.80,
    orariDisponibilita: "Lun-Ven 08:00-20:00",
    accessibileDisabili: false,
    isActive: true,
    createdAt: new Date('2024-01-20')
  },
  {
    id: "3",
    ownerId: "user789",
    name: "Box Via Emilia",
    lat: 44.6471,
    lng: 10.9252,
    fotoURL: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    foto2URL: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    prezzo: 3.00,
    orariDisponibilita: "24/7",
    accessibileDisabili: true,
    isActive: true,
    createdAt: new Date('2024-02-01')
  },
  {
    id: "4",
    ownerId: "user101",
    name: "Parcheggio Ganaceto",
    lat: 44.6420,
    lng: 10.9180,
    fotoURL: "https://images.unsplash.com/photo-1566026419536-3ad863bafaba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    prezzo: 1.50,
    orariDisponibilita: "Lun-Dom 07:00-22:00",
    accessibileDisabili: false,
    isActive: true,
    createdAt: new Date('2024-02-10')
  },
  {
    id: "5",
    ownerId: "user202",
    name: "Garage Via Canalgrande",
    lat: 44.6490,
    lng: 10.9320,
    fotoURL: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    foto2URL: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    foto3URL: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    prezzo: 2.20,
    orariDisponibilita: "24/7",
    accessibileDisabili: true,
    isActive: true,
    createdAt: new Date('2024-02-15')
  }
];

export default function MapPage() {
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [privateParkings, setPrivateParkings] = useState<ParkingPrivate[]>([]);
  const [selectedParking, setSelectedParking] = useState<ParkingPrivate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddParkingOpen, setIsAddParkingOpen] = useState(false);
  const [isMyParkingsOpen, setIsMyParkingsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBookingHistoryOpen, setIsBookingHistoryOpen] = useState(false);
  const [isBookingConfirmationOpen, setIsBookingConfirmationOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isEditParkingOpen, setIsEditParkingOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isParkingReportOpen, setIsParkingReportOpen] = useState(false);
  const [isUserBadgesOpen, setIsUserBadgesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [publicParkingSpots, setPublicParkingSpots] = useState<PublicParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [selectedParkingForEdit, setSelectedParkingForEdit] = useState<ParkingPrivate | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!currentUser) {
      setLocation('/login');
    }
  }, [currentUser, setLocation]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log('Geolocation timeout, using Modena fallback');
        setUserLocation({ lat: 44.6471, lng: 10.9252 });
        toast({
          title: "Posizione Predefinita",
          description: "Utilizzo Modena come posizione predefinita.",
        });
      }, 5000); // 5 second timeout

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          clearTimeout(timeoutId);
          console.error('Error getting location:', error);
          // Fallback to Modena coordinates
          setUserLocation({ lat: 44.6471, lng: 10.9252 });
          toast({
            title: "Errore Posizione",
            description: "Uso posizione predefinita Modena. Abilita i servizi di localizzazione per una migliore esperienza.",
            variant: "destructive",
          });
        },
        {
          timeout: 10000, // 10 second timeout
          enableHighAccuracy: false,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      setUserLocation({ lat: 44.6471, lng: 10.9252 });
    }
  }, [toast]);

  // Load sample parking data
  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      // Initialize notifications
      notificationService.initialize();
      
      // Simulate loading delay
      setTimeout(() => {
        setPrivateParkings(sampleParkings);
        // Load initial public parking spots
        setPublicParkingSpots(publicParkingService.getActiveSpots());
        setLoading(false);
      }, 500);

      // Set up periodic refresh of public parking spots
      const interval = setInterval(() => {
        setPublicParkingSpots(publicParkingService.getActiveSpots());
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Load Google Maps script (demo version without API key)
  useEffect(() => {
    if (window.google) return;

    // For demo purposes, we'll show a message about Google Maps integration
    console.log('Google Maps integration ready - add VITE_GOOGLE_MAPS_API_KEY for full functionality');
  }, []);

  const handleMarkerClick = (parking: ParkingPrivate) => {
    setSelectedParking(parking);
    setIsModalOpen(true);
  };

  const handleBooking = (parking: ParkingPrivate) => {
    setIsModalOpen(false);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
    setLastBooking(booking);
    setIsBookingConfirmationOpen(true);
    
    // Send confirmation notification
    const parkingName = privateParkings.find(p => p.id === booking.parkingId)?.name || 'Parcheggio';
    notificationService.sendBookingConfirmation({
      parkingName,
      startTime: booking.startTime,
      endTime: booking.endTime
    });
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => 
      prev.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      )
    );
  };

  const handleAddParking = () => {
    setIsAddParkingOpen(true);
  };

  const handleAddParkingSubmit = (parkingData: Omit<ParkingPrivate, 'id'>) => {
    const newParking: ParkingPrivate = {
      ...parkingData,
      id: `parking_${Date.now()}`,
    };
    
    setPrivateParkings(prev => [...prev, newParking]);
    toast({
      title: "Parcheggio aggiunto!",
      description: `${newParking.name} è stato aggiunto con successo.`,
    });
  };

  const handleUpdateParking = (parkingId: string, updates: Partial<ParkingPrivate>) => {
    setPrivateParkings(prev => 
      prev.map(p => p.id === parkingId ? { ...p, ...updates } : p)
    );
  };

  const handleDeleteParking = (parkingId: string) => {
    setPrivateParkings(prev => prev.filter(p => p.id !== parkingId));
  };

  const handleReviewSubmit = (reviewData: Omit<Review, 'id' | 'timestamp'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}`,
      timestamp: new Date(),
    };
    setReviews(prev => [...prev, newReview]);
  };

  const handleEditParking = (parking: ParkingPrivate) => {
    setSelectedParkingForEdit(parking);
    setIsEditParkingOpen(true);
  };

  const handleShowReviewModal = (booking: Booking) => {
    setSelectedBookingForReview(booking);
    setIsReviewModalOpen(true);
  };

  const handleParkingReportSuccess = () => {
    // Refresh public parking spots
    setPublicParkingSpots(publicParkingService.getActiveSpots());
  };

  const handlePublicSpotClick = (spot: PublicParkingSpot) => {
    // Refresh public parking spots after interaction
    setPublicParkingSpots(publicParkingService.getActiveSpots());
  };

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-park-dark">
      {/* Top Navigation Bar */}
      <header className="bg-park-surface shadow-lg relative z-30 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-park-mint rounded-lg flex items-center justify-center">
              <Car className="text-park-dark w-6 h-6" />
            </div>
            <h1 className="text-xl font-montserrat font-bold text-white">NinjaPark</h1>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Add Parking Button */}
            <button
              onClick={handleAddParking}
              className="w-10 h-10 bg-park-mint rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors"
              title="Aggiungi Parcheggio"
            >
              <Plus className="w-5 h-5 text-park-dark" />
            </button>
            
            {/* Profile Button */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 bg-park-card rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
              >
                <User className="w-5 h-5 text-park-mint" />
              </button>
            
            <ProfileDropdown
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                onMyParkingsClick={() => {
                  setIsProfileOpen(false);
                  setIsMyParkingsOpen(true);
                }}
                onBookingHistoryClick={() => {
                  setIsProfileOpen(false);
                  setIsBookingHistoryOpen(true);
                }}
                onProfileClick={() => {
                  setIsProfileOpen(false);
                  setIsProfileModalOpen(true);
                }}
                onFavoritesClick={() => {
                  setIsProfileOpen(false);
                  setIsFavoritesOpen(true);
                }}
                onBadgesClick={() => {
                  setIsProfileOpen(false);
                  setIsUserBadgesOpen(true);
                }}
                onNotificationsClick={() => {
                  setIsProfileOpen(false);
                  setIsNotificationsOpen(true);
                }}
                onSettingsClick={() => {
                  setIsProfileOpen(false);
                  setIsSettingsOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Map Container */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="w-full h-full bg-park-surface flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-park-mint border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Loading map...</p>
            </div>
          </div>
        ) : (
          <GoogleMaps
            userLocation={userLocation}
            privateparkings={privateParkings}
            publicParkingSpots={publicParkingSpots}
            onMarkerClick={handleMarkerClick}
            onPublicSpotClick={handlePublicSpotClick}
          />
        )}
        
        {/* Bottom Action Button - Hide when any modal is open */}
        {!isProfileOpen && !isModalOpen && !isAddParkingOpen && !isMyParkingsOpen && 
         !isBookingOpen && !isBookingHistoryOpen && !isBookingConfirmationOpen && 
         !isProfileModalOpen && !isReviewModalOpen && !isEditParkingOpen && 
         !isFavoritesOpen && !isParkingReportOpen && !isUserBadgesOpen && 
         !isNotificationsOpen && !isSettingsOpen && (
          <div className="absolute bottom-6 left-4 right-4 z-40">
            <button
              onClick={() => setIsParkingReportOpen(true)}
              className="w-full bg-park-mint text-park-dark py-4 rounded-2xl font-bold text-lg shadow-2xl hover:bg-opacity-90 transition-all"
            >
              I'm leaving the spot
            </button>
          </div>
        )}
      </div>
      
      {/* Parking Details Modal */}
      <ParkingDetailsModal
        parking={selectedParking}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBook={handleBooking}
      />

      {/* Add Parking Modal */}
      <AddParkingModal
        isOpen={isAddParkingOpen}
        onClose={() => setIsAddParkingOpen(false)}
        onAdd={handleAddParkingSubmit}
        userLocation={userLocation}
      />

      {/* My Parkings Modal */}
      <MyParkingsModal
        isOpen={isMyParkingsOpen}
        onClose={() => setIsMyParkingsOpen(false)}
        parkings={privateParkings}
        onUpdate={handleUpdateParking}
        onDelete={handleDeleteParking}
        onEdit={handleEditParking}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        parking={selectedParking}
        onBookingSuccess={handleBookingSuccess}
        existingBookings={bookings}
      />

      {/* Booking History Modal */}
      <BookingHistoryModal
        isOpen={isBookingHistoryOpen}
        onClose={() => setIsBookingHistoryOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
        onReviewBooking={handleShowReviewModal}
      />

      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        isOpen={isBookingConfirmationOpen}
        onClose={() => setIsBookingConfirmationOpen(false)}
        booking={lastBooking}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onMyParkingsClick={() => {
          setIsProfileModalOpen(false);
          setIsMyParkingsOpen(true);
        }}
        onBookingHistoryClick={() => {
          setIsProfileModalOpen(false);
          setIsBookingHistoryOpen(true);
        }}
        userParkings={privateParkings.filter(p => p.ownerId === currentUser?.uid)}
        userBookings={bookings.filter(b => b.userId === currentUser?.uid)}
        userReviews={reviews.filter(r => r.userId === currentUser?.uid)}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        booking={selectedBookingForReview}
        onReviewSubmit={handleReviewSubmit}
      />

      {/* Edit Parking Modal */}
      <EditParkingModal
        isOpen={isEditParkingOpen}
        onClose={() => setIsEditParkingOpen(false)}
        parking={selectedParkingForEdit}
        onUpdate={handleUpdateParking}
      />

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        parkings={privateParkings}
        onParkingSelect={(parking) => {
          setSelectedParking(parking);
          setIsModalOpen(true);
        }}
      />

      {/* Parking Report Modal */}
      <ParkingReportModal
        isOpen={isParkingReportOpen}
        onClose={() => setIsParkingReportOpen(false)}
        userLocation={userLocation}
        onReportSuccess={handleParkingReportSuccess}
      />

      {/* User Badges Modal */}
      <UserBadgesModal
        isOpen={isUserBadgesOpen}
        onClose={() => setIsUserBadgesOpen(false)}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
