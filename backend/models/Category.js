import mongoose from 'mongoose';
import { getIsMongoConnected, JSONCollection } from '../config/db.js';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

const MongooseCategory = mongoose.models.Category || mongoose.model('Category', categorySchema);
const jsonCategory = new JSONCollection('categories');

export const Category = {
  async find(query = {}) {
    if (getIsMongoConnected()) {
      try {
        return await MongooseCategory.find(query).lean().sort({ createdAt: -1 });
      } catch (err) {
        console.warn('Mongoose find fallback to JSON:', err.message);
      }
    }
    return await jsonCategory.find(query);
  },

  async findById(id) {
    if (getIsMongoConnected()) {
      try {
        return await MongooseCategory.findById(id).lean();
      } catch (err) {
        console.warn('Mongoose findById fallback to JSON:', err.message);
      }
    }
    return await jsonCategory.findById(id);
  },

  async findOne(query = {}) {
    if (getIsMongoConnected()) {
      try {
        return await MongooseCategory.findOne(query).lean();
      } catch (err) {
        console.warn('Mongoose findOne fallback to JSON:', err.message);
      }
    }
    return await jsonCategory.findOne(query);
  },

  async create(data) {
    let result = null;
    if (getIsMongoConnected()) {
      try {
        result = await MongooseCategory.create(data);
      } catch (err) {
        console.warn('Mongoose category create error:', err.message);
      }
    }
    try {
      const jsonDoc = result ? (result.toObject ? result.toObject() : result) : data;
      await jsonCategory.create(jsonDoc);
    } catch (e) {}
    return result || await jsonCategory.create(data);
  },

  async findByIdAndUpdate(id, update) {
    let result = null;
    if (getIsMongoConnected()) {
      try {
        result = await MongooseCategory.findByIdAndUpdate(id, update, { new: true });
      } catch (err) {
        console.warn('Mongoose findByIdAndUpdate error:', err.message);
      }
    }
    try {
      await jsonCategory.findByIdAndUpdate(id, update);
    } catch (e) {}
    return result || await jsonCategory.findByIdAndUpdate(id, update);
  },

  async findByIdAndDelete(id) {
    let result = null;
    if (getIsMongoConnected()) {
      try {
        result = await MongooseCategory.findByIdAndDelete(id);
      } catch (err) {
        console.warn('Mongoose findByIdAndDelete error:', err.message);
      }
    }
    try {
      await jsonCategory.findByIdAndDelete(id);
    } catch (e) {}
    return result || await jsonCategory.findByIdAndDelete(id);
  },

  async countDocuments(query = {}) {
    if (getIsMongoConnected()) {
      try {
        return await MongooseCategory.countDocuments(query);
      } catch (err) {
        console.warn('Mongoose countDocuments fallback:', err.message);
      }
    }
    return await jsonCategory.countDocuments(query);
  }
};
