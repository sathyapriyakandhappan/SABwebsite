import mongoose from 'mongoose';
import { getIsMongoConnected, JSONCollection } from '../config/db.js';

const programSchema = new mongoose.Schema({
  title: { type: String, required: true },
  institution: { type: String, required: true },
  topic: { type: String, required: true },
  date: { type: String, default: '' },
  image: { type: String, default: '' },
  images: [{ type: String }],
  description: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['Resource Person', 'Entrepreneurship Training', 'College Workshop', 'MoU Signing', 'Field Visit', 'Industrial Visit', 'College Internship'],
    default: 'Resource Person'
  },
}, { timestamps: true });

const MongooseProgram = mongoose.models.Program || mongoose.model('Program', programSchema);
const jsonProgram = new JSONCollection('programs');

export const Program = {
  async find(query = {}) {
    if (getIsMongoConnected()) {
      try {
        return await MongooseProgram.find(query).sort({ createdAt: -1 });
      } catch (err) {
        console.warn('Mongoose find fallback to JSON:', err.message);
      }
    }
    return await jsonProgram.find(query);
  },

  async findById(id) {
    if (getIsMongoConnected()) {
      try {
        return await MongooseProgram.findById(id);
      } catch (err) {
        console.warn('Mongoose findById fallback to JSON:', err.message);
      }
    }
    return await jsonProgram.findById(id);
  },

  async create(data) {
    let result = null;
    if (getIsMongoConnected()) {
      try {
        result = await MongooseProgram.create(data);
      } catch (err) {
        console.warn('Mongoose program create error:', err.message);
      }
    }
    try {
      const jsonDoc = result ? (result.toObject ? result.toObject() : result) : data;
      await jsonProgram.create(jsonDoc);
    } catch (e) {}
    return result || await jsonProgram.create(data);
  },

  async findByIdAndUpdate(id, update) {
    let result = null;
    if (getIsMongoConnected()) {
      try {
        result = await MongooseProgram.findByIdAndUpdate(id, update, { new: true });
      } catch (err) {
        console.warn('Mongoose findByIdAndUpdate error:', err.message);
      }
    }
    try {
      await jsonProgram.findByIdAndUpdate(id, update);
    } catch (e) {}
    return result || await jsonProgram.findByIdAndUpdate(id, update);
  },

  async findByIdAndDelete(id) {
    let result = null;
    if (getIsMongoConnected()) {
      try {
        result = await MongooseProgram.findByIdAndDelete(id);
      } catch (err) {
        console.warn('Mongoose findByIdAndDelete error:', err.message);
      }
    }
    try {
      await jsonProgram.findByIdAndDelete(id);
    } catch (e) {}
    return result || await jsonProgram.findByIdAndDelete(id);
  },

  async countDocuments(query = {}) {
    if (getIsMongoConnected()) {
      try {
        return await MongooseProgram.countDocuments(query);
      } catch (err) {
        console.warn('Mongoose countDocuments fallback:', err.message);
      }
    }
    return await jsonProgram.countDocuments(query);
  }
};
