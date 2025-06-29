import { users, parkingSpots, bookings, type User, type InsertUser, type ParkingSpot, type InsertParkingSpot, type Booking, type InsertBooking } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Parking spot operations
  getParkingSpot(id: number): Promise<ParkingSpot | undefined>;
  getAllParkingSpots(): Promise<ParkingSpot[]>;
  createParkingSpot(spot: InsertParkingSpot): Promise<ParkingSpot>;
  updateParkingSpot(id: number, updates: Partial<ParkingSpot>): Promise<ParkingSpot | undefined>;
  searchParkingSpots(lat: number, lng: number, radiusMeters: number): Promise<ParkingSpot[]>;

  // Booking operations
  getBooking(id: number): Promise<Booking | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private parkingSpots: Map<number, ParkingSpot>;
  private bookings: Map<number, Booking>;
  private currentUserId: number;
  private currentParkingSpotId: number;
  private currentBookingId: number;

  constructor() {
    this.users = new Map();
    this.parkingSpots = new Map();
    this.bookings = new Map();
    this.currentUserId = 1;
    this.currentParkingSpotId = 1;
    this.currentBookingId = 1;

    // Add some sample parking spots
    this.createParkingSpot({
      name: "City Hall Parking",
      address: "Downtown Plaza",
      latitude: "40.7580",
      longitude: "-73.9855",
      pricePerHour: "3.50",
      description: "Public parking near city center",
      features: ["Security", "24/7"],
      imageUrls: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"],
      isAvailable: true,
      hostId: null,
      rating: "4.2",
      availabilityDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      availabilityStartTime: "06:00",
      availabilityEndTime: "22:00",
      isAccessible: true,
    });

    this.createParkingSpot({
      name: "Metro Station Lot",
      address: "Transit Center",
      latitude: "40.7614",
      longitude: "-73.9776",
      pricePerHour: "4.00",
      description: "Convenient parking near metro",
      features: ["Covered", "Electric Charging"],
      imageUrls: ["https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"],
      isAvailable: true,
      hostId: null,
      rating: "4.5",
      availabilityDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
      availabilityStartTime: "07:00",
      availabilityEndTime: "20:00",
      isAccessible: false,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === username,
    );
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Parking spot operations
  async getParkingSpot(id: number): Promise<ParkingSpot | undefined> {
    return this.parkingSpots.get(id);
  }

  async getAllParkingSpots(): Promise<ParkingSpot[]> {
    return Array.from(this.parkingSpots.values());
  }

  async createParkingSpot(insertSpot: InsertParkingSpot): Promise<ParkingSpot> {
    const id = this.currentParkingSpotId++;
    const spot: ParkingSpot = { 
      id,
      name: insertSpot.name,
      address: insertSpot.address,
      latitude: insertSpot.latitude,
      longitude: insertSpot.longitude,
      pricePerHour: insertSpot.pricePerHour,
      description: insertSpot.description || null,
      features: insertSpot.features || null,
      imageUrls: insertSpot.imageUrls || null,
      isAvailable: insertSpot.isAvailable ?? true,
      hostId: insertSpot.hostId || null,
      rating: insertSpot.rating || null,
      availabilityDays: insertSpot.availabilityDays || null,
      availabilityStartTime: insertSpot.availabilityStartTime || null,
      availabilityEndTime: insertSpot.availabilityEndTime || null,
      isAccessible: insertSpot.isAccessible ?? false,
      createdAt: new Date(),
    };
    this.parkingSpots.set(id, spot);
    return spot;
  }

  async updateParkingSpot(id: number, updates: Partial<ParkingSpot>): Promise<ParkingSpot | undefined> {
    const spot = this.parkingSpots.get(id);
    if (!spot) return undefined;

    const updatedSpot = { ...spot, ...updates };
    this.parkingSpots.set(id, updatedSpot);
    return updatedSpot;
  }

  async searchParkingSpots(lat: number, lng: number, radiusMeters: number): Promise<ParkingSpot[]> {
    const spots = Array.from(this.parkingSpots.values());

    // Simple distance calculation (Haversine formula would be more accurate)
    return spots.filter(spot => {
      const spotLat = parseFloat(spot.latitude);
      const spotLng = parseFloat(spot.longitude);

      // Rough distance calculation in degrees
      const latDiff = Math.abs(lat - spotLat);
      const lngDiff = Math.abs(lng - spotLng);
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

      // Convert radius from meters to degrees (very rough approximation)
      const radiusDegrees = radiusMeters / 111320; // roughly 111,320 meters per degree

      return distance <= radiusDegrees;
    });
  }

  // Booking operations
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.guestId === userId
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { 
      id,
      parkingSpotId: insertBooking.parkingSpotId,
      guestId: insertBooking.guestId,
      startTime: insertBooking.startTime,
      endTime: insertBooking.endTime,
      totalPrice: insertBooking.totalPrice,
      status: insertBooking.status || "confirmed",
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    const updatedBooking = { ...booking, ...updates };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async updateUserRole(userId: number, role: 'host' | 'guest'): Promise<User | null> {
    try {
      // Simulate database update
      const user = this.users.get(userId);
      if(user) {
        const updatedUser = {...user, role: role};
        this.users.set(userId, updatedUser)
        return updatedUser;
      }
      return null;

    } catch (error) {
      console.error('Error updating user role:', error);
      return null;
    }
  }
}

export const storage = new MemStorage();