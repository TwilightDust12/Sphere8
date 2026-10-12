export function photoUrl(id: string, small = false): string {
  return `${import.meta.env.BASE_URL}images/projects/${id}${
    small ? "-800" : ""
  }.webp`
}

export function brandUrl(name: string): string {
  return `${import.meta.env.BASE_URL}brand/${name}`
}

export function photoSrcSet(id: string, width: number): string | undefined {
  if (width <= 800) return undefined
  return `${photoUrl(id, true)} 800w, ${photoUrl(id)} ${width}w`
}
