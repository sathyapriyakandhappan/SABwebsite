import React from 'react';
import { Link } from 'react-router-dom';
import SABLogo from '../components/SABLogo';
import { openWhatsAppDirect, SAB_ADDRESS, SAB_EMAIL, SAB_PROPRIETOR } from '../utils/whatsapp';
import {
  Leaf,
  Award,
  ShieldCheck,
  Sprout,
  FlaskConical,
  Users,
  ArrowRight,
  GraduationCap,
  Building2,
  Calendar,
  PhoneCall,
  Mail,
  MapPin,
  MessageCircle,
  FileCheck2
} from 'lucide-react';

export default function AboutUs({ onOpenEnquiry }) {
  const servicesList = [
    { title: 'Production & Sales of Biofertilizers', desc: 'Liquid & carrier bio-fertilizers including Paddy Special, Azospirillum, Phosphobacteria, and KMB.' },
    { title: 'Production of Biocontrol Agents', desc: 'Pure cultures of Trichoderma viride, Pseudomonas fluorescens, and Beauveria bassiana.' },
    { title: 'Commercial Vermicompost & Live Earthworms', desc: '100% organic earthworm castings and live Eudrilus eugeniae mother stock.' },
    { title: 'Azolla Pinnata Cultivation Units', desc: 'Multiplication kits for green bio-fertilizer in paddy fields and nutritious dairy feed.' },
    { title: 'Entrepreneurship Training Programs', desc: 'For Self-Help Groups (SHG), unemployed youth, and college students.' },
    { title: 'College Student Internships & Field Visits', desc: 'Practical exposure for B.Sc. Agriculture and Arts & Science College scholars.' },
    { title: 'Group & Mini Projects Guidance', desc: 'Real-world laboratory and field experiment assistance for college curricula.' },
    { title: 'M.Sc. Project & Ph.D. Research Assistance', desc: 'Microbiological laboratory testing, strain isolation, and incubation support.' },
    { title: 'Agri-Business & Farm Consultation', desc: 'Complete guidance on soil health revival, organic certification, and crop nutrition.' },
    { title: 'Institutional Resource Person', desc: 'Expert guest lectures and keynotes at Universities, Polytechnic & Agricultural institutions.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-20 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase">
            <Leaf className="w-3.5 h-3.5" />
            <span>Founded in 2007 • Thanjavur, Tamil Nadu</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            About Sri Amman Biocare & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Dr. R. Senthilkumar
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Leading the transformation of sustainable agriculture through microbial biotechnology, organic soil health solutions, and vocational youth empowerment for over 18 years.
          </p>
        </div>

        {/* Profile Card & Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-7 space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h2 className="text-2xl font-black text-white">Our Founder & History</h2>
            <p>
              Started in <strong>2007</strong> by <strong>Dr. R. Senthilkumar</strong>, <strong>Sri Amman Biocare</strong> (SAB) was established in Thirukkanurpatti, Thanjavur District. Our primary mission is to revive degraded farm soils by replacing hazardous synthetic chemicals with high-potency bio-fertilizers, biocontrol agents, and natural humic manures.
            </p>
            <p>
              Beyond manufacturing, <strong>Dr. R. Senthilkumar</strong> actively serves as an acclaimed <strong>Resource Person</strong> and keynote lecturer at leading Agricultural Colleges, Universities, and Polytechnic Institutions across Tamil Nadu.
            </p>
            <p>
              Through formal Memorandums of Understanding (MoU) with university departments, SAB provides state-of-the-art laboratory project facilities, B.Sc. student internships, M.Sc. projects, and Ph.D. research assistance.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <p className="font-bold text-white text-xs">Direct Contact Details:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> 82480 10800 / 98657 78873</span>
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-400" /> {SAB_EMAIL}</span>
                <span className="flex items-center gap-1.5 col-span-1 sm:col-span-2"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> {SAB_ADDRESS}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onOpenEnquiry ? onOpenEnquiry({ name: '', productName: 'Direct Proprietor Consultation (Dr. R. Senthilkumar)', message: 'வணக்கம் Dr. R. Senthilkumar, I would like to schedule an advisory consultation regarding bio-fertilizers and organic farming.' }) : openWhatsAppDirect()}
                className="px-6 py-3 rounded-xl font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 text-xs flex items-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>Chat with Dr. R. Senthilkumar</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl bg-slate-900 aspect-[4/3] relative">
              <img
                src="/assets/sab_banner_tamil.jpg"
                alt="Sri Amman Biocare Banner"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                <p className="font-bold text-emerald-400">SAB Research & Training Center</p>
                <p className="text-slate-300">161 Pudukkottai Main Road, Thirukkanurpatti, Thanjavur</p>
              </div>
            </div>
          </div>
        </div>

        {/* 10 Comprehensive Services Grid */}
        <div className="mb-20">
          <div className="max-w-2xl mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Complete Portfolio
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Full Range of Products & Educational Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((srv, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  <span>{srv.title}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-8">
                  {srv.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
