import React from 'react';
import { AppItem } from '../types';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Download, Star } from 'lucide-react';

interface AppCardProps {
  app: AppItem;
  featured?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({ app, featured = false }) => {
  const { navigate, t } = useApp();

  const handleCardClick = () => {
    navigate(`/apps/${app.slug}`);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open detail page or trigger download link
    window.location.href = `/api/download/${app.slug}`;
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/30 p-5 transition-all duration-200 cursor-pointer hover:shadow-xl hover:shadow-emerald-950/20 ${
        featured ? 'ring-1 ring-emerald-500/20' : ''
      }`}
    >
      <div>
        {/* Top Header: App Icon + Title & Category */}
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <img
              src={app.iconUrl}
              alt={app.name}
              className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-800 group-hover:ring-emerald-500/40 transition-transform duration-200 group-hover:scale-105 bg-slate-950"
              loading="lazy"
            />
            {app.virusScanned && (
              <div
                title="100% Virus Scanned & Cryptographically Signed"
                className="absolute -bottom-1 -right-1 bg-slate-950 rounded-full p-0.5 text-emerald-400"
              >
                <ShieldCheck className="w-4 h-4 fill-emerald-950" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
              {app.name}
            </h3>

            {/* Zero-Pill Unboxed Clean Metadata */}
            <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-400 mt-1">
              <span>{app.categoryName}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono tabular-nums">{app.version}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono tabular-nums">{app.apkFileSize}</span>
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="mt-3 text-xs leading-relaxed text-slate-400 line-clamp-2">
          {app.shortDescription}
        </p>
      </div>

      {/* Footer stats & Download CTA */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-mono tabular-nums font-semibold">{app.rating.toFixed(1)}</span>
          </div>
          <span aria-hidden="true" className="text-slate-700">|</span>
          <span className="font-mono tabular-nums text-slate-400">
            {app.downloadCount >= 1000
              ? `${(app.downloadCount / 1000).toFixed(1)}k`
              : app.downloadCount}{' '}
            {t('downloads')}
          </span>
        </div>

        <button
          onClick={handleDownloadClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 transition-all duration-150 shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t('download')}</span>
        </button>
      </div>
    </div>
  );
};
