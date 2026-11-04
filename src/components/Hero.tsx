import { useEffect, useState } from 'react'

interface HeroProps {
  onNavigate: (path: string, hash?: string) => void
}

export function Hero({ onNavigate }: HeroProps) {
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReduced) return

    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset
      setOffsetY(Math.min(y * 0.08, 120))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__media" aria-hidden="true">
        <img
          src="/assets/img/hero-dance.jpg"
          width="1800"
          height="1200"
          alt=""
          style={{ transform: `translate3d(0, ${offsetY}px, 0) scale(1.02)` }}
          fetchPriority="high"
        />
      </div>
      <div className="hero__veil" aria-hidden="true" />

      <div className="hero__inner wrap">
        <p className="eyebrow eyebrow--light">
          Salsa <span className="dot">·</span> Bachata <span className="dot">·</span> Live Music <span className="dot">·</span> Food & Cocktails 
        </p>
        <h1 className="hero__title" id="hero-title">
          <span>Cigar</span>
          <span>
            Bar<span className="hero__stop">.</span>
          </span>
        </h1>
        <div className="hero__row">
          <p className="hero__lede">
            Join us at 850 Montgomery Street for Latin American inspired food, cocktails, live music and some salsa or bachata dancing.
          </p>
          <div className="hero__actions">
            <a
              className="btn btn--solid"
              href="#book"
              onClick={(e) => {
                e.preventDefault()
                onNavigate('/', '#book')
              }}
            >
              Join VIP List
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
            <a
              className="btn btn--line"
              href="/calendar"
              onClick={(e) => {
                e.preventDefault()
                onNavigate('/calendar')
              }}
            >
              See the calendar
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
