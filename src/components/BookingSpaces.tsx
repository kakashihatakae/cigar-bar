import { useEffect, useRef, useState } from 'react'
import { BOOKING_SPACES } from '../data/spaces'

interface BookingSpacesProps {
  onNavigate: (path: string, hash?: string) => void
}

export function BookingSpaces({ onNavigate }: BookingSpacesProps) {
  const [openTileId, setOpenTileId] = useState<string | null>(null)
  const [dismissedTileIds, setDismissedTileIds] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenTileId(null)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenTileId(null)
      }
    }

    document.addEventListener('pointerdown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const toggleTile = (id: string) => {
    if (openTileId === id) {
      setOpenTileId(null)
      setDismissedTileIds((prev) => new Set(prev).add(id))
    } else {
      setOpenTileId(id)
      setDismissedTileIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const closeTile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setOpenTileId(null)
    setDismissedTileIds((prev) => new Set(prev).add(id))
  }

  const handlePointerEnter = (id: string) => {
    setDismissedTileIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  return (
    <section className="section booking" id="book" aria-labelledby="book-title">
      <div className="wrap" ref={containerRef}>
        <div className="section-head reveal is-in">
          <p className="eyebrow">
            01 <span className="slash">/</span> Book
          </p>
          <h2 id="book-title">
            Celebrate with us
          </h2>
          <p className="section-lede">
            Plan a birthday, wedding celebration, or company gathering in one of our five event spaces. Choose an intimate dinner setting or a hall for a larger reception.
          </p>
        </div>

        <div className="booking__grid">
          {BOOKING_SPACES.map((space) => {
            const isOpen = openTileId === space.id
            const isDismissed = dismissedTileIds.has(space.id)

            return (
              <article
                key={space.id}
                className={`book-tile ${space.modifier} reveal is-in ${isOpen ? 'is-open' : ''} ${
                  isDismissed ? 'is-dismissed' : ''
                }`}
                onPointerEnter={() => handlePointerEnter(space.id)}
              >
                <button
                  className="book-tile__trigger"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={space.id}
                  aria-label={`${isOpen ? 'Hide' : 'Show'} details for ${space.title}`}
                  onClick={() => toggleTile(space.id)}
                >
                  <img
                    src={space.image.src}
                    width={space.image.width}
                    height={space.image.height}
                    alt={space.image.alt}
                    loading="lazy"
                  />
                  <span className="book-tile__shade" aria-hidden="true" />
                  <span className="book-tile__caption">
                    <span className="book-tile__index">{space.index}</span>
                    <span className="book-tile__captionText">
                      <span className="book-tile__title">{space.title}</span>
                      <span className="book-tile__capacity">{space.capacity}</span>
                    </span>
                    <span className="book-tile__cue" aria-hidden="true">
                      +
                    </span>
                  </span>
                </button>

                <div className="book-tile__detail" id={space.id}>
                  <button
                    className="book-tile__close"
                    type="button"
                    aria-label="Close details"
                    onClick={(e) => closeTile(space.id, e)}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                  <p className="book-tile__kicker">{space.kicker}</p>
                  <h3>{space.title}</h3>
                  <p className="book-tile__desc">{space.desc}</p>
                  <dl className="book-tile__meta">
                    <div>
                      <dt>Capacity</dt>
                      <dd>{space.capacity.replace(' guests', '')}</dd>
                    </div>
                    <div>
                      <dt>Best for</dt>
                      <dd>{space.bestFor}</dd>
                    </div>
                  </dl>
                  {space.ctaHref.startsWith('#') ? (
                    <a
                      className="btn btn--solid book-tile__cta"
                      href={space.ctaHref}
                      onClick={(e) => {
                        e.preventDefault()
                        onNavigate('/', space.ctaHref)
                      }}
                    >
                      {space.ctaText}
                      <svg
                        viewBox="0 0 24 24"
                        className="od-icon arrow"
                        style={{ ['--od-icon-size' as string]: '16px' }}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </a>
                  ) : (
                    <a className="btn btn--solid book-tile__cta" href={space.ctaHref}>
                      {space.ctaText}
                      <svg
                        viewBox="0 0 24 24"
                        className="od-icon arrow"
                        style={{ ['--od-icon-size' as string]: '16px' }}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </a>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
