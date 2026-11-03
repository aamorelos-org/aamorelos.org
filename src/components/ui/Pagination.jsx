import styles from './Pagination.module.css'

function Arrow({ direction = 'right' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === 'left' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  )
}

export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) {
    return null
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <nav className={styles.pagination} aria-label="Paginación">
      <button
        type="button"
        className={styles.step}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
      >
        <Arrow direction="left" />
        <span>Anterior</span>
      </button>

      <div className={styles.pages}>
        {pages.map((number) => (
          <button
            key={number}
            type="button"
            className={`${styles.page} ${number === page ? styles.current : ''}`}
            onClick={() => onChange(number)}
            aria-current={number === page ? 'page' : undefined}
            aria-label={`Página ${number}`}
          >
            {number}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={styles.step}
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="Página siguiente"
      >
        <span>Siguiente</span>
        <Arrow />
      </button>
    </nav>
  )
}
