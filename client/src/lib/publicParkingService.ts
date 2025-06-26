
import { PublicParkingSpot, ParkingReport, UserReliabilityScore, Badge } from '../types/publicParking';

class PublicParkingService {
  private static instance: PublicParkingService;
  private parkingSpots: Map<string, PublicParkingSpot> = new Map();
  private userScores: Map<string, UserReliabilityScore> = new Map();

  static getInstance(): PublicParkingService {
    if (!PublicParkingService.instance) {
      PublicParkingService.instance = new PublicParkingService();
    }
    return PublicParkingService.instance;
  }

  async reportLeavingParking(userId: string, lat: number, lng: number, parkingType: 'blue' | 'white'): Promise<string> {
    const spotId = `spot_${lat.toFixed(6)}_${lng.toFixed(6)}_${Date.now()}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

    const spot: PublicParkingSpot = {
      id: spotId,
      lat,
      lng,
      type: parkingType,
      status: 'available',
      reportedAt: now,
      reportedBy: userId,
      confirmedBy: [],
      expiresAt
    };

    this.parkingSpots.set(spotId, spot);
    
    // Update user stats
    this.updateUserStats(userId, 'leaving');
    
    // Set timer to change status to uncertain
    setTimeout(() => {
      const currentSpot = this.parkingSpots.get(spotId);
      if (currentSpot && currentSpot.status === 'available') {
        this.parkingSpots.set(spotId, { ...currentSpot, status: 'uncertain' });
      }
    }, 10 * 60 * 1000);

    console.log(`Parking spot reported: ${spotId} at ${lat}, ${lng}`);
    return spotId;
  }

  async confirmParkingTaken(spotId: string, userId: string): Promise<boolean> {
    const spot = this.parkingSpots.get(spotId);
    if (!spot) return false;

    // Mark spot as occupied
    const updatedSpot = {
      ...spot,
      status: 'occupied' as const,
      confirmedBy: [...spot.confirmedBy, userId]
    };
    
    this.parkingSpots.set(spotId, updatedSpot);
    
    // Update reliability score for original reporter
    this.updateReporterReliability(spot.reportedBy, true);
    
    // Update user stats for confirming user
    this.updateUserStats(userId, 'taken');

    console.log(`Parking spot ${spotId} confirmed taken by ${userId}`);
    return true;
  }

  private updateUserStats(userId: string, action: 'leaving' | 'taken') {
    const currentScore = this.userScores.get(userId) || {
      userId,
      totalReports: 0,
      confirmedReports: 0,
      reliabilityScore: 100,
      badges: []
    };

    if (action === 'leaving') {
      currentScore.totalReports++;
    }

    // Check for new badges
    this.checkAndAwardBadges(currentScore);
    
    this.userScores.set(userId, currentScore);
  }

  private updateReporterReliability(reporterId: string, wasConfirmed: boolean) {
    const score = this.userScores.get(reporterId) || {
      userId: reporterId,
      totalReports: 0,
      confirmedReports: 0,
      reliabilityScore: 100,
      badges: []
    };

    if (wasConfirmed) {
      score.confirmedReports++;
    }

    // Calculate reliability score (percentage of confirmed reports)
    score.reliabilityScore = score.totalReports > 0 
      ? Math.round((score.confirmedReports / score.totalReports) * 100)
      : 100;

    this.checkAndAwardBadges(score);
    this.userScores.set(reporterId, score);
  }

  private checkAndAwardBadges(userScore: UserReliabilityScore) {
    const badges: Badge[] = [];

    // First Report Badge
    if (userScore.totalReports >= 1 && !userScore.badges.find(b => b.id === 'first_report')) {
      badges.push({
        id: 'first_report',
        name: 'Primo Segnalatore',
        description: 'Hai fatto la tua prima segnalazione!',
        icon: '🚗',
        unlockedAt: new Date()
      });
    }

    // Reliable Reporter Badge
    if (userScore.totalReports >= 10 && userScore.reliabilityScore >= 80 && !userScore.badges.find(b => b.id === 'reliable')) {
      badges.push({
        id: 'reliable',
        name: 'Segnalatore Affidabile',
        description: 'Hai un tasso di affidabilità dell\'80% con almeno 10 segnalazioni',
        icon: '⭐',
        unlockedAt: new Date()
      });
    }

    // Super Reporter Badge
    if (userScore.totalReports >= 50 && !userScore.badges.find(b => b.id === 'super_reporter')) {
      badges.push({
        id: 'super_reporter',
        name: 'Super Segnalatore',
        description: 'Hai fatto 50 segnalazioni!',
        icon: '🏆',
        unlockedAt: new Date()
      });
    }

    // Perfect Score Badge
    if (userScore.totalReports >= 20 && userScore.reliabilityScore === 100 && !userScore.badges.find(b => b.id === 'perfect')) {
      badges.push({
        id: 'perfect',
        name: 'Precisione Perfetta',
        description: 'Hai un tasso di affidabilità del 100% con almeno 20 segnalazioni',
        icon: '💎',
        unlockedAt: new Date()
      });
    }

    userScore.badges.push(...badges);
  }

  getActiveSpots(): PublicParkingSpot[] {
    const now = new Date();
    return Array.from(this.parkingSpots.values()).filter(spot => {
      // Remove expired occupied spots
      if (spot.status === 'occupied' && now.getTime() - spot.reportedAt.getTime() > 30 * 60 * 1000) {
        this.parkingSpots.delete(spot.id);
        return false;
      }
      return spot.status !== 'occupied';
    });
  }

  getUserScore(userId: string): UserReliabilityScore | null {
    return this.userScores.get(userId) || null;
  }

  getSpotsNearLocation(lat: number, lng: number, radiusMeters: number = 200): PublicParkingSpot[] {
    return this.getActiveSpots().filter(spot => {
      const distance = this.calculateDistance(lat, lng, spot.lat, spot.lng);
      return distance <= radiusMeters;
    });
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

export const publicParkingService = PublicParkingService.getInstance();
