
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
import { MessageCircle, Send, X, Bot } from 'lucide-react';

// Import Google GenAI SDK
import { GoogleGenAI } from "@google/genai";

// Firebase
import { db } from './firebaseConfig';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc 
} from "firebase/firestore";

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // States inicializados com dados locais (Fallbacks)
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

  // AI Assistant State
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Olá! Sou o assistente virtual da Madeireira Pindorama. Como posso ajudar com seu projeto de madeira hoje?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [aiMessages, isTyping]);

  // Sincronização Inteligente
  useEffect(() => {
    // Se o banco não estiver configurado, para o carregamento e usa locais
    if (!db) {
      console.log("Modo Offline: Usando dados de constants.ts");
      setLoading(false);
      return;
    }

    const unsubscribers: (() => void)[] = [];

    try {
      // Listener de Produtos
      unsubscribers.push(onSnapshot(collection(db, "products"), snap => {
        const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as Product));
        if (data.length > 0) setProducts(data);
        setLoading(false);
      }, () => setLoading(false)));

      // Listener de Configurações
      unsubscribers.push(onSnapshot(doc(db, "settings", "main"), d => {
        if (d.exists()) setSettings(d.data() as SiteSettings);
      }));

      // Listener de Banners
      unsubscribers.push(onSnapshot(doc(db, "site_assets", "banners"), d => {
        if (d.exists()) setBanners(d.data().urls || HERO_IMAGES);
      }));

      // Listener de Categorias
      unsubscribers.push(onSnapshot(collection(db, "categories"), snap => {
        const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as Category));
        if (data.length > 0) setCategories(data);
      }));

    } catch (e) {
      console.error("Erro nos listeners do Firebase:", e);
      setLoading(false);
    }

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  // Handlers Seguros (Só executam se db existir)
  const handleAddProduct = async (p: Product) => {
    if (!db) return alert("Firebase não configurado!");
    const { id, ...data } = p;
    await addDoc(collection(db, "products"), data);
  };

  const handleUpdateSettings = async (s: SiteSettings) => {
    if (!db) return alert("Firebase não configurado!");
    await setDoc(doc(db, "settings", "main"), s);
  };

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
        contents: [{ role: 'user', parts: [{ text: `Você é o consultor da Madeireira Pindorama. Ajude o cliente: ${text}` }] }],
        config: { systemInstruction: "Seja técnico sobre madeiras e cordial." }
      });
      setAiMessages(prev => [...prev, { role: 'model', text: response.text || "Desculpe, não consegui processar." }]);
    } catch (e) {
      setAiMessages(prev => [...prev, { role: 'model', text: "O assistente está descansando agora. Tente o WhatsApp!" }]);
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
        onAddProduct={handleAddProduct}
        categories={categories}
        onAddCategory={async (c) => db && await addDoc(collection(db, "categories"), { name: c.name })}
        onDeleteCategory={async (id) => db && await deleteDoc(doc(db, "categories", id))}
        subcategories={subcategories}
        onAddSubcategory={async (s) => db && await addDoc(collection(db, "subcategories"), s)}
        onDeleteSubcategory={async (id) => db && await deleteDoc(doc(db, "subcategories", id))}
        messages={messages}
        onDeleteMessage={(id) => db && deleteDoc(doc(db, "messages", id))}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        banners={banners}
        onUpdateBanners={async (urls) => db && await setDoc(doc(db, "site_assets", "banners"), { urls })}
        onDeleteBanner={() => {}}
        partners={partners}
        onAddPartner={async (p) => db && await addDoc(collection(db, "partners"), p)}
        onUpdatePartner={() => {}}
        onDeletePartner={async (id) => db && await deleteDoc(doc(db, "partners", id))}
        onLogout={() => setIsAdmin(false)} 
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
      
      {/* Botões Flutuantes */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
        <button onClick={() => setIsAIChatOpen(!isAIChatOpen)} className="bg-amber-600 text-white p-4 rounded-full shadow-2xl hover:bg-amber-700 transition-all hover:scale-110 flex items-center justify-center">
          <Bot size={32} />
        </button>
        <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all hover:scale-110 flex items-center justify-center">
          <MessageCircle size={32} />
        </a>
      </div>

      {/* Chat AI */}
      {isAIChatOpen && (
        <div className="fixed bottom-24 right-8 z-50 w-[90vw] md:w-96 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-pindorama-green p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3"><Bot size={20} className="text-amber-400" /> <h4 className="font-bold text-sm">Consultor Pindorama</h4></div>
            <button onClick={() => setIsAIChatOpen(false)}><X size={20} /></button>
          </div>
          <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-4 bg-stone-50">
            {aiMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-amber-600 text-white' : 'bg-white text-stone-700 shadow-sm'}`}>{m.text}</div>
              </div>
            ))}
            {isTyping && <div className="text-stone-400 text-xs italic animate-pulse">Digitando...</div>}
          </div>
          <div className="p-4 bg-white border-t border-stone-100 flex gap-2">
            <input type="text" className="flex-1 bg-stone-100 rounded-xl px-4 py-2 text-sm outline-none" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAISend()} placeholder="Dúvida sobre madeira?" />
            <button onClick={handleAISend} className="bg-pindorama-green text-white p-2 rounded-xl hover:bg-green-900 transition-colors"><Send size={20} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
