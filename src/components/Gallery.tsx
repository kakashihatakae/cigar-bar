import { GALLERY_PHOTOS } from '../data/gallery'

interface GalleryProps {
  onOpenLightbox: (index: number) => void
}

export function Gallery({ onOpenLightbox }: GalleryProps) {
  return (
    <section className="section gallery" id="gallery" aria-labelledby="gallery-title">
      <div className="wrap">
        <div className="section-head reveal is-in">
          <p className="eyebrow">
            05 <span className="slash">/</span> Gallery
          </p>
          <h2 id="gallery-title">
            A few nights that got
            <br />
            away from us.
          </h2>
        </div>

        <div className="gallery__grid">
          {GALLERY_PHOTOS.map((photo, i) => (
            <figure key={i} className={`gallery__item ${photo.modifier || ''} reveal is-in`}>
              <button
                className="gallery__btn"
                type="button"
                data-full={photo.full}
                data-alt={photo.alt}
                data-caption={photo.caption}
                onClick={() => onOpenLightbox(i)}
                aria-label={`View photo: ${photo.caption}`}
              >
                <img
                  src={photo.thumb}
                  width={photo.width}
                  height={photo.height}
                  alt={photo.alt}
                  loading="lazy"
                />
              </button>
              <figcaption>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
