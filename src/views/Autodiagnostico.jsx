import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import { site } from '../data/site'
import pageStyles from './Page.module.css'
import styles from './Autodiagnostico.module.css'

const PHONE_RE = /^[+()\-.\s\d]{7,20}$/

export default function Autodiagnostico() {
  useDocumentTitle('Autodiagnóstico')

  const [questions, setQuestions] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [retryTick, setRetryTick] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [llamame, setLlamame] = useState(null)
  const [telefono, setTelefono] = useState('')
  const [sending, setSending] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

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
    setLlamame(null)
    setTelefono('')
    setSaved(false)
    setSaveError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const guardar = () => {
    if (llamame === null) {
      setSaveError('Indica si deseas que te llamemos.')
      return
    }
    if (llamame && !PHONE_RE.test(telefono.trim())) {
      setSaveError('Ingresa un teléfono válido (7 a 20 dígitos, puedes usar +, (), - y espacios).')
      return
    }
    if (!questions) return

    setSending(true)
    setSaveError('')

    const payload = {
      respuestas: questions.map((q) => ({
        cuestionario_id: q.id,
        respuesta: answers[q.id] === 'si',
      })),
      llamame,
      ...(llamame ? { telefono: telefono.trim() } : {}),
    }

    api
      .postCuestionario(payload)
      .then(() => {
        setSaved(true)
      })
      .catch((err) => {
        setSaveError(err?.message || 'No se pudo guardar. Intenta de nuevo.')
      })
      .finally(() => {
        setSending(false)
      })
  }

  return (
    <div className={pageStyles.page}>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Autodiagnóstico' }]} />

      <header className={pageStyles.pageHeader}>
        <span className={pageStyles.eyebrow}>Alcohólicos Anónimos</span>
        <h1 className={pageStyles.title}>Autodiagnóstico</h1>
        <p className={pageStyles.lead}>
          Responde estas doce preguntas con <strong>Sí</strong> o <strong>No</strong>. No hay
          respuestas correctas ni incorrectas. Tus respuestas en pantalla no se envían a ningún
          servidor; solo se guardan si decides pedírnoslo al final.
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

          {saved ? (
            <p className={styles.savedNote} role="status">
              {llamame
                ? 'Gracias por tu confianza. Nos pondremos en contacto contigo.'
                : 'Gracias por tu tiempo. Guardamos tus respuestas.'}
            </p>
          ) : (
            <fieldset className={styles.consent}>
              <legend className={styles.consentLegend}>¿Quiere que le llamen?</legend>
              <div className={styles.choices} role="group" aria-label="¿Quiere que le llamen?">
                <label className={styles.choice}>
                  <input
                    type="checkbox"
                    checked={llamame === true}
                    onChange={() => setLlamame((v) => (v === true ? null : true))}
                  />
                  Sí
                </label>
                <label className={styles.choice}>
                  <input
                    type="checkbox"
                    checked={llamame === false}
                    onChange={() => setLlamame((v) => (v === false ? null : false))}
                  />
                  No
                </label>
              </div>
              {llamame === true ? (
                <p className={styles.phoneRow}>
                  <label className={styles.phoneLabel} htmlFor="telefono">
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className={styles.phoneInput}
                    placeholder="777 123 4567"
                    value={telefono}
                    onChange={(event) => setTelefono(event.target.value)}
                  />
                </p>
              ) : null}
              {saveError ? (
                <p className={styles.errorText} role="alert">
                  {saveError}
                </p>
              ) : null}
              <button type="button" className={pageStyles.primaryButton} disabled={sending} onClick={guardar}>
                {sending ? 'Guardando…' : 'Guardar'}
              </button>
            </fieldset>
          )}

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
