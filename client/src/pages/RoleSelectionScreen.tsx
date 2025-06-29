import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface RoleSelectionScreenProps {
  onRoleSelected: () => void;
}

export function RoleSelectionScreen({ onRoleSelected }: RoleSelectionScreenProps) {
  const [selectedRole, setSelectedRole] = useState<"host" | "guest" | null>(null);
  const [loading, setLoading] = useState(false);
  const { firebaseUser, setUser } = useAuth();
  const { toast } = useToast();

  const handleContinue = async () => {
    if (!selectedRole || !firebaseUser) return;

    setLoading(true);
    try {
      // Create user in our database
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          role: selectedRole,
          firebaseUid: firebaseUser.uid,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        toast({
          title: "Welcome!",
          description: `You're now set up as a ${selectedRole}.`,
        });
        onRoleSelected();
      } else {
        throw new Error("Failed to create user");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set up your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ninja-dark flex flex-col justify-center items-center px-6 py-12">
      <div className="text-center max-w-md">
        {/* Welcome Message */}
        <div className="mb-12">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <img src="/logo.png" alt="NinjaPark Logo" className="w-16 h-16 object-contain" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Welcome to NinjaPark!</h2>
          <p className="text-gray-300">How would you like to use the app?</p>
        </div>

        {/* Role Cards */}
        <div className="space-y-4 mb-8">
          {/* Host Card */}
          <div
            onClick={() => setSelectedRole("host")}
            className={`bg-ninja-gray/90 backdrop-blur-lg rounded-2xl p-6 border cursor-pointer transition-all duration-200 hover:bg-ninja-gray ${
              selectedRole === "host"
                ? "border-ninja-mint bg-ninja-gray"
                : "border-gray-700 hover:border-ninja-mint"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-ninja-mint/20 w-12 h-12 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-ninja-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white">Host</h3>
                <p className="text-gray-400">Rent out your parking space</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Guest Card */}
          <div
            onClick={() => setSelectedRole("guest")}
            className={`bg-ninja-gray/90 backdrop-blur-lg rounded-2xl p-6 border cursor-pointer transition-all duration-200 hover:bg-ninja-gray ${
              selectedRole === "guest"
                ? "border-ninja-mint bg-ninja-gray"
                : "border-gray-700 hover:border-ninja-mint"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-ninja-blue/20 w-12 h-12 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-ninja-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1.5l1.6 7.2a1 1 0 001 .8h7.8a1 1 0 001-.8L17.5 7H19a1 1 0 001-1V5a1 1 0 00-1-1H3zM4 5h12v1H4V5z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white">Guest</h3>
                <p className="text-gray-400">Find and book parking spots</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedRole || loading}
          className="w-full bg-ninja-mint hover:bg-ninja-mint-dark text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : null}
          Continue
        </button>
      </div>
    </div>
  );
}
