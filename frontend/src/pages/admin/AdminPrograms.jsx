import React, { useState, useEffect } from 'react';
import { programsApi, uploadApi } from '../../services/api';
import {
  Calendar,
  Building2,
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  BookOpen
} from 'lucide-react';

export default function AdminPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programToDelete, setProgramToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    institution: '',
    topic: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Resource Person',
    image: '',
    description: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await programsApi.getAll();
      if (res.data.success) {
        setPrograms(res.data.programs);
      }
    } catch (err) {
      console.error('Failed to load programs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const openAddModal = () => {
    setSelectedProgram(null);
    setFormData({
      title: '',
      institution: '',
      topic: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Resource Person',
      image: '/assets/program1.jpeg',
      description: '',
    });
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  const openEditModal = (prog) => {
    setSelectedProgram(prog);
    setFormData({
      title: prog.title || '',
      institution: prog.institution || '',
      topic: prog.topic || '',
      date: prog.date || '',
      category: prog.category || 'Resource Person',
      image: prog.image || '',
      description: prog.description || '',
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
      setUploadingImage(true);
      setFormError('');
      const res = await uploadApi.uploadSingle(data);
      if (res.data.success) {
        setFormData(prev => ({ ...prev, image: `${import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000'}${res.data.url}` }));
      }
    } catch (err) {
      setFormError('Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.title.trim() || !formData.institution.trim()) {
      setFormError('Please provide Program Title and Institution name.');
      return;
    }

    try {
      if (selectedProgram) {
        const res = await programsApi.update(selectedProgram._id || selectedProgram.id, formData);
        if (res.data.success) {
          setFormSuccess('Program updated successfully!');
          setTimeout(() => {
            setIsModalOpen(false);
            fetchPrograms();
          }, 800);
        }
      } else {
        const res = await programsApi.create(formData);
        if (res.data.success) {
          setFormSuccess('Program created successfully!');
          setTimeout(() => {
            setIsModalOpen(false);
            fetchPrograms();
          }, 800);
        }
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save program.');
    }
  };

  const handleDelete = async () => {
    if (!programToDelete) return;
    try {
      await programsApi.delete(programToDelete._id || programToDelete.id);
      setIsDeleteModalOpen(false);
      setProgramToDelete(null);
      fetchPrograms();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Resource Person Programs & Visits</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage college lectures, institutional workshops, MoU ceremonies, and field demonstrations.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Program / Visit</span>
        </button>
      </div>

      {/* Programs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-xs">Loading programs...</div>
        ) : programs.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">No program records created yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Program Photo & Title</th>
                  <th className="py-3.5 px-4">Institution / College</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Event Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {programs.map((prog) => (
                  <tr key={prog._id || prog.id} className="hover:bg-slate-850 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                          <img
                            src={prog.image || '/assets/program1.jpeg'}
                            alt={prog.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = '/assets/program1.jpeg'; }}
                          />
                        </div>
                        <div className="overflow-hidden">
                          <span className="font-bold text-white block truncate max-w-[240px]">{prog.title}</span>
                          <span className="text-[10px] text-slate-400 truncate block max-w-[240px]">{prog.topic}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-emerald-400 block truncate max-w-[200px]">
                        {prog.institution}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-emerald-300 border border-slate-700">
                        {prog.category || 'Resource Person'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-400">
                      {prog.date || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(prog)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="Edit Program"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setProgramToDelete(prog);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-300"
                          title="Delete Program"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>{selectedProgram ? 'Edit Institutional Event' : 'Add New Program / Lecture Event'}</span>
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
                <label className="block font-semibold text-slate-300 mb-1">Program Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Resource Person: Mass Production of Biofertilizers"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Institution / College Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="e.g. Agricultural College & Research Institute"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Resource Person">Resource Person</option>
                    <option value="Industrial Visit">Industrial Visit</option>
                    <option value="College Internship">College Internship</option>
                    <option value="Entrepreneurship Training">Entrepreneurship Training</option>
                    <option value="College Workshop">College Workshop</option>
                    <option value="MoU Signing">MoU Signing</option>
                    <option value="Field Visit">Field Visit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Lecture Topic / Subject</label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g. Mushroom Spawn & Vermicomposting"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Event Photo (Upload or URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/assets/program1.jpeg or image URL..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer shrink-0 flex items-center gap-1 border border-slate-700">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {formData.image && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <img src={formData.image} alt="preview" className="w-12 h-10 rounded object-cover" />
                  <span className="text-[10px] text-slate-400 truncate flex-1">{formData.image}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description / Summary</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of student participation, topics covered, and training outcome..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
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
                  {selectedProgram ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && programToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
            <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Delete Program Record</span>
            </h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete <strong>{programToDelete.title}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-xs text-slate-400">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl"
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
