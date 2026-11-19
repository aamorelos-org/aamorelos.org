import { mapsEmbedUrl } from '../../utils/links'
import styles from './MapEmbed.module.css'

/**
 * Embebido de Google Maps.
 * @param query Consulta de búsqueda.
 * @param title Texto accesible del iframe.
 * @param height Altura en px.
 */
export function MapEmbed({ query, title = 'Mapa de ubicación', height = 320 }) {
  if (!query) {
    return null
  }

  return (
    <div className={styles.wrapper} style={{ '--map-height': `${height}px` }}>
      <iframe
        title={title}
        src={mapsEmbedUrl(query)}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
