import express from 'express';
import { getProfile, updateProfile, getPreferences, updatePreferences } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.get('/preferences', getPreferences);
router.patch('/preferences', updatePreferences);

export default router;
