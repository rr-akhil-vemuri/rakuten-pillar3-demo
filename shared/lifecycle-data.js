/*
 * Shared across all Pillar 3 demo surfaces (mobile app, website, merchant Shopify).
 * Sourced from PRD_Exclusive_Early_Access_v2.html sections 2.1, 3.1, 3.2, 7.2, Appendix B.1.
 * Include via <script src="../shared/lifecycle-data.js"></script> BEFORE app.js.
 *
 * Rather than exposing "access mode" and "lifecycle stage" as independent toggles
 * (which permits combinations the PRD never actually describes), SCENARIOS bundles
 * them into the PRD's own three named demo scenarios (section 7.2) so the demo
 * only ever shows combinations grounded in the source doc.
 */

window.PILLAR3 = window.PILLAR3 || {};

PILLAR3.MERCHANT_NAME = "Northfield Outfitters";

PILLAR3.SCENARIOS = [
  {
    key: "exclusive-drop",
    navLabel: "Scenario 1 — Exclusive Drop",
    accessMode: "exclusive",
    lifecycleStage: "active",
    badgeText: "EXCLUSIVE ACCESS",
    heroHeadline: "Members-Only Access",
    hook: "You have first access — before other Rakuten members.",
    countdownLabel: "Spots remaining",
    countdownValue: "47 / 200",
    cashbackRate: "8%",
    searchEmptyCopy: "This item isn't listed in our catalog or search — some products are only available through special access links, and this one is member-only, permanently.",
  },
  {
    key: "early-access-window",
    navLabel: "Scenario 2 — Early Access Window",
    accessMode: "early",
    lifecycleStage: "acquired",
    badgeText: "EARLY ACCESS",
    heroHeadline: "Early Access — Fall Collection Preview",
    hook: "You've unlocked early access as a new Rakuten member — shop before anyone else.",
    countdownLabel: "Goes public in",
    countdownValue: "47:00:00",
    cashbackRate: "6%",
    searchEmptyCopy: "This item isn't listed in our catalog or search yet — it goes public on our regular storefront once the early access window closes.",
  },
  {
    key: "lapsed-reengagement",
    navLabel: "Scenario 3 — Lapsed Re-engagement",
    accessMode: "exclusive",
    lifecycleStage: "churned",
    badgeText: "WE'VE HELD YOUR SPOT",
    heroHeadline: "Welcome Back — Exclusive Offer",
    hook: "We've held a spot for you. Exclusive access to " + PILLAR3.MERCHANT_NAME + " expires in 24 hours.",
    countdownLabel: "Spot expires in",
    countdownValue: "24:00:00",
    cashbackRate: "10%",
    searchEmptyCopy: "This item isn't listed in our catalog or search — some products are only available through special access links.",
  },
];

PILLAR3.LIFECYCLE_LABELS = {
  acquired: "Acquired",
  engaged: "Engaged",
  active: "Active",
  churned: "Churned",
};

PILLAR3.getScenario = function (key) {
  return PILLAR3.SCENARIOS.find(function (s) { return s.key === key; }) || PILLAR3.SCENARIOS[0];
};
