import type { ReactNode } from 'react'

/**
 * Marco de la app: ocupa exactamente el alto del viewport (en móvil usa dvh,
 * que descuenta las barras del navegador) y no deja scrollear el documento.
 * El scroll ocurre siempre dentro del contenedor, así el menú inferior queda
 * fijo y visible tanto en teléfono como en escritorio.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="h-viewport w-full bg-neutral-200 flex justify-center overflow-hidden">
      <div className="relative w-full max-w-[430px] h-full bg-bg flex flex-col shadow-xl overflow-hidden">
        {children}
      </div>
    </div>
  )
}
