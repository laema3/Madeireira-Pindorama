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
import { PRODUCTS, HERO_IMAGES, PARTNERS, CATEGORIES } from './constants';
import { Product, Partner, SiteSettings, Category, Subcategory, Brand, YouTubeVideo } from './types';
import { supabase, isConfigured } from './supabaseConfig';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'online' | 'offline' | 'error'>(isConfigured ? 'offline' : 'offline');
  const [dbError, setDbError] = useState<string | null>(null);
  
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [banners, setBanners] = useState<string[]>(HERO_IMAGES);
  const [partners, setPartners] = useState<Partner[]>(PARTNERS);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES.filter(c => c.id !== 'all'));
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  
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

  const fetchData = async () => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    try {
      const { data: settData, error: settError } = await supabase.from('settings').select('*').single();
      
      if (settError && settError.code !== 'PGRST116') {
        setDbStatus('error');
        setDbError(settError.message);
      } else {
        setDbStatus('online');
        if (settData) setSettings(settData);

        const { data: pData } = await supabase.from('products').select('*');
        if (pData && pData.length > 0) setProducts(pData);
        
        const { data: cData } = await supabase.from('categories').select('*');
        if (cData && cData.length > 0) setCategories(cData);
        
        const { data: sData } = await supabase.from('subcategories').select('*');
        if (sData) setSubcategories(sData);
        
        const { data: prtData } = await supabase.from('partners').select('*');
        if (prtData) setPartners(prtData);
        
        const { data: brnData } = await supabase.from('brands').select('*');
        if (brnData) setBrands(brnData);
        
        const { data: vData } = await supabase.from('videos').select('*');
        if (vData) setVideos(vData);
      }
    } catch (err: any) {
      setDbStatus('error');
      setDbError(err.message || 'Erro desconhecido ao conectar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CRUD Handlers
  const handleDeleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    if (dbStatus === 'online') await supabase.from('products').delete().eq('id', id);
  };
  const handleUpdateProduct = async (p: Product) => {
    setProducts(prev => prev.map(item => item.id === p.id ? p : item));
    if (dbStatus === 'online') await supabase.from('products').update(p).eq('id', p.id);
  };
  const handleAddProduct = async (p: Product) => {
    const n = { ...p, id: Math.random().toString(36).substr(2, 9) };
    setProducts(prev => [n, ...prev]);
    if (dbStatus === 'online') await supabase.from('products').insert(p);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pindorama-green text-white">
      <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest animate-pulse">VERIFICANDO CONEXÃO...</p>
    </div>
  );

  if (isAdmin) {
    return (
      <AdminPanel 
        {...{ products, categories, subcategories, partners, brands, videos, settings, dbStatus }}
        dbError={dbError}
        onDeleteProduct={handleDeleteProduct}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onAddCategory={async (c) => setCategories(prev => [...prev, {...c, id: Math.random().toString(36)}])}
        onDeleteCategory={async (id) => setCategories(prev => prev.filter(c => c.id !== id))}
        onAddSubcategory={async (s) => setSubcategories(prev => [...prev, {...s, id: Math.random().toString(36)}])}
        onDeleteSubcategory={async (id) => setSubcategories(prev => prev.filter(s => s.id !== id))}
        onAddPartner={async (p) => setPartners(prev => [...prev, {...p, id: Math.random().toString(36)}])}
        onDeletePartner={async (id) => setPartners(prev => prev.filter(p => p.id !== id))}
        onAddBrand={async (b) => setBrands(prev => [...prev, {...b, id: Math.random().toString(36)}])}
        onDeleteBrand={async (id) => setBrands(prev => prev.filter(b => b.id !== id))}
        onAddVideo={async (v) => setVideos(prev => [...prev, {...v, id: Math.random().toString(36)}])}
        onDeleteVideo={async (id) => setVideos(prev => prev.filter(v => v.id !== id))}
        onUpdateSettings={async (s) => {
          setSettings(s);
          if (dbStatus === 'online') await supabase.from('settings').upsert({ id: 1, ...s });
        }}
        onLogout={() => setIsAdmin(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar onAdminClick={() => setIsAdmin(true)} onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      <Hero images={banners} />
      <About />
      <Partners partners={partners} />
      <Products products={products} categories={categories} whatsapp={settings.whatsapp} />
      <Projects />
      <Testimonials />
      <Footer settings={settings} />
    </div>
  );
};

export default App;