import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/services/**', 'src/data/**'],
      // image.js requiere canvas/WebP: inviable en unit tests (cubierto por QA manual)
      exclude: ['src/utils/image.js'],
      reporter: ['lcov', 'text'],
    },
  },
})
