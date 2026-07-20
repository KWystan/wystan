# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```powershell
# Client (React + Vite)
cd client && npm run dev       # Dev server on :3010 with HMR
cd client && npm run build     # Production build → client/dist/
cd client && npm run preview   # Preview production build locally
cd client && npm run lint      # ESLint (flat config, no test setup)

# Server (Express.js)
cd server && npm run dev       # Dev mode with --watch (auto-restart)
cd server && npm start         # Production start

# Both terminals needed simultaneously:
# Terminal 1: cd server && npm run dev     (listens on :5010 via .env)
# Terminal 2: cd client && npm run dev     (listens on :3010, proxies /api → :5010)
```

**No test framework** is set up in either project.

## Architecture

A plain monorepo (no workspace manager) with two independent Node.js projects:

- **`client/`** — React 19 + Vite 8 (ESM modules — `import`/`export`). Uses `@vitejs/plugin-react` + `@tailwindcss/vite`. Vite dev server runs on port **3010** and proxies `/api/*` to `http://localhost:5010`. Includes `react-router-dom` (v7), `react-icons`, and `styled-components`.

- **`server/`** — Express.js 4 (CommonJS — `require`/`module.exports`). Listens on port **5010** (`PORT` env var in `server/.env`). Uses `cors` middleware. Serves API under `/api/*`. Reads `server/system-prompt.txt` at startup for the AI chat system prompt. Guestbook persists to `server/data/guestbook.json`.

- **`src/data/portfolioData.js`** — single source of truth for all static content (nav links, hero, experience, projects, certifications, etc.). Export names match their purpose — import by named export.

- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin, no `tailwind.config.js` — uses `@theme` directive in `index.css`) + `styled-components` for a few dynamic components. Icons use [Material Symbols](https://fonts.google.com/icons) (class `material-symbols-outlined`, weight `280`) via a CSS `font-variation-settings` reset in `index.css`.

## Key Patterns

- **API proxy bridge**: Vite config proxies `/api` → `http://localhost:5010`. Frontend fetches via relative paths (`fetch('/api/health')`). No environment-aware URL switching needed. The server's `.env` sets `PORT=5010` and `NVIDIA_API_KEY`.

- **Paper texture via CSS**: `body::before` (coarse grain, `opacity: 0.28`) and `body::after` (fine grain, `opacity: 0.08`) render SVG data-URI noise patterns with `mix-blend-mode: multiply` — no image files needed.

- **Canvas noise overlay**: `components/Noise.jsx` renders a `<canvas>` grain texture (used in sidebar, loading screen, and as the layout background via the `Layout` component). The `Layout` component wraps all routes, providing the sidebar, footer, chat widget, and noise layer.

- **`index.css` theme**: `client/src/index.css` uses `@theme {}` to define custom easing vars (`--ease-out-expo`, `--ease-in-out-expo`, `--ease-spring`), animation keyframes (`fade-up`, `scale-in`, `float`, `blink`), and font families (`--font-magazine`, `--font-cursive`). Scroll-reveal CSS classes (`scroll-reveal`, `.revealed`) live here alongside hover-effect variants gated by `@media (hover: hover) and (pointer: fine)`.

- **Custom hooks** (in `hooks/`): `useScrollReveal.js` — IntersectionObserver-driven reveal with configurable thresholds; `useTypewriter.js` — typing animation for the hero section.

- **Component tree**:
  ```
  App (BrowserRouter, loading gate)
  └── LoadingScreen (2.5s animated SVG)
      └── Routes → Layout
          ├── Sidebar (fixed lg, off-canvas mobile drawer)
          ├── <Outlet /> → current page
          ├── Footer
          └── ChatWidget (floating bubble → /api/chat → NVIDIA NIM)
  ```

- **Guestbook persistence**: Server stores entries in `server/data/guestbook.json`. API validates `name` (60 char max) and `message` (500 char max, required). Entries are date-stamped and prepended to the array.

- **AI Chat**: `POST /api/chat` accepts `{ messages: [...] }`, keeps last 12 messages for context, proxies to NVIDIA NIM (`meta/llama-4-maverick-17b-128e-instruct`). System prompt loaded from `server/system-prompt.txt`. Returns `{ reply }`. Graceful fallback when `NVIDIA_API_KEY` is unset (returns 503).

## Design Principles (Emil Kowalski)

This project follows Emil Kowalski's design engineering philosophy. Full reference in `DOCS.md` and `emil-design-eng-skill.md`.

- Only animate `transform` and `opacity` — no layout/paint properties.
- Never animate from `scale(0)` — use `scale(0.95)` + `opacity: 0`.
- Custom cubic-bezier easing vars (`--ease-out-expo`, `--ease-in-out-expo`).
- UI animations under 300ms; button press `scale(0.97)` / floating buttons `scale(0.92)`.
- `prefers-reduced-motion` trims all movement/position, keeps opacity/color.
- Hover effects gated by `@media (hover: hover) and (pointer: fine)`.
- Entrance is deliberate (slower), exit/release is snappy.

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
