import test from "node:test"
import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import { company, proof, services, steps, team } from "./company.ts"
import { photos } from "./gallery.ts"
import { experienceGroups } from "./experience.ts"

test("data modules contain no em-dashes or en-dashes", () => {
  const all = JSON.stringify({
    company,
    proof,
    services,
    steps,
    team,
    photos,
    experienceGroups,
  })
  const hit = all.match(new RegExp(".{0,30}[\\u2013\\u2014].{0,30}"))
  assert.equal(hit, null, `dash found near: ${hit?.[0]}`)
})

test("contact details are complete", () => {
  assert.equal(company.emails.length, 2)
  assert.equal(company.phones.length, 3)
  for (const p of company.phones) assert.ok(p.href.startsWith("tel:+63"))
  for (const s of company.socials) assert.ok(s.href.startsWith("https://"))
})

test("team block lists named people with titles", () => {
  assert.ok(team.members.length >= 3)
  for (const m of team.members)
    assert.ok(m.name.length > 3 && m.title.length > 3)
})

test("component and lib sources contain no em-dashes or en-dashes", () => {
  const bad: string[] = []
  for (const dir of ["../components/", "../lib/"]) {
    for (const file of readdirSync(new URL(dir, import.meta.url))) {
      if (!/\.tsx?$/.test(file) || file.endsWith(".test.ts")) continue
      const text = readFileSync(new URL(dir + file, import.meta.url), "utf8")
      if (new RegExp("[\\u2013\\u2014]").test(text)) bad.push(dir + file)
    }
  }
  assert.deepEqual(bad, [])
})
