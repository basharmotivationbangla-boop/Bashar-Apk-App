import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { LiveChatWidget } from './components/LiveChatWidget';

import { HomePage } from './pages/HomePage';
import { AppsPage } from './pages/AppsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AppDetailsPage } from './pages/AppDetailsPage';
import {
  AboutPage,
  ContactPage,
  PrivacyPage,
  TermsPage,
  DmcaPage,
  DisclaimerPage
} from './pages/LegalPages';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Layers } from 'lucide-react';

const RouterView: React.FC = () => {
  const { currentPath, navigate } = useApp();

  // Route matching
  const isAdminRoute = currentPath.startsWith('/admin') && currentPath !== '/admin/login';
  const isAdminLogin = currentPath === '/admin/login';

  let content: React.ReactNode = null;

  if (isAdminRoute) {
    return <AdminDashboard />;
  }

  if (isAdminLogin) {
    return <AdminLoginPage />;
  }

  // App details route: /apps/:slug
  const appMatch = currentPath.match(/^\/apps\/([^/?#]+)/);
  if (appMatch) {
    const slug = appMatch[1];
    content = <AppDetailsPage slug={slug} />;
  } else if (currentPath === '/' || currentPath === '') {
    content = <HomePage />;
  } else if (currentPath === '/apps' || currentPath.startsWith('/apps?')) {
    content = <AppsPage />;
  } else if (currentPath === '/categories') {
    content = <CategoriesPage />;
  } else if (currentPath.startsWith('/category/')) {
    content = <AppsPage />;
  } else if (currentPath === '/about') {
    content = <AboutPage />;
  } else if (currentPath === '/contact') {
    content = <ContactPage />;
  } else if (currentPath === '/privacy') {
    content = <PrivacyPage />;
  } else if (currentPath === '/terms') {
    content = <TermsPage />;
  } else if (currentPath === '/dmca') {
    content = <DmcaPage />;
  } else if (currentPath === '/disclaimer') {
    content = <DisclaimerPage />;
  } else {
    // 404 Fallback
    content = (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold font-display text-slate-100">
          Page Not Found (404)
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md">
          The requested page or application could not be found. It may have moved or been updated.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
          >
            Go to Homepage
          </button>
          <button
            onClick={() => navigate('/apps')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold"
          >
            Explore Apps
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      <Header />
      <main className="flex-1">
        {content}
      </main>
      <Footer />
      <ToastContainer />
      <LiveChatWidget />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <RouterView />
      </AppProvider>
    </AuthProvider>
  );
}
