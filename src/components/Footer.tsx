import React from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import {
  ShieldCheck,
  Zap,
  Lock,
  Send,
  ExternalLink,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, categories, navigate, t } = useApp();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 mt-20">
      {/* Top Value / Trust Proposition Bar */}
      <div className="border-b border-slate-900/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">100% Virus Scanned</h4>
              <p className="text-xs text-slate-400 mt-0.5">Every APK undergoes cryptographic verification & multi-engine malware scans.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">High-Speed Direct Mirrors</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direct multi-channel downloads without throttling or deceptive third-party redirects.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Pure Clean Binaries</h4>
              <p className="text-xs text-slate-400 mt-0.5">Original developer signatures preserved with zero adware modifications.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {settings.footerText || settings.description}
            </p>

            {/* Contact details */}
            <div className="space-y-1.5 text-xs text-slate-400 pt-2">
              {settings.contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-emerald-400 transition-colors">
                    {settings.contactEmail}
                  </a>
                </div>
              )}
              {settings.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{settings.contactPhone}</span>
                </div>
              )}
              {settings.contactAddress && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{settings.contactAddress}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-slate-700 transition-colors text-xs font-semibold"
                  title="Facebook"
                >
                  FB
                </a>
              )}
              {settings.socialLinks?.telegram && (
                <a
                  href={settings.socialLinks.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-slate-700 transition-colors text-xs font-semibold"
                  title="Telegram"
                >
                  TG
                </a>
              )}
              {settings.socialLinks?.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-slate-700 transition-colors text-xs font-semibold"
                  title="YouTube"
                >
                  YT
                </a>
              )}
              {settings.socialLinks?.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-slate-700 transition-colors text-xs font-semibold"
                  title="Twitter / X"
                >
                  X
                </a>
              )}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-emerald-400 transition-colors">
                  {t('home')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/apps')} className="hover:text-emerald-400 transition-colors">
                  {t('apps')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/categories')} className="hover:text-emerald-400 transition-colors">
                  {t('categories')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/apps?filter=popular')} className="hover:text-emerald-400 transition-colors">
                  {t('popularApps')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/apps?filter=latest')} className="hover:text-emerald-400 transition-colors">
                  {t('latestUpdates')}
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">{t('categories')}</h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate(`/apps?category=${cat.id}`)}
                    className="hover:text-emerald-400 transition-colors truncate text-left max-w-[150px]"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">{t('legal')}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-emerald-400 transition-colors">
                  {t('about')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-emerald-400 transition-colors">
                  {t('contactUs')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy')} className="hover:text-emerald-400 transition-colors">
                  {t('privacyPolicy')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-emerald-400 transition-colors">
                  {t('termsConditions')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dmca')} className="hover:text-emerald-400 transition-colors">
                  {t('dmca')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/disclaimer')} className="hover:text-emerald-400 transition-colors">
                  {t('disclaimer')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            {settings.footerText || `© 2026 ${settings.name || 'Bashar Apk App'}. All rights reserved.`}
          </div>

          <div className="flex items-center gap-4">
            <a href="/sitemap.xml" target="_blank" className="hover:text-slate-400 flex items-center gap-1">
              Sitemap <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => navigate('/admin')}
              className="text-slate-500 hover:text-emerald-400 transition-colors"
            >
              Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
