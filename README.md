# COOLBLOX-GROX

**Official platform** — Create, play, and share 3D games.

| | |
|--|--|
| **Live** | https://coolblox-grox.vercel.app |
| **GitHub** | https://github.com/leccgamesandapps-art/COOLBLOX-GROX |
| **Vercel** | `coolblox-grox` |
| **Database** | Neon PostgreSQL + Prisma |
| **Payments** | Whop subscription page |

## First-time setup (after deploy)

1. Open once: **https://coolblox-grox.vercel.app/api/setup/db**  
   → Creates all tables if missing
2. Check health: **https://coolblox-grox.vercel.app/api/health**
3. Register at **https://coolblox-grox.vercel.app**

## Stack

- Next.js 14 + TypeScript + Tailwind
- NextAuth (credentials, bcrypt, JWT)
- Prisma + Neon PostgreSQL
- React Three Fiber 3D Studio
- Publish → play pipeline

## Routes

| Path | Description |
|------|-------------|
| `/` | Login / Register |
| `/main/main` | Home |
| `/main/games` | Published games |
| `/studio` | Studio dashboard |
| `/studio/editor/[id]` | 3D editor |
| `/api/setup/db` | Create tables |
| `/api/health` | DB status |

**LEStudio — Official**
