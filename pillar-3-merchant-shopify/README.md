# Gymshark Merchant Storefront Demo

Click-through HTML/CSS/JS prototype of the merchant's own Shopify storefront (presented as Gymshark, using real Gymshark.com screenshots) for Pillar 3 of the Rakuten Shopify x Impact.com POC. No backend, no build step, no Node-specific syntax. Open `index.html` directly in a browser.

```
open index.html
```

This is one of a **2-surface demo suite** linked from `/demos/index.html`:

1. `pillar-3-exclusive-access`, the Rakuten mobile app member experience
2. **`pillar-3-merchant-shopify` (this demo)**, the merchant's own storefront, on the other side of the click

## What this surface actually is

This is intentionally minimal: each view is a real gymshark.com screenshot with a small Rakuten overlay placed on top in HTML. There is no hand-coded merchant nav, footer, About page, or search page. The screenshot IS the page. The only thing outside the screenshot is the demo-scenario picker at the very top (presenter-only chrome, hidden by `?clean=1`).

There are exactly four views, one screenshot each:

- **Home** (`shopify home page.png`), full-bleed, with a single invisible clickable hotspot placed directly over the real "Shadow Seamless T Shirt" product tile. Clicking it simulates following a Rakuten-issued link to that product. The tile's own baked-in "$44" price line is covered with a white rectangle and replaced with the same lock-icon "Rakuten Exclusive" treatment on every scenario (see "Home tile treatment" below); a small Rakuten "R" logo mark also sits in the top-left corner of the tile's product photo.
- **Gated product / PDP** (`shopify product page.png`), with the Rakuten exclusivity layer (badge, countdown/cashback boxes, CTA) overlaid near the real buy-box location. The screenshot's own baked-in "$44" price line is likewise covered so the overlay's price is the only one visible.
- **Checkout** (`shopify checkout page.png`), with the Rakuten cashback banner and total overlaid below the real order-summary card.
- **Confirmation** (`shopify bought page.png`), with a cashback-earned line and a "Return to Rakuten" button overlaid in blank space on the real confirmation page.

### Home tile treatment (unified across scenarios)

Every scenario shows the same treatment on this catalog tile: a purple lock icon + "Rakuten Exclusive", left-aligned with the tile's own product-name/price text column below it, plus the small "R" logo badge in the photo's top-left corner. (Earlier this tile showed a different pill per scenario, e.g. "EXCLUSIVE ACCESS"/"EARLY ACCESS"/"WE'VE HELD YOUR SPOT", mirroring `design/membership-unlock-mockups.html`'s A1/A2 catalog-grid treatments — unified per design direction so this tile always reads the same regardless of scenario. The gated product page still shows each scenario's own badge/countdown copy.)

The PDP's prospect-unlock (Scenario 4) buy box also dropped its A1/A2 presenter toggle — it's locked-only now ("Cashback rate hidden" card), the strikethrough/teaser alternative treatment was removed.

## One real product, one real merchant

Earlier versions of this demo used a fictional merchant, "Northfield Outfitters," and a fictional 4-SKU catalog browsable from a card grid on Home. Both are gone. The storefront is presented purely as Gymshark, with zero fictional-merchant framing anywhere, and there is exactly one product used across the whole demo: Gymshark's real **Shadow Seamless T Shirt** ($44.00, navy/heather-blue). It's the same SKU shown in the real screenshots, so the product name and price in the Rakuten overlay always match what's baked into the photo pixels below it.

Product data comes from the shared catalog at `../shared/products.js` (`PILLAR3.PRODUCTS`), which now has a single entry: id `shadow-seamless-tshirt`, price $44.00, image `../images/products/shadow-seamless-tshirt.jpg`. `PILLAR3.DEFAULT_PRODUCT_ID` is `"shadow-seamless-tshirt"`.

## Rakuten overlay branding

Gymshark's own screenshot content (storefront chrome, product photography, checkout layout) is untouched real photo pixels: black, white, and cream, exactly as it appears on the real site. The Rakuten-attributed UI sitting on top of it (the exclusive-tag badge, the cashback banner, the primary CTA buttons) renders in real Rakuten brand colors: `--rakuten-purple` (`#5B2A86`, matching the purple already established in the sibling `pillar-3-exclusive-access` surface) and `--rakuten-red` (`#E4002B`, used for the more urgent lapsed-reengagement "WE'VE HELD YOUR SPOT" badge). This replaced an earlier gold/tan accent that had been chosen to match the now-removed fictional Northfield palette.

## Cashback-earned note (confirmation)

The confirmation view shows exactly one small, inline note (not a floating panel, not fixed-position, just an overlay near the order summary) stating only the value Rakuten delivered to the shopper:

> "You earned $X.XX cashback (Y%) — credited to your Rakuten account after delivery."

This is deliberately user-facing-only copy: no mention of the Impact.com postback mechanism that actually credits the order behind the scenes. That mechanism is real and worth knowing about, but it's presenter/internal context, not something a real shopper would ever see on their own confirmation page.

There is no discount code and no discounted price anywhere in the flow — the member pays the real $44.00 and earns cashback (credited to their Rakuten account after delivery) at that scenario's rate, shown as a dollar amount on both the checkout and confirmation views.

## Scenario switcher (presenter-only chrome)

The demo-scenario picker (`#scenarioControls`) is a single row at the very top of the page, above everything else, so "pick your scenario" is the first thing a presenter sees. It's fully hidden by `?clean=1`, real shoppers never see it. Badge text and countdown/cashback numbers for each scenario come from `PILLAR3.SCENARIOS` in `../shared/lifecycle-data.js`: cashback rate is 8% for exclusive-drop, 6% for early-access-window, 10% for lapsed-reengagement, and 8% for prospect-unlock. For prospect-unlock, the PDP shows the locked-price to unlock-form to revealed-price flow.

## Walkthrough path

1. **Home**: real Gymshark homepage. Click the (invisible) hotspot over the Shadow Seamless T Shirt tile.
2. **Gated product / PDP**: Rakuten exclusivity badge + buy box overlaid on the real PDP screenshot. Click **Continue to Checkout**.
3. **Checkout**: cashback amount surfaced on the real checkout screenshot, full price charged. Click **Complete purchase**.
4. **Confirmation**: real Gymshark order-confirmation screenshot, with the cashback-earned note overlaid. Click **Return to Rakuten** to go back to the mobile-app surface.

Can also be entered directly via `?src=website` (used by the mobile app's "Unlock This Item" handoff) and `?scenario=<key>` to land on a specific scenario.

## Known gaps / next iteration ideas

- No real Shopify/Impact.com integration. This is UX/illustration only.
- Product data lives in the shared catalog (`../shared/products.js`), not hardcoded in `app.js`. It's a single real product.
- Desktop-width only (`min-width: 960px` on `body`), not tested at mobile viewports, matching the brief that this is a desktop-width single-page demo.
