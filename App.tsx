import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Partners from './components/Partners';
import Projects from './components/Projects';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import HammerLoader from './components/HammerLoader';
import { PRODUCTS, HERO_IMAGES, PARTNERS, CATEGORIES, PROJECTS } from './constants';
import { Product, Partner, SiteSettings, Category, Subcategory, Project } from './types';
import { supabase, isConfigured } from './supabaseConfig';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHammer, setShowHammer] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<string[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Olá! Sou o assistente virtual da MADEIRAS BRASIL. Como posso ajudar você hoje?' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  const handleAISend = async () => {
    if (!aiInput.trim()) return;

    const userMsg = aiInput.trim();
    setAiMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiInput('');
    setIsAiTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: `Você é o consultor virtual especializado da MADEIRAS BRASIL, a mais tradicional de Uberaba-MG.
          Seu objetivo é ajudar clientes com dúvidas sobre madeiras (Paraju, Angelim, Cedrinho, etc), telhados, decks, pergolados e forros.
          
          Informações da Empresa:
          - Nome: MADEIRAS BRASIL
          - Localização: Uberaba, MG
          - Especialidade: Madeiras brutas e aparelhadas, ferragens e telhas.
          - Tom de voz: Profissional, prestativo e conhecedor técnico.
          
          Dados atuais do site:
          - Telefone: ${settings.phone}
          - WhatsApp: ${settings.whatsapp}
          - Endereço: ${settings.address}
          
          Produtos disponíveis: ${products.map(p => p.name).join(', ')}
          
          Responda sempre em Português do Brasil. Seja conciso mas informativo. Se não souber algo, peça para o cliente entrar no WhatsApp.`,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
        }
      });

      const text = response.text || "Desculpe, não consegui processar sua mensagem.";
      setAiMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error: any) {
      console.error("Erro na IA:", error);
      let errorMsg = "Desculpe, tive um problema técnico. Pode tentar novamente ou nos chamar no WhatsApp?";
      if (error.message?.includes('billing')) {
        errorMsg = "O serviço de IA está temporariamente indisponível por questões de cota. Por favor, use o WhatsApp para falar conosco!";
      }
      setAiMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'MADEIRAS BRASIL',
    phone: '(34) 3333-3333',
    whatsapp: '5534999999999',
    email: 'contato@madeirasbrasil.com.br',
    address: 'Av. Guilherme Ferreira, Uberaba - MG',
    hoursWeek: '08:00 - 18:00',
    hoursSat: '08:00 - 12:00',
    instagram: 'https://instagram.com/madeirasbrasil',
    facebook: 'https://facebook.com/madeirasbrasil',
    pixelId: '',
    googleTag: '',
    aboutTitle: 'A Tradição que Solidifica Uberaba.',
    aboutText: 'Nascemos no coração do Triângulo Mineiro com uma promessa: oferecer madeira que resiste ao tempo.',
    mission: 'Prover soluções em madeira de alta qualidade.',
    vision: 'Ser referência absoluta em Uberaba.',
    principles: 'Integridade em cada venda.',
    valuesText: 'Tradição e Qualidade.'
  });

  const fetchData = async () => {
    if (!isConfigured) {
      setProducts(PRODUCTS);
      setCategories(CATEGORIES.filter(c => c.id !== 'all'));
      setPartners(PARTNERS);
      setProjects(PROJECTS);
      setBanners(HERO_IMAGES);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Add a simple timeout for the Supabase requests
      const timeout = (ms: number) => new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms));
      
      const fetchDataWithTimeout = async () => {
        const { data: settData } = await supabase.from('settings').select('*').single();
        if (settData) setSettings(prev => ({ ...prev, ...settData }));
        
        const { data: pData } = await supabase.from('products').select('*');
        if (pData) setProducts(pData);
        
        const { data: cData } = await supabase.from('categories').select('*');
        if (cData) setCategories(cData);

        const { data: subData } = await supabase.from('subcategories').select('*');
        if (subData) setSubcategories(subData);
        
        const { data: prtData } = await supabase.from('partners').select('*');
        if (prtData) setPartners(prtData);

        const { data: projData } = await supabase.from('projects').select('*');
        if (projData) setProjects(projData);

        const { data: bnrData } = await supabase.from('banners').select('*');
        if (bnrData) setBanners(bnrData.map(b => b.image));
      };

      await Promise.race([fetchDataWithTimeout(), timeout(5000)]);
      
    } catch (err: any) {
      console.error('Sincronização falhou, detalhes do erro:', err);
      alert('Erro ao carregar dados do banco: ' + (err.message || 'Erro desconhecido'));
      setProducts(PRODUCTS);
      setCategories(CATEGORIES.filter(c => c.id !== 'all'));
      setPartners(PARTNERS);
      setProjects(PROJECTS);
      setBanners(HERO_IMAGES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateSettings = async (s: SiteSettings) => {
    try {
      const { error } = await supabase.from('settings').upsert({ id: 1, ...s });
      if (error) throw error;
      setSettings(s);
      alert("Configurações salvas com sucesso!");
    } catch (err: any) {
      console.error("Erro ao salvar settings:", err);
      alert("Erro ao salvar no banco: " + err.message);
    }
  };

  const triggerHammerLoader = (targetId: string) => {
    setShowHammer(true);
    setTimeout(() => {
      setShowHammer(false);
      const element = document.getElementById(targetId);
      if (element) {
        window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
      }
    }, 1500);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pindorama-green text-white">
      <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black uppercase tracking-widest text-[10px]">Lendo Banco de Dados...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 overflow-x-hidden">
      {showHammer && <HammerLoader />}
      
      {!isAdmin ? (
        <>
          <Navbar onAdminClick={() => setIsAdmin(true)} onHomeClick={() => triggerHammerLoader('inicio')} onNavLinkClick={(t) => triggerHammerLoader(t)} settings={settings} />
          <Hero images={banners.length > 0 ? banners : HERO_IMAGES} settings={settings} />
          <About settings={settings} />
          <Partners partners={partners} />
          <Products products={products} categories={categories} subcategories={subcategories} whatsapp={settings.whatsapp} />
          <Projects projects={projects} />
          <Testimonials />
          <Footer settings={settings} />
        </>
      ) : (
        <AdminPanel 
          {...{ products, categories, subcategories, partners, settings, projects, banners }}
          onDeleteProduct={async (id) => {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (!error) setProducts(prev => prev.filter(p => p.id !== id));
            else alert("Erro ao excluir: " + error.message);
          }}
          onUpdateProduct={async (p) => {
            const { error } = await supabase.from('products').update(p).eq('id', p.id);
            if (!error) setProducts(prev => prev.map(item => item.id === p.id ? p : item));
            else alert("Erro ao atualizar: " + error.message);
          }}
          onAddProduct={async (p) => {
            const { data, error } = await supabase.from('products').insert(p).select().single();
            if (!error && data) {
              setProducts(prev => [data, ...prev]);
            } else {
              console.error("Erro detalhado Supabase:", error);
              alert("Erro ao adicionar produto: " + (error?.message || "Erro desconhecido"));
            }
          }}
          onAddCategory={async (c) => {
            const { data, error } = await supabase.from('categories').insert({ name: c.name }).select().single();
            if (!error && data) {
              setCategories(prev => [...prev, data]);
            } else {
              console.error("Erro detalhado Supabase:", error);
              alert("Erro ao adicionar categoria: " + (error?.message || "Erro desconhecido") + (error?.details ? " - " + error.details : ""));
            }
          }}
          onUpdateCategory={async (c) => {
             const { error } = await supabase.from('categories').update({ name: c.name }).eq('id', c.id);
             if (!error) setCategories(prev => prev.map(item => item.id === c.id ? c : item));
          }}
          onDeleteCategory={async (id) => {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (!error) setCategories(prev => prev.filter(c => c.id !== id));
            else alert("Erro ao excluir categoria: " + error.message);
          }}
          onAddSubcategory={async (sub) => {
            const { data, error } = await supabase.from('subcategories').insert(sub).select().single();
            if (!error && data) {
              setSubcategories(prev => [...prev, data]);
            } else {
              console.error("Erro detalhado Supabase:", error);
              alert("Erro ao adicionar subcategoria: " + (error?.message || "Erro desconhecido"));
            }
          }}
          onUpdateSubcategory={async (s) => {
             const { error } = await supabase.from('subcategories').update({ name: s.name, categoryId: s.categoryId }).eq('id', s.id);
             if (!error) setSubcategories(prev => prev.map(item => item.id === s.id ? s : item));
          }}
          onDeleteSubcategory={async (id) => {
            const { error } = await supabase.from('subcategories').delete().eq('id', id);
            if (!error) setSubcategories(prev => prev.filter(s => s.id !== id));
            else alert("Erro ao excluir subcategoria: " + error.message);
          }}
          onAddPartner={async (p) => {
            const { data, error } = await supabase.from('partners').insert(p).select().single();
            if (!error && data) setPartners(prev => [...prev, data]);
            else alert("Erro ao adicionar parceiro: " + error.message);
          }}
          onDeletePartner={async (id) => {
            const { error } = await supabase.from('partners').delete().eq('id', id);
            if (!error) setPartners(prev => prev.filter(p => p.id !== id));
            else alert("Erro ao excluir parceiro: " + error.message);
          }}
          onAddProject={async (p) => {
            const { data, error } = await supabase.from('projects').insert(p).select().single();
            if (!error && data) setProjects(prev => [data, ...prev]);
            else alert("Erro ao adicionar projeto: " + error.message);
          }}
          onUpdateProject={async (p) => {
            const { error } = await supabase.from('projects').update(p).eq('id', p.id);
            if (!error) setProjects(prev => prev.map(item => item.id === p.id ? p : item));
            else alert("Erro ao atualizar projeto: " + error.message);
          }}
          onDeleteProject={async (id) => {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (!error) setProjects(prev => prev.filter(p => p.id !== id));
            else alert("Erro ao excluir projeto: " + error.message);
          }}
          onAddBanner={async (u) => {
            const { error } = await supabase.from('banners').insert({ image: u });
            if (!error) setBanners(prev => [...prev, u]);
            else alert("Erro ao adicionar banner: " + error.message);
          }}
          onDeleteBanner={async (u) => {
            const { error } = await supabase.from('banners').delete().eq('image', u);
            if (!error) setBanners(prev => prev.filter(b => b !== u));
            else alert("Erro ao excluir banner: " + error.message);
          }}
          onUpdateSettings={handleUpdateSettings}
          onLogout={() => setIsAdmin(false)} 
        />
      )}

      {/* Botão Flutuante da IA */}
      {!isAdmin && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
          {isAIChatOpen && (
            <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-fade-in">
              <div className="bg-pindorama-green p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bot size={20} className="text-amber-500" />
                  <span className="font-bold text-sm">Consultor MADEIRAS BRASIL</span>
                </div>
                <button onClick={() => setIsAIChatOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 h-80 overflow-y-auto p-4 space-y-4 bg-stone-50">
                {aiMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-pindorama-green text-white rounded-tr-none' 
                        : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white text-stone-400 border border-stone-200 p-3 rounded-2xl rounded-tl-none text-xs italic animate-pulse">
                      Digitando...
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-stone-100 bg-white flex gap-2">
                <input 
                  type="text" 
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAISend()}
                  placeholder="Tire sua dúvida sobre madeiras..."
                  className="flex-1 bg-stone-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-pindorama-green outline-none"
                />
                <button 
                  onClick={handleAISend}
                  disabled={isAiTyping || !aiInput.trim()}
                  className="bg-pindorama-green text-white p-2 rounded-full hover:bg-opacity-90 disabled:opacity-50 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
          
          <button 
            onClick={() => setIsAIChatOpen(!isAIChatOpen)}
            className="bg-pindorama-green text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center gap-2 group"
          >
            <MessageSquare size={24} />
            {!isAIChatOpen && <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap text-sm font-bold">Dúvida Técnica?</span>}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
