// Optional browser regression checks. Install the driver into .cache/browser first.
// BROWSER_PATH points at an existing Chrome/Chromium executable; BASE_URL defaults to the local production preview.
import { createRequire } from "node:module"
import { pathToFileURL } from "node:url"
import path from "node:path"
import { mkdir } from "node:fs/promises"
import assert from "node:assert/strict"

const require = createRequire(import.meta.url)
const driver = require.resolve("puppeteer-core", { paths: [path.resolve(".cache/browser")] })
const { default: puppeteer } = await import(pathToFileURL(driver).href)
const base = process.env.BASE_URL || "http://127.0.0.1:8444"
const executablePath = process.env.BROWSER_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe"
await mkdir(".cache/verification", { recursive: true })
const browser = await puppeteer.launch({ executablePath, headless: true, userDataDir: path.resolve(".cache/chrome-verification") })
const pause = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms))
const report = {}
try {
  const page = await browser.newPage()
  const errors = []
  page.on("pageerror", error => errors.push(String(error)))
  await page.setViewport({ width: 1440, height: 1000 })
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }])
  await page.goto(base, { waitUntil: "networkidle0" })
  await page.waitForSelector(".cinema.is-animated")
  await page.screenshot({ path: ".cache/verification/desktop.png" })
  const hash = () => page.$eval(".story-visual canvas", canvas => {
    const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data
    let value = 0
    for (let i = 0; i < data.length; i += 101) value = (value * 31 + data[i]) | 0
    return value
  })
  const scroll = async (top) => { await page.evaluate(top => scrollTo({ top, behavior: "instant" }), top); await pause(800) }
  await scroll(1800)
  const middle = await hash()
  const middleFrame = await page.$eval("canvas", canvas => canvas.dataset.frame)
  await scroll(3600)
  assert.notEqual(await hash(), middle)
  await page.screenshot({ path: ".cache/verification/finished.png" })
  await scroll(1800)
  assert.equal(await page.$eval("canvas", canvas => canvas.dataset.frame), middleFrame, "reversing to the same position must restore the same source frame")
  await page.mouse.wheel({ deltaY: 250 })
  await pause()
  assert.ok(await page.evaluate(() => scrollY) > 1800)
  report.scroll = "forward, reverse, fast jumps and wheel passed"

  for (const [width, height] of [[1366, 768], [1024, 600], [844, 390], [390, 844]]) {
    await page.setViewport({ width, height })
    await scroll(0)
    const geometry = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      pinned: document.querySelector(".cinema").classList.contains("is-animated"),
      skip: document.querySelector(".story-scroll").getBoundingClientRect().bottom,
      caption: getComputedStyle(document.querySelector(".story-note")).display,
    }))
    assert.equal(geometry.overflow, false)
    assert.notEqual(geometry.caption, "none")
    if (geometry.pinned) assert.ok(geometry.skip <= height, "skip link must fit a pinned viewport")
    else assert.equal(await page.$$eval(".static-chapters img", images => images.length), 3)
    await page.screenshot({ path: `.cache/verification/viewport-${width}.png` })
  }
  await page.click(".menu-toggle")
  assert.equal(await page.$eval("#mobile-navigation", el => el.hidden), false)
  await page.keyboard.press("Escape")
  assert.equal(await page.$eval("#mobile-navigation", el => el.hidden), true)
  assert.equal(await page.evaluate(() => document.activeElement.className), "menu-toggle")
  report.responsive = "four sizes, short-screen fallback, caption and mobile menu passed"

  await page.setViewport({ width: 1440, height: 1000 })
  await page.evaluate(() => document.getElementById("projects").scrollIntoView({ behavior: "instant" }))
  await pause(700)
  assert.equal(await page.$$eval(".tile", tiles => tiles.length), 12)
  await page.click(".show-all")
  assert.equal(await page.$$eval(".tile", tiles => tiles.length), 25)
  await page.click('.filters button[aria-label^="Interiors,"]')
  await page.click(".tile-open")
  assert.equal(await page.$eval("dialog", el => el.open), true)
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("Escape")
  assert.equal(await page.$eval("dialog", el => el.open), false)
  await page.evaluate(() => document.getElementById("contact").scrollIntoView({ behavior: "instant" }))
  await pause(700)
  await page.click('.inquiry button[type="submit"]')
  assert.equal(await page.evaluate(() => document.activeElement.id), "inq-name")
  assert.equal(await page.$$eval(".field-error", errors => errors.length), 4)
  report.interactions = "gallery, lightbox keyboard controls and inquiry validation passed; no inquiry submitted"

  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
  await page.waitForSelector(".cinema.is-static")
  assert.equal(await page.$$eval(".static-chapters img", images => images.length), 3)
  await scroll(0)
  await page.screenshot({ path: ".cache/verification/reduced-motion.png" })
  report.reducedMotion = "flowing content and three construction-stage stills passed"

  const failure = await browser.newPage()
  await failure.setViewport({ width: 1440, height: 1000 })
  await failure.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }])
  const requests = new Map()
  await failure.setRequestInterception(true)
  failure.on("request", request => {
    if (request.url().includes("/story/frames/")) {
      requests.set(request.url(), (requests.get(request.url()) ?? 0) + 1)
      request.abort()
    } else request.continue()
  })
  await failure.goto(base, { waitUntil: "networkidle0" })
  await pause(800)
  assert.ok(requests.size > 0)
  assert.ok([...requests.values()].every(count => count <= 2), "missing frames must have bounded retries")
  assert.equal(await failure.$eval(".story-poster", image => image.complete && image.naturalWidth > 0), true)
  assert.equal(await failure.$eval("canvas", canvas => canvas.dataset.ready), undefined)
  await failure.close()
  report.mediaFailure = "poster retained; frame retries bounded at two"

  const saveData = await browser.newPage()
  await saveData.setViewport({ width: 1440, height: 1000 })
  await saveData.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }])
  await saveData.evaluateOnNewDocument(() => Object.defineProperty(navigator, "connection", { value: { saveData: true, addEventListener() {}, removeEventListener() {} }, configurable: true }))
  await saveData.goto(base, { waitUntil: "networkidle0" })
  assert.equal(await saveData.$eval(".cinema", el => el.classList.contains("is-static")), true)
  await saveData.close()
  report.saveData = "static fallback passed"
  await page.goto(`${base}/style-tile.html`, { waitUntil: "networkidle0" })
  await page.screenshot({ path: ".cache/verification/style-tile.png", fullPage: true })
  assert.equal(errors.length, 0, errors.join("\n"))
  report.runtime = "no page errors, including production hydration"
  console.log(JSON.stringify(report, null, 2))
} finally {
  await browser.close()
}
