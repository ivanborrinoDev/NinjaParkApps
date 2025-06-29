import React, { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useQuery } from "@tanstack/react-query";

interface VisualMapProps {
  className?: string;
}

export function VisualMap({ className }: VisualMapProps) {
  const { userLocation, setSelectedParking, setShowParkingDetail } = useApp();
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
  const [showFilter, setShowFilter] = useState(false);

  const [mapCenter, setMapCenter] = useState({ lat: 40.7580, lng: -73.9855 });
  const { setUserLocation } = useApp();

  // Dummy parking spots data
  const mockParkingSpots = [
    { id: 1, latitude: 40.7580, longitude: -73.9855, type: 'public', images: [] },
    { id: 2, latitude: 40.7680, longitude: -73.9955, type: 'private', images: ['https://example.com/parking2.jpg'] },
    { id: 3, latitude: 40.7780, longitude: -73.9755, type: 'public', images: ['https://example.com/parking3.jpg', 'https://example.com/parking3_2.jpg'] },
  ];

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

  // Convert lat/lng to pixel coordinates for our visual map
  const coordsToPixels = (lat: number, lng: number) => {
    const centerLat = mapCenter.lat;
    const centerLng = mapCenter.lng;

    // Simple projection - in a real app you'd use proper map projection
    const scale = 8000; // Adjust this to change zoom level
    const x = (lng - centerLng) * scale + 250; // 250 is half container width
    const y = (centerLat - lat) * scale + 200; // 200 is half container height

    return { x: Math.max(20, Math.min(480, x)), y: Math.max(20, Math.min(380, y)) };
  };

  return (
    <div className={`relative ${className}`}>
      {/* Visual Map Container */}
      <div className="w-full h-full bg-gradient-to-br from-ninja-gray via-ninja-gray-light to-ninja-gray rounded-xl overflow-hidden relative">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* City Streets Pattern */}
        <div className="absolute inset-0">
          {/* Horizontal streets */}
          <div className="absolute top-1/4 left-0 w-full h-1 bg-gray-600 opacity-60"></div>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-600 opacity-60"></div>
          <div className="absolute top-3/4 left-0 w-full h-1 bg-gray-600 opacity-60"></div>

          {/* Vertical streets */}
          <div className="absolute left-1/4 top-0 w-1 h-full bg-gray-600 opacity-60"></div>
          <div className="absolute left-1/2 top-0 w-1 h-full bg-gray-600 opacity-60"></div>
          <div className="absolute left-3/4 top-0 w-1 h-full bg-gray-600 opacity-60"></div>
        </div>

        {/* User Location */}
        {userLocation && (
          <div 
            className="absolute w-4 h-4 bg-white border-4 border-ninja-mint rounded-full animate-pulse transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: `${coordsToPixels(userLocation.lat, userLocation.lng).x}px`,
              top: `${coordsToPixels(userLocation.lat, userLocation.lng).y}px`,
            }}
          />
        )}

        {/* Parking Spots */}
        {mockParkingSpots
            .filter(spot => filter === 'all' || spot.type === filter)
            .map((spot) => {
          const { x, y } = coordsToPixels(parseFloat(spot.latitude), parseFloat(spot.longitude));
          return (
            <button
              key={spot.id}
              onClick={() => handleParkingClick(spot)}
              className={`absolute w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform transform -translate-x-1/2 -translate-y-1/2 z-10 overflow-hidden ${
                spot.type === 'private' ? 'bg-ninja-mint' : 'bg-ninja-blue'
              }`}
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              {spot.images && spot.images.length > 0 ? (
                <img 
                  src={spot.images[0]} 
                  alt={`Parking ${spot.id}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {spot.type === 'private' ? 'H' : 'P'}
                  </span>
                </div>
              )}
            </button>
          );
        })}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={centerOnUser}
            className="bg-white/90 backdrop-blur-lg w-12 h-12 rounded-xl flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <svg className="w-5 h-5 text-ninja-gray" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

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
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
            </button>
          </div>

          {/* Filter Dropdown */}
          {showFilter && (
            <div className="border-t border-gray-200 bg-white">
              <div className="p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Filter by type:</p>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Parking', color: 'bg-gray-500' },
                    { value: 'public', label: 'Public Parking', color: 'bg-blue-500' },
                    { value: 'private', label: 'Private Parking', color: 'bg-green-500' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilter(option.value as typeof filter);
                        setShowFilter(false);
                      }}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left hover:bg-gray-50 transition-colors ${
                        filter === option.value ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                      <span className="text-gray-700">{option.label}</span>
                      {filter === option.value && (
                        <svg className="w-4 h-4 text-blue-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-lg rounded-xl p-3 shadow-lg">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-ninja-blue rounded-full border-2 border-white"></div>
              <span className="text-gray-700">Public</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-ninja-mint rounded-full border-2 border-white"></div>
              <span className="text-gray-700">Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-white border-2 border-ninja-mint rounded-full"></div>
              <span className="text-gray-700">You</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}