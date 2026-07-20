# Karl Cabalonga — Portfolio

A personal portfolio website for Karl Wystan Cabalonga, built with React 19 + Vite 8 (frontend) and Express.js 4 (backend).

> **Live:** Multi-page portfolio with sidebar navigation, project showcase, AI chat, and guestbook.

---

## Project Structure

```
.
├── client/          # React 19 + Vite 8 frontend (ESM)
│   ├── src/
│   │   ├── pages/       # 8 page components (Home, About, Achievements, Projects, Guestbook, Uses, Contact, Links)
│   │   ├── components/  # Shared UI components (Sidebar, Layout, Footer, ChatWidget, etc.)
│   │   ├── hooks/       # Custom React hooks (useScrollReveal, useTypewriter)
│   │   ├── data/        # Static content (portfolioData.js)
│   │   └── assets/      # Images, logos, certificates
│   ├── public/          # Static assets
│   └── package.json
└── server/          # Express.js 4 backend API (CommonJS)
    ├── index.js     # Server entry (health, chat, guestbook endpoints)
    ├── data/        # JSON data store (guestbook entries)
    ├── .env         # NVIDIA API key
    └── package.json
```

## Getting Started

```powershell
# Terminal 1 — start the API server
cd server
npm run dev

# Terminal 2 — start the frontend
cd client
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5010/api/health

The Vite dev server proxies `/api/*` requests to the Express backend automatically during development.

Or run both simultaneously from the root:
```powershell
npm run dev      # starts client (:3000) + server (:5010) concurrently
```

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, typewriter intro, quick links |
| About | `/about` | In-depth bio, experience, education, tech stack |
| Achievements | `/achievements` | Certifications + awards with image viewer |
| Projects | `/projects` | Project grid filtered by category |
| Guestbook | `/guestbook` | Leave a message (persisted) |
| Uses | `/uses` | Tools, software, and gear |
| Contact | `/contact` | Contact form + quick subject chips |
| Links | `/links` | All social and professional links |

## Commands

| Project | Command | Description |
|---------|---------|-------------|
| `root`   | `npm run dev` | Start both client + server concurrently |
| `client` | `npm run dev` | Start Vite dev server on port 3000 (HMR) |
| `client` | `npm run build` | Production build → `client/dist/` |
| `client` | `npm run lint` | Run ESLint |
| `server` | `npm run dev` | Start with `--watch` (auto-restart) on port 5010 |
| `server` | `npm start` | Production start |

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS v4, React Router 7 |
| Backend | Node.js 22, Express.js 4 |
| AI Chat | NVIDIA NIM API (Llama 4 Maverick) |
| Storage | JSON file (guestbook) |
| Language | JavaScript (ESM in client, CommonJS in server) |

## Design

Paper-inspired light theme with:
- Custom cubic-bezier easing (expo, spring)
- Canvas-based noise grain texture
- Animated grid-line borders
- Typewriter effect on home page
- Scroll-reveal animations
- Emil Kowalski's design engineering philosophy
