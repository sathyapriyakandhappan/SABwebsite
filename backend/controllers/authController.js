import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

const generateToken = (admin) => {
  const secret = process.env.JWT_SECRET || 'sri_amman_biocare_jwt_super_secret_key_2026_production';
  return jwt.sign(
    { id: admin._id || admin.id, email: admin.email, role: admin.role || 'admin' },
    secret,
    { expiresIn: '7d' }
  );
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
    }

    const isMatch = await Admin.comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
    }

    const token = generateToken(admin);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      admin: {
        id: admin._id || admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id || req.user.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Administrator not found.' });
    }
    res.json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile.', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const adminId = req.user._id || req.user.id;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();

    const updated = await Admin.findByIdAndUpdate(adminId, updateData);
    res.json({ success: true, message: 'Profile updated successfully.', admin: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile.', error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.user._id || req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both current and new passwords.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const admin = await Admin.findByIdWithPassword(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    const isMatch = await Admin.comparePassword(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    await Admin.findByIdAndUpdate(adminId, { password: newPassword });

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to change password.', error: error.message });
  }
};
