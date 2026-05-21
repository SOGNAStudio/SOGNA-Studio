/* ============================================================
   COIFFEUR ZÜRICH — script.js
   Navigation, Carousels, Animationen, Before/After
   ============================================================ */

// ── ACTIVE NAV LINK ──
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const hash = window.location.hash;
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  navLinks.forEach(link => {
    link.classList.remove('active');
  });

  let activeLink = null;
  if (hash) {
    activeLink = document.querySelector(`.nav-links a[href="${page}${hash}"], .mobile-nav a[href="${page}${hash}"], .nav-links a[href="${hash}"], .mobile-nav a[href="${hash}"]`);
  }
  if (!activeLink) {
    activeLink = document.querySelector(`.nav-links a[href="${page}"], .mobile-nav a[href="${page}"]`);
  }
  if (!activeLink && page === 'index.html') {
    activeLink = document.querySelector('.nav-links a[href="index.html"], .mobile-nav a[href="index.html"]');
  }
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

// ── STICKY HEADER ──
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
      header.classList.remove('dark-bg');
    } else {
      header.classList.remove('scrolled');
      header.classList.add('dark-bg');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── HAMBURGER ──
function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!btn || !mobileNav) return;
  btn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const spans = btn.querySelectorAll('span');
    if (mobileNav.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
    }
  });
}

// ── SCROLL FADE-UP ANIMATION ──
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ── ACTIVE NAV ON SCROLL (for hash links) ──
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], div[id]');
  if (!sections.length) return;

  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `index.html#${currentSection}` || href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

// ── CAROUSEL ──
function initCarousel(wrapId, prevId, nextId, dotsId) {
  const wrap = document.getElementById(wrapId);
  const track = wrap ? wrap.querySelector('.carousel-track') : null;
  if (!track) return;

  const cards = track.querySelectorAll('.carousel-card');
  const cardW = 280 + 24; // width + gap
  let current = 0;

  const visibleCount = () => Math.floor(wrap.offsetWidth / cardW) || 1;
  const maxIndex = () => Math.max(0, cards.length - visibleCount());

  const goTo = (idx) => {
    current = Math.max(0, Math.min(idx, maxIndex()));
    track.style.transform = `translateX(-${current * cardW}px)`;
    if (dotsId) updateDots(dotsId, current, cards.length, visibleCount());
  };

  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Dots
  if (dotsId) buildDots(dotsId, cards.length, visibleCount(), (i) => goTo(i));

  // Auto
  const autoId = setInterval(() => goTo(current >= maxIndex() ? 0 : current + 1), 5000);
  wrap.addEventListener('mouseenter', () => clearInterval(autoId));
}

function buildDots(containerId, total, visible, onClick) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  const pages = Math.ceil(total / visible);
  for (let i = 0; i < pages; i++) {
    const btn = document.createElement('button');
    btn.className = 'dot' + (i === 0 ? ' active' : '');
    btn.onclick = () => { onClick(i); updateDots(containerId, i, total, visible); };
    el.appendChild(btn);
  }
}

function updateDots(containerId, current, total, visible) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const pages = Math.ceil(total / visible);
  el.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === Math.min(current, pages - 1));
  });
}

// ── BOOKING FORM ──
function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Anfrage gesendet – wir melden uns bald!';
    btn.style.background = '#8A6B38';
    btn.disabled = true;

    // Show success
    const success = document.getElementById('booking-success');
    if (success) {
      success.style.display = 'block';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

// ── CONTACT FORM ──
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', () => {
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Nachricht gesendet ✓';
    btn.style.background = '#8A6B38';
    btn.disabled = true;
  });
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initHeader();
  initHamburger();
  setTimeout(initScrollReveal, 100);
  initScrollSpy();
  initBookingForm();
  initContactForm();

  // Carousels (IDs from produkte.html)
  initCarousel('car-styles', 'car-styles-prev', 'car-styles-next', 'car-styles-dots');
  initCarousel('car-cuts', 'car-cuts-prev', 'car-cuts-next', 'car-cuts-dots');
  initCarousel('car-color', 'car-color-prev', 'car-color-next', 'car-color-dots');
});


document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const form = e.target;

  const data = {
    vorname: form.vorname.value,
    nachname: form.nachname.value,
    email: form.email.value,
    telefon: form.telefon.value,
    betreff: form.betreff.value,
    nachricht: form.nachricht.value,
  };

  try {
    const response = await fetch('https://flat-feather-f3d6.sogna-studio.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert('Nachricht erfolgreich gesendet!');
      form.reset();
    } else {
      alert('Fehler beim Senden.');
    }
  } catch (error) {
    alert('Serverfehler.');
  }
});


