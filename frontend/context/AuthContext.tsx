'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the token exists in localStorage when the app loads
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('authToken', 'your-jwt-token'); // Store the token in localStorage
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('authToken'); // Remove the token from localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};