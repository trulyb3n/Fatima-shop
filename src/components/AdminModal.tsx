import React, { useState } from 'react';
import {
  X, Lock, Key, Plus, Trash2, Edit2, Check, Package,
  TrendingUp, Users, DollarSign, RefreshCw, MessageCircle, AlertTriangle, Save
} from 'lucide-react';
import { Product, Order, ShopSettings, OrderStatus, ProductCategory } from '../types';
import {
  formatFCFA,
  isAdminAuthenticated,
  loginAdmin,
  logoutAdmin,
  saveProducts,
  saveOrders,
  saveShopSettings,
  resetProductsToDefault
} from '../services/storage';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductsChange: (products: Product[]) => void;
  orders: Order[];
  onOrdersChange: (orders: Order[]) => void;
  settings: ShopSettings;
  onSettingsChange: (settings: ShopSettings) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  onProductsChange,
  orders,
  onOrdersChange,
  settings,
  onSettingsChange
}) => {
  if (!isOpen) return null;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAdminAuthenticated());
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders' | 'settings'>('stats');

  // Product Add / Edit modal state
  const [isEditingProduct, setIsEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Form fields for product creation/edit
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('parfums_femmes');
  const [formPrice, setFormPrice] = useState(8000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(undefined);
  const [formImage, setFormImage] = useState('/src/assets/images/perfume_oriental_gold_1794063044566.jpg');
  const [formVolume, setFormVolume] = useState('Flacon vaporisateur');
  const [formStock, setFormStock] = useState(15);
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formTete, setFormTete] = useState('');
  const [formCoeur, setFormCoeur] = useState('');
  const [formFond, setFormFond] = useState('');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<ShopSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pinInput)) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Mot de passe incorrect. Utilisez : fatima2026 ou admin123');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
  };

  // Open edit modal
  const openEditModal = (product: Product) => {
    setIsEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(product.price);
    setFormOriginalPrice(product.originalPrice);
    setFormImage(product.image);
    setFormVolume(product.volumeOrWeight);
    setFormStock(product.stock);
    setFormShortDesc(product.shortDesc);
    setFormFullDesc(product.fullDesc);
    setFormTete(product.notes?.tete || '');
    setFormCoeur(product.notes?.coeur || '');
    setFormFond(product.notes?.fond || '');
  };

  // Open add modal
  const openAddModal = () => {
    setIsAddingProduct(true);
    setFormName('');
    setFormCategory('parfums_femmes');
    setFormPrice(8000);
    setFormOriginalPrice(undefined);
    setFormImage('/src/assets/images/perfume_rose_oud_1794063045805.jpg');
    setFormVolume('Flacon vaporisateur');
    setFormStock(20);
    setFormShortDesc('');
    setFormFullDesc('');
    setFormTete('');
    setFormCoeur('');
    setFormFond('');
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryLabels: Record<ProductCategory, string> = {
      tous: 'Tous',
      parfums: 'Parfum',
      parfums_femmes: 'Parfum Femme',
      parfums_hommes: 'Parfum Homme',
      parfums_mixtes: 'Parfum Mixte',
      savons_hamam: 'Savon Hamam',
      produits_naturels: 'Produits Naturels',
      epicerie_gourmandises: 'Épicerie & Gourmandises',
      coffrets_parfumerie: 'Coffrets & Parfumerie',
      huiles_parfumees: 'Huile Parfumée',
      fruits_secs: 'Douceurs & Fruits Secs'
    };

    if (isEditingProduct) {
      const updated: Product = {
        ...isEditingProduct,
        name: formName,
        category: formCategory,
        categoryLabel: categoryLabels[formCategory] || 'Produit',
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        image: formImage,
        volumeOrWeight: formVolume,
        stock: Number(formStock),
        shortDesc: formShortDesc,
        fullDesc: formFullDesc,
        notes: {
          ...isEditingProduct.notes,
          tete: formTete || undefined,
          coeur: formCoeur || undefined,
          fond: formFond || undefined
        }
      };
      const newProducts = products.map((p) => (p.id === updated.id ? updated : p));
      onProductsChange(newProducts);
      saveProducts(newProducts);
      setIsEditingProduct(null);
    } else if (isAddingProduct) {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: formName,
        category: formCategory,
        categoryLabel: categoryLabels[formCategory] || 'Produit',
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        image: formImage,
        volumeOrWeight: formVolume,
        stock: Number(formStock),
        shortDesc: formShortDesc,
        fullDesc: formFullDesc,
        rating: 5.0,
        reviewsCount: 1,
        isNew: true,
        notes: {
          tete: formTete || undefined,
          coeur: formCoeur || undefined,
          fond: formFond || undefined
        }
      };
      const newProducts = [newProd, ...products];
      onProductsChange(newProducts);
      saveProducts(newProducts);
      setIsAddingProduct(false);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce produit de la boutique ?')) {
      const newProducts = products.filter((p) => p.id !== productId);
      onProductsChange(newProducts);
      saveProducts(newProducts);
    }
  };

  const handleResetCatalog = () => {
    if (confirm('Réinitialiser tout le catalogue aux produits et photos par défaut ?')) {
      const def = resetProductsToDefault();
      onProductsChange(def);
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    onOrdersChange(updated);
    saveOrders(updated);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSettingsChange(settingsForm);
    saveShopSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  // Stats calculation
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'shipping').length;
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-[#FAF7F2] rounded-2xl max-w-5xl w-full border border-[#DEBF6D]/50 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#2C1810] text-[#FAF7F2] flex items-center justify-between border-b border-[#DEBF6D]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#DEBF6D] text-[#2C1810] flex items-center justify-center font-bold font-serif">
              F
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#FAF7F2]">
                Espace Propriétaire · FATIMA SHOP
              </h2>
              <p className="text-[11px] text-[#DEBF6D]">Tableau de bord de gestion des ventes et stocks</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs text-[#FAF7F2]/70 hover:text-white underline cursor-pointer"
              >
                Déconnexion
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#FAF7F2]/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#F7F3EB] border border-[#DEBF6D] flex items-center justify-center text-[#2C1810]">
              <Lock className="w-8 h-8 text-[#A8813C]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl text-[#2C1810]">Connexion Gérante</h3>
              <p className="text-xs text-[#5C3D2E]">
                Entrez le mot de passe pour accéder à la gestion des produits, commandes et stocks.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  placeholder="Mot de passe (ex : fatima2026)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-white border border-[#EFE8DA] rounded-xl px-4 py-3 text-sm text-[#2C1810] text-center tracking-widest focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {loginError && <p className="text-xs text-red-600 font-medium">{loginError}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-[#2C1810] text-[#DEBF6D] hover:bg-[#3E2419] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Accéder au panneau de gestion
              </button>

              <div className="p-3 bg-[#F7F3EB] rounded-lg border border-[#EFE8DA] text-[11px] text-[#5C3D2E]">
                <strong>Indication pour la propriétaire :</strong> Mot de passe par défaut :{' '}
                <code className="text-[#A8813C] font-mono font-bold">fatima2026</code> ou{' '}
                <code className="text-[#A8813C] font-mono font-bold">admin123</code>
              </div>
            </form>
          </div>
        ) : (
          /* Dashboard When Authenticated */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center gap-2 px-6 pt-4 border-b border-[#EFE8DA] bg-[#F7F3EB] text-xs font-medium shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveTab('stats')}
                className={`pb-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'stats'
                    ? 'border-[#2C1810] text-[#2C1810]'
                    : 'border-transparent text-[#5C3D2E]/70 hover:text-[#2C1810]'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-[#A8813C]" />
                <span>Statistiques & Ventes</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'orders'
                    ? 'border-[#2C1810] text-[#2C1810]'
                    : 'border-transparent text-[#5C3D2E]/70 hover:text-[#2C1810]'
                }`}
              >
                <Package className="w-4 h-4 text-[#A8813C]" />
                <span>Commandes ({orders.length})</span>
                {pendingOrders > 0 && (
                  <span className="bg-[#DEBF6D] text-[#2C1810] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {pendingOrders} en cours
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`pb-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'products'
                    ? 'border-[#2C1810] text-[#2C1810]'
                    : 'border-transparent text-[#5C3D2E]/70 hover:text-[#2C1810]'
                }`}
              >
                <DollarSign className="w-4 h-4 text-[#A8813C]" />
                <span>Catalogue Produits ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-[#2C1810] text-[#2C1810]'
                    : 'border-transparent text-[#5C3D2E]/70 hover:text-[#2C1810]'
                }`}
              >
                <Users className="w-4 h-4 text-[#A8813C]" />
                <span>Paramètres Boutique</span>
              </button>
            </div>

            {/* Tab 1: Stats */}
            {activeTab === 'stats' && (
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1 */}
                  <div className="p-5 rounded-xl bg-white border border-[#EFE8DA] shadow-xs space-y-1">
                    <span className="text-xs text-[#5C3D2E] uppercase tracking-wider">Chiffre d’Affaires Total</span>
                    <p className="font-serif text-2xl font-bold text-[#2C1810] tabular-nums">
                      {formatFCFA(totalRevenue)}
                    </p>
                    <span className="text-[11px] text-emerald-700">Toutes commandes confondues</span>
                  </div>

                  {/* Card 2 */}
                  <div className="p-5 rounded-xl bg-white border border-[#EFE8DA] shadow-xs space-y-1">
                    <span className="text-xs text-[#5C3D2E] uppercase tracking-wider">Commandes Enregistrées</span>
                    <p className="font-serif text-2xl font-bold text-[#2C1810] tabular-nums">
                      {orders.length}
                    </p>
                    <span className="text-[11px] text-[#A8813C]">{pendingOrders} à traiter / livrer</span>
                  </div>

                  {/* Card 3 */}
                  <div className="p-5 rounded-xl bg-white border border-[#EFE8DA] shadow-xs space-y-1">
                    <span className="text-xs text-[#5C3D2E] uppercase tracking-wider">Articles au Catalogue</span>
                    <p className="font-serif text-2xl font-bold text-[#2C1810] tabular-nums">
                      {products.length}
                    </p>
                    <span className="text-[11px] text-[#5C3D2E]/70">Parfums, savons & douceurs</span>
                  </div>

                  {/* Card 4 */}
                  <div className="p-5 rounded-xl bg-white border border-[#EFE8DA] shadow-xs space-y-1">
                    <span className="text-xs text-[#5C3D2E] uppercase tracking-wider">Alerte Stock Faible</span>
                    <p className="font-serif text-2xl font-bold text-[#2C1810] tabular-nums">
                      {lowStockCount}
                    </p>
                    <span className="text-[11px] text-amber-700">Stock &lt; 10 unités</span>
                  </div>
                </div>

                {/* Recent Orders quick preview */}
                <div className="bg-white rounded-xl border border-[#EFE8DA] p-5 space-y-4">
                  <h4 className="font-serif text-base font-semibold text-[#2C1810]">
                    Dernières Commandes Clients
                  </h4>
                  <div className="divide-y divide-[#EFE8DA] text-xs">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="py-3 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#2C1810]">{o.id}</span>
                          <span className="text-[#5C3D2E] ml-2">· {o.customer.fullName} ({o.customer.region})</span>
                          <p className="text-[11px] text-[#5C3D2E]/70 mt-0.5">
                            {o.items.length} article(s) · {new Date(o.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#2C1810] tabular-nums">{formatFCFA(o.total)}</span>
                          <span className="block text-[11px] capitalize text-[#A8813C]">{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Orders Management */}
            {activeTab === 'orders' && (
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                    Suivi des Commandes et Clients ({orders.length})
                  </h3>
                </div>

                <div className="space-y-4">
                  {orders.map((o) => {
                    const clientWhatsappUrl = `https://wa.me/${o.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Bonjour ${o.customer.fullName} ✨ C'est FATIMA SHOP concernant votre commande #${o.id}. Nous préparons votre livraison !`
                    )}`;

                    return (
                      <div
                        key={o.id}
                        className="bg-white rounded-xl border border-[#EFE8DA] p-5 shadow-xs space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFE8DA] pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-base text-[#2C1810]">{o.id}</span>
                              <span className="text-xs text-[#5C3D2E]/70">
                                {new Date(o.createdAt).toLocaleString('fr-FR')}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-[#A8813C] mt-0.5">
                              {o.customer.fullName} · {o.customer.phone}
                            </p>
                            <p className="text-xs text-[#5C3D2E]">
                              {o.customer.cityOrArea}, {o.customer.address}
                              {o.customer.notes ? ` (Note: ${o.customer.notes})` : ''}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* WhatsApp link to contact client directly */}
                            <a
                              href={clientWhatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-[#E8F8EE] text-[#25D366] hover:bg-[#d8f4e2] border border-[#25D366]/30 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                              title="Contacter le client sur WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp Client</span>
                            </a>

                            {/* Status changer */}
                            <select
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                              className="bg-[#F7F3EB] border border-[#DEBF6D]/60 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#2C1810] focus:outline-none"
                            >
                              <option value="pending">En attente</option>
                              <option value="confirmed">Confirmée</option>
                              <option value="shipping">En cours de livraison</option>
                              <option value="delivered">Livrée</option>
                              <option value="cancelled">Annulée</option>
                            </select>
                          </div>
                        </div>

                        {/* Order items */}
                        <div className="text-xs space-y-2">
                          <div className="font-medium text-[#2C1810]">Articles :</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {o.items.map((it, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-2 bg-[#FAF7F2] rounded-lg">
                                <img src={it.image} alt={it.name} className="w-10 h-10 object-cover rounded" />
                                <div className="truncate">
                                  <p className="font-medium text-[#2C1810] truncate">{it.name}</p>
                                  <p className="text-[11px] text-[#5C3D2E]">
                                    {it.quantity}x @ {formatFCFA(it.price)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Financial summary */}
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-[#EFE8DA]">
                          <span className="text-[#5C3D2E]">
                            Paiement : <strong className="text-[#2C1810] uppercase">{o.paymentMethod}</strong>
                          </span>
                          <span className="font-serif font-bold text-sm text-[#2C1810]">
                            Total : {formatFCFA(o.total)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: Products Management */}
            {activeTab === 'products' && (
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                    Gestion du Catalogue ({products.length} produits)
                  </h3>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetCatalog}
                      className="px-3 py-2 bg-[#F7F3EB] border border-[#EFE8DA] hover:bg-[#EFE8DA] rounded-lg text-xs text-[#5C3D2E] flex items-center gap-1.5 cursor-pointer"
                      title="Restaurer le catalogue original"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Réinitialiser par défaut</span>
                    </button>

                    <button
                      onClick={openAddModal}
                      className="px-4 py-2 bg-[#2C1810] text-[#DEBF6D] hover:bg-[#3E2419] rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter un produit</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-[#EFE8DA] overflow-hidden">
                  <div className="divide-y divide-[#EFE8DA] text-xs">
                    {products.map((p) => (
                      <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF7F2] transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-14 h-14 object-cover rounded-lg bg-[#F7F3EB] shrink-0 border border-[#EFE8DA]"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] text-[#A8813C] uppercase tracking-wider font-semibold block">
                              {p.categoryLabel}
                            </span>
                            <h4 className="font-serif font-bold text-[#2C1810] truncate text-sm">
                              {p.name}
                            </h4>
                            <p className="text-[11px] text-[#5C3D2E]/70">{p.volumeOrWeight}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                          <div className="text-right">
                            <span className="font-serif font-bold text-sm text-[#2C1810] block tabular-nums">
                              {formatFCFA(p.price)}
                            </span>
                            <span className={`text-[11px] font-medium ${p.stock < 10 ? 'text-amber-700' : 'text-emerald-700'}`}>
                              Stock: {p.stock} unités
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-2 rounded-lg bg-[#F7F3EB] hover:bg-[#EFE8DA] text-[#2C1810] transition-colors"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Settings */}
            {activeTab === 'settings' && (
              <div className="p-6 overflow-y-auto space-y-6">
                <form onSubmit={handleSaveSettings} className="bg-white rounded-xl border border-[#EFE8DA] p-6 space-y-4 max-w-2xl">
                  <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                    Paramètres de la Boutique FATIMA SHOP
                  </h3>

                  {settingsSaved && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Paramètres enregistrés avec succès !</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#2C1810] mb-1">Nom de la boutique</label>
                      <input
                        type="text"
                        value={settingsForm.shopName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, shopName: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#EFE8DA] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#2C1810] mb-1">Slogan officiel</label>
                      <input
                        type="text"
                        value={settingsForm.slogan}
                        onChange={(e) => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#EFE8DA] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#2C1810] mb-1">
                        Numéro WhatsApp récepteur (sans +)
                      </label>
                      <input
                        type="text"
                        placeholder="221774508989"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#EFE8DA] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#2C1810] mb-1">Téléphone affiché</label>
                      <input
                        type="text"
                        value={settingsForm.displayPhone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, displayPhone: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#EFE8DA] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#2C1810] mb-1">Compte Instagram</label>
                      <input
                        type="text"
                        value={settingsForm.instagramHandle}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#EFE8DA] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#2C1810] mb-1">Compte TikTok</label>
                      <input
                        type="text"
                        value={settingsForm.tiktokHandle}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tiktokHandle: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#EFE8DA] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-[#2C1810] mb-1">
                        Seuil de livraison gratuite (FCFA)
                      </label>
                      <input
                        type="number"
                        value={settingsForm.freeDeliveryThreshold}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })
                        }
                        className="w-full bg-[#FAF7F2] border border-[#EFE8DA] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#2C1810] text-[#DEBF6D] hover:bg-[#3E2419] rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer les paramètres</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Modal Sub-dialog: Add / Edit Product */}
        {(isAddingProduct || isEditingProduct) && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-[#FAF7F2] rounded-2xl max-w-lg w-full border border-[#DEBF6D] p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#EFE8DA] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                  {isEditingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddingProduct(false);
                    setIsEditingProduct(null);
                  }}
                  className="text-[#5C3D2E] hover:text-[#2C1810]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-[#2C1810] mb-1">Nom du produit *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-[#2C1810]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#2C1810] mb-1">Catégorie *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                      className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-[#2C1810]"
                    >
                      <option value="parfums_femmes">Parfum Femme</option>
                      <option value="parfums_hommes">Parfum Homme</option>
                      <option value="parfums_mixtes">Parfum Mixte</option>
                      <option value="savons_hamam">Savon Hamam</option>
                      <option value="produits_naturels">Produits Naturels & Bien-Être</option>
                      <option value="epicerie_gourmandises">Épicerie & Gourmandises</option>
                      <option value="coffrets_parfumerie">Coffrets & Parfumerie</option>
                      <option value="huiles_parfumees">Huile Parfumée</option>
                      <option value="fruits_secs">Douceurs & Fruits Secs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-[#2C1810] mb-1">Volume / Poids *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex : 100 ml ou 250 g"
                      value={formVolume}
                      onChange={(e) => setFormVolume(e.target.value)}
                      className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-[#2C1810]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-[#2C1810] mb-1">Prix (FCFA) *</label>
                    <input
                      type="number"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-[#2C1810]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#2C1810] mb-1">Ancien Prix (barré)</label>
                    <input
                      type="number"
                      value={formOriginalPrice || ''}
                      onChange={(e) =>
                        setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-[#2C1810]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#2C1810] mb-1">Stock (unités) *</label>
                    <input
                      type="number"
                      required
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-[#2C1810]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#2C1810] mb-1">Photo du produit (URL ou chemin)</label>
                  <input
                    type="text"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-[#2C1810]"
                  />
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] text-[#5C3D2E]">Photos suggérées :</span>
                    <button
                      type="button"
                      onClick={() => setFormImage('/src/assets/images/perfume_rose_oud_1794063045805.jpg')}
                      className="text-[10px] text-[#A8813C] underline"
                    >
                      Rose & Oud
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormImage('/src/assets/images/perfume_oriental_gold_1794063044566.jpg')}
                      className="text-[10px] text-[#A8813C] underline"
                    >
                      Or Oriental
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormImage('/src/assets/images/soap_hammam_noir_1794063045937.jpg')}
                      className="text-[10px] text-[#A8813C] underline"
                    >
                      Savon Hammam
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormImage('/src/assets/images/artisanal_dry_fruits_nuts_1794063046121.jpg')}
                      className="text-[10px] text-[#A8813C] underline"
                    >
                      Fruits Secs
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#2C1810] mb-1">Courte description *</label>
                  <input
                    type="text"
                    required
                    value={formShortDesc}
                    onChange={(e) => setFormShortDesc(e.target.value)}
                    className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-[#2C1810]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#2C1810] mb-1">Description complète détaillée</label>
                  <textarea
                    rows={2}
                    value={formFullDesc}
                    onChange={(e) => setFormFullDesc(e.target.value)}
                    className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-[#2C1810]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-[#5C3D2E] mb-1">Notes de Tête</label>
                    <input
                      type="text"
                      value={formTete}
                      onChange={(e) => setFormTete(e.target.value)}
                      className="w-full bg-white border border-[#EFE8DA] rounded-lg px-2 py-1.5 text-xs text-[#2C1810]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#5C3D2E] mb-1">Notes de Cœur</label>
                    <input
                      type="text"
                      value={formCoeur}
                      onChange={(e) => setFormCoeur(e.target.value)}
                      className="w-full bg-white border border-[#EFE8DA] rounded-lg px-2 py-1.5 text-xs text-[#2C1810]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#5C3D2E] mb-1">Notes de Fond</label>
                    <input
                      type="text"
                      value={formFond}
                      onChange={(e) => setFormFond(e.target.value)}
                      className="w-full bg-white border border-[#EFE8DA] rounded-lg px-2 py-1.5 text-xs text-[#2C1810]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingProduct(false);
                      setIsEditingProduct(null);
                    }}
                    className="px-4 py-2 border border-[#EFE8DA] text-[#5C3D2E] rounded-lg hover:bg-[#F7F3EB]"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#2C1810] text-[#DEBF6D] hover:bg-[#3E2419] rounded-lg font-semibold shadow-xs"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
