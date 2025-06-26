
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Bell, Check } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: "Prenotazione confermata",
      message: "La tua prenotazione per Downtown Garage è stata confermata",
      time: "2 ore fa",
      read: false
    },
    {
      id: 2,
      title: "Parcheggio disponibile",
      message: "Un parcheggio nelle vicinanze è ora disponibile",
      time: "4 ore fa",
      read: true
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-park-surface border-gray-600 max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-white text-xl font-semibold flex items-center space-x-2">
            <Bell className="w-5 h-5 text-park-mint" />
            <span>Notifications</span>
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
        
        <CardContent className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.read 
                  ? 'bg-park-card border-gray-600' 
                  : 'bg-park-mint/10 border-park-mint/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-medium">{notification.title}</h4>
                  <p className="text-gray-300 text-sm mt-1">{notification.message}</p>
                  <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-park-mint rounded-full ml-2 mt-2"></div>
                )}
              </div>
            </div>
          ))}
          
          {notifications.length === 0 && (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nessuna notifica</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
