import React, { useState } from 'react';
import { apiFetch } from '../services/api';

export default function FoodSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setResults(null);
    try {
      const data = await apiFetch(`/food/search?q=${encodeURIComponent(query)}`, {}, true);
      setResults(data.foods);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{marginTop:'2rem'}}>
      <form onSubmit={handleSearch}>
        <h4>Food Search</h4>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="e.g. banana, pizza..." style={{width:'70%',marginRight:'0.5em'}} />
        <button type="submit" disabled={loading || !query}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {results && (
        <ul style={{marginTop:'1em'}}>
          {results.length === 0 && <li>No foods found.</li>}
          {results.map(food => (
            <li key={food.id}>
              {food.name} — <b>{food.calories} cal/serving</b>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}





