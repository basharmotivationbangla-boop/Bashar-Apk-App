import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/BrandLogo';
import {
  ShieldCheck,
  ArrowRight,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { navigate, showToast } = useApp();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already authenticated, redirect to /admin
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('অনুগ্রহ করে ইউজারনেম দিন (Username required)');
      return;
    }
    if (!password) {
      setErrorMessage('অনুগ্রহ করে পাসওয়ার্ড দিন (Password required)');
      return;
    }

    setIsLoading(true);
    try {
      await login(username.trim(), password);
      showToast('অ্যাডমিন প্যানেলে স্বাগতম (Welcome to Admin Panel)', 'success');
      navigate('/admin');
    } catch (err: any) {
      setErrorMessage(err.message || 'ভুল ইউজারনেম অথবা পাসওয়ার্ড (Invalid credentials)');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDefault = () => {
    setUsername('admin');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <BrandLogo size="xl" className="justify-center" />
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold font-display text-slate-100 tracking-tight">
            Admin Authentication
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            অ্যাডমিন প্যানেলে প্রবেশের জন্য ইউজারনেম ও পাসওয়ার্ড দিন
          </p>
        </div>

        <div className="p-7 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl ring-1 ring-emerald-500/10">
          
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ইউজারনেম (Username)
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  পাসওয়ার্ড (Password)
                </label>
                <button
                  type="button"
                  onClick={handleUseDefault}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                  অটো-ফিল ডিফল্ট
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-11 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
              >
                <span>{isLoading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন (Sign In)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Credential Hint Box */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <KeyRound className="w-3.5 h-3.5" />
                <span>অফিসিয়াল ডিফল্ট অ্যাডমিন এক্সেস:</span>
              </div>
              <div className="flex items-center justify-between text-slate-300 font-mono text-[11px] pt-0.5">
                <span>ইউজারনেম: <strong className="text-slate-100">admin</strong></span>
                <span>পাসওয়ার্ড: <strong className="text-slate-100">admin123</strong></span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bashar Apk App · Protected Session</span>
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
