import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

let db: Firestore | null = null;
let isConfigured = false;

// Configurações do projeto obtidas do Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBthF4BdKaqhdJTOhAfOHOQdXLjdZSOL9I",
  authDomain: "madeireira-pindorama.firebaseapp.com",
  projectId: "madeireira-pindorama",
  storageBucket: "madeireira-pindorama.firebasestorage.app",
  messagingSenderId: "330462839099",
  appId: "1:330462839099:web:f8fade128630989d23371e",
  measurementId: "G-D911CE69RN"
};

try {
  // Inicializa o App
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  // Inicializa o Firestore
  db = getFirestore(app);
  
  isConfigured = !!db;
  if (isConfigured) {
    console.log("🔥 Firebase Firestore conectado com sucesso.");
  }
} catch (error: any) {
  isConfigured = false;
  db = null;
  console.error("❌ Erro ao conectar com Firebase:", error.message);
}

export { db, isConfigured };