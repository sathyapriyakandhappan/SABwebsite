import mongoose from 'mongoose';
import { getIsMongoConnected, JSONCollection } from '../config/db.js';

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Website Visitor', trim: true },
  email: { type: String, default: 'farmer@sriammanbiocare.com', lowercase: true, trim: true },
  phone: { type: String, required: true, default: 'Pending Contact', trim: true },
  company: { type: String, default: '' },
  productId: { type: String, default: '' },
  productName: { type: String, default: 'General Enquiry' },
  message: { type: String, required: true, default: 'Inquiry regarding products and services' },
  status: { 
    type: String, 
    enum: ['Pending', 'Contacted', 'In Progress', 'Resolved'], 
    default: 'Pending' 
  },
  notes: { type: String, default: '' },
}, { timestamps: true });

const MongooseEnquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
const jsonEnquiry = new JSONCollection('enquiries');

export const Enquiry = {
  async find(query = {}) {
    if (getIsMongoConnected()) {
      try {
        return await MongooseEnquiry.find(query).sort({ createdAt: -1 });
      } catch (err) {
        console.warn('Mongoose find fallback to JSON:', err.message);
      }
    }
    return await jsonEnquiry.find(query);
  },

  async findById(id) {
    if (getIsMongoConnected()) {
      try {
        return await MongooseEnquiry.findById(id);
      } catch (err) {
        console.warn('Mongoose findById fallback to JSON:', err.message);
      }
    }
    return await jsonEnquiry.findById(id);
  },

  async findOne(query = {}) {
    if (getIsMongoConnected()) {
      try {
        return await MongooseEnquiry.findOne(query);
      } catch (err) {
        console.warn('Mongoose findOne fallback to JSON:', err.message);
      }
    }
    return await jsonEnquiry.findOne(query);
  },

  async create(data) {
    let result = null;
    if (getIsMongoConnected()) {
      try {
        result = await MongooseEnquiry.create(data);
      } catch (err) {
        console.warn('Mongoose enquiry create error:', err.message);
      }
    }
    try {
      const jsonDoc = result ? (result.toObject ? result.toObject() : result) : data;
      await jsonEnquiry.create(jsonDoc);
    } catch (e) {}
    return result || await jsonEnquiry.create(data);
  },

  async findByIdAndUpdate(id, update) {
    let result = null;
    if (getIsMongoConnected()) {
      try {
        result = await MongooseEnquiry.findByIdAndUpdate(id, update, { new: true });
      } catch (err) {
        console.warn('Mongoose findByIdAndUpdate error:', err.message);
      }
    }
    try {
      await jsonEnquiry.findByIdAndUpdate(id, update);
    } catch (e) {}
    return result || await jsonEnquiry.findByIdAndUpdate(id, update);
  },

  async findByIdAndDelete(id) {
    let result = null;
    if (getIsMongoConnected()) {
      try {
        result = await MongooseEnquiry.findByIdAndDelete(id);
      } catch (err) {
        console.warn('Mongoose findByIdAndDelete error:', err.message);
      }
    }
    try {
      await jsonEnquiry.findByIdAndDelete(id);
    } catch (e) {}
    return result || await jsonEnquiry.findByIdAndDelete(id);
  },

  async countDocuments(query = {}) {
    if (getIsMongoConnected()) {
      try {
        return await MongooseEnquiry.countDocuments(query);
      } catch (err) {
        console.warn('Mongoose countDocuments fallback:', err.message);
      }
    }
    return await jsonEnquiry.countDocuments(query);
  }
};
