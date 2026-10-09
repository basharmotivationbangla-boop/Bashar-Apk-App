import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { firebaseDb } from '../services/firebaseDb';
import { supabaseDb } from '../services/supabaseDb';
import { AppItem } from '../types';
import { AppCard } from '../components/AppCard';
import { AppReviewsSection } from '../components/AppReviewsSection';
import {
  Download,
  ShieldCheck,
  Star,
  Calendar,
  CheckCircle2,
  FileCode,
  Smartphone,
  HardDrive,
  User,
  Share2,
  ChevronRight,
  Sparkles,
  Layers,
  X,
  ExternalLink
} from 'lucide-react';

interface AppDetailsPageProps {
  slug: string;
}

export const AppDetailsPage: React.FC<AppDetailsPageProps> = ({ slug }) => {
  const { navigate, t, showToast } = useApp();
  const [app, setApp] = useState<(AppItem & { relatedApps?: AppItem[] }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError('');
    api.getApp(slug)
      .then((data) => {
        setApp(data);
        if (data.name) {
          document.title = `${data.name} ${data.version} APK Download - Bashar Apk App`;
        }
      })
      .catch((err) => {
        setError(err.message || 'App not found');
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  const handleStartDownload = () => {
    if (!app) return;
    setIsDownloading(true);

    // Provide immediate user feedback and trigger browser download
    setTimeout(() => {
      // Record download in Supabase & Firebase
      supabaseDb.recordDownload(app.id, app.name, app.version).catch(() => {});
      firebaseDb.recordDownload(app.id, app.name, app.version).catch(() => {});
      window.location.href = `/api/download/${app.slug}`;
      setIsDownloading(false);
      setDownloadSuccess(true);
      showToast(`Download started for ${app.name} (${app.version})`, 'success');
      // Update local download counter visually
      setApp((prev) => prev ? { ...prev, downloadCount: prev.downloadCount + 1 } : null);
    }, 800);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${app?.name} APK`,
        text: `Download ${app?.name} (${app?.version}) safely on Bashar Apk App`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'info');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="w-20 h-20 bg-slate-800 rounded-3xl mx-auto mb-4" />
        <div className="h-6 w-48 bg-slate-800 rounded mx-auto mb-2" />
        <div className="h-4 w-72 bg-slate-800 rounded mx-auto" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 inline-block mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Application Not Found</h2>
        <p className="text-xs text-slate-400 mt-2">
          The requested APK package does not exist or may have been unpublished.
        </p>
        <button
          onClick={() => navigate('/apps')}
          className="mt-6 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs"
        >
          Browse All Applications
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
        <button onClick={() => navigate('/')} className="hover:text-emerald-400 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <button onClick={() => navigate('/apps')} className="hover:text-emerald-400 transition-colors">
          Apps
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <button onClick={() => navigate(`/apps?category=${app.categoryId}`)} className="hover:text-emerald-400 transition-colors">
          {app.categoryName}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-200 font-medium truncate max-w-[200px]">{app.name}</span>
      </nav>

      {/* Main Hero Header Card */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="relative shrink-0">
              <img
                src={app.iconUrl}
                alt={app.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-2 ring-slate-700/80 shadow-2xl bg-slate-950"
              />
              {app.virusScanned && (
                <div
                  title="100% Virus Scanned & Signature Certified"
                  className="absolute -bottom-1 -right-1 bg-slate-950 rounded-full p-1 text-emerald-400 border border-slate-800"
                >
                  <ShieldCheck className="w-5 h-5 fill-emerald-950" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-100 tracking-tight">
                  {app.name}
                </h1>
                {app.isFeatured && (
                  <span className="text-[11px] font-semibold text-emerald-400 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                    Featured
                  </span>
                )}
              </div>

              {/* Developer & Unboxed Metadata */}
              <div className="flex items-center flex-wrap gap-2 text-xs text-slate-400">
                <span className="text-slate-300 font-medium">{app.developerName}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-emerald-400">{app.categoryName}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="font-mono tabular-nums">{app.version}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed pt-1">
                {app.shortDescription}
              </p>
            </div>
          </div>

          {/* Quick Share */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors shrink-0 self-start md:self-auto"
            title="Share this App"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Specs Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block mb-0.5">Rating</span>
            <div className="flex items-center gap-1.5 text-slate-200">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span className="font-mono tabular-nums font-bold text-sm">{app.rating.toFixed(1)}</span>
              <span className="text-slate-500">({app.ratingCount.toLocaleString()})</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 block mb-0.5">APK File Size</span>
            <div className="flex items-center gap-1.5 text-slate-200 font-mono tabular-nums font-semibold">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>{app.apkFileSize}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 block mb-0.5">Required Android</span>
            <div className="flex items-center gap-1.5 text-slate-200">
              <Smartphone className="w-4 h-4 text-violet-400" />
              <span>{app.androidRequirement}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 block mb-0.5">Verified Downloads</span>
            <div className="flex items-center gap-1.5 text-slate-200 font-mono tabular-nums font-semibold">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{app.downloadCount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Big Clear Download Call-to-Action */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-950/20 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8 rounded-b-3xl">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified APK · Clean & Scanned · Official Signature</span>
            </div>
            <p className="text-xs text-slate-400">
              Package: <span className="font-mono text-slate-300">{app.packageName}</span>
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <button
              onClick={handleStartDownload}
              disabled={isDownloading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>
                {isDownloading
                  ? t('downloading')
                  : `${t('download')} (${app.apkFileSize})`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Download Alert Confirmation */}
      {downloadSuccess && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3 text-xs text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold">Your APK download has initiated!</p>
              <p className="text-slate-400 mt-0.5">
                If the file did not begin automatically,{' '}
                <a
                  href={`/api/download/${app.slug}`}
                  className="text-emerald-400 underline font-semibold hover:text-emerald-300"
                >
                  click here to retry direct mirror
                </a>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDownloadSuccess(false)}
            className="text-slate-400 hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Description, Screenshots, What's New & Tech Specs */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column (2 Cols): Details, Screenshots, What's New */}
        <div className="lg:col-span-2 space-y-10">
          {/* Screenshots Gallery */}
          {app.screenshots && app.screenshots.length > 0 && (
            <section>
              <h2 className="text-lg font-bold font-display text-slate-100 mb-4">
                {t('screenshots')}
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                {app.screenshots.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedScreenshot(imgUrl)}
                    className="relative shrink-0 w-48 sm:w-56 h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 cursor-pointer group hover:border-emerald-500/50 transition-all shadow-lg"
                  >
                    <img
                      src={imgUrl}
                      alt={`${app.name} preview screenshot ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* What's New */}
          {app.whatsNew && (
            <section className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-slate-200">
                  {t('whatsNew')}
                </h2>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {app.whatsNew}
              </p>
            </section>
          )}

          {/* Full Description */}
          <section>
            <h2 className="text-lg font-bold font-display text-slate-100 mb-3">
              {t('overview')}
            </h2>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
              {app.fullDescription}
            </div>
          </section>

          {/* Key Features */}
          {app.features && app.features.length > 0 && (
            <section>
              <h2 className="text-lg font-bold font-display text-slate-100 mb-3">
                {t('keyFeatures')}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                {app.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Tags */}
          {app.tags && app.tags.length > 0 && (
            <section className="pt-4 border-t border-slate-800/60">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Tags & Keywords</h3>
              <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                {app.tags.map((tag, i) => (
                  <span
                    key={i}
                    onClick={() => navigate(`/apps?search=${encodeURIComponent(tag)}`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (1 Col): Technical Specifications & Developer Card */}
        <div className="space-y-6">
          {/* Technical Specs Table */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
            <h3 className="text-sm font-bold text-slate-100 mb-4 pb-2 border-b border-slate-800">
              {t('technicalDetails')}
            </h3>

            <dl className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <dt className="text-slate-400">Package Name</dt>
                <dd className="font-mono text-slate-200 text-right truncate max-w-[180px]">{app.packageName}</dd>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <dt className="text-slate-400">Version</dt>
                <dd className="font-mono text-slate-200">{app.version}</dd>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <dt className="text-slate-400">File Size</dt>
                <dd className="font-mono text-slate-200">{app.apkFileSize}</dd>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <dt className="text-slate-400">Requires Android</dt>
                <dd className="text-slate-200">{app.androidRequirement}</dd>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <dt className="text-slate-400">Release Date</dt>
                <dd className="text-slate-200">{app.releaseDate}</dd>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <dt className="text-slate-400">Last Updated</dt>
                <dd className="text-slate-200">{app.lastUpdatedDate}</dd>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <dt className="text-slate-400">Category</dt>
                <dd className="text-emerald-400">{app.categoryName}</dd>
              </div>

              <div className="flex justify-between py-1">
                <dt className="text-slate-400">Antivirus Status</dt>
                <dd className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Safe</span>
                </dd>
              </div>
            </dl>

            {/* SHA-256 Hash */}
            {app.sha256Checksum && (
              <div className="mt-4 pt-3 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                  SHA-256 Checksum
                </span>
                <p className="text-[10px] font-mono text-slate-400 bg-slate-950 p-2 rounded-lg break-all select-all">
                  {app.sha256Checksum}
                </p>
              </div>
            )}
          </div>

          {/* Developer Information Card */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
            <h3 className="text-sm font-bold text-slate-100 mb-3">Developer</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-slate-200 truncate">{app.developerName}</h4>
                {app.developerEmail && (
                  <p className="text-[11px] text-slate-400 truncate">{app.developerEmail}</p>
                )}
              </div>
            </div>

            {app.developerWebsite && (
              <a
                href={app.developerWebsite}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-center py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Visit Developer Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Community Reviews & Ratings (Firebase Firestore Synchronized) */}
      <AppReviewsSection appId={app.id} appName={app.name} />

      {/* Related Applications */}
      {app.relatedApps && app.relatedApps.length > 0 && (
        <section className="mt-16 pt-10 border-t border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-100">
                {t('relatedApps')}
              </h2>
              <p className="text-xs text-slate-400">
                More applications in {app.categoryName}
              </p>
            </div>

            <button
              onClick={() => navigate(`/apps?category=${app.categoryId}`)}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              {t('viewAll')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {app.relatedApps.map((rel) => (
              <AppCard key={rel.id} app={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Full-screen Lightbox Screenshot Modal */}
      {selectedScreenshot && (
        <div
          onClick={() => setSelectedScreenshot(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute -top-10 right-0 text-slate-300 hover:text-white p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedScreenshot}
              alt="Screenshot full preview"
              className="rounded-2xl max-h-[85vh] object-contain shadow-2xl ring-1 ring-slate-800"
            />
          </div>
        </div>
      )}
    </div>
  );
};
