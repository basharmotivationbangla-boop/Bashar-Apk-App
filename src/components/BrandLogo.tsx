import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import defaultLogo from '../assets/images/bashar_apk_official_logo_1791554816506.jpg';

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
  const [imgError, setImgError] = useState(false);

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

  const logoSrc = (!imgError && (settings.logoUrl || defaultLogo)) || defaultLogo;

  return (
    <div
      onClick={() => navigate('/')}
      className={`inline-flex items-center gap-2.5 cursor-pointer group select-none ${className}`}
    >
      <div className={`relative shrink-0 ${iconSizes[size]} rounded-xl overflow-hidden ring-1 ring-emerald-500/30 bg-slate-900/80 shadow-md shadow-emerald-500/10 transition-transform duration-200 group-hover:scale-105 group-hover:ring-emerald-500/50`}>
        <img
          src={logoSrc}
          alt={settings.name || 'Bashar Apk App'}
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

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
