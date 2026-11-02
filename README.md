# CTRL + SHIFT + CANDLE

Precision-object landing page for a deep work candle: one sticky 3D canvas, pinned sections, scroll-driven product reveal.

**Stack:** Next.js 15 (App Router) · TypeScript strict · Tailwind 3.4 · React Three Fiber + drei · GSAP + ScrollTrigger · Lenis.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

Assets you provide: `public/models/candle.glb`, `public/brand/emblem.png`.

## Design tokens

| Token | HEX | Role |
|---|---|---|
| `ink` | #050505 | bg-primary |
| `ink2` | #0C0C0C | bg-secondary |
| `fg` | #F5F5F5 | text-primary |
| `muted` | #A3A3A3 | text-secondary |
| `code` | #6B6B6B | text-tertiary (decorative `//` labels only) |
| `gold` | #C9A227 | accent |
| `gold-hi` | #E0B82E | accent hover |
| `gold-active` | #A88B1F | accent active |
| `line` | #1F1F1F | borders |
| `status` | #4ADE80 | `status: ready` |

Fonts: Inter (`font-sans`, `font-display`) and JetBrains Mono (`font-mono`, labels only).
Type scale tokens: `text-display|h1|h2|h3|body|small|label|micro|btn` (exact at ≥1280px and 390px, `clamp` between).

## Hero sequence

Driven by CSS on `<html data-hero="playing|done">`, set by the inline script in `app/layout.tsx`
(`playing` only without reduced-motion, with an empty/`#top` hash and `scrollY === 0`).

| Time | Action |
|---|---|
| 0.0 s | background + Header (the Header never animates) |
| 0.3 s | `// system initializing` fades in (8 px slide, 400 ms) |
| 0.8 s | it leaves; `// focus mode engaged` takes its place |
| 1.0 s | headline: blur 8 px → sharp, 600 ms |
| 1.4 s | subtitle + CTA/price, 500 ms |
| 1.6 s | product scale 0.92 → 1, 600 ms |
| 2.2 s | final state |

Wheel, touch, key, pointer-down or scroll > 4 px jumps to the final state. Fail-safe at 3.0 s.
Numbers live in `HERO_TIMING` / `HERO_DUR` (`lib/constants.ts`) and are mirrored in `app/globals.css`.

## Story mode

`STORY_MIN_WIDTH` (`lib/constants.ts`) is `0`: the story runs at every width and needs only WebGL and no recorded failure.
If mobile performance suffers, raise it to `768`. Reduced-motion never disables the story: transitions become hard steps.
`storyState.reveal` (0..1) tracks scroll inside ProductReveal; `<html data-reveal-open="1">` is set when `phase === 1 && reveal >= 0.96`.

Testing in development: `?story=on` / `?story=off`.

## Real photos (optional)

`PHOTOS` in `lib/constants.ts` (`revealOpen`, `intention`, `specs`) is `null` by default.
Set an entry to `{ src, width, height, alt }` to use it. Files go in `public/`; use AVIF or WebP (≤ 1600 px wide).
For AVIF output from `next/image`, add `images: { formats: ["image/avif", "image/webp"] }` to `next.config.ts`.

## Deploy

Import the repository on Vercel; no configuration needed. Replace `CHECKOUT_URL` in `lib/constants.ts` with the real checkout URL.
