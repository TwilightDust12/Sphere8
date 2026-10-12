import { team } from "../data/company"
import { useReveal } from "../hooks/useReveal"

export default function Team() {
  const ref = useReveal<HTMLDivElement>()
  if (!team.visible) return null
  return (
    <section id="team" className="team" aria-labelledby="team-title">
      <div className="wrap reveal" ref={ref}>
        <h2 id="team-title" className="team-title">
          The people behind the work
        </h2>
        <ul className="team-row">
          {team.members.map((member) => (
            <li key={member.name}>
              <strong>{member.name}</strong>
              <span>{member.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
