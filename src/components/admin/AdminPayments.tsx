import { useState } from 'react';
import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Smartphone,
  Banknote,
  Search,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';
import { Order, PaymentMethod, PaymentStatus, ShopSettings } from '../../types';
import { formatFCFA, updateOrderPaymentStatus } from '../../services/storage';

interface AdminPaymentsProps {
  orders: Order[];
  settings: ShopSettings;
  onRefreshOrders: () => void;
}

export default function AdminPayments({
  orders,
  settings,
  onRefreshOrders
}: AdminPaymentsProps) {
  const [methodFilter, setMethodFilter] = useState<'all' | PaymentMethod>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleUpdatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    updateOrderPaymentStatus(orderId, status);
    onRefreshOrders();
    showToast(
      status === 'confirme'
        ? `Paiement #${orderId} validé avec succès !`
        : `Statut paiement #${orderId} mis à jour : ${status}`
    );
  };

  // Calculations
  const totalPaidRevenue = orders
    .filter((o) => o.paymentStatus === 'confirme' || (o.paymentMethod === 'cod' && (o.status === 'livree' || o.status === 'delivered')))
    .reduce((sum, o) => sum + o.total, 0);

  const totalPendingRevenue = orders
    .filter((o) => o.paymentStatus !== 'confirme' && o.status !== 'annulee' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const waveOrders = orders.filter((o) => o.paymentMethod === 'wave');
  const waveTotal = waveOrders.reduce((sum, o) => sum + o.total, 0);

  const omOrders = orders.filter((o) => o.paymentMethod === 'orange_money');
  const omTotal = omOrders.reduce((sum, o) => sum + o.total, 0);

  const codOrders = orders.filter((o) => o.paymentMethod === 'cod');
  const codTotal = codOrders.reduce((sum, o) => sum + o.total, 0);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (methodFilter !== 'all' && o.paymentMethod !== methodFilter) return false;
    const currentStatus = o.paymentStatus || 'en_attente';
    if (statusFilter !== 'all' && currentStatus !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customer.fullName.toLowerCase().includes(q);
      const matchPhone = o.customer.phone.toLowerCase().includes(q);
      return matchId || matchName || matchPhone;
    }

    return true;
  });

  const getPaymentMethodBadge = (method: PaymentMethod) => {
    switch (method) {
      case 'wave':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1BA4E8]/10 text-[#1BA4E8] border border-[#1BA4E8]/30">
            <Smartphone className="w-3.5 h-3.5" /> Wave Sénégal
          </span>
        );
      case 'orange_money':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FF7900]/10 text-[#FF7900] border border-[#FF7900]/30">
            <Smartphone className="w-3.5 h-3.5" /> Orange Money
          </span>
        );
      case 'cod':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            <Banknote className="w-3.5 h-3.5 text-stone-600" /> Paiement à la livraison
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (status?: PaymentStatus) => {
    switch (status) {
      case 'confirme':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Confirmé
          </span>
        );
      case 'echoue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-500" /> Échoué / Refusé
          </span>
        );
      case 'en_attente':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> En attente de validation
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C1810] text-[#FCFAF7] px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-[#C5A059] animate-fade-in">
          <CheckCircle className="w-5 h-5 text-[#C5A059]" />
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#2C1810]">Gestion des Paiements</h2>
        <p className="text-sm text-stone-600 mt-1">
          Suivi des transactions Wave, Orange Money et espèces à la livraison. Validation manuelle requise pour les paiements mobiles.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Encaissé (Validé)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-serif text-emerald-700">
            {formatFCFA(totalPaidRevenue)}
          </div>
          <p className="text-xs text-stone-500 mt-1">Fonds confirmés dans la caisse</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>En attente de paiement</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-serif text-amber-800">
            {formatFCFA(totalPendingRevenue)}
          </div>
          <p className="text-xs text-stone-500 mt-1">À vérifier ou à la livraison</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Wave Sénégal</span>
            <div className="w-8 h-8 rounded-lg bg-[#1BA4E8]/10 text-[#1BA4E8] flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-serif text-[#1BA4E8]">
            {formatFCFA(waveTotal)}
          </div>
          <p className="text-xs text-stone-500 mt-1">{waveOrders.length} transaction(s)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Orange Money & Espèces</span>
            <div className="w-8 h-8 rounded-lg bg-[#FF7900]/10 text-[#FF7900] flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-serif text-[#2C1810]">
            {formatFCFA(omTotal + codTotal)}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            OM: {formatFCFA(omTotal)} • Espèces: {formatFCFA(codTotal)}
          </p>
        </div>
      </div>

      {/* Notice on Mobile Payment Validation */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <span className="font-semibold">Procédure de validation des paiements Wave et Orange Money :</span>
          <p className="mt-0.5 text-xs text-amber-800 leading-relaxed">
            Pour tout paiement mobile, vérifiez la réception du SMS ou la notification sur votre application marchand Wave / Orange Money liée au <strong>{settings.displayPhone}</strong> avant de cliquer sur <span className="underline font-semibold">« Confirmer Réception »</span>.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Rechercher par n° commande, nom du client ou numéro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400" />
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as any)}
              className="text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
            >
              <option value="all">Tous les moyens</option>
              <option value="wave">Wave Sénégal</option>
              <option value="orange_money">Orange Money</option>
              <option value="cod">Paiement à la livraison</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
          >
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente de validation</option>
            <option value="confirme">Confirmé</option>
            <option value="echoue">Échoué / Refusé</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-700">
            <thead className="bg-[#FAF7F2] text-xs font-semibold uppercase tracking-wider text-stone-600 border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">Commande</th>
                <th className="px-5 py-3.5">Client</th>
                <th className="px-5 py-3.5">Moyen de paiement</th>
                <th className="px-5 py-3.5">Montant</th>
                <th className="px-5 py-3.5">Statut Paiement</th>
                <th className="px-5 py-3.5">Date & Heure</th>
                <th className="px-5 py-3.5 text-right">Action Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-stone-400">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                    Aucun paiement ne correspond à ces critères.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const paymentStatus = order.paymentStatus || 'en_attente';
                  const isConfirmed = paymentStatus === 'confirme';

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-[#2C1810]">
                        #{order.id}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-stone-900">{order.customer.fullName}</div>
                        <div className="text-xs text-stone-500">{order.customer.phone}</div>
                      </td>
                      <td className="px-5 py-4">
                        {getPaymentMethodBadge(order.paymentMethod)}
                      </td>
                      <td className="px-5 py-4 font-bold text-stone-900">
                        {formatFCFA(order.total)}
                      </td>
                      <td className="px-5 py-4">
                        {getPaymentStatusBadge(order.paymentStatus)}
                        {order.paymentConfirmedAt && (
                          <div className="text-[11px] text-stone-400 mt-0.5">
                            Validé le {new Date(order.paymentConfirmedAt).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-stone-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isConfirmed ? (
                            <button
                              onClick={() => handleUpdatePaymentStatus(order.id, 'confirme')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                              title="Confirmer la réception effective des fonds"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Valider paiement
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdatePaymentStatus(order.id, 'en_attente')}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                              title="Remettre en attente"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              Annuler validation
                            </button>
                          )}

                          {paymentStatus !== 'echoue' && !isConfirmed && (
                            <button
                              onClick={() => handleUpdatePaymentStatus(order.id, 'echoue')}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Marquer comme échoué"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
