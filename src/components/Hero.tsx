import { useRef } from "react"
import { chapters, sequence, mobileSequence } from "../data/story"
import { storyChapter } from "../lib/story"
import { useStoryProgress } from "../hooks/useStoryProgress"
import StoryCanvas from "./StoryCanvas"
import Arrow from "./Arrow"

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { progress, staticMode: prefersStatic, mobile } = useStoryProgress(ref)
  const manifest = mobile === null ? null : mobile ? mobileSequence : sequence
  const staticMode = prefersStatic || !manifest
  const active = staticMode ? 0 : storyChapter(progress)
  const chapter = chapters[active]
  return (
    <section
      ref={ref}
      id="home"
      className={`cinema${staticMode ? " is-static" : " is-animated"}`}
      aria-label="From possibility to home"
    >
      <div className="cinema-stage">
        <div className="hero-overline mono">
          <span>
            <i /> Architects. Engineers. Builders.
          </span>
          <span>Lucena City, Philippines</span>
        </div>
        <div className="cinema-composition">
          <div className={`story-copy chapter-${active}`} key={active}>
            <p className="eyebrow mono">
              <span>0{active + 1}</span> / {chapter.label}
            </p>
            <h1>
              {active === 0 ? (
                <>
                  <span className="desktop-story-title">
                    Every home begins with a <em>possibility.</em>
                  </span>
                  <span className="mobile-story-title">
                    Imagine <em>coming home.</em>
                  </span>
                </>
              ) : (
                chapter.title
              )}
            </h1>
            <p className="story-description">{chapter.text}</p>
            <a
              className="btn btn-dark"
              href={active === 3 ? "#projects" : "#contact"}
            >
              {active === 3 ? "Explore our work" : "Start your project"}
              <Arrow diagonal />
            </a>
          </div>
          <StoryCanvas
            progress={progress}
            staticMode={staticMode}
            manifest={manifest}
            mobile={mobile === true}
          />
        </div>
        <div className="story-bottom">
          <a href="#projects" className="story-scroll">
            <span className="scroll-circle">↓</span>
            <span className="mono">
              {staticMode ? "Discover what we build" : "Skip to our work"}
            </span>
          </a>
          <div className="story-rail" aria-label="From vision to reality">
            {["Imagine", "Design", "Build", "Belong"].map((label, index) => (
              <span key={label} className={index <= active ? "is-active" : ""}>
                <i />
                {label}
              </span>
            ))}
          </div>
          <span className="mono story-note">
            {sequence
              ? "An illustration of our process"
              : "From the first line to the final light."}
          </span>
        </div>
      </div>
      {staticMode && (
        <div className="static-chapters wrap">
          {chapters.slice(1).map((item, index) => (
            <article key={item.label}>
              <picture>
                <source
                  media="(max-width: 900px)"
                  srcSet={
                    index === 2
                      ? import.meta.env.BASE_URL + "story/mobile/finished.webp"
                      : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E"
                  }
                />
                <img
                  src={import.meta.env.BASE_URL + `story/still-${index}.webp`}
                  width={1280}
                  height={720}
                  loading="lazy"
                  alt={
                    [
                      "The illustrated house with its structural frame taking shape",
                      "The illustrated house with walls, glazing and material finishes",
                      "The completed illustrative home with planting and warm interior lighting",
                    ][index]
                  }
                />
              </picture>
              <p className="eyebrow mono">{item.label}</p>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              {index === 2 && (
                <a className="btn btn-dark" href="#contact">
                  Start your project <Arrow diagonal />
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
