import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBthF4BdKaqhdJTOhAfOHOQdXLjdZSOL9I",
  authDomain: "madeireira-pindorama.firebaseapp.com",
  projectId: "madeireira-pindorama",
  storageBucket: "madeireira-pindorama.firebasestorage.app",
  messagingSenderId: "330462839099",
  appId: "1:330462839099:web:c2f7560e13602af423371e",
  measurementId: "G-W6GEL5FCQZ"
};

let db: Firestore | null = null;
let isConfigured = false;

try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  isConfigured = true;
  console.log("🔥 Firebase inicializado.");
} catch (error: any) {
  console.error("❌ Erro ao conectar com Firebase:", error.message);
}

export { db, isConfigured };