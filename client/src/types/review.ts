export interface Review {
  id: string;
  parkingId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: Date;
}

export interface ParkingWithReviews extends import('./parking').ParkingPrivate {
  averageRating?: number;
  totalReviews?: number;
}