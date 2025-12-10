import { foodDatabase } from '../utils/foodData.js';

export const foodSearch = async (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const results = foodDatabase.filter(f =>
    f.name.toLowerCase().includes(q)
  );
  res.json({ foods: results });
};





