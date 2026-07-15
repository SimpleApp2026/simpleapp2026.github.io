import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { Placeholder } from './screens/Placeholder'
import { Home } from './app/Home'
import { Perfil } from './app/Perfil'
import { Configuracion } from './app/Configuracion'
import { Splash } from './onboarding/Splash'
import { Identificacion } from './onboarding/Identificacion'
import { RegistroDatos } from './onboarding/RegistroDatos'
import { RegistroIntereses } from './onboarding/RegistroIntereses'
import { FotoPreguntar } from './onboarding/FotoPreguntar'
import { FotoCargar } from './onboarding/FotoCargar'
import { FotoLista } from './onboarding/FotoLista'
import { ActividadesCategorias } from './app/actividades/ActividadesCategorias'
import { ActividadCategoria } from './app/actividades/ActividadCategoria'
import { ActividadDetalle } from './app/actividades/ActividadDetalle'
import { ActividadConfirmacion } from './app/actividades/ActividadConfirmacion'
import { EmpleoMenu } from './app/empleo/EmpleoMenu'
import { CvBuilder } from './app/empleo/CvBuilder'
import { CvPreliminar } from './app/empleo/CvPreliminar'
import { Oportunidades } from './app/empleo/Oportunidades'
import { Postular } from './app/empleo/Postular'
import { PostulacionConfirmada } from './app/empleo/PostulacionConfirmada'
import { Capacitaciones } from './app/empleo/Capacitaciones'
import { ForoLayout } from './app/foro/ForoLayout'
import { CartasPublicas } from './app/foro/CartasPublicas'
import { CartasPrivadas } from './app/foro/CartasPrivadas'
import { Amigos } from './app/foro/Amigos'
import { CartaPublica } from './app/foro/CartaPublica'
import { EscribirCarta } from './app/foro/EscribirCarta'
import { CartaEnviada } from './app/foro/CartaEnviada'
import { CartaPrivada } from './app/foro/CartaPrivada'
import { Responder } from './app/foro/Responder'
import { DescuentosList } from './app/descuentos/DescuentosList'
import { DescuentoDetalle } from './app/descuentos/DescuentoDetalle'
import { DescuentoConfirmado } from './app/descuentos/DescuentoConfirmado'
import { ClubesList } from './app/clubes/ClubesList'
import { ClubBoard } from './app/clubes/ClubBoard'
import { ChatARIEL } from './app/asistente/ChatARIEL'
import { LegalDoc } from './app/info/LegalDoc'
import { Ayuda } from './app/info/Ayuda'

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
        <Route path="config" element={<Configuracion />} />
        <Route path="foro" element={<ForoLayout />}>
          <Route index element={<CartasPublicas />} />
          <Route path="privadas" element={<CartasPrivadas />} />
          <Route path="amigos" element={<Amigos />} />
        </Route>
        <Route path="foro/carta/:id" element={<CartaPublica />} />
        <Route path="foro/escribir" element={<EscribirCarta />} />
        <Route path="foro/enviada" element={<CartaEnviada />} />
        <Route path="foro/privada/:id" element={<CartaPrivada />} />
        <Route path="foro/privada/:id/responder" element={<Responder />} />
        <Route path="asistente" element={<ChatARIEL />} />
        <Route path="mapa" element={<Placeholder title="Mapa" />} />
        <Route path="actividades">
          <Route index element={<ActividadesCategorias />} />
          <Route path="confirmada" element={<ActividadConfirmacion />} />
          <Route path=":cat" element={<ActividadCategoria />} />
          <Route path=":cat/:id" element={<ActividadDetalle />} />
        </Route>
        <Route path="empleo">
          <Route index element={<EmpleoMenu />} />
          <Route path="experiencia" element={<CvBuilder />} />
          <Route path="cv" element={<CvPreliminar />} />
          <Route path="oportunidades" element={<Oportunidades />} />
          <Route path="oportunidades/:id" element={<Postular />} />
          <Route path="postulado" element={<PostulacionConfirmada />} />
          <Route path="capacitaciones" element={<Capacitaciones />} />
        </Route>
        <Route path="descuentos" element={<DescuentosList />} />
        <Route path="descuentos/confirmado" element={<DescuentoConfirmado />} />
        <Route path="descuentos/:id" element={<DescuentoDetalle />} />
        <Route path="clubes" element={<ClubesList />} />
        <Route path="clubes/:id" element={<ClubBoard />} />
        <Route path="ayuda" element={<Ayuda />} />
        <Route path="legal/:doc" element={<LegalDoc />} />
      </Route>
    </Routes>
  )
}
