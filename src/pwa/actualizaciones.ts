// Registro del service worker y aviso de nueva versión.
//
// El service worker precachea el build completo (ver scripts/generate-sw.mjs),
// así que una vez instalada la app abre sin conexión. Cuando se publica un
// build nuevo, el navegador instala el service worker nuevo y lo deja "waiting":
// ese es el momento en que avisamos para mostrar la pantalla de actualización.

type Escucha = (disponible: boolean) => void

const escuchas = new Set<Escucha>()
let registro: ServiceWorkerRegistration | null = null
let disponible = false

function avisar(valor: boolean) {
  disponible = valor
  for (const f of escuchas) f(valor)
}

/** Se notifica de inmediato con el estado actual y devuelve la baja. */
export function suscribirActualizacion(f: Escucha): () => void {
  escuchas.add(f)
  f(disponible)
  return () => { escuchas.delete(f) }
}

export function hayActualizacion(): boolean {
  return disponible
}

/** Activa la versión nueva; el service worker toma el control y la app recarga. */
export function activarActualizacion(): void {
  registro?.waiting?.postMessage('ACTIVAR_ACTUALIZACION')
}

/** Búsqueda manual (la usa la pantalla de Configuración). */
export async function buscarActualizacion(): Promise<void> {
  await registro?.update()
}

export function registrarServiceWorker(): void {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return

  window.addEventListener('load', async () => {
    try {
      registro = await navigator.serviceWorker.register('sw.js', { scope: './' })
    } catch {
      return // sin service worker la app sigue funcionando, sólo que en línea
    }

    // Ya había una versión nueva esperando de una visita anterior.
    if (registro.waiting && navigator.serviceWorker.controller) avisar(true)

    registro.addEventListener('updatefound', () => {
      const nuevo = registro?.installing
      nuevo?.addEventListener('statechange', () => {
        // Sin controller es la primera instalación, no una actualización.
        if (nuevo.state === 'installed' && navigator.serviceWorker.controller) avisar(true)
      })
    })

    // Busca versiones nuevas al volver a la app y cada media hora.
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) void registro?.update()
    })
    window.setInterval(() => { void registro?.update() }, 30 * 60 * 1000)

    // Cuando el service worker nuevo toma el control, recargamos una sola vez.
    let recargando = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (recargando) return
      recargando = true
      window.location.reload()
    })
  })
}
