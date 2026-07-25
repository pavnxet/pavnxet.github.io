# PASTEL DROP → pavnxet.github.io : Complete Integration Guide v2
> Branch: `main4.02` (default) | Portfolio Version: `4.02` | Target: Creamy Dashboard Portfolio & Blog

Playbook to add https://github.com/pavnxet/pastel-drop as a featured blog + project. Includes blog content, exact code changes, QA, and new versioning system `x.yy`.

---

## 0. WHAT IS PASTEL DROP? (Verified Spec)

**Repo:** `pavnxet/pastel-drop`
**Tagline:** 🍬 Soft pastel wallpapers for your phone. Free forever.
**Pitch:** 16 hand-picked pastel wallpapers for iPhone & Android lock screens.
**Main file:** `Pastel-Drop-Wallpaper-Download.html` - ONE file = entire app
**License:** CC BY 4.0

**Wallpaper Drops:**
| # | Name | Tag | Vibe |
|---|------|-----|------|
| 1 | 🌊 Midnight Whale | Ocean | Deep navy for OLED |
| 2 | 🧪 Lab Day | Science | Soft pastel flasks |
| 3 | 🐋 Cloud Whale | Ocean | Morning lock screen |
| 4 | 🌿 Desk Plant | Desk | Retro computer + monstera |
| 5 | 🔢 Count It | Study | Cute abacus |
| 6 | 🐠 Lantern Fish | Ocean | Light in deep water |
| 7-16 | Bloom, Aurora, Petal, + 7 more | Pastel / Cozy | See live demo |

**Features:**
- 16 wallpapers, 1080×1920 & 1152×2048
- OLED-friendly dark palettes
- One-tap download → Photos
- 6 tags: Science, Ocean, Study, Desk, Pastel, Cozy
- Dark/Light auto via `prefers-color-scheme`
- React bundled (UMD, zero deps), Tailwind inline, WebP base64
- No build, no package.json

**⚠️ CRITICAL FIX BEFORE YOU BLOG IT:**

Your live URL `https://pavnxet.github.io/pastel-drop/` will 404 today because GitHub Pages serves `index.html` first. Your repo only has `Pastel-Drop-Wallpaper-Download.html`.

**Do this once in pastel-drop repo:**
```bash
git checkout main
cp Pastel-Drop-Wallpaper-Download.html index.html
git add index.html
git commit -m "feat: add index.html for Pages root - fixes 404 on /pastel-drop/"
git push origin main
```
After that, BOTH URLs work:
- Canonical: `https://pavnxet.github.io/pastel-drop/`
- Direct: `https://pavnxet.github.io/pastel-drop/Pastel-Drop-Wallpaper-Download.html`

If you skip this, change every `live` link below to the full filename URL.

---

## 1. NEW VERSIONING SYSTEM: `x.yy`

You requested: `x.yy` where `x` = main webpage content/bugfixes, `yy` = blogs posted in that `x`.

### 1.1 Semantics

```
Version = MAJOR.MINOR_BLOG
          x  .  yy

x  = Main site version (integer)
     Bump when: redesign, new layout, new section, major bugfix, perf rewrite, design system change
     Example: 4 → 5

yy = Blog counter within that x (two digits, zero-padded)
     Bump when: new blog post added
     Reset to 00 when x bumps
     Example: 4.02 → 4.03 → 4.04 → 5.00

So:
4.02 = site v4, 2nd blog
4.03 = site v4, 3rd blog (Pastel Drop will be this)
5.00 = site v5 launch, no blogs yet in v5
5.01 = site v5, first blog after v5 launch
```

### 1.2 Where to store version

Create single source of truth.

**Option A (Recommended - Simple):** `/version.js`
```js
// version.js - Single source of truth for portfolio versioning
// Format: x.yy - x = main site, yy = blogs in that x
const SITE_VERSION = "4.03";
const VERSION_INFO = {
  version: SITE_VERSION,
  major: 4,
  blogCount: 3,
  lastUpdated: "2026-05-15",
  changelog: "feat: add pastel-drop blog - 16 wallpapers single HTML"
};

// For display in footer
if (typeof module !== 'undefined') module.exports = VERSION_INFO;
```

**Option B (Fallback if you don't want new file):** Top of `data.js`
```js
const SITE_VERSION = "4.03"; // x.yy
```

**Git tags (do for every version):**
```bash
git tag -a v4.03 -m "feat: pastel-drop blog - 16 wallpapers"
git push origin v4.03
```

### 1.3 How to display in UI

**In `index.html` footer:**
```html
<!-- Add this in footer -->
<footer class="site-footer">
  <span id="site-version">v4.03</span> • Made with 💖
  <span id="site-changelog" title="feat: add pastel-drop blog"></span>
</footer>
```

**In `script.js` or main JS:**
```js
// Load version and inject
fetch('./version.js')
  .then(() => {
    // if using version.js as JS file, SITE_VERSION is global
    const el = document.getElementById('site-version');
    if (el && typeof SITE_VERSION !== 'undefined') {
      el.textContent = `v${SITE_VERSION}`;
    }
  });

// Or if SITE_VERSION defined in data.js:
document.getElementById('site-version').textContent = `v${SITE_VERSION}`;
```

**Alternative: auto-inject without extra fetch:**
```html
<script src="./version.js"></script>
<script>
  document.getElementById('site-version').textContent = `v${SITE_VERSION}`;
</script>
```

### 1.4 Changelog convention

Create `/CHANGELOG.md` (new file):
```md
# Changelog - x.yy versioning

## v4.03 - 2026-05-15
- feat: add pastel-drop blog (16 wallpapers, single HTML)
- fix: ensure pastel-drop has index.html for Pages
- yy: 03 = third blog in v4

## v4.02 - 2026-04-20 (example - your current)
- feat: creamy dashboard v4
- yy: 02 = second blog in v4

## v5.00 - future
- When you redesign, reset yy to 00
```

**Commit convention:**
```
feat: add pastel-drop blog → v4.03
fix: header mobile bug → v4.04? No, if it's site fix: v5.00 or v4.03 stays, x bumps only on major.
Rule:
- Blog only: 4.02 → 4.03 (yy++)
- Site fix/feature: 4.03 → 5.00 (x++, yy=00)
- Site fix + blog same PR: bump x, then yy=01 → 5.01
```

### 1.5 What to do for Pastel Drop

Current is `4.02`, so:
- Pastel Drop = `4.03`
- Update `version.js` → `4.03`
- Tag: `v4.03`
- Footer will show `v4.03`
- README deployment note: fix `main4.0` → `main4.02` → after this blog, default branch display version `main4.03`? Keep branch name as `main4.02` or rename to `main`? Recommendation: keep branch `main4.02` but version is separate. Or create new branch `main4.03` if you use branch-per-version. Simpler: keep branch `main4.02` and version file is source of truth.

**Decision for you:**
- Keep branch name `main4.02` (don't rename branches every blog, messy)
- Version is `4.03` in code. Branch name != version after this. That's okay, or you can rename branch to `main` to avoid confusion. Recommended: move default to `main` long-term, keep versioning in `version.js`.

---

## 2. BLOG CONTENT - READY TO PASTE

### 2.1 Schema check

Open your `data.js` and check first blog object keys. Likely:
```js
{ id, title, date, category, image, excerpt, content, tags, readTime }
```

If your renderer doesn't use `github` and `live`, DON'T add them as top-level keys. Put them inside `content` HTML as links. Below uses only standard keys.

### 2.2 Final object for `blogData` (v4.03)

```js
{
  id: "pastel-drop",
  title: "Pastel Drop: I shipped 16 wallpapers inside one HTML file",
  date: "2026-05-15",
  category: "Build Log",
  image: "./assets/images/pastel-drop-cover.webp",
  excerpt: "16 soft, OLED-friendly wallpapers for your phone. No installer, no build step — just one HTML file with everything base64'd. Free forever.",
  tags: ["Design", "Open Source", "Wallpapers"],
  readTime: "6 min read",
  content: `
<p>I've always had a weak spot for pastels. That soft, washed-out vibe that makes your lock screen feel calm instead of cluttered. So I made <strong>Pastel Drop</strong> — 16 hand-picked wallpapers, packed into a single HTML file.</p>

<p>🍬 <strong>Soft wallpapers for your phone. Free forever.</strong> No app, no build, no npm install. Just open and download.</p>

<h3>What's inside the drop?</h3>
<ul>
  <li>🌊 <strong>Midnight Whale</strong> — deep navy, perfect for OLED blacks</li>
  <li>🧪 <strong>Lab Day</strong> — soft pastel flasks</li>
  <li>🐋 <strong>Cloud Whale</strong> — morning lock screen energy</li>
  <li>🌿 <strong>Desk Plant</strong> — retro computer + monstera</li>
  <li>🔢 <strong>Count It</strong> — cute abacus beads</li>
  <li>🐠 <strong>Lantern Fish</strong> — little light in deep water</li>
  <li>🌸 <strong>Bloom, Aurora, Petal + 8 more</strong> — fresh pastel collection</li>
</ul>

<p>All 16 are optimized for mobile at <code>1080x1920</code> and <code>1152x2048</code>, OLED-friendly, tagged into 6 aesthetics: <code>Science</code>, <code>Ocean</code>, <code>Study</code>, <code>Desk</code>, <code>Pastel</code>, <code>Cozy</code>.</p>

<h3>Why one HTML file?</h3>
<p>I wanted it to feel like a drop, not a deployment. You should be able to right-click, save, send it on Telegram, host it on your own GitHub Pages in 30 seconds.</p>

<blockquote>💡 Constraint breeds aesthetic. When you have only one file, you have to be intentional.</blockquote>

<pre><code>Pastel-Drop-Wallpaper-Download.html
├── Tailwind (inline)
├── React + ReactDOM (bundled UMD)
├── const wallpapers = [ ...16 base64 WebPs ]
└── UI: filter tabs + grid + modal + one-tap download
</code></pre>

<p><strong>Tech:</strong> React bundled zero deps, Tailwind inline, WebP base64 (no external requests), system dark/light detection, blob URL one-tap download.</p>

<h3>Try it</h3>
<p>Live: <a href="https://pavnxet.github.io/pastel-drop/" target="_blank">pavnxet.github.io/pastel-drop</a><br/>
GitHub: <a href="https://github.com/pavnxet/pastel-drop" target="_blank">github.com/pavnxet/pastel-drop</a></p>

<p>CC BY 4.0 — use, share, remix, just mention Pastel Drop. 💖 Pastels make everything better. 🍬</p>
`
}
```

**Safety checks:**
- No backticks inside content → safe for template literal
- No \${} interpolation → safe
- All quotes are double inside HTML attributes, content wrapped in backticks → valid

### 2.3 OPTIONAL: projectsData entry too

```js
{
  id: "pastel-drop",
  title: "Pastel Drop",
  description: "🍬 16 soft pastel wallpapers inside one HTML file. Zero deps, one-tap download.",
  tags: ["Design", "React", "Tailwind", "Open Source"],
  category: "Design",
  image: "./assets/images/pastel-drop-cover.webp",
  liveLink: "https://pavnxet.github.io/pastel-drop/",
  githubLink: "https://github.com/pavnxet/pastel-drop",
  progress: 100,
  featured: true
}
```

---

## 3. EXACT STEPS - main4.02 → v4.03

### Step 0: Fix pastel-drop repo (1 min)
```bash
cd pastel-drop
cp Pastel-Drop-Wallpaper-Download.html index.html
git add index.html && git commit -m "feat: add index.html for Pages root" && git push
```

### Step 1: Assets in pavnxet.github.io
Save screenshots as:
```
./assets/images/pastel-drop-cover.webp
./assets/images/pastel-drop-modal.webp (optional)
```
Use consistent path: if existing blogs use `./assets/images/`, use same. NOT `/assets/`.

### Step 2: Create version.js (new file, root)
```js
// version.js
const SITE_VERSION = "4.03";
const VERSION_INFO = {
  version: "4.03",
  major: 4,
  minorBlog: 3,
  lastUpdated: "2026-05-15",
  changelog: "feat: pastel-drop - 16 wallpapers single HTML"
};
```

### Step 3: Update index.html footer
```html
<footer>... <span id="site-version"></span> ...</footer>
<script src="./version.js"></script>
<script>
  const vEl = document.getElementById('site-version');
  if(vEl && typeof SITE_VERSION !== 'undefined') vEl.textContent = `v${SITE_VERSION}`;
</script>
```

### Step 4: Edit data.js
Prepend blog object from Section 2.2 to `blogData` array. Ensure previous entry ends with `},`.

### Step 5: Update CHANGELOG.md (create if not exists)

### Step 6: Verify syntax (CORRECT command)
```bash
node --check data.js
node --check version.js
```

### Step 7: Commit & tag as v4.03
```bash
git checkout main4.02
git add .
git commit -m "feat: v4.03 - add pastel-drop blog (16 wallpapers, single HTML)"
git tag -a v4.03 -m "v4.03: pastel-drop blog"
git push origin main4.02 --tags
```

---

## 4. QA CHECKLIST - v4.03 READY

### Syntax
- [ ] `node --check data.js` passes (not node -c)
- [ ] `node --check version.js` passes
- [ ] No console errors

### Versioning
- [ ] version.js shows 4.03
- [ ] Footer displays v4.03
- [ ] CHANGELOG.md has v4.03 entry
- [ ] Git tag v4.03 pushed
- [ ] README says main4.02 (or updated to main) not main4.0

### Blog rendering
- [ ] Card shows with cover image
- [ ] Search "pastel" works
- [ ] Category "Build Log" filter works (or used existing category)
- [ ] Slide-up reader renders h3, ul, blockquote, pre code, links
- [ ] Live link https://pavnxet.github.io/pastel-drop/ works (after index.html fix)
- [ ] GitHub link works

### Mobile
- [ ] Bottom tabs show blog
- [ ] Reader scrolls
- [ ] Creamy theme intact

### Performance & Legal
- [ ] Cover <200kb WebP
- [ ] No raw.githubusercontent.com hotlinks
- [ ] CC BY 4.0 attribution kept

---

## 5. FUTURE BUMP EXAMPLES

- New blog in same site version: 4.03 → 4.04 → 4.05
- Fix header bug (major site fix): 4.05 → 5.00 (yy reset)
- Redesign + blog: 5.00 → 5.01

Keep branch name `main4.02` or migrate to `main` and let version.js be source of truth. Don't create new branch per blog.

---

Done. This v2 guide fixes all issues found by sub-agents:
- Fixed live URL 404 via index.html copy
- Fixed node --check command
- Fixed wildcard asset URL
- Fixed schema mismatch
- Added complete x.yy versioning with version.js, footer, changelog, tags
- Path consistency: ./assets/images/
- HTML safe for backticks
