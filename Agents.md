# AI Instructions: How to Create a Blog Post on this Website

> [!IMPORTANT]
> **Default Posting Branch**:
> Always use branch `main2.0` for posting. It is the default branch for updates. Make sure you check out and commit your work to `main2.0` unless explicitly instructed otherwise.

---

## 1. Branch & Theme Detection

This repository contains two main branches, each implementing a different theme and structure. Before doing any work, run `git status` to determine which branch is active:

### Branch A: `dashboard-site` (Dynamic Dashboard Theme)
* **Logic**: Articles are loaded dynamically via JavaScript from a central data file (`data.js`).
* **Display**: Clicking a post card slides up a fullscreen overlay reader modal.

### Branch B: `creamy-blog-theme` (Classic Grid Theme)
* **Logic**: The landing page features a static grid of card modules in `index.html`.
* **Display**: Clicking a post card redirects to a standalone HTML page nested inside the `blogs/` directory.

---

## 2. Publishing Guide: Branch A (`dashboard-site`)

To add a new article to the dynamic dashboard:

1. Open [data.js](file:///e:/Codes/My%20website/data.js).
2. Append a new post object to the `blogData` array matching this schema:
   ```javascript
   {
     id: "blog-[post-slug]",
     title: "[Catchy, Elegant Post Title]",
     description: "[A concise 2-line summary of the post content]",
     category: "[Design | Coding | Lifestyle | Tech | Art]", // Choose one category
     date: "[Current Date, e.g. June 6, 2026]",
     readTime: "[X min read]",
     image: "[assets/image-name.png or external URL]",
     content: `
       <p>First paragraph text...</p>
       
       <h3>Subheading Title</h3>
       <p>Second paragraph text...</p>
       
       <blockquote>
         "A notable blockquote citation."
       </blockquote>
       
       <pre><code>// code blocks if any</code></pre>
     `
   }
   ```
3. Save the file. The dashboard scripts will automatically update the total counts, category filters, search keyword filters, and load the modal content when the card is clicked.

---

## 3. Publishing Guide: Branch B (`creamy-blog-theme`)

To add a new article to the classic grid layout:

### Step 1: Create the Article Folder and Files
1. Create a subdirectory: `blogs/[post-slug]/` (e.g. `blogs/clearlink/`).
2. Move any assets (images, drafts, SVGs) into this folder.
3. Create a new file: `blogs/[post-slug]/index.html`.

### Step 2: Structure the Post HTML (`blogs/[post-slug]/index.html`)
The post page must feature a **light-creamy theme** and a **Table of Contents (TOC) sidebar**. Use the following layout template:

* **Header/Typography**: Link `Sora` (for headers) and `Lora` (for body text).
* **Navigation Bar**: Include a sticky navigation bar with a `"← Back to home"` link pointing relatively to `../../index.html` and your site logo `pavn[x]et`.
* **Grid Layout (Desktop)**:
  - Create a two-column grid (`display: grid; grid-template-columns: 240px 1fr; gap: 60px;`).
  - **Left column**: A sticky Table of Contents sidebar. Use anchor tags matching section IDs:
    ```html
    <aside class="toc-sidebar">
      <div class="toc-card">
        <h3 class="toc-heading">Table of Contents</h3>
        <ul class="toc-list">
          <li><a href="#why-i-built-this" class="toc-link active">Why I Built This</a></li>
          <li><a href="#how-it-works" class="toc-link">How It Works</a></li>
        </ul>
      </div>
    </aside>
    ```
  - **Right column**: The main `<article>` element. Wrap individual sections in `<section id="why-i-built-this">` tags for targeting.
* **Responsive Layout (Mobile)**:
  - Under `900px` screen width, swap the two-column grid to a single column.
  - Convert the TOC sidebar into a **sticky horizontal scroll bar** that sits fixed at the top underneath the nav bar (`position: sticky; top: 61px; overflow-x: auto; white-space: nowrap;`). Style links as capsules.
* **Scroll Spy Feature**:
  - Include a script using `IntersectionObserver` at the bottom of the file to track which section is currently in the viewport and add an `.active` CSS class to the corresponding TOC link. On mobile, automatically scroll the active capsule into view.
* **Asset Pathing**: Ensure all asset paths are relative to the file location:
  - Avatar: `../../my logo .jpg`
  - Style link (if any): `../../style.css`
  - Page cover & embedded media: relative to the local folder (e.g., `clearlink.svg`).

### Step 3: Update the Homepage landing page (`index.html`)
1. Open the root [index.html](file:///e:/Codes/My%20website/index.html).
2. Go to `<div class="posts-grid" id="postsGrid">`.
3. Add a new card block. Use `onclick` for redirection to avoid breaking the CSS hover effects and grid:
   ```html
   <div class="card reveal" data-cat="[category]" onclick="window.location.href='blogs/[post-slug]/index.html'">
     <div class="card-img-wrap">
       <img src="blogs/[post-slug]/[image-name.jpg]" alt="Cover Image" loading="lazy">
     </div>
     <div class="card-body">
       <div class="card-top">
         <span class="tag [category]">[Category]</span>
         <span class="read-time">[X min]</span>
       </div>
       <h2 class="card-title">[Post Title]</h2>
       <p class="card-desc">[Short description text]</p>
       <div class="card-footer">
         <img class="avatar" src="my logo .jpg" alt="Logo">
         <div>
           <div class="author-name">pavn<span class="logo-x">x</span>et</div>
           <div class="card-date">[Date]</div>
         </div>
         <div class="card-arrow">→</div>
       </div>
     </div>
   </div>
   ```
4. Find the post counter in the hero section (`<div class="hero-count">...</div>`) and increment it by 1.

---

## 4. Design Guidelines (Both Themes)

* **Colors**: Stick to the warm creamy palette variables:
  - `--cream`: `#faf6f0` (Background)
  - `--cream2`: `#f4ede2` (Secondary backgrounds/accents)
  - `--cream3`: `#ecdfd0` (Borders/lines)
  - `--ink`: `#1e1a15` (Header text)
  - `--ink2`: `#4a4038` (Body text)
  - `--ink3`: `#8c7e6e` (Muted/meta details)
  - `--accent`: `#b07d4a` (Gold highlight)
* **Shadows**: Always tint box-shadows with a transparent warm brown or gold hue rather than pure black to prevent looking dirty. Example: `0 4px 20px rgba(160,120,70,0.08)`.
* **Animations**: Maintain smooth transition curves: `transition: all 0.25s cubic-bezier(.22,.68,0,1.1);`.
