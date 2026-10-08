import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ArrowRight, Sparkles, ShieldCheck, DownloadCloud, Layers } from 'lucide-react';

export const Hero: React.FC = () => {
  const { settings, navigate, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/apps?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/apps');
    }
  };

  return (
    <div className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Subtle tech background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle top indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Verified Android Application Marketplace</span>
        </div>

        {/* Large Headline */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight max-w-4xl mx-auto text-balance">
          {settings.heroTitle || 'Discover Useful Apps, Tools & Digital Solutions'}
        </h1>

        {/* Short supporting description */}
        <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {settings.heroSubtitle ||
            'Download trusted and useful Android applications with complete details, screenshots, version information, and direct verified access.'}
        </p>

        {/* Hero Interactive Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative flex items-center shadow-2xl">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-slate-900/95 border border-slate-700/80 rounded-2xl pl-12 pr-32 py-4 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
            >
              Search
            </button>
          </form>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={() => navigate('/apps')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20"
          >
            <span>{settings.heroExploreText || t('exploreApps')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/apps?filter=latest')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all"
          >
            <span>{settings.heroLatestText || t('latestApps')}</span>
            <DownloadCloud className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Micro Value Proposition Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/40 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Virus Scanned APKs</span>
          </div>
          <div className="flex items-center gap-2">
            <DownloadCloud className="w-4 h-4 text-cyan-400" />
            <span>Direct High-Speed Downloads</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-400" />
            <span>Original Package Signatures</span>
          </div>
        </div>
      </div>
    </div>
  );
};
