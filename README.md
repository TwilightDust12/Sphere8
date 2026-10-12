# Sphere8 Construction Corp. website

Single-page company profile for **Sphere8 Construction Corp.**, a design-and-build firm (architects, engineers, contractor) in Lucena City, Philippines. The site shows the firm's real project work, explains its services and makes it easy for homeowners and small commercial clients to start an inquiry.

Built with React 19, Vite 8 and Tailwind CSS v4. It is a static site with no backend or CMS; inquiries are handled by Netlify Forms.

## What's on the page

| Section | Notes |
|---|---|
| Hero | Headline, one-line summary, two calls to action and a project photo |
| About / proof strip | Established 2020, SEC-registered January 3, 2020, licensed general contractors |
| Services | Construction and development, design and engineering, project management, with a photo that swaps on hover or focus |
| Projects | 25 photos with role labels taken from the company profile, filters, lightbox and a curated default set of 12 |
| More project experience | Full list from the profile, with client and contractor credits |
| Process | Plan, Coordinate, Build |
| Team | Can be switched off (see below) |
| Contact | Inquiry form (Netlify Forms, with an email-draft fallback), call and email links, Facebook message link, map link |
| Mobile bar | Fixed "Call us / Start a project" bar on phones and tablets |

## Getting started

Requirements: Node 22 and pnpm 10 (versions are pinned in `.mise.toml`).

```bash
pnpm install
pnpm dev          # development server, default port 8443 (set PORT to change)
pnpm build        # production build into dist/
pnpm preview      # serve the production build locally
```

Other scripts:

```bash
pnpm test         # unit tests (node --test, no extra test dependency)
pnpm typecheck    # tsc --noEmit
pnpm format       # oxfmt
```

The unit tests need Node 22.18 or newer, because they run TypeScript directly.

## Project structure

```
src/
  App.tsx                 composes the sections
  components/             one file per section (Hero, Services, Projects, Contact, ...)
  data/
    company.ts            contact details, socials, proof facts, services, process, team
    gallery.ts            photo records, role labels, filters, featured set
    experience.ts         "More project experience" list
  lib/
    inquiry.ts            form validation and the mailto builder
    assets.ts             photo and brand URL helpers
    motion.ts             stagger helper for reveals
  hooks/useReveal.ts      scroll reveal (IntersectionObserver)
  index.css               design tokens and all styles
public/
  images/projects/        gallery and hero photos (WebP, plus -800 variants for phones)
  brand/                  logo files (transparent PNGs and the originals)
  fonts/                  self-hosted fonts and their licences
docs/superpowers/         design spec and implementation plan
.figma/make/              Figma Make platform scripts and site.json
```

## Common edits

**Contact details, services, steps, team**: `src/data/company.ts`.
Set `team.visible` to `false` to hide the team section.

**Add or reorder project photos**: put `<id>.webp` (max 1600px wide) in `public/images/projects/`, plus `<id>-800.webp` at 800px wide if the original is wider, then add a record to `src/data/gallery.ts`. The first `FEATURED_COUNT` (12) records are the default view, so keep the strongest first and keep at least one photo from every group among them. The tests check that every record has its files and that the featured set covers every filter.

**Photo roles and filters**: `roles` and `filters` in `src/data/gallery.ts`. Role labels follow the sections of the company profile, so avoid labelling anything "built by Sphere8" outside Construction contract and Sub-contract works.

**Page title, description, favicon, share image, search indexing**: `.figma/make/site.json`.

**Colours, type and spacing**: tokens at the top of `src/index.css`.

## The inquiry form

The form posts to **Netlify Forms** and has no server code of its own.

- `public/forms.html` declares the form (name `inquiry`) so Netlify detects it at deploy time. Its field names must match `buildFormBody()` in `src/lib/inquiry.ts`.
- On "Send inquiry" the page posts the fields to `/`. Only a successful response shows the thank-you message.
- If the post fails (not hosted on Netlify, offline, or rejected), the page says so and falls back to an email draft: it opens the visitor's mail app with the message filled in, and shows the message with a **Copy message** button and the phone number. An "Or open an email draft instead" link offers the same path up front.
- Spam is filtered with a honeypot field (`bot-field`) plus Netlify's own spam filtering.

After the first deploy, open Netlify, then **Forms**, then **inquiry**, and add an email notification under **Settings and usage** so each inquiry reaches `sphere8construction@gmail.com`. Submissions are also stored in Netlify for review.

## Before going live

- Set `openGraph.image` in `.figma/make/site.json` to a full address, for example `https://yourdomain.com/og-image.jpg`, so social previews work.
- `robots.index` in the same file is `true`; set it to `false` for a private preview.
- Confirm the team members' names and titles and that they agree to appear, or hide the team block.
- Send a test inquiry on the live site and confirm the notification email arrives.
- Check the Facebook message link (`https://m.me/sphere8construction`) on the live site.
- Look at the site on a real phone and tablet.

## Deployment

The build output is a plain static site in `dist/`. The repository includes `netlify.toml`, so Netlify picks up the settings by itself:

1. In Netlify choose **Add new site, Import an existing project** and connect the GitHub repository.
2. Build command `pnpm build`, publish directory `dist`, Node 22 (already set in `netlify.toml`).
3. After the first deploy, set up the form notification (see above), add your domain, and replace the share image address in `.figma/make/site.json`.

No redirects are needed, because the page has no client-side routes.

The repository also contains Figma Make scripts (`.figma/make/deploy`) for publishing from Figma Make.

## Documentation

- `docs/superpowers/specs/` has the design spec: structure, rules, decisions and the rounds of changes.
- `docs/superpowers/plans/` has the implementation plan.
- `plans/sphere8-website.md` is the original brief and content rules.

## Credits and licences

Project photography and renders come from the Sphere8 company profile. Fonts are Space Grotesk, Geist and Geist Mono, each under the SIL Open Font License (see `public/fonts/`).
