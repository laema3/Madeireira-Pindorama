
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, MessageSquare, Settings, LogOut, Plus, Trash2, Edit2, ImageIcon, Briefcase, MapPin, Clock, Phone, Mail, Globe, AlertTriangle, Save, X, ChevronRight, Layers, Tag, Code } from 'lucide-react';
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
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, onDeleteProduct, onUpdateProduct, onAddProduct,
  categories, onAddCategory, onDeleteCategory,
  subcategories, onAddSubcategory, onDeleteSubcategory,
  messages, onDeleteMessage,
  settings, onUpdateSettings,
  banners, onUpdateBanners, onDeleteBanner,
  partners, onAddPartner, onUpdatePartner, onDeletePartner,
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
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
        <div className="p-8 border-b border-white/10">
          <h2 className="text-2xl font-bold uppercase">PAINEL ADM</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-amber-600 shadow-md' : 'hover:bg-white/5'}`}><LayoutDashboard size={20} /> Dashboard</button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'products' ? 'bg-amber-600 shadow-md' : 'hover:bg-white/5'}`}><Package size={20} /> Produtos</button>
          <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'categories' ? 'bg-amber-600 shadow-md' : 'hover:bg-white/5'}`}><Layers size={20} /> Categorias</button>
          <button onClick={() => setActiveTab('banners')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'banners' ? 'bg-amber-600 shadow-md' : 'hover:bg-white/5'}`}><ImageIcon size={20} /> Banners</button>
          <button onClick={() => setActiveTab('partners')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'partners' ? 'bg-amber-600 shadow-md' : 'hover:bg-white/5'}`}><Briefcase size={20} /> Parceiros</button>
          <button onClick={() => setActiveTab('messages')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'messages' ? 'bg-amber-600 shadow-md' : 'hover:bg-white/5'}`}><MessageSquare size={20} /> Mensagens</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'settings' ? 'bg-amber-600 shadow-md' : 'hover:bg-white/5'}`}><Settings size={20} /> Configurações</button>
        </nav>
        <button onClick={onLogout} className="m-4 flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 font-bold"><LogOut size={20} /> Sair</button>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-pindorama-green capitalize">{activeTab}</h1>
          {activeTab === 'products' && <button onClick={() => setEditingProduct({ id: `new-${Date.now()}`, name: '', description: '', category: categories[0]?.id || '', subcategory: '', image: '', price: '' })} className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"><Plus size={18} /> Novo Produto</button>}
          {activeTab === 'categories' && <button onClick={() => setEditingCategory({ id: `new-${Date.now()}`, name: '' })} className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"><Plus size={18} /> Nova Categoria</button>}
          {activeTab === 'partners' && <button onClick={() => setEditingPartner({ id: `new-${Date.now()}`, name: '', logo: '' })} className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"><Plus size={18} /> Novo Parceiro</button>}
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
              <Package className="text-amber-600 mb-4" />
              <p className="text-stone-500 text-sm">Produtos</p>
              <p className="text-3xl font-bold text-pindorama-green">{products.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
              <MessageSquare className="text-amber-600 mb-4" />
              <p className="text-stone-500 text-sm">Mensagens</p>
              <p className="text-3xl font-bold text-pindorama-green">{messages.length}</p>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-200">
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-b">
                <tr><th className="px-6 py-4 font-bold text-stone-600">Produto</th><th className="px-6 py-4 font-bold text-stone-600">Categoria</th><th className="px-6 py-4 font-bold text-stone-600 text-right">Ações</th></tr>
              </thead>
              <tbody className="divide-y">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="px-6 py-4 flex items-center gap-3"><img src={p.image} className="w-10 h-10 rounded-lg object-cover bg-stone-100" /> <span className="font-bold">{p.name}</span></td>
                    <td className="px-6 py-4 text-stone-600">{categories.find(c => c.id === p.category)?.name || p.category}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setEditingProduct(p)} className="p-2 text-stone-400 hover:text-amber-600"><Edit2 size={18} /></button>
                      <button onClick={() => triggerConfirm('Excluir?', `Deseja remover ${p.name}?`, () => onDeleteProduct(p.id))} className="p-2 text-stone-400 hover:text-red-500"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-200 max-w-2xl">
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-b">
                <tr><th className="px-6 py-4 font-bold text-stone-600">Categoria</th><th className="px-6 py-4 font-bold text-stone-600 text-right">Ações</th></tr>
              </thead>
              <tbody className="divide-y">
                {categories.map(c => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 font-bold">{c.name}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => triggerConfirm('Excluir?', `Remover categoria ${c.name}?`, () => onDeleteCategory(c.id))} className="p-2 text-stone-400 hover:text-red-500"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'settings' && (
          <form onSubmit={(e) => { e.preventDefault(); onUpdateSettings(localSettings); alert('Salvo!'); }} className="space-y-6 max-w-4xl">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-3"><Globe className="text-amber-600" /> Informações do Site</h3>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="text-xs font-bold uppercase text-stone-400">Nome</label><input className="w-full p-3 border rounded-xl" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} /></div>
                <div><label className="text-xs font-bold uppercase text-stone-400">WhatsApp</label><input className="w-full p-3 border rounded-xl" value={localSettings.whatsapp} onChange={e => setLocalSettings({...localSettings, whatsapp: e.target.value})} /></div>
                <div className="col-span-2"><label className="text-xs font-bold uppercase text-stone-400">Endereço</label><input className="w-full p-3 border rounded-xl" value={localSettings.address} onChange={e => setLocalSettings({...localSettings, address: e.target.value})} /></div>
              </div>
              <button type="submit" className="w-full bg-pindorama-green text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"><Save size={20} /> Salvar Configurações</button>
            </div>
          </form>
        )}

        {/* Modal de Produto */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
              <div className="bg-pindorama-green p-6 text-white flex justify-between items-center"><h3 className="text-xl font-bold">Gerenciar Produto</h3><button onClick={() => setEditingProduct(null)}><X size={24} /></button></div>
              <form onSubmit={handleSaveProduct} className="p-8 space-y-4">
                <input required placeholder="Nome" className="w-full p-3 border rounded-xl" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                <select className="w-full p-3 border rounded-xl" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <textarea placeholder="Descrição" className="w-full p-3 border rounded-xl h-32" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                <input placeholder="Preço" className="w-full p-3 border rounded-xl" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} />
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-stone-100 rounded-xl overflow-hidden flex items-center justify-center">{editingProduct.image ? <img src={editingProduct.image} className="w-full h-full object-cover" /> : <ImageIcon className="text-stone-300" />}</div>
                  <input type="file" onChange={e => handleImageUpload(e, url => setEditingProduct({...editingProduct, image: url}))} className="text-sm" />
                </div>
                <button type="submit" className="w-full bg-pindorama-green text-white py-4 rounded-xl font-bold shadow-lg">Salvar no Firebase</button>
              </form>
            </div>
          </div>
        )}

        {/* Modal Categoria */}
        {editingCategory && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 space-y-4">
              <h3 className="text-xl font-bold">Nova Categoria</h3>
              <input placeholder="Nome da Categoria" className="w-full p-3 border rounded-xl" value={editingCategory.name} onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} />
              <div className="flex gap-3">
                <button onClick={() => setEditingCategory(null)} className="flex-1 py-3 border rounded-xl">Cancelar</button>
                <button onClick={() => { onAddCategory(editingCategory); setEditingCategory(null); }} className="flex-1 py-3 bg-pindorama-green text-white rounded-xl font-bold">Adicionar</button>
              </div>
            </div>
          </div>
        )}

        {confirmDialog?.isOpen && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center space-y-6">
              <AlertTriangle size={48} className="mx-auto text-red-500" />
              <div><h3 className="text-2xl font-bold">{confirmDialog.title}</h3><p className="text-stone-500">{confirmDialog.message}</p></div>
              <div className="flex gap-3"><button onClick={() => setConfirmDialog(null)} className="flex-1 py-3 border rounded-xl">Sair</button><button onClick={confirmDialog.onConfirm} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Confirmar</button></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
