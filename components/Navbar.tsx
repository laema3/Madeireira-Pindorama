
import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck, Home, Info, Package, Handshake, Mail } from 'lucide-react';

interface NavbarProps {
  onAdminClick: () => void;
  onHomeClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAdminClick, onHomeClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#inicio', icon: <Home size={18} /> },
    { name: 'Empresa', href: '#empresa', icon: <Info size={18} /> },
    { name: 'Produtos', href: '#produtos', icon: <Package size={18} /> },
    { name: 'Parceiros', href: '#parceiros', icon: <Handshake size={18} /> },
    { name: 'Contato', href: '#contato', icon: <Mail size={18} /> },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-pindorama-green shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={onHomeClick}
          >
            <div className="bg-white p-2 rounded-lg mr-3 group-hover:bg-amber-100 transition-colors">
              <ShieldCheck className="text-pindorama-green w-8 h-8" />
            </div>
            <div>
              <span className="text-white text-2xl font-bold tracking-tight block leading-none">PINDORAMA</span>
              <span className="text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase">Madeireira • Uberaba</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 text-white/90 hover:text-amber-400 font-medium text-sm transition-colors uppercase tracking-wider group"
              >
                <span className="text-amber-500/50 group-hover:text-amber-400 transition-colors">
                  {link.icon}
                </span>
                {link.name}
              </a>
            ))}
            <button
              onClick={onAdminClick}
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-transform hover:scale-105 shadow-lg"
            >
              Painel ADM
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-amber-400 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-pindorama-green border-t border-white/10 px-4 pt-4 pb-6 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="flex items-center gap-4 px-4 py-4 text-white hover:bg-white/10 rounded-xl text-lg font-semibold transition-all active:scale-95"
              onClick={() => setIsOpen(false)}
            >
              <div className="text-amber-400">
                {link.icon}
              </div>
              {link.name}
            </a>
          ))}
          <div className="pt-4">
            <button
              onClick={() => {
                onAdminClick();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-3 bg-amber-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl"
            >
              <ShieldCheck size={20} />
              Área Administrativa
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
