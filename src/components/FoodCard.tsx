import React from 'react';
import { Plus, Star, Clock, Flame, Sparkles } from 'lucide-react';
import { FoodItem, Language } from '../types';
import { translations } from '../i18n/translations';

interface FoodCardProps {
  item: FoodItem;
  language: Language;
  onAddToCart: (item: FoodItem) => void;
  onOpenDetail: (item: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  language,
  onAddToCart,
  onOpenDetail
}) => {
  const t = translations[language];
  const name = language === 'bn' ? item.name_bn : item.name_en;
  const description = language === 'bn' ? item.description_bn : item.description_en;

  const renderSpiceIndicator = (level: number) => {
    if (level === 0) return null;
    return (
      <div 
        className="flex items-center gap-0.5 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-md font-semibold border border-red-100"
        title={`${t.spiceLevel}: ${level === 1 ? t.mild : level === 2 ? t.medium : t.fiery}`}
      >
        <Flame className="w-3 h-3 fill-red-500 text-red-500" />
        <span>{level === 1 ? t.mild : level === 2 ? t.medium : t.fiery}</span>
      </div>
    );
  };

  return (
    <div 
      id={`food-card-${item.id}`}
      className="group bg-white rounded-2xl border border-stone-200/80 hover:border-amber-400/80 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
    >
      {/* Image Container */}
      <div 
        className="relative aspect-4/3 w-full overflow-hidden bg-stone-100 cursor-pointer"
        onClick={() => onOpenDetail(item)}
      >
        <img
          src={item.image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div 
            className={`w-5 h-5 rounded-md border flex items-center justify-center bg-white/95 shadow-xs ${
              item.isVeg ? 'border-emerald-600' : 'border-red-600'
            }`}
            title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
          </div>

          {item.isFeatured && (
            <span className="bg-amber-500 text-stone-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              {language === 'bn' ? 'স্পেশাল' : 'Featured'}
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 bg-stone-900/85 backdrop-blur-xs text-amber-400 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{item.rating.toFixed(1)}</span>
          <span className="text-stone-400 font-normal text-[10px]">({item.reviewsCount})</span>
        </div>

        {/* Prep time badge */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-stone-700 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs">
          <Clock className="w-3 h-3 text-stone-500" />
          <span>{item.prepTimeMinutes} {t.minutes}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Tags & Spice */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-semibold text-amber-700 tracking-wide uppercase">
              {item.tags[0] || 'Shahi'}
            </span>
            {renderSpiceIndicator(item.spiceLevel)}
          </div>

          {/* Dish Title */}
          <h3 
            onClick={() => onOpenDetail(item)}
            className="text-base font-bold text-stone-900 leading-snug line-clamp-1 hover:text-amber-700 cursor-pointer transition-colors"
          >
            {name}
          </h3>

          {/* Dish Description */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer: Price & Add button */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-stone-900 font-mono">
              ৳{item.price}
            </span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-xs text-stone-400 line-through font-mono">
                ৳{item.originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {item.addons && item.addons.length > 0 ? (
              <button
                id={`customize-item-${item.id}`}
                onClick={() => onOpenDetail(item)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
              >
                {t.customize}
              </button>
            ) : (
              <button
                id={`add-to-cart-${item.id}`}
                onClick={() => onAddToCart(item)}
                className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs shadow-amber-600/20 hover:shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{t.addToCart}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
