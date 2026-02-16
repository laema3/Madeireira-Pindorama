import React from 'react';
import { Facebook, Instagram, MessageCircle, Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
}

const Footer: React.FC<FooterProps> = ({ settings }) => {
  return (
    <footer id="contato" className="bg-stone-900 text-white pt-24 pb-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand and About */}
          <div className="space-y-8">
            <div className="flex items-center">
              {settings.logo ? (
                <img src={settings.logo} alt={settings.siteName} className="h-16 w-auto object-contain bg-white/5 p-2 rounded-xl" />
              ) : (
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-amber-600 w-10 h-10" />
                  <span className="text-2xl font-black tracking-tighter uppercase">{settings.siteName}</span>
                </div>
              )}
            </div>
            <p className="text-stone-400 leading-relaxed font-medium">
              A maior referência em madeiras de Uberaba e região. Tradição, qualidade e compromisso ambiental há mais de 45 anos.
            </p>
            <div className="flex space-x-3">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 rounded-2xl hover:bg-amber-600 hover:text-white transition-all text-stone-400">
                  <Instagram size={20} />
                </a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 rounded-2xl hover:bg-amber-600 hover:text-white transition-all text-stone-400">
                  <Facebook size={20} />
                </a>
              )}
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 rounded-2xl hover:bg-green-600 hover:text-white transition-all text-stone-400">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-amber-600">Navegação</h4>
            <ul className="space-y-5 text-stone-400 font-bold uppercase text-[10px]">
              <li><a href="#inicio" className="hover:text-amber-500 transition-colors flex items-center gap-2">Início</a></li>
              <li><a href="#empresa" className="hover:text-amber-500 transition-colors flex items-center gap-2">Nossa Empresa</a></li>
              <li><a href="#produtos" className="hover:text-amber-500 transition-colors flex items-center gap-2">Catálogo de Produtos</a></li>
              <li><a href="#parceiros" className="hover:text-amber-500 transition-colors flex items-center gap-2">Marcas Parceiras</a></li>
              <li><a href="#projetos" className="hover:text-amber-500 transition-colors flex items-center gap-2">Nosso Portfólio</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-amber-600">Atendimento</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="text-amber-600 shrink-0 mt-1" size={20} />
                <span className="text-stone-300 font-medium text-sm leading-relaxed">{settings.address}</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-amber-600 shrink-0" size={20} />
                <div className="flex flex-col">
                  <span className="text-stone-500 text-[10px] font-black uppercase">Telefone Fixo</span>
                  <span className="text-stone-200 font-bold">{settings.phone}</span>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <MessageCircle className="text-green-500 shrink-0" size={20} />
                <div className="flex flex-col">
                  <span className="text-stone-500 text-[10px] font-black uppercase">WhatsApp</span>
                  <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" className="text-stone-200 font-bold hover:text-green-400">WhatsApp Oficial</a>
                </div>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-amber-600">Horários</h4>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <Clock className="text-amber-600 shrink-0" size={20} />
                <div>
                  <p className="text-[10px] font-black uppercase text-stone-500">Segunda a Sexta</p>
                  <p className="text-stone-200 font-bold">{settings.hoursWeek}</p>
                </div>
              </li>
              <li className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <Clock className="text-amber-600 shrink-0" size={20} />
                <div>
                  <p className="text-[10px] font-black uppercase text-stone-500">Sábados</p>
                  <p className="text-stone-200 font-bold">{settings.hoursSat}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 text-center">
          <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest">© {new Date().getFullYear()} {settings.siteName} Ltda • Todos os direitos reservados</p>
          <p className="mt-4 text-stone-600 text-xs italic">A tradição que solidifica Uberaba e o Triângulo Mineiro.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;