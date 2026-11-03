export const eventDetails = {
  '32_semana_nacional': {
    slug: '32_semana_nacional',
    title: '32ª Semana Nacional de Información',
    subtitle: 'Compartiendo Esfuerzos',
    image: 'images/events/32_semana_nacional_informacion.jpg',
    alt: '32ª Semana Nacional de Información',
    footer: 'Área Morelos · Central Mexicana de Servicios Generales de A.A.',
    paragraphs: [
      'La Semana Nacional de Información "Compartiendo Esfuerzos" es un esfuerzo coordinado a nivel nacional para llevar el mensaje de recuperación del alcoholismo a instituciones públicas, educativas, de salud y al público en general.',
      'Durante este periodo se realizan pláticas, conferencias y distribución de literatura sobre la enfermedad del alcoholismo y la solución que ofrece el programa de recuperación de Alcohólicos Anónimos.',
    ],
  },
  '57_aniversario_oficinas': {
    slug: '57_aniversario_oficinas',
    title: '57° Aniversario de Oficinas Generales',
    subtitle: 'Servicio, unidad y recuperación',
    image: 'images/events/57_aniversario_oficinas_generales.jpeg',
    alt: '57° Aniversario de Oficinas Generales',
    footer: 'Área Morelos · Central Mexicana de Servicios Generales de A.A.',
    paragraphs: [
      'Conmemoramos el 57° aniversario de la fundación de las Oficinas Generales de Alcohólicos Anónimos. Sede: Auditorio 1 de la Unidad de Congresos del Centro Médico Nacional Siglo XXI del IMSS, Ciudad de México.',
      'Servicios de apoyo, coordinación y distribución de literatura para todos los grupos y áreas del país. Celebramos años de servicio ininterrumpido guiados por los principios de unidad, servicio y recuperación.',
    ],
  },
  seminario_tradiciones_5to_distrito: {
    slug: 'seminario_tradiciones_5to_distrito',
    title: 'Seminario de Tradiciones · 5° Distrito',
    subtitle: 'Tradiciones, servicio y amor: avanzando en mi recuperación',
    image: 'images/events/seminario_tradiciones_5to_distrito.jpg',
    alt: 'Seminario de Tradiciones del 5° Distrito',
    footer: 'Área Morelos · 5° Distrito',
    paragraphs: [
      'El 5° Distrito invita a toda la comunidad a participar en el Seminario de Tradiciones, un espacio dedicado al análisis profundo de las Doce Tradiciones de Alcohólicos Anónimos, pilares que garantizan la unidad y supervivencia de nuestros grupos.',
      'Consulta los horarios, sedes y ponentes participantes en la convocatoria oficial.',
    ],
  },
  taller_libro_grande_4t0_distrito: {
    slug: 'taller_libro_grande_4t0_distrito',
    title: 'Taller del Libro Grande · 4° Distrito',
    subtitle: 'Servicio: gratitud y responsabilidad',
    image: 'images/events/taller_libro_grande_4t0_distrito.jpg',
    alt: 'Taller del Libro Grande del 4° Distrito',
    footer: 'Área Morelos · 4° Distrito',
    paragraphs: [
      'El 4° Distrito organiza el Taller del Libro Grande, enfocado en el estudio detallado del texto fundamental de Alcohólicos Anónimos para fortalecer la vivencia personal del programa de recuperación.',
      'Un espacio de intercambio de experiencia, fortaleza y esperanza entre compañeros.',
    ],
  },
}

export function getEventDetail(slug) {
  return eventDetails[slug] || null
}
