import React, { useState, useEffect } from 'react';
import { enquiriesApi } from '../services/api';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { X, Send, CheckCircle2, AlertCircle, Sparkles, MessageCircle } from 'lucide-react';

export default function EnquiryModal({ isOpen, onClose, preselectedProduct = null, products = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    productId: '',
    productName: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (preselectedProduct) {
      setFormData(prev => ({
        ...prev,
        productId: preselectedProduct._id || preselectedProduct.id || '',
        productName: preselectedProduct.name || '',
        message: prev.message || `Hello Dr. R. Senthilkumar, I am interested in purchasing ${preselectedProduct.name}${preselectedProduct.price ? ` (₹${preselectedProduct.price})` : ''}. Please share dosage guidelines and availability.`,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        productId: '',
        productName: 'General Bio-Product / Training Enquiry',
      }));
    }
  }, [preselectedProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in your Name, Phone Number, and Message.');
      return;
    }

    try {
      setSubmitting(true);
      // 1. Save to Database for Admin Panel
      const res = await enquiriesApi.create({
        ...formData,
        email: formData.email.trim() || 'farmer@sriammanbiocare.com', // fallback if empty
      });

      if (res.data.success) {
        setSuccessMsg('Enquiry saved to SAB Admin! Opening WhatsApp to connect with Dr. R. Senthilkumar...');

        // 2. Build WhatsApp URL and open immediately
        const waUrl = buildWhatsAppUrl(formData);
        setTimeout(() => {
          window.open(waUrl, '_blank');
        }, 800);

        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 3000);
      }
    } catch (err) {
      // Even if API has connection hiccup, open WhatsApp so customer is never blocked
      const waUrl = buildWhatsAppUrl(formData);
      window.open(waUrl, '_blank');
      setSuccessMsg('Opening WhatsApp directly with Dr. R. Senthilkumar...');
      setTimeout(() => {
        onClose();
      }, 2500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 text-white overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-bold text-white">Direct Advisory Enquiry</h3>
              <p className="text-[11px] text-slate-400">Dr. R. Senthilkumar • Sri Amman Biocare</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Messages */}
        {successMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs text-left">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Your Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar (Farmer / Dealer / Student)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Phone Number (WhatsApp) <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="+91 82480..."
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              College / Farm / Company Name
            </label>
            <input
              type="text"
              placeholder="e.g. Thanjavur Farmers Trust / Agri College"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Selected Product or Service
            </label>
            {products && products.length > 0 ? (
              <select
                value={formData.productId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const prod = products.find(p => (p._id || p.id) === selectedId);
                  setFormData({
                    ...formData,
                    productId: selectedId,
                    productName: prod ? prod.name : 'General Bio Enquiry',
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- General / Training / Internship Enquiry --</option>
                {products.map(p => (
                  <option key={p._id || p.id} value={p._id || p.id}>
                    {p.name} {p.price ? `(₹${p.price})` : ''} - {p.category}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                readOnly
                value={formData.productName || 'General Bio-Product Enquiry'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300"
              />
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Message & Quantity Needed <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="State your crop acreages, training requirement, or volume needed..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <span className="text-[10px] text-emerald-400/90 flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" /> Direct WhatsApp dispatch
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>{submitting ? 'Submitting...' : 'Send on WhatsApp'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
