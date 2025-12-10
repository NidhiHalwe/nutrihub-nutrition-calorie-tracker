import React, { useState } from 'react';
import { apiFetch } from '../services/api';

export default function MealLogger({ onLogged }) {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  async function handleLog(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await apiFetch('/meals', {
        method: 'POST',
        body: JSON.stringify({ food, calories: parseInt(calories) })
      }, true);
      setMsg('Meal logged!');
      setFood('');
      setCalories('');
      onLogged && onLogged();
    } catch {
      setMsg('Error logging meal.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLog} style={{marginBottom:'2em'}}>
      <h4>Log a Meal</h4>
      <input value={food} required placeholder="Food" onChange={e=>setFood(e.target.value)} style={{marginRight:4}} />
      <input value={calories} required placeholder="Calories" type="number" min="1" onChange={e=>setCalories(e.target.value)} style={{width:90,marginRight:4}} />
      <button type="submit" disabled={loading || !food || !calories}>{loading? 'Logging...' : 'Log'}</button>
      {msg && <span style={{marginLeft:10,color:msg.startsWith('Error')?'red':'green'}}>{msg}</span>}
    </form>
  );
}





