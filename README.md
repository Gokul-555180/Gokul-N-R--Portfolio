# GOKUL.EXE — Interactive developer portfolio

A premium, content-first Next.js portfolio for Gokul N. R. It combines a playable low-poly WebGL scene with a conventional, recruiter-friendly portfolio experience. The visual layer is an enhancement: the important information, navigation, and project routes are all semantic HTML.

## Stack

- Next.js 16 App Router + React 19 + TypeScript
- Tailwind CSS 4 for the utility system, with custom CSS for art direction and responsive scene-adjacent effects
- React Three Fiber + Drei + Three.js for the lazy-loaded hero world
- Framer Motion for boot, section, and interface motion
- Lucide React for UI iconography

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

```bash
npm run typecheck
npm run build
npm run start
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | The playable portfolio and recruiter-friendly quick view |
| `/projects/gstguard` | GSTGuard case file |
| `/projects/mulearn-vast-moderation` | µLearn VAST Moderator case file |
| `/projects/samadhan` | Samadhan case file |

## Project structure

```text
app/
  page.tsx                     # Home route
  projects/[slug]/page.tsx     # Static project case-study route
  globals.css                  # Tailwind import + art direction and responsive CSS
  layout.tsx                   # SEO, Open Graph, viewport metadata
components/
  portfolio-shell.tsx          # Navigation, sections, interactions, and motion
  world-scene.tsx              # Client-only R3F scene with WebGL fallback
  project-art.tsx              # Original procedural project illustrations
data/
  portfolio.ts                 # Typed site, project, skills, journey, and desk content
```

## Updating content responsibly

Edit [`data/portfolio.ts`](./data/portfolio.ts) for contact details, project descriptions, external links, skills, journey items, and the “currently at the desk” status. It is intentionally the single source of truth for portfolio facts.

The current featured projects were selected from local source and documentation:

- **GSTGuard** is labelled *Prototype* and preserves its human-review requirement; it does not claim autonomous financial approval.
- **µLearn VAST Moderator** is labelled *Prototype* and only claims the live-scoring, reporting, and resilient data architecture documented in its repository.
- **Samadhan** is labelled *Prototype* and is not presented as a government deployment.

Do not add unverified credentials, results, metrics, social profiles, or finished-product claims. The design has intentional room to add them when there is a source ready to publish.

## Interaction and accessibility

- Short boot sequence that can be skipped immediately and is bypassed under reduced motion.
- Explore mode exposes a draggable low-poly scene with clickable project/profile/contact beacons; Quick View dampens the immersive layer while retaining the normal web portfolio flow.
- **Block Blaster** is a keyboard- and pointer-accessible arcade micro-game with a physics ball, movable paddle, live score, returns, grid resets, and completion state.
- A Three.js creative archipelago and lightweight contact portal extend the visual layer without making the whole page depend on WebGL.
- Project cards link to real statically generated case-study routes.
- Keyboard-accessible navigation, visible focus treatment, a skip link, real buttons and anchors, and a custom 404 route are included.
- The R3F world is client-only and lazy-loaded. A CSS fallback remains available if the WebGL context is lost.
- `prefers-reduced-motion` disables auto-rotation, floating motion, and interface transitions.

## Deployment

This is a standard Next.js app. Deploy it to Vercel, Netlify, or another Next-compatible host. Set `NEXT_PUBLIC_SITE_URL` to the deployed public URL before release so metadata has the correct base URL. The project has no server-side secrets or database requirements.
