# Mobile architectural cinema refinement

Specification: C:/Users/Twilight/Downloads/02-mobile-refinement.md. Same approved site and architecture.

Scope update: User chose "Use portrait stills for now" after the 1080p portrait video request was rejected for insufficient credits. The delivered mobile story uses normal flow and matching portrait drawing/final stills. No generation remains pending.

- [x] Generate and inspect matching portrait final/drawing stills; store provenance. Video request rejected, then superseded by user's still-only choice.
- [x] Select responsive posters before requests, use separate static stills, cancel old animation requests and release bitmaps on breakpoint change.
- [x] Visual-first mobile opening, short headline/action, visible skip, flowing narrative and finished-house reveal/action. Mobile frame timing prepared and tested for a future verified sequence; current mobile presentation is static.
- [x] Fixed safe-area-aware brand/hamburger navigation, 44px target, focus management, Escape/selection close and clear anchors. Mobile spacing and input typography refined.
- [x] Verify five mobile/tablet sizes, portrait-only networking, breakpoint cleanup, reduced motion, persistent navigation, desktop regression, unit tests/typecheck/build and independent code review.

Implementation choices: breakpoint 900px; 1080x1920 delivered portrait stills. Keep same house and ivory environment. Poster-only mobile requests no animation frames. Original media: assets/story/mobile/ (gitignored); delivered public/story/mobile/. Detailed production evidence: docs/architectural-cinema-production.md.
