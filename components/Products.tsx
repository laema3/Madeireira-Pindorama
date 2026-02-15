
import React, { useState } from 'react';
import { Product, Category } from '../types';
import { ShoppingCart, Info } from 'lucide-react';

interface ProductsProps {
  products: Product[];
  categories: Category[];
}

const Products: React.FC<ProductsProps> = ({ products, categories }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const displayCategories = [{ id: 'all', name: 'Todos' }, ...categories];

  return (
    <section id="produtos" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-amber-600 font-bold uppercase tracking-widest mb-4">Nosso Portfólio</h3>
          <h2 className="text-4xl md:text-5xl font-bold text-pindorama-green">Produtos de Excelência</h2>
          <p className="mt-4 text-stone-500 max-w-2xl mx-auto">
            Explore nossas opções de madeiras brutas, aparelhadas e decorativas.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {displayCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat.id 
                  ? 'bg-pindorama-green text-white shadow-lg' 
                  : 'bg-white text-pindorama-green hover:bg-stone-200 shadow-sm'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all group border border-stone-200 flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={p.image || 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=600'} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {categories.find(c => c.id === p.category)?.name || p.category}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h4 className="text-2xl font-bold text-pindorama-green mb-3">{p.name}</h4>
                {p.subcategory && (
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2 block">{p.subcategory}</span>
                )}
                <p className="text-stone-500 mb-6 line-clamp-2 flex-1">{p.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-bold text-amber-700">{p.price || 'Preço sob consulta'}</span>
                  <div className="flex gap-2">
                    <button className="p-3 rounded-full bg-stone-100 text-pindorama-green hover:bg-amber-600 hover:text-white transition-colors">
                      <Info size={20} />
                    </button>
                    <button className="p-3 rounded-full bg-pindorama-green text-white hover:bg-green-800 transition-colors shadow-lg">
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-stone-500 mb-6 italic">Não encontrou o que procurava? Fazemos cortes especiais sob medida.</p>
          <a 
            href="#contato" 
            className="inline-flex items-center gap-2 bg-pindorama-brown text-white px-10 py-4 rounded-full font-bold hover:bg-stone-800 transition-all shadow-xl"
          >
            Solicitar Orçamento Personalizado
          </a>
        </div>
      </div>
    </section>
  );
};

export default Products;
