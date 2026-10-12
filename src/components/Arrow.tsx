export default function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={diagonal ? "diagonal" : ""}
    >
      <path
        d="M4 12h15M12 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  )
}
