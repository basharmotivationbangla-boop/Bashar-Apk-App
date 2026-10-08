import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { AppItem } from '../types';
import { AppCard } from '../components/AppCard';
import { Search, Filter, ArrowUpDown, X, Sparkles, Flame, Clock } from 'lucide-react';

export const AppsPage: React.FC = () => {
  const { categories, t } = useApp();

  const [apps, setApps] = useState<AppItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & State
  const [search, setSearch] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('search') || '';
  });
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category') || 'all';
  });
  const [activeFilter, setActiveFilter] = useState<'all' | 'featured' | 'popular' | 'latest'>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const f = urlParams.get('filter');
    if (f === 'featured' || f === 'popular' || f === 'latest') return f;
    return 'all';
  });
  const [sortBy, setSortBy] = useState<string>('newest');
  const [page, setPage] = useState(1);
  const limit = 12;

  const fetchApps = async () => {
    setIsLoading(true);
    try {
      const res = await api.getApps({
        search: search.trim(),
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        featured: activeFilter === 'featured' ? true : undefined,
        popular: activeFilter === 'popular' ? true : undefined,
        sort: activeFilter === 'latest' ? 'newest' : sortBy,
        page,
        limit
      });
      setApps(res.apps);
      setTotal(res.total);
    } catch (err) {
      console.error('Failed to load apps', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [search, selectedCategory, activeFilter, sortBy, page]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setActiveFilter('all');
    setSortBy('newest');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-800/80">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-slate-100">
            {t('apps')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse verified APK applications with direct high-speed download mirrors
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono tabular-nums">
          <span className="text-emerald-400 font-semibold">{total}</span> {t('totalAvailable')}
        </div>
      </div>

      {/* Control Bar: Search + Filter Tabs + Sort */}
      <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs">
          <button
            onClick={() => { setActiveFilter('all'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Apps
          </button>
          <button
            onClick={() => { setActiveFilter('featured'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 whitespace-nowrap ${
              activeFilter === 'featured'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured</span>
          </button>
          <button
            onClick={() => { setActiveFilter('popular'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 whitespace-nowrap ${
              activeFilter === 'popular'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Popular</span>
          </button>
          <button
            onClick={() => { setActiveFilter('latest'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 whitespace-nowrap ${
              activeFilter === 'latest'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Latest</span>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="newest">{t('sortNewest')}</option>
            <option value="popular">{t('sortPopular')}</option>
            <option value="rating">{t('sortRating')}</option>
            <option value="name">{t('sortName')}</option>
          </select>
        </div>
      </div>

      {/* Category Horizontal Filter Tags */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => { setSelectedCategory('all'); setPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition-all ${
            selectedCategory === 'all'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
          }`}
        >
          {t('allCategories')}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Apps Grid */}
      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : apps.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {apps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>

            {/* Pagination */}
            {total > limit && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
                >
                  Previous
                </button>
                <span className="text-xs font-mono text-slate-400">
                  Page {page} of {Math.ceil(total / limit)}
                </span>
                <button
                  disabled={page >= Math.ceil(total / limit)}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center rounded-2xl border border-slate-800/80 bg-slate-900/30 p-8">
            <h3 className="text-base font-semibold text-slate-200">{t('noAppsFound')}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              We couldn't find any APKs matching your active query and category filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
