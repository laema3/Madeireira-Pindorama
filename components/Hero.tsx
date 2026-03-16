
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroProps {
  images: string[];
  settings: SiteSettings;
}

const Hero: React.FC<HeroProps> = ({ images, settings }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  if (!images || images.length === 0) return null;

  return (
    <section id="inicio" className="relative h-screen w-full overflow-hidden bg-pindorama-green">
      {images.map((img, index) => (
        <div
          key={img + index}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === current ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
        >
          {/* A classe hero-overlay agora é mais transparente no centro */}
          <div className="absolute inset-0 hero-overlay z-10" />
          <img src={img} alt="Pindorama Background" className="w-full h-full object-cover" />
        </div>
      ))}

      <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-5xl">
          <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 text-amber-400 px-8 py-3 rounded-full mb-8 animate-fade-in">
            <Award className="w-5 h-5" />
            <span className="text-sm font-black uppercase tracking-[0.3em]">Qualidade Pindorama desde 1979</span>
          </div>
          
          <h1 className="text-white text-6xl md:text-9xl font-black mb-8 leading-tight uppercase tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            A Nobreza da <br />
            <span className="text-amber-500">Madeira Real</span>
          </h1>
          
          <p className="text-white text-xl md:text-3xl mb-12 max-w-4xl mx-auto font-bold leading-relaxed uppercase tracking-wide drop-shadow-lg">
            Referência em Uberaba há mais de 45 anos fornecendo as melhores soluções em madeiras nobres e sustentáveis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="#produtos" className="bg-amber-600 text-white px-12 py-6 rounded-2xl font-black text-lg hover:bg-amber-700 transition-all shadow-2xl uppercase tracking-widest">Ver Estoque</a>
            <a href="#empresa" className="bg-black/40 backdrop-blur-md border border-white/20 text-white px-12 py-6 rounded-2xl font-black text-lg hover:bg-black/60 transition-all uppercase tracking-widest">Nossa Empresa</a>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-4">
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all duration-500 ${i === current ? 'bg-amber-500 w-20' : 'bg-white/40 w-8'}`} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;