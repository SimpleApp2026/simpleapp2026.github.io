# +Simple TIF — Phase 2 (Home / Perfil / Configuración) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build the three main app screens — Home dashboard, editable Perfil, and Configuración with working accessibility toggles — replacing their placeholder routes.

**Architecture:** All three render inside `AppShell` (bottom nav visible). Home reads `useUser().profile` (tolerating null), renders feature cards that navigate to feature routes, and a daily agenda from a typed mock fixture. Perfil displays/edits profile fields via `updateProfile`. Configuración wires `useAccessibility` toggles and lists account links.

**Tech Stack:** Existing foundation + Phase 1. New: `src/data/agenda.ts` fixture, `src/lib/age.ts` helper.

## Global Constraints

- Offline-first (no network; no remote images — use icon tiles / emoji / SVG). Spanish copy verbatim from Figma where given.
- Mobile-framed inside `AppShell`. Large type/targets.
- **Null-profile tolerance (carryover from Phase 1):** Home and Perfil MUST NOT crash when `profile` is null (anonymous path, or identified-but-backed-out). Home greets "Hola" without a name; Perfil shows a "Completá tu perfil" prompt with a link to `/registro/datos`.
- Consumes exactly: `useUser(): { profile, updateProfile, identified }`, `useAccessibility(): { largeText, highContrast, toggleLargeText, toggleHighContrast }`, `Profile`, `Interest`, UI primitives, `ScreenHeader`, `Card`, `Chip`, `Toggle`, `Button`, `TextField`.
- Routes replaced in `src/routes.tsx`: `/app/home`, `/app/perfil`, `/app/config`. All other routes unchanged.
- Conventional commits; do NOT run `npx tsc -b`.

## Palette / copy references (from Figma)
- Home: "Hola, {nombre}" + "{barrio}, Buenos Aires"; feature cards: **Empleo** ("Mirá las oportunidades laborales"), **Foro** ("Clubes y cartas de tu comunidad"), **Descuentos y sorteos** ("Ofertas exclusivas"), **Actividades** ("Eventos cerca tuyo"). Section "Miércoles 21 de mayo 2026" (static demo date string). Agenda items: "Yoga en plaza Vicente López / 13:00 – 15:00", "Taller de escritura en plaza Rubén Darío / 16:30 – 17:30".
- Perfil: "Perfil"; foto circular; "{nombre} {apellido}"; "Edad {n}"; "{fecha larga}"; "Barrio de {barrio}"; Intereses chips; "Guardar".
- Config: "Accesibilidad" → "Textos grandes", "Contrastes"; "Mi cuenta" → "Políticas de privacidad", "Términos y condiciones", "Objetivo de +Simple", "Preguntas frecuentes".

---

## File Structure

```
src/data/agenda.ts            # typed agenda fixture (AgendaItem[])
src/lib/age.ts                # ageFromIso(iso) + formatLongDate(iso)
src/lib/age.test.ts
src/app/Home.tsx              # screen 09
src/app/Perfil.tsx            # screen 08
src/app/Configuracion.tsx     # screen 10
src/routes.tsx                # MODIFY: home/perfil/config elements
```

Tests beside sources.

---

### Task 1: Age/date helpers + agenda fixture + Home screen (09)

**Files:**
- Create: `src/lib/age.ts`, `src/lib/age.test.ts`, `src/data/agenda.ts`, `src/app/Home.tsx`
- Modify: `src/routes.tsx` (home route)
- Test: `src/app/Home.test.tsx`

**Interfaces:**
- Produces:
  - `ageFromIso(iso: string, today?: Date): number | null` — whole years from a `yyyy-mm-dd`; null if empty/invalid.
  - `formatLongDate(iso: string): string` — e.g. `"17 de octubre de 1956"`; `''` if empty/invalid.
  - `AgendaItem = { id: string; titulo: string; horario: string }`; `AGENDA: AgendaItem[]`.
  - `Home()` — greeting from `profile` (null-safe), 4 feature `Card`s (nav to `/app/empleo`, `/app/foro`, `/app/descuentos`, `/app/actividades`), agenda list from `AGENDA`, settings button (nav `/app/config`).
- Consumes: `useUser`, `useNavigate`, `Card`, `ScreenHeader`, `SettingsIcon`.

- [ ] **Step 1: Write failing tests**

`src/lib/age.test.ts`:
```ts
import { ageFromIso, formatLongDate } from './age'

test('ageFromIso computes whole years', () => {
  // use the local Date(y, mIndex, d) constructor to avoid UTC-parsing TZ drift
  expect(ageFromIso('1956-10-17', new Date(2026, 4, 21))).toBe(69)  // before birthday
  expect(ageFromIso('1956-10-17', new Date(2026, 9, 17))).toBe(70)  // on birthday
  expect(ageFromIso('', new Date(2026, 4, 21))).toBeNull()
  expect(ageFromIso('not-a-date')).toBeNull()
})

test('formatLongDate renders a Spanish long date', () => {
  expect(formatLongDate('1956-10-17')).toMatch(/17 de octubre de 1956/)
  expect(formatLongDate('')).toBe('')
})
```

`src/app/Home.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Home } from './Home'
import { UserProvider } from '../state/UserProvider'
import { TtsProvider } from '../state/TtsProvider'
import { useUser } from '../state/hooks'
import type { Profile } from '../types'

const susana: Profile = { nombre: 'Susana', apellido: 'M', barrio: 'Recoleta', fechaNacimiento: '1956-10-17', fotoDataUrl: null, intereses: [] }
function Seed({ p }: { p: Profile | null }) {
  const { setProfile } = useUser()
  return <button onClick={() => p && setProfile(p)}>seed</button>
}
function setup(seedProfile: Profile | null) {
  return render(
    <UserProvider><TtsProvider>
      <MemoryRouter initialEntries={['/app/home']}>
        <Routes>
          <Route path="/app/home" element={<><Seed p={seedProfile} /><Home /></>} />
          <Route path="/app/actividades" element={<div>Pantalla actividades</div>} />
          <Route path="/app/config" element={<div>Pantalla config</div>} />
        </Routes>
      </MemoryRouter>
    </TtsProvider></UserProvider>,
  )
}
beforeEach(() => localStorage.clear())

test('greets by name when a profile exists and cards navigate', async () => {
  setup(susana)
  await userEvent.click(screen.getByText('seed'))
  expect(screen.getByText(/Hola, Susana/)).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /Actividades/i }))
  expect(screen.getByText('Pantalla actividades')).toBeInTheDocument()
})

test('does not crash and greets generically when profile is null', () => {
  setup(null)
  expect(screen.getByText(/Hola/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test src/lib/age.test.ts src/app/Home.test.tsx`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement helpers, fixture, Home**

`src/lib/age.ts`:
```ts
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

function parse(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return isNaN(dt.getTime()) ? null : dt
}

export function ageFromIso(iso: string, today: Date = new Date()): number | null {
  const b = parse(iso)
  if (!b) return null
  let age = today.getFullYear() - b.getFullYear()
  const before = today.getMonth() < b.getMonth() || (today.getMonth() === b.getMonth() && today.getDate() < b.getDate())
  if (before) age -= 1
  return age
}

export function formatLongDate(iso: string): string {
  const d = parse(iso)
  if (!d) return ''
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
}
```

`src/data/agenda.ts`:
```ts
export interface AgendaItem { id: string; titulo: string; horario: string }

export const AGENDA_FECHA = 'Miércoles 21 de mayo 2026'

export const AGENDA: AgendaItem[] = [
  { id: 'yoga', titulo: 'Yoga en plaza Vicente López', horario: '13:00 – 15:00' },
  { id: 'taller', titulo: 'Taller de escritura en plaza Rubén Darío', horario: '16:30 – 17:30' },
]
```

`src/app/Home.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import { useUser } from '../state/hooks'
import { Card } from '../ui/Card'
import { SettingsIcon } from '../ui/icons'
import { AGENDA, AGENDA_FECHA } from '../data/agenda'

const CARDS = [
  { to: '/app/empleo', emoji: '💼', titulo: 'Empleo', sub: 'Mirá las oportunidades laborales' },
  { to: '/app/foro', emoji: '💬', titulo: 'Foro', sub: 'Clubes y cartas de tu comunidad' },
  { to: '/app/descuentos', emoji: '🏷️', titulo: 'Descuentos y sorteos', sub: 'Ofertas exclusivas' },
  { to: '/app/actividades', emoji: '📅', titulo: 'Actividades', sub: 'Eventos cerca tuyo' },
]

export function Home() {
  const navigate = useNavigate()
  const { profile } = useUser()
  return (
    <div>
      <header className="bg-navy-900 text-white px-5 py-5 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-teal/30 grid place-items-center text-xl">👤</div>
        <div className="flex-1">
          <p className="text-lg font-semibold">Hola{profile?.nombre ? `, ${profile.nombre}` : ''}</p>
          {profile?.barrio && <p className="text-sm text-white/70">{profile.barrio}, Buenos Aires</p>}
        </div>
        <button aria-label="Configuración" onClick={() => navigate('/app/config')}>
          <SettingsIcon className="h-6 w-6" />
        </button>
      </header>

      <div className="p-4 grid grid-cols-2 gap-3">
        {CARDS.map((c) => (
          <button key={c.to} onClick={() => navigate(c.to)} className="text-left">
            <Card className="h-full">
              <div className="text-3xl mb-2" aria-hidden="true">{c.emoji}</div>
              <p className="font-semibold">{c.titulo}</p>
              <p className="text-sm text-ink/60">{c.sub}</p>
            </Card>
          </button>
        ))}
      </div>

      <div className="px-4 pb-6">
        <h2 className="text-lg font-semibold my-3">{AGENDA_FECHA}</h2>
        <div className="flex flex-col gap-3">
          {AGENDA.map((a) => (
            <Card key={a.id}>
              <p className="font-medium">{a.titulo}</p>
              <p className="text-primary text-lg">{a.horario}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
```

`src/routes.tsx`: change the `home` child route element from `<Placeholder title="Inicio" />` to `<Home />` (add `import { Home } from './app/Home'`). Leave all other routes unchanged.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/lib/age.test.ts src/app/Home.test.tsx && npm run build`
Expected: PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/lib/age.ts src/lib/age.test.ts src/data/agenda.ts src/app/Home.tsx src/app/Home.test.tsx src/routes.tsx
git commit -m "feat(home): dashboard with greeting, feature cards, and agenda"
```

---

### Task 2: Perfil screen (08)

**Files:**
- Create: `src/app/Perfil.tsx`
- Modify: `src/routes.tsx` (perfil route)
- Test: `src/app/Perfil.test.tsx`

**Interfaces:**
- Consumes: `useUser().profile`/`updateProfile`, `ageFromIso`/`formatLongDate`, `Card`, `Chip`, `Button`, `ScreenHeader`, `TextField`.
- Produces: `Perfil()` — if `profile` is null, shows "Completá tu perfil" + a Button navigating to `/registro/datos`. Otherwise shows foto (or placeholder), "{nombre} {apellido}", "Edad {ageFromIso}", `formatLongDate(fecha)`, "Barrio de {barrio}", interest `Chip`s. An "Editar" toggle reveals `TextField`s for nombre/apellido/barrio; "Guardar" calls `updateProfile({...})` and exits edit mode.

- [ ] **Step 1: Write the failing test**

`src/app/Perfil.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Perfil } from './Perfil'
import { UserProvider } from '../state/UserProvider'
import { TtsProvider } from '../state/TtsProvider'
import { useUser } from '../state/hooks'
import type { Profile } from '../types'

const susana: Profile = { nombre: 'Susana', apellido: 'Martinez', barrio: 'Recoleta', fechaNacimiento: '1956-10-17', fotoDataUrl: null, intereses: ['Jardinería'] }
function Seed({ p }: { p: Profile | null }) { const { setProfile } = useUser(); return <button onClick={() => p && setProfile(p)}>seed</button> }
function setup(p: Profile | null) {
  return render(
    <UserProvider><TtsProvider><MemoryRouter initialEntries={['/app/perfil']}>
      <Routes>
        <Route path="/app/perfil" element={<><Seed p={p} /><Perfil /></>} />
        <Route path="/registro/datos" element={<div>Registro datos</div>} />
      </Routes>
    </MemoryRouter></TtsProvider></UserProvider>,
  )
}
beforeEach(() => localStorage.clear())

test('renders profile details and interests', async () => {
  setup(susana)
  await userEvent.click(screen.getByText('seed'))
  expect(screen.getByText('Susana Martinez')).toBeInTheDocument()
  expect(screen.getByText(/Edad 7\d/)).toBeInTheDocument()
  expect(screen.getByText('Jardinería')).toBeInTheDocument()
})

test('editing and saving updates the profile', async () => {
  setup(susana)
  await userEvent.click(screen.getByText('seed'))
  await userEvent.click(screen.getByRole('button', { name: /Editar/i }))
  const barrio = screen.getByLabelText('Barrio')
  await userEvent.clear(barrio)
  await userEvent.type(barrio, 'Palermo')
  await userEvent.click(screen.getByRole('button', { name: /Guardar/i }))
  expect(screen.getByText(/Barrio de Palermo/)).toBeInTheDocument()
})

test('null profile shows a completar prompt', () => {
  setup(null)
  expect(screen.getByText(/Completá tu perfil/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/app/Perfil.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement Perfil**

`src/app/Perfil.tsx`:
```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../state/hooks'
import { ScreenHeader } from '../layout/ScreenHeader'
import { Card } from '../ui/Card'
import { Chip } from '../ui/Chip'
import { Button } from '../ui/Button'
import { TextField } from '../ui/TextField'
import { ageFromIso, formatLongDate } from '../lib/age'

export function Perfil() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useUser()
  const [editing, setEditing] = useState(false)
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [barrio, setBarrio] = useState('')

  if (!profile) {
    return (
      <div>
        <ScreenHeader title="Perfil" />
        <div className="p-6 flex flex-col items-center gap-4 text-center">
          <p className="text-lg">Completá tu perfil para personalizar +Simple.</p>
          <Button onClick={() => navigate('/registro/datos')}>Completar registro</Button>
        </div>
      </div>
    )
  }

  const startEdit = () => {
    setNombre(profile.nombre); setApellido(profile.apellido); setBarrio(profile.barrio); setEditing(true)
  }
  const guardar = () => { updateProfile({ nombre, apellido, barrio }); setEditing(false) }
  const edad = ageFromIso(profile.fechaNacimiento)

  return (
    <div>
      <ScreenHeader title="Perfil" />
      <div className="p-6 flex flex-col items-center gap-4">
        {profile.fotoDataUrl
          ? <img src={profile.fotoDataUrl} alt="Foto de perfil" className="h-32 w-32 rounded-full object-cover" />
          : <div className="h-32 w-32 rounded-full bg-chip/20 grid place-items-center text-4xl" aria-hidden="true">👤</div>}

        {editing ? (
          <Card className="w-full">
            <TextField label="Nombre" value={nombre} onChange={setNombre} />
            <TextField label="Apellido" value={apellido} onChange={setApellido} />
            <TextField label="Barrio" value={barrio} onChange={setBarrio} />
            <Button onClick={guardar}>Guardar</Button>
          </Card>
        ) : (
          <Card className="w-full text-center flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{profile.nombre} {profile.apellido}</h1>
            {edad !== null && <p className="text-lg">Edad {edad}</p>}
            {profile.fechaNacimiento && <p className="text-ink/70">{formatLongDate(profile.fechaNacimiento)}</p>}
            {profile.barrio && <p className="text-ink/70">Barrio de {profile.barrio}</p>}
            {profile.intereses.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {profile.intereses.map((i) => <Chip key={i}>{i}</Chip>)}
              </div>
            )}
            <Button className="mt-3" onClick={startEdit}>Editar</Button>
          </Card>
        )}
      </div>
    </div>
  )
}
```

`src/routes.tsx`: change the `perfil` child route element to `<Perfil />` (add import). Leave others unchanged.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/app/Perfil.test.tsx && npm run build`
Expected: PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/Perfil.tsx src/app/Perfil.test.tsx src/routes.tsx
git commit -m "feat(perfil): view and edit profile with age and interests"
```

---

### Task 3: Configuración screen (10) with working accessibility toggles

**Files:**
- Create: `src/app/Configuracion.tsx`
- Modify: `src/routes.tsx` (config route)
- Test: `src/app/Configuracion.test.tsx`

**Interfaces:**
- Consumes: `useAccessibility()`, `Toggle`, `Card`, `ScreenHeader`, `useNavigate`.
- Produces: `Configuracion()` — "Accesibilidad" section with two `Toggle`s ("Textos grandes" → `toggleLargeText`, "Contrastes" → `toggleHighContrast`, reflecting `largeText`/`highContrast`); "Mi cuenta" section with tappable rows: "Políticas de privacidad" → `/app/legal/privacidad`, "Términos y condiciones" → `/app/legal/terminos`, "Objetivo de +Simple" → `/app/legal/objetivo`, "Preguntas frecuentes" → `/app/ayuda`. (Those routes are placeholders until later phases — navigation is enough.)

- [ ] **Step 1: Write the failing test**

`src/app/Configuracion.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Configuracion } from './Configuracion'
import { AccessibilityProvider } from '../state/AccessibilityProvider'
import { TtsProvider } from '../state/TtsProvider'

function setup() {
  return render(
    <AccessibilityProvider><TtsProvider><MemoryRouter initialEntries={['/app/config']}>
      <Routes>
        <Route path="/app/config" element={<Configuracion />} />
        <Route path="/app/ayuda" element={<div>Pantalla ayuda</div>} />
      </Routes>
    </MemoryRouter></TtsProvider></AccessibilityProvider>,
  )
}
beforeEach(() => { localStorage.clear(); document.documentElement.className = '' })

test('large-text toggle flips state and applies the root class', async () => {
  setup()
  const sw = screen.getByRole('switch', { name: /Textos grandes/i })
  expect(sw).toHaveAttribute('aria-checked', 'false')
  await userEvent.click(sw)
  expect(sw).toHaveAttribute('aria-checked', 'true')
  expect(document.documentElement).toHaveClass('a11y-large')
})

test('account rows navigate', async () => {
  setup()
  await userEvent.click(screen.getByText('Preguntas frecuentes'))
  expect(screen.getByText('Pantalla ayuda')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/app/Configuracion.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement Configuración**

`src/app/Configuracion.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import { useAccessibility } from '../state/hooks'
import { ScreenHeader } from '../layout/ScreenHeader'
import { Card } from '../ui/Card'
import { Toggle } from '../ui/Toggle'

const CUENTA = [
  { label: 'Políticas de privacidad', to: '/app/legal/privacidad' },
  { label: 'Términos y condiciones', to: '/app/legal/terminos' },
  { label: 'Objetivo de +Simple', to: '/app/legal/objetivo' },
  { label: 'Preguntas frecuentes', to: '/app/ayuda' },
]

export function Configuracion() {
  const navigate = useNavigate()
  const { largeText, highContrast, toggleLargeText, toggleHighContrast } = useAccessibility()
  return (
    <div>
      <ScreenHeader title="Configuración" />
      <div className="p-4 flex flex-col gap-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">Accesibilidad</h2>
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-lg">Textos grandes</span>
              <Toggle checked={largeText} onChange={toggleLargeText} label="Textos grandes" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg">Contrastes</span>
              <Toggle checked={highContrast} onChange={toggleHighContrast} label="Contrastes" />
            </div>
          </Card>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-3">Mi cuenta</h2>
          <Card className="flex flex-col divide-y divide-chip/20">
            {CUENTA.map((r) => (
              <button key={r.to} onClick={() => navigate(r.to)}
                className="text-left py-3 text-lg">{r.label}</button>
            ))}
          </Card>
        </section>
      </div>
    </div>
  )
}
```

`src/routes.tsx`: change the `config` child route element to `<Configuracion />` (add import). ALSO add two placeholder child routes under `/app` so the "Mi cuenta" links resolve to a "Próximamente" screen instead of a blank Outlet (they get real screens in Phase 8). `Placeholder` is already imported:
```tsx
<Route path="ayuda" element={<Placeholder title="Ayuda" />} />
<Route path="legal/:doc" element={<Placeholder title="Información" />} />
```
Leave all other routes unchanged.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/app/Configuracion.test.tsx && npm run build`
Expected: PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/Configuracion.tsx src/app/Configuracion.test.tsx src/routes.tsx
git commit -m "feat(config): accessibility toggles and account links"
```

---

## Definition of Done (Phase 2)

- `npm test` and `npm run build` pass.
- Home greets by name (or generically when null), cards navigate, agenda shows.
- Perfil shows details + interests, edit→save persists, null profile shows completar prompt.
- Configuración toggles actually enlarge text / raise contrast (browser-verify) and account rows navigate.
- Every task committed.

## Next phase

Phase 3 (Actividades) adds the activities routes reached from the Home "Actividades" card.
