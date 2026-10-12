import { steps } from "../data/company"
import { useReveal } from "../hooks/useReveal"
import { stagger } from "../lib/motion"

export default function Process() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="process" className="process" aria-labelledby="process-title">
      <div className="wrap reveal-scope" ref={ref}>
        <h2 id="process-title" className="big reveal-item" style={stagger(0)}>
          A clear <span>path forward.</span>
        </h2>
        <ol className="steps">
          {steps.map((step, index) => (
            <li
              className="step reveal-item"
              style={stagger(index + 1)}
              key={step.n}
            >
              <span className="num" aria-hidden="true">
                {step.n}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
