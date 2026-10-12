import Arrow from "./Arrow"
import { photoSrcSet, photoUrl } from "../lib/assets"

export default function Hero() {
  return (
    <section className="hero" id="home" aria-label="Introduction">
      <div className="wrap hero-grid">
        <div className="hero-text">
          <h1>
            <span>Designed with purpose.</span>
            <em>Built with precision.</em>
          </h1>
          <p>
            Architecture, engineering and construction under one roof, from first
            drawing to final detail.
          </p>
          <div className="hero-actions">
            <a className="btn btn-dark" href="#contact">
              Start a project <Arrow diagonal />
            </a>
            <a className="btn btn-ghost" href="#projects">
              See our work
            </a>
          </div>
        </div>
        <figure className="hero-photo">
          <img
            src={photoUrl("04-04")}
            srcSet={photoSrcSet("04-04", 822)}
            width={822}
            height={715}
            fetchPriority="high"
            alt="Two-storey house with a red-brown timber roof canopy and dark glazing, seen from the street"
          />
        </figure>
      </div>
    </section>
  )
}
