import { useEffect, useRef } from "react"
import { storyFrame, type SequenceManifest } from "../lib/story"

export default function StoryCanvas({
  progress,
  staticMode,
  manifest,
  mobile,
}: {
  progress: number
  staticMode: boolean
  manifest: SequenceManifest | null
  mobile: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<(frame: number) => void>(() => {})
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !manifest || staticMode) return
    const context = canvas.getContext("2d")
    if (!context) return
    const cache = new Map<number, ImageBitmap>()
    const pending = new Map<number, AbortController>()
    const attempts = new Map<number, number>()
    let desired = 0
    let stopped = false
    const draw = () => {
      const bitmap = cache.get(desired)
      if (!bitmap || stopped) return
      const box = canvas.getBoundingClientRect()
      const dpr = Math.min(devicePixelRatio || 1, 2)
      canvas.width = Math.round(box.width * dpr)
      canvas.height = Math.round(box.height * dpr)
      const scale = Math.min(
        canvas.width / bitmap.width,
        canvas.height / bitmap.height,
      )
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = "high"
      context.drawImage(
        bitmap,
        (canvas.width - bitmap.width * scale) / 2,
        mobile ? 0 : (canvas.height - bitmap.height * scale) / 2,
        bitmap.width * scale,
        bitmap.height * scale,
      )
      canvas.dataset.ready = "true"
      canvas.dataset.frame = String(desired)
    }
    const pump = () => {
      if (stopped) return
      const targets = [desired]
      for (let delta = 1; delta <= (desired === 0 ? 0 : 6); delta++)
        targets.push(desired + delta, desired - delta)
      for (const frame of targets) {
        if (pending.size >= 3) break
        if (
          frame < 0 ||
          frame >= manifest.frameCount ||
          cache.has(frame) ||
          pending.has(frame) ||
          (attempts.get(frame) ?? 0) >= 2
        )
          continue
        const controller = new AbortController()
        pending.set(frame, controller)
        attempts.set(frame, (attempts.get(frame) ?? 0) + 1)
        const url =
          import.meta.env.BASE_URL +
          (frame === 0
            ? manifest.poster
            : manifest.pattern.replace("{frame}", String(frame).padStart(4, "0")))
        fetch(url, {
          signal: controller.signal,
          priority: frame === desired ? "high" : "low",
        })
          .then((response) => {
            if (!response.ok) throw new Error("Frame unavailable")
            return response.blob()
          })
          .then((blob) => createImageBitmap(blob))
          .then((bitmap) => {
            if (
              stopped ||
              controller.signal.aborted ||
              Math.abs(frame - desired) > 24
            ) {
              bitmap.close()
              attempts.delete(frame)
              return
            }
            cache.set(frame, bitmap)
            while (cache.size > 24) {
              const furthest = [...cache.keys()].sort(
                (a, b) => Math.abs(b - desired) - Math.abs(a - desired),
              )[0]
              cache.get(furthest)?.close()
              cache.delete(furthest)
              attempts.delete(furthest)
            }
            if (frame === desired) draw()
          })
          .catch(() => {
            /* Keep the poster or last good frame. */
          })
          .finally(() => {
            pending.delete(frame)
            pump()
          })
      }
    }
    requestRef.current = (frame) => {
      desired = frame
      for (const [index, controller] of pending) {
        if (Math.abs(index - desired) > 24) {
          controller.abort()
          attempts.delete(index)
        }
      }
      draw()
      pump()
    }
    const observer = new ResizeObserver(draw)
    observer.observe(canvas)
    requestRef.current(0)
    return () => {
      stopped = true
      observer.disconnect()
      pending.forEach((controller) => controller.abort())
      cache.forEach((bitmap) => bitmap.close())
      requestRef.current = () => {}
      delete canvas.dataset.ready
      delete canvas.dataset.frame
    }
  }, [staticMode, manifest, mobile])
  useEffect(() => {
    if (manifest)
      requestRef.current(storyFrame(progress, manifest.frameCount, mobile))
  }, [progress, staticMode, manifest, mobile])
  return (
    <div className="story-visual has-sequence">
      <picture>
        <source
          media="(max-width: 900px)"
          type="image/avif"
          srcSet={import.meta.env.BASE_URL + "story/mobile/poster.avif"}
          width={1080}
          height={1920}
        />
        <source
          media="(max-width: 900px)"
          srcSet={import.meta.env.BASE_URL + "story/mobile/poster.webp"}
          width={1080}
          height={1920}
        />
        <img
          className="story-poster"
          src={import.meta.env.BASE_URL + "story/poster.webp"}
          alt="An architectural illustration of a contemporary house taking shape"
          width={1280}
          height={720}
          fetchPriority="high"
        />
      </picture>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
