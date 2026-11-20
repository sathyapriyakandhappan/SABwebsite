import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '../services/api';
import { openWhatsAppDirect } from '../utils/whatsapp';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Sprout,
  MessageCircle,
  FileText
} from 'lucide-react';

export default function ProductDetails({ onOpenEnquiry }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('specs');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productsApi.getById(id);
        if (res.data.success) {
          const prod = res.data.product;
          setProduct(prod);
          setSelectedImage(prod.image || (prod.images && prod.images[0]) || '');

          const relRes = await productsApi.getRelated(prod._id || prod.id);
          if (relRes.data.success) {
            setRelated(relRes.data.products);
          }
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center pt-24 text-xs">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center pt-24 px-4 text-center">
        <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
        <p className="text-slate-400 text-xs mb-4">The requested product could not be located in our catalog.</p>
        <Link to="/products" className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs">
          Return to Products
        </Link>
      </div>
    );
  }

  const allImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-8">
          <Link to="/" className="hover:text-emerald-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-emerald-400">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-emerald-400 font-semibold truncate">{product.name}</span>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Images */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-950/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-md">
                  {product.category}
                </span>
              </div>
              {product.price > 0 && (
                <div className="absolute top-4 right-4">
                  <span className="px-4 py-1.5 rounded-full text-sm font-black bg-emerald-500 text-slate-950 shadow-lg">
                    ₹{product.price}
                  </span>
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img
                        ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                Sri Amman Biocare Original
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price & Dosage Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {product.price > 0 && (
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-sm">
                  Price: ₹{product.price}
                </span>
              )}
              {product.dosage && (
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-medium">
                  Dosage: {product.dosage}
                </span>
              )}
              {product.applicationMethod && (
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  Method: {product.applicationMethod}
                </span>
              )}
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {product.description}
            </p>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Microbial Purity Tested • High CFU Guarantee • Residue-Free</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Manufactured at Sri Amman Biocare, 161 Pudukkottai Main Road, Thirukkanurpatti, Thanjavur - 613303.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenEnquiry ? onOpenEnquiry(product) : openWhatsAppDirect(`வணக்கம் Dr. R. Senthilkumar, I want to order ${product.name} ${product.price ? `(₹${product.price})` : ''}. Please share delivery process.`)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 text-xs shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>Order on WhatsApp (82480 10800)</span>
              </button>

              <button
                onClick={() => onOpenEnquiry && onOpenEnquiry(product)}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white text-xs border border-slate-700 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Web Enquiry Form</span>
              </button>
            </div>
          </div>
        </div>

        {/* Technical Tabs */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-16 shadow-xl">
          <div className="flex border-b border-slate-800 gap-4 mb-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'specs'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'features'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Key Features
            </button>
            <button
              onClick={() => setActiveTab('benefits')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'benefits'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Proven Agronomic Benefits
            </button>
          </div>

          {activeTab === 'specs' && (
            <div className="space-y-3">
              {product.specifications && product.specifications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <tbody>
                      {product.dosage && (
                        <tr className="border-b border-slate-800/80">
                          <td className="py-2.5 px-4 font-semibold text-slate-400 w-1/3">Dosage</td>
                          <td className="py-2.5 px-4 text-white font-medium">{product.dosage}</td>
                        </tr>
                      )}
                      {product.applicationMethod && (
                        <tr className="border-b border-slate-800/80">
                          <td className="py-2.5 px-4 font-semibold text-slate-400 w-1/3">Application Method</td>
                          <td className="py-2.5 px-4 text-white font-medium">{product.applicationMethod}</td>
                        </tr>
                      )}
                      {product.price > 0 && (
                        <tr className="border-b border-slate-800/80">
                          <td className="py-2.5 px-4 font-semibold text-slate-400 w-1/3">Retail Price</td>
                          <td className="py-2.5 px-4 text-emerald-400 font-bold">₹{product.price}</td>
                        </tr>
                      )}
                      {product.specifications.map((spec, index) => (
                        <tr key={index} className="border-b border-slate-800/80">
                          <td className="py-2.5 px-4 font-semibold text-slate-400 w-1/3">{spec.key}</td>
                          <td className="py-2.5 px-4 text-white font-medium">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Contact Dr. R. Senthilkumar for technical sheets.</p>
              )}
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-2">
              {product.features && product.features.length > 0 ? (
                product.features.map((feat, index) => (
                  <div key={index} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-200">{feat}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No feature bullet points listed.</p>
              )}
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="space-y-2">
              {product.benefits && product.benefits.length > 0 ? (
                product.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <Sprout className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-200">{benefit}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No specific benefits listed.</p>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">
              Related Bio-Products in {product.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel._id || rel.id}
                  to={`/products/${rel._id || rel.id}`}
                  className="h-full rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-4 flex flex-col justify-between transition-all hover:-translate-y-1 group"
                >
                  <div>
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 mb-3">
                      <img src={rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 min-h-[16px]">
                      {rel.name}
                    </h4>
                  </div>
                  {rel.price > 0 && (
                    <p className="text-xs font-bold text-emerald-400 mt-2">₹{rel.price}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
