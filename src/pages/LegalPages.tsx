import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { firebaseDb } from '../services/firebaseDb';
import { supabaseDb } from '../services/supabaseDb';
import {
  ShieldCheck,
  Send,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Lock,
  ExternalLink
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 text-slate-300">
      <div className="pb-8 border-b border-slate-800 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative shrink-0">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-40 blur-md" />
          <img
            src="/uploads/logo.png"
            alt={settings.name || 'Bashar Apk App'}
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover bg-slate-900 border border-slate-700/80 shadow-2xl"
          />
        </div>
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Verified Android Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-100">
            About {settings.name}
          </h1>
          <p className="text-sm text-emerald-400 mt-2 font-medium">
            {settings.tagline}
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-300">
        <p>
          Welcome to <strong className="text-slate-100">{settings.name}</strong>, a dedicated Android application ecosystem built to bridge users with high-performance, thoroughly verified, and direct APK distributions.
        </p>
        <p>
          In a world cluttered with deceptive advertisement links, bloated downloaders, and unverified repackaged software, our primary mission is integrity. Every application cataloged on our servers undergoes multi-layered inspection: virus analysis, cryptographic checksum logging, and verified developer signature validation.
        </p>

        <h2 className="text-xl font-bold font-display text-slate-100 pt-4">Our Core Commitments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="font-semibold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Virus-Free
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Zero tolerance for malicious payloads, spyware, or injected background services.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="font-semibold text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              Cryptographic Integrity
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Public SHA-256 signatures enable technical users to independently audit file authenticity.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="font-semibold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-violet-400" />
              Fast Direct Downloads
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              High-speed direct mirrors with no waiting timers, popups, or required client software.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="font-semibold text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Developer Respect
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Clear attribution, developer website links, and swift DMCA compliance handling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { settings, navigate } = useApp();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
      <div className="mx-auto w-36 h-36 rounded-3xl overflow-hidden ring-2 ring-emerald-500/40 shadow-2xl bg-slate-900 flex items-center justify-center">
        <img
          src="/uploads/logo.png"
          alt={settings.name || 'Bashar Apk App'}
          className="w-full h-full object-cover select-none"
        />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold font-display text-slate-100">
          {settings.name || 'Bashar Apk App'}
        </h1>
        <p className="text-sm text-emerald-400 font-medium">
          {settings.tagline || 'Trusted Android Apps, Tools & Digital Solutions'}
        </p>
      </div>

      <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
        অফিসিয়াল অ্যান্ড্রয়েড অ্যাপ্লিকেশন প্ল্যাটফর্ম। সকল অ্যাপস ও ইউটিলিটি সরাসরি প্ল্যাটফর্ম থেকেই ভেরিফাইড ভাবে ডাউনলোড ও অ্যাক্সেসযোগ্য।
      </p>

      <div className="pt-2">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
        >
          হোমপেজে ফিরে যান
        </button>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 text-slate-300 space-y-6 text-sm leading-relaxed">
    <h1 className="text-3xl font-extrabold font-display text-slate-100 pb-4 border-b border-slate-800">
      Privacy Policy
    </h1>
    <p>Last updated: March 2026</p>
    <p>
      At Bashar Apk App, accessible from basharapk.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Bashar Apk App and how we use it.
    </p>
    <h2 className="text-xl font-bold text-slate-100 pt-2">Log Files & Download Analytics</h2>
    <p>
      Bashar Apk App follows a standard procedure of using log files. These files log visitors when they download APK files to tally counters and detect automated abuse. The information collected by log files includes internet protocol (IP) addresses, browser type, date/time stamp, and requested APK slugs.
    </p>
    <h2 className="text-xl font-bold text-slate-100 pt-2">Cookies and Web Beacons</h2>
    <p>
      Like any other website, Bashar Apk App uses basic browser storage to remember user theme preferences (dark/light) and active language (English/Bengali). We do not use intrusive tracking cookies.
    </p>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 text-slate-300 space-y-6 text-sm leading-relaxed">
    <h1 className="text-3xl font-extrabold font-display text-slate-100 pb-4 border-b border-slate-800">
      Terms and Conditions
    </h1>
    <p>
      By accessing Bashar Apk App, you agree to be bound by these website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws.
    </p>
    <h2 className="text-xl font-bold text-slate-100 pt-2">Use License & Disclaimers</h2>
    <p>
      Permission is granted to temporarily download one copy of the materials (information or software) on Bashar Apk App for personal, non-commercial transitory viewing only. All application packages belong to their respective registered copyright holders.
    </p>
  </div>
);

export const DmcaPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 text-slate-300 space-y-6 text-sm leading-relaxed">
    <h1 className="text-3xl font-extrabold font-display text-slate-100 pb-4 border-b border-slate-800">
      DMCA & Copyright Policy
    </h1>
    <p>
      Bashar Apk App is in compliance with 17 U.S.C. 512 and the Digital Millennium Copyright Act (DMCA). It is our policy to respond to any infringement notices and take appropriate actions under the DMCA and other applicable intellectual property laws.
    </p>
    <p>
      If your copyrighted material has been posted on Bashar Apk App or if links to your copyrighted material are returned through our search engine and you want this material removed, you must provide a written communication detailing your authorization and the specific URLs through our official Contact & DMCA form on this website.
    </p>
  </div>
);

export const DisclaimerPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 text-slate-300 space-y-6 text-sm leading-relaxed">
    <h1 className="text-3xl font-extrabold font-display text-slate-100 pb-4 border-b border-slate-800">
      Disclaimer
    </h1>
    <p>
      The information and APK files on Bashar Apk App are provided on an 'as is' basis. Bashar Apk App makes no warranties, expressed or implied, regarding third-party Android apps other than ensuring our distribution mirrors remain virus-scanned and unmodified from official signatures.
    </p>
  </div>
);
