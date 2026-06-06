# Creamy Dashboard Portfolio & Blog 🌾

A highly aesthetic, premium single-page dashboard portfolio and blog designed for hosting on **GitHub Pages**. Features a light creamy theme, typography inspired by Microsoft Copilot, responsive page layouts, dynamic project filtering, search controls, and a slide-out blog reader.

---

## 🎨 Visual Features

- **Creamy Design System**: Built with CSS custom variables using warm sand, alabaster cream, and muted cocoa hues.
- **Dynamic Content Loading**: Projects and blog posts are loaded dynamically from a simple data layer (`data.js`) without heavy frameworks.
- **Card Showcase**: Rounded layouts displaying tag badges, interactive progress, live links, and image overlays.
- **All-Rounder Blog Feed**: Search bar filtering and category selectors, leading to a slide-up, distraction-free reader screen.
- **Device Responsiveness**: Automatically morphs into a mobile-native bottom tabbed dashboard for smaller screens.

---

## 🛠️ Tech Stack

- **Core**: HTML5, Vanilla JavaScript
- **Styling**: Vanilla CSS3 (CSS Grid, Nesting, Flexbox, custom tinted box shadows)
- **Typography**: Google Font *Outfit* (fallback to *Segoe UI*)
- **Icons**: Hand-picked Feather-style SVG components

---

## 🚀 Easy Deployment to GitHub Pages

To host this website on your GitHub Pages domain (`https://pavnxet.github.io`):

1. **Configure Repository Settings**:
   - Go to your repository **[pavnxet.github.io](https://github.com/pavnxet/pavnxet.github.io)** on GitHub.
   - Click on the **Settings** tab.
   - Select **Pages** from the left-hand navigation menu under *Code and automation*.

2. **Select Build and Deployment**:
   - Under **Build and deployment -> Source**, select **Deploy from a branch**.
   - Under **Branch**, click the dropdown and choose the default branch: `main3.0`.
   - Select `/ (root)` folder, then click **Save**.

Within a few minutes, GitHub Actions will compile your build and launch it live!

---

## ✏️ Customizing Your Content

All data is structured cleanly inside **`data.js`**:

- To update active projects, append or edit items inside the `projectsData` array.
- To write new blog posts (supporting formatted HTML paragraphs, blockquotes, and code snippets), edit elements in the `blogData` array.
- Profile settings, avatars, and bio details can be updated directly inside `index.html`.
