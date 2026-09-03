import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Check, 
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { DeliveryZone, DeliveryAddress, Language } from '../types';
import { INITIAL_DELIVERY_ZONES } from '../data/initialData';
import { translations } from '../i18n/translations';
import { GoogleDeliveryMap } from './GoogleDeliveryMap';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeZone: DeliveryZone;
  onSelectZone: (zone: DeliveryZone) => void;
  savedAddress?: DeliveryAddress;
  onSaveAddress: (address: DeliveryAddress) => void;
  language: Language;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  activeZone,
  onSelectZone,
  savedAddress,
  onSaveAddress,
  language
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const [selectedZoneId, setSelectedZoneId] = useState(activeZone.id);
  const [streetAddress, setStreetAddress] = useState(savedAddress?.streetAddress || 'বাড়ি #১২, রোড #২৭, ধানমন্ডি');
  const [apartmentFloor, setApartmentFloor] = useState(savedAddress?.apartmentFloor || 'ফ্ল্যাট ৪বি');
  const [landmark, setLandmark] = useState(savedAddress?.landmark || 'সোবহানবাগ মসজিদের কাছে');
  const [phone, setPhone] = useState(savedAddress?.phone || '01712-345678');
  const [label, setLabel] = useState(savedAddress?.label || 'Home');

  // Coordinates for the delivery pin
  const currentZone = INITIAL_DELIVERY_ZONES.find(z => z.id === selectedZoneId) || activeZone;
  const [coords, setCoords] = useState({ lat: currentZone.lat, lng: currentZone.lng });

  const handleLocationSelect = (newCoords: { lat: number; lng: number }) => {
    setCoords(newCoords);
    // Determine closest zone for delivery fee calculation
    let minDistance = Infinity;
    let closestZone = currentZone;
    INITIAL_DELIVERY_ZONES.forEach((zone) => {
      const dist = Math.hypot(zone.lat - newCoords.lat, zone.lng - newCoords.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestZone = zone;
      }
    });
    if (closestZone.id !== selectedZoneId) {
      setSelectedZoneId(closestZone.id);
    }
  };

  const handleConfirm = () => {
    const updatedAddress: DeliveryAddress = {
      id: savedAddress?.id || `addr-${Date.now()}`,
      label,
      area: language === 'bn' ? currentZone.name_bn : currentZone.name_en,
      zoneId: currentZone.id,
      streetAddress,
      apartmentFloor,
      landmark,
      phone,
      lat: coords.lat,
      lng: coords.lng
    };

    onSelectZone(currentZone);
    onSaveAddress(updatedAddress);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-stone-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  {language === 'bn' ? 'ডেলিভারি লোকেশন ও জোন নির্বাচন' : 'Select Delivery Location & Zone'}
                </h2>
                <p className="text-xs text-stone-500">
                  {language === 'bn' ? 'ঢাকার প্রধান জোনসমূহে এক্সপ্রেস ডেলিভারি' : 'Express Delivery across primary Dhaka zones'}
                </p>
              </div>
            </div>

            <button
              id="close-location-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Interactive Google Delivery Map of Dhaka */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.chooseFromMap}</span>
                </label>
                <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  GPS: {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
                </span>
              </div>

              {/* Dynamic Google Maps Component */}
              <GoogleDeliveryMap
                center={{ lat: coords.lat, lng: coords.lng }}
                zoom={14}
                markerPosition={coords}
                onLocationSelect={handleLocationSelect}
                height="250px"
                language={language}
                selectedZoneId={selectedZoneId}
                onZoneSelect={(zoneId) => {
                  const z = INITIAL_DELIVERY_ZONES.find(x => x.id === zoneId);
                  if (z) {
                    setSelectedZoneId(zoneId);
                    setCoords({ lat: z.lat, lng: z.lng });
                  }
                }}
              />
            </div>

            {/* Delivery Zone Selection Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.selectDeliveryZone}</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {INITIAL_DELIVERY_ZONES.map((zone) => {
                  const isSelected = zone.id === selectedZoneId;
                  const zoneName = language === 'bn' ? zone.name_bn : zone.name_en;

                  return (
                    <div
                      key={zone.id}
                      onClick={() => {
                        setSelectedZoneId(zone.id);
                        setCoords({ lat: zone.lat, lng: zone.lng });
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-amber-50 border-amber-500 shadow-xs' 
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-stone-900 truncate">
                            {zoneName}
                          </p>
                          <span className="text-[10px] text-stone-500">
                            {language === 'bn' ? `ডেলিভারি: ${zone.estimatedMinutes} মিনিট` : `Est: ${zone.estimatedMinutes} mins`}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-amber-800 font-mono">
                          ৳{zone.baseFee}
                        </span>
                        <span className="text-[10px] text-stone-400 block">
                          {language === 'bn' ? 'চার্জ' : 'fee'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Address Details Form */}
            <div className="space-y-3 pt-2 border-t border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                {language === 'bn' ? 'সুনির্দিষ্ট ঠিকানা বিবরণ' : 'Detailed Address'}
              </h4>

              {/* Label Pills (Home, Office, Other) */}
              <div className="flex items-center gap-2">
                {['Home', 'Office', 'Other'].map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setLabel(lbl)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${
                      label === lbl 
                        ? 'bg-amber-600 text-white border-amber-600' 
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {lbl === 'Home' ? (language === 'bn' ? 'বাসা (Home)' : 'Home') :
                     lbl === 'Office' ? (language === 'bn' ? 'অফিস (Office)' : 'Office') :
                     (language === 'bn' ? 'অন্যান্য (Other)' : 'Other')}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 mb-1 block">
                    {language === 'bn' ? 'রাস্তা ও বাড়ি নম্বর' : 'Street & House Address'}
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder={t.areaPlaceholder}
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 mb-1 block">
                      {language === 'bn' ? 'ফ্ল্যাট / ফ্লোর (ঐচ্ছিক)' : 'Apartment / Floor'}
                    </label>
                    <input
                      type="text"
                      value={apartmentFloor}
                      onChange={(e) => setApartmentFloor(e.target.value)}
                      placeholder="e.g. 4B, 4th Floor"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 mb-1 block">
                      {language === 'bn' ? 'নিকটবর্তী ল্যান্ডমার্ক' : 'Nearby Landmark'}
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder={t.landmarkPlaceholder}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 mb-1 block">
                    {language === 'bn' ? 'যোগাযোগের মোবাইল নম্বর' : 'Contact Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XX-XXXXXX"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {language === 'bn' 
                  ? `ডেলিভারি চার্জ: ৳${currentZone.baseFee}` 
                  : `Delivery Charge: ৳${currentZone.baseFee}`}
              </span>
            </div>

            <button
              id="confirm-location-btn"
              onClick={handleConfirm}
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 hover:shadow-lg transition-all cursor-pointer"
            >
              {language === 'bn' ? 'ঠিকানা সংরক্ষণ করুন' : 'Confirm Address'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
