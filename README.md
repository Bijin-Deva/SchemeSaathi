# SchemeSaathi — Know Your Government Schemes

> *Empowering every Indian citizen to know and claim their rightful government benefits in their own language.*

SchemeSaathi is a full-stack web application that helps Indian citizens discover government welfare schemes, check their eligibility, and get plain-language answers in their regional language — powered by an AI assistant built with IBM Bob.

---

## Features

- **Scheme Discovery** — Browse and search 18 real Indian government schemes across Agriculture, Health, Housing, Education, Employment, and Women Empowerment
- **Eligibility Checker** — Enter your profile details to get a ranked list of schemes you actually qualify for, scored across age, income, gender, state, and caste category
- **AI Chat Assistant** — Floating chat widget with a RAG-lite pipeline: retrieves relevant schemes from the knowledge base and passes them as context to the LLM, preventing hallucination
- **Multilingual** — English, Hindi, and Telugu support in both the application UI and the AI assistant responses
- **User Profiles** — Save your profile once; the eligibility form pre-fills automatically on every visit
- **Saved Schemes** — Bookmark schemes from the detail page and access them from your profile
- **Auth** — JWT-based register/login with bcrypt password hashing
- **No Database Required** — Flat JSON file for users, Excel file for the scheme knowledge base

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS + react-router-dom v6 |
| i18n | i18next + react-i18next (EN / HI / TE) |
| HTTP | Axios with JWT interceptor |
| Backend | Node.js + Express |
| Auth | bcryptjs + jsonwebtoken |
| Scheme data | xlsx (Excel parser, in-memory cache) |
| AI | Groq API — LLaMA 3.3 70B (`llama-3.3-70b-versatile`) |
| Dev tool | IBM Bob (Plan, Agent, and Ask modes) |

---

## Getting Started

### 1. Install dependencies

```bash
npm run install:all
```

This installs dependencies for the root, `client/`, and `server/` in one step.

### 2. Configure environment

Copy `server/.env.example` to `server/.env` and fill in your credentials:

```bash
cp server/.env.example server/.env
```

```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
LLM_API_KEY=your_groq_api_key_here
LLM_MODEL=llama-3.3-70b-versatile
```

Get a free Groq API key at [console.groq.com](https://console.groq.com).

Copy `client/.env.example` to `client/.env` — the default value works out of the box:

```bash
cp client/.env.example client/.env
```

```env
VITE_API_URL=http://localhost:5000
```

### 3. Generate the scheme knowledge base

If `server/data/schemes.xlsx` does not exist, generate it:

```bash
node scripts/generate-schemes.js
```

### 4. Run

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health check:** http://localhost:5000/api/health

---

## Project Structure

```
SchemeSaathi/
├── client/                    React frontend (Vite)
│   └── src/
│       ├── components/        Navbar, Layout, SchemeCard, BotWidget, ProtectedRoute
│       ├── context/           AuthContext (JWT state)
│       ├── locales/           en.json, hi.json, te.json
│       ├── pages/             Home, Schemes, SchemeDetail, EligibilityChecker,
│       │                      Profile, Login, Register, About, Services
│       └── services/          api.js (Axios + JWT interceptor)
├── server/                    Express backend
│   ├── src/
│   │   ├── controllers/       auth, bot, eligibility, profile, schemes
│   │   ├── middleware/        authMiddleware (JWT guard)
│   │   ├── routes/            auth, bot, eligibility, profile, schemes
│   │   └── services/          schemeStore, userStore, eligibilityMatcher,
│   │                          contextBuilder, llmClient
│   └── data/
│       ├── schemes.xlsx       Government scheme knowledge base (18 schemes)
│       └── users.json         Flat user store
└── scripts/
    └── generate-schemes.js    Generates schemes.xlsx from source data
```

---

## API Endpoints

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/register` | POST | No | Register a new user |
| `/api/auth/login` | POST | No | Login and receive JWT |
| `/api/schemes` | GET | No | List / search / filter schemes |
| `/api/schemes/:id` | GET | No | Get a single scheme by ID |
| `/api/eligibility/check` | POST | No | Run eligibility match |
| `/api/bot/chat` | POST | No | AI chat query |
| `/api/profile` | GET / PUT | Yes | Get or update user profile |
| `/api/profile/saved-schemes` | GET / POST | Yes | Get or save bookmarked schemes |
| `/api/health` | GET | No | Server health check |

---

## How the AI Assistant Works

1. The user's message is used to keyword-search the scheme database — up to 5 matching schemes are retrieved.
2. A system prompt is assembled containing those scheme details, the user's saved profile (if logged in), and a language instruction.
3. The prompt explicitly instructs the model to answer only from the provided scheme context and not to recommend schemes the user does not qualify for.
4. The prompt and conversation history (last 10 messages) are sent to the Groq API.
5. The response is rendered in the chat widget with support for bold text and markdown tables.

---

## Privacy

All personal information entered by users is used **only** to match relevant government schemes and personalise AI assistant answers. It is never shared with third parties. A privacy notice is displayed on the Eligibility Checker, Profile page, About page, and inside the AI chat widget.

---

## Built With IBM Bob

This project was developed end-to-end using IBM Bob as the AI coding partner — from architecture planning in Plan mode, to full-stack code generation in Agent mode, to codebase exploration and debugging in Ask mode.
