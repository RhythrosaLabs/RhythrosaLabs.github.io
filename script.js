/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
  trail.style.left  = mouseX + 'px';
  trail.style.top   = mouseY + 'px';
});

document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%,-50%) scale(1.8)');
document.addEventListener('mouseup',   () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');

// Grow cursor on hover over links/buttons
document.querySelectorAll('a, button, .project-item, .stat-card, .skill-block').forEach(el => {
  el.addEventListener('mouseenter', () => trail.style.transform = 'translate(-50%,-50%) scale(1.6)');
  el.addEventListener('mouseleave', () => trail.style.transform = 'translate(-50%,-50%) scale(1)');
});

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
   Your cursor acts as a paddle — hover near it to deflect.
   Remove this block + the #pong-ball CSS block to undo fully.
   ============================================================ */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const ball = document.createElement('div');
  ball.id = 'pong-ball';
  hero.appendChild(ball);

  const SIZE   = 4;   // ball radius for wall collision
  const SPEED  = 1.6;
  const PADDLE = 55;  // cursor deflection radius

  let x, y, vx, vy;
  let cursorX = -9999, cursorY = -9999;

  function init() {
    const w = hero.offsetWidth;
    const h = hero.offsetHeight;
    x = w * 0.35;
    y = h * 0.55;
    const angle = (Math.random() * Math.PI * 0.5) + 0.4;
    vx = Math.cos(angle) * SPEED * (Math.random() > 0.5 ? 1 : -1);
    vy = Math.sin(angle) * SPEED * (Math.random() > 0.5 ? 1 : -1);
  }

  init();
  window.addEventListener('resize', init);

  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    cursorX = e.clientX - r.left;
    cursorY = e.clientY - r.top;
  });
  hero.addEventListener('mouseleave', () => { cursorX = -9999; cursorY = -9999; });

  function tick() {
    const w = hero.offsetWidth;
    const h = hero.offsetHeight;

    x += vx;
    y += vy;

    // Wall bounces
    if (x <= SIZE)     { vx =  Math.abs(vx); x = SIZE; }
    if (x >= w - SIZE) { vx = -Math.abs(vx); x = w - SIZE; }
    if (y <= SIZE)     { vy =  Math.abs(vy); y = SIZE; }
    if (y >= h - SIZE) { vy = -Math.abs(vy); y = h - SIZE; }

    // Cursor paddle deflection
    const dx   = x - cursorX;
    const dy   = y - cursorY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < PADDLE && dist > 0) {
      ball.classList.add('pong-hot');
      const nx  = dx / dist;
      const ny  = dy / dist;
      const dot = vx * nx + vy * ny;
      if (dot < 0) {
        vx -= 2 * dot * nx;
        vy -= 2 * dot * ny;
        x = cursorX + nx * (PADDLE + 1);
        y = cursorY + ny * (PADDLE + 1);
      }
    } else {
      ball.classList.remove('pong-hot');
    }

    ball.style.left = x + 'px';
    ball.style.top  = y + 'px';
    requestAnimationFrame(tick);
  }

  tick();
}());
/* ==== PONG END ==== */
