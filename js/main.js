// ── Scroll reveal ─────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => obs.observe(el));

// ── Filter ────────────────────────────────────────────────
function filterPosts(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');

  const cards = document.querySelectorAll('#postsGrid [data-cat]');
  cards.forEach((card, i) => {
    const match = cat === 'all' || card.dataset.cat === cat;
    card.style.transition = 'opacity 0.3s, transform 0.3s';
    if (match) {
      card.style.display = '';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = '';
      }, i * 40);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(8px)';
      setTimeout(() => card.style.display = 'none', 300);
    }
  });
}

// ── Newsletter button ────────────────────────────────────
document.querySelector('.nl-btn').addEventListener('click', function() {
  const input = document.querySelector('.nl-input');
  if (input.value.includes('@')) {
    this.textContent = 'You\'re in ✓';
    this.style.background = '#4a7c59';
    input.value = '';
    input.disabled = true;
    input.disabled = true;
    this.disabled = true;
  } else {
    input.style.borderColor = '#c06020';
    setTimeout(() => input.style.borderColor = '', 1200);
  }
});

// ── Nav Active States & Scroll Observer ──────────────────
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
navLinks.forEach(link => {
  link.addEventListener('click', function() {
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

window.addEventListener('scroll', () => {
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
});