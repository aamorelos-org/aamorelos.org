import { Link } from 'react-router-dom'
import styles from './Breadcrumb.module.css'

export default function Breadcrumb({ items = [] }) {
  if (!items.length) {
    return null
  }

  return (
    <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={`${item.label}-${index}`}>
              {item.to && !isLast ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              )}
              {!isLast ? <span className={styles.separator} aria-hidden="true">/</span> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
