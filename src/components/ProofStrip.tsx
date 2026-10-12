import { proof } from "../data/company"
import { useReveal } from "../hooks/useReveal"
import { stagger } from "../lib/motion"

export default function ProofStrip() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="wrap reveal-scope" ref={ref}>
        <h2 id="about-title" className="big reveal-item" style={stagger(0)}>
          Based in Lucena. <span>Working across the region.</span>
        </h2>
        <p className="lead reveal-item" style={stagger(1)}>
          We are Sphere8 Construction Corp., a design-and-build company in
          Lucena City. Our one-on-one approach keeps your vision at the center
          of every project.
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
