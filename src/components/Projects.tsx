import { useMemo, useState } from "react"
import {
  countByFilter,
  filterPhotos,
  filters,
  photos,
  roleLabel,
  type FilterKey,
  type Photo,
} from "../data/gallery"
import { experienceGroups } from "../data/experience"
import { useReveal } from "../hooks/useReveal"
import { stagger } from "../lib/motion"
import { photoSrcSet, photoUrl } from "../lib/assets"
import Lightbox from "./Lightbox"
import Placeholder from "./Placeholder"

interface TileProps {
  photo: Photo
  onOpen: () => void
}

function Tile({ photo, onOpen }: TileProps) {
  const [failed, setFailed] = useState(false)
  const hasImage = !photo.placeholder && !failed

  return (
    <figure className="tile">
      <div className="tile-media">
        {hasImage ? (
          <button
            type="button"
            className="tile-open"
            onClick={onOpen}
            aria-label={`View photo: ${photo.title}`}
          >
            <img
              className="tile-img"
              src={photoUrl(photo.id, photo.width > 800)}
              srcSet={photoSrcSet(photo.id, photo.width)}
              sizes="(min-width: 1000px) 45vw, 100vw"
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              onError={() => setFailed(true)}
            />
          </button>
        ) : (
          <Placeholder />
        )}
      </div>
      <figcaption>
        <span className="mono tile-role">
          {roleLabel(photo)}
          {photo.status && <span className="tag">{photo.status}</span>}
        </span>
        <strong>{photo.title}</strong>
        {photo.location && <span className="tile-line">{photo.location}</span>}
        {photo.discipline && (
          <span className="tile-line">{photo.discipline}</span>
        )}
        {photo.credit && <span className="tile-line">{photo.credit}</span>}
      </figcaption>
    </figure>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState<FilterKey>("all")
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [moreOpen, setMoreOpen] = useState(false)
  const ref = useReveal<HTMLDivElement>()

  const counts = useMemo(() => countByFilter(photos), [])
  const visible = useMemo(() => filterPhotos(photos, filter), [filter])
  const viewable = useMemo(
    () => visible.filter((p) => !p.placeholder),
    [visible],
  )

  return (
    <section
      id="projects"
      className="projects"
      aria-labelledby="projects-title"
    >
      <div className="wrap reveal-scope" ref={ref}>
        <h2 id="projects-title" className="big reveal-item" style={stagger(0)}>
          Different scales. <span>Same detail.</span>
        </h2>
        <p className="projects-intro reveal-item" style={stagger(1)}>
          Built, engineered and designed work from our company profile.
        </p>

        <div className="filter-bar reveal-item" style={stagger(2)}>
          <div className="filters" role="group" aria-label="Filter projects">
            {filters.map((item) => (
              <button
                key={item.key}
                type="button"
                aria-pressed={filter === item.key}
                onClick={() => setFilter(item.key)}
              >
                {item.label}
                <sup>{String(counts[item.key]).padStart(2, "0")}</sup>
              </button>
            ))}
          </div>
          <span className="mono" aria-live="polite">
            {String(visible.length).padStart(2, "0")} shown
          </span>
        </div>

        {visible.length === 0 ? (
          <p className="empty">
            No projects in this group yet. Choose another group or see all
            projects.
          </p>
        ) : (
          <div className="mosaic">
            {visible.map((photo) => (
              <Tile
                key={photo.id}
                photo={photo}
                onOpen={() =>
                  setOpenIndex(viewable.findIndex((p) => p.id === photo.id))
                }
              />
            ))}
          </div>
        )}

        <div className="more">
          <button
            type="button"
            aria-expanded={moreOpen}
            aria-controls="additional-projects"
            onClick={() => setMoreOpen(!moreOpen)}
          >
            <span>More project experience</span>
            <span aria-hidden="true">{moreOpen ? "−" : "+"}</span>
          </button>
          <div id="additional-projects" hidden={!moreOpen}>
            <p className="more-note">
              Listed in our company profile. Where another contractor or
              architect is credited, our role was design or engineering.
            </p>
            {experienceGroups.map((group) => (
              <div className="more-group" key={group.heading}>
                <h3>{group.heading}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={`${group.heading}-${item.name}`}>
                      <span>{item.name}</span>
                      <span>
                        {[item.place, item.note].filter(Boolean).join(". ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Lightbox
        photos={viewable}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
      />
    </section>
  )
}
