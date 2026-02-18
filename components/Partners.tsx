
import React from 'react';
import { Partner } from '../types';

interface PartnersProps {
  partners: Partner[];
}

const Partners: React.FC<PartnersProps> = ({ partners }) => {
  return (
    <section id="parceiros" className="py-24 bg-white border-y border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-sm font-black text-stone-400 uppercase tracking-[0.4em] mb-16">Marcas que Confiam na Nossa Madeira</h3>
        <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32 transition-all">
          {partners.map((partner) => (
            <div key={partner.id} className="flex flex-col items-center group">
              <div className="h-24 md:h-32 flex items-center justify-center mb-4 grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="h-full w-auto object-contain"
                />
              </div>
              <span className="text-xs font-black text-stone-800 uppercase tracking-widest">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
