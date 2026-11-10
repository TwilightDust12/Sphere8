export function clampProgress(value: number): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0
}

export function storyFrame(
  progress: number,
  frameCount: number,
  mobile = false,
): number {
  const p = clampProgress(progress)
  const beats = mobile
    ? [
        [0, 0],
        [0.06, 0],
        [0.26, 0.25],
        [0.66, 0.75],
        [0.88, 1],
        [1, 1],
      ]
    : [
        [0, 0],
        [0.12, 0],
        [0.25, 0.2],
        [0.625, 0.7],
        [0.875, 1],
        [1, 1],
      ]
  for (let i = 1; i < beats.length; i++) {
    const [end, frameEnd] = beats[i]
    const [start, frameStart] = beats[i - 1]
    if (p <= end)
      return Math.round(
        (frameStart + ((frameEnd - frameStart) * (p - start)) / (end - start)) *
          Math.max(0, frameCount - 1),
      )
  }
  return Math.max(0, frameCount - 1)
}

export function storyChapter(progress: number): 0 | 1 | 2 | 3 {
  const p = clampProgress(progress)
  return p < 0.25 ? 0 : p < 0.625 ? 1 : p < 0.875 ? 2 : 3
}

export interface SequenceManifest {
  frameCount: number
  width: number
  height: number
  fps: number
  pattern: string
  poster: string
}
