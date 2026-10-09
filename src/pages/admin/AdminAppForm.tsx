import React, { useState } from 'react';
import { api } from '../../services/api';
import { firebaseDb } from '../../services/firebaseDb';
import { AppItem, AppStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Save,
  ArrowLeft,
  Upload,
  FileCode,
  AlertCircle
} from 'lucide-react';

interface AdminAppFormProps {
  initialApp?: AppItem | null;
  onSaved: () => void;
  onCancel: () => void;
}

export const AdminAppForm: React.FC<AdminAppFormProps> = ({ initialApp, onSaved, onCancel }) => {
  const { categories, showToast } = useApp();
  const isEditing = !!initialApp;

  // Form State
  const [name, setName] = useState(initialApp?.name || '');
  const [slug, setSlug] = useState(initialApp?.slug || '');
  const [iconUrl, setIconUrl] = useState(initialApp?.iconUrl || '');
  const [apkFileUrl, setApkFileUrl] = useState(initialApp?.apkFileUrl || '');
  const [apkFileName, setApkFileName] = useState(initialApp?.apkFileName || '');
  const [apkFileSize, setApkFileSize] = useState(initialApp?.apkFileSize || '15.0 MB');
  const [shortDescription, setShortDescription] = useState(initialApp?.shortDescription || '');
  const [fullDescription, setFullDescription] = useState(initialApp?.fullDescription || '');
  const [version, setVersion] = useState(initialApp?.version || 'v1.0.0');
  const [androidRequirement, setAndroidRequirement] = useState(initialApp?.androidRequirement || 'Android 7.0 and up');
  const [developerName, setDeveloperName] = useState(initialApp?.developerName || 'Bashar Digital Studios');
  const [developerWebsite, setDeveloperWebsite] = useState(initialApp?.developerWebsite || 'https://basharapk.com');
  const [developerEmail, setDeveloperEmail] = useState(initialApp?.developerEmail || '');
  const [categoryId, setCategoryId] = useState(initialApp?.categoryId || categories[0]?.id || 'cat-1');
  const [subCategory, setSubCategory] = useState(initialApp?.subCategory || 'Utilities');
  const [packageName, setPackageName] = useState(initialApp?.packageName || 'com.bashar.app');
  const [rating, setRating] = useState(initialApp?.rating || 4.8);
  const [status, setStatus] = useState<AppStatus>(initialApp?.status || 'published');
  const [isFeatured, setIsFeatured] = useState(initialApp?.isFeatured ?? false);
  const [isPopular, setIsPopular] = useState(initialApp?.isPopular ?? false);
  const [isNew, setIsNew] = useState(initialApp?.isNew ?? true);
  const [tagsInput, setTagsInput] = useState(initialApp?.tags?.join(', ') || 'Android, Utility, Fast');
  const [whatsNew, setWhatsNew] = useState(initialApp?.whatsNew || 'Initial release with performance optimizations.');
  const [screenshots, setScreenshots] = useState<string[]>(initialApp?.screenshots || []);
  const [seoTitle, setSeoTitle] = useState(initialApp?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialApp?.seoDescription || '');
  const [seoKeywords, setSeoKeywords] = useState(initialApp?.seoKeywords || '');

  // Upload States
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate slug & package from name if creating
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setSlug(generatedSlug);
      setPackageName(`com.bashar.${generatedSlug.replace(/-/g, '')}`);
      setSeoTitle(`${val} APK Download - Safe & Fast for Android`);
    }
  };

  // Upload Handler (APK, Logo, Screenshots)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'icon' | 'apk' | 'screenshot') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress((p) => ({ ...p, [target]: true }));
    try {
      const res = await api.uploadFile(file);
      if (target === 'icon') {
        setIconUrl(res.url);
        showToast('App icon uploaded successfully', 'success');
      } else if (target === 'apk') {
        setApkFileUrl(res.url);
        setApkFileName(res.fileName);
        setApkFileSize(res.fileSize);
        showToast(`APK file uploaded (${res.fileSize})`, 'success');
      } else if (target === 'screenshot') {
        setScreenshots((prev) => [...prev, res.url]);
        showToast('Screenshot added', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'File upload failed', 'error');
    } finally {
      setUploadProgress((p) => ({ ...p, [target]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('App Name is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const selectedCat = categories.find((c) => c.id === categoryId);
    const tagsArray = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    const appPayload: Partial<AppItem> = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      iconUrl: iconUrl.trim(),
      apkFileUrl: apkFileUrl.trim(),
      apkFileName: apkFileName.trim() || `${slug || 'app'}-${version}.apk`,
      apkFileSize: apkFileSize.trim() || '15.0 MB',
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      version: version.trim(),
      androidRequirement: androidRequirement.trim(),
      developerName: developerName.trim(),
      developerWebsite: developerWebsite.trim(),
      developerEmail: developerEmail.trim(),
      categoryId,
      categoryName: selectedCat ? selectedCat.name : 'Tools & Utilities',
      subCategory: subCategory.trim(),
      packageName: packageName.trim(),
      rating,
      status,
      isFeatured,
      isPopular,
      isNew,
      tags: tagsArray,
      whatsNew: whatsNew.trim(),
      screenshots,
      seoTitle: seoTitle.trim() || `${name} APK Download`,
      seoDescription: seoDescription.trim() || shortDescription,
      seoKeywords: seoKeywords.trim()
    };

    try {
      if (isEditing && initialApp) {
        const updated = await api.updateApp(initialApp.id, appPayload);
        // Sync to Firebase Firestore
        firebaseDb.syncAppToFirestore(updated).catch(() => {});
        showToast(`App "${name}" updated successfully (synced to Firebase)!`, 'success');
      } else {
        const created = await api.createApp(appPayload);
        // Sync to Firebase Firestore
        firebaseDb.syncAppToFirestore(created).catch(() => {});
        showToast(`App "${name}" created and saved to Firebase Firestore!`, 'success');
      }
      onSaved();
    } catch (err: any) {
      setError(err.message || 'Failed to save application.');
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-100">
              {isEditing ? `Edit: ${initialApp?.name}` : 'Add New APK Application'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure app details, APK file mirrors, screenshots, and SEO metadata
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : 'Save Application'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Basic Information */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* App Icon Upload & Preview */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">App Logo / Icon *</label>
              <div className="flex items-center gap-4">
                <img
                  src={iconUrl}
                  alt="App Icon Preview"
                  className="w-18 h-18 rounded-2xl object-cover ring-2 ring-slate-700 bg-slate-950"
                />
                <div className="flex-1 space-y-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadProgress['icon'] ? 'Uploading...' : 'Upload Icon'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'icon')}
                    />
                  </label>
                  <input
                    type="text"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    placeholder="Or enter image URL"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* App Name & Slug */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">App Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Bashar Video Downloader Pro"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. bashar-video-downloader-pro"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description *</label>
                  <input
                    type="text"
                    required
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Short summary for cards and marketplace listing"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Description</label>
            <textarea
              rows={5}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Detailed app guide, specifications, features, and user instructions..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 resize-y"
            />
          </div>
        </section>

        {/* SECTION 2: APK Information */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800">
            2. APK Binary & Android Package
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Version *</label>
              <input
                type="text"
                required
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="v1.0.0"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">APK File Size *</label>
              <input
                type="text"
                required
                value={apkFileSize}
                onChange={(e) => setApkFileSize(e.target.value)}
                placeholder="18.5 MB"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Android Requirement</label>
              <input
                type="text"
                value={androidRequirement}
                onChange={(e) => setAndroidRequirement(e.target.value)}
                placeholder="Android 7.0 and up"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Package Name</label>
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="com.example.app"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Drag & Drop APK File Upload Box */}
          <div className="p-6 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 hover:border-emerald-500/50 transition-colors text-center">
            <FileCode className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-200">
              {apkFileName ? `Selected: ${apkFileName} (${apkFileSize})` : 'Upload or Replace APK File'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Direct upload for Android binary archive (.apk). Max upload 60MB.
            </p>

            <div className="mt-3 flex items-center justify-center gap-3">
              <label className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold cursor-pointer transition-colors">
                <span>{uploadProgress['apk'] ? 'Uploading APK...' : 'Browse Computer'}</span>
                <input
                  type="file"
                  accept=".apk"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'apk')}
                />
              </label>

              {apkFileUrl && (
                <span className="text-xs text-slate-400 font-mono">
                  Stored at: {apkFileUrl}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-xl shadow-emerald-500/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : 'Save & Publish Application'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
