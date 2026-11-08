import React, { useMemo } from 'react';
import {
  DollarSign, ShoppingBag, Clock, CheckCircle2, Truck, XCircle,
  Users, PackageCheck, AlertOctagon, TrendingUp, ArrowUpRight, BarChart3, PieChart
} from 'lucide-react';
import { Product, Order, CustomerProfile } from '../../types';
import { formatFCFA } from '../../services/storage';

interface AdminOverviewProps {
  orders: Order[];
  products: Product[];
  customers: CustomerProfile[];
  onNavigateToTab: (tab: string) => void;
  onUpdateProduct?: (product: Product) => void;
  onRefreshData?: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  orders,
  products,
  customers,
  onNavigateToTab,
  onUpdateProduct,
  onRefreshData
}) => {

  // Real Financial & Order KPIs calculation based on actual store data
  const metrics = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 3600 * 1000).getTime();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let totalRevenue = 0;
    let todayRevenue = 0;
    let weekRevenue = 0;
    let monthRevenue = 0;

    let pendingCount = 0;
    let confirmedCount = 0;
    let inDeliveryCount = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;

    const validOrders = orders.filter((o) => o.status !== 'annulee' && o.status !== 'cancelled');

    validOrders.forEach((o) => {
      totalRevenue += o.total;
      const orderTime = new Date(o.createdAt).getTime();

      if (orderTime >= startOfToday) {
        todayRevenue += o.total;
      }
      if (orderTime >= startOfWeek) {
        weekRevenue += o.total;
      }
      if (orderTime >= startOfMonth) {
        monthRevenue += o.total;
      }
    });

    orders.forEach((o) => {
      const s = o.status;
      if (s === 'nouvelle' || s === 'en_attente' || s === 'pending') {
        pendingCount++;
      } else if (s === 'confirmee' || s === 'en_preparation' || s === 'confirmed') {
        confirmedCount++;
      } else if (s === 'en_livraison' || s === 'shipping') {
        inDeliveryCount++;
      } else if (s === 'livree' || s === 'delivered') {
        deliveredCount++;
      } else if (s === 'annulee' || s === 'cancelled') {
        cancelledCount++;
      }
    });

    const inStockProducts = products.filter((p) => p.stock > 0).length;
    const outOfStockProducts = products.filter((p) => p.stock === 0).length;

    return {
      totalRevenue,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      totalOrders: orders.length,
      pendingCount,
      confirmedCount,
      inDeliveryCount,
      deliveredCount,
      cancelledCount,
      customersCount: customers.length,
      inStockProducts,
      outOfStockProducts
    };
  }, [orders, products, customers]);

  // Product sales breakdown
  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; quantity: number; revenue: number; image: string }>();

    orders.forEach((o) => {
      if (o.status === 'annulee' || o.status === 'cancelled') return;
      o.items.forEach((item) => {
        const exist = map.get(item.name);
        if (!exist) {
          map.set(item.name, {
            name: item.name,
            quantity: item.quantity,
            revenue: item.price * item.quantity,
            image: item.image
          });
        } else {
          exist.quantity += item.quantity;
          exist.revenue += item.price * item.quantity;
        }
      });
    });

    return Array.from(map.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);

  // Category sales breakdown
  const categoryStats = useMemo(() => {
    let parfumsRev = 0;
    let savonsRev = 0;

    orders.forEach((o) => {
      if (o.status === 'annulee' || o.status === 'cancelled') return;
      o.items.forEach((item) => {
        if (item.name.toLowerCase().includes('savon')) {
          savonsRev += item.price * item.quantity;
        } else {
          parfumsRev += item.price * item.quantity;
        }
      });
    });

    const total = parfumsRev + savonsRev || 1;
    return {
      parfums: { revenue: parfumsRev, percent: Math.round((parfumsRev / total) * 100) },
      savons: { revenue: savonsRev, percent: Math.round((savonsRev / total) * 100) }
    };
  }, [orders]);

  // 7-Day sales curve data points
  const last7Days = useMemo(() => {
    const days: { label: string; dateStr: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 3600 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short' });
      const dayTotal = orders
        .filter((o) => o.status !== 'annulee' && o.status !== 'cancelled' && o.createdAt.startsWith(dateStr))
        .reduce((sum, o) => sum + o.total, 0);

      days.push({
        label: `${dayName} ${d.getDate()}`,
        dateStr,
        total: dayTotal
      });
    }
    return days;
  }, [orders]);

  const maxDailyTotal = Math.max(...last7Days.map((d) => d.total), 30000);

  return (
    <div className="space-y-8">
      {/* 1. Main Financial Metrics Strip (4 columns) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold text-[#2C1810]">
            Performance Financière en Direct
          </h2>
          <span className="text-xs text-[#A8813C] font-medium">Monnaie : Franc CFA (FCFA)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card: Total */}
          <div className="bg-white p-5 rounded-2xl border border-[#EFE8DA] shadow-xs hover:border-[#DEBF6D]/60 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#5C3D2E]/80 font-semibold">
                Chiffre d’Affaires Total
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#A8813C] flex items-center justify-center border border-[#EFE8DA]">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C1810] tabular-nums">
                {formatFCFA(metrics.totalRevenue)}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Commandes actives et confirmées</span>
              </p>
            </div>
          </div>

          {/* Card: Aujourd'hui */}
          <div className="bg-white p-5 rounded-2xl border border-[#EFE8DA] shadow-xs hover:border-[#DEBF6D]/60 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#5C3D2E]/80 font-semibold">
                Ventes du Jour
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#A8813C] flex items-center justify-center border border-[#EFE8DA]">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C1810] tabular-nums">
                {formatFCFA(metrics.todayRevenue)}
              </p>
              <p className="text-[11px] text-[#5C3D2E] mt-1">Aujourd’hui à Dakar & Régions</p>
            </div>
          </div>

          {/* Card: Semaine */}
          <div className="bg-white p-5 rounded-2xl border border-[#EFE8DA] shadow-xs hover:border-[#DEBF6D]/60 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#5C3D2E]/80 font-semibold">
                Ventes de la Semaine
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#A8813C] flex items-center justify-center border border-[#EFE8DA]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C1810] tabular-nums">
                {formatFCFA(metrics.weekRevenue)}
              </p>
              <p className="text-[11px] text-[#5C3D2E] mt-1">7 derniers jours glissants</p>
            </div>
          </div>

          {/* Card: Mois */}
          <div className="bg-white p-5 rounded-2xl border border-[#EFE8DA] shadow-xs hover:border-[#DEBF6D]/60 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#5C3D2E]/80 font-semibold">
                Ventes du Mois
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#A8813C] flex items-center justify-center border border-[#EFE8DA]">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C1810] tabular-nums">
                {formatFCFA(metrics.monthRevenue)}
              </p>
              <p className="text-[11px] text-[#5C3D2E] mt-1">Mois en cours</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Operational KPIs: Orders Statuses & Stocks */}
      <div>
        <h3 className="font-serif text-lg font-bold text-[#2C1810] mb-4">
          Statut des Commandes, Clients & Stocks
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total Orders */}
          <button
            onClick={() => onNavigateToTab('orders')}
            className="p-4 bg-white rounded-xl border border-[#EFE8DA] hover:border-[#2C1810] text-left transition-colors cursor-pointer group"
          >
            <span className="text-[11px] text-[#5C3D2E] block">Total Commandes</span>
            <span className="font-serif text-2xl font-bold text-[#2C1810] block mt-1 tabular-nums group-hover:text-[#A8813C]">
              {metrics.totalOrders}
            </span>
            <span className="text-[10px] text-[#A8813C] mt-0.5 block">Voir toutes →</span>
          </button>

          {/* Pending */}
          <button
            onClick={() => onNavigateToTab('orders')}
            className="p-4 bg-white rounded-xl border border-[#EFE8DA] hover:border-[#2C1810] text-left transition-colors cursor-pointer group"
          >
            <span className="text-[11px] text-amber-700 font-medium block">En attente</span>
            <span className="font-serif text-2xl font-bold text-amber-700 block mt-1 tabular-nums">
              {metrics.pendingCount}
            </span>
            <span className="text-[10px] text-[#5C3D2E]/70 mt-0.5 block">À confirmer</span>
          </button>

          {/* Confirmed / Prep */}
          <button
            onClick={() => onNavigateToTab('orders')}
            className="p-4 bg-white rounded-xl border border-[#EFE8DA] hover:border-[#2C1810] text-left transition-colors cursor-pointer group"
          >
            <span className="text-[11px] text-blue-700 font-medium block">Confirmées</span>
            <span className="font-serif text-2xl font-bold text-blue-700 block mt-1 tabular-nums">
              {metrics.confirmedCount}
            </span>
            <span className="text-[10px] text-[#5C3D2E]/70 mt-0.5 block">En préparation</span>
          </button>

          {/* Delivered */}
          <button
            onClick={() => onNavigateToTab('orders')}
            className="p-4 bg-white rounded-xl border border-[#EFE8DA] hover:border-[#2C1810] text-left transition-colors cursor-pointer group"
          >
            <span className="text-[11px] text-emerald-700 font-medium block">Livrées</span>
            <span className="font-serif text-2xl font-bold text-emerald-700 block mt-1 tabular-nums">
              {metrics.deliveredCount}
            </span>
            <span className="text-[10px] text-[#5C3D2E]/70 mt-0.5 block">Réceptionnées</span>
          </button>

          {/* Cancelled */}
          <button
            onClick={() => onNavigateToTab('orders')}
            className="p-4 bg-white rounded-xl border border-[#EFE8DA] hover:border-[#2C1810] text-left transition-colors cursor-pointer group"
          >
            <span className="text-[11px] text-red-700 font-medium block">Annulées</span>
            <span className="font-serif text-2xl font-bold text-red-700 block mt-1 tabular-nums">
              {metrics.cancelledCount}
            </span>
            <span className="text-[10px] text-[#5C3D2E]/70 mt-0.5 block">Rejetées</span>
          </button>

          {/* Clients */}
          <button
            onClick={() => onNavigateToTab('customers')}
            className="p-4 bg-white rounded-xl border border-[#EFE8DA] hover:border-[#2C1810] text-left transition-colors cursor-pointer group"
          >
            <span className="text-[11px] text-[#5C3D2E] block">Clients Répertoire</span>
            <span className="font-serif text-2xl font-bold text-[#2C1810] block mt-1 tabular-nums group-hover:text-[#A8813C]">
              {metrics.customersCount}
            </span>
            <span className="text-[10px] text-[#A8813C] mt-0.5 block">Fiches clients →</span>
          </button>
        </div>
      </div>

      {/* 3. Modern Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Evolution Chart (7 Days Bar Chart) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#EFE8DA] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif text-base font-bold text-[#2C1810]">
                Évolution des Ventes Quotidiennes
              </h4>
              <p className="text-xs text-[#5C3D2E]">Activité réelle sur les 7 derniers jours</p>
            </div>
            <span className="text-xs text-[#A8813C] font-semibold">
              Semaine : {formatFCFA(metrics.weekRevenue)}
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-[#EFE8DA]">
            {last7Days.map((day, idx) => {
              const heightPct = Math.max(8, Math.round((day.total / maxDailyTotal) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-[#2C1810] text-[#DEBF6D] px-2 py-1 rounded shadow-md whitespace-nowrap mb-1">
                    {formatFCFA(day.total)}
                  </div>
                  {/* Bar */}
                  <div className="w-full max-w-[42px] bg-[#F7F3EB] rounded-t-lg overflow-hidden flex items-end h-full">
                    <div
                      className="w-full bg-gradient-to-t from-[#2C1810] to-[#A8813C] rounded-t-lg transition-all duration-500 group-hover:to-[#DEBF6D]"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  {/* Date label */}
                  <span className="text-[10px] sm:text-xs text-[#5C3D2E]/80 text-center truncate max-w-full">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-[#5C3D2E]/70 pt-1">
            <span>Données synchronisées avec les commandes</span>
            <span>Moyenne quotidienne : {formatFCFA(Math.round(metrics.weekRevenue / 7))}</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#EFE8DA] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-base font-bold text-[#2C1810]">
                Répartition des Ventes
              </h4>
              <PieChart className="w-4 h-4 text-[#A8813C]" />
            </div>
            <p className="text-xs text-[#5C3D2E] mt-0.5">Par famille de produits</p>

            <div className="space-y-4 mt-6">
              {/* Parfums (8 000 FCFA) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#2C1810]">Parfums (8 000 FCFA)</span>
                  <span className="font-bold text-[#A8813C]">{categoryStats.parfums.percent}%</span>
                </div>
                <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden border border-[#EFE8DA]">
                  <div
                    className="bg-[#2C1810] h-full rounded-full"
                    style={{ width: `${categoryStats.parfums.percent}%` }}
                  />
                </div>
                <span className="text-[11px] text-[#5C3D2E]/70 block tabular-nums">
                  CA : {formatFCFA(categoryStats.parfums.revenue)}
                </span>
              </div>

              {/* Savon Hamam (8 500 FCFA / 5 kg) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#2C1810]">Savon Hamam 5 kg (8 500 FCFA)</span>
                  <span className="font-bold text-[#A8813C]">{categoryStats.savons.percent}%</span>
                </div>
                <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden border border-[#EFE8DA]">
                  <div
                    className="bg-[#A8813C] h-full rounded-full"
                    style={{ width: `${categoryStats.savons.percent}%` }}
                  />
                </div>
                <span className="text-[11px] text-[#5C3D2E]/70 block tabular-nums">
                  CA : {formatFCFA(categoryStats.savons.revenue)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EFE8DA] text-xs text-[#5C3D2E]">
            <p className="font-medium text-[#2C1810]">Produits au Catalogue :</p>
            <p className="mt-0.5">
              • <strong>{metrics.inStockProducts}</strong> disponibles en réserve
              <br />• <strong>{metrics.outOfStockProducts}</strong> en rupture
            </p>
          </div>
        </div>
      </div>

      {/* 4. Top Selling Products & Low Stock Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Products */}
        <div className="bg-white p-6 rounded-2xl border border-[#EFE8DA] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-base font-bold text-[#2C1810]">
              Produits les Plus Vendus
            </h4>
            <button
              onClick={() => onNavigateToTab('products')}
              className="text-xs text-[#A8813C] hover:underline font-semibold"
            >
              Gérer les produits →
            </button>
          </div>

          <div className="divide-y divide-[#EFE8DA] text-xs">
            {topProducts.length === 0 ? (
              <p className="py-4 text-[#5C3D2E]/60 text-center">Aucune vente enregistrée pour le moment.</p>
            ) : (
              topProducts.map((p, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-center font-bold text-[#A8813C]">{idx + 1}</span>
                    <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-[#FAF7F2] border border-[#EFE8DA]" />
                    <div className="truncate">
                      <p className="font-bold text-[#2C1810] truncate">{p.name}</p>
                      <p className="text-[11px] text-[#5C3D2E]">{p.quantity} unité{p.quantity > 1 ? 's' : ''} vendue{p.quantity > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-[#2C1810] tabular-nums whitespace-nowrap">
                    {formatFCFA(p.revenue)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stock Alerts & Inventory Health */}
        <div className="bg-white p-6 rounded-2xl border border-[#EFE8DA] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-base font-bold text-[#2C1810]">
                Alertes Stocks & Réapprovisionnement
              </h4>
              <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                Contrôle stock
              </span>
            </div>

            <div className="divide-y divide-[#EFE8DA] text-xs mt-3">
              {products
                .filter((p) => p.stock <= 15)
                .slice(0, 4)
                .map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#2C1810]">{p.name}</p>
                      <p className="text-[11px] text-[#5C3D2E]">{p.volumeOrWeight}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-bold tabular-nums px-2 py-0.5 rounded text-xs ${
                          p.stock === 0
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : p.stock <= 10
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {p.stock === 0 ? 'Rupture' : `${p.stock} restant${p.stock > 1 ? 's' : ''}`}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('products')}
            className="w-full py-2.5 px-4 bg-[#FAF7F2] hover:bg-[#F7F3EB] border border-[#DEBF6D] text-[#2C1810] rounded-xl text-xs font-semibold text-center transition-colors cursor-pointer"
          >
            Mettre à jour les stocks dans le catalogue
          </button>
        </div>
      </div>
    </div>
  );
};
