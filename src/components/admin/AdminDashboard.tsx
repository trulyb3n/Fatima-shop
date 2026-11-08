import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Truck,
  CreditCard,
  Tag,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import {
  Product,
  Order,
  Promotion,
  AdminNotification,
  AdminUser,
  ShopSettings
} from '../../types';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';
import { AdminDeliveries } from './AdminDeliveries';
import AdminPayments from './AdminPayments';
import AdminPromotions from './AdminPromotions';
import AdminAnalyticsReports from './AdminAnalyticsReports';
import AdminNotifications from './AdminNotifications';
import AdminSettingsSecurity from './AdminSettingsSecurity';
import {
  getStoredProducts,
  getStoredOrders,
  getStoredPromotions,
  getStoredNotifications,
  getShopSettings,
  getAdminCurrentSession,
  logoutAdmin,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
  resetProductsToDefault,
  updateOrderStatus,
  deleteOrder,
  deriveCustomerProfiles,
  saveShopSettings
} from '../../services/storage';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'orders'
  | 'customers'
  | 'deliveries'
  | 'payments'
  | 'promotions'
  | 'analytics'
  | 'notifications'
  | 'settings';

interface AdminDashboardProps {
  onReturnToShop: () => void;
}

export default function AdminDashboard({ onReturnToShop }: AdminDashboardProps) {
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live state from storage
  const [products, setProducts] = useState<Product[]>(getStoredProducts());
  const [orders, setOrders] = useState<Order[]>(getStoredOrders());
  const [promotions, setPromotions] = useState<Promotion[]>(getStoredPromotions());
  const [notifications, setNotifications] = useState<AdminNotification[]>(getStoredNotifications());
  const [settings, setSettings] = useState<ShopSettings>(getShopSettings());
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(getAdminCurrentSession());

  // Refresh helper
  const refreshAll = () => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
    setPromotions(getStoredPromotions());
    setNotifications(getStoredNotifications());
    setSettings(getShopSettings());
    setCurrentUser(getAdminCurrentSession());
  };

  useEffect(() => {
    refreshAll();
  }, [currentTab]);

  const handleLogout = () => {
    logoutAdmin();
    onReturnToShop();
  };

  // Counts for badges
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'nouvelle' || o.status === 'en_attente' || o.status === 'pending'
  ).length;

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const pendingPaymentsCount = orders.filter(
    (o) => o.paymentStatus !== 'confirme' && o.status !== 'annulee' && o.status !== 'cancelled'
  ).length;

  const navItems = [
    {
      id: 'overview',
      label: "Vue d'ensemble",
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'products',
      label: 'Produits & Stocks',
      icon: Package,
      badge: null
    },
    {
      id: 'orders',
      label: 'Commandes',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      badgeColor: 'bg-[#C5A059] text-white'
    },
    {
      id: 'customers',
      label: 'Clients & Fidélité',
      icon: Users,
      badge: null
    },
    {
      id: 'deliveries',
      label: 'Suivi Livraisons',
      icon: Truck,
      badge: null
    },
    {
      id: 'payments',
      label: 'Paiements & Caisse',
      icon: CreditCard,
      badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : null,
      badgeColor: 'bg-amber-600 text-white'
    },
    {
      id: 'promotions',
      label: 'Codes Promo',
      icon: Tag,
      badge: null
    },
    {
      id: 'analytics',
      label: 'Rapports & Ventes',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : null,
      badgeColor: 'bg-red-500 text-white'
    },
    {
      id: 'settings',
      label: 'Paramètres & Sécurité',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex text-[#2C1810]">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#2C1810] text-[#FCFAF7] border-r border-[#C5A059]/20 shadow-xl shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#C5A059] to-[#DEBF6D] flex items-center justify-center text-[#2C1810] font-serif font-black text-xl shadow-md">
              FS
            </div>
            <div>
              <h1 className="font-serif font-black tracking-widest text-lg text-[#FCFAF7]">
                FATIMA SHOP
              </h1>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#C5A059] font-medium">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                Administration
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id as AdminTab)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#C5A059] to-[#B38F46] text-white shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#C5A059]'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.badgeColor || 'bg-[#C5A059] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Storefront & User Profile */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <button
            onClick={onReturnToShop}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-semibold transition-colors cursor-pointer border border-white/10"
          >
            <Store className="w-4 h-4 text-[#C5A059]" />
            <span>Voir la Boutique</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-auto" />
          </button>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 flex items-center justify-center font-bold text-xs">
                {currentUser?.fullName.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-200 truncate">
                  {currentUser?.fullName || 'Administrateur'}
                </p>
                <p className="text-[10px] text-stone-400 capitalize">
                  {currentUser?.role === 'super_admin' ? 'Super Admin' : 'Gérante'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#FCFAF7]/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div>
              <div className="text-xs text-stone-500 font-medium">Tableau de bord</div>
              <div className="text-lg font-serif font-bold text-[#2C1810]">
                {navItems.find((i) => i.id === currentTab)?.label}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              onClick={() => setCurrentTab('notifications')}
              className="relative p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-[#C5A059] hover:border-[#C5A059]/40 transition-colors shadow-xs cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Quick Switch to Store */}
            <button
              onClick={onReturnToShop}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-[#C5A059]" />
              Boutique en ligne
            </button>
          </div>
        </header>

        {/* Tab Content Renderer */}
        <main className="p-4 sm:p-8 flex-1">
          {currentTab === 'overview' && (
            <AdminOverview
              products={products}
              orders={orders}
              customers={deriveCustomerProfiles(orders)}
              onNavigateToTab={(tab: string) => setCurrentTab(tab as AdminTab)}
              onUpdateProduct={(p) => {
                updateProduct(p);
                refreshAll();
              }}
              onRefreshData={refreshAll}
            />
          )}

          {currentTab === 'products' && (
            <AdminProducts
              products={products}
              onAddProduct={(p) => {
                addProduct(p);
                refreshAll();
              }}
              onUpdateProduct={(p) => {
                updateProduct(p);
                refreshAll();
              }}
              onDeleteProduct={(id) => {
                deleteProduct(id);
                refreshAll();
              }}
              onToggleActive={(id) => {
                toggleProductActive(id);
                refreshAll();
              }}
              onResetToDefault={() => {
                resetProductsToDefault();
                refreshAll();
              }}
            />
          )}

          {currentTab === 'orders' && (
            <AdminOrders
              orders={orders}
              onUpdateStatus={(id, status) => {
                updateOrderStatus(id, status);
                refreshAll();
              }}
              onDeleteOrder={(id) => {
                deleteOrder(id);
                refreshAll();
              }}
              settings={settings}
            />
          )}

          {currentTab === 'customers' && (
            <AdminCustomers
              customers={deriveCustomerProfiles(orders)}
              orders={orders}
              settings={settings}
            />
          )}

          {currentTab === 'deliveries' && (
            <AdminDeliveries
              orders={orders}
              onUpdateOrderStatus={(id, status) => {
                updateOrderStatus(id, status);
                refreshAll();
              }}
              settings={settings}
              onUpdateSettings={(s) => {
                saveShopSettings(s);
                refreshAll();
              }}
            />
          )}

          {currentTab === 'payments' && (
            <AdminPayments
              orders={orders}
              settings={settings}
              onRefreshOrders={refreshAll}
            />
          )}

          {currentTab === 'promotions' && (
            <AdminPromotions
              promotions={promotions}
              onRefreshPromotions={refreshAll}
            />
          )}

          {currentTab === 'analytics' && (
            <AdminAnalyticsReports
              orders={orders}
              products={products}
            />
          )}

          {currentTab === 'notifications' && (
            <AdminNotifications
              notifications={notifications}
              onRefreshNotifications={refreshAll}
              onNavigateToOrders={() => setCurrentTab('orders')}
              onNavigateToProducts={() => setCurrentTab('products')}
            />
          )}

          {currentTab === 'settings' && (
            <AdminSettingsSecurity
              settings={settings}
              currentAdmin={currentUser}
              onRefreshSettings={refreshAll}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-[#2C1810] text-[#FCFAF7] flex flex-col h-full z-10 shadow-2xl">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C5A059] to-[#DEBF6D] flex items-center justify-center text-[#2C1810] font-serif font-black text-base">
                  FS
                </div>
                <div className="font-serif font-bold text-base tracking-wider">
                  FATIMA SHOP
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id as AdminTab);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#C5A059] to-[#B38F46] text-white'
                        : 'text-stone-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#C5A059]'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.badgeColor || 'bg-[#C5A059] text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onReturnToShop();
                }}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 text-stone-200 text-xs font-semibold"
              >
                <Store className="w-4 h-4 text-[#C5A059]" />
                <span>Voir la Boutique</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/20 text-red-200 text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
