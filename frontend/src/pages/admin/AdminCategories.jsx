import React, { useState, useEffect } from 'react';
import { categoriesApi, uploadApi } from '../../services/api';
import { Layers, Plus, Edit, Trash2, X, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'Active',
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoriesApi.getAll();
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      status: 'Active',
    });
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setSelectedCategory(cat);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
      status: cat.status || 'Active',
    });
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      setUploading(true);
      const res = await uploadApi.uploadSingle(data);
      if (res.data.success) {
        setFormData(prev => ({ ...prev, image: `${import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000'}${res.data.url}` }));
      }
    } catch (err) {
      setFormError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    try {
      if (selectedCategory) {
        const res = await categoriesApi.update(selectedCategory._id || selectedCategory.id, formData);
        if (res.data.success) {
          setFormSuccess('Category updated successfully!');
          setTimeout(() => {
            setIsModalOpen(false);
            fetchCategories();
          }, 800);
        }
      } else {
        const res = await categoriesApi.create(formData);
        if (res.data.success) {
          setFormSuccess('Category created successfully!');
          setTimeout(() => {
            setIsModalOpen(false);
            fetchCategories();
          }, 800);
        }
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save category.');
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await categoriesApi.delete(categoryToDelete._id || categoryToDelete.id);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Category Management</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Define classification segments for bio-fertilizers, bio-pesticides, and soil conditioners.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-xs">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="py-16 text-center text-slate-500 text-xs">No categories created yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id || cat.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {cat.image ? (
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-800 shrink-0 bg-slate-950">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <Layers className="w-5 h-5" />
                    </div>
                  )}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      cat.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cat.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{cat.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cat.description || 'No description provided.'}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-400">{cat.productCount || 0} Products</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Edit Category"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setCategoryToDelete(cat);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {selectedCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            {formSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Bio-Fungicides"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this category..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category Image (Upload or URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Image URL or click Upload..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer shrink-0 flex items-center gap-1 border border-slate-700">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {formData.image && (
                <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <img src={formData.image} alt="Category preview" className="w-12 h-12 rounded-lg object-cover" />
                  <span className="text-[11px] text-slate-400 truncate flex-1">{formData.image}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                >
                  {selectedCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 text-rose-400">
              <AlertCircle className="w-5 h-5" />
              <span>Delete Category</span>
            </h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete <strong>{categoryToDelete.name}</strong>? Any linked products will be safely reassigned to General Bio.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
