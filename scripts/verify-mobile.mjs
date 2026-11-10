import { createRequire } from "node:module"
import { pathToFileURL } from "node:url"
import path from "node:path"
import { mkdir } from "node:fs/promises"
import assert from "node:assert/strict"

const require = createRequire(import.meta.url)
const { default: puppeteer } = await import(
  pathToFileURL(
    require.resolve("puppeteer-core", {
      paths: [path.resolve(".cache/browser")],
    }),
  ).href
)
const base = process.env.BASE_URL || "http://127.0.0.1:8444"
const browser = await puppeteer.launch({
  executablePath:
    process.env.BROWSER_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  userDataDir: path.resolve(".cache/chrome-mobile"),
})
await mkdir(".cache/mobile", { recursive: true })
const pause = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))
const report = []
try {
  for (const [width, height] of [
    [320, 568],
    [360, 740],
    [390, 844],
    [430, 932],
    [768, 1024],
  ]) {
    const page = await browser.newPage()
    const requested = []
    const errors = []
    page.on("request", (request) => requested.push(request.url()))
    page.on("pageerror", (error) => errors.push(String(error)))
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    })
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "no-preference" },
    ])
    await page.goto(base, { waitUntil: "networkidle0" })
    await page.screenshot({
      captureBeyondViewport: false,
      path: `.cache/mobile/opening-${width}.png`,
    })
    const geometry = await page.evaluate(() => {
      const header = document
        .querySelector(".site-header")
        .getBoundingClientRect()
      const title = document
        .querySelector(".story-copy h1")
        .getBoundingClientRect()
      const action = document
        .querySelector(".story-copy .btn")
        .getBoundingClientRect()
      const skip = document
        .querySelector(".story-scroll")
        .getBoundingClientRect()
      const menu = document
        .querySelector(".menu-toggle")
        .getBoundingClientRect()
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        header: header.top,
        titleTop: title.top,
        headerBottom: header.bottom,
        actionBottom: action.bottom,
        skipTop: skip.top,
        skipBottom: skip.bottom,
        menuWidth: menu.width,
        menuHeight: menu.height,
      }
    })
    assert.equal(geometry.overflow, false)
    assert.equal(geometry.header, 0)
    assert.ok(geometry.titleTop >= geometry.headerBottom)
    assert.ok(geometry.actionBottom <= geometry.skipTop)
    assert.ok(geometry.skipBottom <= height)
    assert.ok(geometry.menuWidth >= 44 && geometry.menuHeight >= 44)
    assert.equal(
      await page.$eval(".cinema", (el) => el.classList.contains("is-static")),
      true,
    )
    assert.equal(
      await page.$eval(
        ".story-poster",
        (img) =>
          img.currentSrc.includes("/story/mobile/") && img.naturalWidth > 0,
      ),
      true,
    )
    await page.click(".menu-toggle")
    assert.equal(
      await page.evaluate(() => document.activeElement.getAttribute("href")),
      "#projects",
    )
    await page.keyboard.down("Shift")
    await page.keyboard.press("Tab")
    await page.keyboard.up("Shift")
    assert.equal(
      await page.evaluate(() => document.activeElement.className),
      "menu-toggle",
    )
    await page.keyboard.down("Shift")
    await page.keyboard.press("Tab")
    await page.keyboard.up("Shift")
    assert.equal(
      await page.evaluate(() => document.activeElement.getAttribute("href")),
      "#contact",
    )
    await page.keyboard.press("Escape")
    assert.equal(
      await page.$eval("#mobile-navigation", (el) => el.hidden),
      true,
    )
    assert.equal(
      await page.evaluate(() => document.activeElement.className),
      "menu-toggle",
    )
    await page.click(".menu-toggle")
    await page.click('#mobile-navigation a[href="#projects"]')
    await pause(1200)
    assert.equal(
      await page.$eval("#mobile-navigation", (el) => el.hidden),
      true,
    )
    assert.equal(
      await page.evaluate(() => document.activeElement.id),
      "projects",
    )
    assert.ok(
      (await page.$eval("#projects", (el) => el.getBoundingClientRect().top)) >=
        geometry.headerBottom,
    )
    assert.equal(
      await page.$eval(".site-header", (el) => el.getBoundingClientRect().top),
      0,
    )
    await page.screenshot({
      captureBeyondViewport: false,
      path: `.cache/mobile/projects-${width}.png`,
    })
    await page.evaluate(() =>
      document
        .querySelector(".static-chapters article:last-child")
        .scrollIntoView({ behavior: "instant" }),
    )
    await pause()
    assert.equal(
      await page.evaluate(() =>
        Boolean(document.elementFromPoint(30, 30)?.closest(".site-header")),
      ),
      true,
      "header must remain painted above content",
    )
    await page.screenshot({
      captureBeyondViewport: false,
      path: `.cache/mobile/reveal-${width}.png`,
    })
    for (const id of ["services", "about", "contact"]) {
      await page.evaluate(
        (id) =>
          document.getElementById(id).scrollIntoView({ behavior: "instant" }),
        id,
      )
      await pause()
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      )
      assert.equal(
        await page.$eval(
          ".site-header",
          (el) => el.getBoundingClientRect().top,
        ),
        0,
      )
      if (width === 390)
        await page.screenshot({
          captureBeyondViewport: false,
          path: `.cache/mobile/${id}.png`,
        })
    }
    assert.equal(
      requested.some((url) => /\/story\/frames\//.test(url)),
      false,
      "mobile must not request desktop frames",
    )
    assert.equal(
      requested.some((url) => /\/story\/(poster|still-\d)\.webp/.test(url)),
      false,
      "mobile must select portrait posters/stills",
    )
    assert.equal(errors.length, 0, errors.join("\n"))
    report.push({
      width,
      height,
      navigation: "passed",
      overflow: false,
      desktopAnimationRequests: 0,
    })
    await page.close()
  }
  const page = await browser.newPage()
  const requests = []
  page.on("request", (request) => requests.push(request.url()))
  await page.setViewport({ width: 390, height: 844 })
  await page.goto(base, { waitUntil: "networkidle0" })
  await page.setViewport({ width: 1440, height: 1000 })
  await page.waitForSelector('canvas[data-ready="true"]')
  assert.ok(requests.some((url) => url.includes("/story/frames/")))
  await page.setViewport({ width: 390, height: 844 })
  await pause(800)
  assert.equal(await page.$eval("canvas", (el) => el.dataset.ready), undefined)
  const count = requests.filter((url) => url.includes("/story/frames/")).length
  await pause(800)
  assert.equal(
    requests.filter((url) => url.includes("/story/frames/")).length,
    count,
  )
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ])
  requests.length = 0
  await page.reload({ waitUntil: "networkidle0" })
  assert.equal(
    requests.some((url) => url.includes("/frames/")),
    false,
  )
  report.push({
    breakpointCleanup: "passed",
    reducedMotionAnimationRequests: 0,
  })
  console.log(JSON.stringify(report, null, 2))
} finally {
  await browser.close()
}
