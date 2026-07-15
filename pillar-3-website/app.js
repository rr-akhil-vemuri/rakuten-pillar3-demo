/*
 * Pillar 3 demo prototype — Rakuten website surface (desktop).
 * Click-through only, no backend. Single-page app: state.view drives
 * which render function fills #page. Top nav bar stays static.
 *
 * This is one of three linked demo surfaces for the Aug 14 2026 exec demo:
 *   mobile app (../pillar-3-exclusive-access) / this website / merchant Shopify site.
 * The "redirect" view performs a REAL cross-page navigation to the sibling
 * merchant Shopify demo at ../pillar-3-merchant-shopify/index.html.
 */

const PRODUCT = {
  name: "Aurora Trail Jacket",
  price: "$228.00",
  discountPrice: "$182.40",
  emoji: "🧥",
};

// Synthetic identifiers — reused verbatim across all three demo surfaces
// so attribution proof panels look consistent no matter which surface a
// viewer starts from.
const ORDER_ID = "SHF-88213";
const CLICK_ID = "rkt_click_5591a";
const MEMBER_ID = "rkt_test_00219";

const state = {
  view: "home",
  showAttribution: false,
  searchQuery: "",
  scenario: "exclusive-drop", // key into PILLAR3.SCENARIOS (shared/lifecycle-data.js) — see PRD v2 §7.2
};

const page = document.getElementById("page");

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function setView(view) {
  state.view = view;
  render();
}

function render() {
  const renderers = {
    home: renderHome,
    offerDetail: renderOfferDetail,
    redirect: renderRedirect,
    searchEmpty: renderSearchEmpty,
  };

  page.innerHTML = renderers[state.view]();
  attachHandlers();
  window.scrollTo({ top: 0 });
}

/* ---------- Shared icon helpers (inline SVG, currentColor) ---------- */

function searchIconSvg(size) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${size}" height="${size}"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>`;
}

/* ---------- Home view (US-1 entry point) ---------- */

function renderHome() {
  const s = PILLAR3.getScenario(state.scenario);
  return `
    <div class="view">
      ${state.showAttribution ? attributionBannerHtml() : ""}

      <section class="hero-section">
        <div class="lock-badge">🔒 ${s.badgeText}</div>
        <h1>${s.heroHeadline}</h1>
        <p>${s.hook}</p>
        <div class="lifecycle-chip">Arc lifecycle stage (internal): ${PILLAR3.LIFECYCLE_LABELS[s.lifecycleStage]}</div>
        <button class="hero-cta" id="viewAccessBtn">View Access</button>
      </section>

      <div class="section-title">Shop with your Welcome Reward</div>
      <div class="store-grid">
        ${storeTile("Amazon", "#111", "$5 Cash Back", "was $0")}
        ${storeTile("eBay", "#E1291F", "Up to 11%", "was 1%")}
        ${storeTile("Best Buy", "#0A4FA8", "Up to 17.5%", "was 7.5%")}
      </div>

      <div class="home-search-section">
        <p>Looking for something specific?</p>
        <div class="home-search-bar">
          ${searchIconSvg(16)}
          <input class="home-search-input" id="homeSearchInput" type="text" placeholder="Search Rakuten" />
        </div>
      </div>
    </div>
  `;
}

function storeTile(name, color, rate, was) {
  return `
    <div class="store-tile-card">
      <div class="store-tile" style="background:${color}">${name}</div>
      <div class="store-label">${name}</div>
      <div class="store-rate">${rate}</div>
      <div class="store-rate-was">${was}</div>
    </div>
  `;
}

function attributionBannerHtml() {
  return `
    <div class="attribution-panel">
      <h4>📊 Welcome back — Attribution Proof</h4>
      <div class="attribution-grid">
        <div class="attribution-row"><span>Order ID</span><span>${ORDER_ID}</span></div>
        <div class="attribution-row"><span>Originating click ID</span><span>${CLICK_ID}</span></div>
        <div class="attribution-row"><span>Member ID</span><span>${MEMBER_ID}</span></div>
      </div>
      <span class="matched-badge">✓ Matched — Attributed to Rakuten</span>
      <div class="demo-note-banner">This panel is a demo-only visualization so attribution can be seen live, not just claimed.</div>
    </div>
  `;
}

/* ---------- Offer detail view (US-1 continued) ---------- */

function renderOfferDetail() {
  const s = PILLAR3.getScenario(state.scenario);
  return `
    <div class="view offer-detail">
      <div class="product-image-block">${PRODUCT.emoji}</div>
      <div class="offer-info">
        <div class="exclusive-tag">🔒 ${s.badgeText}</div>
        <h2 class="product-title">${PRODUCT.name}</h2>
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
        <button class="full-btn" id="unlockBtn">Unlock This Item</button>
        <button class="secondary-link" id="notNowBtn">Not now</button>
      </div>
    </div>
  `;
}

/* ---------- Redirect view (US-2) — modal overlay, then real cross-page nav ---------- */

function renderRedirect() {
  setTimeout(() => {
    window.location.href = "../pillar-3-merchant-shopify/index.html?src=website&scenario=" + encodeURIComponent(state.scenario);
  }, 1400);

  return `
    <div class="redirect-backdrop">
      <div class="redirect-card">
        <div class="spinner"></div>
        <h3>Redirecting you to your exclusive access checkout...</h3>
        <p>Tracking your access via Rakuten — do not close this window.</p>
        <div class="redirect-trace">
          <div class="ok">✓ Member authenticated (member_id: ${MEMBER_ID})</div>
          <div class="ok">✓ Click logged against member identity</div>
          <div>…resolving gated destination on merchant store <span style="color:#A6862F">[step depends on Impact.com confirmation]</span></div>
        </div>
      </div>
    </div>
  `;
}

/* ---------- Negative case: search shows nothing (US-3) ---------- */

function renderSearchEmpty() {
  const s = PILLAR3.getScenario(state.scenario);
  return `
    <div class="view">
      <div class="empty-state">
        <div class="icon">${searchIconSvg(40)}</div>
        <h3>No results found for "${escapeHtml(state.searchQuery)}"</h3>
        <p>${s.searchEmptyCopy}</p>
        <button class="secondary-link" id="backHomeFromSearch">← Back to Home</button>
      </div>
    </div>
  `;
}

/* ---------- Event wiring (per-view content) ---------- */

function attachHandlers() {
  const on = (id, evt, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(evt, fn);
  };

  // Home
  on("viewAccessBtn", "click", () => setView("offerDetail"));
  on("homeSearchInput", "keydown", (e) => {
    if (e.key === "Enter") {
      state.searchQuery = e.target.value || PRODUCT.name;
      setView("searchEmpty");
    }
  });

  // Offer detail
  on("unlockBtn", "click", () => setView("redirect"));
  on("notNowBtn", "click", () => setView("home"));

  // Search empty
  on("backHomeFromSearch", "click", () => setView("home"));
}

/* ---------- Static top nav wiring (outside view switching) ---------- */

const navSearchInput = document.getElementById("navSearchInput");
if (navSearchInput) {
  navSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      state.searchQuery = e.target.value || PRODUCT.name;
      setView("searchEmpty");
    }
  });
}

const categoryBtn = document.getElementById("categoryBtn");
if (categoryBtn) {
  categoryBtn.addEventListener("click", () => {
    // Decorative only in this demo — matches rakuten.com's category-driven
    // nav pattern but no dropdown menu content is in scope for Pillar 3.
  });
}

/* ---------- Scenario bar (PRD v2 §7.2) — lives outside view switching ---------- */

function renderScenarioBar() {
  const container = document.getElementById("scenarioBar");
  const label = container.querySelector("span");
  container.innerHTML = "";
  container.appendChild(label);
  PILLAR3.SCENARIOS.forEach((s) => {
    const btn = document.createElement("button");
    btn.className = "scenario-btn" + (state.scenario === s.key ? " active" : "");
    btn.textContent = s.navLabel;
    btn.addEventListener("click", () => {
      state.scenario = s.key;
      renderScenarioBar();
      render();
    });
    container.appendChild(btn);
  });
}

/* ---------- Boot: check for ?returned=1 attribution-proof trigger, ?scenario= passthrough ---------- */

(function init() {
  const params = new URLSearchParams(window.location.search);
  state.showAttribution = params.get("returned") === "1";
  const scenarioParam = params.get("scenario");
  if (scenarioParam && PILLAR3.SCENARIOS.some((s) => s.key === scenarioParam)) {
    state.scenario = scenarioParam;
  }
  renderScenarioBar();
  render();
})();
