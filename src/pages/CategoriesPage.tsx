import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, FolderKanban, Cpu, Layers } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, navigate, t } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
      <div className="pb-8 border-b border-slate-800/80">
        <h1 className="text-3xl font-extrabold font-display text-slate-100">
          {t('categories')}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore specialized Android application directories curated for productivity, security, and utility
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/apps?category=${cat.id}`)}
            className="group p-6 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                >
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-400 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50">
                  {cat.appCount || 0} apps
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                {cat.name}
              </h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                {cat.description || 'Verified Android applications engineered for speed and performance.'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
              <span>Browse Applications</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
