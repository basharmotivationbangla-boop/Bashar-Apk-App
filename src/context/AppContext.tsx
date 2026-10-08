import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WebsiteSettings, CategoryItem } from '../types';
import { api } from '../services/api';
import { translations, Language } from '../utils/translations';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  settings: WebsiteSettings;
  updateLocalSettings: (newSettings: WebsiteSettings) => void;
  categories: CategoryItem[];
  refreshCategories: () => Promise<void>;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currentPath: string;
  navigate: (path: string) => void;
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const defaultSettings: WebsiteSettings = {
  name: 'Bashar Apk App',
  tagline: 'Trusted Android Apps, Tools & Digital Solutions',
  description: 'Download verified, secure, and high-performance Android APK applications with full version history, direct mirrors, and technical specifications.',
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '#10b981',
  secondaryColor: '#06b6d4',
  heroTitle: 'Discover Useful Apps, Tools & Digital Solutions',
  heroSubtitle: 'Download trusted and useful Android applications with complete details, screenshots, version information, and direct verified access.',
  heroExploreText: 'Explore Apps',
  heroLatestText: 'Latest Updates',
  footerText: '© 2026 Bashar Apk App. All rights reserved. Providing safe, verified, and high-speed Android applications for worldwide users.',
  contactEmail: 'basharmotivationbangla@gmail.com',
  contactPhone: '+880 1700 000000',
  contactAddress: 'Dhaka, Bangladesh · Global Digital Network',
  socialLinks: {
    facebook: 'https://facebook.com/basharmotivationbangla',
    twitter: 'https://twitter.com/basharapk',
    telegram: 'https://t.me/basharapkapp',
    youtube: 'https://youtube.com/@basharmotivationbangla',
    github: 'https://github.com/basharapk',
    linkedin: 'https://linkedin.com/company/basharapk'
  },
  seo: {
    metaTitle: 'Bashar Apk App - Trusted Android Apps & Digital Solutions',
    metaDescription: 'Discover and download trusted, high-performance Android APK applications, tools, and digital solutions with version history and verified security.',
    metaKeywords: 'bashar apk app, android apk download, trusted apk, free apps'
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('bashar_lang') as Language) || 'en';
  });
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('bashar_theme') as 'dark' | 'light') || 'dark';
  });
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('bashar_theme', theme);
  }, [theme]);

  // Sync settings & categories from backend
  useEffect(() => {
    api.getSettings()
      .then((data) => {
        if (data && data.name) {
          setSettings(data);
          // Dynamically update document title if on home
          if (window.location.pathname === '/') {
            document.title = `${data.name} - ${data.tagline}`;
          }
          // Update favicon if custom one provided
          if (data.faviconUrl) {
            const favicon = document.getElementById('app-favicon') as HTMLLinkElement;
            if (favicon) favicon.href = data.faviconUrl;
          }
        }
      })
      .catch((e) => console.warn('Could not fetch settings', e));

    refreshCategories();
  }, []);

  const refreshCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (e) {
      console.warn('Could not fetch categories', e);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bashar_lang', lang);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Browser navigation (Back / Forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateLocalSettings = (newSettings: WebsiteSettings) => {
    setSettings(newSettings);
    if (newSettings.name) {
      document.title = `${newSettings.name} - ${newSettings.tagline}`;
    }
    if (newSettings.faviconUrl) {
      const favicon = document.getElementById('app-favicon') as HTMLLinkElement;
      if (favicon) favicon.href = newSettings.faviconUrl;
    }
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateLocalSettings,
        categories,
        refreshCategories,
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        currentPath,
        navigate,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
