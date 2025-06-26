
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Favorite } from '../types/favorites';

interface FavoritesContextType {
  favorites: Favorite[];
  toggleFavorite: (parkingId: string) => void;
  isFavorite: (parkingId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    if (currentUser) {
      // Load favorites from localStorage for demo
      const stored = localStorage.getItem(`favorites_${currentUser.uid}`);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    }
  }, [currentUser]);

  const toggleFavorite = (parkingId: string) => {
    if (!currentUser) return;

    const existingFavorite = favorites.find(f => f.parkingId === parkingId);
    
    if (existingFavorite) {
      // Remove favorite
      const newFavorites = favorites.filter(f => f.parkingId !== parkingId);
      setFavorites(newFavorites);
      localStorage.setItem(`favorites_${currentUser.uid}`, JSON.stringify(newFavorites));
    } else {
      // Add favorite
      const newFavorite: Favorite = {
        id: `fav_${Date.now()}`,
        userId: currentUser.uid,
        parkingId,
        createdAt: new Date()
      };
      const newFavorites = [...favorites, newFavorite];
      setFavorites(newFavorites);
      localStorage.setItem(`favorites_${currentUser.uid}`, JSON.stringify(newFavorites));
    }
  };

  const isFavorite = (parkingId: string) => {
    return favorites.some(f => f.parkingId === parkingId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
