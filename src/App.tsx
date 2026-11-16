import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Preloader from './components/Preloader/Preloader'
import DesktopLayout from './layouts/DesktopLayout'
import HomePage from './pages/HomePage'
import { useDesktopStore } from './store/desktopStore'
import { SHOW_PRELOADER } from './utils/bootMode'

export default function App() {
  const booted = useDesktopStore((s) => s.booted)
  const setBooted = useDesktopStore((s) => s.setBooted)

  return (
    <>
      {/* El escritorio se monta debajo del preloader; inert evita foco y lectores mientras carga. */}
      <div inert={!booted}>
        <BrowserRouter>
          <Routes>
            <Route element={<DesktopLayout />}>
              <Route index element={<HomePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
      {SHOW_PRELOADER && <Preloader onReady={setBooted} />}
    </>
  )
}
