/*
 * Pillar 3 demo prototype — click-through only, no backend.
 * State machine: `state.screen` drives which render function runs.
 * Variant A/B toggle simulates the two undecided gating mechanisms from the spec.
 */

const PRODUCT = {
  name: "Aurora Trail Jacket",
  price: "$228.00",
  discountPrice: "$182.40",
  emoji: "🧥",
};

const state = {
  screen: "home",
  variant: "A", // "A" = draft-order/invoice link, "B" = shared link + single-use discount code
  scenario: "exclusive-drop", // key into PILLAR3.SCENARIOS (shared/lifecycle-data.js) — see PRD v2 §7.2
  searchQuery: "",
  redeemed: false,
};

const viewport = document.getElementById("screenViewport");
const bottomNav = document.getElementById("bottomNav");

function setScreen(screen) {
  state.screen = screen;
  render();
}

function render() {
  const renderers = {
    home: renderHome,
    explore: renderExplore,
    rewards: renderRewards,
    instore: renderPlaceholder,
    account: renderPlaceholder,
    offerDetail: renderOfferDetail,
    redirect: renderRedirect,
    checkout: renderCheckout,
    confirmation: renderConfirmation,
    searchEmpty: renderSearchEmpty,
  };

  viewport.innerHTML = renderers[state.screen]();
  updateBottomNav();
  attachHandlers();
  viewport.scrollTop = 0;
}

function updateBottomNav() {
  const tabScreens = ["home", "explore", "rewards", "instore", "account"];
  const activeTab = tabScreens.includes(state.screen) ? state.screen : null;
  bottomNav.querySelectorAll(".nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.screen === activeTab);
  });
}

/* ---------- Screen 1: Home — hero card entry point (US-1) ---------- */

function renderHome() {
  const s = PILLAR3.getScenario(state.scenario);
  return `
    <div class="screen">
      <div class="search-bar">🔍 Try searching Expedia</div>
      <div class="tabs-row">
        <span class="tab-pill active">Today</span>
        <span class="tab-pill">For you</span>
      </div>

      <div class="hero-card exclusive-card" id="exclusiveHero">
        <div class="eyebrow">
          <span class="lock-badge">🔒 ${s.badgeText}</span>
        </div>
        <h3>${s.heroHeadline}</h3>
        <p>${s.hook}</p>
        <div class="lifecycle-chip">Arc lifecycle stage (internal): ${PILLAR3.LIFECYCLE_LABELS[s.lifecycleStage]}</div>
        <button class="pill-btn">View Access</button>
      </div>

      <div class="hero-card">
        <div class="eyebrow">StubHub</div>
        <h3>Shop today's Big Deal</h3>
        <p>12% Cash Back <s>was 2%</s></p>
        <button class="pill-btn">Shop Now</button>
      </div>

      <div class="section-title">Shop with your welcome reward</div>
      <div class="store-grid">
        ${storeTile("Amazon", "#111", "$5 Cash Back", "was $0")}
        ${storeTile("eBay", "#E1291F", "Up to 11%", "was 1%")}
        ${storeTile("Best Buy", "#0A4FA8", "Up to 17.5%", "was 7.5%")}
      </div>
    </div>
  `;
}

function storeTile(name, color, rate, was) {
  return `
    <div>
      <div class="store-tile" style="background:${color}">${name}</div>
      <div class="store-label">${name}</div>
      <div class="store-rate">${rate}</div>
      <div class="store-rate-was">${was}</div>
    </div>
  `;
}

/* ---------- Explore tab — secondary entry point + negative case search ---------- */

function renderExplore() {
  return `
    <div class="screen">
      <div class="search-bar">
        <input class="search-input" id="exploreSearch" placeholder="Try searching Ulta Beauty or ${PRODUCT.name}" />
      </div>
      <div class="category-grid">
        ${categoryTile("🔥", "Hot Deals")}
        ${categoryTile("％", "Extra")}
        ${categoryTile("📈", "Trending")}
        ${categoryTile("✈️", "Travel")}
        ${categoryTile("📷", "Experiences")}
        ${categoryTile("👕", "Clothing")}
        ${categoryTile("💅", "Beauty")}
        ${categoryTile("🎧", "Electronics")}
        <button class="category-tile" id="exclusiveTile">
          <span class="category-icon exclusive">🔒</span>
          <span>Exclusive</span>
        </button>
      </div>
    </div>
  `;
}

function categoryTile(icon, label) {
  return `
    <div class="category-tile">
      <span class="category-icon">${icon}</span>
      <span>${label}</span>
    </div>
  `;
}

/* ---------- Rewards tab (unchanged reference screen) ---------- */

function renderRewards() {
  return `
    <div class="screen">
      <div class="section-title" style="margin-top:4px;">Rewards</div>
      <div class="tabs-row">
        <span class="tab-pill active">Active</span>
        <span class="tab-pill">Earned</span>
        <span class="tab-pill">Expired</span>
      </div>
      ${rewardItem("🛍️", "$5", "Amazon Offer", "Shop with the app or extension up to 3 times to earn a total of $15.")}
      ${rewardItem("⚡", "+10%", "Welcome Boost", "Get an extra 10% Cash Back at 2,500+ stores, up to $50.")}
      ${rewardItem("🔒", "", "Members-Only Access", "You're eligible for one exclusive product this month — check the Home tab.")}
    </div>
  `;
}

function rewardItem(icon, amount, title, desc) {
  return `
    <div class="reward-item">
      <div class="reward-icon">${icon}</div>
      <div>
        ${amount ? `<div class="reward-amount">${amount}</div>` : ""}
        <div class="reward-title">${title}</div>
        <div class="reward-desc">${desc}</div>
      </div>
    </div>
  `;
}

function renderPlaceholder() {
  return `
    <div class="screen">
      <div class="empty-state">
        <div class="icon">🚧</div>
        <h3>Not part of this demo</h3>
        <p>This tab isn't built out for the Pillar 3 walkthrough.</p>
      </div>
    </div>
  `;
}

/* ---------- Screen 2: Offer detail (US-1) ---------- */

function renderOfferDetail() {
  const s = PILLAR3.getScenario(state.scenario);
  return `
    <div class="screen">
      <div class="back-row" id="backToHome">← Back</div>
      <div class="product-image">${PRODUCT.emoji}</div>
      <div class="exclusive-tag">🔒 ${s.badgeText}</div>
      <div class="product-title">${PRODUCT.name}</div>
      <div class="product-price">${PRODUCT.price}</div>
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
      <div class="eligibility-note">
        <span class="demo-flag">Demo simplification</span>
        Available to select members. This eligibility check is a hardcoded synthetic allowlist for the demo — the underlying spec defines no real tiering logic beyond "targeted set of members."
      </div>
      <button class="full-btn dark" id="unlockBtn">Unlock This Item</button>
      <div class="secondary-link" id="backToHome2">Not now</div>
    </div>
  `;
}

/* ---------- Screen 3: Click/redirect transition (US-2) ---------- */

function renderRedirect() {
  setTimeout(() => setScreen("checkout"), 1400);
  return `
    <div class="screen redirect-wrap">
      <div class="spinner"></div>
      <h3>Redirecting you to your exclusive access checkout...</h3>
      <p>Tracking your access via Rakuten — do not close this window.</p>
      <div class="redirect-trace">
        <div class="ok">✓ Member authenticated (member_id: rkt_test_00219)</div>
        <div class="ok">✓ Click logged against member identity</div>
        <div>… resolving gated destination on merchant store <span style="color:#A6862F">[step depends on Impact.com confirmation]</span></div>
      </div>
    </div>
  `;
}

/* ---------- Screen 4: Gated checkout (US-4) — two variants ---------- */

function renderCheckout() {
  if (state.variant === "A") {
    // Variant A = Shopify draft-order invoice link. The member has functionally
    // left the Rakuten app for a hosted page on the merchant's own Shopify
    // checkout domain, so this renders as an "in-app browser" viewing a
    // Shopify-style checkout — not a Rakuten-branded screen. See
    // impact-pillar3-spec.md §1.4.
    return `
      <div class="screen shopify-screen">
        <div class="inapp-browserbar">
          <span class="inapp-lock" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
          </span>
          <span class="inapp-url">northfield-outfitters.myshopify.com/…/invoices/…</span>
          <span class="inapp-close" id="backToOffer" title="Close">✕</span>
        </div>

        <div class="shopify-page">
          <div class="shopify-merchant-header">${PILLAR3.MERCHANT_NAME}</div>

          <div class="shopify-order-summary">
            <div class="shopify-summary-item">
              <span class="shopify-thumb">${PRODUCT.emoji}</span>
              <span class="shopify-summary-name">${PRODUCT.name}</span>
              <span class="shopify-summary-price">${PRODUCT.price}</span>
            </div>
            <div class="shopify-summary-line"><span>Shipping</span><span>Free</span></div>
            <div class="shopify-summary-line total"><span>Total</span><span>${PRODUCT.price}</span></div>
          </div>

          <div class="shopify-section">
            <div class="shopify-section-label">Contact</div>
            <div class="shopify-field muted">member@example.com</div>
          </div>

          <div class="shopify-section">
            <div class="shopify-section-label">Shipping address</div>
            <div class="shopify-field muted shopify-address">
              <span>Alex Rivera</span>
              <span>482 Birchwood Lane, Boulder, CO 80301</span>
            </div>
          </div>

          <div class="shopify-section">
            <div class="shopify-section-label">Shipping method</div>
            <div class="shopify-shipping-method"><span>Standard</span><span>Free</span></div>
          </div>

          <div class="shopify-section">
            <div class="shopify-section-label">Payment</div>
            <div class="shopify-card-icons" aria-hidden="true">
              <span class="card-chip">VISA</span>
              <span class="card-chip">MC</span>
              <span class="card-chip">AMEX</span>
            </div>
            <button class="shopify-pay-btn" id="payBtn" ${state.redeemed ? "disabled" : ""}>
              ${state.redeemed ? "Link already redeemed" : "Pay now"}
            </button>
          </div>

          <div class="shopify-footer">
            <span class="shopify-secure">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
              Secure Checkout
            </span>
            <span class="shopify-powered">Powered by Shopify</span>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="screen">
      <div class="back-row" id="backToOffer">← Back</div>
      <div class="section-title" style="margin-top:4px;">Checkout</div>
      <div class="checkout-card">
        <div class="checkout-row"><span>${PRODUCT.emoji} ${PRODUCT.name}</span><span>${PRODUCT.price}</span></div>
        <div class="checkout-row"><span>Shipping</span><span>$0.00</span></div>
      </div>
      <div class="discount-applied">
        <span>🔒 EXCLUSIVE-ACCESS code applied</span>
        <span>${state.redeemed ? "Used" : "-20%"}</span>
      </div>
      <div class="checkout-card">
        <div class="checkout-row total"><span>Total</span><span>${state.redeemed ? "—" : PRODUCT.discountPrice}</span></div>
      </div>
      <button class="full-btn" id="payBtn" ${state.redeemed ? "disabled" : ""}>
        ${state.redeemed ? "Code already used" : "Complete purchase"}
      </button>
    </div>
  `;
}

/* ---------- Screen 5: Confirmation + attribution proof (US-5) ---------- */

function renderConfirmation() {
  const orderId = "SHF-88213";
  const clickId = "rkt_click_5591a";

  return `
    <div class="screen">
      <div class="confirm-check">✓</div>
      <div class="confirm-title">Order Confirmed</div>
      <div class="confirm-sub">Your exclusive item is on its way.</div>

      <div class="checkout-card">
        <div class="checkout-row"><span>${PRODUCT.emoji} ${PRODUCT.name}</span><span>${state.variant === "B" ? PRODUCT.discountPrice : PRODUCT.price}</span></div>
        <div class="checkout-row"><span>Order ID</span><span>${orderId}</span></div>
      </div>

      <div class="attribution-panel">
        <h4>📊 Attribution proof (demo view)</h4>
        <div class="attribution-row"><span>Order ID</span><span>${orderId}</span></div>
        <div class="attribution-row"><span>Originating click</span><span>${clickId}</span></div>
        <div class="attribution-row"><span>Member ID</span><span>rkt_test_00219</span></div>
        <div class="matched-badge">Matched ✓ — Attributed to Rakuten</div>
      </div>
      <div class="demo-note-banner">This panel is a demo-only visualization so attribution can be seen live, not just claimed.</div>

      <button class="full-btn" id="doneBtn" style="margin-top:16px;">Back to Home</button>
    </div>
  `;
}

/* ---------- Negative case: search shows nothing (US-3) ---------- */

function renderSearchEmpty() {
  const s = PILLAR3.getScenario(state.scenario);
  return `
    <div class="screen">
      <div class="search-bar">
        <input class="search-input" id="exploreSearch2" placeholder="Search" value="${state.searchQuery}" />
      </div>
      <div class="empty-state">
        <div class="icon">🔍</div>
        <h3>No results for "${state.searchQuery}"</h3>
        <p>${s.searchEmptyCopy}</p>
      </div>
      <div class="secondary-link" id="backToExplore">← Back to Explore</div>
    </div>
  `;
}

/* ---------- Event wiring ---------- */

function attachHandlers() {
  const on = (id, evt, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(evt, fn);
  };

  // Home
  on("exclusiveHero", "click", () => setScreen("offerDetail"));

  // Explore
  on("exclusiveTile", "click", () => setScreen("offerDetail"));
  on("exploreSearch", "keydown", (e) => {
    if (e.key === "Enter") {
      state.searchQuery = e.target.value || PRODUCT.name;
      setScreen("searchEmpty");
    }
  });
  on("exploreSearch2", "keydown", (e) => {
    if (e.key === "Enter") {
      state.searchQuery = e.target.value;
      render();
    }
  });
  on("backToExplore", "click", () => setScreen("explore"));

  // Offer detail
  on("backToHome", "click", () => setScreen("home"));
  on("backToHome2", "click", () => setScreen("home"));
  on("unlockBtn", "click", () => setScreen("redirect"));

  // Checkout
  on("backToOffer", "click", () => setScreen("offerDetail"));
  on("payBtn", "click", () => {
    state.redeemed = true;
    setScreen("confirmation");
  });

  // Confirmation
  on("doneBtn", "click", () => {
    state.redeemed = false;
    setScreen("home");
  });

  // Bottom nav
  bottomNav.querySelectorAll(".nav-item").forEach((btn) => {
    btn.onclick = () => setScreen(btn.dataset.screen);
  });
}

/* ---------- Scenario toggle (PRD v2 §7.2) ---------- */

function renderScenarioToggle() {
  const container = document.getElementById("scenarioToggle");
  const label = container.querySelector("span");
  container.innerHTML = "";
  container.appendChild(label);
  PILLAR3.SCENARIOS.forEach((s) => {
    const btn = document.createElement("button");
    btn.className = "variant-btn" + (state.scenario === s.key ? " active" : "");
    btn.textContent = s.navLabel;
    btn.addEventListener("click", () => setScenario(s.key));
    container.appendChild(btn);
  });
}

function setScenario(key) {
  state.scenario = key;
  renderScenarioToggle();
  if (state.screen === "home" || state.screen === "offerDetail" || state.screen === "searchEmpty") {
    render();
  }
}

/* ---------- Variant toggle + reset (outside phone rig) ---------- */

document.getElementById("variantABtn").addEventListener("click", () => setVariant("A"));
document.getElementById("variantBBtn").addEventListener("click", () => setVariant("B"));
document.getElementById("resetBtn").addEventListener("click", () => {
  state.screen = "home";
  state.searchQuery = "";
  state.redeemed = false;
  render();
});

function setVariant(v) {
  state.variant = v;
  document.getElementById("variantABtn").classList.toggle("active", v === "A");
  document.getElementById("variantBBtn").classList.toggle("active", v === "B");
  if (state.screen === "checkout") render();
}

renderScenarioToggle();
render();
