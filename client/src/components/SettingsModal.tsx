
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, Settings, Bell, MapPin, Shield, Smartphone } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [settings, setSettings] = useState({
    notifications: true,
    locationSharing: true,
    autoBooking: false,
    pushNotifications: true,
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-park-surface border-gray-600 max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-white text-xl font-semibold flex items-center space-x-2">
            <Settings className="w-5 h-5 text-park-mint" />
            <span>Settings</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Notifications Section */}
          <div className="space-y-4">
            <h3 className="text-white font-medium flex items-center space-x-2">
              <Bell className="w-4 h-4 text-park-mint" />
              <span>Notifiche</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">Notifiche push</Label>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">Notifiche generali</Label>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="space-y-4">
            <h3 className="text-white font-medium flex items-center space-x-2">
              <Shield className="w-4 h-4 text-park-mint" />
              <span>Privacy</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">Condivisione posizione</Label>
                <Switch
                  checked={settings.locationSharing}
                  onCheckedChange={(checked) => handleSettingChange('locationSharing', checked)}
                />
              </div>
            </div>
          </div>

          {/* App Settings */}
          <div className="space-y-4">
            <h3 className="text-white font-medium flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-park-mint" />
              <span>App</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">Prenotazione automatica</Label>
                <Switch
                  checked={settings.autoBooking}
                  onCheckedChange={(checked) => handleSettingChange('autoBooking', checked)}
                />
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="pt-4 border-t border-gray-600">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-park-card text-white border-gray-600 hover:bg-gray-600"
              >
                Termini di servizio
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-park-card text-white border-gray-600 hover:bg-gray-600"
              >
                Privacy Policy
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-park-card text-red-400 border-red-400 hover:bg-red-400/10"
              >
                Elimina Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
