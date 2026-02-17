
import React from 'react';
import { Target, Eye, ShieldCheck, Heart, Leaf, TreePine, FileCheck, CheckCircle2, History } from 'lucide-react';
import { SiteSettings } from '../types';

interface AboutProps {
  settings: SiteSettings;
}

const About: React.FC<AboutProps> = ({ settings }) => {
  const values = [
    { title: 'Missão', desc: settings.mission, icon: <Target className="w-10 h-10 text-amber-600" /> },
    { title: 'Visão', desc: settings.vision, icon: <Eye className="w-10 h-10 text-amber-600" /> },
    { title: 'Princípios', desc: settings.principles, icon: <ShieldCheck className="w-10 h-10 text-amber-600" /> },
    { title: 'Valores', desc: settings.valuesText, icon: <Heart className="w-10 h-10 text-amber-600" /> },
  ];

  return (
    <section id="empresa" className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-20 items-center mb-32">
          <div className="lg:w-1/2">
            <h3 className="text-amber-600 font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <History size={18} /> Fundada em 1979
            </h3>
            <h2 className="text-5xl md:text-7xl font-black text-pindorama-green mb-10 leading-none uppercase tracking-tighter">
              {settings.aboutTitle}
            </h2>
            <p className="text-stone-600 text-xl leading-relaxed mb-10 font-medium">
              {settings.aboutText}
            </p>
            
            <div className="flex items-center gap-12">
               <div>
                  <p className="text-6xl font-black text-pindorama-green">45+</p>
                  <p className="text-xs font-black uppercase text-stone-400 tracking-widest">Anos de Uberaba</p>
               </div>
               <div className="w-px h-16 bg-stone-200"></div>
               <div>
                  <p className="text-6xl font-black text-pindorama-green">100%</p>
                  <p className="text-xs font-black uppercase text-stone-400 tracking-widest">Madeira Legal</p>
               </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative h-[600px]">
             <img src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover rounded-[3rem] shadow-2xl" />
             <div className="absolute -bottom-10 -left-10 bg-amber-600 text-white p-12 rounded-[2rem] shadow-2xl hidden md:block">
                <p className="text-4xl font-black mb-2 uppercase">Sustentável</p>
                <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Origem Certificada</p>
             </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v) => (
            <div key={v.title} className="bg-stone-50 p-10 rounded-[2.5rem] border border-stone-200 hover:shadow-xl transition-all">
              <div className="text-amber-600 mb-6">{v.icon}</div>
              <h4 className="text-2xl font-black text-pindorama-green mb-4 uppercase">{v.title}</h4>
              <p className="text-stone-500 font-medium leading-relaxed text-sm">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
