import express from 'express';
import {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../controllers/programController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllPrograms);
router.get('/:id', getProgramById);
router.post('/', protectAdmin, createProgram);
router.put('/:id', protectAdmin, updateProgram);
router.delete('/:id', protectAdmin, deleteProgram);

export default router;
