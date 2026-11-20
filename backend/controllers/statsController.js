import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Enquiry } from '../models/Enquiry.js';
import { Program } from '../models/Program.js';

export const getDashboardStats = async (req, res) => {
  try {
    const products = await Product.find({});
    const categories = await Category.find({});
    const enquiries = await Enquiry.find({});
    const programs = await Program.find({});

    const totalPrograms = programs.length;

    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'Active' || p.status === 'Featured').length;
    const featuredProducts = products.filter(p => p.status === 'Featured').length;

    const totalCategories = categories.length;
    const activeCategories = categories.filter(c => c.status === 'Active').length;

    const totalEnquiries = enquiries.length;
    const pendingEnquiries = enquiries.filter(e => e.status === 'Pending').length;
    const contactedEnquiries = enquiries.filter(e => e.status === 'Contacted').length;
    const resolvedEnquiries = enquiries.filter(e => e.status === 'Resolved').length;

    // Sort recent enquiries
    const recentEnquiries = [...enquiries]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);

    // Sort recently added products
    const recentProducts = [...products]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        featuredProducts,
        totalCategories,
        activeCategories,
        totalEnquiries,
        pendingEnquiries,
        contactedEnquiries,
        resolvedEnquiries,
        totalPrograms,
      },
      recentEnquiries,
      recentProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats.', error: error.message });
  }
};
