import React from 'react';
import { 
  UtensilsCrossed, 
  Flame, 
  Fish, 
  Sparkles, 
  Wheat, 
  Heart, 
  Coffee, 
  Leaf,
  Layers
} from 'lucide-react';
import { FoodCategory, Language } from '../types';
import { translations } from '../i18n/translations';

interface CategoryFilterProps {
  categories: FoodCategory[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  vegOnly: boolean;
  onToggleVegOnly: () => void;
  selectedSpice: number | 'all';
  onSelectSpice: (spice: number | 'all') => void;
  language: Language;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  vegOnly,
  onToggleVegOnly,
  selectedSpice,
  onSelectSpice,
  language
}) => {
  const t = translations[language];

  const renderIcon = (name: string, isSelected: boolean) => {
    const iconClass = `w-4 h-4 ${isSelected ? 'text-white' : 'text-amber-600'}`;
    switch (name) {
      case 'Flame':
        return <Flame className={iconClass} />;
      case 'Fish':
        return <Fish className={iconClass} />;
      case 'Sparkles':
        return <Sparkles className={iconClass} />;
      case 'Wheat':
        return <Wheat className={iconClass} />;
      case 'Heart':
        return <Heart className={iconClass} />;
      case 'Coffee':
        return <Coffee className={iconClass} />;
      default:
        return <UtensilsCrossed className={iconClass} />;
    }
  };

  return (
    <div className="py-6 border-b border-stone-200/80 bg-stone-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Category horizontal scrollable track */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {/* All items button */}
          <button
            id="cat-filter-all"
            onClick={() => onSelectCategory('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategoryId === 'all'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 shadow-2xs'
            }`}
          >
            <Layers className={`w-4 h-4 ${selectedCategoryId === 'all' ? 'text-white' : 'text-stone-500'}`} />
            <span>{t.allCategories}</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const name = language === 'bn' ? cat.name_bn : cat.name_en;

            return (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 shadow-2xs'
                }`}
              >
                {renderIcon(cat.iconName, isSelected)}
                <span>{name}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filters Bar: Veg-Only toggle & Spice Level */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Veg Only Toggle */}
            <button
              id="veg-only-filter-btn"
              onClick={onToggleVegOnly}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                vegOnly
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Leaf className={`w-3.5 h-3.5 ${vegOnly ? 'text-emerald-600 fill-emerald-600' : 'text-stone-400'}`} />
              <span>{t.vegOnly}</span>
            </button>

            {/* Spice filter chips */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-200">
              <span className="text-stone-500 px-2 font-medium hidden sm:inline">
                {t.spicyFilter}:
              </span>
              <button
                id="spice-filter-all"
                onClick={() => onSelectSpice('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  selectedSpice === 'all'
                    ? 'bg-amber-100 text-amber-900 font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {language === 'bn' ? 'সব' : 'All'}
              </button>

              <button
                id="spice-filter-mild"
                onClick={() => onSelectSpice(1)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  selectedSpice === 1
                    ? 'bg-amber-100 text-amber-900 font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>🌶️</span>
                <span>{t.mild}</span>
              </button>

              <button
                id="spice-filter-medium"
                onClick={() => onSelectSpice(2)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  selectedSpice === 2
                    ? 'bg-amber-100 text-amber-900 font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>🌶️🌶️</span>
                <span>{t.medium}</span>
              </button>

              <button
                id="spice-filter-fiery"
                onClick={() => onSelectSpice(3)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  selectedSpice === 3
                    ? 'bg-red-100 text-red-900 font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>🌶️🌶️🌶️</span>
                <span>{t.fiery}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
