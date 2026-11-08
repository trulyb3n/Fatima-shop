import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle, Truck } from 'lucide-react';
import { CartItem, ShopSettings } from '../types';
import { formatFCFA } from '../services/storage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  settings: ShopSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  settings
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const remainingForFreeShipping = Math.max(0, settings.freeDeliveryThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / settings.freeDeliveryThreshold) * 100);

  // Quick WhatsApp cart message
  const handleWhatsAppQuickCart = () => {
    if (cart.length === 0) return;
    const itemsText = cart
      .map(
        (item) =>
          `• ${item.quantity}x ${item.product.name} (${item.product.volumeOrWeight}) : ${formatFCFA(
            item.product.price * item.quantity
          )} (${item.quantity} x ${formatFCFA(item.product.price)})`
      )
      .join('\n');

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const msg = `Bonjour FATIMA SHOP ✨
Je souhaite commander les articles suivants sur votre boutique :

📦 *DÉTAIL DE LA COMMANDE* (${totalCount} article${totalCount > 1 ? 's' : ''}) :
${itemsText}

⭐️ *MONTANT TOTAL DES PRODUITS* : *${formatFCFA(subtotal)}*

📍 *Livraison* : Dakar / Sénégal
Merci de me confirmer la disponibilité et le délai de livraison. Mon contact est le numéro depuis lequel j'envoie ce message.`;

    const phone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs transition-opacity duration-300">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl border-l border-[#DEBF6D]/30 flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#EFE8DA] flex items-center justify-between bg-[#F7F3EB]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#A8813C]" />
              <h2 className="font-serif text-xl font-bold text-[#2C1810]">Votre Panier</h2>
              <span className="text-xs bg-[#2C1810] text-[#DEBF6D] px-2 py-0.5 rounded-full font-medium">
                {cart.reduce((total, i) => total + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#5C3D2E] hover:text-[#2C1810] hover:bg-[#EFE8DA] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="bg-[#FAF7F2] px-6 py-3 border-b border-[#EFE8DA]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-[#5C3D2E]">
                <Truck className="w-3.5 h-3.5 text-[#A8813C]" />
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Plus que <strong className="text-[#2C1810]">{formatFCFA(remainingForFreeShipping)}</strong> pour la livraison offerte !
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold">🎉 Félicitations ! Livraison standard offerte</span>
                )}
              </span>
              <span className="text-[11px] font-bold text-[#A8813C] tabular-nums">
                {Math.round(freeShippingProgress)}%
              </span>
            </div>
            <div className="w-full bg-[#EFE8DA] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#C5A059] h-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#EFE8DA]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F7F3EB] flex items-center justify-center text-[#A8813C]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-lg font-medium text-[#2C1810]">Votre panier est vide</p>
                  <p className="text-xs text-[#5C3D2E]/70 max-w-xs">
                    Découvrez nos parfums envoûtants, nos savons noirs traditionnels et nos douceurs gourmandes.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#2C1810] text-[#FAF7F2] text-xs font-semibold rounded-full hover:bg-[#3E2419] transition-colors"
                >
                  Explorer la collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4 items-center">
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg bg-[#F7F3EB] border border-[#EFE8DA]"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-semibold text-[#2C1810] truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-[#A8813C] uppercase tracking-wider">
                      {item.product.volumeOrWeight}
                    </p>
                    <p className="text-xs font-semibold text-[#2C1810] mt-1 tabular-nums">
                      {formatFCFA(item.product.price * item.quantity)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-[#EFE8DA] bg-white rounded-md">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#F7F3EB] text-[#2C1810]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#F7F3EB] text-[#2C1810]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[#5C3D2E]/60 hover:text-red-700 transition-colors p-1"
                        title="Retirer cet article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#F7F3EB] border-t border-[#EFE8DA] space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#5C3D2E]">
                  <span>Sous-total articles</span>
                  <span className="font-medium text-[#2C1810] tabular-nums">{formatFCFA(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#5C3D2E]">
                  <span>Frais de livraison</span>
                  <span className="text-[11px] text-[#A8813C]">Calculés à la validation</span>
                </div>
                <div className="flex items-center justify-between text-base font-serif font-bold text-[#2C1810] pt-2 border-t border-[#EFE8DA]">
                  <span>Total estimé</span>
                  <span className="tabular-nums text-lg text-[#2C1810]">{formatFCFA(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={onProceedToCheckout}
                  className="w-full py-3.5 px-4 bg-[#2C1810] text-[#DEBF6D] hover:bg-[#3E2419] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <span>Passer à la caisse</span>
                  <ArrowRight className="w-4 h-4 text-[#DEBF6D]" />
                </button>

                <button
                  onClick={handleWhatsAppQuickCart}
                  className="w-full py-2.5 px-4 bg-white text-[#2C1810] border border-[#25D366] hover:bg-[#E8F8EE] rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Commander le panier sur WhatsApp</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-[#5C3D2E]/70 font-light">
                Paiement à la livraison · Wave Sénégal · Orange Money
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
