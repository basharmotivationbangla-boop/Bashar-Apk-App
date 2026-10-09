import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import { api } from '../services/api';
import { AppItem } from '../types';
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Lock,
  Globe,
  ArrowRight,
  ShieldCheck,
  DownloadCloud
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentPath, navigate, t, language, setLanguage, theme, toggleTheme } = useApp();
  const { isAuthenticated, user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AppItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Live search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(async () => {
      try {
        const res = await api.getApps({ search: searchQuery.trim(), limit: 5 });
        setSearchResults(res.apps);
      } catch (e) {
        console.warn('Search error', e);
      } finally {
        setIsSearching(false);
      }
    }, 220);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  const navLinks = [
    { label: t('home'), path: '/' },
    { label: t('apps'), path: '/apps' },
    { label: t('categories'), path: '/categories' },
    { label: t('popularApps'), path: '/apps?filter=popular' },
    { label: t('latestUpdates'), path: '/apps?filter=latest' },
    { label: t('about'), path: '/about' }
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/apps?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSelectApp = (slug: string) => {
    navigate(`/apps/${slug}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <BrandLogo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`text-sm font-medium transition-colors hover:text-emerald-400 ${
                    isActive ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2.5">
            {/* Search Trigger Button */}
            <div className="relative" ref={searchContainerRef}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
                title="Search applications"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Live Search Modal/Dropdown */}
              {searchOpen && (
                <div className="absolute right-0 top-12 w-[340px] sm:w-[420px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('searchPlaceholder')}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </form>

                  {/* Results list */}
                  <div className="mt-2 max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                    {isSearching ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        Searching verified APKs...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div>
                        {searchResults.map((app) => (
                          <div
                            key={app.id}
                            onClick={() => handleSelectApp(app.slug)}
                            className="flex items-center gap-3 p-2.5 hover:bg-slate-800/70 rounded-xl cursor-pointer transition-colors group"
                          >
                            <img
                              src={app.iconUrl}
                              alt={app.name}
                              className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700 group-hover:ring-emerald-500/50"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400 truncate">
                                  {app.name}
                                </h4>
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              </div>
                              <p className="text-xs text-slate-400 truncate">
                                {app.categoryName} · {app.version} · {app.apkFileSize}
                              </p>
                            </div>
                            <DownloadCloud className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                          </div>
                        ))}
                        <button
                          onClick={handleSearchSubmit}
                          className="w-full mt-2 py-2 text-center text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1"
                        >
                          View all results <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : searchQuery.trim() ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        {t('noAppsFound')}
                      </div>
                    ) : (
                      <div className="py-4 px-2 text-xs text-slate-400">
                        Try searching for <span className="text-emerald-400">Video Downloader</span>, <span className="text-emerald-400">Bangla Keyboard</span>, or <span className="text-emerald-400">VPN</span>.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="relative group">
              <button
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                title={t('language')}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
              title={t('switchTheme')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Admin Subtle Access (Passwordless) */}
            <button
              onClick={() => navigate('/admin')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-emerald-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  currentPath === link.path
                    ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleNavClick('/admin')}
                className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-400 px-3 py-2 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Dashboard</span>
              </button>

              <button
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="text-xs text-slate-300 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800"
              >
                {language === 'en' ? 'বাংলা সংস্করণ' : 'English Version'}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
