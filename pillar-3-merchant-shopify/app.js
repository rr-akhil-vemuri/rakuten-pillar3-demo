/*
 * Gymshark — merchant Shopify storefront (demo).
 * Pillar 3 surface: shows what a member sees once they land on the
 * merchant's own site via a Rakuten-issued link. Every view is a real
 * gymshark.com screenshot (home / PDP / checkout / order confirmation) with
 * a minimal Rakuten exclusivity layer overlaid on top as absolutely
 * positioned HTML — there is no hand-coded merchant nav, footer, About
 * page, or search page. The screenshot IS the page; the only thing outside
 * the screenshot is the demo-scenario picker (presenter-only, hidden by
 * ?clean=1).
 *
 * There is exactly ONE real product: Gymshark's actual "Shadow Seamless
 * T Shirt" ($44), the same product baked into the real screenshots
 * (../shared/products.js, PILLAR3.getProduct / PILLAR3.DEFAULT_PRODUCT_ID).
 * It is the single exclusive SKU used across all 4 PRD scenarios.
 * (Historical note: the demo suite previously had a third, separate
 * "Rakuten website" surface — removed in favor of just the mobile app +
 * this merchant site. The ?src=website param name is kept as-is since it's
 * still the mobile app's "Unlock This Item" -> merchant-checkout handoff
 * mechanism, not tied to a website surface anymore.)
 */

const state = {
  view: "home",
  scenario: "exclusive-drop", // key into PILLAR3.SCENARIOS (shared/lifecycle-data.js) — see PRD v2 §7.2
  prospectFormOpen: false, // B1: locked buy box -> "Unlock with Rakuten" reveals the join form
  prospectUnlocked: false, // B1: join form submitted -> reveals real price + normal buy box
};

const viewRoot = document.getElementById("viewRoot");

/* ---------- History (native browser Back/Forward) ----------
 * Every state-changing click goes through commitState() instead of a bare
 * `state.x = y; render();` — that pushes a snapshot of `state` onto the
 * browser history stack, so native Back/Forward steps through the actual
 * click sequence (any number of steps) rather than leaving the page
 * entirely. boot() below seeds the initial entry via replaceState instead
 * of pushState since it's applying URL params, not a user click.
 */

function pushHistory() {
  history.pushState({ snapshot: { ...state } }, "", location.href);
}

function commitState(patch) {
  Object.assign(state, patch);
  pushHistory();
  render();
}

window.addEventListener("popstate", (e) => {
  if (e.state && e.state.snapshot) {
    Object.assign(state, e.state.snapshot);
    // renderScenarioRow()'s active-class toggle lives outside viewRoot, so
    // render() alone won't reflect a scenario change that Back/Forward just
    // restored — refresh that chrome too.
    renderScenarioRow();
    render();
  }
});

/* ---------- Render dispatch ---------- */

function setView(view) {
  commitState({ view });
}

function render() {
  const renderers = {
    home: renderHome,
    gatedProduct: renderGatedProduct,
    checkout: renderCheckout,
    confirmation: renderConfirmation,
  };

  viewRoot.innerHTML = renderers[state.view]();
  attachHandlers();
  window.scrollTo(0, 0);
}

/* ---------- View 1: Home — real Gymshark homepage screenshot ----------
 * Full-bleed real screenshot. A single invisible hotspot sits directly over
 * the "Shadow Seamless T Shirt / Heavy Blue / $44" product tile (2nd tile in
 * the "HOT GYM SUMMER" row) — clicking anywhere in it (including the badge
 * overlay below) simulates following a Rakuten-issued link to that exact
 * product, taking the member to the gated PDP view. Coordinates measured
 * directly from the real screenshot (images/gymshark/shopify home page.png,
 * 1920x929); hotspot height (76.96%) runs from the photo's top edge all the
 * way to the image's bottom edge so it also covers the price row below.
 *
 * The tile's own baked-in "$44" price line (bottom-most text row, y:858-929
 * of 929) is covered with a white rectangle and replaced with the same
 * lock-icon "Rakuten Exclusive" treatment on every scenario — left-aligned
 * with the tile's own product-name/price text column (both start at the
 * same x, see .home-tile-overlay in styles.css) rather than each scenario
 * showing its own badgeText pill. The gated product page (renderGatedProduct)
 * still shows each scenario's own badge/countdown copy — only this catalog
 * tile treatment is unified.
 *
 * A small Rakuten "R" logo mark also sits in the top-left corner of the
 * product photo itself (.home-tile-logo-badge), independent of the price-row
 * treatment below.
 */

function renderHome() {
  const lockIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;
  return `
    <div class="shot-frame">
      <img src="../images/gymshark/shopify%20home%20page.png" alt="Gymshark storefront homepage">
      <button type="button" class="product-hotspot" id="homeProductHotspot"
        style="left:26.04%; top:23.04%; width:23.85%; height:76.96%;"
        aria-label="Shadow Seamless T Shirt — via Rakuten"></button>
      <div class="home-tile-logo-badge"><img src="../design/assets/r_logo.png" alt="Rakuten"></div>
      <div class="home-price-cover"></div>
      <div class="home-tile-overlay"><div class="home-tile-locked">${lockIcon}<span>Rakuten Exclusive</span></div></div>
    </div>
  `;
}

/* ---------- View 2: Gated product landing page (real Shopify PDP screenshot) ----------
 * The real Gymshark PDP screenshot (images/gymshark/shopify product page.png,
 * 1920x929) is the base layer. The Rakuten exclusivity layer (badge,
 * countdown/cashback boxes, unlock flow, CTA) is overlaid as absolutely
 * positioned HTML on top, percentage-positioned against the screenshot's
 * natural 1920x929 aspect ratio (see .pdp-overlay-* rules in styles.css).
 * The screenshot's own baked-in product photography already reads "Shadow
 * Seamless T Shirt / $44 / Heavy Blue" — this demo's real product, so there
 * is no naming mismatch to reconcile.
 */

function renderGatedProduct() {
  const s = PILLAR3.getScenario(state.scenario);
  const product = PILLAR3.getProduct(PILLAR3.DEFAULT_PRODUCT_ID);
  const isProspectScenario = state.scenario === "prospect-unlock";
  const isUrgentScenario = state.scenario === "lapsed-reengagement";

  return `
    <div class="shot-frame pdp-shot-frame">
      <img src="../images/gymshark/shopify%20product%20page.png" alt="Real product page — Shadow Seamless T Shirt">
      <div class="pdp-price-cover"></div>
      <div class="pdp-overlay-badge">
        <div class="exclusive-tag${isUrgentScenario ? " urgent" : ""}">${s.badgeText} — via Rakuten</div>
      </div>
      <div class="pdp-overlay-buybox">
        ${isProspectScenario ? prospectBuyBoxMarkup(product) : standardBuyBoxMarkup(s, product)}
      </div>
    </div>
  `;
}

function standardBuyBoxMarkup(s, product) {
  return `
    <div class="pdp-overlay-card">
      <div class="pdp-overlay-product-name">${product.name} <span>— Rakuten Exclusive</span></div>
      <div class="product-price">${product.price}</div>
      <div class="countdown-row">
        <div class="countdown-box">
          <div class="countdown-label">${s.countdownLabel}</div>
          <div class="countdown-value">${s.countdownValue}</div>
        </div>
        <div class="countdown-box">
          <div class="countdown-label">Cashback rate</div>
          <div class="countdown-value">${s.cashbackRate}</div>
        </div>
      </div>
      <button class="pill-btn-solid" id="continueToCheckoutBtn">Continue to Checkout</button>
    </div>
  `;
}

/* B1 — inline unlock (prospect-unlock scenario only). Locked buy box ->
 * "Unlock with Rakuten" reveals a join form -> submitting reveals the real
 * cashback rate + a normal buy box. All client-side (state.prospectUnlocked),
 * no network call — this is a demo.
 *
 * Price is shown plainly throughout — there's no discount to gate. What's
 * gated until join is the cashback rate itself, shown as a plain "cashback
 * rate hidden" card (the PRD's other gating-treatment option, a strikethrough
 * price teaser, was removed as a presenter toggle — locked is the only
 * treatment now). */
function prospectBuyBoxMarkup(product) {
  if (state.prospectUnlocked) {
    return unlockedProspectBuyBoxMarkup(PILLAR3.getScenario(state.scenario), product);
  }

  if (state.prospectFormOpen) {
    return prospectUnlockFormMarkup();
  }

  const lockIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;

  return `
    <div class="pdp-overlay-card">
      <div class="pdp-overlay-product-name">${product.name} <span>— Rakuten Exclusive</span></div>
      <p class="product-price">${product.price}</p>
      <div class="buy-box-locked">
        ${lockIcon}
        <div class="msg">Cashback rate hidden<small>Join Rakuten free to reveal your rate</small></div>
      </div>
      <button class="pill-btn-solid" id="unlockWithRakutenBtn">Unlock with Rakuten</button>
    </div>
  `;
}

/* Post-unlock buy box (prospect-unlock only). Reveals the real cashback rate
 * in a single box — no second countdown box here since this scenario has no
 * time/spots-remaining framing, just the gated rate. */
function unlockedProspectBuyBoxMarkup(s, product) {
  return `
    <div class="pdp-overlay-card">
      <div class="pdp-overlay-product-name">${product.name} <span>— Rakuten Exclusive</span></div>
      <p class="product-price">${product.price}</p>
      <div class="countdown-row">
        <div class="countdown-box">
          <div class="countdown-label">Cashback rate</div>
          <div class="countdown-value">${s.cashbackRate}</div>
        </div>
      </div>
      <button class="pill-btn-solid" id="continueToCheckoutBtn">Continue to Checkout</button>
    </div>
  `;
}

function prospectUnlockFormMarkup() {
  return `
    <div class="pdp-overlay-card">
      <div class="unlock-form">
        <div class="label">Join Rakuten to unlock your cashback rate</div>
        <div class="row">
          <input type="text" placeholder="Email address" disabled>
          <button type="button" id="joinAndUnlockBtn">Join &amp; Unlock</button>
        </div>
        <div class="fine">Free to join. Takes about 10 seconds.</div>
      </div>
    </div>
  `;
}

/* ---------- View 3: Checkout — real Gymshark checkout screenshot, cashback surfaced ----------
 * The real checkout screenshot (images/gymshark/shopify checkout page.png,
 * 1918x928) is the base layer. Its right-column order-summary card (real
 * "Shadow Seamless T Shirt", $44.00) ends around y=390px (42% down); the
 * Rakuten cashback callout + total + "Complete purchase" CTA are overlaid
 * there — reading as a continuation of the same order-summary panel rather
 * than a floating card dropped on unrelated content. See
 * .checkout-overlay-card in styles.css for exact percentage coordinates.
 * No discount is applied — the price shown is the real full price; cashback
 * is credited to the member's Rakuten account after delivery, not deducted
 * here.
 */

function renderCheckout() {
  const product = PILLAR3.getProduct(PILLAR3.DEFAULT_PRODUCT_ID);
  const s = PILLAR3.getScenario(state.scenario);
  return `
    <div class="shot-frame checkout-shot-frame">
      <img src="../images/gymshark/shopify%20checkout%20page.png" alt="Checkout — order summary">
      <div class="checkout-overlay-card">
        <div class="cashback-banner">
          <span>Cashback on this order</span>
          <span>${cashbackAmount(product.price, s.cashbackRate)} (${s.cashbackRate})</span>
        </div>
        <div class="checkout-overlay-total"><span>Total</span><span>${product.price}</span></div>
        <button class="pill-btn-solid" id="completePurchaseBtn">Complete purchase</button>
      </div>
    </div>
  `;
}

/* ---------- View 4: Confirmation — real Gymshark order-confirmation screenshot ----------
 * The real order-confirmation screenshot (images/gymshark/shopify bought
 * page.png, 1920x865) is the base layer, same .shot-frame treatment as the
 * other three views. Its own baked-in "Confirmation #A1B2C3" / "Thank you,
 * John!" text is correct as-is, but the order-summary card on the right has
 * two baked-in mismatches with this demo's actual product/pricing that get
 * covered with white/panel-color rects and replaced:
 *   1) thumbnail is a stock snowboard photo, not the Shadow Seamless T
 *      Shirt — replaced with the real product photo.
 *   2) the payment-method line shows an unrelated placeholder amount
 *      ("$749.95") instead of what was actually charged — replaced with the
 *      real full price (product.price); there's no discount so the total
 *      the real screenshot already shows needs no cover/replacement.
 * A cashback-earned line and "Return to Rakuten" button are real demo
 * content overlaid in the blank space below the real "Need help? /
 * Continue shopping" row. This is user-facing copy, so it states only the
 * value Rakuten delivered to the shopper (the cashback) — no mention of the
 * Impact.com postback mechanism that credits the order behind the scenes;
 * that's presenter-facing context, not something a real shopper would see.
 */

function renderConfirmation() {
  const product = PILLAR3.getProduct(PILLAR3.DEFAULT_PRODUCT_ID);
  const s = PILLAR3.getScenario(state.scenario);
  return `
    <div class="shot-frame confirm-shot-frame">
      <img src="../images/gymshark/shopify%20bought%20page.png" alt="Order confirmed — Shadow Seamless T Shirt">
      <div class="confirm-thumb-cover"></div>
      <img class="confirm-thumb-img" src="../images/products/shadow-seamless-tshirt.jpg" alt="Shadow Seamless T Shirt">
      <div class="confirm-payment-cover"></div>
      <div class="confirm-payment-value">${product.price}</div>
      <div class="confirm-overlay">
        <div class="cashback-earned-note"><strong>You earned ${cashbackAmount(product.price, s.cashbackRate)} cashback (${s.cashbackRate})</strong> — credited to your Rakuten account after delivery.</div>
        <button class="pill-btn-solid" id="returnToRakutenBtn">Return to Rakuten</button>
      </div>
    </div>
  `;
}

/* ---------- Cashback amount ----------
 * Derives a dollar cashback amount from the product's real price and the
 * current scenario's cashbackRate (e.g. "$44.00" + "8%" -> "$3.52"). */

function cashbackAmount(priceStr, ratePercentStr) {
  const price = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
  const rate = parseFloat(ratePercentStr.replace(/[^0-9.]/g, "")) / 100;
  return "$" + (price * rate).toFixed(2);
}

/* ---------- Event wiring ----------
 * attachHandlers() re-runs on every render() because it wires elements
 * inside viewRoot, which is fully replaced (innerHTML) each render — so
 * addEventListener there never stacks.
 */

function attachHandlers() {
  const on = (id, evt, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(evt, fn);
  };

  // Home — hotspot over the real product tile simulates following a
  // Rakuten-issued link straight to the gated PDP.
  on("homeProductHotspot", "click", () => {
    commitState({ prospectFormOpen: false, prospectUnlocked: false, view: "gatedProduct" });
  });

  // Gated product
  on("continueToCheckoutBtn", "click", () => setView("checkout"));

  // Gated product — prospect-unlock (B1): locked -> form -> unlocked
  on("unlockWithRakutenBtn", "click", () => {
    commitState({ prospectFormOpen: true });
  });
  on("joinAndUnlockBtn", "click", () => {
    commitState({ prospectUnlocked: true });
  });

  // Checkout
  on("completePurchaseBtn", "click", () => setView("confirmation"));

  // Confirmation — returns to the mobile-app surface, carrying the current
  // scenario across surfaces via ?scenario=.
  on("returnToRakutenBtn", "click", () => {
    window.location.href = "../pillar-3-exclusive-access/index.html?scenario=" + encodeURIComponent(state.scenario);
  });
}

/* ---------- Scenario selector (PRD v2 §7.2) — lives outside view switching ---------- */

function renderScenarioRow() {
  const container = document.getElementById("scenarioRow");
  const label = container.querySelector("span");
  container.innerHTML = "";
  container.appendChild(label);
  PILLAR3.SCENARIOS.forEach((s) => {
    const btn = document.createElement("button");
    btn.className = "scenario-btn" + (state.scenario === s.key ? " active" : "");
    btn.textContent = s.navLabel;
    btn.addEventListener("click", () => {
      commitState({ scenario: s.key });
      renderScenarioRow();
    });
    container.appendChild(btn);
  });
}

/* ---------- Boot: honor ?src=website as a direct entry into the gated flow ----------
 * Runs last, after every function/const above is declared, so render() is
 * safe to reference here.
 */

(function boot() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("src") === "website") {
    state.view = "gatedProduct";
  }
  const scenarioParam = params.get("scenario");
  if (scenarioParam && PILLAR3.SCENARIOS.some((s) => s.key === scenarioParam)) {
    state.scenario = scenarioParam;
  }
  if (params.get("clean") === "1") {
    document.body.classList.add("clean-shot");
  }
  history.replaceState({ snapshot: { ...state } }, "", location.href);
  renderScenarioRow();
  render();
})();
