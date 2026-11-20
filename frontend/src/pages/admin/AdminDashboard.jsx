import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsApi } from '../../services/api';
import {
  Package,
  Layers,
  Inbox,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await statsApi.getDashboard();
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 text-sm">
        Loading live dashboard analytics...
      </div>
    );
  }

  const { stats, recentEnquiries = [], recentProducts = [] } = data || {};

  return (
    <div className="space-y-8">
      {/* Title & Quick Add Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Dashboard Overview</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time synchronization across Sri Amman Biocare catalog and customer requests.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/products"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            to="/admin/categories"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Products */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Total Products</p>
            <p className="text-3xl font-black text-white">{stats?.totalProducts || 0}</p>
            <p className="text-[11px] text-emerald-400 font-semibold">{stats?.activeProducts || 0} Active in Store</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Categories */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Product Categories</p>
            <p className="text-3xl font-black text-white">{stats?.totalCategories || 0}</p>
            <p className="text-[11px] text-teal-400 font-semibold">Live Bio Classifications</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Total Enquiries */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Total Enquiries</p>
            <p className="text-3xl font-black text-white">{stats?.totalEnquiries || 0}</p>
            <p className="text-[11px] text-cyan-400 font-semibold">{stats?.resolvedEnquiries || 0} Resolved</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Actions */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-amber-400">Pending Enquiries</p>
            <p className="text-3xl font-black text-amber-400">{stats?.pendingEnquiries || 0}</p>
            <p className="text-[11px] text-slate-400">Needs Follow-Up</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Recent Enquiries & Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Inbox className="w-4 h-4 text-emerald-400" />
              <span>Recent Customer Enquiries</span>
            </h3>
            <Link
              to="/admin/enquiries"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No enquiries received yet.</p>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map((enq) => (
                <div
                  key={enq._id || enq.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{enq.name}</span>
                      <span className="text-[10px] text-slate-400">• {enq.phone}</span>
                    </div>
                    <div className="pt-0.5 pb-0.5">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        🌾 {enq.productName || 'General Enquiry'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{enq.message}</p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                      enq.status === 'Pending'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : enq.status === 'Contacted'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Added Products (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Recently Added Products</span>
            </h3>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No products created yet.</p>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((p) => (
                <div
                  key={p._id || p.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                    <img
                      src={p.image || 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=400&q=80'}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                    <p className="text-[11px] text-emerald-400 truncate">{p.category}</p>
                    <span className="text-[10px] text-slate-400 font-medium">Status: {p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
