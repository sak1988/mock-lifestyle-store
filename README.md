# Mock Lifestyle Store – Persona vs Feature (Next.js + Tailwind)

A ready-to-deploy mock storefront for testing framing effects in ecologically valid settings.

## Two deployments (recommended)
Create two Vercel projects from this repo:
- **Persona site**: set `NEXT_PUBLIC_FRAME_ARM=persona`
- **Feature site**: set `NEXT_PUBLIC_FRAME_ARM=feature`

(Keep everything else identical.)

## Local dev
```bash
npm install
npm run dev
# visit http://localhost:3000
```

## Event logging
All user actions hit `POST /api/events`. It currently logs to the server console.
Swap the implementation in `app/api/events/route.js` to write to Supabase.

### Env
Copy `.env.example` to `.env.local` and change values as needed.
