export type ProductCategory = 
  | 'tous'
  | 'parfums'
  | 'parfums_femmes'
  | 'parfums_hommes'
  | 'parfums_mixtes'
  | 'savons_hamam'
  | 'produits_naturels'
  | 'epicerie_gourmandises'
  | 'coffrets_parfumerie'
  | 'huiles_parfumees'
  | 'fruits_secs';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number; // in FCFA (Parfums = 8000, Savon Hamam 5kg = 8500)
  costPrice?: number; // Coût d'achat pour calcul des bénéfices/marges
  originalPrice?: number;
  image: string;
  images?: string[]; // Multiple photos
  isVerifiedPhoto?: boolean; // Photographie authentique vérifiée
  photoVerificationStatus?: 'verified' | 'temporary'; // Statut de la photo
  shortDesc: string;
  fullDesc: string;
  volumeOrWeight: string;
  stock: number;
  isActive?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  rating: number;
  reviewsCount: number;
  notes?: {
    tete?: string;
    coeur?: string;
    fond?: string;
    composition?: string;
    conseils?: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'cod' | 'wave' | 'orange_money';

export type PaymentStatus = 'en_attente' | 'confirme' | 'echoue';

export type OrderStatus = 
  | 'nouvelle'
  | 'en_attente'
  | 'confirmee'
  | 'en_preparation'
  | 'en_livraison'
  | 'livree'
  | 'annulee'
  | 'pending'
  | 'confirmed'
  | 'shipping'
  | 'delivered'
  | 'cancelled';

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email?: string;
  region: string;
  cityOrArea: string;
  address: string;
  notes?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: OrderCustomer;
  items: {
    productId: string;
    name: string;
    price: number;
    costPrice?: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  discount?: number;
  promoCode?: string;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentConfirmedAt?: string;
  status: OrderStatus;
  deliveryZoneId?: string;
  deliveryDate?: string;
  deliveryNotes?: string;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  cityOrArea: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  isVip: boolean;
  firstOrderAt: string;
  lastOrderAt: string;
  orderIds: string[];
}

export interface Promotion {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // e.g. 10 for 10% or 1000 for 1000 FCFA
  minPurchase?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
}

export interface AdminNotification {
  id: string;
  type: 'new_order' | 'cancelled_order' | 'low_stock' | 'out_of_stock' | 'payment_confirmed' | 'delivered';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
  productId?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  role: 'super_admin' | 'gerante' | 'gestionnaire';
  email: string;
  passwordHash: string; // obfuscated / secure hash representation
  lastLogin?: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  productName?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  delay: string;
}

export interface ShopSettings {
  shopName: string;
  slogan: string;
  whatsappNumber: string; // e.g. "221761403464"
  displayPhone: string;
  emailContact?: string;
  instagramHandle: string;
  tiktokHandle: string;
  address: string;
  freeDeliveryThreshold: number;
  deliveryZones: DeliveryZone[];
  termsAndConditions?: string;
}
