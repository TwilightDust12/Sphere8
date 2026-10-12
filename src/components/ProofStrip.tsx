import { proof } from "../data/company"
import { useReveal } from "../hooks/useReveal"
import { stagger } from "../lib/motion"

export default function ProofStrip() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="wrap reveal-scope" ref={ref}>
        <h2 id="about-title" className="big reveal-item" style={stagger(0)}>
          Solid foundations. <span>Shared ambitions.</span>
        </h2>
        <p className="lead reveal-item" style={stagger(1)}>
          We are Sphere8 Construction Corp., a design-and-build company with a
          personal approach to every project.
        </p>
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
