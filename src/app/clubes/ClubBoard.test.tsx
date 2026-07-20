import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ClubBoard } from './ClubBoard'
import { ComentarClub } from './ComentarClub'
import { TtsProvider } from '../../state/TtsProvider'
import { UserProvider } from '../../state/UserProvider'
import { limpiarPostsAgregados } from '../../data/clubes'

function setup(path: string) {
  return render(
    <UserProvider><TtsProvider><MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/app/clubes/:id" element={<ClubBoard />} />
        <Route path="/app/clubes/:id/comentar" element={<ComentarClub />} />
        <Route path="/app/clubes" element={<div>Clubes</div>} />
      </Routes>
    </MemoryRouter></TtsProvider></UserProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  limpiarPostsAgregados()
})

test('COMENTAR EN EL CLUB opens the compose screen and the new post joins the board', async () => {
  setup('/app/clubes/lectura')
  expect(screen.getByRole('heading', { name: /Club de Lectura/i })).toBeInTheDocument()
  expect(screen.getByText(/Ayer volví a releer/)).toBeInTheDocument()
  // abre la pantalla "Comentá en tu club" (frames 61-63)
  await userEvent.click(screen.getByRole('button', { name: /COMENTAR EN EL CLUB/i }))
  expect(screen.getByRole('heading', { name: /Comentá en tu club/i })).toBeInTheDocument()
  expect(screen.getByText(/vía mensaje de voz/i)).toBeInTheDocument()
  await userEvent.type(screen.getByLabelText('Escribí tu comentario'), 'Estoy leyendo poesía')
  await userEvent.click(screen.getByRole('button', { name: /^Enviar$/ }))
  // de vuelta en el board, el comentario aparece en la lista del club
  expect(screen.getByRole('heading', { name: /Club de Lectura/i })).toBeInTheDocument()
  expect(screen.getByText('Estoy leyendo poesía')).toBeInTheDocument()
})

test('the comentarios button opens the Figma thread and allows adding a comment', async () => {
  setup('/app/clubes/musica')
  // hilo del post del Teatro Colón (tercer post) con los comentarios del Figma
  await userEvent.click(screen.getAllByRole('button', { name: /^comentarios$/i })[2])
  expect(screen.getByText(/2 comentarios/)).toBeInTheDocument()
  expect(screen.getByText('¡Yo voy con mi hermana!')).toBeInTheDocument()
  expect(screen.getByText('Yo iré con un viejo amigo que vino de visita')).toBeInTheDocument()
  // escribir un comentario propio con el input "comentar acá"
  await userEvent.type(screen.getByLabelText(/Comentá acá/i), 'Yo también voy, ¡nos vemos ahí!')
  await userEvent.keyboard('{Enter}')
  expect(screen.getByText('Yo también voy, ¡nos vemos ahí!')).toBeInTheDocument()
  expect(screen.getByText(/3 comentarios/)).toBeInTheDocument()
})

test('each post has a reactions bar and toggling an emoji marks it selected', async () => {
  setup('/app/clubes/lectura')
  const corazones = screen.getAllByRole('button', { name: /Reaccionar con ❤️/i })
  expect(corazones.length).toBeGreaterThan(0)
  expect(corazones[0]).toHaveAttribute('aria-pressed', 'false')
  await userEvent.click(corazones[0])
  expect(corazones[0]).toHaveAttribute('aria-pressed', 'true')
  // pill de comentarios presente por publicación
  expect(screen.getAllByRole('button', { name: /^comentarios$/i }).length).toBeGreaterThan(0)
})

test('unknown club shows not found', () => {
  setup('/app/clubes/zzz')
  expect(screen.getByText(/no encontrado/i)).toBeInTheDocument()
})

test('a new post and thread comment use the logged-in user uploaded photo', async () => {
  const miFoto = 'data:image/png;base64,MIFOTO'
  localStorage.setItem('simple.user', JSON.stringify({
    profile: { nombre: 'Manuel', apellido: 'H', barrio: '', fechaNacimiento: '', fotoDataUrl: miFoto, intereses: [] },
    identified: true,
  }))
  setup('/app/clubes/lectura')
  // post nuevo desde la pantalla de comentario
  await userEvent.click(screen.getByRole('button', { name: /COMENTAR EN EL CLUB/i }))
  await userEvent.type(screen.getByLabelText('Escribí tu comentario'), 'Hola desde mi cuenta')
  await userEvent.click(screen.getByRole('button', { name: /^Enviar$/ }))
  const burbuja = screen.getByText('Hola desde mi cuenta')
  expect(screen.getByAltText('Manuel')).toHaveAttribute('src', miFoto)
  expect(burbuja).toBeInTheDocument()
  // comentario en un hilo existente
  await userEvent.click(screen.getAllByRole('button', { name: /^comentarios$/i })[0])
  await userEvent.type(screen.getByLabelText(/Comentá acá/i), 'Comento con mi foto')
  await userEvent.keyboard('{Enter}')
  expect(screen.getByText('Comento con mi foto')).toBeInTheDocument()
  // dos imágenes con mi foto: la del post nuevo y la del comentario
  const propias = screen.getAllByAltText('Manuel').filter((el) => el.getAttribute('src') === miFoto)
  expect(propias.length).toBeGreaterThanOrEqual(2)
})
