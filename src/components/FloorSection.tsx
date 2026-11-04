import { useEffect, useRef, useState } from 'react'

export function FloorSection() {
  const [activeStep, setActiveStep] = useState(0)
  const floorRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReduced) return

    const handleScroll = () => {
      const el = floorRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      if (total <= 0) return

      const progress = Math.min(Math.max(-rect.top / total, 0), 1)
      const step = progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2
      setActiveStep(step)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="floor" id="floor" ref={floorRef} aria-labelledby="floor-title">
      <div className="floor__sticky">
        <div className="floor__layers" aria-hidden="true">
          <figure className={`floor__layer ${activeStep === 0 ? 'is-active' : ''}`}>
            <img src="/assets/img/room-bar.jpg" width="1800" height="1199" alt="" />
          </figure>
          <figure className={`floor__layer ${activeStep === 1 ? 'is-active' : ''}`}>
            <img src="/assets/img/tapas.jpg" width="1200" height="1800" alt="" />
          </figure>
          <figure className={`floor__layer ${activeStep === 2 ? 'is-active' : ''}`}>
            <img src="/assets/img/floor-dip.jpg" width="1200" height="1800" alt="" />
          </figure>
        </div>
        <div className="floor__veil" aria-hidden="true" />

        <div className="wrap floor__inner">
          <header className="floor__head">
            <p className="eyebrow eyebrow--light">
              03 <span className="slash">/</span> The night
            </p>
            <h2 id="floor-title">
              San Francisco,
              <br />
              after dark.
            </h2>
          </header>

          <div className="floor__steps">
            <article
              className={`floor__step ${activeStep === 0 ? 'is-active' : ''}`}
              data-step="0"
              onClick={() => setActiveStep(0)}
              style={{ cursor: 'pointer' }}
            >
              <p className="floor__num">01</p>
              <h3>Cocktails</h3>
              <p>Start at the bar. A cold cocktail, a corner seat, and a room of strangers who won't stay strangers for long.</p>
            </article>
            <article
              className={`floor__step ${activeStep === 1 ? 'is-active' : ''}`}
              data-step="1"
              onClick={() => setActiveStep(1)}
              style={{ cursor: 'pointer' }}
            >
              <p className="floor__num">02</p>
              <h3>Dinner</h3>
              <p>Share plates from the kitchen while the band tunes up. Another round, another plate, nobody checking the time.</p>
            </article>
            <article
              className={`floor__step ${activeStep === 2 ? 'is-active' : ''}`}
              data-step="2"
              onClick={() => setActiveStep(2)}
              style={{ cursor: 'pointer' }}
            >
              <p className="floor__num">03</p>
              <h3>Dancing</h3>
              <p>Lessons at eight, band at ten. Salsa, son, timba — locals and first-timers, dancing until the lights come up.</p>
            </article>
          </div>

          <div className="floor__meter" aria-hidden="true">
            <span className={activeStep >= 0 ? 'is-on' : ''} />
            <span className={activeStep >= 1 ? 'is-on' : ''} />
            <span className={activeStep >= 2 ? 'is-on' : ''} />
          </div>
        </div>
      </div>
    </section>
  )
}
