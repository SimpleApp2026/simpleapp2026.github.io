import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Button } from '../../ui/Button'
import { getClub, type Club, type Post, type ComentarioClub } from '../../data/clubes'
import { avatarDe } from '../../data/avatars'

// Reacciones de los boards de clubes (frame 60 del Figma)
const REACCIONES = ['🙏', '❤️', '😂', '😮', '😊']

// Publicación del club: burbuja gris + fila avatar / pill comentarios /
// reacciones, y el hilo de comentarios desplegable (frame 60 del Figma).
function PublicacionClub({ post }: { post: Post }) {
  const foto = avatarDe(post.autor)
  const [elegidas, setElegidas] = useState<Set<string>>(new Set())
  const [hiloAbierto, setHiloAbierto] = useState(false)
  const [comentarios, setComentarios] = useState<ComentarioClub[]>(post.comentarios)
  const [nuevo, setNuevo] = useState('')

  const reaccionar = (emoji: string) =>
    setElegidas((prev) => {
      const s = new Set(prev)
      if (s.has(emoji)) s.delete(emoji); else s.add(emoji)
      return s
    })

  const comentar = () => {
    if (!nuevo.trim()) return
    setComentarios((prev) => [...prev, { id: `nuevo-${prev.length}`, autor: 'Vos', texto: nuevo.trim() }])
    setNuevo('')
  }

  return (
    <div className="mb-4">
      {/* La burbuja cubre de fondo a la pill de comentarios y a las reacciones;
          el avatar va a caballo de la esquina inferior izquierda, asomándose. */}
      <div className="relative">
        <div className="ml-4 rounded-2xl bg-[#EDEDED] px-4 pt-3 pb-12 text-ink/85 leading-relaxed">
          <span className="sr-only">{post.autor} escribió: </span>
          {post.texto}
        </div>
        {/* Fila comentarios + reacciones: completamente sobre la burbuja */}
        <div className="absolute left-14 bottom-2 flex items-center gap-2">
          <button
            aria-expanded={hiloAbierto}
            onClick={() => setHiloAbierto((v) => !v)}
            className="rounded-full bg-teal px-4 py-1 text-sm font-medium text-navy-900 shadow-sm hover:bg-teal-dark">
            comentarios
          </button>
          <div className="rounded-full bg-white border border-chip/20 shadow-sm px-2.5 py-1 flex items-center gap-1">
            {REACCIONES.map((e) => (
              <button key={e} aria-label={`Reaccionar con ${e}`} aria-pressed={elegidas.has(e)}
                onClick={() => reaccionar(e)}
                className={`text-base leading-none rounded-full p-0.5 transition
                  ${elegidas.has(e) ? 'bg-teal/40 scale-110' : 'hover:scale-110'}`}>
                {e}
              </button>
            ))}
          </div>
        </div>
        {/* Avatar a caballo del borde inferior izquierdo de la burbuja */}
        {foto
          ? <img src={foto} alt={post.autor} className="absolute left-0 -bottom-4 h-10 w-10 rounded-full object-cover ring-2 ring-white shadow" />
          : <span className="absolute left-0 -bottom-4 h-10 w-10 rounded-full bg-chip/30 grid place-items-center ring-2 ring-white shadow" aria-label={post.autor}>👤</span>}
      </div>

      {/* Hilo de comentarios (captura del Figma: panel blanco con contador,
          comentarios con avatar y el input "comentar acá") */}
      {hiloAbierto && (
        <div className="mt-6 ml-4 rounded-2xl bg-white border border-chip/25 shadow-sm p-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink/70 mb-1">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {comentarios.length} comentarios
          </p>
          <div className="flex flex-col divide-y divide-chip/15">
            {comentarios.map((c) => {
              const fotoC = avatarDe(c.autor)
              return (
                <div key={c.id} className="flex items-center gap-3 py-2.5">
                  {fotoC
                    ? <img src={fotoC} alt={c.autor} className="h-8 w-8 rounded-full object-cover shrink-0" />
                    : <span className="h-8 w-8 rounded-full bg-chip/20 grid place-items-center text-sm shrink-0" aria-label={c.autor}>👤</span>}
                  <span className="text-ink/85 text-sm leading-snug">{c.texto}</span>
                </div>
              )
            })}
          </div>
          <form className="mt-2" onSubmit={(e) => { e.preventDefault(); comentar() }}>
            <input
              aria-label="Comentá acá"
              value={nuevo}
              onChange={(e) => setNuevo(e.target.value)}
              placeholder="comentar acá"
              className="w-full rounded-full border border-chip/30 px-4 py-1.5 text-sm outline-none focus:border-navy-900/40"
            />
          </form>
        </div>
      )}
    </div>
  )
}

export function ClubBoard() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const club = getClub(id ?? '')

  if (!club) {
    return (
      <div>
        <ScreenHeader title="Clubes" onBack={() => navigate('/app/clubes')} />
        <p className="p-6 text-lg">Club no encontrado.</p>
      </div>
    )
  }

  // key por id: al navegar de un club a otro (misma ruta :id) fuerza el
  // remount para que los posts en estado local se resiembren del club nuevo.
  return <ClubBoardInner key={club.id} club={club} />
}

function ClubBoardInner({ club }: { club: Club }) {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>(club.posts)
  const [texto, setTexto] = useState('')
  const [componiendo, setComponiendo] = useState(false)

  const publicar = () => {
    if (!texto.trim()) return
    setPosts((prev) => [...prev, { id: `nuevo-${prev.length}`, autor: 'Vos', texto: texto.trim(), comentarios: [] }])
    setTexto('')
    setComponiendo(false)
  }

  return (
    <div>
      <ScreenHeader title={club.titulo} onBack={() => navigate('/app/clubes')} />
      <div className="p-4 flex flex-col gap-5">
        {/* Botón "+ COMENTAR EN EL CLUB" (frame 60 del Figma) */}
        <button
          onClick={() => setComponiendo(true)}
          className="self-center flex items-center gap-2.5 rounded-full bg-white border border-chip/25 shadow-sm
            px-9 py-3.5 text-sm font-bold tracking-wide text-navy-900 hover:bg-bg">
          <span className="grid place-items-center h-5 w-5 rounded-full bg-teal text-navy-900 text-sm leading-none" aria-hidden="true">+</span>
          COMENTAR EN EL CLUB
        </button>

        {componiendo && (
          <div className="flex flex-col gap-2">
            <label className="sr-only" htmlFor="club-composer">Comentar en el club</label>
            <textarea
              id="club-composer"
              autoFocus
              rows={3}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribí tu comentario..."
              className="w-full rounded-2xl border border-chip/30 bg-surface p-3 text-base resize-none"
            />
            <Button onClick={publicar}>Publicar</Button>
          </div>
        )}

        <div className="flex flex-col gap-5">
          {posts.map((p) => <PublicacionClub key={p.id} post={p} />)}
        </div>
      </div>
    </div>
  )
}
