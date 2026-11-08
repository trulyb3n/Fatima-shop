import { useState } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Percent,
  Calendar,
  X,
  Sparkles
} from 'lucide-react';
import { Promotion } from '../../types';
import {
  formatFCFA,
  addPromotion,
  deletePromotion,
  updatePromotion
} from '../../services/storage';

interface AdminPromotionsProps {
  promotions: Promotion[];
  onRefreshPromotions: () => void;
}

export default function AdminPromotions({
  promotions,
  onRefreshPromotions
}: AdminPromotionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<number>(10);
  const [minPurchase, setMinPurchase] = useState<number>(15000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleOpenModal = (promo?: Promotion) => {
    if (promo) {
      setEditingPromo(promo);
      setCode(promo.code);
      setType(promo.type);
      setValue(promo.value);
      setMinPurchase(promo.minPurchase || 0);
      setStartDate(promo.startDate);
      setEndDate(promo.endDate);
      setUsageLimit(promo.usageLimit);
      setIsActive(promo.isActive);
    } else {
      setEditingPromo(null);
      setCode('');
      setType('percentage');
      setValue(10);
      setMinPurchase(16000);
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setUsageLimit(50);
      setIsActive(true);
    }
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setFormError('Le code promotionnel est obligatoire.');
      return;
    }
    if (value <= 0) {
      setFormError('La valeur de la réduction doit être supérieure à 0.');
      return;
    }

    const cleanCode = code.trim().toUpperCase();

    if (editingPromo) {
      const updated: Promotion = {
        ...editingPromo,
        code: cleanCode,
        type,
        value: Number(value),
        minPurchase: Number(minPurchase) || undefined,
        startDate,
        endDate,
        usageLimit: Number(usageLimit),
        isActive
      };
      updatePromotion(updated);
      showToast(`Code promo ${cleanCode} mis à jour.`);
    } else {
      const newPromo: Promotion = {
        id: `promo-${Date.now()}`,
        code: cleanCode,
        type,
        value: Number(value),
        minPurchase: Number(minPurchase) || undefined,
        startDate,
        endDate,
        usageLimit: Number(usageLimit),
        timesUsed: 0,
        isActive
      };
      addPromotion(newPromo);
      showToast(`Code promo ${cleanCode} créé avec succès !`);
    }

    onRefreshPromotions();
    setIsModalOpen(false);
  };

  const handleToggleActive = (promo: Promotion) => {
    const updated = { ...promo, isActive: !promo.isActive };
    updatePromotion(updated);
    onRefreshPromotions();
    showToast(`Code ${promo.code} ${updated.isActive ? 'activé' : 'désactivé'}.`);
  };

  const handleDelete = (promoId: string, promoCode: string) => {
    if (confirm(`Confirmez-vous la suppression du code ${promoCode} ?`)) {
      deletePromotion(promoId);
      onRefreshPromotions();
      showToast(`Code ${promoCode} supprimé.`);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#2C1810]">Codes Promo & Réductions</h2>
          <p className="text-sm text-stone-600 mt-1">
            Gérez les offres promotionnelles applicables lors de la commande par vos clientes.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C5A059] hover:bg-[#B38F46] text-white rounded-xl text-sm font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nouveau Code Promo
        </button>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => {
          const isExpired = promo.endDate && promo.endDate < new Date().toISOString().split('T')[0];

          return (
            <div
              key={promo.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition-all relative overflow-hidden ${
                !promo.isActive || isExpired
                  ? 'border-stone-200 opacity-75'
                  : 'border-[#C5A059]/30 hover:border-[#C5A059]'
              }`}
            >
              {/* Badge top right */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-lg font-bold tracking-wider px-3 py-1 bg-[#FAF7F2] text-[#2C1810] border border-[#C5A059]/40 rounded-lg">
                  {promo.code}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(promo)}
                    className="text-stone-400 hover:text-[#C5A059] transition-colors cursor-pointer"
                    title={promo.isActive ? 'Désactiver' : 'Activer'}
                  >
                    {promo.isActive ? (
                      <ToggleRight className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-stone-400" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(promo.id, promo.code)}
                    className="text-stone-300 hover:text-red-500 transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Discount Amount */}
              <div className="text-2xl font-bold font-serif text-[#2C1810] flex items-center gap-2 mb-2">
                {promo.type === 'percentage' ? (
                  <>
                    <span>-{promo.value}%</span>
                    <span className="text-xs font-normal text-stone-500 font-sans">sur le panier</span>
                  </>
                ) : (
                  <>
                    <span>-{formatFCFA(promo.value)}</span>
                    <span className="text-xs font-normal text-stone-500 font-sans">remise fixe</span>
                  </>
                )}
              </div>

              {/* Conditions */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                <div className="flex justify-between">
                  <span>Panier minimum :</span>
                  <span className="font-medium text-stone-900">
                    {promo.minPurchase ? formatFCFA(promo.minPurchase) : 'Aucun'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Utilisations :</span>
                  <span className="font-medium text-stone-900">
                    {promo.timesUsed} / {promo.usageLimit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Période de validité :</span>
                  <span className={`font-medium ${isExpired ? 'text-red-600' : 'text-stone-900'}`}>
                    {new Date(promo.startDate).toLocaleDateString('fr-FR')} au{' '}
                    {new Date(promo.endDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isExpired
                      ? 'bg-red-50 text-red-600'
                      : promo.isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  {isExpired ? 'Expiré' : promo.isActive ? 'Actif' : 'Désactivé'}
                </span>

                <button
                  onClick={() => handleOpenModal(promo)}
                  className="text-xs text-[#C5A059] font-medium hover:underline cursor-pointer"
                >
                  Modifier
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-stone-200 animate-scale-up">
            <div className="p-5 bg-[#FAF7F2] border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif font-bold text-lg text-[#2C1810]">
                  {editingPromo ? 'Modifier le code promo' : 'Nouveau Code Promo'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200/60 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Code Promotionnel *
                </label>
                <input
                  type="text"
                  placeholder="EX: FATIMA10, AID2026..."
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  className="w-full px-3.5 py-2.5 font-mono font-bold text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Type de remise
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                  >
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant fixe (FCFA)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Valeur *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">
                      {type === 'percentage' ? '%' : 'FCFA'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Achat minimum requis (FCFA)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={minPurchase}
                  onChange={(e) => setMinPurchase(Number(e.target.value))}
                  placeholder="0 pour aucun"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                />
                <span className="text-[11px] text-stone-400">Ex: 16 000 FCFA pour 2 parfums minimum</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Limite d'utilisation
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                  />
                </div>

                <div className="pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded text-[#C5A059] focus:ring-[#C5A059]"
                    />
                    <span className="text-xs font-semibold text-stone-700">Code actif immédiatement</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-stone-600 hover:text-stone-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#B38F46] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  {editingPromo ? 'Enregistrer les modifications' : 'Créer le code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
