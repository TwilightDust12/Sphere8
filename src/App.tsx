import { useEffect, useState } from "react"
import {
  additionalProjects,
  projects,
  type Category,
  type Project,
} from "./data/projects"

const contact = {
  emails: ["sphere8construction@gmail.com", "dedr.design@gmail.com"],
  phones: [
    ["(042) 373-3695", "+63423733695"],
    ["0920-9698592", "+639209698592"],
    ["0917-6757221", "+639176757221"],
  ],
  address: "517 Quezon Blvd., Brgy. Gulang-Gulang, Lucena City",
}
const inquiry = `mailto:${contact.emails[0]}?subject=${encodeURIComponent("Project inquiry — Sphere8")}`

const services = [
  {
    n: "01",
    title: "Construction & Development",
    text: "Turning plans into spaces with careful execution and quality workmanship.",
    items: [
      "Residential & commercial",
      "Industrial & fit-outs",
      "Land development & landscaping",
    ],
  },
  {
    n: "02",
    title: "Design & Engineering",
    text: "Purposeful architecture, backed by thoughtful technical design.",
    items: [
      "Architectural planning & consultancy",
      "Structural design & analysis",
      "Civil structural design & assessments",
    ],
  },
  {
    n: "03",
    title: "Project Management",
    text: "Keeping the moving parts of your project aligned from planning through construction.",
    items: [
      "Project planning",
      "Design & construction coordination",
      "Construction oversight",
    ],
  },
]

const steps = [
  [
    "1",
    "Plan.",
    "We start by understanding your goals, your site, and the possibilities. Then we shape a considered design.",
  ],
  [
    "2",
    "Coordinate.",
    "We connect architectural intent with engineering detail and project planning, keeping everyone aligned.",
  ],
  [
    "3",
    "Build.",
    "We bring plans to life through careful construction oversight and a focus on quality workmanship.",
  ],
]

const tickerItems = [
  "Design",
  "Engineering",
  "Construction",
  "Project management",
]

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={diagonal ? "diagonal" : ""}
    >
      <path d="M4 12h15M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}

function Brand() {
  return (
    <span className="brand">
      <span>
        SPHERE<b>8</b>
      </span>
      <small>CONSTRUCTION CORP.</small>
    </span>
  )
}

function Placeholder({
  number,
  dark = false,
  hero = false,
}: {
  number: string
  dark?: boolean
  hero?: boolean
}) {
  return (
    <div className={`ph ${dark ? "dark" : ""}`}>
      <div className="ph-label">
        <span>SP8 / {hero ? "DESIGN & BUILD" : `PROJECT ${number}`}</span>
        <span>CONCEPT STUDY</span>
      </div>
      <svg
        className="drawing"
        viewBox="0 0 640 440"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <g stroke="currentColor" strokeWidth="1">
          <path d="M70 342 348 416 575 279M104 321V175l259-95 171 74v159M104 175l168 75 262-96M272 250v128M363 80v153M104 321l168 57 262-65M127 183v122l126 53V242M292 255v106l219-62V175M148 193v121M173 204v120M199 216v116M226 228v113M315 247v107M341 237v109M368 228v111M395 218v113M423 208v115M452 197v117M482 185v120M292 283l219-71M292 312l219-67M292 340l219-63M104 217l168 74M104 260l168 70M127 305l126-45M104 175l259-95" />
          <path
            d="M60 350 353 431 600 280M67 159l292-108 205 90M82 155v174M550 149v159M363 51v-20M272 378v40"
            strokeDasharray="4 5"
            opacity=".45"
          />
        </g>
      </svg>
      <div className="ph-foot">
        <span>
          <i />
          Project photography to be added
        </span>
        <span>NTS / {number}</span>
      </div>
    </div>
  )
}

function SectionHead({
  no,
  label,
  tail,
}: {
  no: string
  label: string
  tail?: string
}) {
  return (
    <div className="sec-head mono">
      <span className="no">({no})</span>
      <span>{label}</span>
      {tail && <span className="tail">{tail}</span>}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false)
  return (
    <article className="card">
      {project.imageSrc && !failed ? (
        <img
          className="ph-img"
          src={project.imageSrc}
          alt={project.imageAlt}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <Placeholder number={project.id} />
      )}
      <div className="card-meta mono">
        <span>
          {project.id} — {project.category}
        </span>
        {project.status && <span className="tag">{project.status}</span>}
      </div>
      <h3>{project.title}</h3>
      <div className="card-foot">
        <span>{project.location}</span>
        <span>{project.discipline}</span>
      </div>
    </article>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [category, setCategory] = useState<Category | "All">("All")
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [])

  const filtered = projects.filter(
    (project) => category === "All" || project.category === category,
  )
  const count = (c: Category) =>
    projects.filter((project) => project.category === c).length

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <a href="#home" aria-label="Sphere8 home">
          <Brand />
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#projects">Projects</a>
          <a href="#approach">Approach</a>
        </nav>
        <a className="header-cta" href="#contact">
          Let’s build <Arrow diagonal />
        </a>
        <button
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
          <span aria-hidden="true">{menuOpen ? "−" : "+"}</span>
        </button>
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
          hidden={!menuOpen}
        >
          {["About", "Services", "Projects", "Approach", "Contact"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
              >
                {item}
                <Arrow diagonal />
              </a>
            ),
          )}
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="home">
          <div className="wrap">
            <div className="hero-top mono">
              <span>Architects / Engineers / Contractor</span>
              <span>Lucena City, Philippines</span>
            </div>
            <h1>
              Designed with purpose.
              <em>Built with precision.</em>
            </h1>
            <div className="hero-grid">
              <div className="hero-copy">
                <p>
                  From the first drawing to the final detail. We bring
                  architecture, engineering, and construction together to
                  create spaces that work.
                </p>
                <div className="hero-actions">
                  <a className="btn btn-dark" href="#contact">
                    Discuss your project <Arrow diagonal />
                  </a>
                  <a className="btn btn-ghost" href="#projects">
                    Explore projects <Arrow />
                  </a>
                </div>
              </div>
              <div className="hero-visual">
                <Placeholder number="00" dark hero />
              </div>
            </div>
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map(
              (item, i) => (
                <span key={i}>{item}</span>
              ),
            )}
          </div>
        </div>

        <section id="about" className="section">
          <div className="wrap">
            <SectionHead no="01" label="The company" tail="Est. 2020" />
            <div className="about-grid">
              <h2 className="big">
                Solid foundations. <span>Shared ambitions.</span>
              </h2>
              <div className="about-body">
                <p className="lead">
                  We’re Sphere8 Construction Corp. A design-and-build company
                  with a personal approach to every project.
                </p>
                <p>
                  Established and SEC-registered on January 3, 2020, we connect
                  architectural and engineering design with project management
                  and building construction. Our one-on-one approach puts your
                  vision at the center, with quality service and competitive
                  pricing.
                </p>
              </div>
              <div className="stats">
                {[
                  ["2020", "SEC-registered"],
                  ["03", "Integrated disciplines"],
                  [String(projects.length).padStart(2, "0"), "Featured projects"],
                  [
                    String(additionalProjects.length).padStart(2, "0"),
                    "More in our profile",
                  ],
                ].map(([value, label]) => (
                  <div className="stat" key={label}>
                    <strong>{value}</strong>
                    <span className="mono">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="section on-dark">
          <div className="wrap">
            <SectionHead no="02" label="What we do" tail="One connected approach" />
            <h2 className="big" style={{ marginBottom: "clamp(40px, 5vw, 80px)" }}>
              From concept <span>to construction.</span>
            </h2>
            <div className="svc-list">
              {services.map((s) => (
                <article className="svc" key={s.n}>
                  <span className="mono" style={{ color: "#f0584e", paddingTop: 8 }}>
                    {s.n}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <ul>
                    {s.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="wrap">
            <SectionHead no="03" label="Selected experience" />
            <div className="p-intro">
              <h2 className="big">
                Different scales. <span>Same detail.</span>
              </h2>
              <p>
                A selection of our design, engineering, and consultancy
                experience.
              </p>
            </div>

            <div className="filter-bar">
              <div className="filters" role="group" aria-label="Filter projects">
                <button
                  aria-pressed={category === "All"}
                  onClick={() => setCategory("All")}
                >
                  All<sup>{String(projects.length).padStart(2, "0")}</sup>
                </button>
                {(["Industrial", "Residential", "Institutional"] as const).map(
                  (item) => (
                    <button
                      key={item}
                      aria-pressed={category === item}
                      onClick={() => setCategory(item)}
                    >
                      {item}
                      <sup>{String(count(item)).padStart(2, "0")}</sup>
                    </button>
                  ),
                )}
              </div>
              <span className="mono" aria-live="polite">
                {String(filtered.length).padStart(2, "0")} projects shown
              </span>
            </div>

            <div className="p-grid">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            <p className="note">
              Roles are listed per project. Proposed projects are identified
              above; design and consultancy experience does not imply
              construction delivery.
            </p>

            <div className="more">
              <button
                aria-expanded={moreOpen}
                aria-controls="additional-projects"
                onClick={() => setMoreOpen(!moreOpen)}
              >
                <span>More project experience</span>
                <span aria-hidden="true">{moreOpen ? "−" : "+"}</span>
              </button>
              <div id="additional-projects" hidden={!moreOpen}>
                <p className="more-note">
                  Additional experience listed in our company profile. Project
                  scopes vary.
                </p>
                <ul>
                  {additionalProjects.map(([name, location]) => (
                    <li key={name}>
                      <span>{name}</span>
                      <span>{location}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="approach" className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <SectionHead no="04" label="Our approach" tail="Start to finish" />
            <h2 className="big" style={{ marginBottom: "clamp(32px, 4vw, 64px)" }}>
              A clear <span>path forward.</span>
            </h2>
            <div className="steps">
              {steps.map(([n, title, text]) => (
                <article className="step" key={n}>
                  <span className="num">{n}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section contact on-dark" style={{ paddingBottom: 0 }}>
          <div className="wrap">
            <SectionHead no="05" label="Start a conversation" />
            <h2 className="big">
              Let’s build what’s <span>next.</span>
            </h2>
            <div className="contact-grid">
              <div>
                <span className="c-label mono">Have a project in mind?</span>
                <p>
                  Tell us what you’re thinking. Let’s explore the
                  possibilities.
                </p>
                <a className="btn btn-red" href={inquiry}>
                  Start a conversation <Arrow diagonal />
                </a>
              </div>
              <div>
                <span className="c-label mono">Email & call</span>
                {contact.emails.map((email) => (
                  <a className="c-link" href={`mailto:${email}`} key={email}>
                    {email}
                  </a>
                ))}
                <div className="phones">
                  {contact.phones.map(([label, phone]) => (
                    <a className="c-link" href={`tel:${phone}`} key={phone}>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <span className="c-label mono">Visit our office</span>
                <p>{contact.address}</p>
                <a
                  className="u-link"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Find our office <Arrow diagonal />
                </a>
              </div>
            </div>
            <footer>
              <a href="#home" aria-label="Sphere8 home" style={{ color: "#f4f2ec" }}>
                <Brand />
              </a>
              <span>© {new Date().getFullYear()} Sphere8 Construction Corp.</span>
              <nav aria-label="Footer navigation">
                <a href="#about">About</a>
                <a href="#projects">Projects</a>
                <a href="#home">Back to top ↑</a>
              </nav>
            </footer>
          </div>
        </section>
      </main>
    </>
  )
}
