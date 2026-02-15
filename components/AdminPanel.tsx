
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, MessageSquare, Settings, LogOut, Plus, Trash2, Edit2, ImageIcon, Briefcase, MapPin, Clock, Phone, Mail, Globe, AlertTriangle, Save, X, ChevronRight, Layers, Tag, Code, Database, RefreshCw } from 'lucide-react';
import { Product, Partner, SiteSettings, Category, Subcategory } from '../types';

interface AdminPanelProps {
  products: Product[];
  onDeleteProduct: (id: string) => void;
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  subcategories: Subcategory[];
  onAddSubcategory: (subcategory: Subcategory) => void;
  onDeleteSubcategory: (id: string) => void;
  messages: any[];
  onDeleteMessage: (id: string) => void;
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
  banners: string[];
  onUpdateBanners: (banners: string[]) => void;
  onDeleteBanner: (index: number) => void;
  partners: Partner[];
  onAddPartner: (partner: Partner) => void;
  onUpdatePartner: (partner: Partner) => void;
  onDeletePartner: (id: string) => void;
  onLogout: () => void;
  dbStatus: 'online' | 'offline';
  onSeedData: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, onDeleteProduct, onUpdateProduct, onAddProduct,
  categories, onAddCategory, onDeleteCategory,
  subcategories, onAddSubcategory, onDeleteSubcategory,
  messages, onDeleteMessage,
  settings, onUpdateSettings,
  banners, onUpdateBanners, onDeleteBanner,
  partners, onAddPartner, onUpdatePartner, onDeletePartner,
  onLogout, dbStatus, onSeedData
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean, title: string, message: string, onConfirm: () => void } | null>(null);

  useEffect(() => setLocalSettings(settings), [settings]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      editingProduct.id.startsWith('new-') ? onAddProduct(editingProduct) : onUpdateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  const triggerConfirm = (title: string, message: string, action: () => void) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm: () => { action(); setConfirmDialog(null); } });
  };

  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden font-sans">
      <aside className="w-64 bg-pindorama-green text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/10 text-center">
          <h2 className="text-xl font-bold uppercase mb-2">PINDORAMA</h2>
          <div className="flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${dbStatus === 'online' ? 'bg-green-400' : 'bg-red-500 animate-pulse'}`}></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{dbStatus === 'online' ? 'Firebase Online' : 'Modo Local'}</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-amber-600 shadow-md translate-x-1' : 'hover:bg-white/5'}`}><LayoutDashboard size={20} /> Dashboard</button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'products' ? 'bg-amber-600 shadow-md translate-x-1' : 'hover:bg-white/5'}`}><Package size={20} /> Produtos</button>
          <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'categories' ? 'bg-amber-600 shadow-md translate-x-1' : 'hover:bg-white/5'}`}><Layers size={20} /> Categorias</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-amber-600 shadow-md translate-x-1' : 'hover:bg-white/5'}`}><Settings size={20} /> Configurações</button>
        </nav>
        <button onClick={onLogout} className="m-4 flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 font-bold transition-colors"><LogOut size={20} /> Sair</button>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-10 pb-6 border-b border-stone-200">
          <div>
             <h1 className="text-3xl font-bold text-pindorama-green capitalize">{activeTab}</h1>
             <p className="text-stone-400 text-sm mt-1">Gerencie o conteúdo do site da Madeireira Pindorama.</p>
          </div>
          <div className="flex gap-4">
            {activeTab === 'products' && <button onClick={() => setEditingProduct({ id: `new-${Date.now()}`, name: '', description: '', category: categories[0]?.id || '', subcategory: '', image: '', price: '' })} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition-all"><Plus size={18} /> Novo Produto</button>}
            {activeTab === 'categories' && <button onClick={() => setEditingCategory({ id: `new-${Date.now()}`, name: '' })} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition-all"><Plus size={18} /> Nova Categoria</button>}
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
                <div className="bg-amber-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4"><Package className="text-amber-600" /></div>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-wider">Total de Produtos</p>
                <p className="text-4xl font-bold text-pindorama-green mt-1">{products.length}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
                <div className="bg-green-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4"><Database className="text-green-600" /></div>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-wider">Status Conexão</p>
                <div className="flex items-center gap-2 mt-1">
                   <p className={`text-2xl font-bold ${dbStatus === 'online' ? 'text-green-600' : 'text-red-500'}`}>{dbStatus === 'online' ? 'Conectado' : 'Offline'}</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-800 mb-2">Teste de Conexão (Primeira Carga)</h3>
                  <p className="text-amber-700/80">Se você acabou de configurar as chaves, clique no botão ao lado para enviar os produtos iniciais de teste para o seu Firebase e confirmar que tudo funciona.</p>
               </div>
               <button 
                  onClick={onSeedData}
                  className="bg-amber-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-amber-700 transition-all flex items-center gap-3 whitespace-nowrap"
               >
                 <RefreshCw size={20} /> Carregar Dados Iniciais
               </button>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-stone-200">
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-b">
                <tr><th className="px-8 py-5 font-bold text-stone-600 text-sm uppercase tracking-wider">Produto</th><th className="px-8 py-5 font-bold text-stone-600 text-sm uppercase tracking-wider">Categoria</th><th className="px-8 py-5 font-bold text-stone-600 text-sm uppercase tracking-wider text-right">Ações</th></tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-8 py-4 flex items-center gap-4">
                       <img src={p.image} className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-200" /> 
                       <div>
                          <p className="font-bold text-pindorama-green">{p.name}</p>
                          <p className="text-xs text-stone-400">{p.price || 'Sob consulta'}</p>
                       </div>
                    </td>
                    <td className="px-8 py-4">
                       <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-bold uppercase">{categories.find(c => c.id === p.category)?.name || p.category}</span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingProduct(p)} className="p-2.5 text-stone-400 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-all"><Edit2 size={18} /></button>
                        <button onClick={() => triggerConfirm('Excluir?', `Deseja remover ${p.name}?`, () => onDeleteProduct(p.id))} className="p-2.5 text-stone-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ... (Modal de Produto permanece similar, mas com feedback visual melhor) */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-white/20">
              <div className="bg-pindorama-green p-8 text-white flex justify-between items-center"><h3 className="text-2xl font-bold">Configurar Produto</h3><button onClick={() => setEditingProduct(null)} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={24} /></button></div>
              <form onSubmit={handleSaveProduct} className="p-8 space-y-5">
                <div className="space-y-1">
                   <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Nome do Produto</label>
                   <input required className="w-full p-4 bg-stone-50 border-stone-200 border rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Categoria</label>
                      <select className="w-full p-4 bg-stone-50 border-stone-200 border rounded-2xl" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Preço/Unidade</label>
                      <input className="w-full p-4 bg-stone-50 border-stone-200 border rounded-2xl" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} placeholder="R$ 0,00" />
                   </div>
                </div>
                <textarea placeholder="Fale sobre as características desta madeira..." className="w-full p-4 bg-stone-50 border-stone-200 border rounded-2xl h-32" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                <div className="flex items-center gap-6 p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
                  <div className="w-24 h-24 bg-white rounded-xl overflow-hidden shadow-inner flex items-center justify-center shrink-0 border border-stone-200">{editingProduct.image ? <img src={editingProduct.image} className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-stone-300" />}</div>
                  <div className="space-y-2">
                     <p className="text-xs font-bold text-stone-500 uppercase">Foto do Produto</p>
                     <input type="file" onChange={e => handleImageUpload(e, url => setEditingProduct({...editingProduct, image: url}))} className="text-xs block w-full text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-pindorama-green text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-green-900 transition-all text-lg flex items-center justify-center gap-3">
                  <Save size={20} /> Salvar no Firestore
                </button>
              </form>
            </div>
          </div>
        )}

        {confirmDialog?.isOpen && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] w-full max-w-sm p-10 text-center space-y-6 shadow-2xl">
              <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-100"><AlertTriangle size={40} className="text-red-500" /></div>
              <div><h3 className="text-2xl font-bold text-stone-900">{confirmDialog.title}</h3><p className="text-stone-500 mt-2">{confirmDialog.message}</p></div>
              <div className="flex gap-4 pt-2"><button onClick={() => setConfirmDialog(null)} className="flex-1 py-4 border-2 border-stone-100 rounded-2xl font-bold text-stone-400 hover:bg-stone-50 transition-colors">Voltar</button><button onClick={confirmDialog.onConfirm} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all">Remover</button></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
