import React, { useState, useMemo, useEffect } from 'react';
import IngredientSearchModal from './IngredientSearchModal';
import IngredientRow from './IngredientRow';
import NutritionSummary from './NutritionSummary';
import TargetCalorieModal from './TargetCalorieModal';

export default function CalorieCalculator() {
  const [ingredients, setIngredients] = useState(() => {
    try {
      const slugify = (s) => String(s || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').replace(/-+/g, '-').replace(/(^-|-$)/g, '');
      const stored = localStorage.getItem('calculatorIngredients');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      // normalize and dedupe by sourceId (slugified name)
      const seen = new Set();
      const normalized = [];
      (parsed || []).forEach(item => {
        const name = (item.name || '').toString();
        const sourceId = (item.sourceId || slugify(name)).toString().toLowerCase();
        if (seen.has(sourceId)) return;
        seen.add(sourceId);
        normalized.push({
          ...item,
          name,
          sourceId,
          uniqueId: item.uniqueId || Date.now() + Math.random(),
          calories: Number(item.calories) || Number(item.calculatedCalories) || 0,
          calculatedCalories: Number(item.calculatedCalories) || Number(item.calories) || 0,
        });
      });
      // write back normalized form so storage is clean
      try { localStorage.setItem('calculatorIngredients', JSON.stringify(normalized)); } catch (e) {}
      return normalized;
    } catch (e) {
      return [];
    }
  });
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [targetCalories, setTargetCalories] = useState(2000);

  const totals = useMemo(() => {
    const totalCalories = ingredients.reduce((sum, ing) => sum + (ing.calculatedCalories || 0), 0);
    const totalProtein = Math.round(ingredients.reduce((sum, ing) => sum + (ing.calculatedProtein || 0), 0) * 10) / 10;
    const totalCarbs = Math.round(ingredients.reduce((sum, ing) => sum + (ing.calculatedCarbs || 0), 0) * 10) / 10;
    const totalFats = Math.round(ingredients.reduce((sum, ing) => sum + (ing.calculatedFats || 0), 0) * 10) / 10;
    return { totalCalories, totalProtein, totalCarbs, totalFats };
  }, [ingredients]);

  const handleAddIngredient = (ingredient) => {
    const newIngredient = {
      ...ingredient,
      uniqueId: Date.now() + Math.random(),
      quantity: ingredient.servingSize,
      calculatedCalories: ingredient.calories,
      calculatedProtein: ingredient.protein,
      calculatedCarbs: ingredient.carbs,
      calculatedFats: ingredient.fats,
    };
    setIngredients(prev => [...prev, newIngredient]);
  };

  const handleUpdateIngredient = (updated) => {
    setIngredients(prev => prev.map(ing => ing.uniqueId === updated.uniqueId ? updated : ing));
  };

  const handleRemoveIngredient = (id) => {
    setIngredients(prev => prev.filter(ing => ing.uniqueId !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all ingredients?')) {
      setIngredients([]);
      try { localStorage.removeItem('calculatorIngredients'); } catch (e) {}
    }
  };

  // On mount, import any selected recipes saved by the Dashboard (if user selected recipes and clicked Open in Calculator)
  useEffect(() => {
    try {
      const storedSel = localStorage.getItem('selectedRecipes');
      if (!storedSel) return;
      const parsed = JSON.parse(storedSel);
      if (!Array.isArray(parsed) || parsed.length === 0) return;

      // slug helper
      const slugify = (s) => String(s || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').replace(/-+/g, '-').replace(/(^-|-$)/g, '');

      // read current stored ingredients to avoid race conditions and double import (handles React strict mode)
      const storedIngRaw = localStorage.getItem('calculatorIngredients');
      const storedIng = storedIngRaw ? JSON.parse(storedIngRaw) : [];
      const existing = new Set((storedIng || []).map(it => ((it.sourceId || slugify(it.name || '')).toString().toLowerCase())));

      const toAdd = [];
      parsed.forEach(r => {
        const name = (r.name || 'Recipe').trim();
        const id = (r.id || slugify(name)).toLowerCase();
        const caloriesNum = Number(r.calories) || 0;
        const proteinNum = Number(r.protein) || Number(r.protein_g) || 0;
        const carbsNum = Number(r.carbs) || Number(r.carbs_g) || 0;
        const fatsNum = Number(r.fats) || Number(r.fats_g) || 0;
        if (!existing.has(id)) {
          existing.add(id);
          toAdd.push({
            name,
            sourceId: id,
            uniqueId: Date.now() + Math.random(),
            quantity: 1,
            servingSize: 1,
            calories: caloriesNum,
            calculatedCalories: caloriesNum,
            protein: proteinNum,
            carbs: carbsNum,
            fats: fatsNum,
            calculatedProtein: proteinNum,
            calculatedCarbs: carbsNum,
            calculatedFats: fatsNum,
          });
        }
      });

      if (toAdd.length > 0) {
        // append to in-memory state and also persist immediately to storage to prevent double-add on re-run
        setIngredients(prev => {
          const next = [...prev, ...toAdd];
          try { localStorage.setItem('calculatorIngredients', JSON.stringify(next)); } catch (e) {}
          return next;
        });
      }
    } catch (e) {
      console.error('Error importing selected recipes', e);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist ingredients to localStorage so they remain across navigations/reloads
  useEffect(() => {
    try {
      // ensure we persist normalized entries (with sourceId)
      const slugify = (s) => String(s || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').replace(/-+/g, '-').replace(/(^-|-$)/g, '');
      const normalized = ingredients.map(it => ({
        ...it,
        name: (it.name || '').toString(),
        sourceId: (it.sourceId || slugify(it.name || '')).toString().toLowerCase(),
        uniqueId: it.uniqueId || Date.now() + Math.random(),
        calories: Number(it.calories) || Number(it.calculatedCalories) || 0,
        calculatedCalories: Number(it.calculatedCalories) || Number(it.calories) || 0,
      }));
      localStorage.setItem('calculatorIngredients', JSON.stringify(normalized));
    } catch (e) {
      // ignore
    }
  }, [ingredients]);

  return (
    <div className="container" style={{maxWidth:800}}>
      <h2 style={{color:'var(--color-primary)', marginBottom:8}}>Calorie Calculator</h2>
      <p style={{fontSize:14, color:'#555', marginBottom:16}}>
        Build a meal by adding ingredients and see calories and macros update automatically.
      </p>

      <div style={{display:'flex', gap:24, alignItems:'flex-start', flexWrap:'wrap'}}>
        <div style={{flex:2, minWidth:280}}>
          <div style={{border:'1px solid #e4e4e7', borderRadius:8, padding:16, marginBottom:16}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}>
              <div>
                <div style={{fontWeight:600}}>Ingredients</div>
                <div style={{fontSize:12, color:'#666'}}>
                  {ingredients.length} ingredient{ingredients.length === 1 ? '' : 's'} added
                </div>
              </div>
              <div style={{display:'flex', gap:8}}>
                {ingredients.length > 0 && (
                  <button type="button" onClick={handleClearAll} style={{padding:'4px 8px'}}>
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsSearchModalOpen(true)}
                  style={{padding:'4px 8px', background:'#7a82f4ff', color:'#fff', borderRadius:4}}
                >
                  Add Ingredient
                </button>
              </div>
            </div>

            {ingredients.length === 0 ? (
              <div style={{fontSize:14, color:'#777', textAlign:'center', padding:'24px 8px'}}>
                No ingredients yet. Click “Add Ingredient” to start.
              </div>
            ) : (
              <div>
                {ingredients.map(ing => (
                  <IngredientRow
                    key={ing.uniqueId}
                    ingredient={ing}
                    onUpdate={handleUpdateIngredient}
                    onRemove={() => handleRemoveIngredient(ing.uniqueId)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{flex:1, minWidth:240}}>
          <NutritionSummary
            totalCalories={totals.totalCalories}
            totalProtein={totals.totalProtein}
            totalCarbs={totals.totalCarbs}
            totalFats={totals.totalFats}
            targetCalories={targetCalories}
          />
          <button
            type="button"
            onClick={() => setIsTargetModalOpen(true)}
            style={{width:'100%', padding:'8px 12px', borderRadius:6}}
          >
            Update Target
          </button>
        </div>
      </div>

      <IngredientSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectIngredient={handleAddIngredient}
      />

      <TargetCalorieModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        currentTarget={targetCalories}
        onSave={setTargetCalories}
      />
    </div>
  );
}

