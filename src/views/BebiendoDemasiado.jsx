import { Link } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { bebiendo } from '../data/reflectionsContent'
import { assetUrl } from '../utils/links'
import { formatPhoneHref } from '../utils/text'
import styles from './Reflections.module.css'

function RichText({ text }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g)

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

export default function BebiendoDemasiado() {
  useDocumentTitle(bebiendo.title)

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Reflexiones', to: '/reflexiones' },
          { label: bebiendo.title },
        ]}
      />

      <div className={styles.detailPage}>
        <section className={styles.detailHero}>
          <figure className={styles.detailMedia}>
            <img
              src={assetUrl(bebiendo.image)}
              alt={bebiendo.title}
              onError={(event) => {
                event.currentTarget.style.visibility = 'hidden'
              }}
            />
          </figure>

          <div className={styles.detailBody}>
            <span className={styles.kicker}>{bebiendo.kicker}</span>
            <h1 className={styles.detailTitle}>{bebiendo.title}</h1>
            <p className={styles.description}>
              Una pausa para reconocer lo que sientes y recordar que no tienes que atravesarlo
              solo. La ayuda está disponible.
            </p>
            <Link className={styles.backLink} to="/reflexiones">
              ← Volver a reflexiones
            </Link>
          </div>
        </section>

        <article className={styles.article}>
          <div className={styles.articleBody}>
            {bebiendo.paragraphs.map((paragraph) => (
              <p key={paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}
            <blockquote className={styles.quoteBox}>{bebiendo.quote}</blockquote>
          </div>
        </article>

        <section className={styles.contactCard} aria-labelledby="help-title">
          <h2 id="help-title">¿Quieres hablar con alguien?</h2>
          <p>
            Puedes llamar a cualquiera de estos números. La atención es confidencial y sin costo.
          </p>
          <div className={styles.contactGrid}>
            {bebiendo.phones.map((phone) => (
              <a className={styles.phone} href={`tel:${formatPhoneHref(phone)}`} key={phone}>
                <PhoneIcon />
                {phone}
              </a>
            ))}
          </div>
          <p className={styles.contactFooter}>6to Distrito · Jiutepec, Morelos</p>
        </section>
      </div>
    </div>
  )
}
