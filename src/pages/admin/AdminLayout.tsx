import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../../components/BrandLogo';
import {
  Layers,
  PlusCircle,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentTab, onTabChange, children }) => {
  const { user, logout } = useAuth();
  const { navigate, theme, toggleTheme, showToast } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'apps', label: '1. APK Applications', icon: Layers },
    { id: 'add-app', label: '2. Upload New APK', icon: PlusCircle }
  ];

  const handleSelectTab = (id: string) => {
    onTabChange(id);
    setMobileSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    showToast('Logged out of admin session.', 'info');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Mobile Bar */}
      <header className="lg:hidden h-16 border-b border-slate-800 bg-slate-900 px-4 flex items-center justify-between sticky top-0 z-30">
        <BrandLogo size="sm" />
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl text-slate-300 hover:bg-slate-800"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex flex-1">
        {/* Desktop & Mobile Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 lg:top-0 h-screen w-64 bg-slate-950 border-r border-slate-800/80 p-5 flex flex-col justify-between z-40 transition-transform duration-200 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div>
            <div className="pb-6 border-b border-slate-800">
              <BrandLogo size="md" />
              <div className="mt-2 text-[10px] text-emerald-400 font-mono uppercase tracking-widest">
                Management Console
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Firestore: bashar-apk-app</span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="mt-6 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer User Info & Logout */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Bashar Apk Admin</span>
              </span>
              <button
                onClick={toggleTheme}
                className="p-1 rounded text-slate-400 hover:text-white"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Site</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/80 z-30 lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
