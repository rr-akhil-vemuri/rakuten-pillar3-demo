# Pillar 3 Demo Walkthrough (PDF)

`pillar-3-walkthrough.pdf` — a 20-page, screenshot-by-screenshot walkthrough of all three demo surfaces (Rakuten website, merchant Shopify site, mobile app), generated from the live prototypes in `/demos`. Intended as a leave-behind reference alongside the live click-through demo.

`screenshots/` holds the individual PNGs used to build the PDF, numbered in walkthrough order.

## Regenerating

The capture + build scripts aren't checked into this repo (they live in a scratch npm project under a job tmp dir with `puppeteer` installed, pointed at system Chrome via `executablePath`, since this environment has no bundled headless Chromium download). To regenerate after changing the demos:

1. Set up a scratch Node project with `puppeteer` installed (`npm install puppeteer`).
2. Point Puppeteer at system Chrome: `executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'`.
3. Drive each demo surface through its walkthrough steps (click selectors, wait, screenshot) — see the step list embedded in this PDF's table of contents for the full sequence and which surface/scenario/variant each step captures.
4. Render an HTML template (cover + TOC + one section per screenshot + back cover) to PDF via `page.pdf()`.

Update `screenshots/` and re-run the PDF build whenever the demo UI changes meaningfully — the PDF is a snapshot, not auto-synced.
