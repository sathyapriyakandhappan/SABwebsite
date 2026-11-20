import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

// Ensure data and uploads directory exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sri_amman_biocare';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB connected successfully to ${uri}`);
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[Database] Notice: MongoDB not running locally (${error.message}).`);
    console.log(`[Database] Activating integrated persistent file-backed database in: ${DATA_DIR}`);
  }
};

export const getIsMongoConnected = () => isMongoConnected;

// Robust JSON file document storage
export class JSONCollection {
  constructor(collectionName) {
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  _read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data || '[]');
    } catch {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async find(query = {}) {
    let items = this._read();
    if (Object.keys(query).length === 0) return items;

    return items.filter(item => {
      for (const [key, val] of Object.entries(query)) {
        if (key === '$or' && Array.isArray(val)) {
          const matched = val.some(condition => {
            return Object.entries(condition).every(([k, v]) => {
              if (v instanceof RegExp) return v.test(item[k] || '');
              return item[k] === v;
            });
          });
          if (!matched) return false;
        } else if (val instanceof RegExp) {
          if (!val.test(item[key] || '')) return false;
        } else if (typeof val === 'object' && val !== null) {
          if (val.$regex) {
            const re = new RegExp(val.$regex, val.$options || 'i');
            if (!re.test(item[key] || '')) return false;
          }
        } else if (item[key] !== val) {
          return false;
        }
      }
      return true;
    });
  }

  async findById(id) {
    const items = this._read();
    return items.find(item => item._id === id || item.id === id) || null;
  }

  async findOne(query = {}) {
    const results = await this.find(query);
    return results[0] || null;
  }

  async create(doc) {
    const items = this._read();
    const newDoc = {
      _id: 'sab_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
      ...doc,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.unshift(newDoc);
    this._write(items);
    return newDoc;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const items = this._read();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;

    const current = items[index];
    const updated = {
      ...current,
      ...update,
      _id: current._id, // maintain id
      updatedAt: new Date().toISOString(),
    };
    items[index] = updated;
    this._write(items);
    return updated;
  }

  async findByIdAndDelete(id) {
    const items = this._read();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;

    const removed = items.splice(index, 1)[0];
    this._write(items);
    return removed;
  }

  async countDocuments(query = {}) {
    const results = await this.find(query);
    return results.length;
  }
}
