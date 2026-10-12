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
