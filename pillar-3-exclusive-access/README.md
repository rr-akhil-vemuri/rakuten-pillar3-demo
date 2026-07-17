# Pillar 3 Demo Prototype — Exclusive Member Product Access

Click-through HTML/CSS/JS prototype of the member-facing screens for Pillar 3, built from `/design/pillar-3-exclusive-access.md`. No backend, no build step — open `index.html` directly in a browser.

```
open index.html
```

## What's in here

- **index.html** — phone-frame rig with the scenario toggle (PRD v2 §7.2); the hand-coded `.statusbar`/`.bottom-nav` in this file are only shown for screens with no real screenshot (see below). There is no checkout-mechanism variant toggle on this surface anymore — see "Real navigation" below.
- **styles.css** — Rakuten-style visual language (purple/lavender palette) plus a distinct purple-to-black "exclusive" gradient treatment used on the non-screenshot screens. A red (`--rakuten-red`) accent is used sparingly for the lapsed-reengagement scenario's expiry countdown.
- **app.js** — a small state machine driving all screens; the real product (Gymshark's Shadow Seamless T Shirt, $44.00, `PRODUCT` constant) and member ID are the only hardcoded/synthetic data left

## Real screenshots (Home / Explore / Rewards)

Home, Explore, and Rewards render **real Rakuten app screenshots** (`../design/assets/rakuten-app-*.png`) as full-bleed images, instead of hand-coded CSS UI — the status bar and bottom nav are baked into those images' own pixels, so the hand-coded `.statusbar`/`.bottom-nav` elements are hidden for these three screens (`updateChrome()` in app.js). Invisible, percentage-positioned `<button>` hotspots sit on top of the real nav bar for tab switching, so they still scale correctly if the image is displayed at less than its native 919px width.

The Rewards screenshot is a **composited** image (`rakuten-app-rewards-composited.png`, built with Pillow from the original `rakuten-app-rewards.png`) with one new card's background/badge/border inserted between the Active/Earned/Expired pills and the Amazon Offer card, matching the real scalloped-badge visual language sampled directly from the surrounding cards. The card's **title and description text are NOT baked into the image** — they're real HTML rendered on top (`.rewards-card-overlay` in styles.css, driven by `REWARDS_CARD_COPY[state.scenario]` in app.js) so the copy changes per scenario (e.g. "Gymshark — Member Exclusive" vs. "Gymshark — We've Held Your Spot"), the same way the offer-detail screen's copy already varies with `PILLAR3.getScenario()`. This is the quid-pro-quo tile — Rakuten surfaces Gymshark's exclusive product on the high-traffic Rewards tab (an acquisition/visibility channel for the merchant) in exchange for exclusive member pricing (value to the member and to Rakuten as the platform that unlocked it). An invisible hotspot over this card triggers the same `setScreen("offerDetail")` transition used throughout the rest of the flow.

Home and Explore have no other interactive content beyond tab navigation — out of scope per current direction ("we dont care for the home page").

## Walkthrough path

1. **Rewards** → tap the "Gymshark — Member Exclusive" card (US-1)
2. **Offer detail** → shows the real product (photo, name, price) with per-scenario badge/countdown/cashback (US-1). A presenter-only note about the eligibility-logic simplification is shown here, hidden in `?clean=1` mode.
3. **"Unlock This Item"** → a **real page navigation** (`window.location.href`) straight to the merchant demo surface (`../pillar-3-merchant-shopify/index.html?src=website&scenario=<current scenario>`) — exactly like a real Rakuten-issued link would behave. There is no fake "redirecting…" interstitial and no simulated in-app checkout on this surface anymore; the merchant surface's own `boot()` reads `?src=website` to jump straight into its gated-product view and `?scenario=` to carry the lifecycle scenario across. Checkout itself now lives entirely on that surface.

The old `renderRedirect()`/`renderCheckout()`/`renderConfirmation()` screens (fake spinner interstitial, simulated in-app-browser Shopify checkout with Variant A/B invoice-link vs. discount-code toggle, and this surface's own confirmation+attribution screen) have been removed as dead code now that the journey exits via real navigation before reaching them — that mechanism now lives entirely on the merchant surface.

## Negative case (US-3)

The Explore tab is now a real screenshot with no search input wired up (see above) — the negative/non-gated search case (US-3) previously reachable from Explore currently has no entry point in the UI. `renderSearchEmpty()` and its copy are still intact in `app.js` and reachable via `setScreen("searchEmpty")` from the console if needed for a walkthrough.

## Known gaps / next iteration ideas

- No real Shopify/Impact.com integration — this is UX only, matching the design doc's explicit non-decisions on gating mechanism and sync-click capability.
- No mobile-viewport testing beyond the fixed phone-frame rig; if presenting on a projector, the rig is sized for desktop viewing, not a real device.
- The Explore tab's search entry point into the negative case (US-3) was removed when Explore switched to a real screenshot — no current UI path reaches `renderSearchEmpty()`. Flagging as scope drift from the original design doc rather than silently dropping it.
