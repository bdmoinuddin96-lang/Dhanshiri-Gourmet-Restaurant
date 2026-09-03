import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Lock, 
  Trash2, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
  language: Language;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  type,
  language
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'policy' | 'deletion'>(type === 'privacy' ? 'policy' : 'policy');
  const [deletionEmail, setDeletionEmail] = useState('');
  const [deletionSuccess, setDeletionSuccess] = useState(false);

  const handleDeleteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletionEmail) return;
    setDeletionSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-stone-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                {type === 'privacy' ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900">
                  {type === 'privacy' ? t.privacyPolicy : t.termsConditions}
                </h2>
                <span className="text-xs text-stone-500">
                  {language === 'bn' ? 'ধানসিঁড়ি কিচেন নিরাপত্তা ও নীতিমালা' : 'Dhanshiri Kitchen Security & Compliance'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation */}
          {type === 'privacy' && (
            <div className="flex border-b border-stone-200 bg-stone-100/50 px-4">
              <button
                onClick={() => setActiveTab('policy')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'policy' ? 'border-amber-600 text-amber-700' : 'border-transparent text-stone-500'
                }`}
              >
                {language === 'bn' ? 'গোপনীয়তা নীতিমালা' : 'Privacy Policy'}
              </button>
              <button
                onClick={() => setActiveTab('deletion')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center gap-1 ${
                  activeTab === 'deletion' ? 'border-red-600 text-red-700' : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'অ্যাকাউন্ট মুছে ফেলার আবেদন' : 'Request Account Deletion'}</span>
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-stone-600 leading-relaxed">
            {activeTab === 'deletion' ? (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-900">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs">
                      {language === 'bn' ? 'স্থায়ীভাবে অ্যাকাউন্ট ও ডেটা অপসারণ' : 'Permanent Account & Data Erasure'}
                    </h4>
                    <p className="text-[11px] text-red-700">
                      {language === 'bn' 
                        ? 'আপনার অ্যাকাউন্ট মুছে ফেলা হলে অর্ডার হিস্ট্রি, লয়্যালটি পয়েন্ট এবং সংরক্ষিত ঠিকানা স্থায়ীভাবে মুছে ফেলা হবে।' 
                        : 'Deleting your account permanently removes your order history, loyalty balance, and stored addresses.'}
                    </p>
                  </div>
                </div>

                {deletionSuccess ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="text-sm font-bold text-emerald-900">
                      {language === 'bn' ? 'অনুরোধ সফলভাবে গৃহীত হয়েছে' : 'Request Received Successfully'}
                    </h4>
                    <p className="text-xs text-emerald-700">
                      {language === 'bn' 
                        ? '২৪ ঘণ্টার মধ্যে আপনার সকল ব্যক্তিগত তথ্য সার্ভার থেকে অপসারণ করা হবে।' 
                        : 'Your data will be completely purged within 24 hours.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleDeleteRequest} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                        {language === 'bn' ? 'আপনার নিবন্ধিত ইমেইল বা মোবাইল নম্বর লিখুন:' : 'Enter your registered email or phone:'}
                      </label>
                      <input
                        type="text"
                        value={deletionEmail}
                        onChange={(e) => setDeletionEmail(e.target.value)}
                        placeholder="customer@example.com"
                        required
                        className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                    >
                      {language === 'bn' ? 'অ্যাকাউন্ট ডিলিট অনুরোধ জমা দিন' : 'Submit Deletion Request'}
                    </button>
                  </form>
                )}
              </div>
            ) : type === 'privacy' ? (
              <div className="space-y-4">
                <section className="space-y-1.5">
                  <h3 className="font-bold text-sm text-stone-900">
                    {language === 'bn' ? '১. সংগৃহীত তথ্যের ন্যূনতম নীতিমালা' : '1. Minimal Data Collection Principle'}
                  </h3>
                  <p>
                    {language === 'bn'
                      ? 'ধানসিঁড়ি কিচেন শুধুমাত্র খাবার ডেলিভারি ও অর্ডার যাচাইকরণের জন্য প্রয়োজনীয় ন্যূনতম তথ্য (নাম, ডেলিভারি ঠিকানা ও ফোন নম্বর) সংগ্রহ করে। আমরা অপ্রয়োজনীয় কোনো ব্যক্তিগত ডেটা জমা রাখি না।'
                      : 'Dhanshiri Kitchen only collects minimal personal data strictly necessary for order fulfillment and delivery (name, delivery address, and contact number). We never collect redundant personal data.'}
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h3 className="font-bold text-sm text-stone-900">
                    {language === 'bn' ? '২. পেমেন্ট ও কার্ড তথ্যের নিরাপত্তা' : '2. Secure Payment Architecture'}
                  </h3>
                  <p>
                    {language === 'bn'
                      ? 'আমরা কখনোই গ্রাহকের ব্যাংকিং পাসওয়ার্ড, ওয়ালেট পিন বা কার্ডের পূর্ণ নম্বর আমাদের সার্ভারে সংরক্ষণ করি না। সকল অনলাইন পেমেন্ট বিকাশ, নগদ এবং SSLCommerz-এর অফিসিয়াল এনক্রিপ্টেড পেমেন্ট গেটওয়ের মাধ্যমে সুরক্ষিতভাবে পরিচালিত হয়।'
                      : 'We NEVER store your raw card numbers, CVV codes, or mobile wallet secret PINs on our servers. All transactions are routed directly through official bank-grade 256-bit encrypted gateways (bKash, Nagad, SSLCommerz).'}
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h3 className="font-bold text-sm text-stone-900">
                    {language === 'bn' ? '৩. তথ্য সুরক্ষার নিশ্চয়তা' : '3. Confidentiality Guarantee'}
                  </h3>
                  <p>
                    {language === 'bn'
                      ? 'কোনো অবস্থাতেই গ্রাহকের ফোন নম্বর বা ঠিকানা তৃতীয় পক্ষের কাছে বিপণন বা বিজ্ঞাপনের উদ্দেশ্যে বিক্রি বা প্রকাশ করা হয় না।'
                      : 'Under no circumstances will customer contact details or addresses be sold, rented, or exposed to third parties for marketing purposes.'}
                  </p>
                </section>
              </div>
            ) : (
              <div className="space-y-4">
                <section className="space-y-1.5">
                  <h3 className="font-bold text-sm text-stone-900">
                    {language === 'bn' ? '১. অর্ডার ও ডেলিভারি শর্তাবলী' : '1. Order Acceptance & Delivery'}
                  </h3>
                  <p>
                    {language === 'bn'
                      ? 'অর্ডার প্লেস করার পর কিচেন গ্রহণ সাপেক্ষে খাবার রান্না শুরু হয়। ঢাকা শহরের যানজট ও আবহাওয়া পরিস্থিতির ওপর ভিত্তি করে ডেলিভারির আনুমানিক সময় ১০-১৫ মিনিট এদিক-সেদিক হতে পারে।'
                      : 'Preparation begins immediately upon kitchen receipt. Estimated delivery times are subject to Dhaka traffic and adverse weather conditions.'}
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h3 className="font-bold text-sm text-stone-900">
                    {language === 'bn' ? '২. ক্যাশ অন ডেলিভারি (COD) নীতি' : '2. Cash on Delivery Terms'}
                  </h3>
                  <p>
                    {language === 'bn'
                      ? 'ক্যাশ অন ডেলিভারি অর্ডারে রাইডার পৌঁছানোর পর নগদ টাকায় সঠিক মূল্য পরিশোধ সাপেক্ষে খাবার হস্তান্তর করা হবে।'
                      : 'For Cash on Delivery orders, full payment must be handed to our courier partner upon food package handover.'}
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h3 className="font-bold text-sm text-stone-900">
                    {language === 'bn' ? '৩. বাতিল ও রিফান্ড নীতি' : '3. Cancellation & Refund Policy'}
                  </h3>
                  <p>
                    {language === 'bn'
                      ? 'অর্ডার গ্রহণের ৫ মিনিটের মধ্যে কোনো ত্রুটি থাকলে তা ক্যানসেল করা যাবে। অনলাইন পেমেন্ট করা থাকলে রিফান্ড সংশ্লিষ্ট বিকাশ/নগদ/ব্যাংক ওয়ালেটে ৩ কার্যদিবসের মধ্যে সমন্বয় করা হবে।'
                      : 'Orders may be cancelled within 5 minutes of placement. For online transactions, verified refunds are credited back to the original source wallet within 3 business days.'}
                  </p>
                </section>
              </div>
            )}
          </div>

          <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {language === 'bn' ? 'বুঝেছি' : 'Close'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
