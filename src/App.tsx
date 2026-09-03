import React, { useState, useEffect, useMemo } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  HeroBanner 
} from './components/HeroBanner';
import { 
  CategoryFilter 
} from './components/CategoryFilter';
import { 
  FoodCard 
} from './components/FoodCard';
import { 
  FoodDetailModal 
} from './components/FoodDetailModal';
import { 
  CartDrawer 
} from './components/CartDrawer';
import { 
  LocationPickerModal 
} from './components/LocationPickerModal';
import { 
  CheckoutModal 
} from './components/CheckoutModal';
import { 
  PaymentModal 
} from './components/PaymentModal';
import { 
  OrderTrackingModal 
} from './components/OrderTrackingModal';
import { 
  TableReservationView 
} from './components/TableReservationView';
import { 
  OrdersView 
} from './components/OrdersView';
import { 
  AdminDashboard 
} from './components/AdminDashboard';
import { 
  UserProfileModal 
} from './components/UserProfileModal';
import { 
  PolicyModal 
} from './components/PolicyModal';
import { 
  NotificationCenter 
} from './components/NotificationCenter';
import { 
  WhatsAppButton 
} from './components/WhatsAppButton';

import { 
  FoodItem, 
  CartItem, 
  DeliveryZone, 
  DeliveryAddress, 
  Order, 
  TableReservation, 
  PaymentGatewaySettings, 
  PaymentMethodType, 
  UserProfile, 
  AppNotification, 
  Language,
  FoodAddon 
} from './types';

import { 
  INITIAL_CATEGORIES, 
  INITIAL_FOOD_ITEMS, 
  INITIAL_DELIVERY_ZONES, 
  INITIAL_GATEWAY_SETTINGS, 
  INITIAL_SAMPLE_ORDERS, 
  INITIAL_RESERVATIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_USER 
} from './data/initialData';

import { storage } from './services/storage';
import { translations } from './i18n/translations';
import { 
  UtensilsCrossed, 
  Sparkles, 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Heart,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function App() {
  // 1. Language state
  const [language, setLanguage] = useState<Language>(() => storage.getLanguage());
  const t = translations[language];

  const handleToggleLanguage = (lang: Language) => {
    setLanguage(lang);
    storage.saveLanguage(lang);
  };

  // 2. Active primary view: 'menu' | 'reservations' | 'orders'
  const [activeView, setActiveView] = useState<'menu' | 'reservations' | 'orders'>('menu');

  // 3. Food Catalog State
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const saved = storage.getFoodItems();
    return saved && saved.length > 0 ? saved : INITIAL_FOOD_ITEMS;
  });

  const handleSaveFoodItems = (items: FoodItem[]) => {
    setFoodItems(items);
    storage.saveFoodItems(items);
  };

  // 4. Filtering State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [maxSpiceLevel, setMaxSpiceLevel] = useState<number>(3);

  // 5. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => storage.getCart());

  const handleAddToCart = (foodItem: FoodItem, quantity: number = 1, selectedAddons: FoodAddon[] = [], specialInstructions?: string) => {
    setCart((prev) => {
      const currentList = prev || [];
      const safeNewAddons = selectedAddons || [];
      // Check if item with same addons exists
      const existingIndex = currentList.findIndex(i => 
        i?.foodItem?.id === foodItem.id && 
        JSON.stringify((i.selectedAddons || []).map(a => a.id).sort()) === JSON.stringify(safeNewAddons.map(a => a.id).sort()) &&
        (i.specialInstructions || '') === (specialInstructions || '')
      );

      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...currentList];
        updated[existingIndex].quantity += quantity;
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          foodItem,
          quantity,
          selectedAddons: safeNewAddons,
          specialInstructions
        };
        updated = [...currentList, newItem];
      }
      storage.saveCart(updated);
      return updated;
    });

    // Add notification
    addNotification({
      title_bn: 'কার্টে যুক্ত করা হয়েছে',
      title_en: 'Added to Cart',
      message_bn: `${language === 'bn' ? foodItem.name_bn : foodItem.name_en} কার্টে যোগ হয়েছে।`,
      message_en: `${foodItem.name_en} added to cart.`,
      type: 'new_item',
      read: false
    });
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    setCart((prev) => {
      let updated: CartItem[];
      if (newQty <= 0) {
        updated = prev.filter(i => i.id !== cartItemId);
      } else {
        updated = prev.map(i => i.id === cartItemId ? { ...i, quantity: newQty } : i);
      }
      storage.saveCart(updated);
      return updated;
    });
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => {
      const updated = prev.filter(i => i.id !== cartItemId);
      storage.saveCart(updated);
      return updated;
    });
  };

  const handleClearCart = () => {
    setCart([]);
    storage.saveCart([]);
  };

  // 6. Delivery Zone & Address State
  const [activeZone, setActiveZone] = useState<DeliveryZone>(() => {
    const saved = storage.getDeliveryZone();
    return saved || INITIAL_DELIVERY_ZONES[0];
  });

  const [savedAddress, setSavedAddress] = useState<DeliveryAddress>(() => {
    const saved = storage.getSavedAddress();
    return saved || {
      id: 'addr-default',
      label: 'Home',
      area: 'ধানমন্ডি (Dhanmondi)',
      zoneId: 'zone-dhanmondi',
      streetAddress: 'বাড়ি #১২, রোড #২৭, ধানমন্ডি',
      apartmentFloor: 'ফ্ল্যাট ৪বি',
      phone: '01715-678901'
    };
  });

  const handleSaveAddress = (addr: DeliveryAddress) => {
    setSavedAddress(addr);
    storage.saveAddress(addr);
  };

  const handleSelectZone = (zone: DeliveryZone) => {
    setActiveZone(zone);
    storage.saveDeliveryZone(zone);
  };

  // 7. Discount & Loyalty State
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('DHAKA100');
  const [discountAmount, setDiscountAmount] = useState<number>(100);
  const [useLoyalty, setUseLoyalty] = useState<boolean>(false);
  const loyaltyDiscount = useLoyalty ? 50 : 0;

  const handleApplyCoupon = (code: string): boolean => {
    if (code === 'DHAKA100') {
      setAppliedCoupon('DHAKA100');
      setDiscountAmount(100);
      return true;
    }
    if (code === 'KACCHI50') {
      setAppliedCoupon('KACCHI50');
      setDiscountAmount(50);
      return true;
    }
    if (code === 'FESTIVE') {
      setAppliedCoupon('FESTIVE');
      setDiscountAmount(150);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  // 8. User Profile & Loyalty Balance
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = storage.getUser();
    return saved || INITIAL_USER;
  });

  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
    storage.saveUser(updated);
  };

  // 9. Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = storage.getNotifications();
    return saved && saved.length > 0 ? saved : INITIAL_NOTIFICATIONS;
  });

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp'>) => {
    const newEntry: AppNotification = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...notif
    };
    setNotifications((prev) => {
      const updated = [newEntry, ...prev];
      storage.saveNotifications(updated);
      return updated;
    });
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      storage.saveNotifications(updated);
      return updated;
    });
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    storage.saveNotifications([]);
  };

  // 10. Orders & Live Tracking State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = storage.getOrders();
    return saved && saved.length > 0 ? saved : INITIAL_SAMPLE_ORDERS;
  });

  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  const handlePlaceOrder = (orderData: Partial<Order>) => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderData.orderNumber || `DK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: orderData.customerName || user.name,
      customerPhone: orderData.customerPhone || user.phone,
      customerEmail: orderData.customerEmail,
      deliveryAddress: orderData.deliveryAddress || savedAddress,
      deliveryZone: orderData.deliveryZone || activeZone,
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      deliveryFee: orderData.deliveryFee || activeZone.baseFee,
      discount: orderData.discount || discountAmount,
      couponCode: orderData.couponCode,
      loyaltyDiscount: orderData.loyaltyDiscount || loyaltyDiscount,
      total: orderData.total || 0,
      paymentMethod: orderData.paymentMethod || 'cod',
      paymentStatus: orderData.paymentStatus || 'pending',
      orderStatus: 'received',
      trxId: orderData.trxId,
      gatewayResponse: orderData.gatewayResponse,
      orderNotes: orderData.orderNotes,
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: `${activeZone.estimatedMinutes} মিনিট`
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      storage.saveOrders(updated);
      return updated;
    });

    // Clear cart and state
    handleClearCart();
    setIsCheckoutOpen(false);

    // Award loyalty points
    handleUpdateUser({
      ...user,
      loyaltyPoints: user.loyaltyPoints + 20
    });

    // Send notification
    addNotification({
      title_bn: 'অর্ডার গৃহীত হয়েছে!',
      title_en: 'Order Received!',
      message_bn: `আপনার অর্ডার #${newOrder.orderNumber} সফলভাবে গ্রহণ করা হয়েছে। রান্নাঘরে প্রস্তুতি চলছে।`,
      message_en: `Your order #${newOrder.orderNumber} was received. Our kitchen is preparing it.`,
      type: 'order_update',
      orderId: newOrder.id,
      read: false
    });

    // Open live tracking modal
    setActiveTrackingOrder(newOrder);
    setIsTrackingOpen(true);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setOrders((prev) => {
      const updated = prev.map(o => o.id === orderId ? { ...o, orderStatus: status } : o);
      storage.saveOrders(updated);
      return updated;
    });

    if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
      setActiveTrackingOrder(prev => prev ? { ...prev, orderStatus: status } : null);
    }
  };

  const handleProcessRefund = (orderId: string, reason: string) => {
    setOrders((prev) => {
      const updated = prev.map(o => o.id === orderId ? { 
        ...o, 
        paymentStatus: 'refunded' as const, 
        orderNotes: `${o.orderNotes || ''} [Refunded: ${reason}]` 
      } : o);
      storage.saveOrders(updated);
      return updated;
    });
  };

  // 11. Reservations State
  const [reservations, setReservations] = useState<TableReservation[]>(() => {
    const saved = storage.getReservations();
    return saved && saved.length > 0 ? saved : INITIAL_RESERVATIONS;
  });

  const handleAddReservation = (res: TableReservation) => {
    setReservations((prev) => {
      const updated = [res, ...prev];
      storage.saveReservations(updated);
      return updated;
    });

    addNotification({
      title_bn: 'টেবিল বুকিং সম্পন্ন হয়েছে',
      title_en: 'Table Booking Received',
      message_bn: `${res.date} তারিখে ${res.guests} জনের জন্য টেবিল সংরক্ষণের আবেদন নথিভুক্ত হয়েছে।`,
      message_en: `Table reservation for ${res.guests} guests on ${res.date} logged.`,
      type: 'general',
      read: false
    });
  };

  const handleUpdateReservationStatus = (id: string, status: TableReservation['status']) => {
    setReservations((prev) => {
      const updated = prev.map(r => r.id === id ? { ...r, status } : r);
      storage.saveReservations(updated);
      return updated;
    });
  };

  // 12. Payment Gateway Settings State
  const [gatewaySettings, setGatewaySettings] = useState<PaymentGatewaySettings>(() => {
    const saved = storage.getGatewaySettings();
    return saved || INITIAL_GATEWAY_SETTINGS;
  });

  const handleSaveGatewaySettings = (settings: PaymentGatewaySettings) => {
    setGatewaySettings(settings);
    storage.saveGatewaySettings(settings);
  };

  // 13. UI Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState<{
    method: PaymentMethodType;
    amount: number;
    pendingOrder: Partial<Order>;
  } | null>(null);

  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | null>(null);
  const [selectedFoodDetail, setSelectedFoodDetail] = useState<FoodItem | null>(null);

  // Trigger Online MFS / Card Payment Simulator
  const handleTriggerOnlinePayment = (method: PaymentMethodType, amount: number, pendingOrder: Partial<Order>) => {
    setIsCheckoutOpen(false);
    setPaymentModalData({ method, amount, pendingOrder });
    setIsPaymentModalOpen(true);
  };

  const handleOnlinePaymentSuccess = (trxId: string, gateway: string, account: string) => {
    if (!paymentModalData) return;
    setIsPaymentModalOpen(false);

    handlePlaceOrder({
      ...paymentModalData.pendingOrder,
      paymentMethod: paymentModalData.method,
      paymentStatus: 'success',
      trxId,
      gatewayResponse: {
        status: 'VALID',
        transaction_id: trxId,
        amount: paymentModalData.amount,
        bank_tran_id: `BNK-${Date.now()}`,
        card_type: gateway,
        tran_date: new Date().toISOString()
      }
    });

    setPaymentModalData(null);
  };

  const handleOnlinePaymentFailure = (errorMsg: string) => {
    // Show notification of failure
    addNotification({
      title_bn: 'পেমেন্ট ব্যর্থ হয়েছে',
      title_en: 'Payment Unsuccessful',
      message_bn: errorMsg,
      message_en: errorMsg,
      type: 'order_update',
      read: false
    });
  };

  // Filtered Food Items calculation
  const filteredFoodItems = useMemo(() => {
    return foodItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }
      // Vegetarian filter
      if (vegOnly && !item.isVeg) {
        return false;
      }
      // Spice level filter
      if (item.spiceLevel > maxSpiceLevel) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchEn = item.name_en.toLowerCase().includes(query) || item.description_en.toLowerCase().includes(query);
        const matchBn = item.name_bn.includes(query) || item.description_bn.includes(query);
        const matchTag = item.tags.some(t => t.toLowerCase().includes(query));
        if (!matchEn && !matchBn && !matchTag) return false;
      }
      return true;
    });
  }, [foodItems, selectedCategory, vegOnly, maxSpiceLevel, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-stone-900 flex flex-col font-['Outfit',sans-serif] selection:bg-amber-200 selection:text-amber-900">
      
      {/* 1. Main Navigation */}
      <Navbar
        language={language}
        onToggleLanguage={handleToggleLanguage}
        cartCount={(cart || []).reduce((sum, item) => sum + (item?.quantity || 0), 0)}
        onOpenCart={() => setIsCartOpen(true)}
        unreadNotificationsCount={notifications.filter(n => !n.read).length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
        activeZoneName={language === 'bn' ? activeZone.name_bn : activeZone.name_en}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
      />

      {/* 2. Main Page Views */}
      <main className="flex-1">
        {activeView === 'menu' && (
          <div>
            {/* Hero Section */}
            <HeroBanner
              language={language}
              onExploreMenu={() => {
                const el = document.getElementById('food-menu-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onBookTable={() => setActiveView('reservations')}
              onApplyCoupon={(code) => {
                handleApplyCoupon(code);
                setIsCartOpen(true);
              }}
            />

            {/* Food Menu Section */}
            <section id="food-menu-section" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              
              {/* Category & Filter Bar */}
              <CategoryFilter
                categories={INITIAL_CATEGORIES}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                vegOnly={vegOnly}
                onToggleVegOnly={() => setVegOnly(!vegOnly)}
                maxSpiceLevel={maxSpiceLevel}
                onSpiceLevelChange={setMaxSpiceLevel}
                language={language}
              />

              {/* Food Items Grid */}
              {filteredFoodItems.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs space-y-3">
                  <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                    <Search className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-stone-800">
                    {language === 'bn' ? 'কোনো খাবার পাওয়া যায়নি' : 'No food items found'}
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    {language === 'bn' ? 'অনুগ্রহ করে ফিল্টার পরিবর্তন করুন অথবা ভিন্ন কোনো কীওয়ার্ড দিয়ে খুঁজুন।' : 'Try adjusting your search terms or filter preferences.'}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                      setVegOnly(false);
                      setMaxSpiceLevel(3);
                    }}
                    className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'সব ফিল্টার রিসেট করুন' : 'Reset All Filters'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredFoodItems.map((food) => (
                    <FoodCard
                      key={food.id}
                      food={food}
                      onAddToCart={(item) => handleAddToCart(item, 1)}
                      onOpenDetails={(item) => setSelectedFoodDetail(item)}
                      language={language}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Reservations View */}
        {activeView === 'reservations' && (
          <TableReservationView
            onAddReservation={handleAddReservation}
            language={language}
          />
        )}

        {/* Orders View */}
        {activeView === 'orders' && (
          <OrdersView
            orders={orders}
            onTrackOrder={(order) => {
              setActiveTrackingOrder(order);
              setIsTrackingOpen(true);
            }}
            language={language}
            onNavigateToMenu={() => setActiveView('menu')}
          />
        )}
      </main>

      {/* 3. Footer with Bangladeshi Payment Gateway Trust Badges */}
      <footer className="bg-stone-950 text-stone-300 pt-12 pb-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white tracking-wide font-['Hind_Siliguri',sans-serif]">
                    ধানসিঁড়ি কিচেন
                  </h3>
                  <span className="text-[10px] text-amber-400 font-mono tracking-widest block uppercase">
                    Dhanshiri Kitchen
                  </span>
                </div>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                {language === 'bn' 
                  ? 'খাঁটি গাওয়া ঘি ও ঐতিহ্যবাহী মশলার মেলবন্ধনে ঢাকাইয়া ঐতিহ্যবাহী খাবার ও কাচ্চি বিরিয়ানির অনন্য ঠিকানা।' 
                  : 'Authentic heritage Bangladeshi culinary destination specializing in pure ghee Kacchi Biryani and regional delicacies.'}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>BSTI & Safe Food Certified</span>
              </div>
            </div>

            {/* Contact & Outlets */}
            <div className="space-y-2 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {language === 'bn' ? 'ঠিকানা ও হটলাইন' : 'Address & Hotline'}
              </h4>
              <div className="space-y-1.5 text-stone-400">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>রোড ২৭, ধানমন্ডি, ঢাকা ১২০৯, বাংলাদেশ</span>
                </p>
                <p className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>+880 1711-000000 / +880 1811-000000</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>প্রতিদিন: সকাল ১১:০০ — রাত ১১:০০</span>
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {language === 'bn' ? 'গুরুত্বপূর্ণ লিংক' : 'Quick Links'}
              </h4>
              <ul className="space-y-1.5 text-stone-400">
                <li>
                  <button onClick={() => setActiveView('menu')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    {t.menu}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveView('reservations')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    {t.tableReservation}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveView('orders')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    {t.orders}
                  </button>
                </li>
                <li>
                  <button onClick={() => setPolicyType('privacy')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    {t.privacyPolicy}
                  </button>
                </li>
                <li>
                  <button onClick={() => setPolicyType('terms')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    {t.termsConditions}
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsAdminOpen(true)} className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer">
                    ⚡ {t.adminDashboard}
                  </button>
                </li>
              </ul>
            </div>

            {/* Accepted Payment Methods Badges */}
            <div className="space-y-3 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'bn' ? 'স্বীকৃত পেমেন্ট মেথড' : 'Accepted Payment Gateways'}</span>
              </h4>
              <p className="text-[11px] text-stone-400">
                {language === 'bn' ? 'বাংলাদেশ ব্যাংক অনুমোদিত গেটওয়ে ও এমএফএস দ্বারা ১০০% নিরাপদ লেনদেন।' : '100% secure encrypted payment authorized by Bangladesh Bank.'}
              </p>

              {/* MFS & Card Badges */}
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-[#E2136E] text-white font-black text-[10px] px-2 py-1 rounded-md">
                  bKash বিকাশ
                </span>
                <span className="bg-[#F7941D] text-white font-black text-[10px] px-2 py-1 rounded-md">
                  Nagad নগদ
                </span>
                <span className="bg-[#8C3494] text-white font-black text-[10px] px-2 py-1 rounded-md">
                  Rocket রকেট
                </span>
                <span className="bg-[#005BAB] text-white font-black text-[10px] px-2 py-1 rounded-md">
                  Upay উপায়
                </span>
                <span className="bg-[#00A859] text-white font-black text-[10px] px-2 py-1 rounded-md">
                  Tap ট্যাপ
                </span>
                <span className="bg-stone-800 text-amber-300 border border-amber-400/20 font-bold text-[10px] px-2 py-1 rounded-md">
                  Visa / Master
                </span>
                <span className="bg-emerald-900 text-emerald-300 font-bold text-[10px] px-2 py-1 rounded-md">
                  Cash on Delivery
                </span>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
            <p>© {new Date().getFullYear()} ধানসিঁড়ি কিচেন (Dhanshiri Kitchen). All rights reserved.</p>
            <p className="text-[11px] flex items-center gap-1">
              <span>Made with pure ghee & love in Dhaka, Bangladesh</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </p>
          </div>
        </div>
      </footer>

      {/* 4. Modals and Slide-Overs */}

      {/* Food Customization Modal */}
      <FoodDetailModal
        food={selectedFoodDetail}
        isOpen={!!selectedFoodDetail}
        onClose={() => setSelectedFoodDetail(null)}
        onAddToCart={(food, qty, addons, note) => {
          handleAddToCart(food, qty, addons, note);
        }}
        language={language}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        activeZone={activeZone}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        discountAmount={discountAmount}
        useLoyalty={useLoyalty}
        onToggleLoyalty={() => setUseLoyalty(!useLoyalty)}
        loyaltyDiscount={loyaltyDiscount}
        userPoints={user.loyaltyPoints}
        language={language}
      />

      {/* Delivery Zone and Map Location Picker */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        activeZone={activeZone}
        onSelectZone={handleSelectZone}
        savedAddress={savedAddress}
        onSaveAddress={handleSaveAddress}
        language={language}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        activeZone={activeZone}
        savedAddress={savedAddress}
        onOpenLocationPicker={() => {
          setIsLocationPickerOpen(true);
        }}
        gatewaySettings={gatewaySettings}
        discountAmount={discountAmount}
        loyaltyDiscount={loyaltyDiscount}
        appliedCoupon={appliedCoupon}
        onConfirmOrder={handlePlaceOrder}
        onTriggerOnlinePayment={handleTriggerOnlinePayment}
        language={language}
        defaultCustomerName={user.name}
        defaultCustomerPhone={user.phone}
      />

      {/* Payment Gateway Simulator */}
      {paymentModalData && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          method={paymentModalData.method}
          amount={paymentModalData.amount}
          orderNumber={paymentModalData.pendingOrder.orderNumber || 'DK-1001'}
          onPaymentSuccess={handleOnlinePaymentSuccess}
          onPaymentFailure={handleOnlinePaymentFailure}
          language={language}
        />
      )}

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal
        order={activeTrackingOrder}
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        language={language}
      />

      {/* Admin Management Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onProcessRefund={handleProcessRefund}
        reservations={reservations}
        onUpdateReservationStatus={handleUpdateReservationStatus}
        foodItems={foodItems}
        onSaveFoodItems={handleSaveFoodItems}
        gatewaySettings={gatewaySettings}
        onSaveGatewaySettings={handleSaveGatewaySettings}
        language={language}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        onOpenPolicy={(type) => setPolicyType(type)}
        language={language}
      />

      {/* Notifications Drawer */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onClearAll={handleClearAllNotifications}
        onNotificationClick={(notif) => {
          if (notif.orderId) {
            const found = orders.find(o => o.id === notif.orderId);
            if (found) {
              setActiveTrackingOrder(found);
              setIsTrackingOpen(true);
            }
          }
        }}
        language={language}
      />

      {/* Privacy Policy & Terms Modal */}
      {policyType && (
        <PolicyModal
          isOpen={!!policyType}
          onClose={() => setPolicyType(null)}
          type={policyType}
          language={language}
        />
      )}

      {/* Floating Instant WhatsApp Support Button */}
      <WhatsAppButton
        phoneNumber="+8801711000000"
        language={language}
      />

    </div>
  );
}
