import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Award } from 'lucide-react';

interface HeroProps {
  images: string[];
}

const Hero: React.FC<HeroProps> = ({ images }) => {
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
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <div className="absolute inset-0 hero-overlay z-10" />
          <img
            src={img}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-5xl">
          <div className="inline-flex items-center gap-2 bg-amber-600/20 backdrop-blur-md border border-amber-500/30 text-amber-400 px-6 py-2 rounded-full mb-8 animate-fade-in">
            <Award className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-[0.2em]">Referência em Uberaba desde 1979</span>
          </div>
          
          <h1 className="text-white text-5xl md:text-8xl font-bold mb-8 drop-shadow-2xl leading-tight">
            A Nobreza da <br />
            <span className="text-amber-500 italic font-serif">Madeira Real.</span>
          </h1>
          
          <p className="text-white/90 text-lg md:text-2xl mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Mais de 45 anos de história fornecendo as melhores soluções em madeiras para quem valoriza durabilidade, estética e compromisso ambiental.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="#produtos"
              className="bg-amber-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-amber-700 transition-all shadow-[0_10px_30px_rgba(217,119,6,0.4)] hover:-translate-y-1 active:scale-95"
            >
              Explorar Catálogo
            </a>
            <a
              href="#empresa"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Nossa História
            </a>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'bg-amber-500 w-16' : 'bg-white/20 w-8 hover:bg-white/40'}`}
              />
            ))}
          </div>

          <button
            onClick={prev}
            className="absolute left-10 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/5 hover:bg-amber-600 border border-white/10 backdrop-blur-md rounded-full text-white transition-all hidden md:flex items-center justify-center hover:shadow-[0_0_20px_rgba(217,119,6,0.5)]"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={next}
            className="absolute right-10 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/5 hover:bg-amber-600 border border-white/10 backdrop-blur-md rounded-full text-white transition-all hidden md:flex items-center justify-center hover:shadow-[0_0_20px_rgba(217,119,6,0.5)]"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}
      
      {/* Decorative wood grain edge */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-stone-50 to-transparent z-20"></div>
    </section>
  );
};

export default Hero;