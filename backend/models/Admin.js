import mongoose from 'mongoose';
import { getIsMongoConnected, JSONCollection } from '../config/db.js';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

const MongooseAdmin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
const jsonAdmin = new JSONCollection('admins');

export const Admin = {
  async find(query = {}) {
    if (getIsMongoConnected()) return await MongooseAdmin.find(query).select('-password');
    const results = await jsonAdmin.find(query);
    return results.map(r => { const { password, ...rest } = r; return rest; });
  },

  async findOne(query = {}) {
    if (getIsMongoConnected()) return await MongooseAdmin.findOne(query);
    return await jsonAdmin.findOne(query);
  },

  async findById(id) {
    if (getIsMongoConnected()) return await MongooseAdmin.findById(id).select('-password');
    const result = await jsonAdmin.findById(id);
    if (!result) return null;
    const { password, ...rest } = result;
    return rest;
  },

  async findByIdWithPassword(id) {
    if (getIsMongoConnected()) return await MongooseAdmin.findById(id);
    return await jsonAdmin.findById(id);
  },

  async create(data) {
    if (data.password && !data.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    if (getIsMongoConnected()) return await MongooseAdmin.create(data);
    return await jsonAdmin.create(data);
  },

  async findByIdAndUpdate(id, update) {
    if (update.password && !update.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
    }
    if (getIsMongoConnected()) return await MongooseAdmin.findByIdAndUpdate(id, update, { new: true }).select('-password');
    const result = await jsonAdmin.findByIdAndUpdate(id, update);
    if (!result) return null;
    const { password, ...rest } = result;
    return rest;
  },

  async countDocuments(query = {}) {
    if (getIsMongoConnected()) return await MongooseAdmin.countDocuments(query);
    return await jsonAdmin.countDocuments(query);
  },

  async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
};
