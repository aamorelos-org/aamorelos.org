import { useEffect, useMemo, useState } from 'react'
import { api } from '../../services/api'
import { fileToWebpBase64, MAX_IMAGE_BYTES } from '../../utils/image'
import { toSlug } from '../../utils/text'
import GroupMultiSelect from './GroupMultiSelect'

// El backend (POST /aa/api/v1/eventos/) discrimina por `tipo` y acepta
// únicamente estos dos valores, cada uno con su propio set de campos.
const TIPOS = [
  { value: 'informativo', label: 'Informativo', hint: 'Noticias y convocatorias.' },
  { value: 'aniversario', label: 'Aniversario', hint: 'Sede, agenda de días y contacto.' },
]

const emptyForm = {
  tipo: 'informativo',
  slogan: '',
  titulo: '',
  subtitulo: '',
  pie: '',
  imagen: '',
  parrafo1: '',
  parrafo2: '',
  epigrafe: '',
  kicker: '',
  frase_reflexion: '',
  sede: '',
  dias_unidad: '',
  junta_publica: '',
  contacto_nombre: '',
  contacto_telefono: '',
}

const emptyDia = {
  dia: '',
  tema: '',
  fecha: '',
  grupos: [],
  numero: '',
  es_junta_publica: false,
}

const LABELS = {
  slogan: 'Slug',
  titulo: 'Título',
  imagen: 'Imagen',
  subtitulo: 'Subtítulo',
  pie: 'Pie de imagen',
  parrafo1: 'Párrafo 1',
  parrafo2: 'Párrafo 2',
  epigrafe: 'Epígrafe',
  kicker: 'Kicker',
  frase_reflexion: 'Frase de reflexión',
  sede: 'Sede',
  dias_unidad: 'Días de unidad',
  junta_publica: 'Junta pública',
  contacto_nombre: 'Nombre de contacto',
  contacto_telefono: 'Teléfono de contacto',
}

// maxLength declarados en el OpenAPI del backend.
const LIMITS = {
  slogan: 100,
  titulo: 255,
  subtitulo: 255,
  pie: 255,
  parrafo1: 10000,
  parrafo2: 10000,
  kicker: 100,
  sede: 100,
  dias_unidad: 100,
  junta_publica: 100,
  contacto_nombre: 100,
  contacto_telefono: 100,
}

const COMMON_REQUIRED = ['slogan', 'titulo', 'imagen']
const ANIVERSARIO_REQUIRED = [
  'epigrafe',
  'kicker',
  'frase_reflexion',
  'sede',
  'dias_unidad',
  'junta_publica',
  'contacto_nombre',
  'contacto_telefono',
]

const DIA_LABELS = { dia: 'Día', tema: 'Tema', fecha: 'Fecha', grupos: 'Grupos', numero: 'Número' }
const DIA_LIMITS = { dia: 100, tema: 100, fecha: 100, grupos: 255, numero: 2 }

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

function validate(form, dias) {
  const required =
    form.tipo === 'aniversario' ? [...COMMON_REQUIRED, ...ANIVERSARIO_REQUIRED] : COMMON_REQUIRED

  for (const field of required) {
    if (!String(form[field] || '').trim()) {
      return `${LABELS[field]} es obligatorio.`
    }
  }

  for (const [field, max] of Object.entries(LIMITS)) {
    const length = String(form[field] || '').trim().length
    if (length > max) {
      return `${LABELS[field]} supera los ${max} caracteres (${length}).`
    }
  }

  if (form.tipo !== 'aniversario') {
    return ''
  }

  for (let index = 0; index < dias.length; index += 1) {
    const dia = dias[index]
    const prefix = `Día ${index + 1}`

    for (const field of ['dia', 'tema', 'fecha', 'numero']) {
      const value = String(dia[field] || '').trim()

      if (!value) {
        return `${prefix}: ${DIA_LABELS[field]} es obligatorio.`
      }

      if (value.length > DIA_LIMITS[field]) {
        return `${prefix}: ${DIA_LABELS[field]} supera los ${DIA_LIMITS[field]} caracteres.`
      }
    }

    if (!Array.isArray(dia.grupos) || dia.grupos.length === 0) {
      return `${prefix}: ${DIA_LABELS.grupos} es obligatorio.`
    }

    const gruposTexto = String(dia.grupos.join(', ')).trim()
    if (gruposTexto.length > DIA_LIMITS.grupos) {
      return `${prefix}: ${DIA_LABELS.grupos} supera los ${DIA_LIMITS.grupos} caracteres.`
    }
  }

  return ''
}

function buildPayload(form, dias) {
  const clean = (field) => String(form[field] || '').trim()

  const payload = {
    tipo: form.tipo,
    slogan: clean('slogan'),
    titulo: clean('titulo'),
    imagen: clean('imagen'),
  }

  if (clean('subtitulo')) payload.subtitulo = clean('subtitulo')
  if (clean('pie')) payload.pie = clean('pie')

  if (form.tipo === 'informativo') {
    if (clean('parrafo1')) payload.parrafo1 = clean('parrafo1')
    if (clean('parrafo2')) payload.parrafo2 = clean('parrafo2')
    return payload
  }

  for (const field of ANIVERSARIO_REQUIRED) {
    payload[field] = clean(field)
  }

  payload.dias = dias.map((dia) => ({
    dia: dia.dia.trim(),
    tema: dia.tema.trim(),
    fecha: dia.fecha.trim(),
    grupos: (Array.isArray(dia.grupos) ? dia.grupos.join(', ') : '').trim(),
    numero: dia.numero.trim(),
    es_junta_publica: Boolean(dia.es_junta_publica),
  }))

  return payload
}

export default function EventForm({ onClose, onCreated }) {
  const [form, setForm] = useState(emptyForm)
  const [dias, setDias] = useState([])
  const [groups, setGroups] = useState([])
  const [groupsLoading, setGroupsLoading] = useState(true)
  const [imageName, setImageName] = useState('')
  const [imageError, setImageError] = useState('')
  const [converting, setConverting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('access_token') : ''

  const esAniversario = form.tipo === 'aniversario'

  useEffect(() => {
    let active = true

    api
      .getGroups()
      .then((res) => {
        if (active) {
          const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])
          setGroups(list)
          setGroupsLoading(false)
        }
      })
      .catch(() => {
        if (active) setGroupsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const previewSrc = useMemo(() => {
    const value = form.imagen.trim()
    if (!value) return ''
    if (value.startsWith('data:image/')) return value
    return `data:image/webp;base64,${value.replace(/\s/g, '')}`
  }, [form.imagen])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setFormError('')
  }

  const updateDia = (index, field, value) => {
    setDias((current) => current.map((dia, i) => (i === index ? { ...dia, [field]: value } : dia)))
    setFormError('')
  }

  const addDia = () => {
    setDias((current) => [...current, { ...emptyDia }])
    setFormError('')
  }

  const removeDia = (index) => {
    setDias((current) => current.filter((_, i) => i !== index))
    setFormError('')
  }

  const handleImageFile = async (event) => {
    const file = event.target.files?.[0]
    setImageError('')
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImageError('Selecciona un archivo de imagen válido.')
      return
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError('La imagen supera 5 MB. Selecciona una imagen más ligera.')
      return
    }

    setConverting(true)
    try {
      const base64 = await fileToWebpBase64(file)
      if (!base64) {
        throw new Error('No se pudo convertir la imagen a WebP.')
      }
      setForm((current) => ({ ...current, imagen: base64 }))
      setImageName(file.name)
    } catch (err) {
      setForm((current) => ({ ...current, imagen: '' }))
      setImageName('')
      setImageError(err.message || 'No se pudo convertir la imagen a WebP.')
    } finally {
      setConverting(false)
      // Permite volver a seleccionar el mismo archivo tras un error.
      event.target.value = ''
    }
  }

  const clearImage = () => {
    updateField('imagen', '')
    setImageName('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')

    const error = validate(form, dias)
    if (error) {
      setFormError(error)
      setSaving(false)
      return
    }

    try {
      const response = await api.createEvent(buildPayload(form, dias))
      if (response?.ok === false) {
        throw new Error(response.mensaje || response.message || response.error || 'La API rechazó el registro.')
      }

      setForm(emptyForm)
      setDias([])
      setImageName('')
      await onCreated?.()
    } catch (err) {
      setFormError(err.message || 'No se pudo registrar el evento.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white'

  const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-200'

  const renderField = (field, { span = false, textarea = false, placeholder = '' } = {}) => (
    <div className={span ? 'sm:col-span-2' : ''}>
      <label htmlFor={`event-${field}`} className={labelClass}>
        {LABELS[field]}
        {COMMON_REQUIRED.includes(field) || (esAniversario && ANIVERSARIO_REQUIRED.includes(field)) ? ' *' : ''}
      </label>
      {textarea ? (
        <textarea
          id={`event-${field}`}
          value={form[field]}
          maxLength={LIMITS[field]}
          onChange={(e) => updateField(field, e.target.value)}
          className={`${inputClass} min-h-24`}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={`event-${field}`}
          type="text"
          value={form[field]}
          maxLength={LIMITS[field]}
          onChange={(e) => updateField(field, e.target.value)}
          className={inputClass}
          placeholder={placeholder}
        />
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend className={`${labelClass} mb-2`}>Tipo de evento *</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {TIPOS.map((tipo) => {
            const active = form.tipo === tipo.value
            return (
              <button
                key={tipo.value}
                type="button"
                onClick={() => updateField('tipo', tipo.value)}
                aria-pressed={active}
                className={`rounded-lg border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  active
                    ? 'border-purple-600 bg-purple-50 dark:border-purple-400 dark:bg-purple-950/40'
                    : 'border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600'
                }`}
              >
                <span className={`block text-sm font-semibold ${active ? 'text-purple-700 dark:text-purple-300' : 'text-slate-800 dark:text-slate-100'}`}>
                  {tipo.label}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{tipo.hint}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => updateField('slogan', toSlug(form.titulo))}
          disabled={!form.titulo.trim()}
          className="rounded-md px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-40 dark:text-purple-300 dark:hover:bg-purple-950/40"
        >
          Sugerir slug desde el título
        </button>
      </div>

      <div className="mt-2 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="event-titulo" className={labelClass}>Título *</label>
          <input
            id="event-titulo"
            type="text"
            required
            maxLength={LIMITS.titulo}
            value={form.titulo}
            onChange={(e) => updateField('titulo', e.target.value)}
            className={inputClass}
            placeholder="Seminario de Tradiciones — 5º Distrito"
          />
        </div>

        <div>
          <label htmlFor="event-slogan" className={labelClass}>Slug *</label>
          <input
            id="event-slogan"
            type="text"
            required
            maxLength={LIMITS.slogan}
            value={form.slogan}
            onChange={(e) => updateField('slogan', e.target.value)}
            className={`${inputClass} font-mono`}
            placeholder="seminario_tradiciones_5to_distrito"
          />
        </div>

        <div>
          <label htmlFor="event-subtitulo" className={labelClass}>Subtítulo</label>
          <input
            id="event-subtitulo"
            type="text"
            maxLength={LIMITS.subtitulo}
            value={form.subtitulo}
            onChange={(e) => updateField('subtitulo', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="event-imagen-file" className={labelClass}>Imagen *</label>
          <input
            id="event-imagen-file"
            type="file"
            accept="image/*"
            required
            onChange={handleImageFile}
            disabled={converting}
            className="mt-1 block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-300 dark:file:bg-purple-500 dark:hover:file:bg-purple-400"
          />
          {converting ? <p role="status" className="mt-1 text-xs text-slate-600 dark:text-slate-300">Convirtiendo a WebP…</p> : null}
          {imageName && !converting ? (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Archivo seleccionado: {imageName} · {form.imagen.length.toLocaleString()} caracteres
            </p>
          ) : null}
          {imageError ? <p role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">{imageError}</p> : null}
          {previewSrc && !converting ? (
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 p-2 dark:border-slate-800">
              <img
                src={previewSrc}
                alt="Vista previa del evento"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
                className="h-16 w-24 rounded-md object-cover"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">WebP listo para guardar</span>
              <button type="button" onClick={clearImage} className="ml-auto text-xs font-semibold text-red-600 hover:underline dark:text-red-400">
                Quitar imagen
              </button>
            </div>
          ) : null}
        </div>

        <div>
          <label htmlFor="event-pie" className={labelClass}>Pie de imagen</label>
          <input
            id="event-pie"
            type="text"
            maxLength={LIMITS.pie}
            value={form.pie}
            onChange={(e) => updateField('pie', e.target.value)}
            className={inputClass}
            placeholder="Área Morelos — 5º Distrito"
          />
        </div>
      </div>

      {!esAniversario ? (
        <div className="mt-4 grid gap-4">
          {renderField('parrafo1', { textarea: true, placeholder: 'Primera línea de la publicación…' })}
          {renderField('parrafo2', { textarea: true, placeholder: 'Segunda línea de la publicación…' })}
        </div>
      ) : (
        <div className="mt-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Contenido del aniversario
          </h4>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="event-epigrafe" className={labelClass}>Epígrafe *</label>
              <input
                id="event-epigrafe"
                type="text"
                required
                value={form.epigrafe}
                onChange={(e) => updateField('epigrafe', e.target.value)}
                className={inputClass}
                placeholder="57º Aniversario de Oficinas Generales"
              />
            </div>

            <div>
              <label htmlFor="event-kicker" className={labelClass}>Kicker *</label>
              <input
                id="event-kicker"
                type="text"
                required
                maxLength={LIMITS.kicker}
                value={form.kicker}
                onChange={(e) => updateField('kicker', e.target.value)}
                className={inputClass}
                placeholder="Aniversario"
              />
            </div>

            <div>
              <label htmlFor="event-sede" className={labelClass}>Sede *</label>
              <input
                id="event-sede"
                type="text"
                required
                maxLength={LIMITS.sede}
                value={form.sede}
                onChange={(e) => updateField('sede', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="event-frase_reflexion" className={labelClass}>Frase de reflexión *</label>
              <textarea
                id="event-frase_reflexion"
                required
                value={form.frase_reflexion}
                onChange={(e) => updateField('frase_reflexion', e.target.value)}
                className={`${inputClass} min-h-20`}
              />
            </div>

            <div>
              <label htmlFor="event-dias_unidad" className={labelClass}>Días de unidad *</label>
              <input
                id="event-dias_unidad"
                type="text"
                required
                maxLength={LIMITS.dias_unidad}
                value={form.dias_unidad}
                onChange={(e) => updateField('dias_unidad', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="event-junta_publica" className={labelClass}>Junta pública *</label>
              <input
                id="event-junta_publica"
                type="text"
                required
                maxLength={LIMITS.junta_publica}
                value={form.junta_publica}
                onChange={(e) => updateField('junta_publica', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="event-contacto_nombre" className={labelClass}>Nombre de contacto *</label>
              <input
                id="event-contacto_nombre"
                type="text"
                required
                maxLength={LIMITS.contacto_nombre}
                value={form.contacto_nombre}
                onChange={(e) => updateField('contacto_nombre', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="event-contacto_telefono" className={labelClass}>Teléfono de contacto *</label>
              <input
                id="event-contacto_telefono"
                type="text"
                required
                maxLength={LIMITS.contacto_telefono}
                value={form.contacto_telefono}
                onChange={(e) => updateField('contacto_telefono', e.target.value)}
                className={inputClass}
                placeholder="55 1234 5678"
              />
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
            <div className="flex items-center justify-between gap-3">
              <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Agenda de días {dias.length ? `(${dias.length})` : ''}
              </h5>
              <button
                type="button"
                onClick={addDia}
                className="rounded-md border border-purple-300 px-3 py-1.5 text-xs font-semibold text-purple-700 transition hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950/40"
              >
                + Agregar día
              </button>
            </div>

            {dias.length === 0 ? (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Sin días programados. Puedes dejarla vacía o agregar la agenda.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {dias.map((dia, index) => (
                  <li key={index} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Día {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeDia(index)}
                        className="text-xs font-semibold text-red-600 hover:underline dark:text-red-400"
                      >
                        Quitar
                      </button>
                    </div>

                    <div className="mt-2 grid gap-3 sm:grid-cols-2">
                      {['dia', 'tema', 'fecha', 'numero', 'grupos'].map((field) => (
                        <div key={field}>
                          <label htmlFor={`dia-${index}-${field}`} className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            {DIA_LABELS[field]} *
                          </label>
                          {field === 'dia' ? (
                            <select
                              id={`dia-${index}-dia`}
                              required
                              value={dia.dia}
                              onChange={(e) => updateDia(index, 'dia', e.target.value)}
                              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            >
                              <option value="">Seleccionar día</option>
                              {DIAS_SEMANA.map((d) => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                          ) : field === 'fecha' ? (
                            <input
                              id={`dia-${index}-fecha`}
                              type="date"
                              required
                              maxLength={DIA_LIMITS.fecha}
                              value={dia.fecha}
                              onChange={(e) => {
                                const v = e.target.value
                                updateDia(index, 'fecha', v)
                                // Numero = día del mes (ej. 2026-12-08 → "08")
                                updateDia(index, 'numero', v ? String(v).slice(-2) : '')
                              }}
                              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                          ) : field === 'numero' ? (
                            <input
                              id={`dia-${index}-numero`}
                              type="text"
                              required
                              maxLength={DIA_LIMITS.numero}
                              value={dia.numero}
                              readOnly
                              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                          ) : field === 'grupos' ? (
                            <GroupMultiSelect
                              id={`dia-${index}-grupos`}
                              value={Array.isArray(dia.grupos) ? dia.grupos : []}
                              onChange={(v) => updateDia(index, 'grupos', v)}
                              groups={groups}
                              disabled={saving || groupsLoading}
                            />
                          ) : (
                            <input
                              id={`dia-${index}-${field}`}
                              type="text"
                              required
                              maxLength={DIA_LIMITS[field]}
                              value={dia[field]}
                              onChange={(e) => updateDia(index, field, e.target.value)}
                              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                          )}
                        </div>
                      ))}

                      <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-700 dark:text-slate-200">
                        <input
                          type="checkbox"
                          checked={dia.es_junta_publica}
                          onChange={(e) => updateDia(index, 'es_junta_publica', e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                        />
                        ¿Es junta pública?
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {formError ? (
        <div role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {formError}
        </div>
      ) : null}

      <div className="mt-5 flex flex-col-reverse items-stretch justify-end gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-md border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving || converting || !token}
          className="w-full rounded-md bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-purple-500 dark:hover:bg-purple-400 sm:w-auto"
        >
          {saving ? 'Registrando…' : converting ? 'Convirtiendo…' : 'Registrar evento'}
        </button>
      </div>
    </form>
  )
}
