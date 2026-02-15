import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
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
  // Check for valid API key and prevent double initialization
  if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("_DISABLED")) {
    const app: FirebaseApp = getApps().length === 0 
      ? initializeApp(firebaseConfig) 
      : getApp();
    
    // Ensure the service is retrieved using the correct app instance
    db = getFirestore(app);
    isConfigured = !!db;
    
    if (isConfigured) {
      console.log("🔥 Firebase e Firestore inicializados com sucesso.");
    }
  } else {
    console.warn("⚠️ Firebase aguardando configuração de chave de API.");
  }
} catch (error) {
  console.error("❌ Erro ao inicializar serviços do Firebase:", error);
}

export { db, isConfigured };