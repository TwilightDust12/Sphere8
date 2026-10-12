import { useEffect, useState } from "react"
import Arrow from "./Arrow"
import { brandUrl } from "../lib/assets"
import Brand from "./Brand"

const links = [
  ["About", "#about"],
  ["Services", "#services"],
  ["Projects", "#projects"],
  ["Process", "#process"],
] as const

export default function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <header className="site-header">
      <a className="brand-link" href="#home" aria-label="Sphere8 home">
        <img
          className="brand-mark"
          src={brandUrl("mark-white.png")}
          width={29}
          height={36}
          alt=""
        />
        <Brand />
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <a className="header-cta" href="#contact">
        Start a project <Arrow diagonal />
      </a>
      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {[...links, ["Start a project", "#contact"] as const].map(
          ([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
              <Arrow diagonal />
            </a>
          ),
        )}
      </nav>
    </header>
  )
}
