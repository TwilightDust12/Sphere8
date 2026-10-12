import type { CSSProperties } from "react"

/** Sets the --i index that the CSS uses to stagger .reveal-item children. */
export function stagger(index: number): CSSProperties {
  return { "--i": index } as CSSProperties
}
