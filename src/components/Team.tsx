import { team } from "../data/company"
import { useReveal } from "../hooks/useReveal"
import { stagger } from "../lib/motion"

export default function Team() {
  const ref = useReveal<HTMLDivElement>()
  if (!team.visible) return null
  return (
    <section id="team" className="team" aria-labelledby="team-title">
      <div className="wrap reveal-scope" ref={ref}>
        <h2
          id="team-title"
          className="team-title reveal-item"
          style={stagger(0)}
        >
          The people behind the work
        </h2>
        <ul className="team-row">
          {team.members.map((member, index) => (
            <li
              className="reveal-item"
              style={stagger(index + 1)}
              key={member.name}
            >
              <strong>{member.name}</strong>
              <span>{member.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
