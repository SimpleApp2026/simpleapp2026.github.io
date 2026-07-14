import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { Placeholder } from './screens/Placeholder'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder title="Inicio" />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Placeholder title="Inicio" />} />
        <Route path="perfil" element={<Placeholder title="Perfil" />} />
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
