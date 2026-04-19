// ===================================================
// ChartShaala — Advanced interactions
// ===================================================

// --- Scroll progress bar ---
const progress = document.getElementById('scrollProgress');
if (progress) {
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    progress.style.width = pct + '%';
  }, { passive: true });
}

// --- Custom cursor: glow + dot + ring trail ---
const cursor = document.getElementById('cursor');
const cDot = document.getElementById('cursorDot');
const cRing = document.getElementById('cursorRing');
if (cursor && !matchMedia('(pointer: coarse)').matches) {
  let tx = 0, ty = 0, gx = 0, gy = 0, dx = 0, dy = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
  (function tick() {
    gx += (tx - gx) * 0.18;
    gy += (ty - gy) * 0.18;
    dx += (tx - dx) * 0.55;
    dy += (ty - dy) * 0.55;
    rx += (tx - rx) * 0.15;
    ry += (ty - ry) * 0.15;
    cursor.style.transform = `translate(${gx}px, ${gy}px) translate(-50%,-50%)`;
    if (cDot) cDot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
    if (cRing) cRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(tick);
  })();
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    if (cDot) cDot.style.opacity = '0';
    if (cRing) cRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    if (cDot) cDot.style.opacity = '1';
    if (cRing) cRing.style.opacity = '1';
  });
  // Ring grows on interactive elements
  document.querySelectorAll('a, button, .tilt-card, .sc-tab, details summary').forEach(el => {
    el.addEventListener('mouseenter', () => cRing?.classList.add('hover'));
    el.addEventListener('mouseleave', () => cRing?.classList.remove('hover'));
  });
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
  }, { passive: true });
}

// --- Floating particles in hero ---
const particleHost = document.getElementById('particles');
if (particleHost && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const count = window.innerWidth < 640 ? 18 : 36;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size = 2 + Math.random() * 4;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = (Math.random() * -15) + 's';
    p.style.opacity = (0.3 + Math.random() * 0.5).toString();
    if (Math.random() > 0.7) p.style.background = '#c8d1dc';
    particleHost.appendChild(p);
  }
}

// --- Title blur-to-clear reveal for section headings ---
document.querySelectorAll('.sec-title, .fc-box h2').forEach(title => {
  const html = title.innerHTML;
  // Split on top-level text nodes while keeping existing <span class="grad-green"> spans intact
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  const parts = [];
  wrap.childNodes.forEach(node => {
    if (node.nodeType === 3) {
      node.textContent.split(/(\s+)/).forEach(w => {
        if (w.trim()) parts.push(`<span class="word">${w}</span>`);
        else if (w.length) parts.push(w);
      });
    } else {
      const t = node.textContent || '';
      const clone = node.cloneNode(false);
      const cls = (node.className || '') + ' word';
      clone.className = cls.trim();
      clone.textContent = t;
      parts.push(clone.outerHTML);
    }
  });
  title.innerHTML = parts.join('');
  title.classList.add('title-fx');
});

const titleIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const title = e.target;
      title.classList.add('in');
      const words = title.querySelectorAll('.word');
      words.forEach((w, i) => w.style.transitionDelay = (i * 70) + 'ms');
      titleIO.unobserve(title);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.title-fx').forEach(t => titleIO.observe(t));

// --- Button ripple click effect ---
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const r = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(r.width, r.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - r.left) + 'px';
    ripple.style.top = (e.clientY - r.top) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// --- Live price ticker: simulate updates with flash ---
function tickPriceStrip() {
  document.querySelectorAll('.pstick em').forEach(em => {
    const cur = parseFloat(em.dataset.val);
    if (isNaN(cur)) return;
    const direction = Math.random() > 0.5 ? 1 : -1;
    const delta = direction * cur * (Math.random() * 0.003);
    const next = cur + delta;
    em.dataset.val = next.toFixed(cur > 100 ? 2 : 4);
    em.textContent = parseFloat(em.dataset.val).toLocaleString(undefined, {
      maximumFractionDigits: cur > 100 ? 2 : 4
    });
    em.classList.remove('flash-up', 'flash-down');
    void em.offsetWidth;
    em.classList.add(direction > 0 ? 'flash-up' : 'flash-down');
    em.classList.toggle('up', direction > 0);
    em.classList.toggle('down', direction < 0);
  });
}
setInterval(tickPriceStrip, 2500);

// --- Sparkle burst on CTA primary button hover (first time) ---
function sparkle(btn) {
  const r = btn.getBoundingClientRect();
  const n = 8;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    const angle = (i / n) * Math.PI * 2;
    const dist = 40 + Math.random() * 40;
    s.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    s.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    s.style.left = '50%';
    s.style.top = '50%';
    btn.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
}
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.style.position = 'relative';
  let armed = true;
  btn.addEventListener('mouseenter', () => {
    if (!armed) return;
    armed = false;
    sparkle(btn);
    setTimeout(() => { armed = true; }, 1200);
  });
});

// --- Glow follow on glow-aura cards (mouse-position gradient) ---
document.querySelectorAll('.glow-aura').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    card.style.setProperty('--gx', x + '%');
    card.style.setProperty('--gy', y + '%');
  });
});

// --- Nav link active state based on section in view ---
const navLinksList = document.querySelectorAll('.nav-link');
const sections = Array.from(document.querySelectorAll('section[id]'));
if (sections.length && navLinksList.length) {
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = '#' + e.target.id;
        navLinksList.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => navIO.observe(s));
}
