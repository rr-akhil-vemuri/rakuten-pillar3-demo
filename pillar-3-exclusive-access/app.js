/*
 * Pillar 3 demo prototype — click-through only, no backend.
 * State machine: `state.screen` drives which render function runs.
 * Real product: Gymshark's Shadow Seamless T Shirt — matches the sibling
 * merchant-storefront surface (../pillar-3-merchant-shopify/), which gates
 * the same real product behind the same real Gymshark screenshots. Once a
 * member taps "Unlock This Item" here, the journey exits this surface via a
 * real navigation (see attachHandlers()'s unlockBtn wiring) rather than a
 * simulated in-app checkout — there is no gating-mechanism variant to choose
 * on THIS surface anymore, since checkout now lives entirely on the merchant
 * surface.
 */

const PRODUCT = {
  name: "Shadow Seamless T Shirt",
  price: "$44.00",
  image: "../images/products/shadow-seamless-tshirt.jpg",
};

const state = {
  screen: "rewards",
  scenario: "exclusive-drop", // key into PILLAR3.SCENARIOS (shared/lifecycle-data.js) — see PRD v2 §7.2
  searchQuery: "",
};

const viewport = document.getElementById("screenViewport");
const bottomNav = document.getElementById("bottomNav");
const statusBar = document.getElementById("statusBar");

// Screens that render a real screenshot with its own baked-in status bar +
// bottom nav (as opposed to the hand-coded .statusbar/.bottom-nav used by
// every other screen, which has no real screenshot to draw from).
const SCREENSHOT_SCREENS = ["home", "explore", "rewards"];

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
    // renderScenarioToggle()'s active-class toggle lives outside viewport,
    // so render() alone won't reflect a scenario change that Back/Forward
    // just restored — refresh that chrome too.
    renderScenarioToggle();
    render();
  }
});

function setScreen(screen) {
  commitState({ screen });
}

function render() {
  const renderers = {
    home: renderHome,
    explore: renderExplore,
    rewards: renderRewards,
    instore: renderPlaceholder,
    account: renderPlaceholder,
    offerDetail: renderOfferDetail,
    searchEmpty: renderSearchEmpty,
  };

  viewport.innerHTML = renderers[state.screen]();
  updateChrome();
  attachHandlers();
  viewport.scrollTop = 0;
}

function updateChrome() {
  const isScreenshot = SCREENSHOT_SCREENS.includes(state.screen);
  statusBar.style.display = isScreenshot ? "none" : "";
  bottomNav.style.display = isScreenshot ? "none" : "";
  if (!isScreenshot) {
    const tabScreens = ["home", "explore", "rewards", "instore", "account"];
    const activeTab = tabScreens.includes(state.screen) ? state.screen : null;
    bottomNav.querySelectorAll(".nav-item").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.screen === activeTab);
    });
  }
}

/* ---------- Screen 1: Home — real Rakuten app screenshot ----------
 * Out of scope per direction from the person running this project ("we dont
 * care for the home page"): shown full-bleed for realism/context only. The
 * screenshot's own baked-in status bar + bottom nav replace the hand-coded
 * .statusbar/.bottom-nav (hidden for this screen — see updateChromeVisibility).
 * Only interactive surface here is the 5 nav hotspots overlaid on the real
 * nav bar pixels. */

function renderHome() {
  return `
    <div class="screen shot-screen">
      <div class="shot-wrap">
        <img src="../design/assets/rakuten-app-home.png" alt="Rakuten app — Home tab" class="shot-img" />
        ${navHotspots(NAV_TOP_PCT_STANDARD, NAV_HEIGHT_PCT_STANDARD)}
      </div>
    </div>
  `;
}

/* ---------- Explore tab — real Rakuten app screenshot (same treatment as Home) ---------- */

function renderExplore() {
  return `
    <div class="screen shot-screen">
      <div class="shot-wrap">
        <img src="../design/assets/rakuten-app-explore.png" alt="Rakuten app — Explore tab" class="shot-img" />
        ${navHotspots(NAV_TOP_PCT_STANDARD, NAV_HEIGHT_PCT_STANDARD)}
      </div>
    </div>
  `;
}

/* ---------- Rewards tab — real Rakuten app screenshot, composited ----------
 * The image itself (rakuten-app-rewards-composited.png) is the real Rewards
 * screenshot with ONE new card composited in via Pillow (see design/assets/
 * — built from rakuten-app-rewards.png), positioned between the
 * Active/Earned/Expired pills and the Amazon Offer card. Only the card's
 * background/badge-shape/border are baked into the image pixels — its
 * title+description text was deliberately left blank (cleared out of a
 * once-static composite) so the actual copy can be rendered as real HTML
 * text on top, driven by REWARDS_CARD_COPY[state.scenario] below. That's
 * what lets this card's copy change per scenario, matching the same
 * PILLAR3.getScenario(state.scenario)-driven pattern renderOfferDetail()
 * already uses — a static baked-in-pixels card couldn't vary at all.
 *
 * This is the quid-pro-quo tile: Rakuten surfaces Gymshark's exclusive
 * product on the high-traffic Rewards tab (value to the merchant: an
 * acquisition/visibility channel) in exchange for exclusive member pricing
 * (value to the member, and to Rakuten as the platform that unlocked it).
 * Tapping its hotspot reuses the SAME transition the Home hero card's old
 * "View Access" button used to trigger (setScreen("offerDetail")) — wired
 * in attachHandlers(), not duplicated here. */

// Per-scenario Rewards-card copy. Mirrors the tone of each scenario's
// PILLAR3.SCENARIOS badgeText/hook (shared/lifecycle-data.js) without
// literally reusing those strings — the shared file's hook text names the
// merchant via PILLAR3.MERCHANT_NAME, which is a shared constant this
// surface doesn't own (see the sibling merchant-storefront surface, which
// may be mid-rebrand) — so this card's own real-brand-name copy is defined
// locally here instead.
const REWARDS_CARD_COPY = {
  "exclusive-drop": {
    title: "Gymshark — Member Exclusive",
    desc: "You're eligible for an exclusive item from this partner this month — unlock it below.",
  },
  "early-access-window": {
    title: "Gymshark — Early Access",
    desc: "You've unlocked early access to this item as a Rakuten member — shop before anyone else.",
  },
  "lapsed-reengagement": {
    title: "Gymshark — We've Held Your Spot",
    desc: "Exclusive access to this item expires in 24 hours — unlock it below.",
  },
  "prospect-unlock": {
    title: "Gymshark — Unlock Member Pricing",
    desc: "Join Rakuten free to unlock your exclusive price on this item.",
  },
};

function renderRewards() {
  const copy = REWARDS_CARD_COPY[state.scenario] || REWARDS_CARD_COPY["exclusive-drop"];
  return `
    <div class="screen shot-screen">
      <div class="shot-wrap">
        <img src="../design/assets/rakuten-app-rewards-composited.png" alt="Rakuten app — Rewards tab, with Gymshark member-exclusive card" class="shot-img" />
        <div class="rewards-card-overlay">
          <p class="rc-title">${copy.title}</p>
          <p class="rc-desc">${copy.desc}</p>
        </div>
        <button class="hotspot merchant-hotspot" id="merchantRewardTile"
          style="left:4.897%; top:30.423%; width:90.098%; height:10.607%;"
          aria-label="${copy.title}"></button>
        ${navHotspots(NAV_TOP_PCT_REWARDS, NAV_HEIGHT_PCT_REWARDS)}
      </div>
    </div>
  `;
}

/* ---------- Shared: invisible nav hotspots overlaid on each screenshot's own
 * baked-in bottom nav bar. Percentage-based so they scale with the image at
 * any display width. x-bounds are identical across all three screenshots
 * (same 919px-wide source, same nav layout); y-bounds differ because the
 * composited Rewards image is taller than Home/Explore (extra card height),
 * which shifts its nav bar down — hence two top/height constants below. ---------- */

const NAV_TOP_PCT_STANDARD = 89.890;   // Home/Explore: nav top=1796px of 1998px native height
const NAV_HEIGHT_PCT_STANDARD = 10.110; // 202px of 1998px

const NAV_TOP_PCT_REWARDS = 91.183;    // Rewards (composited): nav top=2089px of 2291px native height
const NAV_HEIGHT_PCT_REWARDS = 8.817;  // 202px of 2291px

function navHotspots(topPct, heightPct) {
  const items = [
    { screen: "home", left: 0, width: 20.022 },
    { screen: "explore", left: 20.022, width: 20.022 },
    { screen: "rewards", left: 40.044, width: 20.022 },
    { screen: "instore", left: 60.065, width: 20.022 },
    { screen: "account", left: 80.087, width: 19.913 },
  ];
  return items
    .map(
      (it) => `
    <button class="hotspot nav-hotspot" data-screen="${it.screen}"
      style="left:${it.left}%; top:${topPct}%; width:${it.width}%; height:${heightPct}%;"
      aria-label="${it.screen}"></button>
  `
    )
    .join("");
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

/* ---------- Screen 2: Offer detail (US-1) ----------
 * Real product (Gymshark's Shadow Seamless T Shirt, $44.00) — see PRODUCT at
 * top of file. Per-scenario badge/countdown/cashback copy still comes from
 * PILLAR3.getScenario(state.scenario) exactly as before; only the product
 * being shown changed, not the scenario-data wiring. "Unlock This Item" now
 * performs a real cross-surface navigation instead of entering a simulated
 * in-app checkout — see attachHandlers()'s unlockBtn wiring. */

function renderOfferDetail() {
  const s = PILLAR3.getScenario(state.scenario);
  return `
    <div class="screen">
      <div class="back-row" id="backToHome">← Back</div>
      <div class="product-image"><img src="${PRODUCT.image}" alt="${PRODUCT.name}" class="product-photo" /></div>
      <div class="exclusive-tag">${s.badgeText}</div>
      <div class="product-title">${PRODUCT.name}</div>
      <div class="product-price">${PRODUCT.price}</div>
      <div class="countdown-row">
        <div class="countdown-box${state.scenario === "lapsed-reengagement" ? " urgent" : ""}">
          <div class="countdown-label">${s.countdownLabel}</div>
          <div class="countdown-value">${s.countdownValue}</div>
        </div>
        <div class="countdown-box">
          <div class="countdown-label">Cashback rate</div>
          <div class="countdown-value">${s.cashbackRate}</div>
        </div>
      </div>
      <button class="full-btn dark" id="unlockBtn">Unlock This Item</button>
      <div class="secondary-link" id="backToHome2">Not now</div>
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

  // Rewards screenshot — merchant quid-pro-quo hotspot reuses the exact same
  // transition the old Home hero card's "View Access" button used to trigger.
  on("merchantRewardTile", "click", () => setScreen("offerDetail"));

  // Nav hotspots overlaid on the real screenshots' baked-in bottom nav
  // (Home/Explore/Rewards screens only — see navHotspots()).
  viewport.querySelectorAll(".nav-hotspot").forEach((btn) => {
    btn.addEventListener("click", () => setScreen(btn.dataset.screen));
  });

  on("exploreSearch2", "keydown", (e) => {
    if (e.key === "Enter") {
      commitState({ searchQuery: e.target.value });
    }
  });
  on("backToExplore", "click", () => setScreen("explore"));

  // Offer detail
  on("backToHome", "click", () => setScreen("rewards"));
  on("backToHome2", "click", () => setScreen("rewards"));

  // "Unlock This Item" — real cross-surface navigation to the merchant demo
  // surface's gated-product view, exactly like a real Rakuten-issued link
  // would work. No fake "redirecting…" interstitial, no simulated in-app
  // checkout on this surface anymore — the merchant surface's own boot()
  // (../pillar-3-merchant-shopify/app.js) reads ?src=website to jump
  // straight into renderGatedProduct(), and ?scenario= to carry the current
  // scenario across surfaces, matching the param names that surface's boot()
  // already checks for.
  on("unlockBtn", "click", () => {
    window.location.href =
      "../pillar-3-merchant-shopify/index.html?src=website&scenario=" + encodeURIComponent(state.scenario);
  });

  // Hand-coded bottom nav (.bottom-nav) — only visible/relevant for screens
  // with no real screenshot (offerDetail, searchEmpty, instore/account
  // placeholder). See updateChrome().
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
  commitState({ scenario: key });
  renderScenarioToggle();
}

/* ---------- Reset (outside phone rig) ---------- */

document.getElementById("resetBtn").addEventListener("click", () => {
  commitState({ screen: "rewards", searchQuery: "" });
});

/* ---------- Boot: honor ?clean=1 for screenshot-accurate captures, and
 * ?scenario= so a link can land directly on a given scenario ----------
 * The merchant surface's "Return to Rakuten" button (../pillar-3-merchant-shopify/app.js)
 * already sends the member back here with ?scenario=<key> attached so the
 * lifecycle scenario carries across surfaces in both directions — this reads
 * it back in. Also handy for direct-linking a screenshot check to one
 * scenario without clicking through the toggle by hand. */

(function boot() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("clean") === "1") {
    document.body.classList.add("clean-shot");
  }
  const scenarioParam = params.get("scenario");
  if (scenarioParam && PILLAR3.SCENARIOS.some((s) => s.key === scenarioParam)) {
    state.scenario = scenarioParam;
  }
  history.replaceState({ snapshot: { ...state } }, "", location.href);
  renderScenarioToggle();
  render();
})();
