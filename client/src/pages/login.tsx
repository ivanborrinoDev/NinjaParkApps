import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Car } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { currentUser, loading, signIn, signUp } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      setLocation('/map');
    }
  }, [currentUser, setLocation]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      if (isSignUp) {
        await signUp(email, password);
        toast({
          title: "Welcome to NinjaPark!",
          description: "Your account has been created successfully.",
        });
      } else {
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-park-dark">
      {/* Urban Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-park-dark via-park-surface to-park-dark"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-park-dark bg-opacity-80"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 py-16">
        {/* Logo */}
        <div className="mb-12 text-center animate-in fade-in duration-700">
          <div className="w-24 h-24 mx-auto mb-6 bg-park-mint rounded-2xl flex items-center justify-center shadow-2xl">
            <Car className="text-park-dark text-3xl w-10 h-10" />
          </div>
          <h1 className="text-4xl font-montserrat font-bold text-white mb-2">NinjaPark</h1>
          <p className="text-park-mint text-lg font-medium">Smart Urban Parking</p>
        </div>
        
        {/* Login Form */}
        <Card className="w-full max-w-sm bg-park-surface border-gray-600 animate-in fade-in duration-700 delay-200">
          <CardContent className="p-6 space-y-6">
            
            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-park-surface border-gray-600 rounded-xl py-4 px-6 text-white placeholder-gray-400 focus:border-park-mint"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-park-surface border-gray-600 rounded-xl py-4 px-6 text-white placeholder-gray-400 focus:border-park-mint"
                required
              />
              <Button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-park-mint text-park-dark py-4 px-6 rounded-xl font-medium text-lg hover:bg-opacity-90 transition-colors shadow-lg"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>
            
            {/* Toggle Sign Up */}
            <p className="text-center text-gray-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-park-mint font-medium hover:underline"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
