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

const labelScrambleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const original = el.textContent;
      let iter = 0;
      const interval = setInterval(() => {
        el.textContent = original
          .split('')
          .map((char, i) => {
            if (i < iter || char === ' ') return original[i];
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
}, { threshold: 0.5 });

document.querySelectorAll('.section-label').forEach(el => labelScrambleObserver.observe(el));

/* ============================================================
   ==== PONG START ====
   Ambient pong ball bouncing inside the hero.
   Per-character collision via Range API (no DOM changes).
   Smoothed cursor paddle to remove jitter.
   Remove this block + the #pong-ball CSS block to undo fully.
   ============================================================ */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const ball = document.createElement('div');
  ball.id = 'pong-ball';
  hero.appendChild(ball);

  const RADIUS      = 5;
  const SPEED       = 0.85;
  const PADDLE_R    = 52;
  const CURSOR_LERP = 0.09;
  const SUBSTEPS    = 3;     // mini-steps per frame → smoother arc, less clipping

  let x = 0, y = 0, vx = 0, vy = 0;
  let rawCursorX = -9999, rawCursorY = -9999;
  let cursorX    = -9999, cursorY    = -9999;
  let collidables = [];

  function nudgeAngle() {
    // Rotate velocity by ±6° so ball never locks into a repetitive path
    const a = (Math.random() - 0.5) * 0.21;
    const cos = Math.cos(a), sin = Math.sin(a);
    const nx = vx * cos - vy * sin;
    const ny = vx * sin + vy * cos;
    vx = nx; vy = ny;
  }

  function normalizeSpeed() {
    const spd = Math.sqrt(vx * vx + vy * vy);
    if (spd > 0) { vx = (vx / spd) * SPEED; vy = (vy / spd) * SPEED; }
  }

  // Use Range API to get per-character bounding rects without touching the DOM
  function charRects(el, heroRect) {
    const rects = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const len = node.textContent.length;
      for (let i = 0; i < len; i++) {
        if (!node.textContent[i].trim()) continue;
        const range = document.createRange();
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const r = range.getBoundingClientRect();
        if (r.width > 1 && r.height > 1) {
          rects.push({
            left:   r.left   - heroRect.left,
            top:    r.top    - heroRect.top,
            right:  r.right  - heroRect.left,
            bottom: r.bottom - heroRect.top,
          });
        }
      }
    }
    return rects;
  }

  function buildCollidables() {
    const heroRect = hero.getBoundingClientRect();
    collidables = [];

    // Per-letter collision on the big title
    hero.querySelectorAll('.hero-title .line').forEach(el => {
      collidables.push(...charRects(el, heroRect));
    });

    // Per-letter on the hero tag line
    hero.querySelectorAll('.hero-tag').forEach(el => {
      collidables.push(...charRects(el, heroRect));
    });

    // Element-level for subtitle, badges, buttons (good enough at small size)
    hero.querySelectorAll(
      '.hero-sub, .hero-badges .badge, .hero-cta a, .hero-scroll-indicator'
    ).forEach(el => {
      const r = el.getBoundingClientRect();
      const rect = {
        left:   r.left   - heroRect.left,
        top:    r.top    - heroRect.top,
        right:  r.right  - heroRect.left,
        bottom: r.bottom - heroRect.top,
      };
      if (rect.right - rect.left > 2 && rect.bottom - rect.top > 2) {
        collidables.push(rect);
      }
    });
  }

  function init() {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    x  = w * 0.78;
    y  = h * 0.22;
    const angle = Math.PI * 0.65 + (Math.random() - 0.5) * 0.6;
    vx = Math.cos(angle) * SPEED;
    vy = Math.sin(angle) * SPEED;
    buildCollidables();
  }

  setTimeout(init, 450);
  window.addEventListener('resize', () => setTimeout(() => { init(); }, 250));

  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    rawCursorX = e.clientX - r.left;
    rawCursorY = e.clientY - r.top;
  });
  hero.addEventListener('mouseleave', () => {
    rawCursorX = -9999; rawCursorY = -9999;
    cursorX    = -9999; cursorY    = -9999;
  });

  function resolveRect(rect) {
    const pad = RADIUS + 2;
    const rl = rect.left   - pad;
    const rr = rect.right  + pad;
    const rt = rect.top    - pad;
    const rb = rect.bottom + pad;
    if (x < rl || x > rr || y < rt || y > rb) return false;
    const dL = x - rl, dR = rr - x, dT = y - rt, dB = rb - y;
    const min = Math.min(dL, dR, dT, dB);
    if      (min === dL && vx > 0) { vx = -Math.abs(vx); x = rl - 1; }
    else if (min === dR && vx < 0) { vx =  Math.abs(vx); x = rr + 1; }
    else if (min === dT && vy > 0) { vy = -Math.abs(vy); y = rt - 1; }
    else if (min === dB && vy < 0) { vy =  Math.abs(vy); y = rb + 1; }
    else return false;
    normalizeSpeed();
    nudgeAngle();
    return true;
  }

  function tick() {
    if (!vx && !vy) { requestAnimationFrame(tick); return; }

    const w = hero.clientWidth;
    const h = hero.clientHeight;

    // Lerp cursor smoothly
    if (rawCursorX < 0) {
      cursorX = -9999; cursorY = -9999;
    } else {
      cursorX += (rawCursorX - cursorX) * CURSOR_LERP;
      cursorY += (rawCursorY - cursorY) * CURSOR_LERP;
    }

    // Sub-step: move in SUBSTEPS mini-increments per frame
    const sx = vx / SUBSTEPS;
    const sy = vy / SUBSTEPS;

    for (let s = 0; s < SUBSTEPS; s++) {
      x += sx;
      y += sy;

      // Hard wall clamp
      if (x < RADIUS)     { vx =  Math.abs(vx); x = RADIUS;     normalizeSpeed(); nudgeAngle(); }
      if (x > w - RADIUS) { vx = -Math.abs(vx); x = w - RADIUS; normalizeSpeed(); nudgeAngle(); }
      if (y < RADIUS)     { vy =  Math.abs(vy); y = RADIUS;     normalizeSpeed(); nudgeAngle(); }
      if (y > h - RADIUS) { vy = -Math.abs(vy); y = h - RADIUS; normalizeSpeed(); nudgeAngle(); }

      // Resolve at most ONE rect collision per substep to prevent double-reversals
      for (const r of collidables) {
        if (resolveRect(r)) break;
      }
    }

    // Cursor paddle
    const dx   = x - cursorX;
    const dy   = y - cursorY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < PADDLE_R && dist > 0) {
      ball.classList.add('pong-hot');
      const nx  = dx / dist;
      const ny  = dy / dist;
      const dot = vx * nx + vy * ny;
      if (dot < 0) {
        vx -= 2 * dot * nx;
        vy -= 2 * dot * ny;
        x = cursorX + nx * (PADDLE_R + 2);
        y = cursorY + ny * (PADDLE_R + 2);
        normalizeSpeed();
        nudgeAngle();
      }
    } else {
      ball.classList.remove('pong-hot');
    }

    ball.style.left = x + 'px';
    ball.style.top  = y + 'px';
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}());
/* ==== PONG END ==== */
