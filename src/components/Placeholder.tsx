export default function Placeholder({
  label = "Photo to be added",
}: {
  label?: string
}) {
  return (
    <div className="ph" role="img" aria-label={label}>
      <span className="mono">{label}</span>
    </div>
  )
}
