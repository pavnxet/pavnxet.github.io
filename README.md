# pavnxet.github.io — Personal Blog & Tools Directory 🌾

A minimal, premium single-page blog and tools directory hosted on **GitHub Pages**. Pure static HTML/CSS/JS — no frameworks, no build step, no backend.

Live at **https://pavnxet.github.io** (deployed from branch `main5.00`).

---

## 🎨 Design

- **Creamy theme**: warm sand / alabaster / cocoa palette, Sora (sans) + Lora (serif) typography. Full token reference in `creamy_theme_guide.txt`.
- **Card grid** homepage with category filters, client-side search, scroll-reveal animations.
- **Article pages** with sidebar TOC + scroll spy (`js/article.js`), sticky mobile TOC under 900px.

---

## 🗂️ Project structure

```
index.html               Homepage (static card grid in #postsGrid)
version.js               Single source of truth for x.yy versioning
CHANGELOG.md             Version history
css/main.css             Homepage styles          css/article.css  Blog/tool pages
css/search.css           Search dropdown styles
js/main.js               Homepage logic (counter, reveal, filters, newsletter)
js/search.js             Client-side search over data/search-index.json
js/article.js            Article TOC scroll spy + overlays
data/search-index.json   Search data (title, type, url, description, tags)
blogs/[slug]/index.html  One folder per post, images live alongside
blogs/tools/index.html   Tools directory (live demos + repos + stories)
sitemap.xml / robots.txt SEO
```

---

## 🛠️ Tech stack

- **Core**: HTML5, vanilla JavaScript, vanilla CSS3 (Grid, Flexbox, custom properties)
- **Typography**: Google Fonts `Sora` + `Lora`
- **Hosting**: GitHub Pages (deploy from branch). **Live utilities** run on Cloudflare Workers / Vercel (see tools directory).

---

## 🚀 Deployment

1. Repo **Settings → Pages → Build and deployment → Deploy from a branch**.
2. Branch: `main5.00`, folder `/ (root)`, **Save**.
3. Keep the repo default branch on `main5.00` so Pages and HEAD stay in sync.

---

## ✏️ Publishing a new post

Follow the checklist in `AGENTS.md`:

1. Create `blogs/[kebab-case-slug]/index.html` (lowercase, no spaces — Pages URLs are case-sensitive).
2. Add entry to `data/search-index.json`.
3. Add card to `#postsGrid` in `index.html` (class `card reveal`, `data-cat` = category).
4. If it's a tool: add `.tool-card` + TOC entry to `blogs/tools/index.html`.
5. Add `<url>` to `sitemap.xml`. Bump `version.js`, update `CHANGELOG.md`.
6. Commit `feat: vX.YY - ...` and tag `vX.YY`.

---

## 🔍 Search

Client-side only: `js/search.js` loads `data/search-index.json` and matches title, description, and tags. Every new post **must** be added to the JSON or it won't appear in search.
