import React from 'react';
import { 
  ShoppingBag, 
  Bell, 
  User, 
  UtensilsCrossed, 
  CalendarClock, 
  ShieldCheck, 
  Search, 
  Globe,
  Clock,
  Sparkles
} from 'lucide-react';
import { Language, CartItem, NotificationItem } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  cart: CartItem[];
  notifications: NotificationItem[];
  onOpenCart: () => void;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  activeTab: 'menu' | 'reservations' | 'orders' | 'about' | 'privacy';
  onSelectTab: (tab: 'menu' | 'reservations' | 'orders' | 'about' | 'privacy') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  cart,
  notifications,
  onOpenCart,
  onOpenNotifications,
  onOpenAuth,
  onOpenAdmin,
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  userName
}) => {
  const t = translations[language];
  const cartCount = (cart || []).reduce((sum, item) => sum + (item?.quantity || 0), 0);
  const cartSubtotal = (cart || []).reduce((sum, item) => {
    const addonsSum = (item?.selectedAddons || []).reduce((s, a) => s + (a?.price || 0), 0);
    const itemPrice = item?.foodItem?.price || 0;
    const qty = item?.quantity || 0;
    return sum + (itemPrice + addonsSum) * qty;
  }, 0);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-950/10 shadow-xs transition-all">
      {/* Top micro bar: Delivery guarantee & operating hours */}
      <div className="bg-[#1C1917] text-amber-200/90 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? 'খোলা আছে: সকাল ১১:০০ - রাত ১১:৩০' : 'Open: 11:00 AM - 11:30 PM'}</span>
            </span>
            <span className="text-stone-600">|</span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ধানমন্ডি, গুলশান, বনানী, উত্তরা ও মিরপুরে দ্রুত ডেলিভারি' : 'Express Delivery across Dhaka Zones'}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-stone-300">
              {language === 'bn' ? 'হটলাইন:' : 'Hotline:'} <span className="font-semibold text-white">+880 1700-000000</span>
            </span>
            <span className="text-stone-600">|</span>
            {/* Quick Language Toggle in top bar */}
            <button
              id="top-language-toggle"
              onClick={onToggleLanguage}
              className="flex items-center gap-1 text-amber-300 hover:text-white transition-colors cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="font-bold">{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-2 md:gap-4">
          {/* Logo & Brand Identity */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer shrink-0" 
            onClick={() => onSelectTab('menu')}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-600/20 ring-2 ring-amber-500/20">
              <UtensilsCrossed className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg md:text-xl font-extrabold tracking-tight text-stone-900 font-['Hind_Siliguri',sans-serif]">
                  {language === 'bn' ? 'ধানসিঁড়ি কিচেন' : 'Dhanshiri Kitchen'}
                </span>
                <span className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {language === 'bn' ? 'খাঁটি শাহি' : 'Authentic'}
                </span>
              </div>
              <p className="text-[10px] md:text-xs text-stone-500 hidden sm:block">
                {language === 'bn' ? 'ঐতিহ্যবাহী বাঙালি রন্ধনশৈলী' : 'Gourmet Bengali Heritage Dining'}
              </p>
            </div>
          </div>

          {/* Search bar (desktop/tablet) */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                id="search-food-input-desktop"
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-stone-100/80 hover:bg-stone-100 focus:bg-white border border-stone-200 focus:border-amber-600 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 bg-stone-200 px-1.5 py-0.5 rounded-full"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-stone-700">
            <button
              id="nav-menu-btn"
              onClick={() => onSelectTab('menu')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'menu' 
                  ? 'text-amber-700 bg-amber-50 font-bold' 
                  : 'hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {t.menu}
            </button>

            <button
              id="nav-reservations-btn"
              onClick={() => onSelectTab('reservations')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'reservations' 
                  ? 'text-amber-700 bg-amber-50 font-bold' 
                  : 'hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <CalendarClock className="w-4 h-4 text-amber-600" />
              <span>{t.reservations}</span>
            </button>

            <button
              id="nav-orders-btn"
              onClick={() => onSelectTab('orders')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'orders' 
                  ? 'text-amber-700 bg-amber-50 font-bold' 
                  : 'hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {t.orders}
            </button>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-1.5 md:gap-3">
            {/* Language Switcher Pill */}
            <button
              id="main-language-toggle-btn"
              onClick={onToggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-800 transition-colors shadow-2xs"
              title="Switch Language (বাংলা / English)"
            >
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'bn' ? '🇬🇧 EN' : '🇧🇩 বাংলা'}</span>
            </button>

            {/* Notification Bell */}
            <button
              id="nav-notifications-btn"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-md shadow-amber-600/20 transition-all cursor-pointer group"
            >
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline-block">
                {t.cart}
              </span>
              <span className="bg-amber-800/60 px-1.5 py-0.5 rounded-md text-xs font-extrabold min-w-[20px] text-center">
                {cartCount}
              </span>
              {cartCount > 0 && (
                <span className="hidden md:inline-block pl-1 border-l border-amber-500/60 text-xs font-semibold">
                  ৳{cartSubtotal}
                </span>
              )}
            </button>

            {/* User Profile */}
            <button
              id="nav-profile-btn"
              onClick={onOpenAuth}
              className="p-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-200/80"
              title={userName || t.profile}
            >
              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
                {userName ? userName.charAt(0) : <User className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-semibold hidden xl:inline-block max-w-[90px] truncate">
                {userName ? userName.split(' ')[0] : t.profile}
              </span>
            </button>

            {/* Admin Dashboard Entry Button */}
            <button
              id="nav-admin-dashboard-btn"
              onClick={onOpenAdmin}
              className="hidden sm:flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-amber-400 px-3 py-2 rounded-xl text-xs font-bold border border-amber-500/20 shadow-xs cursor-pointer transition-all"
              title="Open Admin Dashboard"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Search bar */}
        <div className="pb-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              id="search-food-input-mobile"
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-100 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 lg:hidden shadow-lg">
        <div className="grid grid-cols-5 h-14">
          <button
            id="mobile-nav-menu"
            onClick={() => onSelectTab('menu')}
            className={`flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'menu' ? 'text-amber-600 font-bold' : 'text-stone-500'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span className="text-[10px]">{t.menu}</span>
          </button>

          <button
            id="mobile-nav-reservations"
            onClick={() => onSelectTab('reservations')}
            className={`flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'reservations' ? 'text-amber-600 font-bold' : 'text-stone-500'
            }`}
          >
            <CalendarClock className="w-4 h-4" />
            <span className="text-[10px]">{t.reservations}</span>
          </button>

          <button
            id="mobile-nav-cart"
            onClick={onOpenCart}
            className="flex flex-col items-center justify-center gap-0.5 relative text-amber-600 font-bold"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-amber-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px]">{t.cart}</span>
          </button>

          <button
            id="mobile-nav-orders"
            onClick={() => onSelectTab('orders')}
            className={`flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'orders' ? 'text-amber-600 font-bold' : 'text-stone-500'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="text-[10px]">{t.orders}</span>
          </button>

          <button
            id="mobile-nav-profile"
            onClick={onOpenAuth}
            className="flex flex-col items-center justify-center gap-0.5 text-stone-500"
          >
            <User className="w-4 h-4" />
            <span className="text-[10px]">{t.profile}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
