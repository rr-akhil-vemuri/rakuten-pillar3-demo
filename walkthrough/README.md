# Pillar 3 Demo Walkthrough (PDF)

## `exclusive_products_experience.pdf` (Impact.com-facing)

A 22-slide deck — deep-purple divider slides with a serif headline, and content slides pairing a left-rail explanation with a realistic phone/browser/email/dashboard mockup on the right. Organized scenario-by-scenario (Exclusive Drop, Early Access Window, Lapsed Re-engagement).

Written to be shown externally to Impact.com: copy is scoped to the member/merchant flow only — no internal project codenames, no PRD/spec citations, no build-vs-buy framing, no fidelity flags. Source file: `deck-v2.html` (+ `deck-v2.css`).

Every screen in this deck is a **purpose-built mockup**, not a screenshot of the live click-through prototype in this repo.

### Regenerating

1. Edit `deck-v2.html` (content/markup) and `deck-v2.css` (design system — colors, type, mockup-frame components) directly.
2. Scratch Node project with `puppeteer-core` installed, pointed at system Chrome via `executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'` (no bundled Chromium download in this environment).
3. Load the deck in Puppeteer at a 1280×720 viewport and call `page.pdf({ width: '1280px', height: '720px', printBackground: true })` directly — each `.slide` section is already sized to one full PDF page via CSS (`page-break-after: always`).
