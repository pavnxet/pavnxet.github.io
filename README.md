# pavnxet.github.io Dashboard

This is my personal dashboard and portfolio site built with Vite, React, TypeScript, and HeroUI.

## Features

- **Live GitHub Sync**: Automatically fetches your profile and calculates total stars from your repositories using the GitHub API.
- **Sidebar**: Displays dynamic GitHub analytics with smooth skeleton loading states.
- **Projects**: Links to my deployed projects and their source code.
- **Music Player**: A sleek, built-in music player supporting various formats like `.mp3` and `.flac`.
- **Mini Games**: A dedicated zone featuring interactive games like **Tic-Tac-Toe** and **Snake**.

## How to Manage Content

All static data is managed in `src/data/index.ts`, while profile analytics are fetched dynamically.

### Synchronizing Your GitHub Profile

The dashboard automatically syncs profile data using the GitHub API. To change the user:
1. Open `src/data/index.ts`.
2. Update the `username` field in the `githubData` object:
   ```typescript
   export const githubData = {
     username: "YOUR_GITHUB_USERNAME", // Data will sync automatically!
     // other fields act as defaults while loading
   };
   ```
3. The dashboard will fetch followers, following, public repos, and calculate **Total Stars** across all public repositories.

### Adding or Updating Projects

1. Open `src/data/index.ts`.
2. Locate the `projects` array and add/edit an object:
   ```typescript
   {
     id: 4,
     title: "Project Name",
     description: "Brief description.",
     url: "https://deployed-link.com",
     github: "https://github.com/pavnxet/repo-name",
     tags: ["React", "HeroUI"],
   }
   ```

### Adding New Songs

1. Place your audio file (`.mp3`, `.flac`, etc.) inside the `public/songs/` directory.
2. Open `src/data/index.ts`.
3. Update the `songs` array:
   ```typescript
   {
     id: 1,
     title: "Song Name",
     artist: "Artist Name",
     file: "/songs/your-song-file.mp3",
     cover: "URL_TO_COVER_IMAGE",
   }
   ```

## Mini Games

Challenge yourself in the **Games** tab:
- **Tic-Tac-Toe**: A classic strategy game for quick sessions.
- **Snake**: Use your **Keyboard Arrow Keys** to move and eat food to grow. Press **Space** to pause/resume.

## Deployment

This project is optimized for both **GitHub Pages** and **Vercel**.
- **Vercel**: Simply connect your repository to Vercel. A `vercel.json` is provided for automatic routing.
- **GitHub Pages**: Handled automatically via the `.github/workflows/deploy.yml` on every push to `main`.

## Development Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the local server.
4. Run `npm run build` to create a production build.
