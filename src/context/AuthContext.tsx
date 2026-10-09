import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types';
import { api, getAuthToken } from '../services/api';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (pass?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    try {
      const res = await api.getMe();
      if (res.authenticated && res.user) {
        setUser(res.user);
      } else {
        // Passwordless admin: auto-login
        const loginRes = await api.login('');
        if (loginRes.user) {
          setUser(loginRes.user);
        }
      }
    } catch {
      // Direct local admin fallback per user specification ("admin পাসওয়ার্ড দিবেন না")
      setUser({
        id: 'admin-1',
        username: 'admin',
        email: 'admin@local',
        role: 'superadmin'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (pass: string = '') => {
    try {
      const res = await api.login(pass);
      setUser(res.user);
    } catch {
      setUser({
        id: 'admin-1',
        username: 'admin',
        email: 'admin@local',
        role: 'superadmin'
      });
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
