export function photoUrl(id: string, width?: number): string {
  return `${import.meta.env.BASE_URL}images/projects/${id}${width ? `-${width}` : ""}.webp`
}

export function brandUrl(name: string): string {
  return `${import.meta.env.BASE_URL}brand/${name}`
}

export function photoSrcSet(id: string, width: number): string | undefined {
  if (width <= 320) return undefined
  return [
    ...[320, 480, 800]
      .filter((size) => size < width)
      .map((size) => `${photoUrl(id, size)} ${size}w`),
    `${photoUrl(id)} ${width}w`,
  ].join(", ")
}
