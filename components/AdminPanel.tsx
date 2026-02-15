import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, Settings, LogOut, Plus, Trash2, Edit2, 
  ImageIcon, Save, X, Database, RefreshCw, Key, ShieldCheck, Tag, AlertTriangle
} from 'lucide-react';
import { Product, SiteSettings, Category } from '../types';

interface AdminPanelProps {
  products: Product[];
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateProduct: (product: Product) => Promise<void>;
  onAddProduct: (product: Product) => Promise<void>;
  categories: Category[];
  onAddCategory: (category: { name: string }) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => Promise<void>;
  dbStatus: 'online' | 'offline';
  onSeedData: () => void;
  onLogout: () => void;
}

type DeleteType = 'product' | 'category';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, onDeleteProduct, onUpdateProduct, onAddProduct,
  categories, onAddCategory, onDeleteCategory,
  settings, onUpdateSettings,
  dbStatus, onSeedData, onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'settings'>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  // Custom Confirmation Modal State
  const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string, type: DeleteType } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'pindorama1979') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setIsSaving(true);
      try {
        if (editingProduct.id.startsWith('new-')) {
          await onAddProduct(editingProduct);
        } else {
          await onUpdateProduct(editingProduct);
        }
        setEditingProduct(null);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsSaving(true);
    try {
      await onAddCategory({ name: newCategoryName });
      setNewCategoryName('');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsSaving(true);
    try {
      if (itemToDelete.type === 'product') {
        await onDeleteProduct(itemToDelete.id);
      } else {
        await onDeleteCategory(itemToDelete.id);
      }
      setItemToDelete(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateSettings(localSettings);
      alert('Configurações salvas!');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pindorama-green p-4">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center">
          <div className="bg-amber-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="text-pindorama-green w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-pindorama-green mb-2">Painel de Controle</h2>
          <p className="text-stone-400 mb-8 font-medium">Acesso restrito à administração</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input 
                type="password" 
                placeholder="Senha de acesso"
                className={`w-full pl-14 pr-6 py-5 bg-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all font-bold ${loginError ? 'ring-2 ring-red-500' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {loginError && <p className="text-red-500 text-xs font-bold">Senha incorreta. Tente novamente.</p>}
            <button type="submit" className="w-full bg-pindorama-green text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-green-900 transition-all active:scale-95">
              Entrar no Sistema
            </button>
          </form>
          <button onClick={onLogout} className="mt-8 text-stone-400 hover:text-pindorama-green font-bold text-sm underline">Voltar para o site</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      <aside className="w-72 bg-pindorama-green text-white flex flex-col shrink-0">
        <div className="p-10 border-b border-white/10">
          <h2 className="text-2xl font-bold tracking-tighter">PINDORAMA</h2>
          <div className="flex items-center gap-2 mt-2 opacity-50">
            <div className={`w-2 h-2 rounded-full ${dbStatus === 'online' ? 'bg-green-400' : 'bg-red-500'}`}></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{dbStatus === 'online' ? 'Supabase Online' : 'Database Error'}</span>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-3">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === 'dashboard' ? 'bg-amber-600 shadow-lg translate-x-1' : 'hover:bg-white/5'}`}>
            <LayoutDashboard size={22} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === 'products' ? 'bg-amber-600 shadow-lg translate-x-1' : 'hover:bg-white/5'}`}>
            <Package size={22} /> Produtos
          </button>
          <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === 'categories' ? 'bg-amber-600 shadow-lg translate-x-1' : 'hover:bg-white/5'}`}>
            <Tag size={22} /> Categorias
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === 'settings' ? 'bg-amber-600 shadow-lg translate-x-1' : 'hover:bg-white/5'}`}>
            <Settings size={22} /> Configurações
          </button>
        </nav>
        
        <button onClick={onLogout} className="m-6 p-6 rounded-3xl bg-white/5 hover:bg-red-500/10 text-red-400 font-bold transition-all flex items-center justify-center gap-3">
          <LogOut size={20} /> Sair do Painel
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-wood-grain">
        <header className="flex justify-between items-center mb-12">
          <div>
             <h1 className="text-4xl font-bold text-pindorama-green capitalize">{activeTab}</h1>
             <p className="text-stone-400 font-medium mt-1">Gestão de dados em tempo real</p>
          </div>
          {activeTab === 'products' && (
            <button 
              onClick={() => setEditingProduct({ id: `new-${Date.now()}`, name: '', description: '', category: categories[0]?.id || '', image: '', price: '' })}
              className="bg-pindorama-green text-white px-8 py-4 rounded-2xl flex items-center gap-3 shadow-xl hover:bg-green-900 transition-all active:scale-95"
            >
              <Plus size={20} /> Adicionar Produto
            </button>
          )}
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-200">
                <div className="bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-amber-600"><Package size={28} /></div>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">Produtos Ativos</p>
                <p className="text-5xl font-black text-pindorama-green">{products.length}</p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-200">
                <div className="bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-amber-600"><Tag size={28} /></div>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">Categorias</p>
                <p className="text-5xl font-black text-pindorama-green">{categories.length}</p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-200">
                <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-green-600"><Database size={28} /></div>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">Banco de Dados</p>
                <p className="text-3xl font-black text-green-600">Online</p>
              </div>
            </div>

            <div className="bg-amber-600 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
               <div className="max-w-xl">
                  <h3 className="text-3xl font-bold mb-4 italic font-serif">Sincronizar Dados</h3>
                  <p className="text-white/80 font-medium text-lg leading-relaxed">Se seu banco Supabase estiver vazio, carregue o catálogo inicial agora.</p>
               </div>
               <button onClick={onSeedData} className="bg-white text-pindorama-green px-12 py-6 rounded-2xl font-bold shadow-2xl hover:bg-stone-100 transition-all flex items-center gap-4 text-xl active:scale-95">
                 <RefreshCw size={24} /> Carregar Catálogo
               </button>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-stone-200">
            <table className="w-full text-left">
              <thead className="bg-stone-50/50 border-b border-stone-100">
                <tr>
                  <th className="px-10 py-6 font-bold text-stone-400 text-[10px] uppercase tracking-[0.2em]">Item</th>
                  <th className="px-10 py-6 font-bold text-stone-400 text-[10px] uppercase tracking-[0.2em]">Categoria</th>
                  <th className="px-10 py-6 font-bold text-stone-400 text-[10px] uppercase tracking-[0.2em] text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-stone-50/30 transition-colors group">
                    <td className="px-10 py-6 flex items-center gap-6">
                       <img src={p.image} className="w-16 h-16 rounded-2xl object-cover shadow-sm bg-stone-100" /> 
                       <div>
                          <p className="font-bold text-pindorama-green text-lg">{p.name}</p>
                          <p className="text-stone-400 text-sm">{p.price || 'Sob consulta'}</p>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                       <span className="bg-stone-100 text-stone-500 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest">{categories.find(c => c.id === p.category)?.name || p.category}</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingProduct(p)} className="p-4 text-stone-400 hover:bg-amber-100 hover:text-amber-600 rounded-2xl transition-all"><Edit2 size={20} /></button>
                        <button onClick={() => setItemToDelete({ id: p.id, name: p.name, type: 'product' })} className="p-4 text-stone-400 hover:bg-red-100 hover:text-red-500 rounded-2xl transition-all"><Trash2 size={20} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-10">
            <div className="max-w-md bg-white p-8 rounded-[2rem] shadow-sm border border-stone-200">
              <h3 className="font-bold text-pindorama-green mb-6 flex items-center gap-3"><Plus size={20} className="text-amber-600" /> Nova Categoria</h3>
              <form onSubmit={handleAddCategory} className="flex gap-4">
                <input required className="flex-1 p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="Nome da categoria..." value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
                <button type="submit" disabled={isSaving} className="bg-pindorama-green text-white p-4 rounded-xl shadow-lg hover:bg-green-900 transition-all">
                  {isSaving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-stone-200">
              <table className="w-full text-left">
                <thead className="bg-stone-50/50 border-b border-stone-100">
                  <tr>
                    <th className="px-10 py-6 font-bold text-stone-400 text-[10px] uppercase tracking-[0.2em]">ID da Categoria</th>
                    <th className="px-10 py-6 font-bold text-stone-400 text-[10px] uppercase tracking-[0.2em]">Nome</th>
                    <th className="px-10 py-6 font-bold text-stone-400 text-[10px] uppercase tracking-[0.2em] text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {categories.map(c => (
                    <tr key={c.id} className="hover:bg-stone-50/30 transition-colors group">
                      <td className="px-10 py-6 font-mono text-xs text-stone-400 uppercase">{c.id}</td>
                      <td className="px-10 py-6 font-bold text-pindorama-green text-lg">{c.name}</td>
                      <td className="px-10 py-6 text-right">
                        <button onClick={() => setItemToDelete({ id: c.id, name: c.name, type: 'category' })} className="p-4 text-stone-400 hover:bg-red-100 hover:text-red-500 rounded-2xl transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl bg-white rounded-[3rem] shadow-xl p-12 border border-stone-200">
            <h3 className="text-2xl font-bold text-pindorama-green mb-10 flex items-center gap-3"><Settings className="text-amber-600" /> Informações da Empresa</h3>
            <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Nome Fantasia</label>
                  <input className="w-full p-5 bg-stone-50 rounded-2xl border border-stone-100 outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">WhatsApp (com DDD)</label>
                  <input className="w-full p-5 bg-stone-50 rounded-2xl border border-stone-100 outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium" value={localSettings.whatsapp} onChange={e => setLocalSettings({...localSettings, whatsapp: e.target.value})} />
               </div>
               <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Endereço Completo</label>
                  <input className="w-full p-5 bg-stone-50 rounded-2xl border border-stone-100 outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium" value={localSettings.address} onChange={e => setLocalSettings({...localSettings, address: e.target.value})} />
               </div>
               <button type="submit" disabled={isSaving} className="md:col-span-2 bg-pindorama-green text-white py-6 rounded-2xl font-bold shadow-xl hover:bg-green-900 transition-all flex items-center justify-center gap-4 text-lg mt-4">
                  {isSaving ? <RefreshCw className="animate-spin" /> : <Save />} 
                  {isSaving ? 'Salvando...' : 'Salvar Configurações'}
               </button>
            </form>
          </div>
        )}

        {/* Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="bg-pindorama-green p-10 text-white flex justify-between items-center">
                <h3 className="text-3xl font-bold italic font-serif">Configurar Produto</h3>
                <button onClick={() => setEditingProduct(null)} className="hover:bg-white/10 p-3 rounded-full transition-colors"><X size={24} /></button>
              </div>
              <form onSubmit={handleSaveProduct} className="p-10 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Nome do Produto</label>
                   <input required className="w-full p-5 bg-stone-50 border-stone-100 border rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all font-medium text-lg" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Categoria</label>
                      <select className="w-full p-5 bg-stone-50 border-stone-100 border rounded-2xl font-medium" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Preço Sugerido</label>
                      <input className="w-full p-5 bg-stone-50 border-stone-100 border rounded-2xl font-medium" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} placeholder="Ex: R$ 85,00/m" />
                   </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Descrição</label>
                  <textarea placeholder="Características da madeira..." className="w-full p-5 bg-stone-50 border-stone-100 border rounded-2xl h-32 outline-none focus:ring-2 focus:ring-amber-500 font-medium" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                </div>
                
                <div className="flex items-center gap-8 p-6 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
                  <div className="w-32 h-32 bg-white rounded-2xl overflow-hidden shadow-inner flex items-center justify-center shrink-0 border border-stone-100">
                    {editingProduct.image ? <img src={editingProduct.image} className="w-full h-full object-cover" /> : <ImageIcon size={40} className="text-stone-300" />}
                  </div>
                  <div className="space-y-3">
                     <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Foto do Produto</p>
                     <input type="file" onChange={e => handleImageUpload(e, url => setEditingProduct({...editingProduct, image: url}))} className="text-xs block w-full text-stone-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-pindorama-green file:text-white hover:file:bg-green-900 cursor-pointer" />
                  </div>
                </div>

                <button type="submit" disabled={isSaving} className="w-full bg-amber-600 text-white py-6 rounded-2xl font-bold shadow-2xl hover:bg-amber-700 transition-all text-xl flex items-center justify-center gap-4 mt-4">
                  {isSaving ? <RefreshCw className="animate-spin" /> : <Save />}
                  {isSaving ? 'Salvando...' : 'Salvar Produto'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Custom Confirmation Modal */}
        {itemToDelete && (
          <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-md z-[60] flex items-center justify-center p-6">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200 text-center p-10">
              <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500">
                <AlertTriangle size={48} />
              </div>
              <h3 className="text-2xl font-bold text-pindorama-green mb-4">Tem certeza absoluta?</h3>
              <p className="text-stone-500 mb-10 leading-relaxed font-medium">
                Você está prestes a excluir <strong className="text-red-500">"{itemToDelete.name}"</strong>. 
                Esta ação não pode ser desfeita no banco de dados.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleConfirmDelete} 
                  disabled={isSaving}
                  className="w-full bg-red-500 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-red-600 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  {isSaving ? <RefreshCw className="animate-spin" size={20} /> : <Trash2 size={20} />}
                  {isSaving ? 'Excluindo...' : 'Sim, excluir agora'}
                </button>
                <button 
                  onClick={() => setItemToDelete(null)} 
                  disabled={isSaving}
                  className="w-full bg-stone-100 text-stone-500 py-5 rounded-2xl font-bold hover:bg-stone-200 transition-all active:scale-95"
                >
                  Cancelar e manter
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;