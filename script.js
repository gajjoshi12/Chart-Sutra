// ===================================================
// ChartShaala — Advanced interactions
// ===================================================

// --- Custom cursor glow ---
const cursor = document.getElementById('cursor');
if (cursor && !matchMedia('(pointer: coarse)').matches) {
  let tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
  (function tick() {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(tick);
  })();
  document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
  document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
}

// --- Sticky nav shadow ---
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 20);
});

// --- Mobile burger ---
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('active');
  if (open) {
    Object.assign(navLinks.style, {
      display: 'flex', flexDirection: 'column',
      position: 'absolute', top: '100%', left: 0, right: 0,
      background: 'rgba(5,8,16,0.98)', padding: '22px',
      borderBottom: '1px solid rgba(255,255,255,0.08)', gap: '16px',
      backdropFilter: 'blur(20px)', fontSize: '15px',
      maxHeight: 'calc(100vh - 80px)', overflowY: 'auto',
      zIndex: '99'
    });
  } else navLinks.style.cssText = '';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 900 && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      burger.classList.remove('active');
      navLinks.style.cssText = '';
    }
  });
});

// Reset mobile menu styles when resizing back to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 900 && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    burger?.classList.remove('active');
    navLinks.style.cssText = '';
  }
});

// --- Smooth scroll ---
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

// --- Scroll reveals ---
const revealTargets = document.querySelectorAll(
  '.market-card, .sc-tab, .showcase-display, .feat-row, .stat-item, .howit-step, .sb, .testi-card, .pricing-table, .dl-btn, .section-head, .fr-art, .shield-3d'
);
revealTargets.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
revealTargets.forEach(el => io.observe(el));

// --- Counter animation ---
const counters = document.querySelectorAll('[data-count]');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const duration = 2000;
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
  if (target === 99) return v;
  if (target === 24) return v;
  return v.toLocaleString();
}

// --- Market card tilt + glow ---
document.querySelectorAll('.tilt-card').forEach(card => {
  const glow = card.querySelector('.mc-glow');
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -8;
    const ry = ((x / r.width) - 0.5) * 8;
    card.style.transform = `translateY(-6px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    if (glow) {
      glow.style.setProperty('--mx', `${x}px`);
      glow.style.setProperty('--my', `${y}px`);
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// --- Hero phone mouse tilt ---
const phone = document.getElementById('phoneTilt');
const heroVisual = document.getElementById('heroVisual');
if (phone && heroVisual) {
  heroVisual.addEventListener('mousemove', (e) => {
    const r = heroVisual.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    phone.style.animation = 'none';
    phone.style.transform = `rotateY(${-8 + x * 12}deg) rotateX(${6 - y * 12}deg) translateY(0)`;
  });
  heroVisual.addEventListener('mouseleave', () => {
    phone.style.animation = '';
    phone.style.transform = '';
  });
}

// --- Magnetic buttons ---
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

// --- Showcase tabs ---
const tabs = document.querySelectorAll('.sc-tab');
const panels = document.querySelectorAll('.display-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const name = tab.dataset.tab;
    tabs.forEach(t => t.classList.toggle('active', t === tab));
    panels.forEach(p => p.classList.toggle('active', p.dataset.panel === name));
  });
});

// Auto-rotate showcase tabs
let tabIdx = 0;
let tabTimer = setInterval(autoTab, 4200);
function autoTab() {
  tabIdx = (tabIdx + 1) % tabs.length;
  tabs[tabIdx].click();
}
document.querySelector('.showcase-wrap')?.addEventListener('mouseenter', () => clearInterval(tabTimer));

// --- Testimonial carousel ---
const carousel = document.getElementById('testiCarousel');
if (carousel) {
  const track = carousel.querySelector('.tc-track');
  const prev = carousel.querySelector('.prev');
  const next = carousel.querySelector('.next');
  let idx = 0;
  const slides = track.children.length;

  const visibleCount = () => {
    if (window.innerWidth <= 900) return 1;
    if (window.innerWidth <= 1100) return 2;
    return 3;
  };

  const update = () => {
    const visible = visibleCount();
    const maxIdx = Math.max(0, slides - visible);
    if (idx > maxIdx) idx = maxIdx;
    if (idx < 0) idx = 0;
    const slide = track.children[0];
    const w = slide.offsetWidth + 24;
    track.style.transform = `translateX(${-idx * w}px)`;
  };

  prev.addEventListener('click', () => { idx--; update(); });
  next.addEventListener('click', () => { idx++; update(); });
  window.addEventListener('resize', update);

  let auto = setInterval(() => {
    const visible = visibleCount();
    const maxIdx = Math.max(0, slides - visible);
    idx = idx >= maxIdx ? 0 : idx + 1;
    update();
  }, 5500);
  carousel.addEventListener('mouseenter', () => clearInterval(auto));
  update();
}

// --- FAQ: close others on open ---
document.querySelectorAll('.faq-list details').forEach(d => {
  d.addEventListener('toggle', () => {
    if (d.open) {
      document.querySelectorAll('.faq-list details').forEach(o => { if (o !== d) o.open = false; });
    }
  });
});

// --- Speed bars fill on reveal ---
const speedBars = document.querySelector('.as-bars');
if (speedBars) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        speedBars.querySelectorAll('i').forEach(i => {
          const h = i.style.height;
          i.style.height = '0%';
          requestAnimationFrame(() => { i.style.height = h; });
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  obs.observe(speedBars);
}

// --- Live ticker updates on hero (cosmetic) ---
setInterval(() => {
  const price = document.querySelector('.ps-symbol .ps-price b');
  if (!price) return;
  const cur = parseFloat(price.textContent.replace(/,/g, ''));
  if (isNaN(cur)) return;
  const delta = (Math.random() - 0.45) * cur * 0.0005;
  const next = cur + delta;
  price.textContent = next.toLocaleString(undefined, { maximumFractionDigits: 2 });
}, 3000);

// --- Parallax hero glow ---
const heroGlow = document.querySelector('.hero-glow');
if (heroGlow) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < 800) heroGlow.style.transform = `translate(-50%,calc(-50% + ${y * 0.3}px))`;
  });
}
