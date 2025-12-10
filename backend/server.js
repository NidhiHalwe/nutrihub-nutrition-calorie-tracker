import express from 'express';
import { GoogleGenAI } from '@google/genai';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// Assuming these imports are necessary for your other routes:
import authRoutes from './routes/auth.js'; 
import mealRoutes from './routes/meal.js';
import foodRoutes from './routes/food.js';
import aiRoutes from './routes/ai.js';
import recipesRoutes from './routes/recipes.js';

dotenv.config();

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 
const GEMINI_MODEL = "gemini-2.5-flash"; // Fast and capable model

const app = express();
app.use(cors()); // Enable CORS for the React frontend
app.use(express.json()); // To parse JSON bodies

// --- Existing Routes (Assuming you want to keep these active) ---
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/recipes', recipesRoutes);
// -----------------------------------------------------------------

// ⚡ NEW AI MEAL PLANNER ROUTE (STRICT JSON OUTPUT) ⚡
app.post('/generate-meal', async (req, res) => {
    // Input is the combined string from the React dropdowns (e.g., "Generate a 2-day meal plan for Vegan diet with a focus on Weight Loss.")
    const { input } = req.body; 

    if (!input) {
        return res.status(400).json({ error: "Input is required for the meal planner." });
    }

    const prompt = `
        Based on the user's request: "${input}", generate two detailed, distinct recipe objects.
        
        The output MUST be a single JSON object. 
        This object MUST contain one key: 'recipes'. 
        The value of 'recipes' must be an array of exactly two JSON objects (one recipe for each day).

        Each recipe JSON object MUST use the following EXACT keys for the response:
        "Recipe Name"
        "Dish Type" (e.g., Main, Snack, Dessert)
        "Preparation Time" (e.g., 15 minutes)
        "Difficulty" (e.g., Easy, Medium, Hard)
        "Ingredients" (List all ingredients and quantities clearly in a single string)
        "Step-by-step Instructions" (List instructions clearly, numbered 1. 2. 3. etc., in a single string)
        "Chef’s Tip"
        "TOTAL CALORIES" (Estimate in kcal, e.g., 450 kcal)
    `;

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            // Force the model to output a valid JSON string
            config: {
                responseMimeType: "application/json",
            },
        });

        // Send the raw JSON string text back to the frontend
        res.json({ mealPlan: response.text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to generate structured meal plan." });
    }
});

// --- MongoDB Connection and Server Start ---
const PORT = process.env.PORT || 5000;

function startServer() {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// If a Mongo URI is provided, try to connect but start server even if connection fails.
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to MongoDB');
        startServer();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        console.warn('Starting server without MongoDB connection. Some features may be disabled.');
        startServer();
    });
} else {
    console.warn('MONGO_URI not set — starting server without MongoDB.');
    startServer();
}