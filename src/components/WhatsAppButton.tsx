import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Language } from '../types';

interface WhatsAppButtonProps {
  language: Language;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ language }) => {
  const phoneNumber = '880170000000'; // Restaurant official hotline
  const message = language === 'bn' 
    ? encodeURIComponent('আসসালামু আলাইকুম, আমি ধানসিঁড়ি কিচেন থেকে খাবার অর্ডার / টেবিল বুকিং সম্পর্কে জানতে চাই।')
    : encodeURIComponent('Hello Dhanshiri Kitchen, I would like to inquire about food delivery / table reservation.');

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <aside aria-label={language === 'bn' ? 'হোয়াটসঅ্যাপ সহায়তা' : 'WhatsApp Support'}>
      <a
        id="whatsapp-floating-button"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-5 z-40 flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-105 transition-all duration-200 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current text-white animate-pulse" />
        <span className="text-sm font-semibold hidden md:inline-block">
          {language === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার দিন' : 'WhatsApp Order'}
        </span>
        <span className="relative flex h-2.5 w-2.5 md:hidden">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
      </a>
    </aside>
  );
};
