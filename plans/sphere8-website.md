# Sphere8 Construction Corp. — Single-page website plan

## Goal and agreed direction
Build a polished, responsive company-profile website that helps visitors explore Sphere8's project experience and contact the company. Use architectural minimalism with brutalist accents, preserving the brand's red, charcoal, black, and off-white palette. This is one scrolling page, not a multipage site. Project photography will be supplied later; use intentionally designed, explicitly labeled placeholders now.

## Repository and constraints
- Existing app is a blank React 19 + Vite 8 + Tailwind CSS v4 scaffold; no component library or established design system is installed.
- Implement primarily in `src/App.tsx` and `src/index.css`; preserve `src/main.tsx` and existing Vite infrastructure.
- Use Tailwind v4 theme tokens and a small set of consistent local UI patterns rather than adding a component framework. No routing, backend, database, or new runtime dependency is needed.
- Global fonts belong in `src/index.css`, with CSS imports first. Use public Google Fonts: Space Grotesk for display headings, Inter for body text, and system monospace for technical labels; include local system fallbacks.
- The existing development server is supervised; do not start another server. Preserve unrelated changes. No deployment or commit is included.

## Source material
1. Company profile attachment `233714b0-25f3-44ce-adb3-50d9c7071496`: company background, services, mission and vision.
2. Project list attachment `691ce16b-1991-43c0-89a7-1083a880b260`: named project experience and locations.
3. Contact image attachment `d82d5c24-723e-4947-868f-c8209b1f2c38`: logo and contact details.

Fetch attachments using `figma attachments get <id>` and use the returned paths, never inferred paths. PDFs are image-based; render them for inspection rather than relying on empty text extraction. Treat these as content/brand references, not a request to reproduce the PDF layout.

### Verified contact information
- Primary email: sphere8construction@gmail.com
- Secondary email: dedr.design@gmail.com
- Landline: (042) 373-3695
- Mobile: 0920-9698592
- Mobile: 0917-6757221
- Main office: 517 Quezon Blvd., Brgy. Gulang-Gulang, Lucena City

Use `mailto:` links for both addresses. Use `tel:+63423733695`, `tel:+639209698592`, and `tel:+639176757221` for telephone links. Provide a Google Maps search link with the office address encoded in the query, rather than claiming a verified map pin.

## Design specification
- Architectural editorial layout: large deliberate whitespace, oversized tightly set headings, thin grid dividers, square edges, technical section numbering, and precise alignment.
- Warm off-white primary canvas, near-black typography, muted gray secondary text, vivid brand red for primary CTAs and small emphasis. Use a charcoal contact section with white text and red accents.
- No rounded dashboard cards, gradients, gratuitous shadows, decorative stock construction imagery, or fabricated project photography.
- Desktop content width approximately 1280px with generous outer gutters; mobile gutters approximately 20–24px. Define values through reusable theme tokens.
- Responsive headline sizing with bounded fluid type; readable body copy and strong contrast. Buttons and links have visible keyboard focus and comfortable touch targets.
- Photography placeholders use fixed aspect ratios, subtle drafting-grid artwork, a project number, and the explicit label “Project photography to be added.” They must feel designed while remaining unmistakably placeholders.
- Reuse the actual geometric Sphere8 logo where a clean crop can be obtained from the supplied profile. Exclude screenshot toolbar, selection handles, borders, and unrelated content. If a clean extraction is not possible, use a typographic Sphere8 Construction Corp. lockup rather than inventing a logo.

## Page structure and content
### 1. Header
Sticky compact header with brand lockup, About / Services / Projects anchor links, and a high-contrast “Let's build” contact CTA. On narrow screens, use an accessible menu toggle with an inline collapsible navigation panel; close it after selecting a link. Header must not obscure anchored sections.

### 2. Hero (`#home`)
Editorial split composition: prominent statement “Designed with purpose. Built with precision.”, a concise description of Sphere8 as a design-and-build company, and two CTAs: “Discuss your project” linking to contact, “Explore projects” linking to selected work. Include “Architects / Engineers / Contractor” as a technical label. A large architectural photography placeholder supplies visual scale, with red framing accents rather than stock imagery.

### 3. About (`#about`)
Introduce Sphere8 Construction Corp., established and SEC-registered since January 3, 2020, as described in the profile. Emphasize architectural and engineering design through project management and building construction, a one-on-one project approach, quality service, and competitive pricing. Include concise values: quality workmanship, professionalism, client relationships, and responsible practice. Do not invent completed-project counts, awards, certifications, testimonials, or years of combined experience. Condense the profile's repetitive/mislabeled mission/vision panels into accurate plain-language values without carrying over their duplicate labels.

### 4. Services (`#services`)
Three numbered, grid-aligned service groups with clear descriptions:
- Construction & Development: residential, commercial, industrial, fit-outs, land development, landscaping.
- Design & Engineering: architectural planning, design consultancy, structural design and analysis, civil structural design, structural assessments.
- Project Management: coordinated planning and construction oversight, drawing only on the profile's stated project-management offering.
Use bordered rows or columns, not generic floating cards. No unnecessary accordions; services remain visible.

### 5. Selected Projects (`#projects`)
Responsive gallery with six featured records and category controls: All, Industrial, Residential, Institutional. Start with All. Two columns on desktop, one on mobile. Each card includes photography placeholder, title, location, discipline/role, and status when explicitly stated in the source. Use these representative records:
1. Proposed Glacier South Cold Storage — Phase 3; Sucat, Parañaque City; Industrial; structural design & consultancy; Proposed.
2. Proposed WAM Warehouse Complex; San Pedro City, Laguna; Industrial; structural design & consultancy; Proposed.
3. 3-Storey Magallanes Residence; Magallanes Village, Makati City; Residential; structural design & consultancy; do not assert completion.
4. Proposed Three-Unit, Three-Storey Townhouse; Kamuning, Quezon City; Residential; listed residential project/design experience; Proposed.
5. Proposed International Student Dormitory & Staff / Transient Quarters; Camp Gen. Emilio Aguinaldo, Quezon City; Institutional; engineering design; Proposed.
6. Proposed National Defense College Academic Building; Camp Gen. Emilio Aguinaldo, Quezon City; Institutional; engineering design; Proposed.

Preserve distinctions between engineering/design work and construction. Other contractors are credited in the PDF; do not imply Sphere8 built every listed project. Do not assign completion dates, client endorsements, or construction statuses that the source does not provide.

Include a “More project experience” disclosure below the gallery with a compact, deduplicated source-backed list: Calumpit RCDG Bridge, Visa Building, proposed Als ons processing plant (retain the source's name only after checking its spelling), Young Achiever's School of Caloocan, Sta. Ana Poultry, VecoPaper warehouse, MCV warehouse with office, CW Home Depot warehouse, AISAT Fairview school building, and the remaining named residential work. Verify exact names and locations against the rendered source before transcription; omit uncertain entries rather than guessing. All six featured cards remain present; filtering operates on the featured gallery only. The additional list has its own disclosure toggle.

Cards do not navigate to nonexistent detail pages or open fabricated case studies. No lightbox is needed while photos are placeholders.

### 6. Approach
Three concise steps — Plan, Coordinate, Build — explaining the design-and-build offering without suggesting contractual guarantees. Use short, restrained copy connecting planning, technical coordination, and workmanship.

### 7. Contact (`#contact`)
Large dark section headed “Let's build what's next.” Primary CTA opens the primary email with an encoded subject of “Project inquiry — Sphere8”. Display both email addresses, all three phone numbers, and the office address as readable links. Include “Find our office” map-search link. No submission form, mock success message, or backend: direct contact links are the complete inquiry flow for this version.

### 8. Footer
Company name, repeated essential anchors, dynamic current-year copyright, and back-to-top link. No invented social media profiles.

## Implementation and data flow
- Keep typed project data separate from rendering in a small `src/data/projects.ts` module, including `id`, `title`, `location`, `category`, `discipline`, optional `status`, optional `imageSrc`, and `imageAlt`.
- Keep company contact data centralized in App or a small company-data object so displayed numbers and link targets stay consistent.
- Compose local components for Header, SectionHeading, ProjectCard, and PhotoPlaceholder; add files only where separation improves clarity.
- React state: active project category, mobile menu expansion, and additional project-list expansion. Filtering derives records from the static array; no network calls or persistent state.
- Real photos can later be wired by setting `imageSrc` and meaningful `imageAlt` on the relevant record. Use a stable aspect ratio, `object-fit: cover`, lazy loading below the hero, and a placeholder fallback on missing/failed images. Do not provide photo upload or an admin UI.
- Store extracted brand assets under a local assets directory with descriptive names; do not reference transient `/tmp` attachment paths in the browser.
- Anchor links work without a router. Set scroll margins for the sticky header and use smooth scroll only when reduced motion is not requested.
- Update site title/description through the existing `.figma/make/site.json` metadata mechanism after reading it: title “Sphere8 Construction Corp. | Design & Build”; description based on the actual services and Lucena City office. Do not modify Vite plugins or setup scripts.

## Accessibility and edge cases
- Semantic sections, one h1, logical heading order, a skip link, meaningful accessible navigation labels, and visible focus styles.
- Category controls expose their selected state via `aria-pressed`; expanded navigation/disclosures use `aria-expanded` and controlled-region IDs. Announce the filtered project count politely.
- All navigation, category controls, and disclosure toggles work with keyboard input. No interaction depends only on hover.
- Mobile menu does not trap focus because it is an inline disclosure, not a modal. Hide collapsed links from focus; close on selection and Escape.
- Long project names and email addresses wrap without horizontal overflow. Empty filtering states receive a clear message if future data changes make a category empty.
- Decorative drafting graphics are hidden from assistive technology; placeholders are clearly labeled. Broken image sources return to placeholders without layout shifts.
- Mail and phone links rely on the visitor's configured apps; visible text allows manual copying. Map link opens externally with appropriate security attributes.
- Respect `prefers-reduced-motion`; avoid autoplay, large entrance animations, and scroll-jacking.

## Verification and acceptance
After implementation, use the repository's prescribed `pnpm build` for this full-page change and the `pnpm format` formatting entry point limited to intended changed files using supported script arguments. Do not invent a test or lint script; none is currently defined. Fix in-scope failures and report unrelated blockers.

Validate through the existing preview at mobile (~390px), tablet (~768px), and desktop (~1440px):
- Coherent visual hierarchy and no overflow or clipped text.
- Header anchors, both hero CTAs, footer links, mobile menu, filters, and expanded project list work.
- Contact links match the supplied screenshot and carry correct targets.
- Filtered project counts and source-derived statuses/roles are correct.
- Keyboard navigation, focus visibility, and reduced-motion behavior are usable.
- All project imagery is explicitly placeholder content; no invented claims or fake submissions appear.
- Production build succeeds, no broken asset imports occur, and the existing preview remains functional.

## Scope exclusions and later work
No live contact form, CRM, CMS, authentication, admin upload, analytics setup, deployment, separate case-study pages, or fabricated statistics. Later, replace placeholders with supplied project photos and confirm permissions/association with each project. Publishing and any expanded project narratives are separate follow-up work.
