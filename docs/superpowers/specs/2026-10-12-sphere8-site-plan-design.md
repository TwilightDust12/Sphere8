# Sphere8 Construction Corp. website redesign: "Site Plan" direction

Date: 2026-10-12
Branch: `redesign/site-plan`
Status: design approved in conversation (sections 1 to 3); this written spec awaits review.

## 1. Purpose and success criteria

Redesign the existing single-page Sphere8 site so that it generates project inquiries. The current site shows drawing placeholders instead of buildings. Real project photography (extracted from the company profile SVGs) now exists and becomes the centre of the page.

Success means a visitor can:
- see real finished work within the first scroll,
- understand what Sphere8 does (design, engineering, construction, project management),
- reach a contact action from anywhere on the page.

Audience: homeowners and small commercial or industrial clients in Lucena City, Quezon Province, Metro Manila, Laguna and Bulacan.

## 2. Constraints and decisions already made

- Keep the brutalist architectural language: hard rules, square edges, huge uppercase grotesk type, red / charcoal / off-white palette. Direction chosen: **A, "Site Plan"** (evolution of today's look, photo-led).
- Stack stays Vite 8 + React 19 + Tailwind v4 in the Figma Make scaffold. Do not modify the Figma plugins in `vite.config.ts` or the scripts in `.figma/make/`.
- No backend, CMS, analytics, deployment, YouTube embeds or per-project pages.
- Inquiry form delivers through a pre-filled `mailto:` to `sphere8construction@gmail.com` (decision: option 1). No third-party form service.
- Credentials shown as text facts only. The SEC registration number is not shown. The permit and certificate images are never published (they carry QR codes, signatures and a principal address that looks like a residence).
- Real social accounts supplied by the client: Facebook `https://www.facebook.com/sphere8construction`, YouTube `https://www.youtube.com/@sphere8construction`.
- `robots.index: false` in `.figma/make/site.json` stays until the client decides to launch.
- No role claims on photos (designed vs built) until the client confirms each one.

## 3. Page structure

| # | Block | Layout | Photography |
|---|---|---|---|
| 1 | Hero | Red, asymmetric split. Giant uppercase headline left, finished-house photo right with hard offset frame. Headline, one line of copy, two CTAs, nothing else | `04-04` |
| 2 | Proof strip | Four ruled cells: "2020" established; "SEC" registered January 3, 2020; "General Contractors" licensed in Lucena City; "3" disciplines (design, engineering, construction). No permit expiry dates | none |
| 3 | Services | Charcoal. Three bordered rows; a photo swaps in beside the list on hover or focus | interior, structural, residential |
| 4 | Projects | Asymmetric 12-column mosaic of real photos, category filter, lightbox | about 16 curated photos |
| 5 | Process | Three bordered steps: Plan, Coordinate, Build | none |
| 6 | Team | Ruled row: owner and two VPs. Behind a flag, off until the people agree to appear | profile slides, only if approved |
| 7 | Contact and footer | Charcoal. Form left, call and email links right. Footer with Facebook and YouTube text links | none |

Cross-page rules:
- One contact label, "Start a project", used in nav, hero and contact section.
- Nav on one line at desktop, 64px high: About, Services, Projects, Process, plus the CTA.
- Hero holds at most four text elements: headline (2 lines max), one line of copy (20 words max), primary CTA, secondary CTA.
- Colour-block system (red, charcoal, off-white blocks) is a deliberate fixed brand device. It is an intentional exception to a one-theme-per-page rule and does not follow `prefers-color-scheme`.
- No em-dashes or en-dashes in visible UI copy. Use hyphens, commas or line breaks. Project names taken from source documents are normalised to hyphens.
- No decorative status dots, no "Concept Study" tags, no scroll cues, no version labels, no pills overlaid on photos.
- No numbered section eyebrows. The only numbers on the page are content: the three Process steps and the proof-strip figures.
- Role labels on gallery photos read "Project experience" until confirmed per project.

## 4. Visual system

Typography
- Display: Space Grotesk, uppercase, tight tracking.
- Body: Geist (replaces Inter).
- Labels: Geist Mono, small uppercase, used sparingly.
- Self-hosted through `@fontsource` packages (three small build-time packages) instead of the Google `@import`. If the client rejects new dependencies, fall back to the Google import and system stacks.

Colour tokens (declared once in `@theme`)
- Brand red `#ce3027`.
- Charcoal `#1c1d1b`.
- Off-white pushed slightly cooler than today's (about `#f2f2ef`) to avoid the warm-beige family.
- Light red `#f0584e`, reserved for text on charcoal, tokenised once instead of hardcoded.

Shape: radius 0 everywhere. Borders 1.5px charcoal.

Motion (dial 5, every effect motivated, no new animation library)
- Hero: staggered CSS load-in (hierarchy).
- Sections: reveal on scroll via `IntersectionObserver` (sequence).
- Buttons: directional fill on hover (feedback).
- Services: photo cross-fades as a row is hovered or focused (state change).
- Gallery tiles: small image scale and red border on hover.
- The ticker is removed; the proof strip replaces it.
- Everything honours `prefers-reduced-motion`. Only `transform` and `opacity` animate.

Icons: none required. Arrows already exist in `Arrow` and are not extended. Social links are text.

## 5. Behaviour

Projects gallery
- 12-column mosaic with varied spans and fixed aspect ratios, `object-fit: cover`, lazy loading, `srcset` for phones.
- Filters: All, Residential, Interior, Resort, Industrial and structural. `aria-pressed`, live counts, polite announcement of the filtered count, clear empty-state message.
- Lightbox on native `<dialog>`: arrow keys, Esc, swipe on touch, visible close button, focus returns to the originating tile.
- A failed image falls back to the placeholder with no layout shift (existing `onError` behaviour kept).

Inquiry form
- Fields: name, phone, email (optional), project type, location, details.
- Labels above inputs, error text below, no placeholder-as-label, inputs pass WCAG AA.
- Inputs use correct `type` (`tel`, `email`) and 16px or larger text so iOS does not zoom.
- Submit composes the `mailto:` and opens the email app, then shows an honest message: the email app should open; if it did not, copy the message (copy button) or call (042) 373-3695. No fake success state.

Responsiveness (explicit collapse per block)
- Below 768px: hero stacks (headline, photo, buttons); proof strip becomes 2x2; services become single-column rows; project mosaic becomes one column; nav becomes a menu toggle with large tap rows that closes on selection or Esc.
- Tablet: 2-column mosaic, stacked contact section.
- Tap targets at least 44px. No behaviour depends on hover alone.
- `min-h-[100dvh]` for full-height blocks, never `h-screen`. Long titles and emails wrap without horizontal scroll.

Accessibility: one `h1`, logical heading order, skip link, labelled navs, visible focus on every interactive element, keyboard access to filters, disclosures, lightbox and form.

## 6. Files and data

```
src/
  App.tsx                  composer only
  components/
    Header.tsx  Hero.tsx  ProofStrip.tsx  Services.tsx
    Projects.tsx  Lightbox.tsx  Process.tsx  Team.tsx
    Contact.tsx  Footer.tsx  Placeholder.tsx
  data/
    company.ts             contact, socials, proof facts, services, steps
    gallery.ts             photo records (absorbs projects.ts)
  hooks/useReveal.ts       IntersectionObserver reveal
  index.css                tokens, base, component classes
```

- The six existing `projects.ts` records, including their "Proposed" statuses, fold into `gallery.ts` so the honest role wording is preserved. The 17-item "More project experience" list is kept as a disclosure.
- Photos are copied from `assets/extracted/web/` to `public/images/projects/` as WebP at 1600px or less. Source SVGs and raw extractions stay in `assets/` and are never staged.
- Gallery record: `id`, `title`, `location` (only where the source states it), `category`, `role`, `status?`, `src`, `alt`, `width`, `height`.

Curated photo set (about 1 to 2 MB total as WebP; filenames refer to `assets/extracted/web/`):

| Group | Photos |
|---|---|
| Residential | `02-03`, `03-07`, `04-04`, `05-07`, `06-03`, `07-10` |
| Interior | `04-10`, `11-07`, `22-04`, `23-10` |
| Resort | `09-04`, `10-04` |
| Fit-out | `20-04`, `21-09` |
| Industrial and structural | `13-08`, `17-04` |

Excluded: 3D renders `28` to `33` (another studio's watermark, rights unconfirmed); all certificate, permit and profile-slide images.

## 7. Verification

- `tsc --noEmit` and `vite build` via local binaries (`pnpm` is not on the shell PATH).
- Browser screenshots at 390, 768 and 1440px, checking for overflow and clipped text.
- Keyboard pass: skip link, menu, filters, lightbox, form.
- Reduced-motion check.
- `oxfmt` on changed files only.
- Scan of shipped text for em-dashes, unconfirmed claims and leftover placeholders.
- Client reviews the preview on a real phone and tablet before launch.

## 8. Open items for the client

1. Which projects Sphere8 designed, engineered or built, so role labels can be specific.
2. Whether the owner and VPs agree to appear (Team block flag).
3. Whether to add or remove photos from the curated set, and confirmation of permissions for client-home interiors.
4. When to switch `robots.index` to `true`.
5. Rights status of the 3D renders if they should be used later.

## 9. Delivery

Work proceeds on `redesign/site-plan` with one commit per block of work. `assets/` is never staged. After this spec is reviewed, a written implementation plan follows (writing-plans), then implementation.
