/*
 * Northfield Outfitters — independent merchant Shopify storefront (demo).
 * Pillar 3 surface: shows what a member sees once they land on the
 * merchant's own site via a Rakuten-issued link, styled to match the
 * structural conventions of a real default Shopify theme (header/hero/
 * collection grid/PDP/footer), and a single order-confirmation attribution
 * note grounded in impact-pillar3-spec.md section 1.4 (Impact.com postbacks
 * are one-way, asynchronous notifications tied to conversion/action
 * lifecycle events — not a synchronous click hook).
 *
 * Product data comes from the shared catalog (../shared/products.js,
 * PILLAR3.PRODUCTS / PILLAR3.getProduct) so the "Rakuten Exclusive" section
 * below can browse all four SKUs; PILLAR3.DEFAULT_PRODUCT_ID keeps the
 * ?src=website cross-surface entry point landing on the same jacket every
 * other demo surface already references by name.
 */

const ORDER_ID = "SHF-88213";
const CUSTOMER_NAME = "Jordan R.";

const state = {
  view: "home",
  productId: PILLAR3.DEFAULT_PRODUCT_ID,
  searchQuery: "",
  scenario: "exclusive-drop", // key into PILLAR3.SCENARIOS (shared/lifecycle-data.js) — see PRD v2 §7.2
};

const viewRoot = document.getElementById("viewRoot");

/* ---------- Render dispatch ---------- */

function setView(view) {
  state.view = view;
  render();
}

function setProductAndView(productId, view) {
  state.productId = productId;
  state.view = view;
  render();
}

function render() {
  const renderers = {
    home: renderHome,
    about: renderAbout,
    searchEmpty: renderSearchEmpty,
    gatedProduct: renderGatedProduct,
    checkout: renderCheckout,
    confirmation: renderConfirmation,
  };

  viewRoot.innerHTML = renderers[state.view]();
  attachHandlers();
  window.scrollTo(0, 0);
}

/* ---------- View 1: Home — ordinary merchant homepage, no trace of the program ---------- */

function renderHome() {
  return `
    <section class="hero">
      <div class="hero-art">🏔️</div>
      <div class="hero-inner">
        <h1>Gear built for the trail, the summit, and the sidewalk between them.</h1>
        <p>Northfield Outfitters makes durable, weather-ready outdoor and athletic apparel for people who spend more time outside than in. Free shipping on orders over $75.</p>
        <button class="pill-btn-solid" id="shopNowBtn">Shop New Arrivals</button>
      </div>
    </section>

    <div class="feature-grid">
      <div class="feature-card">
        <div class="feature-icon">🧵</div>
        <h3>Built to Last</h3>
        <p>Ripstop fabrics and reinforced seams, tested across three seasons before they ship.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🚚</div>
        <h3>Free Returns</h3>
        <p>60-day returns on every order, no questions asked.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🌲</div>
        <h3>1% for the Trails</h3>
        <p>A portion of every sale goes to regional trail conservation groups.</p>
      </div>
    </div>

    <div class="demo-controls">
      <p class="demo-controls-label">Demo entry points — not part of the real customer-facing surface</p>
      <p class="demo-controls-sublabel">These products are hidden from Northfield's normal storefront browsing and search (per US-3) — a real shopper only ever reaches one via a Rakuten-issued link. This grid exists so the demo can be clicked through quickly, not to represent how customers would discover it.</p>
      <div class="product-grid" id="exclusiveGrid"></div>
    </div>
  `;
}

/* ---------- View 2: About — placeholder ---------- */

function renderAbout() {
  return `
    <div class="about-placeholder">
      <h2>About Northfield Outfitters</h2>
      <p>Not part of this demo walkthrough.</p>
    </div>
  `;
}

/* ---------- View 3: Search-empty — negative case (US-3) ---------- */

function renderSearchEmpty() {
  const s = PILLAR3.getScenario(state.scenario);
  return `
    <div class="empty-state">
      <div class="icon">🔍</div>
      <h2>No results found for "${escapeHtml(state.searchQuery)}"</h2>
      <p>${s.searchEmptyCopy}</p>
      <button class="text-link" id="backHomeFromSearch">← Back to Home</button>
    </div>
  `;
}

/* ---------- View 4: Gated product landing page (real Shopify PDP layout) ---------- */

function renderGatedProduct() {
  const s = PILLAR3.getScenario(state.scenario);
  const product = PILLAR3.getProduct(state.productId);
  return `
    <div class="product-view">
      <div class="product-gallery">
        <div class="product-media">${product.emoji}</div>
        <div class="product-thumb-row">
          <div class="product-thumb">${product.emoji}</div>
          <div class="product-thumb">${product.emoji}</div>
          <div class="product-thumb">${product.emoji}</div>
          <div class="product-thumb">${product.emoji}</div>
        </div>
      </div>
      <div class="product-info">
        <div class="exclusive-tag">🔗 ${s.badgeText} — via Rakuten</div>
        <div class="product-title">${product.name}</div>
        <div class="product-price">${product.price}</div>
        <p class="product-blurb">${product.blurb}</p>
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
        <div class="qty-row">
          <span class="qty-label">Quantity</span>
          <div class="qty-stepper">
            <button type="button" id="qtyMinus" aria-label="Decrease quantity">−</button>
            <span id="qtyValue">1</span>
            <button type="button" id="qtyPlus" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="pill-btn-solid" id="continueToCheckoutBtn">Continue to Checkout</button>
      </div>
    </div>
  `;
}

/* ---------- View 5: Checkout — discount auto-applied ---------- */

function renderCheckout() {
  const product = PILLAR3.getProduct(state.productId);
  return `
    <div class="checkout-view">
      <h1>Checkout</h1>
      <div class="checkout-card">
        <div class="checkout-row"><span>${product.emoji} ${product.name}</span><span class="was-price">${product.price}</span></div>
        <div class="checkout-row"><span>Shipping</span><span>$0.00</span></div>
      </div>
      <div class="discount-banner">
        <span>Discount code applied: <span class="discount-code-chip">${discountCode()}</span></span>
        <span>-20%</span>
      </div>
      <div class="checkout-card">
        <div class="checkout-row total"><span>Total</span><span>${product.discountPrice}</span></div>
      </div>
      <button class="pill-btn-solid" id="completePurchaseBtn">Complete purchase</button>
    </div>
  `;
}

/* ---------- View 6: Confirmation ---------- */

function renderConfirmation() {
  const product = PILLAR3.getProduct(state.productId);
  return `
    <div class="confirmation-view">
      <div class="confirm-check">✓</div>
      <h1>Thanks for your order, ${CUSTOMER_NAME}!</h1>
      <p class="confirm-sub">A confirmation has been sent to your inbox.</p>

      <div class="checkout-card">
        <div class="checkout-row"><span>${product.emoji} ${product.name}</span><span>${product.discountPrice}</span></div>
        <div class="checkout-row"><span>Order ID</span><span>${ORDER_ID}</span></div>
      </div>

      <div class="attribution-note">This order is matched back to Rakuten via an Impact.com postback fired on order completion — the mechanism that credits Rakuten as the issuer of this access.</div>

      <button class="pill-btn-solid" id="returnToRakutenBtn">Return to Rakuten</button>
      <p class="return-note">(In the live mobile-app walkthrough, this step would instead return to the Rakuten app's confirmation screen.)</p>
    </div>
  `;
}

/* ---------- Discount code ---------- */

function discountCode() {
  return "IMPACT-EXCL-A82F";
}

function adjustQty(delta) {
  const el = document.getElementById("qtyValue");
  if (!el) return;
  const next = Math.min(9, Math.max(1, parseInt(el.textContent, 10) + delta));
  el.textContent = String(next);
}

/* ---------- "Rakuten Exclusive" demo entry-point grid (Home only) ---------- */

function renderExclusiveGrid() {
  const grid = document.getElementById("exclusiveGrid");
  if (!grid) return;
  grid.innerHTML = "";
  PILLAR3.PRODUCTS.forEach((product) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-card-tile">${product.emoji}</div>
      <div class="product-card-body">
        <p class="product-card-name">${product.name}</p>
        <p class="product-card-price">${product.price}</p>
      </div>
    `;
    card.addEventListener("click", () => setProductAndView(product.id, "gatedProduct"));
    grid.appendChild(card);
  });
}

/* ---------- Event wiring ----------
 * attachHandlers() re-runs on every render() because it wires elements
 * inside viewRoot, which is fully replaced (innerHTML) each render — so
 * addEventListener there never stacks. Elements OUTSIDE viewRoot (nav,
 * search) persist across renders and are wired exactly once below, at
 * load time, to avoid duplicate listeners.
 */

function attachHandlers() {
  const on = (id, evt, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(evt, fn);
  };

  // Home
  on("shopNowBtn", "click", () => setView("home"));
  renderExclusiveGrid();

  // Search-empty
  on("backHomeFromSearch", "click", () => setView("home"));

  // Gated product — decorative quantity stepper. Basic visual affordance
  // only (updates the on-screen number, clamped 1-9); does not affect price
  // or checkout, per the brief.
  on("qtyMinus", "click", () => adjustQty(-1));
  on("qtyPlus", "click", () => adjustQty(1));
  on("continueToCheckoutBtn", "click", () => setView("checkout"));

  // Checkout
  on("completePurchaseBtn", "click", () => setView("confirmation"));

  // Confirmation
  on("returnToRakutenBtn", "click", () => {
    window.location.href = "../pillar-3-website/index.html?returned=1&scenario=" + encodeURIComponent(state.scenario);
  });
}

// Static merchant nav lives outside the view-swapped root, so wire it once
// at load rather than inside attachHandlers().
document.getElementById("navShop").addEventListener("click", () => setView("home"));
document.getElementById("navAbout").addEventListener("click", () => setView("about"));
document.getElementById("merchantSearch").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    state.searchQuery = e.target.value || PILLAR3.getProduct(state.productId).name;
    setView("searchEmpty");
  }
});

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
      state.scenario = s.key;
      renderScenarioRow();
      render();
    });
    container.appendChild(btn);
  });
}

/* ---------- Utilities ---------- */

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
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
  renderScenarioRow();
  render();
})();
