# Sphere8 "Site Plan" Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the single-page Sphere8 site as a photo-led brutalist architectural page (red hero, proof strip, services, filterable project mosaic with lightbox, process, optional team, mailto inquiry form).

**Architecture:** `src/App.tsx` becomes a composer of focused section components in `src/components/`. Content lives in typed data modules (`src/data/*.ts`) and pure helpers (`src/lib/inquiry.ts`) that are unit-tested with Node's built-in test runner, so no test dependency is added. Styling stays hand-written CSS in `src/index.css` on top of Tailwind v4 `@theme` tokens, matching the existing codebase. Motion is CSS plus one `IntersectionObserver` hook.

**Tech Stack:** React 19, Vite 8, Tailwind CSS v4 (`@theme` tokens only), TypeScript 5.7, `node:test` (Node 22.18+ type stripping), Python 3 + Pillow for the one-off photo preparation script.

**Spec:** `docs/superpowers/specs/2026-10-12-sphere8-site-plan-design.md` (approved). Read it first; this plan implements it.

## Global Constraints

- Work only on branch `redesign/site-plan`. One commit per task. Never stage `assets/`. Stage explicit paths, never `git add -A` or `git add .`.
- Every commit message ends with the line `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Do not modify `vite.config.ts`, `.figma/make/*`, `src/main.tsx`, `index.html`, or `.figma/make/site.json`. `robots.index` stays `false`.
- No new runtime or dev dependencies and no `package.json` dependency changes. Only the `scripts` block of `package.json` changes (Task 1). Fonts are vendored as files, not installed packages (see Spec amendments).
- Double quotes for strings with apostrophes, balanced braces, default exports for components (`AGENTS.md`).
- Visible copy contains zero em-dashes (`—`) and zero en-dashes (`–`). Use hyphens, commas, colons or line breaks. Curly apostrophes (`’`) are fine.
- One contact label everywhere: **"Start a project"**.
- Radius 0 everywhere. Borders are 1.5px charcoal. One accent red `#ce3027` plus its on-charcoal tint `#f0584e` via tokens only.
- Nav on one line at desktop, header height 64px. Anchors: `#home #about #services #projects #process #contact`.
- Hero: at most four text elements (headline of 2 lines, one sentence of 20 words or fewer, primary CTA, secondary CTA).
- Only `transform` and `opacity` animate. Everything honours `prefers-reduced-motion`. No `window.addEventListener("scroll")`.
- Photo roles and filters come only from `src/data/gallery.ts` (spec section 6, "Roles"). Nothing is labelled "built by Sphere8" outside the Construction contract and Sub-contract roles.
- No fake success states: the form says the email app should open and offers copy and call fallbacks.
- Project directory contains spaces: always quote paths. `pnpm` is not on this shell's PATH: use `node_modules/.bin/tsc`, `node_modules/.bin/vite`, `node_modules/.bin/oxfmt` and `node --test`.

## Spec amendments (applied in Task 1)

1. **Fonts are vendored, not installed.** `pnpm` is unavailable and `npm` would rewrite the pnpm lockfile. The three variable WOFF2 files from the `@fontsource-variable/*` packages are copied into `public/fonts/` with their OFL licences. Result is the same (self-hosted, no Google import) and `package.json` dependencies stay untouched.
2. **"About" anchors to the proof-strip block.** The spec nav lists About but the block table has no About block. The proof-strip section carries `id="about"`, the existing headline "Solid foundations. Shared ambitions." and one sentence, then the four ruled cells.
3. **Gallery size.** 26 tiles (25 photos plus one placeholder for the Magallanes residence), about 3.9 MB of WebP at full size, plus 800px variants for phones.
4. **Tests use `node:test`.** Pure logic is tested with `node --test` (type stripping), adding no dependency.
5. **Statuses.** The "Proposed" tag shows only on the two pure renders (dormitory, National Defense College).

## Review Focus

Failure modes the spec implies that no visual check would catch (each has a test in the task named):

1. A visitor types a Philippine phone number with spaces, dashes or `+63` (Task 1: phone validation test).
2. A visitor writes a very long project description; the `mailto:` URL must not exceed browser limits while the copied text stays complete (Task 1: truncation test).
3. A photo file is missing or fails to load; the tile keeps its 4:3 box and shows the placeholder (Task 1: every photo file exists on disk; Task 5: onError fallback).
4. A filter ever has zero tiles; the page shows a clear message instead of an empty grid (Task 1: `filterPhotos` on an empty list; Task 5: empty state).
5. Very tall sections on a short phone viewport must still reveal (Task 2: the reveal hook uses `threshold: 0`, not a ratio).
6. Visitors with reduced motion or no `IntersectionObserver` must see all content immediately (Task 2).
7. Data strings must never regain em-dashes when someone pastes project names from the PDF (Task 1: copy scan test).

## File Structure

```
scripts/prepare-photos.py            one-off: web WebP -> public/images/projects (full + 800w)
public/fonts/                        3 variable woff2 + OFL licences (vendored)
public/images/projects/*.webp        26 photos incl. hero (+ -800 variants where width > 800)
src/App.tsx                          composer only (replaced)
src/index.css                        tokens, base, block styles (replaced, then appended per task)
src/components/
  Arrow.tsx  Brand.tsx  Placeholder.tsx   shared bits
  Header.tsx  Hero.tsx  ProofStrip.tsx  Services.tsx
  Projects.tsx  Lightbox.tsx  Process.tsx  Team.tsx
  Contact.tsx  Footer.tsx
src/data/company.ts                  contact, socials, proof, services, steps, team
src/data/gallery.ts                  roles, filters, photos, filterPhotos, countByFilter
src/data/experience.ts               "More project experience" groups
src/lib/inquiry.ts                   validation + mailto builder (pure)
src/lib/assets.ts                    photoUrl / photoSrcSet (uses import.meta.env)
src/hooks/useReveal.ts               IntersectionObserver reveal
src/**/*.test.ts                     node:test suites
```

Removed in Task 8: `src/data/projects.ts`, `public/images/{kamuning-townhouse,student-dormitory,national-defense-college}.webp`.

---

### Task 1: Data, pure logic, photo preparation and tests

**Files:**
- Create: `scripts/prepare-photos.py`, `src/data/company.ts`, `src/data/gallery.ts`, `src/data/experience.ts`, `src/lib/inquiry.ts`, `src/lib/assets.ts`
- Create: `src/lib/inquiry.test.ts`, `src/data/gallery.test.ts`, `src/data/copy.test.ts`
- Create (by script): `public/images/projects/*.webp`, `public/fonts/*`
- Modify: `package.json` (scripts only), `docs/superpowers/specs/2026-10-12-sphere8-site-plan-design.md` (append amendments)

**Interfaces:**
- Produces from `src/lib/inquiry.ts`: `projectTypes: readonly string[]`, `interface Inquiry`, `type InquiryField`, `type InquiryErrors`, `emptyInquiry: Inquiry`, `MAILTO_BODY_LIMIT: number`, `validateInquiry(i: Inquiry): InquiryErrors`, `buildMessage(i: Inquiry): string`, `buildMailto(to: string, i: Inquiry): string`.
- Produces from `src/data/gallery.ts`: `type RoleKey`, `type FilterKey`, `roles`, `filters`, `interface Photo`, `photos: Photo[]`, `filterPhotos(list: Photo[], key: FilterKey): Photo[]`, `countByFilter(list: Photo[]): Record<FilterKey, number>`, `roleLabel(p: Photo): string`.
- Produces from `src/data/company.ts`: `company`, `proof`, `services` (each with `photo: string` id), `steps`, `team`.
- Produces from `src/data/experience.ts`: `experienceGroups`.
- Produces from `src/lib/assets.ts`: `photoUrl(id: string, small?: boolean): string`, `photoSrcSet(id: string, width: number): string | undefined`.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/inquiry.test.ts`:

```ts
import test from "node:test"
import assert from "node:assert/strict"
import {
  MAILTO_BODY_LIMIT,
  buildMailto,
  buildMessage,
  emptyInquiry,
  validateInquiry,
  type Inquiry,
} from "./inquiry.ts"

const valid: Inquiry = {
  name: "Maria Santos",
  phone: "0917-675-7221",
  email: "maria@example.com",
  projectType: "New house or residence",
  location: "Lucena City",
  details: "Two-storey house on a 300 sqm lot, looking for design and build.",
}

test("a complete inquiry has no errors", () => {
  assert.deepEqual(validateInquiry(valid), {})
})

test("an empty inquiry flags every required field but not the optional email", () => {
  const errors = validateInquiry(emptyInquiry)
  assert.deepEqual(Object.keys(errors).sort(), ["details", "name", "phone", "projectType"])
})

test("phone numbers with spaces, dashes and a country code are accepted", () => {
  for (const phone of ["+63 920 969 8592", "(042) 373-3695", "09176757221"]) {
    assert.equal(validateInquiry({ ...valid, phone }).phone, undefined, phone)
  }
})

test("phone numbers with fewer than 7 digits are flagged", () => {
  assert.ok(validateInquiry({ ...valid, phone: "123-45" }).phone)
})

test("email is optional but validated when present", () => {
  assert.equal(validateInquiry({ ...valid, email: "" }).email, undefined)
  assert.ok(validateInquiry({ ...valid, email: "maria@" }).email)
})

test("details shorter than 10 characters are flagged", () => {
  assert.ok(validateInquiry({ ...valid, details: "house" }).details)
})

test("mailto url is a single encoded line with the subject and the details", () => {
  const url = buildMailto("sphere8construction@gmail.com", valid)
  assert.ok(url.startsWith("mailto:sphere8construction@gmail.com?subject="))
  assert.ok(!/\s/.test(url), "url must not contain raw whitespace")
  assert.ok(decodeURIComponent(url).includes("Two-storey house on a 300 sqm lot"))
  assert.ok(decodeURIComponent(url).includes("Project inquiry - Sphere8"))
})

test("very long details are shortened in the mailto but kept in the message", () => {
  const long = "x".repeat(MAILTO_BODY_LIMIT * 3)
  const input = { ...valid, details: long }
  const url = buildMailto("a@b.co", input)
  assert.ok(url.length < MAILTO_BODY_LIMIT * 3 + 400)
  assert.ok(buildMessage(input).includes(long))
})

test("the message leaves out empty optional fields", () => {
  const message = buildMessage({ ...valid, email: "", location: "" })
  assert.ok(!message.includes("Email:"))
  assert.ok(!message.includes("Location:"))
  assert.ok(message.includes("Name: Maria Santos"))
})

test("surrounding whitespace is trimmed", () => {
  const message = buildMessage({ ...valid, name: "  Maria Santos  " })
  assert.ok(message.includes("Name: Maria Santos\n"))
})
```

Create `src/data/gallery.test.ts`:

```ts
import test from "node:test"
import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import {
  countByFilter,
  filterPhotos,
  filters,
  photos,
  roleLabel,
  roles,
  type FilterKey,
} from "./gallery.ts"

test("photo ids are unique", () => {
  const ids = photos.map((p) => p.id)
  assert.equal(new Set(ids).size, ids.length)
})

test("every photo has a known role, alt text and a title", () => {
  for (const p of photos) {
    assert.ok(p.role in roles, `${p.id}: unknown role ${p.role}`)
    assert.ok(p.alt.length > 10, `${p.id}: alt text too short`)
    assert.ok(p.title.length > 2, `${p.id}: missing title`)
    assert.ok(p.width > 0 && p.height > 0, `${p.id}: missing size`)
  }
})

test("every photo with an image has its files on disk", () => {
  for (const p of photos.filter((p) => !p.placeholder)) {
    const full = new URL(`../../public/images/projects/${p.id}.webp`, import.meta.url)
    assert.ok(existsSync(full), `${p.id}.webp is missing`)
    if (p.width > 800) {
      const small = new URL(`../../public/images/projects/${p.id}-800.webp`, import.meta.url)
      assert.ok(existsSync(small), `${p.id}-800.webp is missing`)
    }
  }
})

test("filter counts add up to the whole gallery", () => {
  const counts = countByFilter(photos)
  assert.equal(counts.all, photos.length)
  const sum = filters.filter((f) => f.key !== "all").reduce((n, f) => n + counts[f.key], 0)
  assert.equal(sum, photos.length)
})

test("each filter shows only photos whose role maps to it", () => {
  for (const f of filters.filter((f) => f.key !== "all")) {
    for (const p of filterPhotos(photos, f.key as FilterKey)) {
      assert.equal(roles[p.role].filter, f.key)
    }
  }
})

test("filtering an empty list returns an empty list", () => {
  assert.deepEqual(filterPhotos([], "design"), [])
})

test("role label falls back to the role name unless overridden", () => {
  const plain = photos.find((p) => !p.label)!
  assert.equal(roleLabel(plain), roles[plain.role].label)
  const overridden = photos.find((p) => p.label)!
  assert.equal(roleLabel(overridden), overridden.label)
})
```

Create `src/data/copy.test.ts`:

```ts
import test from "node:test"
import assert from "node:assert/strict"
import { company, proof, services, steps, team } from "./company.ts"
import { photos } from "./gallery.ts"
import { experienceGroups } from "./experience.ts"

test("data modules contain no em-dashes or en-dashes", () => {
  const all = JSON.stringify({ company, proof, services, steps, team, photos, experienceGroups })
  const hit = all.match(/.{0,30}[–—].{0,30}/)
  assert.equal(hit, null, `dash found near: ${hit?.[0]}`)
})

test("contact details are complete", () => {
  assert.equal(company.emails.length, 2)
  assert.equal(company.phones.length, 3)
  for (const p of company.phones) assert.ok(p.href.startsWith("tel:+63"))
  for (const s of company.socials) assert.ok(s.href.startsWith("https://"))
})

test("team block is off until the people agree to appear", () => {
  assert.equal(team.visible, false)
})
```

- [ ] **Step 2: Add the test scripts and run the tests to see them fail**

Edit `package.json`, replace the `scripts` block with:

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "format": "oxfmt",
    "test": "node --test \"src/**/*.test.ts\"",
    "typecheck": "tsc --noEmit"
  },
```

Run: `cd "/mnt/GamesAndStuff/Company Profile Website Design" && node --test "src/**/*.test.ts"`
Expected: FAIL, `ERR_MODULE_NOT_FOUND` for `./inquiry.ts`, `./gallery.ts`, `./company.ts`.

- [ ] **Step 3: Implement `src/lib/inquiry.ts`**

```ts
export const projectTypes = [
  "New house or residence",
  "Townhouse or apartment",
  "Commercial or office",
  "Warehouse or industrial",
  "Interior fit-out",
  "Structural design or review",
  "Architectural design",
  "Not sure yet",
] as const

export const MAILTO_BODY_LIMIT = 1500

export interface Inquiry {
  name: string
  phone: string
  email: string
  projectType: string
  location: string
  details: string
}

export type InquiryField = "name" | "phone" | "email" | "projectType" | "details"
export type InquiryErrors = Partial<Record<InquiryField, string>>

export const emptyInquiry: Inquiry = {
  name: "",
  phone: "",
  email: "",
  projectType: "",
  location: "",
  details: "",
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateInquiry(input: Inquiry): InquiryErrors {
  const errors: InquiryErrors = {}
  if (!input.name.trim()) errors.name = "Enter your name."
  if (input.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Enter a phone number we can call, at least 7 digits."
  }
  const email = input.email.trim()
  if (email && !emailPattern.test(email)) {
    errors.email = "Check the email address, for example name@example.com."
  }
  if (!input.projectType) errors.projectType = "Choose the closest project type."
  if (input.details.trim().length < 10) {
    errors.details = "Tell us a little about the project, at least 10 characters."
  }
  return errors
}

export function buildMessage(input: Inquiry): string {
  const email = input.email.trim()
  const location = input.location.trim()
  const lines: (string | null)[] = [
    `Name: ${input.name.trim()}`,
    `Phone: ${input.phone.trim()}`,
    email ? `Email: ${email}` : null,
    `Project type: ${input.projectType}`,
    location ? `Location: ${location}` : null,
    "",
    "Details:",
    input.details.trim(),
  ]
  return lines.filter((line): line is string => line !== null).join("\n")
}

export function buildMailto(to: string, input: Inquiry): string {
  const subject = "Project inquiry - Sphere8"
  let body = buildMessage(input)
  if (body.length > MAILTO_BODY_LIMIT) {
    body = `${body.slice(0, MAILTO_BODY_LIMIT)}\n[message shortened to fit an email link]`
  }
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
```

- [ ] **Step 4: Implement `src/data/company.ts`**

```ts
export const company = {
  name: "Sphere8 Construction Corp.",
  city: "Lucena City, Philippines",
  address: "517 Quezon Blvd., Brgy. Gulang-Gulang, Lucena City",
  emails: ["sphere8construction@gmail.com", "dedr.design@gmail.com"],
  phones: [
    { label: "(042) 373-3695", href: "tel:+63423733695" },
    { label: "0920-9698592", href: "tel:+639209698592" },
    { label: "0917-6757221", href: "tel:+639176757221" },
  ],
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/sphere8construction" },
    { label: "YouTube", href: "https://www.youtube.com/@sphere8construction" },
  ],
}

export const proof = [
  { value: "2020", label: "Established" },
  { value: "SEC", label: "Registered January 3, 2020" },
  { value: "General Contractors", label: "Licensed in Lucena City" },
  { value: "3", label: "Disciplines: design, engineering, construction" },
]

export const services = [
  {
    n: "01",
    title: "Construction & Development",
    text: "Turning plans into spaces with careful execution and quality workmanship.",
    items: [
      "Residential & commercial",
      "Industrial & fit-outs",
      "Land development & landscaping",
    ],
    photo: "05-07",
    photoAlt: "Two-storey house with stone cladding and large glass doors",
  },
  {
    n: "02",
    title: "Design & Engineering",
    text: "Purposeful architecture, backed by thoughtful technical design.",
    items: [
      "Architectural planning & consultancy",
      "Structural design & analysis",
      "Civil structural design & assessments",
    ],
    photo: "17-04",
    photoAlt: "Steel roof framing of a warehouse under construction",
  },
  {
    n: "03",
    title: "Project Management",
    text: "Keeping the moving parts of your project aligned from planning through construction.",
    items: [
      "Project planning",
      "Design & construction coordination",
      "Construction oversight",
    ],
    photo: "02-03",
    photoAlt: "Finished two-storey house with a basement garage",
  },
]

export const steps = [
  {
    n: "1",
    title: "Plan.",
    text: "We start by understanding your goals, your site, and the possibilities. Then we shape a considered design.",
  },
  {
    n: "2",
    title: "Coordinate.",
    text: "We connect architectural intent with engineering detail and project planning, keeping everyone aligned.",
  },
  {
    n: "3",
    title: "Build.",
    text: "We bring plans to life through careful construction oversight and a focus on quality workmanship.",
  },
]

export const team = {
  visible: false,
  members: [
    { name: "Engr. Farly D. Vergel", title: "President" },
    { name: "Ar. Donica Elden D. Reyes", title: "Vice President, Administration & Design" },
    { name: "Engr. Pedro Reyes", title: "Vice President, Marketing" },
  ],
}
```

- [ ] **Step 5: Implement `src/data/gallery.ts`**

```ts
export type RoleKey =
  | "construction"
  | "subcontract"
  | "engineering"
  | "fitout"
  | "interior"
  | "design"
export type FilterKey = "all" | "construction" | "interiors" | "engineering" | "design"

export const roles: Record<
  RoleKey,
  { label: string; filter: Exclude<FilterKey, "all"> }
> = {
  construction: { label: "Construction contract", filter: "construction" },
  subcontract: { label: "Sub-contract works", filter: "construction" },
  engineering: {
    label: "Structural design and value engineering",
    filter: "engineering",
  },
  fitout: { label: "Interior fit-out", filter: "interiors" },
  interior: { label: "Interior project", filter: "interiors" },
  design: { label: "Architectural and engineering design", filter: "design" },
}

export const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "construction", label: "Construction" },
  { key: "interiors", label: "Interiors" },
  { key: "engineering", label: "Engineering" },
  { key: "design", label: "Design renders" },
]

export interface Photo {
  id: string
  width: number
  height: number
  alt: string
  title: string
  role: RoleKey
  label?: string
  location?: string
  discipline?: string
  credit?: string
  status?: string
  placeholder?: boolean
}

export const photos: Photo[] = [
  {
    id: "05-07",
    width: 1600,
    height: 1200,
    alt: "Two-storey house with dark stone cladding, a glass balcony and a timber door",
    title: "Two-Storey Residence with Stone Cladding",
    role: "construction",
  },
  {
    id: "16-04",
    width: 907,
    height: 698,
    alt: "Steel frame of a cold storage building with a crane, above a structural model",
    title: "Glacier South Cold Storage, Phase 4",
    role: "engineering",
    location: "AMVEL Business Park, Sucat, Parañaque City",
    discipline: "Structural design and consultancy",
    credit: "Client: Phil-Nippon Kyoei Corporation",
  },
  {
    id: "02-03",
    width: 1200,
    height: 896,
    alt: "Two-storey house with a basement garage and a pickup truck parked in front",
    title: "Two-Storey Residence with Basement",
    role: "construction",
    location: "Ayala Greenfields Estates, Laguna",
  },
  {
    id: "29-08",
    width: 1072,
    height: 992,
    alt: "Rendered corner residence with timber screens, a car port and landscaped yard",
    title: "Corner Residence",
    role: "design",
  },
  {
    id: "09-04",
    width: 1468,
    height: 755,
    alt: "Beachfront resort pool with a clubhouse and palm trees",
    title: "Beachfront Resort Pool and Clubhouse",
    role: "construction",
  },
  {
    id: "22-04",
    width: 1200,
    height: 1600,
    alt: "Dining room with a long timber table, upholstered chairs and a lit ceiling",
    title: "Dining Room Interior",
    role: "interior",
  },
  {
    id: "15-05",
    width: 862,
    height: 405,
    alt: "Structural models of warehouse buildings beside a site photograph",
    title: "WWAM Warehouse Complex",
    role: "engineering",
    location: "San Pedro City, Laguna",
    discipline: "Structural design and consultancy",
    credit: "Client: Worldwide Apparel Mfg. Inc.",
  },
  {
    id: "06-03",
    width: 1600,
    height: 1200,
    alt: "Two-storey house with a stone wall, timber gate and wide driveway",
    title: "Two-Storey Residence",
    role: "construction",
  },
  {
    id: "20-04",
    width: 1600,
    height: 1200,
    alt: "Dental clinic reception with a timber counter, an arched alcove and rattan chairs",
    title: "Dr. Pauline Lucero Dental Clinic",
    role: "fitout",
    location: "Lucena City",
  },
  {
    id: "30-03",
    width: 1168,
    height: 912,
    alt: "Rendered modern house with a roof deck, timber cladding and a car in the drive",
    title: "Modern Residence with Roof Deck",
    role: "design",
  },
  {
    id: "03-07",
    width: 1548,
    height: 1161,
    alt: "Two-storey corner house with a tall glazed stair window and landscaped front",
    title: "Two-Storey Corner Residence",
    role: "construction",
  },
  {
    id: "14-03",
    width: 721,
    height: 380,
    alt: "Rendered view of a student dormitory building in a green setting",
    title: "International Student Dormitory",
    role: "engineering",
    label: "Engineering design",
    location: "Camp Gen. Emilio Aguinaldo, Quezon City",
    discipline: "Structural, electrical, mechanical, fire protection and plumbing design",
    status: "Proposed",
  },
  {
    id: "23-10",
    width: 1600,
    height: 1200,
    alt: "Open timber staircase rising from a double-height hall with large windows",
    title: "Staircase and Double-Height Hall",
    role: "interior",
  },
  {
    id: "10-04",
    width: 1200,
    height: 896,
    alt: "Single-storey house with stone cladding, a timber deck and wide glass doors",
    title: "Single-Storey Residence with Pool",
    role: "construction",
  },
  {
    id: "31-06",
    width: 1600,
    height: 1178,
    alt: "Rendered two-storey house with black columns and a timber entrance",
    title: "Two-Storey Residence",
    role: "design",
  },
  {
    id: "07-10",
    width: 1200,
    height: 896,
    alt: "Two-storey house with a glass-walled ground floor and a roof terrace",
    title: "Two-Storey Residence with Glass Facade",
    role: "construction",
  },
  {
    id: "15-03",
    width: 444,
    height: 237,
    alt: "Rendered view of an academic building with a blue glass facade",
    title: "National Defense College Academic Building",
    role: "engineering",
    label: "Engineering design",
    location: "Camp Gen. Emilio Aguinaldo, Quezon City",
    discipline: "Structural, electrical, mechanical, fire protection and plumbing design",
    status: "Proposed",
  },
  {
    id: "21-09",
    width: 1200,
    height: 896,
    alt: "Clinic reception with a timber slat ceiling and a curved wooden counter",
    title: "Dental Clinic Reception",
    role: "fitout",
  },
  {
    id: "33-07",
    width: 1600,
    height: 900,
    alt: "Rendered hillside villa with a swimming pool and palm trees",
    title: "Hillside Pool Villa",
    role: "design",
  },
  {
    id: "11-07",
    width: 1600,
    height: 1200,
    alt: "Bright living area with arched openings, a white sofa and a kitchen bar",
    title: "Living Area Interior",
    role: "construction",
  },
  {
    id: "17-04",
    width: 1004,
    height: 596,
    alt: "Steel roof framing of a warehouse with office, inside a half-built shell",
    title: "MCVI Warehouse with Office",
    role: "engineering",
    location: "Brgy. Bancal, Meycauayan City, Bulacan",
    discipline: "Structural design",
  },
  {
    id: "03-11",
    width: 928,
    height: 1152,
    alt: "Rendered elevation of a three-unit, three-storey townhouse with garage doors",
    title: "Three-Unit, Three-Storey Townhouse",
    role: "construction",
    location: "Kamuning, Quezon City",
    credit: "Architect: Donica Elden Reyes",
  },
  {
    id: "32-06",
    width: 1600,
    height: 900,
    alt: "Rendered pool house with a timber roof overhang and palm trees",
    title: "Pool Residence",
    role: "design",
  },
  {
    id: "13-08",
    width: 510,
    height: 348,
    alt: "Green steel frame under erection with a crane beside it",
    title: "Steel Frame Erection",
    role: "subcontract",
  },
  {
    id: "31-04",
    width: 1600,
    height: 900,
    alt: "Rendered single-storey house with a dark roof and a paved courtyard",
    title: "Single-Storey Residence",
    role: "design",
  },
  {
    id: "magallanes-residence",
    width: 1200,
    height: 896,
    alt: "Photo of the Magallanes residence to be added",
    title: "3-Storey Magallanes Residence",
    role: "engineering",
    label: "Structural design and consultancy",
    location: "Magallanes Village, Makati City",
    placeholder: true,
  },
]

export function roleLabel(photo: Photo): string {
  return photo.label ?? roles[photo.role].label
}

export function filterPhotos(list: Photo[], key: FilterKey): Photo[] {
  if (key === "all") return list
  return list.filter((photo) => roles[photo.role].filter === key)
}

export function countByFilter(list: Photo[]): Record<FilterKey, number> {
  return {
    all: list.length,
    construction: filterPhotos(list, "construction").length,
    interiors: filterPhotos(list, "interiors").length,
    engineering: filterPhotos(list, "engineering").length,
    design: filterPhotos(list, "design").length,
  }
}
```

- [ ] **Step 6: Implement `src/data/experience.ts`**

Entries come from the profile's "Project List" page. Credits are kept only where the profile states them. One entry whose architect's name could not be read reliably is left without a name.

```ts
export interface ExperienceItem {
  name: string
  place?: string
  note?: string
}

export interface ExperienceGroup {
  heading: string
  items: ExperienceItem[]
}

export const experienceGroups: ExperienceGroup[] = [
  {
    heading: "Design planning and engineering consultancy",
    items: [
      {
        name: "International Student Dormitory and Staff / Transient Quarters",
        place: "Camp Gen. Emilio Aguinaldo, Quezon City",
        note: "Structural, electrical, mechanical, fire protection and plumbing design",
      },
      {
        name: "National Defense College Academic Building with Amphitheater",
        place: "Camp Gen. Emilio Aguinaldo, Quezon City",
        note: "Structural, electrical, mechanical, fire protection and plumbing design",
      },
      {
        name: "Grand Pavilion 2, Felizza Jazz Compound",
        place: "Malolos, Bulacan",
        note: "Architectural, structural and sanitary / plumbing design",
      },
      {
        name: "Subdivision site development planning",
        place: "Pulong Saging, Silang, Cavite",
        note: "Civil site development for Pacrim Dev. Corporation",
      },
    ],
  },
  {
    heading: "Structural design and consultancy",
    items: [
      { name: "Calumpit RCDG Bridge, 15 meter", place: "Calumpit, Bulacan" },
      {
        name: "Siena Building, 4-storey with roof deck",
        place: "Mabilis St., V. Luna, Quezon City",
        note: "Value engineering. Architect: Archtrike",
      },
      {
        name: "Visa Building, 3-storey residence",
        place: "Mamalateo Land Inc.",
        note: "Architect: Archtrike",
      },
      {
        name: "Glacier South Cold Storage, Phase 3 with mezzanine office",
        place: "AMVEL Business Park, Sucat, Parañaque City",
        note: "Phil-Nippon Kyoei Corporation",
      },
      {
        name: "Glacier South Cold Storage, Phase 4",
        place: "AMVEL Business Park, Sucat, Parañaque City",
        note: "Phil-Nippon Kyoei Corporation",
      },
      {
        name: "Alsons Processing Plant",
        place: "Pueblo de Panay, Roxas City, Capiz",
        note: "Phil-Nippon Kyoei Corporation",
      },
      {
        name: "WWAM Warehouse Complex",
        place: "San Pedro City, Laguna",
        note: "Worldwide Apparel Mfg. Inc.",
      },
      {
        name: "Young Achiever’s School of Caloocan, 4-storey",
        place: "Bagumbong, Caloocan City",
      },
    ],
  },
  {
    heading: "Residential, commercial, office, storage and water tank projects",
    items: [
      {
        name: "Sta. Ana Poultry",
        place: "Sta. Maria, Sta. Ana, Pampanga",
        note: "Redesign and value engineering. Contractor: Building Blocks Construction Corp.",
      },
      {
        name: "VecoPaper Warehouse",
        place: "Concepcion St., Buli, Muntinlupa City",
        note: "Contractor: Building Blocks Construction Corp.",
      },
      { name: "5-Storey Apartment with Penthouse", place: "Sta. Clara St., City of Manila" },
      {
        name: "MCVI Warehouse with Office",
        place: "Brgy. Bancal, Meycauayan City, Bulacan",
        note: "Mandarin Credit Ventures, Inc.",
      },
      { name: "CW Home Depot Warehouse", place: "GT Natural, Ortigas Center" },
      { name: "3-Storey Magallanes Residence", place: "Magallanes Village, Makati City" },
      {
        name: "AISAT Fairview Campus, 4-storey school building",
        place: "Quezon City",
        note: "JMAX Builders",
      },
      { name: "Revision design of a 2-storey commercial building" },
      { name: "Theresa M-48 Townhouse, 11 units, 2-storey", note: "JMAX Builders" },
      { name: "Frenza Commercial, one-storey", note: "JMAX Builders" },
      { name: "Gantuanco Residence", place: "Quezon City", note: "JMAX Builders" },
      { name: "Tamonte Residence", place: "Parañaque City", note: "JMAX Builders" },
      { name: "150 sq.m. Mechanical Deck, steel structure" },
      {
        name: "Two-Storey Residence",
        place: "Citta Grande Subdivision, Lucena City",
        note: "Architect: Donica Elden Reyes",
      },
      {
        name: "Three-Unit, Three-Storey Townhouse",
        place: "Kamuning, Quezon City",
        note: "Architect: Donica Elden Reyes",
      },
      {
        name: "Renovation of a Two-Storey Residence",
        place: "Cambria Subdivision, Laguna",
        note: "Architect: Donica Elden Reyes",
      },
      {
        name: "One-Storey Residence",
        place: "Pandi, Bulacan",
        note: "Architect: Donica Elden Reyes",
      },
      {
        name: "Three-Bedroom Unit",
        place: "RGR Subdivision, Lucena City",
        note: "Architect: Donica Elden Reyes",
      },
    ],
  },
]
```

- [ ] **Step 7: Implement `src/lib/assets.ts`**

```ts
export function photoUrl(id: string, small = false): string {
  return `${import.meta.env.BASE_URL}images/projects/${id}${small ? "-800" : ""}.webp`
}

export function photoSrcSet(id: string, width: number): string | undefined {
  if (width <= 800) return undefined
  return `${photoUrl(id, true)} 800w, ${photoUrl(id)} ${width}w`
}
```

- [ ] **Step 8: Write the photo preparation script**

Create `scripts/prepare-photos.py`:

```python
#!/usr/bin/env python3
"""Copy the curated gallery photos into public/images/projects.

Reads WebP files (max 1600px) made earlier into assets/extracted/web and writes
the full file plus an 800px-wide variant when the original is wider than 800px.
Run from the repository root:  python3 -I scripts/prepare-photos.py
"""
import shutil
from pathlib import Path

from PIL import Image

SRC = Path("assets/extracted/web")
OUT = Path("public/images/projects")
IDS = """
04-04 05-07 16-04 02-03 29-08 09-04 22-04 15-05 06-03 20-04 30-03 03-07 14-03
23-10 10-04 31-06 07-10 15-03 21-09 33-07 11-07 17-04 03-11 32-06 13-08 31-04
""".split()

OUT.mkdir(parents=True, exist_ok=True)
for photo_id in IDS:
    source = SRC / f"{photo_id}.webp"
    if not source.exists():
        raise SystemExit(f"missing source image: {source}")
    shutil.copyfile(source, OUT / f"{photo_id}.webp")
    with Image.open(source) as im:
        width, height = im.size
        if width > 800:
            small = im.resize((800, round(height * 800 / width)), Image.LANCZOS)
            small.save(OUT / f"{photo_id}-800.webp", "WEBP", quality=80, method=4)
print(f"prepared {len(IDS)} photos in {OUT}")
```

- [ ] **Step 9: Vendor the fonts**

```bash
cd "/mnt/GamesAndStuff/Company Profile Website Design"
mkdir -p .tmp-fonts public/fonts && cd .tmp-fonts
for p in space-grotesk geist geist-mono; do npm pack "@fontsource-variable/$p" --silent; done
for f in *.tgz; do d="${f%.tgz}"; mkdir -p "$d" && tar -xzf "$f" -C "$d"; done
cd ..
find .tmp-fonts -name '*-latin-wght-normal.woff2'
```
Expected: three paths ending `space-grotesk-latin-wght-normal.woff2`, `geist-latin-wght-normal.woff2`, `geist-mono-latin-wght-normal.woff2`. Then copy them and each package's licence:

```bash
for p in space-grotesk geist geist-mono; do
  cp .tmp-fonts/fontsource-variable-$p-*/package/files/$p-latin-wght-normal.woff2 public/fonts/
  cp .tmp-fonts/fontsource-variable-$p-*/package/LICENSE public/fonts/$p-LICENSE.txt
done
rm -rf .tmp-fonts
ls -la public/fonts
```
Expected: 3 woff2 files and 3 licence files in `public/fonts/`.

- [ ] **Step 10: Prepare the photos**

Run: `python3 -I scripts/prepare-photos.py`
Expected: `prepared 26 photos in public/images/projects` and no error (25 gallery photos plus the hero photo `04-04`).

- [ ] **Step 11: Run the tests to verify they pass**

Run: `node --test "src/**/*.test.ts"`
Expected: all tests pass (inquiry 10, gallery 7, copy 3), exit code 0.

Run: `node_modules/.bin/tsc --noEmit`
Expected: exit code 0, no output.

- [ ] **Step 12: Append the spec amendments and commit**

Append to the end of `docs/superpowers/specs/2026-10-12-sphere8-site-plan-design.md`:

```markdown

## 10. Implementation amendments (2026-10-12)

1. Fonts are vendored as WOFF2 files in `public/fonts/` (with their OFL licences) instead of installed `@fontsource` packages, because `pnpm` is unavailable in the working shell and `npm` would rewrite the pnpm lockfile. Self-hosting and the font choices are unchanged.
2. The nav's "About" anchors to the proof-strip block, which carries the existing headline "Solid foundations. Shared ambitions." and one sentence above the four ruled cells.
3. The gallery has 26 tiles: 25 photos plus one placeholder tile for the Magallanes residence. Full-size WebP totals about 3.9 MB; photos wider than 800px also get an 800px variant for phones.
4. Pure logic (inquiry validation, gallery filtering, copy scan) is tested with Node's built-in `node --test`, adding no dependency.
5. The "Proposed" status tag is shown only on the two pure renders (dormitory, National Defense College).
```

```bash
git add package.json scripts/prepare-photos.py public/fonts public/images/projects src/data src/lib docs/superpowers/specs/2026-10-12-sphere8-site-plan-design.md
git commit -m "$(cat <<'EOF'
feat: add site data, inquiry logic, photo set and self-hosted fonts

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```
Expected: commit succeeds; `git status --short` shows only `?? assets/` and `?? docs/superpowers/plans/`.

---

### Task 2: Foundation, tokens, base styles, shared components

**Files:**
- Replace: `src/index.css`, `src/App.tsx`
- Create: `src/hooks/useReveal.ts`, `src/components/Arrow.tsx`, `src/components/Brand.tsx`, `src/components/Placeholder.tsx`

**Interfaces:**
- Consumes: nothing from Task 1 except fonts in `public/fonts/`.
- Produces: `useReveal<T extends HTMLElement>(): RefObject<T | null>` (adds class `is-visible` once). Default exports `Arrow({ diagonal?: boolean })`, `Brand()`, `Placeholder({ label?: string })`. CSS classes: `.wrap`, `.mono`, `.big`, `.btn`, `.btn-dark`, `.btn-ghost`, `.btn-red`, `.u-link`, `.reveal`, `.on-dark`, `.skip-link`, `.sr-only`, `.ph`.

- [ ] **Step 1: Replace `src/index.css` with tokens and base**

```css
@import 'tailwindcss';

@font-face {
  font-family: 'Space Grotesk';
  src: url('/fonts/space-grotesk-latin-wght-normal.woff2') format('woff2');
  font-weight: 300 700;
  font-display: swap;
}
@font-face {
  font-family: 'Geist';
  src: url('/fonts/geist-latin-wght-normal.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}
@font-face {
  font-family: 'Geist Mono';
  src: url('/fonts/geist-mono-latin-wght-normal.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

@theme {
  --color-canvas: #f2f2ef;
  --color-paper: #fafaf8;
  --color-ink: #1c1d1b;
  --color-brand: #ce3027;
  --color-brand-light: #f0584e;
  --color-muted: #5b5d57;
  --color-muted-on-ink: #b4b6ad;
  --color-line: #d2d2cc;
  --font-sans: 'Geist', ui-sans-serif, system-ui, sans-serif;
  --font-display: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, monospace;
}

:root {
  --pad: clamp(20px, 4.4vw, 64px);
  --header: 64px;
}

html { scroll-behavior: smooth; scroll-padding-top: calc(var(--header) + 8px); }
body {
  margin: 0;
  background: var(--color-canvas);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  font-synthesis: none;
}
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; color: inherit; }
button { cursor: pointer; }
img { display: block; max-width: 100%; }
h1, h2, h3, p, ul, figure { margin: 0; }
:focus-visible { outline: 2px solid var(--color-ink); outline-offset: 3px; }
.on-dark :focus-visible, .hero :focus-visible, .site-header :focus-visible,
.site-footer :focus-visible, dialog :focus-visible { outline-color: var(--color-paper); }
::selection { background: var(--color-ink); color: var(--color-paper); }
h1, h2, h3 { font-family: var(--font-display); }

.wrap { max-width: 1520px; margin-inline: auto; padding-inline: var(--pad); }
.mono { font-family: var(--font-mono); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; }
.big { font-weight: 700; text-transform: uppercase; font-size: clamp(36px, 6vw, 96px); line-height: .94; letter-spacing: -.045em; }
.big span { color: var(--color-brand); }
.on-dark { background: var(--color-ink); color: var(--color-paper); }
.on-dark .big span { color: var(--color-brand-light); }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.skip-link { position: fixed; top: -100px; left: 16px; z-index: 50; padding: 12px 16px; background: var(--color-paper); color: var(--color-ink); }
.skip-link:focus { top: 8px; }

.diagonal { transform: rotate(-45deg); transition: transform .25s; }
a:hover > .diagonal, button:hover .diagonal { transform: rotate(0); }

.btn {
  --fill: var(--color-paper);
  --fill-text: var(--color-ink);
  display: inline-flex; align-items: center; justify-content: space-between; gap: 24px;
  min-height: 52px; padding-inline: 22px;
  font-size: 15px; font-weight: 500; white-space: nowrap;
  border: 1.5px solid currentColor; border-radius: 0;
  background-image: linear-gradient(var(--fill), var(--fill));
  background-repeat: no-repeat; background-position: left; background-size: 0% 100%;
  transition: background-size .28s cubic-bezier(.16, 1, .3, 1), color .2s, border-color .2s, transform .15s;
}
.btn:hover, .btn:focus-visible { background-size: 100% 100%; color: var(--fill-text); border-color: var(--fill); }
.btn:active { transform: translateY(1px); }
.btn-dark { background-color: var(--color-ink); color: var(--color-paper); border-color: var(--color-ink); }
.btn-ghost { background-color: transparent; color: var(--color-paper); --fill-text: var(--color-brand); }
.btn-red { background-color: var(--color-brand); color: var(--color-paper); border-color: var(--color-brand); }

.u-link { display: inline-flex; gap: 10px; align-items: center; border-bottom: 1px solid currentColor; padding-bottom: 3px; font-size: 14px; transition: color .2s; }
.on-dark .u-link:hover { color: var(--color-brand-light); }

.reveal { opacity: 0; transform: translateY(24px); transition: opacity .6s cubic-bezier(.16, 1, .3, 1), transform .6s cubic-bezier(.16, 1, .3, 1); }
.reveal.is-visible { opacity: 1; transform: none; }

.ph {
  position: relative; width: 100%; height: 100%; min-height: 160px;
  background-color: var(--color-paper); color: var(--color-muted);
  background-image: linear-gradient(#1c1d1b14 1px, transparent 1px), linear-gradient(90deg, #1c1d1b14 1px, transparent 1px);
  background-size: 32px 32px;
  display: flex; align-items: flex-end; padding: 14px 16px;
}

@keyframes rise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }

@media print { .reveal { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; animation-delay: 0s !important; }
  .reveal { opacity: 1; transform: none; }
}
```

- [ ] **Step 2: Create `src/hooks/useReveal.ts`**

```ts
import { useEffect, useRef, type RefObject } from "react"

export function useReveal<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible")
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          el.classList.add("is-visible")
          observer.disconnect()
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
```

- [ ] **Step 3: Create the shared components**

`src/components/Arrow.tsx`:

```tsx
export default function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={diagonal ? "diagonal" : ""}
    >
      <path d="M4 12h15M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}
```

`src/components/Brand.tsx`:

```tsx
export default function Brand() {
  return (
    <span className="brand">
      <span>
        SPHERE<b>8</b>
      </span>
      <small>CONSTRUCTION CORP.</small>
    </span>
  )
}
```

`src/components/Placeholder.tsx`:

```tsx
export default function Placeholder({ label = "Photo to be added" }: { label?: string }) {
  return (
    <div className="ph" role="img" aria-label={label}>
      <span className="mono">{label}</span>
    </div>
  )
}
```

- [ ] **Step 4: Replace `src/App.tsx` with a temporary composer**

The section components do not exist yet; render only the skip link and a landmark so the app builds at this commit.

```tsx
export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <main id="main" />
    </>
  )
}
```

- [ ] **Step 5: Verify build and types**

Run: `node_modules/.bin/tsc --noEmit && node --test "src/**/*.test.ts" && node_modules/.bin/vite build --outDir .tmp-build 2>&1 | tail -5; rm -rf .tmp-build`
Expected: tsc silent, tests pass, Vite prints `✓ built in` with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/index.css src/App.tsx src/hooks src/components
git commit -m "$(cat <<'EOF'
feat: add design tokens, base styles and shared components

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Header, hero and proof strip

**Files:**
- Create: `src/components/Header.tsx`, `src/components/Hero.tsx`, `src/components/ProofStrip.tsx`
- Modify: `src/App.tsx`, `src/index.css` (append)

**Interfaces:**
- Consumes: `Arrow`, `Brand`, `useReveal` (Task 2); `proof` from `src/data/company.ts`; `photoUrl` from `src/lib/assets.ts`.
- Produces: default exports `Header`, `Hero`, `ProofStrip`. Section ids `home`, `about`.

- [ ] **Step 1: Create `src/components/Header.tsx`**

```tsx
import { useEffect, useState } from "react"
import Arrow from "./Arrow"
import Brand from "./Brand"

const links = [
  ["About", "#about"],
  ["Services", "#services"],
  ["Projects", "#projects"],
  ["Process", "#process"],
] as const

export default function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <header className="site-header">
      <a href="#home" aria-label="Sphere8 home">
        <Brand />
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <a className="header-cta" href="#contact">
        Start a project <Arrow diagonal />
      </a>
      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {[...links, ["Start a project", "#contact"] as const].map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
            <Arrow diagonal />
          </a>
        ))}
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Create `src/components/Hero.tsx`**

```tsx
import Arrow from "./Arrow"
import { photoSrcSet, photoUrl } from "../lib/assets"

export default function Hero() {
  return (
    <section className="hero" id="home" aria-label="Introduction">
      <div className="wrap hero-grid">
        <div className="hero-text">
          <h1>
            <span>Designed with purpose.</span>
            <em>Built with precision.</em>
          </h1>
          <p>
            Architecture, engineering and construction under one roof, from first
            drawing to final detail.
          </p>
          <div className="hero-actions">
            <a className="btn btn-dark" href="#contact">
              Start a project <Arrow diagonal />
            </a>
            <a className="btn btn-ghost" href="#projects">
              See our work
            </a>
          </div>
        </div>
        <figure className="hero-photo">
          <img
            src={photoUrl("04-04")}
            srcSet={photoSrcSet("04-04", 822)}
            width={822}
            height={715}
            fetchPriority="high"
            alt="Two-storey house with a red-brown timber roof canopy and dark glazing, seen from the street"
          />
        </figure>
      </div>
    </section>
  )
}
```

`04-04` is 822px wide, so `photoSrcSet` returns a two-size `srcset` and the prepare script (Task 1) has already created `04-04-800.webp`.

- [ ] **Step 3: Create `src/components/ProofStrip.tsx`**

```tsx
import { proof } from "../data/company"
import { useReveal } from "../hooks/useReveal"

export default function ProofStrip() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="wrap reveal" ref={ref}>
        <h2 id="about-title" className="big">
          Solid foundations. <span>Shared ambitions.</span>
        </h2>
        <p className="lead">
          We are Sphere8 Construction Corp., a design-and-build company with a
          personal approach to every project.
        </p>
        <ul className="proof">
          {proof.map((item) => (
            <li className="proof-cell" key={item.value}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Compose in `src/App.tsx`**

```tsx
import Header from "./components/Header"
import Hero from "./components/Hero"
import ProofStrip from "./components/ProofStrip"

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <ProofStrip />
      </main>
    </>
  )
}
```

- [ ] **Step 5: Append the block CSS to `src/index.css`**

```css
/* Header */
.site-header { position: sticky; top: 0; z-index: 30; height: var(--header); display: flex; align-items: center; gap: 32px; padding-inline: var(--pad); background: var(--color-ink); color: var(--color-paper); }
.brand { font-family: var(--font-display); font-weight: 700; font-size: 22px; letter-spacing: -.04em; display: inline-flex; align-items: baseline; gap: 10px; white-space: nowrap; }
.brand b { color: var(--color-brand-light); font-weight: 700; }
.brand small { font-family: var(--font-mono); font-weight: 400; font-size: 9px; letter-spacing: .14em; opacity: .75; }
.desktop-nav { margin-left: auto; display: flex; gap: 6px; }
.desktop-nav a { padding: 8px 14px; font-size: 14px; transition: background .2s; }
.desktop-nav a:hover { background: #ffffff1a; }
.header-cta { display: inline-flex; align-items: center; gap: 12px; height: 100%; padding-inline: 24px; background: var(--color-brand); color: var(--color-paper); font-size: 14px; font-weight: 500; white-space: nowrap; transition: background .2s, color .2s; margin-right: calc(var(--pad) * -1); }
.header-cta:hover { background: var(--color-paper); color: var(--color-ink); }
.menu-toggle, .mobile-nav { display: none; }

/* Hero */
.hero { background: var(--color-brand); color: var(--color-paper); overflow: clip; }
.hero-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; align-items: center; min-height: calc(100dvh - var(--header)); padding-block: clamp(32px, 5vw, 72px); }
.hero-text { grid-column: 1 / span 7; }
.hero h1 { font-weight: 700; text-transform: uppercase; font-size: clamp(30px, 4.1vw, 64px); line-height: .95; letter-spacing: -.045em; }
.hero h1 span, .hero h1 em { display: block; }
.hero h1 em { font-style: normal; color: var(--color-ink); }
.hero-text p { font-size: clamp(17px, 1.4vw, 20px); max-width: 30em; margin-top: 24px; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
.hero-photo { grid-column: 8 / span 5; position: relative; }
.hero-photo img { position: relative; z-index: 1; width: 100%; aspect-ratio: 4 / 5; max-height: calc(100dvh - var(--header) - 96px); object-fit: cover; border: 1.5px solid var(--color-ink); }
.hero-photo::after { content: ''; position: absolute; inset: 14px -14px -14px 14px; border: 1.5px solid var(--color-ink); }
.hero-text > *, .hero-photo { animation: rise .7s cubic-bezier(.16, 1, .3, 1) both; }
.hero-text > :nth-child(2) { animation-delay: .08s; }
.hero-text > :nth-child(3) { animation-delay: .16s; }
.hero-photo { animation-delay: .12s; }

/* About and proof strip */
.about { padding-block: clamp(64px, 8vw, 120px); }
.about .lead { max-width: 52ch; margin-top: 24px; font-family: var(--font-display); font-size: clamp(20px, 2vw, 28px); line-height: 1.3; letter-spacing: -.02em; font-weight: 500; }
.proof { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); margin-top: clamp(32px, 4vw, 56px); border-top: 1.5px solid var(--color-ink); border-bottom: 1.5px solid var(--color-ink); }
.proof-cell { padding: 24px 24px 24px 0; border-right: 1px solid var(--color-line); }
.proof-cell + .proof-cell { padding-left: 24px; }
.proof-cell:last-child { border-right: 0; }
.proof-cell strong { display: block; font-family: var(--font-display); font-size: clamp(24px, 2.4vw, 36px); letter-spacing: -.03em; line-height: 1.05; font-weight: 700; }
.proof-cell span { display: block; margin-top: 8px; color: var(--color-muted); font-size: 14px; }

@media (max-width: 1000px) {
  .hero-text, .hero-photo { grid-column: 1 / -1; }
  .hero-grid { min-height: 0; }
  .hero-photo img { aspect-ratio: 4 / 3; }
  .proof { grid-template-columns: 1fr 1fr; }
  .proof-cell:nth-child(2) { border-right: 0; }
  .proof-cell:nth-child(3) { padding-left: 0; border-top: 1px solid var(--color-line); }
  .proof-cell:nth-child(4) { border-top: 1px solid var(--color-line); }
}
@media (max-width: 720px) {
  .desktop-nav, .header-cta { display: none; }
  .menu-toggle { display: inline-flex; margin-left: auto; align-items: center; min-height: 44px; background: transparent; border: 1px solid #ffffff55; padding: 8px 16px; font-size: 14px; color: var(--color-paper); }
  .mobile-nav:not([hidden]) { display: flex; flex-direction: column; position: absolute; top: var(--header); left: 0; right: 0; background: var(--color-ink); border-top: 1px solid #ffffff22; padding: 8px var(--pad) 20px; }
  .mobile-nav a { display: flex; justify-content: space-between; align-items: center; min-height: 56px; border-bottom: 1px solid #ffffff22; font-family: var(--font-display); font-size: 22px; }
  .brand small { display: none; }
  .hero-actions .btn { flex: 1 1 100%; }
}
```

- [ ] **Step 6: Verify**

Run: `node_modules/.bin/tsc --noEmit && node --test "src/**/*.test.ts" && node_modules/.bin/vite build --outDir .tmp-build 2>&1 | tail -4; rm -rf .tmp-build`
Expected: all green.

Then open the running preview at `http://localhost:8443` (confirm with `curl -s -o /dev/null -w "%{http_code}" http://localhost:8443` returning `200`) and check at 1440px: hero headline is two lines, the photo sits right with a hard offset frame, the CTA reads "Start a project", the proof strip shows 4 cells. At 390px: header shows "Menu", hero stacks, proof strip is 2 by 2, no horizontal scroll.

- [ ] **Step 7: Commit**

```bash
git add src/components/Header.tsx src/components/Hero.tsx src/components/ProofStrip.tsx src/App.tsx src/index.css
git commit -m "$(cat <<'EOF'
feat: add header, photo-led hero and proof strip

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Services with photo swap

**Files:**
- Create: `src/components/Services.tsx`
- Modify: `src/App.tsx`, `src/index.css` (append)

**Interfaces:**
- Consumes: `services` (with `photo`, `photoAlt`), `photoUrl`, `useReveal`.
- Produces: default export `Services`, section id `services`.

- [ ] **Step 1: Create `src/components/Services.tsx`**

```tsx
import { useState } from "react"
import { services } from "../data/company"
import { useReveal } from "../hooks/useReveal"
import { photoUrl } from "../lib/assets"

export default function Services() {
  const [active, setActive] = useState(0)
  const ref = useReveal<HTMLDivElement>()

  return (
    <section id="services" className="services on-dark" aria-labelledby="services-title">
      <div className="wrap reveal" ref={ref}>
        <h2 id="services-title" className="big">
          From concept <span>to construction.</span>
        </h2>
        <div className="svc-layout">
          <ul className="svc-list">
            {services.map((service, index) => (
              <li
                key={service.n}
                className={`svc${active === index ? " is-active" : ""}`}
                onMouseEnter={() => setActive(index)}
                onFocusCapture={() => setActive(index)}
              >
                <span className="mono svc-n">{service.n}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <ul className="svc-items">
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <img
                  className="svc-thumb"
                  src={photoUrl(service.photo)}
                  alt={service.photoAlt}
                  loading="lazy"
                />
                <a
                  className="u-link"
                  href="#projects"
                  aria-label={`${service.title}: see related work`}
                >
                  See related work
                </a>
              </li>
            ))}
          </ul>
          <div className="svc-preview" aria-hidden="true">
            {services.map((service, index) => (
              <img
                key={service.n}
                className={active === index ? "is-active" : ""}
                src={photoUrl(service.photo)}
                alt=""
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to `src/App.tsx`**

Add `import Services from "./components/Services"` and render `<Services />` after `<ProofStrip />`.

- [ ] **Step 3: Append CSS to `src/index.css`**

```css
/* Services */
.services { padding-block: clamp(72px, 9vw, 140px); }
.svc-layout { display: grid; grid-template-columns: 1.4fr 1fr; gap: clamp(24px, 4vw, 64px); margin-top: clamp(32px, 4vw, 64px); align-items: start; }
.svc-list { list-style: none; padding: 0; border-top: 1px solid #ffffff2b; }
.svc { display: grid; grid-template-columns: 56px 1fr; column-gap: 16px; padding-block: 28px; border-bottom: 1px solid #ffffff2b; }
.svc-n { color: var(--color-brand-light); padding-top: 8px; }
.svc h3 { font-size: clamp(24px, 2.6vw, 38px); line-height: 1.05; letter-spacing: -.03em; font-weight: 600; transition: color .25s; }
.svc.is-active h3 { color: var(--color-brand-light); }
.svc p, .svc-items, .svc .u-link, .svc-thumb { grid-column: 2; }
.svc p { margin-top: 12px; max-width: 46ch; color: var(--color-muted-on-ink); }
.svc-items { list-style: none; padding: 0; margin: 14px 0 20px; font-size: 15px; }
.svc-items li { padding: 4px 0; }
.svc-items li::before { content: '+'; margin-right: 10px; color: var(--color-brand-light); font-family: var(--font-mono); }
.svc .u-link { justify-self: start; }
.svc-thumb { display: none; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; margin-bottom: 20px; border: 1.5px solid var(--color-paper); }
.svc-preview { position: sticky; top: calc(var(--header) + 24px); aspect-ratio: 4 / 5; border: 1.5px solid var(--color-paper); overflow: hidden; background: #262725; }
.svc-preview img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity .35s ease; }
.svc-preview img.is-active { opacity: 1; }

@media (max-width: 1000px) {
  .svc-layout { grid-template-columns: 1fr; }
  .svc-preview { display: none; }
  .svc-thumb { display: block; }
}
@media (max-width: 720px) {
  .svc { grid-template-columns: 1fr; }
  .svc-n, .svc p, .svc-items, .svc .u-link, .svc-thumb { grid-column: 1; }
}
```

- [ ] **Step 4: Verify**

Run: `node_modules/.bin/tsc --noEmit && node_modules/.bin/vite build --outDir .tmp-build 2>&1 | tail -3; rm -rf .tmp-build`
Expected: green. In the preview at 1440px, hovering or tabbing to a row highlights its title and cross-fades the right-hand photo. At 390px each row shows its own photo and the right-hand panel is gone. Tab order reaches each "See related work" link.

- [ ] **Step 5: Commit**

```bash
git add src/components/Services.tsx src/App.tsx src/index.css
git commit -m "$(cat <<'EOF'
feat: add services section with photo swap

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Projects mosaic, filters, lightbox and experience list

**Files:**
- Create: `src/components/Projects.tsx`, `src/components/Lightbox.tsx`
- Modify: `src/App.tsx`, `src/index.css` (append)

**Interfaces:**
- Consumes: `photos`, `filters`, `filterPhotos`, `countByFilter`, `roleLabel`, `type FilterKey`, `type Photo` (Task 1); `experienceGroups`; `photoUrl`, `photoSrcSet`; `Placeholder`; `useReveal`.
- Produces: default exports `Projects`, `Lightbox({ photos, index, onClose, onIndexChange })`. Section id `projects`.

- [ ] **Step 1: Create `src/components/Lightbox.tsx`**

```tsx
import { useEffect, useRef } from "react"
import { roleLabel, type Photo } from "../data/gallery"
import { photoSrcSet, photoUrl } from "../lib/assets"

interface LightboxProps {
  photos: Photo[]
  index: number | null
  onClose: () => void
  onIndexChange: (index: number) => void
}

export default function Lightbox({ photos, index, onClose, onIndexChange }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const touchStart = useRef<number | null>(null)
  const isOpen = index !== null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  const photo = index !== null ? photos[index] : null

  const step = (delta: number) => {
    if (index === null || photos.length < 2) return
    onIndexChange((index + delta + photos.length) % photos.length)
  }

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label="Project photo viewer"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1)
        if (event.key === "ArrowLeft") step(-1)
      }}
    >
      {photo && (
        <div className="lightbox-inner">
          <figure
            className="lightbox-figure"
            onTouchStart={(event) => {
              touchStart.current = event.touches[0].clientX
            }}
            onTouchEnd={(event) => {
              if (touchStart.current === null) return
              const dx = event.changedTouches[0].clientX - touchStart.current
              touchStart.current = null
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
            }}
          >
            <img
              src={photoUrl(photo.id)}
              srcSet={photoSrcSet(photo.id, photo.width)}
              sizes="100vw"
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
            />
            <figcaption>
              <span className="mono">{roleLabel(photo)}</span>
              <strong>{photo.title}</strong>
              {photo.location && <span>{photo.location}</span>}
            </figcaption>
          </figure>
          <div className="lightbox-bar">
            <span className="mono" aria-live="polite">
              {(index ?? 0) + 1} of {photos.length}
            </span>
            <div className="lightbox-buttons">
              {photos.length > 1 && (
                <>
                  <button type="button" className="btn btn-ghost" onClick={() => step(-1)}>
                    Previous
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => step(1)}>
                    Next
                  </button>
                </>
              )}
              <button type="button" className="btn btn-red" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
```

- [ ] **Step 2: Create `src/components/Projects.tsx`**

```tsx
import { useMemo, useState } from "react"
import {
  countByFilter,
  filterPhotos,
  filters,
  photos,
  roleLabel,
  type FilterKey,
  type Photo,
} from "../data/gallery"
import { experienceGroups } from "../data/experience"
import { useReveal } from "../hooks/useReveal"
import { photoSrcSet, photoUrl } from "../lib/assets"
import Lightbox from "./Lightbox"
import Placeholder from "./Placeholder"

function Tile({ photo, onOpen }: { photo: Photo; onOpen: () => void }) {
  const [failed, setFailed] = useState(false)
  const hasImage = !photo.placeholder && !failed

  return (
    <figure className="tile">
      <div className="tile-media">
        {hasImage ? (
          <button
            type="button"
            className="tile-open"
            onClick={onOpen}
            aria-label={`View photo: ${photo.title}`}
          >
            <img
              className="tile-img"
              src={photoUrl(photo.id, photo.width > 800)}
              srcSet={photoSrcSet(photo.id, photo.width)}
              sizes="(min-width: 1000px) 45vw, 100vw"
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              onError={() => setFailed(true)}
            />
          </button>
        ) : (
          <Placeholder />
        )}
      </div>
      <figcaption>
        <span className="mono tile-role">
          {roleLabel(photo)}
          {photo.status && <span className="tag">{photo.status}</span>}
        </span>
        <strong>{photo.title}</strong>
        {photo.location && <span className="tile-line">{photo.location}</span>}
        {photo.discipline && <span className="tile-line">{photo.discipline}</span>}
        {photo.credit && <span className="tile-line">{photo.credit}</span>}
      </figcaption>
    </figure>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState<FilterKey>("all")
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [moreOpen, setMoreOpen] = useState(false)
  const ref = useReveal<HTMLDivElement>()

  const counts = useMemo(() => countByFilter(photos), [])
  const visible = useMemo(() => filterPhotos(photos, filter), [filter])
  const viewable = useMemo(() => visible.filter((p) => !p.placeholder), [visible])

  return (
    <section id="projects" className="projects" aria-labelledby="projects-title">
      <div className="wrap reveal" ref={ref}>
        <h2 id="projects-title" className="big">
          Different scales. <span>Same detail.</span>
        </h2>
        <p className="projects-intro">
          Built, engineered and designed work from our company profile.
        </p>

        <div className="filter-bar">
          <div className="filters" role="group" aria-label="Filter projects">
            {filters.map((item) => (
              <button
                key={item.key}
                type="button"
                aria-pressed={filter === item.key}
                onClick={() => setFilter(item.key)}
              >
                {item.label}
                <sup>{String(counts[item.key]).padStart(2, "0")}</sup>
              </button>
            ))}
          </div>
          <span className="mono" aria-live="polite">
            {String(visible.length).padStart(2, "0")} shown
          </span>
        </div>

        {visible.length === 0 ? (
          <p className="empty">
            No projects in this group yet. Choose another group or see all projects.
          </p>
        ) : (
          <div className="mosaic">
            {visible.map((photo) => (
              <Tile
                key={photo.id}
                photo={photo}
                onOpen={() => setOpenIndex(viewable.findIndex((p) => p.id === photo.id))}
              />
            ))}
          </div>
        )}

        <div className="more">
          <button
            type="button"
            aria-expanded={moreOpen}
            aria-controls="additional-projects"
            onClick={() => setMoreOpen(!moreOpen)}
          >
            <span>More project experience</span>
            <span aria-hidden="true">{moreOpen ? "−" : "+"}</span>
          </button>
          <div id="additional-projects" hidden={!moreOpen}>
            <p className="more-note">
              Listed in our company profile. Where another contractor or architect is
              credited, our role was design or engineering.
            </p>
            {experienceGroups.map((group) => (
              <div className="more-group" key={group.heading}>
                <h3>{group.heading}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={`${group.heading}-${item.name}`}>
                      <span>{item.name}</span>
                      <span>{[item.place, item.note].filter(Boolean).join(". ")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Lightbox
        photos={viewable}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
      />
    </section>
  )
}
```

Note: the disclosure button uses the typographic minus `−` (U+2212), which is a minus sign and not a dash punctuation mark; it is `aria-hidden`.

- [ ] **Step 3: Add to `src/App.tsx`**

Add `import Projects from "./components/Projects"` and render `<Projects />` after `<Services />`.

- [ ] **Step 4: Append CSS to `src/index.css`**

```css
/* Projects */
.projects { padding-block: clamp(72px, 9vw, 140px); }
.projects-intro { margin-top: 20px; max-width: 52ch; color: var(--color-muted); }
.filter-bar { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; margin-block: 40px 32px; }
.filters { display: flex; flex-wrap: wrap; }
.filters button { background: transparent; border: 1.5px solid var(--color-ink); margin-right: -1.5px; margin-bottom: -1.5px; padding: 0 20px; min-height: 48px; font-size: 14px; font-weight: 500; transition: background .2s, color .2s; }
.filters button:hover { background: var(--color-line); }
.filters button[aria-pressed='true'] { background: var(--color-ink); color: var(--color-paper); }
.filters sup { font-family: var(--font-mono); font-size: 9px; margin-left: 6px; opacity: .75; }
.empty { padding: 48px 0; color: var(--color-muted); max-width: 52ch; }

.mosaic { display: grid; grid-template-columns: repeat(12, 1fr); gap: 48px 24px; }
.tile { grid-column: span 6; }
.tile:nth-child(9n+1) { grid-column: span 7; }
.tile:nth-child(9n+2) { grid-column: span 5; }
.tile:nth-child(9n+3), .tile:nth-child(9n+4), .tile:nth-child(9n+5) { grid-column: span 4; }
.tile:nth-child(9n+6) { grid-column: span 5; }
.tile:nth-child(9n+7) { grid-column: span 7; }
.tile-media { aspect-ratio: 4 / 3; border: 1.5px solid var(--color-ink); overflow: hidden; background: var(--color-line); transition: border-color .2s; }
.tile:hover .tile-media { border-color: var(--color-brand); }
.tile-open { display: block; width: 100%; height: 100%; padding: 0; border: 0; background: none; }
.tile-img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s cubic-bezier(.16, 1, .3, 1); }
.tile:hover .tile-img { transform: scale(1.03); }
.tile figcaption { display: flex; flex-direction: column; gap: 4px; margin-top: 14px; }
.tile-role { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; color: var(--color-muted); }
.tile strong { font-family: var(--font-display); font-size: clamp(18px, 1.6vw, 24px); line-height: 1.15; letter-spacing: -.02em; font-weight: 600; }
.tile-line { font-size: 14px; color: var(--color-muted); overflow-wrap: anywhere; }
.tag { border: 1px solid var(--color-brand); color: var(--color-brand); padding: 2px 8px; font-size: 10px; }

.more { margin-top: 56px; border-top: 1.5px solid var(--color-ink); border-bottom: 1.5px solid var(--color-ink); }
.more > button { width: 100%; display: flex; justify-content: space-between; align-items: center; min-height: 64px; background: transparent; border: 0; padding: 20px 0; font-family: var(--font-display); font-size: clamp(20px, 2vw, 28px); font-weight: 600; letter-spacing: -.02em; text-align: left; }
.more > button:hover { color: var(--color-brand); }
.more-note { padding-bottom: 16px; color: var(--color-muted); font-size: 14px; max-width: 64ch; }
.more-group { padding-block: 20px 8px; }
.more-group h3 { font-size: 18px; letter-spacing: -.01em; margin-bottom: 8px; }
.more-group ul { list-style: none; padding: 0; margin: 0; columns: 2; column-gap: 40px; }
.more-group li { break-inside: avoid; display: grid; gap: 2px; padding: 12px 0; border-top: 1px solid var(--color-line); font-size: 14px; }
.more-group li span:last-child { color: var(--color-muted); overflow-wrap: anywhere; }

/* Lightbox */
.lightbox { border: 0; padding: 0; background: transparent; color: var(--color-paper); width: 100%; height: 100%; max-width: 100vw; max-height: 100dvh; }
.lightbox::backdrop { background: rgb(18 18 17 / .94); }
.lightbox[open] { display: block; }
.lightbox-inner { height: 100%; display: grid; grid-template-rows: 1fr auto; gap: 12px; padding: 16px var(--pad); }
.lightbox-figure { display: grid; grid-template-rows: 1fr auto; gap: 12px; min-height: 0; }
.lightbox-figure img { margin: auto; max-width: 100%; max-height: calc(100dvh - 190px); width: auto; height: auto; object-fit: contain; }
.lightbox-figure figcaption { display: flex; flex-direction: column; gap: 2px; font-size: 14px; }
.lightbox-figure figcaption strong { font-family: var(--font-display); font-size: 20px; font-weight: 600; }
.lightbox-bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.lightbox-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
.lightbox .btn { min-height: 44px; padding-inline: 18px; }
body:has(dialog.lightbox[open]) { overflow: hidden; }

@media (max-width: 1000px) {
  .tile, .tile:nth-child(n) { grid-column: span 6; }
  .more-group ul { columns: 1; }
}
@media (max-width: 640px) {
  .tile, .tile:nth-child(n) { grid-column: 1 / -1; }
  .filters button { padding: 0 14px; }
}
```

- [ ] **Step 5: Verify**

Run: `node_modules/.bin/tsc --noEmit && node --test "src/**/*.test.ts" && node_modules/.bin/vite build --outDir .tmp-build 2>&1 | tail -3; rm -rf .tmp-build`
Expected: green.

In the preview: filters show counts that add up (All 26, Construction, Interiors, Engineering, Design renders) and the "shown" count updates. Clicking a tile opens the lightbox; Esc closes it and focus returns to the tile; arrow keys move between photos; the Magallanes tile shows the placeholder and is not clickable. At 390px the mosaic is one column. Rename `public/images/projects/05-07.webp` temporarily, reload, and confirm that tile falls back to the placeholder without moving other tiles, then restore it.

- [ ] **Step 6: Commit**

```bash
git add src/components/Projects.tsx src/components/Lightbox.tsx src/App.tsx src/index.css
git commit -m "$(cat <<'EOF'
feat: add project mosaic with filters, lightbox and experience list

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Process and team

**Files:**
- Create: `src/components/Process.tsx`, `src/components/Team.tsx`
- Modify: `src/App.tsx`, `src/index.css` (append)

**Interfaces:**
- Consumes: `steps`, `team` from `src/data/company.ts`; `useReveal`.
- Produces: default exports `Process`, `Team` (renders `null` while `team.visible` is `false`). Section id `process`.

- [ ] **Step 1: Create `src/components/Process.tsx`**

```tsx
import { steps } from "../data/company"
import { useReveal } from "../hooks/useReveal"

export default function Process() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="process" className="process" aria-labelledby="process-title">
      <div className="wrap reveal" ref={ref}>
        <h2 id="process-title" className="big">
          A clear <span>path forward.</span>
        </h2>
        <ol className="steps">
          {steps.map((step) => (
            <li className="step" key={step.n}>
              <span className="num" aria-hidden="true">
                {step.n}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `src/components/Team.tsx`**

```tsx
import { team } from "../data/company"
import { useReveal } from "../hooks/useReveal"

export default function Team() {
  const ref = useReveal<HTMLDivElement>()
  if (!team.visible) return null
  return (
    <section id="team" className="team" aria-labelledby="team-title">
      <div className="wrap reveal" ref={ref}>
        <h2 id="team-title" className="team-title">
          The people behind the work
        </h2>
        <ul className="team-row">
          {team.members.map((member) => (
            <li key={member.name}>
              <strong>{member.name}</strong>
              <span>{member.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Compose**

In `src/App.tsx` import `Process` and `Team`; render `<Process />` then `<Team />` after `<Projects />`.

- [ ] **Step 4: Append CSS**

```css
/* Process */
.process { padding-block: 0 clamp(72px, 9vw, 140px); }
.steps { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); margin-top: clamp(32px, 4vw, 64px); border: 1.5px solid var(--color-ink); background: var(--color-paper); }
.step { padding: clamp(24px, 3vw, 44px); border-right: 1.5px solid var(--color-ink); min-height: 360px; display: flex; flex-direction: column; transition: background .25s, color .25s; }
.step:last-child { border-right: 0; }
.step:hover { background: var(--color-brand); color: var(--color-paper); }
.step .num { font-family: var(--font-display); font-weight: 700; font-size: clamp(88px, 11vw, 176px); line-height: .8; letter-spacing: -.07em; color: var(--color-brand); transition: color .25s; }
.step:hover .num { color: var(--color-paper); }
.step h3 { margin-top: auto; padding-top: 40px; font-size: clamp(28px, 3vw, 44px); font-weight: 600; letter-spacing: -.04em; }
.step p { margin-top: 12px; max-width: 34ch; line-height: 1.65; color: var(--color-muted); transition: color .25s; }
.step:hover p { color: var(--color-paper); }

/* Team */
.team { padding-block: 0 clamp(72px, 9vw, 140px); }
.team-title { font-size: clamp(24px, 2.6vw, 36px); letter-spacing: -.03em; font-weight: 700; }
.team-row { list-style: none; padding: 0; margin-top: 28px; display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1.5px solid var(--color-ink); border-bottom: 1.5px solid var(--color-ink); }
.team-row li { padding: 24px 24px 24px 0; border-right: 1px solid var(--color-line); display: grid; gap: 4px; }
.team-row li + li { padding-left: 24px; }
.team-row li:last-child { border-right: 0; }
.team-row strong { font-family: var(--font-display); font-size: clamp(18px, 1.8vw, 26px); letter-spacing: -.02em; }
.team-row span { color: var(--color-muted); font-size: 14px; }

@media (max-width: 1000px) {
  .steps { grid-template-columns: 1fr; }
  .step { border-right: 0; border-bottom: 1.5px solid var(--color-ink); min-height: 0; }
  .step:last-child { border-bottom: 0; }
  .team-row { grid-template-columns: 1fr; }
  .team-row li, .team-row li + li { padding: 20px 0; border-right: 0; border-top: 1px solid var(--color-line); }
  .team-row li:first-child { border-top: 0; }
}
```

- [ ] **Step 5: Verify**

Run: `node_modules/.bin/tsc --noEmit && node_modules/.bin/vite build --outDir .tmp-build 2>&1 | tail -3; rm -rf .tmp-build`
Expected: green. In the preview the three steps appear as bordered columns (stacked at 390px); no Team block is visible because `team.visible` is `false`.

- [ ] **Step 6: Commit**

```bash
git add src/components/Process.tsx src/components/Team.tsx src/App.tsx src/index.css
git commit -m "$(cat <<'EOF'
feat: add process steps and flagged team block

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Contact form and footer

**Files:**
- Create: `src/components/Contact.tsx`, `src/components/Footer.tsx`
- Modify: `src/App.tsx`, `src/index.css` (append)

**Interfaces:**
- Consumes: `company` (Task 1); `projectTypes`, `emptyInquiry`, `validateInquiry`, `buildMessage`, `buildMailto`, `type Inquiry`, `type InquiryErrors`, `type InquiryField` (Task 1); `Arrow`, `Brand`, `useReveal`.
- Produces: default exports `Contact`, `Footer`. Section id `contact`.

- [ ] **Step 1: Create `src/components/Contact.tsx`**

```tsx
import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react"
import { company } from "../data/company"
import {
  buildMailto,
  buildMessage,
  emptyInquiry,
  projectTypes,
  validateInquiry,
  type Inquiry,
  type InquiryErrors,
  type InquiryField,
} from "../lib/inquiry"
import { useReveal } from "../hooks/useReveal"
import Arrow from "./Arrow"

const fieldOrder: InquiryField[] = ["name", "phone", "email", "projectType", "details"]

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string
  label: string
  error?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {optional && <span className="optional"> (optional)</span>}
      </label>
      {children}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

export default function Contact() {
  const [values, setValues] = useState<Inquiry>(emptyInquiry)
  const [errors, setErrors] = useState<InquiryErrors>({})
  const [composed, setComposed] = useState(false)
  const [copied, setCopied] = useState(false)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const ref = useReveal<HTMLDivElement>()

  const update =
    (key: keyof Inquiry) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [key]: event.target.value }))
      setComposed(false)
      setCopied(false)
    }

  const describe = (key: InquiryField) => (errors[key] ? `inq-${key}-error` : undefined)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const found = validateInquiry(values)
    setErrors(found)
    const firstInvalid = fieldOrder.find((key) => found[key])
    if (firstInvalid) {
      document.getElementById(`inq-${firstInvalid}`)?.focus()
      return
    }
    setComposed(true)
    window.location.href = buildMailto(company.emails[0], values)
  }

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(buildMessage(values))
      setCopied(true)
    } catch {
      messageRef.current?.select()
    }
  }

  return (
    <section id="contact" className="contact on-dark" aria-labelledby="contact-title">
      <div className="wrap reveal" ref={ref}>
        <h2 id="contact-title" className="big contact-title">
          Let’s build what’s <span>next.</span>
        </h2>

        <div className="contact-grid">
          <form className="inquiry" onSubmit={onSubmit} noValidate>
            <Field id="inq-name" label="Your name" error={errors.name}>
              <input
                id="inq-name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={update("name")}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describe("name")}
              />
            </Field>
            <Field id="inq-phone" label="Phone number" error={errors.phone}>
              <input
                id="inq-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={update("phone")}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={describe("phone")}
              />
            </Field>
            <Field id="inq-email" label="Email" optional error={errors.email}>
              <input
                id="inq-email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={update("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describe("email")}
              />
            </Field>
            <Field id="inq-projectType" label="Project type" error={errors.projectType}>
              <select
                id="inq-projectType"
                value={values.projectType}
                onChange={update("projectType")}
                aria-invalid={Boolean(errors.projectType)}
                aria-describedby={describe("projectType")}
              >
                <option value="">Choose one</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="inq-location" label="Project location" optional>
              <input
                id="inq-location"
                type="text"
                autoComplete="address-level2"
                value={values.location}
                onChange={update("location")}
              />
            </Field>
            <Field id="inq-details" label="Tell us about the project" error={errors.details}>
              <textarea
                id="inq-details"
                rows={5}
                value={values.details}
                onChange={update("details")}
                aria-invalid={Boolean(errors.details)}
                aria-describedby={describe("details")}
              />
            </Field>
            <button className="btn btn-red" type="submit">
              Start a project <Arrow diagonal />
            </button>

            {composed && (
              <div className="composed" role="status">
                <p>
                  Your email app should open with this message ready to send. If it
                  did not, copy the message and email it to {company.emails[0]}, or
                  call {company.phones[0].label}.
                </p>
                <textarea
                  ref={messageRef}
                  readOnly
                  rows={6}
                  value={buildMessage(values)}
                  aria-label="Your message"
                />
                <button type="button" className="btn btn-ghost" onClick={copyMessage}>
                  {copied ? "Copied" : "Copy message"}
                </button>
              </div>
            )}
          </form>

          <div className="contact-info">
            <span className="c-label mono">Email</span>
            {company.emails.map((email) => (
              <a className="c-link" href={`mailto:${email}`} key={email}>
                {email}
              </a>
            ))}
            <span className="c-label mono">Call</span>
            {company.phones.map((phone) => (
              <a className="c-link" href={phone.href} key={phone.href}>
                {phone.label}
              </a>
            ))}
            <span className="c-label mono">Visit our office</span>
            <p>{company.address}</p>
            <a
              className="u-link"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Find our office <Arrow diagonal />
            </a>
            <span className="c-label mono">Follow our work</span>
            <div className="socials">
              {company.socials.map((social) => (
                <a
                  className="u-link"
                  href={social.href}
                  key={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.label} <Arrow diagonal />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `src/components/Footer.tsx`**

```tsx
import { company } from "../data/company"
import Brand from "./Brand"

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-row">
        <a href="#home" aria-label="Sphere8 home">
          <Brand />
        </a>
        <span>
          © {new Date().getFullYear()} {company.name}
        </span>
        <nav aria-label="Footer navigation">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          {company.socials.map((social) => (
            <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer">
              {social.label}
            </a>
          ))}
          <a href="#home">Back to top</a>
        </nav>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Final composer**

Replace `src/App.tsx` with:

```tsx
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Process from "./components/Process"
import ProofStrip from "./components/ProofStrip"
import Projects from "./components/Projects"
import Services from "./components/Services"
import Team from "./components/Team"

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <ProofStrip />
        <Services />
        <Projects />
        <Process />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Append CSS**

```css
/* Contact */
.contact { padding-block: clamp(72px, 9vw, 140px); }
.contact-title { font-size: clamp(44px, 9vw, 150px); line-height: .88; }
.contact-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: clamp(32px, 5vw, 88px); margin-top: clamp(40px, 6vw, 88px); padding-top: 32px; border-top: 1px solid #ffffff2b; }
.inquiry { display: grid; gap: 20px; align-content: start; }
.field { display: grid; gap: 8px; }
.field label { font-size: 14px; font-weight: 500; }
.optional { color: var(--color-muted-on-ink); font-weight: 400; }
.field input, .field select, .field textarea, .composed textarea { width: 100%; min-height: 52px; padding: 12px 14px; background: #262725; color: var(--color-paper); border: 1.5px solid #8a8c84; border-radius: 0; font-size: 16px; color-scheme: dark; }
.field textarea { min-height: 140px; resize: vertical; }
.field input:focus-visible, .field select:focus-visible, .field textarea:focus-visible { outline: 2px solid var(--color-paper); outline-offset: 2px; border-color: var(--color-paper); }
.field [aria-invalid='true'] { border-color: var(--color-brand-light); }
.field-error { color: var(--color-brand-light); font-size: 14px; }
.inquiry .btn-red { justify-self: start; }
.composed { display: grid; gap: 12px; padding: 20px; border: 1.5px solid var(--color-paper); }
.composed p { font-size: 15px; }
.composed .btn { justify-self: start; }
.contact-info p { font-size: 17px; max-width: 30ch; }
.c-label { display: block; color: var(--color-muted-on-ink); margin: 28px 0 10px; }
.c-label:first-child { margin-top: 0; }
.c-link { display: block; font-family: var(--font-display); font-size: clamp(18px, 1.7vw, 24px); letter-spacing: -.02em; line-height: 1.5; overflow-wrap: anywhere; transition: color .2s; }
.c-link:hover { color: var(--color-brand-light); }
.contact-info .u-link { margin-top: 14px; }
.socials { display: flex; flex-wrap: wrap; gap: 8px 24px; }

/* Footer */
.site-footer { background: var(--color-ink); color: var(--color-muted-on-ink); border-top: 1px solid #ffffff2b; font-size: 13px; }
.footer-row { display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; padding-block: 28px 32px; }
.site-footer .brand { color: var(--color-paper); }
.site-footer nav { display: flex; gap: 24px; flex-wrap: wrap; }
.site-footer a:hover { color: var(--color-paper); }

@media (max-width: 1000px) {
  .contact-grid { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .inquiry .btn-red, .composed .btn { justify-self: stretch; }
  .site-footer nav { width: 100%; justify-content: space-between; }
}
```

- [ ] **Step 5: Verify**

Run: `node_modules/.bin/tsc --noEmit && node --test "src/**/*.test.ts" && node_modules/.bin/vite build --outDir .tmp-build 2>&1 | tail -3; rm -rf .tmp-build`
Expected: green.

In the preview: submitting the empty form shows four error messages and focuses the name field; typing a valid inquiry and submitting opens the mail client (or, in a browser with none, shows the "Your email app should open..." panel with the message, a working Copy button, and the call number). Label text sits above every input and none relies on placeholder text.

- [ ] **Step 6: Commit**

```bash
git add src/components/Contact.tsx src/components/Footer.tsx src/App.tsx src/index.css
git commit -m "$(cat <<'EOF'
feat: add inquiry form, contact details, social links and footer

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Cleanup, audit and verification

**Files:**
- Delete: `src/data/projects.ts`, `public/images/kamuning-townhouse.webp`, `public/images/student-dormitory.webp`, `public/images/national-defense-college.webp`
- Modify: whatever the audit finds (in-scope only)

**Interfaces:** none new.

- [ ] **Step 1: Remove superseded files and confirm nothing imports them**

```bash
cd "/mnt/GamesAndStuff/Company Profile Website Design"
grep -rn "data/projects" src || echo "no imports of data/projects"
git rm -q src/data/projects.ts public/images/kamuning-townhouse.webp public/images/student-dormitory.webp public/images/national-defense-college.webp
```
Expected: `no imports of data/projects`, then the files are staged for removal.

- [ ] **Step 2: Typecheck, test and build**

Run: `node_modules/.bin/tsc --noEmit && node --test "src/**/*.test.ts" && node_modules/.bin/vite build --outDir .tmp-build 2>&1 | tail -8; ls .tmp-build/fonts .tmp-build/images/projects | head -8; rm -rf .tmp-build`
Expected: tsc silent; 20 tests pass; Vite builds; the fonts and project images are copied into the build output.

- [ ] **Step 3: Scan shipped copy and CSS for rule violations**

```bash
grep -rnP '[\x{2013}\x{2014}]' src --include=*.tsx --include=*.ts --include=*.css || echo "no dashes"
grep -rn "window.addEventListener(\"scroll\"" src || echo "no scroll listeners"
grep -rn "border-radius" src/index.css || echo "no radius"
grep -rn "Let’s build\|Discuss your project\|Get in touch" src/components | grep -v "Let’s build what" || echo "one contact label"
```
Expected: `no dashes`, `no scroll listeners`, `no radius`, `one contact label`. (The `−` minus sign in the disclosure button is U+2212 and is not matched.) Fix any hit before continuing.

- [ ] **Step 4: Browser checks at three widths**

With the dev server on `http://localhost:8443` and the Playwright MCP tools (`browser_navigate`, `browser_resize`, `browser_take_screenshot`, `browser_evaluate`):

1. Resize to 1440x900, navigate, take a full-page screenshot. Check: hero fits in the first screen with the CTA visible; no clipped text; services photo swaps on hover.
2. Resize to 768x1024 and repeat. Check: two-column mosaic, stacked contact, no horizontal scroll.
3. Resize to 390x844 and repeat. Check: menu toggle works and closes on selection; hero stacks; one-column mosaic.
4. At each width run `browser_evaluate` with `document.documentElement.scrollWidth <= document.documentElement.clientWidth` and expect `true`.
5. Run `browser_evaluate` with `[...document.querySelectorAll("img")].filter(i => i.complete && i.naturalWidth === 0).length` after scrolling the whole page and expect `0` broken images.

Record any failure, fix it in the relevant component or CSS, and re-run.

- [ ] **Step 5: Keyboard and reduced-motion checks**

1. Tab from the top of the page: the skip link appears first and jumps to `#main`; focus rings are visible on every link, filter, tile, disclosure and form control (paper-coloured on dark sections).
2. Open a tile with Enter, move with the arrow keys, close with Esc, and confirm focus returns to the tile.
3. In the Playwright session call `browser_emulate_media` with `reducedMotion: "reduce"`, reload, and confirm all sections are visible immediately and the hero does not animate.
4. Submit the form empty and confirm each error message is announced next to its field and the first invalid field has focus.

- [ ] **Step 6: Format changed files only**

Run: `node_modules/.bin/oxfmt src/App.tsx src/components src/data src/hooks src/lib`
Expected: files are formatted; `git diff --stat` shows only whitespace and quote-style changes. Re-run Step 2 afterwards and expect it to stay green.

- [ ] **Step 7: Update the spec's open items and commit**

In `docs/superpowers/specs/2026-10-12-sphere8-site-plan-design.md`, under "Open items for the client", append one line: `6. The Team block is built but switched off (set team.visible to true in src/data/company.ts once the people agree to appear).`

```bash
git add src docs/superpowers/specs/2026-10-12-sphere8-site-plan-design.md public/images
git commit -m "$(cat <<'EOF'
chore: remove superseded data and photos, format and audit

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
git status --short
```
Expected: commit succeeds; `git status --short` shows only `?? assets/` and `?? docs/superpowers/plans/`.

- [ ] **Step 8: Report**

Summarise for the client: what was built, the verification results from Steps 2 to 5 (state any check that could not be run), and the remaining open items: confirm every Construction-contract photo was built by Sphere8, decide on the Team block, review the page on a real phone and tablet, and decide when to set `robots.index` to `true`.

---

## Self-review notes

- **Spec coverage:** page blocks 1 to 7 are Tasks 3 to 7; visual system in Task 2 plus per-block CSS; gallery filters, lightbox, empty and failure states in Task 5; form behaviour and honest fallback in Task 7; roles and photo table in Task 1; verification list in Task 8; open items and amendments in Tasks 1 and 8.
- **Types:** `Photo`, `RoleKey`, `FilterKey`, `Inquiry`, `InquiryErrors`, `InquiryField` are defined in Task 1 and used with identical names in Tasks 5 and 7. `photoUrl(id, small?)` and `photoSrcSet(id, width)` signatures match their callers.
- **Known soft spots to watch during execution:** the `04-04` hero photo is only 822px wide, so check it is not soft at desktop size; `13-08` (510px) and `15-03` (444px) will look soft in the lightbox and are small by nature of the source; the Kamuning tile carries role "Construction contract" because it sits in that section of the profile, so confirm that with the client.
