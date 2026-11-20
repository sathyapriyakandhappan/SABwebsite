import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

export const getAllCategories = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;

    const categories = await Category.find(query);
    const allProducts = await Product.find({});

    // Compute live product counts dynamically and ensure clean plain objects
    const categoriesWithCounts = categories.map(cat => {
      const c = cat.toObject ? cat.toObject() : (cat._doc || cat);
      const catId = (c._id || c.id || '').toString();
      const catName = (c.name || '').toLowerCase();
      const count = allProducts.filter(p => {
        const prod = p.toObject ? p.toObject() : (p._doc || p);
        const pCatId = (prod.categoryId || '').toString();
        const pCatName = (prod.category || '').toLowerCase();
        return (catId && pCatId === catId) || (catName && pCatName === catName);
      }).length;

      return {
        _id: catId,
        id: catId,
        name: c.name || '',
        slug: c.slug || '',
        description: c.description || '',
        image: c.image || '',
        status: c.status || 'Active',
        productCount: count,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      };
    });

    res.json({ success: true, count: categoriesWithCounts.length, categories: categoriesWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories.', error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    let category = await Category.findById(id);
    if (!category) {
      category = await Category.findOne({ slug: id });
    }

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const c = category.toObject ? category.toObject() : (category._doc || category);
    const catId = (c._id || c.id || '').toString();
    const catName = (c.name || '').toLowerCase();

    const allProducts = await Product.find({});
    const count = allProducts.filter(p => {
      const prod = p.toObject ? p.toObject() : (p._doc || p);
      const pCatId = (prod.categoryId || '').toString();
      const pCatName = (prod.category || '').toLowerCase();
      return (catId && pCatId === catId) || (catName && pCatName === catName);
    }).length;

    res.json({
      success: true,
      category: {
        _id: catId,
        id: catId,
        name: c.name || '',
        slug: c.slug || '',
        description: c.description || '',
        image: c.image || '',
        status: c.status || 'Active',
        productCount: count,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch category.', error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, image, status } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const cleanName = name.trim();
    const slug = slugify(cleanName);

    // Check if category already exists
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A category with this name already exists.' });
    }

    const newCategory = await Category.create({
      name: cleanName,
      slug,
      description: description || '',
      image: image || '',
      status: status || 'Active',
    });

    res.status(201).json({ success: true, message: 'Category created successfully.', category: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category.', error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, status } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const updateData = {};
    if (name) {
      updateData.name = name.trim();
      updateData.slug = slugify(name.trim());
    }
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (status !== undefined) updateData.status = status;

    const updated = await Category.findByIdAndUpdate(id, updateData);

    // If category name was updated, update associated products
    if (name && name.trim() !== category.name) {
      const allProducts = await Product.find({});
      for (const prod of allProducts) {
        if (prod.categoryId === id || prod.category === category.name) {
          await Product.findByIdAndUpdate(prod._id || prod.id, {
            category: name.trim(),
            categoryId: id,
          });
        }
      }
    }

    res.json({ success: true, message: 'Category updated successfully.', category: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update category.', error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ success: false, message: 'Invalid category ID provided.' });
    }

    let category = await Category.findById(id);
    if (!category) {
      category = await Category.findOne({ slug: id });
    }
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const c = category.toObject ? category.toObject() : (category._doc || category);
    const catId = (c._id || c.id || id).toString();
    const catName = c.name;

    // Safely unassign any linked products so they are not broken
    const allProducts = await Product.find({});
    for (const prod of allProducts) {
      const p = prod.toObject ? prod.toObject() : (prod._doc || prod);
      if (
        (p.categoryId && p.categoryId.toString() === catId) ||
        (catName && p.category && p.category.toLowerCase() === catName.toLowerCase())
      ) {
        await Product.findByIdAndUpdate(p._id || p.id, {
          category: 'General Bio',
          categoryId: '',
        });
      }
    }

    await Category.findByIdAndDelete(catId);
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category.', error: error.message });
  }
};
