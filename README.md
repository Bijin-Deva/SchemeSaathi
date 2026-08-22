# SchemeSaathi — Know Your Government Schemes

SchemeSaathi is a full-stack web application that helps Indian citizens discover government schemes, check their eligibility, and get plain-language explanations in their regional language — powered by IBM watsonx.ai.

## Features

- 🔍 **Scheme Discovery** — Browse and search 15+ real Indian government schemes
- ✅ **Eligibility Checker** — Enter your profile to find schemes you qualify for
- 🤖 **AI Assistant** — Floating chat widget powered by IBM watsonx.ai (Granite model)
- 🌐 **Multilingual** — English, Hindi, and Telugu support via i18next
- 🔐 **Auth** — JWT-based register/login with bcrypt password hashing
- 📄 **No Database** — flat JSON file for users, Excel file for schemes

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS + react-router-dom v6 |
| i18n | i18next + react-i18next |
| HTTP | axios with JWT interceptor |
| Backend | Node.js + Express |
| Auth | bcryptjs + jsonwebtoken |
| Schemes | xlsx (Excel parser) |
| AI | IBM watsonx.ai (`@ibm-cloud/watsonx-ai`) |

## Getting Started

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

Copy `server/.env.example` to `server/.env` and fill in your IBM watsonx.ai credentials:

```
LLM_API_KEY=your_ibm_watsonx_api_key
WATSONX_PROJECT_ID=your_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
JWT_SECRET=your_secret_key
```

Copy `client/.env.example` to `client/.env` (default values work out of the box).

### 3. Run

```bash
npm run dev
```

- **Client:** http://localhost:5173  
- **Server API:** http://localhost:5000

## Project Structure

```
SchemeSaathi/
├── client/          React frontend (Vite)
└── server/          Express backend
    └── data/
        ├── schemes.xlsx   Government scheme knowledge base
        └── users.json     Flat user store
```

## Privacy

All personal information entered by users is used **only** for matching government schemes and is never shared with third parties.

## Powered by IBM watsonx.ai

The AI chat assistant uses IBM Granite models via the watsonx.ai SDK for RAG-lite scheme question answering.
