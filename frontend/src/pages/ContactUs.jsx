import React, { useState } from 'react';
import { enquiriesApi } from '../services/api';
import { openWhatsAppDirect, buildWhatsAppUrl, SAB_ADDRESS, SAB_EMAIL, SAB_PROPRIETOR } from '../utils/whatsapp';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, Sparkles, MessageCircle } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    productName: 'General Consultation / Order Enquiry',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete your Name, Phone Number, and Message.');
      return;
    }

    try {
      setSubmitting(true);
      await enquiriesApi.create({
        ...formData,
        email: formData.email.trim() || 'farmer@sriammanbiocare.com',
      });

      setSuccessMsg('Enquiry saved to SAB Admin! Opening WhatsApp to connect with Dr. R. Senthilkumar directly...');

      // Auto-dispatch to WhatsApp
      const waUrl = buildWhatsAppUrl(formData);
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 700);

      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        productName: 'General Consultation / Order Enquiry',
        message: '',
      });
    } catch (err) {
      const waUrl = buildWhatsAppUrl(formData);
      window.open(waUrl, '_blank');
      setSuccessMsg('Opening WhatsApp directly with Dr. R. Senthilkumar...');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Official Research Center & Production Unit
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white">
            Contact Sri Amman Biocare
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Directly connect with <strong>{SAB_PROPRIETOR}</strong> for Bio-fertilizers (Paddy Special), Vermicompost, Azolla, Student Internships, or Entrepreneurship Training.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Office & Laboratory Center</h3>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{SAB_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">82480 10800 / 98657 78873</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{SAB_EMAIL}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Monday – Saturday: 9:00 AM – 7:00 PM</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-[#25D366]/40 space-y-3">
              <div className="flex items-center gap-2 text-[#25D366] font-bold text-sm">
                <MessageCircle className="w-5 h-5 fill-[#25D366] text-slate-900" />
                <span>Direct WhatsApp Helpline</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect instantly on WhatsApp with Dr. R. Senthilkumar for urgent dosage advice, delivery dispatch, or student internship admission.
              </p>
              <button
                onClick={() => openWhatsAppDirect()}
                className="w-full py-2.5 rounded-xl font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>Open WhatsApp Chat (82480 10800)</span>
              </button>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Official Web & WhatsApp Enquiry Form</span>
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Fill the form below: details will be saved into SAB Admin Panel and immediately sent to WhatsApp!
              </p>

              {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
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
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Farm / College / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="Farm or University Name"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Subject / Product / Training
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="e.g. Paddy Special 3-in-1 / Vermicompost / Mushroom Training"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Message or Requirement Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your crop type, required liters, or training query..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-bold text-slate-950 bg-[#25D366] hover:bg-[#20bd5a] transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>{submitting ? 'Submitting...' : 'Submit & Open WhatsApp (82480 10800)'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
