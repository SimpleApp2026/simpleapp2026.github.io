import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { Placeholder } from './screens/Placeholder'
import { Home } from './app/Home'
import { Perfil } from './app/Perfil'
import { Splash } from './onboarding/Splash'
import { Identificacion } from './onboarding/Identificacion'
import { RegistroDatos } from './onboarding/RegistroDatos'
import { RegistroIntereses } from './onboarding/RegistroIntereses'
import { FotoPreguntar } from './onboarding/FotoPreguntar'
import { FotoCargar } from './onboarding/FotoCargar'
import { FotoLista } from './onboarding/FotoLista'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/identificacion" element={<Identificacion />} />
      <Route path="/registro/datos" element={<RegistroDatos />} />
      <Route path="/registro/intereses" element={<RegistroIntereses />} />
      <Route path="/registro/foto" element={<FotoPreguntar />} />
      <Route path="/registro/foto/cargar" element={<FotoCargar />} />
      <Route path="/registro/foto/lista" element={<FotoLista />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="config" element={<Placeholder title="Configuración" />} />
        <Route path="foro" element={<Placeholder title="Comunidad" />} />
        <Route path="asistente" element={<Placeholder title="Asistente" />} />
        <Route path="mapa" element={<Placeholder title="Mapa" />} />
        <Route path="actividades" element={<Placeholder title="Actividades" />} />
        <Route path="empleo" element={<Placeholder title="Empleo" />} />
        <Route path="descuentos" element={<Placeholder title="Descuentos" />} />
        <Route path="clubes" element={<Placeholder title="Clubes" />} />
      </Route>
    </Routes>
  )
}
