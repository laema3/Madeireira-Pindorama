
import React, { useState, useMemo } from 'react';
import { Product, Category, Subcategory } from '../types';
import { ShoppingCart, ChevronRight, Layers } from 'lucide-react';

interface ProductsProps {
  products: Product[];
  categories: Category[];
  subcategories: Subcategory[];
  whatsapp: string;
}

const Products: React.FC<ProductsProps> = ({ products, categories, subcategories, whatsapp }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubcategory, setActiveSubcategory] = useState('all');

  // 1. Identifica quais nomes de categorias possuem ao menos um produto
  const categoriesWithProducts = useMemo(() => {
    const names = new Set(products.map(p => p.category));
    return categories.filter(c => names.has(c.name));
  }, [products, categories]);

  // 2. Identifica subcategorias que possuem produtos dentro da categoria ativa
  const subcategoriesWithProducts = useMemo(() => {
    if (activeCategory === 'all') return [];
    
    // Nomes das subcategorias usadas nos produtos da categoria atual
    const usedSubNames = new Set(
      products
        .filter(p => p.category === activeCategory)
        .map(p => p.subcategory)
    );

    // Retorna as subcategorias que pertencem à categoria mãe e estão sendo usadas
    return subcategories.filter(sub => {
      const parentCat = categories.find(c => c.id === sub.categoryId);
      return parentCat?.name === activeCategory && usedSubNames.has(sub.name);
    });
  }, [products, subcategories, activeCategory, categories]);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
      if (activeSubcategory !== 'all') {
        filtered = filtered.filter(p => p.subcategory === activeSubcategory);
      }
    }
    return filtered;
  }, [products, activeCategory, activeSubcategory]);

  const handleOrder = (productName: string) => {
    const text = encodeURIComponent(`Olá Pindorama, gostaria de solicitar um orçamento para: ${productName}.`);
    window.open(`https://wa.me/${whatsapp}?text=${text}`, '_blank');
  };

  const handleCategoryChange = (catName: string) => {
    setActiveCategory(catName);
    setActiveSubcategory('all');
  };

  // Se não houver nenhum produto no site, exibe um estado vazio elegante
  if (products.length === 0) {
    return (
      <section id="produtos" className="py-24 bg-stone-100 bg-wood-grain">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-pindorama-green mb-6">Nossos Produtos</h2>
          <div className="bg-white p-20 rounded-[3rem] border-4 border-dashed border-stone-200">
            <p className="text-stone-400 font-bold uppercase tracking-widest italic">Estamos atualizando nosso estoque. Em breve novidades!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="produtos" className="py-24 bg-stone-100 bg-wood-grain min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-amber-600 font-bold uppercase tracking-widest mb-4">Catálogo de Madeiras</h3>
          <h2 className="text-4xl md:text-5xl font-bold text-pindorama-green font-serif italic">Qualidade em cada fibra</h2>
        </div>

        {/* Filtro de Categorias Mãe */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-tighter transition-all flex items-center gap-2 ${
              activeCategory === 'all' 
                ? 'bg-pindorama-green text-white shadow-xl scale-105' 
                : 'bg-white text-pindorama-green hover:bg-stone-200 border border-stone-200'
            }`}
          >
            <Layers size={14} /> Todos
          </button>
          
          {categoriesWithProducts.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.name)}
              className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-tighter transition-all ${
                activeCategory === cat.name 
                  ? 'bg-pindorama-green text-white shadow-xl scale-105' 
                  : 'bg-white text-pindorama-green hover:bg-stone-200 border border-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filtro de Subcategorias (Ex: Angelim Vermelho) */}
        {activeCategory !== 'all' && subcategoriesWithProducts.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in">
             <button
              onClick={() => setActiveSubcategory('all')}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all border ${
                activeSubcategory === 'all' 
                  ? 'bg-amber-600 border-amber-600 text-white shadow-md' 
                  : 'bg-white border-stone-200 text-stone-500 hover:border-amber-500'
              }`}
            >
              Ver Todas as Variedades
            </button>
            {subcategoriesWithProducts.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSubcategory(sub.name)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all border ${
                  activeSubcategory === sub.name 
                    ? 'bg-amber-600 border-amber-600 text-white shadow-md' 
                    : 'bg-white border-stone-200 text-stone-500 hover:border-amber-500'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all group border border-stone-100 flex flex-col hover:-translate-y-2">
              <div className="h-72 overflow-hidden relative">
                <img 
                  src={p.image || 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=600'} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                   <div className="bg-pindorama-green text-white text-[9px] font-black px-4 py-2 rounded-full shadow-lg backdrop-blur-md uppercase tracking-wider">
                    {p.category}
                  </div>
                  {p.subcategory && (
                    <div className="bg-amber-600 text-white text-[8px] font-black px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md uppercase tracking-wider flex items-center gap-1 self-start">
                      <ChevronRight size={10} /> {p.subcategory}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-10 flex-1 flex flex-col">
                <h4 className="text-2xl font-bold text-pindorama-green mb-4">{p.name}</h4>
                <p className="text-stone-500 mb-8 line-clamp-3 flex-1 text-sm leading-relaxed">{p.description}</p>
                
                <div className="pt-6 border-t border-stone-100 mt-auto flex items-center justify-between">
                  <div>
                    <span className="text-stone-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Preço Sugerido</span>
                    <span className="text-xl font-bold text-amber-700">{p.price || 'Sob consulta'}</span>
                  </div>
                  <button 
                    onClick={() => handleOrder(p.name)}
                    className="p-4 rounded-2xl bg-pindorama-green text-white hover:bg-black transition-all shadow-lg active:scale-90"
                  >
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
