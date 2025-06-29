import React, { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import { LoginScreen } from "@/pages/LoginScreen";
import { RoleSelectionScreen } from "@/pages/RoleSelectionScreen";
import { LoadingScreen } from "@/pages/LoadingScreen";
import { MainApp } from "@/pages/MainApp";

function AppContent() {
  const { firebaseUser, user, loading } = useAuth();
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (!loading && firebaseUser && !user) {
      // User is authenticated but not in our database
      setShowRoleSelection(true);
    }
  }, [firebaseUser, user, loading]);

  const handleLoginSuccess = () => {
    setShowRoleSelection(true);
  };

  const handleRoleSelected = () => {
    setShowRoleSelection(false);
    setShowLoading(true);
    
    // Simulate loading time
    setTimeout(() => {
      setShowLoading(false);
    }, 2000);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (showLoading) {
    return <LoadingScreen />;
  }

  if (showRoleSelection) {
    return <RoleSelectionScreen onRoleSelected={handleRoleSelected} />;
  }

  if (!firebaseUser || !user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return <MainApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppProvider>
            <Toaster />
            <AppContent />
          </AppProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
