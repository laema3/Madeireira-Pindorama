
import React from 'react';
import { Partner } from '../types';

interface PartnersProps {
  partners: Partner[];
}

const Partners: React.FC<PartnersProps> = ({ partners }) => {
  return (
    <section id="parceiros" className="py-20 bg-white border-y border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-sm font-bold text-stone-400 uppercase tracking-[0.3em] mb-12">Nossas Marcas Parceiras</h3>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all">
          {partners.map((partner) => (
            <div key={partner.id} className="flex flex-col items-center">
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="h-12 md:h-16 w-auto object-contain mb-2"
              />
              <span className="text-[10px] font-bold text-stone-300 uppercase">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
