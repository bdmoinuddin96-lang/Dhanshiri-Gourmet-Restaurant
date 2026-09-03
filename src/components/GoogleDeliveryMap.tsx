import React, { useEffect, useState, useMemo } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow,
  Polyline,
  useMap,
  useApiLoadingStatus,
  APILoadingStatus
} from '@vis.gl/react-google-maps';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Bike, 
  UtensilsCrossed, 
  ExternalLink, 
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Language } from '../types';
import { INITIAL_DELIVERY_ZONES } from '../data/initialData';

// Mandatory attribution ID per Google Maps Platform Code Assist guidelines
const ATTRIBUTION_IDS = ['gmp_mcp_codeassist_v1_aistudio'];

export const RESTAURANT_LOCATION = {
  lat: 23.7510,
  lng: 90.3750,
  name_bn: 'ধানসিঁড়ি কিচেন (প্রধান শাখা)',
  name_en: 'Dhanshiri Kitchen (Flagship Outlet)',
  address: 'রোড ২৭, ধানমন্ডি, ঢাকা ১২০৯'
};

interface GoogleDeliveryMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markerPosition?: { lat: number; lng: number };
  onLocationSelect?: (coords: { lat: number; lng: number }) => void;
  riderPosition?: { lat: number; lng: number };
  restaurantPosition?: { lat: number; lng: number };
  interactive?: boolean;
  height?: string;
  language?: Language;
  showZonesFilter?: boolean;
  selectedZoneId?: string;
  onZoneSelect?: (zoneId: string) => void;
}

// Controller component to smoothly pan/zoom camera when center changes
const MapCameraController: React.FC<{ center: { lat: number; lng: number }; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.panTo(center);
    }
  }, [map, center.lat, center.lng]);

  useEffect(() => {
    if (map && zoom) {
      map.setZoom(zoom);
    }
  }, [map, zoom]);

  return null;
};

// Inner Map Renderer that executes once APIProvider is active
const InnerGoogleMap: React.FC<GoogleDeliveryMapProps & { apiKey: string }> = ({
  center = { lat: 23.7510, lng: 90.3750 },
  zoom = 13,
  markerPosition,
  onLocationSelect,
  riderPosition,
  restaurantPosition = RESTAURANT_LOCATION,
  interactive = true,
  height = '260px',
  language = 'bn',
  showZonesFilter = false,
  selectedZoneId,
  onZoneSelect
}) => {
  const [activeInfoWindow, setActiveInfoWindow] = useState<'restaurant' | 'delivery' | 'rider' | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  // Simulated route coordinates between restaurant, rider, and destination
  const routePath = useMemo(() => {
    if (!markerPosition) return [];
    const points = [restaurantPosition];
    if (riderPosition) {
      points.push(riderPosition);
    }
    points.push(markerPosition);
    return points;
  }, [restaurantPosition, riderPosition, markerPosition]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-300 shadow-inner bg-stone-100" style={{ height }}>
      {/* Google Maps View */}
      <Map
        mapId="DEMO_MAP_ID"
        defaultCenter={center}
        defaultZoom={zoom}
        gestureHandling={interactive ? 'greedy' : 'none'}
        disableDefaultUI={!interactive}
        mapTypeId={mapType}
        style={{ width: '100%', height: '100%' }}
        internalUsageAttributionIds={ATTRIBUTION_IDS}
        onClick={(e) => {
          if (interactive && onLocationSelect && e.detail.latLng) {
            onLocationSelect({
              lat: Number(e.detail.latLng.lat.toFixed(5)),
              lng: Number(e.detail.latLng.lng.toFixed(5))
            });
          }
        }}
      >
        <MapCameraController center={center} zoom={zoom} />

        {/* Restaurant Outlet Marker (Dhanshiri Kitchen) */}
        <AdvancedMarker
          position={restaurantPosition}
          title={language === 'bn' ? RESTAURANT_LOCATION.name_bn : RESTAURANT_LOCATION.name_en}
          onClick={() => setActiveInfoWindow('restaurant')}
        >
          <div className="relative flex items-center justify-center cursor-pointer group">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-lg ring-2 ring-white border border-amber-800 transition-transform group-hover:scale-110">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-5 bg-stone-900/90 text-amber-400 font-bold text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap shadow-xs pointer-events-none">
              {language === 'bn' ? 'ধানসিঁড়ি কিচেন' : 'Dhanshiri Kitchen'}
            </span>
          </div>
        </AdvancedMarker>

        {/* Restaurant Info Window */}
        {activeInfoWindow === 'restaurant' && (
          <InfoWindow
            position={restaurantPosition}
            onCloseClick={() => setActiveInfoWindow(null)}
          >
            <div className="p-1 text-stone-900 font-sans max-w-[200px]">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-800 mb-1">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? RESTAURANT_LOCATION.name_bn : RESTAURANT_LOCATION.name_en}</span>
              </div>
              <p className="text-[11px] text-stone-600 mb-1">{RESTAURANT_LOCATION.address}</p>
              <div className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                {language === 'bn' ? 'খোলা আছে: সকাল ১১:০০ - রাত ১১:০০' : 'Open: 11:00 AM - 11:00 PM'}
              </div>
            </div>
          </InfoWindow>
        )}

        {/* Delivery Destination Marker */}
        {markerPosition && (
          <AdvancedMarker
            position={markerPosition}
            title={language === 'bn' ? 'ডেলিভারি গন্তব্য' : 'Delivery Destination'}
            onClick={() => setActiveInfoWindow('delivery')}
          >
            <Pin
              background="#DC2626"
              glyphColor="#FFFFFF"
              borderColor="#7F1D1D"
              scale={1.2}
            >
              📍
            </Pin>
          </AdvancedMarker>
        )}

        {/* Delivery Destination InfoWindow */}
        {activeInfoWindow === 'delivery' && markerPosition && (
          <InfoWindow
            position={markerPosition}
            onCloseClick={() => setActiveInfoWindow(null)}
          >
            <div className="p-1 text-stone-900 font-sans">
              <span className="font-bold text-xs text-red-600 block mb-0.5">
                {language === 'bn' ? 'আপনার ডেলিভারি গন্তব্য' : 'Delivery Location'}
              </span>
              <p className="text-[11px] text-stone-600 font-mono">
                {markerPosition.lat.toFixed(4)}° N, {markerPosition.lng.toFixed(4)}° E
              </p>
            </div>
          </InfoWindow>
        )}

        {/* Active Delivery Rider Marker (When in transit) */}
        {riderPosition && (
          <AdvancedMarker
            position={riderPosition}
            title={language === 'bn' ? 'রাইডার রফিক মিয়া' : 'Rider Rafiq Mia'}
            onClick={() => setActiveInfoWindow('rider')}
          >
            <div className="relative flex items-center justify-center cursor-pointer animate-pulse">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg ring-3 ring-emerald-300 border-2 border-white">
                <Bike className="w-5 h-5" />
              </div>
              <span className="absolute -top-5 bg-emerald-900 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                {language === 'bn' ? 'রাইডার অন দ্য ওয়ে' : 'Rider On the Way'}
              </span>
            </div>
          </AdvancedMarker>
        )}

        {/* Rider Info Window */}
        {activeInfoWindow === 'rider' && riderPosition && (
          <InfoWindow
            position={riderPosition}
            onCloseClick={() => setActiveInfoWindow(null)}
          >
            <div className="p-1 text-stone-900 font-sans">
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800 mb-0.5">
                <Bike className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'রাইডার রফিক মিয়া' : 'Rider Rafiq Mia'}</span>
              </div>
              <p className="text-[11px] text-stone-600">
                {language === 'bn' ? 'গরম খাবার নিয়ে আপনার দিকে আসছে' : 'Heading towards destination with thermal bag'}
              </p>
            </div>
          </InfoWindow>
        )}

        {/* Connecting Delivery Route Polyline */}
        {routePath.length >= 2 && (
          <Polyline
            path={routePath}
            strokeColor="#D97706"
            strokeOpacity={0.85}
            strokeWeight={4}
          />
        )}
      </Map>

      {/* Floating Control Overlay: Map Type Switcher & Zone Jumpers */}
      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-xl shadow-md border border-stone-200 text-[10px]">
        <button
          type="button"
          onClick={() => setMapType('roadmap')}
          className={`px-2 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
            mapType === 'roadmap' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          {language === 'bn' ? 'ম্যাপ' : 'Map'}
        </button>
        <button
          type="button"
          onClick={() => setMapType('hybrid')}
          className={`px-2 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
            mapType === 'hybrid' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          {language === 'bn' ? 'স্যাটেলাইট' : 'Satellite'}
        </button>
      </div>

      {/* Interactive instruction pill */}
      {interactive && onLocationSelect && (
        <div className="absolute bottom-2.5 left-2.5 z-10 bg-stone-900/85 backdrop-blur-xs text-stone-200 text-[11px] px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1.5 pointer-events-none">
          <Navigation className="w-3 h-3 text-amber-400" />
          <span>
            {language === 'bn' ? 'ম্যাপে ক্লিক করে সঠিক ডেলিভারি পয়েন্ট পিন করুন' : 'Click on map to set delivery pin'}
          </span>
        </div>
      )}
    </div>
  );
};

// Fallback interactive Dhaka vector map when API key is not configured or fails to load
const FallbackDhakaMap: React.FC<GoogleDeliveryMapProps & { statusMessage?: string }> = ({
  center = { lat: 23.7510, lng: 90.3750 },
  markerPosition,
  onLocationSelect,
  riderPosition,
  restaurantPosition = RESTAURANT_LOCATION,
  interactive = true,
  height = '260px',
  language = 'bn',
  showZonesFilter = false,
  selectedZoneId,
  onZoneSelect,
  statusMessage
}) => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-300 shadow-inner bg-[#E9EBE8] flex flex-col justify-between" style={{ height }}>
      {/* Background stylized Dhaka road grid & river lines */}
      <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none">
        <path d="M0,160 Q100,120 200,180 T400,140 T600,200" fill="none" stroke="#B3D0E4" strokeWidth="18" />
        <line x1="120" y1="0" x2="120" y2="300" stroke="#FFFFFF" strokeWidth="6" />
        <line x1="280" y1="0" x2="280" y2="300" stroke="#FFFFFF" strokeWidth="8" />
        <line x1="440" y1="0" x2="440" y2="300" stroke="#FFFFFF" strokeWidth="6" />
        <line x1="0" y1="90" x2="600" y2="90" stroke="#FFFFFF" strokeWidth="6" />
        <line x1="0" y1="160" x2="600" y2="160" stroke="#FFFFFF" strokeWidth="5" />
      </svg>

      {/* Zone Hotspots Grid */}
      <div className="relative z-10 p-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {INITIAL_DELIVERY_ZONES.slice(0, 4).map((zone) => {
          const isCurrent = zone.id === selectedZoneId;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => {
                onZoneSelect?.(zone.id);
                onLocationSelect?.({ lat: zone.lat, lng: zone.lng });
              }}
              className={`p-2 rounded-xl text-left text-xs font-bold transition-all shadow-xs backdrop-blur-xs cursor-pointer flex flex-col justify-between ${
                isCurrent 
                  ? 'bg-amber-600 text-white ring-2 ring-amber-400 scale-102 z-10' 
                  : 'bg-white/90 hover:bg-white text-stone-800 border border-stone-200 hover:scale-101'
              }`}
            >
              <span className="truncate text-[11px]">
                {language === 'bn' ? zone.name_bn.split(' ')[0] : zone.name_en.split(' ')[0]}
              </span>
              <span className="text-[10px] opacity-80 mt-0.5">৳{zone.baseFee} • {zone.estimatedMinutes}m</span>
            </button>
          );
        })}
      </div>

      {/* Restaurant Center Pin */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
        <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
          <UtensilsCrossed className="w-4 h-4" />
        </div>
        <span className="text-[9px] font-bold bg-stone-900 text-amber-300 px-1.5 py-0.5 rounded mt-1 shadow-xs">
          ধানসিঁড়ি কিচেন
        </span>
      </div>

      {/* Target Destination Pin */}
      {markerPosition && (
        <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none animate-bounce">
          <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl border-2 border-white">
            <MapPin className="w-5 h-5 fill-white text-red-600" />
          </div>
          <span className="text-[9px] font-bold bg-red-800 text-white px-1.5 py-0.5 rounded mt-0.5 shadow-xs">
            {language === 'bn' ? 'ডেলিভারি পয়েন্ট' : 'Delivery Point'}
          </span>
        </div>
      )}

      {/* Rider Pin if tracking */}
      {riderPosition && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-15 flex flex-col items-center pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
            <Bike className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Google Maps Platform API Key Guide Banner */}
      <div className="relative z-10 m-2.5 p-2 bg-stone-900/90 backdrop-blur-xs text-stone-200 rounded-xl border border-amber-500/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="text-[11px]">
            <span className="font-bold text-amber-400 block">Google Maps Platform Integration</span>
            <span className="text-stone-300 text-[10px]">
              {statusMessage || (language === 'bn' 
                ? 'লাইভ গুগল ম্যাপের জন্য VITE_GOOGLE_MAPS_API_KEY কনফিগার করুন' 
                : 'Configure VITE_GOOGLE_MAPS_API_KEY in settings for full dynamic map rendering')}
            </span>
          </div>
        </div>

        <a
          href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-xs shrink-0"
        >
          <span>{language === 'bn' ? 'ডেমো কি নিন' : 'Get Demo Key'}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

// Internal wrapper to monitor loading status and gracefully render fallback if API key is invalid
const ApiStatusHandler: React.FC<GoogleDeliveryMapProps & { apiKey: string }> = (props) => {
  const status = useApiLoadingStatus();

  if (status === APILoadingStatus.LOADING) {
    return (
      <div 
        className="relative w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 flex flex-col items-center justify-center gap-2 text-stone-500"
        style={{ height: props.height || '260px' }}
      >
        <div className="w-8 h-8 rounded-full border-3 border-amber-600 border-t-transparent animate-spin" />
        <span className="text-xs font-medium">Loading Google Maps...</span>
      </div>
    );
  }

  if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <FallbackDhakaMap 
        {...props} 
        statusMessage={props.language === 'bn' 
          ? 'গুগল ম্যাপস API অথেনটিকেশন ত্রুটি। প্রদত্ত কি চেক করুন।' 
          : 'Google Maps API authentication failed. Verify your API key restrictions.'} 
      />
    );
  }

  return <InnerGoogleMap {...props} />;
};

// Top-Level Google Delivery Map Component with robust fallback & APIProvider
export const GoogleDeliveryMap: React.FC<GoogleDeliveryMapProps> = (props) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  // If no API key is set in environment, render the interactive Dhaka fallback visualizer
  if (!apiKey || apiKey.trim() === '') {
    return <FallbackDhakaMap {...props} />;
  }

  return (
    <APIProvider apiKey={apiKey}>
      <ApiStatusHandler {...props} apiKey={apiKey} />
    </APIProvider>
  );
};
