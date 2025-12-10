import express from 'express';
import auth from '../middleware/auth.js';
import RecipeManager from '../utils/RecipeManager.js';

const router = express.Router();

// POST /api/recipes/generate
// body: { mealType: 'lunch'|'dinner', dayPlan: {...}, dayName?: 'Monday' }
router.post('/generate', auth, async (req, res) => {
  try {
    const { mealType = 'dinner', dayPlan = {}, dayName = 'Today' } = req.body || {};
    const recipeManager = new RecipeManager();
    const result = await recipeManager.generateRecipes(mealType, dayPlan, dayName);
    res.json({ ok: true, ...result });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Recipe generation error:', err && err.message ? err.message : err);
    res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
});

export default router;







