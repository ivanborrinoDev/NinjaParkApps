import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { BookingModal } from "./BookingModal";

export function ParkingDetailModal() {
  const { selectedParking, showParkingDetail, setShowParkingDetail } = useApp();
  const { toast } = useToast();
  const [showBooking, setShowBooking] = useState(false);

  if (!showParkingDetail || !selectedParking) return null;

  const handleBooking = () => {
    if (selectedParking.type === "private") {
      setShowBooking(true);
    } else {
      setShowParkingDetail(false);
      toast({
        title: "Prenotazione confermata!",
        description: "Riceverai un'email di conferma a breve.",
      });
    }
  };

  const handleClose = () => {
    setShowParkingDetail(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="absolute bottom-0 left-0 right-0 bg-ninja-gray rounded-t-3xl shadow-2xl border-t border-gray-600 transform translate-y-0 transition-transform duration-300">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-500 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="px-6 pb-8 max-h-[80vh] overflow-y-auto">
          {/* Image Gallery */}
          <div className="w-full h-48 bg-ninja-gray rounded-2xl mb-6 overflow-hidden">
            {selectedParking.images && selectedParking.images.length > 0 ? (
              <img 
                src={selectedParking.images[0]} 
                alt={selectedParking.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`w-full h-full flex items-center justify-center ${selectedParking.images && selectedParking.images.length > 0 ? 'hidden' : 'flex'}`}
            >
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-400 text-sm">No image available</p>
              </div>
            </div>
          </div>

          {/* Parking Info */}
          <div className="space-y-4">
            {/* Title and Rating */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{selectedParking.name}</h3>
                <p className="text-gray-400">{selectedParking.address}</p>
              </div>
              <div className="flex items-center space-x-1 bg-ninja-mint/20 px-3 py-1 rounded-full">
                <svg className="w-4 h-4 text-ninja-mint" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-ninja-mint font-medium text-sm">{selectedParking.rating}</span>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {selectedParking.features.map((feature, index) => (
                <span key={index} className="bg-ninja-gray-light text-white px-3 py-1 rounded-full text-sm">
                  {feature}
                </span>
              ))}
            </div>

            {/* Price and Availability */}
            <div className="bg-ninja-gray-light rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-3xl font-bold text-ninja-mint">${selectedParking.pricePerHour}</p>
                  <p className="text-gray-400 text-sm">per hour</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">Available Now</p>
                  <p className="text-gray-400 text-sm">3 spots left</p>
                </div>
              </div>

              {/* Time Selector */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Time</label>
                  <input 
                    type="time" 
                    className="w-full bg-ninja-gray border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-ninja-mint"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Duration</label>
                  <select className="w-full bg-ninja-gray border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-ninja-mint">
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>4 hours</option>
                    <option>All day</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Host Info */}
            {selectedParking.hostName && (
              <div className="flex items-center space-x-3 bg-ninja-gray-light rounded-2xl p-4">
                <div className="w-12 h-12 bg-ninja-mint rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{selectedParking.hostName}</p>
                  <p className="text-gray-400 text-sm">Host since 2023 • 4.9 rating</p>
                </div>
                <button className="text-ninja-mint hover:text-ninja-mint-dark">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>
            )}

            {/* Book Button */}
            <button 
              onClick={handleBooking}
              className="w-full bg-ninja-mint hover:bg-ninja-mint-dark text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl mt-6"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Prenota per €{selectedParking.pricePerHour}
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        parkingSpot={selectedParking}
      />
    </div>
  );
}