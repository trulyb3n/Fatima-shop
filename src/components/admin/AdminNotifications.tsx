import { useState } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Package,
  CreditCard,
  Trash2,
  CheckCheck
} from 'lucide-react';
import { AdminNotification } from '../../types';
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications
} from '../../services/storage';

interface AdminNotificationsProps {
  notifications: AdminNotification[];
  onRefreshNotifications: () => void;
  onNavigateToOrders?: () => void;
  onNavigateToProducts?: () => void;
}

export default function AdminNotifications({
  notifications,
  onRefreshNotifications,
  onNavigateToOrders,
  onNavigateToProducts
}: AdminNotificationsProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    onRefreshNotifications();
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    onRefreshNotifications();
  };

  const handleClearAll = () => {
    if (confirm('Voulez-vous effacer toutes les notifications ?')) {
      clearNotifications();
      onRefreshNotifications();
    }
  };

  const getNotifIcon = (type: AdminNotification['type']) => {
    switch (type) {
      case 'new_order':
        return (
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5" />
          </div>
        );
      case 'payment_confirmed':
        return (
          <div className="w-9 h-9 rounded-xl bg-[#1BA4E8]/10 text-[#1BA4E8] flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
        );
      case 'low_stock':
        return (
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        );
      case 'out_of_stock':
        return (
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
        );
      case 'delivered':
        return (
          <div className="w-9 h-9 rounded-xl bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-serif font-bold text-[#2C1810]">Centre de Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C5A059] text-white">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-sm text-stone-600 mt-1">
            Historique des événements de vente, alertes de réapprovisionnement et paiements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              Tout marquer comme lu
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-red-50 border border-stone-200 text-stone-500 hover:text-red-600 rounded-xl text-xs font-medium shadow-sm transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Effacer tout
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#2C1810] text-[#FCFAF7]'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          Toutes ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === 'unread'
              ? 'bg-[#2C1810] text-[#FCFAF7]'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          Non lues ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden divide-y divide-stone-100">
        {filteredNotifs.length === 0 ? (
          <div className="py-16 text-center text-stone-400">
            <Bell className="w-10 h-10 mx-auto mb-3 text-stone-300" />
            <p className="font-medium text-stone-600">Aucune notification à afficher</p>
            <p className="text-xs text-stone-400 mt-1">Vous êtes à jour dans la gestion de votre boutique FATIMA SHOP.</p>
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                !notif.read ? 'bg-[#FAF7F2]/60' : 'hover:bg-stone-50/60'
              }`}
            >
              {getNotifIcon(notif.type)}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4
                    className={`text-sm font-semibold truncate ${
                      !notif.read ? 'text-[#2C1810]' : 'text-stone-700'
                    }`}
                  >
                    {notif.title}
                  </h4>
                  <span className="text-[11px] text-stone-400 whitespace-nowrap">
                    {new Date(notif.timestamp).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-2">
                  {notif.message}
                </p>

                <div className="flex items-center gap-3">
                  {!notif.read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="text-[11px] font-semibold text-[#C5A059] hover:underline cursor-pointer"
                    >
                      Marquer comme lu
                    </button>
                  )}

                  {notif.orderId && onNavigateToOrders && (
                    <button
                      onClick={() => {
                        handleMarkAsRead(notif.id);
                        onNavigateToOrders();
                      }}
                      className="text-[11px] font-semibold text-stone-600 hover:text-stone-900 underline cursor-pointer"
                    >
                      Voir commande #{notif.orderId}
                    </button>
                  )}

                  {notif.productId && onNavigateToProducts && (
                    <button
                      onClick={() => {
                        handleMarkAsRead(notif.id);
                        onNavigateToProducts();
                      }}
                      className="text-[11px] font-semibold text-stone-600 hover:text-stone-900 underline cursor-pointer"
                    >
                      Gérer le stock du produit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
