import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, X } from 'lucide-react';
import { CustomerReview } from '../types';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
  onAddReview: (review: CustomerReview) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onAddReview }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('Dakar');
  const [rating, setRating] = useState(5);
  const [productName, setProductName] = useState('');
  const [comment, setComment] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      city: city.trim(),
      rating,
      date: "Aujourd'hui",
      productName: productName.trim() || 'FATIMA SHOP',
      comment: comment.trim()
    };

    onAddReview(newRev);
    setAuthor('');
    setComment('');
    setProductName('');
    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      setModalOpen(false);
    }, 1500);
  };

  return (
    <section id="avis" className="py-16 sm:py-24 bg-[#FAF7F2] border-t border-[#EFE8DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#A8813C] font-semibold">
              Témoignages & Avis Vérifiés
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C1810]">
              Ce que disent nos clientes & clients
            </h2>
            <p className="text-sm text-[#5C3D2E] font-light max-w-xl">
              Votre satisfaction est notre plus belle réussite. Découvrez les retours d’expérience de nos habitués à Dakar et dans tout le Sénégal.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 rounded-full border border-[#2C1810] text-[#2C1810] hover:bg-[#2C1810] hover:text-[#FAF7F2] text-xs font-semibold tracking-wider transition-colors flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#A8813C]" />
            <span>Laisser un avis</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#F7F3EB] rounded-2xl p-6 border border-[#EFE8DA] flex flex-col justify-between space-y-4 hover:border-[#DEBF6D]/60 transition-colors shadow-xs"
            >
              <div className="space-y-3">
                {/* Stars & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex text-[#DEBF6D]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating ? 'fill-current' : 'text-[#DEBF6D]/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#5C3D2E]/60">{rev.date}</span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-[#2C1810] leading-relaxed italic font-light">
                  « {rev.comment} »
                </p>
              </div>

              {/* Author & Product */}
              <div className="pt-3 border-t border-[#EFE8DA] text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-[#2C1810]">
                  <span>{rev.author}</span>
                  <span title="Achat vérifié" className="inline-flex">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  </span>
                </div>
                <div className="text-[11px] text-[#5C3D2E]/70 flex items-center justify-between mt-0.5">
                  <span>{rev.city}</span>
                  {rev.productName && (
                    <span className="text-[#A8813C] truncate max-w-[120px] font-medium">
                      {rev.productName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-[#FAF7F2] rounded-2xl max-w-md w-full border border-[#DEBF6D]/50 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#EFE8DA] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2C1810]">Partagez votre expérience</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#5C3D2E] hover:text-[#2C1810]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successNotice ? (
              <div className="py-8 text-center space-y-2 text-emerald-700">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
                <p className="font-serif text-lg font-semibold">Merci pour votre avis précieux !</p>
                <p className="text-xs text-[#5C3D2E]">Votre retour a été publié sur la boutique.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#2C1810] mb-1">Votre Nom</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex : Aminata K."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#2C1810] mb-1">Votre Ville / Quartier</label>
                    <input
                      type="text"
                      placeholder="Ex : Dakar Plateau"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2C1810] mb-1">Note sur 5</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value={5}>⭐️⭐️⭐️⭐️⭐️ (5/5 Exceptionnel)</option>
                      <option value={4}>⭐️⭐️⭐️⭐️ (4/5 Très bien)</option>
                      <option value={3}>⭐️⭐️⭐️ (3/5 Bien)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2C1810] mb-1">Produit acheté (optionnel)</label>
                  <input
                    type="text"
                    placeholder="Ex : Rose & Oud Impérial"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2C1810] mb-1">Votre commentaire</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Partagez vos impressions sur le parfum, la texture du savon, le délai de livraison..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-white border border-[#EFE8DA] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#2C1810] text-[#DEBF6D] hover:bg-[#3E2419] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Publier mon avis
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
