import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { reflectionPrompts } from '../data/reflectionsContent'
import { api } from '../services/api'
import { reflectionRoute } from '../utils/links'
import styles from './Reflections.module.css'

// Divide el contenido en bloques separados por líneas vacías. Si la primera
// línea repite exactamente el título, se omite para no duplicarlo.
function splitDescription(text, title) {
  const normalized = String(text || '')
    .replace(/\r\n/g, '\n')
    .trim()

  if (!normalized) return []

  const lines = normalized.split('\n')

  if (title && lines[0].trim() === String(title).trim()) {
    lines.shift()
  }

  return lines
    .join('\n')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
}

export default function StandardReflectionDetail() {
  const { slug = '' } = useParams()
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id') || ''
  const cleanSlug = slug.replace(/\.php$/i, '')
  const identifier = cleanSlug || id

  const [reflection, setReflection] = useState(null)
  const [reflections, setReflections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    // El detalle se pide directamente a la API: el listado ya no incluye
    // la descripción para no inflar el payload.
    api
      .getReflectionDetail(identifier)
      .then((detail) => {
        if (active) {
          setReflection(detail)
          setLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setReflection(null)
          setLoading(false)
        }
      })

    // El listado se usa solo para la navegación "Anterior / Siguiente".
    api
      .getReflections()
      .then((res) => {
        if (active) {
          const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])
          setReflections(list)
        }
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [identifier])

  const reflectionItems = Array.isArray(reflections) ? reflections : []

  useDocumentTitle(reflection?.titulo || (loading ? 'Cargando...' : 'Reflexión no encontrada'))

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
  const prompt = reflectionPrompts[reflection.slogan]
  const blocks = splitDescription(reflection.descripcion, reflection.titulo)
  const hasArticle = blocks.length > 0 || Boolean(prompt)

  const imgPath = reflection.imagen || ''
  const imgSrc = imgPath.startsWith('http') ? imgPath : `/${imgPath.replace(/^\/+/, '')}`

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Reflexiones', to: '/reflexiones' },
          { label: reflection.titulo },
        ]}
      />

      <div className={styles.detailPage}>
        <section className={styles.detailHero}>
          <figure className={styles.detailMedia}>
            <img
              src={imgSrc}
              alt={reflection.alt || reflection.titulo}
              onError={(event) => {
                event.currentTarget.style.visibility = 'hidden'
              }}
            />
          </figure>

          <div className={styles.detailBody}>
            <span className={styles.kicker}>
              {`Pausa y Bienestar${reflection.subtitulo ? ` · ${reflection.subtitulo}` : ''}`}
            </span>
            <h1 className={styles.detailTitle}>{reflection.titulo}</h1>
            <Link className={styles.backLink} to="/reflexiones">
              ← Volver a reflexiones
            </Link>
          </div>
        </section>

        {hasArticle ? (
          <article className={styles.article}>
            <div className={styles.articleBody}>
              {blocks.map((block, index) => (
                <p key={index}>{block}</p>
              ))}
              {prompt ? (
                <div className={styles.promptBox}>
                  <span>Para reflexionar</span>
                  <p>{prompt}</p>
                </div>
              ) : null}
            </div>
          </article>
        ) : null}

        <nav className={styles.prevNext} aria-label="Navegación entre reflexiones">
          {previous ? (
            <Link to={reflectionRoute(previous)}>
              <span>Anterior</span>
              ← {previous.titulo}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link className={styles.next} to={reflectionRoute(next)}>
              <span>Siguiente</span>
              {next.titulo} →
            </Link>
          ) : null}
        </nav>
      </div>
    </div>
  )
}
