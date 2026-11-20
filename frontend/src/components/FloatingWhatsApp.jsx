import React, { useState } from 'react';
import { openWhatsAppDirect, PRIMARY_WHATSAPP, SECONDARY_WHATSAPP } from '../utils/whatsapp';
import { MessageCircle, Phone, X, Sparkles } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Quick Popup card */}
      {isOpen && (
        <div className="mb-3 w-72 bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl text-white animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white">Sri Amman Biocare</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
            Directly connect with <strong>Dr. R. Senthilkumar</strong> for bio-fertilizers, vermicompost, training & internship enquiries.
          </p>

          <div className="mt-3 space-y-2">
            <button
              onClick={() => {
                openWhatsAppDirect('வணக்கம்! I want to enquire about Paddy Special and Biofertilizer products.');
                setIsOpen(false);
              }}
              className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: 82480 10800</span>
            </button>

            <a
              href="tel:9865778873"
              className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call: 98657 78873</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 p-3.5 sm:px-4 sm:py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-emerald-900/40 transition-all duration-300 hover:scale-110 active:scale-95"
        title="Chat on WhatsApp"
        aria-label="WhatsApp Contact"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-ping" />
        <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
        <span className="hidden sm:inline text-xs font-extrabold tracking-wide text-slate-950 pr-1">
          WhatsApp Us
        </span>
      </button>
    </div>
  );
}
