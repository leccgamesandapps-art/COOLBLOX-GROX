# COOLBLOX-GROX

**Official platform** — Create, play, and share 3D games.

| | |
|--|--|
| **GitHub** | [leccgamesandapps-art/COOLBLOX-GROX](https://github.com/leccgamesandapps-art/COOLBLOX-GROX) |
| **Vercel** | Project `coolblox-grox` |
| **Payments** | Whop (subscription plans) |
| **Database** | Neon PostgreSQL + Prisma |

## Live stack

- Next.js 14 + TypeScript + Tailwind
- NextAuth (credentials, bcrypt, JWT sessions)
- Prisma schema: Users, Projects, GameVersions, Friends, Messages, CoolCoins, Inventory, etc.
- Real 3D Studio (React Three Fiber): select / move / rotate / scale, explorer, properties, save, publish, test
- Main hub, games list, settings, subscription page

## Production checklist

1. `DATABASE_URL` + `NEXTAUTH_SECRET` + `NEXTAUTH_URL` set on Vercel ✅
2. Run once: `npx prisma db push` against Neon
3. Deploy from `main` (auto on push)

## Routes

- `/index` — Login / Register
- `/main/main` — Home
- `/main/games` — Published games
- `/main/settings` — Account
- `/main/subscription` — Whop plans
- `/studio` — Project dashboard
- `/studio/editor/[id]` — 3D editor + Publish
- `/studio/editor/[id]/test` — Test play
- `/main/game/[projectId]/[gameId]` — Play published game

Original branding. Not affiliated with Roblox.

**LEStudio — Official launch foundation**
