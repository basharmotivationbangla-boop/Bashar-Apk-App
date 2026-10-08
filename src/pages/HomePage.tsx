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
  FolderKanban,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  MessageSquare,
  Radio
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { categories, navigate, t } = useApp();
  const [featuredApps, setFeaturedApps] = useState<AppItem[]>([]);
  const [popularApps, setPopularApps] = useState<AppItem[]>([]);
  const [latestApps, setLatestApps] = useState<AppItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* 2. Featured Apps Section */}
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

        {/* 3. Categories Showcase */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-slate-100">
                  Explore by Category
                </h2>
                <p className="text-xs text-slate-400">
                  Find the exact digital solution you need by function
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/categories')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
            >
              <span>{t('viewAll')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {categories.slice(0, 6).map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/apps?category=${cat.id}`)}
                className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/30 transition-all cursor-pointer group text-center flex flex-col items-center justify-center"
              >
                <div
                  className="w-10 h-10 rounded-xl mb-2 flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                >
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] font-mono tabular-nums text-slate-500 mt-0.5">
                  {cat.appCount || 0} apps
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Popular Apps Section (When apps exist) */}
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

        {/* 5. Latest Updates Section (When apps exist) */}
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

        {/* Clean Welcoming State if no apps yet */}
        {!isLoading && featuredApps.length === 0 && popularApps.length === 0 && latestApps.length === 0 && (
          <section className="p-8 sm:p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center max-w-3xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-100">
              Marketplace Ready for Applications
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              New verified Android applications, tools, and digital solutions are ready to be uploaded by the administration. All systems, direct mirrors, and cryptographic checks are active.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/admin/login')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold text-xs border border-emerald-500/30 transition-all"
              >
                <span>Upload New APK via Admin Panel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>
        )}

        {/* 6. Live Firebase Community & APK Requests */}
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-teal-950/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Firebase Firestore Real-Time Database</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-100">
              Have an App Request or Question?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Join the live community chat on the bottom right. User messages, app ratings, and requests are saved instantly in Firebase Firestore.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                const chatBtn = document.querySelector('button[title="Open Live Chat"]') as HTMLButtonElement || document.querySelector('button.group') as HTMLButtonElement;
                if (chatBtn) chatBtn.click();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950" />
              <span>Open Live Chat</span>
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-colors"
            >
              Contact Support
            </button>
          </div>
        </section>

        {/* 7. Security Assurance & Trust Pillars */}
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950 p-8 sm:p-10 relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-3 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
              <span>Platform Security Guarantee</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 tracking-tight">
              Why Millions Trust Bashar Apk App
            </h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              We operate an uncompromising verification pipeline. Before any APK becomes downloadable, it passes automated static virus checks, signature validation, and integrity hashing.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero repackaging or adware injection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Official developer signature intact</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>SHA-256 cryptographic hashes public</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Blazing-fast verified direct CDN links</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
