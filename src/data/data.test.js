import { describe, it, expect } from 'vitest'
import { committees } from './committees'
import { site, quickLinks } from './site'
import { bebiendo, reflectionPrompts } from './reflectionsContent'

describe('committees (datos)', () => {
  it('es una lista no vacía', () => {
    expect(Array.isArray(committees)).toBe(true)
    expect(committees.length).toBeGreaterThan(0)
  })

  it('cada comité tiene identificador y nombre utilizable en la UI', () => {
    for (const committee of committees) {
      expect(String(committee.id ?? committee.nombre).trim().length).toBeGreaterThan(0)
      expect(String(committee.nombre).trim().length).toBeGreaterThan(0)
    }
  })
})

describe('site (configuración institucional)', () => {
  it('expone los datos de contacto exigidos por el footer', () => {
    expect(site.name).toBeTruthy()
    expect(site.phoneHref).toMatch(/^\+?\d+$/)
    expect(site.phone).toBeTruthy()
    expect(site.nationalPhone).toBeTruthy()
    expect(site.email).toContain('@')
  })

  it('quickLinks apunta a rutas internas del sitio', () => {
    expect(quickLinks.length).toBeGreaterThan(3)
    for (const link of quickLinks) {
      expect(link.label.trim().length).toBeGreaterThan(0)
      expect(link.to).toMatch(/^\//)
    }
  })
})

describe('reflectionsContent (contenido institucional)', () => {
  it('el artículo principal trae todos sus bloques de lectura', () => {
    expect(bebiendo.title).toBeTruthy()
    expect(bebiendo.kicker).toBeTruthy()
    expect(bebiendo.image).toMatch(/\.(jpg|jpeg|png|webp)$/)
    expect(Array.isArray(bebiendo.paragraphs)).toBe(true)
    expect(bebiendo.paragraphs.length).toBeGreaterThan(0)
    expect(bebiendo.quote).toBeTruthy()
    expect(Array.isArray(bebiendo.phones)).toBe(true)
    expect(bebiendo.phones.length).toBeGreaterThan(0)
  })

  it('reflectionPrompts tiene al menos un prompt con texto no vacío', () => {
    const prompts = Object.values(reflectionPrompts)
    expect(prompts.length).toBeGreaterThan(0)
    for (const prompt of prompts) {
      expect(String(prompt).trim().length).toBeGreaterThan(0)
    }
  })
})
