import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * Inserta en <head> las metaetiquetas de verificación de propiedad de Google Search Console y
 * Bing Webmaster Tools, solo si sus variables están definidas en .env (no se escribe ningún código en el repo).
 *   VITE_GOOGLE_SITE_VERIFICATION  -> <meta name="google-site-verification">
 *   VITE_BING_SITE_VERIFICATION    -> <meta name="msvalidate.01">
 */
function siteVerification(env: Record<string, string>): Plugin {
  const safe = (v?: string) => (v && /^[\w-]{10,200}$/.test(v) ? v : null)
  const google = safe(env.VITE_GOOGLE_SITE_VERIFICATION)
  const bing = safe(env.VITE_BING_SITE_VERIFICATION)
  return {
    name: 'site-verification',
    transformIndexHtml() {
      const tags = []
      if (google) tags.push({ tag: 'meta', attrs: { name: 'google-site-verification', content: google }, injectTo: 'head' as const })
      if (bing) tags.push({ tag: 'meta', attrs: { name: 'msvalidate.01', content: bing }, injectTo: 'head' as const })
      return tags
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), siteVerification(env)],
    build: {
      rollupOptions: {
        output: {
          // Librerías aparte: cambian poco y el navegador las conserva en caché entre versiones.
          manualChunks(id: string) {
            if (id.includes('node_modules/gsap')) return 'gsap'
            if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return 'react'
          },
        },
      },
    },
  }
})
