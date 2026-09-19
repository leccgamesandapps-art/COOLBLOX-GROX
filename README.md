# COOLBLOX-GROX

**Original game creation & social platform** — Create, play, and share 3D experiences.

Built with Next.js 15, React Three Fiber, Prisma, NextAuth, and Tailwind CSS.

## Features (MVP)

- **Authentication** — Register / Login / Logout with hashed passwords, unique CoolBlox IDs, persistent JWT sessions
- **Main Platform** — Home feed, published games, navigation (desktop sidebar + mobile)
- **CoolBLOX Studio** — Project dashboard, create from templates
- **Real 3D Editor** — Orbit camera, select / move / rotate / scale tools, explorer, properties panel that updates the live scene, add/delete/duplicate parts, autosave-ready, keyboard shortcuts (Q/W/E/R, Delete, Ctrl+S)
- **Test Mode** — Play current project from Studio
- **Publish** — Create GameVersion → appears on Main
- **Game Player** — Load published scene with basic HUD

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) + TypeScript |
| 3D | React Three Fiber + drei + TransformControls |
| Database | Prisma + PostgreSQL |
| Auth | NextAuth.js (Credentials) + bcrypt |
| State | Zustand (editor) |
| Styling | Tailwind CSS |

## Setup

1. Clone & install:
```bash
npm install
```

2. Copy env:
```bash
cp .env.example .env
```

3. Set `DATABASE_URL` (Neon / Vercel Postgres / local Postgres) and generate a strong `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

4. Push schema:
```bash
npx prisma db push
```

5. Run:
```bash
npm run dev
```

Open http://localhost:3000 → redirected to `/index`.

## Routes

| Path | Description |
|------|-------------|
| `/` | Redirect → `/index` |
| `/index` | Login / Register |
| `/main/main` | Main platform home |
| `/studio` | Studio dashboard |
| `/studio/editor/[projectId]` | 3D Editor |
| `/studio/editor/[projectId]/test` | Test play |
| `/main/game/[projectId]/[gameId]` | Published game player |

## Security notes

- Passwords hashed with bcrypt (12 rounds)
- All protected routes check server session
- Project ownership verified on every mutation
- Never trust client-provided IDs without DB checks
- Secrets only in environment variables

## Roadmap (post-MVP)

- Full social (friends, messaging, notifications)
- Avatar + inventory
- Cool Coins economy + Whop subscriptions
- Asset library
- Scripting sandbox
- Multiplayer (Socket / PartyKit)
- Mobile touch controls polish
- Version history UI
- Collaborators

---

Made with ♥ by LEStudio — Original branding & code. Not affiliated with Roblox.
