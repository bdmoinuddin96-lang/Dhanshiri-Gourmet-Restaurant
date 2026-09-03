import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles,
  Award
} from 'lucide-react';
import { CartItem, DeliveryZone, Language } from '../types';
import { translations } from '../i18n/translations';
import { INITIAL_COUPONS } from '../data/initialData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  activeZone: DeliveryZone;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  discountAmount: number;
  useLoyalty: boolean;
  onToggleLoyalty: () => void;
  loyaltyDiscount: number;
  userPoints: number;
  language: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  activeZone,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  discountAmount,
  useLoyalty,
  onToggleLoyalty,
  loyaltyDiscount,
  userPoints,
  language
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = (cart || []).reduce((sum, item) => {
    const addonsSum = (item?.selectedAddons || []).reduce((s, a) => s + (a?.price || 0), 0);
    const itemPrice = item?.foodItem?.price || 0;
    const qty = item?.quantity || 0;
    return sum + (itemPrice + addonsSum) * qty;
  }, 0);

  const deliveryFee = subtotal > 0 ? activeZone.baseFee : 0;
  const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount - loyaltyDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const coupon = INITIAL_COUPONS.find(c => c.code === code && c.active);
    if (!coupon) {
      setCouponError(t.invalidCoupon);
      return;
    }

    if (subtotal < coupon.minSpend) {
      setCouponError(
        language === 'bn' 
          ? `এই কুপনের জন্য সর্বনিম্ন ৳${coupon.minSpend} এর অর্ডার প্রয়োজন` 
          : `Minimum order of ৳${coupon.minSpend} required for this coupon`
      );
      return;
    }

    const success = onApplyCoupon(code);
    if (success) {
      setCouponInput('');
      setCouponError('');
    } else {
      setCouponError(t.invalidCoupon);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  {t.myCart}
                </h2>
                <span className="text-xs text-stone-500">
                  {cart.length} {language === 'bn' ? 'পদের খাবার' : 'items'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  id="clear-cart-btn"
                  onClick={onClearCart}
                  className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg transition-colors"
                  title={t.clearCart}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                id="close-cart-drawer-btn"
                onClick={onClose}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-72 text-center p-6 text-stone-400">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-300 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-stone-700">{t.cartEmpty}</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">{t.cartEmptyMsg}</p>
              </div>
            ) : (
              <div className="space-y-3 divide-y divide-stone-100">
                {cart.map((item) => {
                  const name = language === 'bn' ? item.foodItem?.name_bn : item.foodItem?.name_en;
                  const safeAddons = item.selectedAddons || [];
                  const addonsPrice = safeAddons.reduce((s, a) => s + (a?.price || 0), 0);
                  const itemUnitPrice = (item.foodItem?.price || 0) + addonsPrice;
                  const itemQty = item.quantity || 1;

                  return (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-start gap-3">
                      <img
                        src={item.foodItem?.image || ''}
                        alt={name || ''}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-100"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-stone-900 leading-snug truncate">
                            {name}
                          </h4>
                          <span className="text-xs font-extrabold text-stone-900 font-mono shrink-0">
                            ৳{itemUnitPrice * itemQty}
                          </span>
                        </div>

                        {/* Addons List */}
                        {safeAddons.length > 0 && (
                          <div className="text-[10px] text-amber-800 space-y-0.5 mt-0.5">
                            {safeAddons.map(a => (
                              <span key={a.id} className="inline-block bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60 mr-1">
                                + {language === 'bn' ? a.name_bn : a.name_en} (৳{a.price})
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Special instructions */}
                        {item.specialInstructions && (
                          <p className="text-[10px] text-stone-500 italic mt-0.5">
                            "{item.specialInstructions}"
                          </p>
                        )}

                        {/* Quantity and delete controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-stone-100 px-2 py-0.5 rounded-lg border border-stone-200">
                            <button
                              id={`decrease-cart-qty-${item.id}`}
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="text-stone-600 hover:text-stone-900 cursor-pointer p-0.5"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-stone-900 font-mono min-w-[14px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              id={`increase-cart-qty-${item.id}`}
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="text-stone-600 hover:text-stone-900 cursor-pointer p-0.5"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            id={`remove-cart-item-${item.id}`}
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[11px] text-stone-400 hover:text-red-600 flex items-center gap-0.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{language === 'bn' ? 'মুছুন' : 'Remove'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Loyalty points toggle */}
            {cart.length > 0 && userPoints >= 100 && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-900">
                      {language === 'bn' ? 'লয়্যালটি পয়েন্ট ব্যবহার' : 'Use Loyalty Points'}
                    </h5>
                    <span className="text-[10px] text-stone-500">
                      {language === 'bn' ? `১০০ পয়েন্টে ৳৫০ ছাড় (আপনার আছে: ${userPoints})` : `100 points = ৳50 off (Balance: ${userPoints})`}
                    </span>
                  </div>
                </div>

                <button
                  id="toggle-loyalty-points-btn"
                  onClick={onToggleLoyalty}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    useLoyalty 
                      ? 'bg-amber-600 text-white border-amber-600' 
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {useLoyalty ? (language === 'bn' ? 'যুক্ত আছে' : 'Applied') : (language === 'bn' ? 'যুক্ত করুন' : 'Apply')}
                </button>
              </div>
            )}

            {/* Coupon Code Section */}
            {cart.length > 0 && (
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t.haveCoupon}</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    DHAKA100
                  </span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 px-3 py-2 rounded-xl text-xs text-emerald-800 font-bold">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{appliedCoupon} ({language === 'bn' ? `৳${discountAmount} ছাড়` : `৳${discountAmount} off`})</span>
                    </div>
                    <button
                      id="remove-coupon-btn"
                      onClick={onRemoveCoupon}
                      className="text-emerald-700 hover:text-red-600 font-bold text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      id="coupon-code-input"
                      type="text"
                      placeholder="e.g. DHAKA100"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 uppercase font-mono font-bold"
                    />
                    <button
                      id="apply-coupon-btn"
                      type="submit"
                      className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      {t.apply}
                    </button>
                  </form>
                )}

                {couponError && (
                  <p className="text-[11px] text-red-600 font-semibold">{couponError}</p>
                )}
              </div>
            )}
          </div>

          {/* Drawer Footer: Bill breakdown & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-mono font-semibold text-stone-900">৳{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>
                    {t.deliveryFee} ({language === 'bn' ? activeZone.name_bn : activeZone.name_en})
                  </span>
                  <span className="font-mono font-semibold text-stone-900">৳{deliveryFee}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>{t.discount} ({appliedCoupon})</span>
                    <span className="font-mono">-৳{discountAmount}</span>
                  </div>
                )}

                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-amber-700 font-semibold">
                    <span>{t.loyaltyDiscount}</span>
                    <span className="font-mono">-৳{loyaltyDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-extrabold text-stone-950 pt-2 border-t border-stone-200">
                  <span>{t.totalPayable}</span>
                  <span className="text-base font-mono text-amber-700">৳{finalTotal}</span>
                </div>
              </div>

              <button
                id="drawer-proceed-checkout-btn"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm shadow-md shadow-amber-600/20 hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{t.proceedToCheckout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
