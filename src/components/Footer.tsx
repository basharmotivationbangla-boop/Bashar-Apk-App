import React from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import {
  ShieldCheck,
  Send,
  ExternalLink,
  Heart,
  Globe,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, navigate } = useApp();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <BrandLogo size="md" />
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {settings.description ||
                'Your trusted hub for verified, high-performance Android applications, tools, and digital solutions with clean direct access.'}
            </p>

            <div className="pt-2 flex items-center gap-4 text-slate-500">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active & Verified Mirrors</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/apps')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  All Applications
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/apps?filter=popular')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Popular Downloads
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/apps?filter=latest')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Latest Updates
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/categories')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Categories
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/privacy')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/dmca')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  DMCA Compliance
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Support & Inquiries
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Android Store</span>
              </p>
              <p className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Direct Helpdesk & Requests</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/apps')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
              >
                <span>Explore Apps</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {currentYear} {settings.name || 'Bashar Apk App'}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/privacy')}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => navigate('/terms')}
              className="hover:text-slate-300 transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => navigate('/disclaimer')}
              className="hover:text-slate-300 transition-colors"
            >
              Disclaimer
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
