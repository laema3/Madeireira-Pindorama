
import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, Settings, LogOut, Plus, Trash2, Edit2, 
  ImageIcon, Save, Database, RefreshCw, ShieldCheck, Tag, 
  Handshake, Briefcase, Camera, Upload, Image as ImageIconLucide,
  Loader2, Globe, AlertTriangle, Layers, ChevronRight, Facebook, Instagram, 
  Phone, MessageCircle, MapPin, Clock, Info, CheckCircle, AlertCircle
} from 'lucide-react';
import { Product, SiteSettings, Category, Subcategory, Partner, Brand, YouTubeVideo, Project } from '../types';
import { supabase, isConfigured } from '../supabaseConfig';

interface AdminPanelProps {
  products: Product[];
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateProduct: (product: Product) => Promise<void>;
  onAddProduct: (product: Product) => Promise<void>;
  categories: Category[];
  onAddCategory: (category: { name: string }) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  partners: Partner[];
  onAddPartner: (p: { name: string, logo: string }) => Promise<void>;
  onDeletePartner: (id: string) => Promise<void>;
  projects: Project[];
  onAddProject: (p: { title: string, location: string, image: string }) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  banners: string[];
  onAddBanner: (url: string) => Promise<void>;
  onDeleteBanner: (url: string) => Promise<void>;
  videos: YouTubeVideo[];
  onAddVideo: (v: { title: string, youtubeId: string }) => Promise<void>;
  onDeleteVideo: (id: string) => Promise<void>;
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => Promise<void>;
  dbStatus: 'online' | 'offline' | 'error';
  dbError?: string | null;
  onLogout: () => void;
  subcategories: Subcategory[];
  onAddSubcategory: (sub: { name: string, categoryId: string }) => Promise<void>;
  onDeleteSubcategory: (id: string) => Promise<void>;
  brands: Brand[];
  onAddBrand: (b: { name: string, logo: string }) => Promise<void>;
  onDeleteBrand: (id: string) => Promise<void>;
}

type Tab = 'dashboard' | 'products' | 'categories' | 'projects' | 'banners' | 'partners' | 'settings';

const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [localSettings, setLocalSettings] = useState<SiteSettings>(props.settings);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [newCatName, setNewCatName] = useState('');
  const [newSub, setNewSub] = useState({ name: '', categoryId: '' });
  const [newBannerUrl, setNewBannerUrl] = useState('');

  const uploadToSupabase = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        alert(`Erro ao subir imagem: ${uploadError.message}`);
        return null;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'pindorama1979') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Resumo do Sistema', icon: <LayoutDashboard size={20} /> },
    { id: 'products', label: 'Estoque de Madeiras', icon: <Package size={20} /> },
    { id: 'categories', label: 'Gestão de Categorias', icon: <Tag size={20} /> },
    { id: 'banners', label: 'Slide do Topo (Banners)', icon: <ImageIcon size={20} /> },
    { id: 'projects', label: 'Portfólio de Obras', icon: <Briefcase size={20} /> },
    { id: 'settings', label: 'Identidade do Site', icon: <Settings size={20} />, highlight: true },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pindorama-green p-4">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl w-full max-w-md text-center border-8 border-stone-50">
          <div className="bg-amber-100 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <ShieldCheck className="text-pindorama-green w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-pindorama-green mb-2 uppercase italic tracking-tighter">Pindorama ADM</h2>
          <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest mb-8 italic">Painel Restrito Uberaba</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Senha de Acesso"
              className="w-full px-8 py-6 bg-stone-100 rounded-2xl outline-none text-center text-xl font-bold border-2 border-transparent focus:border-amber-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {loginError && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">Acesso Negado</p>}
            <button type="submit" className="w-full bg-pindorama-green text-white py-6 rounded-2xl font-black shadow-xl hover:bg-black transition-all">LIBERAR PAINEL</button>
          </form>
          <button onClick={props.onLogout} className="mt-8 text-stone-400 font-bold underline text-xs uppercase tracking-widest">Voltar ao site público</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden font-sans">
      <aside className="w-80 bg-pindorama-green text-white flex flex-col shrink-0 shadow-2xl border-r border-white/5">
        <div className="p-10 text-center">
           <div className="bg-white/10 w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center border border-white/10 overflow-hidden">
              {localSettings.logo ? <img src={localSettings.logo} className="w-full h-full object-contain p-2" /> : <Package className="text-amber-500" size={28} />}
           </div>
           <h2 className="text-xl font-black uppercase italic tracking-tighter leading-none">Pindorama</h2>
           <p className="text-amber-500/50 text-[8px] font-black uppercase tracking-[0.3em] mt-2">Uberaba - MG</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === item.id ? (item.highlight ? 'bg-amber-600' : 'bg-white text-pindorama-green shadow-xl') : 'hover:bg-white/5 text-white/50'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
          <div className={`p-4 rounded-2xl mb-6 flex items-center gap-3 ${isConfigured ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>
             <Database size={16} className={isConfigured ? 'text-green-500' : 'text-amber-500'} />
             <div>
                <p className="text-[9px] font-black uppercase text-white leading-none mb-1">{isConfigured ? 'Sincronizado' : 'Modo Local'}</p>
                <p className="text-[8px] text-white/40 font-bold uppercase">Base de Dados</p>
             </div>
          </div>
          <button onClick={props.onLogout} className="w-full p-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em]">
            Deslogar
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex justify-between items-end mb-16 border-b border-stone-200 pb-8">
            <div>
              <p className="text-amber-600 font-black uppercase text-[10px] tracking-[0.4em] mb-3 italic">Gestão de Madeiras</p>
              <h1 className="text-5xl font-black text-pindorama-green uppercase italic tracking-tighter">
                {menuItems.find(m => m.id === activeTab)?.label}
              </h1>
            </div>
            {activeTab === 'products' && (
              <button 
                onClick={() => setEditingProduct({ id: `new-${Date.now()}`, name: '', description: '', category: props.categories[0]?.name || '', subcategory: '', image: '', price: '' })} 
                className="bg-amber-600 text-white px-10 py-5 rounded-2xl flex items-center gap-4 shadow-xl font-black uppercase text-xs hover:bg-pindorama-green transition-all transform hover:-translate-y-1"
              >
                <Plus size={20} /> Nova Madeira
              </button>
            )}
          </div>

          {/* Aba Ajustes do Site (Identidade) */}
          {activeTab === 'settings' && (
            <div className="space-y-8 pb-20">
               <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-stone-200">
                  <h3 className="text-xl font-black text-pindorama-green mb-8 flex items-center gap-3 uppercase italic"><ImageIconLucide /> Logomarca e Identidade</h3>
                  <div className="flex flex-col md:flex-row items-center gap-12">
                     <div className="w-48 h-48 bg-stone-50 rounded-[2.5rem] border-2 border-dashed border-stone-200 flex items-center justify-center p-4 relative group">
                        {localSettings.logo ? (
                          <img src={localSettings.logo} className="w-full h-full object-contain" alt="Logo" />
                        ) : (
                          <ImageIcon size={40} className="text-stone-200" />
                        )}
                        <label className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                           <Upload className="text-white" size={24} />
                           <input type="file" className="hidden" accept="image/*" onChange={async e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await uploadToSupabase(file);
                                if (url) setLocalSettings({...localSettings, logo: url});
                              }
                           }} />
                        </label>
                     </div>
                     <div className="flex-1 space-y-4">
                        <p className="text-stone-400 text-sm italic font-medium">Recomendamos imagem em PNG com fundo transparente para melhor acabamento no site.</p>
                        <button onClick={() => props.onUpdateSettings(localSettings)} className="bg-pindorama-green text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black">GRAVAR NOVA LOGO</button>
                     </div>
                  </div>
               </div>

               <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-stone-200">
                  <h3 className="text-xl font-black text-pindorama-green mb-8 flex items-center gap-3 uppercase italic"><Phone /> Contatos e Localização</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                     <label className="block space-y-2">
                        <span className="text-[10px] font-black uppercase text-stone-400 ml-2">WhatsApp Oficial</span>
                        <input type="text" value={localSettings.whatsapp} onChange={e => setLocalSettings({...localSettings, whatsapp: e.target.value})} className="w-full px-8 py-5 bg-stone-50 rounded-2xl font-bold" />
                     </label>
                     <label className="block space-y-2">
                        <span className="text-[10px] font-black uppercase text-stone-400 ml-2">Telefone Fixo</span>
                        <input type="text" value={localSettings.phone} onChange={e => setLocalSettings({...localSettings, phone: e.target.value})} className="w-full px-8 py-5 bg-stone-50 rounded-2xl font-bold" />
                     </label>
                     <label className="block md:col-span-2 space-y-2">
                        <span className="text-[10px] font-black uppercase text-stone-400 ml-2">Endereço em Uberaba</span>
                        <input type="text" value={localSettings.address} onChange={e => setLocalSettings({...localSettings, address: e.target.value})} className="w-full px-8 py-5 bg-stone-50 rounded-2xl font-bold" />
                     </label>
                  </div>
               </div>

               <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-stone-200">
                  <h3 className="text-xl font-black text-pindorama-green mb-8 flex items-center gap-3 uppercase italic"><Instagram /> Redes Sociais</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                     <label className="block space-y-2">
                        <span className="text-[10px] font-black uppercase text-stone-400 ml-2">Link Instagram</span>
                        <input type="text" value={localSettings.instagram} onChange={e => setLocalSettings({...localSettings, instagram: e.target.value})} className="w-full px-8 py-5 bg-stone-50 rounded-2xl font-bold" placeholder="https://..." />
                     </label>
                     <label className="block space-y-2">
                        <span className="text-[10px] font-black uppercase text-stone-400 ml-2">Link Facebook</span>
                        <input type="text" value={localSettings.facebook} onChange={e => setLocalSettings({...localSettings, facebook: e.target.value})} className="w-full px-8 py-5 bg-stone-50 rounded-2xl font-bold" placeholder="https://..." />
                     </label>
                  </div>
               </div>

               <div className="flex justify-end">
                  <button onClick={() => props.onUpdateSettings(localSettings)} className="bg-amber-600 text-white px-16 py-8 rounded-[2.5rem] font-black text-xl shadow-2xl flex items-center gap-4 hover:scale-105 transition-all">
                     <Save size={24} /> SALVAR IDENTIDADE DO SITE
                  </button>
               </div>
            </div>
          )}

          {/* Aba Banners (Slide) */}
          {activeTab === 'banners' && (
            <div className="space-y-10">
               <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-stone-200">
                  <h3 className="text-lg font-black text-pindorama-green mb-6 flex items-center gap-2 uppercase italic"><Plus size={18}/> Novo Banner no Slide</h3>
                  <div className="flex gap-4">
                    <input type="text" placeholder="Cole a URL da imagem aqui ou use o upload abaixo..." className="flex-1 px-8 py-5 bg-stone-50 rounded-2xl font-bold" value={newBannerUrl} onChange={e => setNewBannerUrl(e.target.value)} />
                    <button onClick={() => { props.onAddBanner(newBannerUrl); setNewBannerUrl(''); }} className="bg-pindorama-green text-white px-10 rounded-2xl font-black">ADICIONAR</button>
                  </div>
                  <div className="mt-6">
                     <label className="w-full">
                        <div className="w-full py-5 bg-stone-100 rounded-2xl border-2 border-dashed border-stone-200 flex items-center justify-center gap-4 cursor-pointer font-black text-[10px] uppercase text-stone-400 tracking-widest hover:bg-stone-200 transition-colors">
                           <Upload size={16} /> Carregar Imagem do Computador
                        </div>
                        <input type="file" className="hidden" onChange={async e => {
                           const file = e.target.files?.[0];
                           if (file) {
                              const url = await uploadToSupabase(file);
                              if (url) props.onAddBanner(url);
                           }
                        }} />
                     </label>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {props.banners.map((url, i) => (
                    <div key={i} className="group relative h-48 rounded-[2rem] overflow-hidden shadow-lg border border-stone-200 bg-white">
                       <img src={url} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => props.onDeleteBanner(url)} className="bg-red-500 text-white p-4 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:scale-110 transition-transform">
                             <Trash2 size={20} /> REMOVER SLIDE
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Lista de Produtos */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-stone-100">
              <table className="w-full text-left">
                <thead className="bg-stone-50/50">
                  <tr>
                    <th className="px-10 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Miniatura</th>
                    <th className="px-10 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Madeira</th>
                    <th className="px-10 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Categoria</th>
                    <th className="px-10 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {props.products.map(p => (
                    <tr key={p.id} className="group hover:bg-stone-50/50 transition-colors">
                      <td className="px-10 py-6">
                        <div className="w-20 h-20 rounded-2xl bg-stone-100 shadow-inner overflow-hidden border-2 border-white ring-1 ring-stone-200">
                           {p.image ? (
                             <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-stone-300 italic text-[10px]">S/ Foto</div>
                           )}
                        </div>
                      </td>
                      <td className="px-10 py-6">
                         <p className="font-black text-pindorama-green uppercase text-sm">{p.name}</p>
                         <p className="text-amber-600 text-[10px] font-bold uppercase mt-1 italic">{p.price || 'Sob Consulta'}</p>
                      </td>
                      <td className="px-10 py-6">
                         <span className="text-[9px] font-black uppercase text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full">{p.category || 'Geral'}</span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex justify-end gap-2">
                           <button onClick={() => setEditingProduct(p)} className="p-4 rounded-xl text-stone-400 hover:text-pindorama-green hover:bg-stone-100 transition-all"><Edit2 size={16} /></button>
                           <button onClick={() => props.onDeleteProduct(p.id)} className="p-4 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-stone-200">
                  <Package size={32} className="text-amber-600 mb-6" />
                  <p className="text-7xl font-black text-pindorama-green leading-none mb-2">{props.products.length}</p>
                  <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest italic">Itens no Catálogo</p>
               </div>
               <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-stone-200">
                  <Tag size={32} className="text-pindorama-green mb-6" />
                  <p className="text-7xl font-black text-pindorama-green leading-none mb-2">{props.categories.length}</p>
                  <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest italic">Categorias Mestras</p>
               </div>
               <div className="bg-pindorama-green p-12 rounded-[3rem] shadow-xl text-white">
                  <ShieldCheck size={32} className="text-amber-500 mb-6" />
                  <p className="text-xl font-black uppercase italic leading-tight">Gestão Segura</p>
                  <p className="text-[10px] text-white/50 font-bold uppercase mt-4 tracking-widest">Sincronizado com Uberaba via Supabase.</p>
               </div>
            </div>
          )}
        </div>
      </main>

      {editingProduct && (
        <div className="fixed inset-0 bg-stone-900/95 backdrop-blur-xl z-[150] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[4rem] w-full max-w-2xl shadow-2xl p-12 my-10 border-4 border-pindorama-green/10">
            <h3 className="text-3xl font-black text-pindorama-green uppercase italic mb-8 tracking-tighter">Ficha da Madeira</h3>
            
            <div className="space-y-6">
              <label className="block">
                <span className="text-[10px] font-black uppercase text-stone-400 ml-2 mb-2 block">Nome <span className="text-red-500">*</span></span>
                <input 
                  type="text" 
                  placeholder="Ex: Viga de Peroba 15x15" 
                  value={editingProduct.name} 
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} 
                  className={`w-full px-8 py-5 bg-stone-50 rounded-3xl font-bold outline-none border-2 transition-all ${!editingProduct.name ? 'border-red-100' : 'border-transparent focus:border-pindorama-green'}`} 
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                 <label className="block">
                    <span className="text-[10px] font-black uppercase text-stone-400 ml-2 mb-2 block">Categoria <span className="text-red-500">*</span></span>
                    <select 
                      value={editingProduct.category} 
                      onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} 
                      className={`w-full px-8 py-5 bg-stone-50 rounded-3xl font-bold outline-none border-2 ${!editingProduct.category ? 'border-red-100' : 'border-transparent'}`}
                    >
                      <option value="">Escolha...</option>
                      {props.categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                 </label>
                 <label className="block">
                    <span className="text-[10px] font-black uppercase text-stone-400 ml-2 mb-2 block">Preço (Opcional)</span>
                    <input type="text" placeholder="R$ 00,00" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full px-8 py-5 bg-stone-50 rounded-3xl font-bold outline-none" />
                 </label>
              </div>

              <div className="bg-stone-50 p-8 rounded-[3rem] border-2 border-dashed border-stone-200 text-center">
                <span className="text-[10px] font-black uppercase text-stone-400 mb-6 block italic">Foto da Madeira <span className="text-red-500">*</span></span>
                
                <div className="flex flex-col items-center gap-6">
                    {editingProduct.image ? (
                      <div className="w-40 h-40 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                        <img src={editingProduct.image} className="w-full h-full object-cover" alt="Preview" />
                      </div>
                    ) : (
                      <div className="w-40 h-40 rounded-[2rem] bg-white border border-stone-100 flex items-center justify-center text-stone-200">
                         <Camera size={40} />
                      </div>
                    )}

                  <label className="w-full">
                     <div className="w-full px-8 py-5 bg-pindorama-green text-white rounded-2xl flex items-center justify-center gap-4 cursor-pointer hover:bg-black transition-all font-black uppercase text-[10px]">
                        {isUploading ? <Loader2 className="animate-spin" /> : <><Upload size={18} /> Carregar Nova Foto</>}
                     </div>
                     <input type="file" className="hidden" accept="image/*" onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadToSupabase(file);
                          if (url) setEditingProduct({...editingProduct, image: url});
                        }
                     }} />
                  </label>
                </div>
              </div>

              <label className="block">
                <span className="text-[10px] font-black uppercase text-stone-400 ml-2 mb-2 block">Descrição Breve</span>
                <textarea rows={2} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full px-8 py-6 bg-stone-50 rounded-3xl font-bold outline-none" placeholder="Ex: Acabamento fino, madeira certificada..." />
              </label>
              
              <div className="flex flex-col gap-4 pt-4">
                <button 
                  disabled={isUploading || isSaving || !editingProduct.image || !editingProduct.name || !editingProduct.category}
                  onClick={() => { 
                    setIsSaving(true);
                    const action = editingProduct.id.startsWith('new-') ? props.onAddProduct(editingProduct) : props.onUpdateProduct(editingProduct);
                    action.then(() => {
                      setIsSaving(false);
                      setEditingProduct(null);
                    }).catch(() => setIsSaving(false));
                  }} 
                  className="w-full bg-amber-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl disabled:opacity-30 hover:bg-pindorama-green transition-all flex items-center justify-center gap-4"
                >
                  {isSaving ? <RefreshCw className="animate-spin" /> : <Save size={24} />} 
                  CONFIRMAR E SALVAR NO BANCO
                </button>
                <button onClick={() => setEditingProduct(null)} className="w-full text-stone-400 font-bold uppercase text-[9px] py-4 tracking-widest hover:text-red-500 transition-all">Descartar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
