import { useEffect, useState } from 'react'
import { activarActualizacion, suscribirActualizacion } from './actualizaciones'
import logo from '../assets/img/logo-simple.png'

/**
 * Pantalla de actualización: ocupa toda la pantalla cuando hay una versión
 * nueva, con textos y botones grandes para que no pase desapercibida.
 */
export function ActualizarApp({ onActualizar }: { onActualizar?: () => void }) {
  const [actualizando, setActualizando] = useState(false)

  const actualizar = () => {
    setActualizando(true)
    ;(onActualizar ?? activarActualizacion)()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="actualizar-titulo"
      className="fixed inset-0 z-[2000] bg-navy-900 text-white flex flex-col items-center justify-center gap-8 px-8 text-center">
      <img src={logo} alt="" aria-hidden="true" className="w-44 max-w-[60%] bg-white rounded-2xl p-3" />

      <div className="flex flex-col gap-4">
        <h1 id="actualizar-titulo" className="text-4xl font-bold leading-tight">
          Hay una versión nueva
        </h1>
        <p className="text-xl leading-snug text-white/90">
          Actualizá +Simple para tener las últimas novedades. Tarda unos segundos.
        </p>
      </div>

      <button
        onClick={actualizar}
        disabled={actualizando}
        className="w-full max-w-sm rounded-full bg-teal text-navy-900 text-2xl font-bold
          px-8 py-5 shadow-lg hover:bg-teal-dark disabled:opacity-70 transition">
        {actualizando ? 'Actualizando…' : 'Actualizar ahora'}
      </button>

      <p className="text-base text-white/70 max-w-sm leading-snug">
        Necesitás conexión sólo para actualizar. Después podés seguir usando la app sin internet.
      </p>
    </div>
  )
}

/** Muestra la pantalla de actualización cuando el service worker avisa. */
export function AvisoActualizacion() {
  const [disponible, setDisponible] = useState(false)
  useEffect(() => suscribirActualizacion(setDisponible), [])
  if (!disponible) return null
  return <ActualizarApp />
}
