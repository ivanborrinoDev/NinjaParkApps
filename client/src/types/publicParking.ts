
export interface PublicParkingSpot {
  id: string;
  lat: number;
  lng: number;
  type: 'blue' | 'white'; // strisce blu (paid) or bianche (free)
  status: 'available' | 'uncertain' | 'occupied';
  reportedAt: Date;
  reportedBy: string; // user ID
  confirmedBy: string[]; // array of user IDs who confirmed
  expiresAt: Date; // when marker turns grey
}

export interface ParkingReport {
  id: string;
  spotId: string;
  userId: string;
  type: 'leaving' | 'taken';
  timestamp: Date;
  lat: number;
  lng: number;
  parkingType: 'blue' | 'white';
}

export interface UserReliabilityScore {
  userId: string;
  totalReports: number;
  confirmedReports: number;
  reliabilityScore: number; // 0-100
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}
