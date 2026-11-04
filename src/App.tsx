import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { MobileNav } from './components/MobileNav'
import { Footer } from './components/Footer'
import { Lightbox } from './components/Lightbox'
import { HomePage } from './pages/HomePage'
import { CalendarPage } from './pages/CalendarPage'
import { MenuPage } from './pages/MenuPage'
import { GALLERY_PHOTOS } from './data/gallery'

function normalizePath(pathname: string): string {
  if (pathname.endsWith('/calendar.html') || pathname.endsWith('/calendar')) return '/calendar'
  if (pathname.endsWith('/menu.html') || pathname.endsWith('/menu')) return '/menu'
  return '/'
}

function getInitialQueryParams(): { date: string; time: string } {
  if (typeof window === 'undefined') return { date: '', time: '' }
  const searchParams = new URLSearchParams(window.location.search)
  return {
    date: searchParams.get('date') || '',
    time: searchParams.get('time') || '',
  }
}

function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, '')
  if (!id || id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const target = document.getElementById(id)
  if (!target) return

  const header = document.getElementById('siteHead')
  const headerHeight = header ? header.offsetHeight : 0
  const top = target.getBoundingClientRect().top + window.scrollY - headerHeight

  window.scrollTo({ top, behavior: 'smooth' })
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => normalizePath(window.location.pathname))
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const [queryParams, setQueryParams] = useState<{ date: string; time: string }>(getInitialQueryParams)

  // Synchronize with URL on initial load and popstate
  useEffect(() => {
    const handlePopState = () => {
      const norm = normalizePath(window.location.pathname)
      setCurrentPath(norm)

      const searchParams = new URLSearchParams(window.location.search)
      setQueryParams({
        date: searchParams.get('date') || '',
        time: searchParams.get('time') || '',
      })

      if (window.location.hash) {
        scrollToHash(window.location.hash)
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    if (window.location.hash) {
      window.setTimeout(() => {
        scrollToHash(window.location.hash)
      }, 100)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Scrollspy observer on the home page
  useEffect(() => {
    if (currentPath !== '/') return

    const sectionIds = ['book', 'floor', 'gallery', 'visit']
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (!('IntersectionObserver' in window) || elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: 0 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => {
      observer.disconnect()
      setActiveSection('')
    }
  }, [currentPath])

  const navigate = (path: string, hash?: string) => {
    let targetPath = path
    let query = ''

    if (path.includes('?')) {
      const parts = path.split('?')
      targetPath = parts[0]
      query = `?${parts[1]}`
    }

    const normalized = normalizePath(targetPath)
    const targetUrl = `${normalized}${query}${hash || ''}`

    if (
      window.location.pathname !== normalized ||
      window.location.search !== query ||
      window.location.hash !== (hash || '')
    ) {
      window.history.pushState(null, '', targetUrl)
    }

    const searchParams = new URLSearchParams(query)
    setQueryParams({
      date: searchParams.get('date') || '',
      time: searchParams.get('time') || '',
    })

    if (normalized !== currentPath) {
      setCurrentPath(normalized)
      window.setTimeout(() => {
        if (hash) {
          scrollToHash(hash)
        } else {
          window.scrollTo({ top: 0, behavior: 'auto' })
        }
      }, 50)
    } else {
      if (hash) {
        scrollToHash(hash)
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      <a
        className="skip"
        href="#main"
        onClick={(e) => {
          e.preventDefault()
          const mainEl = document.getElementById('main')
          if (mainEl) {
            mainEl.focus({ preventScroll: true })
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }}
      >
        Skip to content
      </a>
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
        isMobileNavOpen={isMobileNavOpen}
        activeSection={activeSection}
      />
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onNavigate={navigate}
      />

      {currentPath === '/calendar' && <CalendarPage onNavigate={navigate} />}
      {currentPath === '/menu' && <MenuPage />}
      {currentPath === '/' && (
        <HomePage
          key={`${queryParams.date}-${queryParams.time}`}
          onNavigate={navigate}
          onOpenLightbox={(idx) => setLightboxIndex(idx)}
          initialDate={queryParams.date}
          initialTime={queryParams.time}
        />
      )}

      <Footer />

      <Lightbox
        photos={GALLERY_PHOTOS}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </>
  )
}
