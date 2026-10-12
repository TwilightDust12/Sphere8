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
    const full = new URL(
      `../../public/images/projects/${p.id}.webp`,
      import.meta.url,
    )
    assert.ok(existsSync(full), `${p.id}.webp is missing`)
    if (p.width > 800) {
      const small = new URL(
        `../../public/images/projects/${p.id}-800.webp`,
        import.meta.url,
      )
      assert.ok(existsSync(small), `${p.id}-800.webp is missing`)
    }
  }
})

test("filter counts add up to the whole gallery", () => {
  const counts = countByFilter(photos)
  assert.equal(counts.all, photos.length)
  const sum = filters
    .filter((f) => f.key !== "all")
    .reduce((n, f) => n + counts[f.key], 0)
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
