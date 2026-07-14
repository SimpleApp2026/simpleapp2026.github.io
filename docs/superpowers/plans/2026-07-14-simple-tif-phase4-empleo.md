# +Simple TIF — Phase 4 (Empleo) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build the Empleo feature — menu → CV builder → CV preview, and job opportunities → application → confirmation, plus a capacitaciones list — reached from the Home "Empleo" card.

**Architecture:** Typed fixtures (`src/data/empleo.ts`) drive the job list and capacitaciones. Nested routes under `/app/empleo` render inside `AppShell`. The CV builder collects fields into local state and passes them to the CV preview via router state; the CV preview also shows static demo sections (Susana's CV from the Figma). Applying to a job navigates to a confirmation screen.

**Tech Stack:** Existing foundation — React Router, `ScreenHeader`, `Card`, `Button`, `Chip`, `TextField`, `useUser` (read `profile` for the CV name).

## Global Constraints
- Offline-first (no network, emoji/SVG tiles). Spanish copy verbatim from Figma where legible; plausible Spanish placeholder where the Figma text wasn't captured (capacitaciones).
- Mobile-framed inside `AppShell`. Consumes existing UI + `useUser` (read-only). No changes to shared providers.
- Routes nested under `/app` in `src/routes.tsx`; other routes unchanged.
- Conventional commits; do NOT run `npx tsc -b`.

---

## File Structure
```
src/data/empleo.ts                         # Job, CAPACITACIONES, JOBS, getJob
src/data/empleo.test.ts
src/app/empleo/EmpleoMenu.tsx              # screen 31
src/app/empleo/CvBuilder.tsx               # screen 32
src/app/empleo/CvPreliminar.tsx            # screen 33
src/app/empleo/Oportunidades.tsx           # screen 34
src/app/empleo/Postular.tsx                # screen 35
src/app/empleo/PostulacionConfirmada.tsx   # screen 36
src/app/empleo/Capacitaciones.tsx          # screen 37
src/routes.tsx                             # MODIFY: replace /app/empleo placeholder with nested routes
```

---

### Task 1: Empleo data + menu (screen 31) + nested routes/stubs

**Files:**
- Create: `src/data/empleo.ts`, `src/data/empleo.test.ts`, `src/app/empleo/EmpleoMenu.tsx`, and minimal STUBS for `CvBuilder`, `CvPreliminar`, `Oportunidades`, `Postular`, `PostulacionConfirmada`, `Capacitaciones`
- Modify: `src/routes.tsx`
- Test: `src/app/empleo/EmpleoMenu.test.tsx`

**Interfaces:**
- Produces:
  - `interface Job { id: string; puesto: string; rubro: string; descripcion: string }`
  - `interface Capacitacion { id: string; titulo: string; detalle: string }`
  - `JOBS: Job[]` (3), `CAPACITACIONES: Capacitacion[]` (3), `getJob(id): Job | undefined`
  - `EmpleoMenu()` — `ScreenHeader title="Empleo"` (back → `/app/home`), three tappable `Card`s: "Oportunidades laborales" → `/app/empleo/oportunidades`, "Cargá tu experiencia" → `/app/empleo/experiencia`, "Capacitaciones" → `/app/empleo/capacitaciones`.
- Consumes: `ScreenHeader`, `Card`, `useNavigate`.

- [ ] **Step 1: Write failing tests**

`src/data/empleo.test.ts`:
```ts
import { JOBS, CAPACITACIONES, getJob } from './empleo'

test('has jobs with unique ids and a lookup', () => {
  expect(JOBS.length).toBeGreaterThanOrEqual(3)
  expect(new Set(JOBS.map((j) => j.id)).size).toBe(JOBS.length)
  expect(getJob(JOBS[0].id)?.id).toBe(JOBS[0].id)
  expect(getJob('no-existe')).toBeUndefined()
})

test('has capacitaciones', () => {
  expect(CAPACITACIONES.length).toBeGreaterThanOrEqual(3)
})
```

`src/app/empleo/EmpleoMenu.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { EmpleoMenu } from './EmpleoMenu'
import { TtsProvider } from '../../state/TtsProvider'

function setup() {
  return render(
    <TtsProvider><MemoryRouter initialEntries={['/app/empleo']}>
      <Routes>
        <Route path="/app/empleo" element={<EmpleoMenu />} />
        <Route path="/app/empleo/oportunidades" element={<div>Oportunidades</div>} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('lists the three empleo options and navigates', async () => {
  setup()
  expect(screen.getByText('Cargá tu experiencia')).toBeInTheDocument()
  expect(screen.getByText('Capacitaciones')).toBeInTheDocument()
  await userEvent.click(screen.getByText('Oportunidades laborales'))
  expect(screen.getByText('Oportunidades')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test src/data/empleo.test.ts src/app/empleo/EmpleoMenu.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/data/empleo.ts`:
```ts
export interface Job { id: string; puesto: string; rubro: string; descripcion: string }
export interface Capacitacion { id: string; titulo: string; detalle: string }

export const JOBS: Job[] = [
  { id: 'gerente-operaciones', puesto: 'Gerente de Operaciones', rubro: 'Mantenimiento Edificio/Corporativo', descripcion: 'Buscamos una persona con experiencia en la coordinación de equipos de mantenimiento y servicios generales para edificios corporativos. Se valora la organización, el trato cordial y la responsabilidad.' },
  { id: 'secretaria-bilingue', puesto: 'Secretaria Ejecutiva Bilingüe', rubro: 'Energía/Administrativo', descripcion: 'Importante empresa del sector energético incorpora una secretaria ejecutiva con dominio de inglés para tareas administrativas, agenda y atención de reuniones. Se ofrece un ambiente de trabajo respetuoso y flexible.' },
  { id: 'analista-cuentas', puesto: 'Analista de Cuentas a Pagar', rubro: 'Contable/Administrativo', descripcion: 'Importante grupo de empresas con más de 60 años de trayectoria en los sectores de construcción, minería, arquitectura y agroindustria se encuentra en la búsqueda de un/a Analista de Cuentas a Pagar. El principal desafío de esta posición es gestionar de manera integral el ciclo de cuentas por pagar y velar por el cumplimiento de las normativas fiscales vigentes. Quien ocupe el rol actuará como nexo analítico entre las áreas.' },
]

export const CAPACITACIONES: Capacitacion[] = [
  { id: 'computacion', titulo: 'Introducción a la computación', detalle: 'Aprendé a usar la computadora desde cero, a tu ritmo.' },
  { id: 'celular', titulo: 'Usá tu celular con confianza', detalle: 'Mensajes, fotos, videollamadas y apps útiles del día a día.' },
  { id: 'tramites-digitales', titulo: 'Trámites digitales', detalle: 'Turnos, gestiones y trámites online de forma simple y segura.' },
]

export function getJob(id: string): Job | undefined {
  return JOBS.find((j) => j.id === id)
}
```

`src/app/empleo/EmpleoMenu.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'

const OPCIONES = [
  { emoji: '📋', titulo: 'Oportunidades laborales', to: '/app/empleo/oportunidades' },
  { emoji: '📝', titulo: 'Cargá tu experiencia', to: '/app/empleo/experiencia' },
  { emoji: '🎓', titulo: 'Capacitaciones', to: '/app/empleo/capacitaciones' },
]

export function EmpleoMenu() {
  const navigate = useNavigate()
  return (
    <div>
      <ScreenHeader title="Empleo" onBack={() => navigate('/app/home')} />
      <div className="p-4 flex flex-col gap-3">
        {OPCIONES.map((o) => (
          <button key={o.to} className="text-left" onClick={() => navigate(o.to)}>
            <Card className="flex items-center gap-4">
              <span className="text-3xl" aria-hidden="true">{o.emoji}</span>
              <span className="text-lg font-semibold">{o.titulo}</span>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
```

`src/routes.tsx`: replace `<Route path="empleo" element={<Placeholder title="Empleo" />} />` with:
```tsx
<Route path="empleo">
  <Route index element={<EmpleoMenu />} />
  <Route path="experiencia" element={<CvBuilder />} />
  <Route path="cv" element={<CvPreliminar />} />
  <Route path="oportunidades" element={<Oportunidades />} />
  <Route path="oportunidades/:id" element={<Postular />} />
  <Route path="postulado" element={<PostulacionConfirmada />} />
  <Route path="capacitaciones" element={<Capacitaciones />} />
</Route>
```
Add imports for all seven screens. Create minimal STUBS now for `CvBuilder`, `CvPreliminar`, `Oportunidades`, `Postular`, `PostulacionConfirmada`, `Capacitaciones` (each `export function X(){ return <div className="p-6 text-lg">… (en construcción)</div> }`) so the build compiles. Leave other routes unchanged.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/data/empleo.test.ts src/app/empleo/EmpleoMenu.test.tsx && npm run build`
Expected: PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/data/empleo.ts src/data/empleo.test.ts src/app/empleo src/routes.tsx
git commit -m "feat(empleo): data fixture and menu with nested routes"
```

---

### Task 2: CV builder (32) + CV preview (33)

**Files:**
- Modify: `src/app/empleo/CvBuilder.tsx`, `src/app/empleo/CvPreliminar.tsx` (replace stubs)
- Test: `src/app/empleo/Cv.test.tsx`

**Interfaces:**
- Consumes: `useUser().profile` (read name), `useNavigate`, `useLocation`, `TextField`, `Chip`, `Button`, `Card`, `ScreenHeader`.
- Produces:
  - `CvBuilder()` — assistant line "¡Creemos tu CV!"; `TextField`s "Nombre y apellido" (placeholder "Ej: Carlos Gutierrez"), "Barrio" (placeholder "Ej: Recoleta"), "Teléfono", "Email"; a "Disponibilidad" pair of `Chip`s ("Media jornada" / "Jornada completa", single-select); a `Button` "Ver curriculum" → navigates to `/app/empleo/cv` with `state: { nombre, disponibilidad }`.
  - `CvPreliminar()` — `ScreenHeader title="CV"`; a header `Card` with the name (from router state `nombre`, else `profile` name, else "Susana Martinez") and "Profesora de Inglés"; sections "Sobre mi" ("Soy profesora de inglés con 30 años de experiencia."), "Educación" ("Profesorado en Lenguas Vivas"), "Habilidades" (Paquete Office, Responsable, Empática, Paciente — as chips), "Experiencia" ("Inmaculada Concepción de María (1992 – 2012)", "Canadá School (2012 – 2022)"); a `Button` "Guardar" → `/app/empleo`.

- [ ] **Step 1: Write the failing test**

`src/app/empleo/Cv.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CvBuilder } from './CvBuilder'
import { CvPreliminar } from './CvPreliminar'
import { UserProvider } from '../../state/UserProvider'
import { TtsProvider } from '../../state/TtsProvider'

function setup() {
  return render(
    <UserProvider><TtsProvider><MemoryRouter initialEntries={['/app/empleo/experiencia']}>
      <Routes>
        <Route path="/app/empleo/experiencia" element={<CvBuilder />} />
        <Route path="/app/empleo/cv" element={<CvPreliminar />} />
        <Route path="/app/empleo" element={<div>Menú empleo</div>} />
      </Routes>
    </MemoryRouter></TtsProvider></UserProvider>,
  )
}

test('builder collects a name and shows it on the CV preview', async () => {
  setup()
  await userEvent.type(screen.getByLabelText('Nombre y apellido'), 'Carlos Gutierrez')
  await userEvent.click(screen.getByRole('button', { name: /Media jornada/i }))
  await userEvent.click(screen.getByRole('button', { name: /Ver curriculum/i }))
  expect(screen.getByText('Carlos Gutierrez')).toBeInTheDocument()
  expect(screen.getByText(/Profesora de Inglés/)).toBeInTheDocument()
  expect(screen.getByText('Educación')).toBeInTheDocument()
})

test('CV Guardar returns to the empleo menu', async () => {
  render(
    <UserProvider><TtsProvider><MemoryRouter initialEntries={['/app/empleo/cv']}>
      <Routes>
        <Route path="/app/empleo/cv" element={<CvPreliminar />} />
        <Route path="/app/empleo" element={<div>Menú empleo</div>} />
      </Routes>
    </MemoryRouter></TtsProvider></UserProvider>,
  )
  await userEvent.click(screen.getByRole('button', { name: /Guardar/i }))
  expect(screen.getByText('Menú empleo')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/app/empleo/Cv.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/app/empleo/CvBuilder.tsx`:
```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { TextField } from '../../ui/TextField'
import { Chip } from '../../ui/Chip'
import { Button } from '../../ui/Button'

type Disp = 'Media jornada' | 'Jornada completa'

export function CvBuilder() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [barrio, setBarrio] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [disp, setDisp] = useState<Disp | null>(null)

  const ver = () => navigate('/app/empleo/cv', { state: { nombre, disponibilidad: disp } })

  return (
    <div>
      <ScreenHeader title="Cargá tu experiencia" onBack={() => navigate('/app/empleo')} />
      <div className="p-4">
        <p className="text-base text-ink/70 mb-4">¡Creemos tu CV!</p>
        <TextField label="Nombre y apellido" value={nombre} onChange={setNombre} placeholder="Ej: Carlos Gutierrez" />
        <TextField label="Barrio" value={barrio} onChange={setBarrio} placeholder="Ej: Recoleta" />
        <TextField label="Teléfono" value={telefono} onChange={setTelefono} placeholder="Escribí tu número" />
        <TextField label="Email" value={email} onChange={setEmail} placeholder="Escribí tu email" />
        <p className="text-lg font-semibold mb-2">Disponibilidad</p>
        <div className="flex gap-3 mb-6">
          {(['Media jornada', 'Jornada completa'] as Disp[]).map((d) => (
            <Chip key={d} selected={disp === d} onClick={() => setDisp(d)}>{d}</Chip>
          ))}
        </div>
        <Button onClick={ver}>Ver curriculum</Button>
      </div>
    </div>
  )
}
```

`src/app/empleo/CvPreliminar.tsx`:
```tsx
import { useLocation, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Chip } from '../../ui/Chip'
import { Button } from '../../ui/Button'
import { useUser } from '../../state/hooks'

const HABILIDADES = ['Paquete Office', 'Responsable', 'Empática', 'Paciente']

export function CvPreliminar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useUser()
  const stateNombre = (location.state as { nombre?: string } | null)?.nombre
  const nombre = (stateNombre && stateNombre.trim())
    || (profile ? `${profile.nombre} ${profile.apellido}`.trim() : '')
    || 'Susana Martinez'

  return (
    <div>
      <ScreenHeader title="CV" onBack={() => navigate('/app/empleo/experiencia')} />
      <div className="p-4 flex flex-col gap-4">
        <Card className="bg-teal/10">
          <h1 className="text-2xl font-bold">{nombre}</h1>
          <p className="text-ink/70">Profesora de Inglés</p>
        </Card>
        <Card>
          <h2 className="font-semibold mb-1">Sobre mi</h2>
          <p className="text-ink/80">Soy profesora de inglés con 30 años de experiencia.</p>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <h2 className="font-semibold mb-1">Educación</h2>
            <p className="text-ink/80 text-sm">Profesorado en Lenguas Vivas</p>
          </Card>
          <Card>
            <h2 className="font-semibold mb-2">Habilidades</h2>
            <div className="flex flex-wrap gap-2">
              {HABILIDADES.map((h) => <Chip key={h}>{h}</Chip>)}
            </div>
          </Card>
        </div>
        <Card>
          <h2 className="font-semibold mb-1">Experiencia</h2>
          <p className="text-ink/80 text-sm">Inmaculada Concepción de María (1992 – 2012)</p>
          <p className="text-ink/80 text-sm">Canadá School (2012 – 2022)</p>
        </Card>
        <Button onClick={() => navigate('/app/empleo')}>Guardar</Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/app/empleo/Cv.test.tsx`
Expected: PASS (both tests).

- [ ] **Step 5: Commit**

```bash
git add src/app/empleo/CvBuilder.tsx src/app/empleo/CvPreliminar.tsx src/app/empleo/Cv.test.tsx
git commit -m "feat(empleo): CV builder and preview"
```

---

### Task 3: Oportunidades (34) + Postular (35) + confirmación (36) + Capacitaciones (37)

**Files:**
- Modify: `src/app/empleo/Oportunidades.tsx`, `src/app/empleo/Postular.tsx`, `src/app/empleo/PostulacionConfirmada.tsx`, `src/app/empleo/Capacitaciones.tsx` (replace stubs)
- Test: `src/app/empleo/Oportunidades.test.tsx`, `src/app/empleo/Capacitaciones.test.tsx`

**Interfaces:**
- Consumes: `JOBS`/`getJob`/`CAPACITACIONES`, router hooks, `ScreenHeader`, `Card`, `Button`.
- Produces:
  - `Oportunidades()` — `ScreenHeader title="Oportunidades Laborales"` (back → `/app/empleo`); a `Card` per `JOBS` item ("Puesto: {puesto}", "Rubro: {rubro}", `Button` "Conocer más" → `/app/empleo/oportunidades/{id}`).
  - `Postular()` — reads `:id`; unknown → "Puesto no encontrado". Else header "Oportunidades Laborales", "Puesto: {puesto}", `descripcion`, `Button` "Postular" → `/app/empleo/postulado` with `state: { puesto }`.
  - `PostulacionConfirmada()` — reads `location.state.puesto`; "¡Felicidades!" + "Ya te postulaste{ puesto ? ` a ${puesto}` : '' }." + `Button` "Ok" → `/app/empleo`.
  - `Capacitaciones()` — `ScreenHeader title="Capacitaciones"` (back → `/app/empleo`); a `Card` per `CAPACITACIONES` (titulo + detalle).

- [ ] **Step 1: Write failing tests**

`src/app/empleo/Oportunidades.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Oportunidades } from './Oportunidades'
import { Postular } from './Postular'
import { PostulacionConfirmada } from './PostulacionConfirmada'
import { TtsProvider } from '../../state/TtsProvider'
import { JOBS } from '../../data/empleo'

function wrap(initial: string) {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/app/empleo/oportunidades" element={<Oportunidades />} />
        <Route path="/app/empleo/oportunidades/:id" element={<Postular />} />
        <Route path="/app/empleo/postulado" element={<PostulacionConfirmada />} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('lists jobs, opens one, and applies', async () => {
  wrap('/app/empleo/oportunidades')
  expect(screen.getByText(/Gerente de Operaciones/)).toBeInTheDocument()
  await userEvent.click(screen.getAllByRole('button', { name: /Conocer más/i })[2])
  expect(screen.getByText(/Analista de Cuentas a Pagar/)).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /Postular/i }))
  expect(screen.getByText(/¡Felicidades!/i)).toBeInTheDocument()
  expect(screen.getByText(/Ya te postulaste/i)).toBeInTheDocument()
})

test('unknown job id shows not found', () => {
  wrap('/app/empleo/oportunidades/zzz')
  expect(screen.getByText(/no encontrado/i)).toBeInTheDocument()
})
```

`src/app/empleo/Capacitaciones.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Capacitaciones } from './Capacitaciones'
import { TtsProvider } from '../../state/TtsProvider'
import { CAPACITACIONES } from '../../data/empleo'

test('lists all capacitaciones', () => {
  render(
    <TtsProvider><MemoryRouter initialEntries={['/app/empleo/capacitaciones']}>
      <Routes><Route path="/app/empleo/capacitaciones" element={<Capacitaciones />} /></Routes>
    </MemoryRouter></TtsProvider>,
  )
  for (const c of CAPACITACIONES) expect(screen.getByText(c.titulo)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test src/app/empleo/Oportunidades.test.tsx src/app/empleo/Capacitaciones.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/app/empleo/Oportunidades.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { JOBS } from '../../data/empleo'

export function Oportunidades() {
  const navigate = useNavigate()
  return (
    <div>
      <ScreenHeader title="Oportunidades Laborales" onBack={() => navigate('/app/empleo')} />
      <div className="p-4 flex flex-col gap-3">
        {JOBS.map((j) => (
          <Card key={j.id} className="flex flex-col gap-2">
            <p className="font-semibold">Puesto: {j.puesto}</p>
            <p className="text-ink/70 text-sm">Rubro: {j.rubro}</p>
            <Button onClick={() => navigate(`/app/empleo/oportunidades/${j.id}`)}>Conocer más</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

`src/app/empleo/Postular.tsx`:
```tsx
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { getJob } from '../../data/empleo'

export function Postular() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const job = getJob(id ?? '')

  if (!job) {
    return (
      <div>
        <ScreenHeader title="Oportunidades Laborales" onBack={() => navigate('/app/empleo/oportunidades')} />
        <p className="p-6 text-lg">Puesto no encontrado.</p>
      </div>
    )
  }

  return (
    <div>
      <ScreenHeader title="Oportunidades Laborales" onBack={() => navigate('/app/empleo/oportunidades')} />
      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Puesto: {job.puesto}</h1>
        <Card><p className="text-ink/80 leading-relaxed">{job.descripcion}</p></Card>
        <Button onClick={() => navigate('/app/empleo/postulado', { state: { puesto: job.puesto } })}>Postular</Button>
      </div>
    </div>
  )
}
```

`src/app/empleo/PostulacionConfirmada.tsx`:
```tsx
import { useLocation, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'

export function PostulacionConfirmada() {
  const navigate = useNavigate()
  const location = useLocation()
  const puesto = (location.state as { puesto?: string } | null)?.puesto

  return (
    <div>
      <ScreenHeader title="Oportunidades Laborales" />
      <div className="p-6 flex flex-col items-center gap-6 text-center">
        <div className="text-6xl" aria-hidden="true">🎉</div>
        <Card className="w-full flex flex-col gap-2">
          <h1 className="text-2xl font-bold">¡Felicidades!</h1>
          <p className="text-lg">Ya te postulaste{puesto ? ` a ${puesto}` : ''}.</p>
        </Card>
        <Button onClick={() => navigate('/app/empleo')}>Ok</Button>
      </div>
    </div>
  )
}
```

`src/app/empleo/Capacitaciones.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { CAPACITACIONES } from '../../data/empleo'

export function Capacitaciones() {
  const navigate = useNavigate()
  return (
    <div>
      <ScreenHeader title="Capacitaciones" onBack={() => navigate('/app/empleo')} />
      <div className="p-4 flex flex-col gap-3">
        {CAPACITACIONES.map((c) => (
          <Card key={c.id} className="flex flex-col gap-1">
            <p className="font-semibold">{c.titulo}</p>
            <p className="text-ink/70 text-sm">{c.detalle}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/app/empleo && npm run build`
Expected: all Empleo tests PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/empleo/Oportunidades.tsx src/app/empleo/Postular.tsx src/app/empleo/PostulacionConfirmada.tsx src/app/empleo/Capacitaciones.tsx src/app/empleo/Oportunidades.test.tsx src/app/empleo/Capacitaciones.test.tsx
git commit -m "feat(empleo): opportunities, application flow, and capacitaciones"
```

---

## Definition of Done (Phase 4)
- `npm test` and `npm run build` pass.
- Home → Empleo → each of the three options works; CV builder → preview; oportunidades → postular → confirmación; capacitaciones list. Unknown job id → graceful not-found.
- Every task committed.

## Next phase
Phase 5 (Foro / Cartas): public letters + comments, private compose/reply, Amigos — reached from the Home "Foro" card and the "Comunidad" bottom-nav tab.
