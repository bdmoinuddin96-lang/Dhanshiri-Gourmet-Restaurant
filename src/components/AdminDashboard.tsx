import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  CreditCard, 
  Banknote, 
  AlertCircle, 
  RotateCcw, 
  Download, 
  Plus, 
  Trash2, 
  Settings, 
  Check, 
  ChefHat, 
  CalendarClock, 
  Sliders, 
  Search,
  Filter,
  DollarSign,
  ShieldCheck,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { 
  Order, 
  TableReservation, 
  FoodItem, 
  PaymentGatewaySettings, 
  PaymentMethodType, 
  Language 
} from '../types';
import { translations } from '../i18n/translations';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  onProcessRefund: (orderId: string, reason: string) => void;
  reservations: TableReservation[];
  onUpdateReservationStatus: (id: string, status: TableReservation['status']) => void;
  foodItems: FoodItem[];
  onSaveFoodItems: (items: FoodItem[]) => void;
  gatewaySettings: PaymentGatewaySettings;
  onSaveGatewaySettings: (settings: PaymentGatewaySettings) => void;
  language: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  onProcessRefund,
  reservations,
  onUpdateReservationStatus,
  foodItems,
  onSaveFoodItems,
  gatewaySettings,
  onSaveGatewaySettings,
  language
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  // Tabs: 'analytics' | 'orders' | 'menu' | 'reservations' | 'gateways'
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'menu' | 'reservations' | 'gateways'>('analytics');

  // Refund modal state
  const [refundOrderId, setRefundOrderId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState('');

  // Add/Edit food item state
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);

  // Financial calculations
  const totalRevenue = (orders || []).reduce((sum, o) => sum + (o?.total || 0), 0);
  const onlinePaymentsTotal = (orders || [])
    .filter(o => ['bkash', 'nagad', 'rocket', 'upay', 'tap', 'card', 'sslcommerz'].includes(o?.paymentMethod) && o?.paymentStatus === 'success')
    .reduce((sum, o) => sum + (o?.total || 0), 0);

  const codPaymentsTotal = (orders || [])
    .filter(o => o?.paymentMethod === 'cod')
    .reduce((sum, o) => sum + (o?.total || 0), 0);

  const pendingPayments = (orders || [])
    .filter(o => o?.paymentStatus === 'pending')
    .reduce((sum, o) => sum + (o?.total || 0), 0);

  const refundedPayments = (orders || [])
    .filter(o => o?.paymentStatus === 'refunded')
    .reduce((sum, o) => sum + (o?.total || 0), 0);

  // Method statistics breakdown
  const methodStats: Record<string, { count: number; total: number }> = {};
  (orders || []).forEach(o => {
    if (!o?.paymentMethod) return;
    if (!methodStats[o.paymentMethod]) {
      methodStats[o.paymentMethod] = { count: 0, total: 0 };
    }
    methodStats[o.paymentMethod].count += 1;
    methodStats[o.paymentMethod].total += (o.total || 0);
  });

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Items Count', 'Subtotal', 'Delivery Fee', 'Total', 'Payment Method', 'Payment Status', 'TrxID'];
    const rows = (orders || []).map(o => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customerName}"`,
      o.customerPhone,
      (o.items || []).reduce((s, i) => s + (i?.quantity || 0), 0),
      o.subtotal,
      o.deliveryFee,
      o.total,
      o.paymentMethod,
      o.paymentStatus,
      o.trxId || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dhanshiri_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle payment method
  const handleTogglePaymentMethod = (method: PaymentMethodType) => {
    const updated = {
      ...gatewaySettings,
      enabledMethods: {
        ...gatewaySettings.enabledMethods,
        [method]: !gatewaySettings.enabledMethods[method]
      }
    };
    onSaveGatewaySettings(updated);
  };

  // Toggle food availability
  const handleToggleAvailability = (itemId: string) => {
    const updated = foodItems.map(item => 
      item.id === itemId ? { ...item, available: !item.available } : item
    );
    onSaveFoodItems(updated);
  };

  // Save new/edited food item
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (foodItems.some(i => i.id === editingItem.id)) {
      // Edit
      onSaveFoodItems(foodItems.map(i => i.id === editingItem.id ? editingItem : i));
    } else {
      // Add new
      onSaveFoodItems([editingItem, ...foodItems]);
    }
    setShowItemModal(false);
    setEditingItem(null);
  };

  const handleExecuteRefund = () => {
    if (!refundOrderId || !refundReason.trim()) return;
    onProcessRefund(refundOrderId, refundReason);
    setRefundOrderId(null);
    setRefundReason('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden my-4 border border-stone-200 flex flex-col max-h-[92vh]">
          
          {/* Admin Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-stone-900 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold">
                  {t.adminTitle}
                </h2>
                <p className="text-xs text-stone-400">
                  {t.adminSubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="admin-export-csv-btn"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-400/20 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.exportReport}</span>
              </button>

              <button
                id="close-admin-dashboard-btn"
                onClick={onClose}
                className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-200 bg-stone-50 px-4 sm:px-6 overflow-x-auto shrink-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'analytics' ? 'border-amber-600 text-amber-700' : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>{language === 'bn' ? 'আর্থিক হিসাব ও গেটওয়ে মেট্রিক্স' : 'Financial Analytics & MFS'}</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'orders' ? 'border-amber-600 text-amber-700' : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>{t.ordersManagement} ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'menu' ? 'border-amber-600 text-amber-700' : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>{t.menuManagement} ({foodItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'reservations' ? 'border-amber-600 text-amber-700' : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <CalendarClock className="w-4 h-4" />
              <span>{t.reservationsManagement} ({reservations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('gateways')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'gateways' ? 'border-amber-600 text-amber-700' : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>{t.paymentSettings}</span>
            </button>
          </div>

          {/* Tab 1: Financial Analytics & Payment Methods breakdown */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* 5 KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">
                      {t.totalRevenue}
                    </span>
                    <span className="text-2xl font-black font-mono">৳{totalRevenue}</span>
                    <span className="text-[10px] text-stone-400 block">{orders.length} orders total</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#E2136E] block">
                      {t.onlinePaymentsTotal}
                    </span>
                    <span className="text-xl font-extrabold text-stone-900 font-mono">৳{onlinePaymentsTotal}</span>
                    <span className="text-[10px] text-stone-500 block">bKash, Nagad, Cards</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                      {t.codPaymentsTotal}
                    </span>
                    <span className="text-xl font-extrabold text-stone-900 font-mono">৳{codPaymentsTotal}</span>
                    <span className="text-[10px] text-stone-500 block">Cash on Delivery</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">
                      {t.pendingPayments}
                    </span>
                    <span className="text-xl font-extrabold text-stone-900 font-mono">৳{pendingPayments}</span>
                    <span className="text-[10px] text-stone-500 block">Awaiting delivery</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-red-700 block">
                      {t.refundedPayments}
                    </span>
                    <span className="text-xl font-extrabold text-stone-900 font-mono">৳{refundedPayments}</span>
                    <span className="text-[10px] text-stone-500 block">Processed refunds</span>
                  </div>
                </div>

                {/* MFS & Card Method Distribution Table */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    {language === 'bn' ? 'পেমেন্ট মাধ্যমভিত্তিক পরিসংখ্যান' : 'Payment Method Breakdown & Statistics'}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['bkash', 'nagad', 'rocket', 'card', 'cod', 'pay_at_restaurant'].map((m) => {
                      const stats = methodStats[m] || { count: 0, total: 0 };
                      return (
                        <div key={m} className="p-3 bg-white rounded-xl border border-stone-200">
                          <span className="text-xs font-bold uppercase block text-stone-700">{m}</span>
                          <span className="text-lg font-black font-mono text-stone-900">৳{stats.total}</span>
                          <span className="text-[10px] text-stone-400 block">{stats.count} transactions</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Transactions List with TrxID */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    {language === 'bn' ? 'সাম্প্রতিক লেনদেন ইতিহাস' : 'Recent Transaction Log'}
                  </h3>

                  <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-100 bg-white">
                    {orders.map((order) => (
                      <div key={order.id} className="p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900">{order.customerName}</span>
                            <span className="font-mono bg-stone-100 px-1.5 py-0.2 rounded font-bold text-[11px]">
                              #{order.orderNumber}
                            </span>
                            <span className="uppercase font-bold text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                              {order.paymentMethod}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-400">
                            {new Date(order.createdAt).toLocaleString()} • {order.customerPhone}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {order.trxId && (
                            <span className="font-mono text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-bold">
                              TrxID: {order.trxId}
                            </span>
                          )}

                          <span className="font-mono font-extrabold text-sm text-stone-950">
                            ৳{order.total}
                          </span>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            order.paymentStatus === 'success' ? 'bg-emerald-100 text-emerald-800' :
                            order.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {order.paymentStatus}
                          </span>

                          {order.paymentStatus === 'success' && (
                            <button
                              onClick={() => {
                                setRefundOrderId(order.id);
                                setRefundReason('');
                              }}
                              className="text-[11px] font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              {t.processRefund}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Orders Kitchen Management */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    {language === 'bn' ? 'অর্ডার প্রসেসিং ও রাইডার ডিসপ্যাচ' : 'Order Kitchen & Dispatch Status'}
                  </h3>
                </div>

                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 rounded-2xl border border-stone-200 bg-white space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-sm">{order.customerName}</span>
                            <span className="font-mono font-bold bg-stone-100 px-2 py-0.5 rounded text-xs">
                              #{order.orderNumber}
                            </span>
                            <span className="text-xs text-stone-500 font-mono">{order.customerPhone}</span>
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {order.deliveryAddress.streetAddress}, {order.deliveryZone.name_bn}
                          </p>
                        </div>

                        {/* Status change dropdown */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-stone-500 font-medium">
                            {t.updateStatus}:
                          </label>
                          <select
                            value={order.orderStatus}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['orderStatus'])}
                            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                          >
                            <option value="received">{t.statusReceived}</option>
                            <option value="preparing">{t.statusPreparing}</option>
                            <option value="on_the_way">{t.statusOnTheWay}</option>
                            <option value="delivered">{t.statusDelivered}</option>
                            <option value="cancelled">{t.statusCancelled}</option>
                          </select>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="bg-stone-50 p-3 rounded-xl space-y-1 text-xs text-stone-700">
                        {order.items.map((it, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{language === 'bn' ? it.name_bn : it.name_en} × {it.quantity}</span>
                            <span className="font-mono font-semibold">৳{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1">
                        <span className="text-stone-500">
                          {language === 'bn' ? 'পেমেন্ট:' : 'Payment:'} <strong className="uppercase">{order.paymentMethod}</strong> ({order.paymentStatus})
                        </span>
                        <span className="text-sm font-extrabold font-mono text-stone-900">
                          ৳{order.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Menu Catalog Management */}
            {activeTab === 'menu' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      {language === 'bn' ? 'মেনু আইটেম ও মূল্য নিয়ন্ত্রণ' : 'Food Catalog & Pricing'}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {language === 'bn' ? 'খাবারের মূল্য, প্রাপ্যতা বা নতুন পদ যোগ করুন' : 'Update prices, stock status or add new dishes'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingItem({
                        id: `item-${Date.now()}`,
                        name_bn: '',
                        name_en: '',
                        description_bn: '',
                        description_en: '',
                        price: 350,
                        categoryId: 'cat-biryani',
                        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
                        rating: 5.0,
                        reviewsCount: 1,
                        isVeg: false,
                        spiceLevel: 1,
                        prepTimeMinutes: 20,
                        calories: 500,
                        available: true,
                        tags: ['Special']
                      });
                      setShowItemModal(true);
                    }}
                    className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.addNewDish}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {foodItems.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-2xl border border-stone-200 bg-white flex items-start gap-3">
                      <img
                        src={item.image}
                        alt={item.name_en}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-stone-900 truncate">
                            {language === 'bn' ? item.name_bn : item.name_en}
                          </h4>
                        </div>
                        <span className="text-xs font-extrabold text-stone-900 font-mono block mt-1">
                          ৳{item.price}
                        </span>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                          <button
                            onClick={() => handleToggleAvailability(item.id)}
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md cursor-pointer ${
                              item.available ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.available ? (language === 'bn' ? 'স্টকে আছে' : 'Available') : (language === 'bn' ? 'স্টক শেষ' : 'Unavailable')}
                          </button>

                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setShowItemModal(true);
                            }}
                            className="text-[11px] text-amber-700 font-bold hover:underline cursor-pointer"
                          >
                            {t.editDish}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Table Reservations */}
            {activeTab === 'reservations' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    {language === 'bn' ? 'গ্রাহকদের টেবিল বুকিং রিকোয়েস্ট' : 'Guest Table Reservations'}
                  </h3>
                </div>

                <div className="space-y-3">
                  {reservations.map((res) => (
                    <div key={res.id} className="p-4 rounded-2xl border border-stone-200 bg-white flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-stone-900">{res.customerName}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            res.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {res.status}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          📅 {res.date} • ⏰ {res.time} • 👥 {res.guests} {language === 'bn' ? 'জন অতিথি' : 'Guests'} • 📍 {res.seatingArea}
                        </p>
                        <p className="text-xs text-stone-600 font-mono mt-0.5">
                          📞 {res.phone} {res.email && `• ✉️ ${res.email}`}
                        </p>
                        {res.specialRequests && (
                          <p className="text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded-lg mt-1.5 inline-block">
                            "{res.specialRequests}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {res.status === 'pending' && (
                          <button
                            onClick={() => onUpdateReservationStatus(res.id, 'confirmed')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            {language === 'bn' ? 'কনফার্ম করুন' : 'Confirm'}
                          </button>
                        )}
                        {res.status !== 'cancelled' && (
                          <button
                            onClick={() => onUpdateReservationStatus(res.id, 'cancelled')}
                            className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            {language === 'bn' ? 'বাতিল করুন' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Payment Gateways Settings & Credentials */}
            {activeTab === 'gateways' && (
              <div className="space-y-6">
                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                    {language === 'bn' ? 'বাংলাদেশি পেমেন্ট মেথড সুইচ' : 'Bangladeshi Payment Methods Switcher'}
                  </h3>
                  <p className="text-xs text-stone-600">
                    {language === 'bn' ? 'যেসব পেমেন্ট মেথড সক্রিয় রাখবেন শুধুমাত্র সেগুলোই চেকআউটে গ্রাহক দেখতে পাবেন।' : 'Only enabled payment methods will be displayed to customers during checkout.'}
                  </p>
                </div>

                {/* Payment Methods Toggles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { id: 'bkash', name: 'bKash (বিকাশ)', color: 'text-[#E2136E]' },
                    { id: 'nagad', name: 'Nagad (নগদ)', color: 'text-[#F7941D]' },
                    { id: 'rocket', name: 'Rocket (রকেট)', color: 'text-[#8C3494]' },
                    { id: 'upay', name: 'Upay (উপায়)', color: 'text-[#005BAB]' },
                    { id: 'tap', name: 'Tap (ট্যাপ)', color: 'text-[#00A859]' },
                    { id: 'card', name: 'Card Payments (Visa/Mastercard)', color: 'text-stone-900' },
                    { id: 'cod', name: 'Cash on Delivery (ক্যাশ অন ডেলিভারি)', color: 'text-emerald-700' },
                    { id: 'pay_at_restaurant', name: 'Pay at Restaurant (রেস্টুরেন্টে পেমেন্ট)', color: 'text-stone-700' },
                  ].map((m) => {
                    const isEnabled = gatewaySettings.enabledMethods[m.id as PaymentMethodType];
                    return (
                      <div
                        key={m.id}
                        className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3"
                      >
                        <div>
                          <span className={`text-xs font-bold ${m.color}`}>{m.name}</span>
                          <span className="text-[10px] text-stone-400 block">
                            {isEnabled ? (language === 'bn' ? 'গ্রাহকের জন্য দৃশ্যমান' : 'Active on Checkout') : (language === 'bn' ? 'নিষ্ক্রিয় করা আছে' : 'Disabled')}
                          </span>
                        </div>

                        <button
                          onClick={() => handleTogglePaymentMethod(m.id as PaymentMethodType)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isEnabled ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                          }`}
                        >
                          {isEnabled ? t.enableMethod : t.disableMethod}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* COD Constraints Configuration */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    {language === 'bn' ? 'ক্যাশ অন ডেলিভারি (COD) সীমা ও শর্ত' : 'Cash on Delivery Limits'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        {language === 'bn' ? 'সর্বনিম্ন অর্ডার সীমা (টাকা)' : 'Minimum COD Amount (BDT)'}
                      </label>
                      <input
                        type="number"
                        value={gatewaySettings.minCodAmount}
                        onChange={(e) => onSaveGatewaySettings({
                          ...gatewaySettings,
                          minCodAmount: Number(e.target.value)
                        })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        {language === 'bn' ? 'সর্বোচ্চ অনুমোদিত সীমা (টাকা)' : 'Maximum COD Amount (BDT)'}
                      </label>
                      <input
                        type="number"
                        value={gatewaySettings.maxCodAmount}
                        onChange={(e) => onSaveGatewaySettings({
                          ...gatewaySettings,
                          maxCodAmount: Number(e.target.value)
                        })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Gateway Credentials Configuration */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    {language === 'bn' ? 'অনলাইন গেটওয়ে ও মার্চেন্ট ক্রেডেনশিয়ালস' : 'Payment Gateway API Credentials'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Preferred Gateway
                      </label>
                      <select
                        value={gatewaySettings.preferredGateway}
                        onChange={(e) => onSaveGatewaySettings({
                          ...gatewaySettings,
                          preferredGateway: e.target.value as PaymentGatewaySettings['preferredGateway']
                        })}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-hidden"
                      >
                        <option value="SSLCommerz">SSLCommerz</option>
                        <option value="ShurjoPay">ShurjoPay</option>
                        <option value="aamarPay">aamarPay</option>
                        <option value="PortWallet">PortWallet</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        SSLCommerz Store ID
                      </label>
                      <input
                        type="text"
                        value={gatewaySettings.sslczStoreId}
                        onChange={(e) => onSaveGatewaySettings({
                          ...gatewaySettings,
                          sslczStoreId: e.target.value
                        })}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Environment Mode
                      </label>
                      <button
                        onClick={() => onSaveGatewaySettings({
                          ...gatewaySettings,
                          sandboxMode: !gatewaySettings.sandboxMode
                        })}
                        className={`w-full py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                          gatewaySettings.sandboxMode ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {gatewaySettings.sandboxMode ? 'Sandbox (Test Mode)' : 'Production (Live)'}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>

      {/* Process Refund Modal */}
      {refundOrderId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 border border-stone-200 shadow-xl">
            <h3 className="text-sm font-bold text-stone-900">
              {language === 'bn' ? 'রিফান্ড প্রসেস ও কারণ উল্লেখ করুন' : 'Process Refund for Order'}
            </h3>
            <textarea
              rows={3}
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder={language === 'bn' ? 'রিফান্ডের কারণ লিখুন...' : 'Enter refund reason...'}
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRefundOrderId(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleExecuteRefund}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs"
              >
                {t.processRefund}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Food Item Modal */}
      {showItemModal && editingItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 border border-stone-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">
                {language === 'bn' ? 'খাবার আইটেম তৈরি / সম্পাদনা' : 'Create / Edit Food Item'}
              </h3>
              <button onClick={() => setShowItemModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                  বাংলা নাম (Bangla Name)
                </label>
                <input
                  type="text"
                  value={editingItem.name_bn}
                  onChange={(e) => setEditingItem({ ...editingItem, name_bn: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                  ইংরেজি নাম (English Name)
                </label>
                <input
                  type="text"
                  value={editingItem.name_en}
                  onChange={(e) => setEditingItem({ ...editingItem, name_en: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    মূল্য ৳ (Price in BDT)
                  </label>
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    ক্যালোরি (Calories)
                  </label>
                  <input
                    type="number"
                    value={editingItem.calories}
                    onChange={(e) => setEditingItem({ ...editingItem, calories: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                  ছবির লিংক (Image URL)
                </label>
                <input
                  type="url"
                  value={editingItem.image}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                >
                  {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
