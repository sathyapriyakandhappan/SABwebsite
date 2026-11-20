import express from 'express';
import { loginAdmin, getMe, updateProfile, changePassword } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getMe);
router.put('/profile', protectAdmin, updateProfile);
router.put('/change-password', protectAdmin, changePassword);

export default router;
