import React, { useState, useEffect } from 'react';
import {
  X, ShoppingBag, MessageCircle, Share2, Check, Star, Truck,
  CheckCircle2, ZoomIn, ShieldCheck, Camera, Sparkles
} from 'lucide-react';
import { Product, ShopSettings } from '../types';
import { formatFCFA, buildWhatsAppProductDirectOrderUrl } from '../services/storage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  settings: ShopSettings;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  settings
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // Gallery of photos for this product
  const gallery = (product.images && product.images.length > 0)
    ? product.images
    : [product.image];

  // Reset active image when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
  }, [product.id]);

  const currentDisplayImage = gallery[activeImageIndex] || product.image;
  const totalPrice = product.price * quantity;
  const isVerifiedPhoto = product.photoVerificationStatus !== 'temporary' && product.isVerifiedPhoto !== false;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `FATIMA SHOP - ${product.name}`,
          text: `${product.name} disponible chez FATIMA SHOP Dakar à ${formatFCFA(product.price)}`,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const whatsappDirectOrderUrl = buildWhatsAppProductDirectOrderUrl(product, quantity, settings);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
        {/* Modal Dialog */}
        <div className="relative bg-[#FAF7F2] rounded-2xl max-w-4xl w-full border border-[#DEBF6D]/40 shadow-2xl overflow-hidden my-6 animate-scale-up">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#FAF7F2]/90 hover:bg-[#FAF7F2] text-[#2C1810] hover:text-[#A8813C] shadow-xs transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
            {/* Left Column: Image Gallery */}
            <div className="md:col-span-6 bg-[#F7F3EB] relative p-6 flex flex-col justify-between">
              {/* Main Photo Container with Zoom affordance */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-md border border-[#EFE8DA] flex items-center justify-center group">
                <img
                  src={currentDisplayImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                  referrerPolicy="no-referrer"
                  onClick={() => setIsZoomOpen(true)}
                />

                {/* Zoom Icon Button */}
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="absolute bottom-3 right-3 p-2 rounded-full bg-[#FAF7F2]/90 hover:bg-white text-[#2C1810] shadow-md transition-opacity cursor-pointer"
                  title="Agrandir la photo"
                >
                  <ZoomIn className="w-4 h-4 text-[#A8813C]" />
                </button>

                {/* Price Tag Badge */}
                {product.category.startsWith('parfum') ? (
                  <span className="absolute top-3 left-3 text-xs uppercase font-bold tracking-wider px-3 py-1 rounded bg-[#C5A059] text-[#2C1810] shadow-sm">
                    Parfum · 8 000 FCFA
                  </span>
                ) : product.id === 'prod-savon-hamam-5kg' ? (
                  <span className="absolute top-3 left-3 text-xs uppercase font-bold tracking-wider px-3 py-1 rounded bg-[#2C1810] text-[#DEBF6D] shadow-sm">
                    Lot de 5 kg · {formatFCFA(product.price)}
                  </span>
                ) : (
                  <span className="absolute top-3 left-3 text-xs uppercase font-bold tracking-wider px-3 py-1 rounded bg-[#2C1810] text-[#DEBF6D] shadow-sm">
                    {product.categoryLabel} · {formatFCFA(product.price)}
                  </span>
                )}
              </div>

              {/* Photo Verification Banner */}
              <div className="mt-3 py-2 px-3 rounded-xl bg-white/80 border border-[#EFE8DA] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-semibold text-[#2C1810]">
                  {isVerifiedPhoto ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Photographie Officielle Vérifiée</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Photo représentative temporaire</span>
                    </>
                  )}
                </div>
                <span className="text-[10px] text-[#5C3D2E]/70 font-medium">FATIMA SHOP Dakar</span>
              </div>

              {/* Secondary Thumbnails Gallery */}
              {gallery.length > 1 && (
                <div className="mt-3">
                  <span className="text-[11px] font-semibold text-[#5C3D2E] block mb-2 uppercase tracking-wider">
                    Vues du flacon ({gallery.length} photos disponibles) :
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {gallery.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden border shrink-0 transition-all cursor-pointer ${
                          activeImageIndex === idx
                            ? 'border-[#2C1810] ring-2 ring-[#C5A059] shadow-xs'
                            : 'border-[#EFE8DA] hover:border-[#C5A059]/60'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${product.name} vue ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Contiguous Purchase Module */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Category & Status */}
                <div className="flex items-center justify-between text-xs text-[#A8813C] uppercase tracking-wider font-semibold">
                  <span>{product.categoryLabel}</span>
                  <span className="text-[#5C3D2E]/80 font-normal">{product.volumeOrWeight}</span>
                </div>

                {/* Title */}
                <h2 className="font-serif text-3xl sm:text-4xl text-[#2C1810] font-normal leading-tight">
                  {product.name}
                </h2>

                {/* Rating & Stock */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center text-[#DEBF6D]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'fill-current' : 'text-[#DEBF6D]/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-[#2C1810] tabular-nums">{product.rating.toFixed(1)}</span>
                  <span className="text-[#5C3D2E]/60">({product.reviewsCount} avis)</span>
                  <span className="text-emerald-700 font-medium">· En stock ({product.stock} dispo)</span>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="font-serif text-3xl font-extrabold text-[#2C1810] tabular-nums">
                    {formatFCFA(product.price)}
                  </span>
                  <span className="text-xs text-[#5C3D2E]">
                    {product.id === 'prod-savon-hamam-5kg' ? 'le lot de 5 kg' : `Format : ${product.volumeOrWeight}`}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-[#5C3D2E] font-light leading-relaxed">
                  {product.fullDesc}
                </p>

                {/* Official Pricing Calculation Examples */}
                <div className="p-3 bg-[#F7F3EB] rounded-xl border border-[#EFE8DA] text-xs text-[#5C3D2E] space-y-1">
                  <p className="font-semibold text-[#2C1810]">
                    {product.category.startsWith('parfum')
                      ? 'Tarif Officiel Parfumerie :'
                      : product.id === 'prod-savon-hamam-5kg'
                      ? 'Tarif Savon Hamam 5 kg :'
                      : `Tarification ${product.categoryLabel} :`}
                  </p>
                  {product.category.startsWith('parfum') ? (
                    <p>
                      1 parfum = <strong>8 000 FCFA</strong> · 2 parfums = <strong>16 000 FCFA</strong> · 3 parfums = <strong>24 000 FCFA</strong>
                    </p>
                  ) : product.id === 'prod-savon-hamam-5kg' ? (
                    <p>
                      1 lot (5 kg) = <strong>{formatFCFA(product.price)}</strong> · 2 lots (10 kg) = <strong>{formatFCFA(product.price * 2)}</strong>
                    </p>
                  ) : (
                    <p>
                      Prix unitaire ({product.volumeOrWeight}) = <strong>{formatFCFA(product.price)}</strong> · {quantity} sélectionné(s) = <strong>{formatFCFA(product.price * quantity)}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="space-y-4 pt-4 border-t border-[#EFE8DA]">
                {/* Quantity selector with real-time total */}
                <div className="flex items-center justify-between text-xs font-medium text-[#2C1810]">
                  <span>Quantité désirée :</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[#EFE8DA] bg-white rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1.5 hover:bg-[#F7F3EB] text-sm text-[#2C1810] font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 text-xs font-semibold tabular-nums">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-3 py-1.5 hover:bg-[#F7F3EB] text-sm text-[#2C1810] font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-serif font-bold text-sm text-[#2C1810] tabular-nums">
                      Total : {formatFCFA(totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons: WhatsApp & Add to Cart */}
                <div className="space-y-2.5">
                  <a
                    href={whatsappDirectOrderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wider bg-[#25D366] text-white hover:bg-[#20ba59] transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>Commander sur WhatsApp ({formatFCFA(totalPrice)})</span>
                  </a>

                  <button
                    onClick={handleAddToCart}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 border border-[#2C1810] flex items-center justify-center gap-2 cursor-pointer ${
                      addedNotice
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-[#FAF7F2] text-[#2C1810] hover:bg-[#2C1810] hover:text-white'
                    }`}
                  >
                    {addedNotice ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Ajouté au panier !</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Ajouter au panier ({quantity})</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Share & WhatsApp contact notice */}
                <div className="flex items-center justify-between text-xs text-[#5C3D2E]/70 pt-1">
                  <button
                    onClick={handleShare}
                    className="hover:text-[#2C1810] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Lien copié !' : 'Partager'}</span>
                  </button>

                  <div className="flex items-center gap-1 text-[11px] text-[#A8813C]">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Commandes WhatsApp au 76 140 34 64</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox High-Resolution Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-3xl max-h-[90vh] flex flex-col items-center">
            <img
              src={currentDisplayImage}
              alt={product.name}
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/20"
              referrerPolicy="no-referrer"
            />
            <div className="mt-4 text-center text-white">
              <h3 className="font-serif text-xl font-bold">{product.name}</h3>
              <p className="text-xs text-[#DEBF6D]">Photographie Haute Définition · FATIMA SHOP Dakar</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
