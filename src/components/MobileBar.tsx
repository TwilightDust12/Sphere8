import { company } from "../data/company"
import Arrow from "./Arrow"

export default function MobileBar() {
  return (
    <div className="mobile-bar" role="region" aria-label="Contact shortcuts">
      <a className="btn btn-ghost" href={company.phones[0].href}>
        Call us
      </a>
      <a className="btn btn-red" href="#contact">
        Start a project <Arrow diagonal />
      </a>
    </div>
  )
}
