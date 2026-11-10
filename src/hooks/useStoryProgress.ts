import { useEffect, useState, type RefObject } from "react"
import { clampProgress } from "../lib/story"

export function useStoryProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)
  const [staticMode, setStaticMode] = useState(true)
  const [mobile, setMobile] = useState<boolean | null>(null)
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    const shortScreen = matchMedia("(max-height: 600px)")
    const portraitLayout = matchMedia("(max-width: 900px)")
    const connection = (navigator as Navigator & {
      connection?: EventTarget & { saveData?: boolean }
    }).connection
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const stage = el.firstElementChild as HTMLElement | null
      const header =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header",
          ),
        ) || 0
      const distance =
        el.offsetHeight - (stage?.offsetHeight ?? window.innerHeight)
      setProgress(
        clampProgress(
          (header - el.getBoundingClientRect().top) / Math.max(1, distance),
        ),
      )
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const preferences = () => {
      setMobile(portraitLayout.matches)
      setStaticMode(
        reduced.matches || shortScreen.matches || Boolean(connection?.saveData),
      )
      schedule()
    }
    preferences()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    reduced.addEventListener("change", preferences)
    shortScreen.addEventListener("change", preferences)
    portraitLayout.addEventListener("change", preferences)
    connection?.addEventListener("change", preferences)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      reduced.removeEventListener("change", preferences)
      shortScreen.removeEventListener("change", preferences)
      portraitLayout.removeEventListener("change", preferences)
      connection?.removeEventListener("change", preferences)
    }
  }, [ref])
  return { progress, staticMode, mobile }
}
