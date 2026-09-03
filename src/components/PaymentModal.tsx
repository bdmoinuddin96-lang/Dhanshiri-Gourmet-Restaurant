import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  CreditCard,
  Lock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentMethodType, Language } from '../types';
import { translations } from '../i18n/translations';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: PaymentMethodType;
  amount: number;
  orderNumber: string;
  onPaymentSuccess: (trxId: string, gateway: string, account: string) => void;
  onPaymentFailure: (errorMsg: string) => void;
  language: Language;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  method,
  amount,
  orderNumber,
  onPaymentSuccess,
  onPaymentFailure,
  language
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  // Steps: 1 = number/details, 2 = otp, 3 = pin, 4 = verifying, 5 = success, 6 = failure
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [walletNumber, setWalletNumber] = useState('01712-345678');
  const [otp, setOtp] = useState('1971');
  const [pin, setPin] = useState('');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState('MOHAMMAD SHAKIL');
  const [trxId, setTrxId] = useState('');

  // Branding config by method
  const getMethodTheme = () => {
    switch (method) {
      case 'bkash':
        return {
          title: 'bKash বিকাশ পেমেন্ট',
          bgHeader: 'bg-[#E2136E]',
          textHeader: 'text-white',
          buttonClass: 'bg-[#E2136E] hover:bg-[#C2185B] text-white',
          logoText: 'bKash',
          gatewayName: 'bKash Direct Merchant Gateway'
        };
      case 'nagad':
        return {
          title: 'Nagad নগদ পেমেন্ট',
          bgHeader: 'bg-[#F7941D]',
          textHeader: 'text-white',
          buttonClass: 'bg-[#F7941D] hover:bg-[#E65100] text-white',
          logoText: 'Nagad',
          gatewayName: 'Nagad Digital Payments API'
        };
      case 'rocket':
        return {
          title: 'Rocket রকেট পেমেন্ট',
          bgHeader: 'bg-[#8C3494]',
          textHeader: 'text-white',
          buttonClass: 'bg-[#8C3494] hover:bg-[#6A1B9A] text-white',
          logoText: 'Rocket DBBL',
          gatewayName: 'Dutch-Bangla Rocket Gateway'
        };
      case 'upay':
        return {
          title: 'Upay উপায় পেমেন্ট',
          bgHeader: 'bg-[#005BAB]',
          textHeader: 'text-white',
          buttonClass: 'bg-[#005BAB] hover:bg-[#003C8F] text-white',
          logoText: 'Upay',
          gatewayName: 'UCB Upay Payment Gateway'
        };
      case 'tap':
        return {
          title: 'Tap ট্যাপ পেমেন্ট',
          bgHeader: 'bg-[#00A859]',
          textHeader: 'text-white',
          buttonClass: 'bg-[#00A859] hover:bg-[#00703C] text-white',
          logoText: 'Tap Trust Axiata',
          gatewayName: 'Tap MFS Gateway'
        };
      default:
        return {
          title: 'SSLCommerz / Card Payment',
          bgHeader: 'bg-[#1C1917]',
          textHeader: 'text-amber-400',
          buttonClass: 'bg-amber-600 hover:bg-amber-700 text-white',
          logoText: 'SSLCommerz',
          gatewayName: 'SSLCommerz Secure Card Gateway'
        };
    }
  };

  const theme = getMethodTheme();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletNumber.trim()) return;
    setStep(2);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setStep(3);
  };

  const handleProcessPayment = (forceFail: boolean = false) => {
    setStep(4); // Verifying...

    setTimeout(() => {
      if (forceFail) {
        setStep(6); // Failed
        onPaymentFailure(language === 'bn' ? 'পেমেন্ট ব্যর্থ হয়েছে। পর্যাপ্ত ব্যালেন্স বা পিন যাচাই করুন।' : 'Payment Failed. Please verify your balance or PIN.');
      } else {
        const generatedTrxId = `${method.substring(0, 3).toUpperCase()}${Math.floor(100000 + Math.random() * 900000)}`;
        setTrxId(generatedTrxId);
        setStep(5); // Success

        // Trigger confetti celebration!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        setTimeout(() => {
          onPaymentSuccess(generatedTrxId, theme.gatewayName, walletNumber);
        }, 1800);
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-stone-900/75 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (step !== 4) onClose();
        }}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-stone-200">
          
          {/* Branded Header */}
          <div className={`${theme.bgHeader} ${theme.textHeader} p-4 sm:p-5 flex items-center justify-between transition-colors`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-black text-sm">
                {theme.logoText.charAt(0)}
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                  {theme.title}
                </h3>
                <span className="text-[11px] opacity-85 block">
                  {theme.gatewayName}
                </span>
              </div>
            </div>

            {step !== 4 && (
              <button
                id="close-payment-modal-btn"
                onClick={onClose}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Amount and Merchant Bar */}
          <div className="bg-stone-50 border-b border-stone-200 p-3.5 flex items-center justify-between text-xs">
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-semibold">
                {language === 'bn' ? 'মার্চেন্ট নাম' : 'Merchant'}
              </span>
              <span className="font-bold text-stone-900">
                {language === 'bn' ? 'ধানসিঁড়ি কিচেন (Dhanshiri Kitchen)' : 'Dhanshiri Kitchen Restaurant'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-stone-500 block text-[10px] uppercase font-semibold">
                {language === 'bn' ? 'প্রদেয় অর্থ' : 'Amount'}
              </span>
              <span className="text-base font-extrabold text-stone-950 font-mono">
                ৳{amount}
              </span>
            </div>
          </div>

          {/* Body Content by Step */}
          <div className="p-5 sm:p-6 space-y-4">
            
            {/* Step 1: Wallet Number or Card details */}
            {step === 1 && (
              method === 'card' || method === 'sslcommerz' ? (
                <form onSubmit={(e) => { e.preventDefault(); handleProcessPayment(false); }} className="space-y-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span>{language === 'bn' ? 'কার্ডের তথ্য প্রদান করুন' : 'Enter Card Details'}</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      {language === 'bn' ? 'কার্ড নম্বর' : 'Card Number'}
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        {language === 'bn' ? 'মেয়াদ (MM/YY)' : 'Expiry (MM/YY)'}
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      {language === 'bn' ? 'কার্ডধারীর নাম' : 'Cardholder Name'}
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name on card"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl uppercase focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${theme.buttonClass}`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>{t.confirmPayment} (৳{amount})</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1.5">
                      {t.enterMfsNumber}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={walletNumber}
                        onChange={(e) => setWalletNumber(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-stone-500 mt-1 block">
                      {language === 'bn' ? 'আপনার ১১ ডিজিটের ব্যক্তিগত ওয়ালেট নম্বর লিখুন' : 'Enter your 11-digit personal wallet mobile number'}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${theme.buttonClass}`}
                  >
                    <span>{t.sendOtp}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )
            )}

            {/* Step 2: OTP Entry */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center space-y-1">
                  <h4 className="text-xs font-bold text-stone-900">{t.enterOtp}</h4>
                  <p className="text-[11px] text-stone-500">
                    {language === 'bn' ? `একটি ৪ ডিজিটের কোড ${walletNumber} নম্বরে পাঠানো হয়েছে` : `A 4-digit security code was sent to ${walletNumber}`}
                  </p>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full py-2.5 text-center text-lg font-mono font-black tracking-widest bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  required
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'পিছনে' : 'Back'}
                  </button>

                  <button
                    type="submit"
                    className={`flex-2 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${theme.buttonClass}`}
                  >
                    {language === 'bn' ? 'ওটিপি নিশ্চিত করুন' : 'Confirm OTP'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: PIN Entry */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <h4 className="text-xs font-bold text-stone-900">{t.enterPin}</h4>
                  <p className="text-[11px] text-stone-500">
                    {language === 'bn' ? 'পেমেন্ট সম্পন্ন করতে আপনার ওয়ালেট পিন প্রদান করুন' : 'Enter your wallet secret PIN to authorize charge'}
                  </p>
                </div>

                <input
                  type="password"
                  maxLength={5}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="•••••"
                  className="w-full py-2.5 text-center text-xl font-mono font-black tracking-widest bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  required
                />

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleProcessPayment(false)}
                    className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${theme.buttonClass}`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>{t.confirmPayment}</span>
                  </button>

                  {/* Failure simulation button for testing requirements */}
                  <button
                    type="button"
                    onClick={() => handleProcessPayment(true)}
                    className="w-full text-center text-[10px] text-stone-400 hover:text-red-600 transition-colors pt-1 cursor-pointer"
                  >
                    {language === 'bn' ? '(টেস্টিং: ব্যর্থ পেমেন্ট সিমুলেট করুন)' : '(Testing: Simulate Failed Payment)'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Loading state - পেমেন্ট যাচাই করা হচ্ছে */}
            {step === 4 && (
              <div className="py-8 text-center space-y-3">
                <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto" />
                <h4 className="text-base font-bold text-stone-900 font-['Hind_Siliguri',sans-serif]">
                  {t.paymentVerifyingMsg}
                </h4>
                <p className="text-xs text-stone-500">
                  {language === 'bn' 
                    ? 'ব্যাংক ও গেটওয়ের সাথে সংযোগ স্থাপন করা হচ্ছে...' 
                    : 'Connecting to secure banking gateway...'}
                </p>
              </div>
            )}

            {/* Step 5: Success state - পেমেন্ট সফল হয়েছে */}
            {step === 5 && (
              <div className="py-4 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-emerald-800 font-['Hind_Siliguri',sans-serif]">
                  {t.paymentSuccessMsg}
                </h4>
                <p className="text-xs text-stone-600">
                  {language === 'bn' ? 'অর্ডার প্রস্তুতের জন্য কিচেনে পাঠানো হয়েছে!' : 'Order received by the kitchen!'}
                </p>
                <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-mono text-xs text-emerald-950">
                  <span className="text-[10px] text-emerald-700 block uppercase">{t.trxIdLabel}</span>
                  <span className="font-extrabold text-sm">{trxId}</span>
                </div>
              </div>
            )}

            {/* Step 6: Failed state - পেমেন্ট ব্যর্থ হয়েছে */}
            {step === 6 && (
              <div className="py-4 text-center space-y-3">
                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-red-700 font-['Hind_Siliguri',sans-serif]">
                  {t.paymentFailedMsg}
                </h4>
                <p className="text-xs text-stone-600">
                  {language === 'bn' 
                    ? 'দুঃখিত, কোনো সমস্যার কারণে লেনদেন সম্পন্ন হয়নি।' 
                    : 'Transaction could not be processed.'}
                </p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {language === 'bn' ? 'আবার চেষ্টা করুন' : 'Try Again'}
                </button>
              </div>
            )}

          </div>

          {/* Modal Footer Security Note */}
          <div className="p-3 bg-stone-50 border-t border-stone-200 text-center flex items-center justify-center gap-1 text-[11px] text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.simulatedNote}</span>
          </div>

        </div>
      </div>
    </div>
  );
};
