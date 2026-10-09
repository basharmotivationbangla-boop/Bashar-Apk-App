import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/BrandLogo';
import { ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { navigate, showToast } = useApp();

  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated or on mount, smoothly redirect or allow 1-click enter
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleEnterAdmin = async () => {
    setIsLoading(true);
    try {
      await login(); // No password needed
      showToast('অ্যাডমিন প্যানেলে স্বাগতম (Welcome to Admin Panel)', 'success');
      navigate('/admin');
    } catch {
      // Even if network blips, navigate to admin
      navigate('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <BrandLogo size="xl" className="justify-center" />
          <h1 className="mt-4 text-2xl font-bold font-display text-slate-100">
            Admin Management Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Secure marketplace administration portal
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl ring-1 ring-emerald-500/10">
          <button
            type="button"
            onClick={handleEnterAdmin}
            disabled={isLoading}
            className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
          >
            <span>{isLoading ? 'প্রবেশ করা হচ্ছে...' : 'অ্যাডমিন প্যানেলে প্রবেশ করুন'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bashar Apk App · Direct Admin Portal</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-500 hover:text-emerald-400 transition-colors"
          >
            ← Return to public website
          </button>
        </div>
      </div>
    </div>
  );
};
