# +Simple TIF — Phase 3 (Actividades) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build the Actividades feature — a category list → grouped listings → activity detail → reservation confirmation — reached from the Home "Actividades" card.

**Architecture:** A typed fixture (`src/data/actividades.ts`) drives four category screens. Nested routes under `/app/actividades` render inside `AppShell` (bottom nav visible). Reserving an activity navigates to a confirmation screen carrying the activity title via router state.

**Tech Stack:** Existing foundation — React Router (`useParams`, `useNavigate`, `useLocation`), `ScreenHeader`, `Card`, `Button`, tokens.

## Global Constraints

- Offline-first (no network, no remote images — use emoji/SVG tiles). Spanish copy verbatim from the Figma where given.
- Mobile-framed inside `AppShell`. Large type/targets.
- Consumes existing UI: `ScreenHeader`, `Card`, `Button`. No new global state.
- Routes nested under the existing `/app` route in `src/routes.tsx`; all other routes unchanged.
- Conventional commits; do NOT run `npx tsc -b` (use `npm test` / `npm run build`).

## Data (from the Figma, verbatim where legible)
Four categories: **Cine, teatro y museos**; **Ferias y gastronomía**; **Paseos y salidas**; **Vida Saludable**. Listings are grouped by a subheading (`grupo`). Reserve label is "¡Quiero ir!" for `salud`, "Reservar" otherwise.

---

## File Structure

```
src/data/actividades.ts          # CategoriaKey, Categoria, Actividad, CATEGORIAS, ACTIVIDADES, helpers
src/data/actividades.test.ts
src/app/actividades/ActividadesCategorias.tsx   # screen 19
src/app/actividades/ActividadCategoria.tsx      # screens 20–25 (grouped listings)
src/app/actividades/ActividadDetalle.tsx        # screens 24/26 (detail + reserve)
src/app/actividades/ActividadConfirmacion.tsx   # screen 27
src/routes.tsx                   # MODIFY: replace /app/actividades placeholder with nested routes
```

Tests beside sources.

---

### Task 1: Actividades data fixture + Categorías list (screen 19)

**Files:**
- Create: `src/data/actividades.ts`, `src/data/actividades.test.ts`, `src/app/actividades/ActividadesCategorias.tsx`
- Modify: `src/routes.tsx`
- Test: `src/app/actividades/ActividadesCategorias.test.tsx`

**Interfaces:**
- Produces:
  - `type CategoriaKey = 'cine' | 'ferias' | 'paseos' | 'salud'`
  - `interface Categoria { key: CategoriaKey; titulo: string; emoji: string }`
  - `interface Actividad { id: string; categoria: CategoriaKey; grupo: string; titulo: string; lugar: string; fecha: string; descripcion?: string }`
  - `CATEGORIAS: Categoria[]` (4), `ACTIVIDADES: Actividad[]`
  - `actividadesDeCategoria(cat: CategoriaKey): Actividad[]`, `getActividad(id: string): Actividad | undefined`, `getCategoria(key: string): Categoria | undefined`
  - `ActividadesCategorias()` — screen 19: `ScreenHeader title="Actividades"`, one tappable `Card` per category (emoji + titulo) navigating to `/app/actividades/{key}`.
- Consumes: `ScreenHeader`, `Card`, `useNavigate`.

- [ ] **Step 1: Write failing tests**

`src/data/actividades.test.ts`:
```ts
import { CATEGORIAS, ACTIVIDADES, actividadesDeCategoria, getActividad, getCategoria } from './actividades'

test('has four categories with unique keys', () => {
  expect(CATEGORIAS).toHaveLength(4)
  expect(new Set(CATEGORIAS.map((c) => c.key)).size).toBe(4)
})

test('every activity references a real category', () => {
  const keys = new Set(CATEGORIAS.map((c) => c.key))
  for (const a of ACTIVIDADES) expect(keys.has(a.categoria)).toBe(true)
})

test('helpers filter and look up', () => {
  const salud = actividadesDeCategoria('salud')
  expect(salud.length).toBeGreaterThan(0)
  expect(salud.every((a) => a.categoria === 'salud')).toBe(true)
  expect(getActividad(salud[0].id)?.id).toBe(salud[0].id)
  expect(getCategoria('cine')?.titulo).toMatch(/Cine/)
  expect(getActividad('no-existe')).toBeUndefined()
})
```

`src/app/actividades/ActividadesCategorias.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ActividadesCategorias } from './ActividadesCategorias'
import { TtsProvider } from '../../state/TtsProvider'

function setup() {
  return render(
    <TtsProvider><MemoryRouter initialEntries={['/app/actividades']}>
      <Routes>
        <Route path="/app/actividades" element={<ActividadesCategorias />} />
        <Route path="/app/actividades/:cat" element={<div>Categoría cine</div>} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('lists categories and navigates to one', async () => {
  setup()
  expect(screen.getByText('Cine, teatro y museos')).toBeInTheDocument()
  expect(screen.getByText('Vida Saludable')).toBeInTheDocument()
  await userEvent.click(screen.getByText('Cine, teatro y museos'))
  expect(screen.getByText('Categoría cine')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test src/data/actividades.test.ts src/app/actividades/ActividadesCategorias.test.tsx`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement fixture, helpers, screen, route**

`src/data/actividades.ts`:
```ts
export type CategoriaKey = 'cine' | 'ferias' | 'paseos' | 'salud'
export interface Categoria { key: CategoriaKey; titulo: string; emoji: string }
export interface Actividad {
  id: string
  categoria: CategoriaKey
  grupo: string
  titulo: string
  lugar: string
  fecha: string
  descripcion?: string
}

export const CATEGORIAS: Categoria[] = [
  { key: 'cine', titulo: 'Cine, teatro y museos', emoji: '🎭' },
  { key: 'ferias', titulo: 'Ferias y gastronomía', emoji: '🍷' },
  { key: 'paseos', titulo: 'Paseos y salidas', emoji: '🚶' },
  { key: 'salud', titulo: 'Vida Saludable', emoji: '🧘' },
]

export const ACTIVIDADES: Actividad[] = [
  // Cine, teatro y museos
  { id: 'cine-teatro-falla', categoria: 'cine', grupo: 'Teatro', titulo: 'Concierto conservatorio: Manuel de Falla', lugar: 'Gallo 200, Sarmiento (Abasto)', fecha: 'Viernes 22 de Mayo, 19:00h' },
  { id: 'cine-brandoni', categoria: 'cine', grupo: 'Cine', titulo: 'Homenaje a Luis Brandoni', lugar: 'Palacio Libertad (Ex CCK)', fecha: 'Viernes 30 de mayo, 15:30h', descripcion: 'Un recorrido por sus interpretaciones más icónicas.' },
  { id: 'cine-museo-inmigracion', categoria: 'cine', grupo: 'Museo', titulo: 'Visita guiada: Museo de la inmigración', lugar: 'Museo de la inmigración', fecha: 'Miércoles a domingos, 11 a 18hs' },
  // Ferias y gastronomía
  { id: 'ferias-sabe-la-tierra', categoria: 'ferias', grupo: 'Feria', titulo: 'Sabe la tierra — BA Capital Gastronómica', lugar: 'Parque 3 de Febrero', fecha: 'Gratis todos los domingos' },
  { id: 'ferias-cocina-abierta', categoria: 'ferias', grupo: 'Feria', titulo: 'Cocina Abierta: Viva la patria', lugar: 'Palacio Libertad (Ex CCK)', fecha: 'Sábado 24 de mayo, 14 a 20hs' },
  { id: 'ferias-hora-del-te', categoria: 'ferias', grupo: 'Gastronomía', titulo: 'Hora del té y merienda libre', lugar: 'Palacio Paz', fecha: 'Martes 16 de junio, 16 a 18hs' },
  // Paseos y salidas
  { id: 'paseos-edificios', categoria: 'paseos', grupo: 'Experiencias culturales', titulo: 'Recorrido por edificios emblemáticos', lugar: 'Plaza de Mayo', fecha: 'Viernes 30 de Mayo, 17:00h', descripcion: 'Conocé la historia detrás de los edificios más emblemáticos de CABA.' },
  { id: 'paseos-el-plata', categoria: 'paseos', grupo: 'Experiencias culturales', titulo: 'Paseo por el teatro El Plata + clase de milonga', lugar: 'Teatro El Plata', fecha: 'Jueves 29 de mayo, 15:30h' },
  { id: 'paseos-la-boca', categoria: 'paseos', grupo: 'Experiencias culturales', titulo: 'Visita guiada por el barrio de inmigrantes', lugar: 'Barrio La Boca', fecha: 'Miércoles a domingos, 11 a 18hs' },
  // Vida Saludable
  { id: 'salud-bici', categoria: 'salud', grupo: 'Aire Libre', titulo: 'Soltáte: aprendé a andar en Bici', lugar: 'Plaza Clemente', fecha: 'Sábado 6 de Junio, 13hs' },
  { id: 'salud-plazas-activas', categoria: 'salud', grupo: 'Plazas Amigables', titulo: 'Plazas Activas: ¡Comuna 8 vení a hacer ejercicio!', lugar: 'Plaza Sudamérica', fecha: 'Martes y jueves, 11hs' },
  { id: 'salud-stretching', categoria: 'salud', grupo: 'Plazas Amigables', titulo: 'Clases de stretching en Comuna 2', lugar: 'Plaza Francia', fecha: 'Miércoles, 10hs', descripcion: '¡Disfrutá del estiramiento! Todos los Miércoles a las 10hs. Profesora Laura P.' },
]

export function actividadesDeCategoria(cat: CategoriaKey): Actividad[] {
  return ACTIVIDADES.filter((a) => a.categoria === cat)
}
export function getActividad(id: string): Actividad | undefined {
  return ACTIVIDADES.find((a) => a.id === id)
}
export function getCategoria(key: string): Categoria | undefined {
  return CATEGORIAS.find((c) => c.key === key)
}
```

`src/app/actividades/ActividadesCategorias.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { CATEGORIAS } from '../../data/actividades'

export function ActividadesCategorias() {
  const navigate = useNavigate()
  return (
    <div>
      <ScreenHeader title="Actividades" onBack={() => navigate('/app/home')} />
      <div className="p-4 flex flex-col gap-3">
        {CATEGORIAS.map((c) => (
          <button key={c.key} className="text-left" onClick={() => navigate(`/app/actividades/${c.key}`)}>
            <Card className="flex items-center gap-4">
              <span className="text-3xl" aria-hidden="true">{c.emoji}</span>
              <span className="text-lg font-semibold">{c.titulo}</span>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
```

`src/routes.tsx`: replace the single `actividades` placeholder child route with a nested group (add imports for the four screens; the other Task screens are created in Tasks 2–3, so for THIS task create minimal stubs for `ActividadCategoria`, `ActividadDetalle`, `ActividadConfirmacion` so the build compiles — each a `<div className="p-6">…</div>` inside a `ScreenHeader`-less wrapper is fine, e.g. `export function ActividadCategoria(){ return <div className="p-6 text-lg">Categoría (en construcción)</div> }`):
```tsx
// imports
import { ActividadesCategorias } from './app/actividades/ActividadesCategorias'
import { ActividadCategoria } from './app/actividades/ActividadCategoria'
import { ActividadDetalle } from './app/actividades/ActividadDetalle'
import { ActividadConfirmacion } from './app/actividades/ActividadConfirmacion'

// inside <Route path="/app" element={<AppShell/>}> children, replace:
//   <Route path="actividades" element={<Placeholder title="Actividades" />} />
// with:
<Route path="actividades">
  <Route index element={<ActividadesCategorias />} />
  <Route path="confirmada" element={<ActividadConfirmacion />} />
  <Route path=":cat" element={<ActividadCategoria />} />
  <Route path=":cat/:id" element={<ActividadDetalle />} />
</Route>
```
Create the three stub files now (`ActividadCategoria.tsx`, `ActividadDetalle.tsx`, `ActividadConfirmacion.tsx`), each exporting its named component rendering a simple placeholder div. Leave all other routes unchanged.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/data/actividades.test.ts src/app/actividades/ActividadesCategorias.test.tsx && npm run build`
Expected: PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/data/actividades.ts src/data/actividades.test.ts src/app/actividades src/routes.tsx
git commit -m "feat(actividades): data fixture and categories list with nested routes"
```

---

### Task 2: Category listings (screens 20–25)

**Files:**
- Modify: `src/app/actividades/ActividadCategoria.tsx` (replace stub)
- Test: `src/app/actividades/ActividadCategoria.test.tsx`

**Interfaces:**
- Consumes: `useParams<{ cat }>`, `useNavigate`, `getCategoria`, `actividadesDeCategoria`, `ScreenHeader`, `Card`.
- Produces: `ActividadCategoria()` — reads `:cat`; if unknown category, shows "Categoría no encontrada". Otherwise `ScreenHeader title={categoria.titulo}` (back → `/app/actividades`) and the category's activities grouped by `grupo` (each group shows its label as a small teal pill heading, then a `Card` per activity with titulo + 📍 lugar + fecha). Tapping a card navigates to `/app/actividades/{cat}/{id}`.

- [ ] **Step 1: Write the failing test**

`src/app/actividades/ActividadCategoria.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ActividadCategoria } from './ActividadCategoria'
import { TtsProvider } from '../../state/TtsProvider'

function setup(path: string) {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/app/actividades/:cat" element={<ActividadCategoria />} />
        <Route path="/app/actividades/:cat/:id" element={<div>Detalle actividad</div>} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('shows the category title, grouped activities, and navigates to detail', async () => {
  setup('/app/actividades/cine')
  expect(screen.getByRole('heading', { name: /Cine, teatro y museos/i })).toBeInTheDocument()
  expect(screen.getByText('Teatro')).toBeInTheDocument()
  expect(screen.getByText('Homenaje a Luis Brandoni')).toBeInTheDocument()
  await userEvent.click(screen.getByText('Homenaje a Luis Brandoni'))
  expect(screen.getByText('Detalle actividad')).toBeInTheDocument()
})

test('unknown category shows a not-found message', () => {
  setup('/app/actividades/zzz')
  expect(screen.getByText(/no encontrada/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/app/actividades/ActividadCategoria.test.tsx`
Expected: FAIL (stub).

- [ ] **Step 3: Implement**

`src/app/actividades/ActividadCategoria.tsx`:
```tsx
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { getCategoria, actividadesDeCategoria, type CategoriaKey, type Actividad } from '../../data/actividades'

export function ActividadCategoria() {
  const navigate = useNavigate()
  const { cat } = useParams<{ cat: string }>()
  const categoria = getCategoria(cat ?? '')

  if (!categoria) {
    return (
      <div>
        <ScreenHeader title="Actividades" onBack={() => navigate('/app/actividades')} />
        <p className="p-6 text-lg">Categoría no encontrada.</p>
      </div>
    )
  }

  const actividades = actividadesDeCategoria(categoria.key as CategoriaKey)
  const grupos = actividades.reduce<Record<string, Actividad[]>>((acc, a) => {
    (acc[a.grupo] ||= []).push(a); return acc
  }, {})

  return (
    <div>
      <ScreenHeader title={categoria.titulo} onBack={() => navigate('/app/actividades')} />
      <div className="p-4 flex flex-col gap-5">
        {Object.entries(grupos).map(([grupo, items]) => (
          <section key={grupo} className="flex flex-col gap-3">
            <span className="self-start rounded-full bg-teal/20 text-navy-900 px-3 py-1 text-sm font-semibold">{grupo}</span>
            {items.map((a) => (
              <button key={a.id} className="text-left" onClick={() => navigate(`/app/actividades/${categoria.key}/${a.id}`)}>
                <Card className="flex flex-col gap-1">
                  <p className="font-semibold">{a.titulo}</p>
                  <p className="text-ink/70">📍 {a.lugar}</p>
                  <p className="text-ink/60 text-sm">{a.fecha}</p>
                </Card>
              </button>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/app/actividades/ActividadCategoria.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/actividades/ActividadCategoria.tsx src/app/actividades/ActividadCategoria.test.tsx
git commit -m "feat(actividades): category listings grouped by subheading"
```

---

### Task 3: Activity detail + reservation confirmation (screens 24/26/27)

**Files:**
- Modify: `src/app/actividades/ActividadDetalle.tsx`, `src/app/actividades/ActividadConfirmacion.tsx` (replace stubs)
- Test: `src/app/actividades/ActividadDetalle.test.tsx`

**Interfaces:**
- Consumes: `useParams<{ cat, id }>`, `useNavigate`, `useLocation`, `getActividad`, `ScreenHeader`, `Card`, `Button`.
- Produces:
  - `ActividadDetalle()` — reads `:id`; if unknown, "Actividad no encontrada". Otherwise `ScreenHeader title={categoria titulo or 'Actividad'}` (back → `/app/actividades/{cat}`), an image placeholder tile, `titulo`, `descripcion` (if any), 📍 `lugar`, `fecha`, and a reserve `Button` labelled "¡Quiero ir!" when `categoria==='salud'` else "Reservar". Reserve navigates to `/app/actividades/confirmada` with `state: { titulo }`.
  - `ActividadConfirmacion()` — `ScreenHeader title="Confirmación de inscripción"`; a success `Card`: "¡Felicitaciones!" + "Te inscribiste en {titulo || 'la actividad'}."; a `Button` "Volver a Actividades" → `/app/actividades`.

- [ ] **Step 1: Write the failing test**

`src/app/actividades/ActividadDetalle.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ActividadDetalle } from './ActividadDetalle'
import { ActividadConfirmacion } from './ActividadConfirmacion'
import { TtsProvider } from '../../state/TtsProvider'

function setup(path: string) {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/app/actividades/:cat/:id" element={<ActividadDetalle />} />
        <Route path="/app/actividades/confirmada" element={<ActividadConfirmacion />} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('salud activity shows ¡Quiero ir! and reserving confirms with the title', async () => {
  setup('/app/actividades/salud/salud-stretching')
  expect(screen.getByText('Clases de stretching en Comuna 2')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /¡Quiero ir!/i }))
  expect(screen.getByText(/¡Felicitaciones!/i)).toBeInTheDocument()
  expect(screen.getByText(/Clases de stretching en Comuna 2/)).toBeInTheDocument()
})

test('non-salud activity shows Reservar', () => {
  setup('/app/actividades/cine/cine-brandoni')
  expect(screen.getByRole('button', { name: /^Reservar$/ })).toBeInTheDocument()
})

test('unknown activity shows not found', () => {
  setup('/app/actividades/cine/zzz')
  expect(screen.getByText(/no encontrada/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/app/actividades/ActividadDetalle.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement detail + confirmation**

`src/app/actividades/ActividadDetalle.tsx`:
```tsx
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { getActividad, getCategoria } from '../../data/actividades'

export function ActividadDetalle() {
  const navigate = useNavigate()
  const { cat, id } = useParams<{ cat: string; id: string }>()
  const actividad = getActividad(id ?? '')
  const categoria = getCategoria(cat ?? '')

  if (!actividad) {
    return (
      <div>
        <ScreenHeader title="Actividad" onBack={() => navigate('/app/actividades')} />
        <p className="p-6 text-lg">Actividad no encontrada.</p>
      </div>
    )
  }

  const reservar = () =>
    navigate('/app/actividades/confirmada', { state: { titulo: actividad.titulo } })

  return (
    <div>
      <ScreenHeader title={categoria?.titulo ?? 'Actividad'} onBack={() => navigate(`/app/actividades/${cat}`)} />
      <div className="p-4 flex flex-col gap-4">
        <div className="h-40 rounded-2xl bg-teal/20 grid place-items-center text-5xl" aria-hidden="true">
          {categoria?.emoji ?? '📅'}
        </div>
        <h1 className="text-2xl font-bold">{actividad.titulo}</h1>
        {actividad.descripcion && <p className="text-ink/70">{actividad.descripcion}</p>}
        <Card className="flex flex-col gap-1">
          <p className="text-ink/80">📍 {actividad.lugar}</p>
          <p className="text-ink/60">{actividad.fecha}</p>
        </Card>
        <Button onClick={reservar}>{actividad.categoria === 'salud' ? '¡Quiero ir!' : 'Reservar'}</Button>
      </div>
    </div>
  )
}
```

`src/app/actividades/ActividadConfirmacion.tsx`:
```tsx
import { useLocation, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'

export function ActividadConfirmacion() {
  const navigate = useNavigate()
  const location = useLocation()
  const titulo = (location.state as { titulo?: string } | null)?.titulo

  return (
    <div>
      <ScreenHeader title="Confirmación de inscripción" />
      <div className="p-6 flex flex-col items-center gap-6 text-center">
        <div className="text-6xl" aria-hidden="true">🎉</div>
        <Card className="w-full flex flex-col gap-2">
          <h1 className="text-2xl font-bold">¡Felicitaciones!</h1>
          <p className="text-lg">Te inscribiste en {titulo ?? 'la actividad'}.</p>
        </Card>
        <Button onClick={() => navigate('/app/actividades')}>Volver a Actividades</Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/app/actividades && npm run build`
Expected: all Actividades tests PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/actividades/ActividadDetalle.tsx src/app/actividades/ActividadConfirmacion.tsx src/app/actividades/ActividadDetalle.test.tsx
git commit -m "feat(actividades): activity detail and reservation confirmation"
```

---

## Definition of Done (Phase 3)

- `npm test` and `npm run build` pass.
- From Home → Actividades → a category → an activity → Reservar/¡Quiero ir! → confirmation → back to Actividades all works in the browser.
- Unknown category/activity ids show a graceful not-found message (no crash).
- Every task committed.

## Next phase

Phase 4 (Empleo) adds the jobs board, CV builder, and application flow reached from the Home "Empleo" card.
