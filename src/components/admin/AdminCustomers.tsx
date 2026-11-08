import React, { useState } from 'react';
import { Search, Phone, Mail, MapPin, ShoppingBag, MessageCircle, Award, Calendar } from 'lucide-react';
import { CustomerProfile, Order, ShopSettings } from '../../types';
import { formatFCFA } from '../../services/storage';

interface AdminCustomersProps {
  customers: CustomerProfile[];
  orders: Order[];
  settings: ShopSettings;
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({
  customers,
  orders,
  settings
}) => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  const filtered = customers.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.cityOrArea && c.cityOrArea.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const selectedCustomerOrders = selectedCustomer
    ? orders.filter((o) => selectedCustomer.orderIds.includes(o.id))
    : [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2C1810]">
            Répertoire des Clients ({customers.length})
          </h2>
          <p className="text-xs text-[#5C3D2E]">
            Consultez les coordonnées, l'historique complet des achats et fidélisez vos clientes et clients.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="p-2 bg-white rounded-xl border border-[#EFE8DA] font-semibold text-[#2C1810]">
            👑 {customers.filter((c) => c.isVip).length} Clients Réguliers / VIP
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#EFE8DA] shadow-xs text-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#EFE8DA] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
          />
          <Search className="w-4 h-4 text-[#5C3D2E]/60 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Grid: Customers List + Customer Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Customer Cards List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#EFE8DA] text-xs text-[#5C3D2E]">
              Aucun client trouvé.
            </div>
          ) : (
            filtered.map((c) => {
              const isSelected = selectedCustomer?.id === c.id;
              const waUrl = `https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Bonjour ${c.fullName} ✨ C'est FATIMA SHOP ! Nous vous remercions pour votre fidélité.`
              )}`;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#F7F3EB] border-[#2C1810] shadow-md'
                      : 'bg-white border-[#EFE8DA] hover:border-[#DEBF6D]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#2C1810] text-sm">{c.fullName}</h4>
                      {c.isVip && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DEBF6D]/30 text-[#88652A] border border-[#DEBF6D]">
                          Client Régulier / VIP
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#5C3D2E]">
                      <span className="flex items-center gap-1 font-medium text-[#2C1810]">
                        <Phone className="w-3.5 h-3.5 text-[#A8813C]" />
                        {c.phone}
                      </span>
                      {c.cityOrArea && (
                        <span className="flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-[#A8813C]" />
                          {c.cityOrArea}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#EFE8DA]">
                    <div className="text-left sm:text-right text-xs">
                      <span className="font-serif font-bold text-[#2C1810] block tabular-nums">
                        {formatFCFA(c.totalSpent)}
                      </span>
                      <span className="text-[11px] text-[#A8813C] font-semibold">
                        {c.totalOrders} commande{c.totalOrders > 1 ? 's' : ''}
                      </span>
                    </div>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-[#E8F8EE] text-[#25D366] hover:bg-[#d8f4e2] rounded-xl border border-[#25D366]/40 transition-colors"
                      title="Contacter sur WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Customer History Inspector (5 cols) */}
        <div className="lg:col-span-5">
          {selectedCustomer ? (
            <div className="bg-white p-6 rounded-2xl border border-[#DEBF6D] shadow-md sticky top-6 space-y-5 text-xs">
              <div className="border-b border-[#EFE8DA] pb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                      {selectedCustomer.fullName}
                    </h3>
                    {selectedCustomer.isVip && (
                      <span title="Fidélité récompensée">
                        <Award className="w-4 h-4 text-[#A8813C]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#5C3D2E] mt-0.5">
                    Première commande : {new Date(selectedCustomer.firstOrderAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                <a
                  href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#25D366] text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Coordinates */}
              <div className="space-y-2 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EFE8DA]">
                <p className="text-[#2C1810]">
                  <strong>Téléphone :</strong> {selectedCustomer.phone}
                </p>
                {selectedCustomer.email && (
                  <p className="text-[#2C1810]">
                    <strong>Email :</strong> {selectedCustomer.email}
                  </p>
                )}
                <p className="text-[#2C1810]">
                  <strong>Dernière adresse :</strong> {selectedCustomer.cityOrArea}, {selectedCustomer.address}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[#EFE8DA] font-bold">
                  <span>Dépenses cumulées :</span>
                  <span className="font-serif text-sm text-[#A8813C] tabular-nums">
                    {formatFCFA(selectedCustomer.totalSpent)}
                  </span>
                </div>
              </div>

              {/* Orders History */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#2C1810]">
                  Historique des Commandes ({selectedCustomerOrders.length})
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 divide-y divide-[#EFE8DA]">
                  {selectedCustomerOrders.map((o) => (
                    <div key={o.id} className="pt-2 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-[#2C1810]">#{o.id}</span>
                        <p className="text-[11px] text-[#5C3D2E]">
                          {new Date(o.createdAt).toLocaleDateString('fr-FR')} · {o.items.length} articles
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#2C1810] tabular-nums">{formatFCFA(o.total)}</span>
                        <span className="block text-[10px] text-[#A8813C] capitalize">{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-[#EFE8DA] text-center text-xs text-[#5C3D2E] space-y-2">
              <ShoppingBag className="w-8 h-8 text-[#A8813C] mx-auto opacity-50" />
              <p className="font-semibold text-[#2C1810]">Sélectionnez un client</p>
              <p>Cliquez sur une fiche client pour voir ses coordonnées détaillées et son historique complet d'achats.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
