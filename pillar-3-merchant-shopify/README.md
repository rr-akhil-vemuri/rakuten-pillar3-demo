# Northfield Outfitters — Independent Merchant Storefront Demo

Click-through HTML/CSS/JS prototype of an **independent merchant's own Shopify storefront** ("Northfield Outfitters", a synthetic outdoor/athletic apparel brand) for Pillar 3 of the Rakuten Shopify x Impact.com POC. No backend, no build step, no Node-specific syntax — open `index.html` directly in a browser.

```
open index.html
```

This is one of a **3-surface demo suite** linked from `/demos/index.html`:

1. `pillar-3-exclusive-access` — the Rakuten mobile app member experience
2. `pillar-3-website` — the Rakuten website (built by another agent, at the sibling path this demo links back to)
3. **`pillar-3-merchant-shopify` (this demo)** — the merchant's own storefront, on the other side of the click

## Why this surface exists

The other two surfaces show the Rakuten side of the experience. This one shows what happens once a member lands on the **merchant's** site — structured to look and feel like a real default Shopify theme (header, hero banner, collection grid, product detail page, footer), so a non-technical executive sees a plausible storefront rather than a bespoke layout.

## Deliberately NOT Rakuten-branded

Northfield Outfitters uses its own palette (deep forest green `#2F5233` / warm stone-tan `#E8DFC8`, serif brand lockup) — no purple, no lavender, nothing that reads as a Rakuten property. Landing here should feel like "you left Rakuten and arrived at a real, independent merchant's site."

## No more Integration-path toggle

An earlier iteration of this demo had a toggle between two hypothetical integration paths — using Impact.com versus a speculative direct build with no Impact.com in the loop — plus a fixed dev-console-style debug panel with simulated pixel/tracking-event text that changed depending on which path was selected. That was removed: it only swapped cosmetic telemetry copy, never touched the actual member-facing purchase flow, and the build-path content was speculative narrative with nothing in `impact-pillar3-spec.md` to ground it.

In its place, the confirmation screen now shows exactly one small, inline **attribution note** (not a floating panel, not fixed-position — just page content near the order summary), grounded only in the real mechanic documented in `impact-pillar3-spec.md` section 1.4 (Impact.com postbacks are one-way, asynchronous notifications fired on conversion/action lifecycle events — not a synchronous click hook):

> "This order is matched back to Rakuten via an Impact.com postback fired on order completion — the mechanism that credits Rakuten as the issuer of this access."

There is a single discount-code naming convention throughout: `IMPACT-EXCL-<code>` (e.g. `IMPACT-EXCL-A82F`). The alternate prefix tied to the removed speculative path no longer exists anywhere in this demo.

## "Rakuten Exclusive" multi-product grid

Product data now comes from the shared catalog at `../shared/products.js` (`PILLAR3.PRODUCTS`, four SKUs: Aurora Trail Jacket, Summit Ridge 32L Backpack, Alpine Wool Beanie, Traverse Hiking Boots) loaded before `app.js`. `PILLAR3.DEFAULT_PRODUCT_ID` stays `"aurora-trail-jacket"` — the `?src=website` cross-surface entry point (arriving from the Rakuten website demo, which has no concept of product id) still lands on that same jacket, unchanged.

The Home view's old single "View the gated product (demo entry)" text link is now a 4-card product grid titled **"Rakuten Exclusive"**, showing all four catalog products (image tile + name + price). Clicking any card opens that specific product's gated landing page, reusing the same gated-product → checkout → confirmation flow, now parameterized by `state.productId` instead of a single hardcoded product.

This grid is intentionally **not** a normal storefront section:

- It is **not** in the public nav (no "Exclusive" link next to Shop/About).
- It sits inside a clearly-labeled, visually distinct container — dashed gold border, tan background, an eyebrow label reading *"Demo entry points — not part of the real customer-facing surface"* — the same visual language the old demo-controls box used.
- A sub-line spells out why: per the spec's US-3, these products are hidden from Northfield's normal storefront browsing and search; a real shopper only ever reaches one via a Rakuten-issued link, never by browsing this site directly. The grid exists purely so whoever is running/reviewing the demo can click through every product quickly.

The negative-case search test (type a query into the merchant nav search bar and press Enter) still returns "No results found" regardless of which of the four products is currently active — the exclusive products still never appear in search.

## Shopify-theme structure (Part B restyle)

- **Header** — single row: wordmark on the left, `Shop` / `About` nav next to it, and on the right a search input with icon plus a static cart icon with an item-count bubble (decorative, no real cart state).
- **Hero** — full-width color-block banner (image/gradient + overlaid heading, subtext, CTA button), matching a typical Shopify theme hero section rather than a boxed card.
- **Collection grid** — the "Rakuten Exclusive" section (see above) uses the same image-tile + title + price card pattern a real Shopify collection page would use.
- **Product detail page** (gated product view) — left column: main image plus a row of 4 decorative thumbnail placeholders (non-functional, purely visual — a single image alone looks noticeably fake next to a real Shopify PDP's gallery); right column: title, price, a one-line blurb per product, a decorative quantity stepper (defaults to 1, no working +/- logic), and the "Continue to Checkout" button.
- **Footer** — multi-column: "Quick Links", "Customer Care" (Shipping/Returns/Contact, decorative), a non-functional newsletter signup block, and the existing legal/disclaimer line beneath.

## Views

- **Home** — an ordinary, generic Northfield Outfitters homepage plus the demo-only "Rakuten Exclusive" grid described above. No mention of Rakuten or the exclusive program anywhere in the real storefront content — reinforces that the gated products are genuinely hidden from normal browsing.
- **Search (negative case)** — type anything into the merchant nav search bar and press Enter: "No results found for '...'" — demonstrates gating is enforced on the merchant's own site/search, independent of Rakuten's side.
- **Gated product** — a product's landing page, reached via `?src=website` on load (simulating arrival from a Rakuten-issued link, defaulting to the Aurora Trail Jacket) or via any card in the "Rakuten Exclusive" grid on Home for standalone testing of the other three products. Shows the product, an "Exclusive Access — via Rakuten" tag styled distinctly from how Northfield would tag its own products, and a decorative image gallery.
- **Checkout** — discount code `IMPACT-EXCL-A82F` auto-applied, reducing price by 20% (e.g. $228.00 → $182.40 for the jacket).
- **Confirmation** — "Thanks for your order, Jordan R.!", Order ID `SHF-88213` (shared across the demo suite for a consistent story), the single inline attribution note described above, and a "Return to Rakuten" button that navigates to `../pillar-3-website/index.html?returned=1&scenario=...` (a real link to the sibling Rakuten-website demo).

## Walkthrough path

1. **Home** → note there's no trace of the exclusive program in the real storefront content, only the clearly-flagged demo-entry grid below it
2. Nav search → type "Aurora Trail Jacket" → negative case (US-3)
3. Home → click any card in the "Rakuten Exclusive" grid (or load with `?src=website` for the jacket) → **Gated product**
4. **Continue to Checkout** → discount auto-applied → **Complete purchase**
5. **Confirmation** → single attribution note (Impact.com postback, grounded in spec §1.4) → **Return to Rakuten**

## Known gaps / next iteration ideas

- No real Shopify/Impact.com integration — this is UX/illustration only.
- Order ID and customer name are hardcoded constants in `app.js` (`ORDER_ID`, `CUSTOMER_NAME`) — kept identical to the other demo surfaces for a consistent story. Product data lives in the shared catalog (`../shared/products.js`), not hardcoded here.
- `pillar-3-website/index.html` (the Return-to-Rakuten target) is built by another agent as a sibling demo folder; this demo only links to it, it does not assume anything about its contents.
- Desktop-width only (`min-width: 960px` on `body`) — not tested at mobile viewports, matching the brief that this is a desktop-width single-page demo.
