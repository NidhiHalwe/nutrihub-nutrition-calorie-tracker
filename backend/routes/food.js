import express from 'express';
import auth from '../middleware/auth.js';
import { foodSearch } from '../controllers/foodController.js';
const router = express.Router();

router.get('/search', auth, foodSearch);

export default router;





