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
      const { data: settData } = await supabase.from('settings').select('*').single();
      if (settData) setSettings(settData);
      
      setDbStatus('online');

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

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 2000);
  };

  const handleAddProduct = async (p: Product) => {
    const n = { ...p, id: Math.random().toString(36).substr(2, 9) };
    setProducts(prev => [n, ...prev]);
    if (dbStatus === 'online') await supabase.from('products').insert(n);
  };

  const handleUpdateProduct = async (p: Product) => {
    setProducts(prev => prev.map(item => item.id === p.id ? p : item));
    if (dbStatus === 'online') await supabase.from('products').update(p).eq('id', p.id);
  };

  const handleDeleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    if (dbStatus === 'online') await supabase.from('products').delete().eq('id', id);
  };

  const handleAddProject = async (p: { title: string, location: string, image: string }) => {
    const n = { ...p, id: Math.random().toString(36).substr(2, 9) };
    setProjects(prev => [n, ...prev]);
    if (dbStatus === 'online') await supabase.from('projects').insert(n);
  };

  const handleDeleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (dbStatus === 'online') await supabase.from('projects').delete().eq('id', id);
  };

  const handleAddBanner = async (imageUrl: string) => {
    setBanners(prev => [...prev, imageUrl]);
    if (dbStatus === 'online') await supabase.from('banners').insert({ image: imageUrl });
  };

  const handleDeleteBanner = async (imageUrl: string) => {
    setBanners(prev => prev.filter(b => b !== imageUrl));
    if (dbStatus === 'online') await supabase.from('banners').delete().eq('image', imageUrl);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pindorama-green text-white">
      <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest animate-pulse uppercase">MADEIREIRA PINDORAMA</p>
    </div>
  );

  if (isAdmin) {
    return (
      <AdminPanel 
        {...{ products, categories, subcategories, partners, brands, videos, settings, dbStatus, projects, banners }}
        dbError={dbError}
        onDeleteProduct={handleDeleteProduct}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onAddCategory={async (c) => {
          const n = { ...c, id: Math.random().toString(36) };
          setCategories(prev => [...prev, n]);
          if (dbStatus === 'online') await supabase.from('categories').insert(n);
        }}
        onDeleteCategory={async (id) => {
          setCategories(prev => prev.filter(c => c.id !== id));
          if (dbStatus === 'online') await supabase.from('categories').delete().eq('id', id);
        }}
        onAddSubcategory={async (sub) => {
          const n = { ...sub, id: Math.random().toString(36) };
          setSubcategories(prev => [...prev, n]);
          if (dbStatus === 'online') await supabase.from('subcategories').insert(n);
        }}
        onDeleteSubcategory={async (id) => {
          setSubcategories(prev => prev.filter(s => s.id !== id));
          if (dbStatus === 'online') await supabase.from('subcategories').delete().eq('id', id);
        }}
        onAddPartner={async (p) => {
          const n = { ...p, id: Math.random().toString(36) };
          setPartners(prev => [...prev, n]);
          if (dbStatus === 'online') await supabase.from('partners').insert(n);
        }}
        onDeletePartner={async (id) => {
          setPartners(prev => prev.filter(p => p.id !== id));
          if (dbStatus === 'online') await supabase.from('partners').delete().eq('id', id);
        }}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
        onAddBanner={handleAddBanner}
        onDeleteBanner={handleDeleteBanner}
        onAddVideo={async (v) => {
          const n = { ...v, id: Math.random().toString(36) };
          setVideos(prev => [...prev, n]);
          if (dbStatus === 'online') await supabase.from('videos').insert(n);
        }}
        onDeleteVideo={async (id) => {
          setVideos(prev => prev.filter(v => v.id !== id));
          if (dbStatus === 'online') await supabase.from('videos').delete().eq('id', id);
        }}
        onUpdateSettings={async (s) => {
          setSettings(s);
          if (dbStatus === 'online') await supabase.from('settings').upsert({ id: 1, ...s });
        }}
        onLogout={() => setIsAdmin(false)} 
        onAddBrand={async () => {}}
        onDeleteBrand={async () => {}}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
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