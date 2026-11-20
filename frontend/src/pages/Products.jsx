import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productsApi, categoriesApi } from '../services/api';
import { openWhatsAppDirect } from '../utils/whatsapp';
import { Search, Filter, Sparkles, Sprout, ArrowRight, CheckCircle2, ChevronRight, MessageCircle } from 'lucide-react';

export default function Products({ onOpenEnquiry }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'all';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Sync selectedCategory when URL query parameter changes
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoriesApi.getAll({ status: 'Active' });
        if (res.data.success) {
          setCategories(res.data.categories || []);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = { status: 'all' };
        if (selectedCategory && selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        const res = await productsApi.getAll(params);
        if (res.data.success) {
          setProducts(res.data.products.filter(p => p.status !== 'Inactive'));
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    const newParams = new URLSearchParams(searchParams);
    if (!catName || catName === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catName);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-20 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-10 space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="hover:text-emerald-400">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-400 font-semibold">Products Catalog</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Bio-Agricultural Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            Manufactured by Sri Amman Biocare, Thanjavur (Estd 2007). Bio-fertilizers, Biocontrol agents, Bio-pesticides, Bio-insecticides, Bio-tonics, Vermicompost, Earthworms & Azolla.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name, category, crop, or pest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="text-xs text-slate-400 font-medium px-2 flex items-center gap-1.5 self-center">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>Showing <strong className="text-emerald-400">{products.length}</strong> bio-solutions</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mb-10 flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryClick('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((cat, idx) => {
            const catName = cat.name || '';
            const isActive = selectedCategory && selectedCategory !== 'all' && selectedCategory.toLowerCase() === catName.toLowerCase();
            return (
              <button
                key={cat._id || cat.id || idx}
                onClick={() => handleCategoryClick(catName)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {catName}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-24 text-slate-500 text-xs">Loading bio-products from database...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-3xl bg-slate-900/50 border border-slate-800">
            <Sprout className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No products match your criteria</h3>
            <p className="text-xs text-slate-400 mb-4">Try clearing your search query or selecting a different category.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const prodId = product._id || product.id;
              return (
                <div
                  key={prodId}
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

                      <div className="pt-1 space-y-1 min-h-[44px]">
                        {product.features && product.features.length > 0 ? (
                          product.features.slice(0, 2).map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{feat}</span>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>100% Certified Eco-Safe Formulation</span>
                          </div>
                        )}
                      </div>
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
                      onClick={() => onOpenEnquiry ? onOpenEnquiry(product) : openWhatsAppDirect(`வணக்கம் Dr. R. Senthilkumar, I want to order ${product.name} ${product.price ? `(₹${product.price})` : ''}. Please share delivery process.`)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 transition-all shadow-md"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Order</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
