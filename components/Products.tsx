import React, { useState, useMemo } from 'react';
import { Product, Category, Subcategory } from '../types';
import { ShoppingCart, ChevronRight, Layers, PackageSearch } from 'lucide-react';

interface ProductsProps {
  products: Product[];
  categories: Category[];
  subcategories: Subcategory[];
  whatsapp: string;
}

const Products: React.FC<ProductsProps> = ({ products, categories, subcategories, whatsapp }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubcategory, setActiveSubcategory] = useState('all');

  // Identifica categorias que realmente possuem produtos no momento
  const categoriesWithProducts = useMemo(() => {
    const usedNames = new Set(products.map(p => p.category).filter(Boolean));
    return categories.filter(c => usedNames.has(c.name));
  }, [products, categories]);

  // Filtra os produtos. Se "all", mostra todos.
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    
    let filtered = products.filter(p => p.category === activeCategory);
    if (activeSubcategory !== 'all') {
      filtered = filtered.filter(p => p.subcategory === activeSubcategory);
    }
    return filtered;
  }, [products, activeCategory, activeSubcategory]);

  // Subcategorias dinâmicas baseadas na categoria mestra selecionada
  const subcategoriesWithProducts = useMemo(() => {
    if (activeCategory === 'all') return [];
    
    const currentProducts = products.filter(p => p.category === activeCategory);
    const usedSubNames = new Set(currentProducts.map(p => p.subcategory).filter(Boolean));
    
    return subcategories.filter(sub => {
      const parentCat = categories.find(c => c.id === sub.categoryId);
      return parentCat?.name === activeCategory && usedSubNames.has(sub.name);
    });
  }, [products, subcategories, activeCategory, categories]);

  const handleOrder = (productName: string) => {
    const cleanWhatsapp = whatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(`Olá Pindorama, gostaria de um orçamento para: ${productName}.`);
    window.open(`https://wa.me/${cleanWhatsapp}?text=${text}`, '_blank');
  };

  if (products.length === 0) {
    return (
      <section id="produtos" className="py-32 bg-stone-100 bg-wood-grain">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white p-20 rounded-[4rem] shadow-sm border-2 border-dashed border-stone-200 inline-block w-full max-w-2xl">
            <PackageSearch size={64} className="mx-auto text-stone-200 mb-6" />
            <h2 className="text-2xl font-bold text-pindorama-green mb-2 uppercase tracking-tighter italic">Catálogo sob Demanda</h2>
            <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] italic">Nossa equipe de Uberaba está atualizando o estoque digital.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="produtos" className="py-32 bg-stone-100 bg-wood-grain min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-amber-600 font-bold uppercase tracking-widest mb-4 italic">Tradição em Uberaba</h3>
          <h2 className="text-4xl md:text-6xl font-bold text-pindorama-green leading-tight">Nosso Acervo de <br /><span className="text-amber-600 italic font-serif">Madeiras Nobres.</span></h2>
        </div>

        {/* Filtros de Categorias Principais */}
        {categoriesWithProducts.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => { setActiveCategory('all'); setActiveSubcategory('all'); }}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${activeCategory === 'all' ? 'bg-pindorama-green text-white shadow-xl scale-105' : 'bg-white text-pindorama-green border border-stone-200'}`}
            >
              <Layers size={14} /> Todos
            </button>
            {categoriesWithProducts.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.name); setActiveSubcategory('all'); }}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeCategory === cat.name ? 'bg-pindorama-green text-white shadow-xl scale-105' : 'bg-white text-pindorama-green border border-stone-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Filtros de Subcategorias */}
        {activeCategory !== 'all' && subcategoriesWithProducts.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in">
            {subcategoriesWithProducts.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSubcategory(sub.name)}
                className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${activeSubcategory === sub.name ? 'bg-amber-600 border-amber-600 text-white' : 'bg-white border-stone-200 text-stone-500'}`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Grade de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-[3.5rem] overflow-hidden shadow-2xl hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all group flex flex-col hover:-translate-y-3 duration-500 border border-stone-100">
              <div className="h-80 overflow-hidden relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                <div className="absolute top-8 left-8 flex flex-col gap-2">
                   <div className="bg-pindorama-green/90 text-white text-[9px] font-black px-4 py-2 rounded-full backdrop-blur-md uppercase tracking-[0.2em] shadow-lg">{p.category || 'Madeira'}</div>
                   {p.subcategory && (
                      <div className="bg-amber-600/90 text-white text-[8px] font-black px-3 py-1.5 rounded-full backdrop-blur-md uppercase tracking-widest shadow-lg flex items-center gap-2">
                        <ChevronRight size={10} /> {p.subcategory}
                      </div>
                   )}
                </div>
              </div>
              <div className="p-12 flex-1 flex flex-col">
                <h4 className="text-2xl font-bold text-pindorama-green mb-4 leading-tight">{p.name}</h4>
                <p className="text-stone-500 mb-8 line-clamp-3 flex-1 text-sm leading-relaxed font-medium">{p.description}</p>
                <div className="pt-8 border-t border-stone-100 mt-auto flex items-center justify-between">
                  <div>
                    <span className="text-stone-400 text-[9px] font-black uppercase tracking-[0.2em] block mb-1">Cotação Atual</span>
                    <span className="text-xl font-bold text-amber-700 italic">{p.price || 'Sob consulta'}</span>
                  </div>
                  <button onClick={() => handleOrder(p.name)} className="p-5 rounded-2xl bg-pindorama-green text-white hover:bg-black transition-all shadow-xl active:scale-90 group-hover:rotate-6">
                    <ShoppingCart size={22} />
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