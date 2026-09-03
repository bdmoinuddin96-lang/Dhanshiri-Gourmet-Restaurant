import React from 'react';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  CreditCard, 
  ArrowRight,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { Order, Language } from '../types';
import { translations } from '../i18n/translations';

interface OrdersViewProps {
  orders: Order[];
  onTrackOrder: (order: Order) => void;
  language: Language;
  onNavigateToMenu: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onTrackOrder,
  language,
  onNavigateToMenu
}) => {
  const t = translations[language];

  const getStatusBadge = (status: Order['orderStatus']) => {
    switch (status) {
      case 'received':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{t.statusReceived}</span>;
      case 'preparing':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{t.statusPreparing}</span>;
      case 'on_the_way':
        return <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full animate-pulse">{t.statusOnTheWay}</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{t.statusDelivered}</span>;
      default:
        return <span className="bg-stone-100 text-stone-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Hind_Siliguri',sans-serif]">
            {t.orders}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            {language === 'bn' ? 'আপনার সকল অর্ডারের লাইভ ট্র্যাকিং ও ইতিহাস' : 'Track your active orders and review order history'}
          </p>
        </div>

        <button
          onClick={onNavigateToMenu}
          className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{t.browseMenu}</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-300 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-700">
            {language === 'bn' ? 'এখনও কোনো অর্ডার করেননি' : 'No orders placed yet'}
          </h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            {language === 'bn' ? 'আমাদের খাঁটি কাচ্চি ও সুস্বাদু খাবার এখনই পরখ করে দেখুন!' : 'Discover our delicious dishes and place your first order!'}
          </p>
          <button
            onClick={onNavigateToMenu}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            {t.browseMenu}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all p-4 sm:p-5 space-y-4"
            >
              {/* Order Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-sm text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg">
                    #{order.orderNumber}
                  </span>
                  <span className="text-xs text-stone-400">
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(order.orderStatus)}
                  <button
                    onClick={() => onTrackOrder(order)}
                    className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>{t.trackOrder}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="space-y-1.5 text-xs text-stone-700">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="font-medium">
                      {language === 'bn' ? item.name_bn : item.name_en} <span className="text-stone-400 font-mono">×{item.quantity}</span>
                    </span>
                    <span className="font-mono text-stone-900 font-semibold">
                      ৳{(item.price || 0) * (item.quantity || 1)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer info: Payment + Delivery Address */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 text-stone-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'bn' ? order.deliveryZone?.name_bn : order.deliveryZone?.name_en}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 uppercase font-semibold text-stone-800">
                    <CreditCard className="w-3.5 h-3.5 text-stone-500" />
                    <span>{order.paymentMethod}</span>
                  </span>
                  {order.trxId && (
                    <span className="font-mono text-[11px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                      TrxID: {order.trxId}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-stone-500 font-medium">
                    {language === 'bn' ? 'মোট:' : 'Total:'}
                  </span>
                  <span className="text-base font-extrabold text-stone-950 font-mono">
                    ৳{order.total}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
