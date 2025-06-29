import React, { createContext, useContext, useState } from "react";

interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  pricePerHour: number;
  features: string[];
  imageUrl?: string;
  rating: number;
  hostName?: string;
  type: 'public' | 'private';
}

interface AppContextType {
  selectedParking: ParkingSpot | null;
  setSelectedParking: (parking: ParkingSpot | null) => void;
  showParkingDetail: boolean;
  setShowParkingDetail: (show: boolean) => void;
  showProfile: boolean;
  setShowProfile: (show: boolean) => void;
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (location: { lat: number; lng: number } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedParking, setSelectedParking] = useState<ParkingSpot | null>(null);
  const [showParkingDetail, setShowParkingDetail] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  return (
    <AppContext.Provider value={{
      selectedParking,
      setSelectedParking,
      showParkingDetail,
      setShowParkingDetail,
      showProfile,
      setShowProfile,
      userLocation,
      setUserLocation,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
