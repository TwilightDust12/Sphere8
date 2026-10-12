import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { company } from "../data/company.ts"
import {
  absoluteUrl,
  buildRobotsTxt,
  buildSitemap,
  buildStructuredData,
  jsonLdScript,
  socialImage,
} from "./seo.ts"

const siteJson = JSON.parse(
  readFileSync(new URL("../../.figma/make/site.json", import.meta.url), "utf8"),
) as {
  title: string
  description: string
  openGraph: { image: string }
  robots: { index: boolean }
}

interface Node {
  "@type": string
  [key: string]: unknown
}

function graph(): Node[] {
  const data = buildStructuredData(siteJson.description) as {
    "@graph": Node[]
  }
  return data["@graph"]
}

function business(): Node {
  const node = graph().find((item) => item["@type"] === "GeneralContractor")
  assert.ok(node, "GeneralContractor node is present")
  return node
}

test("site URL is an absolute https address with no trailing slash", () => {
  assert.match(company.url, /^https:\/\/[^/]+$/)
})

test("absoluteUrl joins paths onto the site URL", () => {
  assert.equal(absoluteUrl("/"), `${company.url}/`)
  assert.equal(absoluteUrl("/og-image.jpg"), `${company.url}/og-image.jpg`)
  assert.equal(
    absoluteUrl("brand/logo-black.png"),
    `${company.url}/brand/logo-black.png`,
  )
})

test("site.json share image is the absolute address of the social image", () => {
  assert.equal(siteJson.openGraph.image, absoluteUrl(socialImage.path))
})

test("title names the place and the work and fits a search result", () => {
  assert.match(siteJson.title, /Lucena/)
  assert.match(siteJson.title, /Design & Build/)
  assert.ok(
    siteJson.title.length <= 60,
    `title is ${siteJson.title.length} characters`,
  )
})

test("description fits a search result", () => {
  assert.ok(
    siteJson.description.length >= 70 && siteJson.description.length <= 160,
    `description is ${siteJson.description.length} characters`,
  )
})

test("location parts add up to the printed address", () => {
  assert.equal(
    company.address,
    `${company.location.street}, ${company.location.locality}`,
  )
})

test("structured data describes the business from the company data", () => {
  const node = business()
  assert.equal(node.name, company.name)
  assert.equal(node.url, `${company.url}/`)
  assert.equal(node.telephone, "+63423733695")
  assert.equal(node.email, company.emails[0])
  assert.equal(node.description, siteJson.description)
  assert.deepEqual(
    node.sameAs,
    company.socials.map((social) => social.href),
  )
  assert.deepEqual(node.address, {
    "@type": "PostalAddress",
    streetAddress: company.location.street,
    addressLocality: company.location.locality,
    addressRegion: company.location.region,
    addressCountry: company.location.country,
  })
})

test("structured data lists every phone number and the service areas", () => {
  const node = business()
  const points = node.contactPoint as { telephone: string }[]
  assert.deepEqual(
    points.map((point) => point.telephone),
    ["+63423733695", "+639209698592", "+639176757221"],
  )
  const areas = (node.areaServed as { name: string }[]).map((area) => area.name)
  assert.deepEqual(areas, company.areaServed)
})

test("structured data links the website to the business by id", () => {
  const site = graph().find((item) => item["@type"] === "WebSite")
  assert.ok(site, "WebSite node is present")
  const publisher = site.publisher as { "@id": string }
  assert.equal(publisher["@id"], business()["@id"])
})

test("every image and link in structured data is absolute", () => {
  const node = business()
  const logo = node.logo as { url: string }
  assert.match(logo.url, /^https:\/\//)
  assert.match(String(node.image), /^https:\/\//)
})

test("jsonLdScript cannot close its own script tag", () => {
  const script = jsonLdScript({ name: "</script><img src=x onerror=alert(1)>" })
  assert.ok(!script.includes("</script"))
  assert.ok(!script.includes("<"))
  assert.equal(JSON.parse(script).name, "</script><img src=x onerror=alert(1)>")
})

test("sitemap lists the home page once", () => {
  const xml = buildSitemap()
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/)
  assert.equal(xml.match(/<loc>/g)?.length, 1)
  assert.ok(xml.includes(`<loc>${company.url}/</loc>`))
})

test("robots.txt allows crawling and points at the sitemap", () => {
  const txt = buildRobotsTxt()
  assert.match(txt, /^User-agent: \*$/m)
  assert.match(txt, /^Allow: \/$/m)
  assert.ok(txt.includes(`Sitemap: ${company.url}/sitemap.xml`))
})
