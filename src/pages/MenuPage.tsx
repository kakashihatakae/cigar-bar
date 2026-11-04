import { useState } from 'react'
import { DRINKS_MENU, KITCHEN_MENU } from '../data/menu'

export function MenuPage() {
  const [activeTab, setActiveTab] = useState<'drinks' | 'kitchen'>('drinks')

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      setActiveTab((prev) => (prev === 'drinks' ? 'kitchen' : 'drinks'))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActiveTab('drinks')
    } else if (e.key === 'End') {
      e.preventDefault()
      setActiveTab('kitchen')
    }
  }

  return (
    <main id="main" className="menu-page" tabIndex={-1}>
      <section className="menu-hero" aria-labelledby="menu-title">
        <img
          className="menu-hero__media"
          src="/assets/img/cocktails.jpg"
          width="1200"
          height="1800"
          alt="Two cocktails on a dark bar counter"
          fetchPriority="high"
        />
        <div className="menu-hero__veil" aria-hidden="true" />
        <div className="wrap menu-hero__inner">
          <p className="menu-hero__eyebrow">
            Cigar Bar <span className="dot">·</span> Menu
          </p>
          <h1 id="menu-title">
            Rum, citrus, and food
            <br />
            made for sharing.
          </h1>
          <p className="menu-hero__sub">
            The kitchen cooks until last call. Order small, order twice, or plant yourself at the bar and work through
            the list.
          </p>
        </div>
      </section>

      <section className="section menu" id="menu" aria-label="Menu">
        <div className="wrap">
          <div className="menu__tabs" role="tablist" aria-label="Menu sections" onKeyDown={handleKeyDown}>
            <button
              className={`menu-tab ${activeTab === 'drinks' ? 'is-active' : ''}`}
              role="tab"
              id="tab-drinks"
              aria-controls="panel-drinks"
              aria-selected={activeTab === 'drinks'}
              tabIndex={activeTab === 'drinks' ? 0 : -1}
              onClick={() => setActiveTab('drinks')}
            >
              Drinks
            </button>
            <button
              className={`menu-tab ${activeTab === 'kitchen' ? 'is-active' : ''}`}
              role="tab"
              id="tab-kitchen"
              aria-controls="panel-kitchen"
              aria-selected={activeTab === 'kitchen'}
              tabIndex={activeTab === 'kitchen' ? 0 : -1}
              onClick={() => setActiveTab('kitchen')}
            >
              Kitchen
            </button>
          </div>

          <div
            className="menu__panel"
            role="tabpanel"
            id="panel-drinks"
            aria-labelledby="tab-drinks"
            tabIndex={0}
            hidden={activeTab !== 'drinks'}
          >
            <ul className="menu__list">
              {DRINKS_MENU.map((item, i) => (
                <li key={i} className="menu__item">
                  <div className="menu__text od-field">
                    <span className="menu__name">{item.name}</span>
                    <span className="menu__desc">{item.desc}</span>
                  </div>
                  <span className="menu__price od-nowrap">{item.price}</span>
                </li>
              ))}
            </ul>
            <p className="menu__note">Happy hour Tue–Thu, 6–8pm: two dollars off house cocktails.</p>
          </div>

          <div
            className="menu__panel"
            role="tabpanel"
            id="panel-kitchen"
            aria-labelledby="tab-kitchen"
            tabIndex={0}
            hidden={activeTab !== 'kitchen'}
          >
            <ul className="menu__list">
              {KITCHEN_MENU.map((item, i) => (
                <li key={i} className="menu__item">
                  <div className="menu__text od-field">
                    <span className="menu__name">{item.name}</span>
                    <span className="menu__desc">{item.desc}</span>
                  </div>
                  <span className="menu__price od-nowrap">{item.price}</span>
                </li>
              ))}
            </ul>
            <p className="menu__note">Sample menu — dishes rotate with the market. Ask what is off-menu.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
