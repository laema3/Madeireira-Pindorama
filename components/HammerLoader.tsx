import React from 'react';
import { Hammer } from 'lucide-react';

const HammerLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-pindorama-green/95 backdrop-blur-sm">
      <div className="text-center">
        <div className="relative inline-block mb-8">
          <div className="bg-amber-600/20 w-32 h-32 rounded-full absolute -inset-4 animate-pulse blur-xl"></div>
          <Hammer 
            size={80} 
            className="text-amber-500 animate-hammer drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" 
          />
        </div>
        <p className="text-amber-500 font-black uppercase tracking-[0.3em] italic text-sm animate-pulse">
          Construindo sua experiência...
        </p>
        <div className="mt-4 flex justify-center gap-1">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-75"></div>
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-150"></div>
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-300"></div>
        </div>
      </div>
    </div>
  );
};

export default HammerLoader;