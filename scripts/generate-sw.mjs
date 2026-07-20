// Genera dist/sw.js después del build de Vite.
//
// El service worker precachea TODO el build (HTML, JS, CSS, fuentes e imágenes)
// para que la app funcione sin conexión. La versión es un hash del contenido
// del build: si cambia algún archivo, cambia el nombre del caché y el navegador
// detecta la nueva versión (lo que dispara la pantalla "Actualizar app").
//
// Los tiles del mapa son la única excepción: viven en un caché aparte que se
// llena a medida que se usa el mapa con conexión.
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const DIST = new URL('../dist/', import.meta.url).pathname

function archivos(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n)
    return statSync(p).isDirectory() ? archivos(p) : [p]
  })
}

const todos = archivos(DIST)
  .map((p) => relative(DIST, p).split(sep).join('/'))
  .filter((p) => p !== 'sw.js')
  .sort()

const hash = createHash('sha256')
for (const rel of todos) hash.update(rel).update(readFileSync(join(DIST, rel)))
const VERSION = hash.digest('hex').slice(0, 12)

// './' entra al precache para que la raíz responda offline (la app usa HashRouter,
// así que todas las rutas cuelgan de este mismo documento).
const PRECACHE = ['./', ...todos.map((p) => `./${p}`)]

const sw = `// Generado por scripts/generate-sw.mjs — no editar a mano.
const VERSION = '${VERSION}'
const CACHE = 'simple-' + VERSION
const CACHE_TILES = 'simple-tiles'
const PRECACHE = ${JSON.stringify(PRECACHE, null, 2)}

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)))
})

// Al activarse, borra los cachés de versiones anteriores y toma el control de
// las pestañas abiertas.
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const nombres = await caches.keys()
    await Promise.all(nombres
      .filter((n) => n.startsWith('simple-') && n !== CACHE && n !== CACHE_TILES)
      .map((n) => caches.delete(n)))
    await self.clients.claim()
  })())
})

// La pantalla de actualización pide activar la versión nueva sin esperar.
self.addEventListener('message', (e) => {
  if (e.data === 'ACTIVAR_ACTUALIZACION') self.skipWaiting()
  if (e.data === 'VERSION') e.source?.postMessage({ tipo: 'VERSION', version: VERSION })
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)

  // Tiles del mapa: red primero y copia en caché, para que el último mapa visto
  // siga disponible sin conexión.
  if (url.hostname.endsWith('basemaps.cartocdn.com')) {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE_TILES)
      try {
        const res = await fetch(req)
        if (res.ok) cache.put(req, res.clone())
        return res
      } catch {
        const guardado = await cache.match(req)
        if (guardado) return guardado
        return new Response('', { status: 504, statusText: 'Sin conexión' })
      }
    })())
    return
  }

  if (url.origin !== self.location.origin) return

  // Navegaciones: siempre el documento precacheado (la app es una SPA).
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('./').then((r) => r ?? fetch(req)))
    return
  }

  // Recursos propios: caché primero, y si no está se busca en la red.
  e.respondWith((async () => {
    const guardado = await caches.match(req, { ignoreSearch: false })
    if (guardado) return guardado
    try {
      return await fetch(req)
    } catch {
      return new Response('', { status: 504, statusText: 'Sin conexión' })
    }
  })())
})
`

writeFileSync(join(DIST, 'sw.js'), sw)
console.log(`sw.js generado — versión ${VERSION}, ${PRECACHE.length} archivos precacheados`)
