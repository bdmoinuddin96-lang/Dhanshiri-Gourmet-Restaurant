import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Bike, 
  Phone, 
  MapPin, 
  Receipt, 
  CreditCard,
  Printer,
  Navigation
} from 'lucide-react';
import { Order, Language } from '../types';
import { translations } from '../i18n/translations';
import { GoogleDeliveryMap } from './GoogleDeliveryMap';

interface OrderTrackingModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen || !order) return null;
  const t = translations[language];

  // Pipeline stage index
  const getStageIndex = (status: Order['orderStatus']) => {
    switch (status) {
      case 'received': return 0;
      case 'preparing': return 1;
      case 'on_the_way': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentStage = getStageIndex(order.orderStatus);

  const stages = [
    { title: t.statusReceived, icon: Receipt, desc: language === 'bn' ? 'অর্ডার গ্রহণ করা হয়েছে' : 'Order accepted' },
    { title: t.statusPreparing, icon: ChefHat, desc: language === 'bn' ? 'গরম গরম খাঁটি ঘিয়ে রান্না চলছে' : 'Cooking with pure ghee' },
    { title: t.statusOnTheWay, icon: Bike, desc: language === 'bn' ? 'রাইডার হট-বক্সে নিয়ে রওয়ানা হয়েছে' : 'Rider dispatched in thermal bag' },
    { title: t.statusDelivered, icon: CheckCircle2, desc: language === 'bn' ? 'খাবার আপনার কাছে পৌঁছেছে' : 'Delivered fresh to door' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-stone-900/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-stone-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900 font-['Hind_Siliguri',sans-serif]">
                  {t.trackOrder}
                </h3>
                <span className="bg-amber-100 text-amber-900 text-xs font-mono font-bold px-2 py-0.5 rounded-md">
                  #{order.orderNumber}
                </span>
              </div>
              <span className="text-xs text-stone-500">
                {language === 'bn' ? 'সম্ভাব্য পৌঁছানোর সময়: ' : 'Estimated Arrival: '}
                <strong className="text-stone-800 font-semibold">{order.estimatedDeliveryTime}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="print-invoice-btn"
                onClick={handlePrint}
                className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
                title={t.viewInvoice}
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                id="close-order-tracking-btn"
                onClick={onClose}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Status Pipeline Progress Bar */}
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
              <div className="relative flex items-center justify-between">
                {/* Connecting horizontal line */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-stone-200 -z-0">
                  <div 
                    className="h-full bg-amber-600 transition-all duration-700"
                    style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
                  />
                </div>

                {stages.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isCompleted = idx <= currentStage;
                  const isCurrent = idx === currentStage;

                  return (
                    <div key={idx} className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted 
                          ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30' 
                          : 'bg-white border-2 border-stone-300 text-stone-400'
                      } ${isCurrent ? 'ring-4 ring-amber-400/40 scale-110' : ''}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] font-bold mt-2 text-center max-w-[70px] leading-tight ${
                        isCompleted ? 'text-amber-900' : 'text-stone-400'
                      }`}>
                        {stage.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Delivery Route on Google Maps */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-amber-600" />
                  <span>{language === 'bn' ? 'লাইভ গুগল ম্যাপ ডেলিভারি ট্র্যাকিং' : 'Live Google Map Delivery Tracking'}</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span>{language === 'bn' ? 'জিপিএস কানেক্টেড' : 'GPS Live'}</span>
                </span>
              </div>

              {(() => {
                const destLat = order.deliveryAddress?.lat || order.deliveryZone.lat || 23.7510;
                const destLng = order.deliveryAddress?.lng || order.deliveryZone.lng || 90.3750;
                // Compute intermediate rider location
                const riderLat = 23.7510 + (destLat - 23.7510) * 0.65;
                const riderLng = 90.3750 + (destLng - 90.3750) * 0.65;
                const riderPos = order.orderStatus === 'on_the_way' ? { lat: riderLat, lng: riderLng } : undefined;

                return (
                  <GoogleDeliveryMap
                    center={{ lat: (23.7510 + destLat) / 2, lng: (90.3750 + destLng) / 2 }}
                    zoom={13}
                    markerPosition={{ lat: destLat, lng: destLng }}
                    riderPosition={riderPos}
                    interactive={true}
                    height="230px"
                    language={language}
                  />
                );
              })()}
            </div>

            {/* Rider Details Card */}
            {order.orderStatus !== 'delivered' && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-lg font-bold shadow-md shrink-0">
                    <Bike className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">
                      {t.riderInfo}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900">
                      {language === 'bn' ? 'রফিক মিয়া (Rafiq Mia)' : 'Rafiq Mia'}
                    </h4>
                    <span className="text-xs text-stone-500">
                      {language === 'bn' ? 'বাইক: ঢাকা মেট্রো হ-১২৩৪' : 'Motorbike: Dhaka Metro Ha-1234'}
                    </span>
                  </div>
                </div>

                <a
                  href="tel:01712998877"
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.callRider}</span>
                </a>
              </div>
            )}

            {/* Destination Address Info */}
            <div className="flex items-start gap-2.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-900 block">
                  {language === 'bn' ? 'ডেলিভারির ঠিকানা:' : 'Delivery Address:'}
                </span>
                <p className="text-stone-600">
                  {order.deliveryAddress?.streetAddress || ''}, {order.deliveryAddress?.apartmentFloor && `${order.deliveryAddress.apartmentFloor}, `}
                  {order.deliveryZone ? (language === 'bn' ? order.deliveryZone.name_bn : order.deliveryZone.name_en) : ''}
                </p>
                <span className="text-[11px] text-stone-500 font-mono">
                  {language === 'bn' ? 'গ্রাহক মোবাইল:' : 'Customer Phone:'} {order.customerPhone}
                </span>
              </div>
            </div>

            {/* Itemized Order Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                {language === 'bn' ? 'অর্ডারকৃত খাবারের তালিকা' : 'Ordered Food Items'}
              </h4>

              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-stone-900">
                        {language === 'bn' ? item.name_bn : item.name_en}
                      </span>
                      <span className="text-stone-500 font-mono ml-2">× {item.quantity}</span>
                      {item.addons && item.addons.length > 0 && (
                        <div className="text-[10px] text-amber-800 mt-0.5">
                          {item.addons.map(a => `+ ${language === 'bn' ? a.name_bn : a.name_en}`).join(', ')}
                        </div>
                      )}
                    </div>
                    <span className="font-mono font-extrabold text-stone-900">
                      ৳{(item.price || 0) * (item.quantity || 1)}
                    </span>
                  </div>
                ))}

                <div className="p-3 bg-stone-50 space-y-1 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>{t.subtotal}</span>
                    <span className="font-mono">৳{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>{t.deliveryFee}</span>
                    <span className="font-mono">৳{order.deliveryFee}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>{t.discount}</span>
                      <span className="font-mono">-৳{order.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-stone-950 pt-1 border-t border-stone-200">
                    <span>{t.totalPayable}</span>
                    <span className="text-amber-800 font-mono">৳{order.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Record & TrxID details */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-stone-500" />
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">
                    {language === 'bn' ? 'পেমেন্ট পদ্ধতি ও অবস্থা' : 'Payment & Status'}
                  </span>
                  <span className="font-bold text-stone-900 uppercase">
                    {order.paymentMethod} — {order.paymentStatus === 'success' 
                      ? (language === 'bn' ? 'পরিশোধিত (Paid)' : 'Paid Online') 
                      : (language === 'bn' ? 'বকেয়া (COD/Pending)' : 'Pending')}
                  </span>
                </div>
              </div>

              {order.trxId && (
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">
                    {t.trxIdLabel}
                  </span>
                  <span className="font-mono font-bold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded">
                    {order.trxId}
                  </span>
                </div>
              )}
            </div>

          </div>

          <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
            <button
              id="close-tracking-footer-btn"
              onClick={onClose}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
