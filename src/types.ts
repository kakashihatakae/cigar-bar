export interface CalendarEvent {
  id: string
  weekday?: number
  inDays?: number
  start: string
  hours: number
  title: string
  type: string
  room: string
  cover: string
  image: {
    src: string
    width: number
    height: number
    alt: string
  }
  desc: string
}

export interface ResolvedCalendarEvent extends CalendarEvent {
  startDate: Date
  endDate: Date
  isoDay: string
  bookSlot: string
  reserveHref: string
}

export interface BookingSpace {
  id: string
  index: string
  title: string
  kicker: string
  capacity: string
  bestFor: string
  desc: string
  image: {
    src: string
    width: number
    height: number
    alt: string
  }
  modifier: string
  ctaText: string
  ctaHref: string
}

export interface MenuItem {
  name: string
  desc: string
  price: string
}

export interface GalleryPhoto {
  full: string
  thumb: string
  alt: string
  caption: string
  modifier?: string
  width: number
  height: number
}
