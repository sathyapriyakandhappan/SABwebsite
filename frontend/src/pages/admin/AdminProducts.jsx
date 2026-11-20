import React, { useState, useEffect } from 'react';
import { productsApi, categoriesApi, uploadApi } from '../../services/api';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  Layers
} from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    categoryId: '',
    description: '',
    price: 0,
    dosage: '',
    applicationMethod: '',
    image: '',
    images: [],
    specifications: [{ key: '', value: '' }],
    features: [''],
    benefits: [''],
    status: 'Active',
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchProductsAndCategories = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        productsApi.getAll({ status: 'all' }),
        categoriesApi.getAll({ status: 'Active' }),
      ]);
      if (prodRes.data.success) {
        setProducts(prodRes.data.products);
      }
      if (catRes.data.success) {
        setCategories(catRes.data.categories);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const openAddModal = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      category: categories.length > 0 ? categories[0].name : '',
      categoryId: categories.length > 0 ? (categories[0]._id || categories[0].id) : '',
      description: '',
      price: 550,
      dosage: '1000 ml per acre',
      applicationMethod: 'Soil application by sowing',
      image: '',
      images: [],
      specifications: [
        { key: 'Active Strain', value: '' },
        { key: 'CFU Count', value: '1 x 10^9 CFU/ml' },
        { key: 'Target Crops', value: '' },
        { key: 'Dosage', value: '1 Litre per acre' },
      ],
      features: ['100% Eco-friendly biological formulation'],
      benefits: ['Enhances crop yield and restores soil health'],
      status: 'Active',
    });
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || '',
      categoryId: product.categoryId || '',
      description: product.description || '',
      price: product.price || 0,
      dosage: product.dosage || '',
      applicationMethod: product.applicationMethod || '',
      image: product.image || '',
      images: product.images || [],
      specifications: product.specifications && product.specifications.length > 0
        ? product.specifications
        : [{ key: '', value: '' }],
      features: product.features && product.features.length > 0 ? product.features : [''],
      benefits: product.benefits && product.benefits.length > 0 ? product.benefits : [''],
      status: product.status || 'Active',
    });
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image file size must be less than 5MB.');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      setUploadingImage(true);
      setFormError('');
      const res = await uploadApi.uploadSingle(uploadData);
      if (res.data.success) {
        const fullUrl = `${import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000'}${res.data.url}`;
        setFormData(prev => ({
          ...prev,
          image: fullUrl,
          images: prev.images.includes(fullUrl) ? prev.images : [...prev.images, fullUrl],
        }));
      }
    } catch (err) {
      setFormError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (!formData.category.trim()) {
      setFormError('Category is required.');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Product description is required.');
      return;
    }

    // Filter clean specs, features, benefits
    const cleanSpecs = formData.specifications.filter(s => s.key && s.key.trim());
    const cleanFeatures = formData.features.filter(f => f && f.trim());
    const cleanBenefits = formData.benefits.filter(b => b && b.trim());

    const payload = {
      ...formData,
      specifications: cleanSpecs,
      features: cleanFeatures,
      benefits: cleanBenefits,
    };

    try {
      if (selectedProduct) {
        const res = await productsApi.update(selectedProduct._id || selectedProduct.id, payload);
        if (res.data.success) {
          setFormSuccess('Product updated successfully!');
          setTimeout(() => {
            setIsModalOpen(false);
            fetchProductsAndCategories();
          }, 1000);
        }
      } else {
        const res = await productsApi.create(payload);
        if (res.data.success) {
          setFormSuccess('Product added successfully!');
          setTimeout(() => {
            setIsModalOpen(false);
            fetchProductsAndCategories();
          }, 1000);
        }
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save product.');
    }
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await productsApi.delete(productToDelete._id || productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProductsAndCategories();
    } catch (err) {
      alert('Failed to delete product: ' + (err.response?.data?.message || err.message));
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchTerm.trim() || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || 
      p.category.toLowerCase() === categoryFilter.toLowerCase();

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Product Catalog Management</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Create, update, or remove bio-fertilizers and organic solutions across live store.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name, strain, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 flex-1 md:flex-none"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c._id || c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 flex-1 md:flex-none"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Featured">Featured</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-xs">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No products found matching the criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Specs & Features</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProducts.map((p) => (
                  <tr key={p._id || p.id} className="hover:bg-slate-850 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                          <img
                            src={p.image || 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=200&q=80'}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <span className="font-bold text-white block truncate max-w-[200px]">{p.name}</span>
                          <span className="text-[10px] text-slate-400 truncate block max-w-[200px]">{p.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-emerald-400">{p.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'Featured'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : p.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px]">
                      <span>{p.specifications?.length || 0} specs</span> • <span>{p.features?.length || 0} features</span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-400">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/products/${p._id || p.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
                          title="View on Live Website"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(p)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-300 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* ADD / EDIT PRODUCT MODAL */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <span>{selectedProduct ? 'Edit Bio-Product' : 'Add New Bio-Product'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. SAB Azospirillum Bio-Inoculant"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const selectedCat = categories.find(c => c.name === e.target.value);
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        categoryId: selectedCat ? (selectedCat._id || selectedCat.id) : '',
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map(c => (
                      <option key={c._id || c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Product Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive agronomic explanation of the active microbial strain, mode of action, and crop utility..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Price, Dosage & Application Method */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 550"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="e.g. 1000 ml per acre"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Application Method
                  </label>
                  <input
                    type="text"
                    value={formData.applicationMethod}
                    onChange={(e) => setFormData({ ...formData, applicationMethod: e.target.value })}
                    placeholder="e.g. Soil application by sowing"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Status and Image URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Product Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Active">Active (Visible in Catalog)</option>
                    <option value="Featured">Featured (Promoted on Homepage)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Product Image (File Upload or Direct URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Image URL or upload below..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    />
                    <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer shrink-0 flex items-center gap-1 border border-slate-700">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? '...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <img src={formData.image} alt="preview" className="w-12 h-12 rounded object-cover" />
                  <span className="text-[11px] text-slate-400 truncate flex-1">{formData.image}</span>
                </div>
              )}

              {/* Technical Specifications */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Technical Specifications (Key - Value)</span>
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      specifications: [...formData.specifications, { key: '', value: '' }]
                    })}
                    className="text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Spec
                  </button>
                </div>

                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Spec Key (e.g. Active Organism)"
                      value={spec.key}
                      onChange={(e) => {
                        const updated = [...formData.specifications];
                        updated[index].key = e.target.value;
                        setFormData({ ...formData, specifications: updated });
                      }}
                      className="w-1/2 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 1x10^9 CFU/ml)"
                      value={spec.value}
                      onChange={(e) => {
                        const updated = [...formData.specifications];
                        updated[index].value = e.target.value;
                        setFormData({ ...formData, specifications: updated });
                      }}
                      className="w-1/2 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />
                    {formData.specifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.specifications.filter((_, i) => i !== index);
                          setFormData({ ...formData, specifications: updated });
                        }}
                        className="text-rose-400 p-1 hover:text-rose-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Key Features */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Features (Bullet Points)</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                    className="text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Feature
                  </button>
                </div>
                {formData.features.map((feat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. High nitrogen fixing capability"
                      value={feat}
                      onChange={(e) => {
                        const updated = [...formData.features];
                        updated[index] = e.target.value;
                        setFormData({ ...formData, features: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.features.filter((_, i) => i !== index);
                          setFormData({ ...formData, features: updated });
                        }}
                        className="text-rose-400 p-1 hover:text-rose-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Proven Benefits */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Agronomic Benefits</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, benefits: [...formData.benefits, ''] })}
                    className="text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Benefit
                  </button>
                </div>
                {formData.benefits.map((ben, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Increases harvest yield by 20%"
                      value={ben}
                      onChange={(e) => {
                        const updated = [...formData.benefits];
                        updated[index] = e.target.value;
                        setFormData({ ...formData, benefits: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />
                    {formData.benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.benefits.filter((_, i) => i !== index);
                          setFormData({ ...formData, benefits: updated });
                        }}
                        className="text-rose-400 p-1 hover:text-rose-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20"
                >
                  {selectedProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Bio-Product</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete <strong>{productToDelete.name}</strong>? This action cannot be undone and will remove it from the catalog immediately.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
