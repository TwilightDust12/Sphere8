# Architectural Cinema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Deliver the approved whole-site Sphere8 redesign with a continuous house-building scroll story.

**Architecture:** Keep the existing React/Vite site, prerendering and data modules. A dedicated canvas component renders a bounded image sequence beneath semantic chapter content; the rest of the page flows normally. Existing project and inquiry interactions remain connected.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind CSS v4, native browser animation APIs, Higgsfield MCP, FFmpeg.

**Spec:** `docs/superpowers/specs/2026-11-10-architectural-cinema-design.md`

## Global Constraints
- Stay in the current repository and conversation; use Higgsfield MCP only for generated images/video.
- Preserve official logos, supplied facts, project credits, contacts and Netlify form behavior.
- Colors: ivory #F3F0E9, charcoal #242722, warm gray #78796F, accent #CE3027.
- Keep self-hosted Space Grotesk, Geist and Geist Mono.
- Native scrolling; desktop active travel 4 viewport heights plus stage height; mobile about 2.
- Generated house is a labeled process illustration, not portfolio evidence.
- Reduced-motion and constrained-connection fallback preserves all content and primary action.
- Initial sequence transfer budget 12 MB; measure actual output and optimize.
- No public deployment, CMS, hosting migration or fabricated credibility claims.

## Review Focus
- Fast and reverse scroll: valid frame mapping, no obsolete frame replacing a newer requested frame.
- Media failure: poster stays visible, bounded retries, no blank stage.
- Narrow screens and reduced motion: readable text, whole-house framing and no compulsory long pinned section.
- Hidden chapters: no invisible focusable links or click-blocking overlays.
- Prerender hydration: browser-only APIs stay in effects; first server/client render agrees.

### Task 1: Art direction and media
**Files:** Create `style-tile.html`, `public/story/manifest.json`, `public/story/frames/`, `assets/story/`, `docs/architectural-cinema-production.md`; modify `src/index.css` tokens.
**Interfaces:** Manifest contains `{ frameCount: number, width: number, height: number, fps: number, pattern: string, poster: string }`. Pattern uses a zero-padded four-digit frame number starting at zero. Manifest URLs are relative to the app base.
- [x] Create editable style tile using the approved tokens, official logo, actual fonts, CTA treatments and sample service composition.
- [x] Inspect Higgsfield preferences, live model schemas and estimates; retain any explicit billing choice gate returned by tools.
- [x] Generate and inspect the house key stills, then the continuous construction clip. Use supported first/last-frame controls; preserve exact matching frames if multiple clips are required.
- [x] Save original media and prompts; inspect representative frames and seams before accepting footage.
- [x] Extract WebP frames in a fresh staging folder, starting around 18 fps and 1280px width; measure transfer size, tune without upscaling, then write manifest using actual outputs.
- [x] Verify numbering, image dimensions, poster and every manifest path; document provenance and measured sizes.

### Task 2: Scroll story
**Files:** Create `src/data/story.ts`, `src/lib/story.ts`, `src/lib/story.test.ts`, `src/components/StoryCanvas.tsx`, `src/hooks/useStoryProgress.ts`; replace `src/components/Hero.tsx`; modify `src/index.css`.
**Interfaces:** `storyFrame(progress: number, frameCount: number): number`; `storyChapter(progress: number): 0 | 1 | 2 | 3`; `useStoryProgress(ref: RefObject<HTMLElement | null>): { progress: number, staticMode: boolean }`; `StoryCanvas({ progress, staticMode }: { progress: number, staticMode: boolean })`.
- [x] Add failing tests: storyFrame(-1,181) equals 0, storyFrame(2,181) equals 180, storyFrame(0.99,181) equals 180, storyFrame(0.5,1) equals 0; sampled forward mapping is nondecreasing and reversing produces identical frame values.
- [x] Run `pnpm test` and confirm new tests fail before implementation.
- [x] Implement clamped piecewise mapping: hold frame 0 through progress .12; interpolate to 20% frames at .25, 70% frames at .625, final frame at .875; hold final to 1. Chapter boundaries .25, .625, .875. Normalize nonfinite input safely.
- [x] Implement passive scroll/resize listeners with requestAnimationFrame, cleanup and media-query changes. Static mode covers reduced motion and saveData; initial rendering is hydration-safe.
- [x] Implement poster-first canvas with concurrency 3, maximum 24 decoded frames, nearby-frame priority, generation token for stale callbacks, one retry per failed URL and resource cleanup. Cap device pixel ratio at 2.
- [x] Add semantic HTML chapter copy and CTA from approved spec, progress rail and Skip to projects. Render only active chapter interactions; static mode exposes readable flowing chapters.
- [x] Run tests/typecheck; browser-check reverse/fast scroll, failed frame requests, skip link, keyboard and reduced motion.

### Task 3: Whole-page redesign
**Files:** Modify `src/App.tsx`, `src/index.css`, `src/components/Header.tsx`, `Projects.tsx`, `Services.tsx`, `ProofStrip.tsx`, `Process.tsx`, `Team.tsx`, `Contact.tsx`, `Footer.tsx`, `MobileBar.tsx`; preserve `Lightbox.tsx` behavior and existing `src/data` facts.
**Interfaces:** Existing section IDs and inquiry utilities remain available. App order: Header, Hero, Projects, Services, Process, ProofStrip, Team, Contact, Footer, MobileBar.
- [x] Build restrained navigation with official mark, Work, Expertise, About and primary inquiry action.
- [x] Recompose project gallery as generous editorial photography; retain all filters, featured expansion, credits, status tags and lightbox.
- [x] Recompose services as three numbered image/text chapters, process as connected steps, company/leadership as concise editorial sections.
- [x] Restyle contact and footer; preserve validation, Netlify POST, email draft/copy fallback and real contact links.
- [x] Consolidate responsive styles for desktop/tablet/mobile and style tile consistency; ensure no horizontal overflow or mobile contact-bar overlap.
- [x] Run existing tests and typecheck; inspect React accessibility, effect cleanup and responsive media behavior.

### Task 4: Verification and handoff
**Files:** Update `README.md`, `docs/architectural-cinema-production.md`, this plan's completion boxes.
- [x] Run `pnpm test`, `pnpm typecheck`, `pnpm build`; require zero exit codes and inspect prerendered HTML.
- [x] Use the already running development server; inspect desktop/mobile screenshots and ordinary scroll pacing. Check fast/reverse scroll and resize while pinned.
- [x] Check navigation, gallery filters/expansion/lightbox, keyboard focus, form validation and fallback without sending a real inquiry.
- [x] Check reduced motion, media-loading failure, initial poster, narrow viewport framing and hydration console output.
- [x] Obtain independent final code review, resolve substantive findings and rerun affected checks.
- [x] Record actual media measurements, generation job references, editable content paths and any verification limitations. Deliver local preview and style tile; do not publish.

## Execution recommendation
Native implementation in this session, followed by an independent final review. The visual assets, scroll pacing and responsive layout need frequent coordinated adjustments, making a single implementer practical.
