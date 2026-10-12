import { useState } from "react"
import { services } from "../data/company"
import { useReveal } from "../hooks/useReveal"
import { stagger } from "../lib/motion"
import { photoSrcSet, photoUrl } from "../lib/assets"

export default function Services() {
  const [active, setActive] = useState(0)
  const ref = useReveal<HTMLDivElement>()

  return (
    <section
      id="services"
      className="services on-dark"
      aria-labelledby="services-title"
    >
      <div className="wrap reveal-scope" ref={ref}>
        <h2 id="services-title" className="big reveal-item" style={stagger(0)}>
          From concept <span>to construction.</span>
        </h2>
        <div className="svc-layout">
          <ul className="svc-list">
            {services.map((service, index) => (
              <li
                key={service.n}
                style={stagger(index + 1)}
                className={`svc reveal-item${
                  active === index ? " is-active" : ""
                }`}
                onMouseEnter={() => setActive(index)}
                onFocusCapture={() => setActive(index)}
              >
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <ul className="svc-items">
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <img
                  className="svc-thumb"
                  src={photoUrl(service.photo)}
                  srcSet={photoSrcSet(service.photo, service.photoWidth)}
                  sizes="(min-width: 1001px) 40vw, 100vw"
                  alt={service.photoAlt}
                  loading="lazy"
                />
                <a
                  className="u-link"
                  href="#projects"
                  aria-label={`${service.title}: see related work`}
                >
                  See related work
                </a>
              </li>
            ))}
          </ul>
          <div className="svc-preview" aria-hidden="true">
            {services.map((service, index) => (
              <img
                key={service.n}
                className={active === index ? "is-active" : ""}
                src={photoUrl(service.photo)}
                srcSet={photoSrcSet(service.photo, service.photoWidth)}
                sizes="38vw"
                alt=""
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
