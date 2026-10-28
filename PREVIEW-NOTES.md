# Dan Sheils — Authentic portfolio revision

The eight rejected illustrated animations are removed from the active gallery and this package. Trinkets MP4/GIF/poster are retained unchanged from the approved version.

## What changed

- Trinkets leads the gallery as the actual walkthrough the user liked.
- Game Maker, DuoGPT, and Soundstorm now have nine-second source-interface tours. Their controls were rendered from the actual repository source, with real configuration input and no paid API calls or invented generated results.
- The other five projects use retained original output or portfolio artwork and direct project links. These are stills, not simulated gameplay or invented video footage.
- Clean cuts replace the broad flashing transition band. Double-exposure endings are removed from all three new clips. No composited ghost text or white sweep remains.
- The gallery uses a restrained editorial layout, larger media, quieter captions, and playback controls. Only the approved Trinkets hero starts automatically when sufficiently visible; reduced-motion preference disables automatic playback.

## Source-interface capture limits

These are configuration tours, not demonstrations of a completed AI generation. Game Maker ran from game-maker-public-dev/main.py in Streamlit. DuoGPT used DuoGPT6.py and its existing GPT_ALL6 interface, with the missing import supplied by the capture wrapper and the standard Fusion dark palette. Soundstorm ran its published tkinter interface. The current PyDub dependency lacks the imported Pulse symbol, so the capture wrapper supplied a compatibility alias to import and show the UI; no audio-generation output is claimed. All API network requests were disabled in the desktop capture wrappers. Repository source files were not published or modified.

Game Maker source: https://github.com/RhythrosaLabs/game-maker-public-dev
DuoGPT source: https://github.com/RhythrosaLabs/DuoGPT
Soundstorm source: https://github.com/RhythrosaLabs/soundstorm
Trinkets source footage: https://danielsheils.myportfolio.com/interactive-portfolio
Game artwork: https://danielsheils.myportfolio.com/game-design-1
AR/XR cover: https://danielsheils.myportfolio.com/work
Raven release artwork: https://scatterboxx.bandcamp.com/track/the-raven-2022-remaster
brAInstormer output: https://github.com/RhythrosaLabs/brAInstormer-cloud/blob/main/made%20with%20brAInstormer/images/image_1703127254754_932.png

## References reviewed

Screen Studio: https://screen.studio/create/product-demo-videos
Its focus on readable screen recordings and action-oriented zooms informed the restrained camera treatment.
Framer motion portfolio case study: https://www.framer.com/community/gallery/16678/
Its showreel-first approach and emphasis on keeping the work in focus informed the new gallery hierarchy.
Linear: https://linear.app/features
Its product-centered feature presentation was an additional comparison.

## Files

Open preview-gallery.html for the new presentation. index.html contains the prepared full portfolio. Keep proof.css, proof.js, style.css, script.js, and assets beside it. The retained GitHub profile cards in the visible software section use local copies of the seven original GitHub README GIFs.

Validation: all three new GIFs have 90 frames and nine-second duration. Chromium decoded all four videos without errors. All five stills loaded. Desktop and 390px mobile layouts were inspected, with no horizontal overflow or JavaScript errors. The existing project grid toggle still works. Approved Trinkets video SHA-256 begins ef3966a431fc2070 and was verified unchanged.

This is a staged review package, not a live deployment. Access to the user's local browser was not available in this session.

## Portfolio content corrections

- All seven current GitHub README animated project cards are visible in the main gallery, with local GIF copies included for reliable loading.
- Game Maker, DuoGPT, Soundstorm, and Trinkets remain in the full portfolio.
- The portfolio artist card and The Raven music credit use Scatterboxx. Dan Sheils remains the portfolio owner. No public music identity migration is implied.
- Sidestep Complex has its own past-project music card with catalog links, crediting Elizabeth Anaya Sheils and Scatterboxx. Description grounded in its published Bandcamp biography; inclusion explicitly requested by the user.
- Impairment Science, Inc.: Content Creator, contract, 2016–2018; marketing/promotional multimedia, social media management/content, company website and blog design/management. Removed incorrect broadcast/podcast duties.
- WEMF corrected to 2014–2016 and duties matched to the user-provided experience. Westport and Greenwich dates now use the supplied dates. Earlier confirmed Streamlit Ambassador status and Rock Paper Reality past-contract wording are retained.
- GitHub publishing remains blocked by integration write access (403). No live changes made.
