// ── Card Sorting & Layout Automation ──────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const postsGrid = document.getElementById('postsGrid');
  if (postsGrid) {
    const cards = Array.from(postsGrid.querySelectorAll('.card, .featured-card'));
    
    // Sort cards by date descending
    cards.sort((a, b) => {
      const dateAEl = a.querySelector('.card-date');
      const dateBEl = b.querySelector('.card-date');
      const dateA = dateAEl ? new Date(dateAEl.textContent.trim()) : new Date(0);
      const dateB = dateBEl ? new Date(dateBEl.textContent.trim()) : new Date(0);
      return dateB - dateA;
    });
    
    // Re-append cards to grid in sorted order with updated classes
    cards.forEach((card, index) => {
      // Reset classes
      card.classList.remove('card', 'featured-card', 'reveal');
      
      // Assign appropriate layout type based on index (newest first is horizontal)
      if (index === 0) {
        card.className = 'featured-card reveal';
      } else {
        card.className = 'card reveal';
      }
      
      postsGrid.appendChild(card);
    });
  }

  // ── Dynamic Post Count & Animated Counter ─────────────────
  const heroCount = document.getElementById('heroCount');
  if (heroCount) {
    const count = document.querySelectorAll('.card, .featured-card').length;
    heroCount.setAttribute('data-counter', count);
    animateCounter(heroCount);
  }

  // ── Scroll Reveal Intersection Observer ───────────────────
  const revealEls = document.querySelectorAll('.reveal');
  let revealCount = 0;
  let revealTimeout;
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const currentReveal = revealCount++;
        setTimeout(() => {
          e.target.classList.add('visible');
          // If the element has a counter child, animate it when revealed
          e.target.querySelectorAll('.counter').forEach(animateCounter);
        }, currentReveal * 60);
        revealObs.unobserve(e.target);
        
        clearTimeout(revealTimeout);
        revealTimeout = setTimeout(() => { revealCount = 0; }, 300);
      }
    });
  }, { threshold: 0.08 });
  revealEls.forEach(el => revealObs.observe(el));

  // === Ripple effect on every .btn ===
  document.querySelectorAll('.btn, .nl-btn, .filter-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // === Cursor spotlight ===
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

  // === Scroll progress bar ===
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    }, { passive: true });
  }

  // === FAB back-to-top ===
  const fab = document.getElementById('fab');
  if (fab) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) fab.classList.add('visible');
      else fab.classList.remove('visible');
    }, { passive: true });
  }
});

// ── Animated Counter Helper Function ─────────────────────
function animateCounter(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';
  const target = parseFloat(el.dataset.counter);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const start = performance.now();
  
  function format(v) {
    return prefix + v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
  }
  
  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3); // cubic ease out
    el.textContent = format(target * eased);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = format(target);
  }
  requestAnimationFrame(step);
}

// ── Filter with Race Condition Mitigation ────────────────
let filterTimeouts = [];
function filterPosts(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');

  // Cancel all pending card transition timeouts
  filterTimeouts.forEach(t => clearTimeout(t));
  filterTimeouts = [];

  const cards = document.querySelectorAll('#postsGrid [data-cat]');
  cards.forEach((card, i) => {
    const match = cat === 'all' || card.dataset.cat === cat;
    card.style.transition = 'opacity 0.3s, transform 0.3s';
    if (match) {
      card.style.display = '';
      const t = setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = '';
      }, i * 40);
      filterTimeouts.push(t);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(8px)';
      const t = setTimeout(() => card.style.display = 'none', 300);
      filterTimeouts.push(t);
    }
  });
}

// ── Newsletter button with Regex Validation ──────────────
document.addEventListener('DOMContentLoaded', () => {
  const nlBtn = document.querySelector('.nl-btn');
  const nlInput = document.querySelector('.nl-input');
  if (nlBtn && nlInput) {
    nlBtn.addEventListener('click', function() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(nlInput.value.trim())) {
        this.textContent = 'You\'re in ✓';
        this.style.background = '#4e7e5c'; // Success green from design tokens
        nlInput.value = '';
        nlInput.disabled = true;
        this.disabled = true;
      } else {
        nlInput.style.borderColor = '#b04a2e'; // Error red from design tokens
        setTimeout(() => nlInput.style.borderColor = '', 1200);
      }
    });
  }

  // ── Nav Active States & Scroll Observer (Throttled) ──────
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        let current = 'top';
        const scrollPos = window.scrollY + 120;
        
        const aboutEl = document.getElementById('about');
        const writingEl = document.getElementById('writing');
        
        if (aboutEl && scrollPos >= aboutEl.offsetTop) {
          current = 'about';
        } else if (writingEl && scrollPos >= writingEl.offsetTop) {
          current = 'writing';
        }
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          const href = link.getAttribute('href');
          if ((current === 'top' && (href === '#' || href === '#top')) || href === '#' + current) {
            link.classList.add('active');
          }
        });
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  // ── Mobile Navigation Toggle ──────────────────────────────
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksList = document.querySelector('.nav-links');
  
  if (navToggle && navLinksList) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navToggle.classList.toggle('active');
      navLinksList.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinksList.contains(e.target)) {
        navToggle.classList.remove('active');
        navLinksList.classList.remove('active');
      }
    });

    // Close menu when clicking any nav link
    navLinksList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinksList.classList.remove('active');
      });
    });
  }
});