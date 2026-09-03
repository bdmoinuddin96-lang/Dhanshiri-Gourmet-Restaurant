import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Clock, 
  Flame, 
  Plus, 
  Minus, 
  Check, 
  MessageSquare, 
  Send, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { FoodItem, FoodAddon, Language, Review } from '../types';
import { translations } from '../i18n/translations';

interface FoodDetailModalProps {
  item: FoodItem | null;
  onClose: () => void;
  onAddToCartWithOptions: (item: FoodItem, quantity: number, addons: FoodAddon[], notes: string) => void;
  language: Language;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  item,
  onClose,
  onAddToCartWithOptions,
  language
}) => {
  if (!item) return null;
  const t = translations[language];
  const name = language === 'bn' ? item.name_bn : item.name_en;
  const description = language === 'bn' ? item.description_bn : item.description_en;

  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<FoodAddon[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Reviews state
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      foodId: item.id,
      customerName: 'তানভীরুল ইসলাম (Tanvirul Islam)',
      rating: 5,
      comment: language === 'bn' 
        ? 'অসাধারণ স্বাদ! মাংস একদম নরম আর খাঁটি গাওয়া ঘির সুবাস এখনও মুখে লেগে আছে।' 
        : 'Absolute perfection! Tender meat and the authentic aroma of pure ghee is unforgettable.',
      date: '২ দিন আগে',
      verified: true
    },
    {
      id: 'rev-2',
      foodId: item.id,
      customerName: 'ফারিহা জামান (Fariha Zaman)',
      rating: 5,
      comment: language === 'bn' 
        ? 'পরিবারের সবাই খুব প্রশংসা করেছে। প্যাকেজিংও খুব প্রিমিয়াম ছিল।' 
        : 'Everyone in the family loved it. Premium, leak-proof packaging kept it piping hot.',
      date: '৫ দিন আগে',
      verified: true
    }
  ]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const toggleAddon = (addon: FoodAddon) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const addonsTotal = (selectedAddons || []).reduce((sum, a) => sum + (a?.price || 0), 0);
  const itemTotal = (item.price + addonsTotal) * quantity;

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !reviewerName.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      foodId: item.id,
      customerName: reviewerName,
      rating: newRating,
      comment: newComment,
      date: language === 'bn' ? 'এইমাত্র' : 'Just now',
      verified: true
    };

    setReviews([newRev, ...reviews]);
    setNewComment('');
    setReviewerName('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 transform transition-all border border-stone-200">
          
          {/* Close button */}
          <button
            id="close-food-detail-modal"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-950 flex items-center justify-center backdrop-blur-md shadow-md transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Food Image */}
          <div className="relative h-64 sm:h-72 w-full bg-stone-100 overflow-hidden">
            <img
              src={item.image}
              alt={name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-stone-950">
                  {item.tags[0] || 'Shahi Special'}
                </span>
                {item.spiceLevel > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-600/90 text-white flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>{item.spiceLevel === 1 ? t.mild : item.spiceLevel === 2 ? t.medium : t.fiery}</span>
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-black/50 text-stone-200 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.prepTimeMinutes} {t.minutes}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-black/50 text-stone-200 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>{item.calories} kcal</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-xs font-['Hind_Siliguri','Outfit',sans-serif]">
                {name}
              </h2>
            </div>
          </div>

          {/* Tabs: Details / Reviews */}
          <div className="flex border-b border-stone-200 bg-stone-50 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'details'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {language === 'bn' ? 'খাবারের বিবরণ ও সাইড আইটেম' : 'Dishes & Customization'}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t.ratingsAndReviews} ({reviews.length})</span>
            </button>
          </div>

          {/* Tab 1: Details & Options */}
          {activeTab === 'details' && (
            <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
              <p className="text-sm text-stone-600 leading-relaxed">
                {description}
              </p>

              {/* Addons List */}
              {item.addons && item.addons.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      {t.addonsTitle}
                    </h4>
                    <span className="text-[11px] text-stone-400 font-medium">
                      {language === 'bn' ? 'পছন্দমতো বেছে নিন' : 'Optional'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {item.addons.map((addon) => {
                      const isSelected = selectedAddons.some(a => a.id === addon.id);
                      const addonName = language === 'bn' ? addon.name_bn : addon.name_en;

                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon)}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-amber-50/70 border-amber-500 shadow-2xs' 
                              : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-stone-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-semibold text-stone-800">
                              {addonName}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-amber-800 font-mono">
                            +৳{addon.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cooking Instructions */}
              <div className="space-y-1.5 pt-2">
                <label htmlFor="cooking-notes" className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  {t.specialInstructions}
                </label>
                <input
                  id="cooking-notes"
                  type="text"
                  placeholder={t.instructionsPlaceholder}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Reviews & Feedback */}
          {activeTab === 'reviews' && (
            <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
              {/* Write review form */}
              <form onSubmit={handleAddReview} className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/70 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  {t.writeReview}
                </h4>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-600 font-medium">{t.yourRating}:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder={language === 'bn' ? 'আপনার নাম' : 'Your name'}
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    required
                    className="px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                  <input
                    type="text"
                    placeholder={t.yourComment}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                    className="px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.submitReview}</span>
                  </button>
                </div>

                {reviewSubmitted && (
                  <p className="text-xs text-emerald-700 font-bold">
                    ✓ {language === 'bn' ? 'আপনার রিভিউ সফলভাবে যুক্ত হয়েছে!' : 'Review submitted successfully!'}
                  </p>
                )}
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl border border-stone-100 bg-stone-50/50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">{rev.customerName}</span>
                        {rev.verified && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-semibold">
                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-700" />
                            {language === 'bn' ? 'যাচাইকৃত ক্রেতা' : 'Verified'}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`} />
                      ))}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer: Quantity & Total Add To Cart */}
          <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            {/* Quantity Controller */}
            <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-stone-200 shadow-2xs">
              <button
                id="modal-decrease-qty"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-sm text-stone-900 font-mono">
                {quantity}
              </span>
              <button
                id="modal-increase-qty"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Total & Submit Button */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-stone-500 uppercase font-semibold block">
                  {language === 'bn' ? 'মোট প্রদেয়' : 'Total'}
                </span>
                <span className="text-xl font-extrabold text-stone-950 font-mono">
                  ৳{itemTotal}
                </span>
              </div>

              <button
                id="modal-confirm-add-cart-btn"
                onClick={() => {
                  onAddToCartWithOptions(item, quantity, selectedAddons, specialInstructions);
                  onClose();
                }}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md shadow-amber-600/20 hover:shadow-lg transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{t.addToCart}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
