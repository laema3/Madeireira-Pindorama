import React from 'react';
import { PROJECTS } from '../constants';
import { MapPin, ArrowUpRight } from 'lucide-react';

const Projects: React.FC = () => {
  return (
    <section id="projetos" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h3 className="text-amber-600 font-bold uppercase tracking-widest mb-4">Portfólio</h3>
            <h2 className="text-4xl md:text-5xl font-bold text-pindorama-green">Nossa Madeira em Grandes Projetos</h2>
            <p className="mt-6 text-stone-500 text-lg">
              De residências de luxo a grandes obras civis, a Madeireira Pindorama é a escolha de arquitetos e construtores que buscam o padrão ouro em Uberaba.
            </p>
          </div>
          <button className="flex items-center gap-2 text-pindorama-green font-bold hover:text-amber-600 transition-colors group">
            Ver galeria completa <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROJECTS.map((project) => (
            <div key={project.id} className="group relative h-[450px] rounded-[2rem] overflow-hidden cursor-pointer">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-bold uppercase tracking-wider mb-2">
                  <MapPin size={14} />
                  {project.location}
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">{project.title}</h4>
                <div className="h-1 w-0 group-hover:w-full bg-amber-500 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-50 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default Projects;