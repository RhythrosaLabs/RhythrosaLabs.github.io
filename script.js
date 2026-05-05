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
   HERO PANEL WIDGET — Games / Projects / Terminal
   ============================================================ */
(function () {
  const panel = document.getElementById('heroPanel');
  if (!panel) return;

  const tabs = panel.querySelectorAll('.panel-tab');
  const apps = panel.querySelectorAll('.panel-app');

  function launchActiveGame() {
    cancelGame(); resizeGame();
    if (activeGame==='pong')      initPong();
    else if (activeGame==='snake')     initSnake();
    else if (activeGame==='breakout')  initBreakout();
    else if (activeGame==='tetris')    initTetris();
    else if (activeGame==='asteroids') initAsteroids();
    else if (activeGame==='flappy')    initFlappy();
  }
  function switchTab(name) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    apps.forEach(a => {
      const on = a.dataset.app === name;
      a.classList.toggle('active', on);
      if (on && name === 'pong')                          launchActiveGame();
      if (!on && a.dataset.app === 'pong')                cancelGame();
      if (on && name === 'terminal' && !termStarted)      startTerminal();
      if (on && name === 'projects' && !projStarted)      startProjects();
      if (on && name === 'community'&& !commStarted)      initCommunity();
    });
  }
  tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

  /* ============================================================
     COMMUNITY TAB — GitHub Discussions via Giscus
     ============================================================ */
  const commApp = document.getElementById('appCommunity');
  let commStarted = false;
  function initCommunity() {
    commStarted = true;
    commApp.innerHTML = `
      <div class="comm-wrap">
        <div class="comm-header">
          <span class="comm-icon">◎</span>
          <span class="comm-title">COMMUNITY</span>
        </div>
        <p class="comm-desc">A space for questions, collabs, and conversation — powered by GitHub Discussions.</p>
        <p class="comm-desc">Requires a free GitHub account. No spam, no bots.</p>
        <div class="comm-setup">
          <span class="comm-soon">⬡ Coming soon</span>
          <span>Once live, sign in with GitHub to join the thread.</span>
          <a href="https://github.com/RhythrosaLabs/RhythrosaLabs.github.io/discussions" target="_blank" class="comm-link">github.com/RhythrosaLabs ↗</a>
        </div>
      </div>`;
  }

  /* ============================================================
     GAMES — Pong · Snake · Breakout · Tetris (all arrow-key)
     ============================================================ */
  const pongApp = document.getElementById('appPong');
  pongApp.innerHTML = `
    <div class="game-picker">
      <button class="game-btn active" data-game="pong">PONG</button>
      <button class="game-btn" data-game="snake">SNAKE</button>
      <button class="game-btn" data-game="breakout">BRKOUT</button>
      <button class="game-btn" data-game="tetris">TETRIS</button>
      <button class="game-btn" data-game="asteroids">ASTRDS</button>
      <button class="game-btn" data-game="flappy">FLAPPY</button>
    </div>`;
  const cv = document.createElement('canvas');
  cv.className = 'game-cv';
  pongApp.appendChild(cv);
  const pc = cv.getContext('2d');

  let cw = 0, ch = 0, activeGame = 'pong', gameRAF = null;

  function getAccent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8f542';
  }
  function hexToRgb(hex) {
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    return m ? `${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)}` : '200,245,66';
  }
  function resizeGame() {
    cw = pongApp.clientWidth;
    ch = pongApp.clientHeight - 29;
    cv.width  = cw;
    cv.height = ch;
  }
  function cancelGame() {
    if (gameRAF) { cancelAnimationFrame(gameRAF); gameRAF = null; }
  }

  pongApp.querySelectorAll('.game-btn').forEach(b => {
    b.addEventListener('click', () => {
      pongApp.querySelectorAll('.game-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      cancelGame();
      activeGame = b.dataset.game;
      resizeGame();
      if (activeGame === 'pong')      initPong();
      if (activeGame === 'snake')     initSnake();
      if (activeGame === 'breakout')  initBreakout();
      if (activeGame === 'tetris')    initTetris();
      if (activeGame === 'asteroids') initAsteroids();
      if (activeGame === 'flappy')    initFlappy();
    });
  });

  /* ── PONG — arrow keys move player paddle ── */
  const BALL_R = 5, PAD_W = 66, PAD_H = 6, PAD_MARG = 16, BSPEED = 3.4, AI_SPD = 2.2;
  let bx, by, bvx, bvy, playerX, aiX, pScore, aScore;
  let pongLeft = false, pongRight = false;

  function initPong() {
    playerX = aiX = cw / 2; pScore = aScore = 0;
    pongLeft = pongRight = false;
    resetBall(true);
    gameRAF = requestAnimationFrame(tickPong);
  }
  function resetBall(toPlayer) {
    bx = cw / 2; by = ch / 2;
    const a = (Math.random() * 0.45 + 0.28) * Math.PI;
    bvx = Math.cos(a) * BSPEED * (Math.random() > 0.5 ? 1 : -1);
    bvy = toPlayer ? Math.abs(Math.sin(a) * BSPEED) : -Math.abs(Math.sin(a) * BSPEED);
  }
  function tickPong() {
    if (activeGame !== 'pong') return;
    const ac = getAccent();
    const PAD_SPD = 4.5;
    if (pongLeft)  playerX = Math.max(PAD_W / 2,     playerX - PAD_SPD);
    if (pongRight) playerX = Math.min(cw - PAD_W / 2, playerX + PAD_SPD);
    const diff = bx - aiX;
    aiX += Math.sign(diff) * Math.min(Math.abs(diff) * 0.07, AI_SPD);
    aiX = Math.max(PAD_W / 2, Math.min(cw - PAD_W / 2, aiX));
    bx += bvx; by += bvy;
    if (bx < BALL_R)      { bx = BALL_R;      bvx =  Math.abs(bvx); }
    if (bx > cw - BALL_R) { bx = cw - BALL_R; bvx = -Math.abs(bvx); }
    const plY = ch - PAD_MARG - PAD_H;
    if (bvy > 0 && by + BALL_R >= plY && by - BALL_R <= plY + PAD_H &&
        bx >= playerX - PAD_W / 2 && bx <= playerX + PAD_W / 2) {
      bvy = -Math.abs(bvy); by = plY - BALL_R;
      const off = (bx - playerX) / (PAD_W / 2); bvx += off * 1.5;
      const s = Math.sqrt(bvx*bvx+bvy*bvy); bvx=bvx/s*BSPEED; bvy=bvy/s*BSPEED;
    }
    const aiPY = PAD_MARG;
    if (bvy < 0 && by - BALL_R <= aiPY + PAD_H && by + BALL_R >= aiPY &&
        bx >= aiX - PAD_W / 2 && bx <= aiX + PAD_W / 2) {
      bvy = Math.abs(bvy); by = aiPY + PAD_H + BALL_R;
      const off = (bx - aiX) / (PAD_W / 2); bvx += off * 0.8;
      const s = Math.sqrt(bvx*bvx+bvy*bvy); bvx=bvx/s*BSPEED; bvy=bvy/s*BSPEED;
    }
    if (by + BALL_R < 0)  { pScore++; resetBall(true); }
    if (by - BALL_R > ch) { aScore++; resetBall(false); }
    pc.clearRect(0, 0, cw, ch);
    pc.save(); pc.setLineDash([4,10]); pc.strokeStyle='rgba(255,255,255,0.05)'; pc.lineWidth=1;
    pc.beginPath(); pc.moveTo(0,ch/2); pc.lineTo(cw,ch/2); pc.stroke(); pc.restore();
    pc.fillStyle='rgba(255,255,255,0.2)'; pc.fillRect(aiX-PAD_W/2,PAD_MARG,PAD_W,PAD_H);
    pc.save(); pc.fillStyle=ac; pc.shadowBlur=10; pc.shadowColor=ac;
    pc.fillRect(playerX-PAD_W/2,ch-PAD_MARG-PAD_H,PAD_W,PAD_H); pc.restore();
    pc.save(); pc.beginPath(); pc.arc(bx,by,BALL_R,0,Math.PI*2);
    pc.fillStyle=ac; pc.shadowBlur=14; pc.shadowColor=ac; pc.fill(); pc.restore();
    pc.font="700 13px 'Space Mono',monospace"; pc.fillStyle='rgba(255,255,255,0.18)';
    pc.textAlign='left';  pc.fillText(aScore,12,22);
    pc.textAlign='right'; pc.fillText(pScore,cw-12,ch-10);
    if (pScore+aScore===0) {
      pc.font="9px 'Space Mono',monospace"; pc.fillStyle='rgba(255,255,255,0.1)';
      pc.textAlign='center'; pc.fillText('← → ARROWS TO PLAY',cw/2,ch-8);
    }
    gameRAF = requestAnimationFrame(tickPong);
  }

  /* ── SNAKE — collect skill words ── */
  const CELL = 16;
  const SKILL_WORDS = ['AI','3D','DAW','VR','AR','XR','SFX','OSC','MIDI','DSP','RAP','MIX'];
  let snakeBody, snakeDir, snakeNext, snakeFood, snakeFoodWord, snakeScore, snakeDead, snakeLastTime;
  const SNAKE_MS = 145;

  function initSnake() {
    const cols = Math.floor(cw / CELL), rows = Math.floor(ch / CELL);
    const mx = Math.floor(cols / 2), my = Math.floor(rows / 2);
    snakeBody  = [{x:mx,y:my},{x:mx-1,y:my},{x:mx-2,y:my}];
    snakeDir   = {x:1,y:0}; snakeNext = {x:1,y:0};
    snakeScore = 0; snakeDead = false; snakeLastTime = 0;
    placeFood(cols, rows);
    gameRAF = requestAnimationFrame(tickSnake);
  }
  function placeFood(cols, rows) {
    let pos;
    do { pos = {x:Math.floor(Math.random()*cols), y:Math.floor(Math.random()*rows)}; }
    while (snakeBody.some(s => s.x===pos.x && s.y===pos.y));
    snakeFood = pos;
    snakeFoodWord = SKILL_WORDS[Math.floor(Math.random() * SKILL_WORDS.length)];
  }
  function tickSnake(ts) {
    if (activeGame !== 'snake') return;
    const ac = getAccent();
    if (!snakeDead && ts - snakeLastTime >= SNAKE_MS) {
      snakeLastTime = ts;
      snakeDir = {...snakeNext};
      const cols = Math.floor(cw/CELL), rows = Math.floor(ch/CELL);
      const head = {x:snakeBody[0].x+snakeDir.x, y:snakeBody[0].y+snakeDir.y};
      if (head.x<0||head.x>=cols||head.y<0||head.y>=rows||snakeBody.some(s=>s.x===head.x&&s.y===head.y)) {
        snakeDead = true;
      } else {
        snakeBody.unshift(head);
        if (head.x===snakeFood.x && head.y===snakeFood.y) { snakeScore++; placeFood(cols,rows); }
        else snakeBody.pop();
      }
    }
    pc.clearRect(0,0,cw,ch);
    pc.fillStyle='rgba(255,255,255,0.02)';
    for (let x=CELL;x<cw;x+=CELL) for (let y=CELL;y<ch;y+=CELL) pc.fillRect(x-0.5,y-0.5,1,1);
    // food word
    pc.save();
    pc.font="bold 8px 'Space Mono',monospace";
    pc.fillStyle=ac; pc.shadowBlur=8; pc.shadowColor=ac;
    pc.textAlign='center'; pc.textBaseline='middle';
    pc.fillText(snakeFoodWord, snakeFood.x*CELL+CELL/2, snakeFood.y*CELL+CELL/2);
    pc.restore();
    const rgb = hexToRgb(ac);
    snakeBody.forEach((seg,i) => {
      const t = 1 - i/snakeBody.length;
      pc.fillStyle = i===0 ? ac : `rgba(${rgb},${0.18+t*0.5})`;
      pc.fillRect(seg.x*CELL+1,seg.y*CELL+1,CELL-2,CELL-2);
    });
    pc.font="700 11px 'Space Mono',monospace"; pc.fillStyle='rgba(255,255,255,0.2)';
    pc.textBaseline='alphabetic'; pc.textAlign='left'; pc.fillText(snakeScore,8,18);
    if (snakeDead) {
      pc.fillStyle='rgba(8,8,8,0.75)'; pc.fillRect(0,0,cw,ch);
      pc.font="700 13px 'Space Mono',monospace"; pc.fillStyle=ac;
      pc.textAlign='center'; pc.fillText('GAME OVER',cw/2,ch/2-12);
      pc.font="10px 'Space Mono',monospace"; pc.fillStyle='rgba(255,255,255,0.3)';
      pc.fillText('SCORE: '+snakeScore,cw/2,ch/2+8);
      pc.fillText('ENTER TO RESTART',cw/2,ch/2+26);
    } else if (snakeScore===0) {
      pc.font="9px 'Space Mono',monospace"; pc.fillStyle='rgba(255,255,255,0.12)';
      pc.textAlign='center'; pc.fillText('COLLECT SKILL WORDS  ←↑↓→',cw/2,ch-8);
    }
    gameRAF = requestAnimationFrame(tickSnake);
  }
  /* ── BREAKOUT — arrow keys, slower speed ── */
  const BW=60, BH=6, BPAD_MARG=18, BB_R=5, BRK_SPEED=2.6;
  const BRK_ROWS=5, BRK_COLS=8;
  let brkBx,brkBy,brkBvx,brkBvy,brkPadX,brkBricks,brkScore,brkDead;
  let brkLeft=false, brkRight=false;

  function initBreakout() {
    brkPadX=cw/2; brkScore=0; brkDead=false;
    brkBx=cw/2; brkBy=ch-55;
    const a=-Math.PI/2+(Math.random()-0.5)*0.7;
    brkBvx=Math.cos(a)*BRK_SPEED; brkBvy=Math.sin(a)*BRK_SPEED;
    brkLeft=brkRight=false;
    brkBricks=[];
    const bW=(cw-14)/BRK_COLS, bHh=11;
    for(let r=0;r<BRK_ROWS;r++) for(let c=0;c<BRK_COLS;c++)
      brkBricks.push({x:7+c*(bW+2),y:22+r*(bHh+4),w:bW,h:bHh,alive:true,row:r});
    gameRAF=requestAnimationFrame(tickBreakout);
  }
  function tickBreakout() {
    if (activeGame !== 'breakout') return;
    const ac = getAccent();
    const BRK_PAD_SPD = 5;
    if (!brkDead) {
      if (brkLeft)  brkPadX=Math.max(BW/2,     brkPadX-BRK_PAD_SPD);
      if (brkRight) brkPadX=Math.min(cw-BW/2,  brkPadX+BRK_PAD_SPD);
      brkBx+=brkBvx; brkBy+=brkBvy;
      if(brkBx<BB_R)      {brkBx=BB_R;      brkBvx= Math.abs(brkBvx);}
      if(brkBx>cw-BB_R)   {brkBx=cw-BB_R;   brkBvx=-Math.abs(brkBvx);}
      if(brkBy<BB_R)      {brkBy=BB_R;       brkBvy= Math.abs(brkBvy);}
      if(brkBy>ch+20)     {brkDead=true;}
      const pY=ch-BPAD_MARG-BH;
      if(brkBvy>0&&brkBy+BB_R>=pY&&brkBy-BB_R<=pY+BH&&
         brkBx>=brkPadX-BW/2&&brkBx<=brkPadX+BW/2) {
        brkBvy=-Math.abs(brkBvy); brkBy=pY-BB_R;
        const off=(brkBx-brkPadX)/(BW/2); brkBvx+=off*1.5;
        const s=Math.sqrt(brkBvx*brkBvx+brkBvy*brkBvy);
        brkBvx=brkBvx/s*BRK_SPEED; brkBvy=brkBvy/s*BRK_SPEED;
      }
      let allGone=true;
      for(const b of brkBricks) {
        if(!b.alive) continue; allGone=false;
        if(brkBx+BB_R>b.x&&brkBx-BB_R<b.x+b.w&&brkBy+BB_R>b.y&&brkBy-BB_R<b.y+b.h) {
          b.alive=false; brkScore++;
          const oL=brkBx+BB_R-b.x, oR=b.x+b.w-(brkBx-BB_R);
          const oT=brkBy+BB_R-b.y, oB=b.y+b.h-(brkBy-BB_R);
          if(Math.min(oL,oR)<Math.min(oT,oB)) brkBvx=-brkBvx; else brkBvy=-brkBvy;
          break;
        }
      }
      if(allGone) initBreakout();
    }
    pc.clearRect(0,0,cw,ch);
    brkBricks.forEach(b=>{
      if(!b.alive) return;
      const t=1-b.row/BRK_ROWS;
      pc.save(); pc.globalAlpha=0.15+t*0.5; pc.fillStyle=ac; pc.fillRect(b.x,b.y,b.w,b.h);
      pc.globalAlpha=0.3+t*0.4; pc.strokeStyle=ac; pc.lineWidth=0.5; pc.strokeRect(b.x,b.y,b.w,b.h);
      pc.restore();
    });
    pc.save(); pc.fillStyle=ac; pc.shadowBlur=8; pc.shadowColor=ac;
    pc.fillRect(brkPadX-BW/2,ch-BPAD_MARG-BH,BW,BH); pc.restore();
    pc.save(); pc.beginPath(); pc.arc(brkBx,brkBy,BB_R,0,Math.PI*2);
    pc.fillStyle=ac; pc.shadowBlur=12; pc.shadowColor=ac; pc.fill(); pc.restore();
    pc.font="700 11px 'Space Mono',monospace"; pc.fillStyle='rgba(255,255,255,0.2)';
    pc.textAlign='left'; pc.fillText(brkScore,8,14);
    if(brkDead) {
      pc.fillStyle='rgba(8,8,8,0.75)'; pc.fillRect(0,0,cw,ch);
      pc.font="700 14px 'Space Mono',monospace"; pc.fillStyle=ac;
      pc.textAlign='center'; pc.fillText('GAME OVER',cw/2,ch/2-12);
      pc.font="10px 'Space Mono',monospace"; pc.fillStyle='rgba(255,255,255,0.3)';
      pc.fillText('SCORE: '+brkScore,cw/2,ch/2+8);
      pc.fillText('ENTER TO RESTART',cw/2,ch/2+26);
    } else if(brkScore===0) {
      pc.font="9px 'Space Mono',monospace"; pc.fillStyle='rgba(255,255,255,0.12)';
      pc.textAlign='center'; pc.fillText('← → ARROWS TO MOVE',cw/2,ch-5);
    }
    gameRAF=requestAnimationFrame(tickBreakout);
  }

  /* ── TETRIS — standard arrow controls ── */
  const TET_COLS = 22;
  const PIECES = [
    [[1,1,1,1]],
    [[1,1],[1,1]],
    [[0,1,0],[1,1,1]],
    [[1,0,0],[1,1,1]],
    [[0,0,1],[1,1,1]],
    [[1,1,0],[0,1,1]],
    [[0,1,1],[1,1,0]],
  ];
  let tetBoard,tetPiece,tetPX,tetPY,tetNext,tetScore,tetDead,tetLastTime,tetDropMs;

  function tetCellW() { return Math.floor(cw / TET_COLS); }
  function tetRows()  { return Math.floor(ch / tetCellW()); }

  function initTetris() {
    const rows = tetRows();
    tetBoard = Array.from({length:rows}, () => new Array(TET_COLS).fill(0));
    tetScore = 0; tetDead = false; tetLastTime = 0; tetDropMs = 600;
    tetNext = randomPiece(); spawnTet();
    gameRAF = requestAnimationFrame(tickTetris);
  }
  function randomPiece() { return JSON.parse(JSON.stringify(PIECES[Math.floor(Math.random()*PIECES.length)])); }
  function spawnTet() {
    tetPiece = tetNext; tetNext = randomPiece();
    tetPX = Math.floor((TET_COLS - tetPiece[0].length) / 2);
    tetPY = 0;
    if (tetCollide(tetPiece,tetPX,tetPY)) tetDead = true;
  }
  function tetCollide(piece,px,py) {
    for(let r=0;r<piece.length;r++) for(let c=0;c<piece[r].length;c++) {
      if(!piece[r][c]) continue;
      const nx=px+c, ny=py+r;
      if(nx<0||nx>=TET_COLS||ny>=tetRows()) return true;
      if(ny>=0&&tetBoard[ny]&&tetBoard[ny][nx]) return true;
    }
    return false;
  }
  function tetRotate(p) { return p[0].map((_,i)=>p.map(row=>row[i]).reverse()); }
  function tetLock() {
    for(let r=0;r<tetPiece.length;r++) for(let c=0;c<tetPiece[r].length;c++) {
      if(!tetPiece[r][c]) continue;
      const ny=tetPY+r;
      if(ny>=0&&tetBoard[ny]) tetBoard[ny][tetPX+c]=1;
    }
    let cleared=0;
    for(let r=tetBoard.length-1;r>=0;r--) {
      if(tetBoard[r].every(c=>c)){tetBoard.splice(r,1);tetBoard.unshift(new Array(TET_COLS).fill(0));cleared++;r++;}
    }
    tetScore+=cleared*cleared*10+1;
    if(cleared>=2) tetDropMs=Math.max(120,tetDropMs-15);
    spawnTet();
  }
  function tickTetris(ts) {
    if(activeGame!=='tetris') return;
    const ac=getAccent(), cw2=tetCellW(), ch2=cw2;
    if(!tetDead&&ts-tetLastTime>=tetDropMs) {
      tetLastTime=ts;
      if(!tetCollide(tetPiece,tetPX,tetPY+1)) tetPY++; else tetLock();
    }
    pc.clearRect(0,0,cw,ch);
    const rgb=hexToRgb(ac);
    for(let r=0;r<tetBoard.length;r++) for(let c=0;c<TET_COLS;c++) {
      if(tetBoard[r][c]) {
        pc.fillStyle=`rgba(${rgb},0.5)`; pc.fillRect(c*cw2+1,r*ch2+1,cw2-2,ch2-2);
        pc.strokeStyle=`rgba(${rgb},0.2)`; pc.lineWidth=0.5; pc.strokeRect(c*cw2+1,r*ch2+1,cw2-2,ch2-2);
      } else {
        pc.strokeStyle='rgba(255,255,255,0.03)'; pc.lineWidth=0.5; pc.strokeRect(c*cw2,r*ch2,cw2,ch2);
      }
    }
    if(!tetDead) {
      let gy=tetPY; while(!tetCollide(tetPiece,tetPX,gy+1)) gy++;
      for(let r=0;r<tetPiece.length;r++) for(let c=0;c<tetPiece[r].length;c++) {
        if(!tetPiece[r][c]) continue;
        pc.fillStyle=`rgba(${rgb},0.1)`; pc.fillRect((tetPX+c)*cw2+1,(gy+r)*ch2+1,cw2-2,ch2-2);
      }
      pc.save(); pc.fillStyle=ac; pc.shadowBlur=8; pc.shadowColor=ac;
      for(let r=0;r<tetPiece.length;r++) for(let c=0;c<tetPiece[r].length;c++) {
        if(!tetPiece[r][c]) continue;
        pc.fillRect((tetPX+c)*cw2+1,(tetPY+r)*ch2+1,cw2-2,ch2-2);
      }
      pc.restore();
    }
    pc.font="700 11px 'Space Mono',monospace"; pc.fillStyle='rgba(255,255,255,0.2)';
    pc.textAlign='right'; pc.fillText(tetScore,cw-6,14);
    if(tetScore===0&&!tetDead){
      pc.font="9px 'Space Mono',monospace"; pc.fillStyle='rgba(255,255,255,0.12)';
      pc.textAlign='center'; pc.fillText('← → ↑ROTATE ↓DROP  SPC=FALL',cw/2,ch-5);
    }
    if(tetDead){
      pc.fillStyle='rgba(8,8,8,0.8)'; pc.fillRect(0,0,cw,ch);
      pc.font="700 13px 'Space Mono',monospace"; pc.fillStyle=ac;
      pc.textAlign='center'; pc.fillText('GAME OVER',cw/2,ch/2-12);
      pc.font="10px 'Space Mono',monospace"; pc.fillStyle='rgba(255,255,255,0.3)';
      pc.fillText('SCORE: '+tetScore,cw/2,ch/2+8);
      pc.fillText('ENTER TO RESTART',cw/2,ch/2+26);
    }
    gameRAF=requestAnimationFrame(tickTetris);
  }

  /* ── ASTEROIDS — ←/→ rotate, ↑ thrust, Space shoot ── */
  let astShip, astBullets, astRocks, astScore, astDead;
  let astLeft=false, astRight=false, astUp=false, astShootCool=0;

  function initAsteroids() {
    astShip={x:cw/2,y:ch/2,angle:-Math.PI/2,vx:0,vy:0};
    astBullets=[]; astRocks=[]; astScore=0; astDead=false;
    astLeft=astRight=astUp=false; astShootCool=0;
    for(let i=0;i<4;i++) astSpawn(null,2);
    gameRAF=requestAnimationFrame(tickAsteroids);
  }
  function astSpawn(pos,tier) {
    const r=[12,22,36][tier];
    let x,y;
    if(!pos){
      const e=Math.floor(Math.random()*4);
      if(e===0){x=Math.random()*cw;y=-r;}
      else if(e===1){x=cw+r;y=Math.random()*ch;}
      else if(e===2){x=Math.random()*cw;y=ch+r;}
      else{x=-r;y=Math.random()*ch;}
    } else {x=pos.x;y=pos.y;}
    const spd=(1.2-tier*0.3)*(0.5+Math.random()*0.8);
    const ang=Math.random()*Math.PI*2;
    const n=7+Math.floor(Math.random()*4);
    const verts=Array.from({length:n},(_,i)=>{const a=(i/n)*Math.PI*2;return{a,r:r*(0.6+Math.random()*0.5)};});
    astRocks.push({x,y,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,rot:Math.random()*Math.PI*2,rotV:(Math.random()-0.5)*0.04,r,tier,verts});
  }
  function tickAsteroids() {
    if(activeGame!=='asteroids') return;
    const ac=getAccent(), rgb=hexToRgb(ac);
    if(!astDead){
      if(astLeft)  astShip.angle-=0.055;
      if(astRight) astShip.angle+=0.055;
      if(astUp){astShip.vx+=Math.cos(astShip.angle)*0.14;astShip.vy+=Math.sin(astShip.angle)*0.14;}
      astShip.vx*=0.984; astShip.vy*=0.984;
      const spd=Math.sqrt(astShip.vx*astShip.vx+astShip.vy*astShip.vy);
      if(spd>5.5){astShip.vx=astShip.vx/spd*5.5;astShip.vy=astShip.vy/spd*5.5;}
      astShip.x=(astShip.x+astShip.vx+cw)%cw;
      astShip.y=(astShip.y+astShip.vy+ch)%ch;
      if(astShootCool>0) astShootCool--;
      // bullets
      for(let i=astBullets.length-1;i>=0;i--){
        const b=astBullets[i];b.x+=b.vx;b.y+=b.vy;b.life--;
        if(b.life<=0||b.x<-10||b.x>cw+10||b.y<-10||b.y>ch+10)astBullets.splice(i,1);
      }
      // rocks
      for(const r of astRocks){r.x=(r.x+r.vx+cw)%cw;r.y=(r.y+r.vy+ch)%ch;r.rot+=r.rotV;}
      // bullet-rock hits
      outer: for(let bi=astBullets.length-1;bi>=0;bi--){
        const b=astBullets[bi];
        for(let ri=astRocks.length-1;ri>=0;ri--){
          const r=astRocks[ri];
          if((b.x-r.x)**2+(b.y-r.y)**2<r.r*r.r){
            astBullets.splice(bi,1);astRocks.splice(ri,1);
            astScore+=3-r.tier;
            if(r.tier>0){astSpawn({x:r.x,y:r.y},r.tier-1);astSpawn({x:r.x,y:r.y},r.tier-1);}
            if(astRocks.length===0)for(let k=0;k<4+Math.floor(astScore/25);k++)astSpawn(null,2);
            continue outer;
          }
        }
      }
      // ship-rock collision
      for(const r of astRocks){if((astShip.x-r.x)**2+(astShip.y-r.y)**2<(r.r+7)**2){astDead=true;break;}}
    }
    pc.clearRect(0,0,cw,ch);
    // rocks
    for(const r of astRocks){
      pc.save();pc.translate(r.x,r.y);pc.rotate(r.rot);
      pc.beginPath();r.verts.forEach((v,i)=>{const x=Math.cos(v.a)*v.r,y=Math.sin(v.a)*v.r;i===0?pc.moveTo(x,y):pc.lineTo(x,y);});
      pc.closePath();pc.strokeStyle=`rgba(${rgb},0.55)`;pc.lineWidth=1;pc.stroke();pc.restore();
    }
    // bullets
    for(const b of astBullets){pc.save();pc.beginPath();pc.arc(b.x,b.y,2,0,Math.PI*2);pc.fillStyle=ac;pc.shadowBlur=6;pc.shadowColor=ac;pc.fill();pc.restore();}
    // ship
    if(!astDead){
      pc.save();pc.translate(astShip.x,astShip.y);pc.rotate(astShip.angle);
      pc.beginPath();pc.moveTo(12,0);pc.lineTo(-8,6);pc.lineTo(-5,0);pc.lineTo(-8,-6);pc.closePath();
      pc.strokeStyle=ac;pc.lineWidth=1.5;if(astUp){pc.shadowBlur=8;pc.shadowColor=ac;}pc.stroke();
      if(astUp){pc.beginPath();pc.moveTo(-5,0);pc.lineTo(-5-(4+Math.random()*7),0);pc.strokeStyle=`rgba(${rgb},0.55)`;pc.lineWidth=1;pc.stroke();}
      pc.restore();
    }
    pc.font="700 11px 'Space Mono',monospace";pc.fillStyle='rgba(255,255,255,0.2)';
    pc.textAlign='left';pc.fillText(astScore,8,14);
    if(!astDead&&astScore===0){pc.font="9px 'Space Mono',monospace";pc.fillStyle='rgba(255,255,255,0.12)';pc.textAlign='center';pc.fillText('← → ↑THRUST  SPC=FIRE',cw/2,ch-5);}
    if(astDead){
      pc.fillStyle='rgba(8,8,8,0.8)';pc.fillRect(0,0,cw,ch);
      pc.font="700 13px 'Space Mono',monospace";pc.fillStyle=ac;pc.textAlign='center';pc.fillText('GAME OVER',cw/2,ch/2-12);
      pc.font="10px 'Space Mono',monospace";pc.fillStyle='rgba(255,255,255,0.3)';
      pc.fillText('SCORE: '+astScore,cw/2,ch/2+8);pc.fillText('ENTER TO RESTART',cw/2,ch/2+26);
    }
    gameRAF=requestAnimationFrame(tickAsteroids);
  }

  /* ── FLAPPY — Space / ↑ to flap ── */
  const FLAP_GAP=88, FLAP_SPD=2.0, FLAP_W=32;
  let flapBird, flapPipes, flapScore, flapDead, flapStarted;

  function initFlappy() {
    flapBird={x:Math.floor(cw*0.25),y:Math.floor(ch*0.45),vy:0,r:7};
    flapPipes=[]; flapScore=0; flapDead=false; flapStarted=false;
    for(let i=0;i<3;i++) flapPipes.push(makePipe(cw+i*(cw*0.44+FLAP_W)));
    gameRAF=requestAnimationFrame(tickFlappy);
  }
  function makePipe(x){const gy=ch*0.22+Math.random()*(ch*0.5);return{x,gy,scored:false};}
  function tickFlappy() {
    if(activeGame!=='flappy') return;
    const ac=getAccent(), rgb=hexToRgb(ac);
    if(flapStarted&&!flapDead){
      flapBird.vy=Math.min(flapBird.vy+0.32, 9);
      flapBird.y+=flapBird.vy;
      for(const p of flapPipes){
        p.x-=FLAP_SPD;
        if(!p.scored&&p.x+FLAP_W<flapBird.x){p.scored=true;flapScore++;}
      }
      if(flapPipes[0].x+FLAP_W<0){flapPipes.shift();flapPipes.push(makePipe(flapPipes[flapPipes.length-1].x+cw*0.42+FLAP_W));}
      for(const p of flapPipes){
        const inX=flapBird.x+flapBird.r>p.x&&flapBird.x-flapBird.r<p.x+FLAP_W;
        if(inX&&(flapBird.y-flapBird.r<p.gy-FLAP_GAP/2||flapBird.y+flapBird.r>p.gy+FLAP_GAP/2))flapDead=true;
      }
      if(flapBird.y-flapBird.r<0||flapBird.y+flapBird.r>ch)flapDead=true;
    }
    pc.clearRect(0,0,cw,ch);
    for(const p of flapPipes){
      const topH=p.gy-FLAP_GAP/2, botY=p.gy+FLAP_GAP/2;
      pc.save();pc.fillStyle=`rgba(${rgb},0.15)`;pc.strokeStyle=`rgba(${rgb},0.4)`;pc.lineWidth=1;
      pc.fillRect(p.x,0,FLAP_W,topH);pc.strokeRect(p.x,0,FLAP_W,topH);
      pc.fillRect(p.x,botY,FLAP_W,ch-botY);pc.strokeRect(p.x,botY,FLAP_W,ch-botY);
      pc.restore();
    }
    const tilt=Math.max(-0.5,Math.min(0.7,flapBird.vy*0.06));
    pc.save();pc.translate(flapBird.x,flapBird.y);pc.rotate(tilt);
    pc.beginPath();pc.arc(0,0,flapBird.r,0,Math.PI*2);
    pc.fillStyle=ac;pc.shadowBlur=10;pc.shadowColor=ac;pc.fill();pc.restore();
    pc.font="700 11px 'Space Mono',monospace";pc.fillStyle='rgba(255,255,255,0.2)';
    pc.textAlign='left';pc.fillText(flapScore,8,14);
    if(!flapStarted){pc.font="9px 'Space Mono',monospace";pc.fillStyle='rgba(255,255,255,0.18)';pc.textAlign='center';pc.fillText('SPACE / ↑ TO FLAP',cw/2,ch/2);}
    if(flapDead){
      pc.fillStyle='rgba(8,8,8,0.8)';pc.fillRect(0,0,cw,ch);
      pc.font="700 13px 'Space Mono',monospace";pc.fillStyle=ac;pc.textAlign='center';pc.fillText('GAME OVER',cw/2,ch/2-12);
      pc.font="10px 'Space Mono',monospace";pc.fillStyle='rgba(255,255,255,0.3)';
      pc.fillText('SCORE: '+flapScore,cw/2,ch/2+8);pc.fillText('ENTER TO RESTART',cw/2,ch/2+26);
    }
    gameRAF=requestAnimationFrame(tickFlappy);
  }

  /* ── Unified keyboard handler ── */
  document.addEventListener('keydown', e => {
    if(activeGame==='pong') {
      if(e.key==='ArrowLeft')  { pongLeft=true;  e.preventDefault(); }
      if(e.key==='ArrowRight') { pongRight=true; e.preventDefault(); }
    }
    if(activeGame==='snake') {
      const map={ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1}};
      const next=map[e.key];
      if(next&&!(next.x===-snakeDir.x&&next.y===-snakeDir.y)){snakeNext=next;e.preventDefault();}
      if(e.key==='Enter'&&snakeDead) initSnake();
    }
    if(activeGame==='breakout') {
      if(e.key==='ArrowLeft')  { brkLeft=true;  e.preventDefault(); }
      if(e.key==='ArrowRight') { brkRight=true; e.preventDefault(); }
      if(e.key==='Enter'&&brkDead) initBreakout();
    }
    if(activeGame==='tetris') {
      if(e.key==='ArrowLeft' &&!tetCollide(tetPiece,tetPX-1,tetPY)){tetPX--;e.preventDefault();}
      if(e.key==='ArrowRight'&&!tetCollide(tetPiece,tetPX+1,tetPY)){tetPX++;e.preventDefault();}
      if(e.key==='ArrowDown' ){if(!tetCollide(tetPiece,tetPX,tetPY+1))tetPY++;e.preventDefault();}
      if(e.key==='ArrowUp')  {const rot=tetRotate(tetPiece);if(!tetCollide(rot,tetPX,tetPY))tetPiece=rot;e.preventDefault();}
      if(e.key===' '){let d=tetPY;while(!tetCollide(tetPiece,tetPX,d+1))d++;tetPY=d;tetLock();e.preventDefault();}
      if(e.key==='Enter'&&tetDead) initTetris();
    }
    if(activeGame==='asteroids') {
      if(e.key==='ArrowLeft')  { astLeft=true;  e.preventDefault(); }
      if(e.key==='ArrowRight') { astRight=true; e.preventDefault(); }
      if(e.key==='ArrowUp')    { astUp=true;    e.preventDefault(); }
      if((e.key===' ')&&astShootCool<=0&&!astDead){
        astBullets.push({x:astShip.x+Math.cos(astShip.angle)*14,y:astShip.y+Math.sin(astShip.angle)*14,vx:Math.cos(astShip.angle)*8+astShip.vx,vy:Math.sin(astShip.angle)*8+astShip.vy,life:52});
        astShootCool=8; e.preventDefault();
      }
      if(e.key==='Enter'&&astDead) initAsteroids();
    }
    if(activeGame==='flappy') {
      if((e.key===' '||e.key==='ArrowUp')&&!flapDead){flapStarted=true;flapBird.vy=-5.5;e.preventDefault();}
      if(e.key==='Enter'&&flapDead) initFlappy();
    }
  });
  document.addEventListener('keyup', e => {
    if(e.key==='ArrowLeft')  { pongLeft=false;  brkLeft=false;  astLeft=false; }
    if(e.key==='ArrowRight') { pongRight=false; brkRight=false; astRight=false; }
    if(e.key==='ArrowUp')    { astUp=false; }
  });

  /* ============================================================
     PROJECTS CAROUSEL — icon glyphs, direct links
     ============================================================ */
  const projApp = document.getElementById('appProjects');
  const FEATURED = [
    {
      icon: '◉', iconLabel: 'AI · AGENT',
      title: 'Ottomate', tags: ['TypeScript','AI Agent','Automation'],
      role: 'Creator & Lead Dev', year: '2026',
      desc: 'Universal AI agent workbench. Goal → plan → code → deliver. 190+ connectors, 200+ skills.',
      href: 'https://github.com/RhythrosaLabs/otto-mate-2'
    },
    {
      icon: '⬡', iconLabel: 'AI · CREATIVE',
      title: 'brAInstormer', tags: ['AI','Python','Streamlit'],
      role: 'Creator & Lead Dev', year: '2023',
      desc: 'All-in-one AI creative suite. Generate images, video, audio & full marketing plans in one interface.',
      href: 'https://github.com/RhythrosaLabs'
    },
    {
      icon: '◈', iconLabel: 'UNITY · 3D',
      title: 'Trinkets', tags: ['Unity','3D','Interactive'],
      role: 'Designer, Developer & Composer', year: '2023',
      desc: 'A virtual museum. Explore original sound design, art & animations in 3D. Headphones recommended.',
      href: 'https://noodlebake.itch.io/trinkets'
    },
    {
      icon: '♦', iconLabel: 'MUSIC · VIDEO',
      title: 'Mend — Music Video', tags: ['Music Video','AI Animation','2022'],
      role: 'Director, Editor & Producer', year: '2022',
      desc: 'Music by Sidestep Complex. Early AI animation captured frame by frame.',
      href: 'https://www.youtube.com/watch?v=1-IJfLo25s4'
    },
    {
      icon: '▲', iconLabel: 'STREAMLIT CREATOR',
      title: 'Streamlit Creator', tags: ['Python','Streamlit','AI Tools'],
      role: 'Official Creator (Streamlit)', year: '2025–ongoing',
      desc: 'Official Streamlit Creator — autonomous AI tools for music generation, game design, and video production.',
      href: 'https://github.com/RhythrosaLabs/streamlit-components-demo'
    },
    {
      icon: '◎', iconLabel: 'RECORD LABEL',
      title: 'Noodlebake Records', tags: ['Music','Label','Indie'],
      role: 'Founder & A&R', year: '2020–ongoing',
      desc: 'Independent record label founded by Daniel Sheils. Releases spanning electronic, ambient, and experimental.',
      href: 'https://noodlebake.itch.io'
    },
    {
      icon: '⬖', iconLabel: 'AI · CHAT',
      title: 'DuoGPT', tags: ['AI','Python','Chat'],
      role: 'Creator & Lead Dev', year: '2024',
      desc: 'Two AI models debate, riff, and collaborate in real time. Emergent creativity from machine dialogue.',
      href: 'https://github.com/RhythrosaLabs'
    },
    {
      icon: '◭', iconLabel: 'GAME · AR',
      title: 'Prism Rider', tags: ['Unity','AR','Game'],
      role: 'Designer, Developer & Composer', year: '2024',
      desc: 'Augmented reality rhythm game. Ride light beams, dodge obstacles, and sync to original audio.',
      href: 'https://noodlebake.itch.io'
    },
    {
      icon: '⊞', iconLabel: 'MUSIC · VIDEO',
      title: 'The Raven — Music Video', tags: ['Music Video','Directed','2022'],
      role: 'Director, Editor & Composer', year: '2022',
      desc: 'Visual narrative built entirely from generative and found footage.',
      href: 'https://www.youtube.com/@danielsheils'
    },
  ];
  let projIdx=0, projInterval=null, projStarted=false;

  function showProject() {
    const slide = projApp.querySelector('.proj-slide');
    if (!slide) return;
    const p = FEATURED[projIdx];
    slide.style.opacity = '0';
    slide.style.transform = 'translateY(8px)';
    setTimeout(() => {
      slide.innerHTML = `
        <div class="proj-icon">
          <span class="proj-icon-glyph">${p.icon}</span>
          <span class="proj-icon-label">${p.iconLabel}</span>
        </div>
        <div class="proj-body">
          <h3 class="proj-title">${p.title}</h3>
          <div class="proj-meta"><span class="proj-role">${p.role}</span><span class="proj-year">${p.year}</span></div>
          <p class="proj-desc">${p.desc}</p>
          <div class="proj-tags">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div>
          <a href="${p.href}" target="_blank" class="proj-link">View Project ↗</a>
        </div>`;
      slide.style.opacity = '1';
      slide.style.transform = 'translateY(0)';
      projApp.querySelectorAll('.proj-dot').forEach((d,i)=>d.classList.toggle('active',i===projIdx));
    }, 180);
  }

  function startProjects() {
    projStarted = true;
    projApp.innerHTML = '<div class="proj-slide"></div><div class="proj-dots"></div>';
    FEATURED.forEach((_,i) => {
      const d = document.createElement('button');
      d.className = 'proj-dot'+(i===0?' active':'');
      d.addEventListener('click', () => {
        projIdx=i; showProject();
        clearInterval(projInterval);
        projInterval = setInterval(nextProj, 4500);
      });
      projApp.querySelector('.proj-dots').appendChild(d);
    });
    showProject();
    projInterval = setInterval(nextProj, 4500);
  }
  function nextProj() { projIdx=(projIdx+1)%FEATURED.length; showProject(); }

  /* ============================================================
     TERMINAL TYPEWRITER
     ============================================================ */
  const termApp = document.getElementById('appTerminal');
  let termStarted = false;
  const TLINES = [
    { t:'cmd', s:'whoami' },
    { t:'out', s:'daniel_sheils // creative technologist' },
    { t:'cmd', s:'uname -a' },
    { t:'out', s:'Human · Musician · Builder · v18.0' },
    { t:'cmd', s:'cat skills.txt' },
    { t:'out', s:'Sound Design  AR/VR/XR  AI/ML' },
    { t:'out', s:'Game Dev  Unity  Python  Streamlit' },
    { t:'out', s:'Music  Mixing  Mastering  Live Sound' },
    { t:'out', s:'Visual Arts  3D  Video  Robotics' },
    { t:'cmd', s:'ls projects/' },
    { t:'out', s:'ottomate/       brainstormer/' },
    { t:'out', s:'trinkets/       soundstorm/' },
    { t:'out', s:'duogpt/         game-maker/' },
    { t:'out', s:'prism-rider/    mend-mv/' },
    { t:'out', s:'labelflow/      the-raven-mv/' },
    { t:'out', s:'streamlit-components/  +3 more' },
    { t:'cmd', s:'cat clients.txt' },
    { t:'out', s:'Red Bull · Microsoft · Intel · Amazon' },
    { t:'out', s:'Motorola · Lenovo · The Glenlivet' },
    { t:'out', s:"San Diego Padres · Alzheimer's Assoc." },
    { t:'cmd', s:'cat music.txt' },
    { t:'out', s:'~30 solo & collab albums recorded' },
    { t:'out', s:'hundreds of artists produced & mixed' },
    { t:'out', s:'toured nationally · radio shows · DJ sets' },
    { t:'cmd', s:'git log --oneline | head' },
    { t:'out', s:'a4f3e1 Add AI agent workbench' },
    { t:'out', s:'9c2d88 Ship Streamlit creator tools' },
    { t:'out', s:'3e91fa Build Trinkets 3D museum' },
    { t:'out', s:'77b2c0 Compose Mend music video' },
    { t:'cmd', s:'echo $STATUS' },
    { t:'out', s:'available for hire · open to collabs' },
    { t:'cmd', s:'open https://linkedin.com/in/danielsheils' },
    { t:'out', s:'launching browser...' },
  ];
  function startTerminal() {
    termStarted = true;
    termApp.innerHTML = '<div class="term-body" id="termBody"></div>';
    runTerm(document.getElementById('termBody'), 0);
  }
  function runTerm(body, i) {
    if (i >= TLINES.length) { setTimeout(()=>{ body.innerHTML=''; runTerm(body,0); },2800); return; }
    const line = TLINES[i];
    const div = document.createElement('div');
    div.className = 'term-line term-'+line.t;
    body.appendChild(div);
    if (line.t==='cmd') {
      div.textContent='$ '; let j=0;
      const iv=setInterval(()=>{
        div.textContent='$ '+line.s.slice(0,++j);
        body.scrollTop=body.scrollHeight;
        if(j>=line.s.length){clearInterval(iv);setTimeout(()=>runTerm(body,i+1),320);}
      },48);
    } else {
      div.textContent=line.s;
      body.scrollTop=body.scrollHeight;
      setTimeout(()=>runTerm(body,i+1),80);
    }
  }

  /* ── Init ── */
  /* ── Border particle system ── */
  const partCv = document.createElement('canvas');
  partCv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:10;';
  panel.appendChild(partCv);
  const ptx = partCv.getContext('2d');
  const PART_N = 52;
  const parts = [];

  function perimXY(t, W, H) {
    const d = t * 2 * (W + H);
    if (d < W)         return {x: d,       y: 0,       nx: 0,  ny: 1};
    if (d < W + H)     return {x: W,        y: d - W,   nx: -1, ny: 0};
    if (d < 2*W + H)   return {x: W-(d-W-H),y: H,       nx: 0,  ny: -1};
    return               {x: 0,       y: H-(d-2*W-H), nx: 1, ny: 0};
  }
  function initParticles() {
    const W = panel.clientWidth, H = panel.clientHeight;
    partCv.width = W; partCv.height = H;
    parts.length = 0;
    for (let i = 0; i < PART_N; i++) {
      parts.push({
        t:       Math.random(),
        speed:   0.00012 + Math.random() * 0.00028,
        depth:   1 + Math.random() * 28,
        depthPh: Math.random() * Math.PI * 2,
        depthSpd:0.25 + Math.random() * 1.1,
        size:    0.4 + Math.random() * 1.7,
        alpha:   0.04 + Math.random() * 0.19,
        pulse:   Math.random() * Math.PI * 2,
        pulseSpd:0.25 + Math.random() * 0.9,
      });
    }
  }
  function tickParticles() {
    const W = partCv.width, H = partCv.height;
    if (!W || !H) { requestAnimationFrame(tickParticles); return; }
    const ac = getAccent(), rgb = hexToRgb(ac);
    ptx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.t        = (p.t + p.speed) % 1;
      p.pulse    += 0.016 * p.pulseSpd;
      p.depthPh  += 0.016 * p.depthSpd;
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

  // Always start terminal in background so it's ready whenever the tab is picked
  startTerminal();

  // Randomise the starting tab + game on every page load
  (function randomInit() {
    const GAMES = ['pong','snake','breakout','tetris','asteroids','flappy'];
    // 9 total slots: 6 games + projects + terminal + community
    const pick  = Math.floor(Math.random() * (GAMES.length + 3));
    if (pick < GAMES.length) {
      activeGame = GAMES[pick];
      pongApp.querySelectorAll('.game-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.game === activeGame);
      });
      setTimeout(() => {
        resizeGame(); initParticles(); tickParticles();
        switchTab('pong');
      }, 420);
    } else {
    const extra = ['projects','terminal','community'][pick - GAMES.length];
      setTimeout(() => {
        resizeGame(); initParticles(); tickParticles();
        switchTab(extra);
      }, 420);
    }
  }());
  window.addEventListener('resize', () => {
    resizeGame(); cancelGame(); initParticles();
    if (activeGame==='pong')      initPong();
    if (activeGame==='snake')     initSnake();
    if (activeGame==='breakout')  initBreakout();
    if (activeGame==='tetris')    initTetris();
    if (activeGame==='asteroids') initAsteroids();
    if (activeGame==='flappy')    initFlappy();
  });
}());
/* ==== PANEL END ==== */
