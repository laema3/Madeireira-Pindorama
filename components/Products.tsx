import React, { useState } from 'react';
import { Product, Category } from '../types';
// Fixed: Removed non-existent 'WhatsApp' and unused 'Info' icons from lucide-react
import { ShoppingCart } from 'lucide-react';

interface ProductsProps {
  products: Product[];
  categories: Category[];
  whatsapp: string;
}

const Products: React.FC<ProductsProps> = ({ products, categories, whatsapp }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const displayCategories = [{ id: 'all', name: 'Todos' }, ...categories];

  const handleOrder = (productName: string) => {
    const text = encodeURIComponent(`Olá, gostaria de solicitar um orçamento para: ${productName}. Vi no site de vocês.`);
    window.open(`https://wa.me/${whatsapp}?text=${text}`, '_blank');
  };

  return (
    <section id="produtos" className="py-24 bg-stone-100 bg-wood-grain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-amber-600 font-bold uppercase tracking-widest mb-4">Nosso Portfólio</h3>
          <h2 className="text-4xl md:text-5xl font-bold text-pindorama-green">Produtos de Excelência</h2>
          <p className="mt-6 text-stone-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Trabalhamos com madeiras certificadas, secas e selecionadas para garantir que sua obra tenha o acabamento que você merece.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {displayCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-8 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeCategory === cat.id 
                  ? 'bg-pindorama-green text-white shadow-[0_10px_20px_rgba(13,44,37,0.3)]' 
                  : 'bg-white text-pindorama-green hover:bg-stone-200 border border-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all group border border-stone-100 flex flex-col hover:-translate-y-2">
              <div className="h-72 overflow-hidden relative">
                <img 
                  src={p.image || 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=600'} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 right-6 bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-md">
                  {categories.find(c => c.id === p.category)?.name || p.category}
                </div>
              </div>
              <div className="p-10 flex-1 flex flex-col">
                <h4 className="text-2xl font-bold text-pindorama-green mb-4">{p.name}</h4>
                {p.subcategory && (
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3 block">{p.subcategory}</span>
                )}
                <p className="text-stone-500 mb-8 line-clamp-3 flex-1 text-sm leading-relaxed">{p.description}</p>
                
                <div className="pt-6 border-t border-stone-100 mt-auto flex items-center justify-between">
                  <div>
                    <span className="text-stone-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Preço Sugerido</span>
                    <span className="text-2xl font-bold text-amber-700">{p.price || 'Sob consulta'}</span>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleOrder(p.name)}
                      className="p-4 rounded-2xl bg-pindorama-green text-white hover:bg-green-800 transition-all shadow-lg hover:shadow-green-900/20 active:scale-90"
                      title="Solicitar via WhatsApp"
                    >
                      <ShoppingCart size={22} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 bg-pindorama-green rounded-[3rem] text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <h4 className="text-3xl font-bold mb-4">Medidas Especiais?</h4>
            <p className="text-stone-300 mb-8 max-w-xl mx-auto italic">Possuímos maquinário próprio para cortes sob medida e aparelhamento especializado. Traga seu projeto!</p>
            <a 
              href={`https://wa.me/${whatsapp}`} 
              target="_blank"
              className="inline-flex items-center gap-3 bg-amber-600 text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-amber-700 transition-all shadow-2xl hover:scale-105"
            >
              Falar com Técnico no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;