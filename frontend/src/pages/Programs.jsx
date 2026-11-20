import React, { useState, useEffect } from 'react';
import { programsApi } from '../services/api';
import { openWhatsAppDirect } from '../utils/whatsapp';
import {
  Calendar,
  Building2,
  BookOpen,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Eye,
  X,
  Award,
  ChevronRight,
  GraduationCap,
  Users
} from 'lucide-react';

export default function Programs({ onOpenEnquiry }) {
  const [programs, setPrograms] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [activeModalProgram, setActiveModalProgram] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const res = await programsApi.getAll(
          selectedCategory !== 'all' ? { category: selectedCategory } : {}
        );
        if (res.data.success) {
          setPrograms(res.data.programs);
        }
      } catch (err) {
        console.error('Failed to load programs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, [selectedCategory]);

  const categories = [
    'all',
    'Industrial Visit',
    'College Internship',
    'Resource Person',
    'Entrepreneurship Training',
    'MoU Signing',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Sri Amman Biocare</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-400 font-semibold">Institutional Programs & Visits</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Industrial Visits & College Programs
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Industrial visits and internships attended by students and faculty from various Agricultural Universities, Arts & Science Colleges, and Polytechnic Institutions at Sri Amman Biocare, Thanjavur.
          </p>
        </div>

        {/* Featured Spotlight: Industrial Visits Attended from Various Institutions */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                <Users className="w-3.5 h-3.5" /> Student Delegation Highlights
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                Industrial Visits & Practical Internships Attended
              </h2>
            </div>
            <button
              onClick={() => onOpenEnquiry ? onOpenEnquiry({ name: '', productName: 'College Industrial Visit & Internship', message: 'வணக்கம் Dr. R. Senthilkumar, we would like to organize an Industrial Visit / College Internship at Sri Amman Biocare.' }) : openWhatsAppDirect('வணக்கம் Dr. R. Senthilkumar, we would like to organize an Industrial Visit / College Internship at Sri Amman Biocare.')}
              className="px-5 py-2.5 rounded-xl font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 text-xs flex items-center gap-2 shadow-md shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>Book College Industrial Visit</span>
            </button>
          </div>

          {/* 2-Column Spotlight Grid for the two real visit photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-900">
                <img
                  src="/assets/visit1.jpeg"
                  alt="Industrial Visit Delegation 1"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-sm font-bold text-white">
                B.Sc. Agriculture Students Industrial Visit & Fermentation Training
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                Undergraduate agricultural scholars receiving hands-on demonstrations on bio-fertilizer production, carrier formulation, and field inoculation at SAB R&D Center.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-900">
                <img
                  src="/assets/visit2.jpeg"
                  alt="Industrial Visit Delegation 2"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-sm font-bold text-white">
                Faculty & Student Internship on Vermiculture & Mushroom Production
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                Intensive practical exposure covering African nightcrawler earthworm bed maintenance, vermiwash extraction, and oyster mushroom cultivation.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Sessions & Visits' : cat}
            </button>
          ))}
        </div>

        {/* Uniform Grid of Program Cards (All cards exact same size) */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-xs">Loading program records...</div>
        ) : programs.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs rounded-2xl bg-slate-900 border border-slate-800">
            No programs found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((prog) => (
              <div
                key={prog._id || prog.id}
                className="h-full rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group"
              >
                <div>
                  {/* Fixed uniform aspect ratio container */}
                  <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                    <img
                      src={prog.image || '/assets/program1.jpeg'}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = '/assets/program1.jpeg'; }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                        {prog.category || 'Resource Person'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body with strict line-clamps for uniform height */}
                  <div className="p-6 space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{prog.date || 'Academic Session'}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 min-h-[40px] leading-snug">
                      {prog.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold truncate">
                      <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                      <span className="truncate">{prog.institution}</span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[32px]">
                      {prog.description || prog.topic || 'Hands-on training session conducted at Sri Amman Biocare.'}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-6 pt-0 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-4">
                  <button
                    onClick={() => setActiveModalProgram(prog)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Photo</span>
                  </button>

                  <button
                    onClick={() => onOpenEnquiry ? onOpenEnquiry({ name: '', productName: prog.title, message: `வணக்கம் Dr. R. Senthilkumar, we would like to enquire about your session on "${prog.title}".` }) : openWhatsAppDirect(`வணக்கம் Dr. R. Senthilkumar, we would like to enquire about your session on "${prog.title}".`)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 transition-all shadow-md"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Enquire</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for viewing photo and full event details */}
        {activeModalProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-white">
              <div className="relative aspect-[16/10] bg-slate-950">
                <img
                  src={activeModalProgram.image || '/assets/program1.jpeg'}
                  alt={activeModalProgram.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setActiveModalProgram(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {activeModalProgram.category}
                  </span>
                  <span className="text-xs text-slate-400">{activeModalProgram.date}</span>
                </div>

                <h3 className="text-lg font-bold text-white">{activeModalProgram.title}</h3>
                <p className="text-xs text-emerald-400 font-semibold">{activeModalProgram.institution}</p>
                <p className="text-xs text-slate-300 leading-relaxed">{activeModalProgram.description}</p>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setActiveModalProgram(null)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const prog = activeModalProgram;
                      setActiveModalProgram(null);
                      if (onOpenEnquiry) {
                        onOpenEnquiry({ name: '', productName: prog.title, message: `வணக்கம் Dr. R. Senthilkumar, enquiring about Industrial Visit / Program: ${prog.title}` });
                      } else {
                        openWhatsAppDirect(`வணக்கம் Dr. R. Senthilkumar, enquiring about Industrial Visit / Program: ${prog.title}`);
                      }
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#25D366] text-slate-950 flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4 fill-slate-950" />
                    <span>WhatsApp Inquiry</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
