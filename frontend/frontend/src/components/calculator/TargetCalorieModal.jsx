import React, { useState, useEffect } from 'react';

export default function TargetCalorieModal({ isOpen, onClose, currentTarget, onSave }) {
  const [targetCalories, setTargetCalories] = useState(currentTarget || 2000);
  const [error, setError] = useState('');

  useEffect(() => {
    setTargetCalories(currentTarget || 2000);
  }, [currentTarget]);

  if (!isOpen) 
    return null;

  const handleSave = () => {
    if (!targetCalories || targetCalories < 1000 || targetCalories > 5000) {
      setError('Target calories should be between 1000 and 5000');
      return;
    }
    onSave(targetCalories);
    setError('');
    onClose();
  };

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
      <div style={{background:'#fff', borderRadius:8, padding:16, width:'90%', maxWidth:400}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}>
          <h3>Set Target Calories</h3>
          <button type="button" onClick={onClose}>X</button>
        </div>
        <div style={{marginBottom:12}}>
          <label>
            Daily Calorie Target (1000-5000):
            <input
              type="number"
              value={targetCalories}
              onChange={e => { setTargetCalories(parseInt(e.target.value) || 0); setError(''); }}
              style={{width:'100%', marginTop:4}}
            />
          </label>
          {error && <div style={{color:'red', fontSize:12, marginTop:4}}>{error}</div>}
        </div>
        <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
          <button type="button" onClick={onClose}>Cancel</button>
          <button
            type="button"
            onClick={handleSave}
            style={{background:'var(--color-primary)', color:'#fff', padding:'6px 12px', borderRadius:4}}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
