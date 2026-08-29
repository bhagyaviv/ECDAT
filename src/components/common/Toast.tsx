import React from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { Bell, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useCrypto();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce transition-all duration-300">
      <div className="flex items-center gap-3 bg-slate-900/95 border border-cyan-500/50 text-slate-100 px-4 py-3 rounded-xl shadow-2xl shadow-cyan-950/60 backdrop-blur-md">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-sm font-medium text-slate-200">
          {toastMessage}
        </div>
      </div>
    </div>
  );
};
