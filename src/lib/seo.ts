import { company } from "../data/company.ts"

/** Share image used by Open Graph and Twitter cards (see public/og-image.jpg). */
export const socialImage = {
  path: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Sphere8 Construction Corp. logo with the words Architects, Engineers, Contractor",
}

const logo = { path: "/brand/logo-black.png", width: 410, height: 373 }

export function absoluteUrl(path = "/", base: string = company.url): string {
  return `${base}/${path.replace(/^\/+/, "")}`
}

const businessId = `${company.url}/#business`
const websiteId = `${company.url}/#website`

/** schema.org graph for search engines: the website and the contractor behind it. */
export function buildStructuredData(description: string): object {
  const [primaryPhone] = company.phones
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: absoluteUrl("/"),
        name: company.name,
        inLanguage: "en-PH",
        publisher: { "@id": businessId },
      },
      {
        "@type": "GeneralContractor",
        "@id": businessId,
        name: company.name,
        url: absoluteUrl("/"),
        description,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl(logo.path),
          width: logo.width,
          height: logo.height,
        },
        image: absoluteUrl(socialImage.path),
        telephone: tel(primaryPhone.href),
        email: company.emails[0],
        address: {
          "@type": "PostalAddress",
          streetAddress: company.location.street,
          addressLocality: company.location.locality,
          addressRegion: company.location.region,
          addressCountry: company.location.country,
        },
        areaServed: company.areaServed.map((name) => ({
          "@type": "Place",
          name,
        })),
        contactPoint: company.phones.map((phone) => ({
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: tel(phone.href),
        })),
        sameAs: company.socials.map((social) => social.href),
      },
    ],
  }
}

function tel(href: string): string {
  return href.replace(/^tel:/, "")
}

/** Serialises JSON-LD for a script tag, escaping "<" so it can't end the tag. */
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

export function buildSitemap(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${absoluteUrl("/")}</loc>
  </url>
</urlset>
`
}

export function buildRobotsTxt(): string {
  return `User-agent: *
Allow: /

Sitemap: ${absoluteUrl("/sitemap.xml")}
`
}
