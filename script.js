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
   HERO PANEL WIDGET — Pong / Projects / Terminal
   ============================================================ */
(function () {
  const panel = document.getElementById('heroPanel');
  if (!panel) return;

  const tabs = panel.querySelectorAll('.panel-tab');
  const apps = panel.querySelectorAll('.panel-app');

  /* ── Tab switching ── */
  function switchTab(name) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    apps.forEach(a => {
      const on = a.dataset.app === name;
      a.classList.toggle('active', on);
      if (on && name === 'terminal' && !termStarted) startTerminal();
      if (on && name === 'projects' && !projStarted) startProjects();
    });
  }
  tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

  /* ============================================================
     PONG — self-contained canvas game
     Player paddle (bottom) tracks cursor X.  AI paddle (top) chases ball.
     ============================================================ */
  const pongApp = document.getElementById('appPong');
  const cv = document.createElement('canvas');
  cv.style.cssText = 'display:block;width:100%;height:100%;';
  pongApp.appendChild(cv);
  const pc = cv.getContext('2d');

  const BALL_R   = 5;
  const PAD_W    = 66;
  const PAD_H    = 6;
  const PAD_MARG = 16;
  const BSPEED   = 3.8;
  const AI_SPD   = 2.5;

  let cw = 0, ch = 0;
  let bx = 0, by = 0, bvx = 0, bvy = 0;
  let playerX = 0, aiX = 0;
  let pScore = 0, aScore = 0;
  let pongMouseX = -1;

  function resizePong() {
    cw = pongApp.clientWidth;
    ch = pongApp.clientHeight;
    cv.width  = cw;
    cv.height = ch;
    if (!playerX) playerX = cw / 2;
    if (!aiX)     aiX     = cw / 2;
  }

  function resetBall(toPlayer) {
    bx  = cw / 2;
    by  = ch / 2;
    const a = (Math.random() * 0.45 + 0.28) * Math.PI;
    bvx = Math.cos(a) * BSPEED * (Math.random() > 0.5 ? 1 : -1);
    bvy = toPlayer ? Math.abs(Math.sin(a) * BSPEED) : -Math.abs(Math.sin(a) * BSPEED);
  }

  function getAccent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8f542';
  }

  function drawPong() {
    pc.clearRect(0, 0, cw, ch);
    const ac = getAccent();

    // Center dashed line
    pc.save();
    pc.setLineDash([4, 10]);
    pc.strokeStyle = 'rgba(255,255,255,0.05)';
    pc.lineWidth = 1;
    pc.beginPath(); pc.moveTo(0, ch / 2); pc.lineTo(cw, ch / 2); pc.stroke();
    pc.restore();

    // AI paddle (dim, top)
    pc.fillStyle = 'rgba(255,255,255,0.22)';
    pc.fillRect(aiX - PAD_W / 2, PAD_MARG, PAD_W, PAD_H);

    // Player paddle (accent glow, bottom)
    pc.save();
    pc.fillStyle = ac;
    pc.shadowBlur = 10;
    pc.shadowColor = ac;
    pc.fillRect(playerX - PAD_W / 2, ch - PAD_MARG - PAD_H, PAD_W, PAD_H);
    pc.restore();

    // Ball
    pc.save();
    pc.beginPath();
    pc.arc(bx, by, BALL_R, 0, Math.PI * 2);
    pc.fillStyle = ac;
    pc.shadowBlur = 14;
    pc.shadowColor = ac;
    pc.fill();
    pc.restore();

    // Scores
    pc.font = "700 13px 'Space Mono', monospace";
    pc.fillStyle = 'rgba(255,255,255,0.18)';
    pc.textAlign = 'left';  pc.fillText(aScore, 12, 22);
    pc.textAlign = 'right'; pc.fillText(pScore, cw - 12, ch - 10);

    // Hint on first serve
    if (pScore + aScore === 0) {
      pc.font = "9px 'Space Mono', monospace";
      pc.fillStyle = 'rgba(255,255,255,0.1)';
      pc.textAlign = 'center';
      pc.fillText('MOVE CURSOR TO PLAY', cw / 2, ch - 8);
    }
  }

  function tickPong() {
    if (!cw || !ch) { requestAnimationFrame(tickPong); return; }

    // Player paddle smoothly follows cursor
    if (pongMouseX >= 0) playerX += (pongMouseX - playerX) * 0.14;
    playerX = Math.max(PAD_W / 2, Math.min(cw - PAD_W / 2, playerX));

    // AI paddle chases ball with max speed
    const diff = bx - aiX;
    aiX += Math.sign(diff) * Math.min(Math.abs(diff) * 0.08, AI_SPD);
    aiX = Math.max(PAD_W / 2, Math.min(cw - PAD_W / 2, aiX));

    bx += bvx;
    by += bvy;

    // Wall bounce
    if (bx < BALL_R)      { bx = BALL_R;      bvx =  Math.abs(bvx); }
    if (bx > cw - BALL_R) { bx = cw - BALL_R; bvx = -Math.abs(bvx); }

    // Player paddle (bottom)
    const plY = ch - PAD_MARG - PAD_H;
    if (bvy > 0 && by + BALL_R >= plY && by - BALL_R <= plY + PAD_H &&
        bx >= playerX - PAD_W / 2 && bx <= playerX + PAD_W / 2) {
      bvy = -Math.abs(bvy);
      by  = plY - BALL_R;
      const off = (bx - playerX) / (PAD_W / 2);
      bvx += off * 1.8;
      const s = Math.sqrt(bvx * bvx + bvy * bvy);
      bvx = bvx / s * BSPEED; bvy = bvy / s * BSPEED;
    }

    // AI paddle (top)
    const aiPY = PAD_MARG;
    if (bvy < 0 && by - BALL_R <= aiPY + PAD_H && by + BALL_R >= aiPY &&
        bx >= aiX - PAD_W / 2 && bx <= aiX + PAD_W / 2) {
      bvy = Math.abs(bvy);
      by  = aiPY + PAD_H + BALL_R;
      const off = (bx - aiX) / (PAD_W / 2);
      bvx += off * 0.9;
      const s = Math.sqrt(bvx * bvx + bvy * bvy);
      bvx = bvx / s * BSPEED; bvy = bvy / s * BSPEED;
    }

    // Score & reset
    if (by + BALL_R < 0)  { pScore++; resetBall(true);  }
    if (by - BALL_R > ch) { aScore++; resetBall(false); }

    drawPong();
    requestAnimationFrame(tickPong);
  }

  panel.addEventListener('mousemove', e => {
    const r = pongApp.getBoundingClientRect();
    pongMouseX = e.clientX - r.left;
  });
  panel.addEventListener('mouseleave', () => { pongMouseX = -1; });

  /* ============================================================
     PROJECTS CAROUSEL
     ============================================================ */
  const projApp = document.getElementById('appProjects');
  const FEATURED = [
    { num: '01', title: 'Ottomate',           tags: ['TypeScript', 'AI Agent'],     desc: 'Universal AI agent workbench. Goal → plan → code → deliver. 190+ connectors, 200+ skills.',      href: 'https://github.com/RhythrosaLabs/otto-mate-2' },
    { num: '03', title: 'Trinkets',            tags: ['Unity', '3D', 'Interactive'], desc: 'A virtual museum. Explore sound design, art & animations as a fully interactive 3D environment.', href: 'https://github.com/RhythrosaLabs' },
    { num: '06', title: 'AR/XR Sound Design',  tags: ['AR/XR', 'Enterprise'],        desc: 'Red Bull · Microsoft · Intel · Amazon · Motorola · Lenovo · San Diego Padres · The Glenlivet',  href: 'https://www.linkedin.com/in/danielsheils' },
    { num: '08', title: 'Soundstorm',          tags: ['Python', 'Audio', 'AI'],      desc: 'AI-driven audio platform for sound designers, composers, and experimental audio artists.',       href: 'https://github.com/RhythrosaLabs/soundstorm' },
    { num: '14', title: 'Streamlit Creator',   tags: ['Python', 'Streamlit'],        desc: 'Official Streamlit Creator — autonomous AI tools for music, game design, and video production.', href: 'https://github.com/RhythrosaLabs/streamlit-components-demo' },
  ];
  let projIdx = 0, projInterval = null, projStarted = false;

  function showProject() {
    const slide = projApp.querySelector('.proj-slide');
    if (!slide) return;
    const p = FEATURED[projIdx];
    slide.style.opacity = '0';
    slide.style.transform = 'translateY(10px)';
    setTimeout(() => {
      slide.innerHTML = `
        <div class="proj-num">${p.num}</div>
        <h3 class="proj-title">${p.title}</h3>
        <p class="proj-desc">${p.desc}</p>
        <div class="proj-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
        <a href="${p.href}" target="_blank" class="proj-link">View Project ↗</a>`;
      slide.style.opacity = '1';
      slide.style.transform = 'translateY(0)';
      projApp.querySelectorAll('.proj-dot').forEach((d, i) => d.classList.toggle('active', i === projIdx));
    }, 200);
  }

  function startProjects() {
    projStarted = true;
    projApp.innerHTML = '<div class="proj-slide"></div><div class="proj-dots"></div>';
    FEATURED.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'proj-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => {
        projIdx = i; showProject();
        clearInterval(projInterval);
        projInterval = setInterval(nextProj, 4500);
      });
      projApp.querySelector('.proj-dots').appendChild(d);
    });
    showProject();
    projInterval = setInterval(nextProj, 4500);
  }

  function nextProj() { projIdx = (projIdx + 1) % FEATURED.length; showProject(); }

  /* ============================================================
     TERMINAL TYPEWRITER
     ============================================================ */
  const termApp = document.getElementById('appTerminal');
  let termStarted = false;
  const TLINES = [
    { t: 'cmd', s: 'whoami' },
    { t: 'out', s: 'daniel_sheils' },
    { t: 'cmd', s: 'cat skills.txt' },
    { t: 'out', s: 'Sound Design · AI/ML · Game Dev' },
    { t: 'out', s: 'AR/VR/XR · Streamlit · Unity · Python' },
    { t: 'out', s: 'Music · Mixing · Visual Arts · Robotics' },
    { t: 'cmd', s: 'ls projects/' },
    { t: 'out', s: 'ottomate/  brainstormer/  trinkets/' },
    { t: 'out', s: 'soundstorm/  duogpt/  game-maker/' },
    { t: 'out', s: 'mend-mv/  the-raven-mv/  +7 more...' },
    { t: 'cmd', s: 'cat clients.txt' },
    { t: 'out', s: 'Red Bull · Microsoft · Intel' },
    { t: 'out', s: 'Amazon · Motorola · Lenovo' },
    { t: 'out', s: 'San Diego Padres · The Glenlivet' },
    { t: 'cmd', s: 'echo $EXPERIENCE' },
    { t: 'out', s: '18+ years creative practice' },
    { t: 'cmd', s: 'echo $ALBUMS' },
    { t: 'out', s: '~30 solo & collab albums' },
    { t: 'cmd', s: 'ping creativity.io' },
    { t: 'out', s: 'PONG: reply from creativity.io ✓' },
  ];

  function startTerminal() {
    termStarted = true;
    termApp.innerHTML = '<div class="term-body" id="termBody"></div>';
    runTerm(document.getElementById('termBody'), 0);
  }

  function runTerm(body, i) {
    if (i >= TLINES.length) {
      setTimeout(() => { body.innerHTML = ''; runTerm(body, 0); }, 2500);
      return;
    }
    const line = TLINES[i];
    const div = document.createElement('div');
    div.className = 'term-line term-' + line.t;
    body.appendChild(div);
    if (line.t === 'cmd') {
      div.textContent = '$ ';
      let j = 0;
      const iv = setInterval(() => {
        div.textContent = '$ ' + line.s.slice(0, ++j);
        body.scrollTop = body.scrollHeight;
        if (j >= line.s.length) { clearInterval(iv); setTimeout(() => runTerm(body, i + 1), 350); }
      }, 52);
    } else {
      div.textContent = line.s;
      body.scrollTop = body.scrollHeight;
      setTimeout(() => runTerm(body, i + 1), 100);
    }
  }

  /* ── Init ── */
  resizePong();
  setTimeout(() => { resizePong(); resetBall(true); requestAnimationFrame(tickPong); }, 400);
  window.addEventListener('resize', resizePong);
}());
/* ==== PANEL END ==== */
