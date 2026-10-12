import { company } from "../data/company"
import Brand from "./Brand"

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-row">
        <a href="#home" aria-label="Sphere8 home">
          <Brand />
        </a>
        <span>
          © {new Date().getFullYear()} {company.name}
        </span>
        <nav aria-label="Footer navigation">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          {company.socials.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.label}
            </a>
          ))}
          <a href="#home">Back to top</a>
        </nav>
      </div>
    </footer>
  )
}
