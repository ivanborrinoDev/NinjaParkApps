import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { VisualMap } from "@/components/VisualMap";
import { ParkingDetailModal } from "@/components/ParkingDetailModal";
import { ProfileDrawer } from "@/components/ProfileDrawer";
import { AddParkingModal } from "@/components/AddParkingModal";
import { useToast } from "@/hooks/use-toast";

export function MainApp() {
  const { setShowProfile } = useApp();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAddParking, setShowAddParking] = useState(false);

  const handleAddParking = () => {
    if (user?.role === "host") {
      setShowAddParking(true);
    } else {
      toast({
        title: "Accesso negato",
        description: "Solo gli host possono aggiungere parcheggi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-ninja-dark">
      {/* Header */}
      <header className="bg-ninja-gray/95 backdrop-blur-lg border-b border-gray-700 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <img src="/logo.png" alt="NinjaPark Logo" className="w-10 h-10 object-contain" />
            </div>
            <h1 className="text-xl font-bold text-white">NinjaPark</h1>
          </div>

          {/* Profile Button */}
          <button
            onClick={() => setShowProfile(true)}
            className="bg-ninja-gray-light w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-600 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </header>

      {/* Map Container */}
      <div className="relative h-[calc(100vh-64px)]">
        <VisualMap className="w-full h-full" />

        {/* Floating Action Button (Add Parking) */}
        <button
          onClick={handleAddParking}
          className="absolute bottom-24 right-6 bg-ninja-mint hover:bg-ninja-mint-dark w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-all duration-200 md:bottom-6"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="bg-ninja-gray border-t border-gray-700 px-4 py-2 md:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="flex justify-around">
          <button className="flex flex-col items-center py-2 px-3 text-ninja-mint">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-xs">Map</span>
          </button>
          <button className="flex flex-col items-center py-2 px-3 text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">History</span>
          </button>
          <button className="flex flex-col items-center py-2 px-3 text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs">Saved</span>
          </button>
          <button
            onClick={() => setShowProfile(true)}
            className="flex flex-col items-center py-2 px-3 text-gray-400"
          >
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <ParkingDetailModal />
      <ProfileDrawer />
      <AddParkingModal 
        isOpen={showAddParking} 
        onClose={() => setShowAddParking(false)} 
      />
    </div>
  );
}