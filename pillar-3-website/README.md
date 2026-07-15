# Pillar 3 Demo Prototype — Rakuten Website Surface

Desktop-width click-through HTML/CSS/JS prototype of a **new** Rakuten.com member-exclusive-access feature that does not exist on the real site today. Built from `/design/pillar-3-exclusive-access.md`. No backend, no build step — open `index.html` directly in a browser (or serve statically).

```
open index.html
```

## What this demo shows

A member browsing rakuten.com sees a Members-Only Access hero banner for the (synthetic) Aurora Trail Jacket, taps through to an offer detail page, unlocks the item, and is routed through a tracked-click redirect toward the gated merchant checkout. It also demonstrates the negative case — the exclusive product cannot be found through normal site search — and, on return from the merchant site, a demo-only attribution-proof panel that shows the completed purchase matched back to the originating Rakuten click.

This is one of **three linked demo surfaces** in the Pillar 3 demo suite:
1. **Mobile app** (`/demos/pillar-3-exclusive-access`)
2. **Website** (this folder) — `/demos/pillar-3-website`
3. **Merchant Shopify site** (`/demos/pillar-3-merchant-shopify`, built separately)

All three are linked from `/demos/index.html` (the "Demo Hub"), which every view in this demo links back to via the "◀ Demo Hub" link in the top-left corner.

## Walkthrough path

1. **Home** — hero banner ("Members-Only Access") → click **View Access**
2. **Offer detail** — Aurora Trail Jacket, $228.00, exclusive-access badge → click **Unlock This Item**
3. **Redirect** — modal overlay with spinner + tracked-click trace log, then a real page navigation (after ~1.4s) to `../pillar-3-merchant-shopify/index.html?src=website`
4. User completes purchase on the merchant Shopify demo (separate folder/agent)
5. **Returns here** via `index.html?returned=1` — the Home view then shows a "Welcome back — Attribution Proof" panel with synthetic Order ID, click ID, Member ID, and a green "Matched" badge

**Also try:** on the Home view, type anything into either search bar and press Enter to see the negative case (US-3) — "No results found" — demonstrating the exclusive product isn't reachable through normal search/browsing.

## Files

- **index.html** — desktop nav bar (Rakuten wordmark, category button, search, extension/sign-in links) + a `<main id="page">` content area that `app.js` swaps between views
- **styles.css** — same purple/lavender palette and purple-to-black exclusivity gradient as the mobile demo, laid out at desktop width (max-width ~1200px)
- **app.js** — small state machine (`state.view`) driving four views: `home`, `offerDetail`, `redirect`, `searchEmpty`; all product/member/order data is hardcoded synthetic constants at the top of the file

## Known gaps / deviations

- No real Shopify/Impact.com integration — this is UX only. The redirect trace explicitly flags the "resolving gated destination" step as unconfirmed/dependent on Impact.com, per the spec's open items.
- The `../pillar-3-merchant-shopify/index.html` target is a sibling folder built by a separate agent; this demo does not control its contents, only the relative link and the `?src=website` / `?returned=1` query-string contract.
- "Shop by Category" button is decorative (click handler is a no-op) — a full category mega-menu is out of scope for Pillar 3.
