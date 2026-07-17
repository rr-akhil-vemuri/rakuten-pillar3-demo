/*
 * Shared product catalog for the merchant Shopify site (and the mobile app
 * surface's default product). Include via
 * <script src="../shared/products.js"></script> BEFORE app.js (and before
 * lifecycle-data.js is fine either order).
 *
 * As of this pass there is exactly ONE product: Gymshark's real "Shadow
 * Seamless T Shirt" ($44), the actual product baked into the real Gymshark
 * PDP/checkout/confirmation screenshots this demo overlays on top of. It is
 * the single exclusive SKU across all 4 PRD scenarios. This used to be a
 * 4-SKU catalog of fictional Northfield Outfitters products (Aurora Trail
 * Jacket + 3 others) shown as placeholder tiles; those are gone per direction
 * confirmed with the project owner — only the real Gymshark product should
 * ever appear on this surface, matching what a real shopper would actually
 * see on gymshark.com. id was cleanly renamed from "aurora-trail-jacket" to
 * "shadow-seamless-tshirt" since this is now a real product, not a fictional
 * placeholder.
 */

window.PILLAR3 = window.PILLAR3 || {};

PILLAR3.PRODUCTS = [
  {
    id: "shadow-seamless-tshirt",
    name: "Shadow Seamless T Shirt",
    price: "$44.00",
    image: "../images/products/shadow-seamless-tshirt.jpg",
    blurb: "Seamless-knit performance tee built for lifting, muscle fit.",
  },
];

PILLAR3.DEFAULT_PRODUCT_ID = "shadow-seamless-tshirt";

PILLAR3.getProduct = function (id) {
  return PILLAR3.PRODUCTS.find(function (p) { return p.id === id; }) || PILLAR3.PRODUCTS[0];
};
