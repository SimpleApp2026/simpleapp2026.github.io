# +Simple TIF — Phase 5 (Foro / Cartas) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build the Foro feature — a tabbed community space (Cartas públicas · Cartas privadas · Amigos) with postcard-style letters, public letters with comments, private letters with replies, and a friends/conversations list — reached from the Home "Foro" card and the "Comunidad" bottom-nav tab.

**Architecture:** A `ForoLayout` renders the "Foro / Comunidad de adultos mayores" header, a three-tab bar, and an `<Outlet/>` for the active tab; nested routes under `/app/foro` render inside it (which itself sits inside `AppShell`). A typed fixture (`src/data/foro.ts`) provides letters, comments, and conversations. Comments added in a session are held in local component state (seeded from the fixture) — enough for a working demo without new global state. Composing/replying navigates to a shared "carta enviada" confirmation.

**Tech Stack:** Existing foundation — React Router (nested routes, `NavLink`, `Outlet`, `useParams`, `useLocation`), `ScreenHeader`/custom header, `Card`, `Button`, `TextField`.

## Global Constraints
- Offline-first (no network; emoji stamps, no remote images). Spanish copy verbatim from Figma where legible.
- Mobile-framed inside `AppShell`. Consumes existing UI. No changes to shared providers.
- Routes nested under `/app` in `src/routes.tsx`; other routes unchanged. The `/app/foro` tab in `BottomNav` already points here.
- Conventional commits; do NOT run `npx tsc -b`.

## Postcard style
Letters render on a `bg-cream` card with rounded corners, a small stamp emoji (📮) top-right, the author + date, and the body text. Reuse a shared `Postcard` component built in Task 1.

---

## File Structure
```
src/data/foro.ts                       # types + CARTAS_PUBLICAS, CARTAS_PRIVADAS, CONVERSACIONES + getters
src/data/foro.test.ts
src/app/foro/Postcard.tsx              # shared postcard presentational component
src/app/foro/ForoLayout.tsx            # header + tab bar + Outlet
src/app/foro/CartasPublicas.tsx        # tab 1 list (screen 44 area)
src/app/foro/CartaPublica.tsx          # public letter + comments (screen 46)
src/app/foro/EscribirCarta.tsx         # compose public letter (screen 44)
src/app/foro/CartaEnviada.tsx          # confirmation (screens 45/51/55)
src/app/foro/CartasPrivadas.tsx        # tab 2 list
src/app/foro/CartaPrivada.tsx          # private letter (screen 52)
src/app/foro/Responder.tsx             # reply compose (screen 54)
src/app/foro/Amigos.tsx                # tab 3 conversations (screen 56)
src/routes.tsx                         # MODIFY: replace /app/foro placeholder with nested routes
```

---

### Task 1: Foro data + Postcard + ForoLayout (tabs) + Cartas públicas list + routes/stubs

**Files:**
- Create: `src/data/foro.ts`, `src/data/foro.test.ts`, `src/app/foro/Postcard.tsx`, `src/app/foro/ForoLayout.tsx`, `src/app/foro/CartasPublicas.tsx`, and minimal STUBS for `CartaPublica`, `EscribirCarta`, `CartaEnviada`, `CartasPrivadas`, `CartaPrivada`, `Responder`, `Amigos`
- Modify: `src/routes.tsx`
- Test: `src/app/foro/ForoLayout.test.tsx`

**Interfaces:**
- Produces:
  - `interface Comentario { id: string; autor: string; texto: string }`
  - `interface CartaPublica { id: string; autor: string; fecha: string; texto: string; comentarios: Comentario[] }`
  - `interface CartaPrivada { id: string; de: string; fecha: string; texto: string }`
  - `interface Conversacion { id: string; amigo: string; ultimo: string }`
  - `CARTAS_PUBLICAS: CartaPublica[]`, `CARTAS_PRIVADAS: CartaPrivada[]`, `CONVERSACIONES: Conversacion[]`, `getCartaPublica(id)`, `getCartaPrivada(id)`
  - `Postcard({ autor, fecha, children, className? })` — cream card, 📮 stamp, autor + fecha header, body.
  - `ForoLayout()` — header "Foro" + subtitle "Comunidad de adultos mayores"; a tab bar of three `NavLink`s (Cartas públicas → `/app/foro`, Cartas privadas → `/app/foro/privadas`, Amigos → `/app/foro/amigos`) with the active one underlined/teal; then `<Outlet/>`. NavLink `end` on the index link.
  - `CartasPublicas()` — a "Escribir carta" `Button` (→ `/app/foro/escribir`) and a `Postcard` per `CARTAS_PUBLICAS` (truncated body) that navigates to `/app/foro/carta/{id}`.
- Consumes: `ScreenHeader` (optional — ForoLayout hand-rolls its header), `Card`/`Button`, router.

- [ ] **Step 1: Write failing tests**

`src/data/foro.test.ts`:
```ts
import { CARTAS_PUBLICAS, CARTAS_PRIVADAS, CONVERSACIONES, getCartaPublica, getCartaPrivada } from './foro'

test('fixtures have content and unique ids', () => {
  expect(CARTAS_PUBLICAS.length).toBeGreaterThan(0)
  expect(CARTAS_PRIVADAS.length).toBeGreaterThan(0)
  expect(CONVERSACIONES.length).toBeGreaterThan(0)
  expect(new Set(CARTAS_PUBLICAS.map((c) => c.id)).size).toBe(CARTAS_PUBLICAS.length)
})

test('getters look up by id', () => {
  const p = CARTAS_PUBLICAS[0]
  expect(getCartaPublica(p.id)?.id).toBe(p.id)
  expect(getCartaPublica('nope')).toBeUndefined()
  expect(getCartaPrivada(CARTAS_PRIVADAS[0].id)?.id).toBe(CARTAS_PRIVADAS[0].id)
})

test('public letters carry comments', () => {
  expect(CARTAS_PUBLICAS.some((c) => c.comentarios.length > 0)).toBe(true)
})
```

`src/app/foro/ForoLayout.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { ForoLayout } from './ForoLayout'
import { CartasPublicas } from './CartasPublicas'
import { TtsProvider } from '../../state/TtsProvider'

function setup(path = '/app/foro') {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/app/foro" element={<ForoLayout />}>
          <Route index element={<CartasPublicas />} />
          <Route path="privadas" element={<div>Privadas tab</div>} />
          <Route path="amigos" element={<div>Amigos tab</div>} />
        </Route>
        <Route path="/app/foro/carta/:id" element={<div>Carta detalle</div>} />
        <Route path="/app/foro/escribir" element={<div>Escribir</div>} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('shows tabs and the public letters tab by default; opens a letter', async () => {
  setup()
  expect(screen.getByText('Cartas públicas')).toBeInTheDocument()
  expect(screen.getByText('Cartas privadas')).toBeInTheDocument()
  expect(screen.getByText('Amigos')).toBeInTheDocument()
  // a fixture author is shown; click the first postcard to open it
  const escribir = screen.getByRole('button', { name: /Escribir carta/i })
  expect(escribir).toBeInTheDocument()
})

test('switching to Amigos tab navigates', async () => {
  setup()
  await userEvent.click(screen.getByText('Amigos'))
  expect(screen.getByText('Amigos tab')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test src/data/foro.test.ts src/app/foro/ForoLayout.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/data/foro.ts`:
```ts
export interface Comentario { id: string; autor: string; texto: string }
export interface CartaPublica { id: string; autor: string; fecha: string; texto: string; comentarios: Comentario[] }
export interface CartaPrivada { id: string; de: string; fecha: string; texto: string }
export interface Conversacion { id: string; amigo: string; ultimo: string }

export const CARTAS_PUBLICAS: CartaPublica[] = [
  {
    id: 'oscar',
    autor: 'Oscar',
    fecha: '03/06/2026',
    texto: 'Mi nombre es Oscar, soy jubilado y todavía tengo mucho para contar. Me gusta caminar por el barrio, leer el diario en el café y conocer gente nueva. Ojalá podamos encontrarnos alguna tarde a conversar.',
    comentarios: [
      { id: 'c1', autor: 'Norma', texto: 'Hola Oscar, un gusto.' },
      { id: 'c2', autor: 'Andres', texto: 'Buenas tardes desde Recoleta.' },
      { id: 'c3', autor: 'Haydee', texto: '¡Qué lindo mensaje! Yo también camino todas las mañanas.' },
    ],
  },
  {
    id: 'susana',
    autor: 'Susana Martinez',
    fecha: '01/06/2026',
    texto: 'Buenas tardes, mi nombre es Susana Martinez, soy de Recoleta, una vecina de toda la vida. Espero llegar a quienes tienen el deseo de generar vínculos amistosos para así poder crear planes en conjunto y pasar el momento.',
    comentarios: [
      { id: 'c1', autor: 'Roberto', texto: '¡Bienvenida al foro, Susana!' },
    ],
  },
]

export const CARTAS_PRIVADAS: CartaPrivada[] = [
  {
    id: 'sergio',
    de: 'Sergio',
    fecha: '03/06/2026',
    texto: 'Hola Amiga, ¿cómo estás? Me acordé de vos mientras preparaba el desayuno. Quería saber cómo te sentías después de la gripe que tuviste. Está bravo el clima, hay que cuidarse mucho... Espero que ya estés recuperada. ¡Te mando un beso grande!',
  },
]

export const CONVERSACIONES: Conversacion[] = [
  { id: 'sergio', amigo: 'Sergio', ultimo: 'Mañana te espero en el parque a las 15hs.' },
  { id: 'norma', amigo: 'Norma', ultimo: 'Ine, ¿cómo te va? Estuve organizando todo.' },
  { id: 'roberto', amigo: 'Roberto', ultimo: 'Inés, ¿vamos a tomar un café hoy?' },
]

export function getCartaPublica(id: string): CartaPublica | undefined {
  return CARTAS_PUBLICAS.find((c) => c.id === id)
}
export function getCartaPrivada(id: string): CartaPrivada | undefined {
  return CARTAS_PRIVADAS.find((c) => c.id === id)
}
```

`src/app/foro/Postcard.tsx`:
```tsx
import type { ReactNode } from 'react'

export function Postcard(
  { autor, fecha, children, className = '' }:
  { autor: string; fecha?: string; children: ReactNode; className?: string },
) {
  return (
    <div className={`relative bg-cream rounded-2xl p-5 shadow-sm border border-chip/20 ${className}`}>
      <span className="absolute top-3 right-4 text-2xl" aria-hidden="true">📮</span>
      <p className="font-semibold text-navy-900">{autor}</p>
      {fecha && <p className="text-ink/50 text-sm mb-2">{fecha}</p>}
      <div className="text-ink/80 leading-relaxed">{children}</div>
    </div>
  )
}
```

`src/app/foro/ForoLayout.tsx`:
```tsx
import { NavLink, Outlet } from 'react-router-dom'
import { MicIcon, SpeakerIcon } from '../../ui/icons'
import { useTts } from '../../state/hooks'

const tabClass = ({ isActive }: { isActive: boolean }) =>
  `flex-1 text-center py-3 text-base font-medium border-b-2 ${isActive ? 'border-teal text-navy-900' : 'border-transparent text-ink/50'}`

export function ForoLayout() {
  const { speak } = useTts()
  return (
    <div>
      <header className="bg-navy-900 text-white px-5 py-4 flex items-center gap-3">
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Foro</h1>
          <p className="text-sm text-white/70">Comunidad de adultos mayores</p>
        </div>
        <MicIcon className="h-6 w-6 opacity-90" />
        <button aria-label="Leer en voz alta" onClick={() => speak('Foro. Comunidad de adultos mayores.')}>
          <SpeakerIcon className="h-6 w-6" />
        </button>
      </header>
      <nav className="flex bg-surface border-b border-chip/20">
        <NavLink end to="/app/foro" className={tabClass}>Cartas públicas</NavLink>
        <NavLink to="/app/foro/privadas" className={tabClass}>Cartas privadas</NavLink>
        <NavLink to="/app/foro/amigos" className={tabClass}>Amigos</NavLink>
      </nav>
      <Outlet />
    </div>
  )
}
```

`src/app/foro/CartasPublicas.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import { Button } from '../../ui/Button'
import { Postcard } from './Postcard'
import { CARTAS_PUBLICAS } from '../../data/foro'

export function CartasPublicas() {
  const navigate = useNavigate()
  return (
    <div className="p-4 flex flex-col gap-4">
      <Button onClick={() => navigate('/app/foro/escribir')}>Escribir carta</Button>
      {CARTAS_PUBLICAS.map((c) => (
        <button key={c.id} className="text-left" onClick={() => navigate(`/app/foro/carta/${c.id}`)}>
          <Postcard autor={c.autor} fecha={c.fecha}>
            <p className="line-clamp-3">{c.texto}</p>
          </Postcard>
        </button>
      ))}
    </div>
  )
}
```

`src/routes.tsx`: replace `<Route path="foro" element={<Placeholder title="Comunidad" />} />` with:
```tsx
<Route path="foro" element={<ForoLayout />}>
  <Route index element={<CartasPublicas />} />
  <Route path="privadas" element={<CartasPrivadas />} />
  <Route path="amigos" element={<Amigos />} />
</Route>
<Route path="foro/carta/:id" element={<CartaPublica />} />
<Route path="foro/escribir" element={<EscribirCarta />} />
<Route path="foro/enviada" element={<CartaEnviada />} />
<Route path="foro/privada/:id" element={<CartaPrivada />} />
<Route path="foro/privada/:id/responder" element={<Responder />} />
```
(The detail/compose routes are siblings so they render full-screen without the tab bar — matching the Figma, where opening a letter is a separate screen.) Add imports for all screens; create STUBS now for `CartaPublica`, `EscribirCarta`, `CartaEnviada`, `CartasPrivadas`, `CartaPrivada`, `Responder`, `Amigos` (each a simple placeholder component) so the build compiles. Leave other routes unchanged.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/data/foro.test.ts src/app/foro/ForoLayout.test.tsx && npm run build`
Expected: PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/data/foro.ts src/data/foro.test.ts src/app/foro src/routes.tsx
git commit -m "feat(foro): data, postcard, tabbed layout, and public letters list"
```

---

### Task 2: Public letter detail + comments (screen 46)

**Files:**
- Modify: `src/app/foro/CartaPublica.tsx` (replace stub)
- Test: `src/app/foro/CartaPublica.test.tsx`

**Interfaces:**
- Consumes: `useParams`, `useNavigate`, `getCartaPublica`, `Postcard`, `Card`, `Button`, `TextField`, `ScreenHeader`.
- Produces: `CartaPublica()` — reads `:id`; unknown → "Carta no encontrada". Else `ScreenHeader title="Foro"` (back → `/app/foro`), the `Postcard` (full text), a "{n} comentarios" heading, the comment list (seeded from fixture into local state), and a comment input (`TextField` + "Comentar" button) that appends `{ id, autor: 'Vos', texto }` to local state and clears the input.

- [ ] **Step 1: Write the failing test**

`src/app/foro/CartaPublica.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CartaPublica } from './CartaPublica'
import { TtsProvider } from '../../state/TtsProvider'

function setup(path: string) {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/app/foro/carta/:id" element={<CartaPublica />} />
        <Route path="/app/foro" element={<div>Foro</div>} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('shows the letter, its comments, and can add one', async () => {
  setup('/app/foro/carta/oscar')
  expect(screen.getByText(/Mi nombre es Oscar/)).toBeInTheDocument()
  expect(screen.getByText('Hola Oscar, un gusto.')).toBeInTheDocument()
  await userEvent.type(screen.getByLabelText(/Escribí un comentario/i), '¡Qué bueno leerte!')
  await userEvent.click(screen.getByRole('button', { name: /Comentar/i }))
  expect(screen.getByText('¡Qué bueno leerte!')).toBeInTheDocument()
})

test('unknown letter shows not found', () => {
  setup('/app/foro/carta/zzz')
  expect(screen.getByText(/no encontrada/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/app/foro/CartaPublica.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/app/foro/CartaPublica.tsx`:
```tsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'
import { Postcard } from './Postcard'
import { getCartaPublica, type Comentario } from '../../data/foro'

export function CartaPublica() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const carta = getCartaPublica(id ?? '')
  const [comentarios, setComentarios] = useState<Comentario[]>(carta ? carta.comentarios : [])
  const [texto, setTexto] = useState('')

  if (!carta) {
    return (
      <div>
        <ScreenHeader title="Foro" onBack={() => navigate('/app/foro')} />
        <p className="p-6 text-lg">Carta no encontrada.</p>
      </div>
    )
  }

  const comentar = () => {
    if (!texto.trim()) return
    setComentarios((prev) => [...prev, { id: `nuevo-${prev.length}`, autor: 'Vos', texto: texto.trim() }])
    setTexto('')
  }

  return (
    <div>
      <ScreenHeader title="Foro" onBack={() => navigate('/app/foro')} />
      <div className="p-4 flex flex-col gap-4">
        <Postcard autor={carta.autor} fecha={carta.fecha}>{carta.texto}</Postcard>
        <h2 className="text-lg font-semibold">{comentarios.length} comentarios</h2>
        <div className="flex flex-col gap-2">
          {comentarios.map((c) => (
            <Card key={c.id} className="flex flex-col">
              <span className="font-semibold">{c.autor}</span>
              <span className="text-ink/80">{c.texto}</span>
            </Card>
          ))}
        </div>
        <TextField label="Escribí un comentario" value={texto} onChange={setTexto} placeholder="Comentá acá..." />
        <Button onClick={comentar}>Comentar</Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/app/foro/CartaPublica.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/foro/CartaPublica.tsx src/app/foro/CartaPublica.test.tsx
git commit -m "feat(foro): public letter detail with comments"
```

---

### Task 3: Compose public letter + confirmation + private letters + reply

**Files:**
- Modify: `src/app/foro/EscribirCarta.tsx`, `src/app/foro/CartaEnviada.tsx`, `src/app/foro/CartasPrivadas.tsx`, `src/app/foro/CartaPrivada.tsx`, `src/app/foro/Responder.tsx` (replace stubs)
- Test: `src/app/foro/Cartas.test.tsx`

**Interfaces:**
- Consumes: router hooks, `getCartaPrivada`, `CARTAS_PRIVADAS`, `Postcard`, `Card`, `Button`, `TextField`, `ScreenHeader`.
- Produces:
  - `EscribirCarta()` — `ScreenHeader title="Escribir carta pública"` (back → `/app/foro`); a read-only "Para: Para foro público" line; a `TextField` "Escribí tu carta"; "Enviar" → `/app/foro/enviada` with `state: { destino: 'el foro público' }`.
  - `CartaEnviada()` — reads `location.state.destino`; "¡Felicitaciones!" + "Tu carta fue enviada a {destino || 'destino'}."; "Volver al Foro" → `/app/foro`.
  - `CartasPrivadas()` — a `Postcard` per `CARTAS_PRIVADAS` (autor `de`, truncated) → `/app/foro/privada/{id}`.
  - `CartaPrivada()` — reads `:id`; unknown → "Carta no encontrada". Else `ScreenHeader title="Foro"` (back → `/app/foro/privadas`), the `Postcard` (full text), a "Responder" `Button` → `/app/foro/privada/{id}/responder`.
  - `Responder()` — reads `:id`; `ScreenHeader title="Responder"` (back → `/app/foro/privada/{id}`); a `TextField` "Escribí tu carta"; "Enviar" → `/app/foro/enviada` with `state: { destino: getCartaPrivada(id)?.de ?? 'tu amigo' }`.

- [ ] **Step 1: Write the failing test**

`src/app/foro/Cartas.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { EscribirCarta } from './EscribirCarta'
import { CartaEnviada } from './CartaEnviada'
import { CartasPrivadas } from './CartasPrivadas'
import { CartaPrivada } from './CartaPrivada'
import { Responder } from './Responder'
import { TtsProvider } from '../../state/TtsProvider'

function router(initial: string) {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/app/foro" element={<div>Foro</div>} />
        <Route path="/app/foro/escribir" element={<EscribirCarta />} />
        <Route path="/app/foro/enviada" element={<CartaEnviada />} />
        <Route path="/app/foro/privadas" element={<CartasPrivadas />} />
        <Route path="/app/foro/privada/:id" element={<CartaPrivada />} />
        <Route path="/app/foro/privada/:id/responder" element={<Responder />} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('composing a public letter confirms it was sent', async () => {
  router('/app/foro/escribir')
  await userEvent.type(screen.getByLabelText(/Escribí tu carta/i), 'Hola a todos')
  await userEvent.click(screen.getByRole('button', { name: /Enviar/i }))
  expect(screen.getByText(/¡Felicitaciones!/i)).toBeInTheDocument()
  expect(screen.getByText(/foro público/i)).toBeInTheDocument()
})

test('opening and replying to a private letter confirms with the friend name', async () => {
  router('/app/foro/privadas')
  await userEvent.click(screen.getByText('Sergio'))
  expect(screen.getByText(/Hola Amiga/)).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /Responder/i }))
  await userEvent.type(screen.getByLabelText(/Escribí tu carta/i), 'Estoy mucho mejor, gracias')
  await userEvent.click(screen.getByRole('button', { name: /Enviar/i }))
  expect(screen.getByText(/Sergio/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/app/foro/Cartas.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/app/foro/EscribirCarta.tsx`:
```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'

export function EscribirCarta() {
  const navigate = useNavigate()
  const [texto, setTexto] = useState('')
  return (
    <div>
      <ScreenHeader title="Escribir carta pública" onBack={() => navigate('/app/foro')} />
      <div className="p-4 flex flex-col gap-4">
        <Card><p className="text-ink/70">Para: Para foro público</p></Card>
        <TextField label="Escribí tu carta" value={texto} onChange={setTexto} placeholder="Escribí acá..." />
        <Button onClick={() => navigate('/app/foro/enviada', { state: { destino: 'el foro público' } })}>Enviar</Button>
      </div>
    </div>
  )
}
```

`src/app/foro/CartaEnviada.tsx`:
```tsx
import { useLocation, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'

export function CartaEnviada() {
  const navigate = useNavigate()
  const location = useLocation()
  const destino = (location.state as { destino?: string } | null)?.destino
  return (
    <div>
      <ScreenHeader title="Foro" />
      <div className="p-6 flex flex-col items-center gap-6 text-center">
        <div className="text-6xl" aria-hidden="true">💌</div>
        <Card className="w-full flex flex-col gap-2">
          <h1 className="text-2xl font-bold">¡Felicitaciones!</h1>
          <p className="text-lg">Tu carta fue enviada a {destino ?? 'destino'}.</p>
        </Card>
        <Button onClick={() => navigate('/app/foro')}>Volver al Foro</Button>
      </div>
    </div>
  )
}
```

`src/app/foro/CartasPrivadas.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import { Postcard } from './Postcard'
import { CARTAS_PRIVADAS } from '../../data/foro'

export function CartasPrivadas() {
  const navigate = useNavigate()
  return (
    <div className="p-4 flex flex-col gap-4">
      {CARTAS_PRIVADAS.map((c) => (
        <button key={c.id} className="text-left" onClick={() => navigate(`/app/foro/privada/${c.id}`)}>
          <Postcard autor={c.de} fecha={c.fecha}>
            <p className="line-clamp-3">{c.texto}</p>
          </Postcard>
        </button>
      ))}
    </div>
  )
}
```

`src/app/foro/CartaPrivada.tsx`:
```tsx
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Button } from '../../ui/Button'
import { Postcard } from './Postcard'
import { getCartaPrivada } from '../../data/foro'

export function CartaPrivada() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const carta = getCartaPrivada(id ?? '')

  if (!carta) {
    return (
      <div>
        <ScreenHeader title="Foro" onBack={() => navigate('/app/foro/privadas')} />
        <p className="p-6 text-lg">Carta no encontrada.</p>
      </div>
    )
  }

  return (
    <div>
      <ScreenHeader title="Foro" onBack={() => navigate('/app/foro/privadas')} />
      <div className="p-4 flex flex-col gap-4">
        <Postcard autor={carta.de} fecha={carta.fecha}>{carta.texto}</Postcard>
        <Button onClick={() => navigate(`/app/foro/privada/${carta.id}/responder`)}>Responder</Button>
      </div>
    </div>
  )
}
```

`src/app/foro/Responder.tsx`:
```tsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'
import { getCartaPrivada } from '../../data/foro'

export function Responder() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [texto, setTexto] = useState('')
  const destino = getCartaPrivada(id ?? '')?.de ?? 'tu amigo'
  return (
    <div>
      <ScreenHeader title="Responder" onBack={() => navigate(`/app/foro/privada/${id}`)} />
      <div className="p-4 flex flex-col gap-4">
        <TextField label="Escribí tu carta" value={texto} onChange={setTexto} placeholder="Escribí acá..." />
        <Button onClick={() => navigate('/app/foro/enviada', { state: { destino } })}>Enviar</Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/app/foro/Cartas.test.tsx && npm run build`
Expected: PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/foro/EscribirCarta.tsx src/app/foro/CartaEnviada.tsx src/app/foro/CartasPrivadas.tsx src/app/foro/CartaPrivada.tsx src/app/foro/Responder.tsx src/app/foro/Cartas.test.tsx
git commit -m "feat(foro): compose public letter, private letters, and reply flow"
```

---

### Task 4: Amigos / conversations tab (screen 56)

**Files:**
- Modify: `src/app/foro/Amigos.tsx` (replace stub)
- Test: `src/app/foro/Amigos.test.tsx`

**Interfaces:**
- Consumes: `useNavigate`, `CONVERSACIONES`, `Card`.
- Produces: `Amigos()` — a "Conversaciones" heading and a `Card` per `CONVERSACIONES` (avatar 👤 + amigo name + last-message preview); tapping opens that friend's private letter if one exists (`/app/foro/privada/{id}`), otherwise stays put (defensive; all fixture conversation ids that have a private letter navigate).

- [ ] **Step 1: Write the failing test**

`src/app/foro/Amigos.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Amigos } from './Amigos'
import { CONVERSACIONES } from '../../data/foro'

test('lists all conversations', () => {
  render(
    <MemoryRouter initialEntries={['/app/foro/amigos']}>
      <Routes><Route path="/app/foro/amigos" element={<Amigos />} /></Routes>
    </MemoryRouter>,
  )
  expect(screen.getByText(/Conversaciones/i)).toBeInTheDocument()
  for (const c of CONVERSACIONES) expect(screen.getByText(c.amigo)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/app/foro/Amigos.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/app/foro/Amigos.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import { Card } from '../../ui/Card'
import { CONVERSACIONES } from '../../data/foro'

export function Amigos() {
  const navigate = useNavigate()
  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Conversaciones</h2>
      {CONVERSACIONES.map((c) => (
        <button key={c.id} className="text-left" onClick={() => navigate(`/app/foro/privada/${c.id}`)}>
          <Card className="flex items-center gap-3">
            <span className="h-12 w-12 rounded-full bg-chip/20 grid place-items-center text-2xl" aria-hidden="true">👤</span>
            <span className="flex-1">
              <span className="block font-semibold">{c.amigo}</span>
              <span className="block text-ink/60 text-sm line-clamp-1">{c.ultimo}</span>
            </span>
          </Card>
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/app/foro && npm run build`
Expected: all Foro tests PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/foro/Amigos.tsx src/app/foro/Amigos.test.tsx
git commit -m "feat(foro): amigos conversations tab"
```

---

## Definition of Done (Phase 5)
- `npm test` and `npm run build` pass.
- From Home "Foro" (or the Comunidad bottom-nav tab): tabs switch; a public letter opens with comments and a new comment appears; "Escribir carta" → confirmation; a private letter opens and reply → confirmation with the friend's name; Amigos lists conversations. Unknown letter ids show graceful not-found.
- Every task committed.

## Next phase
Phase 6 (Clubes): themed community boards (Lectura, Manualidades, Cocina, Bienestar, Mascotas) with comments.
