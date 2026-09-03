export type Language = 'bn' | 'en';

export type PaymentMethodType = 
  | 'bkash' 
  | 'nagad' 
  | 'rocket' 
  | 'upay' 
  | 'tap' 
  | 'card' 
  | 'sslcommerz' 
  | 'cod' 
  | 'pay_at_restaurant';

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export type OrderStatus = 'received' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  role: 'customer' | 'admin';
  loyaltyPoints: number;
  referralCode: string;
  defaultAddress?: DeliveryAddress;
  savedAddresses: DeliveryAddress[];
  joinedDate: string;
}

export interface DeliveryZone {
  id: string;
  name_bn: string;
  name_en: string;
  baseFee: number;
  minOrder: number;
  estimatedMinutes: number;
  lat: number;
  lng: number;
}

export interface DeliveryAddress {
  id: string;
  label: string; // Home, Office, Other
  area: string;
  zoneId: string;
  streetAddress: string;
  apartmentFloor?: string;
  landmark?: string;
  phone: string;
  lat?: number;
  lng?: number;
}

export interface FoodAddon {
  id: string;
  name_bn: string;
  name_en: string;
  price: number;
}

export interface FoodItem {
  id: string;
  name_bn: string;
  name_en: string;
  description_bn: string;
  description_en: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  image: string;
  rating: number;
  reviewsCount: number;
  isVeg: boolean;
  spiceLevel: 0 | 1 | 2 | 3; // 0=None, 1=Mild, 2=Medium, 3=Fiery
  prepTimeMinutes: number;
  calories: number;
  available: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  tags: string[];
  addons?: FoodAddon[];
}

export interface FoodCategory {
  id: string;
  slug: string;
  name_bn: string;
  name_en: string;
  iconName: string;
  image?: string;
}

export interface CartItem {
  id: string; // unique cart entry id
  foodItem: FoodItem;
  quantity: number;
  selectedAddons: FoodAddon[];
  specialInstructions?: string;
}

export interface OrderItem {
  foodItemId: string;
  name_bn: string;
  name_en: string;
  price: number;
  quantity: number;
  addons: FoodAddon[];
  specialInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: DeliveryAddress;
  deliveryZone: DeliveryZone;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  loyaltyDiscount: number;
  total: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trxId?: string;
  paymentGateway?: string;
  paymentAccount?: string; // last 4 digits or mobile no
  refundReason?: string;
  gatewayResponse?: any;
  createdAt: string;
  estimatedDeliveryTime: string;
  orderNotes?: string;
}

export interface TableReservation {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: 'indoor' | 'rooftop' | 'private_family' | 'outdoor_garden';
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface Review {
  id: string;
  foodId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  flatDiscount?: number;
  minSpend: number;
  maxDiscount: number;
  validUntil: string;
  description_bn: string;
  description_en: string;
  active: boolean;
}

export interface NotificationItem {
  id: string;
  title_bn: string;
  title_en: string;
  message_bn: string;
  message_en: string;
  type: 'order' | 'order_update' | 'discount' | 'new_item' | 'system' | 'general';
  read: boolean;
  date?: string;
  timestamp?: string;
  orderId?: string;
}

export type UserProfile = User;
export type AppNotification = NotificationItem;

export interface PaymentGatewaySettings {
  enabledMethods: Record<PaymentMethodType, boolean>;
  preferredGateway: 'SSLCommerz' | 'ShurjoPay' | 'aamarPay' | 'PortWallet';
  minCodAmount: number;
  maxCodAmount: number;
  bkashMerchantNumber: string;
  nagadMerchantNumber: string;
  rocketMerchantNumber: string;
  upayMerchantNumber: string;
  sandboxMode: boolean;
  sslczStoreId: string;
  autoConfirmOnlineOrders: boolean;
}
