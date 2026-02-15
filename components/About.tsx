
import React from 'react';
import { Target, Eye, ShieldCheck, Heart, Leaf, TreePine, FileCheck, CheckCircle2 } from 'lucide-react';

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
    <section id="empresa" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
          <div className="lg:w-1/2">
            <h3 className="text-amber-600 font-bold uppercase tracking-widest mb-4">Mais de 4 décadas de história</h3>
            <h2 className="text-4xl md:text-5xl font-bold text-pindorama-green mb-8">
              A Tradição que Constrói <br />
              o Futuro de Uberaba.
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed mb-6">
              Fundada em 1979, a <strong>Madeireira Pindorama</strong> nasceu com o propósito de oferecer o que há de melhor em madeiras para a nossa cidade. Ao longo de mais de 45 anos, nos consolidamos como um pilar da construção civil local.
            </p>
            <p className="text-stone-600 text-lg leading-relaxed">
              Passamos por gerações, adaptando processos, mas mantendo o rigor na escolha dos nossos fornecedores e na secagem da nossa madeira. Localizada no coração de Minas Gerais, nossa sede em Uberaba conta com ampla infraestrutura para atender desde pequenas reformas até grandes empreendimentos imobiliários.
            </p>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=400" 
              alt="Timber selection" 
              className="rounded-2xl shadow-lg mt-8"
            />
            <img 
              src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=400" 
              alt="Forest sustainable" 
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* Missão, Visão e Valores */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {values.map((v) => (
            <div key={v.title} className="bg-stone-50 p-8 rounded-3xl border border-stone-100 hover:shadow-xl transition-shadow group">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                {v.icon}
              </div>
              <h4 className="text-2xl font-bold text-pindorama-green mb-4">{v.title}</h4>
              <p className="text-stone-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Seção Meio Ambiente */}
        <div className="bg-pindorama-green rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/3">
                <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full mb-6 font-bold text-sm tracking-wider uppercase border border-green-500/30">
                  <Leaf size={18} />
                  Compromisso Verde
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Tradição com Respeito à Natureza</h2>
                <p className="text-stone-300 leading-relaxed mb-8">
                  Na Pindorama, acreditamos que a longevidade da nossa empresa depende da preservação das nossas florestas. Por isso, operamos em total conformidade com as regras ambientais.
                </p>
              </div>
              
              <div className="lg:w-2/3 grid md:grid-cols-3 gap-6">
                {ecoFeatures.map((feature, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all">
                    <div className="text-amber-400 mb-4 bg-amber-400/10 w-12 h-12 rounded-xl flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                    <p className="text-sm text-stone-300 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap justify-center md:justify-between items-center gap-8">
               <p className="text-stone-400 text-sm font-bold tracking-widest uppercase">
                Em conformidade total com o Sistema Nacional de Controle da Origem dos Produtos Florestais
               </p>
               <div className="flex gap-4">
                  <div className="bg-white px-4 py-2 rounded-lg grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all flex items-center h-12">
                    <span className="text-black font-black text-xl italic">IBAMA</span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-lg grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all flex items-center h-12">
                    <span className="text-black font-black text-xl italic">DOF</span>
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
