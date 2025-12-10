import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BmrForm from './BmrForm';
import { calculateBMR, calculateTDEE, calorieTargetForGoal } from '../utils/bmr';

// simple slug generator for stable ids
const slugify = (s) => String(s || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');

// Preference Options
const dietOptions = [
    { label: "Select Diet Type", value: "" },
    { label: "Vegetarian", value: "Vegetarian" },
    { label: "Non-Vegetarian", value: "Non-Vegetarian" },
    { label: "Gluten-Free", value: "Gluten-Free" },
    { label: "Vegan", value: "Vegan" }
];

const goalOptions = [
    { label: "Select Goal", value: "" },
    { label: "Weight Loss (Calorie Deficit)", value: "Weight Loss" },
    { label: "Weight Gain (Calorie Surplus)", value: "Weight Gain" },
    { label: "Maintenance", value: "Maintenance" }
];

export default function Dashboard() {
    const [dietType, setDietType] = useState('');
    const [goalType, setGoalType] = useState('');
    const [aiMealPlan, setAiMealPlan] = useState(null); // Will store the parsed JSON object
    const [loadingAI, setLoadingAI] = useState(false);
    const [aiError, setAiError] = useState(null);
    const [selectedIndices, setSelectedIndices] = useState([]);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('foodhub_profile');
            if (stored) setProfile(JSON.parse(stored));
        } catch (e) {
            // ignore
        }
    }, []);

    // When a new meal plan is loaded, restore any selections saved in localStorage
    React.useEffect(() => {
        try {
            const stored = localStorage.getItem('selectedRecipes');
            if (aiMealPlan && stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const ids = parsed.map(p => (p.id || '').toString().toLowerCase());
                    const idxs = aiMealPlan.recipes
                        .map((r, i) => {
                            const name = (r['Recipe Name'] || '').toString();
                            const rid = slugify(name);
                            return ids.includes(rid) ? i : -1;
                        })
                        .filter(i => i >= 0);
                    setSelectedIndices(idxs);
                }
            }
        } catch (e) {
            // ignore
        }
    }, [aiMealPlan]);

    const handleGenerateMeal = async () => {
        if (!dietType || !goalType) {
            setAiError("Please select both a Diet Type and a Goal.");
            return;
        }

        setLoadingAI(true);
        setAiMealPlan(null);
        setAiError(null);

        // Combine preferences into a single request input
        let input = `Generate a 2-day meal plan for ${dietType} diet with a focus on ${goalType}.`;

        // If user profile exists, include BMR/TDEE and a calorie target suggestion
        try {
            if (profile) {
                const bmr = profile.bmr || calculateBMR(profile);
                const tdee = profile.tdee || calculateTDEE(bmr, profile.activityLevel);
                const suggested = calorieTargetForGoal(tdee, goalType);
                input += ` User profile: age ${profile.age}, sex ${profile.sex}, height ${profile.heightCm} cm, weight ${profile.weightKg} kg. `;
                input += `Estimated BMR ${bmr} kcal/day and TDEE ${tdee} kcal/day. `;
                input += `Please tailor the recipes so daily calories are around ${suggested} kcal for the specified goal.`;
            }
        } catch (e) {
            // ignore profile errors and proceed
        }

        try {
            // ⚡ Hitting the backend API ⚡
            const response = await fetch('http://localhost:5000/generate-meal', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: input }), 
            });

            if (!response.ok) {
                throw new Error('AI Server responded with an error.');
            }

            const data = await response.json();
            
            // ⚠️ IMPORTANT: The backend sends back a JSON string (data.mealPlan). We must parse it.
            const parsedPlan = JSON.parse(data.mealPlan); 
            setAiMealPlan(parsedPlan);

        } catch (err) {
            console.error('AI Fetch Error or JSON Parse Error:', err);
            setAiError('Error generating or parsing plan. Check server logs and JSON format.');
        } finally {
            setLoadingAI(false);
        }
    };

    const toggleSelect = (recipe, index) => {
        setSelectedIndices(prev => {
            const set = new Set(prev);
            if (set.has(index)) set.delete(index); else set.add(index);
            const arr = Array.from(set).sort((a,b)=>a-b);

            // persist selected recipe names + calories to localStorage for the calculator page
            try {
                // helper to extract macros from recipe object text
                const extractMacros = (r) => {
                    const getFromKey = (obj, keyRegex) => {
                        for (const k of Object.keys(obj)) {
                            if (k.toLowerCase().includes(keyRegex)) {
                                const v = obj[k];
                                const num = parseFloat(String(v).replace(/[^0-9.\-]+/g, ''));
                                if (!Number.isNaN(num)) return num;
                            }
                        }
                        return null;
                    };

                    const tryRegexSearch = (text, nameRegex) => {
                        if (!text) return null;
                        const patterns = [
                            new RegExp(nameRegex + ":?\\s*-?\\s*([0-9]+(?:\\.[0-9]+)?)", 'i'),
                            new RegExp('([0-9]+(?:\\.[0-9]+)?)\\s*(g|grams)\\s*(?:of\\s*)?' + nameRegex, 'i'),
                        ];
                        for (const p of patterns) {
                            const m = String(text).match(p);
                            if (m && m[1]) return parseFloat(m[1]);
                        }
                        return null;
                    };

                    // check keys first
                    const proteinKey = getFromKey(r, 'protein');
                    const carbsKey = getFromKey(r, 'carb') || getFromKey(r, 'carbo');
                    const fatsKey = getFromKey(r, 'fat');

                    // fallback to searching Ingredients or Instructions strings
                    const ingredientsText = r['Ingredients'] || r['Step-by-step Instructions'] || '';
                    const proteinRegex = proteinKey ?? tryRegexSearch(ingredientsText, 'protein');
                    const carbsRegex = carbsKey ?? tryRegexSearch(ingredientsText, 'carb|carbohydrates');
                    const fatsRegex = fatsKey ?? tryRegexSearch(ingredientsText, 'fat|fats');

                    return {
                        protein: Math.round((proteinRegex || 0) * 10) / 10,
                        carbs: Math.round((carbsRegex || 0) * 10) / 10,
                        fats: Math.round((fatsRegex || 0) * 10) / 10,
                    };
                };

                const selected = arr.map(i => {
                    const r = aiMealPlan.recipes[i];
                    const calories = parseInt(String(r['TOTAL CALORIES']).replace(/[^0-9.-]+/g, '')) || 0;
                    const name = r['Recipe Name'];
                    const macros = extractMacros(r);
                    return { id: slugify(name), name, calories, protein: macros.protein, carbs: macros.carbs, fats: macros.fats };
                });
                // dedupe by id before saving
                const dedup = [];
                const seen = new Set();
                for (const s of selected) {
                    if (!seen.has(s.id)) { seen.add(s.id); dedup.push(s); }
                }
                localStorage.setItem('selectedRecipes', JSON.stringify(dedup));
            } catch (e) {
                console.error('Error saving selected recipes', e);
            }

            return arr;
        });
    };

    const renderRecipeCard = (recipe, index) => (
        <div key={index} style={{ border: '1px solid #5c67f2', padding: '15px', borderRadius: '8px', marginBottom: '20px', background: '#fff', position: 'relative' }}>
            <div style={{position:'absolute', right:12, top:12}}>
                <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                    <input
                        type="checkbox"
                        checked={selectedIndices.includes(index)}
                        onChange={() => toggleSelect(recipe, index)}
                    />
                    <span style={{fontSize:12, color:'#555'}}>Add</span>
                </label>
            </div>

            <h4 style={{ color: 'var(--color-primary)', borderBottom: '1px dashed #ccc', paddingBottom: '5px' }}>
                Recipe {index + 1}: {recipe['Recipe Name']}
            </h4>
            
            {/* Displaying Attributes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9em', marginBottom: '10px' }}>
                <p><b>Dish Type:</b> {recipe['Dish Type']}</p>
                <p><b>Preparation Time:</b> {recipe['Preparation Time']}</p>
                <p><b>Difficulty:</b> {recipe['Difficulty']}</p>
                <p><b>Total Calories:</b> {recipe['TOTAL CALORIES']}</p>
            </div>
            
            {/* Ingredients */}
            <h5 style={{ marginTop: '10px' }}>Ingredients:</h5>
            <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9em' }}>{recipe['Ingredients']}</p>

            {/* Step-by-step Instructions */}
            <h5 style={{ marginTop: '10px' }}>Instructions:</h5>
            <ol style={{ paddingLeft: '20px', fontSize: '0.9em' }}>
                {/* Assuming instructions come as a string, we split them by step numbers */}
                {recipe['Step-by-step Instructions'].split(/\d+\./).filter(s => s.trim() !== '').map((step, i) => (
                    <li key={i}>{step.trim()}</li>
                ))}
            </ol>
             <h5 style={{ marginTop: '10px' }}>Chef’s Tip:</h5>
             <p style={{ fontStyle: 'italic', fontSize: '0.9em' }}>{recipe['Chef’s Tip']}</p>
        </div>
    );

    return (
        <div className="container" style={{ maxWidth: 650, margin: '50px auto' }}>
            <h2 style={{ color: 'var(--color-primary)', textAlign: 'center' }}>🤖 AI Meal Planner</h2>
            <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
                Generates full recipes using your diet preferences via FoodHub.
            </p>

            <div style={{ padding: '20px', border: '2px solid var(--color-primary)', borderRadius: '10px', background: '#f5f5f5ff' }}>
                {/* Profile (BMR/TDEE) */}
                <div style={{ marginBottom: 12 }}>
                    <BmrForm onSave={(p) => setProfile(p)} />
                    {profile && (
                        <div style={{ fontSize: 13, color: '#444', marginTop: 6 }}>
                            <div><b>BMR:</b> {profile.bmr} kcal • <b>TDEE:</b> {profile.tdee} kcal</div>
                        </div>
                    )}
                </div>

                {/* Preference Dropdowns */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <select 
                        value={dietType} 
                        onChange={(e) => setDietType(e.target.value)}
                        style={{ padding: '10px', flex: 1, borderRadius: '5px' }}
                        disabled={loadingAI}
                    >
                        {dietOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>

                    <select 
                        value={goalType} 
                        onChange={(e) => setGoalType(e.target.value)}
                        style={{ padding: '10px', flex: 1, borderRadius: '5px' }}
                        disabled={loadingAI}
                    >
                        {goalOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>

                {/* Generate Button */}
                <button 
                    onClick={handleGenerateMeal} 
                    disabled={loadingAI || !dietType || !goalType}
                    style={{ width: '100%', padding: '12px', background: '#5269d0ff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    {loadingAI ? 'Generating Recipes...' : 'Generate AI Meal Plan'}
                </button>
                
                {aiError && <p style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>{aiError}</p>}
            </div>
            
            {/* Output Display */}
            {aiMealPlan && (
                <div style={{ marginTop: '30px' }}>
                    <h3 style={{ color: 'var(--color-primary)' }}></h3>
                    {aiMealPlan.recipes.map((recipe, index) => (
                         // Assuming the JSON returns an array of recipes under a 'recipes' key
                         renderRecipeCard(recipe, index) 
                    ))}

                    {/* Quick action to open the calculator and import selected recipes */}
                    <div style={{display:'flex', gap:12, marginTop:12}}>
                        <button
                            type="button"
                            onClick={() => navigate('/calculator')}
                            style={{padding:'10px 12px', background:'#5269d0ff', color:'#fff', border:'none', borderRadius:6}}
                        >
                            Open in Calculator
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                // clear selections
                                setSelectedIndices([]);
                                localStorage.removeItem('selectedRecipes');
                            }}
                            style={{padding:'10px 12px', border:'1px solid #e5e7eb', background:'#afb5eaff', borderRadius:6}}
                        >
                            Clear Selection
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}


