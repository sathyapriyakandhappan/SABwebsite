import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsApi, categoriesApi, enquiriesApi, programsApi } from '../services/api';
import DNAHelixBackground from '../components/DNAHelixBackground';
import SABLogo from '../components/SABLogo';
import { openWhatsAppDirect, buildWhatsAppUrl, SAB_ADDRESS, SAB_PROPRIETOR } from '../utils/whatsapp';
import {
  ArrowRight,
  ShieldCheck,
  Leaf,
  Sparkles,
  Sprout,
  FlaskConical,
  CheckCircle2,
  PhoneCall,
  Mail,
  MapPin,
  TrendingUp,
  Award,
  Users,
  Send,
  AlertCircle,
  MessageCircle,
  GraduationCap,
  Calendar,
  Building2
} from 'lucide-react';

export default function Home({ onOpenEnquiry }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick form in contact section
  const [quickForm, setQuickForm] = useState({
    name: '',
    email: '',
    phone: '',
    productName: 'Paddy special - compo of 3 biofertilizer',
    message: '',
  });
  const [submittingQuick, setSubmittingQuick] = useState(false);
  const [quickSuccess, setQuickSuccess] = useState('');
  const [quickError, setQuickError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, progRes] = await Promise.all([
          productsApi.getFeatured(),
          categoriesApi.getAll({ status: 'Active' }),
          programsApi.getAll(),
        ]);

        if (prodRes.data.success) {
          setFeaturedProducts(prodRes.data.products);
        }
        if (catRes.data.success) {
          setCategories(catRes.data.categories);
        }
        if (progRes.data.success) {
          setPrograms(progRes.data.programs.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    setQuickError('');
    setQuickSuccess('');

    if (!quickForm.name || !quickForm.phone || !quickForm.message) {
      setQuickError('Please fill in your Name, Phone Number, and Message.');
      return;
    }

    try {
      setSubmittingQuick(true);
      await enquiriesApi.create({
        ...quickForm,
        email: quickForm.email || 'farmer@sriammanbiocare.com',
      });

      setQuickSuccess('Enquiry saved to SAB Admin! Opening WhatsApp to connect with Dr. R. Senthilkumar...');

      // Auto-dispatch to WhatsApp
      const waUrl = buildWhatsAppUrl(quickForm);
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 700);

      setQuickForm({
        name: '',
        email: '',
        phone: '',
        productName: 'Paddy special - compo of 3 biofertilizer',
        message: '',
      });
    } catch (err) {
      const waUrl = buildWhatsAppUrl(quickForm);
      window.open(waUrl, '_blank');
    } finally {
      setSubmittingQuick(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500 selection:text-slate-950 text-left">
      {/* ======================================================== */}
      {/* 1. HERO SECTION WITH DNA HELIX BACKGROUND */}
      {/* ======================================================== */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-24 pb-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <DNAHelixBackground />

        {/* Ambient glow */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-600/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase shadow-inner">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Established 2007 • Dr. R. Senthilkumar • Thanjavur</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                ஸ்ரீ அம்மன் பயோகேர் <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-3xl sm:text-4xl lg:text-5xl">
                  Sri Amman Biocare & Research Center
                </span>
              </h1>

              {/* Tamil tagline from authentic banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-medium leading-relaxed">
                அனைத்து பயிர்களுக்கும் தேவையான ஆலோசனைகள், இயற்கை உரங்கள் மற்றும் மண்புழு உரம் கிடைக்கும். B.Sc., M.Sc., Ph.D. ஆராய்ச்சி & தொழிற்பயிற்சிகள் வழங்கப்படும்.
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Dedicated manufacturers of certified Bio-fertilizers, Biocontrol agents, Bio-pesticides, Vermicompost, and Azolla. Professional training for self-help groups, students, and farmers across Tamil Nadu.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => openWhatsAppDirect('வணக்கம் Dr. R. Senthilkumar, I want to order Biofertilizer / Paddy Special.')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 text-xs shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>WhatsApp: 82480 10800</span>
                </button>

                <Link
                  to="/products"
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs shadow-md transition-all hover:scale-105"
                >
                  <FlaskConical className="w-4 h-4 text-emerald-400" />
                  <span>View 8 Product Categories</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/training"
                  className="flex items-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-emerald-400 hover:text-white text-xs transition-colors"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Training & Internships</span>
                </Link>
              </div>

              {/* Contact strip */}
              <div className="pt-2 flex flex-wrap items-center gap-5 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-white font-medium">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> 82480 10800 / 98657 78873
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> 161 Pudukkottai Main Road, Thirukkanurpatti, Thanjavur
                </span>
              </div>
            </div>

            {/* Right Card: Authentic Tamil Banner & Highlights */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-4">
                {/* Banner Header Image */}
                <div className="rounded-2xl overflow-hidden border border-emerald-500/40 shadow-inner">
                  <img
                    src="/assets/sab_banner_tamil.jpg"
                    alt="ஸ்ரீ அம்மன் பயோகேர் பேனர்"
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>SAB ஆராய்ச்சி மையம் (R&D)</span>
                    <span className="text-emerald-400">Since 2007</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    B.Sc. Group Project, M.Sc. Project & Ph.D. Research assistance with in-house microbiology laboratory.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 block">முக்கிய தொழில் பயிற்சிகள்:</span>
                  <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-200">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">உணவு காளான் உற்பத்தி</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">தேனி வளர்ப்பு</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">சுருள் பாசி வளர்ப்பு</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">மண்புழு உரம்</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">அசோலா வளர்ப்பு</span>
                  </div>
                </div>

                <button
                  onClick={() => openWhatsAppDirect('வணக்கம்! I would like to consult Dr. R. Senthilkumar regarding biofertilizers and farm training.')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>Instant WhatsApp Consultation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. SPOTLIGHT: PADDY SPECIAL COMPOSITE BIOFERTILIZER */}
      {/* ======================================================== */}
      <section className="py-16 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950/90 via-slate-950 to-slate-900 border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                  <span>★ Flagship Product Recommendation</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white">
                  Paddy Special – Compo of 3 Biofertilizer
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-sm">
                    Price: ₹550
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-400 font-bold">
                    Dosage: 1000 ml per acre
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-semibold">
                    Method: Soil application by sowing
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Provides N P K fertilizer to plants biologically</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Increases tillers significantly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Resistant to disease, insects & pests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Reduces chemical fertilizer costs by 30-40%</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-1 sm:col-span-2 text-emerald-400 font-bold">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Increases paddy harvest yield up to 50%!</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-emerald-500/30 text-center space-y-4">
                <div className="text-2xl font-black text-white">₹550 <span className="text-xs font-normal text-slate-400">/ 1000 ml</span></div>
                <p className="text-xs text-slate-400">Stock ready for dispatch in Thanjavur</p>
                <button
                  onClick={() => onOpenEnquiry ? onOpenEnquiry({ name: '', productName: 'Paddy special - compo of 3 biofertilizer', price: 550, message: 'வணக்கம் Dr. R. Senthilkumar, I want to purchase Paddy special - compo of 3 biofertilizer (₹550 / 1000ml). Please share delivery details.' }) : openWhatsAppDirect('வணக்கம் Dr. R. Senthilkumar, I want to purchase Paddy special - compo of 3 biofertilizer (₹550 / 1000ml). Please share delivery details.')}
                  className="w-full py-3 rounded-xl font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>Order on WhatsApp (₹550)</span>
                </button>
                <button
                  onClick={() => onOpenEnquiry && onOpenEnquiry({ name: '', productName: 'Paddy special - compo of 3 biofertilizer', price: 550 })}
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                >
                  Submit Web Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. ALL 8 PRODUCT CATEGORIES */}
      {/* ======================================================== */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Sri Amman Biocare Product Range
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              8 Core Bio-Agricultural Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Manufactured with in-house microbiology quality standards in Thanjavur, Tamil Nadu.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {categories.slice(0, 8).map((cat, idx) => {
              const catName = cat.name || '';
              return (
                <Link
                  key={cat._id || cat.id || `cat-${idx}`}
                  to={`/products?category=${encodeURIComponent(catName)}`}
                  className="group p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {catName}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-emerald-400 mt-3">
                    <span>View Products</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. FEATURED PRODUCTS (WITH PRICE & WHATSAPP) */}
      {/* ======================================================== */}
      <section className="py-20 bg-slate-900/70 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                Direct from Production Center
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Featured Bio-Products
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 6).map((product, idx) => {
              const prodId = product._id || product.id;
              return (
                <div
                  key={prodId || `feat-${idx}`}
                  className="h-full rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group"
                >
                  <Link
                    to={`/products/${prodId}`}
                    className="block flex-1 group"
                  >
                    <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                      <img
                        src={product.image || 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                          {product.category}
                        </span>
                      </div>
                      {product.price > 0 && (
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-slate-950 shadow-md">
                            ₹{product.price}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-2.5">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 min-h-[24px]">
                        {product.name}
                      </h3>
                      {product.dosage ? (
                        <p className="text-[11px] text-emerald-400 font-semibold truncate">
                          Dosage: {product.dosage}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-500 italic truncate">
                          Dosage: Standard Agri Guideline
                        </p>
                      )}
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[32px]">
                        {product.description}
                      </p>
                    </div>
                  </Link>

                  <div className="p-6 pt-0 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-4">
                    <Link
                      to={`/products/${prodId}`}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => onOpenEnquiry ? onOpenEnquiry(product) : openWhatsAppDirect(`வணக்கம் Dr. R. Senthilkumar, I want to buy ${product.name} ${product.price ? `(₹${product.price})` : ''}. Please share ordering details.`)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 transition-all shadow-md"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
                      <span>WhatsApp Order</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. TRAINING & INTERNSHIP PREVIEW */}
      {/* ======================================================== */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> SAB Training Academy
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Vocational Entrepreneurship & Student Project Training
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Empowering college students, rural unemployed youth, and women's self-help groups with hands-on skills in mushroom growing, spirulina raceways, beekeeping, and biofertilizer manufacturing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="font-bold text-white mb-1">🍄 Mushroom & Spirulina</p>
                  <p className="text-slate-400 text-[11px]">Spawn production, shed setup, raceway ponds.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="font-bold text-white mb-1">🪱 Vermicompost & Azolla</p>
                  <p className="text-slate-400 text-[11px]">Commercial worm bed management and cattle feed.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="font-bold text-white mb-1">🎓 College Internships</p>
                  <p className="text-slate-400 text-[11px]">Industrial visits & field trials for B.Sc. students.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="font-bold text-white mb-1">🔬 M.Sc. & Ph.D. Projects</p>
                  <p className="text-slate-400 text-[11px]">Microbiology lab support & research mentorship.</p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  to="/training"
                  className="px-6 py-3 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md"
                >
                  Explore All 9 Courses & Internships
                </Link>
                <button
                  onClick={() => openWhatsAppDirect('வணக்கம் Dr. R. Senthilkumar, I am enquiring about student internship and training at SAB.')}
                  className="text-xs font-semibold text-[#25D366] hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Enquire on WhatsApp
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Memorandum of Understanding (MoU)</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Various University departments and Agricultural Colleges have signed MoUs with Sri Amman Biocare for technical sharing, placement offers, and student project training.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="font-bold text-emerald-400 block">✓ Agricultural & Science Colleges</span>
                    <span className="text-slate-400 text-[11px]">Student internships, industrial visits & biological field trials.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="font-bold text-teal-400 block">✓ Self Help Group Federations</span>
                    <span className="text-slate-400 text-[11px]">Vocational self-employment and organic manure production.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. RESOURCE PERSON PROGRAMS PREVIEW */}
      {/* ======================================================== */}
      {programs.length > 0 && (
        <section className="py-20 bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                  Academic & Industry Engagement
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white">
                  Resource Person Programs & Visits
                </h2>
              </div>
              <Link
                to="/programs"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                <span>View All Events & Photos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {programs.map((prog, idx) => (
                <div
                  key={prog._id || prog.id || `prog-${idx}`}
                  className="h-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition-colors group"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                      <img
                        src={prog.image || '/assets/program1.jpeg'}
                        alt={prog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => { e.target.src = '/assets/program1.jpeg'; }}
                      />
                    </div>
                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                        {prog.category}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 min-h-[40px] leading-snug">
                        {prog.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{prog.institution}</span>
                      </p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <Link
                      to="/programs"
                      className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      View Session Details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 7. CONTACT & WHATSAPP FAST ENQUIRY */}
      {/* ======================================================== */}
      <section className="py-20 bg-slate-950 border-t border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Official Head Office
              </span>
              <h2 className="text-3xl font-black text-white">
                Contact Sri Amman Biocare
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Connect directly with <strong>{SAB_PROPRIETOR}</strong> for bulk distribution, organic input orders, or university student projects.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] text-slate-400">Factory & Office Address</p>
                    <p className="font-semibold text-white mt-0.5">{SAB_ADDRESS}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <PhoneCall className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400">Primary Contact Numbers</p>
                    <p className="font-semibold text-white">82480 10800 / 98657 78873</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400">Email Address</p>
                    <p className="font-semibold text-white">sabsenthil1@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Enquiry Form Card */}
            <div className="lg:col-span-7">
              <div className="p-8 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl relative">
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <span>Send Direct WhatsApp Bio-Enquiry</span>
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Fill details below to automatically notify SAB Admin and launch WhatsApp directly.
                </p>

                {quickSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{quickSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleQuickSubmit} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Farmer / Student / Dealer"
                        value={quickForm.name}
                        onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 82480..."
                        value={quickForm.phone}
                        onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Product or Training Requirement
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Paddy Special / Vermicompost / Mushroom Training"
                      value={quickForm.productName}
                      onChange={(e) => setQuickForm({ ...quickForm, productName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Message & Requirements *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Specify your crop acreages, problemfaced, or quantity required..."
                      value={quickForm.message}
                      onChange={(e) => setQuickForm({ ...quickForm, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingQuick}
                    className="w-full py-3.5 rounded-xl font-bold text-slate-950 bg-[#25D366] hover:bg-[#20bd5a] transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-slate-950" />
                    <span>{submittingQuick ? 'Sending...' : 'Send WhatsApp Message to 82480 10800'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
