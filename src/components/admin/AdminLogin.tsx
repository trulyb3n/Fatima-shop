import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { AdminUser } from '../../types';
import { loginAdminWithCredentials } from '../../services/storage';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToShop: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToShop }) => {
  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = loginAdminWithCredentials(identifier, password);
    if (res.success && res.user) {
      onLoginSuccess(res.user);
    } else {
      setErrorMsg(res.error || 'Identifiant ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#DEBF6D]/30 selection:text-[#2C1810]">
      {/* Top back button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onBackToShop}
          className="flex items-center gap-2 text-xs font-semibold text-[#5C3D2E] hover:text-[#2C1810] px-4 py-2 rounded-full border border-[#EFE8DA] bg-white hover:bg-[#F7F3EB] transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#A8813C]" />
          <span>Retour à la Boutique Fatima Shop</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Lockup */}
        <div className="w-14 h-14 rounded-full bg-[#2C1810] text-[#DEBF6D] flex items-center justify-center font-serif text-2xl font-bold mx-auto shadow-md border border-[#C5A059]/40 mb-4">
          F
        </div>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-[#2C1810]">
          FATIMA SHOP
        </h2>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-[#A8813C] font-semibold">
          Espace d’Administration Sécurisé
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-[#EFE8DA] sm:px-10 space-y-6">
          <div className="flex items-center gap-2 text-xs text-[#5C3D2E] pb-3 border-b border-[#EFE8DA]">
            <ShieldCheck className="w-4 h-4 text-[#A8813C] shrink-0" />
            <span>Accès strictement réservé à la gérante et aux gestionnaires habilités.</span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                Identifiant ou Adresse e-mail
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Ex : admin ou direction@fatimashop.sn"
                className="w-full bg-[#FAF7F2] border border-[#EFE8DA] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                Mot de passe sécurisé
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  className="w-full bg-[#FAF7F2] border border-[#EFE8DA] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#5C3D2E]/70 hover:text-[#2C1810]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#2C1810] text-[#DEBF6D] hover:bg-[#3E2419] rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer"
            >
              Se Connecter au Tableau de Bord
            </button>
          </form>

          {/* Quick Demo Helper / Password reminder */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setShowForgotNotice(!showForgotNotice)}
              className="text-xs text-[#A8813C] hover:underline"
            >
              Besoin d'aide ou mot de passe oublié ?
            </button>

            {showForgotNotice && (
              <div className="mt-3 p-3 bg-[#F7F3EB] rounded-xl border border-[#C5A059]/40 text-left text-xs text-[#5C3D2E] space-y-1">
                <p className="font-semibold text-[#2C1810]">Comptes par défaut configurés :</p>
                <p>• <strong>Super Admin :</strong> Identifiant <code className="text-[#A8813C] font-bold">admin</code> / Mot de passe <code className="text-[#A8813C] font-bold">fatima2026</code></p>
                <p>• <strong>Gérante :</strong> Identifiant <code className="text-[#A8813C] font-bold">gerante</code> / Mot de passe <code className="text-[#A8813C] font-bold">admin123</code></p>
                <p className="text-[11px] text-[#5C3D2E]/80 pt-1">Vous pourrez modifier vos mots de passe dans l'onglet Paramètres & Sécurité.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
