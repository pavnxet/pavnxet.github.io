// ── Active Table of Contents Highlighter & Hash Handler ────
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".toc-link");
  const tocIds = Array.from(links).map(l => l.getAttribute("href").substring(1));
  const targets = tocIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  // ── Dynamic Overlay Injection ─────────────────────────────
  injectDynamicOverlays();

  if (links.length === 0 || targets.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: "-15% 0px -55% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        highlightTOC(id);
      }
    });
  }, observerOptions);

  targets.forEach(el => observer.observe(el));

  // Handle TOC highlight activation and scrolling
  function highlightTOC(id) {
    links.forEach(link => {
      if (link.getAttribute("href") === `#${id}`) {
        link.classList.add("active");
        
        // Auto scroll TOC horizontally on mobile
        if (window.innerWidth <= 900) {
          const tocList = document.querySelector(".toc-list");
          if (tocList) {
            const linkRect = link.getBoundingClientRect();
            const listRect = tocList.getBoundingClientRect();
            const scrollOffset = linkRect.left - listRect.left - (listRect.width / 2) + (linkRect.width / 2);
            tocList.scrollBy({ left: scrollOffset, behavior: "smooth" });
          }
        }
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Handle initial scroll position on page load with hashes
  if (window.location.hash) {
    const activeSectionId = window.location.hash.substring(1);
    const targetSection = document.getElementById(activeSectionId);
    if (targetSection) {
      highlightTOC(activeSectionId);
    }
  }
});

// ── Injects spotlight, scroll-progress, background blobs & FAB dynamically ──
function injectDynamicOverlays() {
  // 1. Scroll progress
  if (!document.getElementById('scrollProgress')) {
    const sp = document.createElement('div');
    sp.className = 'scroll-progress';
    sp.id = 'scrollProgress';
    document.body.prepend(sp);
  }
  
  // 2. Spotlight
  if (!document.getElementById('spotlight')) {
    const sl = document.createElement('div');
    sl.className = 'spotlight';
    sl.id = 'spotlight';
    document.body.prepend(sl);
  }

  // 3. Blob 1
  if (!document.querySelector('.blob-1')) {
    const b1 = document.createElement('div');
    b1.className = 'blob blob-1';
    document.body.prepend(b1);
  }

  // 4. Blob 2
  if (!document.querySelector('.blob-2')) {
    const b2 = document.createElement('div');
    b2.className = 'blob blob-2';
    document.body.prepend(b2);
  }

  // 5. FAB Back to Top
  if (!document.getElementById('fab')) {
    const fab = document.createElement('button');
    fab.className = 'fab';
    fab.id = 'fab';
    fab.setAttribute('aria-label', 'Back to top');
    fab.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`;
    fab.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
    document.body.prepend(fab);
  }

  // Initialize event handlers
  const spotlight = document.getElementById('spotlight');
  if (spotlight) {
    let spotlightVisible = false;
    document.addEventListener('mousemove', (e) => {
      spotlight.style.left = e.clientX + 'px';
      spotlight.style.top = e.clientY + 'px';
      if (!spotlightVisible) { spotlight.style.opacity = '1'; spotlightVisible = true; }
    });
    document.addEventListener('mouseleave', () => { spotlight.style.opacity = '0'; spotlightVisible = false; });
  }

  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    }, { passive: true });
  }

  const fab = document.getElementById('fab');
  if (fab) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) fab.classList.add('visible');
      else fab.classList.remove('visible');
    }, { passive: true });
  }
}
