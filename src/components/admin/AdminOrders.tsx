import React, { useState } from 'react';
import {
  Search, MessageCircle, Download, CheckCircle2, Clock, Truck,
  XCircle, Package, Calendar, Phone, MapPin, AlertCircle, Trash2
} from 'lucide-react';
import { Order, OrderStatus, ShopSettings } from '../../types';
import { formatFCFA, exportOrdersToCSV, buildWhatsAppStatusUpdateUrl } from '../../services/storage';

interface AdminOrdersProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  settings: ShopSettings;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  onUpdateStatus,
  onDeleteOrder,
  settings
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statusConfigs: Record<
    string,
    { label: string; badgeClass: string; icon: React.FC<{ className?: string }> }
  > = {
    nouvelle: {
      label: 'Nouvelle commande',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Clock
    },
    en_attente: {
      label: 'En attente de confirmation',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Clock
    },
    confirmee: {
      label: 'Confirmée',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: CheckCircle2
    },
    en_preparation: {
      label: 'En préparation',
      badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: Package
    },
    en_livraison: {
      label: 'En livraison',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Truck
    },
    livree: {
      label: 'Livrée',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: CheckCircle2
    },
    annulee: {
      label: 'Annulée',
      badgeClass: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle
    },
    // Backwards compatibility with standard codes
    pending: { label: 'En attente', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
    confirmed: { label: 'Confirmée', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle2 },
    shipping: { label: 'En livraison', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200', icon: Truck },
    delivered: { label: 'Livrée', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
    cancelled: { label: 'Annulée', badgeClass: 'bg-red-100 text-red-800 border-red-200', icon: XCircle }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending' && !(o.status === 'nouvelle' || o.status === 'en_attente' || o.status === 'pending')) return false;
      if (statusFilter === 'active' && !(o.status === 'confirmee' || o.status === 'en_preparation' || o.status === 'confirmed')) return false;
      if (statusFilter === 'shipping' && !(o.status === 'en_livraison' || o.status === 'shipping')) return false;
      if (statusFilter === 'delivered' && !(o.status === 'livree' || o.status === 'delivered')) return false;
      if (statusFilter === 'cancelled' && !(o.status === 'annulee' || o.status === 'cancelled')) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customer.fullName.toLowerCase().includes(q);
      const matchPhone = o.customer.phone.includes(q);
      const matchCity = (o.customer.cityOrArea || '').toLowerCase().includes(q);
      return matchId || matchName || matchPhone || matchCity;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2C1810]">
            Suivi des Commandes ({orders.length})
          </h2>
          <p className="text-xs text-[#5C3D2E]">
            Gérez le cycle de vie complet de chaque commande et notifiez vos clients en un clic sur WhatsApp.
          </p>
        </div>

        <button
          onClick={() => exportOrdersToCSV(orders)}
          className="px-4 py-2 bg-white border border-[#EFE8DA] hover:bg-[#F7F3EB] text-[#2C1810] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#A8813C]" />
          <span>Exporter les Commandes (Excel/CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EFE8DA] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Rechercher par n° de commande, client, téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#EFE8DA] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
          />
          <Search className="w-4 h-4 text-[#5C3D2E]/60 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[#5C3D2E] whitespace-nowrap">Statut :</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF7F2] border border-[#EFE8DA] rounded-xl px-3 py-2 text-xs text-[#2C1810] focus:outline-none"
          >
            <option value="all">Toutes ({orders.length})</option>
            <option value="pending">En attente / Nouvelles</option>
            <option value="active">Confirmées / En préparation</option>
            <option value="shipping">En livraison</option>
            <option value="delivered">Livrées</option>
            <option value="cancelled">Annulées</option>
          </select>
        </div>
      </div>

      {/* Orders List Cards */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#EFE8DA] text-xs text-[#5C3D2E]">
            Aucune commande ne correspond aux filtres.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const config = statusConfigs[order.status] || {
              label: order.status,
              badgeClass: 'bg-slate-100 text-slate-800',
              icon: Clock
            };
            const StatusIcon = config.icon;

            const clientWhatsappUrl = buildWhatsAppStatusUpdateUrl(order, config.label, settings);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#EFE8DA] hover:border-[#DEBF6D]/60 p-5 shadow-xs transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#EFE8DA] pb-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-serif font-extrabold text-lg text-[#2C1810]">
                      #{order.id}
                    </span>
                    <span className="text-xs text-[#5C3D2E]/80 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#A8813C]" />
                      <span>{new Date(order.createdAt).toLocaleString('fr-FR')}</span>
                    </span>

                    {/* Badge */}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1 ${config.badgeClass}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{config.label}</span>
                    </span>
                  </div>

                  {/* Actions & WhatsApp button */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Direct WhatsApp Contact Button with pre-filled status */}
                    <a
                      href={clientWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-[#E8F8EE] text-[#25D366] hover:bg-[#d8f4e2] border border-[#25D366]/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                      title="Ouvrir WhatsApp avec un message pré-rempli pour ce client"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>Contacter Client sur WhatsApp</span>
                    </a>

                    {/* Change Status Dropdown */}
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-[#5C3D2E] text-[11px]">Changer état :</span>
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-[#FAF7F2] border border-[#DEBF6D] rounded-xl px-2.5 py-1 text-xs font-semibold text-[#2C1810] focus:outline-none cursor-pointer"
                      >
                        <option value="nouvelle">Nouvelle commande</option>
                        <option value="en_attente">En attente de confirmation</option>
                        <option value="confirmee">Confirmée</option>
                        <option value="en_preparation">En préparation</option>
                        <option value="en_livraison">En livraison</option>
                        <option value="livree">Livrée</option>
                        <option value="annulee">Annulée</option>
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Supprimer la commande #${order.id} ?`)) {
                          onDeleteOrder(order.id);
                        }
                      }}
                      className="p-1.5 text-[#5C3D2E]/60 hover:text-red-700 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                  {/* Customer Information (5 cols) */}
                  <div className="md:col-span-5 space-y-1.5 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EFE8DA]">
                    <span className="text-[11px] uppercase tracking-wider text-[#A8813C] font-semibold block">
                      Client & Livraison
                    </span>
                    <p className="font-bold text-[#2C1810] text-sm">
                      {order.customer.fullName}
                    </p>
                    <p className="flex items-center gap-1.5 text-[#5C3D2E]">
                      <Phone className="w-3.5 h-3.5 text-[#A8813C]" />
                      <strong className="text-[#2C1810]">{order.customer.phone}</strong>
                    </p>
                    <p className="flex items-start gap-1.5 text-[#5C3D2E]">
                      <MapPin className="w-3.5 h-3.5 text-[#A8813C] shrink-0 mt-0.5" />
                      <span>{order.customer.cityOrArea}, {order.customer.address}</span>
                    </p>
                    {order.customer.notes && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                        Note client : {order.customer.notes}
                      </p>
                    )}
                  </div>

                  {/* Items Ordered (4 cols) */}
                  <div className="md:col-span-4 space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-[#5C3D2E] font-semibold block">
                      Articles Commandés ({order.items.reduce((sum, i) => sum + i.quantity, 0)})
                    </span>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-1.5 bg-white border border-[#EFE8DA] rounded-lg">
                          <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded bg-[#FAF7F2]" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[#2C1810] truncate">{item.name}</p>
                            <p className="text-[11px] text-[#5C3D2E]">
                              {item.quantity} x {formatFCFA(item.price)}
                            </p>
                          </div>
                          <span className="font-bold text-[#2C1810] tabular-nums whitespace-nowrap">
                            {formatFCFA(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment & Financial Summary (3 cols) */}
                  <div className="md:col-span-3 space-y-1.5 text-right flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] text-[#5C3D2E] block">Mode de Paiement</span>
                      <span className="font-bold text-[#2C1810] uppercase text-xs">
                        {order.paymentMethod === 'cod' ? 'Paiement à la livraison' : order.paymentMethod.toUpperCase()}
                      </span>
                      <p className="text-[11px] mt-0.5">
                        Statut :{' '}
                        <strong
                          className={
                            order.paymentStatus === 'confirme'
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }
                        >
                          {order.paymentStatus === 'confirme' ? 'Paiement Confirmé' : 'En attente réception'}
                        </strong>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#EFE8DA]">
                      <div className="text-[11px] text-[#5C3D2E] flex justify-between">
                        <span>Sous-total :</span>
                        <span className="tabular-nums">{formatFCFA(order.subtotal)}</span>
                      </div>
                      <div className="text-[11px] text-[#5C3D2E] flex justify-between">
                        <span>Livraison :</span>
                        <span className="tabular-nums">
                          {order.deliveryFee === 0 ? 'OFFERTE' : formatFCFA(order.deliveryFee)}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline font-serif font-bold text-base text-[#2C1810] pt-1">
                        <span>Total :</span>
                        <span className="tabular-nums text-lg text-[#2C1810]">
                          {formatFCFA(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
