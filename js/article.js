// ── Active Table of Contents Highlighter & Hash Handler ────
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".toc-link");
  const tocIds = Array.from(links).map(l => l.getAttribute("href").substring(1));
  const targets = tocIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

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

  // Issue 1.5 Fix: Handle initial scroll position on page load with hashes
  if (window.location.hash) {
    const activeSectionId = window.location.hash.substring(1);
    const targetSection = document.getElementById(activeSectionId);
    if (targetSection) {
      highlightTOC(activeSectionId);
      // Let standard browser scroll behavior anchor, but update active TOC highlight
    }
  }
});
