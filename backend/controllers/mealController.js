import Meal from '../models/Meal.js';

export const addMeal = async (req, res) => {
  try {
    const { food, calories } = req.body;
    const meal = new Meal({
      user: req.userId,
      food,
      calories,
      loggedAt: new Date(),
    });
    await meal.save();
    res.json({ message: 'Meal logged.' });
  } catch {
    res.status(500).json({ message: 'Failed to log meal.' });
  }
};

export const getMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.userId }).sort({ loggedAt: -1, _id: -1 }).lean();
    const today = new Date();
    today.setHours(0,0,0,0);
    const totalCalories = meals.filter(
      m => new Date(m.loggedAt) >= today
    ).reduce((sum, m) => sum + (m.calories || 0), 0);
    res.json({ meals, totalCalories });
  } catch {
    res.status(500).json({ message: 'Failed to fetch meals.' });
  }
};





