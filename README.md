# **FoodHub – AI Nutrition & Calorie Tracker**

A full-stack web app for personalized meal planning and calorie tracking powered by Google Gemini AI. Users can calculate their BMR/TDEE, generate AI-based meal plans tailored to fitness goals, and track daily nutrition with an interactive calorie calculator.

---

## **🚀 Features**

* **BMR/TDEE Calculator** for personalized calorie needs
* **AI-Generated Meal Plans** based on diet type and fitness goals
* **Recipe Selection & Storage** with automatic deduplication
* **Interactive Calorie Calculator** for real-time macro tracking
* **Daily Nutrition Summary** with visual progress indicators
* **LocalStorage Persistence** for profile, meals, and ingredients
* **Fully Responsive UI** for mobile and desktop

---

## **📁 Project Structure**

```
FOODHUB/
├── backend/
│   ├── server.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
│
├── frontend/frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── src/
│   ├── public/
│   └── assets/
│
└── README.md
```

---

## **🛠️ Tech Stack**

### **Backend**

* Node.js
* Express.js
* MongoDB (optional for dev)
* Mongoose
* Google Gemini AI
* JWT Auth
* Bcrypt
* Dotenv

### **Frontend**

* React 19
* Vite
* React Router
* CSS
* LocalStorage

---

## **📋 Prerequisites**

* Node.js v16+
* npm or yarn
* Gemini API Key
* MongoDB URI (optional)

---

## **🚀 Installation & Setup**

### **1. Clone the Repository**

```bash
git clone https://github.com/NidhiHalwe/nutrihub-nutrition-calorie-tracker.git
cd FOODHUB
```

### **2. Backend Setup**

```bash
cd backend
npm install
```

Create a `.env` file:

```
GEMINI_API_KEY=your_api_key
MONGO_URI=your_mongo_uri   # optional
PORT=5000
```

Run backend:

```bash
npm run dev
```

### **3. Frontend Setup**

```bash
cd frontend/frontend
npm install
npm run dev
```

App will open at:
`http://localhost:5173`

---

## **🎯 How the App Works**

### **1. Calculate BMR/TDEE**

Enter:

* Age
* Sex
* Height
* Weight
* Activity level

Save profile to generate calorie targets.

### **2. Generate AI Meal Plans**

Choose:

* Diet type
* Goal
* AI generates a 2-day meal plan based on your calorie needs.

### **3. Add & Track Meals**

Selected recipes move to the Calorie Calculator where you can:

* Adjust quantities
* Add ingredients
* View real-time macro totals

### **4. Set Daily Calorie Goal**

Update target in Nutrition Summary and track progress.

---

## **📊 Key Calculations**

### **BMR (Mifflin–St Jeor)**

* **Men:**
  `10×weight + 6.25×height − 5×age + 5`
* **Women:**
  `10×weight + 6.25×height − 5×age − 161`

### **TDEE**

```
TDEE = BMR × Activity Factor
```

### **Calorie Targets**

* Weight Loss: `TDEE − 500`
* Weight Gain: `TDEE + 500`
* Maintenance: `TDEE`

---

## **💾 LocalStorage Keys**

* `foodhub_profile`
* `selectedRecipes`
* `calculatorIngredients`
* `targetCalories`

---

## **🐛 Troubleshooting**

* **Backend not starting:** check `.env` and port 5000
* **Gemini key error:** ensure `GEMINI_API_KEY` is in `.env`
* **Frontend blank:** restart dev server, clear cache
* **Meals not importing:** clear `selectedRecipes` from LocalStorage

---

## **📡 API Routes**

### AI

`POST /generate-meal`

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/logout`

---

## **📝 Future Enhancements**

* User history & weekly analytics
* Barcode scanner
* Grocery list generator
* Custom recipes
* Mobile app
* Fitness tracker integration
* Multi-language support

---

## **🤝 Contributing**

1. Fork the repo
2. Create a new branch
3. Commit changes
4. Push & open a pull request

---

## **📄 License**

MIT License.

---

## **👤 Author**

**Nidhi Halwe**
GitHub: [@NidhiHalwe](https://github.com/NidhiHalwe)

---
## 📧 Support For issues, questions, or feedback, open an issue on GitHub or contact the project maintainer.
--- **Happy Tracking! 🥗💪**
