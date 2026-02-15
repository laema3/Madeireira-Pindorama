
import React, { useState, useEffect } from 'react';
import { TESTIMONIALS } from '../constants';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-pindorama-green overflow-hidden relative">
      {/* Decorative wood grain overlay could go here */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-amber-400 font-bold uppercase tracking-widest mb-4">Depoimentos</h3>
          <h2 className="text-4xl font-bold text-white mb-4 italic font-serif">A confiança de quem constrói conosco</h2>
        </div>

        <div className="relative min-h-[300px] flex items-center justify-center">
          {TESTIMONIALS.map((t, index) => (
            <div
              key={t.id}
              className={`absolute inset-0 transition-all duration-1000 flex flex-col items-center text-center ${
                index === active ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
              }`}
            >
              <div className="mb-6 bg-amber-400/20 p-4 rounded-full">
                <Quote className="text-amber-400 w-10 h-10" />
              </div>
              <p className="text-2xl text-white/90 leading-relaxed mb-8 font-light italic">
                "{t.content}"
              </p>
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="text-amber-400 fill-amber-400 w-5 h-5" />
                ))}
              </div>
              <h4 className="text-xl font-bold text-white uppercase tracking-wider">{t.author}</h4>
              <span className="text-amber-400 text-sm mt-1">Cliente Fiel</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3 mt-12">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === active ? 'bg-amber-400 w-10' : 'bg-white/20'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
