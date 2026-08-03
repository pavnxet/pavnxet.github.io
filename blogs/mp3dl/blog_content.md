# 🎵 MP3.pm Automated Downloader Hub

A high-performance, serverless edge utility deployed on **Cloudflare Workers** designed to automate search scraping, metadata cleaning, song deduplication, and bulk downloading from `mp3.pm`. 

It provides a sleek, modern glassmorphism web dashboard with native support for multi-page AJAX scraping, dynamic source links, and 1-click batch download automation via native scripts (`.bat`) or URL manifests (`.txt`).

* 🌐 **Live Demo:** [https://mp3dl.pavneet1804.workers.dev/](https://mp3dl.pavneet1804.workers.dev/)
* 📦 **GitHub Repository:** [https://github.com/pavnxet/mp3dl](https://github.com/pavnxet/mp3dl)

---

## ✨ Features

* 🚀 **Serverless Edge Architecture:** Built on Cloudflare Workers for ultra-fast performance, low latency, and global routing.
* 🎨 **Glassmorphism UI Dashboard:** Clean, responsive, dark-mode single-page application embedded directly within the Worker binary.
* 🔍 **Multi-Page Search Scraper:** Seamlessly scrapes up to 25 pages of search results per query, processing dynamic subdomain routing (`s-[slug].mp3.pm`) and AJAX pagination.
* 🧹 **Metadata Sanitization:** Automatically parses HTML entities (`&amp;`, `&#039;`, etc.) and strips illegal filesystem characters (`/ \ ? % * : | " < >`) to guarantee clean track titles and artist names.
* 🛡️ **Smart Deduplication Engine:** Filters out duplicate tracks in real-time across two layers:
  * **URL Filtering:** Ignores duplicate direct audio stream links.
  * **Metadata Signatures:** Normalizes artist and title strings, removing parenthetical noise like `(Remastered)`, `(Live)`, or spaces to ensure each song appears only once.
* 📥 **Choke-Free Bulk Downloading:** Avoids browser tab crashes and memory chokepoints by offering 1-click export tools:
  * **Windows Batch Script (`.bat`):** Downloads all tracks sequentially into a dedicated folder using native `curl`.
  * **Link Manifest (`.txt`):** Generates a plain text URL list for direct import into external managers like **IDM**, **aria2**, or **JDownloader**.
* 🔗 **Direct Source Navigation:** Includes quick-access navigation buttons to visit `https://mp3.pm/`, view the original query page, or open raw source URLs for individual tracks.
* 🛡️ **Proxy & CORS Handler:** Proxies audio streams to attach proper `Content-Disposition` headers, enforcement of custom `.mp3` filenames, and full CORS accessibility.

---

## 🛠️ System Architecture

```
                              ┌────────────────────────┐
                              │      User Browser      │
                              └───────────┬────────────┘
                                          │
                                          │ HTTP Requests
                                          ▼
                             ┌──────────────────────────┐
                             │ Cloudflare Worker Proxy  │
                             └────────────┬─────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  │                                               │
                  ▼                                               ▼
 ┌─────────────────────────────────┐             ┌─────────────────────────────────┐
 │      Multi-Page Scraper        │             │      Audio Proxy Handler        │
 │  - Subdomain Slug Routing       │             │  - Bypasses Hotlink Locks       │
 │  - AJAX HTML Stream Fetching    │             │  - Forces Custom Filenames      │
 │  - 2-Layer Deduplication Engine │             │  - Streaming Audio Response     │
 └────────────────┬────────────────┘             └────────────────┬────────────────┘
                  │                                               │
                  ▼                                               ▼
         ┌─────────────────┐                             ┌─────────────────┐
         │    mp3.pm CDN   │                             │ Raw MP3 Stream  │
         └─────────────────┘                             └─────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher)
* [npm](https://www.npmjs.com/)
* [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation & Deployment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pavnxet/mp3dl.git
   cd mp3dl
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure `wrangler.json` (or `wrangler.toml`):**
   Ensure your configuration file is properly initialized:
   ```json
   {
     "name": "mp3pm-downloader-hub",
     "main": "worker.js",
     "compatibility_date": "2026-08-01"
   }
   ```

4. **Local Development Test:**
   Run the local development server to test functionality:
   ```bash
   npx wrangler dev
   ```
   Open `http://localhost:8787` in your browser.

5. **Deploy to Cloudflare Workers:**
   ```bash
   npx wrangler deploy
   ```

---

## 📡 API Endpoints

### 1. Serve Dashboard

* **Endpoint:** `GET /`
* **Description:** Renders the embedded Glassmorphism SPA dashboard interface.

---

### 2. Multi-Page Search Scraper

* **Endpoint:** `GET /api/search`
* **Query Parameters:**
  * `q` *(required)*: Search term (e.g., `ghulam ali`)
  * `pages` *(optional)*: Number of pages to scrape (default: `5`, max: `25`)

* **Response Example:**
  ```json
  {
    "query": "ghulam ali",
    "count": 2,
    "tracks": [
      {
        "url": "https://mp3.pm/download/12345678/track.mp3",
        "artist": "Ghulam Ali",
        "title": "Hungama Hai Kyun Barpa",
        "filename": "Ghulam Ali - Hungama Hai Kyun Barpa.mp3"
      },
      {
        "url": "https://mp3.pm/download/87654321/track2.mp3",
        "artist": "Ghulam Ali",
        "title": "Chupke Chupke Raat Din",
        "filename": "Ghulam Ali - Chupke Chupke Raat Din.mp3"
      }
    ]
  }
  ```

---

### 3. Audio Proxy & Filename Enforcer

* **Endpoint:** `GET /api/download`
* **Query Parameters:**
  * `url` *(required)*: Direct audio stream URL.
  * `name` *(optional)*: Desired output filename (e.g., `Artist - Title.mp3`).

* **Headers Injected:**
  * `Content-Type: audio/mpeg`
  * `Content-Disposition: attachment; filename="Artist - Title.mp3"`
  * `Access-Control-Allow-Origin: *`

---

## 🔍 How Deduplication Works

To eliminate duplicate recordings, identical remasters, and repeated tracks across multiple scraped pages, the Worker runs a **Two-Layer Deduplication Check**:

1. **URL Check:** Matches raw download endpoint links to prevent indexing the exact same server resource twice.
2. **Metadata Signature Check:**
   * Removes punctuation, special characters, and converts metadata to lowercase.
   * Strips secondary tags like `(Remastered 2020)`, `(Live)`, or `(Bonus Track)`.
   * Constructs a unique signature string: `${artist}_${title}`.
   * Filters out any subsequent track matching an existing signature key.

---

## 📥 Batch Downloading Guide

Downloading 50+ songs simultaneously in a web browser often triggers pop-up blocks or freezes tab memory. This project solves this using external batch management:

### Method 1: Using Windows Batch Script (`.bat`)

1. Perform your search in the dashboard.
2. Click **"Download Script (.bat)"**.
3. Move the downloaded `download_all_songs.bat` file to the directory where you want your music saved.
4. Double-click the `.bat` file. A terminal window will open and download all `.mp3` files sequentially with proper metadata filenames using native Windows `curl`.

### Method 2: Using External Download Managers (IDM / JDownloader)

1. Perform your search in the dashboard.
2. Click **"Export Links (.txt)"**.
3. Open your download manager (e.g., **Internet Download Manager**).
4. Select **Tasks -> Import -> From text file** and choose `download_links.txt`.
5. Start batch download at full bandwidth speed.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
