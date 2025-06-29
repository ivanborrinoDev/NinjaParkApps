import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-ninja-dark flex flex-col justify-center items-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
          <img src="/logo.png" alt="NinjaPark Logo" className="w-20 h-20 object-contain" />
        </div>
        
        {/* Loading Spinner */}
        <LoadingSpinner size="lg" className="mb-6" />
        
        <h3 className="text-xl font-semibold text-white mb-2">Setting up your account...</h3>
        <p className="text-gray-400">This will only take a moment</p>
      </div>
    </div>
  );
}
