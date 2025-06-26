export interface Booking {
  id: string;
  userId: string;
  parkingId: string;
  parkingName: string;
  startDateTime: Date;
  endDateTime: Date;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentIntentId?: string;
  createdAt: Date;
}

export interface BookingFormData {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}