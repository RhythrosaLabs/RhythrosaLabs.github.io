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
