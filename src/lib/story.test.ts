import test from "node:test"
import assert from "node:assert/strict"
import { storyFrame, storyChapter } from "./story.ts"

test("frame mapping clamps jumps and holds the opening and finished house", () => {
  assert.equal(storyFrame(-1, 181), 0)
  assert.equal(storyFrame(2, 181), 180)
  assert.equal(storyFrame(0.1, 181), 0)
  assert.equal(storyFrame(0.99, 181), 180)
  assert.equal(storyFrame(0.5, 1), 0)
  assert.equal(storyFrame(NaN, 181), 0)
  assert.equal(storyFrame(0.5, 0), 0)
})

test("scrubbing is monotonic and returns the same frames in reverse", () => {
  const progress = [0, 0.12, 0.25, 0.4, 0.625, 0.75, 0.875, 1]
  const frames = progress.map((p) => storyFrame(p, 181))
  assert.deepEqual(frames, [0, 0, 36, 72, 126, 153, 180, 180])
  assert.deepEqual(
    [...progress].reverse().map((p) => storyFrame(p, 181)),
    [...frames].reverse(),
  )
})

test("chapter selection handles boundaries and invalid progress", () => {
  assert.equal(storyChapter(0.249), 0)
  assert.equal(storyChapter(0.25), 1)
  assert.equal(storyChapter(0.625), 2)
  assert.equal(storyChapter(0.875), 3)
  assert.equal(storyChapter(NaN), 0)
})

test("mobile starts sooner and keeps short readable opening and final holds", () => {
  assert.equal(storyFrame(0.04, 181, true), 0)
  assert.ok(storyFrame(0.12, 181, true) > 0)
  assert.equal(storyFrame(0.88, 181, true), 180)
  const points = [0, 0.06, 0.25, 0.5, 0.7, 0.88, 1]
  const frames = points.map((p) => storyFrame(p, 181, true))
  assert.deepEqual(
    frames,
    [...frames].sort((a, b) => a - b),
  )
  assert.deepEqual(
    [...points].reverse().map((p) => storyFrame(p, 181, true)),
    [...frames].reverse(),
  )
})
