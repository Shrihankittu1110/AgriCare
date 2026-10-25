# 🌱 AgriCare AI — Smart Agriculture Assistant

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-2E9E44?style=for-the-badge)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Languages](https://img.shields.io/badge/Languages-English%20|%20తెలుగు%20|%20हिन्दी-F59E0B?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)]()

**AgriCare AI** is a modern, responsive, full-stack MERN web application engineered for farmers, agronomists, and agricultural extension workers across India. It provides real-time crop leaf health diagnostics, localized weather risk forecasts, conservative cultural remedies, and an interactive voice-enabled AI agricultural advisor supporting **English**, **Telugu (తెలుగు)**, and **Hindi (हिन्दी)**.

---

## 🌾 Key Capabilities

### 1. 🍃 AI Crop & Leaf Disease Detection
* **Visual Pathology Diagnosis:** Identifies major foliar conditions across key Indian crops (Tomato Early/Late Blight, Cotton Leaf Curl Virus, Rice Brown Spot, Potato Blights, and Healthy canopies).
* **Defensible Metrics:** Returns verified crop identification, pathogen classification, confidence score percentage, severity estimation, visible foliar symptoms, and likely causal mechanisms.
* **Grounded Agronomic Remedies:** Structured into cultural field sanitation, biological/organic solutions (such as Cold-Pressed Neem Oil and *Trichoderma viride*), and long-term crop rotation.
* **Conservative Guidance & Disclaimers:** Strictly avoids reckless chemical recommendations; directs farmers to consult local Krishi Vigyan Kendras (KVK) and certified product labels.
* **Provider Transparency:** Integrates Google Gemini Vision AI (`gemini-1.5-flash`), with an offline-resilient, clearly labeled **Development / Demonstration Mode** when external API keys are not supplied.

### 2. 🌦️ Weather Intelligence & Agro-Risk Alerts
* **Zero-Config Real-Time Meteorological Data:** Connects by default to the free **Open-Meteo Meteorological Service** (no API key required), with full support for **OpenWeatherMap**.
* **Microclimate Metrics:** Current temperature, apparent ("feels-like") temperature, relative humidity, precipitation, wind speed, and WMO weather classifications.
* **7-Day Outlook:** Daily temperature highs/lows and rainfall probability forecasts.
* **Weather-Aware Farming Alerts:**
  * **Fungal Sporulation Warning:** Triggered when humidity > 80% and temperatures favor spore germination.
  * **Spray Postponement Alert:** Detects imminent precipitation within 24–48 hours to prevent chemical runoff and wastage.
  * **Wind Drift Hazard:** Alerts when wind velocities exceed safe spray thresholds (~18 km/h).

### 3. 🤖 AI Agricultural Chat Assistant
* Grounded conversational agronomy assistant with contextual awareness of the user's active crop scan and local weather.
* Responds natively in fluent **Telugu**, **Hindi**, or **English**.
* Practical answers covering yellowing leaves (chlorosis), post-heavy-rain field recovery, soil health, and organic IPM.

### 4. 🎙️ Voice Interaction (Speech-to-Text & Text-to-Speech)
* **Voice Input (STT):** Microphone speech recognition using browser Web Speech API with regional dialect codes (`te-IN`, `hi-IN`, `en-IN`), with live transcription review and editing before submission.
* **Voice Responses (TTS):** Dedicated speaker control on every assistant message to read advice aloud in the farmer's native dialect.
* **Privacy-First Permission Prompts:** Friendly onboard modals explaining why microphone, camera, or location access is requested with graceful refusal fallbacks.

### 5. 🌐 Trilingual Localization (i18next)
* Comprehensive UI translation dictionaries located in separate JSON files:
  * `frontend/src/locales/en/translation.json` (English)
  * `frontend/src/locales/te/translation.json` (తెలుగు)
  * `frontend/src/locales/hi/translation.json` (हिन्दी)
* Synchronized with user profile preferences in MongoDB.

### 6. 📋 Field Diagnostic History & Reporting
* User-isolated scan history stored in MongoDB with thumbnail previews, status filters, and search.
* Detailed diagnostic view with printable/PDF export capabilities.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS, Lucide React, Axios, i18next, react-i18next, Web Speech API |
| **Backend** | Node.js, Express.js, REST API architecture, Helmet, CORS, Express-Rate-Limit, Multer |
| **Database** | MongoDB, Mongoose ODM with schema validations and compound indexes |
| **Auth & Security** | JWT (JSON Web Tokens), bcryptjs password hashing, HTTP-only cookies, ownership verification |
| **Weather API** | Open-Meteo Global Service (Default, Zero-Config) / OpenWeatherMap |
| **AI / Vision** | Google Gemini Vision / Generative AI API + AgriCare Pathology Demonstration Engine |
| **Testing** | Jest, Supertest, MongoMemoryServer |

---

## 📁 Project Directory Structure

```
AgriCare-MERN/
├── backend/
│   ├── src/
│   │   ├── config/             # DB connection (Local/Atlas + MongoMemoryServer fallback), env config
│   │   ├── controllers/        # Auth, Scan, Weather, Assistant, User controllers
│   │   ├── middleware/         # JWT Auth, Multer file upload, Validation, Centralized Error Handler
│   │   ├── models/             # Mongoose schemas: User, CropScan, ChatConversation, UserPreferences
│   │   ├── routes/             # REST route endpoints
│   │   ├── services/
│   │   │   ├── ai/             # Gemini AI + Demo Agronomy Assistant
│   │   │   ├── cropDetection/  # Gemini Vision + Demo Pathology Classifier
│   │   │   ├── weather/        # Open-Meteo + OpenWeatherMap Providers
│   │   │   └── recommendations/# Meteorological Agronomy Risk Engine
│   │   ├── app.js              # Express app, Helmet, CORS, Rate Limiters
│   │   └── server.js           # Server bootstrap and graceful shutdown
│   ├── tests/                  # Automated integration tests (Auth, Weather, Scans)
│   ├── uploads/                # Controlled local image storage
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, MobileBottomNav, PermissionModal, LanguageSwitcher
│   │   │   ├── weather/        # WeatherWidget, WeatherForecastCard, WeatherAgronomyAlerts
│   │   │   ├── scan/           # CameraCapture, ImageUploader, ScanGuidance, ScanResultCard
│   │   │   └── assistant/      # ChatWindow, VoiceInputControl, VoiceSpeechControl
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── hooks/              # useSpeechRecognition, useSpeechSynthesis, useGeolocation
│   │   ├── layouts/            # MainLayout (Public), DashboardLayout (Protected)
│   │   ├── locales/            # en, te, hi translation.json and i18n setup
│   │   ├── pages/              # Home, Login, Register, Dashboard, Scan, History, Weather, Assistant, Profile
│   │   ├── services/           # Axios API services (Auth, Scan, Weather, Assistant)
│   │   ├── App.jsx             # Route definitions
│   │   ├── index.css           # Tailwind custom animations & utilities
│   │   └── main.jsx
│   ├── .env.example
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## ⚙️ Prerequisites

* **Node.js:** v18.0.0 or later (v20+ or v24 recommended)
* **npm:** v9.0.0 or later
* **MongoDB:** Local MongoDB instance running on `mongodb://127.0.0.1:27017` OR a free MongoDB Atlas connection URI. *(Note: in development mode, an in-memory database fallback is also included if a local service is temporarily inactive).*

---

## 🔑 Environment Configuration

### Backend Configuration (`backend/.env`)

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/agricare
JWT_SECRET=agricare-super-secret-jwt-key-2026-production-ready
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173

# Weather Configuration
# Default is 'open-meteo' which requires NO API key!
# If you prefer OpenWeatherMap, set WEATHER_PROVIDER=openweather and enter your key.
WEATHER_PROVIDER=open-meteo
WEATHER_API_KEY=

# AI & Vision Provider Configuration (Google Gemini)
# Optional: If left blank, AgriCare AI automatically operates in labeled Demonstration Mode
AI_PROVIDER_API_KEY=
AI_MODEL=gemini-1.5-flash

# Crop Detection Provider Mode ('auto', 'gemini', or 'demo')
CROP_DETECTION_PROVIDER=auto
```

### Frontend Configuration (`frontend/.env`)

Create a `.env` file in the `frontend/` folder:

```env
# All sensitive secrets remain strictly on the backend.
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Local Execution

### 1. Install Dependencies

Open a terminal and install backend dependencies:
```bash
cd backend
npm install
```

In a second terminal, install frontend dependencies:
```bash
cd frontend
npm install
```

### 2. Start the Backend Server

```bash
cd backend
npm run dev
```
*The backend API will start at **http://localhost:5000**.*
*You can verify server health at **http://localhost:5000/api/health**.*

### 3. Start the Frontend Development Server

```bash
cd frontend
npm run dev
```
*The Vite development server will start at **http://localhost:5173**.*

Open **http://localhost:5173** in your browser.

---

## 🧪 Running Automated Tests

AgriCare AI includes automated integration tests covering user registration, password length constraints, duplicate account prevention, JWT authorization headers, live weather queries, location geocoding, and scan upload validation.

Run the test suite from the backend directory:
```bash
cd backend
npm test
```

---

## 🔒 Security & Privacy Practices

* **Password Protection:** Uses `bcryptjs` with 10 salt rounds; plain-text passwords are never stored.
* **Authorized Access:** All scan and chat routes verify JWT tokens and strictly ensure farmers can only view and modify their own data.
* **Upload Validation:** Restricts uploads strictly to `image/jpeg`, `image/png`, and `image/webp` with a 10MB file-size ceiling.
* **Rate Limiting:** Protects backend endpoints against brute-force and DDoS attempts with `express-rate-limit`.
* **Security Headers:** Enforces CSP and secure headers using `helmet`.
* **Private API Keys:** External API keys (e.g. Gemini, OpenWeather) are stored strictly on the Node.js backend and are never exposed to browser client code.

---

## 📞 Farmer Support & Emergency Information

* **Kisan Call Center (Govt. of India):** `1800-180-1551` (Toll-Free, 6:00 AM – 10:00 PM)
* For acute, widespread pest emergencies or sudden crop mortality, farmers should immediately contact their district Agricultural Officer or nearest **Krishi Vigyan Kendra (KVK)**.

---

## 📄 License
This project is licensed under the MIT License.
