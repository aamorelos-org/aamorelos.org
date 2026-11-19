import styles from './States.module.css'

/**
 * Estado de carga (spinner + esqueleto).
 * @param label Mensaje de carga.
 * @param rows Filas del esqueleto.
 */
export function LoadingState({ label = 'Cargando información…', rows = 3 }) {
  return (
    <div className={styles.panel} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <p>{label}</p>
      <div className={styles.skeleton} aria-hidden="true">
        {Array.from({ length: rows }, (_, index) => (
          <span key={index} />
        ))}
      </div>
    </div>
  )
}

/**
 * Estado de error con reintento opcional.
 * @param title Título del mensaje.
 * @param message Detalle del error.
 * @param onRetry Callback de reintento.
 */
export function ErrorState({ title = 'No pudimos cargar la información', message, onRetry }) {
  return (
    <div className={`${styles.panel} ${styles.error}`} role="alert">
      <h2>{title}</h2>
      {message ? <p>{message}</p> : null}
      {onRetry ? (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Reintentar
        </button>
      ) : null}
    </div>
  )
}

/**
 * Estado vacío (sin resultados).
 * @param title Título del mensaje.
 * @param message Detalle del estado.
 * @param children Acciones/contenido extra.
 */
export function EmptyState({ title = 'Sin resultados', message = 'Intenta con otro criterio de búsqueda.', children }) {
  return (
    <div className={styles.panel}>
      <h2>{title}</h2>
      <p>{message}</p>
      {children}
    </div>
  )
}
