import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { LUGARES, type Lugar } from '../../data/lugares'
import { BADGES } from '../actividades/badges'

// ---------------------------------------------------------------------------
// Mapa (frames 67-68 del Figma) con Leaflet + tiles claros de Carto/OSM
// (gratis, sin API key — Google Maps requiere clave con facturación).
// Marcadores para todas las direcciones mencionadas en la app; al tocar uno
// se abre la tarjeta con el evento y el botón "Quiero ir".
// NOTA: los tiles requieren conexión; sin internet el mapa queda gris pero
// los marcadores y tarjetas siguen funcionando.
// ---------------------------------------------------------------------------

// Pin estilo Figma: gota navy con centro teal, dibujada inline (SVG)
const PIN = L.divIcon({
  className: '',
  html: `<svg width="38" height="46" viewBox="0 0 38 46" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 2C10.7 2 4 8.7 4 17c0 10.5 15 27 15 27s15-16.5 15-27C34 8.7 27.3 2 19 2z"
      fill="#8FDED3" stroke="#16154C" stroke-width="3"/>
    <circle cx="19" cy="17" r="6" fill="#16154C"/>
  </svg>`,
  iconSize: [38, 46],
  iconAnchor: [19, 44],
})

// Estampilla/emoji para la tarjeta según la categoría del lugar
function ImagenLugar({ lugar }: { lugar: Lugar }) {
  if (lugar.cat === 'capacitacion' || lugar.cat === 'musica') {
    return (
      <div className="h-20 rounded-xl bg-teal/20 grid place-items-center text-4xl" aria-hidden="true">
        {lugar.cat === 'capacitacion' ? '🎓' : '🎶'}
      </div>
    )
  }
  return (
    <div className="h-20 rounded-xl bg-teal/20 grid place-items-center" aria-hidden="true">
      <img src={BADGES[lugar.cat]} alt="" className="h-16 w-16 object-contain" />
    </div>
  )
}

export function Mapa() {
  const navigate = useNavigate()
  const [sel, setSel] = useState<Lugar | null>(null)
  const [inscripto, setInscripto] = useState(false)

  const cerrar = () => { setSel(null); setInscripto(false) }

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Mapa" onBack={() => navigate('/app/home')} />
      <div className="relative flex-1">
        <MapContainer
          center={[-34.6080, -58.3960]}
          zoom={13}
          className="h-full w-full"
          attributionControl={true}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {LUGARES.map((l) => (
            <Marker
              key={l.id}
              position={[l.lat, l.lng]}
              icon={PIN}
              eventHandlers={{ click: () => { setSel(l); setInscripto(false) } }}
            />
          ))}
        </MapContainer>

        {/* Tarjeta del lugar (frame 68) y confirmación de inscripción */}
        {sel && (
          <div className="absolute inset-x-6 top-8 z-[1001]">
            {inscripto ? (
              // "¡Felicidades! Ya te inscribiste" (tarjeta navy con Ok delineado)
              <div className="rounded-2xl bg-navy-900 text-white shadow-xl px-6 py-9 flex flex-col gap-1 text-center">
                <h2 className="text-lg">¡Felicidades!</h2>
                <p className="text-lg font-bold">Ya te inscribiste</p>
                <button
                  onClick={cerrar}
                  className="mt-5 self-center w-4/5 rounded-full border-2 border-white/70 text-white
                    px-10 py-1.5 text-sm font-semibold hover:bg-white hover:text-navy-900 transition">
                  Ok
                </button>
              </div>
            ) : (
              <div className="relative rounded-2xl bg-white shadow-xl p-4 flex flex-col gap-2 text-center">
                <button
                  aria-label="Cerrar"
                  onClick={cerrar}
                  className="absolute top-2 right-3 text-2xl leading-none text-ink/50 hover:text-ink">
                  ×
                </button>
                <ImagenLugar lugar={sel} />
                <h2 className="text-lg font-bold text-navy-900 leading-snug">{sel.nombre}</h2>
                <p className="text-ink/85">{sel.evento}</p>
                <p className="text-ink/55 text-sm">{sel.fecha}</p>
                <button
                  onClick={() => setInscripto(true)}
                  className="self-center rounded-full bg-navy-900 text-white px-8 py-1.5 text-sm font-semibold hover:bg-navy-800">
                  Quiero ir
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
