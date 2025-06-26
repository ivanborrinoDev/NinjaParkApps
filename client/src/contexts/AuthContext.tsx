import React, { createContext, useContext, useState } from 'react';

interface User {
  uid: string;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate authentication
      const user: User = {
        uid: `user_${Date.now()}`,
        email,
        displayName: email.split('@')[0],
      };
      setCurrentUser(user);
      localStorage.setItem('ninjapark_user', JSON.stringify(user));
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      // Simulate registration
      const user: User = {
        uid: `user_${Date.now()}`,
        email,
        displayName: name || email.split('@')[0],
      };
      setCurrentUser(user);
      localStorage.setItem('ninjapark_user', JSON.stringify(user));
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('ninjapark_user');
  };

  // Check for stored user on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('ninjapark_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('ninjapark_user');
      }
    }
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
