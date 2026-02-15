import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Partners from './components/Partners';
import Projects from './components/Projects';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { PRODUCTS, HERO_IMAGES, PARTNERS, CATEGORIES } from './constants';
import { Product, Partner, SiteSettings, Category } from './types';
import { MessageCircle, Send, X, Bot, ChevronUp } from 'lucide-react';

import { GoogleGenAI } from "@google/genai";
import { supabase, isConfigured } from './supabaseConfig';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'online' | 'offline'>(isConfigured ? 'online' : 'offline');
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [banners, setBanners] = useState<string[]>(HERO_IMAGES);
  const [partners, setPartners] = useState<Partner[]>(PARTNERS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES.filter(c => c.id !== 'all'));
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
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [aiMessages, isTyping]);

  const fetchData = async () => {
    if (!isConfigured) return;
    try {
      const { data: prodData } = await supabase.from('products').select('*');
      if (prodData) setProducts(prodData as Product[]);

      const { data: settData } = await supabase.from('settings').select('*').single();
      if (settData) setSettings(settData as SiteSettings);

      const { data: catData } = await supabase.from('categories').select('*');
      if (catData) setCategories(catData as Category[]);

      setDbStatus('online');
    } catch (err) {
      console.error("Supabase Error:", err);
      setDbStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
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
          systemInstruction: "Você é o consultor técnico especializado da Madeireira Pindorama em Uberaba, MG. Uma empresa sólida com 45 anos de mercado. Responda de forma elegante, profissional e amigável.",
        }
      });
      setAiMessages(prev => [...prev, { role: 'model', text: response.text || "Desculpe, tive um problema." }]);
    } catch (e: any) {
      setAiMessages(prev => [...prev, { role: 'model', text: "Nosso consultor está offline no momento. Use o WhatsApp abaixo!", isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-pindorama-green text-white">
        <div className="w-20 h-20 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-bold tracking-[0.3em] uppercase">Pindorama</h2>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <AdminPanel 
        products={products}
        onDeleteProduct={async (id) => { await supabase.from('products').delete().eq('id', id); }}
        onUpdateProduct={async (p) => { await supabase.from('products').update(p).eq('id', p.id); }}
        onAddProduct={async (p) => { 
          const { id, ...data } = p; 
          await supabase.from('products').insert(data); 
        }}
        categories={categories}
        onAddCategory={async (c) => { await supabase.from('categories').insert(c); }}
        onDeleteCategory={async (id) => { await supabase.from('categories').delete().eq('id', id); }}
        settings={settings}
        onUpdateSettings={async (s) => { await supabase.from('settings').upsert(s); }}
        onLogout={() => setIsAdmin(false)} 
        dbStatus={dbStatus}
        onSeedData={async () => {
          for (const p of PRODUCTS) {
            const { id, ...cleanData } = p;
            await supabase.from('products').insert(cleanData);
          }
          alert("✅ Catálogo migrado para Supabase!");
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
        <Products products={products} categories={categories} whatsapp={settings.whatsapp} />
        <Projects />
        <Testimonials />
      </main>
      <Footer settings={settings} />
      
      <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
        {showScrollTop && (
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-stone-900/10 backdrop-blur-md text-stone-700 p-4 rounded-full shadow-lg hover:bg-stone-900/20 transition-all flex items-center justify-center animate-fade-in">
            <ChevronUp size={24} />
          </button>
        )}
        <button onClick={() => setIsAIChatOpen(!isAIChatOpen)} className="bg-amber-600 text-white p-5 rounded-[1.5rem] shadow-2xl hover:bg-amber-700 transition-all hover:scale-105 flex items-center justify-center group relative border-4 border-white">
          <Bot size={28} />
          <span className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold animate-pulse">1</span>
        </button>
        <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white p-5 rounded-[1.5rem] shadow-2xl hover:bg-green-600 transition-all hover:scale-105 flex items-center justify-center border-4 border-white">
          <MessageCircle size={28} />
        </a>
      </div>

      {isAIChatOpen && (
        <div className="fixed bottom-28 right-8 z-50 w-[90vw] md:w-[400px] bg-white rounded-[2.5rem] shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="bg-pindorama-green p-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-600 rounded-2xl flex items-center justify-center"><Bot size={24} /></div>
              <div>
                <h4 className="font-bold text-sm">Consultor Especialista</h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsAIChatOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={20} /></button>
          </div>
          <div ref={scrollRef} className="h-96 overflow-y-auto p-6 space-y-6 bg-stone-50">
            {aiMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm leading-relaxed ${m.role === 'user' ? 'bg-amber-600 text-white shadow-lg' : 'bg-white text-stone-700 shadow-sm border border-stone-200'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-white border-t border-stone-100 flex gap-3">
            <input type="text" className="flex-1 bg-stone-100 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-amber-500" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAISend()} placeholder="Qual sua dúvida sobre madeira?" />
            <button onClick={handleAISend} className="bg-pindorama-green text-white p-4 rounded-2xl hover:bg-green-800 transition-all shadow-lg active:scale-95 disabled:opacity-50" disabled={!aiInput.trim() || isTyping}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;