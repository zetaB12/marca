import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'
import { SHOW_PRELOADER } from './utils/bootMode'
import { initFontScale } from './utils/fontScale'

initFontScale()

// Sin preloader no hay quien retire la capa negra estática de index.html.
if (!SHOW_PRELOADER) document.getElementById('boot')?.remove()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
