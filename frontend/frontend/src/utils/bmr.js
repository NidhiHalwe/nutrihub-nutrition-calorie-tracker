// BMR and TDEE utilities
export function calculateBMR({ age, sex, heightCm, weightKg }) {
  // Mifflin-St Jeor Equation
  if (!age || !sex || !heightCm || !weightKg) return 0;
  const s = sex === 'male' ? 5 : -161;
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + s;
  return Math.round(bmr);
}

export function calculateTDEE(bmr, activityLevel) {
  if (!bmr) return 0;
  const map = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };
  const factor = map[activityLevel] || 1.2;
  return Math.round(bmr * factor);
}

export function calorieTargetForGoal(tdee, goal) {
  if (!tdee) return 0;
  if (goal === 'Weight Loss') return Math.max(1200, tdee - 500);
  if (goal === 'Weight Gain') return tdee + 500;
  return tdee; // Maintenance
}
