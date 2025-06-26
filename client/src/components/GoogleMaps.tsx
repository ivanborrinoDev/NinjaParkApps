import React, { useEffect, useRef, useState } from 'react';
import { ParkingPrivate, ParkingPublic, UserLocation } from '../types/parking';
import { PublicParkingSpot } from '../types/publicParking';
import { publicParkingService } from '../lib/publicParkingService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';

interface GoogleMapsProps {
  userLocation: UserLocation | null;
  privateparkings: ParkingPrivate[];
  onMarkerClick: (parking: ParkingPrivate) => void;
  publicParkingSpots?: PublicParkingSpot[];
  onPublicSpotClick?: (spot: PublicParkingSpot) => void;
}

// Mock public parking data
const publicParkings: ParkingPublic[] = [
  { id: 'pub1', name: 'Public Parking Downtown', lat: 40.7589, lng: -73.9851, prezzo: 2 },
  { id: 'pub2', name: 'City Center Parking', lat: 40.7505, lng: -73.9934, prezzo: 3 },
];

export const GoogleMaps: React.FC<GoogleMapsProps> = ({
  userLocation,
  privateparkings,
  onMarkerClick,
  publicParkingSpots = [],
  onPublicSpotClick,
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  const handlePublicSpotClick = async (spot: PublicParkingSpot) => {
    if (!currentUser) return;

    // If user clicks on available spot, ask if they want to confirm taking it
    if (spot.status === 'available' || spot.status === 'uncertain') {
      const confirmed = window.confirm(
        `Vuoi confermare di aver preso questo parcheggio ${spot.type === 'blue' ? 'a strisce blu' : 'a strisce bianche'}?`
      );

      if (confirmed) {
        const success = await publicParkingService.confirmParkingTaken(spot.id, currentUser.uid);
        if (success) {
          toast({
            title: "Confermato! 👍",
            description: "Hai confermato di aver preso questo parcheggio. Grazie per l'aggiornamento!",
          });

          if (onPublicSpotClick) {
            onPublicSpotClick(spot);
          }
        }
      }
    }
  };

  const getSpotMarkerColor = (spot: PublicParkingSpot) => {
    switch (spot.status) {
      case 'available':
        return '#10B981'; // Green
      case 'uncertain':
        return '#6B7280'; // Gray
      case 'occupied':
        return '#EF4444'; // Red
      default:
        return '#6B7280';
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // For demo without Google Maps API, show a placeholder
    if (!window.google) {
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div class="w-full h-full bg-park-surface flex items-center justify-center text-center p-8">
            <div>
              <div class="w-16 h-16 bg-park-mint rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg class="w-8 h-8 text-park-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
              </div>
              <h3 class="text-white text-xl font-semibold mb-2">Interactive Map</h3>
              <p class="text-gray-400 mb-4">Add Google Maps API key to enable full map functionality</p>
              <div class="grid grid-cols-1 gap-2 text-sm text-gray-300">
                <div class="flex items-center justify-center space-x-2">
                  <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Public Parking (${publicParkings.length} spots)</span>
                </div>
                <div class="flex items-center justify-center space-x-2">
                  <div class="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Private Parking (${privateparkings.length} spots)</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }
      return;
    }

    const defaultCenter = userLocation || { lat: 40.7580, lng: -73.9855 }; // NYC default

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 15,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [{ "color": "#1d2c4d" }]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [{ "color": "#8ec3b9" }]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [{ "color": "#1a3646" }]
        },
        {
          "featureType": "administrative.country",
          "elementType": "geometry.stroke",
          "stylers": [{ "color": "#4b6878" }]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{ "color": "#304a7d" }]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [{ "color": "#9ca5b3" }]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{ "color": "#0e1626" }]
        }
      ],
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    setMap(mapInstance);

    return () => {
      // Clean up markers
      markers.forEach(marker => marker.setMap(null));
      setMarkers([]);
    };
  }, [userLocation]);

  // Add markers when map is ready
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // Add user location marker
    if (userLocation) {
      const userMarker = new google.maps.Marker({
        position: userLocation,
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#2196F3',
          fillOpacity: 1,
          strokeWeight: 4,
          strokeColor: '#ffffff',
        },
        title: 'Your Location',
      });
      newMarkers.push(userMarker);
    }

    // Add public parking markers (blue)
    publicParkings.forEach(parking => {
      const marker = new google.maps.Marker({
        position: { lat: parking.lat, lng: parking.lng },
        map,
        icon: {
          path: 'M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13C19,5.13 15.87,2 12,2z',
          fillColor: '#2196F3',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
          scale: 2,
        },
        title: `${parking.name} - $${parking.prezzo}/hr`,
      });
      newMarkers.push(marker);
    });

    // Add private parking markers (green)
    privateparkings.forEach(parking => {
      const marker = new google.maps.Marker({
        position: { lat: parking.lat, lng: parking.lng },
        map,
        icon: {
          path: 'M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13C19,5.13 15.87,2 12,2z',
          fillColor: '#4CAF50',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
          scale: 2,
        },
        title: `${parking.name} - $${parking.prezzo}/hr`,
      });

      marker.addListener('click', () => {
        onMarkerClick(parking);
      });

      newMarkers.push(marker);
    });

    // Add public parking spots markers
    publicParkingSpots.forEach(spot => {
      const marker = new google.maps.Marker({
        position: { lat: spot.lat, lng: spot.lng },
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: getSpotMarkerColor(spot),
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
        },
        title: `${spot.type === 'blue' ? 'Strisce Blu' : 'Strisce Bianche'} - ${spot.status}`,
      });

      marker.addListener('click', () => {
        handlePublicSpotClick(spot);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [map, userLocation, privateparkings, publicParkingSpots, onMarkerClick]);

  return (
    <div className="w-full h-full relative bg-gray-900">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-600 focus:outline-none focus:border-park-mint"
          />
        </div>
      </div>

      {/* Finding parking text */}
      <div className="absolute bottom-32 left-4 right-4 z-30 text-center">
        <h2 className="text-white text-2xl font-bold mb-2">Finding parking</h2>
        <h2 className="text-white text-2xl font-bold mb-4">made easy</h2>
      </div>
        <div className="w-full h-full bg-gray-900 relative overflow-hidden">
        {/* Modena Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
            {/* Simulated Modena Streets */}
            <svg className="w-full h-full opacity-40" viewBox="0 0 800 600">
              {/* Grid Pattern */}
              <defs>
                <pattern id="modena-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#374151" strokeWidth="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#modena-grid)" />

              {/* Main Modena Streets */}
              <g stroke="#4B5563" strokeWidth="4" fill="none" strokeLinecap="round">
                {/* Via Emilia (main horizontal) */}
                <path d="M0,300 L800,300" stroke="#6B7280" strokeWidth="6"/>
                {/* Via del Carmine */}
                <path d="M200,0 L200,600"/>
                {/* Via Farini */}
                <path d="M400,0 L400,600"/>
                {/* Via Canalgrande */}
                <path d="M600,0 L600,600"/>
                {/* Via San Carlo */}
                <path d="M0,150 L800,150"/>
                {/* Via Ganaceto */}
                <path d="M0,450 L800,450"/>
              </g>

              {/* Historic Center Area */}
              <rect x="280" y="180" width="240" height="240" fill="none" stroke="#park-mint" strokeWidth="2" strokeDasharray="5,5" opacity="0.6"/>
              
              {/* Piazza Grande (Cathedral Square) */}
              <circle cx="400" cy="280" r="30" fill="#4B5563" opacity="0.8"/>
              <text x="400" y="285" textAnchor="middle" fill="#9CA3AF" fontSize="12" fontFamily="Arial">Duomo</text>
            </svg>

            {/* City Labels */}
            <div className="absolute top-4 left-4 text-park-mint font-bold text-lg">
              Modena Centro
            </div>
          </div>

          {/* Your Location in Modena Center */}
        <div
          className="absolute w-5 h-5 bg-blue-500 rounded-full border-3 border-white shadow-xl transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{
            left: '50%',
            top: '50%'
          }}
        >
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
        </div>

          {/* Modena Landmarks for Reference */}
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 z-5" style={{ left: '50%', top: '47%' }}>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="text-xs text-yellow-500 mt-1 whitespace-nowrap">Piazza Grande</div>
        </div>

        {/* Private Parking Markers - Positioned around Modena */}
        {privateparkings.map((parking, index) => {
          const positions = [
            { left: '35%', top: '25%' }, // Near Via San Carlo
            { left: '65%', top: '35%' }, // Via Canalgrande area
            { left: '45%', top: '65%' }, // South of center
            { left: '25%', top: '55%' }, // West area
            { left: '75%', top: '45%' }, // East area
          ];
          const position = positions[index % positions.length];
          
          return (
            <button
              key={parking.id}
              onClick={() => onMarkerClick(parking)}
              className="absolute w-12 h-12 bg-park-mint rounded-full border-3 border-white shadow-xl transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-all duration-200 z-15 flex items-center justify-center"
              style={position}
              title={`${parking.name} - €${parking.prezzo}/ora`}
            >
              <span className="text-park-dark text-sm font-bold">P</span>
            </button>
          );
        })}

        {/* Public Parking Spots around Modena */}
        {publicParkingSpots.map((spot, index) => {
          const publicPositions = [
            { left: '42%', top: '30%' }, // Near Duomo
            { left: '55%', top: '40%' }, // Historic center
            { left: '38%', top: '52%' }, // South center
            { left: '62%', top: '28%' }, // North east
            { left: '30%', top: '45%' }, // West side
            { left: '70%', top: '55%' }, // East side
          ];
          const position = publicPositions[index % publicPositions.length];
          
          return (
            <button
              key={spot.id}
              onClick={() => handlePublicSpotClick(spot)}
              className="absolute w-8 h-8 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-all duration-200 z-10 flex items-center justify-center text-white font-bold text-xs"
              style={{
                ...position,
                backgroundColor: getSpotMarkerColor(spot)
              }}
              title={`${spot.type === 'blue' ? 'Strisce Blu' : 'Strisce Bianche'} - ${spot.status}`}
            >
              {spot.type === 'blue' ? 'B' : 'W'}
            </button>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-park-surface bg-opacity-90 rounded-lg p-3 text-xs">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-park-mint rounded-full"></div>
            <span className="text-white">Parcheggi Privati</span>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white">Libero</span>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-white">Incerto</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-white">Occupato</span>
          </div>
        </div>
      </div>
    </div>
  );
};