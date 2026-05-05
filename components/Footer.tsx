import React from 'react';
import { Facebook, Instagram, MessageCircle, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
}

const Footer: React.FC<FooterProps> = ({ settings }) => {
  return (
    <footer id="contato" className="bg-stone-900 text-white pt-24 pb-12 overflow-hidden relative border-t-8 border-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Logo e Sobre */}
          <div className="space-y-8">
            <div className="flex items-center">
              {settings.logo ? (
                <img src={settings.logo} alt={settings.siteName} className="h-20 w-auto object-contain bg-white/5 p-4 rounded-2xl" />
              ) : (
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-amber-600 w-10 h-10" />
                  <span className="text-2xl font-black tracking-tighter uppercase">MADEIRAS BRASIL</span>
                </div>
              )}
            </div>
            <p className="text-stone-400 leading-relaxed font-medium italic text-sm">
              Tradição que solidifica Uberaba e o Triângulo Mineiro. Qualidade e compromisso.
            </p>
            <div className="flex space-x-3">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" className="p-4 bg-white/5 rounded-2xl hover:bg-amber-600 transition-all text-stone-400 hover:text-white">
                  <Instagram size={20} />
                </a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" className="p-4 bg-white/5 rounded-2xl hover:bg-amber-600 transition-all text-stone-400 hover:text-white">
                  <Facebook size={20} />
                </a>
              )}
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" className="p-4 bg-white/5 rounded-2xl hover:bg-green-600 transition-all text-stone-400 hover:text-white">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-amber-600 italic">Explore</h4>
            <ul className="space-y-5 text-stone-400 font-bold uppercase text-[10px] tracking-widest">
              <li><a href="#inicio" className="hover:text-amber-500 transition-colors">Início</a></li>
              <li><a href="#empresa" className="hover:text-amber-500 transition-colors">A Empresa</a></li>
              <li><a href="#produtos" className="hover:text-amber-500 transition-colors">Produtos</a></li>
              <li><a href="#projetos" className="hover:text-amber-500 transition-colors">Obras</a></li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-amber-600 italic">Contato</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="text-amber-600 shrink-0" size={20} />
                <span className="text-stone-300 font-medium text-xs leading-relaxed">{settings.address}</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-amber-600 shrink-0" size={20} />
                <div className="flex flex-col">
                  <span className="text-stone-500 text-[9px] font-black uppercase tracking-widest">Telefone</span>
                  <span className="text-stone-200 font-bold text-sm">{settings.phone}</span>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <MessageCircle className="text-green-500 shrink-0" size={20} />
                <div className="flex flex-col">
                  <span className="text-stone-500 text-[9px] font-black uppercase tracking-widest">WhatsApp</span>
                  <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" className="text-stone-200 font-bold text-sm hover:text-green-400">Atendimento Digital</a>
                </div>
              </li>
            </ul>
          </div>

          {/* Funcionamento */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-amber-600 italic">Funcionamento</h4>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <Clock className="text-amber-600 shrink-0" size={20} />
                <div>
                  <p className="text-[9px] font-black uppercase text-stone-500 tracking-widest">Seg a Sex</p>
                  <p className="text-stone-200 font-bold text-sm">{settings.hoursWeek}</p>
                </div>
              </li>
              <li className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <Clock className="text-amber-600 shrink-0" size={20} />
                <div>
                  <p className="text-[9px] font-black uppercase text-stone-500 tracking-widest">Sábados</p>
                  <p className="text-stone-200 font-bold text-sm">{settings.hoursSat}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 text-center">
          <p className="text-stone-600 text-[10px] font-black uppercase tracking-widest italic">© {new Date().getFullYear()} MADEIRAS BRASIL • Uberaba - MG</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;