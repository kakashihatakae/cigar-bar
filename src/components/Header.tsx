import { useEffect, useState } from 'react'

interface HeaderProps {
  currentPath: string
  onNavigate: (path: string, hash?: string) => void
  onToggleMobileNav: () => void
  isMobileNavOpen: boolean
  activeSection?: string
}

export function Header({
  currentPath,
  onNavigate,
  onToggleMobileNav,
  isMobileNavOpen,
  activeSection = '',
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset
      setIsScrolled(y > 20)

      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(y / max, 0), 1)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLinkClick = (e: React.MouseEvent, path: string, hash?: string) => {
    e.preventDefault()
    onNavigate(path, hash)
  }

  return (
    <>
      <div className="progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${scrollProgress})` }} />
      </div>

      <header className={`site-head ${isScrolled ? 'is-scrolled' : ''}`} id="siteHead">
        <div className="wrap site-head__inner">
          <a
            className="brand"
            href="/"
            aria-label="Cigar Bar — home"
            onClick={(e) => handleLinkClick(e, '/', '#top')}
          >
            <span className="brand__mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="od-icon" style={{ ['--od-icon-size' as string]: '22px' }}>
                <rect x="6" y="2" width="4" height="20" rx="2" fill="currentColor" transform="rotate(14 8 12)" />
                <rect x="14" y="2" width="4" height="20" rx="2" fill="currentColor" transform="rotate(-14 16 12)" />
              </svg>
            </span>
            <span className="brand__name">Cigar&nbsp;Bar</span>
          </a>

          <nav className="site-nav" aria-label="Primary">
            <a
              href="/#book"
              className={currentPath === '/' && activeSection === 'book' ? 'is-active' : ''}
              onClick={(e) => handleLinkClick(e, '/', '#book')}
            >
              Book
            </a>
            <a
              href="/calendar"
              className={currentPath === '/calendar' ? 'is-active' : ''}
              aria-current={currentPath === '/calendar' ? 'page' : undefined}
              onClick={(e) => handleLinkClick(e, '/calendar')}
            >
              Calendar
            </a>
            <a
              href="/#floor"
              className={currentPath === '/' && activeSection === 'floor' ? 'is-active' : ''}
              onClick={(e) => handleLinkClick(e, '/', '#floor')}
            >
              The floor
            </a>
            <a
              href="/menu"
              className={currentPath === '/menu' ? 'is-active' : ''}
              aria-current={currentPath === '/menu' ? 'page' : undefined}
              onClick={(e) => handleLinkClick(e, '/menu')}
            >
              Menu
            </a>
            <a
              href="/#gallery"
              className={currentPath === '/' && activeSection === 'gallery' ? 'is-active' : ''}
              onClick={(e) => handleLinkClick(e, '/', '#gallery')}
            >
              Gallery
            </a>
            <a
              href="/#visit"
              className={currentPath === '/' && activeSection === 'visit' ? 'is-active' : ''}
              onClick={(e) => handleLinkClick(e, '/', '#visit')}
            >
              Visit
            </a>
          </nav>

          <a
            className="btn btn--ghost site-head__cta"
            href="/#book"
            onClick={(e) => handleLinkClick(e, '/', '#book')}
          >
            Book
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

          <button
            className="menu-toggle"
            id="menuToggle"
            type="button"
            aria-expanded={isMobileNavOpen}
            aria-controls="mobileNav"
            onClick={onToggleMobileNav}
          >
            <span className="menu-toggle__label">{isMobileNavOpen ? 'Close' : 'Menu'}</span>
            <span className="menu-toggle__bars" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>
    </>
  )
}
