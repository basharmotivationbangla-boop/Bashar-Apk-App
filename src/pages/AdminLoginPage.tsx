import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/BrandLogo';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const { navigate, showToast } = useApp();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('পাসওয়ার্ড প্রদান করুন / Please enter master password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(password);
      showToast('Admin Console Unlocked successfully.', 'success');
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'ভুল পাসওয়ার্ড। দয়া করে সঠিক পাসওয়ার্ড দিয়ে চেষ্টা করুন।');
      showToast(err.message || 'Authentication failed', 'error');
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
            ম্যানেজমেন্ট পোর্টাল · শুধুমাত্র মাস্টার পাসওয়ার্ড দিয়ে প্রবেশ করুন
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl ring-1 ring-emerald-500/10">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Master Access Password</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">অ্যাডমিন পাসওয়ার্ড</span>
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                />
                <span>Remember session</span>
              </label>

              <span className="text-[11px] text-emerald-400/80 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Protected</span>
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? 'Verifying...' : 'Unlock Admin Panel / প্রবেশ করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bashar Apk App Secure Administrative Vault</span>
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
