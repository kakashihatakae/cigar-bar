import type { CalendarEvent, ResolvedCalendarEvent } from '../types'

export const CAL_EVENTS: CalendarEvent[] = [
  {
    id: 'rueda',
    weekday: 2,
    start: '19:00',
    hours: 6,
    title: 'Rueda de casino',
    type: 'Class + social',
    room: 'Main floor',
    cover: '$10',
    image: {
      src: '/assets/img/floor-couple.jpg',
      width: 1200,
      height: 1800,
      alt: 'A couple dancing in a close hold on the floor',
    },
    desc: 'A circle, a caller, and no partner required. Teachers stay on the floor until it clicks.',
  },
  {
    id: 'son-bolero',
    weekday: 3,
    start: '20:00',
    hours: 4,
    title: 'Tres y bolero',
    type: 'Live music',
    room: 'Bar room',
    cover: '$8',
    image: {
      src: '/assets/img/band.jpg',
      width: 1800,
      height: 1199,
      alt: 'Guitarists and percussionists playing together',
    },
    desc: 'A trio in the corner, a short first set, and enough space to talk between songs.',
  },
  {
    id: 'salsa-suave',
    weekday: 4,
    start: '21:00',
    hours: 4,
    title: 'Salsa suave · DJ Marisol',
    type: 'DJ set',
    room: 'Main floor',
    cover: '$10',
    image: {
      src: '/assets/img/floor-dip.jpg',
      width: 1200,
      height: 1800,
      alt: 'A couple in a dramatic dip against a grey wall',
    },
    desc: 'The slow end of the crate: salsa, bachata, and one merengue at midnight to wake the room up.',
  },
  {
    id: 'orquesta',
    weekday: 5,
    start: '22:00',
    hours: 4,
    title: 'Orquesta Caliente',
    type: 'Live music',
    room: 'Main floor',
    cover: '$15',
    image: {
      src: '/assets/img/gallery-live.jpg',
      width: 1800,
      height: 1199,
      alt: 'A couple dancing in front of a live band',
    },
    desc: 'Nine pieces, two sets, and horns that arrive before you see them.',
  },
  {
    id: 'la-clave-social',
    weekday: 6,
    start: '21:00',
    hours: 5,
    title: 'La Clave Social',
    type: 'Social',
    room: 'Whole room',
    cover: '$12',
    image: {
      src: '/assets/img/gallery-havana.jpg',
      width: 1800,
      height: 1350,
      alt: 'A couple dancing in a room with a live band behind them',
    },
    desc: 'DJ until eleven, a set from the house team, then the floor stays packed until close.',
  },
  {
    id: 'matinee',
    weekday: 0,
    start: '17:00',
    hours: 6,
    title: 'Sunday matinee',
    type: 'Class + social',
    room: 'Main floor',
    cover: '$8',
    image: {
      src: '/assets/img/hero-dance.jpg',
      width: 1800,
      height: 1200,
      alt: 'Dancers on the floor at Cigar Bar',
    },
    desc: 'Class at five, social at six, roast in the kitchen until it runs out.',
  },
  {
    id: 'son-release',
    inDays: 9,
    start: '21:00',
    hours: 3,
    title: 'Son de la Casa — record release',
    type: 'Live music',
    room: 'Main floor',
    cover: '$15',
    image: {
      src: '/assets/img/band.jpg',
      width: 1800,
      height: 1199,
      alt: 'Guitarists and percussionists playing together',
    },
    desc: 'The house trio plays the new record front to back, then hands the floor to DJ Marisol.',
  },
  {
    id: 'timba-night',
    inDays: 17,
    start: '20:00',
    hours: 5,
    title: 'Timba night with DJ Yema',
    type: 'DJ set',
    room: 'Main floor',
    cover: '$12',
    image: {
      src: '/assets/img/floor-dip.jpg',
      width: 1200,
      height: 1800,
      alt: 'A couple in a dramatic dip against a grey wall',
    },
    desc: 'A guest set from Havana: timba, songo, and no slow songs until the room asks for one.',
  },
  {
    id: 'bootcamp',
    inDays: 24,
    start: '19:00',
    hours: 2,
    title: 'Beginner bootcamp · week one',
    type: 'Workshop',
    room: 'Studio',
    cover: '$40',
    image: {
      src: '/assets/img/floor-shoes.jpg',
      width: 1800,
      height: 1200,
      alt: 'Close-up of dance shoes on a wooden floor',
    },
    desc: 'Four sessions from the first count. No partner needed; sign up for the full course.',
  },
  {
    id: 'lechon',
    inDays: 38,
    start: '18:00',
    hours: 4,
    title: 'Noche de cocina: lechón',
    type: 'Kitchen takeover',
    room: 'Whole room',
    cover: '$45',
    image: {
      src: '/assets/img/tapas.jpg',
      width: 1200,
      height: 1800,
      alt: 'Tapas plates and a glass of sangria on a wooden table',
    },
    desc: 'One long table, a whole roast, and the band playing after the plates are cleared.',
  },
]

export const BOOK_SLOTS: Record<number, string> = {
  18: '6:00pm',
  19: '7:00pm',
  20: '8:00pm',
  21: '9:00pm',
  22: '10:00pm',
}

export const NIGHTS = [
  { day: 'Sun', label: 'Sunday matinee', time: '5pm', tab: 'sun' },
  { day: 'Mon', label: null, time: null, tab: 'tue' },
  { day: 'Tue', label: 'Rueda de casino', time: '7pm', tab: 'tue' },
  { day: 'Wed', label: 'Tres, bolero, and a slow room', time: '8pm', tab: 'wed' },
  { day: 'Thu', label: 'Salsa suave', time: '9pm', tab: 'thu' },
  { day: 'Fri', label: 'Orquesta Caliente', time: '10pm', tab: 'fri' },
  { day: 'Sat', label: 'La Clave Social', time: '9pm', tab: 'sat' },
]

export function getTonightStatus(now: Date = new Date()): string {
  const dayIndex = now.getDay()
  const today = NIGHTS[dayIndex]
  if (today && today.label) {
    return `Tonight — ${today.label} · ${today.time}`
  }
  return 'Closed tonight — back Tuesday · 7pm'
}

export const pad2 = (n: number) => String(n).padStart(2, '0')

const atTime = (date: Date, hhmm: string) => {
  const d = new Date(date)
  const [h, m] = hhmm.split(':').map(Number)
  d.setHours(h, m, 0, 0)
  return d
}

const addDays = (date: Date, days: number) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export const fmtClock = (d: Date) => {
  const h = d.getHours()
  const m = d.getMinutes()
  const suffix = h >= 12 ? 'pm' : 'am'
  return m ? `${h % 12 || 12}:${pad2(m)}${suffix}` : `${h % 12 || 12}${suffix}`
}

export const MONTH_FMT = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })
export const DOW_FMT = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
export const MON_FMT = new Intl.DateTimeFormat('en-US', { month: 'short' })

export function resolveEvents(events: CalendarEvent[] = CAL_EVENTS, now: Date = new Date()): ResolvedCalendarEvent[] {
  return events
    .map((ev) => {
      let start: Date
      if (typeof ev.weekday === 'number') {
        const delta = (ev.weekday - now.getDay() + 7) % 7
        start = atTime(addDays(now, delta), ev.start)
        if (start <= now) start = atTime(addDays(now, delta + 7), ev.start)
      } else {
        start = atTime(addDays(now, ev.inDays ?? 0), ev.start)
      }

      const end = new Date(start.getTime() + ev.hours * 3600000)
      const isoDay = `${start.getFullYear()}-${pad2(start.getMonth() + 1)}-${pad2(start.getDate())}`
      const bookSlot = BOOK_SLOTS[start.getHours()] || ''
      const reserveHref = `/?date=${isoDay}${bookSlot ? `&time=${encodeURIComponent(bookSlot)}` : ''}#visit`

      return {
        ...ev,
        startDate: start,
        endDate: end,
        isoDay,
        bookSlot,
        reserveHref,
      }
    })
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
}

const icsEscape = (value: string) =>
  String(value).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')

const icsLocal = (date: Date) =>
  `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}T${pad2(date.getHours())}${pad2(date.getMinutes())}00`

export function downloadIcs(ev: ResolvedCalendarEvent) {
  const stamp = `${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cigar Bar//Programme//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:cigar-bar-${ev.id}-${icsLocal(ev.startDate)}@cigarbar.example`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${icsLocal(ev.startDate)}`,
    `DTEND:${icsLocal(ev.endDate)}`,
    `SUMMARY:${icsEscape(`Cigar Bar — ${ev.title}`)}`,
    `LOCATION:${icsEscape('Cigar Bar, Calle 8 #214, Centro')}`,
    `DESCRIPTION:${icsEscape(`${ev.desc} ${ev.type}. Cover ${ev.cover}. Doors one hour before.`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `cigar-bar-${ev.id}.ics`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
