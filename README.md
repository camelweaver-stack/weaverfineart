# Weaver Fine Art

The website for Weaver Fine Art, the gallery in Aledo, Texas. It is a set of ordinary files. There is no store login and no monthly website fee built into the pages. When the files change, Netlify publishes a new copy of the site.

The public address of the site is [https://weaverfineart.com](https://weaverfineart.com).

## Add a photograph of a work

A new listing may start with a stand-in card that says “Photograph to come.” That card is not a picture of the work. Replace it before the work is shown to collectors. (*Late Evening* now has real photographs.)

1. Photograph the work straight on. Include the whole sheet. A second photo of the signature, and one of the back, are worth having.
2. Save the pictures as JPG or PNG. A long side of about 2,000 to 3,000 pixels is enough. The site makes the smaller copies that phones and laptops actually download. A very small snapshot will look soft, and a bigger file is fine.
3. If the photo came from an iPhone and will not upload, export it as a JPG. The site does not accept HEIC files in the sell form, and a JPG is the simplest file to put in a listing too.
4. Put the file in the folder `src/content/works/`, next to the artwork’s text file. Use lowercase letters and hyphens in the file name, for example `late-evening.jpg`.
5. Open the artwork’s text file (for this painting, `src/content/works/floyd-hopper-late-evening.md`). Find the `images:` section and change it to point at the new file:

```yaml
images:
  - file: ./late-evening.jpg
    alt: Late Evening, a watercolor by Floyd D. Hopper, signed lower right, in a simple frame.
    caption: Signed lower right.
    placeholder: false
```

6. Rewrite `alt` so it describes the real photograph: artist, title, and what a person can see (a signature, a frame, a detail). Do not leave the sentence about “Photograph to come.”
7. Set `placeholder` to `false`. That removes the “Photograph to come” line.
8. You can list more than one picture. The first one is the picture on the card and at the top of the page. A detail and a verso photo can follow, each with its own `file`, `alt`, and `caption`.
9. Delete `late-evening-placeholder.jpg` after nothing points at it.
10. Publish the change the same way you publish any other edit (see below). Refresh the work’s page and confirm the real photograph is there.

## Add an artwork

Each work is one text file in `src/content/works/`. The file name becomes the web address. `floyd-hopper-late-evening.md` is published at:

`https://weaverfineart.com/works/floyd-hopper-late-evening/`

Copy `floyd-hopper-late-evening.md`, rename the copy, and change the fields. Use lowercase letters and hyphens. Do not rename a file after the page has been public. The old address would break. If you must rename one, ask for a redirect from the old address to the new one.

The artist must already have a file in `src/content/artists/`. The artwork’s `artistSlug` is that file’s name without `.md`. For Floyd D. Hopper the slug is `floyd-d-hopper`.

### Fields

| Field | What to type |
| --- | --- |
| `title` | The name of the work, as it should read on the page. |
| `artist` | The artist’s name, spelled the way it should read on the page. |
| `artistSlug` | The artist file name without `.md`. |
| `year` | The year of the work, digits only. Leave this line out if you do not know. Do not guess. |
| `medium` | For example `Watercolor` or `Oil on canvas`. |
| `region` | Exactly one of: `Indiana`, `Texas`, `Midwest`, `Other`. |
| `imageWidthIn` | Width of the image itself, in inches. `20.5` means 20½. |
| `imageHeightIn` | Height of the image, in inches. |
| `frameWidthIn` | Width of the frame, in inches. Leave both frame lines out if it is unframed. |
| `frameHeightIn` | Height of the frame, in inches. |
| `condition` | What you have actually seen. Separate the sheet from the frame if they differ. |
| `signature` | Where it is signed, for example `Signed lower right.` |
| `verso` | Inscriptions or labels on the back. Leave the line out if there is nothing to say. |
| `provenance` | Previous owners and exhibitions you can support. If you do not know, write that earlier ownership has not yet been recorded. Do not invent an owner. |
| `price` | A plain number, such as `2400`. Do not type a dollar sign. Every available or on-hold work the gallery owns must have a number; the site shows it as a dollar price. A consigned work may use `Inquire`; it is labeled “Price on request” with a link to the inquiry form. A sold work may use `Inquire`, labeled “Price not published.” |
| `ownership` | `owned` (the default) or `consigned`. Works we own must show a price. Consigned works (we have access but do not own) may be priced on request. |
| `status` | Exactly one of: `available`, `hold`, `sold`. |
| `soldOn` | For a sold work, the day it sold, as `YYYY-MM-DD`. Leave it out if you do not want a date on the page. |
| `prominence` | Required. A whole number giving the work's place in the order of prominence: `1` is listed first. Every list of works on the site (available works, home page, artist pages) is sorted by this number. When you add a work, give it the next number, or renumber the others to slot it in. The sold archive is sorted by date instead. Current order: 1 *Late Evening* (Hopper), 2 *Shepherd Market, Mayfair* (Smith), 3 *The Wharf* (Byers), 4 *Italian Street Scene* (Balletti). |
| `featured` | `true` or `false`. One featured available work is shown large on the home page. Do not feature a sold work. |
| `dateAdded` | The day you listed it, as `YYYY-MM-DD`. Newer listings are shown first. |
| `draft` | `true` hides the work from the site. Leave the line out, or set `false`, when it should be public. |
| `images` | One or more pictures. See the photograph steps above. |

Anything you type below the `---` line is optional catalog text. Most works do not need it. The structured fields already print the size, condition, and provenance.

A price written on the back of a picture is not the asking price. Record it under `verso`. Set `price` to the figure you are actually asking.

### Mark a work sold

The page address stays the same, which is what you want. People and search engines who already know the link still land on the record.

1. Open the artwork file.
2. Change `status: available` to `status: sold`.
3. Set `featured: false` if it was featured.
4. Add `soldOn: 2026-11-15` if you want the sale date on the page. Use the real date.
5. Leave `price` as a number if you want the sold price public. Change it to `Inquire` if you do not. A sold work with `Inquire` is labeled “Price not published.”

The work leaves the available list and appears in the sold archive. It is not deleted.

### Put a work on hold

Set `status: hold`. It stays on the available list with an “On hold” label. The page explains that someone can ask to be contacted if it becomes free.

## Add an artist

Each artist is one text file in `src/content/artists/`. `floyd-d-hopper.md` is published at:

`https://weaverfineart.com/artists/floyd-d-hopper/`

Copy that file and rename the copy. Then change the fields.

| Field | What to type |
| --- | --- |
| `name` | The name as it should read on the page. |
| `sortName` | Last name first, for the A–Z index. Example: `Hopper, Floyd D.` |
| `lifeDates` | As it should read, for example `1909–1984`. The character between the years is an en dash. |
| `birthDate` | `YYYY-MM-DD` if you know the day. Leave the line out if you do not. |
| `deathDate` | `YYYY-MM-DD` if you know the day. Leave the line out if the artist is living, or if you do not know. |
| `birthPlace` | A place you can source, or leave the line out. |
| `region` | Exactly one of: `Indiana`, `Texas`, `Midwest`, `Other`. |
| `epithet` | A short phrase such as `Dean of Indiana watercolorists`, or leave the line out. |
| `summary` | One or two sentences. This is the line on the artist index. |
| `sources` | The books or pages you actually used. Include the title and the `url`. |
| `draft` | `true` hides the artist. An artwork cannot point at a draft artist. |

Below the second `---` line, write the biography in normal paragraphs. Blank line between paragraphs.

Keep the biography to facts you can point to. If you are not sure of a date, do not print it as settled. Put a note to yourself at the top of the file, above the fields, as a line that starts with `#`. Those lines stay in the file and do not appear on the website. The Hopper file has several of these notes. That is the place for a TODO.

Do not paste a whole article from another site. Name the source in `sources` and write a short account in your own words.

The artist page automatically lists that artist’s available works and sold works. You do not paste the paintings into the biography.

## Forms

Four forms send mail through Netlify:

- Contact
- Inquiry, on each available or held work
- Sell or consign, including front, back, and signature photos
- Want list

They only start working after the site is connected to Netlify and form detection is on. In the Netlify site settings, open Forms and turn on an email notification to `camelweaver@gmail.com` for each form. The address is also the public contact address, in `src/lib/site.ts`. If the address changes, change it there. That one file updates the pages. The notification itself is set in Netlify, not in the files.

A want-list signup is stored with the other form submissions. It is not yet a separate mailing program. The checkbox on the form is optional. Leave people off the “write me when something fits” list unless they tick it.

The sell form can hold about 8 megabytes in total. Ask for smaller JPGs if a submission fails.

## Publish

The site is built by the command `npm run build`. Netlify is already told to do that. The settings are in `netlify.toml`. The finished pages come out in a folder called `dist`. You do not edit `dist`. You edit the files under `src`, then publish.

If someone else deploys it for you: they push the files to the git repository that Netlify watches. Netlify builds and updates the site. You do not need a Netlify account on your own computer for that.

To look at the site on your own computer you need Node.js 22. In this folder, run:

```bash
npm install
npm run dev
```

Then open `http://localhost:4321`. Stop it with Control-C.

`npm run build` checks that the pages can be generated. If a region, a status, or an artist slug is misspelled, the build stops and names the file. The usual cause is a word that is not one of the allowed values in the tables above.

## What the pages are

- Home, with the gallery’s focus, a featured work, a want-list link, and a sell or consign link
- Available works, with filters for artist, region, medium, price, and size
- A page for every work
- Sold archive, the same records with status `sold`
- An artist index and a page for each artist
- Sell or consign
- Want list
- About the gallery
- Contact

Filters only narrow the list while someone is looking at it. Every work still has its own page. Search engines use that page.

Size filters use the longer side of the image, not the frame: under 16 inches, 16 to 30 inches, or over 30 inches. Price filters use the number you typed. On the sold archive, “Price not published” is its own choice.

## About the gallery page

The About page is the business: Aledo, Texas, by appointment, and the art the gallery handles. Do not add a personal employment history there.

## Addresses

Pages use a trailing slash, for example `/artists/floyd-d-hopper/`. The canonical host is `https://weaverfineart.com`. A visit to `www.weaverfineart.com` is sent to that host.

Search fields (the title and the short description in the browser and on social posts) are written by the templates from the artwork and artist files. You do not fill in a separate SEO form. The sitemap and `robots.txt` are produced with the build.
