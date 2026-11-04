import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { eventLink, mediaUrl } from '../../utils/links'
import styles from './Carousel.module.css'

function Arrow({ direction = 'right' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === 'left' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  )
}

function SlideContent({ item }) {
  return (
    <>
      <div className={styles.media}>
        <img
          src={mediaUrl(item)}
          alt={item.alt || item.titulo || 'Evento'}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.visibility = 'hidden'
          }}
        />
      </div>
      <div className={styles.caption}>
        <span className={styles.kicker}>Evento y noticia</span>
        <h3>{item.titulo}</h3>
        {item.subtitulo ? <p>{item.subtitulo}</p> : null}
        <span className={styles.more}>
          Ver más
          <Arrow />
        </span>
      </div>
    </>
  )
}

export default function Carousel({ items = [], interval = 6000 }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = items.length
  const touchStart = useRef(null)

  useEffect(() => {
    if (count < 2 || paused) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % count)
    }, interval)

    return () => window.clearInterval(timer)
  }, [count, interval, paused])

  useEffect(() => {
    if (index >= count && count > 0) {
      setIndex(0)
    }
  }, [count, index])

  if (!count) {
    return null
  }

  const goTo = (nextIndex) => {
    setIndex((nextIndex + count) % count)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goTo(index - 1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goTo(index + 1)
    }
  }

  return (
    <section
      className={styles.carousel}
      aria-roledescription="carrusel"
      aria-label="Eventos y noticias destacadas"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) {
          return
        }
        const delta = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current
        if (Math.abs(delta) > 45) {
          goTo(index + (delta < 0 ? 1 : -1))
        }
        touchStart.current = null
      }}
    >
      <div className={styles.viewport}>
        <div className={styles.track} style={{ transform: `translateX(-${index * 100}%)` }}>
          {items.map((item, itemIndex) => {
            const link = eventLink(item)
            const slideClass = `${styles.slide} ${itemIndex === index ? styles.slideActive : ''}`

            if (link.to === '#') {
              return (
                <div key={item.id || item.titulo} className={slideClass} aria-hidden={itemIndex !== index}>
                  <SlideContent item={item} />
                </div>
              )
            }

            if (link.external) {
              return (
                <a
                  key={item.id || item.titulo}
                  className={slideClass}
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-hidden={itemIndex !== index}
                  tabIndex={itemIndex === index ? 0 : -1}
                >
                  <SlideContent item={item} />
                </a>
              )
            }

            return (
              <Link
                key={item.id || item.titulo}
                className={slideClass}
                to={link.to}
                aria-hidden={itemIndex !== index}
                tabIndex={itemIndex === index ? 0 : -1}
              >
                <SlideContent item={item} />
              </Link>
            )
          })}
        </div>
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            className={`${styles.control} ${styles.prev}`}
            aria-label="Evento anterior"
            onClick={() => goTo(index - 1)}
          >
            <Arrow direction="left" />
          </button>
          <button
            type="button"
            className={`${styles.control} ${styles.next}`}
            aria-label="Evento siguiente"
            onClick={() => goTo(index + 1)}
          >
            <Arrow />
          </button>
          <div className={styles.dots} role="tablist" aria-label="Seleccionar evento">
            {items.map((item, dotIndex) => (
              <button
                key={item.id || item.titulo}
                type="button"
                role="tab"
                aria-selected={dotIndex === index}
                aria-label={`Ir al evento ${dotIndex + 1}: ${item.titulo}`}
                className={`${styles.dot} ${dotIndex === index ? styles.dotActive : ''}`}
                onClick={() => goTo(dotIndex)}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  )
}
