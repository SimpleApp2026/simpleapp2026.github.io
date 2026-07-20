import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Button } from '../../ui/Button'
import { getClub, type Post } from '../../data/clubes'
import { avatarDe } from '../../data/avatars'

// Reacciones de los boards de clubes (frame 60 del Figma)
const REACCIONES = ['🙏', '❤️', '😂', '😮', '😊']

// Publicación del club: burbuja gris + fila avatar / pill comentarios / reacciones
function PublicacionClub({ post }: { post: Post }) {
  const foto = avatarDe(post.autor)
  const [elegidas, setElegidas] = useState<Set<string>>(new Set())

  const reaccionar = (emoji: string) =>
    setElegidas((prev) => {
      const s = new Set(prev)
      if (s.has(emoji)) s.delete(emoji); else s.add(emoji)
      return s
    })

  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-2xl bg-[#EDEDED] px-4 py-3 text-ink/85 leading-relaxed max-w-[94%]">
        <span className="sr-only">{post.autor} escribió: </span>
        {post.texto}
      </div>
      <div className="flex items-center gap-2">
        {foto
          ? <img src={foto} alt={post.autor} className="h-8 w-8 rounded-full object-cover shrink-0" />
          : <span className="h-8 w-8 rounded-full bg-chip/20 grid place-items-center text-sm shrink-0" aria-label={post.autor}>👤</span>}
        <button className="rounded-full bg-teal px-4 py-1 text-sm font-medium text-navy-900 hover:bg-teal-dark">
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
    </div>
  )
}

export function ClubBoard() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const club = getClub(id ?? '')
  const [posts, setPosts] = useState<Post[]>(club ? club.posts : [])
  const [texto, setTexto] = useState('')
  const [componiendo, setComponiendo] = useState(false)

  if (!club) {
    return (
      <div>
        <ScreenHeader title="Clubes" onBack={() => navigate('/app/clubes')} />
        <p className="p-6 text-lg">Club no encontrado.</p>
      </div>
    )
  }

  const publicar = () => {
    if (!texto.trim()) return
    setPosts((prev) => [...prev, { id: `nuevo-${prev.length}`, autor: 'Vos', texto: texto.trim() }])
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
          className="self-center flex items-center gap-2 rounded-full bg-white border border-chip/25 shadow-sm
            px-5 py-2 text-sm font-bold tracking-wide text-navy-900 hover:bg-bg">
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
