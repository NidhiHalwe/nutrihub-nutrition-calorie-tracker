import React, { useState, useEffect } from 'react';

export default function IngredientRow({ ingredient, onUpdate, onRemove }) {
  const [quantity, setQuantity] = useState(ingredient?.quantity || ingredient?.servingSize || 100);
  const [unit, setUnit] = useState(ingredient?.unit || 'g');

  useEffect(() => {
    const servingSize = ingredient?.servingSize || 100;
    const multiplier = (quantity || 0) / servingSize;
    const calculatedCalories = Math.round((ingredient?.calories || 0) * multiplier);
    const calculatedProtein = Math.round((ingredient?.protein || 0) * multiplier * 10) / 10;
    const calculatedCarbs = Math.round((ingredient?.carbs || 0) * multiplier * 10) / 10;
    const calculatedFats = Math.round((ingredient?.fats || 0) * multiplier * 10) / 10;

    onUpdate({
      ...ingredient,
      quantity,
      unit,
      calculatedCalories,
      calculatedProtein,
      calculatedCarbs,
      calculatedFats,
    });
  }, [quantity, unit]);

  const handleQuantityChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setQuantity(Math.max(0, value));
  };

  const servingSize = ingredient?.servingSize || 100;
  const multiplier = (quantity || 0) / servingSize;
  const displayCalories = Math.round((ingredient?.calories || 0) * multiplier);
  const displayProtein = Math.round((ingredient?.protein || 0) * multiplier * 10) / 10;
  const displayCarbs = Math.round((ingredient?.carbs || 0) * multiplier * 10) / 10;
  const displayFats = Math.round((ingredient?.fats || 0) * multiplier * 10) / 10;

  return (
    <div style={{border:'1px solid #e4e4e7', borderRadius:8, padding:12, marginBottom:8}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
        <div>
          <div style={{fontWeight:600}}>{ingredient?.name}</div>
          <div style={{fontSize:12, color:'#666'}}>{ingredient?.category}</div>
        </div>
        <button type="button" onClick={onRemove} style={{background:'#eee', color:'#333', padding:'4px 8px', borderRadius:4}}>
          Remove
        </button>
      </div>
      <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:8}}>
        <label>
          Qty:
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            style={{marginLeft:4, width:80}}
          />
        </label>
        <label>
          Unit:
          <select value={unit} onChange={e=>setUnit(e.target.value)} style={{marginLeft:4}}>
            <option value="g">g</option>
            <option value="ml">ml</option>
          </select>
        </label>
        <div style={{marginLeft:'auto', textAlign:'right'}}>
          <div style={{fontSize:12, color:'#666'}}>Calories</div>
          <div style={{fontWeight:600}}>{displayCalories}</div>
        </div>
      </div>
      <div style={{display:'flex', gap:16, fontSize:12}}>
        <div>Protein: <b>{displayProtein} g</b></div>
        <div>Carbs: <b>{displayCarbs} g</b></div>
        <div>Fats: <b>{displayFats} g</b></div>
      </div>
    </div>
  );
}
