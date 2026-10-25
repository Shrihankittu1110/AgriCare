import express from 'express';
import { analyzeScan, getScans, getScanById, deleteScan, translateScan } from '../controllers/scanController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(authenticate);

router.post('/analyze', upload.single('image'), analyzeScan);
router.get('/', getScans);
router.get('/:id', getScanById);
router.delete('/:id', deleteScan);
router.post('/:id/translate', translateScan);

export default router;
