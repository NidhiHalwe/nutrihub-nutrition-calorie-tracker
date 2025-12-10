import express from 'express';
import auth from '../middleware/auth.js';
import { aiSuggestions } from '../controllers/aiController.js';
const router = express.Router();

router.get('/suggestions', auth, aiSuggestions);

export default router;





