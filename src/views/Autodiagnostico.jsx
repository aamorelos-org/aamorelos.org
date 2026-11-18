import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import { site } from '../data/site'
import pageStyles from './Page.module.css'
import styles from './Autodiagnostico.module.css'

export default function Autodiagnostico() {
  useDocumentTitle('Autodiagnóstico')

  const [questions, setQuestions] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [retryTick, setRetryTick] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    let active = true
    setLoadError('')

    api
      .getCuestionario()
      .then((response) => {
        if (!active) return
        const list = Array.isArray(response?.data) ? response.data : []
        setQuestions(list)
      })
      .catch(() => {
        if (active) {
          setQuestions([])
          setLoadError('No se pudo cargar el cuestionario. Intenta de nuevo más tarde.')
        }
      })

    return () => {
      active = false
    }
  }, [retryTick])

  const total = questions?.length ?? 0
  const answeredCount = questions ? questions.filter((q) => answers[q.id]).length : 0
  const allAnswered = total > 0 && answeredCount === total
  const siCount = questions ? questions.filter((q) => answers[q.id] === 'si').length : 0
  const noCount = questions ? questions.filter((q) => answers[q.id] === 'no').length : 0

  const answer = (id, value) => {
    setAnswers((prev) => {
      const next = { ...prev }
      if (next[id] === value) {
        delete next[id]
      } else {
        next[id] = value
      }
      return next
    })
  }

  const reset = () => {
    setAnswers({})
    setShowResult(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={pageStyles.page}>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Autodiagnóstico' }]} />

      <header className={pageStyles.pageHeader}>
        <span className={pageStyles.eyebrow}>Alcohólicos Anónimos</span>
        <h1 className={pageStyles.title}>Autodiagnóstico</h1>
        <p className={pageStyles.lead}>
          Responde estas doce preguntas con <strong>Sí</strong> o <strong>No</strong>. No hay
          respuestas correctas ni incorrectas. Tus respuestas no se guardan ni se envían a ningún
          servidor.
        </p>
      </header>

      {questions === null ? (
        <p className={pageStyles.prose}>Cargando cuestionario…</p>
      ) : loadError ? (
        <div className={pageStyles.prose}>
          <p>{loadError}</p>
          <p>
            <button type="button" className={pageStyles.primaryButton} onClick={() => setRetryTick((t) => t + 1)}>
              Reintentar
            </button>
          </p>
        </div>
      ) : showResult ? (
        <div className={styles.result}>
          <h2 className={styles.resultTitle}>Tu resultado</h2>
          <p className={styles.resultScore}>SÍ : {siCount}</p>
          <p className={styles.resultScore}>No : {noCount}</p>

          <p>
            <strong>¿Contestó que SÍ cuatro o más veces?</strong>
          </p>
          <p>
            Si es así, probablemente tenga problemas con el alcohol. ¿Por qué decimos esto? Porque
            miles de personas en A.A. han dicho exactamente eso durante muchos años. Descubrieron la
            verdad sobre sí mismos, de la forma más dura.
          </p>
          <p>
            <strong>Dé el siguiente paso.</strong>
          </p>
          <p>
            Puede llamar a una oficina local de A.A. para hacer más preguntas o para conversar con un
            miembro de A.A. También puede asistir a una reunión en persona o en línea.
          </p>

          <div className={pageStyles.ctaRow}>
            <a className={pageStyles.primaryButton} href={`tel:${site.phoneHref}`}>
              Llamar a la oficina local ({site.phone})
            </a>
            <Link className={pageStyles.secondaryButton} to="/pages/grupos/grupos.php">
              Ver grupos y reuniones
            </Link>
          </div>

          <p>
            <button type="button" className={styles.resetButton} onClick={reset}>
              Contestar de nuevo
            </button>
          </p>
        </div>
      ) : (
        <>
          <form className={styles.list} onSubmit={(event) => event.preventDefault()}>
            {questions.map((question, index) => (
              <fieldset key={question.id} className={styles.row}>
                <legend className={styles.legend}>
                  {index + 1}. {question.pregunta}
                </legend>
                <p className={styles.description}>{question.descripcion}</p>
                <div className={styles.choices} role="group" aria-label={`Pregunta ${index + 1}`}>
                  <label className={styles.choice}>
                    <input
                      type="checkbox"
                      checked={answers[question.id] === 'si'}
                      onChange={() => answer(question.id, 'si')}
                    />
                    Sí
                  </label>
                  <label className={styles.choice}>
                    <input
                      type="checkbox"
                      checked={answers[question.id] === 'no'}
                      onChange={() => answer(question.id, 'no')}
                    />
                    No
                  </label>
                </div>
              </fieldset>
            ))}
          </form>

          <p className={styles.progress} aria-live="polite">
            Contestadas {answeredCount} de {total}
          </p>
          <button
            type="button"
            className={pageStyles.primaryButton}
            disabled={!allAnswered}
            onClick={() => {
              setShowResult(true)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            Ver mi resultado
          </button>
        </>
      )}
    </div>
  )
}
