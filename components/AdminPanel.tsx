
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, Settings, Plus, Trash2, Edit2, 
  ImageIcon, Save, Database, ShieldCheck, Tag, 
  Handshake, Briefcase, Camera, Upload, 
  Info, Phone, X, Layers, Clock, Share2, Target, Eye, Heart,
  Wifi, WifiOff, Globe, Mail, MapPin, Loader2
} from 'lucide-react';
import { Product, SiteSettings, Category, Subcategory, Partner, Project } from '../types';
import { supabase } from '../supabaseConfig';

interface AdminPanelProps {
  products: Product[];
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateProduct: (product: Product) => Promise<void>;
  onAddProduct: (product: Product) => Promise<void>;
  categories: Category[];
  onAddCategory: (category: { name: string }) => Promise<void>;
  onUpdateCategory: (category: Category) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  subcategories: Subcategory[];
  onAddSubcategory: (sub: { name: string, categoryId: string }) => Promise<void>;
  onUpdateSubcategory: (sub: Subcategory) => Promise<void>;
  onDeleteSubcategory: (id: string) => Promise<void>;
  partners: Partner[];
  onAddPartner: (p: { name: string, logo: string }) => Promise<void>;
  onDeletePartner: (id: string) => Promise<void>;
  projects: Project[];
  onAddProject: (p: Project) => Promise<void>;
  onUpdateProject: (p: Project) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  banners: string[];
  onAddBanner: (url: string) => Promise<void>;
  onDeleteBanner: (url: string) => Promise<void>;
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => Promise<void>;
  onLogout: () => void;
}

type Tab = 'dashboard' | 'products' | 'categories' | 'partners' | 'banners' | 'projects' | 'settings' | 'about';

const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [localSettings, setLocalSettings] = useState<SiteSettings>(props.settings);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    setLocalSettings(props.settings);
  }, [props.settings]);

  const [newCatName, setNewCatName] = useState('');
  const [newSub, setNewSub] = useState({ name: '', categoryId: '' });
  const [newPartner, setNewPartner] = useState({ name: '', logo: '' });

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const execDelete = async (fn: (id: string) => Promise<void>, id: string, label: string) => {
    if (!isOnline) {
      alert("Você está offline! Conecte-se para excluir dados.");
      return;
    }
    // Removido window.confirm pois está sendo bloqueado pelo sandbox no ambiente de visualização
    try {
      setIsSaving(true);
      await fn(id);
    } catch (err) {
      alert("Erro ao excluir. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const uploadToSupabase = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error: any) {
      console.error(error);
      alert("Erro no upload: " + error.message + ". Verifique se o bucket 'images' existe e tem políticas de acesso público.");
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
    { id: 'dashboard', label: 'Início', icon: <LayoutDashboard size={20} /> },
    { id: 'products', label: 'Estoque', icon: <Package size={20} /> },
    { id: 'categories', label: 'Categorias', icon: <Layers size={20} /> },
    { id: 'banners', label: 'Slide Topo', icon: <ImageIcon size={20} /> },
    { id: 'partners', label: 'Parceiros', icon: <Handshake size={20} /> },
    { id: 'projects', label: 'Obras', icon: <Briefcase size={20} /> },
    { id: 'about', label: 'Sobre a Empresa', icon: <Info size={20} /> },
    { id: 'settings', label: 'Contatos e Redes', icon: <Settings size={20} />, highlight: true },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pindorama-green p-4">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl w-full max-w-md text-center">
          <ShieldCheck className="text-pindorama-green w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-pindorama-green mb-2 uppercase">Acesso Restrito</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Digite a senha"
              className="w-full px-6 py-4 bg-stone-100 rounded-xl outline-none text-center font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loginError && <p className="text-red-500 text-xs font-bold uppercase">Senha Inválida</p>}
            <button type="submit" className="w-full bg-pindorama-green text-white py-4 rounded-xl font-black hover:bg-black transition-all">ENTRAR</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden font-sans">
      <aside className="w-72 bg-pindorama-green text-white flex flex-col shrink-0 shadow-2xl">
        <div className="p-8 text-center border-b border-white/10">
           <h2 className="text-xl font-black uppercase tracking-tighter">Pindorama ADM</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-bold text-sm ${activeTab === item.id ? (item.highlight ? 'bg-amber-600' : 'bg-white text-pindorama-green') : 'hover:bg-white/5 text-white/50'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-black/20 rounded-lg">
            {isOnline ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-green-500 flex items-center gap-1"><Wifi size={10}/> Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1"><WifiOff size={10}/> Desconectado</span>
              </div>
            )}
          </div>
          <button onClick={props.onLogout} className="w-full p-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase">
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-stone-50 relative">
        {isSaving && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4">
              <Loader2 className="animate-spin text-amber-600" />
              <span className="font-black uppercase text-xs">Salvando no Banco...</span>
            </div>
          </div>
        )}
        
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-stone-200 pb-8">
            <h1 className="text-4xl font-black text-pindorama-green uppercase tracking-tighter">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
            
            <div className="flex gap-4">
              {activeTab === 'products' && (
                <button onClick={() => setEditingProduct({ id: `new-${Date.now()}`, name: '', description: '', category: props.categories[0]?.name || '', subcategory: '', image: '' })} className="bg-amber-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 font-black uppercase text-xs hover:bg-black transition-all">
                  <Plus size={18} /> Novo Produto
                </button>
              )}
              {activeTab === 'projects' && (
                <button onClick={() => setEditingProject({ id: `new-${Date.now()}`, title: '', location: '', images: [] })} className="bg-amber-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 font-black uppercase text-xs hover:bg-black transition-all">
                  <Plus size={18} /> Nova Obra
                </button>
              )}
              {activeTab === 'banners' && (
                <label className="bg-amber-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 font-black uppercase text-xs cursor-pointer hover:bg-black transition-all">
                    <Upload size={18} /> {isUploading ? 'Enviando...' : 'Adicionar Banner'}
                    <input type="file" className="hidden" onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                          const url = await uploadToSupabase(file);
                          if (url) await props.onAddBanner(url);
                      }
                    }} />
                </label>
              )}
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
                  <Package size={24} className="text-amber-600 mb-4" />
                  <p className="text-4xl font-black text-pindorama-green mb-1">{props.products.length}</p>
                  <p className="text-stone-400 font-bold uppercase text-[10px]">No Estoque</p>
               </div>
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
                  <Briefcase size={24} className="text-blue-600 mb-4" />
                  <p className="text-4xl font-black text-pindorama-green mb-1">{props.projects.length}</p>
                  <p className="text-stone-400 font-bold uppercase text-[10px]">Obras Registradas</p>
               </div>
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
                  <Globe size={24} className={isOnline ? "text-green-600 mb-4" : "text-red-600 mb-4"} />
                  <p className="text-sm font-black text-pindorama-green uppercase">{isOnline ? 'Conectado' : 'Desconectado'}</p>
                  <p className="text-stone-400 font-bold uppercase text-[10px]">Status do Banco</p>
               </div>
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-center">
                  <button 
                    onClick={async () => {
                      try {
                        const testFile = new File(["test"], "test.txt", { type: "text/plain" });
                        const { error } = await supabase.storage.from('images').upload(`test-${Date.now()}.txt`, testFile);
                        if (error) throw error;
                        alert("GRAVAÇÃO OK! O bucket 'images' está funcionando.");
                      } catch (err: any) {
                        alert("ERRO DE GRAVAÇÃO: " + err.message);
                      }
                    }}
                    className="bg-amber-600 text-white py-3 rounded-xl font-black uppercase text-[10px] hover:bg-black transition-all"
                  >
                    FORÇAR TESTE DE GRAVAÇÃO
                  </button>
                  <p className="text-stone-400 font-bold uppercase text-[8px] mt-2 text-center">Tira-teima do Supabase</p>
               </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-stone-200">
              <table className="w-full text-left">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase">Foto</th>
                    <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase">Nome</th>
                    <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase">Categoria</th>
                    <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {props.products.map(p => (
                    <tr key={p.id}>
                      <td className="px-8 py-4">
                        <img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-stone-100" />
                      </td>
                      <td className="px-8 py-4 font-bold text-pindorama-green uppercase text-sm">{p.name}</td>
                      <td className="px-8 py-4">
                        <span className="text-[10px] font-black uppercase text-stone-600 bg-stone-100 px-3 py-1 rounded-full">{p.category}</span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex justify-end gap-2">
                           <button onClick={() => setEditingProduct(p)} className="p-2 text-stone-400 hover:text-pindorama-green"><Edit2 size={16} /></button>
                           <button onClick={() => execDelete(props.onDeleteProduct, p.id, 'produto')} className="p-2 text-stone-400 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="grid md:grid-cols-2 gap-12">
               {/* Categorias */}
               <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-pindorama-green uppercase flex items-center gap-2">
                    <Tag size={18} className="text-amber-600" /> Gerenciar Categorias
                  </h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Nome da Categoria" 
                      value={newCatName} 
                      onChange={e => setNewCatName(e.target.value)} 
                      className="flex-1 px-4 py-3 bg-stone-50 rounded-xl font-bold border border-stone-200 outline-none focus:border-amber-500"
                    />
                    <button 
                      onClick={() => { if(newCatName) props.onAddCategory({name: newCatName}).then(() => setNewCatName('')); }}
                      className="bg-pindorama-green text-white px-6 rounded-xl font-black uppercase text-[10px]"
                    >Adicionar</button>
                  </div>
                  <div className="divide-y border rounded-xl">
                    {props.categories.map(c => (
                      <div key={c.id} className="p-4 flex items-center justify-between">
                        <span className="font-bold uppercase text-xs">{c.name}</span>
                        <button onClick={() => execDelete(props.onDeleteCategory, c.id, 'categoria')} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Subcategorias */}
               <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-pindorama-green uppercase flex items-center gap-2">
                    <Layers size={18} className="text-amber-600" /> Gerenciar Subcategorias
                  </h3>
                  <div className="space-y-2">
                    <select 
                      value={newSub.categoryId} 
                      onChange={e => setNewSub({...newSub, categoryId: e.target.value})}
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold border"
                    >
                      <option value="">Selecione a Categoria Pai</option>
                      {props.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Nome da Subcategoria" 
                        value={newSub.name} 
                        onChange={e => setNewSub({...newSub, name: e.target.value})} 
                        className="flex-1 px-4 py-3 bg-stone-50 rounded-xl font-bold border border-stone-200 outline-none focus:border-amber-500"
                      />
                      <button 
                        onClick={() => { if(newSub.name && newSub.categoryId) props.onAddSubcategory(newSub).then(() => setNewSub({name: '', categoryId: ''})); }}
                        className="bg-pindorama-green text-white px-6 rounded-xl font-black uppercase text-[10px]"
                      >Adicionar</button>
                    </div>
                  </div>
                  <div className="divide-y border rounded-xl">
                    {props.subcategories.map(s => (
                      <div key={s.id} className="p-4 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-bold uppercase text-xs">{s.name}</span>
                          <span className="text-[9px] text-stone-400 font-black uppercase">{props.categories.find(c => c.id === s.categoryId)?.name}</span>
                        </div>
                        <button onClick={() => execDelete(props.onDeleteSubcategory, s.id, 'subcategoria')} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'banners' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {props.banners.map((url, i) => (
                   <div key={i} className="relative aspect-video bg-stone-100 rounded-[2rem] overflow-hidden border border-stone-200 group">
                      <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button onClick={() => execDelete(props.onDeleteBanner, url, 'banner')} className="bg-red-500 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform">
                            <Trash2 size={24} />
                         </button>
                      </div>
                   </div>
                ))}
                {props.banners.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-stone-200">
                    <ImageIcon className="mx-auto text-stone-300 mb-4" size={48} />
                    <p className="text-stone-400 font-bold uppercase text-xs">Nenhum banner cadastrado.</p>
                  </div>
                )}
             </div>
          )}

          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {props.projects.map(p => (
                  <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200 group relative">
                     <div className="h-48 bg-stone-100 relative">
                        <img src={p.images[0] || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" />
                        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-[10px] font-black">{p.images.length} Fotos</div>
                     </div>
                     <div className="p-6">
                        <h4 className="font-black text-pindorama-green uppercase text-sm mb-1">{p.title}</h4>
                        <p className="text-stone-400 text-xs font-bold uppercase">{p.location}</p>
                        <div className="flex justify-end gap-2 mt-4">
                           <button onClick={() => setEditingProject(p)} className="p-2 bg-stone-50 rounded-lg text-stone-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                           <button onClick={() => execDelete(props.onDeleteProject, p.id, 'obra')} className="p-2 bg-stone-50 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
          )}

          {activeTab === 'partners' && (
             <div className="space-y-8">
                <div className="bg-white p-8 rounded-3xl border border-stone-200">
                   <h3 className="text-xl font-black text-pindorama-green uppercase mb-6">Novo Parceiro</h3>
                   <div className="flex gap-4 items-end">
                      <div className="flex-1 space-y-2">
                         <span className="text-[10px] font-black uppercase text-stone-400">Nome da Marca</span>
                         <input type="text" value={newPartner.name} onChange={e => setNewPartner({...newPartner, name: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold" />
                      </div>
                      <div className="w-48 space-y-2">
                         <span className="text-[10px] font-black uppercase text-stone-400">Logo</span>
                         <label className="flex items-center justify-center h-[50px] bg-stone-100 rounded-xl cursor-pointer border-2 border-dashed border-stone-200 hover:border-amber-500 transition-colors">
                            {isUploading ? <span className="animate-pulse">...</span> : <Camera size={20} />}
                            <input type="file" className="hidden" onChange={async e => {
                               const file = e.target.files?.[0];
                               if (file) {
                                  const url = await uploadToSupabase(file);
                                  if (url) setNewPartner({...newPartner, logo: url});
                               }
                            }} />
                         </label>
                      </div>
                      <button onClick={() => { if(newPartner.name && newPartner.logo) props.onAddPartner(newPartner).then(() => setNewPartner({name: '', logo: ''})); }} className="h-[50px] bg-amber-600 text-white px-8 rounded-xl font-black uppercase text-xs">Adicionar</button>
                   </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                   {props.partners.map(p => (
                      <div key={p.id} className="bg-white p-8 rounded-3xl border border-stone-200 text-center relative group flex flex-col items-center">
                         <img src={p.logo} className="h-24 md:h-32 w-auto object-contain mb-4 grayscale group-hover:grayscale-0 transition-all" />
                         <p className="text-xs font-black text-stone-800 uppercase tracking-widest">{p.name}</p>
                         <button onClick={() => execDelete(props.onDeletePartner, p.id, 'parceiro')} className="absolute -top-2 -right-2 bg-red-500 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'about' && (
             <div className="space-y-8 pb-12">
                <div className="bg-white p-10 rounded-[3rem] border border-stone-200 shadow-sm space-y-8">
                   <div className="flex items-center gap-4 text-pindorama-green">
                      <Info size={32} className="text-amber-600" />
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">Institucional</h3>
                        <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Sobre a Madeireira Pindorama</p>
                      </div>
                   </div>

                   <div className="grid gap-6">
                      <label className="block space-y-2">
                         <span className="text-[10px] font-black uppercase text-stone-400">Título da Seção História</span>
                         <input type="text" value={localSettings.aboutTitle || ''} onChange={e => setLocalSettings({...localSettings, aboutTitle: e.target.value})} className="w-full px-6 py-4 bg-stone-50 rounded-2xl font-bold border focus:border-amber-500 outline-none" />
                      </label>
                      <label className="block space-y-2">
                         <span className="text-[10px] font-black uppercase text-stone-400">Texto Principal de História</span>
                         <textarea rows={8} value={localSettings.aboutText || ''} onChange={e => setLocalSettings({...localSettings, aboutText: e.target.value})} className="w-full px-6 py-4 bg-stone-50 rounded-2xl font-bold border focus:border-amber-500 outline-none" />
                      </label>
                   </div>

                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <h4 className="text-sm font-black text-pindorama-green uppercase flex items-center gap-2"><Target size={16} /> Missão</h4>
                         <textarea rows={4} value={localSettings.mission || ''} onChange={e => setLocalSettings({...localSettings, mission: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold border outline-none" />
                      </div>
                      <div className="space-y-4">
                         <h4 className="text-sm font-black text-pindorama-green uppercase flex items-center gap-2"><Eye size={16} /> Visão</h4>
                         <textarea rows={4} value={localSettings.vision || ''} onChange={e => setLocalSettings({...localSettings, vision: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold border outline-none" />
                      </div>
                   </div>

                   <div className="flex justify-end pt-6 border-t">
                      <button 
                        disabled={isSaving}
                        onClick={async () => { 
                          setIsSaving(true);
                          await props.onUpdateSettings(localSettings);
                          setIsSaving(false);
                        }} 
                        className="bg-amber-600 text-white px-12 py-5 rounded-2xl font-black uppercase shadow-xl hover:bg-black transition-all flex items-center gap-3 disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
                        Salvar Institucional
                      </button>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'settings' && (
             <div className="space-y-8 pb-12">
                <div className="grid md:grid-cols-2 gap-8">
                   {/* Contatos */}
                   <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm space-y-6">
                      <h3 className="text-lg font-black text-pindorama-green uppercase flex items-center gap-2"><Phone size={18} className="text-amber-600" /> Contatos</h3>
                      <label className="block space-y-1">
                         <span className="text-[9px] font-black uppercase text-stone-400">WhatsApp (somente números com DDD)</span>
                         <input type="text" value={localSettings.whatsapp} onChange={e => setLocalSettings({...localSettings, whatsapp: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold border" />
                      </label>
                      <label className="block space-y-1">
                         <span className="text-[9px] font-black uppercase text-stone-400">Telefone Fixo</span>
                         <input type="text" value={localSettings.phone} onChange={e => setLocalSettings({...localSettings, phone: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold border" />
                      </label>
                      <label className="block space-y-1">
                         <span className="text-[9px] font-black uppercase text-stone-400">E-mail de Contato</span>
                         <input type="email" value={localSettings.email} onChange={e => setLocalSettings({...localSettings, email: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold border" />
                      </label>
                      <label className="block space-y-1">
                         <span className="text-[9px] font-black uppercase text-stone-400">Endereço Completo</span>
                         <input type="text" value={localSettings.address} onChange={e => setLocalSettings({...localSettings, address: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold border" />
                      </label>
                   </div>

                   {/* Redes Sociais */}
                   <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm space-y-6">
                      <h3 className="text-lg font-black text-pindorama-green uppercase flex items-center gap-2"><Share2 size={18} className="text-amber-600" /> Redes Sociais</h3>
                      <label className="block space-y-1">
                         <span className="text-[9px] font-black uppercase text-stone-400">Link Instagram</span>
                         <input type="text" value={localSettings.instagram} onChange={e => setLocalSettings({...localSettings, instagram: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold border" />
                      </label>
                      <label className="block space-y-1">
                         <span className="text-[9px] font-black uppercase text-stone-400">Link Facebook</span>
                         <input type="text" value={localSettings.facebook} onChange={e => setLocalSettings({...localSettings, facebook: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold border" />
                      </label>
                      
                      <div className="pt-4 border-t space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-pindorama-green">Horários de Funcionamento</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <label className="block space-y-1">
                             <span className="text-[9px] font-black uppercase text-stone-400">Segunda a Sexta</span>
                             <input type="text" value={localSettings.hoursWeek} onChange={e => setLocalSettings({...localSettings, hoursWeek: e.target.value})} className="w-full px-3 py-2 bg-stone-50 rounded-lg font-bold border text-xs" />
                          </label>
                          <label className="block space-y-1">
                             <span className="text-[9px] font-black uppercase text-stone-400">Sábados</span>
                             <input type="text" value={localSettings.hoursSat} onChange={e => setLocalSettings({...localSettings, hoursSat: e.target.value})} className="w-full px-3 py-2 bg-stone-50 rounded-lg font-bold border text-xs" />
                          </label>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="flex justify-end">
                   <button 
                    disabled={isSaving}
                    onClick={async () => { 
                      setIsSaving(true);
                      await props.onUpdateSettings(localSettings);
                      setIsSaving(false);
                    }} 
                    className="bg-pindorama-green text-white px-16 py-5 rounded-2xl font-black uppercase shadow-2xl flex items-center gap-3 hover:bg-black transition-all disabled:opacity-50"
                   >
                     {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
                     Gravar Configurações
                   </button>
                </div>
             </div>
          )}
        </div>
      </main>

      {/* MODAL PRODUTO */}
      {editingProduct && (
        <div className="fixed inset-0 bg-stone-900/95 z-[200] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl p-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black text-pindorama-green uppercase">Produto</h3>
               <button onClick={() => setEditingProduct(null)} className="text-stone-300 hover:text-red-500"><X /></button>
            </div>
            <div className="space-y-6">
               <input type="text" placeholder="Nome" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full px-4 py-4 bg-stone-50 rounded-xl font-bold border" />
               <div className="grid grid-cols-2 gap-4">
                  <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value, subcategory: ''})} className="w-full px-4 py-4 bg-stone-50 rounded-xl font-bold border">
                     <option value="">Selecione Categoria</option>
                     {props.categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <select value={editingProduct.subcategory} onChange={e => setEditingProduct({...editingProduct, subcategory: e.target.value})} className="w-full px-4 py-4 bg-stone-50 rounded-xl font-bold border">
                     <option value="">Selecione Subcategoria</option>
                     {props.subcategories.filter(s => props.categories.find(c => c.id === s.categoryId)?.name === editingProduct.category).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
               </div>
               <input type="text" placeholder="Preço" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full px-4 py-4 bg-stone-50 rounded-xl font-bold border" />
               <div className="bg-stone-50 p-8 rounded-2xl border-2 border-dashed border-stone-200 text-center relative">
                  {editingProduct.image ? <img src={editingProduct.image} className="w-32 h-32 mx-auto object-cover rounded-xl" /> : <Camera size={32} className="mx-auto text-stone-300" />}
                  <label className="absolute inset-0 cursor-pointer">
                     <input type="file" className="hidden" onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                           const url = await uploadToSupabase(file);
                           if (url) setEditingProduct({...editingProduct, image: url});
                        }
                     }} />
                  </label>
               </div>
               <textarea placeholder="Descrição rápida" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} rows={3} className="w-full px-4 py-4 bg-stone-50 rounded-xl font-bold border" />
               <button 
                disabled={isSaving}
                onClick={async () => {
                  if (!isOnline) { alert("Offline!"); return; }
                  setIsSaving(true);
                  const action = editingProduct.id.startsWith('new-') ? props.onAddProduct(editingProduct) : props.onUpdateProduct(editingProduct);
                  await action;
                  setIsSaving(false);
                  setEditingProduct(null);
               }} className="w-full bg-pindorama-green text-white py-5 rounded-2xl font-black uppercase flex items-center justify-center gap-3 disabled:opacity-50">
                 {isSaving && <Loader2 className="animate-spin" size={20} />}
                 Gravar no Banco
               </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL OBRA */}
      {editingProject && (
         <div className="fixed inset-0 bg-stone-900/95 z-[200] flex items-center justify-center p-6 overflow-y-auto">
            <div className="bg-white rounded-[3rem] w-full max-w-4xl p-10 max-h-[90vh] overflow-y-auto">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-pindorama-green uppercase">Obra Portfólio</h3>
                  <button onClick={() => setEditingProject(null)} className="text-stone-300 hover:text-red-500"><X /></button>
               </div>
               <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                     <input type="text" placeholder="Título" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="px-4 py-4 bg-stone-50 rounded-xl font-bold border" />
                     <input type="text" placeholder="Local" value={editingProject.location} onChange={e => setEditingProject({...editingProject, location: e.target.value})} className="px-4 py-4 bg-stone-50 rounded-xl font-bold border" />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                     {editingProject.images.map((img, i) => (
                        <div key={i} className="relative aspect-square bg-stone-100 rounded-xl overflow-hidden border">
                           <img src={img} className="w-full h-full object-cover" />
                           <button onClick={() => setEditingProject({...editingProject, images: editingProject.images.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><X size={10} /></button>
                        </div>
                     ))}
                     {editingProject.images.length < 10 && (
                        <label className="aspect-square bg-stone-50 rounded-xl border-2 border-dashed border-stone-200 flex items-center justify-center cursor-pointer">
                           {isUploading ? <Loader2 className="animate-spin text-stone-300" /> : <Plus className="text-stone-300" />}
                           <input type="file" className="hidden" onChange={async e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                 const url = await uploadToSupabase(file);
                                 if (url) setEditingProject({...editingProject, images: [...editingProject.images, url]});
                              }
                           }} />
                        </label>
                     )}
                  </div>
                  <button 
                    disabled={isSaving}
                    onClick={async () => {
                     if (!isOnline) { alert("Offline!"); return; }
                     setIsSaving(true);
                     const action = editingProject.id.startsWith('new-') ? props.onAddProject(editingProject) : props.onUpdateProject(editingProject);
                     await action;
                     setIsSaving(false);
                     setEditingProject(null);
                  }} className="w-full bg-pindorama-green text-white py-5 rounded-2xl font-black uppercase mt-8 flex items-center justify-center gap-3 disabled:opacity-50">
                    {isSaving && <Loader2 className="animate-spin" size={20} />}
                    Salvar no Portfólio
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default AdminPanel;
