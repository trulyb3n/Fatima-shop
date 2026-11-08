import React from 'react';
import { ArrowDown, MessageCircle, Sparkles, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { ShopSettings } from '../types';

interface HeroProps {
  onExplore: () => void;
  settings: ShopSettings;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, settings }) => {
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Bonjour FATIMA SHOP ✨ Je souhaite avoir des informations sur vos parfums et rituels hammam disponibles.'
  )}`;

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] border-b border-[#EFE8DA]">
      {/* Main Campaign Hero Split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Elegant Subtitle Kicker (unboxed metadata, no pill badge) */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium">
              <span>Haute Parfumerie</span>
              <span aria-hidden="true">·</span>
              <span>Rituels Hammam</span>
              <span aria-hidden="true">·</span>
              <span>Dakar, Sénégal</span>
            </div>

            {/* Slogan & Title */}
            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2C1810] font-normal tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
                Votre beauté, <br />
                <span className="italic font-serif font-light text-[#A8813C]">notre passion</span>
              </h1>
              <p className="text-base sm:text-lg text-[#5C3D2E] font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Bienvenue chez <strong className="font-medium text-[#2C1810]">FATIMA SHOP</strong>. Découvrez notre catalogue officiel de parfums de prestige au tarif unique de <strong className="text-[#2C1810] font-bold">8 000 FCFA</strong> l’unité et notre authentique <strong className="text-[#2C1810] font-bold">Savon Hamam en lot de 5 kg à 8 500 FCFA</strong>.
              </p>
            </div>

            {/* Quick Price Highlights Banner */}
            <div className="p-3 bg-[#F7F3EB] rounded-xl border border-[#C5A059]/40 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-[#2C1810]">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#A8813C]" />
                <span>Tous les Parfums : <strong className="font-bold text-[#A8813C]">8 000 FCFA</strong></span>
              </div>
              <span className="hidden sm:inline text-[#C5A059]">·</span>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#A8813C]" />
                <span>Savon Hamam (5 kg) : <strong className="font-bold text-[#A8813C]">8 500 FCFA</strong></span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onExplore}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#2C1810] text-[#FAF7F2] hover:bg-[#3E2419] rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Voir le catalogue (8 000 FCFA)</span>
                <ArrowDown className="w-4 h-4 text-[#DEBF6D]" />
              </button>

              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  'Bonjour FATIMA SHOP ✨ Je souhaite passer une commande par WhatsApp au 76 140 34 64.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] text-white hover:bg-[#20ba59] rounded-full text-xs font-semibold tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp : 76 140 34 64</span>
              </a>
            </div>

            {/* Micro trust indicators */}
            <div className="pt-4 border-t border-[#EFE8DA] flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#5C3D2E]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                <span>100% Produits Authentiques</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#C5A059]" />
                <span>Livraison Express Dakar (2h-4h)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Wave & Orange Money acceptés</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Decorative luxury frame outline */}
              <div className="absolute -inset-3 rounded-2xl border border-[#DEBF6D]/30 -z-10 transform rotate-1 scale-98 pointer-events-none" />
              
              {/* Main Image Container with Zero-Broken-Image fallback */}
              <div className="relative rounded-xl overflow-hidden shadow-2xl bg-[#F7F3EB] aspect-[16/10] sm:aspect-[16/11]">
                <img
                  src="/src/assets/images/hero_fatima_shop_1794063044096.jpg"
                  alt="FATIMA SHOP Parfums d'exception et rituel de savon noir Hamam"
                  className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to stylized container if image file unavailable
                    e.currentTarget.style.display = 'none';
                  }}
                />

                {/* Subtle luxury gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/70 via-[#2C1810]/15 to-transparent pointer-events-none" />

                {/* Floating caption on image */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm font-light flex items-center justify-between">
                  <div className="backdrop-blur-md bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
                    <p className="font-serif italic text-[#DEBF6D] text-sm">Flacons d'Oud & Savon Beldi</p>
                    <p className="text-[11px] text-white/90">Rituel de beauté traditionnel & moderne</p>
                  </div>
                  <span className="text-[11px] tracking-wider uppercase text-white/80 bg-black/40 px-2 py-1 rounded">
                    Sénégal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Presentation Banner of Fatima Shop */}
      <div className="bg-[#F7F3EB] border-t border-[#EFE8DA] py-8 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-semibold">L'Histoire de Fatima Shop</p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2C1810]">Une invitation au voyage des sens et du bien-être</h2>
          <p className="text-sm sm:text-base text-[#5C3D2E] leading-relaxed max-w-3xl mx-auto font-light">
            Née de la passion pour les fragrances rares et les traditions orientales du hammam, <strong>FATIMA SHOP</strong> sélectionne avec rigueur des jus de haute tenue, des soins corporels naturels et des fruits secs gourmets de première cueillette. Chaque commande est emballée avec un soin infini pour faire de votre déballage un moment d’émerveillement.
          </p>
        </div>
      </div>
    </section>
  );
};
