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
    [640, 800],
    [767, 1024],
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
    assert.ok(geometry.header >= 8 && geometry.header <= 16)
    assert.ok(geometry.titleTop >= geometry.headerBottom)
    assert.ok(geometry.actionBottom <= geometry.skipTop)
    assert.ok(geometry.skipBottom <= height)
    assert.ok(geometry.menuWidth >= 44 && geometry.menuHeight >= 44)
    assert.equal(await page.$eval(".site-header", header => {
      const bounds = header.getBoundingClientRect()
      return [...header.children].filter(el => getComputedStyle(el).display !== "none" && !el.classList.contains("mobile-nav"))
        .every(el => { const r = el.getBoundingClientRect(); return r.left >= bounds.left && r.right <= bounds.right && r.top >= bounds.top && r.bottom <= bounds.bottom })
    }), true, "header controls must fit inside the pill")
    assert.equal(await page.evaluate(() => Boolean(document.elementFromPoint(innerWidth / 2, 2)?.closest(".header-shell"))), true, "header backing must cover scrolling content above the pill")
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
    assert.equal(await page.$eval(".mobile-nav", el => el.getBoundingClientRect().bottom <= innerHeight), true, "open menu must fit the viewport")
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
      geometry.header,
    )
    assert.equal(await page.$eval(".tile", el => getComputedStyle(el).animationName), "none")
    assert.equal(await page.$eval(".project-constellation", el => getComputedStyle(el).display), "none")
    assert.equal(await page.$eval(".tile:nth-child(2)", el => getComputedStyle(el).paddingTop), "0px")
    if (width <= 767) {
      assert.equal(await page.$eval(".tile", el => Math.abs(el.getBoundingClientRect().width - el.parentElement.getBoundingClientRect().width) < 1), true, "phone gallery cards must fill their column")
      for (const selector of [".inquiry", ".about-layout", ".expertise-row", ".steps"]) {
        assert.equal(await page.$eval(selector, el => getComputedStyle(el).gridTemplateColumns.split(" ").length), 1, `${selector} must stack on phones`)
      }
    }
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
        geometry.header,
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
  const headerPage = await browser.newPage()
  await headerPage.setViewport({ width: 900, height: 300 })
  await headerPage.goto(base, { waitUntil: "networkidle0" })
  await headerPage.click(".menu-toggle")
  for (const width of [900, 950, 1024]) {
    await headerPage.setViewport({ width, height: 300 })
    assert.equal(await headerPage.$eval(".menu-toggle", el => el.getAttribute("aria-expanded")), "true", "menu must stay open within the mobile navigation breakpoint")
    assert.equal(await headerPage.$eval(".mobile-nav", el => el.getBoundingClientRect().bottom <= innerHeight), true, "landscape dropdown must stay inside the viewport")
    assert.equal(await headerPage.$eval(".mobile-nav", el => getComputedStyle(el).overflowY), "auto")
  }
  await headerPage.$eval('.mobile-nav a[href="#contact"]', el => el.scrollIntoView({ block: "nearest" }))
  await headerPage.click('.mobile-nav a[href="#contact"]')
  assert.equal(await headerPage.$eval(".mobile-nav", el => el.hidden), true)
  await headerPage.click(".menu-toggle")
  await headerPage.setViewport({ width: 1025, height: 700 })
  await headerPage.waitForFunction(() => document.querySelector(".mobile-nav").hidden)
  assert.equal(await headerPage.$eval(".menu-toggle", el => el.getAttribute("aria-expanded")), "false")
  await headerPage.close()
  report.push({ headerBreakpoints: "900, 950, 1024, 1025 passed", landscapeDropdown: "contained and scrollable" })
  const page = await browser.newPage()
  const requests = []
  page.on("request", (request) => requests.push(request.url()))
  await page.setViewport({ width: 390, height: 844 })
  await page.goto(base, { waitUntil: "networkidle0" })
  await page.setViewport({ width: 1440, height: 1000 })
  await page.waitForSelector('canvas[data-ready="true"]')
  await page.evaluate(() => scrollTo({ top: 1800, behavior: "instant" }))
  await page.waitForFunction(() => Number(document.querySelector("canvas").dataset.frame) > 0)
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
