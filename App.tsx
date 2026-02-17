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

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHammer, setShowHammer] = useState(false);
  const [dbStatus, setDbStatus] = useState<'online' | 'offline' | 'error'>(isConfigured ? 'online' : 'offline');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<string[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Madeireira Pindorama',
    phone: '(34) 3333-3333',
    whatsapp: '5534999999999',
    email: 'contato@madeireirapindorama.com.br',
    address: 'Av. Guilherme Ferreira, Uberaba - MG',
    hoursWeek: '08:00 - 18:00',
    hoursSat: '08:00 - 12:00',
    instagram: 'https://instagram.com/madeireirapindorama',
    facebook: 'https://facebook.com/madeireirapindorama',
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
      // Fixed: Use initial static projects directly since the constant is already correctly typed
      setProjects(PROJECTS);
      setBanners(HERO_IMAGES);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data: settData } = await supabase.from('settings').select('*').single();
      if (settData) setSettings(prev => ({ ...prev, ...settData }));
      
      const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (pData) setProducts(pData);
      
      const { data: cData } = await supabase.from('categories').select('*');
      if (cData) setCategories(cData);

      const { data: subData } = await supabase.from('subcategories').select('*');
      if (subData) setSubcategories(subData);
      
      const { data: prtData } = await supabase.from('partners').select('*');
      if (prtData) setPartners(prtData);

      const { data: projData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (projData) setProjects(projData);

      const { data: bnrData } = await supabase.from('banners').select('*');
      if (bnrData) setBanners(bnrData.map(b => b.image));

      setDbStatus('online');
    } catch (err: any) {
      console.error('Erro de sincronização:', err.message);
      setDbStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateSettings = async (s: SiteSettings) => {
    if (isConfigured) await supabase.from('settings').upsert({ id: 1, ...s });
    setSettings(s);
    alert("Configurações atualizadas!");
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
      <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black uppercase tracking-widest">Iniciando Sistema...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 overflow-x-hidden">
      {showHammer && <HammerLoader />}
      
      {!isAdmin ? (
        <>
          <Navbar 
            onAdminClick={() => setIsAdmin(true)} 
            onHomeClick={() => triggerHammerLoader('inicio')}
            onNavLinkClick={(target) => triggerHammerLoader(target)}
            settings={settings}
          />
          <Hero images={banners.length > 0 ? banners : HERO_IMAGES} settings={settings} />
          <About settings={settings} />
          <Partners partners={partners} />
          <Products 
            products={products} 
            categories={categories} 
            subcategories={subcategories}
            whatsapp={settings.whatsapp} 
          />
          <Projects projects={projects} />
          <Testimonials />
          <Footer settings={settings} />
        </>
      ) : (
        <AdminPanel 
          {...{ products, categories, subcategories, partners, settings, projects, banners }}
          onDeleteProduct={async (id) => {
            if (isConfigured) await supabase.from('products').delete().eq('id', id);
            setProducts(prev => prev.filter(p => p.id !== id));
          }}
          onUpdateProduct={async (p) => {
            if (isConfigured) await supabase.from('products').update(p).eq('id', p.id);
            setProducts(prev => prev.map(item => item.id === p.id ? p : item));
          }}
          onAddProduct={async (p) => {
            const n = { ...p, id: Math.random().toString(36).substr(2, 9), created_at: new Date() };
            if (isConfigured) await supabase.from('products').insert(n);
            setProducts(prev => [n, ...prev]);
          }}
          onAddCategory={async (c) => {
            const n = { id: Math.random().toString(36).substr(2, 5), name: c.name };
            if (isConfigured) await supabase.from('categories').insert(n);
            setCategories(prev => [...prev, n]);
          }}
          onUpdateCategory={async (c) => {
             if (isConfigured) await supabase.from('categories').update({name: c.name}).eq('id', c.id);
             setCategories(prev => prev.map(item => item.id === c.id ? c : item));
          }}
          onDeleteCategory={async (id) => {
            if (isConfigured) await supabase.from('categories').delete().eq('id', id);
            setCategories(prev => prev.filter(c => c.id !== id));
          }}
          onAddSubcategory={async (sub) => {
            const n = { id: Math.random().toString(36).substr(2, 5), ...sub };
            if (isConfigured) await supabase.from('subcategories').insert(n);
            setSubcategories(prev => [...prev, n]);
          }}
          onUpdateSubcategory={async (s) => {
             if (isConfigured) await supabase.from('subcategories').update(s).eq('id', s.id);
             setSubcategories(prev => prev.map(item => item.id === s.id ? s : item));
          }}
          onDeleteSubcategory={async (id) => {
            if (isConfigured) await supabase.from('subcategories').delete().eq('id', id);
            setSubcategories(prev => prev.filter(s => s.id !== id));
          }}
          onAddPartner={async (p) => {
            const n = { ...p, id: Math.random().toString(36).substr(2, 5) };
            if (isConfigured) await supabase.from('partners').insert(n);
            setPartners(prev => [...prev, n]);
          }}
          onDeletePartner={async (id) => {
            if (isConfigured) await supabase.from('partners').delete().eq('id', id);
            setPartners(prev => prev.filter(p => p.id !== id));
          }}
          onAddProject={async (p) => {
            const n = { ...p, id: Math.random().toString(36).substr(2, 5), created_at: new Date() };
            if (isConfigured) await supabase.from('projects').insert(n);
            setProjects(prev => [n, ...prev]);
          }}
          onUpdateProject={async (p) => {
             if (isConfigured) await supabase.from('projects').update(p).eq('id', p.id);
             setProjects(prev => prev.map(item => item.id === p.id ? p : item));
          }}
          onDeleteProject={async (id) => {
            if (isConfigured) await supabase.from('projects').delete().eq('id', id);
            setProjects(prev => prev.filter(p => p.id !== id));
          }}
          onAddBanner={async (url) => {
            if (isConfigured) await supabase.from('banners').insert({ image: url });
            setBanners(prev => [...prev, url]);
          }}
          onDeleteBanner={async (url) => {
            if (isConfigured) await supabase.from('banners').delete().eq('image', url);
            setBanners(prev => prev.filter(b => b !== url));
          }}
          onUpdateSettings={handleUpdateSettings}
          onLogout={() => setIsAdmin(false)} 
        />
      )}
    </div>
  );
};

export default App;