# Architectural cinema production record

## Delivery
Implemented locally in the existing React/Vite project. Preview: http://127.0.0.1:8444. Editable visual reference: /style-tile.html. No deployment or Git commit performed.

## Media and provenance
- Finished-house still: c9beae2e-0dc3-4e01-9ef8-10efff0fbc9d (gpt_image_2_6).
- Drawing still: 888cb4c2-e68e-4eca-a916-8dbe337b81ae (gpt_image_2_6).
- Continuous construction clip: 9db511c7-93c2-44ff-89f0-0f94221611e6 (Seedance 2.5, 10.042 seconds, 1280x720, no audio, first/last image references). Quote: 70 credits.
- Account access initially rejected; restored after user reconnection. All three generations completed and were downloaded. No pending generation.
- Prompts: architectural-cinema-prompts.json. Originals: gitignored assets/story/. Public assets: public/story/.
- FFmpeg extraction: 18 fps, 1280px, WebP quality 76. 181 sequential frames, 4,108,838 bytes, below the 12 MB budget. Contact sheet inspected for drawing-to-structure-to-finish continuity. Single clip, no joins.
- Illustration disclosure remains visible on desktop and mobile. Actual gallery photography and project credits remain separate.
- Quality limitation: original footage is 720p. Desktop visual width capped at 1100px and high-quality canvas smoothing enabled after user reported pixelation. This reduces enlargement artifacts but cannot recover missing source detail.

## Verification
- 45 tests pass; TypeScript check and production/prerender build pass.
- Zen headless checks: desktop/mobile layouts, gallery, keyboard dialogs, inquiry validation and forward/reverse scroll.
- Chrome production checks: native wheel scrolling, fast jumps, reverse source-frame restoration, 1366x768, 1024x600, 844x390 and 390x844 layouts; no horizontal overflow.
- Mobile menu Escape restores focus. Gallery expands from 12 to 25; filters and lightbox keyboard controls pass. Invalid inquiry focuses the name field and displays four errors.
- Reduced motion and saveData produce static chapters with three construction stills. Simulated frame failures preserve the poster and cap retries at two per frame. No page errors during production hydration.
- Repeatable Chrome runner: scripts/verify-browser.mjs. Screenshots: .cache/verification/.
- Chrome pixel hashes varied despite identical source-frame IDs and canvas dimensions; reverse regression compares source-frame identity rather than assuming GPU rasterization is byte-identical.
- Independent final review found three substantive issues: short-screen overflow, hidden mobile disclosure and missing static-stage illustrations. All fixed; affected checks observed failing before fixes and passing afterward.
- No real inquiry sent. Live Netlify notification delivery and physical-device touch testing remain deployment checks.

## Execution decisions
- Kept the current feature/seo checkout and current-project workflow; changes remain uncommitted for review. No worktree migration, merge or push.
- Used npm.cmd because pnpm is unavailable. Temporary browser driver lives under .cache/browser; package.json unchanged.
- Kept foundational CSS and imported src/cinema.css after it. Cost: some redundant CSS; benefit: existing form and dialog behavior retained.
- Built style-tile.html at repository root through Vite rather than public/, so it shares processed fonts/tokens/styles.
- Browser connector inventory was empty and native computer-use pipe unavailable twice. Used isolated headless Zen, then Chrome after user authorization.
- Existing Vite future-config-loader warnings remain nonblocking.

## Editing
- src/data/story.ts: chapter copy.
- src/lib/story.ts: frame/chapter timing.
- src/components/StoryCanvas.tsx: bounded bitmap cache and canvas playback.
- src/hooks/useStoryProgress.ts: scrolling and static preferences.
- src/cinema.css: responsive redesign treatments.
- src/data/company.ts and gallery.ts: business facts and real projects.

## Mobile refinement (2026-11-10)
- Applied C:/Users/Twilight/Downloads/02-mobile-refinement.md within the same responsive website.
- User explicitly chose "Use portrait stills for now" after Higgsfield rejected the 128-credit portrait video request with insufficient credits. No video job was created; no further generation attempted.
- Matching portrait final still job: 62a80536-885f-41de-8a2a-2b3432a631e4. Drawing still job: a382c104-e521-45cb-a908-be0cc3f254f1. Both gpt_image_2_6, high, 2k, reference-based, visually inspected; original PNGs 1520x2688 in assets/story/mobile/.
- Delivered portrait WebPs: 1080x1920 at quality 88. Opening poster 52,044 bytes, final reveal 129,324 bytes; combined 181,368 bytes. These are measured asset sizes, not loading-speed results.
- Mobile at <=900px uses normal page flow, a complete house drawing above short copy/primary action, readable text chapters and a finished-house reveal with action. No simulated portrait animation and no landscape crop substituted.
- Fixed safe-area-aware 64px-plus-inset header persists beyond story; 44px hamburger opens accessible links, focuses first link, supports Tab cycling and Escape, closes on selection and focuses anchor destination. Anchor scroll padding leaves headings clear.
- Removed mobile bottom bar to keep the opening to one primary action; contact remains accessible through persistent navigation. Input font size 16px avoids common mobile input zoom; touch targets refined.
- Responsive picture sources select portrait posters/stills before requests. Server/client first render remains static and hydration-safe. Sequence cleanup aborts requests and closes bitmaps across breakpoint changes.
- Chrome emulation verified 320x568, 360x740, 390x844, 430x932 and 768x1024: no overflow, usable opening controls, menu focus/Escape/link close, anchor offsets, header hit-testing beyond story, no desktop frame/poster requests. Resize desktop-to-mobile stops frame requests and releases canvas readiness. Reduced motion makes zero frame requests.
- Independent mobile review found skip-link stacking and tablet columns; both fixed. Reviewer also found a Chrome header capture/compositor concern; removed unnecessary backdrop-filter from opaque mobile header and rechecked screenshots.
- Desktop Chrome regression: scroll/reverse/jumps, responsive layouts, gallery/lightbox/form validation, failed media poster fallback and hydration still pass. No real inquiry sent.
- Physical devices, iOS Safari and real mobile loading-speed measurements were not tested.
- Final Chrome capture verification: adding a composited layer to the fixed mobile header (translateZ(0)) resolved its missing-paint captures after scroll; contact screenshot now visibly includes the brand and hamburger. Portrait prompts and source job IDs: docs/mobile-portrait-media.json.
