import { useEffect, useRef } from 'react'
import type { GalleryPhoto } from '../types'

interface LightboxProps {
  photos: GalleryPhoto[]
  currentIndex: number | null
  onClose: () => void
  onNavigate: (newIndex: number) => void
}

export function Lightbox({ photos, currentIndex, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const lastActiveElementRef = useRef<HTMLElement | null>(null)

  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < photos.length
  const photo = isOpen ? photos[currentIndex] : null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      lastActiveElementRef.current = document.activeElement as HTMLElement
      if (!dialog.open) {
        dialog.showModal()
        document.body.classList.add('is-locked')
      }
    } else {
      if (dialog.open) {
        dialog.close()
      }
      document.body.classList.remove('is-locked')
      if (lastActiveElementRef.current?.focus) {
        lastActiveElementRef.current.focus({ preventScroll: true })
      }
    }
  }, [isOpen])

  // Handle keyboard events (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        onNavigate((currentIndex! + 1) % photos.length)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onNavigate((currentIndex! - 1 + photos.length) % photos.length)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, photos.length, onNavigate, onClose])

  if (!isOpen || !photo) {
    return <dialog ref={dialogRef} className="lightbox" aria-label="Photo viewer" />
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose()
    }
  }

  const prevIndex = (currentIndex - 1 + photos.length) % photos.length
  const nextIndex = (currentIndex + 1) % photos.length

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label="Photo viewer"
      onClick={handleBackdropClick}
      onClose={onClose}
    >
      <div className="lightbox__bar">
        <p className="lightbox__caption">{photo.caption}</p>
        <button
          className="lightbox__close"
          type="button"
          aria-label="Close photo viewer"
          onClick={onClose}
        >
          <svg
            viewBox="0 0 24 24"
            className="od-icon"
            style={{ ['--od-icon-size' as string]: '20px' }}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="lightbox__stage">
        <button
          className="lightbox__nav lightbox__nav--prev"
          type="button"
          aria-label="Previous photo"
          onClick={() => onNavigate(prevIndex)}
        >
          <svg
            viewBox="0 0 24 24"
            className="od-icon"
            style={{ ['--od-icon-size' as string]: '22px' }}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <img src={photo.full} alt={photo.alt} />

        <button
          className="lightbox__nav lightbox__nav--next"
          type="button"
          aria-label="Next photo"
          onClick={() => onNavigate(nextIndex)}
        >
          <svg
            viewBox="0 0 24 24"
            className="od-icon"
            style={{ ['--od-icon-size' as string]: '22px' }}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </dialog>
  )
}
