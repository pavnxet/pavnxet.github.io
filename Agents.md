# AI Instructions: How to Create and Maintain Content on this Website

> [!IMPORTANT]
> **Default Posting Branch**
>
> Always use branch `main2.0` for updates unless explicitly instructed otherwise.

---

# 1. Website Architecture

This repository uses a **Classic Grid Theme** optimized for **GitHub Pages**.

## Core Principles

- Fully static website.
- No backend services.
- No React, Next.js, Astro, or other frameworks.
- No build system required.
- Compatible with direct GitHub Pages deployment.
- Deployment should remain as simple as:

```bash
git push origin main2.0
```

---

# 2. Project Structure

```text
/
├── index.html
├── sitemap.xml
├── robots.txt
│
├── css/
│   ├── main.css
│   ├── search.css
│
├── js/
│   ├── main.js
│   ├── search.js
│
├── data/
│   └── search-index.json
│
├── images/
│   └── logo.jpg
│
└── blogs/
    ├── treebundle/
    │   └── index.html
    ├── clearlink/
    │   └── index.html
    └── [new-post]/
        └── index.html
```

---

# 3. Publishing a New Blog Post

## Step 1: Create the Post Folder

Create:

```text
blogs/[post-slug]/
```

Example:

```text
blogs/my-awesome-tool/
```

Inside:

```text
blogs/my-awesome-tool/index.html
```

Place all post-specific assets inside the same folder whenever possible.

---

## Step 2: Create the Article Page

Every blog article must:

- Use the warm creamy design system.
- Include a sticky navigation bar.
- Include a Table of Contents (TOC).
- Include mobile-responsive behavior.
- Include Scroll Spy functionality.

### Required Navigation

```html
<a href="../../index.html">← Back to Home</a>
```

### Required Fonts

```html
Sora
Lora
```

### Required Layout

Desktop:

```css
display: grid;
grid-template-columns: 240px 1fr;
gap: 60px;
```

Mobile (<900px):

```css
display: block;
```

TOC becomes a horizontal sticky navigation.

---

## Step 3: SEO Requirements

Every blog post MUST include:

```html
<title>Post Title</title>

<meta name="description" content="Short description">

<meta property="og:title" content="Post Title">
<meta property="og:description" content="Short description">

<meta property="twitter:card" content="summary_large_image">

<link rel="canonical" href="https://pavnxet.github.io/blogs/[slug]/">
```

Requirements:

- Unique title.
- Unique description.
- Canonical URL.
- Open Graph tags.
- Twitter card tags.

---

# 4. Homepage Updates

Whenever a new post is added:

## Add a New Card

Inside:

```html
<div id="postsGrid">
```

Add a new card:

```html
<div class="card reveal"
     data-cat="[category]"
     onclick="window.location.href='blogs/[post-slug]/index.html'">

  ...

</div>
```

---

## DO NOT Manually Update Post Counts

The hero count is now dynamic.

Example:

```js
heroCount.textContent = searchData.length;
```

Never hardcode:

```html
<div class="hero-count">5</div>
```

---

# 5. Search System

The website includes a client-side search engine.

## Search Data

All searchable content must exist inside:

```text
data/search-index.json
```

Example:

```json
{
  "title": "TreeBundle",
  "description": "Bundle repository trees for AI context.",
  "url": "blogs/treebundle/",
  "type": "project",
  "tags": [
    "ai",
    "github",
    "developer-tools"
  ]
}
```

---

## Required Search Fields

Every entry should contain:

```json
{
  "title": "",
  "description": "",
  "url": "",
  "type": "",
  "tags": []
}
```

Search should work against:

- title
- description
- tags

---

## Search Result Types

Use:

```text
📁 Project
📝 Blog Post
```

to distinguish result types.

---

# 6. Mobile Responsiveness

All new content MUST be tested at:

```text
320px
375px
768px
1024px
```

Requirements:

- No horizontal scrolling.
- Search bar fully usable.
- Cards stack properly.
- Images scale correctly.
- TOC works on mobile.
- Navigation remains accessible.
- Buttons remain touch friendly.

Minimum touch target:

```css
44px × 44px
```

---

# 7. Asset Rules

Use:

```text
/images/
```

for global assets.

Example:

```text
images/logo.jpg
```

Avoid storing shared assets in the repository root.

---

# 8. Design Guidelines

## Colors

```css
--cream: #faf6f0;
--cream2: #f4ede2;
--cream3: #ecdfd0;

--ink: #1e1a15;
--ink2: #4a4038;
--ink3: #8c7e6e;

--accent: #b07d4a;
```

## Shadows

Preferred:

```css
box-shadow:
0 4px 20px rgba(160,120,70,0.08);
```

Avoid harsh black shadows.

## Animations

Use:

```css
transition:
all 0.25s cubic-bezier(.22,.68,0,1.1);
```

---

# 9. Restrictions

Do NOT:

- Introduce React.
- Introduce Next.js.
- Introduce Astro.
- Introduce backend services.
- Introduce databases.
- Introduce complex build pipelines.
- Break existing card hover effects.
- Break existing URL structure:
  blogs/[slug]/index.html

Keep the site lightweight, static, SEO-friendly, mobile-friendly, and fully compatible with GitHub Pages.