import React, { useState } from 'react';
import { ShoppingBag, Eye, Star, Check, MessageCircle, Zap } from 'lucide-react';
import { Product, ShopSettings } from '../types';
import { formatFCFA, buildWhatsAppProductDirectOrderUrl } from '../services/storage';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  settings?: ShopSettings;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onViewDetails,
  settings
}) => {
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (settings) {
      const url = buildWhatsAppProductDirectOrderUrl(product, 1, settings);
      window.open(url, '_blank');
    } else {
      onBuyNow(product);
    }
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group relative bg-[#FAF7F2] rounded-xl border border-[#EFE8DA] hover:border-[#DEBF6D]/70 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Top Media Container */}
      <div className="relative aspect-[4/3] w-full bg-[#F7F3EB] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Fallback pattern underneath if image fails */}
        <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#F7F3EB] to-[#EFE8DA] text-[#5C3D2E]">
          <span className="font-serif text-lg font-bold text-[#A8813C]">{product.name}</span>
          <span className="text-xs text-[#5C3D2E]/70 mt-1">{product.categoryLabel}</span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {product.category.startsWith('parfum') ? (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-[#C5A059] text-[#2C1810] shadow-xs">
              Parfum · 8 000 FCFA
            </span>
          ) : product.id === 'prod-savon-hamam-5kg' ? (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-sm bg-[#2C1810] text-[#DEBF6D] shadow-xs">
              Lot de 5 kg
            </span>
          ) : product.category === 'produits_naturels' ? (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-[#1B4332] text-[#FAF7F2] shadow-xs">
              Soin Naturel
            </span>
          ) : product.category === 'epicerie_gourmandises' ? (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-[#4A2810] text-[#DEBF6D] shadow-xs">
              Épicerie Fine
            </span>
          ) : product.category === 'coffrets_parfumerie' ? (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-[#2C1810] text-[#DEBF6D] shadow-xs">
              Coffret Prestige
            </span>
          ) : null}

          {product.isNew && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-[#2C1810] text-[#DEBF6D] shadow-xs">
              Nouveau
            </span>
          )}
          {product.isBestseller && !product.isNew && product.id !== 'prod-savon-hamam-5kg' && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-[#2C1810] text-[#DEBF6D] shadow-xs">
              Coup de Cœur
            </span>
          )}
        </div>

        {/* Multi-Photo Count Indicator */}
        {product.images && product.images.length > 1 && (
          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium shadow-xs">
            {product.images.length} photos
          </span>
        )}

        {/* Quick View Button overlay on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(product);
          }}
          className="absolute right-3 bottom-3 p-2 rounded-full bg-[#FAF7F2]/90 hover:bg-[#FAF7F2] text-[#2C1810] opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md backdrop-blur-xs cursor-pointer"
          title="Voir la fiche détaillée et la galerie photos"
        >
          <Eye className="w-4 h-4 text-[#A8813C]" />
        </button>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Weight unboxed */}
          <div className="flex items-center justify-between text-xs text-[#A8813C] font-semibold uppercase tracking-wider mb-1">
            <span>{product.categoryLabel}</span>
            <span className="text-[#5C3D2E]/80 font-normal">{product.volumeOrWeight}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2C1810] group-hover:text-[#A8813C] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#5C3D2E]">
            <div className="flex items-center text-[#DEBF6D]">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-[#2C1810] tabular-nums">{product.rating.toFixed(1)}</span>
            <span className="text-[#5C3D2E]/60 text-[11px]">({product.reviewsCount} avis)</span>
          </div>

          {/* Short description */}
          <p className="text-xs text-[#5C3D2E] font-light mt-2 line-clamp-2 leading-relaxed">
            {product.shortDesc}
          </p>
        </div>

        {/* Pricing & Mandatory Action Buttons */}
        <div className="pt-3 border-t border-[#EFE8DA] space-y-3">
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl font-extrabold text-[#2C1810] tabular-nums">
              {formatFCFA(product.price)}
            </span>
            <span className="text-[11px] text-[#A8813C] font-medium">
              {product.id === 'prod-savon-hamam-5kg' ? 'le lot de 5 kg' : product.volumeOrWeight}
            </span>
          </div>

          {/* Action Buttons: Required "Ajouter au panier" and "Commander sur WhatsApp" / "Commander maintenant" */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAdd}
              className={`py-2 px-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 border border-[#2C1810] flex items-center justify-center gap-1 cursor-pointer ${
                addedAnimation
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-transparent text-[#2C1810] hover:bg-[#2C1810] hover:text-[#FAF7F2]'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Ajouté !</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="truncate">Au panier</span>
                </>
              )}
            </button>

            <button
              onClick={handleWhatsAppOrder}
              className="py-2 px-2 rounded-lg text-xs font-semibold tracking-wide bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95"
              title="Commander sur WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="truncate">
                {product.id === 'prod-savon-hamam-5kg' ? 'Commander' : 'WhatsApp'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
