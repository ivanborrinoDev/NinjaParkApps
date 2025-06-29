import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { signOutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { MyParkingPage } from "./MyParkingPage";
import { SavedSpotsModal } from "./SavedSpotsModal";
import { PaymentMethodsModal } from "./PaymentMethodsModal";
import { SettingsModal } from "./SettingsModal";

export function ProfileDrawer() {
  const { user, setUser } = useAuth();
  const { showProfile, setShowProfile } = useApp();
  const { toast } = useToast();
  const [showMyParking, setShowMyParking] = useState(false);
  const [showSavedSpots, setShowSavedSpots] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  if (!showProfile) return null;

  const handleClose = () => {
    setShowProfile(false);
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      setShowProfile(false);
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRoleSwitch = async () => {
    if (!user) return;
    
    const newRole = user.role === "host" ? "guest" : "host";
    
    // Start flip animation
    setIsFlipping(true);
    
    // Wait for half the animation to complete before updating the role
    setTimeout(async () => {
      try {
        const response = await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          // Update user context with new role
          setUser(updatedUser);
          
          toast({
            title: "Role switched!",
            description: `You are now a ${newRole}.`,
          });
        } else {
          throw new Error("Failed to switch role");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to switch role. Please try again.",
          variant: "destructive",
        });
      }
      
      // Complete the flip animation
      setTimeout(() => {
        setIsFlipping(false);
      }, 300);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={handleClose}
      />
      
      {/* Drawer Content */}
      <div className="absolute top-0 right-0 h-full w-80 max-w-[90vw] perspective-1000">
        <div className="h-full bg-ninja-gray shadow-2xl border-l border-gray-600">
          <div className={`flip-container ${isFlipping ? 'rotate-y-180' : ''}`}>
            
            {/* Front Face - Current Role */}
            <div className="flip-front bg-ninja-gray">
              {/* Header */}
              <div className="bg-ninja-gray-light px-6 py-4 border-b border-gray-600">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Profile</h2>
                  <button 
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Profile Content */}
              <div className="p-6 h-full overflow-y-auto">
          {/* User Info */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-ninja-mint rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-1">{user?.name || "User"}</h3>
            <p className="text-gray-400">{user?.email || "user@example.com"}</p>
            <div className="inline-flex items-center bg-ninja-mint/20 text-ninja-mint px-3 py-1 rounded-full text-sm mt-2">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1.5l1.6 7.2a1 1 0 001 .8h7.8a1 1 0 001-.8L17.5 7H19a1 1 0 001-1V5a1 1 0 00-1-1H3zM4 5h12v1H4V5z" />
              </svg>
              <span className="capitalize">{user?.role || "Guest"}</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            <button 
              onClick={() => setShowMyParking(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-ninja-gray-light rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{user?.role === "host" ? "I Miei Parcheggi" : "Le Mie Prenotazioni"}</span>
              <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button 
              onClick={() => setShowSavedSpots(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-ninja-gray-light rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Saved Spots</span>
              <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button 
              onClick={() => setShowPaymentMethods(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-ninja-gray-light rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Payment Methods</span>
              <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button 
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-ninja-gray-light rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
              <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-ninja-gray-light rounded-xl transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Help & Support</span>
              <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Role Switch Button */}
          <div className="mt-8 p-4 bg-ninja-gray-light rounded-xl">
            {user?.role === "guest" ? (
              <>
                <p className="text-gray-400 text-sm mb-3">Switch to Host mode to start earning by renting your parking space</p>
                <button 
                  onClick={handleRoleSwitch}
                  className="w-full bg-ninja-mint hover:bg-ninja-mint-dark text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Become a Host
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-400 text-sm mb-3">Switch to Guest mode to find and book parking spots</p>
                <button 
                  onClick={handleRoleSwitch}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1.5l1.6 7.2a1 1 0 001 .8h7.8a1 1 0 001-.8L17.5 7H19a1 1 0 001-1V5a1 1 0 00-1-1H3zM4 5h12v1H4V5z" />
                  </svg>
                  Become a Guest
                </button>
              </>
            )}
          </div>

          {/* Logout Button */}
          <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-8"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
              </div>
            </div>

            {/* Back Face - Opposite Role */}
            <div className="flip-back bg-ninja-gray">
              {/* Header */}
              <div className="bg-ninja-gray-light px-6 py-4 border-b border-gray-600">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Profile</h2>
                  <button 
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Profile Content - Flipped Role */}
              <div className="p-6 h-full overflow-y-auto">
                {/* User Info with opposite role */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-ninja-mint rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1">{user?.name || "User"}</h3>
                  <p className="text-gray-400">{user?.email || "user@example.com"}</p>
                  <div className="inline-flex items-center bg-ninja-mint/20 text-ninja-mint px-3 py-1 rounded-full text-sm mt-2">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1.5l1.6 7.2a1 1 0 001 .8h7.8a1 1 0 001-.8L17.5 7H19a1 1 0 001-1V5a1 1 0 00-1-1H3zM4 5h12v1H4V5z" />
                    </svg>
                    <span className="capitalize">{user?.role === "host" ? "Guest" : "Host"}</span>
                  </div>
                </div>

                {/* Welcome message for new role */}
                <div className="bg-ninja-gray-light rounded-xl p-6 text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Welcome to {user?.role === "host" ? "Guest" : "Host"} Mode!
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {user?.role === "host" 
                      ? "You can now find and book parking spots around you." 
                      : "You can now start earning by renting out your parking space."
                    }
                  </p>
                </div>

                {/* Switch back button */}
                <button 
                  onClick={handleRoleSwitch}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Continue as {user?.role === "host" ? "Guest" : "Host"}
                </button>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-8"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Parking/Bookings Page */}
      <MyParkingPage 
        isOpen={showMyParking} 
        onClose={() => setShowMyParking(false)} 
      />

      {/* Saved Spots Modal */}
      <SavedSpotsModal 
        isOpen={showSavedSpots} 
        onClose={() => setShowSavedSpots(false)} 
      />

      {/* Payment Methods Modal */}
      <PaymentMethodsModal 
        isOpen={showPaymentMethods} 
        onClose={() => setShowPaymentMethods(false)} 
      />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
}
