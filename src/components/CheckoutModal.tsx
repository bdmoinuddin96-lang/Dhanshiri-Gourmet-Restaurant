import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  User as UserIcon, 
  Mail, 
  CreditCard, 
  Banknote, 
  Store, 
  ShieldCheck, 
  Check, 
  AlertTriangle,
  ArrowRight,
  Info
} from 'lucide-react';
import { 
  CartItem, 
  DeliveryZone, 
  DeliveryAddress, 
  PaymentMethodType, 
  PaymentGatewaySettings, 
  Language, 
  Order 
} from '../types';
import { translations } from '../i18n/translations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  activeZone: DeliveryZone;
  savedAddress?: DeliveryAddress;
  onOpenLocationPicker: () => void;
  gatewaySettings: PaymentGatewaySettings;
  discountAmount: number;
  loyaltyDiscount: number;
  appliedCoupon: string | null;
  onConfirmOrder: (orderData: Partial<Order>) => void;
  onTriggerOnlinePayment: (method: PaymentMethodType, amount: number, pendingOrder: Partial<Order>) => void;
  language: Language;
  defaultCustomerName?: string;
  defaultCustomerPhone?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  activeZone,
  savedAddress,
  onOpenLocationPicker,
  gatewaySettings,
  discountAmount,
  loyaltyDiscount,
  appliedCoupon,
  onConfirmOrder,
  onTriggerOnlinePayment,
  language,
  defaultCustomerName = 'মুহাম্মদ শাকিল (Muhammad Shakil)',
  defaultCustomerPhone = '01715-678901'
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const [customerName, setCustomerName] = useState(defaultCustomerName);
  const [customerPhone, setCustomerPhone] = useState(defaultCustomerPhone);
  const [customerEmail, setCustomerEmail] = useState('customer@dhanshirikitchen.com');
  const [orderNotes, setOrderNotes] = useState('');
  
  // Default to first enabled payment method
  const getInitialPaymentMethod = (): PaymentMethodType => {
    if (gatewaySettings.enabledMethods.bkash) return 'bkash';
    if (gatewaySettings.enabledMethods.nagad) return 'nagad';
    if (gatewaySettings.enabledMethods.card) return 'card';
    if (gatewaySettings.enabledMethods.cod) return 'cod';
    return 'pay_at_restaurant';
  };

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>(getInitialPaymentMethod());
  const [validationError, setValidationError] = useState('');

  const subtotal = (cart || []).reduce((sum, item) => {
    const addonsSum = (item?.selectedAddons || []).reduce((s, a) => s + (a?.price || 0), 0);
    const itemPrice = item?.foodItem?.price || 0;
    const qty = item?.quantity || 0;
    return sum + (itemPrice + addonsSum) * qty;
  }, 0);

  const deliveryFee = activeZone.baseFee;
  const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount - loyaltyDiscount);

  // COD constraint check
  const isCodValid = selectedMethod !== 'cod' || (
    finalTotal >= gatewaySettings.minCodAmount && finalTotal <= gatewaySettings.maxCodAmount
  );

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!customerName.trim() || !customerPhone.trim()) {
      setValidationError(language === 'bn' ? 'অনুগ্রহ করে নাম এবং মোবাইল নম্বর প্রদান করুন' : 'Please provide your name and phone number');
      return;
    }

    if (selectedMethod === 'cod') {
      if (finalTotal < gatewaySettings.minCodAmount) {
        setValidationError(language === 'bn' 
          ? `ক্যাশ অন ডেলিভারির জন্য সর্বনিম্ন ৳${gatewaySettings.minCodAmount} এর অর্ডার প্রয়োজন` 
          : `Minimum order of ৳${gatewaySettings.minCodAmount} required for Cash on Delivery`);
        return;
      }
      if (finalTotal > gatewaySettings.maxCodAmount) {
        setValidationError(language === 'bn' 
          ? `ক্যাশ অন ডেলিভারিতে সর্বোচ্চ ৳${gatewaySettings.maxCodAmount} গ্রহণযোগ্য। এর বেশি অর্ডারে অনলাইন পেমেন্ট করুন।` 
          : `Maximum limit for Cash on Delivery is ৳${gatewaySettings.maxCodAmount}. Please choose an online payment method.`);
        return;
      }
    }

    const orderPayload: Partial<Order> = {
      orderNumber: `DK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress: savedAddress || {
        id: 'addr-temp',
        label: 'Home',
        area: language === 'bn' ? activeZone.name_bn : activeZone.name_en,
        zoneId: activeZone.id,
        streetAddress: 'বাড়ি #১২, রোড #২৭',
        phone: customerPhone
      },
      deliveryZone: activeZone,
      items: (cart || []).map(item => ({
        foodItemId: item.foodItem?.id || 'unknown',
        name_bn: item.foodItem?.name_bn || '',
        name_en: item.foodItem?.name_en || '',
        price: item.foodItem?.price || 0,
        quantity: item.quantity || 1,
        addons: item.selectedAddons || [],
        specialInstructions: item.specialInstructions
      })),
      subtotal,
      deliveryFee,
      discount: discountAmount,
      couponCode: appliedCoupon || undefined,
      loyaltyDiscount,
      total: finalTotal,
      paymentMethod: selectedMethod,
      orderNotes,
      estimatedDeliveryTime: `${activeZone.estimatedMinutes} মিনিট`
    };

    // If online method, trigger interactive payment modal
    if (['bkash', 'nagad', 'rocket', 'upay', 'tap', 'card', 'sslcommerz'].includes(selectedMethod)) {
      onTriggerOnlinePayment(selectedMethod, finalTotal, orderPayload);
    } else {
      // COD or Pay at Restaurant
      onConfirmOrder({
        ...orderPayload,
        paymentStatus: 'pending',
        orderStatus: 'received'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-stone-900/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-stone-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 font-['Hind_Siliguri',sans-serif]">
                {t.checkoutTitle}
              </h2>
              <p className="text-xs text-stone-500">
                {language === 'bn' ? 'অর্ডার তথ্য ও নিরাপদ পেমেন্ট সম্পন্ন করুন' : 'Review your order and choose your payment gateway'}
              </p>
            </div>

            <button
              id="close-checkout-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitCheckout}>
            <div className="p-4 sm:p-6 space-y-6 max-h-[72vh] overflow-y-auto">
              
              {/* Customer Contact Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.customerInfo}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      {t.fullName} *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="আপনার নাম"
                      required
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      {t.phoneNumber} *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        required
                        className="w-full pl-8 pr-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    {t.emailOptional}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="w-full pl-8 pr-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address & Zone Section */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t.deliveryAddressSection}</span>
                  </h3>

                  <button
                    type="button"
                    onClick={onOpenLocationPicker}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 underline underline-offset-2 cursor-pointer"
                  >
                    {language === 'bn' ? 'ঠিকানা / জোন পরিবর্তন' : 'Change Address / Zone'}
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">
                          {savedAddress?.label || 'Home'} — {language === 'bn' ? activeZone.name_bn : activeZone.name_en}
                        </span>
                        <span className="text-[10px] bg-amber-200/70 text-amber-900 font-semibold px-2 py-0.2 rounded-full">
                          ৳{activeZone.baseFee} {language === 'bn' ? 'ডেলিভারি চার্জ' : 'delivery'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5">
                        {savedAddress?.streetAddress || 'বাড়ি #১২, রোড #২৭, ধানমন্ডি'} 
                        {savedAddress?.apartmentFloor && `, ${savedAddress.apartmentFloor}`}
                      </p>
                      {savedAddress?.landmark && (
                        <p className="text-[11px] text-stone-500">
                          {language === 'bn' ? 'কাছের স্থান:' : 'Landmark:'} {savedAddress.landmark}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] text-stone-500 whitespace-nowrap">
                    ⏱️ {activeZone.estimatedMinutes} min
                  </span>
                </div>
              </div>

              {/* Payment Methods Section (Required Bangladeshi MFS & Gateways) */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t.choosePaymentMethod}</span>
                  </h3>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    🔒 SSL 256-Bit Encrypted
                  </span>
                </div>

                {/* Grid of Enabled Payment Methods */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  
                  {/* bKash বিকাশ */}
                  {gatewaySettings.enabledMethods.bkash && (
                    <div
                      onClick={() => setSelectedMethod('bkash')}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        selectedMethod === 'bkash'
                          ? 'bg-[#E2136E]/10 border-[#E2136E] ring-1 ring-[#E2136E]'
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#E2136E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          ব
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-stone-900">{t.bkash}</span>
                            <span className="text-[9px] bg-pink-100 text-[#E2136E] font-bold px-1.5 py-0.2 rounded">
                              bKash
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-500">
                            {language === 'bn' ? 'তাৎক্ষণিক পেমেন্ট ভেরিফিকেশন' : 'Instant MFS Gateway'}
                          </span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedMethod === 'bkash' ? 'bg-[#E2136E] border-[#E2136E] text-white' : 'border-stone-300 bg-white'
                      }`}>
                        {selectedMethod === 'bkash' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  )}

                  {/* Nagad নগদ */}
                  {gatewaySettings.enabledMethods.nagad && (
                    <div
                      onClick={() => setSelectedMethod('nagad')}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        selectedMethod === 'nagad'
                          ? 'bg-[#F7941D]/10 border-[#F7941D] ring-1 ring-[#F7941D]'
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#F7941D] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          ন
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-stone-900">{t.nagad}</span>
                            <span className="text-[9px] bg-orange-100 text-[#F7941D] font-bold px-1.5 py-0.2 rounded">
                              Nagad
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-500">
                            {language === 'bn' ? 'ডাক বিভাগ ডিজিটাল ওয়ালেট' : 'Post Office Digital Wallet'}
                          </span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedMethod === 'nagad' ? 'bg-[#F7941D] border-[#F7941D] text-white' : 'border-stone-300 bg-white'
                      }`}>
                        {selectedMethod === 'nagad' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  )}

                  {/* Rocket রকেট */}
                  {gatewaySettings.enabledMethods.rocket && (
                    <div
                      onClick={() => setSelectedMethod('rocket')}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        selectedMethod === 'rocket'
                          ? 'bg-[#8C3494]/10 border-[#8C3494] ring-1 ring-[#8C3494]'
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#8C3494] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          র
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-stone-900">{t.rocket}</span>
                            <span className="text-[9px] bg-purple-100 text-[#8C3494] font-bold px-1.5 py-0.2 rounded">
                              DBBL
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-500">
                            {language === 'bn' ? 'ডাচ-বাংলা রকেট ওয়ালেট' : 'Dutch-Bangla Bank Rocket'}
                          </span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedMethod === 'rocket' ? 'bg-[#8C3494] border-[#8C3494] text-white' : 'border-stone-300 bg-white'
                      }`}>
                        {selectedMethod === 'rocket' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  )}

                  {/* Upay উপায় */}
                  {gatewaySettings.enabledMethods.upay && (
                    <div
                      onClick={() => setSelectedMethod('upay')}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        selectedMethod === 'upay'
                          ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600'
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#005BAB] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          উ
                        </div>
                        <div>
                          <span className="text-xs font-bold text-stone-900">{t.upay}</span>
                          <span className="text-[10px] text-stone-500 block">UCB Upay Wallet</span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedMethod === 'upay' ? 'bg-[#005BAB] border-[#005BAB] text-white' : 'border-stone-300 bg-white'
                      }`}>
                        {selectedMethod === 'upay' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  )}

                  {/* Visa / Mastercard / Cards */}
                  {gatewaySettings.enabledMethods.card && (
                    <div
                      onClick={() => setSelectedMethod('card')}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        selectedMethod === 'card'
                          ? 'bg-amber-50 border-amber-600 ring-1 ring-amber-600'
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shrink-0">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-stone-900">{t.card}</span>
                          <span className="text-[10px] text-stone-500 block">Visa, Mastercard, Amex</span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedMethod === 'card' ? 'bg-amber-600 border-amber-600 text-white' : 'border-stone-300 bg-white'
                      }`}>
                        {selectedMethod === 'card' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  )}

                  {/* Cash on Delivery (ক্যাশ অন ডেলিভারি) */}
                  {gatewaySettings.enabledMethods.cod && (
                    <div
                      onClick={() => setSelectedMethod('cod')}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        selectedMethod === 'cod'
                          ? 'bg-emerald-50 border-emerald-600 ring-1 ring-emerald-600'
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                          <Banknote className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-stone-900">{t.cod}</span>
                          <span className="text-[10px] text-stone-500 block">
                            {language === 'bn' ? 'খাবার পৌঁছালে নগদ অর্থ দিন' : 'Pay in cash upon arrival'}
                          </span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedMethod === 'cod' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                      }`}>
                        {selectedMethod === 'cod' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  )}

                  {/* Pay at Restaurant (রেস্টুরেন্টে পেমেন্ট) */}
                  {gatewaySettings.enabledMethods.pay_at_restaurant && (
                    <div
                      onClick={() => setSelectedMethod('pay_at_restaurant')}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        selectedMethod === 'pay_at_restaurant'
                          ? 'bg-amber-50 border-amber-600 ring-1 ring-amber-600'
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-stone-700 text-white flex items-center justify-center shrink-0">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-stone-900">{t.payAtRestaurant}</span>
                          <span className="text-[10px] text-stone-500 block">Dine-in / Pickup</span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedMethod === 'pay_at_restaurant' ? 'bg-amber-600 border-amber-600 text-white' : 'border-stone-300 bg-white'
                      }`}>
                        {selectedMethod === 'pay_at_restaurant' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  )}

                </div>

                {/* COD limitation warning if applicable */}
                {selectedMethod === 'cod' && !isCodValid && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>
                      {language === 'bn' 
                        ? `ক্যাশ অন ডেলিভারির অনুমোদিত পরিসর ৳${gatewaySettings.minCodAmount} থেকে ৳${gatewaySettings.maxCodAmount}` 
                        : `COD allowed range is ৳${gatewaySettings.minCodAmount} to ৳${gatewaySettings.maxCodAmount}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Special Delivery Notes */}
              <div className="space-y-1.5 pt-2 border-t border-stone-200">
                <label className="text-[11px] font-semibold text-stone-600 block">
                  {language === 'bn' ? 'ডেলিভারি নোট বা নির্দেশনা (ঐচ্ছিক)' : 'Delivery Notes or Calling Instruction'}
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: কলবেল না বাজিয়ে ফোন দেবেন...' : 'e.g. Please call before ringing doorbell...'}
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              {/* Validation error message */}
              {validationError && (
                <p className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                  {validationError}
                </p>
              )}

            </div>

            {/* Modal Footer: Total and Submit Button */}
            <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-stone-500 block">
                  {language === 'bn' ? 'সর্বমোট মূল্য (চার্জসহ)' : 'Total (incl. delivery)'}
                </span>
                <span className="text-xl font-black text-stone-900 font-mono">
                  ৳{finalTotal}
                </span>
              </div>

              <button
                id="submit-order-checkout-btn"
                type="submit"
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-amber-600/20 hover:shadow-lg transition-all cursor-pointer"
              >
                <span>
                  {['bkash', 'nagad', 'rocket', 'upay', 'tap', 'card', 'sslcommerz'].includes(selectedMethod)
                    ? (language === 'bn' ? 'পেমেন্ট গেটওয়েতে যান' : 'Proceed to Payment Gateway')
                    : t.placeOrderButton}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
