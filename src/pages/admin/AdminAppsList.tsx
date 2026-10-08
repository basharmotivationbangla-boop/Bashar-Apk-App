import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { firebaseDb } from '../../services/firebaseDb';
import { AppItem } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Search,
  PlusCircle,
  Copy,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Sparkles,
  Flame,
  ArrowUpDown,
  MoreVertical,
  ExternalLink
} from 'lucide-react';

interface AdminAppsListProps {
  onEditApp: (app: AppItem) => void;
  onAddNewApp: () => void;
}

export const AdminAppsList: React.FC<AdminAppsListProps> = ({ onEditApp, onAddNewApp }) => {
  const { categories, showToast, navigate } = useApp();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchApps = async () => {
    setIsLoading(true);
    try {
      const res = await api.getApps({
        search: search.trim(),
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page,
        limit
      });
      setApps(res.apps);
      setTotal(res.total);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch apps', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [search, selectedCategory, statusFilter, page]);

  const handleToggle = async (id: string, field: 'isFeatured' | 'isPopular' | 'isNew' | 'status') => {
    try {
      const updated = await api.toggleAppFlag(id, field);
      setApps((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast(`Updated ${field} status`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Toggle failed', 'error');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const copy = await api.duplicateApp(id);
      setApps((prev) => [copy, ...prev]);
      showToast(`Duplicated app as "${copy.name}"`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Duplicate failed', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      await api.deleteApp(id);
      // Delete from Firebase Firestore
      firebaseDb.deleteAppFromFirestore(id).catch(() => {});
      setApps((prev) => prev.filter((a) => a.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      showToast(`Deleted ${name} (removed from Firebase)`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(apps.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Permanently delete ${selectedIds.length} selected apps?`)) return;
    for (const id of selectedIds) {
      try {
        await api.deleteApp(id);
        firebaseDb.deleteAppFromFirestore(id).catch(() => {});
      } catch {}
    }
    showToast(`Bulk delete completed for ${selectedIds.length} apps`, 'info');
    setSelectedIds([]);
    fetchApps();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-100">APK Applications</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage, upload, edit, feature, and monitor all Android applications
          </p>
        </div>

        <button
          onClick={onAddNewApp}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload New APK</span>
        </button>
      </div>

      {/* Quick Status Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Total Applications</span>
          <span className="text-base font-bold font-mono text-slate-100">{total}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-emerald-400 block">Published / Live</span>
          <span className="text-base font-bold font-mono text-slate-100">
            {apps.filter(a => a.status === 'published').length}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-amber-400 block">Drafts</span>
          <span className="text-base font-bold font-mono text-slate-100">
            {apps.filter(a => a.status === 'draft').length}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-cyan-400 block">Total Downloads</span>
          <span className="text-base font-bold font-mono text-slate-100">
            {apps.reduce((sum, a) => sum + (a.downloadCount || 0), 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search apps by name, tag, or package..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete ({selectedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Apps Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4 w-8">
                  <input
                    type="checkbox"
                    checked={apps.length > 0 && selectedIds.length === apps.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                  />
                </th>
                <th className="p-4">Application</th>
                <th className="p-4">Category</th>
                <th className="p-4">Version</th>
                <th className="p-4">Downloads</th>
                <th className="p-4">Badges</th>
                <th className="p-4">Status</th>
                <th className="p-4">Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    Loading application database...
                  </td>
                </tr>
              ) : apps.length > 0 ? (
                apps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(app.id)}
                        onChange={() => handleSelectOne(app.id)}
                        className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.iconUrl}
                          alt={app.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-800 bg-slate-950 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-100 hover:text-emerald-400 cursor-pointer truncate max-w-[180px]" onClick={() => onEditApp(app)}>
                            {app.name}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-500 block truncate max-w-[180px]">
                            {app.packageName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{app.categoryName}</td>
                    <td className="p-4 font-mono tabular-nums text-slate-300">{app.version}</td>
                    <td className="p-4 font-mono tabular-nums text-emerald-400 font-semibold">
                      {app.downloadCount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggle(app.id, 'isFeatured')}
                          title="Toggle Featured"
                          className={`p-1 rounded-md transition-colors ${app.isFeatured ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-600 hover:text-slate-400'}`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggle(app.id, 'isPopular')}
                          title="Toggle Popular"
                          className={`p-1 rounded-md transition-colors ${app.isPopular ? 'bg-amber-500/20 text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
                        >
                          <Flame className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggle(app.id, 'status')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                          app.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {app.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-4 font-mono text-slate-400 text-[11px]">{app.lastUpdatedDate}</td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <button
                          onClick={() => navigate(`/apps/${app.slug}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="View on Live Site"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditApp(app)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                          title="Edit Application"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(app.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-slate-800 transition-colors"
                          title="Duplicate App"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id, app.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete App"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-16 px-4 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                        <PlusCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-100">
                        No Applications Added Yet / কোনো অ্যাপ যুক্ত করা হয়নি
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Ready to upload your Android apps! You can upload APK files, provide package names, set versions, categories, and publish them with verified status.
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={onAddNewApp}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Upload First APK Application</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {total > limit && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing {apps.length} of {total} apps
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="font-mono">
                {page} / {Math.ceil(total / limit)}
              </span>
              <button
                disabled={page >= Math.ceil(total / limit)}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
