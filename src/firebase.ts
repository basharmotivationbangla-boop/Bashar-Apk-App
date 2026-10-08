import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// Web app's Firebase configuration provided by the user
export const firebaseConfig = {
  apiKey: "AIzaSyC7kGu8gmJr421mHu6a7hytRiyGPUijWlI",
  authDomain: "bashar-apk-app.firebaseapp.com",
  projectId: "bashar-apk-app",
  storageBucket: "bashar-apk-app.firebasestorage.app",
  messagingSenderId: "796027885406",
  appId: "1:796027885406:web:772a852ea6c3e5cc90a1cf",
  measurementId: "G-V0D0FEE4PC"
};

// Initialize Firebase App & Firestore
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Analytics if supported in the browser
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  }).catch(() => {
    // Analytics optional fallback
  });
}
