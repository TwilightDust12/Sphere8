import { steps } from "../data/company"
import { useReveal } from "../hooks/useReveal"
import { stagger } from "../lib/motion"

export default function Process() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="process" className="process" aria-labelledby="process-title">
      <div className="wrap reveal-scope" ref={ref}>
        <div className="section-kicker mono">
          <span>03 / The process</span>
          <span>One connected journey.</span>
        </div>
        <h2 id="process-title" className="big reveal-item" style={stagger(0)}>
          A shared vision.
          <br />
          <span>A clear way forward.</span>
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
