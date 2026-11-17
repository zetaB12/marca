import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Librerías aparte: cambian poco y el navegador las conserva en caché entre versiones.
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) return 'gsap'
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return 'react'
        },
      },
    },
  },
})
