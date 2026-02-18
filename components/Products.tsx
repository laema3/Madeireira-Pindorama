
import React, { useState, useMemo } from 'react';
import { Product, Category, Subcategory } from '../types';
import { ShoppingCart, Layers, PackageSearch, Tag } from 'lucide-react';

interface ProductsProps {
  products: Product[];
  categories: Category[];
  subcategories: Subcategory[];
  whatsapp: string;
}

const Products: React.FC<ProductsProps> = ({ products, categories, subcategories, whatsapp }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const handleOrder = (productName: string) => {
    const cleanWhatsapp = whatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(`Olá Pindorama, gostaria de um orçamento para: ${productName}.`);
    window.open(`https://wa.me/${cleanWhatsapp}?text=${text}`, '_blank');
  };

  return (
    <section id="produtos" className="py-32 bg-stone-100 bg-wood-grain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-amber-600 font-black uppercase tracking-[0.3em] mb-4">Catálogo Completo</h3>
          <h2 className="text-5xl md:text-7xl font-black text-pindorama-green leading-none uppercase tracking-tighter">Estoque Uberaba</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button onClick={() => setActiveCategory('all')} className={`px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeCategory === 'all' ? 'bg-pindorama-green text-white' : 'bg-white text-pindorama-green'}`}>TODOS</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.name)} className={`px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat.name ? 'bg-pindorama-green text-white' : 'bg-white text-pindorama-green'}`}>{cat.name}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-stone-200 group">
              <div className="h-80 overflow-hidden relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-8 left-8 flex flex-col gap-2 items-start">
                  <div className="bg-amber-600 text-white px-5 py-2 rounded-full font-black uppercase text-[10px] shadow-lg">{p.category}</div>
                  {p.subcategory && (
                    <div className="bg-pindorama-green/90 text-white px-4 py-1.5 rounded-full font-bold uppercase text-[9px] shadow-md flex items-center gap-1.5">
                      <Tag size={10} className="text-amber-400" />
                      {p.subcategory}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-10">
                <h4 className="text-2xl font-black text-pindorama-green mb-4 uppercase">{p.name}</h4>
                <p className="text-stone-500 font-bold mb-8 text-sm leading-relaxed h-20 line-clamp-3">{p.description}</p>
                <div className="pt-8 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-2xl font-black text-amber-700 uppercase">{p.price || 'Sob Consulta'}</span>
                  <button onClick={() => handleOrder(p.name)} className="bg-pindorama-green text-white p-4 rounded-xl hover:bg-black transition-all">
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
