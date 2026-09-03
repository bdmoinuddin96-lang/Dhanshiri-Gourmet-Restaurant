import React, { useState } from 'react';
import { 
  Sparkles, 
  CalendarClock, 
  Utensils, 
  Percent, 
  Check, 
  Copy, 
  ShieldCheck, 
  Bike,
  Award
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface HeroBannerProps {
  language: Language;
  onOrderNowClick: () => void;
  onBookTableClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  language,
  onOrderNowClick,
  onBookTableClick
}) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('DHAKA100');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1C1917] text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-amber-900/30">
      {/* Subtle traditional Islamic/Bangla geometric motif background overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Text & Call to Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? 'শতভাগ হালাল ও খাঁটি গাওয়ালী স্বাদ' : '100% Halal & Pure Desi Heritage Ingredients'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-['Hind_Siliguri','Outfit',sans-serif]">
              {t.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-stone-300 max-w-xl leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-order-now-btn"
                onClick={onOrderNowClick}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5 cursor-pointer text-sm sm:text-base"
              >
                <Utensils className="w-4 h-4" />
                <span>{t.orderNow}</span>
              </button>

              <button
                id="hero-book-table-btn"
                onClick={onBookTableClick}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3.5 rounded-xl border border-white/15 backdrop-blur-xs transition-all hover:-translate-y-0.5 cursor-pointer text-sm sm:text-base"
              >
                <CalendarClock className="w-4 h-4 text-amber-300" />
                <span>{t.bookTable}</span>
              </button>
            </div>

            {/* Feature Highlights Pills */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-800 text-stone-300 text-xs">
              <div className="flex items-center gap-2">
                <Bike className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === 'bn' ? '৩০ মিনিটে দ্রুত ডেলিভারি' : '30-min Hot Delivery'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === 'bn' ? 'বিকাশ ও নগদ পেমেন্ট' : 'bKash & Nagad Ready'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === 'bn' ? '৪.৯ স্টার রেটিং' : '4.9★ Customer Rating'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Promotional Voucher Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-stone-800/90 to-stone-900/90 border border-amber-500/30 p-6 shadow-2xl backdrop-blur-md">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                {language === 'bn' ? 'স্পেশাল অফার' : 'Limited Offer'}
              </div>

              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Percent className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-snug">
                    {t.discountBannerTitle}
                  </h2>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                    {t.discountBannerSubtitle}
                  </p>
                </div>
              </div>

              {/* Promo code box */}
              <div className="bg-stone-950/80 rounded-xl p-3 border border-stone-700 flex items-center justify-between gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 uppercase tracking-wider font-medium">
                    {language === 'bn' ? 'কুপন কোড:' : 'Promo:'}
                  </span>
                  <span className="font-mono text-base font-extrabold text-amber-400 tracking-wider">
                    DHAKA100
                  </span>
                </div>

                <button
                  id="copy-hero-coupon-btn"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-stone-950" />
                      <span>{t.codeCopied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.copyCode}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Supported payment badges in hero */}
              <div className="mt-5 pt-4 border-t border-stone-800">
                <p className="text-[11px] text-stone-400 mb-2">
                  {language === 'bn' ? 'সমর্থিত পেমেন্ট গেটওয়েসমূহ:' : 'Accepted Payment Gateways:'}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#E2136E]/20 text-[#FF4081] border border-[#E2136E]/40 text-[11px] font-bold">
                    bKash বিকাশ
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#F7941D]/20 text-[#FFA726] border border-[#F7941D]/40 text-[11px] font-bold">
                    Nagad নগদ
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#8C3494]/20 text-[#BA68C8] border border-[#8C3494]/40 text-[11px] font-bold">
                    Rocket রকেট
                  </span>
                  <span className="px-2.5 py-1 rounded bg-stone-700/80 text-stone-200 border border-stone-600 text-[11px] font-medium">
                    Visa / Mastercard
                  </span>
                  <span className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[11px] font-medium">
                    Cash on Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
