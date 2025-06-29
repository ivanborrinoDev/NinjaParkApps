import React, { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";

interface GoogleMapProps {
  className?: string;
}

// Mock parking data - in production this would come from Firestore
const mockParkingSpots = [
  {
    id: "public-1",
    name: "City Hall Parking",
    address: "Downtown Plaza",
    latitude: 40.7580,
    longitude: -73.9855,
    pricePerHour: 3.50,
    features: ["Security", "24/7"],
    rating: 4.2,
    type: "public" as const,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  },
  {
    id: "public-2",
    name: "Metro Station Lot",
    address: "Transit Center",
    latitude: 40.7614,
    longitude: -73.9776,
    pricePerHour: 4.00,
    features: ["Covered", "Electric Charging"],
    rating: 4.5,
    type: "public" as const,
    imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  },
  {
    id: "private-1",
    name: "Downtown Secure Parking",
    address: "123 Main Street, Downtown",
    latitude: 40.7589,
    longitude: -73.9841,
    pricePerHour: 5.50,
    features: ["Secure", "Covered", "24/7 Security"],
    rating: 4.8,
    type: "private" as const,
    hostName: "Sarah Johnson",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  },
  {
    id: "private-2",
    name: "Residential Driveway",
    address: "456 Oak Avenue",
    latitude: 40.7556,
    longitude: -73.9888,
    pricePerHour: 2.75,
    features: ["Private", "Safe"],
    rating: 4.6,
    type: "private" as const,
    hostName: "Mike Chen",
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  },
];

export function GoogleMap({ className }: GoogleMapProps) {
  const [mapCenter, setMapCenter] = useState({ lat: 40.7580, lng: -73.9855 });
  const { userLocation, setUserLocation, setSelectedParking, setShowParkingDetail } = useApp();

  useEffect(() => {
    // Get user's location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
          setMapCenter(pos);
        },
        () => {
          console.log("Geolocation failed, using default location");
        }
      );
    }
  }, [setUserLocation]);

  const handleParkingClick = (spot: any) => {
    setSelectedParking(spot);
    setShowParkingDetail(true);
  };

  const centerOnUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
          setMapCenter(pos);
        },
        () => {
          console.log("Geolocation failed");
        }
      );
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Location Button */}
      <button
        onClick={centerOnUser}
        className="absolute top-4 right-4 bg-white/90 backdrop-blur-lg w-12 h-12 rounded-xl flex items-center justify-center shadow-lg hover:bg-white transition-colors"
      >
        <svg className="w-5 h-5 text-ninja-gray" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-20">
        <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center px-4 py-3">
            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for parking spots..."
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
            />
            <button className="ml-2 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
