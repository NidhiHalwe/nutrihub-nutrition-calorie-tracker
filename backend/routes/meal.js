import express from 'express';
import auth from '../middleware/auth.js';
import { addMeal, getMeals } from '../controllers/mealController.js';
const router = express.Router();

router.post('/', auth, addMeal);
router.get('/', auth, getMeals);

export default router;





