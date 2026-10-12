import { company } from "../data/company"
import { brandUrl } from "../lib/assets"

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-row">
        <a href="#home" aria-label="Sphere8 home">
          <img
            className="footer-logo"
            src={brandUrl("logo-white.png")}
            width={90}
            height={88}
            alt="Sphere8 Construction Corp."
          />
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
