import React from 'react';
import { openWhatsAppDirect } from '../utils/whatsapp';
import {
  GraduationCap,
  Sprout,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  FlaskConical,
  Compass,
  FileCheck2,
  Calendar
} from 'lucide-react';

export default function Training({ onOpenEnquiry }) {
  const entrepreneurTrainings = [
    { title: 'Biofertilizer Production', desc: 'Mass fermentation of Azospirillum, Phosphobacteria, and KMB carrier/liquid formulations.', icon: '🧪' },
    { title: 'Biocontrol Agents Production', desc: 'Pure strain culturing of Trichoderma viride and Pseudomonas fluorescens for crop protection.', icon: '🛡️' },
    { title: 'Mushroom Cultivation', desc: 'Oyster & Milky mushroom shed construction, spawn production, bed preparation, and harvesting.', icon: '🍄' },
    { title: 'Vermicompost Production', desc: 'Commercial earthworm bed preparation with African nightcrawlers (Eudrilus eugeniae) & vermiwash.', icon: '🪱' },
    { title: 'Spirulina Production', desc: 'Raceway pond construction, nutrient medium formulation, high-protein harvesting, and drying.', icon: '🧬' },
    { title: 'Azolla Cultivation', desc: 'Fast aquatic multiplication of Azolla pinnata for paddy bio-fertilizer and dairy cattle feed.', icon: '🌿' },
    { title: 'Honey Bee Production (Apiculture)', desc: 'Apiary box management, honey extraction, queen rearing, and colony multiplication.', icon: '🐝' },
    { title: 'Integrated Farming System', desc: 'Zero-waste multi-tier integration of crops, vermiculture, azolla, dairy, and bio-inputs.', icon: '🚜' },
    { title: 'Organic Farming Certification', desc: 'Natural composting, botanical pest repellents, Panchagavya, and certified organic farming protocols.', icon: '🌱' },
  ];

  const internshipHighlights = [
    { title: 'Hands-on Bio-Factory Experience', desc: 'Live training in our production units in Thirukkanurpatti, Thanjavur.' },
    { title: 'Value Added Products of Organic Farming', desc: 'Formulating bio-stimulants, enriched vermicompost, and organic botanical concentrates.' },
    { title: 'Field Training & Demonstration Plots', desc: 'Direct farmer interaction, soil testing, and practical dosage application in field crops.' },
    { title: 'Group & Mini Projects for College Students', desc: 'Structured practical project guidance for B.Sc. Agriculture & Science students.' },
    { title: 'M.Sc. Project & Ph.D. Research Assistance', desc: 'Microbiological laboratory facilities, autoclave, laminar airflow, and incubator support.' },
    { title: 'Agri-Business & Startup Consultation', desc: 'Project report preparation, bank subsidy assistance, and commercial unit planning.' },
  ];

  const mouColleges = [
    { name: 'Agricultural College & Research Institute', desc: 'Technical knowledge exchange, student internship deputation, and biological trial plots.' },
    { name: 'Autonomous Arts & Science College, Thanjavur', desc: 'Vocational entrepreneurship training in mushroom & spirulina for rural youth.' },
    { name: 'University Department of Biotechnology', desc: 'Joint microbial strain research, Ph.D. guidance, and technical placement offers.' },
    { name: 'Women Self-Help Groups (SHG) Federation', desc: 'Commercial vermicompost production and backyard Azolla cultivation livelihood programs.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* Banner Section */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/30 p-8 sm:p-12 mb-16 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
              <GraduationCap className="w-3.5 h-3.5" />
              SAB Research & Training Center
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Entrepreneurship Training & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Student Internships
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Under the direct mentorship of <strong>Dr. R. Senthilkumar</strong>, Sri Amman Biocare empowers Self-Help Groups, unemployed youth, and college students with practical biological agriculture entrepreneurship.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openWhatsAppDirect('வணக்கம் Dr. R. Senthilkumar, I want to enroll for Entrepreneur Training / College Internship at Sri Amman Biocare.')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 text-xs shadow-lg transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>Apply on WhatsApp: 82480 10800</span>
              </button>

              <button
                onClick={() => onOpenEnquiry && onOpenEnquiry({ name: '', productName: 'Entrepreneurship Training / Internship' })}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs border border-slate-700 transition-colors"
              >
                <span>Request Prospectus</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1. ENTREPRENEUR TRAINING PROGRAMS (9 TOPICS) */}
        {/* ======================================================== */}
        <div className="mb-20">
          <div className="max-w-3xl mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Self-Employment & Livelihood
            </span>
            <h2 className="text-3xl font-black text-white">
              9 Specialized Entrepreneurship Training Courses
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Tailored for Self-Help Groups (SHG), Unemployed Rural Youth, and Aspiring Agripreneurs. Certificates provided upon completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entrepreneurTrainings.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 flex flex-col justify-between space-y-4 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
                  <span>Batch Available</span>
                  <button
                    onClick={() => onOpenEnquiry ? onOpenEnquiry({ name: '', productName: item.title, message: `வணக்கம் Dr. R. Senthilkumar, I am interested in joining the ${item.title} training program.` }) : openWhatsAppDirect(`வணக்கம் Dr. R. Senthilkumar, I am interested in joining the ${item.title} training program.`)}
                    className="flex items-center gap-1 hover:underline text-[#25D366]"
                  >
                    Enrol on WhatsApp <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. INTERNSHIP & ACADEMIC PROJECT ASSISTANCE */}
        {/* ======================================================== */}
        <div className="mb-20">
          <div className="max-w-3xl mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
              For Agriculture & Arts/Science Colleges
            </span>
            <h2 className="text-3xl font-black text-white">
              Student Internship & Research Facilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Complete academic internship, industrial visit, and laboratory project guidance for undergraduate and postgraduate scholars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internshipHighlights.map((intern, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-teal-500/40 transition-colors"
              >
                <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{intern.title}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {intern.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. MOU SIGNED SECTION */}
        {/* ======================================================== */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-10 mb-16">
          <div className="max-w-3xl mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4" /> Academic Partnerships
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              MoUs Signed With Colleges & Universities
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Sri Amman Biocare has signed formal Memorandums of Understanding (MoU) with leading educational institutions for technical sharing, placement offers, and research trials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mouColleges.map((mou, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">{mou.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{mou.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
