import { services } from "../data/company"
import { useReveal } from "../hooks/useReveal"
import { stagger } from "../lib/motion"
import { photoSrcSet, photoUrl } from "../lib/assets"
import Arrow from "./Arrow"

export default function Services() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section
      id="services"
      className="services"
      aria-labelledby="services-title"
    >
      <div className="wrap reveal-scope" ref={ref}>
        <div className="section-kicker mono">
          <span>02 / Our expertise</span>
          <span>From the ground up.</span>
        </div>
        <div className="section-heading">
          <h2
            id="services-title"
            className="big reveal-item"
            style={stagger(0)}
          >
            Every part.
            <br />
            <span>One considered whole.</span>
          </h2>
          <p>
            Design gives it purpose. Engineering gives it strength. Construction
            brings it to life.
          </p>
        </div>
        <div className="expertise-list">
          {services.map((service, index) => (
            <article
              className="expertise-row reveal-item"
              style={stagger(index + 1)}
              key={service.n}
            >
              <div className="expertise-copy">
                <span className="expertise-number mono">/ {service.n}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <ul>
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a className="u-link" href="#contact">
                  Let’s talk about your project <Arrow diagonal />
                </a>
              </div>
              <figure>
                <img
                  src={photoUrl(service.photo)}
                  srcSet={photoSrcSet(service.photo, service.photoWidth)}
                  sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1408px) 42vw, 600px"
                  alt={service.photoAlt}
                  loading="lazy"
                />
                <figcaption className="mono">
                  Sphere8 / {service.title}
                </figcaption>
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
