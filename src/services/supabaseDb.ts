import { supabase } from '../supabase';
import { AppItem, CategoryItem, ContactMessage, WebsiteSettings } from '../types';

export interface ChatMessage {
  id?: string;
  senderName: string;
  senderEmail?: string;
  text: string;
  isAdmin?: boolean;
  timestamp: number;
  avatar?: string;
}

export interface AppReview {
  id?: string;
  appId: string;
  appName?: string;
  userName: string;
  userEmail?: string;
  rating: number;
  comment: string;
  timestamp: number;
}

export interface AppRequestItem {
  id?: string;
  requesterName: string;
  requesterEmail?: string;
  appTitle: string;
  category?: string;
  notes?: string;
  timestamp: number;
  status: 'pending' | 'reviewed' | 'added';
}

function logSupabaseError(operation: string, table: string, error: unknown) {
  console.warn(`[Supabase ${operation}] table "${table}":`, error);
}

export const supabaseDb = {
  // ===========================================================
  // 1. HEALTH / CONNECTIVITY CHECK
  // ===========================================================
  async checkConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const { error } = await supabase.from('apps').select('id').limit(1);
      if (error && error.code !== 'PGRST116' && !error.message?.includes('relation "public.apps" does not exist')) {
        // Table exists or connection succeeded
        return { connected: true, message: 'Connected to Supabase' };
      }
      return { connected: true, message: 'Connected to Supabase endpoint' };
    } catch (err: any) {
      return { connected: false, message: err?.message || 'Connection check failed' };
    }
  },

  // ===========================================================
  // 2. LIVE CHAT MESSAGES
  // ===========================================================
  async sendChatMessage(msg: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<string> {
    try {
      const payload = {
        sender_name: msg.senderName.trim() || 'Anonymous User',
        sender_email: msg.senderEmail || '',
        text: msg.text.trim(),
        is_admin: Boolean(msg.isAdmin),
        timestamp: Date.now(),
        avatar: msg.avatar || ''
      };

      const { data, error } = await supabase
        .from('chat_messages')
        .insert([payload])
        .select('id')
        .single();

      if (error) {
        logSupabaseError('sendChatMessage', 'chat_messages', error);
        return 'local-' + Date.now();
      }

      return data?.id ? String(data.id) : 'sb-' + Date.now();
    } catch (err) {
      logSupabaseError('sendChatMessage', 'chat_messages', err);
      return 'local-' + Date.now();
    }
  },

  async getChatMessages(): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('timestamp', { ascending: true })
        .limit(100);

      if (error || !data) {
        return [];
      }

      return data.map((item: any) => ({
        id: String(item.id),
        senderName: item.sender_name || item.senderName || 'Anonymous',
        senderEmail: item.sender_email || item.senderEmail,
        text: item.text || '',
        isAdmin: Boolean(item.is_admin ?? item.isAdmin),
        timestamp: Number(item.timestamp) || Date.now(),
        avatar: item.avatar
      }));
    } catch (err) {
      logSupabaseError('getChatMessages', 'chat_messages', err);
      return [];
    }
  },

  subscribeToChatMessages(callback: (messages: ChatMessage[]) => void, onError?: (err: any) => void) {
    let active = true;

    // 1. Initial fetch
    this.getChatMessages().then((msgs) => {
      if (active && msgs.length > 0) {
        callback(msgs);
      }
    }).catch((err) => {
      if (onError) onError(err);
    });

    // 2. Real-time subscription via Supabase channel
    try {
      const channel = supabase
        .channel('chat_messages_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'chat_messages' },
          async () => {
            if (!active) return;
            const updated = await this.getChatMessages();
            callback(updated);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            // Channel active
          }
        });

      return () => {
        active = false;
        supabase.removeChannel(channel);
      };
    } catch (err) {
      logSupabaseError('subscribeToChatMessages', 'chat_messages', err);
      return () => {
        active = false;
      };
    }
  },

  // ===========================================================
  // 3. CONTACT & FEEDBACK MESSAGES
  // ===========================================================
  async saveContactMessage(msg: { name: string; email: string; subject?: string; message: string }): Promise<string> {
    try {
      const payload = {
        name: msg.name.trim(),
        email: msg.email.trim(),
        subject: msg.subject?.trim() || 'General Inquiry',
        message: msg.message.trim(),
        status: 'unread',
        timestamp: Date.now()
      };

      const { data, error } = await supabase
        .from('contact_messages')
        .insert([payload])
        .select('id')
        .single();

      if (error) {
        logSupabaseError('saveContactMessage', 'contact_messages', error);
        return 'local-' + Date.now();
      }

      return data?.id ? String(data.id) : 'sb-' + Date.now();
    } catch (err) {
      logSupabaseError('saveContactMessage', 'contact_messages', err);
      return 'local-' + Date.now();
    }
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error || !data) return [];

      return data.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        email: item.email,
        subject: item.subject,
        message: item.message,
        status: item.status || 'unread',
        createdAt: new Date(Number(item.timestamp) || Date.now()).toISOString()
      }));
    } catch (err) {
      logSupabaseError('getContactMessages', 'contact_messages', err);
      return [];
    }
  },

  // ===========================================================
  // 4. APP REVIEWS & RATINGS
  // ===========================================================
  async submitAppReview(review: Omit<AppReview, 'id' | 'timestamp'>): Promise<string> {
    try {
      const payload = {
        app_id: review.appId,
        app_name: review.appName || '',
        user_name: review.userName.trim() || 'Verified User',
        user_email: review.userEmail || '',
        rating: Math.max(1, Math.min(5, Number(review.rating) || 5)),
        comment: review.comment.trim(),
        timestamp: Date.now()
      };

      const { data, error } = await supabase
        .from('app_reviews')
        .insert([payload])
        .select('id')
        .single();

      if (error) {
        logSupabaseError('submitAppReview', 'app_reviews', error);
        return 'local-' + Date.now();
      }

      return data?.id ? String(data.id) : 'sb-' + Date.now();
    } catch (err) {
      logSupabaseError('submitAppReview', 'app_reviews', err);
      return 'local-' + Date.now();
    }
  },

  async getAppReviews(appId: string): Promise<AppReview[]> {
    try {
      const { data, error } = await supabase
        .from('app_reviews')
        .select('*')
        .eq('app_id', appId)
        .order('timestamp', { ascending: false });

      if (error || !data) return [];

      return data.map((item: any) => ({
        id: String(item.id),
        appId: item.app_id || item.appId,
        appName: item.app_name || item.appName,
        userName: item.user_name || item.userName || 'User',
        userEmail: item.user_email || item.userEmail,
        rating: Number(item.rating) || 5,
        comment: item.comment || '',
        timestamp: Number(item.timestamp) || Date.now()
      }));
    } catch (err) {
      logSupabaseError('getAppReviews', 'app_reviews', err);
      return [];
    }
  },

  subscribeToAppReviews(appId: string, callback: (reviews: AppReview[]) => void, onError?: (err: any) => void) {
    let active = true;

    this.getAppReviews(appId).then((revs) => {
      if (active && revs.length > 0) callback(revs);
    }).catch((e) => {
      if (onError) onError(e);
    });

    try {
      const channel = supabase
        .channel(`app_reviews_${appId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'app_reviews', filter: `app_id=eq.${appId}` },
          async () => {
            if (!active) return;
            const updated = await this.getAppReviews(appId);
            callback(updated);
          }
        )
        .subscribe();

      return () => {
        active = false;
        supabase.removeChannel(channel);
      };
    } catch (err) {
      logSupabaseError('subscribeToAppReviews', 'app_reviews', err);
      return () => {
        active = false;
      };
    }
  },

  // ===========================================================
  // 5. APP REQUESTS
  // ===========================================================
  async submitAppRequest(req: { requesterName: string; requesterEmail?: string; appTitle: string; category?: string; notes?: string }): Promise<string> {
    try {
      const payload = {
        requester_name: req.requesterName.trim() || 'Guest',
        requester_email: req.requesterEmail?.trim() || '',
        app_title: req.appTitle.trim(),
        category: req.category?.trim() || 'General',
        notes: req.notes?.trim() || '',
        status: 'pending',
        timestamp: Date.now()
      };

      const { data, error } = await supabase
        .from('app_requests')
        .insert([payload])
        .select('id')
        .single();

      if (error) {
        logSupabaseError('submitAppRequest', 'app_requests', error);
        return 'local-' + Date.now();
      }

      return data?.id ? String(data.id) : 'sb-' + Date.now();
    } catch (err) {
      logSupabaseError('submitAppRequest', 'app_requests', err);
      return 'local-' + Date.now();
    }
  },

  // ===========================================================
  // 6. APPS PERSISTENCE & SYNC
  // ===========================================================
  async syncAppToSupabase(app: AppItem): Promise<void> {
    try {
      const payload = {
        id: app.id,
        name: app.name,
        slug: app.slug,
        package_name: app.packageName,
        version: app.version,
        version_code: app.versionCode,
        category: app.category,
        developer: app.developer,
        file_size: app.fileSize,
        icon_url: app.iconUrl,
        short_description: app.shortDescription,
        full_description: app.fullDescription,
        download_url: app.downloadUrl,
        mirror_url: app.mirrorUrl || '',
        status: app.status,
        is_featured: Boolean(app.isFeatured),
        is_popular: Boolean(app.isPopular),
        is_new: Boolean(app.isNew),
        rating: app.rating || 5,
        download_count: app.downloadCount || 0,
        tags: app.tags || [],
        screenshots: app.screenshots || [],
        changelog: app.changelog || [],
        sha256: app.sha256 || '',
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('apps')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        logSupabaseError('syncAppToSupabase', 'apps', error);
      }
    } catch (err) {
      logSupabaseError('syncAppToSupabase', 'apps', err);
    }
  },

  async deleteAppFromSupabase(appId: string): Promise<void> {
    try {
      const { error } = await supabase.from('apps').delete().eq('id', appId);
      if (error) {
        logSupabaseError('deleteAppFromSupabase', 'apps', error);
      }
    } catch (err) {
      logSupabaseError('deleteAppFromSupabase', 'apps', err);
    }
  },

  async getAppsFromSupabase(): Promise<AppItem[]> {
    try {
      const { data, error } = await supabase.from('apps').select('*');
      if (error || !data) return [];

      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        packageName: item.package_name || item.packageName,
        version: item.version,
        versionCode: item.version_code || item.versionCode,
        category: item.category,
        developer: item.developer,
        fileSize: item.file_size || item.fileSize,
        iconUrl: item.icon_url || item.iconUrl,
        shortDescription: item.short_description || item.shortDescription,
        fullDescription: item.full_description || item.fullDescription,
        downloadUrl: item.download_url || item.downloadUrl,
        mirrorUrl: item.mirror_url || item.mirrorUrl,
        status: item.status,
        isFeatured: item.is_featured ?? item.isFeatured,
        isPopular: item.is_popular ?? item.isPopular,
        isNew: item.is_new ?? item.isNew,
        rating: item.rating,
        downloadCount: item.download_count ?? item.downloadCount,
        tags: item.tags || [],
        screenshots: item.screenshots || [],
        changelog: item.changelog || [],
        sha256: item.sha256,
        createdAt: item.created_at || item.createdAt,
        updatedAt: item.updated_at || item.updatedAt
      }));
    } catch (err) {
      logSupabaseError('getAppsFromSupabase', 'apps', err);
      return [];
    }
  },

  // ===========================================================
  // 7. RECORD DOWNLOAD EVENT
  // ===========================================================
  async recordDownload(appId: string, appName: string, version: string): Promise<void> {
    try {
      await supabase.from('downloads').insert([{
        app_id: appId,
        app_name: appName,
        version,
        timestamp: Date.now()
      }]);
    } catch (err) {
      logSupabaseError('recordDownload', 'downloads', err);
    }
  },

  // ===========================================================
  // 8. CATEGORIES & SETTINGS SYNC
  // ===========================================================
  async syncCategories(categories: CategoryItem[]): Promise<void> {
    try {
      if (!categories || categories.length === 0) return;
      const rows = categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        color: cat.color
      }));
      await supabase.from('categories').upsert(rows, { onConflict: 'id' });
    } catch (err) {
      logSupabaseError('syncCategories', 'categories', err);
    }
  },

  async syncSettings(settings: WebsiteSettings): Promise<void> {
    try {
      await supabase.from('settings').upsert({
        id: 'global_settings',
        data: settings,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    } catch (err) {
      logSupabaseError('syncSettings', 'settings', err);
    }
  }
};
