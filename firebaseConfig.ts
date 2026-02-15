
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// PASSO IMPORTANTE: Substitua os valores abaixo pelos do seu Console Firebase
const firebaseConfig = {
  apiKey: "API_KEY_PLACEHOLDER", 
  authDomain: "pindorama-madeiras.firebaseapp.com",
  projectId: "pindorama-madeiras", 
  storageBucket: "pindorama-madeiras.appspot.com",
  messagingSenderId: "SENDER_ID_PLACEHOLDER",
  appId: "APP_ID_PLACEHOLDER"
};

let db: any = null;

// Verifica se as chaves foram preenchidas antes de inicializar
if (firebaseConfig.apiKey !== "API_KEY_PLACEHOLDER") {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.error("Erro ao inicializar Firebase:", error);
  }
} else {
  console.warn("Firebase não configurado. O site está operando com dados locais (constants.ts).");
}

export { db };
