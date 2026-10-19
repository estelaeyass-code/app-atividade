
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCugfVAYxJM5xITBjZJhz-tWw0VdxdW4o",
  authDomain: "testefirebase-4c26f.firebaseapp.com",
  projectId: "testefirebase-4c26f",
  storageBucket: "testefirebase-4c26f.firebasestorage.app",
  messagingSenderId: "1004505331790",
  appId: "1:1004505331790:web:21e78c4fa7c23c3d9a6b1f"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
