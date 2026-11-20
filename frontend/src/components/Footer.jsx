import React from 'react';
import { Link } from 'react-router-dom';
import SABLogo from './SABLogo';
import { openWhatsAppDirect, SAB_ADDRESS, SAB_EMAIL, SAB_PROPRIETOR, SAB_YOUTUBE_URL, SAB_GOOGLE_MAPS_URL } from '../utils/whatsapp';
import { Mail, Phone, MapPin, Leaf, Award, ArrowRight, MessageCircle, ExternalLink, Star } from 'lucide-react';

const YouTubeIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info & Socials */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-xl bg-slate-900 border border-emerald-500/30">
                  <SABLogo size={44} showText={true} />
                </div>
                <div>
                  <span className="text-xl font-black text-white block">Sri Amman Biocare</span>
                  <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                    {SAB_PROPRIETOR} • Estd 2007
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Bio-fertilizers, Biocontrol agents, Vermicompost, and Azolla cultivation. Practical entrepreneurship training and college student internships across Tamil Nadu.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => openWhatsAppDirect()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 shadow-md transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
                <span>WhatsApp: 82480 10800</span>
              </button>

              <a
                href={SAB_YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-all"
              >
                <YouTubeIcon className="w-3.5 h-3.5 text-rose-500" />
                <span>YouTube</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-emerald-500 pl-2">
              Website Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-emerald-500" /> Home Overview
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-emerald-500" /> Bio-Products (8 Categories)
                </Link>
              </li>
              <li>
                <Link to="/training" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-emerald-500" /> Entrepreneur Training & Internships
                </Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-emerald-500" /> Resource Person Programs & Visits
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-emerald-500" /> About Dr. R. Senthilkumar
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-emerald-500" /> Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Bio Range */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-teal-500 pl-2">
              Core Bio Solutions
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li className="hover:text-teal-400 transition-colors">
                • Biofertilizer (Paddy Special 3-in-1, Azospirillum, PSB)
              </li>
              <li className="hover:text-teal-400 transition-colors">
                • Biocontrol Agents (Trichoderma, Pseudomonas)
              </li>
              <li className="hover:text-teal-400 transition-colors">
                • Bio Pesticides & Bio Insecticides (Bt, Beauveria)
              </li>
              <li className="hover:text-teal-400 transition-colors">
                • Bio Tonics (Humic & Seaweed Extracts)
              </li>
              <li className="hover:text-teal-400 transition-colors">
                • Vermicompost & Live Earthworms (Eudrilus eugeniae)
              </li>
              <li className="hover:text-teal-400 transition-colors">
                • Azolla Pinnata Mother Culture
              </li>
              <li className="hover:text-teal-400 transition-colors">
                • Mushroom, Beekeeping & Spirulina Training
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact & Google Map */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-emerald-500 pl-2">
              Office & Research Center
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{SAB_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-white font-medium">82480 10800 / 98657 78873</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">{SAB_EMAIL}</span>
              </div>
              <div className="pt-1">
                <a
                  href={SAB_GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-850 text-emerald-400 border border-emerald-500/30 transition-all hover:scale-105"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View on Google Search / Map</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar (Clean without admin links) */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2007 - {new Date().getFullYear()} Sri Amman Biocare. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-500/80">
              <Award className="w-3.5 h-3.5" /> ISO & Organic Standards Certified
            </span>
            <span>•</span>
            <a
              href={SAB_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-amber-400 hover:underline"
            >
              <Star className="w-3 h-3 fill-amber-400" />
              <span>Google Business Profile</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
