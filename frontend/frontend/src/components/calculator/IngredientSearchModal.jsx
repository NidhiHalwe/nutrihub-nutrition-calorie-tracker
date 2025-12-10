import React, { useState, useEffect } from 'react';

const ingredientDatabase = [
  { id: 1, name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 3.6, unit: 'g', servingSize: 100, category: 'Protein' },
  { id: 2, name: 'Brown Rice', calories: 112, protein: 2.6, carbs: 24, fats: 0.9, unit: 'g', servingSize: 100, category: 'Grains' },
  { id: 3, name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fats: 0.4, unit: 'g', servingSize: 100, category: 'Vegetables' },
  { id: 4, name: 'Salmon', calories: 208, protein: 20, carbs: 0, fats: 13, unit: 'g', servingSize: 100, category: 'Protein' },
  { id: 5, name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fats: 0.1, unit: 'g', servingSize: 100, category: 'Vegetables' },
  { id: 6, name: 'Almonds', calories: 579, protein: 21, carbs: 22, fats: 50, unit: 'g', servingSize: 100, category: 'Nuts' },
  { id: 7, name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fats: 0.4, unit: 'g', servingSize: 100, category: 'Dairy' },
  { id: 8, name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fats: 0.3, unit: 'g', servingSize: 100, category: 'Fruits' },
  { id: 9, name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fats: 11, unit: 'g', servingSize: 100, category: 'Protein' },
  { id: 10, name: 'Oats', calories: 389, protein: 17, carbs: 66, fats: 7, unit: 'g', servingSize: 100, category: 'Grains' },
];

export default function IngredientSearchModal({ isOpen, onClose, onSelectIngredient }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState(ingredientDatabase);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredIngredients(ingredientDatabase);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredIngredients(
      ingredientDatabase.filter(
        ing => ing.name.toLowerCase().includes(q) || ing.category.toLowerCase().includes(q)
      )
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0, 0, 0, 0.2)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
      <div style={{background:'#fff', borderRadius:8, padding:16, maxHeight:'80vh', width:'90%', maxWidth:600, overflowY:'auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}>
          <h3>Search Ingredients</h3>
          <button type="button" onClick={onClose}>X</button>
        </div>
        <input
          type="text"
          placeholder="Search by name or category..."
          value={searchQuery}
          onChange={e=>setSearchQuery(e.target.value)}
          style={{width:'100%', marginBottom:12}}
        />
        {filteredIngredients.length === 0 ? (
          <div>No ingredients found.</div>
        ) : (
          <ul style={{listStyle:'none', padding:0}}>
            {filteredIngredients.map(ing => (
              <li key={ing.id}>
                <button
                  type="button"
                  onClick={() => { onSelectIngredient(ing); onClose(); setSearchQuery(''); }}
                  style={{width:'100%', textAlign:'left', padding:8, border:'1px solid #eee', borderRadius:4, marginBottom:6}}
                >
                  <div style={{fontWeight:500}}>{ing.name}</div>
                  <div style={{fontSize:12, color:'#666'}}>
                    {ing.calories} cal per {ing.servingSize}{ing.unit} • {ing.category}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
