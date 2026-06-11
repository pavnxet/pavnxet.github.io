# Code Audit Report — pavnxet.github.io

**Date:** June 6, 2026
**Repository:** `E:\Codes\My website`
**Type:** Static HTML/CSS/JavaScript personal blog & portfolio (GitHub Pages)
**Scope:** All source files — HTML, CSS, JavaScript, JSON, XML, config

---

## Summary

| Category | Total | Critical | Medium | Low |
|---|---|---|---|---|
| Logical Bugs | 5 | 0 | 2 | 3 |
| Security Vulnerabilities | 4 | 1 | 2 | 1 |
| Performance Bottlenecks | 4 | 0 | 1 | 3 |
| Code Smells / Duplication | 8 | 0 | 3 | 5 |
| **Total** | **21** | **1** | **8** | **12** |

---

## 1. Logical Bugs

### 1.1 Duplicate `input.disabled = true` assignment
- **Severity:** Low
- **File:** `js/main.js:52-53`
- **Description:** The newsletter button click handler sets `input.disabled = true` twice in succession:
  ```js
  input.disabled = true;
  input.disabled = true;  // duplicate line
  ```
  The second assignment is a no-op. While not causing a runtime error, it indicates a copy-paste mistake and adds dead code.
- **Fix:** Remove the duplicate line at `js/main.js:53`.

---

### 1.2 Scroll reveal `i * 60` delay uses array index, not visible order
- **Severity:** Medium
- **File:** `js/main.js:15`
- **Description:** The IntersectionObserver callback uses `i` (the index within the `entries` array for this batch) to stagger animations:
  ```js
  entries.forEach((e, i) => {
    setTimeout(() => e.target.classList.add('visible'), i * 60);
  });
  ```
  The `entries` array only contains elements that intersected in this single observer callback. If 5 elements are revealed at once, they get staggered by 0ms, 60ms, 120ms, 180ms, 240ms — which is fine. However, if elements are revealed in separate observer fires (e.g., two batches), the second batch resets `i` to 0, causing its first element to animate at the same time as the first element of the first batch would have. This is a minor visual inconsistency, not a functional bug, but it means the stagger is not globally consistent.
- **Fix:** Use a global counter or timestamp-based stagger instead of the batch index.

---

### 1.3 `filterPosts` doesn't reset `display` for matched cards after filtering twice
- **Severity:** Medium
- **File:** `js/main.js:23-43`
- **Description:** When `filterPosts` is called, non-matching cards get `display: none` after a 300ms timeout. However, matching cards get `display: ''` (empty string) set immediately. If a user rapidly clicks different filters (e.g., "All" → "Tech" → "All"), the `setTimeout` from a previous filter run can set `display: none` on cards that should be visible, because the timeout from the first filter call fires after the second filter call has already run. There is no mechanism to cancel or clear pending timeouts.
- **Fix:** Store the timeout IDs and clear them at the start of each `filterPosts` call, or use a more robust state management approach.

---

### 1.4 `heroCount` is hardcoded in `made by me index.html` but dynamic in `index.html`
- **Severity:** Low
- **File:** `made by me index.html:687` vs `index.html:58`
- **Description:** The production `index.html` dynamically calculates the post count via JavaScript (`document.querySelectorAll('.card, .card-featured').length`). The alternate `made by me index.html` hardcodes `24` in the HTML (`<div class="hero-count">24</div>`) but has 8 cards in the grid. This is a content inconsistency — the count doesn't match the actual number of posts.
- **Fix:** Either make the count dynamic in `made by me index.html` as well, or update the hardcoded value to match the actual card count.

---

### 1.5 Blog post TOC observer doesn't handle initial scroll position on page load
- **Severity:** Low
- **File:** `blogs/3rd grade results/index.html:732-768` (and equivalent in clearlink and treebundle)
- **Description:** The IntersectionObserver for the TOC highlighter only triggers when sections enter/exit the viewport. If the user navigates directly to a URL with a hash fragment (e.g., `#how-it-works`), the page scrolls to that section on load, but the observer may not fire until the user manually scrolls. This means the TOC "active" state may not correctly highlight the section the user is currently viewing on initial page load.
- **Fix:** Add an initial check on `DOMContentLoaded` that reads `window.location.hash` and manually sets the active TOC link.

---

## 2. Security Vulnerabilities

### 2.1 XSS via `innerHTML` with hardcoded data in `app.js`
- **Severity:** Medium
- **File:** `app.js:144-156`, `app.js:214-239`, `app.js:249-276`, `app.js:353`
- **Description:** The dashboard application (`app.js`) uses `innerHTML` extensively to render content from the `data.js` file:
  ```js
  row.innerHTML = `
    <img src="${post.image}" alt="${post.title}" ...>
    <h4 class="recent-item-title">${post.title}</h4>
  `;
  ```
  While the data is currently hardcoded in `data.js` (not user-supplied), this pattern is dangerous because:
  1. If the data source ever changes to include user input or external API data, it would be immediately vulnerable to XSS.
  2. The `post.content` field (which contains full HTML blog content) is injected via `readerContent.innerHTML = post.content` at line 353 — this is the highest-risk line.
  
  The production site (`index.html`) does NOT use `app.js`, so this only affects the dashboard version. However, it's still a latent vulnerability.
- **Fix:** Use `textContent` for text fields and `createElement`/`setAttribute` for HTML structure. If HTML content must be rendered, sanitize it first (e.g., with DOMPurify).

---

### 2.2 `target="_blank"` without `rel="noopener noreferrer"` on some links
- **Severity:** Medium
- **File:** `data.js:13-14`, `data.js:24-25`, `data.js:35-36`
- **Description:** The project card links in `data.js` use `target="_blank"` for `codeLink` and `demoLink`:
  ```js
  codeLink: "https://github.com",
  demoLink: "https://github.com"
  ```
  These are rendered in `app.js:264-271` as `<a href="${project.codeLink}" target="_blank">` and `<a href="${project.demoLink}" target="_blank">` — **without** `rel="noopener noreferrer"`. This means the opened page has a reference to the originating window via `window.opener`, which is a known security concern (reverse tabnabbing).
  
  Note: The production `index.html` footer link correctly uses `rel="noopener noreferrer"` (line 208), and blog post external links also use it correctly.
- **Fix:** Add `rel="noopener noreferrer"` to the dynamically generated `<a>` tags in `app.js:264-271`.

---

### 2.3 Newsletter form has no server-side validation or submission endpoint
- **Severity:** Low
- **File:** `js/main.js:46-59`
- **Description:** The newsletter "Subscribe" button only checks for the presence of `@` in the input:
  ```js
  if (input.value.includes('@')) {
  ```
  This is not a real email validation — strings like `"@"` or `"a@b"` would pass. More importantly, there is no actual form submission endpoint. The button simply changes its text to "You're in ✓" and disables itself. This is a UX issue rather than a security vulnerability per se, but it gives users a false impression that they've subscribed to something.
- **Fix:** Either integrate with an actual email service (e.g., Buttondown, Mailchimp) or remove the form. At minimum, improve email validation with a regex.

---

### 2.4 No Content Security Policy (CSP) headers
- **Severity:** Low (informational)
- **File:** All HTML files
- **Description:** None of the HTML pages define a Content Security Policy via `<meta http-equiv="Content-Security-Policy">` or server headers. While this is a static site on GitHub Pages (where server headers can't be easily configured), a meta-tag CSP could still provide a baseline of protection against inline script injection if the site were ever compromised.
- **Fix:** Add a CSP meta tag, e.g.:
  ```html
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' https://images.unsplash.com;">
  ```
  Note: `'unsafe-inline'` is needed for styles due to the heavy use of inline `<style>` blocks.

---

## 3. Performance Bottlenecks

### 3.1 Massive CSS duplication across blog post pages
- **Severity:** Medium
- **File:** `blogs/3rd grade results/index.html`, `blogs/clearlink/index.html`, `blogs/treebundle/index.html`
- **Description:** Each blog post page contains a nearly identical ~570-line `<style>` block embedded directly in the HTML. The CSS is almost 100% duplicated across all three posts (tokens, reset, nav, article-header, page-layout, toc-sidebar, article styles, responsive, etc.). This means:
  - Each blog post page downloads ~15-20KB of redundant CSS
  - Any CSS fix must be applied to all three files separately
  - No browser caching benefit across pages (since it's inline, not an external file)
- **Fix:** Extract the shared CSS into a single external file (e.g., `css/article.css`) and link to it from all blog posts. Only keep post-specific overrides inline if needed.

---

### 3.2 No image optimization or modern formats
- **Severity:** Low
- **File:** All HTML files
- **Description:** All images use SVG, PNG, or external Unsplash URLs. There is no use of modern formats (WebP, AVIF), no responsive `srcset` attributes, and no explicit `width`/`height` attributes on `<img>` tags (which causes layout shift / CLS). The `loading="lazy"` attribute is used on some images but not all.
- **Fix:** Add `width` and `height` attributes to all `<img>` tags to prevent CLS. Consider using `<picture>` with WebP fallbacks. Apply `loading="lazy"` to all below-the-fold images consistently.

---

### 3.3 Scroll event listener is not throttled
- **Severity:** Low
- **File:** `js/main.js:70-90`
- **Description:** The `window.addEventListener('scroll', ...)` handler runs on every scroll event without throttling or debouncing:
  ```js
  window.addEventListener('scroll', () => {
    let current = 'top';
    const scrollPos = window.scrollY + 120;
    // ... DOM reads and writes
  });
  ```
  This handler performs DOM reads (`offsetTop`) and DOM writes (`classList.add/remove`) on every scroll frame, which can cause layout thrashing and jank on low-end devices.
- **Fix:** Use `requestAnimationFrame` to throttle the scroll handler, or use `IntersectionObserver` (which is already used elsewhere in the codebase) to detect when sections enter/leave the viewport.

---

### 3.4 Google Fonts loaded with `preconnect` but no `preload`
- **Severity:** Low
- **File:** `index.html:7-8`, all blog post `<head>` sections
- **Description:** The site uses `rel="preconnect"` to establish early connections to Google Fonts, but the actual font stylesheet is loaded via a separate `<link>` with `rel="stylesheet"`. The browser must still wait for the CSS to download and parse before it knows which font files to fetch. Using `preload` for the most critical font files would speed up text rendering.
- **Fix:** Add `<link rel="preload" as="style" href="...">` for the font stylesheet, or self-host the fonts for better performance.

---

## 4. Code Smells & Duplication

### 4.1 Three identical copies of blog post CSS/JS
- **Severity:** Medium
- **File:** `blogs/3rd grade results/index.html`, `blogs/clearlink/index.html`, `blogs/treebundle/index.html`
- **Description:** As noted in 3.1, the blog post pages share nearly identical CSS and JavaScript. The `<style>` blocks are ~95% identical, and the `<script>` blocks (TOC observer) are 100% identical. This is a significant maintenance burden — any design change to the blog layout must be manually replicated across all three files.
- **Fix:** Extract shared CSS to `css/article.css` and shared JS to `js/article.js`.

---

### 4.2 Two completely separate homepage versions
- **Severity:** Medium
- **File:** `index.html` vs `made by me index.html`
- **Description:** The repository contains two full homepage implementations:
  - `index.html` — the "Creamy Blog" version (production, uses external CSS/JS)
  - `made by me index.html` — an earlier "Aryan" version (all inline, different content)
  
  These share the same design tokens, card layout, filter system, and newsletter form, but are entirely separate files with duplicated code. The `made by me index.html` version is not linked from anywhere and appears to be dead code.
- **Fix:** Remove `made by me index.html` if it's no longer needed, or clearly document its purpose.

---

### 4.3 Two separate data/rendering systems
- **Severity:** Medium
- **File:** `data.js` + `app.js` + `style.css` vs inline content in `index.html` + `js/main.js` + `css/main.css`
- **Description:** The repository has two parallel application architectures:
  1. **Dashboard version:** `data.js` (data layer) → `app.js` (rendering) → `style.css` (styles)
  2. **Blog version:** Hardcoded HTML in `index.html` → `js/main.js` (interactions) → `css/main.css` (styles)
  
  The dashboard version (`app.js` + `data.js` + `style.css`) is not used by the production `index.html` at all. It appears to be an alternate version of the site that's maintained in parallel.
- **Fix:** Consolidate into a single architecture, or move the dashboard version to a separate branch/directory.

---

### 4.4 `data.js` contains dead/placeholder links
- **Severity:** Low
- **File:** `data.js:13-14`, `data.js:24-25`, `data.js:35-36`
- **Description:** All project links in `data.js` point to `https://github.com` (the GitHub homepage, not actual project repos):
  ```js
  codeLink: "https://github.com",
  demoLink: "https://github.com"
  ```
  These are placeholder values that haven't been updated with real project URLs.
- **Fix:** Replace with actual project repository and demo URLs.

---

### 4.5 Inconsistent `og:image` and `twitter:image` meta tags
- **Severity:** Low
- **File:** Blog post HTML files
- **Description:** The blog posts use inconsistent image meta tags:
  - `og:image` points to the blog post's own cover SVG (e.g., `3rd_grade.svg`)
  - `twitter:image` points to `https://pavnxet.github.io/images/logo.jpg` (the site logo) for all three posts
  
  This means Twitter card previews will show the generic logo instead of the article-specific cover image.
- **Fix:** Make `twitter:image` consistent with `og:image` — use the article-specific cover image for both.

---

### 4.6 `word-break: break-word` is non-standard
- **Severity:** Low
- **File:** `blogs/3rd grade results/index.html:293`, `blogs/clearlink/index.html:292`, `blogs/treebundle/index.html:292`
- **Description:** The CSS uses `word-break: break-word` which is a non-standard value (it's `overflow-wrap: break-word` in the spec). While browsers treat it as an alias for `break-all` for backward compatibility, it's not guaranteed to work consistently.
- **Fix:** Replace `word-break: break-word` with `overflow-wrap: break-word` (which is already set on the same elements).

---

### 4.7 `style.css` sidebar mobile width bug
- **Severity:** Low
- **File:** `style.css:1307-1319`
- **Description:** In the mobile media query, the sidebar is hidden by setting `--sidebar-width: 0px` and `transform: translateX(-100%)`. However, when `.sidebar.active` is applied (for the mobile menu), it sets `width: var(--sidebar-width)` which is now `0px`:
  ```css
  :root {
    --sidebar-width: 0px;  /* line 1308 */
  }
  .sidebar.active {
    transform: translateX(0);
    width: var(--sidebar-width);  /* line 1318 — this sets width to 0px! */
  }
  ```
  This means the mobile sidebar menu, when opened, will have a width of 0px and be invisible. This is a logical bug that would manifest if the mobile menu toggle were used.
- **Fix:** Set an explicit width on `.sidebar.active` instead of using the CSS variable, e.g., `width: 280px`.

---

### 4.8 `robots.txt` and `sitemap.xml` are not referenced consistently
- **Severity:** Low
- **File:** `robots.txt`, `sitemap.xml`, `index.html`
- **Description:** The `robots.txt` correctly references the sitemap at `https://pavnxet.github.io/sitemap.xml`. However, the sitemap only lists 4 URLs (homepage + 3 blog posts). If the `made by me index.html` or dashboard version is ever served, it won't be in the sitemap. Additionally, the sitemap doesn't include a reference from any HTML `<link>` tag.
- **Fix:** This is informational — the sitemap is adequate for the current production site. Consider adding a `<link rel="sitemap">` tag to the HTML head.

---

## 5. Recommendations Summary

### High Priority
1. **Extract shared blog CSS/JS** into external files to reduce duplication and improve maintainability (issues 3.1, 4.1)
2. **Add `rel="noopener noreferrer"`** to dynamically generated external links in `app.js` (issue 2.2)
3. **Fix the sidebar mobile width bug** in `style.css` (issue 4.7)

### Medium Priority
4. **Throttle the scroll event listener** in `js/main.js` (issue 3.3)
5. **Fix filter race condition** in `filterPosts` (issue 1.3)
6. **Consolidate or remove** the duplicate homepage/dashboard versions (issues 4.2, 4.3)
7. **Improve newsletter email validation** or integrate with a real service (issue 2.3)

### Low Priority
8. Remove duplicate `input.disabled = true` line (issue 1.1)
9. Fix hardcoded post count in `made by me index.html` (issue 1.4)
10. Add initial TOC active state check on page load (issue 1.5)
11. Fix `twitter:image` meta tags in blog posts (issue 4.5)
12. Replace placeholder links in `data.js` (issue 4.4)
13. Add `width`/`height` attributes to `<img>` tags to prevent CLS (issue 3.2)
14. Replace non-standard `word-break: break-word` (issue 4.6)
15. Consider adding a Content Security Policy meta tag (issue 2.4)
