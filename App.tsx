
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
import { Product, Partner, SiteSettings, Category, Subcategory, Brand, YouTubeVideo, Project } from './types';
import { supabase, isConfigured } from './supabaseConfig';
import { ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHammer, setShowHammer] = useState(false);
  const [dbStatus, setDbStatus] = useState<'online' | 'offline' | 'error'>(isConfigured ? 'online' : 'offline');
  const [dbError, setDbError] = useState<string | null>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<string[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
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
    googleTag: ''
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
      
      // 1. Carregar Configurações (Identidade do Site)
      const { data: settData, error: settError } = await supabase.from('settings').select('*').single();
      if (settData) setSettings(settData);
      
      setDbStatus('online');

      // 2. Carregar Produtos
      const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (pData && pData.length > 0) setProducts(pData);
      else setProducts(PRODUCTS);
      
      // 3. Carregar Categorias e Subcategorias
      const { data: cData } = await supabase.from('categories').select('*');
      if (cData && cData.length > 0) setCategories(cData);
      else setCategories(CATEGORIES.filter(c => c.id !== 'all'));

      const { data: subData } = await supabase.from('subcategories').select('*');
      if (subData) setSubcategories(subData);
      
      // 4. Carregar Parceiros e Projetos
      const { data: prtData } = await supabase.from('partners').select('*');
      if (prtData && prtData.length > 0) setPartners(prtData);
      else setPartners(PARTNERS);

      const { data: projData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (projData && projData.length > 0) setProjects(projData);
      else setProjects(PROJECTS);

      // 5. Carregar Banners (Slide do Topo)
      const { data: bnrData } = await supabase.from('banners').select('*');
      if (bnrData && bnrData.length > 0) {
        setBanners(bnrData.map(b => b.image));
      } else {
        setBanners(HERO_IMAGES);
      }

    } catch (err: any) {
      console.error('Erro de sincronização:', err.message);
      setDbStatus('error');
      setDbError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers de Persistência com Alertas
  const handleAddProduct = async (p: Product) => {
    try {
      const newProduct = { ...p, id: Math.random().toString(36).substr(2, 9), created_at: new Date() };
      if (isConfigured) {
        const { error } = await supabase.from('products').insert([newProduct]);
        if (error) throw error;
      }
      setProducts(prev => [newProduct, ...prev]);
      alert("Madeira cadastrada com sucesso!");
    } catch (err: any) {
      alert(`Erro ao salvar produto: ${err.message}`);
    }
  };

  const handleUpdateProduct = async (p: Product) => {
    try {
      if (isConfigured) {
        const { error } = await supabase.from('products').update(p).eq('id', p.id);
        if (error) throw error;
      }
      setProducts(prev => prev.map(item => item.id === p.id ? p : item));
      alert("Produto atualizado!");
    } catch (err: any) {
      alert(`Erro ao atualizar: ${err.message}`);
    }
  };

  const handleAddCategory = async (c: { name: string }) => {
    try {
      const newCat = { ...c, id: Math.random().toString(36).substr(2, 9) };
      if (isConfigured) {
        const { error } = await supabase.from('categories').insert([newCat]);
        if (error) throw error;
      }
      setCategories(prev => [...prev, newCat]);
      alert("Categoria salva!");
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    }
  };

  const handleUpdateSettings = async (s: SiteSettings) => {
    try {
      if (isConfigured) {
        const { error } = await supabase.from('settings').upsert({ id: 1, ...s });
        if (error) throw error;
      }
      setSettings(s);
      alert("Identidade do site atualizada com sucesso!");
    } catch (err: any) {
      alert(`Erro ao salvar configurações: ${err.message}`);
    }
  };

  const handleAddBanner = async (url: string) => {
    try {
      if (isConfigured) {
        const { error } = await supabase.from('banners').insert([{ image: url }]);
        if (error) throw error;
      }
      setBanners(prev => [...prev, url]);
      alert("Banner adicionado ao slide!");
    } catch (err: any) {
      alert(`Erro ao salvar banner: ${err.message}`);
    }
  };

  const triggerHammerLoader = (targetId: string) => {
    setShowHammer(true);
    setTimeout(() => {
      setShowHammer(false);
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 1500);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pindorama-green text-white">
      <div className="relative mb-8">
         <div className="w-24 h-24 border-8 border-amber-600/20 border-t-amber-600 rounded-full animate-spin"></div>
         <ShieldCheck className="absolute inset-0 m-auto text-amber-500" size={32} />
      </div>
      <p className="font-black tracking-[0.4em] animate-pulse uppercase italic text-sm">Madeireira Pindorama</p>
      <p className="text-stone-400 text-[10px] font-bold uppercase mt-4 tracking-widest">Uberaba - MG</p>
    </div>
  );

  if (isAdmin) {
    return (
      <AdminPanel 
        {...{ products, categories, subcategories, partners, brands, videos, settings, dbStatus, projects, banners }}
        dbError={dbError}
        onDeleteProduct={async (id) => {
          if (isConfigured) await supabase.from('products').delete().eq('id', id);
          setProducts(prev => prev.filter(p => p.id !== id));
        }}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onAddCategory={handleAddCategory}
        onDeleteCategory={async (id) => {
          if (isConfigured) await supabase.from('categories').delete().eq('id', id);
          setCategories(prev => prev.filter(c => c.id !== id));
        }}
        onAddSubcategory={async (sub) => {
          const n = { ...sub, id: Math.random().toString(36) };
          if (isConfigured) await supabase.from('subcategories').insert(n);
          setSubcategories(prev => [...prev, n]);
        }}
        onDeleteSubcategory={async (id) => {
          if (isConfigured) await supabase.from('subcategories').delete().eq('id', id);
          setSubcategories(prev => prev.filter(s => s.id !== id));
        }}
        onAddPartner={async (p) => {
          const n = { ...p, id: Math.random().toString(36) };
          if (isConfigured) await supabase.from('partners').insert(n);
          setPartners(prev => [...prev, n]);
        }}
        onDeletePartner={async (id) => {
          if (isConfigured) await supabase.from('partners').delete().eq('id', id);
          setPartners(prev => prev.filter(p => p.id !== id));
        }}
        onAddProject={async (p) => {
          const n = { ...p, id: Math.random().toString(36), created_at: new Date() };
          if (isConfigured) await supabase.from('projects').insert(n);
          setProjects(prev => [n, ...prev]);
        }}
        onDeleteProject={async (id) => {
          if (isConfigured) await supabase.from('projects').delete().eq('id', id);
          setProjects(prev => prev.filter(p => p.id !== id));
        }}
        onAddBanner={handleAddBanner}
        onDeleteBanner={async (url) => {
          if (isConfigured) await supabase.from('banners').delete().eq('image', url);
          setBanners(prev => prev.filter(b => b !== url));
        }}
        onUpdateSettings={handleUpdateSettings}
        onLogout={() => setIsAdmin(false)} 
        onAddBrand={async () => {}}
        onDeleteBrand={async () => {}}
        onAddVideo={async () => {}}
        onDeleteVideo={async () => {}}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 overflow-x-hidden">
      {showHammer && <HammerLoader />}
      <Navbar 
        onAdminClick={() => setIsAdmin(true)} 
        onHomeClick={() => triggerHammerLoader('inicio')}
        onNavLinkClick={(target) => triggerHammerLoader(target)}
        settings={settings}
      />
      <Hero images={banners.length > 0 ? banners : HERO_IMAGES} />
      <About />
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
    </div>
  );
};

export default App;
