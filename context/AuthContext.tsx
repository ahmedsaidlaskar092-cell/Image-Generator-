import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { storeService } from '../services/storeService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => void;
  isAdmin: boolean;
  showDailyReward: boolean;
  closeDailyReward: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDailyReward, setShowDailyReward] = useState(false);

  const initAuth = () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        // Check for daily reward
        const rewarded = storeService.checkDailyReward(currentUser.id);
        if (rewarded) {
           setShowDailyReward(true);
        }
        // Fetch fresh user data potentially updated by checkDailyReward
        const updatedUser = storeService.getUserById(currentUser.id);
        setUser(updatedUser || currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth init error", error);
    }
  };

  useEffect(() => {
    initAuth();
    // Artificial delay for splash screen effect on first load
    setTimeout(() => {
       setIsLoading(false);
    }, 2000);
  }, []);

  const refreshUser = () => {
    if (user) {
      const updatedUser = storeService.getUserById(user.id);
      if (updatedUser) setUser(updatedUser);
    }
  };

  const login = async (email: string, password: string) => {
    const loggedInUser = await authService.login(email, password);
    
    // Check daily reward immediately after login
    const rewarded = storeService.checkDailyReward(loggedInUser.id);
    if (rewarded) {
      setShowDailyReward(true);
      // Update user state with new coin balance
      const updatedUser = storeService.getUserById(loggedInUser.id);
      setUser(updatedUser || loggedInUser);
    } else {
      setUser(loggedInUser);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const newUser = await authService.signup(name, email, password);
    setUser(newUser);
    // Signup usually includes a bonus, we can show reward modal or just let them start
    setShowDailyReward(true); 
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setShowDailyReward(false);
  };

  const closeDailyReward = () => setShowDailyReward(false);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, refreshUser, isAdmin, showDailyReward, closeDailyReward }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};