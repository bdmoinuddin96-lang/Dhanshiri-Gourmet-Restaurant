import React from 'react';
import { X, Bell, CheckCheck, Sparkles, Tag, ShoppingBag, Info } from 'lucide-react';
import { NotificationItem, Language } from '../types';
import { translations } from '../i18n/translations';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  language: Language;
  onSelectOrder?: (orderId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  language,
  onSelectOrder
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-5 h-5 text-amber-600" />;
      case 'discount':
        return <Tag className="w-5 h-5 text-emerald-600" />;
      case 'new_item':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="notification-drawer-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 id="notification-drawer-title" className="text-base font-bold text-stone-900">
                  {t.notifications}
                </h2>
                <p className="text-xs text-stone-500">
                  {unreadCount > 0 
                    ? (language === 'bn' ? `${unreadCount}টি নতুন নোটিফিকেশন` : `${unreadCount} unread notifications`)
                    : (language === 'bn' ? 'সব নোটিফিকেশন পড়া হয়েছে' : 'All caught up')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  id="mark-all-notifications-read-btn"
                  onClick={onMarkAllAsRead}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-lg transition-colors"
                  title={language === 'bn' ? 'সব পড়া হয়েছে মার্ক করুন' : 'Mark all as read'}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'পড়া হয়েছে' : 'Mark read'}</span>
                </button>
              )}
              <button
                id="close-notifications-btn"
                onClick={onClose}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                aria-label="Close notifications"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-2">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-6 text-stone-400">
                <Bell className="w-12 h-12 stroke-1 mb-2 text-stone-300" />
                <p className="text-sm font-medium">
                  {language === 'bn' ? 'কোনো নোটিফিকেশন নেই' : 'No notifications yet'}
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const title = language === 'bn' ? item.title_bn : item.title_en;
                const message = language === 'bn' ? item.message_bn : item.message_en;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl mb-1 transition-all ${
                      item.read 
                        ? 'bg-transparent opacity-80 hover:bg-stone-50' 
                        : 'bg-amber-50/60 border border-amber-100/80 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center shrink-0 mt-0.5">
                        {getIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h4 className="text-xs font-bold text-stone-900 truncate">
                            {title}
                          </h4>
                          <span className="text-[10px] text-stone-400 shrink-0">
                            {item.date}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {message}
                        </p>

                        {item.orderId && onSelectOrder && (
                          <button
                            id={`view-order-notif-${item.id}`}
                            onClick={() => {
                              onSelectOrder(item.orderId!);
                              onClose();
                            }}
                            className="mt-2 text-xs font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-2 flex items-center gap-1"
                          >
                            <span>{language === 'bn' ? 'অর্ডার দেখুন' : 'View Order Details'}</span>
                          </button>
                        )}
                      </div>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
