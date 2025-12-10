import mongoose from 'mongoose';
const MealSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  food: String,
  calories: Number,
  loggedAt: { type: Date, default: Date.now }
});
export default mongoose.model('Meal', MealSchema);





