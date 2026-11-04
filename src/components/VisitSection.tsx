import { useRef, useState } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

interface VisitSectionProps {
  initialDate?: string
  initialTime?: string
}

export function VisitSection({ initialDate = '', initialTime = '' }: VisitSectionProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [date, setDate] = useState(initialDate)
  const [time, setTime] = useState(initialTime)
  const [guests, setGuests] = useState('')
  const [notes, setNotes] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isBusy, setIsBusy] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [summaryMessage, setSummaryMessage] = useState('')

  const formRef = useRef<HTMLFormElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)
  const timeSelectRef = useRef<HTMLSelectElement>(null)
  const guestsSelectRef = useRef<HTMLSelectElement>(null)
  const summaryBoxRef = useRef<HTMLDivElement>(null)

  const [todayIso] = useState(() => new Date().toISOString().split('T')[0])

  const validateField = (fieldId: string, val: string): string => {
    const trimmed = val.trim()
    if (!trimmed) {
      return 'This field is needed.'
    }
    if (fieldId === 'email' && !EMAIL_RE.test(trimmed)) {
      return 'That email does not look right — check for a typo.'
    }
    if (fieldId === 'date') {
      const chosen = new Date(`${trimmed}T12:00:00`)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (chosen < today) {
        return 'Pick today or a date still to come.'
      }
    }
    return ''
  }

  const handleBlur = (fieldId: string, val: string) => {
    const errorMsg = validateField(fieldId, val)
    setErrors((prev) => ({
      ...prev,
      [fieldId]: errorMsg,
    }))
  }

  const handleFieldChange = (fieldId: string, val: string, setter: (v: string) => void) => {
    setter(val)
    if (errors[fieldId]) {
      const errorMsg = validateField(fieldId, val)
      setErrors((prev) => ({
        ...prev,
        [fieldId]: errorMsg,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {
      name: validateField('name', name),
      email: validateField('email', email),
      date: validateField('date', date),
      time: validateField('time', time),
      guests: validateField('guests', guests),
    }

    setErrors(newErrors)

    const invalidKeys = Object.keys(newErrors).filter((k) => Boolean(newErrors[k]))
    if (invalidKeys.length > 0) {
      summaryBoxRef.current?.focus()
      return
    }

    setIsBusy(true)

    window.setTimeout(() => {
      setIsBusy(false)
      const prettyDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
      const firstName = name.trim().split(' ')[0]
      setSummaryMessage(
        `${prettyDate} at ${time} — a table for ${guests}. We'll email ${email.trim()} to confirm, ${firstName}.`
      )
      setIsSubmitted(true)
    }, 1000)
  }

  const handleReset = () => {
    setName('')
    setEmail('')
    setDate('')
    setTime('')
    setGuests('')
    setNotes('')
    setErrors({})
    setIsSubmitted(false)
    setSummaryMessage('')
    window.setTimeout(() => {
      nameInputRef.current?.focus()
    }, 50)
  }

  const focusField = (fieldId: string) => {
    if (fieldId === 'name') nameInputRef.current?.focus()
    else if (fieldId === 'email') emailInputRef.current?.focus()
    else if (fieldId === 'date') dateInputRef.current?.focus()
    else if (fieldId === 'time') timeSelectRef.current?.focus()
    else if (fieldId === 'guests') guestsSelectRef.current?.focus()
  }

  const invalidFieldNames = Object.keys(errors).filter((k) => Boolean(errors[k]))

  return (
    <section className="section visit" id="visit" aria-labelledby="visit-title">
      <div className="wrap">
        <div className="section-head reveal is-in">
          <p className="eyebrow">
            06 <span className="slash">/</span> Visit
          </p>
          <h2 id="visit-title">
            Come early,
            <br />
            stay late.
          </h2>
        </div>

        <div className="visit__grid">
          <div className="visit__info reveal is-in">
            <div className="visit__block">
              <p className="visit__label">Address</p>
              <p className="visit__big">
                Calle 8 #214
                <br />
                Centro
              </p>
              <p className="visit__note">Entrance on Calle 8 — look for the red door, not the sign.</p>
            </div>

            <div className="visit__block">
              <p className="visit__label">Hours</p>
              <table className="hours">
                <tbody>
                  <tr>
                    <th scope="row">Tue–Thu</th>
                    <td>6pm–1am</td>
                  </tr>
                  <tr>
                    <th scope="row">Fri–Sat</th>
                    <td>6pm–2am</td>
                  </tr>
                  <tr>
                    <th scope="row">Sun</th>
                    <td>5pm–11pm</td>
                  </tr>
                  <tr className="hours__closed">
                    <th scope="row">Mon</th>
                    <td>Closed</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="visit__block">
              <p className="visit__label">Talk to us</p>
              <p>
                <a href="mailto:hola@cigarbar.example">hola@cigarbar.example</a>
              </p>
              <p>
                <a href="tel:+15550148820">+1 555 014 8820</a>
              </p>
              <p className="visit__note">For parties of nine or more, email us before Thursday.</p>
            </div>
          </div>

          <div className="visit__book reveal is-in">
            <div className="book__head">
              <h3>Book a table</h3>
              <p>Tables of two to eight. Walk-ins welcome after ten, floor permitting.</p>
            </div>

            {!isSubmitted ? (
              <form
                className={`form ${isBusy ? 'is-busy' : ''}`}
                id="bookForm"
                ref={formRef}
                noValidate
                onSubmit={handleSubmit}
              >
                {invalidFieldNames.length > 0 && (
                  <div className="form__summary" id="bookErrors" role="alert" tabIndex={-1} ref={summaryBoxRef}>
                    <p>Check these before we look for a table:</p>
                    <ul>
                      {invalidFieldNames.map((fieldId) => {
                        const labelText =
                          fieldId === 'name'
                            ? 'Name'
                            : fieldId === 'email'
                              ? 'Email'
                              : fieldId === 'date'
                                ? 'Date'
                                : fieldId === 'time'
                                  ? 'Time'
                                  : 'Guests'
                        return (
                          <li key={fieldId}>
                            <button type="button" onClick={() => focusField(fieldId)}>
                              {labelText}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}

                <div className="form__row od-field">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    aria-describedby="name-error"
                    aria-invalid={Boolean(errors.name)}
                    value={name}
                    ref={nameInputRef}
                    onChange={(e) => handleFieldChange('name', e.target.value, setName)}
                    onBlur={() => handleBlur('name', name)}
                  />
                  {errors.name ? (
                    <p className="form__error" id="name-error">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div className="form__row od-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-describedby="email-error"
                    aria-invalid={Boolean(errors.email)}
                    value={email}
                    ref={emailInputRef}
                    onChange={(e) => handleFieldChange('email', e.target.value, setEmail)}
                    onBlur={() => handleBlur('email', email)}
                  />
                  {errors.email ? (
                    <p className="form__error" id="email-error">
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                <div className="form__pair">
                  <div className="form__row od-field">
                    <label htmlFor="date">Date</label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      min={todayIso}
                      required
                      aria-describedby="date-error"
                      aria-invalid={Boolean(errors.date)}
                      value={date}
                      ref={dateInputRef}
                      onChange={(e) => handleFieldChange('date', e.target.value, setDate)}
                      onBlur={() => handleBlur('date', date)}
                    />
                    {errors.date ? (
                      <p className="form__error" id="date-error">
                        {errors.date}
                      </p>
                    ) : null}
                  </div>

                  <div className="form__row od-field">
                    <label htmlFor="time">Time</label>
                    <select
                      id="time"
                      name="time"
                      required
                      aria-describedby="time-error"
                      aria-invalid={Boolean(errors.time)}
                      value={time}
                      ref={timeSelectRef}
                      onChange={(e) => handleFieldChange('time', e.target.value, setTime)}
                      onBlur={() => handleBlur('time', time)}
                    >
                      <option value="">Choose</option>
                      <option value="6:00pm">6:00pm</option>
                      <option value="7:00pm">7:00pm</option>
                      <option value="8:00pm">8:00pm</option>
                      <option value="9:00pm">9:00pm</option>
                      <option value="10:00pm">10:00pm</option>
                    </select>
                    {errors.time ? (
                      <p className="form__error" id="time-error">
                        {errors.time}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="form__row od-field">
                  <label htmlFor="guests">Guests</label>
                  <select
                    id="guests"
                    name="guests"
                    required
                    aria-describedby="guests-error"
                    aria-invalid={Boolean(errors.guests)}
                    value={guests}
                    ref={guestsSelectRef}
                    onChange={(e) => handleFieldChange('guests', e.target.value, setGuests)}
                    onBlur={() => handleBlur('guests', guests)}
                  >
                    <option value="">Choose</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                  {errors.guests ? (
                    <p className="form__error" id="guests-error">
                      {errors.guests}
                    </p>
                  ) : null}
                </div>

                <div className="form__row od-field">
                  <label htmlFor="notes">
                    Anything we should know? <span className="form__opt">Optional</span>
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    placeholder="Birthday, allergies, a favourite corner…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <button className="btn btn--solid form__submit" type="submit" disabled={isBusy}>
                  <span className="form__submitLabel">{isBusy ? 'Checking availability…' : 'Request a table'}</span>
                </button>
                <p className="form__status" role="status" aria-live="polite">
                  {isBusy ? 'One moment — we are looking for a table.' : ''}
                </p>
                <p className="form__fine">Sample booking form — no data leaves this page.</p>
              </form>
            ) : (
              <div className="book__done" id="bookDone" role="status" aria-live="polite">
                <p className="book__doneKicker">Table request received</p>
                <p className="book__doneText" id="bookSummary">
                  {summaryMessage}
                </p>
                <p className="book__doneNote">
                  We hold requests for 24 hours and confirm by email. This demo does not send anything.
                </p>
                <button className="btn btn--line" type="button" id="bookAgain" onClick={handleReset}>
                  Make another request
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
