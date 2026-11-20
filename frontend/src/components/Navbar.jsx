import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SABLogo from './SABLogo';
import { openWhatsAppDirect, SAB_YOUTUBE_URL, SAB_ADDRESS } from '../utils/whatsapp';
import {
  Menu,
  X,
  PhoneCall,
  Sparkles,
  MessageCircle,
  Home,
  Sprout,
  GraduationCap,
  Building2,
  Award,
  ChevronRight,
  MapPin,
  ExternalLink
} from 'lucide-react';

const YouTubeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function Navbar({ onOpenEnquiry }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll listener for sticky navbar blur effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/products', icon: Sprout },
    { name: 'Training & Internship', path: '/training', icon: GraduationCap },
    { name: 'Programs & Visits', path: '/programs', icon: Building2 },
    { name: 'About SAB', path: '/about', icon: Award },
    { name: 'Contact', path: '/contact', icon: PhoneCall },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-900/95 backdrop-blur-md shadow-xl shadow-black/25 border-b border-emerald-900/40 py-2 sm:py-2.5'
            : 'bg-slate-950/90 backdrop-blur-sm border-b border-slate-800/80 py-2.5 sm:py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2">
            
            {/* ======================================================== */}
            {/* BRAND LOGO & TITLE (FLUID & COMPACT ON ALL SCREENS) */}
            {/* ======================================================== */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink min-w-0">
              <div className="relative p-1 rounded-xl bg-slate-900/90 border border-emerald-500/40 group-hover:border-emerald-400 transition-colors shadow-inner shrink-0">
                <SABLogo size={36} className="sm:w-[42px] sm:h-[42px]" showText={true} />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-sm sm:text-lg lg:text-xl font-extrabold tracking-tight text-white flex items-center gap-1 truncate">
                  <span>Sri Amman</span> <span className="text-emerald-400">Biocare</span>
                </span>
                <span className="text-[9px] sm:text-[11px] font-semibold text-emerald-400/90 tracking-wide truncate">
                  Dr. R. Senthilkumar • Estd 2007
                </span>
              </div>
            </Link>

            {/* ======================================================== */}
            {/* DESKTOP NAVIGATION LINKS (VISIBLE FROM 1024px UPWARDS) */}
            {/* ======================================================== */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-slate-900/70 border border-slate-800/90 rounded-full px-2.5 xl:px-4 py-1.5 shadow-inner">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                    isActive(link.path)
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* ======================================================== */}
            {/* DESKTOP ACTIONS: YOUTUBE, PHONE, WHATSAPP, ENQUIRE */}
            {/* ======================================================== */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
              {/* YouTube Link */}
              <a
                href={SAB_YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600/15 hover:bg-rose-600/25 text-rose-400 border border-rose-500/30 transition-all hover:scale-105"
                title="Official YouTube Channel"
              >
                <YouTubeIcon className="w-4 h-4 text-rose-500" />
                <span className="hidden xl:inline">YouTube</span>
              </a>

              {/* Direct Phone */}
              <a
                href="tel:8248010800"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition-colors border border-emerald-900/30"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>82480 10800</span>
              </a>

              {/* WhatsApp Fast Button */}
              <button
                onClick={() => openWhatsAppDirect()}
                className="flex items-center gap-1.5 px-3 xl:px-3.5 py-2 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>WhatsApp</span>
              </button>

              {/* Enquiry Modal Trigger */}
              <button
                onClick={() => onOpenEnquiry && onOpenEnquiry()}
                className="flex items-center gap-1.5 px-3 xl:px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enquire</span>
              </button>
            </div>

            {/* ======================================================== */}
            {/* MOBILE & TABLET TOP ACTION BAR (< 1024px) */}
            {/* ======================================================== */}
            <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
              {/* WhatsApp Quick Action (Always accessible on mobile) */}
              <button
                onClick={() => openWhatsAppDirect()}
                className="flex items-center gap-1 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs shadow-sm transition-transform active:scale-95"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span className="hidden sm:inline text-[11px]">WhatsApp</span>
              </button>

              {/* Enquire Quick Button (Hidden on extra-narrow < 400px, visible on sm) */}
              <button
                onClick={() => onOpenEnquiry && onOpenEnquiry()}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-sm transition-transform active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enquire</span>
              </button>

              {/* Hamburger Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 sm:p-2.5 rounded-xl border transition-all ${
                  mobileMenuOpen
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                    : 'bg-slate-900 text-slate-200 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MOBILE DRAWER OVERLAY & SLIDING DRAWER (< 1024px) */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Drawer Container */}
          <div className="relative ml-auto w-full max-w-sm sm:max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded-xl bg-slate-900 border border-emerald-500/40">
                  <SABLogo size={36} showText={true} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Sri Amman Biocare</h3>
                  <p className="text-[10px] text-emerald-400 font-semibold">Dr. R. Senthilkumar • Estd 2007</p>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links with Icons */}
            <div className="p-4 sm:p-5 space-y-1.5 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-3 py-1">
                Navigation
              </span>

              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                      active
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                        : 'text-slate-200 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${active ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-emerald-400'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span>{link.name}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-500'}`} />
                  </Link>
                );
              })}
            </div>

            {/* Direct Connect & Social Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                Quick Advisory & Order
              </span>

              {/* Big WhatsApp CTA */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openWhatsAppDirect('வணக்கம் Dr. R. Senthilkumar, I am contacting you from Sri Amman Biocare website.');
                }}
                className="w-full py-3 px-4 rounded-2xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>Chat on WhatsApp (82480 10800)</span>
              </button>

              {/* Call & YouTube Grid */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:8248010800"
                  className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 hover:border-emerald-500/40 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call 82480 10800</span>
                </a>

                <a
                  href={SAB_YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-rose-600/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-rose-600/25 transition-colors"
                >
                  <YouTubeIcon className="w-4 h-4 text-rose-500" />
                  <span>YouTube</span>
                </a>
              </div>

              {/* Enquiry Form Button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEnquiry && onOpenEnquiry();
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Advisory Enquiry Form</span>
              </button>

              {/* Verified Address Snippet */}
              <div className="pt-2 text-[10px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>161 Pudukkottai Main Road, Thirukkanurpatti, Thanjavur - 613 303</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
