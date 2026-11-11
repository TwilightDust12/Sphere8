import { useEffect, useRef, useState } from "react"
import Arrow from "./Arrow"
import { brandUrl } from "../lib/assets"
import Brand from "./Brand"

const links = [
  ["Our work", "#projects"],
  ["Expertise", "#services"],
  ["Our story", "#about"],
] as const

export default function Header() {
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLElement>(null)
  openRef.current = open

  useEffect(() => {
    if (open) navRef.current?.querySelector<HTMLAnchorElement>("a")?.focus()
  }, [open])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openRef.current) {
        setOpen(false)
        toggleRef.current?.focus()
      }
      if (event.key === "Tab" && openRef.current) {
        const items = navRef.current?.querySelectorAll<HTMLAnchorElement>("a")
        const first = items?.[0]
        const last = items?.[items.length - 1]
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          toggleRef.current?.focus()
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          toggleRef.current?.focus()
        } else if (document.activeElement === toggleRef.current) {
          event.preventDefault()
          ;(event.shiftKey ? last : first)?.focus()
        }
      }
    }
    window.addEventListener("keydown", onKey)
    const desktop = matchMedia("(min-width: 1025px)")
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false)
    }
    desktop.addEventListener("change", closeOnDesktop)
    return () => {
      window.removeEventListener("keydown", onKey)
      desktop.removeEventListener("change", closeOnDesktop)
    }
  }, [])

  return (
    <div className="header-shell">
      <header className="site-header">
        <a className="brand-link" href="#home" aria-label="Sphere8 home">
          <img
            className="brand-mark"
            src={brandUrl("mark-black.webp")}
            width={80}
            height={93}
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
          ref={toggleRef}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          <span
            className={`menu-icon${open ? " is-open" : ""}`}
            aria-hidden="true"
          >
            <i />
            <i />
          </span>
        </button>
        <nav
          id="mobile-navigation"
          ref={navRef}
          className="mobile-nav"
          aria-label="Mobile navigation"
          hidden={!open}
        >
          {[...links, ["Start a project", "#contact"] as const].map(
            ([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => {
                  setOpen(false)
                  const destination = document.querySelector<HTMLElement>(href)
                  destination?.setAttribute("tabindex", "-1")
                  destination?.focus({ preventScroll: true })
                }}
              >
                {label}
                <Arrow diagonal />
              </a>
            ),
          )}
        </nav>
      </header>
    </div>
  )
}
