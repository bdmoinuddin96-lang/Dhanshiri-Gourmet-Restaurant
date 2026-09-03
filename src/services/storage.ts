import { 
  FoodItem, 
  FoodCategory, 
  DeliveryZone, 
  Order, 
  TableReservation, 
  Coupon, 
  PaymentGatewaySettings, 
  NotificationItem, 
  User, 
  Language,
  CartItem
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_FOOD_ITEMS, 
  INITIAL_DELIVERY_ZONES, 
  INITIAL_COUPONS, 
  INITIAL_GATEWAY_SETTINGS, 
  INITIAL_ORDERS, 
  INITIAL_RESERVATIONS, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialData';

const STORAGE_KEYS = {
  LANG: 'dhanshiri_lang',
  FOOD_ITEMS: 'dhanshiri_foods',
  ORDERS: 'dhanshiri_orders',
  RESERVATIONS: 'dhanshiri_reservations',
  GATEWAY_SETTINGS: 'dhanshiri_gateway_settings',
  NOTIFICATIONS: 'dhanshiri_notifications',
  USER: 'dhanshiri_user',
  CART: 'dhanshiri_cart',
  ACTIVE_ZONE: 'dhanshiri_active_zone'
};

export const getStoredLanguage = (): Language => {
  const saved = localStorage.getItem(STORAGE_KEYS.LANG);
  return (saved === 'en' || saved === 'bn') ? saved : 'bn';
};

export const setStoredLanguage = (lang: Language) => {
  localStorage.setItem(STORAGE_KEYS.LANG, lang);
};

export const getStoredFoodItems = (): FoodItem[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(INITIAL_FOOD_ITEMS));
    return INITIAL_FOOD_ITEMS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_FOOD_ITEMS;
  }
};

export const saveFoodItems = (items: FoodItem[]) => {
  localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(items));
};

export const getStoredOrders = (): Order[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return INITIAL_ORDERS;
    return parsed.map((o: any) => ({
      ...o,
      items: Array.isArray(o.items) ? o.items.map((i: any) => ({
        ...i,
        addons: Array.isArray(i?.addons) ? i.addons : []
      })) : []
    }));
  } catch {
    return INITIAL_ORDERS;
  }
};

export const saveOrders = (orders: Order[]) => {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};

export const addOrder = (order: Order): Order[] => {
  const current = getStoredOrders();
  const updated = [order, ...current];
  saveOrders(updated);
  return updated;
};

export const updateOrderStatus = (orderId: string, status: Order['orderStatus']): Order[] => {
  const current = getStoredOrders();
  const updated = current.map(o => o.id === orderId ? { ...o, orderStatus: status } : o);
  saveOrders(updated);
  return updated;
};

export const updateOrderPayment = (orderId: string, paymentStatus: Order['paymentStatus'], refundReason?: string): Order[] => {
  const current = getStoredOrders();
  const updated = current.map(o => o.id === orderId ? { ...o, paymentStatus, refundReason } : o);
  saveOrders(updated);
  return updated;
};

export const getStoredReservations = (): TableReservation[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
    return INITIAL_RESERVATIONS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_RESERVATIONS;
  }
};

export const saveReservations = (reservations: TableReservation[]) => {
  localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
};

export const addReservation = (reservation: TableReservation): TableReservation[] => {
  const current = getStoredReservations();
  const updated = [reservation, ...current];
  saveReservations(updated);
  return updated;
};

export const updateReservationStatus = (id: string, status: TableReservation['status']): TableReservation[] => {
  const current = getStoredReservations();
  const updated = current.map(r => r.id === id ? { ...r, status } : r);
  saveReservations(updated);
  return updated;
};

export const getStoredGatewaySettings = (): PaymentGatewaySettings => {
  const saved = localStorage.getItem(STORAGE_KEYS.GATEWAY_SETTINGS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.GATEWAY_SETTINGS, JSON.stringify(INITIAL_GATEWAY_SETTINGS));
    return INITIAL_GATEWAY_SETTINGS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_GATEWAY_SETTINGS;
  }
};

export const saveGatewaySettings = (settings: PaymentGatewaySettings) => {
  localStorage.setItem(STORAGE_KEYS.GATEWAY_SETTINGS, JSON.stringify(settings));
};

export const getStoredNotifications = (): NotificationItem[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

export const saveNotifications = (items: NotificationItem[]) => {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(items));
};

export const addNotification = (item: NotificationItem): NotificationItem[] => {
  const current = getStoredNotifications();
  const updated = [item, ...current];
  saveNotifications(updated);
  return updated;
};

export const markAllNotificationsAsRead = (): NotificationItem[] => {
  const current = getStoredNotifications();
  const updated = current.map(n => ({ ...n, read: true }));
  saveNotifications(updated);
  return updated;
};

export const getStoredUser = (): User => {
  const saved = localStorage.getItem(STORAGE_KEYS.USER);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  const defaultUser: User = {
    id: 'usr-guest-101',
    name: 'মুহাম্মদ শাকিল (Muhammad Shakil)',
    phone: '01715-678901',
    email: 'shakil.foodie@gmail.com',
    role: 'customer',
    loyaltyPoints: 350,
    referralCode: 'SHAKIL2026',
    savedAddresses: [
      {
        id: 'addr-primary',
        label: 'Home',
        area: 'ধানমন্ডি',
        zoneId: 'zone-dhanmondi',
        streetAddress: 'রোড #৮/এ, বাড়ি #৩২',
        apartmentFloor: 'ফ্ল্যাট ৩এ',
        landmark: 'সোবহানবাগ মসজিদের কাছে',
        phone: '01715-678901',
        lat: 23.7510,
        lng: 90.3750
      }
    ],
    joinedDate: '২০২৫-১০-১৫'
  };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
  return defaultUser;
};

export const saveUser = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const deleteUserAccount = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.ORDERS);
  localStorage.removeItem(STORAGE_KEYS.CART);
};

export const getStoredCart = (): CartItem[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.CART);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item: any) => item && item.foodItem)
      .map((item: any) => ({
        ...item,
        quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
        selectedAddons: Array.isArray(item.selectedAddons) ? item.selectedAddons : [],
        specialInstructions: item.specialInstructions || ''
      }));
  } catch {
    return [];
  }
};

export const saveCart = (cart: CartItem[]) => {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
};

export const getStoredActiveZone = (): DeliveryZone => {
  const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_ZONE);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  return INITIAL_DELIVERY_ZONES[0];
};

export const saveActiveZone = (zone: DeliveryZone) => {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_ZONE, JSON.stringify(zone));
};

export const resetAllDataToDefault = () => {
  localStorage.clear();
  localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(INITIAL_FOOD_ITEMS));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
  localStorage.setItem(STORAGE_KEYS.GATEWAY_SETTINGS, JSON.stringify(INITIAL_GATEWAY_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
};

export const storage = {
  getLanguage: getStoredLanguage,
  saveLanguage: setStoredLanguage,
  getFoodItems: getStoredFoodItems,
  saveFoodItems,
  getOrders: getStoredOrders,
  saveOrders,
  getReservations: getStoredReservations,
  saveReservations,
  getGatewaySettings: getStoredGatewaySettings,
  saveGatewaySettings,
  getNotifications: getStoredNotifications,
  saveNotifications,
  getUser: getStoredUser,
  saveUser,
  getCart: getStoredCart,
  saveCart,
  getDeliveryZone: getStoredActiveZone,
  saveDeliveryZone: saveActiveZone,
  getSavedAddress: (): any => {
    const u = getStoredUser();
    return u?.savedAddresses?.[0] || null;
  },
  saveAddress: (addr: any) => {
    const u = getStoredUser();
    if (u) {
      const updated = {
        ...u,
        savedAddresses: [addr, ...(u.savedAddresses || []).filter(a => a.id !== addr.id)]
      };
      saveUser(updated);
    }
  }
};
