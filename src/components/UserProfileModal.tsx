import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  ShieldCheck, 
  Trash2, 
  Save, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { UserProfile, DeliveryAddress, Language } from '../types';
import { translations } from '../i18n/translations';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onOpenPolicy: (type: 'privacy' | 'terms') => void;
  language: Language;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onOpenPolicy,
  language
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      phone,
      email
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-stone-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  {t.myProfile}
                </h2>
                <span className="text-xs text-stone-500 font-mono">
                  {user.phone}
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

          <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Loyalty Points Card */}
            <div className="p-4 bg-amber-500 text-stone-950 rounded-2xl shadow-md flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-950 block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ধানসিঁড়ি লয়্যালটি ক্লাব' : 'Dhanshiri Royal Rewards'}</span>
                </span>
                <span className="text-2xl font-black font-mono">
                  {user.loyaltyPoints} <span className="text-xs font-semibold">{language === 'bn' ? 'পয়েন্ট' : 'pts'}</span>
                </span>
                <p className="text-[10px] text-amber-950 font-medium">
                  {language === 'bn' ? '১০০ পয়েন্ট = ৳৫০ সমপরিমাণ ছাড়!' : '100 points = ৳50 off next meal'}
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-amber-600/30 border border-amber-400/40 flex items-center justify-center text-amber-950">
                <Award className="w-7 h-7" />
              </div>
            </div>

            {/* Edit Profile Form */}
            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                  {t.fullName}
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                  {t.phoneNumber}
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                  {t.emailOptional}
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              {savedSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'bn' ? 'তথ্য সফলভাবে সংরক্ষিত হয়েছে!' : 'Profile updated successfully!'}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'প্রোফাইল আপডেট করুন' : 'Update Profile'}</span>
              </button>
            </form>

            {/* Privacy and Security Links */}
            <div className="pt-2 border-t border-stone-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                {language === 'bn' ? 'নিরাপত্তা ও ডেটা নিয়ন্ত্রণ' : 'Security & Data Management'}
              </span>

              <div className="flex flex-col gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPolicy('privacy');
                  }}
                  className="flex items-center justify-between p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl text-stone-700 text-left transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{t.privacyPolicy}</span>
                  </span>
                  <span className="text-stone-400 text-[11px]">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPolicy('terms');
                  }}
                  className="flex items-center justify-between p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl text-stone-700 text-left transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-stone-500" />
                    <span>{t.termsConditions}</span>
                  </span>
                  <span className="text-stone-400 text-[11px]">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPolicy('privacy');
                  }}
                  className="flex items-center justify-between p-2.5 bg-red-50 hover:bg-red-100 rounded-xl text-red-700 text-left transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span className="font-semibold">{t.deleteAccount}</span>
                  </span>
                  <span className="text-red-400 text-[11px]">→</span>
                </button>
              </div>
            </div>

          </div>

          <div className="p-3.5 bg-stone-50 border-t border-stone-200 text-center text-[11px] text-stone-500">
            🔒 {language === 'bn' ? 'গ্রাহকের তথ্য সর্বোচ্চ সতর্কতায় সুরক্ষিত' : 'Customer information strictly protected'}
          </div>

        </div>
      </div>
    </div>
  );
};
