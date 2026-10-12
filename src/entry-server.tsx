import { renderToString } from "react-dom/server"
import App from "./App"

// Used by scripts/prerender.mjs at build time to put the page's HTML into
// dist/index.html, so crawlers and link previews get real content before any
// JavaScript runs. The browser then hydrates it in src/main.tsx.
export function render(): string {
  return renderToString(<App />)
}
