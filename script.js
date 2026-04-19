// ChartShaala — interactions

// Sticky nav shadow
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile burger
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.classList.toggle('active');
  if (navLinks.classList.contains('open')) {
    Object.assign(navLinks.style, {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      background: 'rgba(5,8,13,0.98)',
      padding: '20px',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      gap: '14px'
    });
  } else {
    navLinks.style.cssText = '';
  }
});

// Reveal on scroll
const revealTargets = document.querySelectorAll(
  '.feature, .product, .learn-card, .testi, .blog-card, .step, .pc, .stat, .section-head'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealTargets.forEach(el => io.observe(el));

// Counter animation
const counters = document.querySelectorAll('[data-count]');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(target * eased);
      el.textContent = formatCount(val, target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = formatCount(target, target);
    };
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach(c => counterIO.observe(c));

function formatCount(v, target) {
  if (target >= 10000) return (v / 1000).toFixed(0) + 'K+';
  if (target === 500) return v + 'X';
  if (target === 99) return v + '%';
  return v.toLocaleString();
}

// Tilt effect on chart card
const tilt = document.querySelector('.tilt');
if (tilt) {
  const hero = document.querySelector('.hero-visual');
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.animation = 'none';
    tilt.style.transform = `rotateY(${-6 + x * 10}deg) rotateX(${4 - y * 10}deg) translateY(0)`;
  });
  hero.addEventListener('mouseleave', () => {
    tilt.style.animation = '';
    tilt.style.transform = '';
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Ticker: pause on hover
const ticker = document.querySelector('.ticker-track');
if (ticker) {
  ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
  ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
}

// Subtle live update to ticker values (cosmetic)
setInterval(() => {
  document.querySelectorAll('.tick b').forEach(b => {
    const cur = parseFloat(b.textContent.replace(/,/g, ''));
    if (isNaN(cur)) return;
    const delta = (Math.random() - 0.5) * cur * 0.001;
    const next = cur + delta;
    b.textContent = next.toLocaleString(undefined, { maximumFractionDigits: 2 });
  });
}, 4000);
