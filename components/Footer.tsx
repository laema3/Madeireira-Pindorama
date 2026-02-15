
import React from 'react';
import { Facebook, Instagram, MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
}

const Footer: React.FC<FooterProps> = ({ settings }) => {
  return (
    <footer id="contato" className="bg-stone-900 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold tracking-tight uppercase">{settings.siteName}</span>
            </div>
            <p className="text-stone-400 leading-relaxed mb-8">
              Sua parceira em Uberaba para projetos que duram gerações. Qualidade, tradição e compromisso com o cliente desde 1979.
            </p>
            <div className="flex space-x-4">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-amber-600 transition-colors text-white">
                  <Instagram size={20} />
                </a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-amber-600 transition-colors text-white">
                  <Facebook size={20} />
                </a>
              )}
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-green-600 transition-colors text-white">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xl font-bold mb-8 border-l-4 border-amber-600 pl-4">Menu</h4>
            <ul className="space-y-4 text-stone-400">
              <li><a href="#inicio" className="hover:text-amber-500 transition-colors">Página Inicial</a></li>
              <li><a href="#empresa" className="hover:text-amber-500 transition-colors">Sobre a Empresa</a></li>
              <li><a href="#produtos" className="hover:text-amber-500 transition-colors">Nossos Produtos</a></li>
              <li><a href="#parceiros" className="hover:text-amber-500 transition-colors">Parceiros</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Trabalhe Conosco</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-bold mb-8 border-l-4 border-amber-600 pl-4">Contato</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="text-amber-600 shrink-0 mt-1" />
                <span className="text-stone-400">{settings.address}</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-amber-600 shrink-0" />
                <span className="text-stone-400">{settings.phone}</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-amber-600 shrink-0" />
                <span className="text-stone-400">{settings.email}</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xl font-bold mb-8 border-l-4 border-amber-600 pl-4">Horário</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <Clock className="text-amber-600 shrink-0" />
                <div>
                  <p className="font-bold">Segunda - Sexta</p>
                  <p className="text-stone-400">{settings.hoursWeek}</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <Clock className="text-amber-600 shrink-0" />
                <div>
                  <p className="font-bold">Sábado</p>
                  <p className="text-stone-400">{settings.hoursSat}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12 text-center text-stone-500 text-sm">
          <p>© {new Date().getFullYear()} {settings.siteName} Ltda. Todos os direitos reservados.</p>
          <p className="mt-2 text-stone-600">Referência em madeira há mais de 45 anos em Uberaba, MG.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
