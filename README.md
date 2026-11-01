# AvenZo — cinematic landing page

A scroll-driven 3D landing page for **AvenZo** by **OPG Studios**. A golden cashback coin travels through five
story beats: hero → cashback → how it works → why AvenZo → final brand reveal ("Powered by OPG Studios").

**Stack:** React 18 · Vite · TypeScript · Tailwind CSS v4 · Three.js via React Three Fiber · GSAP + ScrollTrigger · Lenis · Lucide.

## Run

```bash
npm install
cp .env.example .env     # add your real URLs (optional, see below)
npm run dev              # http://localhost:5173
npm run build            # typecheck + production build → dist/
npm run preview
```

## Links are configurable

Set these in `.env`: `VITE_SHOP_URL`, `VITE_LOGIN_URL`, `VITE_SIGNUP_URL`, `VITE_OPG_URL`,
`VITE_INSTAGRAM_URL`, `VITE_X_URL`, `VITE_YOUTUBE_URL`, `VITE_LINKEDIN_URL`, `VITE_CONTACT_EMAIL`.
Any link left empty shows a short "coming soon" message instead of a dead link.

The site implements **no** payments, cashback tracking or login. Those belong to whatever the URLs point to.
Copy never promises guaranteed cashback; it states that cashback depends on offer eligibility and conditions.

## How it's built

| Path | What it does |
| --- | --- |
| `src/three/Coin.tsx` | Procedural coin: lathe-profiled body, 150-tooth reeded edge, extruded AvenZo symbol, engraved rim lettering, soft shadow + glow. Reflections come from light panels (no HDR download). |
| `src/lib/choreography.ts` | The coin's path as poses pinned to scroll positions. The coin is a pure function of scroll, so scrubbing, anchors and resizes always land correctly. Desktop and mobile tracks. |
| `src/three/Scene.tsx`, `Particles.tsx` | Canvas, studio lighting, camera drift + pointer parallax, floating gold dust. |
| `src/sections/*` | Hero, Cashback (animated ₹100 reward), HowItWorks (3 scroll-driven steps), Why, Finale (coin rushes camera → flash → logo → OPG), Footer. |
| `src/components/legal.tsx` | Terms, Privacy and Cashback Terms shown in an accessible modal (also reachable via `#terms`, `#privacy`, `#cashback`). |
| `src/components/brand/Logos.tsx` | AvenZo mark and an **original placeholder OPG Studios mark**. |

Performance: pixel ratio capped (1.5 on phones), antialiasing off on phones, 50 particles on phones vs 130 on desktop,
no per-frame allocations, scene falls back to a static emblem if WebGL is unavailable, and
`prefers-reduced-motion` disables smooth scrolling, spin and reveal animations.

## Before launch

1. **Replace the OPG Studios mark** in `Logos.tsx` with your official artwork (none was supplied).
2. **Have a lawyer review `legal.tsx`.** It is starter copy matched to the product's intent, not legal advice.
3. Fill in `.env` with real URLs.
4. Tune the coin: sizes in `Coin.tsx` (`R`, `RIN`, `H`), light panels in `Scene.tsx`, journey in `choreography.ts`.
