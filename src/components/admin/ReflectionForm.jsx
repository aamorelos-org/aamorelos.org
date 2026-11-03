import { useMemo, useState } from 'react'
import { api } from '../../services/api'

const emptyForm = {
  slug: '',
  title: '',
  subtitle: '',
  image: '',
  description: '',
}

function toSlug(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_{2,}/g, '_')
}

export default function ReflectionForm({ onClose, onCreated }) {
  const [form, setForm] = useState(emptyForm)
  const [imageName, setImageName] = useState('')
  const [imageError, setImageError] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('access_token') : ''

  const previewSrc = useMemo(() => {
    const value = form.image.trim()
    if (!value) return ''
    if (value.startsWith('data:image/')) return value
    return `data:image/jpeg;base64,${value.replace(/\s/g, '')}`
  }, [form.image])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setFormError('')
  }

  const handleImageFile = (event) => {
    const file = event.target.files?.[0]
    setImageError('')
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImageError('Selecciona un archivo de imagen válido.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('La imagen supera 5 MB. Selecciona una imagen más ligera.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result || '')
      setForm((current) => ({ ...current, image: dataUrl.split(',')[1] || '' }))
      setImageName(file.name)
    }
    reader.onerror = () => setImageError('No se pudo leer la imagen seleccionada.')
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')

    const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]))

    if (Object.values(payload).some((value) => !value)) {
      setFormError('Todos los campos son obligatorios.')
      setSaving(false)
      return
    }

    try {
      const response = await api.createReflection(payload)
      if (response?.ok === false) {
        throw new Error(response.message || response.error || 'La API rechazó el registro.')
      }

      setForm(emptyForm)
      setImageName('')
      await onCreated?.()
    } catch (err) {
      setFormError(err.message || 'No se pudo registrar la reflexión.')
    } finally {
      setSaving(false)
    }
  }

  const clearImage = () => {
    updateField('image', '')
    setImageName('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => updateField('slug', toSlug(form.title))}
          disabled={!form.title.trim()}
          className="rounded-md px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-40 dark:text-purple-300 dark:hover:bg-purple-950/40"
        >
          Sugerir slug desde el título
        </button>
      </div>

      <div className="mt-2 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="reflection-title" className="text-sm font-medium text-slate-700 dark:text-slate-200">Título *</label>
          <input id="reflection-title" type="text" required value={form.title} onChange={(event) => updateField('title', event.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Más Allá de la Fiesta: El Verdadero Rostro del Alcoholismo" />
        </div>

        <div>
          <label htmlFor="reflection-slug" className="text-sm font-medium text-slate-700 dark:text-slate-200">Slug *</label>
          <input id="reflection-slug" type="text" required value={form.slug} onChange={(event) => updateField('slug', event.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="mas_alla_fiesta" />
        </div>

        <div>
          <label htmlFor="reflection-subtitle" className="text-sm font-medium text-slate-700 dark:text-slate-200">Subtítulo *</label>
          <input id="reflection-subtitle" type="text" required value={form.subtitle} onChange={(event) => updateField('subtitle', event.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="No estás liberando estrés" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="reflection-image-file" className="text-sm font-medium text-slate-700 dark:text-slate-200">Imagen *</label>
          <input id="reflection-image-file" type="file" accept="image/*" onChange={handleImageFile} className="mt-1 block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-purple-700 dark:text-slate-300 dark:file:bg-purple-500 dark:hover:file:bg-purple-400" />
          {imageName ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Archivo seleccionado: {imageName} · {form.image.length.toLocaleString()} caracteres</p> : null}
          {imageError ? <p role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">{imageError}</p> : null}
          {previewSrc ? (
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 p-2 dark:border-slate-800">
              <img src={previewSrc} alt="Vista previa de la reflexión" onError={(eventImage) => { eventImage.currentTarget.style.display = 'none' }} className="h-16 w-24 rounded-md object-cover" />
              <button type="button" onClick={clearImage} className="text-xs font-semibold text-red-600 hover:underline dark:text-red-400">Quitar imagen</button>
            </div>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="reflection-description" className="text-sm font-medium text-slate-700 dark:text-slate-200">Descripción *</label>
          <textarea id="reflection-description" required value={form.description} onChange={(event) => updateField('description', event.target.value)} className="mt-1 block min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Para los que pertenecemos a Alcohólicos Anónimos..." />
        </div>
      </div>

      {formError ? <div role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{formError}</div> : null}

      <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving || !token}
          className="rounded-md bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-purple-500 dark:hover:bg-purple-400"
        >
          {saving ? 'Registrando…' : 'Registrar reflexión'}
        </button>
      </div>
    </form>
  )
}
