# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```powershell
# Root — runs both client + server concurrently
npm run dev                  # concurrently: client:3000 + server:5010
npm run dev:client           # Vite dev server only
npm run dev:server           # Express --watch only
npm run build                # runs `cd client && npm run build`
npm run lint                 # runs `cd client && npm run lint`

# Client (React + Vite)
cd client && npm run dev     # Dev server on :3000 with HMR
cd client && npm run build   # Production build → client/dist/
cd client && npm run preview # Preview production build locally
cd client && npm run lint    # ESLint (flat config, React + Vite presets)

# Server (Express.js)
cd server && npm run dev     # Dev mode with node --watch (auto-restart on :5010)
cd server && npm start       # Production start

# Both terminals needed simultaneously:
# Terminal 1: cd server && npm run dev     (listens on :5010 via server/.env)
# Terminal 2: cd client && npm run dev     (listens on :3000, proxies /api → :5010)
```

**No test framework** is set up in either project.

## Architecture

A plain monorepo (no workspace manager) with two independent Node.js projects:

- **`client/`** — React 19 + Vite 8 (ESM modules — `import`/`export`). Uses `@vitejs/plugin-react` + `@tailwindcss/vite` plugin (no tailwind.config.js — Tailwind v4). Vite dev server runs on port **3000** and proxies `/api/*` to `http://localhost:5010`. Dependencies include `react-router-dom` (v7), `react-icons`, `styled-components`, `react-github-calendar`, `@fontsource-variable/geist`, and `@fontsource-variable/geist-mono`.

- **`server/`** — Express.js 4 (CommonJS — `require`/`module.exports`). Listens on port **5010** (overridden from default 5000 via `server/.env`). Uses `cors`, `dotenv`, and `express`. Serves API under `/api/*`. Two JSON data files: `server/data/guestbook.json` and `server/messages.json` (contact form). The system prompt for the chat widget is loaded from `server/system-prompt.txt` at startup.

- **`api/index.js`** — Vercel serverless entry point. Re-exports `server/index.js` (`require('../server/index')`). The `vercel.json` config routes `/api/(.*)` here, rewrites all other paths to the SPA, and includes `server/system-prompt.txt` via `includeFiles`.

### API Endpoints

| Method | Route              | Description                                      |
|--------|--------------------|--------------------------------------------------|
| GET    | `/api/health`      | Health check (`{ status: "ok" }`)                |
| POST   | `/api/chat`        | AI chat widget — NVIDIA NIM (Llama 4 Maverick, non-streaming, 512 max tokens, last 12 messages) |
| POST   | `/api/chat-full`   | Full chat page — OpenCode Zen (MiMo-V2.5, streaming via SSE, 2048 max tokens, last 20 messages, model selection) |
| GET    | `/api/guestbook`   | List guestbook entries                           |
| POST   | `/api/guestbook`   | Add guestbook entry (name: 60 chars optional, message: 500 chars required) |
| POST   | `/api/contact`     | Contact form (name, email, message required; stores to `server/messages.json`) |

### Environment Variables

Set in `server/.env` (see `server/.env.example`):

| Variable            | Required | Purpose                              |
|---------------------|----------|--------------------------------------|
| `NVIDIA_API_KEY`    | For chat | NVIDIA NIM (Llama 4 Maverick) → `/api/chat` widget |
| `OPENCODE_API_KEY`  | Optional | OpenCode Zen (MiMo-V2.5) → `/api/chat-full` page |
| `OPENCODE_BASE_URL` | No       | Override OpenCode base URL (default `https://opencode.ai/zen/v1`) |
| `PORT`              | No       | Server port (default 5000, set to 5010 in dev `.env`) |

## Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin — no `tailwind.config.js`. Theme defined in `index.css` using `@theme` directive:

- Custom easing: `--ease-out-expo` `cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-in-out-expo` `cubic-bezier(0.65, 0, 0.35, 1)`, `--ease-spring` `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Fonts: `--font-sans` Geist, `--font-mono` Geist Mono, `--font-serif` Source Serif 4, `--font-display` Geist Pixel Square (custom woff2 in `client/src/fonts/`)
- Entrance keyframes: `fade-up` (translateY(10px)), `scale-in` (scale(0.95)), `float`, `blink`
- Paper texture via CSS: `body::before` (coarse grain, SVG noise via feTurbulence) and `body::after` (fine grain) with `mix-blend-mode: multiply`

Icons use [Material Symbols](https://fonts.google.com/icons) (class `material-symbols-outlined`, weight `280` via `font-variation-settings`).

`hover-gate` utility classes gate hover effects to `@media (hover: hover) and (pointer: fine)` — prevents sticky hover on touch devices.

## Key Patterns

- **API proxy bridge**: Vite config proxies `/api` → `http://localhost:5010`. Frontend fetches via relative paths (`fetch('/api/health')`). No environment-aware URL switching needed.

- **Canvas noise overlay**: `components/Noise.jsx` renders a `<canvas>` grain texture with configurable `patternAlpha`, `patternRefreshInterval`, and `patternSize`. Used as overlay in sidebar, loading screen, and layout background.

- **Paper texture via CSS**: Dual-layer SVG noise backgrounds on `body::before` (coarse grain, `opacity: 0.28`) and `body::after` (fine grain, `opacity: 0.08`) — no image files.

- **Layout wrapper**: `Layout` wraps all sidebar routes, providing the sidebar (desktop sticky + mobile drawer), `<Outlet />`, and global noise layer. The `ChatPage` route is **outside** this layout (no sidebar, full-page AI chat app).

- **Two chat systems**: `ChatWidget` (floating bubble on all pages → `/api/chat` → NVIDIA NIM, non-streaming) and `ChatPage` (route `/chat` → `/api/chat-full` → OpenCode Zen, streaming SSE, model dropdown with 3 models).

- **Loading screen**: `LoadingScreen` renders a 2.5s animated SVG heart/dash animation using `styled-components`, then fades out — gates the entire app.

- **Asset imports**: Images (certificates, project snippets, logos) are imported statically in `portfolioData.js` and bundled by Vite. Profile picture is imported in `Hero.jsx`.

- **Design motion rules** (Emil Kowalski): Only animate `transform` and `opacity`, never layout/paint. Never animate from `scale(0)` — use `scale(0.95)` + `opacity: 0`. UI animations under 300ms. Button press `scale(0.97)` / floating buttons `scale(0.92)`. `prefers-reduced-motion` trims all movement. Entrance is deliberate (slower), exit/release is snappy.

## Component Tree

```
App (BrowserRouter, loading gate)
└── LoadingScreen (2.5s animated SVG)
    └── Routes
        ├── Route element={<Layout />}
        │   ├── Sidebar (fixed lg, off-canvas mobile drawer with Noise overlay + grid-line border)
        │   ├── <Outlet /> → Home, About, Projects, Achievements, Guestbook, Uses, Contact, Links, NotFound
        │   ├── Footer
        │   └── ChatWidget (floating bubble bottom-right)
        └── Route path="chat" → ChatPage (standalone, no sidebar)
```

## Data Architecture

All static content lives in **`client/src/data/portfolioData.js`** — single source of truth. Named exports: `hero`, `about`, `stack`, `stackDetails`, `experience`, `education`, `projects`, `certifications`, `cta`, `contact`, `sidebarLinks`, `uses`, `links`.

- Images are imported at the top of `portfolioData.js` and passed into export objects (certificate PNGs/JPGs, project snippet screenshots, school logos).
- Guestbook entries persist to `server/data/guestbook.json` (JSON array, server-managed).
- Contact form messages persist to `server/messages.json` (JSON array, server-managed).

## Custom Hooks

- `useScrollReveal({ threshold?, rootMargin? })` — Returns `[ref, visible]`. Uses IntersectionObserver to trigger reveal once. Elements use `.scroll-reveal` / `.revealed` CSS classes for opacity + translateY transition.
- `useTypewriter({ words?, typingSpeed?, deletingSpeed?, pauseAfterType?, pauseBeforeNext? })` — Returns displayed text string for typing animation in hero section. Cycles through an array of role titles.

## Vercel Deployment

- **`vercel.json`**: build from `client/`, output `client/dist`, install both `client/` and `server/`. SPA rewrites catch-all for client-side routing. The serverless function at `api/index.js` has 256MB memory, 30s max duration, and includes `server/system-prompt.txt`.
- **Required env vars** in Vercel dashboard: `NVIDIA_API_KEY`, `OPENCODE_API_KEY`.

## Adding New Routes

1. Create page component in `client/src/pages/`
2. Add `<Route>` in `App.jsx` inside the `<Route element={<Layout />}>` wrapper (for sidebar pages) or outside (for standalone pages like ChatPage).
3. Add sidebar nav entry in `client/src/data/portfolioData.js` (`sidebarLinks` array).
4. Server: add new `/api/*` routes in `server/index.js`.

## Guestbook & Contact Validation

- Guestbook `POST /api/guestbook`: `message` required (max 500 chars), `name` optional (defaults to "Anonymous", max 60 chars).
- Contact `POST /api/contact`: `name`, `email`, `message` required. Sanitized by stripping `<>` chars and truncated to 2000 chars.
- Chat endpoints validate `messages` is a non-empty array.
