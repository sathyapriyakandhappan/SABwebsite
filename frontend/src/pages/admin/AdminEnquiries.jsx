import React, { useState, useEffect } from 'react';
import { enquiriesApi } from '../../services/api';
import {
  Inbox,
  Search,
  Filter,
  Eye,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Building,
  Calendar,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Sparkles
} from 'lucide-react';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // View modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);

  // Status update
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [notes, setNotes] = useState('');

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await enquiriesApi.getAll({
        status: statusFilter,
        search: searchTerm,
      });
      if (res.data.success) {
        setEnquiries(res.data.enquiries);
      }
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter, searchTerm]);

  const openViewModal = (enq) => {
    setSelectedEnquiry(enq);
    setNotes(enq.notes || '');
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedEnquiry) return;
    try {
      setUpdatingStatus(true);
      const res = await enquiriesApi.updateStatus(selectedEnquiry._id || selectedEnquiry.id, {
        status: newStatus,
        notes: notes,
      });
      if (res.data.success) {
        setSelectedEnquiry(res.data.enquiry);
        fetchEnquiries();
      }
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!enquiryToDelete) return;
    try {
      await enquiriesApi.delete(enquiryToDelete._id || enquiryToDelete.id);
      setEnquiryToDelete(null);
      if (selectedEnquiry && (selectedEnquiry._id === enquiryToDelete._id || selectedEnquiry.id === enquiryToDelete.id)) {
        setSelectedEnquiry(null);
      }
      fetchEnquiries();
    } catch (err) {
      alert('Failed to delete enquiry');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Customer Enquiries Management</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Incoming buyer requests, farmer soil questions, and dealership applications.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, phone, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'Pending', 'Contacted', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-xs">Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">No enquiries found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Product Selected</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Received On</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {enquiries.map((e) => (
                  <tr key={e._id || e.id} className="hover:bg-slate-850 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block">{e.name}</span>
                      {e.company && <span className="text-[10px] text-slate-400 block">{e.company}</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="block text-slate-300 font-medium">{e.phone}</span>
                      <span className="block text-[10px] text-slate-400">{e.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {e.productName || 'General Enquiry'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-300 line-clamp-1 max-w-[260px]">{e.message}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          e.status === 'Pending'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : e.status === 'Contacted'
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                            : e.status === 'In Progress'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-400">
                      {e.createdAt ? new Date(e.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openViewModal(e)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEnquiryToDelete(e)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-300"
                          title="Delete Enquiry"
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

      {/* View & Update Enquiry Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Inbox className="w-4 h-4 text-emerald-400" />
                <span>Enquiry Details</span>
              </h3>
              <button onClick={() => setSelectedEnquiry(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl space-y-2 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{selectedEnquiry.name}</span>
                  <span className="text-slate-400">
                    {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-300">
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {selectedEnquiry.phone}</span>
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-400" /> {selectedEnquiry.email}</span>
                </div>
                {selectedEnquiry.company && (
                  <p className="flex items-center gap-1.5 text-slate-400">
                    <Building className="w-3.5 h-3.5 text-slate-500" /> {selectedEnquiry.company}
                  </p>
                )}
              </div>

              {/* Prominent Product Spotlight in Modal */}
              <div className="p-4 bg-emerald-950/40 border-2 border-emerald-500/40 rounded-2xl space-y-1.5 shadow-inner">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Enquired Product / Service:
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <p className="text-base font-extrabold text-white">{selectedEnquiry.productName || 'General Consultation'}</p>
                  {selectedEnquiry.productId && (
                    <a
                      href={`/products/${selectedEnquiry.productId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 shrink-0"
                    >
                      <span>View Live Product</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                {selectedEnquiry.productId && (
                  <p className="text-[10px] text-slate-400">Database ID: {selectedEnquiry.productId}</p>
                )}
              </div>

              <div>
                <span className="font-bold text-slate-300 block mb-1">Message from Customer:</span>
                <p className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed text-xs">
                  {selectedEnquiry.message}
                </p>
              </div>

              {/* Instant WhatsApp Reply Button */}
              {selectedEnquiry.phone && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400">Quick Reply via WhatsApp:</span>
                  <a
                    href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`வணக்கம் ${selectedEnquiry.name}, regarding your enquiry for ${selectedEnquiry.productName} at Sri Amman Biocare:`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 transition-all shadow-md"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              )}

              {/* Status Switcher */}
              <div>
                <span className="font-bold text-slate-300 block mb-1.5">Change Status:</span>
                <div className="flex flex-wrap gap-2">
                  {['Pending', 'Contacted', 'In Progress', 'Resolved'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(st)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        selectedEnquiry.status === st
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <span className="font-bold text-slate-300 block mb-1">Staff Internal Notes:</span>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record call outcome, quote sent, or agronomist comments..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setEnquiryToDelete(selectedEnquiry)}
                className="text-rose-400 hover:text-rose-300 text-xs font-semibold"
              >
                Delete Enquiry
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedEnquiry.status)}
                disabled={updatingStatus}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {enquiryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
            <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Delete Customer Enquiry</span>
            </h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete the enquiry from <strong>{enquiryToDelete.name}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setEnquiryToDelete(null)} className="px-4 py-2 text-xs text-slate-400">
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
