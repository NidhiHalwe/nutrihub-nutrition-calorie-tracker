import React from 'react';

export default function NutritionSummary({ totalCalories, totalProtein, totalCarbs, totalFats, targetCalories }) {
  const remainingCalories = (targetCalories || 0) - (totalCalories || 0);
  const calorieProgress = targetCalories ? Math.min((totalCalories / targetCalories) * 100, 100) : 0;
  const isOverTarget = totalCalories > targetCalories;

  return (
    <div style={{border:'1px solid #e4e4e7', borderRadius:8, padding:16, marginBottom:16}}>
      <h3 style={{marginBottom:8}}>Nutrition Summary</h3>
      <div style={{marginBottom:12}}>
        <div style={{fontSize:12, color:'#666'}}>Total Calories</div>
        <div style={{fontSize:28, fontWeight:700, color:'var(--color-primary)'}}>{totalCalories}</div>
        <div style={{fontSize:12, marginTop:4, color: isOverTarget ? 'red' : 'green'}}>
          {isOverTarget ? `${Math.abs(remainingCalories)} cal over target` : `${remainingCalories} cal remaining`}
        </div>
      </div>
      <div style={{marginBottom:12}}>
        <div style={{fontSize:12, color:'#666', marginBottom:4}}>Progress</div>
        <div style={{height:8, background:'#eee', borderRadius:4, overflow:'hidden'}}>
          <div style={{height:'100%', width:`${calorieProgress}%`, background: isOverTarget ? 'red' : 'var(--color-primary)'}} />
        </div>
      </div>
      <div style={{display:'flex', gap:16, fontSize:12}}>
        <div>Protein: <b>{totalProtein} g</b></div>
        <div>Carbs: <b>{totalCarbs} g</b></div>
        <div>Fats: <b>{totalFats} g</b></div>
      </div>
    </div>
  );
}
