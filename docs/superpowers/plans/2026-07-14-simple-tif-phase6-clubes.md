# +Simple TIF — Phase 6 (Clubes) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build the Clubes feature — a list of themed community clubs (Lectura, Manualidades, Cocina, Bienestar, Mascotas) and a per-club board where members read posts and add their own ("Comentar en el club") — reached from the Foro ("Clubes y cartas de tu comunidad").

**Architecture:** A typed fixture (`src/data/clubes.ts`) provides clubs and their posts. Nested routes under `/app/clubes` render inside `AppShell`. Posts added in a session are held in local component state (seeded from the fixture). A discovery entry ("Clubes de la comunidad") is added to the Foro "Cartas públicas" tab.

**Tech Stack:** Existing foundation — React Router, `ScreenHeader`, `Card`, `Button`, `TextField`.

## Global Constraints
- Offline-first (no network, emoji tiles). Spanish copy (plausible where the Figma text wasn't fully captured — the clubs' post bodies).
- Mobile-framed inside `AppShell`. Consumes existing UI. No changes to shared providers.
- Routes nested under `/app` in `src/routes.tsx`; other routes unchanged except the small Foro entry-point addition in Task 1.
- Conventional commits; do NOT run `npx tsc -b`.

---

## File Structure
```
src/data/clubes.ts                # Club, Post types + CLUBES + getClub
src/data/clubes.test.ts
src/app/clubes/ClubesList.tsx     # list of clubs (screen 58/59)
src/app/clubes/ClubBoard.tsx      # per-club board + comentar (screens 60–68)
src/app/foro/CartasPublicas.tsx   # MODIFY: add a "Clubes de la comunidad" entry button
src/routes.tsx                    # MODIFY: replace /app/clubes placeholder with nested routes
```

---

### Task 1: Clubes data + list + Foro entry + routes/stub

**Files:**
- Create: `src/data/clubes.ts`, `src/data/clubes.test.ts`, `src/app/clubes/ClubesList.tsx`, and a minimal STUB `src/app/clubes/ClubBoard.tsx`
- Modify: `src/routes.tsx`, `src/app/foro/CartasPublicas.tsx`
- Test: `src/app/clubes/ClubesList.test.tsx`

**Interfaces:**
- Produces:
  - `interface Post { id: string; autor: string; texto: string }`
  - `interface Club { id: string; titulo: string; emoji: string; descripcion: string; posts: Post[] }`
  - `CLUBES: Club[]` (5), `getClub(id): Club | undefined`
  - `ClubesList()` — `ScreenHeader title="Clubes"` (back → `/app/foro`); a `Card` per club (emoji + titulo + descripcion) → `/app/clubes/{id}`.
  - (modification) `CartasPublicas` gains a `Button` (secondary/ghost) "Clubes de la comunidad" near the top → `/app/clubes`.
- Consumes: `ScreenHeader`, `Card`, `Button`, `useNavigate`.

- [ ] **Step 1: Write failing tests**

`src/data/clubes.test.ts`:
```ts
import { CLUBES, getClub } from './clubes'

test('has five clubs with unique ids and posts', () => {
  expect(CLUBES).toHaveLength(5)
  expect(new Set(CLUBES.map((c) => c.id)).size).toBe(5)
  expect(CLUBES.every((c) => c.posts.length > 0)).toBe(true)
})

test('getClub looks up by id', () => {
  expect(getClub(CLUBES[0].id)?.id).toBe(CLUBES[0].id)
  expect(getClub('nope')).toBeUndefined()
})
```

`src/app/clubes/ClubesList.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ClubesList } from './ClubesList'
import { TtsProvider } from '../../state/TtsProvider'

function setup() {
  return render(
    <TtsProvider><MemoryRouter initialEntries={['/app/clubes']}>
      <Routes>
        <Route path="/app/clubes" element={<ClubesList />} />
        <Route path="/app/clubes/:id" element={<div>Club board</div>} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('lists clubs and opens one', async () => {
  setup()
  expect(screen.getByText('Club de Lectura')).toBeInTheDocument()
  expect(screen.getByText('Club de mascotas')).toBeInTheDocument()
  await userEvent.click(screen.getByText('Club de Lectura'))
  expect(screen.getByText('Club board')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test src/data/clubes.test.ts src/app/clubes/ClubesList.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/data/clubes.ts`:
```ts
export interface Post { id: string; autor: string; texto: string }
export interface Club { id: string; titulo: string; emoji: string; descripcion: string; posts: Post[] }

export const CLUBES: Club[] = [
  { id: 'lectura', titulo: 'Club de Lectura', emoji: '📚', descripcion: 'Compartí y descubrí lecturas con la comunidad.', posts: [
    { id: 'p1', autor: 'Marta', texto: 'Ayer volví a releer uno de mis libros favoritos. ¿Qué están leyendo ustedes?' },
    { id: 'p2', autor: 'Jorge', texto: 'Les recomiendo empezar con cuentos cortos, se disfrutan mucho.' },
  ] },
  { id: 'manualidades', titulo: 'Club de manualidades', emoji: '🎨', descripcion: 'Ideas, tips y proyectos hechos a mano.', posts: [
    { id: 'p1', autor: 'Elena', texto: 'Quería recomendar la tienda del barrio para comprar lanas a buen precio.' },
  ] },
  { id: 'cocina', titulo: 'Club de cocina', emoji: '🍳', descripcion: 'Recetas caseras y encuentros gastronómicos.', posts: [
    { id: 'p1', autor: 'Susana', texto: 'Hoy preparé una tarta de manzana, ¡quedó riquísima! ¿Quieren la receta?' },
  ] },
  { id: 'bienestar', titulo: 'Club de Bienestar', emoji: '🧘', descripcion: 'Movimiento, salud y buenos hábitos.', posts: [
    { id: 'p1', autor: 'Raúl', texto: 'Pequeño logro del día: caminé 30 minutos por la plaza. ¡De a poco se puede!' },
  ] },
  { id: 'mascotas', titulo: 'Club de mascotas', emoji: '🐾', descripcion: 'Historias y consejos sobre nuestros compañeros.', posts: [
    { id: 'p1', autor: 'Delia', texto: '¿Alguien más tiene un perro que ladra cuando suena el teléfono? 😄' },
  ] },
]

export function getClub(id: string): Club | undefined {
  return CLUBES.find((c) => c.id === id)
}
```

`src/app/clubes/ClubesList.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { CLUBES } from '../../data/clubes'

export function ClubesList() {
  const navigate = useNavigate()
  return (
    <div>
      <ScreenHeader title="Clubes" onBack={() => navigate('/app/foro')} />
      <div className="p-4 flex flex-col gap-3">
        {CLUBES.map((c) => (
          <button key={c.id} className="text-left" onClick={() => navigate(`/app/clubes/${c.id}`)}>
            <Card className="flex items-center gap-4">
              <span className="text-3xl" aria-hidden="true">{c.emoji}</span>
              <span className="flex flex-col">
                <span className="text-lg font-semibold">{c.titulo}</span>
                <span className="text-sm text-ink/60">{c.descripcion}</span>
              </span>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
```

`src/routes.tsx`: replace `<Route path="clubes" element={<Placeholder title="Clubes" />} />` with:
```tsx
<Route path="clubes" element={<ClubesList />} />
<Route path="clubes/:id" element={<ClubBoard />} />
```
Add imports for `ClubesList` and `ClubBoard`. Create the STUB `src/app/clubes/ClubBoard.tsx` (`export function ClubBoard(){ return <div className="p-6 text-lg">Club (en construcción)</div> }`). Leave other routes unchanged.

`src/app/foro/CartasPublicas.tsx`: add a "Clubes de la comunidad" button just below the existing "Escribir carta" button. Insert this line right after the `Escribir carta` `<Button>`:
```tsx
<Button variant="ghost" onClick={() => navigate('/app/clubes')}>Clubes de la comunidad</Button>
```
(The `navigate` and `Button` are already imported in that file.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/data/clubes.test.ts src/app/clubes/ClubesList.test.tsx && npm run build`
Expected: PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/data/clubes.ts src/data/clubes.test.ts src/app/clubes src/routes.tsx src/app/foro/CartasPublicas.tsx
git commit -m "feat(clubes): data, clubs list, and Foro entry point"
```

---

### Task 2: Club board with posts + comentar (screens 60–68)

**Files:**
- Modify: `src/app/clubes/ClubBoard.tsx` (replace stub)
- Test: `src/app/clubes/ClubBoard.test.tsx`

**Interfaces:**
- Consumes: `useParams`, `useNavigate`, `getClub`, `ScreenHeader`, `Card`, `Button`, `TextField`, `Post`.
- Produces: `ClubBoard()` — reads `:id`; unknown → "Club no encontrado". Else `ScreenHeader title={club.titulo}` (back → `/app/clubes`), the club `descripcion`, the posts (seeded from fixture into local state; each a `Card` with autor + texto), and a "Comentar en el club" input (`TextField` + "Publicar" button) that appends `{ id, autor: 'Vos', texto }` to local state and clears the input.

- [ ] **Step 1: Write the failing test**

`src/app/clubes/ClubBoard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ClubBoard } from './ClubBoard'
import { TtsProvider } from '../../state/TtsProvider'

function setup(path: string) {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/app/clubes/:id" element={<ClubBoard />} />
        <Route path="/app/clubes" element={<div>Clubes</div>} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('shows club posts and can publish a new one', async () => {
  setup('/app/clubes/lectura')
  expect(screen.getByRole('heading', { name: /Club de Lectura/i })).toBeInTheDocument()
  expect(screen.getByText(/Ayer volví a releer/)).toBeInTheDocument()
  await userEvent.type(screen.getByLabelText(/Comentar en el club/i), 'Estoy leyendo poesía')
  await userEvent.click(screen.getByRole('button', { name: /Publicar/i }))
  expect(screen.getByText('Estoy leyendo poesía')).toBeInTheDocument()
})

test('unknown club shows not found', () => {
  setup('/app/clubes/zzz')
  expect(screen.getByText(/no encontrado/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/app/clubes/ClubBoard.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/app/clubes/ClubBoard.tsx`:
```tsx
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/app/clubes && npm run build`
Expected: all Clubes tests PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/clubes/ClubBoard.tsx src/app/clubes/ClubBoard.test.tsx
git commit -m "feat(clubes): per-club board with posts and comentar"
```

---

## Definition of Done (Phase 6)
- `npm test` and `npm run build` pass.
- Foro → "Clubes de la comunidad" → clubs list → a club board with posts; publishing a comment appends it. Unknown club id → graceful not-found.
- Every task committed.

## Next phase
Phase 7 (Chat IA / ARIEL): scripted assistant chat reached from the center "Asistente" bottom-nav tab.
