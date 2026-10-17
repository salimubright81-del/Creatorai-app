import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, getStoredToken } from '../services/api';
import { User, UserLimits } from '../types';

interface AuthContextType {
  user: User | null;
  limits: UserLimits | null;
  isLoading: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; niche?: string; country?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  authModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'forgot';
  openAuthModal: (tab?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  pricingModalOpen: boolean;
  openPricingModal: () => void;
  closePricingModal: () => void;
  profileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [limits, setLimits] = useState<UserLimits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('creatorai_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('hub');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('creatorai_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const refreshUser = async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLimits(null);
      setIsLoading(false);
      return;
    }
    try {
      const data = await api.getCurrentUser();
      setUser(data.user);
      setLimits(data.limits);
    } catch (err) {
      console.warn('Failed to load current user, clearing token:', err);
      api.logout();
      setUser(null);
      setLimits(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    setUser(res.user);
    await refreshUser();
    setAuthModalOpen(false);
  };

  const register = async (data: { name: string; email: string; password: string; niche?: string; country?: string }) => {
    const res = await api.register(data);
    setUser(res.user);
    await refreshUser();
    setAuthModalOpen(false);
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setLimits(null);
  };

  const openAuthModal = (tab: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => setAuthModalOpen(false);
  const openPricingModal = () => setPricingModalOpen(true);
  const closePricingModal = () => setPricingModalOpen(false);
  const openProfileModal = () => setProfileModalOpen(true);
  const closeProfileModal = () => setProfileModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        limits,
        isLoading,
        theme,
        toggleTheme,
        login,
        register,
        logout,
        refreshUser,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        pricingModalOpen,
        openPricingModal,
        closePricingModal,
        profileModalOpen,
        openProfileModal,
        closeProfileModal,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
