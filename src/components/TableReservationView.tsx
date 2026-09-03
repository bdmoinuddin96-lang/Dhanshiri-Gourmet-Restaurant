import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Send,
  Building,
  Sunset,
  Shield,
  Trees,
  MapPin,
  Navigation,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TableReservation, Language } from '../types';
import { translations } from '../i18n/translations';
import { GoogleDeliveryMap, RESTAURANT_LOCATION } from './GoogleDeliveryMap';

interface TableReservationViewProps {
  onAddReservation: (res: TableReservation) => void;
  language: Language;
}

export const TableReservationView: React.FC<TableReservationViewProps> = ({
  onAddReservation,
  language
}) => {
  const t = translations[language];

  // Default tomorrow
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [customerName, setCustomerName] = useState('মুহাম্মদ শাকিল');
  const [phone, setPhone] = useState('01715-678901');
  const [email, setEmail] = useState('customer@dhanshirikitchen.com');
  const [date, setDate] = useState(tomorrow);
  const [time, setTime] = useState('20:00');
  const [guests, setGuests] = useState(4);
  const [seatingArea, setSeatingArea] = useState<TableReservation['seatingArea']>('rooftop');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const timeSlots = [
    '12:30', '13:00', '13:30', '14:00', '14:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  const seatingOptions = [
    { id: 'indoor', label_bn: 'শীতাতপ নিয়ন্ত্রিত ইনডোর', label_en: 'AC Indoor Dining', icon: Building, desc: 'শান্ত ও আরামদায়ক পরিবেশ' },
    { id: 'rooftop', label_bn: 'খোলামেলা রুফটপ ভিউ', label_en: 'Panoramic Rooftop', icon: Sunset, desc: 'মনোরম মুক্ত বাতাস ও রাতের শহর' },
    { id: 'private_family', label_bn: 'প্রাইভেট ফ্যামিলি কেবিন', label_en: 'Private Family Cabin', icon: Shield, desc: 'পারিবারিক নির্জনতা ও বিশেষ আতিথেয়তা' },
    { id: 'outdoor_garden', label_bn: 'আউটডোর গার্ডেন এরিয়া', label_en: 'Garden Patio', icon: Trees, desc: 'সবুজ গাছের ছায়ায় আনন্দময় মুহূর্ত' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !date || !time) return;

    const newReservation: TableReservation = {
      id: `res-${Date.now()}`,
      customerName,
      phone,
      email,
      date,
      time,
      guests,
      seatingArea,
      specialRequests,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    onAddReservation(newReservation);
    setIsSuccess(true);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>{language === 'bn' ? 'রাজকীয় ডাইনিং অভিজ্ঞতা' : 'Exquisite Royal Dining Experience'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-['Hind_Siliguri',sans-serif]">
          {t.tableReservationTitle}
        </h1>
        <p className="text-sm text-stone-600 max-w-xl mx-auto">
          {t.tableReservationSubtitle}
        </p>
      </div>

      {isSuccess ? (
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-stone-900 font-['Hind_Siliguri',sans-serif]">
              {t.reservationSuccess}
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              {t.reservationNote}
            </p>
          </div>

          <div className="max-w-md mx-auto bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-stone-500">{t.fullName}:</span>
              <strong className="text-stone-900">{customerName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">{t.selectDate}:</span>
              <strong className="text-stone-900">{date}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">{t.selectTime}:</span>
              <strong className="text-stone-900">{time}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">{t.numberOfGuests}:</span>
              <strong className="text-stone-900">{guests} {language === 'bn' ? 'জন' : 'Guests'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">{t.seatingPreference}:</span>
              <strong className="text-stone-900 capitalize">{seatingArea}</strong>
            </div>
          </div>

          <button
            onClick={() => setIsSuccess(false)}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            {language === 'bn' ? 'নতুন টেবিল বুক করুন' : 'Book Another Table'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xl space-y-6">
          
          {/* Guest Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                {t.fullName} *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                {t.phoneNumber} *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                {t.emailOptional}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          {/* Date & Guests Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
            <div>
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.selectDate} *</span>
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 mb-1.5">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.numberOfGuests} *</span>
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[1, 2, 4, 6, 8, 10, 12, 16].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuests(num)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      guests === num
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Slot Picker */}
          <div className="pt-2 border-t border-stone-100">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.selectTime} *</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    time === slot
                      ? 'bg-stone-900 text-amber-400 shadow-xs'
                      : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Seating Preference Cards */}
          <div className="pt-2 border-t border-stone-100">
            <label className="text-xs font-bold text-stone-700 block mb-2">
              {t.seatingPreference} *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {seatingOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = seatingArea === opt.id;
                const label = language === 'bn' ? opt.label_bn : opt.label_en;

                return (
                  <div
                    key={opt.id}
                    onClick={() => setSeatingArea(opt.id as TableReservation['seatingArea'])}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-600 ring-1 ring-amber-600 shadow-xs'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{label}</h4>
                      <p className="text-[11px] text-stone-500">{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special Requests */}
          <div className="pt-2 border-t border-stone-100">
            <label className="text-xs font-bold text-stone-700 block mb-1.5">
              {t.specialRequests}
            </label>
            <input
              type="text"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: বিবাহবার্ষিকী উদযাপন, টেবিল সাজসজ্জা ইত্যাদি' : 'e.g. Birthday anniversary, high chair needed'}
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm shadow-md shadow-amber-600/20 hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{t.confirmReservation}</span>
          </button>
        </form>
      )}

      {/* Restaurant Location & Directions on Google Maps */}
      <div className="mt-8 bg-white rounded-3xl p-6 border border-stone-200 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-stone-900 font-['Hind_Siliguri',sans-serif]">
                {language === 'bn' ? 'রেস্তোরাঁর গুগল ম্যাপ লোকেশন ও ঠিকানা' : 'Restaurant Google Map Location & Directions'}
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {RESTAURANT_LOCATION.address} • {language === 'bn' ? 'ধানমন্ডি লেকের কাছে' : 'Near Dhanmondi Lake'}
            </p>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=23.7510,90.3750"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'bn' ? 'গুগল ম্যাপে দিকনির্দেশনা' : 'Get Directions'}</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </a>
        </div>

        {/* Embedded Google Map Component */}
        <GoogleDeliveryMap
          center={RESTAURANT_LOCATION}
          zoom={15}
          restaurantPosition={RESTAURANT_LOCATION}
          interactive={true}
          height="280px"
          language={language}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-stone-600">
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-stone-800 block">🚗 Valet & Parking</span>
            <span className="text-[11px] text-stone-500">{language === 'bn' ? 'বেসমেন্ট নিরাপদ পার্কিং সুবিধা' : 'Dedicated basement parking available'}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-stone-800 block">🕒 Dining Hours</span>
            <span className="text-[11px] text-stone-500">{language === 'bn' ? 'সকাল ১১:০০ — রাত ১১:০০' : '11:00 AM — 11:00 PM Everyday'}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-stone-800 block">📍 Landmarks</span>
            <span className="text-[11px] text-stone-500">{language === 'bn' ? 'ধানমন্ডি ২৭, আড়ং ও রাপা প্লাজা সংলগ্ন' : 'Near Aarong & Rapa Plaza, Dhanmondi 27'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
