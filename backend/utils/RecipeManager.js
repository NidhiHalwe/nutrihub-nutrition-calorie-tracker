import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

/**
 * RecipeManager: generates meal recipes using Gemini (Google Generative AI),
 * with a safe local fallback when no API key is present.
 */
class RecipeManager {
  /**
   * options:
   *  - apiKey: (string) Gemini / Google API key (optional)
   *  - endpoint: (string) API endpoint (optional)
   *  - timeoutMs: (number) fetch timeout
   *  - maxRetries: (number) retry attempts for transient errors
   */
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    this.endpoint =
      options.endpoint ||
      process.env.GEMINI_ENDPOINT ||
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent';
    this.timeoutMs = options.timeoutMs || 20_000;
    this.maxRetries = options.maxRetries ?? 2;
  }

  async generateRecipes(mealType = 'dinner', dayPlan = {}, dayName = 'Today') {
    const ingredients = this.collectIngredients(mealType, dayPlan);
    if (!ingredients || ingredients.length === 0) {
      throw new Error('No ingredients found for this meal');
    }

    const prompt = this.createPrompt(mealType, ingredients, dayName);

    // If no API key, use a simple local fallback generator
    if (!this.apiKey) {
      const text = this.localFallback(prompt, mealType, ingredients);
      return {
        text,
        html: this.markdownToHtml(text),
      };
    }

    // Call Gemini (with retry)
    const rawText = await this.callGeminiWithRetries(prompt);
    const html = this.markdownToHtml(rawText);
    return { text: rawText, html };
  }

  collectIngredients(mealType, dayPlan) {
    const mealsToInclude = mealType === 'lunch' ? ['Lunch'] : ['Dinner'];
    const list = [];
    const set = new Set();

    mealsToInclude.forEach((name) => {
      const meal = dayPlan[name];
      if (!meal || !Array.isArray(meal.items)) return;
      meal.items.forEach((item) => {
        const nm = (item.name || '').trim();
        const grams =
          item.grams ?? item.quantity ?? item.qty ?? item.quantityInGrams ?? 100;
        if (!nm) return;
        const key = `${nm.toLowerCase()}|${grams}`;
        if (!set.has(key)) {
          set.add(key);
          list.push(`${nm} (${grams}g)`);
        }
      });
    });

    return list;
  }

  createPrompt(mealType, ingredients, dayName = 'Today') {
    const context =
      mealType === 'lunch'
        ? 'for lunch (light and midday-appropriate meals)'
        : 'for dinner (hearty, evening meals)';

    return `You are an expert chef and nutritionist. Create 3-4 original, creative, LOW-FODMAP, gluten-free recipes ${context} using these ingredients I have available ${dayName}:

${ingredients.join(', ')}

For each recipe provide in CLEAR MARKDOWN:
1. Recipe Name
2. Dish Type (starter, main, etc.)
3. Preparation Time
4. Difficulty (Easy / Medium / Hard)
5. Ingredients (use my provided list + basics like salt/olive oil)
6. Step-by-step Instructions
7. Chef’s Tip
8. TOTAL CALORIES — give a single total like: "Total Calories: 430 kcal"

Return ONLY Markdown content (no surrounding commentary). Keep responses concise and machine-parseable.`;
  }

  async callGeminiWithRetries(prompt) {
    let attempt = 0;
    let lastErr = null;

    while (attempt <= this.maxRetries) {
      try {
        return await this.callGemini(prompt);
      } catch (err) {
        lastErr = err;
        attempt += 1;
        // small backoff
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 500 * attempt));
      }
    }

    // After retries, throw last error
    throw lastErr ?? new Error('Unknown error calling Gemini');
  }

  async callGemini(prompt) {
    if (typeof fetch === 'undefined') {
      throw new Error('Global fetch not available. Use Node 18+ or provide a fetch polyfill.');
    }

    const url = `${this.endpoint}?key=${this.apiKey}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const body = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 1500,
        },
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`Gemini API error ${res.status}: ${txt}`);
      }

      const data = await res.json();

      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        data.candidates?.[0]?.text ||
        data.output?.[0]?.content?.[0]?.text ||
        (typeof data === 'string' ? data : null);

      if (!text) throw new Error('No text returned from Gemini');
      return text;
    } catch (err) {
      if (err.name === 'AbortError') throw new Error('Gemini request timed out');
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  markdownToHtml(markdown) {
    const rawHtml = marked.parse(markdown || '');
    const clean = sanitizeHtml(rawHtml, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        a: ['href', 'name', 'target'],
        img: ['src', 'alt'],
      },
    });
    return clean;
  }

  // Simple deterministic local fallback for offline testing
  localFallback(_prompt, mealType, ingredients) {
    const lines = [];
    lines.push(`# ${mealType.toUpperCase()} suggestions (local fallback)`);
    ingredients.slice(0, 6).forEach((ing, i) => {
      lines.push(`## Recipe ${i + 1}: ${ing} Delight`);
      lines.push(`**Dish Type:** Main`);
      lines.push(`**Preparation Time:** 20-30 minutes`);
      lines.push(`**Difficulty:** Easy`);
      lines.push('**Ingredients:**');
      lines.push(`- ${ing}`);
      lines.push('- Salt, pepper, olive oil');
      lines.push('**Instructions:**');
      lines.push(`1. Prepare ${ing}.`);
      lines.push('2. Cook with olive oil, season to taste.');
      lines.push(`**Chef's Tip:** Use fresh herbs.`);
      lines.push('**Total Calories:** ~400 kcal');
      lines.push('');
    });
    return lines.join('\n\n');
  }
}

export default RecipeManager;







