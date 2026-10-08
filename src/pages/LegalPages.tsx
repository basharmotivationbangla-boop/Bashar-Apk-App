import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { firebaseDb } from '../services/firebaseDb';
import {
  ShieldCheck,
  Send,
  Mail,
  Phone,
  MapPin,
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
      <div className="pb-8 border-b border-slate-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-100">
          About {settings.name}
        </h1>
        <p className="text-sm text-emerald-400 mt-2 font-medium">
          {settings.tagline}
        </p>
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
  const { settings, t, showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Save to Firebase Firestore database
      await firebaseDb.saveContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim()
      }).catch((firebaseErr) => {
        console.warn('Firebase save note:', firebaseErr);
      });

      // 2. Also forward to API server
      await api.sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim()
      }).catch(() => {});

      setSubmitted(true);
      showToast(t('messageSent'), 'success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto pb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-100">
          {t('contactUs')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Have an inquiry, application submission request, or technical feedback? Get in touch with the Bashar Apk App team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Column */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Direct Inquiries</h3>
            <div className="space-y-3 text-xs text-slate-300">
              {settings.contactEmail && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-500">Email</span>
                    <a href={`mailto:${settings.contactEmail}`} className="hover:text-emerald-400">
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>
              )}
              {settings.contactPhone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-500">Phone</span>
                    <span>{settings.contactPhone}</span>
                  </div>
                </div>
              )}
              {settings.contactAddress && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-500">Office</span>
                    <span>{settings.contactAddress}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
            <h4 className="font-semibold text-slate-200 mb-1">Developer Submissions</h4>
            <p>
              Developers looking to list Android utilities on Bashar Apk App can submit their package details and original APK for verification.
            </p>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            {submitted && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{t('messageSent')}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('name')} *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('email')} *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">{t('subject')}</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="Subject or App Name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">{t('message')} *</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
                placeholder="How can we assist you?"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sending...' : t('sendMessage')}</span>
            </button>
          </form>
        </div>
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
      If your copyrighted material has been posted on Bashar Apk App or if links to your copyrighted material are returned through our search engine and you want this material removed, you must provide a written communication detailing your authorization and the specific URLs to <span className="text-emerald-400">basharmotivationbangla@gmail.com</span>.
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
