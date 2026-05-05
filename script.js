/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const cursor = document.getElementById('cursor');

let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%,-50%) scale(1.8)');
document.addEventListener('mouseup',   () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');

/* ============================================================
   THEME SWITCHER
   ============================================================ */
(function () {
  const root   = document.documentElement;
  const dots   = document.querySelectorAll('.theme-dot');
  const saved  = localStorage.getItem('ds-theme') || 'default';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme === 'default' ? '' : theme);
    dots.forEach(d => d.classList.toggle('active', d.dataset.theme === theme));
    localStorage.setItem('ds-theme', theme);
  }

  applyTheme(saved);
  dots.forEach(d => d.addEventListener('click', () => applyTheme(d.dataset.theme)));
}());

/* ============================================================
   SCROLL ANIMATIONS (IntersectionObserver)
   ============================================================ */
const observerConfig = { threshold: 0.15 };

// Skill blocks
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
      skillObserver.unobserve(entry.target);
    }
  });
}, observerConfig);

document.querySelectorAll('.skill-block').forEach(el => skillObserver.observe(el));

// Timeline items
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.timeline-item').forEach(el => timelineObserver.observe(el));

// Generic fade-up for sections
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.stat-card, .project-item, .contact-link').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  fadeObserver.observe(el);
});

/* ============================================================
   NAV ACTIVE STATE
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

/* ============================================================
   GLITCH TEXT ON HERO TITLE HOVER
   ============================================================ */
const heroLines = document.querySelectorAll('.hero-title .line');
heroLines.forEach(line => {
  const original = line.dataset.text;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&';
  
  line.addEventListener('mouseenter', () => {
    let iter = 0;
    const interval = setInterval(() => {
      line.innerText = original
        .split('')
        .map((char, i) => {
          if (i < iter) return original[i];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      iter += 0.7;
      if (iter >= original.length) {
        clearInterval(interval);
        line.innerText = original;
      }
    }, 30);
  });
});

/* ============================================================
   SMOOTH NAV SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   STAGGERED PROJECT ITEMS
   ============================================================ */
document.querySelectorAll('.project-item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.05}s`;
});

/* ============================================================
   PARALLAX HERO TITLE (subtle)
   ============================================================ */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroTitle = document.querySelector('.hero-title');
  const heroSub   = document.querySelector('.hero-sub');
  const heroBadges = document.querySelector('.hero-badges');
  if (heroTitle) heroTitle.style.transform = `translateY(${scrollY * 0.18}px)`;
  if (heroSub)   heroSub.style.transform   = `translateY(${scrollY * 0.1}px)`;
  if (heroBadges) heroBadges.style.transform = `translateY(${scrollY * 0.07}px)`;
});

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ============================================================
   CURSOR LABEL — contextual text on hover
   ============================================================ */
const cursorLabel = document.getElementById('cursor-label');

document.addEventListener('mousemove', (e) => {
  cursorLabel.style.left = e.clientX + 'px';
  cursorLabel.style.top  = e.clientY + 'px';
});

function setCursorLabel(text) {
  cursorLabel.textContent = text;
  cursorLabel.classList.add('visible');
}
function clearCursorLabel() {
  cursorLabel.classList.remove('visible');
}

document.querySelectorAll('.project-links a, .music-ext, .btn-ghost, .btn-primary').forEach(a => {
  const t = a.textContent;
  const label = t.includes('Bandcamp') ? 'LISTEN'
              : t.includes('LinkedIn')  ? 'CONNECT'
              : t.includes('GitHub')    ? 'CODE'
              : t.includes('View') || t.includes('Work') ? 'EXPLORE'
              : 'GO';
  a.addEventListener('mouseenter', () => setCursorLabel(label));
  a.addEventListener('mouseleave', clearCursorLabel);
});

document.querySelectorAll('.music-card').forEach(card => {
  card.addEventListener('mouseenter', () => setCursorLabel('LISTEN'));
  card.addEventListener('mouseleave', clearCursorLabel);
});

document.querySelectorAll('.contact-link').forEach(link => {
  link.addEventListener('mouseenter', () => setCursorLabel('OPEN'));
  link.addEventListener('mouseleave', clearCursorLabel);
});

/* ============================================================
   3D TILT — music cards & stat cards
   ============================================================ */
function addTilt(selector, intensity) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left)  / rect.width  - 0.5;
      const y = (e.clientY - rect.top)   / rect.height - 0.5;
      el.style.transition = 'transform 0.08s ease';
      el.style.transform  = `perspective(700px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateZ(6px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s';
      el.style.transform  = '';
    });
  });
}

addTilt('.music-card', 9);
addTilt('.stat-card',  7);

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width  / 2) * 0.28;
    const y = (e.clientY - rect.top  - rect.height / 2) * 0.28;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ============================================================
   ANIMATED STAT COUNTERS
   ============================================================ */
function animateCounter(el) {
  const raw    = el.textContent.trim();
  const num    = parseFloat(raw.replace(/[^0-9.]/g, ''));
  const prefix = raw.match(/^[^0-9]*/)?.[0]  || '';
  const suffix = raw.match(/[^0-9.]+$/)?.[0] || '';
  if (isNaN(num) || num === 0) return;

  const duration = 1400;
  const startTs  = performance.now();

  const tick = (now) => {
    const elapsed  = now - startTs;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + Math.round(eased * num) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

/* ============================================================
   CLICK RIPPLE
   ============================================================ */
document.addEventListener('click', (e) => {
  const r = document.createElement('div');
  r.className = 'click-ripple';
  r.style.left = e.clientX + 'px';
  r.style.top  = e.clientY + 'px';
  document.body.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
});

/* ============================================================
   SECTION TITLE CLIP-PATH REVEAL
   ============================================================ */
document.querySelectorAll('.section-title').forEach(el => {
  el.style.clipPath  = 'inset(0 100% 0 0)';
  el.style.transition = 'clip-path 1s cubic-bezier(0.16, 1, 0.3, 1)';
});

const titleRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.clipPath = 'inset(0 0% 0 0)';
      titleRevealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section-title').forEach(el => titleRevealObserver.observe(el));

/* ============================================================
   SECTION LABEL SCRAMBLE ON SCROLL-IN
   ============================================================ */
const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·';

// Store originals before any observer can touch them
document.querySelectorAll('.section-label').forEach(el => {
  el.dataset.original = el.textContent;
});

const labelScrambleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const original = el.dataset.original || el.textContent;
      if (!original) return;
      let iter = 0;
      const interval = setInterval(() => {
        el.textContent = original
          .split('')
          .map((char, i) => {
            if (i < iter || char === ' ' || char === '·') return original[i];
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          })
          .join('');
        iter += 0.5;
        if (iter >= original.length) {
          clearInterval(interval);
          el.textContent = original;
        }
      }, 25);
      labelScrambleObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.section-label').forEach(el => labelScrambleObserver.observe(el));

/* ============================================================
   HERO PANEL WIDGET — Terminal only
   ============================================================ */
(function () {
  const panel = document.getElementById('heroPanel');
  if (!panel) return;

  function getAccent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8f542';
  }
  function hexToRgb(hex) {
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    return m ? `${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)}` : '200,245,66';
  }

  /* ── Terminal typewriter ── */
  const termApp = document.getElementById('appTerminal');
  const TLINES = [
    { t:'cmd', s:'whoami' },
    { t:'out', s:'daniel_sheils' },
    { t:'out', s:'creative technologist · musician · builder' },
    { t:'blank' },
    { t:'cmd', s:'uname -r' },
    { t:'out', s:'Human 18.0 LTS — Sound, Code, Creation' },
    { t:'blank' },
    { t:'cmd', s:'cat skills.txt' },
    { t:'out', s:'── AUDIO ─────────────────────────────' },
    { t:'out', s:'  Sound Design · AR/VR/XR · Mixing' },
    { t:'out', s:'  Mastering · Live Sound · Foley' },
    { t:'out', s:'  Logic Pro · Ableton · Max/MSP' },
    { t:'out', s:'── CODE ──────────────────────────────' },
    { t:'out', s:'  Python · TypeScript · JavaScript' },
    { t:'out', s:'  Unity · Three.js · Streamlit' },
    { t:'out', s:'  AI/ML · LLM Agents · Automation' },
    { t:'out', s:'── CREATIVE ──────────────────────────' },
    { t:'out', s:'  Music · Video · 3D · Visual Art' },
    { t:'out', s:'  Game Dev · Robotics · Installations' },
    { t:'blank' },
    { t:'cmd', s:'ls ~/projects --sort=date' },
    { t:'out', s:'2026  ottomate/         AI agent workbench' },
    { t:'out', s:'2025  streamlit-suite/  official creator tools' },
    { t:'out', s:'2024  duogpt/           dual-AI conversation' },
    { t:'out', s:'2024  prism-rider/      AR rhythm game' },
    { t:'out', s:'2023  brainstormer/     all-in-one AI studio' },
    { t:'out', s:'2023  trinkets/         3D virtual museum' },
    { t:'out', s:'2022  mend-mv/          AI-animated music video' },
    { t:'out', s:'2022  the-raven-mv/     generative film' },
    { t:'out', s:'       ...+ more' },
    { t:'blank' },
    { t:'cmd', s:'cat clients.txt' },
    { t:'out', s:'Red Bull · Microsoft · Intel · Amazon' },
    { t:'out', s:'Motorola · Lenovo · The Glenlivet' },
    { t:'out', s:"San Diego Padres · Alzheimer's Assoc." },
    { t:'blank' },
    { t:'cmd', s:'cat discography.txt' },
    { t:'out', s:'~30 solo & collaborative albums' },
    { t:'out', s:'genres: electronic / ambient / experimental' },
    { t:'out', s:'        indie / hip-hop / film score' },
    { t:'out', s:'produced & mixed: hundreds of artists' },
    { t:'out', s:'toured nationally · DJ sets · radio shows' },
    { t:'out', s:'label: Noodlebake Records (est. 2020)' },
    { t:'blank' },
    { t:'cmd', s:'git log --oneline -8' },
    { t:'out', s:'a4f3e1 Ship Ottomate v2 — 190+ connectors' },
    { t:'out', s:'9c2d88 Streamlit Creator tools (official)' },
    { t:'out', s:'f7a012 DuoGPT — two AIs converse live' },
    { t:'out', s:'3e91fa Trinkets — 3D art museum in Unity' },
    { t:'out', s:'b1c340 Prism Rider AR rhythm game' },
    { t:'out', s:'77b2c0 Mend MV — frame-by-frame AI anim' },
    { t:'out', s:'c2e981 brAInstormer all-in-one AI suite' },
    { t:'out', s:'8d3fa1 The Raven — generative music video' },
    { t:'blank' },
    { t:'cmd', s:'echo $AVAILABILITY' },
    { t:'out', s:'✓  open to hire · collabs · commissions' },
    { t:'blank' },
    { t:'cmd', s:'echo $CONTACT' },
    { t:'out', s:'linkedin.com/in/danielsheils' },
    { t:'out', s:'github.com/RhythrosaLabs' },
    { t:'blank' },
    { t:'cmd', s:'open https://linkedin.com/in/danielsheils' },
    { t:'out', s:'launching browser...' },
    { t:'blank' },
  ];

  function startTerminal() {
    termApp.innerHTML = '<div class="term-body" id="termBody"></div>';
    runTerm(document.getElementById('termBody'), 0);
  }
  function runTerm(body, i) {
    if (i >= TLINES.length) { setTimeout(() => { body.innerHTML = ''; runTerm(body, 0); }, 3200); return; }
    const line = TLINES[i];
    if (line.t === 'blank') {
      const div = document.createElement('div');
      div.className = 'term-line term-out';
      div.innerHTML = '&nbsp;';
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
      setTimeout(() => runTerm(body, i + 1), 40);
      return;
    }
    const div = document.createElement('div');
    div.className = 'term-line term-' + line.t;
    body.appendChild(div);
    if (line.t === 'cmd') {
      div.textContent = '$ '; let j = 0;
      const iv = setInterval(() => {
        div.textContent = '$ ' + line.s.slice(0, ++j);
        body.scrollTop = body.scrollHeight;
        if (j >= line.s.length) { clearInterval(iv); setTimeout(() => runTerm(body, i + 1), 280); }
      }, 42);
    } else {
      div.textContent = line.s;
      body.scrollTop = body.scrollHeight;
      setTimeout(() => runTerm(body, i + 1), 55);
    }
  }

  /* ── Border particle system ── */
  const partCv = document.createElement('canvas');
  partCv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:10;';
  panel.appendChild(partCv);
  const ptx = partCv.getContext('2d');
  const PART_N = 52;
  const parts = [];

  function perimXY(t, W, H) {
    const d = t * 2 * (W + H);
    if (d < W)         return {x: d,         y: 0,         nx: 0,  ny: 1};
    if (d < W + H)     return {x: W,          y: d - W,     nx: -1, ny: 0};
    if (d < 2*W + H)   return {x: W-(d-W-H),  y: H,         nx: 0,  ny: -1};
    return                     {x: 0,          y: H-(d-2*W-H), nx: 1, ny: 0};
  }
  function initParticles() {
    const W = panel.clientWidth, H = panel.clientHeight;
    partCv.width = W; partCv.height = H;
    parts.length = 0;
    for (let i = 0; i < PART_N; i++) {
      parts.push({
        t:        Math.random(),
        speed:    0.00012 + Math.random() * 0.00028,
        depth:    1 + Math.random() * 28,
        depthPh:  Math.random() * Math.PI * 2,
        depthSpd: 0.25 + Math.random() * 1.1,
        size:     0.4 + Math.random() * 1.7,
        alpha:    0.04 + Math.random() * 0.19,
        pulse:    Math.random() * Math.PI * 2,
        pulseSpd: 0.25 + Math.random() * 0.9,
      });
    }
  }
  function tickParticles() {
    const W = partCv.width, H = partCv.height;
    if (!W || !H) { requestAnimationFrame(tickParticles); return; }
    const ac = getAccent(), rgb = hexToRgb(ac);
    ptx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.t       = (p.t + p.speed) % 1;
      p.pulse   += 0.016 * p.pulseSpd;
      p.depthPh += 0.016 * p.depthSpd;
      const pos = perimXY(p.t, W, H);
      const d   = p.depth * (0.25 + 0.75 * Math.abs(Math.sin(p.depthPh)));
      const x   = pos.x + pos.nx * d;
      const y   = pos.y + pos.ny * d;
      const a   = p.alpha * (0.3 + 0.7 * Math.abs(Math.sin(p.pulse)));
      const sz  = p.size  * (0.6 + 0.4 * Math.abs(Math.sin(p.pulse * 1.3)));
      ptx.save();
      ptx.beginPath(); ptx.arc(x, y, sz, 0, Math.PI * 2);
      ptx.fillStyle   = `rgba(${rgb},${a})`;
      ptx.shadowBlur  = sz * 6;
      ptx.shadowColor = `rgba(${rgb},${a * 0.45})`;
      ptx.fill();
      ptx.restore();
    }
    requestAnimationFrame(tickParticles);
  }

  setTimeout(() => { initParticles(); tickParticles(); }, 420);
  startTerminal();
  window.addEventListener('resize', initParticles);
}());
/* ==== PANEL END ==== */
