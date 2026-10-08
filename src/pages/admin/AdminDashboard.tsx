import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { AdminAppsList } from './AdminAppsList';
import { AdminAppForm } from './AdminAppForm';
import { AppItem } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { navigate } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('apps');
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-xs text-slate-400">
        Verifying secure administrative session...
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const handleEditApp = (app: AppItem) => {
    setEditingApp(app);
    setCurrentTab('add-app');
  };

  const handleAddNewApp = () => {
    setEditingApp(null);
    setCurrentTab('add-app');
  };

  const handleFormSaved = () => {
    setEditingApp(null);
    setCurrentTab('apps');
  };

  const handleFormCancel = () => {
    setEditingApp(null);
    setCurrentTab('apps');
  };

  return (
    <AdminLayout
      currentTab={currentTab}
      onTabChange={(tab) => {
        if (tab !== 'add-app') {
          setEditingApp(null);
        }
        setCurrentTab(tab);
      }}
    >
      {currentTab === 'apps' && (
        <AdminAppsList onEditApp={handleEditApp} onAddNewApp={handleAddNewApp} />
      )}
      {currentTab === 'add-app' && (
        <AdminAppForm
          initialApp={editingApp}
          onSaved={handleFormSaved}
          onCancel={handleFormCancel}
        />
      )}
    </AdminLayout>
  );
};
