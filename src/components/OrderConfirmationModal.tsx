import React from 'react';
import { CheckCircle2, MessageCircle, Package, ArrowRight, Copy, Check } from 'lucide-react';
import { Order, ShopSettings } from '../types';
import { formatFCFA, buildWhatsAppOrderUrl } from '../services/storage';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  settings: ShopSettings;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  settings
}) => {
  if (!order) return null;

  const [copied, setCopied] = React.useState(false);

  const whatsappUrl = buildWhatsAppOrderUrl(order, settings);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paymentLabels: Record<string, { label: string; desc: string }> = {
    cod: {
      label: 'Paiement à la livraison',
      desc: 'Préparez le montant en espèces pour le livreur lors de la réception de votre colis.'
    },
    wave: {
      label: 'Paiement Wave Sénégal',
      desc: `Effectuez votre transfert Wave au numéro ${settings.displayPhone} en indiquant la référence ${order.id}.`
    },
    orange_money: {
      label: 'Orange Money Sénégal',
      desc: `Effectuez votre transfert Orange Money au ${settings.displayPhone} avec la référence ${order.id}.`
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-[#FAF7F2] rounded-2xl max-w-xl w-full border border-[#DEBF6D]/50 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-center my-6">
        {/* Celebration icon */}
        <div className="w-16 h-16 rounded-full bg-[#E8F8EE] text-[#25D366] flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[#A8813C] font-semibold">
            Merci pour votre confiance
          </span>
          <h2 className="font-serif text-3xl text-[#2C1810] font-normal">
            Commande Confirmée !
          </h2>
          <p className="text-xs sm:text-sm text-[#5C3D2E] max-w-md mx-auto font-light">
            Votre commande a bien été enregistrée par l’équipe <strong className="text-[#2C1810]">FATIMA SHOP</strong>. Nous préparons vos trésors avec le plus grand soin.
          </p>
        </div>

        {/* Order Reference Box */}
        <div className="bg-[#F7F3EB] rounded-xl p-4 border border-[#EFE8DA] flex items-center justify-between text-left">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#5C3D2E]/70 block">
              Numéro de commande
            </span>
            <span className="font-serif text-xl font-bold text-[#2C1810] tracking-wider">
              {order.id}
            </span>
          </div>
          <button
            onClick={handleCopyOrderId}
            className="flex items-center gap-1.5 text-xs text-[#A8813C] hover:text-[#2C1810] px-3 py-1.5 rounded-lg border border-[#DEBF6D]/40 bg-white hover:bg-[#FAF7F2] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié' : 'Copier'}</span>
          </button>
        </div>

        {/* Order Details Accordion / Summary */}
        <div className="bg-white rounded-xl p-4 border border-[#EFE8DA] text-left text-xs space-y-3">
          <div className="flex items-center justify-between font-medium text-[#2C1810] pb-2 border-b border-[#EFE8DA]">
            <span className="flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#A8813C]" />
              <span>Articles commandés ({order.items.reduce((s, i) => s + i.quantity, 0)})</span>
            </span>
            <span className="font-serif font-bold text-sm tabular-nums">{formatFCFA(order.total)}</span>
          </div>

          <div className="space-y-1.5 divide-y divide-[#EFE8DA]/50 max-h-36 overflow-y-auto">
            {order.items.map((item, idx) => (
              <div key={idx} className="pt-1.5 flex justify-between items-center text-[#5C3D2E]">
                <span className="truncate pr-2">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-semibold text-[#2C1810] tabular-nums whitespace-nowrap">
                  {formatFCFA(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery & Payment Info */}
          <div className="pt-2 border-t border-[#EFE8DA] space-y-1 text-[#5C3D2E]">
            <p>
              <strong className="text-[#2C1810]">Destinataire :</strong> {order.customer.fullName} ({order.customer.phone})
            </p>
            <p>
              <strong className="text-[#2C1810]">Livraison :</strong> {order.customer.cityOrArea}, {order.customer.address}
            </p>
            <div className="mt-2 p-2.5 rounded-lg bg-[#FAF7F2] border border-[#DEBF6D]/30">
              <p className="font-semibold text-[#2C1810]">
                {paymentLabels[order.paymentMethod]?.label}
              </p>
              <p className="text-[11px] text-[#5C3D2E] mt-0.5">
                {paymentLabels[order.paymentMethod]?.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Primary CTA: WhatsApp Confirmation Button */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 bg-[#25D366] text-white hover:bg-[#20ba59] rounded-xl text-xs sm:text-sm font-semibold tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Envoyer la commande sur WhatsApp pour validation immédiate</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-[#2C1810] bg-[#F7F3EB] hover:bg-[#EFE8DA] transition-colors cursor-pointer"
          >
            Retourner à la boutique
          </button>
        </div>
      </div>
    </div>
  );
};
