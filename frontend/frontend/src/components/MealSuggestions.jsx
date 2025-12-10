import React, { useState } from 'react';
import { apiFetch } from '../services/api';

export default function MealSuggestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [html, setHtml] = useState('');

  async function fetchRecipes() {
    setLoading(true);
    setError('');
    setHtml('');
    try {
      // Simple example day plan; you can later wire this to real logged meals
      const dayPlan = {
        Dinner: {
          items: [
            { name: 'Chicken Breast', grams: 150 },
            { name: 'Brown Rice', grams: 120 },
            { name: 'Broccoli', grams: 80 },
          ],
        },
      };

      const data = await apiFetch(
        '/recipes/generate',
        {
          method: 'POST',
          body: JSON.stringify({
            mealType: 'dinner',
            dayPlan,
            dayName: 'Today',
          }),
        },
        true
      );

      if (!data.ok) {
        throw new Error(data.error || 'Failed to generate recipes');
      }
      setHtml(data.html || '');
    } catch (e) {
      setError(e.message || 'Failed to generate recipes');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: '2em', marginBottom: '2em' }}>
      <h4>AI Meal Planner (Gemini)</h4>
      <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
        Generates full recipes using your ingredients via Google Gemini. (Uses a sample dinner plan for now.)
      </p>
      {error && (
        <div style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>
          {error}
        </div>
      )}
      <button onClick={fetchRecipes} disabled={loading} style={{ marginTop: 8 }}>
        {loading ? 'Generating...' : 'Generate AI Meal Plan'}
      </button>
      {html && (
        <div
          style={{ marginTop: '1em', padding: 12, border: '1px solid #e4e4e7', borderRadius: 8 }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
}
