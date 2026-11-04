import { useState } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function Footer() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [currentYear] = useState(() => new Date().getFullYear())

  const validate = () => {
    const val = email.trim()
    if (!EMAIL_RE.test(val)) {
      setError("Add a valid email and we'll put you on the list.")
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus("You're on the list. One email, Sundays.")
    setEmail('')
    setError('')
  }

  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="site-foot__top">
          <p className="site-foot__mark">
            Cigar&nbsp;Bar<span>.</span>
          </p>
          <form className="news" id="newsForm" noValidate onSubmit={handleSubmit}>
            <label htmlFor="newsEmail">The Sunday list</label>
            <p className="news__note">One email a week: who's playing, what's cooking, which class is starting.</p>
            <div className="news__row">
              <input
                id="newsEmail"
                name="newsEmail"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                aria-describedby="news-error"
                aria-invalid={Boolean(error)}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                onBlur={validate}
              />
              <button className="btn btn--solid" type="submit">
                Join
              </button>
            </div>
            {error ? (
              <p className="form__error" id="news-error">
                {error}
              </p>
            ) : null}
            {status ? (
              <p className="news__status" role="status" aria-live="polite">
                {status}
              </p>
            ) : null}
          </form>
        </div>

        <div className="site-foot__bottom">
          <p className="site-foot__legal">
            Website concept for Cigar Bar: address, hours, and menu are sample content. Photography is licensed stock
            — Pexels (free license) plus one{' '}
            <a href="https://creativecommons.org/licenses/by-sa/4.0" rel="noopener noreferrer" target="_blank">
              CC BY-SA 4.0
            </a>{' '}
            image by Roland Barrera via Wikimedia Commons.
          </p>
          <p className="site-foot__meta">
            © <span id="year">{currentYear}</span> Cigar Bar · Salsa y son
          </p>
        </div>
      </div>
    </footer>
  )
}
