import React from 'react';
import { MessageCircle, Instagram, MapPin, Phone, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { ShopSettings } from '../types';

interface FooterProps {
  onOpenAdmin: () => void;
  onSelectCategory: (cat: string) => void;
  settings: ShopSettings;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onSelectCategory, settings }) => {
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`;

  return (
    <footer className="bg-[#2C1810] text-[#FAF7F2] border-t border-[#DEBF6D]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#FAF7F2]/10">
          {/* Brand & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#DEBF6D] text-[#2C1810] flex items-center justify-center font-bold font-serif">
                F
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-[#FAF7F2]">
                FATIMA SHOP
              </span>
            </div>

            <p className="font-serif italic text-[#DEBF6D] text-sm">
              « {settings.slogan} »
            </p>

            <p className="text-xs text-[#FAF7F2]/75 leading-relaxed font-light">
              Maison de haute parfumerie orientale, de savons noirs traditionnels pour hammam, d’huiles satinées et de douceurs d’Orient à Dakar, Sénégal.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors"
                title="WhatsApp Fatima Shop"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={`https://instagram.com/${settings.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E1306C] hover:text-white flex items-center justify-center transition-colors"
                title="Instagram Fatima Shop"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={`https://tiktok.com/@${settings.tiktokHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-black hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                title="TikTok Fatima Shop"
              >
                TK
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-wider text-[#DEBF6D] font-semibold">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF7F2]/80">
              <li>
                <button
                  onClick={() => onSelectCategory('parfums')}
                  className="hover:text-[#DEBF6D] transition-colors font-medium text-left"
                >
                  Catalogue Parfums (8 000 FCFA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('savons_hamam')}
                  className="hover:text-[#DEBF6D] transition-colors font-medium text-left"
                >
                  Savon Hamam 5 kg (8 500 FCFA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('produits_naturels')}
                  className="hover:text-[#DEBF6D] transition-colors text-left"
                >
                  Produits Naturels & Soins (Ghassoul, Nila, Huiles)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('epicerie_gourmandises')}
                  className="hover:text-[#DEBF6D] transition-colors text-left"
                >
                  Épicerie & Gourmandises (Pistaches, Oud)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('coffrets_parfumerie')}
                  className="hover:text-[#DEBF6D] transition-colors text-left"
                >
                  Coffrets & Rituels (Pack Musc + Oud)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('tous')}
                  className="hover:text-[#DEBF6D] transition-colors text-left font-semibold text-[#DEBF6D]"
                >
                  Tous les 32 Produits
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Dakar Location */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-wider text-[#DEBF6D] font-semibold">
              Service Client & Boutique
            </h4>
            <div className="space-y-2.5 text-xs text-[#FAF7F2]/80 font-light">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#DEBF6D] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#DEBF6D] shrink-0" />
                <span>{settings.displayPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-[#FAF7F2]"
                >
                  Commandes directes 7j/7 sur WhatsApp
                </a>
              </div>
              <p className="text-[11px] text-[#DEBF6D]/80 pt-1">
                Horaires : Lundi au Samedi 9h - 20h · Dimanche 11h - 18h
              </p>
            </div>
          </div>

          {/* Payment and Assurance */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-wider text-[#DEBF6D] font-semibold">
              Moyens de Paiement
            </h4>
            <p className="text-xs text-[#FAF7F2]/75 leading-relaxed font-light">
              Commandez en toute sérénité. Nous acceptons le paiement en espèces à la livraison, Wave Sénégal et Orange Money.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-medium">
              <span className="bg-white/10 px-2.5 py-1 rounded text-[#1DA1F2] border border-[#1DA1F2]/30">
                Wave Sénégal
              </span>
              <span className="bg-white/10 px-2.5 py-1 rounded text-[#FF6600] border border-[#FF6600]/30">
                Orange Money
              </span>
              <span className="bg-white/10 px-2.5 py-1 rounded text-[#FAF7F2] border border-white/20">
                Paiement à la livraison
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] text-[#FAF7F2]/40 hover:text-[#DEBF6D] transition-colors"
              >
                ⚙️ Connexion Espace Administrateur
              </button>
            </div>
          </div>
        </div>

        {/* Quiet Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF7F2]/50 gap-4">
          <p>© {new Date().getFullYear()} FATIMA SHOP · Tous droits réservés.</p>
          <div className="flex items-center gap-2 text-[11px]">
            <span>Votre beauté, notre passion</span>
            <span aria-hidden="true">·</span>
            <span>Dakar, Sénégal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
