import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  DownloadCloud,
  CheckCircle2,
  Lock
} from 'lucide-react';
import defaultLogo from '../assets/images/bashar_apk_official_logo_1791554816506.jpg';

export const Hero: React.FC = () => {
  const { settings, navigate, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [imgError, setImgError] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/apps?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/apps');
    }
  };

  const imageSrc = (!imgError && (settings.logoUrl || '/uploads/logo.png')) || defaultLogo;

  return (
    <div className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-20 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headlines, Search, CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Top indicator badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Android Application Marketplace</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight text-balance">
              {settings.heroTitle || 'Discover Useful Apps, Tools & Digital Solutions'}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {settings.heroSubtitle ||
                'Download trusted and useful Android applications with complete details, screenshots, version information, and direct verified access.'}
            </p>

            {/* Interactive Search Bar */}
            <div className="max-w-2xl mx-auto lg:mx-0 pt-2">
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
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
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

            {/* Trust highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Malware-Free</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Original Signatures</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-teal-400" />
                <span>Direct High-Speed APK</span>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Uploaded Image Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-sm sm:max-w-md">
              {/* Outer Ambient Glow */}
              <div className="absolute -inset-2 sm:-inset-3 rounded-3xl bg-gradient-to-r from-emerald-500/30 via-teal-500/25 to-cyan-500/30 blur-2xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

              {/* Main Card */}
              <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/95 to-slate-950/95 border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-5">
                
                {/* Verified Header Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Official Platform Seal</span>
                </div>

                {/* The Uploaded Image Frame */}
                <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden ring-2 ring-emerald-500/40 shadow-2xl shadow-emerald-500/20 bg-slate-950 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={imageSrc}
                    alt={settings.name || 'Bashar Apk App'}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover select-none"
                  />
                  {/* Subtle glass reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Brand Title & Caption */}
                <div className="space-y-1.5">
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-100 tracking-tight">
                    {settings.name || 'Bashar Apk App'}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
                    {settings.tagline || 'Trusted Android Apps, Tools & Digital Solutions'}
                  </p>
                </div>

                {/* Verification Chips */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Verified Files</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Fast Mirrors</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
