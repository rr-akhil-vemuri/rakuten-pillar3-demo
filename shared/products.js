/*
 * Shared multi-product catalog for the "Rakuten Exclusive" collection on the
 * merchant Shopify site, and for keeping the mobile/website surfaces' default
 * product consistent. Include via <script src="../shared/products.js"></script>
 * BEFORE app.js (and before lifecycle-data.js is fine either order).
 *
 * PILLAR3.DEFAULT_PRODUCT_ID stays "aurora-trail-jacket" — every existing demo
 * surface, screenshot, and the PDF walkthrough already references that SKU by
 * name/price, so it remains the product used when arriving via the Rakuten
 * redirect (?src=website). The others exist so the merchant site's "Rakuten
 * Exclusive" collection has more than one item to browse.
 */

window.PILLAR3 = window.PILLAR3 || {};

PILLAR3.PRODUCTS = [
  {
    id: "aurora-trail-jacket",
    name: "Aurora Trail Jacket",
    price: "$228.00",
    discountPrice: "$182.40",
    emoji: "🧥",
    blurb: "Weatherproof 3-layer shell built for alpine trail conditions.",
  },
  {
    id: "summit-ridge-backpack",
    name: "Summit Ridge 32L Backpack",
    price: "$164.00",
    discountPrice: "$131.20",
    emoji: "🎒",
    blurb: "Multi-day pack with a ventilated back panel and rain cover.",
  },
  {
    id: "alpine-wool-beanie",
    name: "Alpine Wool Beanie",
    price: "$38.00",
    discountPrice: "$30.40",
    emoji: "🧶",
    blurb: "Merino-blend knit, brushed lining, one size.",
  },
  {
    id: "traverse-hiking-boots",
    name: "Traverse Hiking Boots",
    price: "$196.00",
    discountPrice: "$156.80",
    emoji: "🥾",
    blurb: "Waterproof leather upper with a Vibram outsole.",
  },
];

PILLAR3.DEFAULT_PRODUCT_ID = "aurora-trail-jacket";

PILLAR3.getProduct = function (id) {
  return PILLAR3.PRODUCTS.find(function (p) { return p.id === id; }) || PILLAR3.PRODUCTS[0];
};
