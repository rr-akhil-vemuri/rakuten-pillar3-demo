# Product Image Sources

All images are real product/studio photography sourced from Wikimedia Commons
under open licenses (CC0 / CC BY / CC BY-SA), then cropped to remove visible
brand logos/tags so they read as generic stock product photography for this
POC's synthetic catalog. Cropping is the only edit made — no colors, retouching,
or compositing.

| File | Product | Source | License | Crop notes |
|---|---|---|---|---|
| `aurora-trail-jacket.jpg` | Aurora Trail Jacket | [Adidas Helionic Down Jacket](https://commons.wikimedia.org/wiki/File:Adidas_Helionic_Down_Jacket.jpg) by Latecki | CC BY-SA 4.0 | Cropped to lower torso/zipper detail, well below the adidas logo |
| `summit-ridge-backpack.jpg` | Summit Ridge 32L Backpack | [02-QWSTION-ZIP-PACK-LIMESTONE-FRONT.jpg](https://commons.wikimedia.org/wiki/File:02-QWSTION-ZIP-PACK-LIMESTONE-FRONT.jpg) by QWSTION | CC BY-SA 4.0 | Cropped tighter to bag body; no visible brand mark in original |
| `alpine-wool-beanie.jpg` | Alpine Wool Beanie | [Blue knit fleece hat.jpg](https://commons.wikimedia.org/wiki/File:Blue_knit_fleece_hat.jpg) | Public domain | Cropped to hat only, wood-table background kept |
| `alpine-wool-scarf.jpg` | (available for a scarf SKU if added) | [100% Kaschmir Wolle vonk kaschmirprodukte.de.jpg](https://commons.wikimedia.org/wiki/File:100%25_Kaschmir_Wolle_vonk_kaschmirprodukte.de.jpg) | CC BY-SA 4.0 | Used as-is, no crop needed |
| `traverse-hiking-boots.jpg` | Traverse Hiking Boots | [Alt-Berg Defenders 8528.jpg](https://commons.wikimedia.org/wiki/File:Alt-Berg_Defenders_8528.jpg) by Ashley Pomeroy | CC BY-SA 4.0 | Cropped to toe box/laces, excludes the "ALT-BERG ENGLAND" tongue tag |
| `shadow-seamless-tshirt.jpg` | Shadow Seamless T Shirt (real Gymshark PDP product) | Gymshark product page screenshot, provided directly | Real product photo, presenter-supplied | Wishlist heart icon and "NEW" badge (site UI chrome baked into the screenshot) removed via inpainting so it reads as a clean studio product shot |

## Rejected candidates (for reference, not used)

- Ralph Lauren beanie, Eastpak backpack, Alt-Berg boots (full frame) — visible brand marks not croppable without losing the product
- Various bomber/puffer jackets — broken transparency, or worn in a lifestyle/outdoor scene rather than a clean product shot
- Deuter backpack — visible brand logo across the main panel
- Watch (Aquadive Quadiver) — brand name printed directly on the dial face, not croppable
- Water bottle (Esbit) — visible logo band; alternative crop lost all product character

## Adding more products

Search [Wikimedia Commons](https://commons.wikimedia.org) categories (e.g. `Category:Backpacks`,
`Category:Hiking_boots`) or use the API:
`https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:X&cmtype=file&format=json`
Always send a `User-Agent` header (Wikimedia blocks anonymous default-UA requests) and check
`extmetadata.LicenseShortName` before use. Prefer white/plain-background studio shots; crop out
any visible brand name, logo, or tag before adding to this folder.
