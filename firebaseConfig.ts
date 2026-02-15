
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// Substitua pelas chaves reais do seu Console do Firebase
const firebaseConfig = {
  apiKey: "API_KEY_PLACEHOLDER", 
  authDomain: "pindorama-madeiras.firebaseapp.com",
  projectId: "pindorama-madeiras", 
  storageBucket: "pindorama-madeiras.appspot.com",
  messagingSenderId: "SENDER_ID_PLACEHOLDER",
  appId: "APP_ID_PLACEHOLDER"
};

let app: FirebaseApp;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error("Erro ao inicializar Firebase. O site funcionará em modo offline.", error);
  // @ts-ignore - Fallback para evitar crash de renderização
  db = {}; 
}

export { db };
