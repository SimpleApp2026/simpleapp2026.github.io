import type { ReactNode } from 'react'

// Tarjeta de confirmación del Figma (frames 27, 36, 39, 45, 64, 69):
// rectángulo navy centrado, título, línea principal en negrita, nota opcional
// y botón "Ok" delineado en blanco.
export function ConfirmCard({
  titulo,
  principal,
  nota,
  accion = 'Ok',
  onAccion,
}: {
  titulo: string
  principal: ReactNode
  nota?: string
  accion?: string
  onAccion: () => void
}) {
  return (
    <div className="w-full max-w-xs rounded-2xl bg-navy-900 text-white text-center px-6 py-10 shadow-lg flex flex-col gap-2">
      <h1 className="text-xl">{titulo}</h1>
      <p className="text-lg font-bold leading-snug">{principal}</p>
      {nota && <p className="text-sm text-white/80 leading-snug mt-1">{nota}</p>}
      <button
        onClick={onAccion}
        className="mt-5 self-center w-4/5 rounded-full border-2 border-white/80 text-white
          px-10 py-1.5 text-base font-semibold hover:bg-white hover:text-navy-900 transition">
        {accion}
      </button>
    </div>
  )
}
