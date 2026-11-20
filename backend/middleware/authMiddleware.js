import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

export const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'sri_amman_biocare_jwt_super_secret_key_2026_production';
    const decoded = jwt.verify(token, secret);
    
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session or administrator account not found.',
      });
    }

    req.user = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed. Please log in again.',
      error: error.message,
    });
  }
};
