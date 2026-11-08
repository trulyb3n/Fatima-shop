import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, ShieldCheck, Sparkles } from 'lucide-react';
import { CartItem, ShopSettings } from '../types';

interface HeaderProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  settings: ShopSettings;
}

export const Header: React.FC<HeaderProps> = ({
  cart,
  onOpenCart,
  onOpenAdmin,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  settings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (category: string) => {
    onSelectCategory(category);
    setMobileMenuOpen(false);
    const catalogEl = document.getElementById('catalogue');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#2C1810] text-[#FAF7F2] text-xs py-2 px-4 border-b border-[#C5A059]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 tracking-wide font-light text-[11px] md:text-xs">
            <span className="text-[#DEBF6D] font-bold">TARIFS OFFICIELS</span>
            <span>·</span>
            <span>Tous les Parfums à <strong>8 000 FCFA</strong></span>
            <span>·</span>
            <span>Savon Hamam (5 kg) à <strong>8 500 FCFA</strong></span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">Dakar & tout le Sénégal</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#DEBF6D] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Commandes WhatsApp :</span>
              <span className="font-bold text-[#FAF7F2]">{settings.displayPhone}</span>
            </a>
            <button
              onClick={onOpenAdmin}
              className="text-[#FAF7F2]/60 hover:text-[#DEBF6D] transition-colors text-[10px] uppercase tracking-wider hidden sm:inline"
            >
              Espace Gérante
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Strictly conforms to Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EFE8DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand title, one line wordmark in display face */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-full bg-[#2C1810] text-[#DEBF6D] flex items-center justify-center shadow-xs border border-[#C5A059]/40 group-hover:scale-105 transition-transform">
                <span className="font-serif text-lg font-bold">F</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-wider text-[#2C1810] whitespace-nowrap">
                  FATIMA SHOP
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-medium -mt-1">
                  Parfumerie & Savons Hamam
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: 4-5 single-line clean nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#5C3D2E]">
            <button
              onClick={() => handleNavClick('tous')}
              className="hover:text-[#2C1810] hover:underline underline-offset-8 transition-colors whitespace-nowrap cursor-pointer"
            >
              Tous les Produits
            </button>
            <button
              onClick={() => handleNavClick('parfums')}
              className="hover:text-[#2C1810] hover:underline underline-offset-8 transition-colors whitespace-nowrap cursor-pointer font-bold text-[#2C1810]"
            >
              Parfums (8 000 FCFA)
            </button>
            <button
              onClick={() => handleNavClick('savons_hamam')}
              className="hover:text-[#2C1810] hover:underline underline-offset-8 transition-colors whitespace-nowrap cursor-pointer font-semibold text-[#A8813C]"
            >
              Savon Hamam
            </button>
            <button
              onClick={() => handleNavClick('produits_naturels')}
              className="hover:text-[#2C1810] hover:underline underline-offset-8 transition-colors whitespace-nowrap cursor-pointer font-semibold text-[#1B4332]"
            >
              Soins Naturels & Bien-Être
            </button>
            <button
              onClick={() => handleNavClick('epicerie_gourmandises')}
              className="hover:text-[#2C1810] hover:underline underline-offset-8 transition-colors whitespace-nowrap cursor-pointer font-medium text-[#5C3D2E]"
            >
              Épicerie Fine
            </button>
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline transition-colors whitespace-nowrap cursor-pointer font-bold flex items-center gap-1"
            >
              WhatsApp : 76 140 34 64
            </a>
          </nav>

          {/* Zone 3: Search + 1 primary action (Shopping Bag) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Inline search bar on desktop */}
            <div className="relative hidden md:block w-44 lg:w-52">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#F7F3EB] border border-[#EFE8DA] rounded-full py-1.5 pl-9 pr-3 text-xs text-[#2C1810] placeholder-[#5C3D2E]/50 focus:outline-none focus:border-[#C5A059] transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-[#5C3D2E]/60 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-2 text-[#5C3D2E]/50 hover:text-[#2C1810] text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile search trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-[#2C1810] hover:text-[#C5A059] transition-colors"
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-[#2C1810] text-[#FAF7F2] hover:bg-[#3E2419] px-4 py-2.5 rounded-full text-xs font-medium tracking-wide transition-colors whitespace-nowrap cursor-pointer shadow-xs active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-[#DEBF6D]" />
              <span className="hidden sm:inline">Panier</span>
              {totalItems > 0 && (
                <span className="bg-[#C5A059] text-[#2C1810] font-bold text-[11px] px-1.5 py-0.2 rounded-full min-w-5 text-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#2C1810] hover:text-[#C5A059]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input drawer */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3 pt-1 border-t border-[#EFE8DA] bg-[#FAF7F2]">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un parfum, savon, pistache..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full bg-[#F7F3EB] border border-[#C5A059]/40 rounded-full py-2 pl-10 pr-4 text-sm text-[#2C1810] focus:outline-none"
              />
              <Search className="w-4 h-4 text-[#C5A059] absolute left-3.5 top-3" />
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7F2] border-t border-[#EFE8DA] px-6 py-6 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-3 text-base font-serif text-[#2C1810]">
              <button
                onClick={() => handleNavClick('tous')}
                className="text-left py-1 hover:text-[#C5A059]"
              >
                Tous les produits
              </button>
              <button
                onClick={() => handleNavClick('parfums_femmes')}
                className="text-left py-1 hover:text-[#C5A059]"
              >
                Parfums pour Femmes
              </button>
              <button
                onClick={() => handleNavClick('parfums_hommes')}
                className="text-left py-1 hover:text-[#C5A059]"
              >
                Parfums pour Hommes
              </button>
              <button
                onClick={() => handleNavClick('parfums_mixtes')}
                className="text-left py-1 hover:text-[#C5A059]"
              >
                Parfums Mixtes & Oud
              </button>
              <button
                onClick={() => handleNavClick('savons_hamam')}
                className="text-left py-1 hover:text-[#C5A059]"
              >
                Savons Hamam 5 kg (8 500 FCFA)
              </button>
              <button
                onClick={() => handleNavClick('produits_naturels')}
                className="text-left py-1 hover:text-[#1B4332] text-[#1B4332] font-semibold"
              >
                🌿 Produits Naturels & Bien-Être (14 soins)
              </button>
              <button
                onClick={() => handleNavClick('epicerie_gourmandises')}
                className="text-left py-1 hover:text-[#C5A059]"
              >
                🥜 Épicerie & Douceurs (Pistaches, Oud, Fruits séchés)
              </button>
              <button
                onClick={() => handleNavClick('coffrets_parfumerie')}
                className="text-left py-1 hover:text-[#C5A059]"
              >
                ✨ Coffret Musc + Oud (10 000 FCFA)
              </button>
            </div>

            <div className="pt-4 border-t border-[#EFE8DA] flex items-center justify-between text-xs text-[#5C3D2E]">
              <a
                href="#avis"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#2C1810]"
              >
                Avis Clients
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="text-[#C5A059] font-medium"
              >
                Administration Boutique
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
