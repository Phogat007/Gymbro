
import React, { createContext, useContext } from 'react';
import { UserData, GymContextType } from './types';

// Create the context
export const GymContext = createContext<GymContextType | null>(null);

// Export the provider component declaration (implementation will be in store.tsx)
export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Implementation moved to store.tsx
  return null;
};

// Custom hook to use the gym context
export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};
