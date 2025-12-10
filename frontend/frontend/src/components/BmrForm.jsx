import React, { useState, useEffect } from 'react';
import { calculateBMR, calculateTDEE } from '../utils/bmr';

export default function BmrForm({ onSave }) {
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [activity, setActivity] = useState('sedentary');
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('foodhub_profile');
      if (stored) {
        const p = JSON.parse(stored);
        if (p) {
          setAge(p.age || '');
          setSex(p.sex || '');
          setHeightCm(p.heightCm || '');
          setWeightKg(p.weightKg || '');
          setActivity(p.activityLevel || 'sedentary');
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!age || !sex || !heightCm || !weightKg) {
      setError('Please fill all fields.');
      return;
    }

    const profile = {
      age: Number(age),
      sex,
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      activityLevel: activity,
    };

    const bmr = calculateBMR(profile);
    const tdee = calculateTDEE(bmr, activity);
    profile.bmr = bmr;
    profile.tdee = tdee;

    // persist
    try {
      localStorage.setItem('foodhub_profile', JSON.stringify(profile));
    } catch (e) {
      // ignore storage errors
    }

    if (typeof onSave === 'function') onSave(profile);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <input placeholder="Age" value={age} onChange={e => setAge(e.target.value)} type="number" min="1" />
        <select value={sex} onChange={e => setSex(e.target.value)}>
          <option value="">Select Sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input placeholder="Height (cm)" value={heightCm} onChange={e => setHeightCm(e.target.value)} type="number" />
        <input placeholder="Weight (kg)" value={weightKg} onChange={e => setWeightKg(e.target.value)} type="number" />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 13 }}>Activity Level</label>
        <select value={activity} onChange={e => setActivity(e.target.value)} style={{ display: 'block', width: '100%', marginTop: 6 }}>
          <option value="sedentary">Sedentary (little or no exercise)</option>
          <option value="lightly_active">Lightly active (light exercise 1–3 days/week)</option>
          <option value="moderately_active">Moderately active (moderate exercise 3–5 days/week)</option>
          <option value="very_active">Very active (hard exercise 6–7 days a week)</option>
          <option value="extra_active">Extra active (very hard exercise)</option>
        </select>
      </div>

      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" style={{ padding: 10, background: '#5269d0ff', color: '#fff', border: 'none', borderRadius: 6 }}>Save Profile</button>
        <button type="button" onClick={() => {
          try { localStorage.removeItem('foodhub_profile'); } catch(e) {}
          setAge(''); setSex(''); setHeightCm(''); setWeightKg(''); setActivity('sedentary');
          if (typeof onSave === 'function') onSave(null);
        }} style={{ padding: 10, background: '#5269d0ff', border: '1px solid #ddd', borderRadius: 6 }}>Clear</button>
      </div>
    </form>
  );
}
