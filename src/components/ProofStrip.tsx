import { proof } from "../data/company"
import { useReveal } from "../hooks/useReveal"

export default function ProofStrip() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="wrap reveal" ref={ref}>
        <h2 id="about-title" className="big">
          Solid foundations. <span>Shared ambitions.</span>
        </h2>
        <p className="lead">
          We are Sphere8 Construction Corp., a design-and-build company with a
          personal approach to every project.
        </p>
        <ul className="proof">
          {proof.map((item) => (
            <li className="proof-cell" key={item.value}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
