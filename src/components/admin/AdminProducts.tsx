import React, { useState, useRef } from 'react';
import {
  Plus, Edit2, Trash2, Eye, EyeOff, Search, ArrowUpDown,
  Download, Image as ImageIcon, Check, X, AlertCircle, RefreshCw, Star,
  Upload, CheckCircle2, ShieldAlert, Sparkles, MoveUp, Camera
} from 'lucide-react';
import { Product, ProductCategory } from '../../types';
import { formatFCFA, exportProductsToCSV } from '../../services/storage';

interface AdminProductsProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleActive: (productId: string) => void;
  onResetToDefault: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToggleActive,
  onResetToDefault
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeModal, setActiveModal] = useState<'none' | 'add' | 'edit'>('none');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('parfums_femmes');
  const [formPrice, setFormPrice] = useState(8000);
  const [formCostPrice, setFormCostPrice] = useState(5000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(undefined);
  const [formVolume, setFormVolume] = useState('Flacon vaporisateur');
  const [formStock, setFormStock] = useState(20);
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formIsBestseller, setFormIsBestseller] = useState(false);

  // Advanced Photo Management State
  const [formPhotos, setFormPhotos] = useState<string[]>([]);
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<number>(0);
  const [formVerificationStatus, setFormVerificationStatus] = useState<'verified' | 'temporary'>('verified');
  const [urlInput, setUrlInput] = useState('');
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  // Open Edit Modal
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormCostPrice(p.costPrice || Math.round(p.price * 0.65));
    setFormOriginalPrice(p.originalPrice);
    setFormVolume(p.volumeOrWeight);
    setFormStock(p.stock);
    setFormShortDesc(p.shortDesc);
    setFormFullDesc(p.fullDesc);
    setFormIsActive(p.isActive !== false);
    setFormIsBestseller(!!p.isBestseller);

    // Photos init
    const allPhotos = p.images && p.images.length > 0 ? [...p.images] : [p.image];
    if (!allPhotos.includes(p.image)) {
      allPhotos.unshift(p.image);
    }
    setFormPhotos(allPhotos.filter(Boolean));
    setSelectedPreviewIndex(0);
    setFormVerificationStatus(p.photoVerificationStatus || (p.isVerifiedPhoto !== false ? 'verified' : 'temporary'));
    setFileUploadError(null);
    setUrlInput('');
    setActiveModal('edit');
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('parfums_femmes');
    setFormPrice(8000);
    setFormCostPrice(5000);
    setFormOriginalPrice(undefined);
    setFormVolume('Flacon vaporisateur');
    setFormStock(25);
    setFormShortDesc('');
    setFormFullDesc('');
    setFormIsActive(true);
    setFormIsBestseller(false);

    // Default photo placeholder
    setFormPhotos(['/src/assets/images/perfume_diable_1794066654936.jpg']);
    setSelectedPreviewIndex(0);
    setFormVerificationStatus('verified');
    setFileUploadError(null);
    setUrlInput('');
    setActiveModal('add');
  };

  // Handle file upload from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setFileUploadError('Le fichier sélectionné doit être une image.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setFormPhotos((prev) => [...prev, base64]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input value to allow re-uploading the same file
    if (e.target) e.target.value = '';
  };

  // Handle replacing a specific photo
  const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (replacingIndex === null) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileUploadError('Le fichier sélectionné doit être une image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setFormPhotos((prev) => {
          const updated = [...prev];
          updated[replacingIndex] = base64;
          return updated;
        });
      }
    };
    reader.readAsDataURL(file);
    setReplacingIndex(null);
    if (e.target) e.target.value = '';
  };

  // Set as primary photo
  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    setFormPhotos((prev) => {
      const updated = [...prev];
      const [chosen] = updated.splice(index, 1);
      updated.unshift(chosen);
      return updated;
    });
    setSelectedPreviewIndex(0);
  };

  // Remove a photo
  const handleRemovePhoto = (index: number) => {
    if (formPhotos.length <= 1) {
      alert('Un produit doit comporter au moins une photo principale.');
      return;
    }
    setFormPhotos((prev) => prev.filter((_, i) => i !== index));
    if (selectedPreviewIndex >= formPhotos.length - 1) {
      setSelectedPreviewIndex(0);
    }
  };

  // Add photo via direct URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setFormPhotos((prev) => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (formPhotos.length === 0) {
      setFileUploadError('Veuillez ajouter au moins une photo pour le produit.');
      return;
    }

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

    const mainImage = formPhotos[0];
    const isVerified = formVerificationStatus === 'verified';

    if (activeModal === 'edit' && editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: formName.trim(),
        category: formCategory,
        categoryLabel: categoryLabels[formCategory] || 'Produit',
        price: Number(formPrice),
        costPrice: Number(formCostPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        volumeOrWeight: formVolume.trim(),
        stock: Number(formStock),
        image: mainImage,
        images: formPhotos,
        isVerifiedPhoto: isVerified,
        photoVerificationStatus: formVerificationStatus,
        shortDesc: formShortDesc.trim() || editingProduct.shortDesc,
        fullDesc: formFullDesc.trim() || editingProduct.fullDesc,
        isActive: formIsActive,
        isBestseller: formIsBestseller
      };
      onUpdateProduct(updated);
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formName.trim(),
        category: formCategory,
        categoryLabel: categoryLabels[formCategory] || 'Produit',
        price: Number(formPrice),
        costPrice: Number(formCostPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        volumeOrWeight: formVolume.trim() || 'Flacon vaporisateur',
        stock: Number(formStock),
        image: mainImage,
        images: formPhotos,
        isVerifiedPhoto: isVerified,
        photoVerificationStatus: formVerificationStatus,
        shortDesc: formShortDesc.trim() || 'Fragrance d’exception disponible chez FATIMA SHOP.',
        fullDesc: formFullDesc.trim() || 'Produit raffiné sélectionné pour sa qualité supérieure et sa tenue incomparable.',
        isActive: formIsActive,
        isBestseller: formIsBestseller,
        isNew: true,
        rating: 5.0,
        reviewsCount: 1
      };
      onAddProduct(newProduct);
    }

    setActiveModal('none');
  };

  const filtered = products.filter((p) => {
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'parfums' && !p.category.startsWith('parfum')) return false;
      if (categoryFilter !== 'parfums' && p.category !== categoryFilter) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return p.name.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hidden file input for replacing */}
      <input
        type="file"
        ref={replaceFileInputRef}
        onChange={handleReplaceFile}
        accept="image/*"
        className="hidden"
      />

      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2C1810]">
            Catalogue & Gestion des Photos
          </h2>
          <p className="text-xs text-[#5C3D2E] mt-0.5">
            Photographies haute définition, multi-photos, tarifs stricts et stocks en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => exportProductsToCSV(products)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-[#EFE8DA] text-[#5C3D2E] hover:text-[#2C1810] hover:bg-[#F7F3EB] shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#A8813C]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onResetToDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-[#EFE8DA] text-[#5C3D2E] hover:text-[#2C1810] hover:bg-[#F7F3EB] shadow-xs transition-colors cursor-pointer"
            title="Recharger le catalogue officiel"
          >
            <RefreshCw className="w-4 h-4 text-[#A8813C]" />
            <span>Réinitialiser photos</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#2C1810] text-[#DEBF6D] hover:bg-[#3E2419] shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Produit</span>
          </button>
        </div>
      </div>

      {/* Quality Charter Alert Banner */}
      <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#C5A059]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-[#2C1810]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2C1810] text-[#DEBF6D] flex items-center justify-center shrink-0 shadow-xs">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold font-serif text-sm text-[#A8813C] block">Charte Qualité Photographique FATIMA SHOP :</span>
            <span className="text-[#5C3D2E]">
              Chaque produit possède une photographie fidèle et individuelle ({products.length} références actives). Vous pouvez importer directement les photos réelles depuis votre téléphone ou ordinateur.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {products.length} Produits avec photos vérifiées
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EFE8DA] shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-center text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#5C3D2E]/60" />
          <input
            type="text"
            placeholder="Rechercher un parfum, savon, huile, épices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#EFE8DA] rounded-xl pl-9 pr-3 py-2 text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[#5C3D2E] font-medium whitespace-nowrap">Filtrer :</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#FAF7F2] border border-[#EFE8DA] rounded-xl px-3 py-2 text-[#2C1810] font-medium focus:outline-none focus:border-[#C5A059]"
          >
            <option value="all">Tous les produits ({products.length})</option>
            <option value="parfums">Tous les Parfums (8 000 FCFA)</option>
            <option value="savons_hamam">Savons Hamam (5 kg)</option>
            <option value="produits_naturels">Produits Naturels & Soins</option>
            <option value="epicerie_gourmandises">Épicerie & Gourmandises</option>
            <option value="coffrets_parfumerie">Coffrets & Parfumerie</option>
            <option value="parfums_femmes">Parfums Femmes</option>
            <option value="parfums_hommes">Parfums Hommes</option>
            <option value="parfums_mixtes">Parfums Mixtes</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#EFE8DA] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#EFE8DA] text-[#5C3D2E] uppercase font-semibold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Produit & Photographie</th>
                <th className="py-3.5 px-4">Qualité Photo</th>
                <th className="py-3.5 px-4">Catégorie</th>
                <th className="py-3.5 px-4">Prix Vente</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Statut Vente</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8DA]">
              {filtered.map((p) => {
                const isActive = p.isActive !== false;
                const isPhotoVerified = p.photoVerificationStatus !== 'temporary' && p.isVerifiedPhoto !== false;
                const photoCount = (p.images && p.images.length > 0) ? p.images.length : 1;

                return (
                  <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    {/* Product Cell */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative group/thumb">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-14 h-14 object-cover rounded-xl bg-[#FAF7F2] border border-[#EFE8DA] shadow-xs shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          {photoCount > 1 && (
                            <span className="absolute -bottom-1 -right-1 bg-[#2C1810] text-[#DEBF6D] text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                              +{photoCount - 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#2C1810] text-sm">{p.name}</span>
                            {p.isBestseller && (
                              <span title="Meilleure vente">
                                <Star className="w-3.5 h-3.5 fill-[#DEBF6D] text-[#DEBF6D]" />
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#5C3D2E]/80">{p.volumeOrWeight}</span>
                        </div>
                      </div>
                    </td>

                    {/* Photo Quality Status */}
                    <td className="py-3.5 px-4">
                      {isPhotoVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Photo Authentique
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          Photo Temporaire
                        </span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-[#5C3D2E] font-medium">
                      {p.categoryLabel}
                    </td>

                    {/* Price in FCFA */}
                    <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#2C1810] tabular-nums whitespace-nowrap">
                      {formatFCFA(p.price)}
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4 tabular-nums">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-xs ${
                          p.stock === 0
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : p.stock <= 5
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {p.stock === 0 ? 'Rupture' : `${p.stock} unités`}
                      </span>
                    </td>

                    {/* Active Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onToggleActive(p.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {isActive ? 'En Ligne' : 'Masqué'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="px-2.5 py-1.5 bg-[#FAF7F2] hover:bg-[#F7F3EB] text-[#2C1810] border border-[#EFE8DA] rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Modifier les photos et informations"
                        >
                          <Camera className="w-3.5 h-3.5 text-[#A8813C]" />
                          <span>Gérer photos</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Confirmez-vous la suppression de « ${p.name} » ?`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-stone-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal Dialog with Advanced Photo Management */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#FAF7F2] rounded-2xl max-w-3xl w-full border border-[#DEBF6D] p-6 space-y-5 max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EFE8DA] pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2C1810]">
                  {activeModal === 'edit' ? `Gestion du Produit « ${editingProduct?.name} »` : 'Ajouter un Nouveau Produit'}
                </h3>
                <p className="text-xs text-[#5C3D2E] mt-0.5">
                  Gestion des photos authentiques, formats et caractéristiques commerciales.
                </p>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="text-[#5C3D2E] hover:text-[#2C1810] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              {fileUploadError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileUploadError}</span>
                </div>
              )}

              {/* SECTION: Advanced Multi-Photo Management */}
              <div className="bg-white p-5 rounded-2xl border border-[#EFE8DA] space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFE8DA] pb-3">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#A8813C]" />
                    <h4 className="font-serif font-bold text-sm text-[#2C1810]">
                      Photographies du Produit ({formPhotos.length})
                    </h4>
                  </div>

                  {/* Photo Verification Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#5C3D2E] font-medium">Statut de la photo :</span>
                    <select
                      value={formVerificationStatus}
                      onChange={(e) => setFormVerificationStatus(e.target.value as any)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border ${
                        formVerificationStatus === 'verified'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="verified">Authentique Vérifiée</option>
                      <option value="temporary">Photo Temporaire (À remplacer)</option>
                    </select>
                  </div>
                </div>

                {/* Upload Action Bar */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* File Upload Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-[#2C1810] text-[#DEBF6D] hover:bg-[#3E2419] rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Importer depuis votre téléphone / PC</span>
                  </button>

                  {/* Add URL Form */}
                  <div className="flex-1 flex gap-2 min-w-[240px]">
                    <input
                      type="text"
                      placeholder="Ou coller une URL d'image..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1 bg-[#FAF7F2] border border-[#EFE8DA] rounded-xl px-3 py-2 text-xs text-[#2C1810]"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-[#2C1810] rounded-xl font-medium"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                {/* Main Preview Container */}
                {formPhotos.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#FAF7F2] p-4 rounded-xl border border-[#EFE8DA]">
                    {/* Active Preview */}
                    <div className="md:col-span-5 flex flex-col items-center">
                      <div className="relative aspect-square w-full max-w-[220px] bg-white rounded-xl overflow-hidden border border-[#EFE8DA] shadow-xs">
                        <img
                          src={formPhotos[selectedPreviewIndex] || formPhotos[0]}
                          alt="Prévisualisation"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {selectedPreviewIndex === 0 && (
                          <span className="absolute top-2 left-2 bg-[#2C1810] text-[#DEBF6D] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> Photo Principale
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#5C3D2E] mt-2">
                        Photo {selectedPreviewIndex + 1} sur {formPhotos.length}
                      </span>
                    </div>

                    {/* Gallery Thumbnails List */}
                    <div className="md:col-span-7 flex flex-col justify-between">
                      <div>
                        <span className="block text-[11px] font-semibold text-[#2C1810] mb-2 uppercase tracking-wider">
                          Photos associées au produit (Cliquez pour prévisualiser) :
                        </span>

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                          {formPhotos.map((photoUrl, idx) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedPreviewIndex(idx)}
                              className={`relative group aspect-square rounded-xl overflow-hidden border cursor-pointer transition-all ${
                                selectedPreviewIndex === idx
                                  ? 'border-[#2C1810] ring-2 ring-[#C5A059]'
                                  : 'border-[#EFE8DA] hover:border-[#C5A059]'
                              }`}
                            >
                              <img
                                src={photoUrl}
                                alt={`Vignette ${idx + 1}`}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />

                              {idx === 0 && (
                                <div className="absolute top-1 left-1 bg-[#2C1810] text-[#DEBF6D] rounded-full p-0.5 shadow-xs">
                                  <Star className="w-3 h-3 fill-current" />
                                </div>
                              )}

                              {/* Hover controls overlay */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                                {idx !== 0 && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSetPrimary(idx);
                                    }}
                                    className="p-1 rounded bg-[#C5A059] text-[#2C1810] text-[9px] font-bold w-full text-center hover:bg-[#DEBF6D]"
                                    title="Définir comme photo principale"
                                  >
                                    Principale
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setReplacingIndex(idx);
                                    replaceFileInputRef.current?.click();
                                  }}
                                  className="p-1 rounded bg-white text-stone-900 text-[9px] font-semibold w-full text-center hover:bg-stone-100"
                                  title="Remplacer cette photo"
                                >
                                  Remplacer
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemovePhoto(idx);
                                  }}
                                  className="p-1 rounded bg-red-600 text-white text-[9px] font-semibold w-full text-center hover:bg-red-700"
                                  title="Supprimer cette photo"
                                >
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-[#EFE8DA] text-[11px] text-[#5C3D2E] space-y-1">
                        <p>• La <strong>première photo</strong> sera affichée en grand sur la boutique.</p>
                        <p>• Les autres photos apparaîtront en vignettes cliquables dans la fiche produit.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: Product Details & Prices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#2C1810] mb-1">Nom officiel *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex : Diable, Si Armani, Ameer Oud..."
                    className="w-full bg-white border border-[#EFE8DA] rounded-xl px-3 py-2 text-[#2C1810]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2C1810] mb-1">Catégorie *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                    className="w-full bg-white border border-[#EFE8DA] rounded-xl px-3 py-2 text-[#2C1810]"
                  >
                    <option value="parfums_femmes">Parfum Femme (8 000 FCFA)</option>
                    <option value="parfums_hommes">Parfum Homme (8 000 FCFA)</option>
                    <option value="parfums_mixtes">Parfum Mixte (8 000 FCFA)</option>
                    <option value="savons_hamam">Savon Hamam 5 kg (8 500 FCFA)</option>
                    <option value="produits_naturels">Produits Naturels & Bien-Être</option>
                    <option value="epicerie_gourmandises">Épicerie & Gourmandises</option>
                    <option value="coffrets_parfumerie">Coffrets & Parfumerie</option>
                    <option value="huiles_parfumees">Huile Parfumée</option>
                    <option value="fruits_secs">Douceurs & Fruits Secs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#2C1810] mb-1">Prix de vente (FCFA) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-white border border-[#EFE8DA] rounded-xl px-3 py-2 text-[#2C1810] font-bold"
                  />
                  <span className="text-[10px] text-[#5C3D2E] mt-0.5 block">
                    8 000 FCFA (parfums) / 8 500 FCFA (savon 5 kg)
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-[#2C1810] mb-1">Coût d'achat unitaire (FCFA)</label>
                  <input
                    type="number"
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(Number(e.target.value))}
                    className="w-full bg-white border border-[#EFE8DA] rounded-xl px-3 py-2 text-[#2C1810]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2C1810] mb-1">Quantité en Stock *</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full bg-white border border-[#EFE8DA] rounded-xl px-3 py-2 text-[#2C1810]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2C1810] mb-1">Format / Poids *</label>
                  <input
                    type="text"
                    required
                    value={formVolume}
                    onChange={(e) => setFormVolume(e.target.value)}
                    placeholder="Ex : Flacon vaporisateur ou Lot de 5 kg"
                    className="w-full bg-white border border-[#EFE8DA] rounded-xl px-3 py-2 text-[#2C1810]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2C1810] mb-1">Prix barré / Promo (optionnel)</label>
                  <input
                    type="number"
                    value={formOriginalPrice || ''}
                    onChange={(e) => setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Ex : 10000"
                    className="w-full bg-white border border-[#EFE8DA] rounded-xl px-3 py-2 text-[#2C1810]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2C1810] mb-1">Description courte (accroche)</label>
                <input
                  type="text"
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="Phrase d'accroche pour la boutique"
                  className="w-full bg-white border border-[#EFE8DA] rounded-xl px-3 py-2 text-[#2C1810]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2C1810] mb-1">Description détaillée</label>
                <textarea
                  rows={2}
                  value={formFullDesc}
                  onChange={(e) => setFormFullDesc(e.target.value)}
                  placeholder="Détails complets de la fragrance ou du rituel hammam"
                  className="w-full bg-white border border-[#EFE8DA] rounded-xl px-3 py-2 text-[#2C1810]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2 border-t border-[#EFE8DA]">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#2C1810]">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="accent-[#2C1810] w-4 h-4"
                  />
                  <span>Produit visible sur la boutique (Actif)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#2C1810]">
                  <input
                    type="checkbox"
                    checked={formIsBestseller}
                    onChange={(e) => setFormIsBestseller(e.target.checked)}
                    className="accent-[#2C1810] w-4 h-4"
                  />
                  <span>Mettre en avant dans « Meilleures Ventes »</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#EFE8DA]">
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="px-4 py-2 rounded-xl border border-[#EFE8DA] text-[#5C3D2E] hover:bg-[#F7F3EB] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2C1810] text-[#DEBF6D] hover:bg-[#3E2419] rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Enregistrer et Publier sur le Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
