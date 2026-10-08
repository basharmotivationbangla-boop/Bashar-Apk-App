import React from 'react';
import { useApp } from '../context/AppContext';

interface BrandLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md'
}) => {
  const { settings, navigate } = useApp();

  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-14 h-14 text-lg'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <div
      onClick={() => navigate('/')}
      className={`inline-flex items-center gap-2.5 cursor-pointer group select-none ${className}`}
    >
      {settings.logoUrl ? (
        <img
          src={settings.logoUrl}
          alt={settings.name || 'Bashar Apk App'}
          className={`${iconSizes[size]} object-contain rounded-lg transition-transform duration-200 group-hover:scale-105`}
        />
      ) : (
        <div
          className={`${iconSizes[size]} shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20 ring-1 ring-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-emerald-500/30`}
        >
          {/* Futuristic Android Hex Logo icon */}
          <svg className="w-5/6 h-5/6 p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </div>
      )}

      {!iconOnly && (
        <div className="flex flex-col leading-tight">
          <span
            className={`font-display font-extrabold tracking-tight text-slate-100 group-hover:text-emerald-400 transition-colors ${textSizes[size]}`}
          >
            {settings.name || 'Bashar Apk App'}
          </span>
          {size !== 'sm' && settings.tagline && (
            <span className="text-[10px] tracking-wider text-slate-400 font-medium line-clamp-1">
              {settings.tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
