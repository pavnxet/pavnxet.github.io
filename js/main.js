// ── Featured layout is authored in index.html (first card = .featured-card).
// Cards are kept in newest-first order by hand. Do NOT re-sort at runtime
// (avoids layout shift / FOUC and keeps the authored layout authoritative).
document.addEventListener('DOMContentLoaded', () => {
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
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.remove('on');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('on');
  btn.setAttribute('aria-pressed', 'true');

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

// ── Newsletter signup (Formspree backend, configured via data-endpoint) ──
document.addEventListener('DOMContentLoaded', () => {
  const nlForm = document.querySelector('.nl-form');
  const nlBtn = document.querySelector('.nl-btn');
  const nlInput = document.querySelector('.nl-input');
  const nlStatus = document.querySelector('.nl-status');
  if (!nlForm || !nlBtn || !nlInput) return;

  const endpoint = (nlForm.dataset.endpoint || '').trim();
  if (!endpoint) {
    // Honest placeholder until the owner pastes a Formspree form ID.
    nlBtn.textContent = 'Coming soon';
    nlBtn.disabled = true;
    nlInput.disabled = true;
    nlInput.placeholder = 'Newsletter coming soon';
    return;
  }

  nlForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = nlInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      nlInput.style.borderColor = '#b04a2e'; // Error red from design tokens
      if (nlStatus) nlStatus.textContent = 'Please enter a valid email.';
      setTimeout(() => nlInput.style.borderColor = '', 1200);
      return;
    }
    nlBtn.disabled = true;
    nlBtn.textContent = 'Subscribing…';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, _gotcha: nlForm.querySelector('.nl-honeypot')?.value || '' })
      });
      if (!res.ok) throw new Error('signup failed');
      nlBtn.textContent = 'You\'re in ✓';
      nlBtn.style.background = '#4e7e5c'; // Success green from design tokens
      if (nlStatus) nlStatus.textContent = 'Thanks — check your inbox to confirm.';
      nlInput.value = '';
      nlInput.disabled = true;
    } catch {
      nlBtn.disabled = false;
      nlBtn.textContent = 'Subscribe';
      if (nlStatus) nlStatus.textContent = 'Something went wrong — try again later.';
    }
  });

  // ── Filter buttons (bound here; no inline onclick) ──────
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => filterPosts(btn.dataset.filter, btn));
  });

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