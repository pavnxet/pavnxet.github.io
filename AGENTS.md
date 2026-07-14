# AGENTS.md — Quick Reference for AI Sessions

> **Default branch: `main4.0`** — always use this unless told otherwise.
> Deploy: `git push origin main4.0` (GitHub Pages, no build step).

## Branch Naming Convention

- **`4.xx`** — New blog posts or content additions (e.g. `main4.02` for Anna's Archive post)
- **`5.xx`** — Visual or logic changes to the main website interface (e.g. homepage redesign, CSS overhaul, JS behavior changes)

---

## Site Architecture

- **Pure static HTML/CSS/JS** — no frameworks, no build system, no backend.
- Hosted on **GitHub Pages** at `https://pavnxet.github.io/`.
- Two CSS files: `css/main.css` (homepage), `css/article.css` (blog posts).
- JS files: `js/main.js` (homepage logic), `js/search.js` (search), `js/article.js` (TOC scroll spy).
- Design system: **creamy theme** with Sora (sans) + Lora (serif) fonts.
- All CSS variables defined in `:root` in both CSS files.

---

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Homepage with card grid |
| `data/search-index.json` | Client-side search data (JSON array) |
| `blogs/[slug]/index.html` | Blog post pages |
| `blogs/tools/index.html` | Tools directory page |
| `sitemap.xml` | SEO sitemap |
| `css/article.css` | Styles for all blog/article pages |
| `creamy_theme_guide.txt` | Full design system reference (palette, typography, spacing, shadows, tokens) |

---

## Publishing Checklist

When adding a new blog post:

1. **Create folder**: `blogs/[kebab-case-slug]/index.html`
2. **Add search entry** to `data/search-index.json`:
   ```json
   {
     "title": "...",
     "type": "project|blog",
     "url": "blogs/[slug]/index.html",
     "description": "...",
     "tags": ["tag1", "tag2"]
   }
   ```
3. **Add homepage card** to `index.html` in `<div id="postsGrid">`:
   ```html
   <a class="card reveal d[N]" data-cat="[category]" href="blogs/[slug]/index.html">
     <!-- card content -->
   </a>
   ```
   - Delay classes auto-assign at runtime via `js/main.js` — just add `reveal` class.
   - Post count is dynamic (via `js/main.js`); never hardcode it.
4. **If it's a tool/project** (`type: "project"`): also add a `.tool-card` to `blogs/tools/index.html`
5. **Update sitemap**: add `<url>` block to `sitemap.xml`
6. **SEO**: every page needs `<title>`, `<meta description>`, OG tags, Twitter card, canonical URL

---

## Blog Post Template Rules

- Back link: `<a href="../../index.html">← Back to Home</a>`
- TOC with scroll spy (use `js/article.js`)
- Desktop: `grid-template-columns: 240px 1fr; gap: 60px;`
- Mobile (<900px): stacked layout, TOC becomes horizontal sticky nav
- All images in the post's own folder
- Canonical URL: `https://pavnxet.github.io/blogs/[slug]/`

---

## Design Tokens

```css
--cream: #faf6f0;  --cream2: #f4ede2;  --cream3: #ecdfd0;
--ink: #1e1a15;     --ink2: #4a4038;     --ink3: #8c7e6e;
--accent: #b07d4a;
--shadow: 0 4px 20px rgba(160,120,70,0.08);
--transition: all 0.25s cubic-bezier(.22,.68,0,1.1);
```

---

## Mobile Breakpoints

Test at: **320px, 375px, 768px, 1024px**
- No horizontal scrolling
- Min touch target: 44px × 44px
- Cards stack vertically on mobile
- Search bar fully usable at all sizes

---

## Restrictions

- No React, Next.js, Astro, Vue, or other frameworks
- No backend, databases, or build pipelines
- No `style.css` at root (legacy, unused — ignore it)
- Preserve existing URL structure: `blogs/[slug]/index.html`
- Preserve card hover effects and scroll reveal animations

---

## Search System

- Data lives in `data/search-index.json`
- Types: `"project"` → 📁, `"blog"` → 📝
- Client-side search via `js/search.js`
- New posts MUST be added to search-index.json to appear in search

---

## Branch History

| Branch | Purpose |
|--------|---------|
| `main4.0` | **Current active branch** (deploy target) |
| `main4.02` | Anna's Archive Download blog post |
| `main3.0` | Previous version |
| `main2.0` | Default remote HEAD |
| `creamy-blog-theme` | Theme development |
| `dashboard-site` | Dashboard variant |

---

## Memory System (read this every session)

Two files carry knowledge across sessions:

- **`learning.md`** — distilled lessons, gotchas, conventions, and preferences learned from past work.
  **Read this in full at the start of every session, before doing anything else.**
- **`summary.md`** — a running log of what happened in each session. Skim the last 3–5 entries for recent context; don't read the whole file unless you need history.

### At the START of a session
1. Read `learning.md` fully. Treat it as binding context — it encodes hard-won corrections, not suggestions.
2. Skim the last few entries of `summary.md` for recent momentum (what was in progress, what's still open).

### At the END of a session (non-negotiable — do this before stopping)
1. Append a new entry to `summary.md` using the template at the top of that file. One entry, dated, concise.
2. Review what happened this session. If anything is worth generalizing — a mistake you made and fixed, a pattern that worked, a user preference, a fact about this codebase/environment you didn't know before — merge it into `learning.md`:
   - **New fact** → add it under the right category.
   - **Fact that updates/contradicts an old one** → edit the old line in place, don't just append a contradiction. `learning.md` must never contain two conflicting entries on the same topic.
   - **Nothing new learned** → it's fine to skip a `learning.md` edit. Don't pad it with trivia to look productive.
3. If `learning.md` is getting long (>150 lines) or has near-duplicate entries, consolidate/prune before finishing.

Do not end a session without touching `summary.md`. This step is enforced by a Stop hook — if you skip it, the session will be blocked from ending and you'll be told to complete it.