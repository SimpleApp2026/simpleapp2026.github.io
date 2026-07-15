import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'
import { getClub, type Post } from '../../data/clubes'

export function ClubBoard() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const club = getClub(id ?? '')
  const [posts, setPosts] = useState<Post[]>(club ? club.posts : [])
  const [texto, setTexto] = useState('')

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
  }

  return (
    <div>
      <ScreenHeader title={club.titulo} onBack={() => navigate('/app/clubes')} />
      <div className="p-4 flex flex-col gap-4">
        <p className="text-ink/70">{club.descripcion}</p>
        <div className="flex flex-col gap-2">
          {posts.map((p) => (
            <Card key={p.id} className="flex flex-col">
              <span className="font-semibold">{p.autor}</span>
              <span className="text-ink/80">{p.texto}</span>
            </Card>
          ))}
        </div>
        <TextField label="Comentar en el club" value={texto} onChange={setTexto} placeholder="Escribí acá..." />
        <Button onClick={publicar}>Publicar</Button>
      </div>
    </div>
  )
}
