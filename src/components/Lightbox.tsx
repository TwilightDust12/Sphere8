import { useEffect, useRef } from "react"
import { roleLabel, type Photo } from "../data/gallery"
import { photoSrcSet, photoUrl } from "../lib/assets"

interface LightboxProps {
  photos: Photo[]
  index: number | null
  onClose: () => void
  onIndexChange: (index: number) => void
}

export default function Lightbox({
  photos,
  index,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const touchStart = useRef<number | null>(null)
  const isOpen = index !== null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  const photo = index !== null ? photos[index] : null

  const step = (delta: number) => {
    if (index === null || photos.length < 2) return
    onIndexChange((index + delta + photos.length) % photos.length)
  }

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label="Project photo viewer"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1)
        if (event.key === "ArrowLeft") step(-1)
      }}
    >
      {photo && (
        <div className="lightbox-inner">
          <figure
            className="lightbox-figure"
            onTouchStart={(event) => {
              touchStart.current = event.touches[0].clientX
            }}
            onTouchEnd={(event) => {
              if (touchStart.current === null) return
              const dx = event.changedTouches[0].clientX - touchStart.current
              touchStart.current = null
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
            }}
          >
            <img
              src={photoUrl(photo.id)}
              srcSet={photoSrcSet(photo.id, photo.width)}
              sizes="100vw"
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
            />
            <figcaption>
              <span className="mono">{roleLabel(photo)}</span>
              <strong>{photo.title}</strong>
              {photo.location && <span>{photo.location}</span>}
            </figcaption>
          </figure>
          <div className="lightbox-bar">
            <span className="mono" aria-live="polite">
              {(index ?? 0) + 1} of {photos.length}
            </span>
            <div className="lightbox-buttons">
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => step(-1)}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => step(1)}
                  >
                    Next
                  </button>
                </>
              )}
              <button type="button" className="btn btn-red" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
