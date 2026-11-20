import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

export const getAllProducts = async (req, res) => {
  try {
    const { search, category, status, featured } = req.query;
    let products = await Product.find({});

    // Filter by status if provided
    if (status && status !== 'all') {
      products = products.filter(p => p.status === status);
    }

    // Filter by featured
    if (featured === 'true') {
      products = products.filter(p => p.status === 'Featured');
    }

    // Filter by category
    if (category && category !== 'all') {
      products = products.filter(p => 
        (p.category && p.category.toLowerCase() === category.toLowerCase()) ||
        (p.categoryId && p.categoryId === category)
      );
    }

    // Search query
    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      products = products.filter(p => 
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term)) ||
        (p.features && p.features.some(f => f.toLowerCase().includes(term)))
      );
    }

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products.', error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let products = await Product.find({});
    // Active or Featured
    let featured = products.filter(p => p.status === 'Featured' || p.status === 'Active');
    // Sort featured first, limit 6
    featured.sort((a, b) => {
      if (a.status === 'Featured' && b.status !== 'Featured') return -1;
      if (b.status === 'Featured' && a.status !== 'Featured') return 1;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    res.json({ success: true, count: featured.slice(0, 6).length, products: featured.slice(0, 6) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch featured products.', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id);
    if (!product) {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product.', error: error.message });
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const currentProduct = await Product.findById(id) || await Product.findOne({ slug: id });
    if (!currentProduct) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const currentId = currentProduct._id || currentProduct.id;
    const allProducts = await Product.find({});
    const related = allProducts
      .filter(p => {
        const pId = p._id || p.id;
        return pId !== currentId && 
          p.status !== 'Inactive' && 
          (p.category === currentProduct.category || p.categoryId === currentProduct.categoryId);
      })
      .slice(0, 4);

    res.json({ success: true, count: related.length, products: related });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch related products.', error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      categoryId,
      description,
      price,
      dosage,
      applicationMethod,
      image,
      images,
      specifications,
      features,
      benefits,
      status,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Product name is required.' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: 'Product category is required.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Product description is required.' });
    }

    // Slug generation
    const slug = slugify(name) + '-' + Math.random().toString(36).substring(2, 6);

    // Verify or find categoryId if not provided
    let verifiedCatId = categoryId;
    if (!verifiedCatId) {
      const cat = await Category.findOne({ name: category.trim() });
      if (cat) verifiedCatId = cat._id || cat.id;
    }

    // Parse specifications if string
    let parsedSpecs = specifications;
    if (typeof specifications === 'string') {
      try { parsedSpecs = JSON.parse(specifications); } catch { parsedSpecs = []; }
    }
    let parsedFeatures = features;
    if (typeof features === 'string') {
      try { parsedFeatures = JSON.parse(features); } catch { parsedFeatures = [features]; }
    }
    let parsedBenefits = benefits;
    if (typeof benefits === 'string') {
      try { parsedBenefits = JSON.parse(benefits); } catch { parsedBenefits = [benefits]; }
    }
    let parsedImages = images;
    if (typeof images === 'string') {
      try { parsedImages = JSON.parse(images); } catch { parsedImages = [images]; }
    }

    const newProduct = await Product.create({
      name: name.trim(),
      slug,
      category: category.trim(),
      categoryId: verifiedCatId || '',
      description: description.trim(),
      price: price ? Number(price) : 0,
      dosage: dosage ? dosage.trim() : '',
      applicationMethod: applicationMethod ? applicationMethod.trim() : '',
      image: image || (parsedImages && parsedImages[0]) || '',
      images: Array.isArray(parsedImages) ? parsedImages : (image ? [image] : []),
      specifications: Array.isArray(parsedSpecs) ? parsedSpecs : [],
      features: Array.isArray(parsedFeatures) ? parsedFeatures : [],
      benefits: Array.isArray(parsedBenefits) ? parsedBenefits : [],
      status: status || 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product.', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Product.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const {
      name,
      category,
      categoryId,
      description,
      price,
      dosage,
      applicationMethod,
      image,
      images,
      specifications,
      features,
      benefits,
      status,
    } = req.body;

    const updateData = {};
    if (name) {
      updateData.name = name.trim();
      updateData.slug = slugify(name) + '-' + (existing._id || existing.id).toString().substring(0, 4);
    }
    if (category) updateData.category = category.trim();
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) updateData.price = Number(price);
    if (dosage !== undefined) updateData.dosage = dosage.trim();
    if (applicationMethod !== undefined) updateData.applicationMethod = applicationMethod.trim();
    if (image !== undefined) updateData.image = image;
    if (images !== undefined) {
      updateData.images = Array.isArray(images) ? images : (typeof images === 'string' ? JSON.parse(images) : []);
    }
    if (specifications !== undefined) {
      updateData.specifications = Array.isArray(specifications) ? specifications : (typeof specifications === 'string' ? JSON.parse(specifications) : []);
    }
    if (features !== undefined) {
      updateData.features = Array.isArray(features) ? features : (typeof features === 'string' ? JSON.parse(features) : []);
    }
    if (benefits !== undefined) {
      updateData.benefits = Array.isArray(benefits) ? benefits : (typeof benefits === 'string' ? JSON.parse(benefits) : []);
    }
    if (status !== undefined) updateData.status = status;

    const updated = await Product.findByIdAndUpdate(id, updateData);

    res.json({
      success: true,
      message: 'Product updated successfully.',
      product: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product.', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Product.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product.', error: error.message });
  }
};
