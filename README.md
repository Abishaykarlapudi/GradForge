# GradForge - Student Career & Academic Accelerator

GradForge is an all-in-one student platform enabling users to build final-year projects, draft ATS resumes, publish portfolio websites, generate assignments, compile report documentation, and practice viva voce examinations using AI guidance.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Local instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 2. Environment Setup
Create a `.env` file in the root directory (a template has already been created for you).
Fill in keys for AI capabilities and image hosting:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/gradforge
JWT_SECRET=gradforge_secret_jwt_key_123
NODE_ENV=development

# AI Configuration (Options: "gemini" | "openai")
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Cloudinary Integration (Local storage fallback is used if blank)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Installation
Install all dependencies for root, client, and server packages by running:
```bash
npm run install-all
```

### 4. Running the Application
To boot both the Vite frontend server and Express backend server concurrently:
```bash
npm run dev
```
- **Frontend URL**: `http://localhost:3000` (Proxy calls `/api/*` to backend)
- **Backend URL**: `http://localhost:5000`

---

## 🔍 Testing Workflow (Local Simulation)

GradForge features built-in developer shortcuts to let you test the system instantly:
1. **Email Verification**: When you register a new account on the register page, check your terminal console where the server is running. The server logs a verification token (e.g. `[MOCK EMAIL] Verification Token: <token_here>`). Copy the token, click "Proceed to Verification", paste it, and verify your account.
2. **Password Resets**: Similarly, password reset request tokens are printed directly to the console terminal for easy testing.
3. **Subscriptions**: Upgrading your account from Free to Premium can be tested by visiting the Billing/Subscription tab inside the dashboard. Click "Simulate Premium Upgrade" to immediately unlock unlimited resume creation, portfolios, viva simulations, and documentation tools.
4. **Offline AI Mode**: If `GEMINI_API_KEY` and `OPENAI_API_KEY` are not configured in `.env`, the service defaults to a mock mode. It will generate rich, formatted database templates, project idea grids, assignments, and mock viva evaluations, allowing you to review all UI pages without calling a live paid API!

---

## 📂 Project Architecture

```
gradforge/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI & Floating Assistant
│   │   ├── context/            # AuthContext & ThemeContext
│   │   ├── layouts/            # Sidebar & Top Bar Layout wraps
│   │   ├── pages/              # Landing, Builders, Viva, etc.
│   │   └── index.css           # Custom glassmorphic styling
├── server/                     # Node.js + Express Backend
│   ├── config/                 # MongoDB & Cloudinary drivers
│   ├── controllers/            # CRUD & AI routing handlers
│   ├── models/                 # Mongoose schemas
│   ├── services/               # AI wrapper layer (Gemini & OpenAI)
│   └── server.js               # Entry point
```

---

## 🛡️ License
Built for student careers and academic excellence. All rights reserved.
