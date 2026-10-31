import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;
const failures = [];

function read(relative) {
  const path = join(dist, relative);
  if (!existsSync(path)) {
    failures.push(`Missing ${relative}`);
    return "";
  }
  return readFileSync(path, "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function jsonLd(html) {
  const blocks = [];
  const pattern = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  for (const match of html.matchAll(pattern)) {
    blocks.push(JSON.parse(match[1]));
  }
  return blocks;
}

const home = read("index.html");
const work = read("works/floyd-hopper-late-evening/index.html");
const artist = read("artists/floyd-d-hopper/index.html");
const sold = read("sold/index.html");
const about = read("about/index.html");
const sell = read("sell/index.html");
const want = read("want-list/index.html");
const contact = read("contact/index.html");
const worksIndex = read("works/index.html");
const robots = read("robots.txt");

assert(existsSync(join(dist, "sitemap-index.xml")) || existsSync(join(dist, "sitemap.xml")), "sitemap missing");
assert(home.includes("https://weaverfineart.com/"), "home canonical host");
assert(home.includes("ArtGallery"), "home ArtGallery schema");
assert(home.includes("Join the want list"), "home want-list CTA");
assert(home.includes("Offer a work"), "home sell CTA");
assert(home.includes("Every work we own shows its price. Consigned works may be priced on request."), "home price promise");
assert(!home.includes("word Inquire"), "home must not offer Inquire as a price");

const artworkLd = jsonLd(work).find((entry) => entry["@type"] === "VisualArtwork");
assert(artworkLd, "VisualArtwork schema missing");
if (artworkLd) {
  assert(artworkLd.offers && Number(artworkLd.offers.price) === 1500 && artworkLd.offers.priceCurrency === "USD", "Late Evening offer price 1500 USD");
  assert(artworkLd.offers.availability === "https://schema.org/InStock", "available work should be InStock");
  assert(artworkLd.artist.name === "Floyd D. Hopper", "artwork artist");
  assert(artworkLd.width.value === 20, "image width");
  assert(artworkLd.height.value === 29, "image height");
}
assert(work.includes("https://weaverfineart.com/works/floyd-hopper-late-evening/"), "work canonical");
assert(work.includes("name=\"inquiry\""), "inquiry form");
assert(work.includes("data-netlify=\"true\""), "inquiry netlify form");
assert(!work.includes("Photograph to come"), "real photographs, no placeholder caption");
assert(work.includes("$1,500") && !work.includes("$1,200"), "Late Evening shows $1,500");
assert(!work.includes("$600"), "verso $600 notation removed");
assert(work.includes("20 × 29 in"), "image size display");
assert(work.includes("31½ × 39½ in"), "frame size display");

const personLd = jsonLd(artist).find((entry) => entry["@type"] === "Person");
assert(personLd, "Person schema missing");
if (personLd) {
  assert(personLd.birthDate === "1909-11-01", "birth date");
  assert(personLd.deathDate === "1984-07-02", "death date");
}
assert(artist.includes("Herron School of Art"), "Herron training");
assert(artist.includes("1963"), "Art League years");
assert(artist.includes("dean of Indiana watercolorists"), "epithet");
assert(artist.includes("https://weaverfineart.com/artists/floyd-d-hopper/"), "artist canonical");

assert(sell.includes("name=\"sell\""), "sell form name");
assert(sell.includes("photo-front"), "front photo field");
assert(sell.includes("photo-back"), "back photo field");
assert(sell.includes("photo-signature"), "signature photo field");
assert(sell.includes('enctype="multipart/form-data"'), "sell form upload encoding");
assert(want.includes("name=\"want-list\""), "want-list form");
assert(want.includes("subject-preferences"), "subject field");
assert(want.includes("name=\"updates\""), "opt-in");
assert(contact.includes("name=\"contact\""), "contact form");
assert(contact.includes("camelweaver@gmail.com"), "contact email");
assert(about.includes("Aledo"), "about place");
assert(about.includes("Chris Weaver"), "about dealer");
assert(about.includes("by appointment"), "about appointment");
assert(sold.includes("Sold archive"), "sold page");
assert(worksIndex.includes("name=\"price\""), "price filter");
assert(worksIndex.includes("value=\"on-request\""), "price on request filter option");
assert(robots.includes("https://weaverfineart.com/sitemap-index.xml"), "robots sitemap");

const htmlFiles = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path);
    else if (path.endsWith(".html")) htmlFiles.push(path);
  }
}
walk(dist);
const banned = /\b(airline|pilot|flying|aircraft|aviation)\b/i;
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  assert(!banned.test(html), `banned wording in ${file}`);
  assert(!html.includes("TODO"), `TODO leaked into ${file}`);
  assert(!html.includes("$1,200"), `stale $1,200 price in ${file}`);
}

if (failures.length > 0) {
  console.error(failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Verified ${htmlFiles.length} HTML files.`);
