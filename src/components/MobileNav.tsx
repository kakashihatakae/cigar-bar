import { useEffect, useRef } from 'react'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (path: string, hash?: string) => void
}

export function MobileNav({ isOpen, onClose, onNavigate }: MobileNavProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('is-locked')
      const firstLink = containerRef.current?.querySelector('a')
      firstLink?.focus({ preventScroll: true })
    } else {
      document.body.classList.remove('is-locked')
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'Tab') {
        const focusables = containerRef.current?.querySelectorAll<HTMLElement>('a, button')
        if (!focusables || focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleLinkClick = (e: React.MouseEvent, path: string, hash?: string) => {
    e.preventDefault()
    onClose()
    onNavigate(path, hash)
  }

  return (
    <div className="mobile-nav" id="mobileNav" ref={containerRef}>
      <nav aria-label="Mobile">
        <a href="/#book" onClick={(e) => handleLinkClick(e, '/', '#book')}>
          <span>01</span>Book
        </a>
        <a href="/calendar" onClick={(e) => handleLinkClick(e, '/calendar')}>
          <span>02</span>Calendar
        </a>
        <a href="/#floor" onClick={(e) => handleLinkClick(e, '/', '#floor')}>
          <span>03</span>The floor
        </a>
        <a href="/menu" onClick={(e) => handleLinkClick(e, '/menu')}>
          <span>04</span>Menu
        </a>
        <a href="/#gallery" onClick={(e) => handleLinkClick(e, '/', '#gallery')}>
          <span>05</span>Gallery
        </a>
        <a href="/#visit" onClick={(e) => handleLinkClick(e, '/', '#visit')}>
          <span>06</span>Visit
        </a>
      </nav>
      <div className="mobile-nav__foot">
        <p>Calle 8 #214, Centro</p>
        <p>Tue–Sun · 6pm until late</p>
        <a
          className="btn btn--solid"
          href="/#book"
          onClick={(e) => handleLinkClick(e, '/', '#book')}
        >
          Book
        </a>
      </div>
    </div>
  )
}
