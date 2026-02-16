import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, Package, Settings, LogOut, Plus, Trash2, Edit2, 
  ImageIcon, Save, X, Database, RefreshCw, Key, ShieldCheck, Tag, 
  Youtube, Handshake, Briefcase, Camera, Upload, Image as ImageIconLucide,
  CheckCircle, XCircle, Terminal, Loader2, Globe
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
  // Unused but required per interface
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
  
  // States para novos cadastros
  const [newCatName, setNewCatName] = useState('');
  const [newPartner, setNewPartner] = useState({ name: '', logo: '' });
  const [newProject, setNewProject] = useState({ title: '', location: '', image: '' });

  // Função mestre de Upload
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
        if (uploadError.message.includes('Bucket not found')) {
          alert('ERRO: O bucket "images" não foi encontrado. Você precisa criar um bucket chamado "images" no painel do Supabase Storage e deixá-lo como PUBLIC.');
        } else {
          alert('Erro no upload: ' + uploadError.message);
        }
        throw uploadError;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Erro detalhado:', error);
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
    { id: 'categories', label: 'Categorias', icon: <Tag size={20} /> },
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

      <main className="flex-1 overflow-y-auto p-12 bg-wood-grain bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-5xl font-black text-pindorama-green uppercase italic tracking-tighter">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
            {isUploading && <div className="flex items-center gap-3 bg-amber-100 text-amber-700 px-6 py-3 rounded-full font-black animate-pulse"><Loader2 className="animate-spin" /> SUBINDO FOTO...</div>}
          </div>

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
               <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-stone-200">
                  <Globe size={32} className="text-stone-300 mb-6" />
                  <p className="text-sm font-bold text-stone-500 mb-2 uppercase">Status do Domínio</p>
                  <p className="text-xs text-stone-400 leading-relaxed font-medium">Sincronizado com o Supabase. Todas as alterações refletem no site em tempo real.</p>
               </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-8">
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-stone-200">
                <h3 className="text-lg font-black text-pindorama-green mb-6">Nova Categoria</h3>
                <div className="flex gap-4">
                  <input type="text" placeholder="Ex: Telhados, Decks..." className="flex-1 px-8 py-5 bg-stone-50 rounded-2xl font-bold" value={newCatName} onChange={e => setNewCatName(e.target.value)} />
                  <button onClick={() => { props.onAddCategory({name: newCatName}); setNewCatName(''); }} className="bg-pindorama-green text-white px-10 rounded-2xl font-black">ADICIONAR</button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {props.categories.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-3xl border border-stone-200 flex justify-between items-center group">
                    <span className="font-bold text-pindorama-green">{c.name}</span>
                    <button onClick={() => props.onDeleteCategory(c.id)} className="text-stone-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'partners' && (
            <div className="space-y-8">
              <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-stone-200">
                <h3 className="text-lg font-black text-pindorama-green mb-6 flex items-center gap-3"><Handshake /> Novo Parceiro / Fornecedor</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" placeholder="Nome da Marca" className="px-8 py-5 bg-stone-100 rounded-2xl font-bold" value={newPartner.name} onChange={e => setNewPartner({...newPartner, name: e.target.value})} />
                  <label className="group flex items-center justify-center border-2 border-dashed border-stone-200 rounded-2xl p-5 cursor-pointer hover:bg-amber-50 transition-all">
                    {isUploading ? <Loader2 className="animate-spin text-amber-600" /> : <div className="flex items-center gap-3"><Upload size={20} className="text-stone-300"/><span className="text-xs font-bold text-stone-400">{newPartner.logo ? "LOGO SELECIONADA" : "CARREGAR LOGO (PNG)"}</span></div>}
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
                    <img src={p.logo} className="h-12 object-contain grayscale group-hover:grayscale-0 transition-all" />
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
                    <h3 className="text-2xl font-black text-pindorama-green mb-2">SELECIONAR FOTO DO BANNER</h3>
                    <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Recomendado: 1920x1080px (Horizontal)</p>
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

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                 <button onClick={() => setEditingProduct({ id: `new-${Date.now()}`, name: '', description: '', category: props.categories[0]?.name || '', image: '', price: '' })} className="bg-pindorama-green text-white px-12 py-5 rounded-2xl flex items-center gap-4 shadow-2xl font-black uppercase tracking-tighter">
                  <Plus size={22} /> Adicionar Produto
                </button>
              </div>
              <div className="bg-white rounded-[3.5rem] shadow-xl overflow-hidden border border-stone-200">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b border-stone-100">
                    <tr>
                      <th className="px-10 py-8 text-[11px] font-black text-stone-400 uppercase tracking-widest">Produto</th>
                      <th className="px-10 py-8 text-[11px] font-black text-stone-400 uppercase tracking-widest text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {props.products.map(p => (
                      <tr key={p.id} className="group hover:bg-stone-50/50">
                        <td className="px-10 py-6 flex items-center gap-6">
                          <img src={p.image} className="w-16 h-16 rounded-2xl object-cover shadow-inner" />
                          <div>
                            <p className="font-black text-pindorama-green uppercase text-sm">{p.name}</p>
                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{p.category}</p>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex justify-end gap-3">
                             <button onClick={() => setEditingProduct(p)} className="bg-stone-100 p-4 rounded-xl text-stone-400 hover:text-pindorama-green hover:bg-stone-200 transition-all"><Edit2 size={16} /></button>
                             <button onClick={() => props.onDeleteProduct(p.id)} className="bg-stone-100 p-4 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-12 rounded-[4rem] border border-stone-200 shadow-sm space-y-12">
               <div>
                 <h3 className="text-2xl font-black text-pindorama-green mb-8 uppercase italic tracking-tighter">Identidade Visual</h3>
                 <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="w-48 h-48 bg-stone-100 rounded-[2.5rem] flex items-center justify-center overflow-hidden border-4 border-white shadow-inner">
                       {localSettings.logo ? <img src={localSettings.logo} className="w-full h-full object-contain p-4" /> : <ShieldCheck className="text-stone-300 w-16 h-16" />}
                    </div>
                    <div className="flex-1">
                       <label className="inline-flex items-center gap-4 bg-pindorama-green text-white px-8 py-4 rounded-2xl font-black cursor-pointer hover:bg-black transition-all">
                          {isUploading ? <Loader2 className="animate-spin" /> : <Upload size={20} />} CARREGAR NOVO LOGOTIPO
                          <input type="file" className="hidden" accept="image/*" onChange={async e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await uploadToSupabase(file);
                              if (url) setLocalSettings({...localSettings, logo: url});
                            }
                          }} />
                       </label>
                       <p className="text-xs text-stone-400 mt-4 font-bold uppercase tracking-widest">Formato ideal: PNG transparente ou SVG</p>
                    </div>
                 </div>
               </div>

               <div className="pt-12 border-t border-stone-100">
                 <h3 className="text-2xl font-black text-pindorama-green mb-10 uppercase italic tracking-tighter">Canais de Atendimento</h3>
                 <div className="grid md:grid-cols-2 gap-8">
                    <label className="block space-y-2">
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">WhatsApp (Link Direto)</span>
                      <input type="text" value={localSettings.whatsapp} onChange={e => setLocalSettings({...localSettings, whatsapp: e.target.value})} className="w-full px-8 py-5 bg-stone-50 rounded-2xl font-bold border-2 border-transparent focus:border-amber-500 outline-none" />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Instagram (Link)</span>
                      <input type="text" value={localSettings.instagram} onChange={e => setLocalSettings({...localSettings, instagram: e.target.value})} className="w-full px-8 py-5 bg-stone-50 rounded-2xl font-bold border-2 border-transparent focus:border-amber-500 outline-none" />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Endereço Completo</span>
                      <input type="text" value={localSettings.address} onChange={e => setLocalSettings({...localSettings, address: e.target.value})} className="w-full px-8 py-5 bg-stone-50 rounded-2xl font-bold border-2 border-transparent focus:border-amber-500 outline-none" />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Telefone Comercial</span>
                      <input type="text" value={localSettings.phone} onChange={e => setLocalSettings({...localSettings, phone: e.target.value})} className="w-full px-8 py-5 bg-stone-50 rounded-2xl font-bold border-2 border-transparent focus:border-amber-500 outline-none" />
                    </label>
                 </div>
               </div>

               <div className="mt-12 pt-12 border-t border-stone-100 flex justify-end">
                  <button disabled={isSaving || isUploading} onClick={() => { setIsSaving(true); props.onUpdateSettings(localSettings).then(() => setIsSaving(false)); }} className="bg-pindorama-green text-white px-16 py-6 rounded-3xl font-black shadow-2xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all">
                    {isSaving ? <RefreshCw className="animate-spin" /> : <Save size={24} />} ATUALIZAR DADOS DO SITE
                  </button>
               </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-8">
              <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-stone-200">
                <h3 className="text-xl font-black text-pindorama-green mb-8 flex items-center gap-3 italic"><Briefcase /> Nova Obra no Portfólio</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" placeholder="Título do Projeto (Ex: Casa Lago)" className="px-8 py-5 bg-stone-100 rounded-2xl font-bold" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                  <input type="text" placeholder="Localização (Ex: Uberaba - MG)" className="px-8 py-5 bg-stone-100 rounded-2xl font-bold" value={newProject.location} onChange={e => setNewProject({...newProject, location: e.target.value})} />
                  
                  <div className="md:col-span-2">
                    <label className="flex flex-col items-center justify-center border-4 border-dashed border-stone-100 rounded-[2.5rem] p-12 cursor-pointer hover:bg-stone-50 transition-all group">
                      {isUploading ? <Loader2 className="w-10 h-10 animate-spin text-amber-600" /> : (
                        newProject.image ? <img src={newProject.image} className="w-32 h-32 rounded-3xl object-cover shadow-lg mb-4" /> : <Upload className="w-12 h-12 text-stone-200 group-hover:text-amber-500 transition-colors mb-4" />
                      )}
                      <span className="font-black text-stone-400 group-hover:text-amber-600 transition-colors uppercase tracking-widest text-xs">{newProject.image ? "FOTO CARREGADA" : "CLIQUE PARA SUBIR FOTO DA OBRA"}</span>
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
                    PUBLICAR PROJETO NO SITE
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {props.projects.map(p => (
                  <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-200 group relative aspect-[4/5] shadow-sm">
                    <img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="font-black text-white text-xs uppercase tracking-tighter truncate">{p.title}</p>
                      <p className="text-[8px] font-bold text-amber-400 uppercase tracking-widest">{p.location}</p>
                    </div>
                    <button onClick={() => props.onDeleteProject(p.id)} className="absolute top-4 right-4 p-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Produto */}
      {editingProduct && (
        <div className="fixed inset-0 bg-stone-900/90 backdrop-blur-md z-[110] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[4rem] w-full max-w-2xl shadow-2xl p-12 my-10 border-8 border-white">
            <h3 className="text-3xl font-black text-pindorama-green uppercase italic mb-10 tracking-tighter">Configurar Produto</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Nome do Produto" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="col-span-2 w-full px-8 py-5 bg-stone-100 rounded-3xl font-bold border-2 border-transparent focus:border-amber-500 outline-none" />
                <input type="text" placeholder="Preço (Ex: R$ 50,00/m)" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full px-8 py-5 bg-stone-100 rounded-3xl font-bold border-2 border-transparent focus:border-amber-500 outline-none" />
                <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full px-8 py-5 bg-stone-100 rounded-3xl font-bold border-2 border-transparent focus:border-amber-500 outline-none">
                  {props.categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              
              <div className="flex flex-col items-center gap-6 p-8 bg-stone-50 rounded-[3rem] border border-stone-100">
                {editingProduct.image ? <img src={editingProduct.image} className="w-40 h-40 rounded-[2.5rem] object-cover shadow-2xl border-4 border-white" /> : <div className="w-40 h-40 bg-white rounded-[2.5rem] flex items-center justify-center shadow-inner"><ImageIconLucide className="text-stone-200 w-12 h-12" /></div>}
                <label className="w-full">
                   <div className="w-full px-8 py-6 border-2 border-dashed border-stone-200 rounded-[2rem] flex items-center justify-center gap-4 cursor-pointer hover:bg-white hover:border-amber-500 transition-all font-black text-stone-400 uppercase text-xs tracking-widest">
                      {isUploading ? <Loader2 className="animate-spin text-amber-600" /> : <><Upload size={20} /> Carregar Nova Foto</>}
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

              <textarea placeholder="Fale sobre a qualidade, usos e durabilidade deste produto..." rows={4} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full px-8 py-6 bg-stone-100 rounded-3xl font-bold border-2 border-transparent focus:border-amber-500 outline-none" />
              
              <div className="flex flex-col gap-4 pt-6">
                <button 
                  disabled={isUploading || !editingProduct.image || !editingProduct.name}
                  onClick={() => { editingProduct.id.startsWith('new-') ? props.onAddProduct(editingProduct) : props.onUpdateProduct(editingProduct); setEditingProduct(null); }} 
                  className="w-full bg-pindorama-green text-white py-6 rounded-3xl font-black text-xl shadow-2xl hover:bg-black transition-all disabled:opacity-50"
                >
                  SALVAR PRODUTO NO BANCO
                </button>
                <button onClick={() => setEditingProduct(null)} className="w-full text-stone-400 font-bold uppercase tracking-widest text-xs py-4">Descartar Alterações</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;