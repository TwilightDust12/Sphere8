import { steps } from "../data/company"
import { useReveal } from "../hooks/useReveal"

export default function Process() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="process" className="process" aria-labelledby="process-title">
      <div className="wrap reveal" ref={ref}>
        <h2 id="process-title" className="big">
          A clear <span>path forward.</span>
        </h2>
        <ol className="steps">
          {steps.map((step) => (
            <li className="step" key={step.n}>
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
