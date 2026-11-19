# aamorelos.org

Sitio público de **Alcohólicos Anónimos — 6to Distrito Área Morelos**. Contenido institucional,
grupos y distritos (con búsqueda y filtros), eventos, reflexiones (diaria y por secciones),
comités y el autodiagnóstico de AA. SPA estática construida con Vite y publicada como sitio
web estático (deploy manual a `public_html` del servidor).

## Stack

| Capa | Tecnología |
| --- | --- |
| Lenguaje | JavaScript (JSX) |
| Framework | React 19 |
| Bundler / dev server | Vite 8 |
| Routing | React Router DOM v7 (rutas legadas `*.php` traducidas a SPA) |
| Estilos | Tailwind CSS v4 (plugin `@tailwindcss/vite`) + CSS Modules + `styles/global.css` |
| Cliente HTTP | Centralizado en `src/services/api.js` (fetch + `API_URL`) |
| Saneamiento HTML | DOMPurify (para `dangerouslySetInnerHTML` con allowlist) |
| Tests | Vitest + jsdom (`src/**/*.test.js`) |
| Linter | oxlint (`react`, `oxc`) |
| Cobertura/Sonar | `vitest run --coverage` → `coverage/lcov.info` → SonarQube local |

## Estructura

```
src/
├── App.jsx               # Enrutador raíz (export function App)
├── main.jsx              # Entry point
├── index.css / styles/
├── components/
│   ├── layout/           # Layout, Header, Navbar, Footer, Breadcrumb, ScrollToTop
│   └── ui/               # Carousel, EventCard, ReflectionCard, Pagination, States…
├── views/                # Páginas: Home, Info, Groups, Districts, Events, Reflections…
├── hooks/                # useDocumentTitle
├── services/api.js       # Cliente de la API (api.getStateGroups, api.getEvents…)
├── data/                 # Contenido estático: site, committees, reflectionsContent
├── utils/                # normalizeText/matchesRecord, toSlug, renderRichText, annotation, image
└── assets/               # Imágenes estáticas (hero.png…)
```

## Variables de entorno

La app lee `VITE_API_URL` (base de la API pública). Por defecto usa `https://api.aamorelos.org`.
Ver `.env.example` para la línea exacta:

```bash
VITE_API_URL=https://api.aamorelos.org
```

Copia `.env.example` a `.env.local` para apuntar a un backend local o de staging
(`.env.local` está descartado por git; `.env` y `.env.local` no deberían compartir secretos, el sitio
sólo consume datos públicos).

## Comandos

```bash
npm ci                  # instalar dependencias (máquina limpia)
npm install             # instalar/actualizar de forma normal
npm run dev             # dev server de Vite (HMR)
npm run build           # build de producción → dist/
npm run preview         # previsualizar dist/ localmente
npm test                # pruebas unitarias (vitest)
npm run coverage        # pruebas con cobertura → coverage/lcov.info
npm run lint            # oxlint
npm run sonar           # análisis SonarQube (requiere SONAR_TOKEN, ver sonar-project.properties)
```

## Calidad

SonarQube (`sonar-project.properties`) reporta sólo la cobertura "honesta" posible en una
SPA sin tests de UI: se excluyen del cálculo las vistas, los componentes, los hooks y los
entry points (`src/views/**`, `src/components/**`, `src/hooks/**`, `App.jsx`, `main.jsx`,
`utils/image.js`). El `utils`/`services` y la lógica de parseo se miden al 100%.

La ejecución de SonarQube es manual:

```bash
set SONAR_TOKEN=<token del desarrollador>
npm run coverage
npm run sonar
```

## Convenciones

- Named exports (`export function X`) sobre `export default` (React Server/Vite no la exigen aquí).
- `CONSTANT_CASE` para constantes globales inmutables; `camelCase` para variables/funciones; `PascalCase` para componentes/tipos.
- Comentarios en español, sólo cuando aportan (propósito o contrato); el código debe ser autoexplicativo.
- La API devuelve `snake_case`; los mappers y `.php` legados viven en `src/utils/links.js` y `src/services/api.js`.
