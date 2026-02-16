import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, Settings, LogOut, Plus, Trash2, Edit2, 
  ImageIcon, Save, X, Database, RefreshCw, Key, ShieldCheck, Tag, 
  AlertTriangle, Youtube, Handshake, Layers, Globe, Facebook, Instagram, 
  CheckCircle, XCircle, Search, Info, Terminal
} from 'lucide-react';
import { Product, SiteSettings, Category, Subcategory, Partner, Brand, YouTubeVideo } from '../types';

interface AdminPanelProps {
  products: Product[];
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateProduct: (product: Product) => Promise<void>;
  onAddProduct: (product: Product) => Promise<void>;
  categories: Category[];
  onAddCategory: (category: { name: string }) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  subcategories: Subcategory[];
  onAddSubcategory: (sub: { name: string, categoryId: string }) => Promise<void>;
  onDeleteSubcategory: (id: string) => Promise<void>;
  partners: Partner[];
  onAddPartner: (p: { name: string, logo: string }) => Promise<void>;
  onDeletePartner: (id: string) => Promise<void>;
  brands: Brand[];
  onAddBrand: (b: { name: string, logo: string }) => Promise<void>;
  onDeleteBrand: (id: string) => Promise<void>;
  videos: YouTubeVideo[];
  onAddVideo: (v: { title: string, youtubeId: string }) => Promise<void>;
  onDeleteVideo: (id: string) => Promise<void>;
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => Promise<void>;
  dbStatus: 'online' | 'offline' | 'error';
  dbError?: string | null;
  onLogout: () => void;
}

type Tab = 'dashboard' | 'products' | 'categories' | 'subcategories' | 'partners' | 'brands' | 'videos' | 'settings';

const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [localSettings, setLocalSettings] = useState<SiteSettings>(props.settings);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string, type: string } | null>(null);

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
    { id: 'products', label: 'Produtos', icon: <Package size={20} /> },
    { id: 'categories', label: 'Categorias', icon: <Tag size={20} /> },
    { id: 'subcategories', label: 'Subcategorias', icon: <Layers size={20} /> },
    { id: 'partners', label: 'Parceiros', icon: <Handshake size={20} /> },
    { id: 'brands', label: 'Marcas', icon: <ShieldCheck size={20} /> },
    { id: 'videos', label: 'Vídeos', icon: <Youtube size={20} /> },
    { id: 'settings', label: 'Ajustes', icon: <Settings size={20} />, highlight: true },
  ];

  const getStatusLabel = () => {
    switch(props.dbStatus) {
      case 'online': return { color: 'text-green-400', bg: 'bg-green-500/10', text: 'Sincronizado', icon: <CheckCircle size={14} /> };
      case 'error': return { color: 'text-red-400', bg: 'bg-red-500/10', text: 'Falha Técnica', icon: <XCircle size={14} /> };
      default: return { color: 'text-stone-400', bg: 'bg-stone-500/10', text: 'Modo Local', icon: <Database size={14} /> };
    }
  };

  const status = getStatusLabel();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pindorama-green p-4">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl w-full max-w-md text-center border-8 border-stone-50">
          <div className="bg-amber-100 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <ShieldCheck className="text-pindorama-green w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-pindorama-green mb-2 tracking-tight">Painel ADM</h2>
          <p className="text-stone-400 font-medium mb-10 italic">Acesso Restrito</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Senha Mestra"
              className="w-full px-8 py-6 bg-stone-100 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/20 font-bold text-center text-xl transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {loginError && <p className="text-red-500 text-xs font-bold">Acesso negado.</p>}
            <button type="submit" className="w-full bg-pindorama-green text-white py-6 rounded-2xl font-black text-lg shadow-xl hover:bg-green-900 transition-all active:scale-95">
              ENTRAR NO SISTEMA
            </button>
          </form>
          <button onClick={props.onLogout} className="mt-10 text-stone-400 font-bold text-sm hover:text-pindorama-green underline">Sair do Painel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden font-sans">
      <aside className="w-80 bg-pindorama-green text-white flex flex-col shrink-0 shadow-2xl">
        <div className="p-10 border-b border-white/5">
           <div className="flex items-center gap-4 mb-4">
             <div className="bg-white/10 p-2 rounded-xl"><ShieldCheck className="text-amber-400" /></div>
             <h2 className="text-2xl font-black tracking-tighter uppercase italic">Pindorama</h2>
           </div>
           <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${status.bg} ${status.color} border border-white/5`}>
              <div className={`w-2 h-2 rounded-full ${props.dbStatus === 'online' ? 'bg-green-400' : props.dbStatus === 'error' ? 'bg-red-400 animate-pulse' : 'bg-stone-500'}`}></div>
              {status.text}
           </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === item.id ? (item.highlight ? 'bg-amber-600 shadow-lg' : 'bg-white/10 shadow-md') : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-6">
          <button onClick={props.onLogout} className="w-full p-5 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white font-bold transition-all flex items-center justify-center gap-3 border border-red-500/20">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-wood-grain">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-end mb-12">
            <div>
               <h1 className="text-5xl font-black text-pindorama-green">{menuItems.find(m => m.id === activeTab)?.label}</h1>
               <p className="text-stone-400 font-medium mt-2">Ambiente de Controle Madeireira Pindorama</p>
            </div>
            {activeTab === 'products' && (
              <button 
                onClick={() => setEditingProduct({ id: `new-${Date.now()}`, name: '', description: '', category: props.categories[0]?.id || '', image: '', price: '' })}
                className="bg-pindorama-green text-white px-10 py-5 rounded-2xl flex items-center gap-3 shadow-2xl hover:scale-105 transition-all font-bold"
              >
                <Plus size={22} /> Novo Produto
              </button>
            )}
          </header>

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white p-10 rounded-[3rem] shadow-sm border-b-8 border-amber-600">
                  <Package size={32} className="text-amber-600 mb-6" />
                  <p className="text-6xl font-black text-pindorama-green">{props.products.length}</p>
                  <p className="text-stone-400 font-bold mt-2">Produtos Cadastrados</p>
               </div>
               
               <div className="bg-white p-10 rounded-[3rem] shadow-sm border-b-8 border-pindorama-green">
                  <Handshake size={32} className="text-pindorama-green mb-6" />
                  <p className="text-6xl font-black text-pindorama-green">{props.partners.length}</p>
                  <p className="text-stone-400 font-bold mt-2">Parceiros e Marcas</p>
               </div>

               {/* Central de Diagnóstico */}
               <div className="bg-white p-10 rounded-[3rem] shadow-xl border-2 border-stone-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black uppercase tracking-widest text-xs text-stone-500">Diagnóstico Técnico</h3>
                    <Terminal size={20} className="text-stone-300" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-400">Configuração:</span>
                      <span className={props.dbStatus !== 'offline' ? 'text-green-600 font-black' : 'text-red-500 font-black'}>
                        {props.dbStatus !== 'offline' ? 'SIM' : 'NÃO'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-400">Comunicação API:</span>
                      <span className={props.dbStatus === 'online' ? 'text-green-600 font-black' : 'text-red-500 font-black'}>
                        {props.dbStatus === 'online' ? 'OK' : 'ERRO'}
                      </span>
                    </div>
                  </div>

                  {props.dbError && (
                    <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100">
                      <p className="text-[10px] font-black text-red-700 uppercase mb-2 flex items-center gap-2">
                        <AlertTriangle size={12} /> Log do Supabase:
                      </p>
                      <p className="text-[10px] text-red-600/70 font-mono break-words leading-tight uppercase">
                        {props.dbError}
                      </p>
                    </div>
                  )}

                  <button 
                    onClick={() => window.location.reload()}
                    className="w-full mt-6 bg-stone-100 hover:bg-pindorama-green hover:text-white text-pindorama-green py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={12} /> Forçar Re-conexão
                  </button>
               </div>

               <div className="md:col-span-3 bg-white border-4 border-dashed border-stone-200 rounded-[3.5rem] p-12">
                  <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="bg-stone-50 p-10 rounded-full text-stone-200"><Info size={80} /></div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-pindorama-green mb-4">Como confirmar a conexão?</h3>
                      <p className="text-stone-500 leading-relaxed font-medium">Se a bolinha no menu lateral estiver <strong>Verde</strong> e você conseguir ver produtos no site que não estão na lista padrão, a conexão está 100% ativa. Se as alterações feitas aqui persistirem após um "F5", os dados já estão salvos na nuvem do Supabase.</p>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* ... resto das abas do painel ... */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-[3.5rem] shadow-xl overflow-hidden border border-stone-200">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="px-10 py-8 text-[11px] font-black text-stone-400 uppercase tracking-widest italic">Item</th>
                    <th className="px-10 py-8 text-[11px] font-black text-stone-400 uppercase tracking-widest">Categoria</th>
                    <th className="px-10 py-8 text-[11px] font-black text-stone-400 uppercase tracking-widest text-right">Controles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {props.products.map(p => (
                    <tr key={p.id} className="group hover:bg-stone-50/50 transition-colors">
                      <td className="px-10 py-6 flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
                          <img src={p.image} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-pindorama-green text-lg">{p.name}</p>
                          <p className="text-amber-600 font-bold text-xs uppercase tracking-wider">{p.price || 'Sob Consulta'}</p>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="bg-stone-100 text-stone-400 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-stone-200">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                         <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => setEditingProduct(p)} className="p-3 bg-white shadow-sm border border-stone-100 text-stone-400 hover:text-pindorama-green rounded-xl"><Edit2 size={16} /></button>
                            <button onClick={() => setItemToDelete({id: p.id, name: p.name, type: 'product'})} className="p-3 bg-white shadow-sm border border-stone-100 text-stone-400 hover:text-red-500 rounded-xl"><Trash2 size={16} /></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-12 rounded-[3.5rem] border border-stone-200 shadow-sm relative overflow-hidden">
               <h3 className="text-2xl font-black text-pindorama-green mb-10 flex items-center gap-4 uppercase italic">Configurações Gerais</h3>
               <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <label className="block">
                      <span className="text-xs font-black text-stone-400 uppercase tracking-widest ml-4 mb-2 block">Nome da Empresa</span>
                      <input type="text" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} className="w-full px-8 py-5 bg-stone-100 rounded-2xl border-none outline-none focus:ring-4 focus:ring-pindorama-green/10 font-bold" />
                    </label>
                    <label className="block">
                      <span className="text-xs font-black text-stone-400 uppercase tracking-widest ml-4 mb-2 block">WhatsApp (Somente Números)</span>
                      <input type="text" value={localSettings.whatsapp} onChange={e => setLocalSettings({...localSettings, whatsapp: e.target.value})} className="w-full px-8 py-5 bg-stone-100 rounded-2xl border-none outline-none focus:ring-4 focus:ring-pindorama-green/10 font-bold" />
                    </label>
                  </div>
                  <div className="bg-stone-50 p-10 rounded-[2.5rem] border border-stone-100 flex flex-col items-center justify-center text-center">
                    <Database size={40} className="text-stone-200 mb-6" />
                    <p className="text-stone-400 text-xs font-medium leading-relaxed italic">As alterações aqui são aplicadas instantaneamente ao rodapé e botões de contato do site após clicar em salvar.</p>
                  </div>
               </div>
               
               <div className="mt-12 pt-12 border-t border-stone-100 flex justify-end">
                  <button 
                    onClick={() => { setIsSaving(true); props.onUpdateSettings(localSettings).then(() => setIsSaving(false)); }}
                    disabled={isSaving}
                    className="bg-pindorama-green text-white px-12 py-5 rounded-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                  >
                    {isSaving ? <RefreshCw className="animate-spin" /> : <Save size={20} />} 
                    SALVAR TODAS AS ALTERAÇÕES
                  </button>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal de confirmação */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-stone-900/90 backdrop-blur-md z-[110] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3.5rem] w-full max-w-md shadow-2xl p-12 text-center">
            <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500 shadow-inner">
               <AlertTriangle size={48} />
            </div>
            <h3 className="text-3xl font-black text-pindorama-green mb-4 leading-tight">Excluir item?</h3>
            <p className="text-stone-500 mb-10 font-medium leading-relaxed italic">Você está removendo "{itemToDelete.name}". Esta ação não pode ser desfeita.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => {
                if (itemToDelete.type === 'product') props.onDeleteProduct(itemToDelete.id);
                setItemToDelete(null);
              }} className="w-full bg-red-500 text-white py-6 rounded-2xl font-black text-lg shadow-xl hover:bg-red-600 transition-all">REMOVER PERMANENTEMENTE</button>
              <button onClick={() => setItemToDelete(null)} className="w-full bg-stone-100 text-stone-400 py-6 rounded-2xl font-black text-lg hover:bg-stone-200 transition-all">VOLTAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;