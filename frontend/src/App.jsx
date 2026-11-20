import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EnquiryModal from './components/EnquiryModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Training from './pages/Training';
import Programs from './pages/Programs';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminPrograms from './pages/admin/AdminPrograms';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminSettings from './pages/admin/AdminSettings';
import ProtectedRoute from './components/admin/ProtectedRoute';

import { productsApi } from './services/api';

// Public Layout Wrapper
function PublicLayout({ children, onOpenEnquiry }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 relative">
      <Navbar onOpenEnquiry={onOpenEnquiry} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedProductForEnquiry, setSelectedProductForEnquiry] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await productsApi.getAll({ status: 'Active' });
        if (res.data.success) {
          setAllProducts(res.data.products);
        }
      } catch (err) {
        console.warn('Catalog fetch notice:', err.message);
      }
    };
    fetchCatalog();
  }, []);

  const handleOpenEnquiry = (product = null) => {
    setSelectedProductForEnquiry(product);
    setIsEnquiryOpen(true);
  };

  const handleCloseEnquiry = () => {
    setIsEnquiryOpen(false);
    setSelectedProductForEnquiry(null);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          {/* Public User Facing Routes */}
          <Route
            path="/"
            element={
              <PublicLayout onOpenEnquiry={handleOpenEnquiry}>
                <Home onOpenEnquiry={handleOpenEnquiry} />
              </PublicLayout>
            }
          />
          <Route
            path="/products"
            element={
              <PublicLayout onOpenEnquiry={handleOpenEnquiry}>
                <Products onOpenEnquiry={handleOpenEnquiry} />
              </PublicLayout>
            }
          />
          <Route
            path="/products/:id"
            element={
              <PublicLayout onOpenEnquiry={handleOpenEnquiry}>
                <ProductDetails onOpenEnquiry={handleOpenEnquiry} />
              </PublicLayout>
            }
          />
          <Route
            path="/training"
            element={
              <PublicLayout onOpenEnquiry={handleOpenEnquiry}>
                <Training onOpenEnquiry={handleOpenEnquiry} />
              </PublicLayout>
            }
          />
          <Route
            path="/programs"
            element={
              <PublicLayout onOpenEnquiry={handleOpenEnquiry}>
                <Programs onOpenEnquiry={handleOpenEnquiry} />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout onOpenEnquiry={handleOpenEnquiry}>
                <AboutUs onOpenEnquiry={handleOpenEnquiry} />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout onOpenEnquiry={handleOpenEnquiry}>
                <ContactUs />
              </PublicLayout>
            }
          />

          {/* Admin Login Route (Secret - Not linked in Public UI) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/sab-admin" element={<Navigate to="/admin/login" replace />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="programs" element={<AdminPrograms />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* Fallback 404 Route */}
          <Route
            path="*"
            element={
              <PublicLayout onOpenEnquiry={handleOpenEnquiry}>
                <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
                  <h1 className="text-6xl font-black text-emerald-400 mb-2">404</h1>
                  <p className="text-xl font-bold text-white mb-2">Page Not Found</p>
                  <p className="text-xs text-slate-400 mb-6">
                    The requested agricultural page or bio-product does not exist.
                  </p>
                  <a
                    href="/"
                    className="px-6 py-2.5 rounded-xl font-bold bg-emerald-500 text-slate-950 text-xs"
                  >
                    Return to Homepage
                  </a>
                </div>
              </PublicLayout>
            }
          />
        </Routes>

        {/* Global Enquiry Modal */}
        <EnquiryModal
          isOpen={isEnquiryOpen}
          onClose={handleCloseEnquiry}
          preselectedProduct={selectedProductForEnquiry}
          products={allProducts}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
