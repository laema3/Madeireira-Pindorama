
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <section id="inicio" className="relative h-screen w-full overflow-hidden">
      {images.map((img, index) => (
        <div
          key={img + index}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${index === current ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img
            src={img}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-4xl">
          <h2 className="text-amber-400 text-lg md:text-xl font-semibold mb-4 tracking-widest uppercase animate-fade-in-down">
            Desde 1979 em Uberaba
          </h2>
          <h1 className="text-white text-5xl md:text-7xl font-bold mb-8 drop-shadow-lg leading-tight">
            Madeireira Pindorama: <br />
            <span className="text-amber-50">Solidez e Tradição</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Fornecendo as melhores madeiras para construção, móveis e acabamentos com o compromisso de quem conhece o ofício há mais de 45 anos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#produtos"
              className="bg-pindorama-green text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-900 transition-all shadow-xl hover:-translate-y-1"
            >
              Ver Nossos Produtos
            </a>
            <a
              href="#contato"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all shadow-xl hover:-translate-y-1"
            >
              Falar com Vendedor
            </a>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full transition-all ${i === current ? 'bg-amber-400 w-8' : 'bg-white/30'}`}
              />
            ))}
          </div>

          <button
            onClick={prev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all hidden md:block"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={next}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all hidden md:block"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}
    </section>
  );
};

export default Hero;
