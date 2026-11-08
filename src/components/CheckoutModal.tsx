import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, MapPin, Phone, User, CreditCard, ArrowLeft, Truck, AlertCircle } from 'lucide-react';
import { CartItem, DeliveryZone, Order, PaymentMethod, ShopSettings, Promotion } from '../types';
import { DELIVERY_ZONES } from '../data/initialProducts';
import { formatFCFA, validatePromoCode } from '../services/storage';
import { Tag, Sparkles } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderConfirmed: (order: Order) => void;
  settings: ShopSettings;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onOrderConfirmed,
  settings
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+221 ');
  const [email, setEmail] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState<string>(DELIVERY_ZONES[0].id);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Promo code state
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; promo?: Promotion } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  const selectedZone = DELIVERY_ZONES.find((z) => z.id === selectedZoneId) || DELIVERY_ZONES[0];
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const discountAmount = appliedPromo ? appliedPromo.discount : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);

  // Free delivery if subtotal >= freeDeliveryThreshold
  const isFreeDelivery = subtotal >= settings.freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : selectedZone.fee;
  const grandTotal = discountedSubtotal + deliveryFee;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    setPromoSuccess(null);

    if (!promoCodeInput.trim()) return;

    const res = validatePromoCode(promoCodeInput, subtotal);
    if (!res.valid) {
      setPromoError(res.error || 'Code promo invalide');
      setAppliedPromo(null);
    } else {
      setAppliedPromo({
        code: promoCodeInput.trim().toUpperCase(),
        discount: res.discount,
        promo: res.promo
      });
      setPromoSuccess(`Code ${promoCodeInput.trim().toUpperCase()} appliqué (-${formatFCFA(res.discount)}) !`);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoSuccess(null);
    setPromoError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Veuillez renseigner votre nom complet.');
      return;
    }

    const cleanPhone = phone.trim();
    if (cleanPhone.length < 8) {
      setErrorMsg('Veuillez indiquer un numéro de téléphone valide pour le livreur (ex: +221 77 123 45 67).');
      return;
    }

    if (!address.trim()) {
      setErrorMsg('Veuillez préciser votre adresse ou quartier de livraison.');
      return;
    }

    setSubmitting(true);

    const orderId = `FS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: fullName.trim(),
        phone: cleanPhone,
        email: email.trim() || undefined,
        region: selectedZone.name.split('/')[0].trim(),
        cityOrArea: selectedZone.name,
        address: address.trim(),
        notes: notes.trim() || undefined
      },
      items: cart.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        costPrice: i.product.costPrice,
        quantity: i.quantity,
        image: i.product.image
      })),
      subtotal,
      discount: discountAmount > 0 ? discountAmount : undefined,
      promoCode: appliedPromo?.code,
      deliveryFee,
      total: grandTotal,
      paymentMethod,
      paymentStatus: 'en_attente',
      status: 'nouvelle'
    };

    setTimeout(() => {
      setSubmitting(false);
      onOrderConfirmed(newOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-[#FAF7F2] rounded-2xl max-w-3xl w-full border border-[#DEBF6D]/40 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F7F3EB] border-b border-[#EFE8DA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1 text-[#5C3D2E] hover:text-[#2C1810] rounded-md transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-xl font-bold text-[#2C1810]">Finaliser votre Commande</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#5C3D2E] hover:text-[#2C1810] hover:bg-[#EFE8DA]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-semibold text-[#2C1810] flex items-center gap-2 border-b border-[#EFE8DA] pb-2">
              <User className="w-4 h-4 text-[#A8813C]" />
              <span>1. Vos Coordonnées</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#2C1810] mb-1">
                  Nom et Prénom <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Mariama Diallo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-sm text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2C1810] mb-1">
                  Numéro de Téléphone (WhatsApp de préférence) <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+221 77 000 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-sm text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#2C1810] mb-1">
                  Adresse e-mail (facultatif, pour reçu)
                </label>
                <input
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-sm text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Zone in Senegal */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-semibold text-[#2C1810] flex items-center gap-2 border-b border-[#EFE8DA] pb-2">
              <MapPin className="w-4 h-4 text-[#A8813C]" />
              <span>2. Lieu & Frais de Livraison au Sénégal</span>
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#2C1810]">
                Sélectionnez votre zone de livraison :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DELIVERY_ZONES.map((zone) => (
                  <label
                    key={zone.id}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      selectedZoneId === zone.id
                        ? 'border-[#2C1810] bg-[#F7F3EB] shadow-xs'
                        : 'border-[#EFE8DA] bg-white hover:border-[#DEBF6D]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="delivery_zone"
                          checked={selectedZoneId === zone.id}
                          onChange={() => setSelectedZoneId(zone.id)}
                          className="accent-[#2C1810]"
                        />
                        <span className="text-xs font-semibold text-[#2C1810]">{zone.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#A8813C] tabular-nums whitespace-nowrap">
                        {isFreeDelivery ? 'GRATUIT' : formatFCFA(zone.fee)}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#5C3D2E]/70 mt-1 pl-5">{zone.delay}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2C1810] mb-1">
                Adresse précise ou repère de livraison <span className="text-red-600">*</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder="Ex : Mermoz Pyrotechnie, près de la pharmacie, Immeuble blanc 2e étage..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-sm text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2C1810] mb-1">
                Instructions particulières pour le livreur (optionnel)
              </label>
              <input
                type="text"
                placeholder="Ex : Appeler 15 min avant l’arrivée, livraison avant 17h..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-sm text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          {/* Section 3: Payment Options Senegal */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-semibold text-[#2C1810] flex items-center gap-2 border-b border-[#EFE8DA] pb-2">
              <CreditCard className="w-4 h-4 text-[#A8813C]" />
              <span>3. Mode de Paiement</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Cash on Delivery */}
              <label
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-[#2C1810] bg-[#F7F3EB] shadow-xs'
                    : 'border-[#EFE8DA] bg-white hover:border-[#DEBF6D]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-[#2C1810]"
                  />
                  <span className="text-xs font-bold text-[#2C1810]">Paiement à la livraison</span>
                </div>
                <p className="text-[11px] text-[#5C3D2E]/70 mt-1 pl-5">
                  Réglez en espèces directement auprès du livreur à la réception.
                </p>
              </label>

              {/* Wave Senegal */}
              <label
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'wave'
                    ? 'border-[#2C1810] bg-[#F7F3EB] shadow-xs'
                    : 'border-[#EFE8DA] bg-white hover:border-[#DEBF6D]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'wave'}
                    onChange={() => setPaymentMethod('wave')}
                    className="accent-[#2C1810]"
                  />
                  <span className="text-xs font-bold text-[#1DA1F2]">Wave Sénégal</span>
                </div>
                <p className="text-[11px] text-[#5C3D2E]/70 mt-1 pl-5">
                  Transfert instantané sans frais via l’application Wave.
                </p>
              </label>

              {/* Orange Money Senegal */}
              <label
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'orange_money'
                    ? 'border-[#2C1810] bg-[#F7F3EB] shadow-xs'
                    : 'border-[#EFE8DA] bg-white hover:border-[#DEBF6D]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'orange_money'}
                    onChange={() => setPaymentMethod('orange_money')}
                    className="accent-[#2C1810]"
                  />
                  <span className="text-xs font-bold text-[#FF6600]">Orange Money</span>
                </div>
                <p className="text-[11px] text-[#5C3D2E]/70 mt-1 pl-5">
                  Paiement sécurisé via code marchand ou transfert OM Sénégal.
                </p>
              </label>
            </div>
          </div>

          {/* Promo Code Input Section */}
          <div className="p-4 bg-white rounded-xl border border-[#EFE8DA] space-y-2">
            <label className="block text-xs font-semibold text-[#2C1810] uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#A8813C]" />
              Code Promotionnel
            </label>

            {!appliedPromo ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="EX : FATIMA10 ou BIENVENUE"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 bg-stone-50 border border-[#EFE8DA] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-[#2C1810] hover:bg-[#3E2419] text-[#DEBF6D] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Appliquer
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-medium">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>
                    Code <strong className="font-mono">{appliedPromo.code}</strong> appliqué (-{formatFCFA(appliedPromo.discount)})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  className="text-stone-400 hover:text-red-500 font-semibold text-xs ml-2"
                >
                  Retirer
                </button>
              </div>
            )}

            {promoError && (
              <p className="text-[11px] text-red-600 font-medium">{promoError}</p>
            )}
            {promoSuccess && !promoError && !appliedPromo && (
              <p className="text-[11px] text-emerald-600 font-medium">{promoSuccess}</p>
            )}
          </div>

          {/* Order Summary & Final Total */}
          <div className="p-4 bg-[#F7F3EB] rounded-xl border border-[#EFE8DA] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#5C3D2E]">
              <span>Sous-total ({cart.reduce((t, i) => t + i.quantity, 0)} articles)</span>
              <span className="font-semibold text-[#2C1810] tabular-nums">{formatFCFA(subtotal)}</span>
            </div>

            {appliedPromo && (
              <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
                <span>Réduction ({appliedPromo.code})</span>
                <span className="font-bold tabular-nums">-{formatFCFA(appliedPromo.discount)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-[#5C3D2E]">
              <span>Frais de livraison ({selectedZone.name.split('/')[0].trim()})</span>
              <span className="font-semibold text-[#A8813C] tabular-nums">
                {isFreeDelivery ? 'GRATUIT' : formatFCFA(deliveryFee)}
              </span>
            </div>

            <div className="pt-2 border-t border-[#EFE8DA] flex items-center justify-between text-lg font-serif font-bold text-[#2C1810]">
              <span>Total à régler</span>
              <span className="text-xl tabular-nums text-[#2C1810]">{formatFCFA(grandTotal)}</span>
            </div>
          </div>

          {/* Submit button */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 bg-[#2C1810] text-[#DEBF6D] hover:bg-[#3E2419] rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-widest transition-all duration-200 shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 active:scale-98"
            >
              {submitting ? (
                <span>Validation en cours...</span>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-[#DEBF6D]" />
                  <span>Confirmer la commande ({formatFCFA(grandTotal)})</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-[#5C3D2E]/70">
              <ShieldCheck className="w-4 h-4 text-[#A8813C]" />
              <span>Commande garantie par FATIMA SHOP Dakar · Service client WhatsApp disponible</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
