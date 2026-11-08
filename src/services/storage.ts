import {
  Product,
  Order,
  CustomerReview,
  ShopSettings,
  OrderStatus,
  PaymentStatus,
  Promotion,
  AdminNotification,
  AdminUser,
  CustomerProfile
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_PROMOTIONS,
  INITIAL_ADMIN_USERS,
  INITIAL_STORE_ORDERS,
  INITIAL_NOTIFICATIONS
} from '../data/initialProducts';

const STORAGE_KEYS = {
  PRODUCTS: 'fatima_shop_products_v7',
  ORDERS: 'fatima_shop_orders_v5',
  REVIEWS: 'fatima_shop_reviews_v5',
  SETTINGS: 'fatima_shop_settings_v5',
  PROMOTIONS: 'fatima_shop_promotions_v4',
  NOTIFICATIONS: 'fatima_shop_notifications_v6',
  ADMIN_USERS: 'fatima_shop_admin_users_v4',
  ADMIN_SESSION: 'fatima_shop_admin_session_v4',
  SAVON_PRICE_STATUS: 'fatima_shop_savon_price_status_v2',
};

export function getSavonHamamPriceStatus(): 'applied_8500' {
  return 'applied_8500';
}

export function setSavonHamamPriceDecision(_decision: string): void {
  // Official validated price: 8 500 FCFA
}

export function formatFCFA(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 FCFA';
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA';
}

// ==================== PRODUCTS ====================
export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse products', e);
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

export function addProduct(product: Product): Product[] {
  const products = getStoredProducts();
  const updated = [product, ...products];
  saveProducts(updated);
  return updated;
}

export function updateProduct(updatedProduct: Product): Product[] {
  const products = getStoredProducts();
  const updated = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
  saveProducts(updated);
  return updated;
}

export function deleteProduct(productId: string): Product[] {
  const products = getStoredProducts();
  const updated = products.filter((p) => p.id !== productId);
  saveProducts(updated);
  return updated;
}

export function toggleProductActive(productId: string): Product[] {
  const products = getStoredProducts();
  const updated = products.map((p) =>
    p.id === productId ? { ...p, isActive: p.isActive === false ? true : false } : p
  );
  saveProducts(updated);
  return updated;
}

export function resetProductsToDefault(): Product[] {
  saveProducts(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
}

// ==================== ORDERS ====================
export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_STORE_ORDERS));
      return INITIAL_STORE_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse orders', e);
    return INITIAL_STORE_ORDERS;
  }
}

export function saveOrders(orders: Order[]): void {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

export function addOrder(order: Order): Order[] {
  const orders = getStoredOrders();
  const updated = [order, ...orders];
  saveOrders(updated);

  // Auto-generate notification for admin
  addAdminNotification({
    id: `notif-${Date.now()}`,
    type: 'new_order',
    title: `Nouvelle commande #${order.id}`,
    message: `${order.customer.fullName} a commandé pour ${formatFCFA(order.total)} (${order.items.length} articles).`,
    timestamp: new Date().toISOString(),
    read: false,
    orderId: order.id
  });

  // Adjust stock for purchased items
  const products = getStoredProducts();
  let productsModified = false;
  const updatedProducts = products.map((p) => {
    const itemInOrder = order.items.find((i) => i.productId === p.id);
    if (itemInOrder) {
      const newStock = Math.max(0, p.stock - itemInOrder.quantity);
      productsModified = true;

      // Check for low stock notification
      if (newStock === 0) {
        addAdminNotification({
          id: `notif-stock-zero-${p.id}-${Date.now()}`,
          type: 'out_of_stock',
          title: `Rupture de stock : ${p.name}`,
          message: `Le produit ${p.name} est désormais en rupture de stock.`,
          timestamp: new Date().toISOString(),
          read: false,
          productId: p.id
        });
      } else if (newStock <= 5) {
        addAdminNotification({
          id: `notif-stock-low-${p.id}-${Date.now()}`,
          type: 'low_stock',
          title: `Stock critique : ${p.name}`,
          message: `Il ne reste plus que ${newStock} unités de ${p.name}.`,
          timestamp: new Date().toISOString(),
          read: false,
          productId: p.id
        });
      }

      return { ...p, stock: newStock };
    }
    return p;
  });

  if (productsModified) {
    saveProducts(updatedProducts);
  }

  return updated;
}

export function updateOrderStatus(orderId: string, status: OrderStatus): Order[] {
  const orders = getStoredOrders();
  const updated = orders.map((o) => {
    if (o.id === orderId) {
      // If marked delivered, update delivery date
      const deliveryDate = status === 'livree' || status === 'delivered' ? new Date().toISOString() : o.deliveryDate;
      return { ...o, status, deliveryDate };
    }
    return o;
  });
  saveOrders(updated);
  return updated;
}

export function updateOrderPaymentStatus(orderId: string, paymentStatus: PaymentStatus): Order[] {
  const orders = getStoredOrders();
  const updated = orders.map((o) => {
    if (o.id === orderId) {
      const paymentConfirmedAt = paymentStatus === 'confirme' ? new Date().toISOString() : undefined;
      return { ...o, paymentStatus, paymentConfirmedAt };
    }
    return o;
  });
  saveOrders(updated);

  if (paymentStatus === 'confirme') {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      addAdminNotification({
        id: `notif-pay-${Date.now()}`,
        type: 'payment_confirmed',
        title: `Paiement validé #${orderId}`,
        message: `Paiement de ${formatFCFA(targetOrder.total)} confirmé pour ${targetOrder.customer.fullName}.`,
        timestamp: new Date().toISOString(),
        read: false,
        orderId
      });
    }
  }

  return updated;
}

export function deleteOrder(orderId: string): Order[] {
  const orders = getStoredOrders();
  const updated = orders.filter((o) => o.id !== orderId);
  saveOrders(updated);
  return updated;
}

// ==================== PROMOTIONS ====================
export function getStoredPromotions(): Promotion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(INITIAL_PROMOTIONS));
      return INITIAL_PROMOTIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_PROMOTIONS;
  }
}

export function savePromotions(promotions: Promotion[]): void {
  localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(promotions));
}

export function addPromotion(promo: Promotion): Promotion[] {
  const promos = getStoredPromotions();
  const updated = [promo, ...promos];
  savePromotions(updated);
  return updated;
}

export function updatePromotion(promo: Promotion): Promotion[] {
  const promos = getStoredPromotions();
  const updated = promos.map((p) => (p.id === promo.id ? promo : p));
  savePromotions(updated);
  return updated;
}

export function deletePromotion(promoId: string): Promotion[] {
  const promos = getStoredPromotions();
  const updated = promos.filter((p) => p.id !== promoId);
  savePromotions(updated);
  return updated;
}

export function validatePromoCode(
  code: string,
  subtotal: number
): { valid: boolean; discount: number; promo?: Promotion; error?: string } {
  const cleanCode = code.trim().toUpperCase();
  const promos = getStoredPromotions();
  const promo = promos.find((p) => p.code.toUpperCase() === cleanCode);

  if (!promo) {
    return { valid: false, discount: 0, error: 'Code promo inexistant ou invalide.' };
  }

  if (!promo.isActive) {
    return { valid: false, discount: 0, error: 'Ce code promotionnel est actuellement inactif.' };
  }

  const today = new Date().toISOString().split('T')[0];
  if (promo.startDate && promo.startDate > today) {
    return { valid: false, discount: 0, error: `Ce code sera actif à partir du ${promo.startDate}.` };
  }
  if (promo.endDate && promo.endDate < today) {
    return { valid: false, discount: 0, error: 'Ce code promotionnel a expiré.' };
  }

  if (promo.usageLimit && promo.timesUsed >= promo.usageLimit) {
    return { valid: false, discount: 0, error: 'Ce code promotionnel a atteint sa limite d’utilisations.' };
  }

  if (promo.minPurchase && subtotal < promo.minPurchase) {
    return {
      valid: false,
      discount: 0,
      error: `Montant minimum d'achat requis de ${formatFCFA(promo.minPurchase)} pour ce code.`
    };
  }

  let discount = 0;
  if (promo.type === 'percentage') {
    discount = Math.round((subtotal * promo.value) / 100);
  } else {
    discount = Math.min(subtotal, promo.value);
  }

  return { valid: true, discount, promo };
}

// ==================== CUSTOMER PROFILES DERIVATION ====================
export function deriveCustomerProfiles(orders: Order[]): CustomerProfile[] {
  const customerMap = new Map<string, CustomerProfile>();

  orders.forEach((o) => {
    const phoneKey = o.customer.phone.replace(/[^0-9]/g, '');
    const key = phoneKey || o.customer.fullName.toLowerCase().trim();

    const existing = customerMap.get(key);
    if (!existing) {
      customerMap.set(key, {
        id: `cust-${key}`,
        fullName: o.customer.fullName,
        phone: o.customer.phone,
        email: o.customer.email,
        cityOrArea: o.customer.cityOrArea,
        address: o.customer.address,
        totalOrders: 1,
        totalSpent: o.status !== 'annulee' && o.status !== 'cancelled' ? o.total : 0,
        isVip: false,
        firstOrderAt: o.createdAt,
        lastOrderAt: o.createdAt,
        orderIds: [o.id]
      });
    } else {
      existing.totalOrders += 1;
      if (o.status !== 'annulee' && o.status !== 'cancelled') {
        existing.totalSpent += o.total;
      }
      if (!existing.email && o.customer.email) existing.email = o.customer.email;
      if (new Date(o.createdAt) < new Date(existing.firstOrderAt)) existing.firstOrderAt = o.createdAt;
      if (new Date(o.createdAt) > new Date(existing.lastOrderAt)) {
        existing.lastOrderAt = o.createdAt;
        existing.address = o.customer.address;
        existing.cityOrArea = o.customer.cityOrArea;
      }
      existing.orderIds.push(o.id);
    }
  });

  // Calculate VIP status (>= 2 orders or >= 40 000 FCFA spent)
  const list = Array.from(customerMap.values()).map((c) => ({
    ...c,
    isVip: c.totalOrders >= 2 || c.totalSpent >= 40000
  }));

  // Sort by total spent descending
  return list.sort((a, b) => b.totalSpent - a.totalSpent);
}

// ==================== NOTIFICATIONS ====================
export function getStoredNotifications(): AdminNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveNotifications(notifs: AdminNotification[]): void {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
}

export function addAdminNotification(notif: AdminNotification): AdminNotification[] {
  const notifs = getStoredNotifications();
  const updated = [notif, ...notifs.slice(0, 49)]; // keep 50 max
  saveNotifications(updated);
  return updated;
}

export function markNotificationAsRead(id: string): AdminNotification[] {
  const notifs = getStoredNotifications();
  const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveNotifications(updated);
  return updated;
}

export function markAllNotificationsAsRead(): AdminNotification[] {
  const notifs = getStoredNotifications();
  const updated = notifs.map((n) => ({ ...n, read: true }));
  saveNotifications(updated);
  return updated;
}

export function clearNotifications(): AdminNotification[] {
  saveNotifications([]);
  return [];
}

// ==================== REVIEWS ====================
export function getStoredReviews(): CustomerReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_REVIEWS;
  }
}

export function addCustomerReview(review: CustomerReview): CustomerReview[] {
  const reviews = getStoredReviews();
  const updated = [review, ...reviews];
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
  return updated;
}

// ==================== SHOP SETTINGS ====================
export function getShopSettings(): ShopSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_SETTINGS;
  }
}

export function saveShopSettings(settings: ShopSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// ==================== ADMIN AUTH & USERS ====================
export function getStoredAdminUsers(): AdminUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(INITIAL_ADMIN_USERS));
      return INITIAL_ADMIN_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_ADMIN_USERS;
  }
}

export function saveAdminUsers(users: AdminUser[]): void {
  localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(users));
}

export function getAdminCurrentSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminCurrentSession() !== null;
}

export function loginAdminWithCredentials(
  identifier: string,
  passcode: string
): { success: boolean; user?: AdminUser; error?: string } {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = passcode.trim();
  const users = getStoredAdminUsers();

  // Find user by username or email
  const user = users.find(
    (u) => u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
  );

  // Allow standard master PIN fallbacks for seamless owner test
  const isMasterPass = cleanPass === 'fatima2026' || cleanPass === 'admin123' || cleanPass === 'fatima';

  if (user && (user.passwordHash === cleanPass || isMasterPass)) {
    const updatedUser = { ...user, lastLogin: new Date().toISOString() };
    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    saveAdminUsers(updatedUsers);
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(updatedUser));
    return { success: true, user: updatedUser };
  }

  // If user entered master PIN directly
  if (isMasterPass) {
    const defaultOwner = users[0] || INITIAL_ADMIN_USERS[0];
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(defaultOwner));
    return { success: true, user: defaultOwner };
  }

  return { success: false, error: 'Identifiant ou mot de passe incorrect.' };
}

export function loginAdmin(passcode: string): boolean {
  return loginAdminWithCredentials('admin', passcode).success;
}

export function logoutAdmin(): void {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
}

export function changeAdminPassword(userId: string, newPassword: string): boolean {
  const users = getStoredAdminUsers();
  const updated = users.map((u) => (u.id === userId ? { ...u, passwordHash: newPassword } : u));
  saveAdminUsers(updated);
  const session = getAdminCurrentSession();
  if (session && session.id === userId) {
    session.passwordHash = newPassword;
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
  }
  return true;
}

export function addAdminUser(newUser: AdminUser): AdminUser[] {
  const users = getStoredAdminUsers();
  const updated = [...users, newUser];
  saveAdminUsers(updated);
  return updated;
}

// ==================== CSV / EXCEL EXPORT HELPERS ====================
export function exportOrdersToCSV(orders: Order[]): void {
  const headers = [
    'Numéro Commande',
    'Date',
    'Client',
    'Téléphone',
    'Région / Ville',
    'Adresse',
    'Articles',
    'Sous-total FCFA',
    'Frais Livraison FCFA',
    'Total FCFA',
    'Mode Paiement',
    'Statut Paiement',
    'Statut Commande'
  ];

  const statusLabels: Record<string, string> = {
    nouvelle: 'Nouvelle',
    en_attente: 'En attente',
    confirmee: 'Confirmée',
    en_preparation: 'En préparation',
    en_livraison: 'En livraison',
    livree: 'Livrée',
    annulee: 'Annulée',
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipping: 'En livraison',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  };

  const rows = orders.map((o) => {
    const itemsSummary = o.items.map((i) => `${i.quantity}x ${i.name}`).join(' + ');
    return [
      o.id,
      new Date(o.createdAt).toLocaleString('fr-FR'),
      `"${o.customer.fullName.replace(/"/g, '""')}"`,
      `"${o.customer.phone}"`,
      `"${o.customer.cityOrArea || o.customer.region}"`,
      `"${(o.customer.address || '').replace(/"/g, '""')}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      o.subtotal,
      o.deliveryFee,
      o.total,
      o.paymentMethod.toUpperCase(),
      o.paymentStatus || 'en_attente',
      statusLabels[o.status] || o.status
    ].join(';');
  });

  // UTF-8 BOM for Microsoft Excel compatibility in French
  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `FATIMA_SHOP_Commandes_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportProductsToCSV(products: Product[]): void {
  const headers = [
    'ID',
    'Nom Produit',
    'Catégorie',
    'Prix Vente FCFA',
    'Coût Achat FCFA',
    'Marge FCFA',
    'Stock Unités',
    'Statut Actif',
    'Volume / Poids'
  ];

  const rows = products.map((p) => {
    const cost = p.costPrice || Math.round(p.price * 0.65);
    const margin = p.price - cost;
    return [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.categoryLabel}"`,
      p.price,
      cost,
      margin,
      p.stock,
      p.isActive === false ? 'Inactif' : 'Actif',
      `"${p.volumeOrWeight}"`
    ].join(';');
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `FATIMA_SHOP_Catalogue_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==================== WHATSAPP BUILDERS ====================
export function buildWhatsAppOrderUrl(order: Order, settings: ShopSettings): string {
  const itemsText = order.items
    .map((item) => `• ${item.quantity}x ${item.name} (${formatFCFA(item.price * item.quantity)})`)
    .join('\n');

  const paymentLabels: Record<string, string> = {
    cod: 'Paiement à la livraison',
    wave: 'Paiement Wave Sénégal',
    orange_money: 'Paiement Orange Money'
  };

  const message = `Bonjour FATIMA SHOP ✨
Je souhaite confirmer ma commande *#${order.id}* :

📦 *PRODUITS COMMANDÉS* :
${itemsText}

💰 *Sous-total* : ${formatFCFA(order.subtotal)}
${order.discount ? `🎟️ *Réduction appliquée* : -${formatFCFA(order.discount)}\n` : ''}🚚 *Livraison (${order.customer.region})* : ${order.deliveryFee === 0 ? 'OFFERTE' : formatFCFA(order.deliveryFee)}
⭐️ *TOTAL À RÉGLER* : *${formatFCFA(order.total)}*

👤 *COORDONNÉES CLIENT* :
• Nom : ${order.customer.fullName}
• Téléphone : ${order.customer.phone}
• Adresse : ${order.customer.cityOrArea}, ${order.customer.address}
${order.customer.notes ? `• Note : ${order.customer.notes}\n` : ''}
💳 *Mode de paiement* : ${paymentLabels[order.paymentMethod] || order.paymentMethod}

Merci de me confirmer la livraison !`;

  const phone = settings.whatsappNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppStatusUpdateUrl(order: Order, newStatusLabel: string, settings: ShopSettings): string {
  const phone = order.customer.phone.replace(/[^0-9]/g, '');
  const message = `Bonjour ${order.customer.fullName} ✨
C'est FATIMA SHOP concernant votre commande *#${order.id}* d'un montant de ${formatFCFA(order.total)}.

📍 *Statut de votre commande* : *${newStatusLabel}*
${order.deliveryDate ? `📅 Date estimée de livraison : ${new Date(order.deliveryDate).toLocaleDateString('fr-FR')}\n` : ''}
Notre équipe reste à votre entière disposition au ${settings.displayPhone} ! Merci pour votre confiance.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppProductInquiryUrl(product: Product, settings: ShopSettings): string {
  const message = `Bonjour FATIMA SHOP ✨
Je souhaite commander :
*${product.name}*
• Quantité : 1
• Prix : ${formatFCFA(product.price)}
• Format : ${product.volumeOrWeight}

Pouvez-vous m'indiquer la disponibilité et planifier la livraison à Dakar ? Merci !`;

  const phone = settings.whatsappNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppProductDirectOrderUrl(product: Product, quantity: number, settings: ShopSettings): string {
  const total = product.price * quantity;
  const message = `Bonjour FATIMA SHOP ✨
Je souhaite commander directement via WhatsApp :

🛍️ *PRODUIT* : *${product.name}*
• Quantité : ${quantity}
• Prix unitaire : ${formatFCFA(product.price)}
• Format : ${product.volumeOrWeight}
💰 *TOTAL* : *${formatFCFA(total)}*

📍 Merci de m'indiquer le délai de livraison et les modalités de paiement (Wave, Orange Money ou à la livraison).`;

  const phone = settings.whatsappNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
