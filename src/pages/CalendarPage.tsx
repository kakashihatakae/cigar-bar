import { useEffect, useMemo, useState } from 'react'
import {
  resolveEvents,
  downloadIcs,
  fmtClock,
  pad2,
  MONTH_FMT,
  DOW_FMT,
  MON_FMT,
} from '../data/events'
import type { ResolvedCalendarEvent } from '../types'

interface CalendarPageProps {
  onNavigate: (path: string, hash?: string) => void
}

export function CalendarPage({ onNavigate }: CalendarPageProps) {
  const [downloadNotice, setDownloadNotice] = useState('')
  const [activeIcsId, setActiveIcsId] = useState<string | null>(null)

  useEffect(() => {
    document.body.classList.add('cbg-theme')
    return () => {
      document.body.classList.remove('cbg-theme')
    }
  }, [])

  const events = useMemo(() => resolveEvents(), [])

  // Group events by YYYY-M
  const groupedEvents = useMemo(() => {
    const groups = new Map<string, { label: string; items: ResolvedCalendarEvent[] }>()
    events.forEach((ev) => {
      const key = `${ev.startDate.getFullYear()}-${ev.startDate.getMonth()}`
      if (!groups.has(key)) {
        groups.set(key, {
          label: MONTH_FMT.format(ev.startDate),
          items: [],
        })
      }
      groups.get(key)!.items.push(ev)
    })
    return Array.from(groups.entries())
  }, [events])

  const handleDownloadIcs = (ev: ResolvedCalendarEvent) => {
    downloadIcs(ev)
    setActiveIcsId(ev.id)
    setDownloadNotice(`Downloaded ${ev.title}. Open the file to add it to your calendar.`)

    window.setTimeout(() => {
      setActiveIcsId((prev) => (prev === ev.id ? null : prev))
    }, 3000)

    window.setTimeout(() => {
      setDownloadNotice('')
    }, 5000)
  }

  const nextEvent = events.length > 0 ? events[0] : null

  return (
    <main id="main" tabIndex={-1}>
      <section className="cal-hero" aria-labelledby="calendar-title">
        <img
          className="cal-hero__media"
          src="/assets/img/gallery-live.jpg"
          width="1800"
          height="1199"
          alt=""
          fetchPriority="high"
        />
        <div className="cal-hero__veil" aria-hidden="true" />
        <div className="wrap cal-hero__inner">
          <p className="cal-hero__eyebrow">
            Cigar Bar <span className="dot">·</span> Entertainment
          </p>
          <h1 id="calendar-title">Calendar</h1>
          <p className="cal-hero__sub">Every date, soonest first.</p>
        </div>
      </section>

      <section className="calendar-page" aria-label="Event list">
        <div className="wrap">
          <div className="calendar-page__head reveal is-in">
            <div className="calendar-page__top">
              <p className="calendar-page__lede">
                Classes, bands, DJs, and the occasional long table. The next night out sits at the top of the list — add
                it to your calendar, or start a table request with the date already filled in.
              </p>
              <a
                className="calendar-page__back"
                href="/"
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate('/')
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="od-icon"
                  style={{ ['--od-icon-size' as string]: '15px' }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
                Back to Cigar Bar
              </a>
            </div>
          </div>

          <div className="cal">
            <div className="cal__bar">
              <p className="cal__count" id="calCount">
                {events.length} upcoming events <span className="dot">·</span> next up{' '}
                {nextEvent ? (
                  <strong>
                    {DOW_FMT.format(nextEvent.startDate)} {MON_FMT.format(nextEvent.startDate)}{' '}
                    {nextEvent.startDate.getDate()}
                  </strong>
                ) : null}
              </p>
              <p className="cal__note">
                Sample programme <span className="dot">·</span> times local <span className="dot">·</span> doors one
                hour before
              </p>
            </div>

            <div className="cal__months" id="calList">
              {groupedEvents.map(([key, group], groupIdx) => (
                <section key={key} className="cal-month" aria-labelledby={`cal-month-${key}`}>
                  <h3 className="cal-month__label" id={`cal-month-${key}`}>
                    {group.label}
                  </h3>
                  <ol className="cal-list">
                    {group.items.map((ev, itemIdx) => {
                      const isNext = groupIdx === 0 && itemIdx === 0
                      const isIcsSaved = activeIcsId === ev.id

                      return (
                        <li key={ev.id} className={`cal-item ${isNext ? 'is-next' : ''}`}>
                          <time className="cal-date" dateTime={ev.isoDay}>
                            <span className="cal-date__dow">{DOW_FMT.format(ev.startDate)}</span>
                            <span className="cal-date__day">{pad2(ev.startDate.getDate())}</span>
                            <span className="cal-date__mon">{MON_FMT.format(ev.startDate)}</span>
                          </time>
                          <div className="cal-item__media">
                            <img
                              className="cal-item__image"
                              src={ev.image.src}
                              width={ev.image.width}
                              height={ev.image.height}
                              alt={ev.image.alt}
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <div className="cal-item__body">
                            <div className="cal-item__tags">
                              {isNext ? <span className="cal-badge">Next up</span> : null}
                              <span className="cal-tag">{ev.type}</span>
                            </div>
                            <h4 className="cal-item__title">{ev.title}</h4>
                            <p className="cal-item__desc">{ev.desc}</p>
                            <p className="cal-item__meta">
                              <span className="od-nowrap">
                                {fmtClock(ev.startDate)}–{fmtClock(ev.endDate)}
                              </span>
                              <span className="dot" aria-hidden="true">
                                ·
                              </span>
                              <span>{ev.room}</span>
                            </p>
                          </div>
                          <div className="cal-item__actions">
                            <span className="cal-item__cover od-nowrap">{ev.cover}</span>
                            <a
                              className="cal-link cal-book"
                              href={ev.reserveHref}
                              onClick={(e) => {
                                e.preventDefault()
                                onNavigate(
                                  `/?date=${ev.isoDay}${ev.bookSlot ? `&time=${encodeURIComponent(ev.bookSlot)}` : ''}`,
                                  '#visit'
                                )
                              }}
                            >
                              Reserve
                              <svg
                                viewBox="0 0 24 24"
                                className="od-icon"
                                style={{ ['--od-icon-size' as string]: '15px' }}
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
                            <button
                              className="cal-ics"
                              type="button"
                              aria-label={`Add ${ev.title} to your calendar`}
                              onClick={() => handleDownloadIcs(ev)}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                className="od-icon"
                                style={{ ['--od-icon-size' as string]: '16px' }}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
                                <path d="M3.5 9.5h17M8 3v4M16 3v4M12 12.5v4M10 14.5h4" />
                              </svg>
                              <span className="cal-ics__label">
                                {isIcsSaved ? 'Calendar file saved' : 'Add to calendar'}
                              </span>
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ol>
                </section>
              ))}
            </div>

            {downloadNotice ? (
              <p className="cal__status" id="calStatus" role="status" aria-live="polite">
                {downloadNotice}
              </p>
            ) : null}
          </div>

          <div className="calendar-page__foot reveal is-in">
            <p>Every night, the format repeats: class early, band or DJ late, kitchen until close.</p>
            <a
              href="/#book"
              onClick={(e) => {
                e.preventDefault()
                onNavigate('/', '#book')
              }}
            >
              Book a table
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
