# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```powershell
# Root — runs both client + server concurrently
npm run dev                  # concurrently: client:3000 + server:5010
npm run build                # runs `cd client && npm run build`
npm run lint                 # runs `cd client && npm run lint`

# Client (React + Vite)
cd client && npm run dev     # Dev server on :3000 with HMR
cd client && npm run build   # Production build → client/dist/
cd client && npm run preview # Preview production build locally
cd client && npm run lint    # ESLint (flat config)

# Server (Express.js)
cd server && npm run dev     # Dev mode with --watch (auto-restart)
cd server && npm start       # Production start

# Both terminals needed simultaneously:
# Terminal 1: cd server && npm run dev     (listens on :5010 via server/.env)
# Terminal 2: cd client && npm run dev     (listens on :3000, proxies /api → :5010)
```

**No test framework** is set up in either project.

## Architecture

A plain monorepo (no workspace manager) with two independent Node.js projects:

- **`client/`** — React 19 + Vite 8 (ESM modules — `import`/`export`). Uses `@vitejs/plugin-react` + `@tailwindcss/vite`. Vite dev server runs on port **3000** and proxies `/api/*` to `http://localhost:5010`. Dependencies include `react-router-dom` (v7), `react-icons`, `styled-components`, `react-github-calendar`, `@fontsource-variable/geist`, and `@fontsource-variable/geist-mono`.

- **`server/`** — Express.js 4 (CommonJS — `require`/`module.exports`). Listens on port **5010** (`PORT` env var in `server/.env`, fallback to 5000). Uses `cors`, `dotenv`, and `express`. Serves API under `/api/*`.

- **`api/index.js`** — Vercel serverless entry point. Simply re-exports `server/index.js` (`require('../server/index')`). The `vercel.json` config routes `/api/(.*)` here and includes `server/system-prompt.txt` via `includeFiles`.

### API Endpoints

| Method | Route              | Description                                      |
|--------|--------------------|--------------------------------------------------|
| GET    | `/api/health`      | Health check ({ status: "ok" })                  |
| POST   | `/api/chat`        | AI chat (NVIDIA NIM, Llama 4 Maverick, non-streaming) |
| POST   | `/api/chat-full`   | AI chat full page (OpenCode Zen, MiMo-V2.5, streaming via SSE) |
| GET    | `/api/guestbook`   | List guestbook entries                           |
| POST   | `/api/guestbook`   | Add guestbook entry (name: 60 chars, message: 500 chars) |
| POST   | `/api/contact`     | Contact form submission                          |

### Environment Variables

Set in `server/.env` (see `server/.env.example`):

| Variable            | Required | Purpose                              |
|---------------------|----------|--------------------------------------|
| `NVIDIA_API_KEY`    | For chat | NVIDIA NIM (Llama 4 Maverick) → `/api/chat` |
| `OPENCODE_API_KEY`  | Optional | OpenCode Zen (MiMo-V2.5) → `/api/chat-full` |
| `PORT`              | No       | Server port (default 5000, set to 5010 in dev) |

### Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin — no `tailwind.config.js`. Uses `@theme` directive in `index.css` for custom easing (`--ease-out-expo`, `--ease-in-out-expo`, `--ease-spring`), animation keyframes, and font families (`--font-magazine` Playfair Display, `--font-cursive` Dancing Script). Also carries custom GeistPixel fonts (`client/src/fonts/GeistPixel-*.woff2`).

Icons use [Material Symbols](https://fonts.google.com/icons) (class `material-symbols-outlined`, weight `280`) via a `font-variation-settings` reset in `index.css`.

### Key Patterns

- **API proxy bridge**: Vite config proxies `/api` → `http://localhost:5010`. Frontend fetches via relative paths (`fetch('/api/health')`). No environment-aware URL switching needed.

- **Paper texture via CSS**: `body::before` (coarse grain, `opacity: 0.28`) and `body::after` (fine grain, `opacity: 0.08`) render SVG data-URI noise patterns with `mix-blend-mode: multiply` — no image files needed.

- **Canvas noise overlay**: `components/Noise.jsx` renders a `<canvas>` grain texture used in sidebar, loading screen, and layout background.

- **Layout wrapper**: The `Layout` component wraps all routes, providing the sidebar, footer, chat widget, and noise layer.

- **Custom hooks** (in `hooks/`): `useScrollReveal.js` — IntersectionObserver-driven reveal with configurable thresholds; `useTypewriter.js` — typing animation for the hero section.

### Component Tree

```
App (BrowserRouter, loading gate)
└── LoadingScreen (2.5s animated SVG)
    └── Routes → Layout
        ├── Sidebar (fixed lg, off-canvas mobile drawer)
        ├── <Outlet /> → current page
        ├── Footer
        └── ChatWidget (floating bubble → /api/chat → NVIDIA NIM)
```

### Data Architecture

All static content lives in **`client/src/data/portfolioData.js`** — single source of truth. Named exports: `navLinks`, `hero`, `aboutDetailed`, `aboutIntro`, `stack`, `experience`, `education`, `projects`, `projectCategories`, `certifications`, `awards`, `uses`, `contact`, `links`, `cta`, `footer`.

- Guestbook entries persist to `server/data/guestbook.json` (JSON file, server-managed, not checked into git during active use).

### Design Principles (Emil Kowalski)

Full reference in `DOCS.md` and `emil-design-eng-skill.md`.

- Only animate `transform` and `opacity` — no layout/paint properties.
- Never animate from `scale(0)` — use `scale(0.95)` + `opacity: 0`.
- Custom cubic-bezier easing vars (`--ease-out-expo`, `--ease-in-out-expo`).
- UI animations under 300ms; button press `scale(0.97)` / floating buttons `scale(0.92)`.
- `prefers-reduced-motion` trims all movement/position, keeps opacity/color.
- Hover effects gated by `@media (hover: hover) and (pointer: fine)`.
- Entrance is deliberate (slower), exit/release is snappy.

### Vercel Deployment

- **Vercel config** in `vercel.json`: build from `client/`, output `client/dist`, install from both `client/` and `server/`.
- **Serverless**: `api/index.js` re-exports the Express app. Vercel Functions config includes `server/system-prompt.txt` for the AI chat endpoint.
- **Required env vars** in Vercel dashboard: `NVIDIA_API_KEY`, `OPENCODE_API_KEY`.

## Adding New Routes

1. Create page component in `client/src/pages/`
2. Add `<Route>` in `App.jsx` inside the `<Route element={<Layout />}>` wrapper
3. Add nav entry in `client/src/data/portfolioData.js` (`navLinks` array)
4. Server: add new `/api/*` routes in `server/index.js`

## Session Start — File Maintenance

Read and update these files at session start:

- **`.gitignore`** — Add any new generated files, build artifacts, or dependency directories.
- **`README.md`** — Keep project overview, commands, and stack accurate.
- **`DOCS.md`** — Keep architectural documentation current (new patterns, routes, conventions).
