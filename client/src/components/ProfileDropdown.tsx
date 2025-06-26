import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Car, History, Heart, Award, Settings, LogOut, Bell } from 'lucide-react';
import { useLocation } from 'wouter';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onMyParkingsClick: () => void;
  onBookingHistoryClick: () => void;
  onProfileClick: () => void;
  onFavoritesClick: () => void;
  onBadgesClick: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  onMyParkingsClick,
  onBookingHistoryClick,
  onProfileClick,
  onFavoritesClick,
  onBadgesClick,
  onNotificationsClick,
  onSettingsClick,
}) => {
  const { currentUser, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation('/login');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-2 w-80 bg-park-surface rounded-2xl shadow-2xl border border-gray-600 z-50 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-park-mint to-green-400">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-park-dark rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-park-mint" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-park-dark">Welcome, Marco!</h3>
              <p className="text-park-dark/80 text-sm">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <div className="space-y-1">
            <button
              onClick={() => {
                onMyParkingsClick();
                onClose();
              }}
              className="w-full flex items-center justify-between p-4 text-white hover:bg-park-card rounded-xl transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <Car className="w-5 h-5 text-park-mint" />
                <span className="font-medium">My Parkings</span>
              </div>
              <span className="text-gray-400 group-hover:text-white transition-colors">›</span>
            </button>

            <button
              onClick={() => {
                onNotificationsClick?.();
                onClose();
              }}
              className="w-full flex items-center justify-between p-4 text-white hover:bg-park-card rounded-xl transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-park-mint" />
                <span className="font-medium">Notifications</span>
              </div>
              <span className="text-gray-400 group-hover:text-white transition-colors">›</span>
            </button>

            <button
              onClick={() => {
                onBadgesClick();
                onClose();
              }}
              className="w-full flex items-center justify-between p-4 text-white hover:bg-park-card rounded-xl transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-park-mint" />
                <span className="font-medium">Park Ninja Level</span>
              </div>
              <span className="text-gray-400 group-hover:text-white transition-colors">›</span>
            </button>

            {/* Park Karma Section */}
            <div className="p-4 bg-park-card rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-park-mint rounded-full flex items-center justify-center">
                    <span className="text-park-dark font-bold text-sm">🥷</span>
                  </div>
                  <div>
                    <span className="text-white font-medium">Parcheggio</span>
                    <p className="text-park-mint text-sm font-bold">Karma+2</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-park-mint rounded-full flex items-center justify-center">
                  <span className="text-park-dark font-bold text-xs">📶</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onBookingHistoryClick();
                onClose();
              }}
              className="w-full flex items-center justify-between p-4 text-white hover:bg-park-card rounded-xl transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <History className="w-5 h-5 text-park-mint" />
                <span className="font-medium">Booking History</span>
              </div>
              <span className="text-gray-400 group-hover:text-white transition-colors">›</span>
            </button>

            <button
              onClick={() => {
                onFavoritesClick();
                onClose();
              }}
              className="w-full flex items-center justify-between p-4 text-white hover:bg-park-card rounded-xl transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-park-mint" />
                <span className="font-medium">Favorites</span>
              </div>
              <span className="text-gray-400 group-hover:text-white transition-colors">›</span>
            </button>

            <button
              onClick={() => {
                onSettingsClick?.();
                onClose();
              }}
              className="w-full flex items-center justify-between p-4 text-white hover:bg-park-card rounded-xl transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-park-mint" />
                <span className="font-medium">Settings</span>
              </div>
              <span className="text-gray-400 group-hover:text-white transition-colors">›</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-600 mt-2 pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-4 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};