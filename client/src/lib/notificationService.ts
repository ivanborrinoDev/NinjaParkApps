
import { requestNotificationPermission } from './firebase';

export class NotificationService {
  private static instance: NotificationService;
  private fcmToken: string | null = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize() {
    try {
      this.fcmToken = await requestNotificationPermission();
      if (this.fcmToken) {
        console.log('Notifications initialized successfully');
      } else {
        console.log('Notifications not available - using fallback methods');
      }
    } catch (error) {
      console.warn('Failed to initialize notifications:', error);
      // Continue without notifications
    }
    return this.fcmToken;
  }

  async sendBookingConfirmation(bookingDetails: any) {
    // In a real app, this would call your backend API
    console.log('Sending booking confirmation notification:', bookingDetails);
    
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.log('Browser notification: Prenotazione confermata per', bookingDetails.parkingName);
      return;
    }
    
    // For demo, show local notification
    if (Notification.permission === 'granted') {
      try {
        new Notification('Prenotazione Confermata! 🎉', {
          body: `Il tuo parcheggio presso ${bookingDetails.parkingName} è confermato`,
          icon: '/icon-192x192.png'
        });
      } catch (error) {
        console.warn('Failed to show notification:', error);
      }
    }
  }

  async sendSlotAvailableNotification(parkingName: string) {
    console.log('Sending slot available notification for:', parkingName);
    
    if (!('Notification' in window)) {
      console.log('Browser notification: Parcheggio disponibile presso', parkingName);
      return;
    }
    
    if (Notification.permission === 'granted') {
      try {
        new Notification('Parcheggio Disponibile! 🚗', {
          body: `Un posto è ora disponibile presso ${parkingName}`,
          icon: '/icon-192x192.png'
        });
      } catch (error) {
        console.warn('Failed to show notification:', error);
      }
    }
  }

  async checkFavoriteAvailability(favorites: any[], parkings: any[]) {
    // Simulate checking for new availability
    favorites.forEach(favorite => {
      const parking = parkings.find(p => p.id === favorite.parkingId);
      if (parking) {
        // Simulate random availability check
        if (Math.random() > 0.8) {
          this.sendSlotAvailableNotification(parking.name);
        }
      }
    });
  }

  async sendParkingAvailableNotification(lat: number, lng: number, parkingType: 'blue' | 'white') {
    const typeText = parkingType === 'blue' ? 'Strisce Blu' : 'Strisce Bianche';
    console.log(`Sending parking available notification: ${typeText} at ${lat}, ${lng}`);
    
    if (!('Notification' in window)) {
      console.log(`Browser notification: Parcheggio ${typeText} disponibile nelle vicinanze`);
      return;
    }
    
    if (Notification.permission === 'granted') {
      try {
        new Notification('Parcheggio Disponibile Nelle Vicinanze! 🅿️', {
          body: `Un parcheggio ${typeText} è stato appena liberato. Affrettati!`,
          icon: '/icon-192x192.png',
          tag: 'parking-available'
        });
      } catch (error) {
        console.warn('Failed to show parking notification:', error);
      }
    }
  }

  async sendNearbyParkingNotifications(lat: number, lng: number, parkingType: 'blue' | 'white') {
    // In a real app, this would query nearby users from the backend
    // For demo, we'll just show a notification locally
    this.sendParkingAvailableNotification(lat, lng, parkingType);
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }
}

export const notificationService = NotificationService.getInstance();
