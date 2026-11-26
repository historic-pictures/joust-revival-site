# Joust Revival website

The marketing site for Joust Revival (the game was called TILT until 26 Nov 2026): plain HTML, CSS and a little JavaScript. No framework, no build step, no third-party scripts.

## What is here

| Path | What |
|---|---|
| `index.html` | Home: hero with gameplay video, numbers, six feature tiles, "frame by frame" spotlights, the field (knight rating cards), venues and screenshots, the history, roadmap summary, devlog teaser, call to action |
| `roadmap.html` | Full roadmap: Now / Next / Later / PC version. **Stable URL**: the game links to it |
| `about.html` | Our mission: mission, vision, why support now, what we believe, who is making it. **Draft: owner to review**, with a TODO for the founder bio and photo. **Stable URL**: the game's unlock popup links to `about.html#mission`; keep the file name and the `mission` anchor (other anchors: `#vision`, `#support`, `#beliefs`, `#team`) |
| `devlog/index.html`, `devlog/muybridge-gallop.html` | Devlog index and the first post |
| `devlog/_template.html` | Template for new posts (noindex; instructions inside) |
| `support.html` | The game is free: follow and community links; donate button hidden until `donateUrl` is set |
| `press.html` | Press kit: fact sheet, description, logo, screenshots, clips |
| `privacy.html`, `terms.html` | **Drafts**, marked as such and `noindex`; must be checked before payments, a newsletter or analytics go live |
| `404.html` | Not-found page (uses a `<base>` tag with the site URL so it works at any depth) |
| `assets/js/config.js` | **Every configurable link**: game URL, Steam wishlist, donate, newsletter endpoint, socials, contact e-mail |
| `assets/css/site.css`, `assets/js/site.js` | Styles and small enhancements (menu, configurable links, newsletter post, lazy video) |
| `assets/img/`, `assets/media/` | Screenshots (WebP, 800 and 1600 px), MP4 loops and their posters |
| `assets/fonts/` | Grenze Gotisch and EB Garamond (SIL OFL 1.1, licences beside them) |
| `assets/brand/emblem.png` | **The emblem (placeholder)**: the knight-in-blue roundel with the lance breaking out of the rim, cut out from `shots/genart/logos/logo_final_sparks.png`. Swap it and run `tools/make_brand.py` |
| `assets/brand/emblem-*.png` | Emblem sizes used by the header and the press kit (generated) |
| `assets/press/` | Logo PNGs (light and dark, transparent) and app icons (generated) |
| `tools/make_brand.py` | Rebuilds every brand file from `assets/brand/emblem.png`: emblem sizes, `favicon.ico`, `apple-touch-icon.png`, manifest icons, press logos, both 1200x630 share images. Not served to visitors |
| `sitemap.xml`, `robots.txt`, `site.webmanifest`, `favicon.*`, `apple-touch-icon.png`, `.nojekyll` | SEO and icons |

## Before going live

1. **Site URL.** The canonical, Open Graph and Twitter tags, `sitemap.xml`, `robots.txt` and `404.html` assume
   `https://historic-pictures.github.io/joust-revival-site/` (a suggestion, see below). If you deploy anywhere else, replace that string in every file
   (one search and replace across the folder).
2. **Links.** Fill in `assets/js/config.js`: `wishlistUrl` (once the Steam page exists), `donateUrl` (e.g. Ko-fi),
   `social.*`, `contactEmail`. Anything left empty shows as "coming" and does nothing.
3. **Newsletter.** Set `newsletter.endpoint` to a form-POST endpoint (Buttondown, Kit, Mailchimp form action, Formspree, or
   your own Worker) and `newsletter.field` to the e-mail field name it expects. Until then the form says sign-ups open soon and
   sends nothing.
4. **Legal.** Complete and have someone check `privacy.html` and `terms.html` (operator name and address, providers, age,
   refunds), then remove the draft banners and the `noindex` line.

## Deploying (not done yet)

The folder is self-contained: every link inside it is relative, so it works at a domain root or in a subfolder.

**Names to check first (all unverified).** Nothing below has been checked for availability, trademarks or existing
games. Before committing to any of them, check the domain registrar, GitHub, Steam, and the USPTO/EUIPO trademark
databases for "Joust Revival" (Warner Bros. holds JOUST for video games, so get the full name checked).

| Use | Suggestions (unverified) |
|---|---|
| Website repo | `historic-pictures/joust-revival-site` (the URL the tags assume now), or `historic-pictures/joustrevival` |
| Domain | `joustrevival.com`, `playjoustrevival.com`, `joustrevival.game`, `joust-revival.com` |
| Social handles | `@joustrevival`, `@playjoustrevival` |

**Option A: its own repo (recommended).** Create a public repo, e.g. `historic-pictures/joust-revival-site`, copy the
contents of this folder to its root, push, then in the repo's Settings > Pages choose "Deploy from a branch", branch
`main`, folder `/ (root)`. It will be live at `https://historic-pictures.github.io/joust-revival-site/`.

```
git clone https://github.com/historic-pictures/joust-revival-site.git
cp -r site/* site/.nojekyll joust-revival-site/
cd joust-revival-site && git add -A && git commit -m "Joust Revival site" && git push
```

**Option B: a custom domain.** Register the domain you choose (e.g. `joustrevival.com`, if it is free), add a file `CNAME`
containing the domain to the site root, point the domain's DNS at GitHub Pages (four `A` records to 185.199.108.153,
.109.153, .110.153, .111.153, or a `CNAME` record for `www` to `historic-pictures.github.io`), and tick "Enforce HTTPS"
in Settings > Pages. Then replace the site URL in the tags (step 1 above) with the domain.

**Option C: a subfolder of the game's site.** Copy this folder into the public game repo (`historic-pictures/tilt`) as
`site/`, served at `https://historic-pictures.github.io/tilt/site/`. Simple, but it mixes the game's and the website's
history, so A is cleaner. (The game itself still lives at `historic-pictures.github.io/tilt/`; `gameUrl` in
`assets/js/config.js` is the one place to change if it moves.)

Any static host also works (Cloudflare Pages, Netlify): publish this folder as is.

## Swapping the emblem

The emblem is a placeholder while the final logo is chosen. To swap it:

1. Save the new emblem as `assets/brand/emblem.png`: a square PNG with a transparent background.
2. Run `python tools/make_brand.py` from this folder (needs Pillow and fontTools with brotli).
3. Every page picks it up: the header, the favicon, the share images and the press kit all come from that one file.

The name and the lines on the share images are constants at the top of `tools/make_brand.py`.

## Editing

- The header and footer are repeated in every page. To change the menu or the footer, edit them in each `.html` file
  (search for `<header class="site-head">` and `<footer class="site-foot">`).
- The display face is one CSS variable, `--display`, at the top of `assets/css/site.css`. Swap it there to change every heading.
  The "Joust Revival" wordmark uses the small-caps face (`--caps`), because blackletter capitals are hard to read.
- New devlog post: copy `devlog/_template.html` and follow the steps at its top.
- Images: keep them WebP, 800 px and 1600 px wide, with `loading="lazy"` below the fold, `width`/`height` set, and real `alt` text.

## Media and the swap list

All game footage and screenshots were captured from the current browser build (main branch, 26 Nov 2026) with the game's
own camera and replay system. Several feature branches were not merged at capture time, so these will need fresh captures after they land:

| File | Shows | Replace after |
|---|---|---|
| `assets/media/hero.mp4` (+ `hero-poster.webp`) | side tracking gallop, then the replay's reverse and impact angles | horse hair, people, physics |
| `assets/media/break.mp4`, `fall.mp4`, `gallop.mp4` | slow-motion break, unhorsing fall camera, side gallop | physics overhaul, horse hair |
| `assets/img/shot-*.webp`, `venue-*.webp`, `armour-*.webp` | stills | new UI (screens with the HUD), people and crowd |
| `assets/img/shot-herald-roll-800.webp` | herald's roll screen, **work in progress** (feat/tourney) | merge of tournament events |
| `assets/img/shot-new-ui-*.webp` | the new manuscript main menu, **work in progress** (feat/uistyle); shows the old title "Tilt" | merge of the new UI and the rename in the game |

Clips are H.264 MP4, 30 fps, no audio, 960×540 (hero) and 768×432 (loops), each under 3 MB. They load only when scrolled
into view, and not at all with "reduce motion" or data saver on.

## Credits

- Codex Manesse (Zurich, c. 1300–1340), Heidelberg University Library, Cod. Pal. germ. 848, fol. 52r (Walther von Klingen)
  and fol. 17r (Herzog von Anhalt). Public domain, via Wikimedia Commons.
- Eadweard Muybridge, *The Horse in Motion* (1878). Public domain, via Wikimedia Commons.
- Fonts: Grenze Gotisch (Omnibus-Type) and EB Garamond (Georg Duffner, Octavio Pardo), SIL Open Font License 1.1.
- Lozenge border, divider and corner ornaments, parchment texture: drawn for the game.
- Emblem (placeholder): generated with the owner's own image pipeline (`shots/genart/logos/`).
