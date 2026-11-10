# Sphere8 architectural cinema redesign

## Intent and scope
Redesign the existing React website as a visual story: a house progresses from architectural drawing through construction to a finished home. Help prospective residential and commercial clients understand Sphere8's design, engineering and construction offering and start an inquiry. Preserve real company facts, official logo assets, project credits and contact destinations.

## Approaches
The user selected architectural cinema: realistic architectural imagery, warm ivory, charcoal and restrained red, with one continuous house transformation. The alternative was an architect's tabletop model becoming a full-size building; that offered a playful design focus but less direct emotional connection to a finished home. A conventional photo-led redesign would be simpler but would not deliver the requested construction story.

## Art direction
Proposed builder decisions: ivory #F3F0E9, charcoal #242722, warm gray #78796F, existing Sphere8 red #CE3027 as an accent. Retain the supplied logos and self-hosted Space Grotesk, Geist and Geist Mono fonts. Use generous whitespace, large sentence-case headings, fine architectural rules, small chapter numbers and large photographic surfaces. Avoid a dashboard/card-grid appearance. Create an editable HTML/CSS style tile with actual tokens, logo, typography, buttons and a service sample.

## Visual Story
| Scene | Visual story | Website copy |
| --- | --- | --- |
| 01 Opening | A three-quarter view of one contemporary tropical house appears as fine architectural lines on a quiet ivory ground. House occupies the right two thirds with a safe text zone on the left. | Every home begins with a possibility. Architecture, engineering and construction by Sphere8. Start your project. |
| 02 Taking shape | The same house, camera and scale continue as foundations, columns, slabs and walls assemble in a legible sequence. | Designed with purpose. Engineered with care. From the first plans to a coordinated build. |
| 03 Transformation | Drawing guides leave; roofing, glass and timber complete the house. A restrained camera move approaches the entrance without cutting or changing the house. | No copy - let the motion lead. |
| 04 Resolution | The completed house rests at dusk and warm interior lights come on. The stage releases into the real project portfolio. | Built for what comes next. Explore our work. |

## Scroll pacing and media
Use native scrolling with a sticky visual stage. Initial active travel: opening 1 viewport height, construction 1.5, transformation 1, final hold 0.5; stage height is additional to these 4 viewport heights. Use piecewise mapping with readable holds and continuous motion between. HTML copy fades out before the next chapter enters; no baked text. Keep invisible links out of tab order and pointer interaction. Include Skip to projects and an immediately usable primary CTA.

Use Higgsfield MCP only for generated imagery/video, as requested in the supplied skill. Tools have been discovered; inspect live model schemas and credit estimates before submitting. Target 8-12 seconds of usable motion, subject to supported durations. Generate matching key stills to establish the house. Prefer one continuous clip; if separate clips are necessary, use the exact accepted ending frame as the next starting reference and inspect seams before integration. The concept house is illustrative, not claimed as an actual completed Sphere8 project. Identify that in a small caption. Real portfolio photos remain unaltered evidence of work.

Keep original clips, prompts and accepted stills. Extract a measured WebP sequence with a manifest of real dimensions, count and poster path. Target a modest desktop transfer size (initial budget 12 MB for the sequence, reduce dimensions or sampling if needed); prioritize poster and requested/nearby frames. Bound decoding and concurrency, close evicted bitmaps, cancel obsolete requests, limit retries and retain the poster on failure. Do not download the entire sequence before displaying the page. Generation failure is a concrete dependency, not permission to silently change providers.

## Whole-page structure
1. Slim navigation with preserved Sphere8 mark, Work, Expertise, About and Start a project.
2. Cinematic opening described above.
3. Selected work: generous varied photo layouts from existing gallery; retain role, location, proposal/render status and credits. Keep filters, expansion and accessible lightbox.
4. Expertise: three editorial chapters for Construction & Development, Design & Engineering and Project Management, paired with real photos and existing factual copy.
5. Approach: Plan, Coordinate, Build as a concise connected sequence; avoid repeating the long opening.
6. Company and people: Lucena location, existing proof facts and named leadership when team.visible is true.
7. Inquiry: spacious form with existing Netlify submission and email fallback, phone/email contacts and office links.
8. Quiet branded footer and mobile contact affordance.

## Responsive and accessible behavior
Desktop has text beside the house. Mobile places text in a dedicated readable band with the house below; use a centered crop only if the full construction remains visible, otherwise create a distinct mobile composition from accepted references. Shorten mobile travel to roughly 2 viewport heights. Reduced motion and constrained connection devices receive static chapter imagery and flowing content, with no pinned travel requirement. Keep semantic headings, labels, keyboard navigation, focus visibility and existing dialog controls. Animation must never be necessary to identify the business or reach the inquiry.

## Implementation boundaries
Stay in this repository and existing React/Vite/Tailwind stack. Keep content in src/data and reusable behavior in hooks/lib. Preserve prerender/hydration and SEO generation. No CMS, hosting migration, public deployment, invented testimonials or new credibility claims. No replacement logo. Builder can choose animation library versus a small requestAnimationFrame implementation based on reliability and package weight. Prefer existing dependencies where sufficient.

## Validation and delivery
Run existing tests, typecheck and production build. Add focused tests for piecewise progress mapping and sequence bounds if implemented as pure utilities. Inspect first/middle/last frames, sequence paths, dimensions and seams. Verify desktop/mobile ordinary scroll, reverse and fast scrolling, keyboard, lightbox, navigation, form validation and reduced motion in a permitted browser. Do not send real inquiries as part of testing. Report any unavailable browser checks explicitly.

Deliver the local redesigned website, style tile, original media and prompts, editable content, and brief editing/production notes with asset provenance, measured transfer size and limitations. Publication is outside this design's scope.

## Approval
Architectural cinema direction is selected. This document specifies the proposed full redesign for user approval before production, per the brainstorming workflow.
