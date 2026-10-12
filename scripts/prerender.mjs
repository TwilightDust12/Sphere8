// Puts the rendered page into dist/index.html.
//
// Runs after `vite build` and `vite build --ssr src/entry-server.tsx`
// (see the "build" script in package.json). Without this step the served HTML
// is an empty <div id="root"> and everything depends on JavaScript running.
import { readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"

const root = path.resolve(import.meta.dirname, "..")
const htmlPath = path.join(root, "dist", "index.html")
const serverDir = path.join(root, "dist-ssr")
const marker = '<div id="root"></div>'

const { render } = await import(
  pathToFileURL(path.join(serverDir, "entry-server.js")).href
)

const template = await readFile(htmlPath, "utf8")
if (!template.includes(marker)) {
  throw new Error(`prerender: ${marker} not found in dist/index.html`)
}

// A replacer function keeps "$" sequences in the markup from being treated
// as replacement patterns.
const page = template.replace(marker, () => `<div id="root">${render()}</div>`)
await writeFile(htmlPath, page)
await rm(serverDir, { recursive: true, force: true })

console.log(
  `prerender: wrote ${render().length} characters of markup to dist/index.html`,
)
