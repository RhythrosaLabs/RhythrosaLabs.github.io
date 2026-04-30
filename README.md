# danielsheils.github.io — Portfolio Site

A personal portfolio for **Daniel Sheils** — sound designer, music producer, game developer, visual artist, and creative technologist. Built as a static site with vanilla HTML, CSS, and JavaScript. No frameworks, no build step, no dependencies — just open and ship.

**Live site:** [https://rhythrosalabs.github.io](https://rhythrosalabs.github.io)

---

## About

This site was designed to mirror the aesthetic of modern developer/product landing pages — dark terminal feel, bold typographic hierarchy, smooth scroll-triggered animations — while showcasing a creative career spanning 18+ years across:

- Sound design (AR/VR/XR, game audio, spatial audio)
- Music production (nearly 30 solo albums, studio & live collaboration)
- Game development (Unity — *Prism Rider*, *Something Is Missing*)
- AI-powered creative software (*brAInstormer*, *Game Maker*, *Soundstorm*, *DuoGPT*)
- Visual arts (album covers, music videos, 3D assets, branding)
- Teaching (game design & generative AI at Westport Library)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Markup | HTML5 (semantic) |
| Styles | CSS3 (custom properties, Grid, Flexbox, animations) |
| Scripting | Vanilla JavaScript (ES2020+) |
| Fonts | Google Fonts — Space Grotesk + Space Mono |
| Hosting | GitHub Pages (auto-deploy from `main`) |

No npm. No bundler. No framework. The entire site is three files.

---

## File Structure

```
/
├── index.html    # All markup and content
├── style.css     # All styles, layout, animations, responsive rules
├── script.js     # Cursor, scroll animations, glitch effect, parallax
└── README.md
```

---

## Features

### Visual / UX
- **Custom cursor** — glowing dot with a trailing ring; scales on hover over interactive elements
- **Animated background grid** — subtle CSS grid with radial-gradient mask
- **Noise overlay** — SVG fractal noise for texture
- **Hero entrance animation** — staggered `translateY` slide-ins on page load
- **Glitch text effect** — hover the hero title letters to trigger a character-scramble animation
- **Scroll parallax** — hero title and sub-text shift at different rates on scroll

### Scroll Animations (`IntersectionObserver`)
- Skill blocks fade + slide up with configurable stagger delay (`data-delay`)
- Timeline items slide in from the left, staggered sequentially
- Stat cards, project rows, and contact links fade up on first entry into viewport

### Navigation
- Sticky nav with blur backdrop
- Active section highlighting as you scroll
- Smooth-scroll anchor links

### Sections
1. **Hero** — Name, title, badge chips, CTAs, scroll indicator
2. **About** — Bio paragraphs + animated stat cards
3. **Skills** — 6-cell grid: Audio Engineering, Sound Design, Game Dev, AI & Software, Visual Arts, Music Production
4. **Projects** — 6 featured works in a list layout with hover slide-bar indicator
5. **Experience** — Full timeline from 2008 to present
6. **Contact** — External links (portfolio, GitHub)

---

## Updating Content

All content lives directly in `index.html` — no CMS, no data files. To update:

1. Edit `index.html` in any text editor
2. Commit and push:
   ```bash
   git add .
   git commit -m "update content"
   git push
   ```
3. GitHub Pages redeploys automatically in ~30 seconds

---

## Deploying Your Own Fork

1. Fork this repo and rename it to `yourusername.github.io`
2. GitHub Pages will auto-enable on the `main` branch
3. Your site will be live at `https://yourusername.github.io`

No configuration needed.

---

## Design Decisions

- **No JavaScript framework** — the site is purely presentational. React/Vue would be unnecessary overhead.
- **CSS custom properties** — the entire color palette lives in `:root` vars, making a theme swap a one-file edit.
- **`IntersectionObserver` over scroll events** — far more performant for scroll-triggered animations; no `requestAnimationFrame` loop needed.
- **`mix-blend-mode: difference`** on the cursor dot — creates an inversion effect over any element without needing separate cursor states per element.
- **Monospace + geometric sans pairing** — Space Mono for labels/tags/code-like elements; Space Grotesk for headings and body.

---

## Privacy Notes

- No analytics, tracking scripts, or cookies
- No contact form — no server, no data collection
- No email address published (to avoid scraping)
- All outbound links open in a new tab with `target="_blank"`

---

## License

MIT — feel free to fork and adapt for your own portfolio. Attribution appreciated but not required.

---

*Built with ♪ & code by Daniel Sheils — 2026*
