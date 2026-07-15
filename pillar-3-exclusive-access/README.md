# Pillar 3 Demo Prototype — Exclusive Member Product Access

Click-through HTML/CSS/JS prototype of the member-facing screens for Pillar 3, built from `/design/pillar-3-exclusive-access.md`. No backend, no build step — open `index.html` directly in a browser.

```
open index.html
```

## What's in here

- **index.html** — phone-frame rig with a variant toggle (Variant A: invoice link / Variant B: discount code) and a bottom nav
- **styles.css** — Rakuten-style visual language (purple/lavender palette, category tiles, hero cards) plus a distinct purple-to-black "exclusive" gradient treatment
- **app.js** — a small state machine driving all screens; all data (product, member ID, order ID) is hardcoded/synthetic

## Walkthrough path (matches the design doc's screen order)

1. **Home** → tap the "Members-Only Access" hero card (US-1)
2. **Offer detail** → "Unlock This Item" (US-1, eligibility flagged as a demo simplification)
3. **Redirect** transition, shows the tracked-click trace (US-2)
4. **Checkout** — toggle Variant A/B at the top of the page before clicking through to compare mechanisms (US-4). Variant A is styled as a real Shopify-hosted draft-order invoice: an in-app-browser chrome (URL bar showing the merchant's `.myshopify.com` domain) wraps a non-Rakuten-branded checkout page (merchant wordmark, muted prefilled contact/shipping fields, card-brand icons, a dark "Pay now" button, "Powered by Shopify" footer) — signaling the member has actually left the Rakuten app. Variant B stays the original in-app-styled checkout.
5. **Confirmation** with a visible attribution-proof panel (US-5)

## Negative case (US-3)

Go to **Explore tab** → search "Aurora Trail Jacket" (or anything) → shows the product does not appear in normal search.

## Known gaps / next iteration ideas

- No real Shopify/Impact.com integration — this is UX only, matching the design doc's explicit non-decisions on gating mechanism and sync-click capability.
- Product data, member ID, and order ID are all hardcoded constants in `app.js` — swap `PRODUCT` object to demo a different SKU.
- No mobile-viewport testing beyond the fixed phone-frame rig; if presenting on a projector, the rig is sized for desktop viewing, not a real device.
