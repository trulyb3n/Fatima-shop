import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { ShopSettings } from '../types';

interface FloatingWhatsAppProps {
  settings: ShopSettings;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  const phone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend =
      userMsg.trim() ||
      'Bonjour FATIMA SHOP ✨ Je souhaite passer commande sur WhatsApp au 76 140 34 64 (Parfums à 8 000 FCFA ou Savon Hamam 5 kg à 8 500 FCFA).';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(textToSend)}`, '_blank');
    setIsOpen(false);
    setUserMsg('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Pop-up dialog */}
      {isOpen && (
        <div className="mb-3 w-80 bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#DEBF6D]/50 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-[#2C1810] text-[#FAF7F2] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                {/* Active real live agent indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#2C1810] rounded-full" />
              </div>
              <div>
                <p className="font-serif font-bold text-sm">FATIMA SHOP</p>
                <p className="text-[11px] text-[#DEBF6D]">Commandes : 76 140 34 64</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat bubble */}
          <div className="p-4 space-y-3 bg-[#F7F3EB]/60 text-xs text-[#2C1810]">
            <div className="p-3 bg-white rounded-xl rounded-tl-none shadow-xs border border-[#EFE8DA] space-y-1">
              <p className="font-semibold text-[#A8813C]">Bonjour chez FATIMA SHOP ✨</p>
              <p className="text-[#5C3D2E] leading-relaxed">
                Tous nos parfums sont au tarif de <strong>8 000 FCFA</strong> et le Savon Hamam (5 kg) à <strong>8 500 FCFA</strong>. Écrivez-nous directement ici pour commander !
              </p>
            </div>
          </div>

          {/* Input form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#EFE8DA] flex gap-2">
            <input
              type="text"
              placeholder="Écrivez votre message..."
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              className="flex-1 text-xs bg-[#FAF7F2] border border-[#EFE8DA] rounded-full px-3 py-2 text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
            />
            <button
              type="submit"
              className="p-2 rounded-full bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors"
              title="Envoyer sur WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 bg-[#25D366] text-white hover:bg-[#20ba59] px-4 py-3 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Discussion WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="text-xs font-semibold tracking-wide hidden sm:inline">
          Besoin d’aide ? WhatsApp
        </span>
      </button>
    </div>
  );
};
