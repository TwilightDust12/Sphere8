import Arrow from "./Arrow"
import { photoSrcSet, photoUrl } from "../lib/assets"

export default function Hero() {
  return (
    <section className="hero" id="home" aria-label="Introduction">
      <div className="wrap hero-grid">
        <h1>
          <span>Designed with purpose.</span> <em>Built with precision.</em>
        </h1>
        <div className="hero-lower">
          <p>
            We design, engineer and build houses, warehouses and{" "}
            <span className="nowrap">fit-outs</span>, from Lucena City to
            Laguna, Bulacan and Metro Manila.
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
            src={photoUrl("04-07")}
            srcSet={photoSrcSet("04-07", 1600)}
            sizes="(min-width: 1001px) 50vw, 100vw"
            width={1600}
            height={1200}
            fetchPriority="high"
            alt="Two-storey house at dusk with a timber-clad upper floor, a black stone ground floor and a deep roof overhang"
          />
        </figure>
      </div>
    </section>
  )
}
