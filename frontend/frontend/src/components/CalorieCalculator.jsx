import React, { useState } from 'react';

export default function CalorieCalculator() {
  const [foods, setFoods] = useState([{ name: '', calories: '' }]);
  const [total, setTotal] = useState(0);

  function addFood() {
    setFoods([...foods, { name: '', calories: '' }]);
  }
  function updateFood(idx, key, val) {
    const copy = [...foods];
    copy[idx][key] = val;
    setFoods(copy);
    calcTotal(copy);
  }
  function calcTotal(foodsArr) {
    setTotal(foodsArr.reduce((sum, f) => sum + (parseInt(f.calories)||0), 0));
  }
  function removeFood(idx) {
    const copy = foods.filter((_,i)=>i!==idx);
    setFoods(copy);
    calcTotal(copy);
  }

  return (
    <div style={{marginTop:'2rem'}}>
      <h4>Calorie Calculator</h4>
      {foods.map((food, idx) => (
        <div key={idx} style={{display:'flex',marginBottom:'0.7em',alignItems:'center'}}>
          <input
            value={food.name}
            placeholder="food"
            onChange={e=>updateFood(idx,'name',e.target.value)}
            style={{marginRight:'0.5em'}}
          />
          <input
            value={food.calories}
            placeholder="calories"
            type="number"
            min="0"
            onChange={e=>updateFood(idx,'calories',e.target.value)}
            style={{width:'80px', marginRight:'0.5em'}}
          />
          {foods.length > 1 && (
            <button type="button" onClick={()=>removeFood(idx)} style={{background:'var(--color-accent)'}}>Remove</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addFood}>Add More</button>
      <div style={{marginTop:'1rem'}}>
        <b>Total:</b> {total} calories
      </div>
    </div>
  );
}





