
import React from 'react';
import { Target, Eye, ShieldCheck, Heart, Leaf, TreePine, FileCheck, CheckCircle2, History } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      title: 'Missão',
      desc: 'Prover soluções em madeira de alta qualidade, auxiliando no desenvolvimento sustentável da construção civil e movelaria regional.',
      icon: <Target className="w-10 h-10 text-amber-600" />,
    },
    {
      title: 'Visão',
      desc: 'Ser referência absoluta em Uberaba e no Triângulo Mineiro como a madeireira mais confiável e completa.',
      icon: <Eye className="w-10 h-10 text-amber-600" />,
    },
    {
      title: 'Princípios',
      desc: 'Integridade em cada venda, respeito ao meio ambiente e foco total na satisfação do mestre de obra ao arquiteto.',
      icon: <ShieldCheck className="w-10 h-10 text-amber-600" />,
    },
    {
      title: 'Valores',
      desc: 'Tradição, Qualidade, Pontualidade na entrega e Ética Comercial fundamentada em nossa história de 45 anos.',
      icon: <Heart className="w-10 h-10 text-amber-600" />,
    },
  ];

  const ecoFeatures = [
    {
      title: 'Manejo Sustentável',
      desc: 'Trabalhamos exclusivamente com fornecedores que operam sob planos de manejo florestal sustentável aprovados.',
      icon: <TreePine size={24} />
    },
    {
      title: 'Documento de Origem (DOF)',
      desc: '100% da nossa madeira possui Documento de Origem Florestal, garantindo a rastreabilidade desde a extração legal.',
      icon: <FileCheck size={24} />
    },
    {
      title: 'Conformidade IBAMA',
      desc: 'Operamos rigorosamente dentro das normas estabelecidas pelo IBAMA e demais órgãos reguladores.',
      icon: <CheckCircle2 size={24} />
    }
  ];

  return (
    <section id="empresa" className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-20 items-center mb-32">
          <div className="lg:w-1/2 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-100 rounded-full -z-10 blur-2xl opacity-60"></div>
            <h3 className="text-amber-600 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <History size={18} />
              Fundada em 1979
            </h3>
            <h2 className="text-4xl md:text-6xl font-bold text-pindorama-green mb-10 leading-tight">
              A Tradição que <br />
              Solidifica <span className="text-amber-600 italic font-serif">Uberaba.</span>
            </h2>
            <p className="text-stone-600 text-xl leading-relaxed mb-8 font-light">
              Nascemos no coração do Triângulo Mineiro com uma promessa: oferecer madeira que resiste ao tempo. Hoje, 45 anos depois, a <strong>Madeireira Pindorama</strong> não apenas vende matéria-prima, mas fornece a base para os sonhos de milhares de famílias.
            </p>
            <p className="text-stone-500 text-lg leading-relaxed">
              Diferente de grandes varejistas, aqui o conhecimento é passado de geração em geração. Sabemos identificar a fibra certa para cada necessidade, do alicerce ao acabamento decorativo. Nossa sede em Uberaba é um ponto de encontro para quem entende que a qualidade da madeira é o que define a alma de uma construção.
            </p>
            
            <div className="mt-12 flex items-center gap-8">
               <div className="text-center">
                  <p className="text-5xl font-black text-pindorama-green">45+</p>
                  <p className="text-xs font-bold uppercase text-stone-400 tracking-widest">Anos de Mercado</p>
               </div>
               <div className="w-px h-12 bg-stone-200"></div>
               <div className="text-center">
                  <p className="text-5xl font-black text-pindorama-green">10k+</p>
                  <p className="text-xs font-bold uppercase text-stone-400 tracking-widest">Projetos Atendidos</p>
               </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 grid grid-cols-2 gap-6 relative">
            <div className="absolute inset-0 bg-stone-50 scale-110 -z-10 rounded-[3rem] border border-stone-100 shadow-sm"></div>
            <img 
              src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=600" 
              alt="Timber selection" 
              className="rounded-[2.5rem] shadow-2xl mt-12 hover:scale-105 transition-transform duration-700"
            />
            <img 
              src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600" 
              alt="Forest sustainable" 
              className="rounded-[2.5rem] shadow-2xl hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Missão, Visão e Valores */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-32">
          {values.map((v) => (
            <div key={v.title} className="bg-stone-50 p-10 rounded-[2.5rem] border border-stone-100 hover:shadow-2xl transition-all group hover:-translate-y-2">
              <div className="bg-white w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all text-amber-600">
                {/* Use React.cloneElement with React.ReactElement<any> to fix type errors for className prop */}
                {React.cloneElement(v.icon as React.ReactElement<any>, { className: 'w-10 h-10 group-hover:text-white transition-colors' })}
              </div>
              <h4 className="text-2xl font-bold text-pindorama-green mb-4">{v.title}</h4>
              <p className="text-stone-500 leading-relaxed text-sm">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Seção Meio Ambiente */}
        <div className="bg-pindorama-green rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden shadow-[0_20px_50px_rgba(13,44,37,0.4)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-2/5">
                <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-6 py-2 rounded-full mb-8 font-bold text-xs tracking-widest uppercase border border-green-500/30">
                  <Leaf size={16} />
                  Compromisso Verde
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 italic font-serif">Natureza Respeitada, Futuro Garantido.</h2>
                <p className="text-stone-300 text-lg leading-relaxed mb-10">
                  A longevidade da Pindorama está ligada ao ciclo da terra. Operamos com transparência absoluta em cada m³ de madeira que entra em nosso pátio.
                </p>
                <div className="flex gap-4">
                   <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-center flex-1">
                      <p className="text-3xl font-bold text-amber-400">100%</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Legalizada</p>
                   </div>
                   <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-center flex-1">
                      <p className="text-3xl font-bold text-amber-400">DOF</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Rastreável</p>
                   </div>
                </div>
              </div>
              
              <div className="lg:w-3/5 grid md:grid-cols-1 gap-6">
                {ecoFeatures.map((feature, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all flex gap-6 items-start">
                    <div className="text-amber-400 shrink-0 bg-amber-400/10 w-16 h-16 rounded-2xl flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                      <p className="text-stone-300 leading-relaxed text-sm">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-20 pt-12 border-t border-white/10 flex flex-wrap justify-between items-center gap-8">
               <div className="flex flex-col">
                  <span className="text-stone-500 text-xs font-bold uppercase tracking-[0.3em] mb-2">Selos de Qualidade e Conformidade</span>
                  <p className="text-stone-300 text-sm max-w-md">Em total harmonia com o Sistema Nacional de Controle da Origem dos Produtos Florestais.</p>
               </div>
               <div className="flex gap-6">
                  <div className="bg-white px-8 py-4 rounded-2xl grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all flex items-center h-16 shadow-lg">
                    <span className="text-black font-black text-2xl italic tracking-tighter">IBAMA</span>
                  </div>
                  <div className="bg-white px-8 py-4 rounded-2xl grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all flex items-center h-16 shadow-lg">
                    <span className="text-black font-black text-2xl italic tracking-tighter">DOF</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
