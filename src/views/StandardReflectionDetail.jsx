import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { reflectionPrompts } from '../data/reflectionsContent'
import { api } from '../services/api'
import { reflectionRoute } from '../utils/links'
import styles from './Reflections.module.css'

export default function StandardReflectionDetail() {
  const { slug = '' } = useParams()
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id') || ''
  const cleanSlug = slug.replace(/\.php$/i, '')

  const [reflections, setReflections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api.getReflections()
      .then((res) => {
        if (active) {
          const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])
          setReflections(list)
          setLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const reflectionItems = Array.isArray(reflections) ? reflections : []
  const reflection = reflectionItems.find((item) => {
    if (cleanSlug && item.slug === cleanSlug) {
      return true
    }
    return id && String(item.id) === id
  })

  useDocumentTitle(reflection?.title || (loading ? 'Cargando...' : 'Reflexión no encontrada'))

  if (loading) {
    return (
      <div className={styles.warmPage} style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p>Cargando reflexión...</p>
      </div>
    )
  }

  if (!reflection) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Reflexiones', to: '/reflexiones' }, { label: 'Reflexión no encontrada' }]} />
        <div className={styles.notFound}>
          <h1>Reflexión no encontrada</h1>
          <p>La reflexión solicitada no existe o no está disponible.</p>
          <Link to="/reflexiones">Volver a reflexiones</Link>
        </div>
      </div>
    )
  }

  const index = reflectionItems.findIndex((item) => String(item.id) === String(reflection.id))
  const previous = index > 0 ? reflectionItems[index - 1] : null
  const next = index >= 0 && index < reflectionItems.length - 1 ? reflectionItems[index + 1] : null
  const prompt = reflectionPrompts[reflection.slug]

  const imgPath = reflection.image || ''
  const imgSrc = imgPath.startsWith('http') ? imgPath : `/${imgPath.replace(/^\/+/, '')}`

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Reflexiones', to: '/reflexiones' },
          { label: reflection.title },
        ]}
      />

      <div className={styles.detailPage}>
        <section className={styles.detailHero}>
          <figure className={styles.detailMedia}>
            <img
              src={imgSrc}
              alt={reflection.alt || reflection.title}
              onError={(event) => {
                event.currentTarget.style.visibility = 'hidden'
              }}
            />
          </figure>

          <div className={styles.detailBody}>
            <span className={styles.kicker}>
              {`Pausa y Bienestar${reflection.subtitle ? ` · ${reflection.subtitle}` : ''}`}
            </span>
            <h1 className={styles.detailTitle}>{reflection.title}</h1>
            <p className={styles.description}>{reflection.description}</p>
            <Link className={styles.backLink} to="/reflexiones">
              ← Volver a reflexiones
            </Link>
          </div>
        </section>

        <article className={styles.article}>
          <div className={styles.articleBody}>
            <p>{reflection.description}</p>
            {prompt ? (
              <div className={styles.promptBox}>
                <span>Para reflexionar</span>
                <p>{prompt}</p>
              </div>
            ) : null}
          </div>
        </article>

        <nav className={styles.prevNext} aria-label="Navegación entre reflexiones">
          {previous ? (
            <Link to={reflectionRoute(previous)}>
              <span>Anterior</span>
              ← {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link className={styles.next} to={reflectionRoute(next)}>
              <span>Siguiente</span>
              {next.title} →
            </Link>
          ) : null}
        </nav>
      </div>
    </div>
  )
}
