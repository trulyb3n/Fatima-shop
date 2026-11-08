import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles, Filter, SlidersHorizontal, ArrowUpDown, Check, RefreshCw,
  Search, ShieldCheck, Truck, Clock, Award
} from 'lucide-react';
import { Product, CartItem, Order, CustomerReview, ShopSettings, ProductCategory } from './types';
import {
  getStoredProducts,
  getStoredOrders,
  getStoredReviews,
  getShopSettings,
  addOrder,
  addCustomerReview,
  formatFCFA
} from './services/storage';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminLogin } from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { isAdminAuthenticated } from './services/storage';

export default function App() {
  // Navigation View Mode: 'shop' or 'admin'
  const [viewMode, setViewMode] = useState<'shop' | 'admin'>('shop');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(isAdminAuthenticated());

  // Main Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(getShopSettings());

  // Refresh public data helper
  const refreshPublicData = () => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
    setReviews(getStoredReviews());
    setSettings(getShopSettings());
    setIsAdminLoggedIn(isAdminAuthenticated());
  };

  // Cart State (persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('fatima_shop_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal / View States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filters and Search
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(70000);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'newest'>('recommended');

  // Load Initial Data on Mount
  useEffect(() => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
    setReviews(getStoredReviews());
    setSettings(getShopSettings());
  }, []);

  // Save Cart Changes
  useEffect(() => {
    localStorage.setItem('fatima_shop_cart_v1', JSON.stringify(cart));
  }, [cart]);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderConfirmed = (newOrder: Order) => {
    const updated = addOrder(newOrder);
    setOrders(updated);
    setCart([]);
    setIsCheckoutOpen(false);
    setConfirmedOrder(newOrder);
  };

  const handleAddReview = (newReview: CustomerReview) => {
    const updated = addCustomerReview(newReview);
    setReviews(updated);
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      if (selectedCategory === 'parfums') {
        if (!p.category.startsWith('parfum')) return false;
      } else if (selectedCategory !== 'tous' && p.category !== selectedCategory) {
        return false;
      }
      // Price filter
      if (p.price > maxPrice) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.shortDesc.toLowerCase().includes(query) || p.fullDesc.toLowerCase().includes(query);
        return matchesName || matchesDesc;
      }
      return true;
    });
  }, [products, selectedCategory, maxPrice, searchQuery]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price_asc') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price_desc') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'newest') {
      return list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
    // 'recommended': bestsellers first
    return list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
  }, [filteredProducts, sortBy]);

  // Bestsellers selection for featured section
  const bestsellers = useMemo(() => {
    return products.filter((p) => p.isBestseller).slice(0, 4);
  }, [products]);

  // New arrivals selection
  const newArrivals = useMemo(() => {
    return products.filter((p) => p.isNew).slice(0, 4);
  }, [products]);

  // Natural products selection for dedicated section
  const naturalProducts = useMemo(() => {
    return products.filter((p) => p.category === 'produits_naturels').slice(0, 4);
  }, [products]);

  const scrollToCatalogue = () => {
    const el = document.getElementById('catalogue');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If in Administrator view mode
  if (viewMode === 'admin') {
    if (isAdminLoggedIn) {
      return (
        <AdminDashboard
          onReturnToShop={() => {
            setViewMode('shop');
            refreshPublicData();
          }}
        />
      );
    }
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          refreshPublicData();
        }}
        onBackToShop={() => {
          setViewMode('shop');
          refreshPublicData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C1810] flex flex-col font-sans">
      {/* 1. Header (Top Bar Contract conforming) */}
      <Header
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setViewMode('admin')}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat as ProductCategory);
          scrollToCatalogue();
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        settings={settings}
      />

      {/* 2. Hero Campaign Section */}
      <Hero onExplore={scrollToCatalogue} settings={settings} />

      {/* 3. Bestsellers Showcase (Meilleures Ventes) */}
      {bestsellers.length > 0 && !searchQuery && selectedCategory === 'tous' && (
        <section className="py-12 sm:py-16 bg-[#FAF7F2] border-b border-[#EFE8DA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#A8813C] font-semibold">
                  Sélection d'Élite
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#2C1810]">
                  Les Meilleures Ventes de Fatima Shop
                </h2>
              </div>
              <button
                onClick={scrollToCatalogue}
                className="text-xs font-semibold uppercase tracking-wider text-[#A8813C] hover:text-[#2C1810] transition-colors self-start sm:self-auto cursor-pointer"
              >
                Voir toute la collection →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onBuyNow={(p) => handleBuyNow(p, 1)}
                  onViewDetails={setSelectedProduct}
                  settings={settings}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3b. Dedicated Showcase: Nos Produits Naturels & Bien-Être */}
      {naturalProducts.length > 0 && !searchQuery && selectedCategory === 'tous' && (
        <section className="py-12 sm:py-16 bg-[#F8F5EE] border-b border-[#EFE8DA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1B4332]" />
                  <span className="text-xs uppercase tracking-[0.2em] text-[#1B4332] font-bold">
                    Trésors d'Orient & Rituels Traditionnels
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#2C1810]">
                  Nos Produits Naturels & Bien-Être
                </h2>
                <p className="text-xs text-[#5C3D2E] mt-1 max-w-xl">
                  Argile Ghassoul purifiante, Poudre de Nila saharienne, Huiles précieuses d'avocat, chanvre et nigelle, et élixirs de soin pour la peau et les cheveux.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('produits_naturels');
                  scrollToCatalogue();
                }}
                className="text-xs font-bold uppercase tracking-wider text-[#1B4332] hover:text-[#2C1810] transition-colors self-start sm:self-auto cursor-pointer flex items-center gap-1.5"
              >
                <span>Voir les 14 soins naturels</span>
                <span>→</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {naturalProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onBuyNow={(p) => handleBuyNow(p, 1)}
                  onViewDetails={setSelectedProduct}
                  settings={settings}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Main Product Catalog Section with Categories & Filters */}
      <section id="catalogue" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[#A8813C] font-semibold">
            Boutique & Soins
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2C1810]">
            Notre Catalogue d'Exception
          </h2>
          <p className="text-sm text-[#5C3D2E] font-light">
            Parfums envoûtants, savons traditionnels, soins naturels & bien-être, douceurs d'épicerie et coffrets de prestige.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {[
            { id: 'tous', label: 'Tous les produits' },
            { id: 'parfums', label: 'Parfums (8 000 FCFA)' },
            { id: 'savons_hamam', label: 'Savon Hamam 5 kg (8 500 FCFA)' },
            { id: 'produits_naturels', label: 'Produits Naturels & Soins' },
            { id: 'epicerie_gourmandises', label: 'Épicerie & Gourmandises' },
            { id: 'coffrets_parfumerie', label: 'Coffrets & Parfumerie' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as ProductCategory)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#2C1810] text-[#DEBF6D] shadow-xs'
                  : 'bg-[#F7F3EB] text-[#5C3D2E] hover:bg-[#EFE8DA]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Official Pricing Notice Box */}
        <div className="bg-[#FAF7F2] rounded-xl border border-[#C5A059]/40 p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#2C1810]">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm text-[#A8813C]">Tarification Officielle :</span>
            <span className="text-[#5C3D2E]">
              Tous les parfums à <strong>8 000 FCFA</strong> · Savon Hamam (5 kg) à <strong>8 500 FCFA</strong> · Soins naturels dès <strong>1 000 FCFA</strong> · Épicerie dès <strong>2 000 FCFA</strong>
            </span>
          </div>
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#25D366] hover:underline font-bold whitespace-nowrap flex items-center gap-1 shrink-0"
          >
            Commande WhatsApp directe : 76 140 34 64
          </a>
        </div>

        {/* Filter Controls Bar: Results Count, Price Filter & Sort */}
        <div className="bg-[#F7F3EB] rounded-2xl p-4 sm:p-5 border border-[#EFE8DA] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-[#5C3D2E]">
            <span className="font-semibold text-[#2C1810]">{sortedProducts.length}</span>
            <span>produit{sortedProducts.length > 1 ? 's' : ''} trouvé{sortedProducts.length > 1 ? 's' : ''}</span>
            {searchQuery && (
              <span>
                pour « <strong className="text-[#2C1810]">{searchQuery}</strong> »
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Price slider */}
            <div className="flex items-center gap-2">
              <span className="text-[#5C3D2E]">Prix max :</span>
              <span className="font-bold text-[#2C1810] tabular-nums">{formatFCFA(maxPrice)}</span>
              <input
                type="range"
                min="5000"
                max="70000"
                step="2500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 sm:w-32 accent-[#2C1810] cursor-pointer"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#A8813C]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#EFE8DA] rounded-lg px-2.5 py-1.5 text-xs text-[#2C1810] focus:outline-none"
              >
                <option value="recommended">Recommandés</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="newest">Nouveautés en premier</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {sortedProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#F7F3EB] rounded-2xl border border-[#EFE8DA]">
            <p className="font-serif text-lg text-[#2C1810]">Aucun produit ne correspond à vos critères</p>
            <p className="text-xs text-[#5C3D2E]">
              Essayez d’élargir votre recherche ou de réinitialiser le filtre de prix.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('tous');
                setSearchQuery('');
                setMaxPrice(70000);
              }}
              className="px-4 py-2 bg-[#2C1810] text-[#DEBF6D] rounded-full text-xs font-semibold cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onBuyNow={(p) => handleBuyNow(p, 1)}
                onViewDetails={setSelectedProduct}
                settings={settings}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. Nouveautés Spotlight (Section Nouveautés) */}
      {newArrivals.length > 0 && !searchQuery && selectedCategory === 'tous' && (
        <section className="py-14 bg-[#F7F3EB] border-t border-[#EFE8DA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#A8813C] font-semibold">
                Nouveautés Exclusives
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2C1810]">
                Dernières Créations & Arrivages
              </h2>
              <p className="text-xs sm:text-sm text-[#5C3D2E] font-light">
                Directement venues d’Orient et de nos ateliers de formulation : des senteurs rares et des soins bienfaisants.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onBuyNow={(p) => handleBuyNow(p, 1)}
                  onViewDetails={setSelectedProduct}
                  settings={settings}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Brand Commitments / Trust Bar */}
      <section className="py-12 bg-[#FAF7F2] border-t border-[#EFE8DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-3">
              <Award className="w-6 h-6 text-[#A8813C] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#2C1810]">Haute Parfumerie</h4>
                <p className="text-xs text-[#5C3D2E] mt-1 font-light">
                  Extraits de parfums concentrés à haute tenue garantie sur vêtements et peau.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="w-6 h-6 text-[#A8813C] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#2C1810]">Livraison Express Sénégal</h4>
                <p className="text-xs text-[#5C3D2E] mt-1 font-light">
                  En 2h à 4h à Dakar et sous 24h à 48h dans toutes les autres régions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-[#A8813C] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#2C1810]">Paiement Flexible</h4>
                <p className="text-xs text-[#5C3D2E] mt-1 font-light">
                  Réglez par Wave, Orange Money ou en espèces directement à la livraison.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-[#A8813C] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#2C1810]">Conseil Personnalisé</h4>
                <p className="text-xs text-[#5C3D2E] mt-1 font-light">
                  Échangez en direct avec nos conseillères beauté sur WhatsApp 7j/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Reviews Section */}
      <ReviewsSection reviews={reviews} onAddReview={handleAddReview} />

      {/* 8. Footer */}
      <Footer
        onOpenAdmin={() => setViewMode('admin')}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat as ProductCategory);
          scrollToCatalogue();
        }}
        settings={settings}
      />

      {/* 9. Floating WhatsApp Support Button */}
      <FloatingWhatsApp settings={settings} />

      {/* 10. Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty) => handleAddToCart(p, qty)}
        onBuyNow={(p, qty) => handleBuyNow(p, qty)}
        settings={settings}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        settings={settings}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderConfirmed={handleOrderConfirmed}
        settings={settings}
      />

      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        settings={settings}
      />
    </div>
  );
}
