import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  increment,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { AppItem, ContactMessage } from '../types';

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

// -------------------------------------------------------------
// Helper for logging Firestore errors
// -------------------------------------------------------------
function logFirestoreError(operation: string, collectionName: string, error: unknown) {
  console.warn(`[Firestore ${operation}] collection: "${collectionName}"`, error);
}

export const firebaseDb = {
  // ===========================================================
  // 1. LIVE CHAT MESSAGES
  // ===========================================================
  async sendChatMessage(msg: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<string> {
    try {
      const payload = {
        ...msg,
        senderName: msg.senderName.trim() || 'Anonymous User',
        text: msg.text.trim(),
        timestamp: Date.now(),
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'chat_messages'), payload);
      return docRef.id;
    } catch (err) {
      logFirestoreError('sendChatMessage', 'chat_messages', err);
      throw err;
    }
  },

  subscribeToChatMessages(callback: (messages: ChatMessage[]) => void, onError?: (err: any) => void) {
    try {
      const q = query(collection(db, 'chat_messages'), orderBy('timestamp', 'asc'));
      return onSnapshot(
        q,
        (snapshot) => {
          const list: ChatMessage[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              senderName: data.senderName || 'Anonymous',
              senderEmail: data.senderEmail,
              text: data.text || '',
              isAdmin: Boolean(data.isAdmin),
              timestamp: data.timestamp || Date.now(),
              avatar: data.avatar
            });
          });
          callback(list);
        },
        (error) => {
          logFirestoreError('subscribeToChatMessages', 'chat_messages', error);
          if (onError) onError(error);
        }
      );
    } catch (err) {
      logFirestoreError('subscribeToChatMessages:init', 'chat_messages', err);
      if (onError) onError(err);
      return () => {};
    }
  },

  // ===========================================================
  // 2. CONTACT & FEEDBACK MESSAGES
  // ===========================================================
  async saveContactMessage(msg: { name: string; email: string; subject?: string; message: string }): Promise<string> {
    try {
      const payload = {
        name: msg.name.trim(),
        email: msg.email.trim(),
        subject: msg.subject?.trim() || 'General Inquiry',
        message: msg.message.trim(),
        status: 'unread',
        timestamp: Date.now(),
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'contact_messages'), payload);
      return docRef.id;
    } catch (err) {
      logFirestoreError('saveContactMessage', 'contact_messages', err);
      throw err;
    }
  },

  // ===========================================================
  // 3. APP REVIEWS & RATINGS
  // ===========================================================
  async submitAppReview(review: Omit<AppReview, 'id' | 'timestamp'>): Promise<string> {
    try {
      const payload = {
        ...review,
        userName: review.userName.trim() || 'Verified User',
        comment: review.comment.trim(),
        rating: Math.max(1, Math.min(5, Number(review.rating) || 5)),
        timestamp: Date.now(),
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'app_reviews'), payload);
      return docRef.id;
    } catch (err) {
      logFirestoreError('submitAppReview', 'app_reviews', err);
      throw err;
    }
  },

  subscribeToAppReviews(appId: string, callback: (reviews: AppReview[]) => void, onError?: (err: any) => void) {
    try {
      const q = query(collection(db, 'app_reviews'), where('appId', '==', appId));
      return onSnapshot(
        q,
        (snapshot) => {
          const list: AppReview[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              appId: data.appId,
              appName: data.appName,
              userName: data.userName || 'User',
              userEmail: data.userEmail,
              rating: data.rating || 5,
              comment: data.comment || '',
              timestamp: data.timestamp || Date.now()
            });
          });
          // Sort client-side by timestamp descending
          list.sort((a, b) => b.timestamp - a.timestamp);
          callback(list);
        },
        (error) => {
          logFirestoreError('subscribeToAppReviews', 'app_reviews', error);
          if (onError) onError(error);
        }
      );
    } catch (err) {
      logFirestoreError('subscribeToAppReviews:init', 'app_reviews', err);
      if (onError) onError(err);
      return () => {};
    }
  },

  // ===========================================================
  // 4. APP REQUESTS / SUGGESTIONS
  // ===========================================================
  async submitAppRequest(req: { requesterName: string; requesterEmail?: string; appTitle: string; category?: string; notes?: string }): Promise<string> {
    try {
      const payload = {
        requesterName: req.requesterName.trim() || 'Guest',
        requesterEmail: req.requesterEmail?.trim() || '',
        appTitle: req.appTitle.trim(),
        category: req.category?.trim() || 'General',
        notes: req.notes?.trim() || '',
        status: 'pending',
        timestamp: Date.now(),
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'app_requests'), payload);
      return docRef.id;
    } catch (err) {
      logFirestoreError('submitAppRequest', 'app_requests', err);
      throw err;
    }
  },

  // ===========================================================
  // 5. APK APPLICATIONS SYNC (SAVE, UPDATE, DELETE)
  // ===========================================================
  async syncAppToFirestore(app: AppItem): Promise<void> {
    try {
      const appRef = doc(db, 'apps', app.id);
      await setDoc(appRef, {
        ...app,
        updatedAtFirestore: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      logFirestoreError('syncAppToFirestore', 'apps', err);
      // Non-blocking: local/server holds truth as fallback
    }
  },

  async deleteAppFromFirestore(appId: string): Promise<void> {
    try {
      const appRef = doc(db, 'apps', appId);
      await deleteDoc(appRef);
    } catch (err) {
      logFirestoreError('deleteAppFromFirestore', 'apps', err);
    }
  },

  async getAppsFromFirestore(): Promise<AppItem[]> {
    try {
      const snapshot = await getDocs(collection(db, 'apps'));
      const apps: AppItem[] = [];
      snapshot.forEach((d) => {
        apps.push({ id: d.id, ...d.data() } as AppItem);
      });
      return apps;
    } catch (err) {
      logFirestoreError('getAppsFromFirestore', 'apps', err);
      return [];
    }
  },

  // ===========================================================
  // 6. RECORD DOWNLOAD EVENT
  // ===========================================================
  async recordDownload(appId: string, appName: string, version: string): Promise<void> {
    try {
      // 1. Add download record
      await addDoc(collection(db, 'downloads'), {
        appId,
        appName,
        version,
        timestamp: Date.now(),
        createdAt: serverTimestamp()
      });

      // 2. Increment downloadCount in doc if exists
      const appRef = doc(db, 'apps', appId);
      await updateDoc(appRef, {
        downloadCount: increment(1)
      }).catch(() => {
        // Doc might not exist yet in Firestore
      });
    } catch (err) {
      logFirestoreError('recordDownload', 'downloads', err);
    }
  }
};
