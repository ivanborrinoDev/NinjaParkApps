
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      bookingConfirmations: true,
      promotions: false
    },
    privacy: {
      profileVisible: true,
      locationSharing: true,
      dataCollection: false
    },
    preferences: {
      language: 'it',
      currency: 'EUR',
      darkMode: true,
      autoLocation: true
    }
  });

  if (!isOpen) return null;

  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved.",
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-ninja-gray shadow-2xl border-l border-gray-600 transform translate-x-0 transition-transform duration-300">
        {/* Header */}
        <div className="bg-ninja-gray-light px-6 py-4 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Settings</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-full overflow-y-auto">
          {/* Notifications */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                    className="w-5 h-5 text-ninja-mint bg-ninja-gray-light border-gray-600 rounded focus:ring-ninja-mint focus:ring-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Privacy</h3>
            <div className="space-y-4">
              {Object.entries(settings.privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateSetting('privacy', key, e.target.checked)}
                    className="w-5 h-5 text-ninja-mint bg-ninja-gray-light border-gray-600 rounded focus:ring-ninja-mint focus:ring-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Language</label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
                  className="w-full px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white"
                >
                  <option value="it">Italiano</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Currency</label>
                <select
                  value={settings.preferences.currency}
                  onChange={(e) => updateSetting('preferences', 'currency', e.target.value)}
                  className="w-full px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-300">Dark Mode</label>
                <input
                  type="checkbox"
                  checked={settings.preferences.darkMode}
                  onChange={(e) => updateSetting('preferences', 'darkMode', e.target.checked)}
                  className="w-5 h-5 text-ninja-mint bg-ninja-gray-light border-gray-600 rounded focus:ring-ninja-mint focus:ring-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-300">Auto Location</label>
                <input
                  type="checkbox"
                  checked={settings.preferences.autoLocation}
                  onChange={(e) => updateSetting('preferences', 'autoLocation', e.target.checked)}
                  className="w-5 h-5 text-ninja-mint bg-ninja-gray-light border-gray-600 rounded focus:ring-ninja-mint focus:ring-2"
                />
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="border-t border-gray-600 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 text-gray-300 hover:bg-ninja-gray-light rounded-xl transition-colors">
                Export Data
              </button>
              <button className="w-full text-left px-4 py-3 text-gray-300 hover:bg-ninja-gray-light rounded-xl transition-colors">
                Contact Support
              </button>
              <button className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
