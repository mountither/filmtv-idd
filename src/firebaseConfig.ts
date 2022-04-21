import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const apiKey = import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY as string;
const authDomain = import.meta.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN as string;
const projectId = import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID as string;
const storageBucket = import.meta.env
  .VITE_PUBLIC_FIREBASE_STORAGE_BUCKET as string;
const messagingSenderId = import.meta.env
  .VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string;
const appId = import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID as string;

export const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

const firebaseClient = initializeApp(firebaseConfig);

export const currentUser = () => {
  return new Promise((resolve, reject) => {
      const unsubscribe = getAuth().onAuthStateChanged(user => {
          unsubscribe();
          resolve(user);
      }, reject);
  })
};

export const firestore = getFirestore(firebaseClient);



export default firebaseClient;
