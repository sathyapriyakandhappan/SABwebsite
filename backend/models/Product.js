import mongoose from 'mongoose';
import { getIsMongoConnected, JSONCollection } from '../config/db.js';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, lowercase: true, trim: true },
  category: { type: String, required: true },
  categoryId: { type: String },
  description: { type: String, required: true },
  price: { type: Number, default: 0 },
  dosage: { type: String, default: '' },
  applicationMethod: { type: String, default: '' },
  image: { type: String, default: '' },
  images: [{ type: String }],
  specifications: [{
    key: { type: String },
    value: { type: String },
  }],
  features: [{ type: String }],
  benefits: [{ type: String }],
  status: { type: String, enum: ['Active', 'Inactive', 'Featured'], default: 'Active' },
}, { timestamps: true });

const MongooseProduct = mongoose.models.Product || mongoose.model('Product', productSchema);
const jsonProduct = new JSONCollection('products');

export const Product = {
  async find(query = {}) {
    if (getIsMongoConnected()) {
      try {
        return await MongooseProduct.find(query).lean().sort({ createdAt: -1 });
      } catch (err) {
        console.warn('Mongoose find fallback to JSON:', err.message);
      }
    }
    return await jsonProduct.find(query);
  },

  async findById(id) {
    if (getIsMongoConnected()) {
      try {
        return await MongooseProduct.findById(id).lean();
      } catch (err) {
        console.warn('Mongoose findById fallback to JSON:', err.message);
      }
    }
    return await jsonProduct.findById(id);
  },

  async findOne(query = {}) {
    if (getIsMongoConnected()) {
      try {
        return await MongooseProduct.findOne(query).lean();
      } catch (err) {
        console.warn('Mongoose findOne fallback to JSON:', err.message);
      }
    }
    return await jsonProduct.findOne(query);
  },

  async create(data) {
    let result = null;
    if (getIsMongoConnected()) {
      try {
        result = await MongooseProduct.create(data);
      } catch (err) {
        console.warn('Mongoose create error:', err.message);
      }
    }
    // Also mirror to JSON persistence
    try {
      const jsonDoc = result ? result.toObject ? result.toObject() : result : data;
      await jsonProduct.create(jsonDoc);
    } catch (e) {}
    return result || await jsonProduct.create(data);
  },

  async findByIdAndUpdate(id, update) {
    let result = null;
    if (getIsMongoConnected()) {
      try {
        result = await MongooseProduct.findByIdAndUpdate(id, update, { new: true });
      } catch (err) {
        console.warn('Mongoose findByIdAndUpdate error:', err.message);
      }
    }
    try {
      await jsonProduct.findByIdAndUpdate(id, update);
    } catch (e) {}
    return result || await jsonProduct.findByIdAndUpdate(id, update);
  },

  async findByIdAndDelete(id) {
    let result = null;
    if (getIsMongoConnected()) {
      try {
        result = await MongooseProduct.findByIdAndDelete(id);
      } catch (err) {
        console.warn('Mongoose findByIdAndDelete error:', err.message);
      }
    }
    try {
      await jsonProduct.findByIdAndDelete(id);
    } catch (e) {}
    return result || await jsonProduct.findByIdAndDelete(id);
  },

  async countDocuments(query = {}) {
    if (getIsMongoConnected()) {
      try {
        return await MongooseProduct.countDocuments(query);
      } catch (err) {
        console.warn('Mongoose countDocuments fallback:', err.message);
      }
    }
    return await jsonProduct.countDocuments(query);
  }
};
