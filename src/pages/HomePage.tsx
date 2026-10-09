import React, { useEffect, useState } from 'react';
import { Hero } from '../components/Hero';
import { AppCard } from '../components/AppCard';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { AppItem } from '../types';
import {
  Sparkles,
  Flame,
  Clock,
  ArrowRight,
  ShieldCheck,
  Upload,
  CheckCircle2,
  Lock,
  DownloadCloud
} from 'lucide-react';
import defaultLogo from '../assets/images/bashar_apk_pro_logo_1791555288229.jpg';

export const HomePage: React.FC = () => {
  const { settings, navigate, t } = useApp();
  const [featuredApps, setFeaturedApps] = useState<AppItem[]>([]);
  const [popularApps, setPopularApps] = useState<AppItem[]>([]);
  const [latestApps, setLatestApps] = useState<AppItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logoErr, setLogoErr] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, popRes, lateRes] = await Promise.all([
          api.getApps({ featured: true, limit: 4 }),
          api.getApps({ popular: true, sort: 'popular', limit: 6 }),
          api.getApps({ sort: 'newest', limit: 6 })
        ]);
        setFeaturedApps(featRes.apps);
        setPopularApps(popRes.apps);
        setLatestApps(lateRes.apps);
      } catch (err) {
        console.error('Failed to load apps for homepage', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalAppsCount = featuredApps.length + popularApps.length + latestApps.length;
  const brandImg = (!logoErr && (settings.logoUrl || '/uploads/logo.png')) || defaultLogo;

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section with Prominent Brand Image Showcase */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* 2. Featured Apps Section (When apps exist) */}
        {featuredApps.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-100">
                    Featured Applications
                  </h2>
                  <p className="text-xs text-slate-400">
                    Hand-picked, high-utility Android tools verified by our team
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/apps?filter=featured')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
              >
                <span>{t('viewAll')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredApps.map((app) => (
                <AppCard key={app.id} app={app} featured />
              ))}
            </div>
          </section>
        )}

        {/* 3. Popular Apps Section (When apps exist) */}
        {popularApps.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-100">
                    {t('popularApps')}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Most downloaded and top rated APKs worldwide
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/apps?filter=popular')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
              >
                <span>{t('viewAll')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {popularApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </section>
        )}

        {/* 4. Latest Updates Section (When apps exist) */}
        {latestApps.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-100">
                    {t('latestUpdates')}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Recently uploaded and upgraded versions
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/apps?filter=latest')}
                className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 group"
              >
                <span>{t('viewAll')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </section>
        )}

        {/* 5. Official Platform Verification Card (Always beautifully showcased) */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Brand Image */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-emerald-500/30 to-cyan-500/30 blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden ring-2 ring-emerald-500/40 bg-slate-950 shadow-2xl">
                  <img
                    src={brandImg}
                    alt={settings.name || 'Bashar Apk App'}
                    onError={() => setLogoErr(true)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-semibold text-emerald-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Official Verified Hub</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Action */}
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>অফিসিয়াল অ্যান্ড্রয়েড প্ল্যাটফর্ম</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-100">
                {settings.name || 'Bashar Apk App'} - বিশ্বস্ত APK ডাউনলোড হাব
              </h2>

              <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                এই প্ল্যাটফর্মে আপলোড করা সকল অ্যান্ড্রয়েড অ্যাপ ও ইউটিলিটি টুলস সার্বক্ষণিকভাবে সিকিউর ও মাল্টি-লেয়ার অ্যান্টিভাইরাস দ্বারা ভেরিফাইড থাকে। অ্যাপস আপলোড করার পর থেকে সরাসরি হোমপেজ ও অ্যাপস সেকশনে পাওয়া যাবে।
              </p>

              {/* Security highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-200">১০০% নিরাপদ</h4>
                    <p className="text-[11px] text-slate-400">ম্যালওয়্যার ও স্পাইওয়্যার মুক্ত</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                  <DownloadCloud className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-200">হাই-স্পিড ডাউনলোড</h4>
                    <p className="text-[11px] text-slate-400">সরাসরি ডিরেক্ট APK মিরর</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-200">ভেরিফাইড সিগনেচার</h4>
                    <p className="text-[11px] text-slate-400">SHA-256 ইন্টিগ্রিটি চেক</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => navigate('/admin/apps/new')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
                >
                  <Upload className="w-4 h-4" />
                  <span>নতুন APK আপলোড করুন</span>
                </button>

                <button
                  onClick={() => navigate('/apps')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all"
                >
                  <span>সকল অ্যাপস দেখুন</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
