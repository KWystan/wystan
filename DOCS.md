# Documentation

> Claude Code: When starting a new session, read this file and update it to
> reflect any architectural changes, new patterns, or evolving decisions made
> during development.

## Architecture Overview

This project is a plain two-directory monorepo — no workspace manager, no monorepo tooling. Each folder is an independent Node.js project with its own `package.json` and dependencies.

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                     │
│    └─ http://localhost:3000                                  │
│       └─ Vite Dev Server (client/)                           │
│          ├─ Serves React SPA with React Router               │
│          └─ Proxies /api/* to :5010                          │
│                                                              │
└──────────────────────┬──────────────────────────────────────┘
                       │ /api/*
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Express.js (server/)                                        │
│    └─ http://localhost:5010                                  │
│       ├─ GET    /api/health     — health check               │
│       ├─ POST   /api/chat       — AI chat (NVIDIA NIM)       │
│       ├─ GET    /api/guestbook  — list guestbook entries     │
│       └─ POST   /api/guestbook  — add guestbook entry        │
└─────────────────────────────────────────────────────────────┘
```

### Page Structure (React Router)

All routes are nested under a `<Layout>` route that provides the sidebar and footer:

| Route           | Page Component    | Description                              |
|-----------------|-------------------|------------------------------------------|
| `/`             | `Home`            | Hero, typewriter, intro, quick links     |
| `/about`        | `About`           | Detailed bio, highlights, experience, education, stack |
| `/achievements` | `Achievements`    | Certifications + awards with image modals |
| `/projects`     | `ProjectsPage`    | Project grid with category filtering     |
| `/guestbook`    | `Guestbook`       | Write/read messages (persisted via API)  |
| `/uses`         | `Uses`            | Tools, software, and gear                |
| `/contact`      | `Contact`         | Contact form with subject chips           |
| `/links`        | `Links`           | All social/professional links            |

### Sidebar Navigation

The sidebar replaces the old top navbar:
- Desktop: fixed left sidebar (208px wide), offset from viewport edge, paper noise texture, animated grid-line right border
- Mobile: off-canvas drawer triggered by hamburger button (top-left)
- Active route is highlighted with a subtle filled state
- Includes identity (name + initials), all nav links, and social icons

## Module System

- **Client (`client/`)** — ES Modules (`"type": "module"` in `package.json`). Uses `import`/`export` syntax.
- **Server (`server/`)** — CommonJS (no `"type": "module"`). Uses `require()`/`module.exports`.

## API Proxy Pattern

```js
proxy: {
  '/api': {
    target: 'http://localhost:5001',
    changeOrigin: true,
  },
}
```

Frontend code uses `fetch('/api/health')` — not absolute URLs. In production, a reverse proxy handles this.

## Client Component Tree

```
App (BrowserRouter)
└── LoadingScreen (2.5s)
    └── Routes
        └── Layout
            ├── Sidebar (fixed left)
            ├── <Outlet /> → current page
            ├── Footer
            └── ChatWidget (floating)
```

### Page Dependencies

Pages compose shared components for consistency:
- `About` page embeds `<Experience compact>`, `<Education compact>`, `<Stack compact>`
- `Achievements` page embeds `<CertModal>` (inline modal component)

## Adding a New Page

1. Create the page component in `client/src/pages/`
2. Import it in `App.jsx` and add a `<Route>` inside the `<Route element={<Layout />}>` wrapper
3. Add the nav entry in `client/src/data/portfolioData.js` (navLinks array)
4. Ensure data imports match the current export structure

## Data Architecture

All static content lives in `client/src/data/portfolioData.js`. It exports:
- `navLinks` — sidebar navigation items (label, href, icon)
- `hero` — name, title, location, socials, headline, intro
- `aboutDetailed` — paragraphs, highlights
- `aboutIntro` — short bullet points
- `stack` — categorized tech stack
- `experience` — work/academic experience entries
- `education` — school info
- `projects` — project entries with categories + snippets
- `projectCategories` — filter options for projects page
- `certifications` — certification entries with images + links
- `awards` — award/recognition entries
- `uses` — categorized tools and software
- `contact` — contact info and subjects
- `links` — social links page data
- `cta` — call-to-action component data
- `footer` — footer initials

## Guestbook (Server-Side)

Guestbook entries are stored in `server/data/guestbook.json` (JSON file). The API:
- `GET /api/guestbook` — returns `{ entries: [...] }`
- `POST /api/guestbook` — accepts `{ name?, message }`, returns `{ entry }`
- Each entry has: `id`, `name`, `message`, `createdAt`
- Message limited to 500 chars, name to 60 chars

## Key Components

- `Noise.jsx` — Canvas-based grain texture (used in sidebar, loading screen, background)
- `ChatWidget.jsx` — Floating chat bubble → `/api/chat` → NVIDIA NIM (Llama 4 Maverick)
- `Sidebar.jsx` — Responsive side nav with desktop/mobile variants
- `LoadingScreen.jsx` — 2.5s animated SVG + noise overlay

## Design Tokens

See `index.css` for Tailwind v4 theme (Playfair Display, Dancing Script, expo easing).
