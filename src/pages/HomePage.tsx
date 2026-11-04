import { Hero } from '../components/Hero'
import { BookingSpaces } from '../components/BookingSpaces'
import { FloorSection } from '../components/FloorSection'
import { Marquee } from '../components/Marquee'
import { Gallery } from '../components/Gallery'
import { VisitSection } from '../components/VisitSection'

interface HomePageProps {
  onNavigate: (path: string, hash?: string) => void
  onOpenLightbox: (index: number) => void
  initialDate?: string
  initialTime?: string
}

export function HomePage({
  onNavigate,
  onOpenLightbox,
  initialDate = '',
  initialTime = '',
}: HomePageProps) {
  return (
    <main id="main" tabIndex={-1}>
      <Hero onNavigate={onNavigate} />
      <BookingSpaces onNavigate={onNavigate} />
      <FloorSection />
      <Marquee />
      <Gallery onOpenLightbox={onOpenLightbox} />
      <VisitSection initialDate={initialDate} initialTime={initialTime} />
    </main>
  )
}
