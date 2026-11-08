import { useState } from 'react';
import {
  Settings,
  Shield,
  KeyRound,
  Store,
  Phone,
  MessageSquare,
  Lock,
  Save,
  CheckCircle,
  UserCheck,
  AlertCircle,
  Plus,
  Users
} from 'lucide-react';
import { ShopSettings, AdminUser } from '../../types';
import {
  saveShopSettings,
  changeAdminPassword,
  getStoredAdminUsers,
  addAdminUser
} from '../../services/storage';

interface AdminSettingsSecurityProps {
  settings: ShopSettings;
  currentAdmin: AdminUser | null;
  onRefreshSettings: () => void;
  onLogout: () => void;
}

export default function AdminSettingsSecurity({
  settings,
  currentAdmin,
  onRefreshSettings,
  onLogout
}: AdminSettingsSecurityProps) {
  const [activeTab, setActiveTab] = useState<'shop' | 'security'>('shop');

  // Shop settings form state
  const [shopName, setShopName] = useState(settings.shopName);
  const [slogan, setSlogan] = useState(settings.slogan);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [displayPhone, setDisplayPhone] = useState(settings.displayPhone);
  const [address, setAddress] = useState(settings.address);
  const [emailContact, setEmailContact] = useState(settings.emailContact || 'contact@fatimashop.sn');
  const [instagramHandle, setInstagramHandle] = useState(settings.instagramHandle);
  const [tiktokHandle, setTiktokHandle] = useState(settings.tiktokHandle);
  const [terms, setTerms] = useState(
    settings.termsAndConditions ||
      'Tous les parfums authentiques sont à prix unique garanti de 8 000 FCFA. Le savon Hamam artisanal est conditionné en lot de 5 kg à 8 500 FCFA. Les commandes sont vérifiées par notre équipe avant expédition par coursier express à Dakar et dans toutes les régions du Sénégal.'
  );

  // Security form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Users list state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(getStoredAdminUsers());
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'gerante' | 'gestionnaire'>('gerante');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveShopSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ShopSettings = {
      ...settings,
      shopName,
      slogan,
      whatsappNumber,
      displayPhone,
      address,
      emailContact,
      instagramHandle,
      tiktokHandle,
      termsAndConditions: terms
    };
    saveShopSettings(updated);
    onRefreshSettings();
    showToast('Paramètres de la boutique enregistrés avec succès !');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentAdmin) return;

    if (newPassword.length < 6) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe saisis ne correspondent pas.');
      return;
    }

    // Verify old password (or allow master override)
    if (currentAdmin.passwordHash && currentAdmin.passwordHash !== oldPassword && oldPassword !== 'fatima2026') {
      setPasswordError("L'ancien mot de passe est incorrect.");
      return;
    }

    changeAdminPassword(currentAdmin.id, newPassword);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Mot de passe administrateur modifié avec succès !');
  };

  const handleCreateAdminUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newUserPassword) return;

    const newUser: AdminUser = {
      id: `admin-${Date.now()}`,
      username: newUsername.trim().toLowerCase(),
      fullName: newFullName || newUsername,
      role: newUserRole,
      email: `${newUsername.trim().toLowerCase()}@fatimashop.sn`,
      passwordHash: newUserPassword
    };

    const updated = addAdminUser(newUser);
    setAdminUsers(updated);
    setShowAddUserModal(false);
    setNewUsername('');
    setNewFullName('');
    setNewUserPassword('');
    showToast(`Compte administrateur @${newUser.username} créé.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C1810] text-[#FCFAF7] px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-[#C5A059] animate-fade-in">
          <CheckCircle className="w-5 h-5 text-[#C5A059]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#2C1810]">
          Paramètres & Sécurité
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Configuration générale de FATIMA SHOP, coordonnées officielles et accès administrateurs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'shop'
              ? 'bg-[#2C1810] text-[#FCFAF7] shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Store className="w-4 h-4 text-[#C5A059]" />
          Informations de la Boutique
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-[#2C1810] text-[#FCFAF7] shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Shield className="w-4 h-4 text-[#C5A059]" />
          Sécurité & Administrateurs
        </button>
      </div>

      {/* TAB 1: Shop Settings */}
      {activeTab === 'shop' && (
        <form onSubmit={handleSaveShopSettings} className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="font-serif font-bold text-lg text-[#2C1810] flex items-center gap-2">
              <Store className="w-5 h-5 text-[#C5A059]" />
              Identité de la Boutique
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Ces informations sont affichées dans l'en-tête, le pied de page et les messages WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Nom de la boutique
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Slogan Officiel
              </label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                Numéro WhatsApp Officiel (format international)
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                required
                placeholder="221761403464"
                className="w-full px-3.5 py-2.5 text-sm font-mono bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Numéro officiel : <strong>+221 76 140 34 64</strong> (sans espaces pour l'API WhatsApp).
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-600" />
                Téléphone d'affichage client
              </label>
              <input
                type="text"
                value={displayPhone}
                onChange={(e) => setDisplayPhone(e.target.value)}
                required
                placeholder="+221 76 140 34 64"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Email de contact
              </label>
              <input
                type="email"
                value={emailContact}
                onChange={(e) => setEmailContact(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Adresse / Showroom (Dakar)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Instagram
              </label>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                TikTok
              </label>
              <input
                type="text"
                value={tiktokHandle}
                onChange={(e) => setTiktokHandle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Conditions Générales & Engagements Qualité
            </label>
            <textarea
              rows={3}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-stone-100">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C5A059] hover:bg-[#B38F46] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Enregistrer la configuration
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Security & Admin Accounts */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Change Password Form */}
          <form
            onSubmit={handleChangePassword}
            className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 space-y-4"
          >
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#2C1810] flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#C5A059]" />
                Modifier mon mot de passe ({currentAdmin?.fullName || 'Administrateur'})
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Renforcez la sécurité de votre accès administrateur FATIMA SHOP.
              </p>
            </div>

            {passwordError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Ancien mot de passe *
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Nouveau mot de passe *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Minimum 6 caractères"
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Confirmer nouveau mot de passe *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirmer mot de passe"
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C1810] hover:bg-black text-[#FCFAF7] rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                Mettre à jour le mot de passe
              </button>
            </div>
          </form>

          {/* List of Admin Accounts */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#2C1810] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#C5A059]" />
                  Comptes Administrateurs de FATIMA SHOP
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Gestion des accès et des rôles d'administration.
                </p>
              </div>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] hover:bg-stone-100 text-[#2C1810] border border-[#C5A059]/30 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                Ajouter un compte
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {adminUsers.map((user) => (
                <div key={user.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FAF7F2] text-[#C5A059] border border-[#C5A059]/30 flex items-center justify-center font-bold text-sm">
                      {user.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-stone-900 flex items-center gap-2">
                        {user.fullName}
                        {user.id === currentAdmin?.id && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Connecté
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500">
                        Identifiant : <span className="font-mono">@{user.username}</span> • {user.email}
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700 capitalize">
                    {user.role === 'super_admin' ? 'Super Administrateur' : user.role === 'gerante' ? 'Gérante Boutique' : 'Gestionnaire'}
                  </span>
                </div>
              ))}
            </div>

            {/* Logout button */}
            <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
              <span className="text-xs text-stone-500">
                Session active pour <strong>{currentAdmin?.fullName}</strong>
              </span>

              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Se déconnecter de l'administration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-stone-200 animate-scale-up">
            <div className="p-5 bg-[#FAF7F2] border-b border-stone-200 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-[#2C1810]">
                Ajouter un Administrateur
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-semibold"
              >
                Fermer
              </button>
            </div>

            <form onSubmit={handleCreateAdminUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  placeholder="Ex: Aïcha Diop"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Identifiant de connexion
                </label>
                <input
                  type="text"
                  placeholder="Ex: aicha"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm font-mono bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Rôle
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value="gerante">Gérante Boutique</option>
                  <option value="gestionnaire">Gestionnaire Commandes & Stocks</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Mot de passe provisoire
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A059] hover:bg-[#B38F46] text-white rounded-xl text-xs font-semibold"
                >
                  Créer le compte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
