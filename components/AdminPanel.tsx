
import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, Settings, Plus, Trash2, Edit2, 
  ImageIcon, Save, Database, ShieldCheck, Tag, 
  Handshake, Briefcase, Camera, Upload, 
  Info, Phone, X, Layers, Clock, Share2, Target, Eye, Heart
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
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [localSettings, setLocalSettings] = useState<SiteSettings>(props.settings);
  const [isUploading, setIsUploading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [newCatName, setNewCatName] = useState('');
  const [newSub, setNewSub] = useState({ name: '', categoryId: '' });
  const [newPartner, setNewPartner] = useState({ name: '', logo: '' });

  // Handler seguro para exclusão
  const handleDelete = async (action: () => Promise<void>, msg: string) => {
    if (window.confirm(msg)) {
      try {
        await action();
      } catch (err) {
        alert("Erro ao excluir item. Tente novamente.");
        console.error(err);
      }
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
    } catch (error) {
      console.error(error);
      alert("Erro no upload. Verifique as configurações do Storage.");
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
        <div className="p-8 border-t border-white/10">
          <button onClick={props.onLogout} className="w-full p-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase">
            Sair do Painel
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-stone-200 pb-8">
            <h1 className="text-4xl font-black text-pindorama-green uppercase tracking-tighter">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
            
            {/* Botões de Ação Específicos por Aba */}
            {activeTab === 'products' && (
              <button onClick={() => setEditingProduct({ id: `new-${Date.now()}`, name: '', description: '', category: props.categories[0]?.name || '', image: '' })} className="bg-amber-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 font-black uppercase text-xs">
                <Plus size={18} /> Novo Produto
              </button>
            )}
            {activeTab === 'projects' && (
              <button onClick={() => setEditingProject({ id: `new-${Date.now()}`, title: '', location: '', images: [] })} className="bg-amber-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 font-black uppercase text-xs">
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

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
                  <Package size={24} className="text-amber-600 mb-4" />
                  <p className="text-4xl font-black text-pindorama-green mb-1">{props.products.length}</p>
                  <p className="text-stone-400 font-bold uppercase text-[10px]">Produtos</p>
               </div>
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
                  <Layers size={24} className="text-blue-600 mb-4" />
                  <p className="text-4xl font-black text-pindorama-green mb-1">{props.categories.length}</p>
                  <p className="text-stone-400 font-bold uppercase text-[10px]">Categorias</p>
               </div>
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
                  <Briefcase size={24} className="text-purple-600 mb-4" />
                  <p className="text-4xl font-black text-pindorama-green mb-1">{props.projects.length}</p>
                  <p className="text-stone-400 font-bold uppercase text-[10px]">Obras</p>
               </div>
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
                  <Database size={24} className="text-green-600 mb-4" />
                  <p className="text-sm font-black text-pindorama-green uppercase">Sincronizado</p>
                  <p className="text-stone-400 font-bold uppercase text-[10px]">Banco de Dados</p>
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
                      <td className="px-8 py-4"><span className="text-[10px] font-black uppercase text-stone-500 bg-stone-100 px-3 py-1 rounded-full">{p.category}</span></td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex justify-end gap-2">
                           <button onClick={() => setEditingProduct(p)} className="p-2 text-stone-400 hover:text-pindorama-green"><Edit2 size={16} /></button>
                           <button onClick={() => handleDelete(() => props.onDeleteProduct(p.id), 'Excluir este produto?')} className="p-2 text-stone-400 hover:text-red-500"><Trash2 size={16} /></button>
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
               <div className="space-y-6">
                  <h3 className="text-xl font-black text-pindorama-green uppercase flex items-center gap-2"><Tag /> Categorias</h3>
                  <div className="flex gap-2">
                     <input type="text" placeholder="Nova Categoria" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="flex-1 px-4 py-3 bg-white rounded-xl font-bold border border-stone-200" />
                     <button onClick={() => { props.onAddCategory({name: newCatName}); setNewCatName(''); }} className="bg-amber-600 text-white px-6 rounded-xl font-black uppercase text-xs">Add</button>
                  </div>
                  <div className="bg-white rounded-2xl border border-stone-200 divide-y">
                     {props.categories.map(c => (
                        <div key={c.id} className="p-4 flex items-center justify-between">
                           {editingCategory?.id === c.id ? (
                              <input autoFocus onBlur={() => { props.onUpdateCategory(editingCategory); setEditingCategory(null); }} value={editingCategory.name} onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} className="font-bold uppercase text-sm" />
                           ) : (
                              <span className="font-bold uppercase text-sm">{c.name}</span>
                           )}
                           <div className="flex gap-2">
                              <button onClick={() => setEditingCategory(c)} className="text-stone-400 hover:text-blue-500"><Edit2 size={14} /></button>
                              <button onClick={() => handleDelete(() => props.onDeleteCategory(c.id), 'Excluir esta categoria?')} className="text-stone-400 hover:text-red-500"><Trash2 size={14} /></button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="space-y-6">
                  <h3 className="text-xl font-black text-pindorama-green uppercase flex items-center gap-2"><Layers /> Subcategorias</h3>
                  <div className="grid grid-cols-2 gap-2">
                     <select value={newSub.categoryId} onChange={e => setNewSub({...newSub, categoryId: e.target.value})} className="px-4 py-3 bg-white rounded-xl font-bold border border-stone-200">
                        <option value="">Selecione Categoria</option>
                        {props.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                     </select>
                     <div className="flex gap-2">
                        <input type="text" placeholder="Nova Sub" value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})} className="flex-1 px-4 py-3 bg-white rounded-xl font-bold border border-stone-200" />
                        <button onClick={() => { props.onAddSubcategory(newSub); setNewSub({name: '', categoryId: ''}); }} className="bg-amber-600 text-white px-6 rounded-xl font-black uppercase text-xs">Add</button>
                     </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-stone-200 divide-y">
                     {props.subcategories.map(s => (
                        <div key={s.id} className="p-4 flex items-center justify-between">
                           <div className="flex flex-col">
                              <span className="font-bold uppercase text-sm">{s.name}</span>
                              <span className="text-[9px] text-stone-400 font-black uppercase">{props.categories.find(c => c.id === s.categoryId)?.name}</span>
                           </div>
                           <div className="flex gap-2">
                              <button onClick={() => handleDelete(() => props.onDeleteSubcategory(s.id), 'Excluir esta subcategoria?')} className="text-stone-400 hover:text-red-500"><Trash2 size={14} /></button>
                           </div>
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
                         <button onClick={() => handleDelete(() => props.onDeleteBanner(url), 'Remover este slide?')} className="bg-red-500 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform">
                            <Trash2 size={24} />
                         </button>
                      </div>
                   </div>
                ))}
                {props.banners.length === 0 && (
                   <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-stone-200 text-center">
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
                         <img src={p.images[0]} className="w-full h-full object-cover" />
                         <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-[10px] font-black">{p.images.length} Fotos</div>
                      </div>
                      <div className="p-6">
                         <h4 className="font-black text-pindorama-green uppercase text-sm mb-1">{p.title}</h4>
                         <p className="text-stone-400 text-xs font-bold uppercase">{p.location}</p>
                         <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setEditingProject(p)} className="p-2 bg-stone-50 rounded-lg hover:bg-blue-50 hover:text-blue-600"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(() => props.onDeleteProject(p.id), 'Excluir esta obra?')} className="p-2 bg-stone-50 rounded-lg hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
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
                         <span className="text-[10px] font-black uppercase text-stone-400">Logo (Upload)</span>
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
                      <button onClick={() => { props.onAddPartner(newPartner); setNewPartner({name: '', logo: ''}); }} className="h-[50px] bg-amber-600 text-white px-8 rounded-xl font-black uppercase text-xs">Cadastrar</button>
                   </div>
                   {newPartner.logo && <img src={newPartner.logo} className="mt-4 h-12 object-contain" />}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                   {props.partners.map(p => (
                      <div key={p.id} className="bg-white p-6 rounded-3xl border border-stone-200 text-center relative group">
                         <img src={p.logo} className="h-10 mx-auto object-contain mb-2" />
                         <p className="text-[9px] font-black text-stone-400 uppercase">{p.name}</p>
                         <button onClick={() => handleDelete(() => props.onDeletePartner(p.id), 'Excluir parceiro?')} className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'about' && (
             <div className="space-y-8">
                <div className="bg-white p-10 rounded-[3rem] border border-stone-200 space-y-8">
                   <div className="space-y-6">
                      <h3 className="text-xl font-black text-pindorama-green uppercase flex items-center gap-2"><Info /> História da Empresa</h3>
                      <div className="space-y-4">
                         <label className="block space-y-2">
                            <span className="text-[10px] font-black uppercase text-stone-400">Título da Seção Sobre</span>
                            <input type="text" value={localSettings.aboutTitle || ''} onChange={e => setLocalSettings({...localSettings, aboutTitle: e.target.value})} className="w-full px-6 py-4 bg-stone-50 rounded-2xl font-bold" />
                         </label>
                         <label className="block space-y-2">
                            <span className="text-[10px] font-black uppercase text-stone-400">Texto Principal</span>
                            <textarea rows={6} value={localSettings.aboutText || ''} onChange={e => setLocalSettings({...localSettings, aboutText: e.target.value})} className="w-full px-6 py-4 bg-stone-50 rounded-2xl font-bold" />
                         </label>
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-stone-50 p-6 rounded-[2rem] space-y-4">
                         <h4 className="text-sm font-black text-pindorama-green uppercase flex items-center gap-2"><Target size={16} /> Missão</h4>
                         <textarea rows={3} value={localSettings.mission || ''} onChange={e => setLocalSettings({...localSettings, mission: e.target.value})} className="w-full px-4 py-3 bg-white rounded-xl font-bold" />
                      </div>
                      <div className="bg-stone-50 p-6 rounded-[2rem] space-y-4">
                         <h4 className="text-sm font-black text-pindorama-green uppercase flex items-center gap-2"><Eye size={16} /> Visão</h4>
                         <textarea rows={3} value={localSettings.vision || ''} onChange={e => setLocalSettings({...localSettings, vision: e.target.value})} className="w-full px-4 py-3 bg-white rounded-xl font-bold" />
                      </div>
                      <div className="bg-stone-50 p-6 rounded-[2rem] space-y-4">
                         <h4 className="text-sm font-black text-pindorama-green uppercase flex items-center gap-2"><ShieldCheck size={16} /> Princípios</h4>
                         <textarea rows={3} value={localSettings.principles || ''} onChange={e => setLocalSettings({...localSettings, principles: e.target.value})} className="w-full px-4 py-3 bg-white rounded-xl font-bold" />
                      </div>
                      <div className="bg-stone-50 p-6 rounded-[2rem] space-y-4">
                         <h4 className="text-sm font-black text-pindorama-green uppercase flex items-center gap-2"><Heart size={16} /> Valores</h4>
                         <textarea rows={3} value={localSettings.valuesText || ''} onChange={e => setLocalSettings({...localSettings, valuesText: e.target.value})} className="w-full px-4 py-3 bg-white rounded-xl font-bold" />
                      </div>
                   </div>

                   <div className="flex justify-end pt-4">
                      <button onClick={() => handleDelete(async () => await props.onUpdateSettings(localSettings), 'Gravar textos institucionais?')} className="bg-pindorama-green text-white px-12 py-5 rounded-2xl font-black uppercase shadow-2xl hover:bg-black transition-all">Salvar Institucional</button>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'settings' && (
             <div className="space-y-8 pb-10">
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="bg-white p-8 rounded-3xl border border-stone-200 space-y-6">
                      <h3 className="text-lg font-black text-pindorama-green uppercase flex items-center gap-2"><Phone size={18} /> Contatos Principais</h3>
                      <label className="block space-y-2">
                         <span className="text-[10px] font-black uppercase text-stone-400">WhatsApp (apenas números)</span>
                         <input type="text" value={localSettings.whatsapp} onChange={e => setLocalSettings({...localSettings, whatsapp: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold" />
                      </label>
                      <label className="block space-y-2">
                         <span className="text-[10px] font-black uppercase text-stone-400">Telefone Fixo</span>
                         <input type="text" value={localSettings.phone} onChange={e => setLocalSettings({...localSettings, phone: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold" />
                      </label>
                      <label className="block space-y-2">
                         <span className="text-[10px] font-black uppercase text-stone-400">Email</span>
                         <input type="email" value={localSettings.email} onChange={e => setLocalSettings({...localSettings, email: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold" />
                      </label>
                   </div>
                   <div className="bg-white p-8 rounded-3xl border border-stone-200 space-y-6">
                      <h3 className="text-lg font-black text-pindorama-green uppercase flex items-center gap-2"><Clock size={18} /> Horários</h3>
                      <label className="block space-y-2">
                         <span className="text-[10px] font-black uppercase text-stone-400">Segunda a Sexta</span>
                         <input type="text" value={localSettings.hoursWeek} onChange={e => setLocalSettings({...localSettings, hoursWeek: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold" />
                      </label>
                      <label className="block space-y-2">
                         <span className="text-[10px] font-black uppercase text-stone-400">Sábados</span>
                         <input type="text" value={localSettings.hoursSat} onChange={e => setLocalSettings({...localSettings, hoursSat: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold" />
                      </label>
                   </div>
                   <div className="bg-white p-8 rounded-3xl border border-stone-200 space-y-6">
                      <h3 className="text-lg font-black text-pindorama-green uppercase flex items-center gap-2"><Share2 size={18} /> Redes Sociais</h3>
                      <label className="block space-y-2">
                         <span className="text-[10px] font-black uppercase text-stone-400">Instagram URL</span>
                         <input type="text" value={localSettings.instagram} onChange={e => setLocalSettings({...localSettings, instagram: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold" />
                      </label>
                      <label className="block space-y-2">
                         <span className="text-[10px] font-black uppercase text-stone-400">Facebook URL</span>
                         <input type="text" value={localSettings.facebook} onChange={e => setLocalSettings({...localSettings, facebook: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold" />
                      </label>
                   </div>
                   <div className="bg-white p-8 rounded-3xl border border-stone-200 space-y-6">
                      <h3 className="text-lg font-black text-pindorama-green uppercase flex items-center gap-2"><Database size={18} /> Marketing (Pixel/Tags)</h3>
                      <label className="block space-y-2">
                         <span className="text-[10px] font-black uppercase text-stone-400">Facebook Pixel ID</span>
                         <input type="text" value={localSettings.pixelId} onChange={e => setLocalSettings({...localSettings, pixelId: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold" />
                      </label>
                      <label className="block space-y-2">
                         <span className="text-[10px] font-black uppercase text-stone-400">Google Tag Manager ID</span>
                         <input type="text" value={localSettings.googleTag} onChange={e => setLocalSettings({...localSettings, googleTag: e.target.value})} className="w-full px-4 py-3 bg-stone-50 rounded-xl font-bold" />
                      </label>
                   </div>
                </div>
                <div className="flex justify-end">
                   <button onClick={() => handleDelete(async () => await props.onUpdateSettings(localSettings), 'Salvar todas as alterações de identidade?')} className="bg-pindorama-green text-white px-16 py-5 rounded-2xl font-black uppercase shadow-2xl">Gravar Configurações</button>
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
               <h3 className="text-2xl font-black text-pindorama-green uppercase">Ficha do Produto</h3>
               <button onClick={() => setEditingProduct(null)} className="text-stone-300 hover:text-red-500"><X /></button>
            </div>
            <div className="space-y-6">
               <input type="text" placeholder="Nome" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full px-4 py-4 bg-stone-50 rounded-xl font-bold border" />
               <div className="grid grid-cols-2 gap-4">
                  <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="px-4 py-4 bg-stone-50 rounded-xl font-bold border">
                     <option value="">Categoria</option>
                     {props.categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <input type="text" placeholder="Preço (ex: R$ 45,00/m)" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} className="px-4 py-4 bg-stone-50 rounded-xl font-bold border" />
               </div>
               <div className="bg-stone-50 p-8 rounded-2xl border-2 border-dashed border-stone-200 text-center relative group">
                  {editingProduct.image ? (
                     <div className="relative inline-block">
                        <img src={editingProduct.image} className="w-40 h-40 object-cover rounded-xl shadow-lg" />
                        <button onClick={() => setEditingProduct({...editingProduct, image: ''})} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"><X size={12} /></button>
                     </div>
                  ) : (
                     <div className="flex flex-col items-center">
                        <Camera size={40} className="text-stone-300 mb-2" />
                        <span className="text-xs font-black uppercase text-stone-400">Foto Principal</span>
                     </div>
                  )}
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
               <textarea placeholder="Descrição" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} rows={3} className="w-full px-4 py-4 bg-stone-50 rounded-xl font-bold border" />
               <button onClick={() => {
                  const action = editingProduct.id.startsWith('new-') ? props.onAddProduct(editingProduct) : props.onUpdateProduct(editingProduct);
                  action.then(() => setEditingProduct(null));
               }} className="w-full bg-pindorama-green text-white py-5 rounded-2xl font-black uppercase">Salvar Produto</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL OBRA */}
      {editingProject && (
         <div className="fixed inset-0 bg-stone-900/95 z-[200] flex items-center justify-center p-6 overflow-y-auto">
            <div className="bg-white rounded-[3rem] w-full max-w-4xl p-10 max-h-[90vh] overflow-y-auto">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-pindorama-green uppercase">Portfólio de Obras</h3>
                  <button onClick={() => setEditingProject(null)} className="text-stone-300 hover:text-red-500"><X /></button>
               </div>
               <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                     <input type="text" placeholder="Título da Obra" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="px-4 py-4 bg-stone-50 rounded-xl font-bold border" />
                     <input type="text" placeholder="Localização" value={editingProject.location} onChange={e => setEditingProject({...editingProject, location: e.target.value})} className="px-4 py-4 bg-stone-50 rounded-xl font-bold border" />
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-stone-400">Fotos da Obra (Máx 10)</span>
                        <span className="text-[10px] font-black text-amber-600 uppercase">{editingProject.images.length}/10</span>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {editingProject.images.map((img, i) => (
                           <div key={i} className="relative aspect-square bg-stone-100 rounded-xl overflow-hidden border">
                              <img src={img} className="w-full h-full object-cover" />
                              <button onClick={() => setEditingProject({...editingProject, images: editingProject.images.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><X size={10} /></button>
                           </div>
                        ))}
                        {editingProject.images.length < 10 && (
                           <label className="aspect-square bg-stone-50 rounded-xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center cursor-pointer hover:bg-stone-100 transition-colors">
                              <Plus className="text-stone-300" />
                              <span className="text-[8px] font-black text-stone-400 uppercase mt-1">Add Foto</span>
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
                  </div>

                  <button onClick={() => {
                     const action = editingProject.id.startsWith('new-') ? props.onAddProject(editingProject) : props.onUpdateProject(editingProject);
                     action.then(() => setEditingProject(null));
                  }} className="w-full bg-pindorama-green text-white py-5 rounded-2xl font-black uppercase mt-8">Gravar Obra</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default AdminPanel;
