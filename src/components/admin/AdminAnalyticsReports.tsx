import { useState } from 'react';
import {
  TrendingUp,
  Download,
  Printer,
  DollarSign,
  ShoppingBag,
  Percent,
  Calendar,
  Users,
  Award,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { Order, Product } from '../../types';
import {
  formatFCFA,
  exportOrdersToCSV,
  exportProductsToCSV
} from '../../services/storage';

interface AdminAnalyticsReportsProps {
  orders: Order[];
  products: Product[];
}

export default function AdminAnalyticsReports({
  orders,
  products
}: AdminAnalyticsReportsProps) {
  const [period, setPeriod] = useState<'all' | 'month' | 'week' | 'today'>('all');

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Filter orders by chosen period
  const periodOrders = orders.filter((o) => {
    if (o.status === 'annulee' || o.status === 'cancelled') return false;
    const orderDate = new Date(o.createdAt);

    if (period === 'today') {
      return o.createdAt.startsWith(todayStr);
    }
    if (period === 'week') {
      return orderDate >= oneWeekAgo;
    }
    if (period === 'month') {
      return orderDate >= startOfMonth;
    }
    return true;
  });

  // Financial calculations
  const totalTurnover = periodOrders.reduce((sum, o) => sum + o.total, 0);
  const totalSubtotal = periodOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalDeliveryFees = periodOrders.reduce((sum, o) => sum + o.deliveryFee, 0);
  const totalDiscounts = periodOrders.reduce((sum, o) => sum + (o.discount || 0), 0);
  const orderCount = periodOrders.length;
  const averageBasket = orderCount > 0 ? Math.round(totalTurnover / orderCount) : 0;

  // Estimated profit calculations based on product costPrice
  let totalCost = 0;
  let totalItemsSold = 0;

  periodOrders.forEach((o) => {
    o.items.forEach((item) => {
      totalItemsSold += item.quantity;
      const matchingProduct = products.find((p) => p.id === item.productId);
      const unitCost = item.costPrice || (matchingProduct?.costPrice) || Math.round(item.price * 0.65);
      totalCost += unitCost * item.quantity;
    });
  });

  const estimatedProfit = Math.max(0, totalSubtotal - totalDiscounts - totalCost);
  const profitMarginPercent = totalSubtotal > 0 ? Math.round((estimatedProfit / totalSubtotal) * 100) : 0;

  // Product sales breakdown
  const productSalesMap = new Map<
    string,
    { name: string; quantity: number; revenue: number; category: string }
  >();

  periodOrders.forEach((o) => {
    o.items.forEach((item) => {
      const existing = productSalesMap.get(item.productId);
      const matchingProduct = products.find((p) => p.id === item.productId);
      if (!existing) {
        productSalesMap.set(item.productId, {
          name: item.name,
          quantity: item.quantity,
          revenue: item.price * item.quantity,
          category: matchingProduct?.categoryLabel || 'Produit'
        });
      } else {
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
      }
    });
  });

  const topProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#2C1810]">
            Rapports & Analyses Financières
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Bilan d'activité commerciale, estimation des marges bénéficiaires et performance des ventes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportOrdersToCSV(orders)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            Export Commandes (CSV)
          </button>

          <button
            onClick={() => exportProductsToCSV(products)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            Export Catalogue (CSV)
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2C1810] hover:bg-black text-[#FCFAF7] rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
            Imprimer / PDF
          </button>
        </div>
      </div>

      {/* Period Selector Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-stone-200/80 shadow-sm flex flex-wrap gap-1">
        <button
          onClick={() => setPeriod('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            period === 'all'
              ? 'bg-[#C5A059] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          Historique Global
        </button>
        <button
          onClick={() => setPeriod('month')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            period === 'month'
              ? 'bg-[#C5A059] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          Ce mois ({now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })})
        </button>
        <button
          onClick={() => setPeriod('week')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            period === 'week'
              ? 'bg-[#C5A059] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          7 derniers jours
        </button>
        <button
          onClick={() => setPeriod('today')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            period === 'today'
              ? 'bg-[#C5A059] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          Aujourd'hui
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Chiffre d'Affaires */}
        <div className="bg-gradient-to-br from-[#2C1810] to-[#3D251A] text-[#FCFAF7] p-5 rounded-2xl shadow-md border border-[#C5A059]/30">
          <div className="flex items-center justify-between text-stone-300 text-xs font-semibold uppercase tracking-wider">
            <span>Chiffre d'Affaires</span>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#C5A059]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-serif text-[#FCFAF7]">
            {formatFCFA(totalTurnover)}
          </div>
          <div className="mt-2 text-xs text-[#DEBF6D] flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            {orderCount} commande(s) validée(s)
          </div>
        </div>

        {/* Bénéfice Estimé & Marge */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Bénéfice Net Estimé</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-serif text-emerald-700">
            {formatFCFA(estimatedProfit)}
          </div>
          <div className="mt-2 text-xs text-stone-500 flex items-center justify-between">
            <span>Marge commerciale :</span>
            <span className="font-bold text-emerald-600">~{profitMarginPercent}%</span>
          </div>
        </div>

        {/* Panier Moyen */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Panier Moyen</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-serif text-[#2C1810]">
            {formatFCFA(averageBasket)}
          </div>
          <p className="text-xs text-stone-500 mt-2">Dépense moyenne par cliente</p>
        </div>

        {/* Total Articles Vendus */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Articles Vendus</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#C5A059] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-serif text-[#2C1810]">
            {totalItemsSold} unités
          </div>
          <p className="text-xs text-stone-500 mt-2">Parfums & savons distribués</p>
        </div>
      </div>

      {/* Financial Details Table & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Breakdown Breakdown */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-[#2C1810] flex items-center gap-2">
            <Percent className="w-4 h-4 text-[#C5A059]" />
            Décomposition Financière
          </h3>

          <div className="space-y-3 text-sm text-stone-700">
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Sous-total Produits :</span>
              <span className="font-semibold text-stone-900">{formatFCFA(totalSubtotal)}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Remises & Codes Promo :</span>
              <span className="font-semibold text-red-600">-{formatFCFA(totalDiscounts)}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Frais de livraison perçus :</span>
              <span className="font-semibold text-stone-900">{formatFCFA(totalDeliveryFees)}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Coût estimé des marchandises :</span>
              <span className="font-semibold text-stone-600">-{formatFCFA(totalCost)}</span>
            </div>

            <div className="flex justify-between py-2.5 bg-[#FAF7F2] px-3 rounded-xl border border-[#C5A059]/30">
              <span className="font-bold text-[#2C1810]">Marge Nette :</span>
              <span className="font-bold text-emerald-700">{formatFCFA(estimatedProfit)}</span>
            </div>
          </div>

          <p className="text-[11px] text-stone-400 leading-relaxed italic">
            * Les coûts d'achat sont calculés à partir de la valeur de revient renseignée par l'administrateur pour chaque produit ou une estimation standard de 65%.
          </p>
        </div>

        {/* Top Performing Products */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
          <h3 className="font-serif font-bold text-base text-[#2C1810] flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C5A059]" />
              Palmarès des Ventes (Période sélectionnée)
            </div>
            <span className="text-xs font-normal text-stone-500">Classé par revenus</span>
          </h3>

          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <div className="py-8 text-center text-sm text-stone-400">
                Aucune vente enregistrée sur cette période.
              </div>
            ) : (
              topProducts.map((p, idx) => {
                const percentage = totalSubtotal > 0 ? Math.round((p.revenue / totalSubtotal) * 100) : 0;
                return (
                  <div key={idx} className="p-3.5 bg-stone-50/70 rounded-xl border border-stone-200/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#FAF7F2] text-[#C5A059] border border-[#C5A059]/40 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-sm text-stone-900">{p.name}</div>
                          <div className="text-[11px] text-stone-500">{p.category}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-sm text-[#2C1810]">{formatFCFA(p.revenue)}</div>
                        <div className="text-xs text-stone-500">{p.quantity} vendus ({percentage}%)</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#C5A059] h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
