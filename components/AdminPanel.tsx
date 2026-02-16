import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, Package, Settings, LogOut, Plus, Trash2, Edit2, 
  ImageIcon, Save, X, Database, RefreshCw, Key, ShieldCheck, Tag, 
  Youtube, Handshake, Briefcase, Camera, Upload, Image as ImageIconLucide,
  CheckCircle, XCircle, Terminal, Loader2, Globe, AlertTriangle, Link2, Beaker,
  Layers, ChevronRight, Facebook, Instagram, Phone, MessageCircle, MapPin, Clock
} from 'lucide-react';
import { Product, SiteSettings, Category, Subcategory, Partner, Brand, YouTubeVideo, Project } from '../types';
import { supabase } from '../supabaseConfig';

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
  const [newPartner, setNewPartner] = useState({ name: '', logo: '' });
  const [newProject, setNewProject] = useState({ title: '', location: '', image: '' });

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
        alert(`FALHA AO SALVAR FOTO: ${uploadError.message}`);
        throw uploadError;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
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
    { id: 'dashboard', label: 'Painel', icon: <LayoutDashboard size={20} /> },
    { id: 'products', label: 'Produtos', icon: <Package size={20} /> },
    { id: 'categories', label: 'Categorias & Sub', icon: <Tag size={20} /> },
    { id: 'banners', label: 'Banners Topo', icon: <ImageIcon size={20} /> },
    { id: 'projects', label: 'Portfólio/Obras', icon: <Briefcase size={20} /> },
    { id: 'partners', label: 'Parceiros', icon: <Handshake size={20} /> },
    { id: 'settings', label: 'Ajustes Site', icon: <Settings size={20} />, highlight: true },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pindorama-green p-4">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl w-full max-w-md text-center border-8 border-stone-50">
          <div className="bg-amber-100 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <ShieldCheck className="text-pindorama-green w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-pindorama-green mb-2 tracking-tight uppercase">Acesso Administrativo</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Senha de Acesso"
              className="w-full px-8 py-6 bg-stone-100 rounded-2xl outline-none text-center text-xl font-bold border-2 border-transparent focus:border-amber-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {loginError && <p className="text-red-500 text-xs font-bold uppercase tracking-widest">Senha Incorreta</p>}
            <button type="submit" className="w-full bg-pindorama-green text-white py-6 rounded-2xl font-black shadow-xl hover:bg-black transition-all">LIBERAR SISTEMA</button>
          </form>
          <button onClick={props.onLogout} className="mt-8 text-stone-400 font-bold underline text-sm uppercase">Sair do Painel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden">
      <aside className="w-80 bg-pindorama-green text-white flex flex-col shrink-0 shadow-2xl">
        <div className="p-10 border-b border-white/5">
           <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Pindorama ADM</h2>
           <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${props.dbStatus === 'online' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              <Database size={12} />
              {props.dbStatus === 'online' ? 'CONECTADO' : 'ERRO DB'}
           </div>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === item.id ? (item.highlight ? 'bg-amber-600' : 'bg-white/10 shadow-lg') : 'hover:bg-white/5 opacity-60'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6">
          <button onClick={props.onLogout} className="w-full p-4 rounded-xl bg-white/5 text-stone-400 hover:text-white transition-colors font-bold text-sm">SAIR DO SISTEMA</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-5xl font-black text-pindorama-green uppercase italic tracking-tighter">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
            <div className="flex gap-3">
              {isUploading && <div className="flex items-center gap-3 bg-pindorama-green text-white px-6 py-3 rounded-full font-black animate-pulse text-[10px]"><Loader2 className="animate-spin" size={16} /> CARREGANDO...</div>}
            </div>
          </div>

          {activeTab === 'settings' && (
            <div className="space-y-12 pb-24">
              {/* Logo Section */}
              <div className="bg-white p-12 rounded-[4rem] border border-stone-200 shadow-sm">
                <h3 className="text-xl font-black text-pindorama-green mb-8 flex items-center gap-3 uppercase"><ImageIconLucide /> Logotipo da Empresa</h3>
                <div className="flex flex-col md:flex-row items-center gap-12">
                  <div className="w-48 h-48 bg-stone-100 rounded-[2.5rem] flex items-center justify-center border-4 border-dashed border-stone-200 overflow-hidden p-4">
                    {localSettings.logo ? (
                      <img src={localSettings.logo} className="w-full h-full object-contain" alt="Logo Preview" />
                    ) : (
                      <div className="text-center text-stone-400">
                        <ImageIcon size={32} className="mx-auto mb-2 opacity-20" />
                        <span className="text-[10px] font-bold uppercase">Sem Logo</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="text-stone-500 text-sm font-medium leading-relaxed">Este logotipo será exibido no topo (navbar) e no rodapé do site. Recomendamos fundo transparente (PNG).</p>
                    <label className="inline-flex items-center gap-3 bg-pindorama-green text-white px-8 py-4 rounded-2xl font-black text-xs cursor-pointer hover:bg-black transition-all">
                      <Upload size={16} /> {isUploading ? 'CARREGANDO...' : 'ENVIAR NOVA LOGO'}
                      <input type="file" className="hidden" accept="image/*" onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadToSupabase(file);
                          if (url) setLocalSettings({...localSettings, logo: url});
                        }
                      }} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Contatos Section */}
              <div className="bg-white p-12 rounded-[4rem] border border-stone-200 shadow-sm">
                <h3 className="text-xl font-black text-pindorama-green mb-10 flex items-center gap-3 uppercase"><Phone /> Contatos e Localização</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <label className="block space-y-2">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">WhatsApp (Apenas números)</span>
                    <div className="relative">
                      <MessageCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                      <input type="text" value={localSettings.whatsapp} onChange={e => setLocalSettings({...localSettings, whatsapp: e.target.value})} className="w-full pl-16 pr-8 py-5 bg-stone-50 rounded-2xl font-bold border-2 border-transparent focus:border-amber-500 outline-none" placeholder="Ex: 5534999999999" />
                    </div>
                  </label>
                  <label className="block space-y-2">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Telefone Fixo</span>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                      <input type="text" value={localSettings.phone} onChange={e => setLocalSettings({...localSettings, phone: e.target.value})} className="w-full pl-16 pr-8 py-5 bg-stone-50 rounded-2xl font-bold border-2 border-transparent focus:border-amber-500 outline-none" placeholder="Ex: (34) 3333-3333" />
                    </div>
                  </label>
                  <label className="block md:col-span-2 space-y-2">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Endereço Completo</span>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                      <input type="text" value={localSettings.address} onChange={e => setLocalSettings({...localSettings, address: e.target.value})} className="w-full pl-16 pr-8 py-5 bg-stone-50 rounded-2xl font-bold border-2 border-transparent focus:border-amber-500 outline-none" />
                    </div>
                  </label>
                </div>
              </div>

              {/* Redes Sociais */}
              <div className="bg-white p-12 rounded-[4rem] border border-stone-200 shadow-sm">
                <h3 className="text-xl font-black text-pindorama-green mb-10 flex items-center gap-3 uppercase"><Globe /> Redes Sociais</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <label className="block space-y-2">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Link do Instagram</span>
                    <div className="relative">
                      <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                      <input type="text" value={localSettings.instagram} onChange={e => setLocalSettings({...localSettings, instagram: e.target.value})} className="w-full pl-16 pr-8 py-5 bg-stone-50 rounded-2xl font-bold border-2 border-transparent focus:border-amber-500 outline-none" placeholder="https://instagram.com/pindorama" />
                    </div>
                  </label>
                  <label className="block space-y-2">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Link do Facebook</span>
                    <div className="relative">
                      <Facebook className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                      <input type="text" value={localSettings.facebook} onChange={e => setLocalSettings({...localSettings, facebook: e.target.value})} className="w-full pl-16 pr-8 py-5 bg-stone-50 rounded-2xl font-bold border-2 border-transparent focus:border-amber-500 outline-none" placeholder="https://facebook.com/pindorama" />
                    </div>
                  </label>
                </div>
              </div>

              {/* Horário de Atendimento */}
              <div className="bg-white p-12 rounded-[4rem] border border-stone-200 shadow-sm">
                <h3 className="text-xl font-black text-pindorama-green mb-10 flex items-center gap-3 uppercase"><Clock /> Horário de Atendimento</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <label className="block space-y-2">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Segunda a Sexta</span>
                    <input type="text" value={localSettings.hoursWeek} onChange={e => setLocalSettings({...localSettings, hoursWeek: e.target.value})} className="w-full px-8 py-5 bg-stone-50 rounded-2xl font-bold border-2 border-transparent focus:border-amber-500 outline-none" placeholder="Ex: 08:00 - 18:00" />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Sábados</span>
                    <input type="text" value={localSettings.hoursSat} onChange={e => setLocalSettings({...localSettings, hoursSat: e.target.value})} className="w-full px-8 py-5 bg-stone-50 rounded-2xl font-bold border-2 border-transparent focus:border-amber-500 outline-none" placeholder="Ex: 08:00 - 12:00" />
                  </label>
                </div>
              </div>

              <div className="sticky bottom-8 z-20 flex justify-end">
                  <button disabled={isSaving || isUploading} onClick={() => { setIsSaving(true); props.onUpdateSettings(localSettings).then(() => setIsSaving(false)); }} className="bg-amber-600 text-white px-16 py-8 rounded-[2rem] font-black shadow-[0_20px_50px_rgba(217,119,6,0.4)] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all text-xl">
                    {isSaving ? <RefreshCw className="animate-spin" /> : <Save size={24} />} SALVAR TUDO E ATUALIZAR SITE
                  </button>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-stone-200">
                  <Package size={32} className="text-amber-600 mb-6" />
                  <p className="text-7xl font-black text-pindorama-green">{props.products.length}</p>
                  <p className="text-stone-400 font-bold uppercase text-xs tracking-[0.2em]">Produtos Online</p>
               </div>
               <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-stone-200">
                  <Briefcase size={32} className="text-pindorama-green mb-6" />
                  <p className="text-7xl font-black text-pindorama-green">{props.projects.length}</p>
                  <p className="text-stone-400 font-bold uppercase text-xs tracking-[0.2em]">Obras Postadas</p>
               </div>
               <div className="bg-pindorama-green p-12 rounded-[3.5rem] shadow-xl text-white">
                  <AlertTriangle size={32} className="text-amber-400 mb-6" />
                  <p className="text-lg font-black uppercase tracking-tighter mb-4 italic leading-tight">Gestão de Estoque</p>
                  <p className="text-[10px] text-stone-400 leading-relaxed font-bold uppercase">As categorias só aparecem no site para os clientes se houver pelo menos 1 produto cadastrado nelas. Isso evita menus vazios.</p>
               </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-stone-200">
                  <h3 className="text-lg font-black text-pindorama-green mb-6 flex items-center gap-2 uppercase"><Tag size={18}/> 1. Nova Categoria Mãe</h3>
                  <div className="flex gap-4">
                    <input type="text" placeholder="Ex: Telhados, Decks..." className="flex-1 px-8 py-5 bg-stone-50 rounded-2xl font-bold" value={newCatName} onChange={e => setNewCatName(e.target.value)} />
                    <button onClick={() => { props.onAddCategory({name: newCatName}); setNewCatName(''); }} className="bg-pindorama-green text-white px-10 rounded-2xl font-black">ADICIONAR</button>
                  </div>
                </div>
                <div className="space-y-3">
                  {props.categories.map(c => (
                    <div key={c.id} className="bg-white p-6 rounded-3xl border border-stone-200 flex justify-between items-center group shadow-sm">
                      <div className="flex flex-col">
                        <span className="font-black text-pindorama-green uppercase text-sm">{c.name}</span>
                        <span className="text-[10px] text-stone-400 font-bold uppercase">{props.subcategories.filter(s => s.categoryId === c.id).length} subcategorias vinculadas</span>
                      </div>
                      <button onClick={() => props.onDeleteCategory(c.id)} className="text-stone-300 hover:text-red-500 transition-colors p-2"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-amber-50 p-10 rounded-[3rem] border border-amber-200 shadow-sm">
                  <h3 className="text-lg font-black text-pindorama-green mb-6 flex items-center gap-2 uppercase"><Layers size={18}/> 2. Nova Subcategoria</h3>
                  <div className="space-y-4">
                    <select 
                      className="w-full px-8 py-5 bg-white rounded-2xl font-bold border border-amber-200 outline-none"
                      value={newSub.categoryId}
                      onChange={e => setNewSub({...newSub, categoryId: e.target.value})}
                    >
                      <option value="">Selecione a Categoria Mãe</option>
                      {props.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <div className="flex gap-4">
                      <input type="text" placeholder="Ex: Angelim Vermelho..." className="flex-1 px-8 py-5 bg-white rounded-2xl font-bold border border-amber-200" value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})} />
                      <button 
                        disabled={!newSub.categoryId || !newSub.name}
                        onClick={() => { props.onAddSubcategory(newSub); setNewSub({name: '', categoryId: ''}); }} 
                        className="bg-amber-600 text-white px-10 rounded-2xl font-black disabled:opacity-50"
                      >
                        VINCULAR
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {props.subcategories.map(s => {
                    const parent = props.categories.find(c => c.id === s.categoryId);
                    return (
                      <div key={s.id} className="bg-white p-6 rounded-3xl border border-stone-200 flex justify-between items-center group shadow-sm">
                        <div className="flex items-center gap-3">
                           <div className="bg-amber-100 p-2 rounded-lg text-amber-700"><ChevronRight size={14}/></div>
                           <div className="flex flex-col">
                              <span className="font-bold text-stone-800 text-sm">{s.name}</span>
                              <span className="text-[10px] text-amber-600 font-black uppercase tracking-widest">{parent?.name || '---'}</span>
                           </div>
                        </div>
                        <button onClick={() => props.onDeleteSubcategory(s.id)} className="text-stone-300 hover:text-red-500 transition-colors p-2"><Trash2 size={16} /></button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                 <button onClick={() => setEditingProduct({ id: `new-${Date.now()}`, name: '', description: '', category: props.categories[0]?.name || '', subcategory: '', image: '', price: '' })} className="bg-pindorama-green text-white px-12 py-5 rounded-2xl flex items-center gap-4 shadow-2xl font-black uppercase tracking-tighter">
                  <Plus size={22} /> Novo Produto
                </button>
              </div>
              <div className="bg-white rounded-[3.5rem] shadow-xl overflow-hidden border border-stone-200">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b border-stone-100">
                    <tr>
                      <th className="px-10 py-8 text-[11px] font-black text-stone-400 uppercase tracking-widest">Produto</th>
                      <th className="px-10 py-8 text-[11px] font-black text-stone-400 uppercase tracking-widest">Categoria / Sub</th>
                      <th className="px-10 py-8 text-[11px] font-black text-stone-400 uppercase tracking-widest text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {props.products.map(p => (
                      <tr key={p.id} className="group hover:bg-stone-50/50">
                        <td className="px-10 py-6 flex items-center gap-6">
                          <img src={p.image} className="w-16 h-16 rounded-2xl object-cover" />
                          <p className="font-black text-pindorama-green uppercase text-sm">{p.name}</p>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex flex-col">
                              <span className="text-[11px] font-black uppercase text-stone-500">{p.category}</span>
                              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{p.subcategory || 'Sem Subcategoria'}</span>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex justify-end gap-3">
                             <button onClick={() => setEditingProduct(p)} className="p-4 rounded-xl text-stone-400 hover:text-pindorama-green transition-all"><Edit2 size={16} /></button>
                             <button onClick={() => props.onDeleteProduct(p.id)} className="p-4 rounded-xl text-stone-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'partners' && (
            <div className="space-y-8">
              <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-stone-200">
                <h3 className="text-lg font-black text-pindorama-green mb-6 flex items-center gap-3"><Handshake /> Novo Parceiro</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" placeholder="Nome da Marca" className="px-8 py-5 bg-stone-100 rounded-2xl font-bold" value={newPartner.name} onChange={e => setNewPartner({...newPartner, name: e.target.value})} />
                  <label className="group flex items-center justify-center border-2 border-dashed border-stone-200 rounded-2xl p-5 cursor-pointer hover:bg-amber-50 transition-all">
                    {isUploading ? <Loader2 className="animate-spin text-amber-600" /> : <div className="flex items-center gap-3"><Upload size={20} className="text-stone-300"/><span className="text-xs font-bold text-stone-400">{newPartner.logo ? "LOGO SELECIONADA" : "CARREGAR LOGO"}</span></div>}
                    <input type="file" className="hidden" accept="image/*" onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await uploadToSupabase(file);
                        if (url) setNewPartner({...newPartner, logo: url});
                      }
                    }} />
                  </label>
                  <button disabled={!newPartner.logo || isUploading} onClick={() => { props.onAddPartner(newPartner); setNewPartner({name:'', logo:''}); }} className="md:col-span-2 bg-pindorama-green text-white py-6 rounded-2xl font-black disabled:opacity-50">CADASTRAR PARCEIRO</button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {props.partners.map(p => (
                  <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border border-stone-200 flex flex-col items-center gap-4 relative group">
                    <img src={p.logo} className="h-12 object-contain" />
                    <span className="text-[10px] font-black uppercase text-stone-400">{p.name}</span>
                    <button onClick={() => props.onDeletePartner(p.id)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'banners' && (
            <div className="space-y-8">
              <div className="bg-white p-12 rounded-[4rem] border-4 border-dashed border-stone-200 text-center">
                <label className="cursor-pointer group">
                  <div className="flex flex-col items-center py-20">
                    <div className="bg-amber-100 p-8 rounded-[2.5rem] mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all">
                      {isUploading ? <Loader2 className="w-12 h-12 animate-spin" /> : <Camera className="w-12 h-12" />}
                    </div>
                    <h3 className="text-2xl font-black text-pindorama-green mb-2 uppercase italic tracking-tighter">Adicionar Foto do Banner</h3>
                    <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">A foto deve ser horizontal para ficar bonita no site</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadToSupabase(file);
                      if (url) props.onAddBanner(url);
                    }
                  }} />
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {props.banners.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded-[3rem] overflow-hidden group shadow-xl border-4 border-white">
                    <img src={url} className="w-full h-full object-cover" />
                    <button onClick={() => props.onDeleteBanner(url)} className="absolute top-6 right-6 bg-red-500 text-white p-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={24} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-8">
              <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-stone-200">
                <h3 className="text-xl font-black text-pindorama-green mb-8 flex items-center gap-3 italic"><Briefcase /> Cadastrar Obra Realizada</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" placeholder="Nome da Obra" className="px-8 py-5 bg-stone-100 rounded-2xl font-bold" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                  <input type="text" placeholder="Localização" className="px-8 py-5 bg-stone-100 rounded-2xl font-bold" value={newProject.location} onChange={e => setNewProject({...newProject, location: e.target.value})} />
                  
                  <div className="md:col-span-2">
                    <label className="flex flex-col items-center justify-center border-4 border-dashed border-stone-100 rounded-[2.5rem] p-12 cursor-pointer hover:bg-stone-50 transition-all group">
                      {isUploading ? <Loader2 className="w-10 h-10 animate-spin text-amber-600" /> : (
                        newProject.image ? <img src={newProject.image} className="w-32 h-32 rounded-3xl object-cover shadow-lg mb-4" /> : <Upload className="w-12 h-12 text-stone-200 group-hover:text-amber-500 transition-colors mb-4" />
                      )}
                      <span className="font-black text-stone-400 group-hover:text-amber-600 transition-colors uppercase tracking-widest text-xs">{newProject.image ? "FOTO OK" : "CLIQUE PARA CARREGAR FOTO DA OBRA"}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadToSupabase(file);
                          if (url) setNewProject({...newProject, image: url});
                        }
                      }} />
                    </label>
                  </div>

                  <button 
                    disabled={!newProject.image || !newProject.title || isUploading}
                    onClick={() => { props.onAddProject(newProject); setNewProject({title:'', location:'', image:''}); }} 
                    className="md:col-span-2 bg-pindorama-green text-white py-6 rounded-3xl font-black shadow-xl hover:bg-black transition-all disabled:opacity-50"
                  >
                    POSTAR NO SITE
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {props.projects.map(p => (
                  <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-200 group relative aspect-square shadow-sm">
                    <img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <button onClick={() => props.onDeleteProject(p.id)} className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {editingProduct && (
        <div className="fixed inset-0 bg-stone-900/90 backdrop-blur-md z-[110] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[4rem] w-full max-w-2xl shadow-2xl p-12 my-10">
            <h3 className="text-3xl font-black text-pindorama-green uppercase italic mb-10 tracking-tighter">Dados do Produto</h3>
            <div className="space-y-6">
              <input type="text" placeholder="Título do Produto" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full px-8 py-5 bg-stone-100 rounded-3xl font-bold outline-none" />
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                   <select 
                    value={editingProduct.category} 
                    onChange={e => {
                      const newCat = e.target.value;
                      setEditingProduct({...editingProduct, category: newCat, subcategory: ''});
                    }} 
                    className="w-full px-8 py-5 bg-stone-100 rounded-3xl font-bold outline-none border-r-8 border-transparent"
                  >
                    {props.categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>

                  <select 
                    value={editingProduct.subcategory} 
                    onChange={e => setEditingProduct({...editingProduct, subcategory: e.target.value})} 
                    className="w-full px-8 py-5 bg-stone-100 rounded-3xl font-bold outline-none border-r-8 border-transparent"
                    disabled={!editingProduct.category}
                  >
                    <option value="">Sem Subcategoria</option>
                    {props.subcategories
                      .filter(s => s.categoryId === props.categories.find(c => c.name === editingProduct.category)?.id)
                      .map(s => <option key={s.id} value={s.name}>{s.name}</option>)
                    }
                  </select>
                </div>

                <input type="text" placeholder="Preço Sugerido (Ex: R$ 85,00/m)" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full px-8 py-5 bg-stone-100 rounded-3xl font-bold outline-none" />
              </div>
              
              <div className="flex flex-col items-center gap-6 p-8 bg-stone-50 rounded-[3rem]">
                {editingProduct.image && <img src={editingProduct.image} className="w-40 h-40 rounded-[2.5rem] object-cover shadow-2xl border-4 border-white" />}
                <label className="w-full">
                   <div className="w-full px-8 py-6 border-2 border-dashed border-stone-200 rounded-[2rem] flex items-center justify-center gap-4 cursor-pointer hover:bg-white transition-all font-black text-stone-400 uppercase text-xs">
                      {isUploading ? <Loader2 className="animate-spin text-amber-600" /> : <><Upload size={20} /> Escolher Foto</>}
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

              <textarea placeholder="Descrição rápida..." rows={3} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full px-8 py-6 bg-stone-100 rounded-3xl font-bold outline-none" />
              
              <div className="flex flex-col gap-4 pt-6">
                <button 
                  disabled={isUploading || !editingProduct.image}
                  onClick={() => { editingProduct.id.startsWith('new-') ? props.onAddProduct(editingProduct) : props.onUpdateProduct(editingProduct); setEditingProduct(null); }} 
                  className="w-full bg-pindorama-green text-white py-6 rounded-3xl font-black text-xl shadow-2xl disabled:opacity-50"
                >
                  GRAVAR PRODUTO
                </button>
                <button onClick={() => setEditingProduct(null)} className="w-full text-stone-400 font-bold uppercase text-xs py-4">Descartar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;