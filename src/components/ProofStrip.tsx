import { proof } from "../data/company"
import { useReveal } from "../hooks/useReveal"
import { stagger } from "../lib/motion"
import { photoUrl, photoSrcSet } from "../lib/assets"

export default function ProofStrip() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="wrap reveal-scope" ref={ref}>
        <div className="section-kicker mono">
          <span>04 / Our story</span>
          <span>Rooted in Lucena. Built on care.</span>
        </div>
        <div className="about-layout">
          <figure className="about-image">
            <img
              src={photoUrl("17-04")}
              srcSet={photoSrcSet("17-04", 1004)}
              sizes="(max-width: 600px) 100vw, 45vw"
              alt="Steel roof structure during construction"
              loading="lazy"
              width={1004}
              height={750}
            />
            <figcaption className="mono">
              The thinking behind every structure.
            </figcaption>
          </figure>
          <div className="about-copy">
            <h2 id="about-title" className="big reveal-item" style={stagger(0)}>
              Good buildings.
              <br />
              <span>Better together.</span>
            </h2>
            <p className="lead reveal-item" style={stagger(1)}>
              We are Sphere8 Construction Corp., a design-and-build company in
              Lucena City. Our one-on-one approach keeps your vision at the
              center of every project.
            </p>
            <p className="about-detail">
              From Lucena City to Laguna, Bulacan and Metro Manila, we bring
              architecture, engineering and construction together. A personal
              approach, with attention to the details that matter to you.
            </p>
            <a className="u-link" href="#contact">
              Get to know your project team <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <ul className="proof">
          {proof.map((item, index) => (
            <li
              className="proof-cell reveal-item"
              style={stagger(index + 2)}
              key={item.value}
            >
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
