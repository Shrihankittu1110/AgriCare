import express from 'express';
import { sendMessage, getConversation, clearConversation } from '../controllers/assistantController.js';
import { authenticate } from '../middleware/auth.js';
import { validateChatMessage } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.post('/chat', validateChatMessage, sendMessage);
router.get('/conversation', getConversation);
router.delete('/conversation', clearConversation);

export default router;
