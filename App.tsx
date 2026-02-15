import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Partners from './components/Partners';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { PRODUCTS, HERO_IMAGES, PARTNERS, CATEGORIES } from './constants';
import { Product, Partner, SiteSettings, Category, Subcategory } from './types';
import { MessageCircle, Send, X, Bot, AlertCircle } from 'lucide-react';

// Import GoogleGenAI SDK
import { GoogleGenAI } from "@google/genai";

// Firebase
import { db, isConfigured } from './firebaseConfig';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  getDocs
} from "firebase/firestore";

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'online' | 'offline'>('offline');
  
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [banners, setBanners] = useState<string[]>(HERO_IMAGES);
  const [partners, setPartners] = useState<Partner[]>(PARTNERS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES.filter(c => c.id !== 'all'));
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'PINDORAMA',
    phone: '(34) 3333-3333',
    whatsapp: '5534999999999',
    email: 'contato@pindorama.com.br',
    address: 'Av. Guilherme Ferreira, s/n, Uberaba - MG',
    hoursWeek: '08:00 - 18:00',
    hoursSat: '08:00 - 12:00',
    instagram: 'https://instagram.com/madeireirapindorama',
    facebook: 'https://facebook.com/madeireirapindorama',
    pixelId: '',
    googleTag: ''
  });

  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'model', text: string, isError?: boolean }[]>([
    { role: 'model', text: 'Olá! Sou o assistente virtual da Madeireira Pindorama. Como posso ajudar com seu projeto de madeira hoje?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [aiMessages, isTyping]);

  useEffect(() => {
    if (!db || !isConfigured) {
      console.warn("⚠️ Firebase não configurado no firebaseConfig.ts");
      setLoading(false);
      setDbStatus('offline');
      return;
    }

    const unsubscribers: (() => void)[] = [];

    try {
      // Monitorar produtos - Se receber qualquer resposta (mesmo vazia), o status é ONLINE
      unsubscribers.push(onSnapshot(collection(db, "products"), snap => {
        const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as Product));
        if (data.length > 0) {
          setProducts(data);
        }
        // Se chegamos aqui, a conexão com o Firestore funcionou
        setDbStatus('online');
        setLoading(false);
      }, (err) => {
        console.error("Firebase Snapshot Error:", err);
        setDbStatus('offline');
        setLoading(false);
      }));

      unsubscribers.push(onSnapshot(doc(db, "settings", "main"), d => {
        if (d.exists()) setSettings(d.data() as SiteSettings);
      }));

      unsubscribers.push(onSnapshot(collection(db, "categories"), snap => {
        const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as Category));
        if (data.length > 0) setCategories(data);
      }));

    } catch (e) {
      console.error("Firebase Setup Error:", e);
      setLoading(false);
      setDbStatus('offline');
    }

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  const handleAISend = async () => {
    if (!aiInput.trim()) return;
    const text = aiInput;
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', text }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: text,
        config: { 
          systemInstruction: "Você é o consultor técnico especializado da Madeireira Pindorama em Uberaba, MG. Uma empresa com 45 anos de história. Responda de forma profissional e amigável. Se o cliente perguntar sobre preços, diga que temos opções variadas e convide-o para um orçamento no WhatsApp. Use termos técnicos de marcenaria e construção se necessário.",
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      
      const responseText = response.text || "Desculpe, tive um problema ao processar sua pergunta. Pode repetir?";
      setAiMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (e: any) {
      console.error("GenAI Error:", e);
      setAiMessages(prev => [...prev, { role: 'model', text: "O assistente está em manutenção rápida. Que tal falar com nossos vendedores pelo WhatsApp agora mesmo?", isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-pindorama-green text-white">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold tracking-widest uppercase animate-pulse">Madeireira Pindorama</h2>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <AdminPanel 
        products={products}
        onDeleteProduct={async (id) => db && await deleteDoc(doc(db, "products", id))}
        onUpdateProduct={async (p) => db && await updateDoc(doc(db, "products", p.id), p as any)}
        onAddProduct={async (p) => {
          if (!db) return;
          const { id, ...data } = p;
          await addDoc(collection(db, "products"), data);
        }}
        categories={categories}
        onAddCategory={async (c) => db && await addDoc(collection(db, "categories"), { name: c.name })}
        onDeleteCategory={async (id) => db && await deleteDoc(doc(db, "categories", id))}
        subcategories={subcategories}
        onAddSubcategory={async (s) => db && await addDoc(collection(db, "subcategories"), s)}
        onDeleteSubcategory={async (id) => db && await deleteDoc(doc(db, "subcategories", id))}
        messages={messages}
        onDeleteMessage={(id) => db && deleteDoc(doc(db, "messages", id))}
        settings={settings}
        onUpdateSettings={async (s) => db && await setDoc(doc(db, "settings", "main"), s)}
        banners={banners}
        onUpdateBanners={async (urls) => db && await setDoc(doc(db, "site_assets", "banners"), { urls })}
        onDeleteBanner={() => {}}
        partners={partners}
        onAddPartner={async (p) => db && await addDoc(collection(db, "partners"), p)}
        onUpdatePartner={() => {}}
        onDeletePartner={async (id) => db && await deleteDoc(doc(db, "partners", id))}
        onLogout={() => setIsAdmin(false)} 
        dbStatus={dbStatus}
        onSeedData={async () => {
          if (!db) {
            alert("Firebase não inicializado. Verifique as chaves no código.");
            return;
          }
          try {
            const prodsSnap = await getDocs(collection(db, "products"));
            if (prodsSnap.empty) {
              for (const p of PRODUCTS) {
                const { id, ...data } = p;
                await addDoc(collection(db, "products"), data);
              }
              for (const c of CATEGORIES.filter(x => x.id !== 'all')) {
                const { id, ...data } = c;
                await addDoc(collection(db, "categories"), data);
              }
              await setDoc(doc(db, "settings", "main"), settings);
              alert("✅ Banco de dados preenchido com sucesso! Agora o site exibirá os produtos.");
            } else {
              alert("O banco já possui dados. Não é necessário carregar os iniciais.");
            }
          } catch (err: any) { 
            console.error(err);
            alert("Erro ao enviar dados: " + err.message + ". Verifique se as regras do Firestore no Console do Firebase estão em 'Modo de Teste' ou permitem escrita."); 
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar onAdminClick={() => setIsAdmin(true)} onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      <main>
        <Hero images={banners} />
        <About />
        <Partners partners={partners} />
        <Products products={products} categories={categories} />
        <Testimonials />
      </main>
      <Footer settings={settings} />
      
      <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
        <button 
          onClick={() => setIsAIChatOpen(!isAIChatOpen)} 
          className="bg-amber-600 text-white p-4 rounded-full shadow-2xl hover:bg-amber-700 transition-all hover:scale-110 flex items-center justify-center group relative"
        >
          <Bot size={32} />
          <span className="absolute -top-12 right-0 bg-white text-pindorama-green text-[10px] font-bold py-1 px-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-stone-200">
            Consultor IA
          </span>
        </button>
        <a 
          href={`https://wa.me/${settings.whatsapp}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all hover:scale-110 flex items-center justify-center group relative"
        >
          <MessageCircle size={32} />
          <span className="absolute -top-12 right-0 bg-white text-green-600 text-[10px] font-bold py-1 px-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-stone-200">
            WhatsApp
          </span>
        </a>
      </div>

      {isAIChatOpen && (
        <div className="fixed bottom-24 right-8 z-50 w-[90vw] md:w-96 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-pindorama-green p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3"><Bot size={20} className="text-amber-400" /> <h4 className="font-bold text-sm">Consultor Pindorama</h4></div>
            <button onClick={() => setIsAIChatOpen(false)}><X size={20} /></button>
          </div>
          <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-4 bg-stone-50">
            {aiMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-amber-600 text-white shadow-md' 
                    : m.isError 
                      ? 'bg-red-50 text-red-700 border border-red-100' 
                      : 'bg-white text-stone-700 shadow-sm border border-stone-200'
                }`}>
                  {m.isError && <AlertCircle size={14} className="inline mr-2 mb-0.5" />}
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-stone-400 text-xs italic animate-pulse ml-2">Pensando...</div>}
          </div>
          <div className="p-4 bg-white border-t border-stone-100 flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-stone-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" 
              value={aiInput} 
              onChange={(e) => setAiInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleAISend()} 
              placeholder="Dúvida técnica sobre madeira?" 
            />
            <button 
              onClick={handleAISend} 
              disabled={isTyping}
              className="bg-pindorama-green text-white p-2 rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;