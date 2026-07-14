# +Simple TIF — Phase 1 (Onboarding) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build the onboarding flow — splash → identify choice → registro form → interests → profile-photo flow — that creates the user's profile and lands them on Home.

**Architecture:** Onboarding screens render inside `PhoneFrame` (NO bottom nav — they sit outside `AppShell`). A shared `OnboardingScreen` wrapper provides the frame + optional curved navy footer banner. Steps navigate with React Router and accumulate the profile through the existing `useUser()` API (`setProfile` at the datos step, `updateProfile` after). No new global state.

**Tech Stack:** Existing foundation — React Router, `useUser`, `useTts`, UI primitives (`Button`, `Chip`, `TextField`, `Card`), `ScreenHeader`, tokens.

## Global Constraints

- Offline-first: no network. Profile photo is read locally via `FileReader` → data URL (no upload).
- Spanish UI copy, verbatim from the Figma where given.
- Mobile-framed inside `PhoneFrame` (max 430px). Large touch targets / type.
- Consumes foundation interfaces exactly: `useUser(): { profile, identified, setProfile, updateProfile, setIdentified, reset }`; `Profile` = `{ nombre, apellido, barrio, fechaNacimiento, fotoDataUrl, intereses }`; `Interest` union includes `'Gastronomía' | 'Idiomas' | 'Jardinería' | 'Manualidades'`.
- Routing is HashRouter (already wired in `App.tsx`); routes are added in `src/routes.tsx`.
- Palette tokens: navy-900 `#101F3C`, primary `#24528C`, teal `#4FC9BB`, bg `#F7F8FA`. Buttons use `Button` primitive.
- Commit style: conventional commits, one per task. Do NOT run `npx tsc -b` directly (stray artifacts); use `npm test` / `npm run build`.

---

## File Structure

```
src/onboarding/
  OnboardingScreen.tsx     # PhoneFrame wrapper + optional curved footer banner + optional assistant bubble
  StepProgress.tsx         # segmented 1-3 / 2-3 / 3-3 progress bar
  Splash.tsx               # screen 01
  Identificacion.tsx       # screen 02
  RegistroDatos.tsx        # screen 03
  RegistroIntereses.tsx    # screen 04
  FotoPreguntar.tsx        # screen 05 (¿querés foto?)
  FotoCargar.tsx           # screen 06 (tocá el lápiz → file)
  FotoLista.tsx            # screen 07 (cargada, ¿cambiar?)
src/routes.tsx             # MODIFY: replace `/` placeholder + add onboarding routes
```

Tests live beside sources as `*.test.tsx`.

---

### Task 1: Onboarding wrapper + Splash + Identificación + routes

**Files:**
- Create: `src/onboarding/OnboardingScreen.tsx`, `src/onboarding/Splash.tsx`, `src/onboarding/Identificacion.tsx`
- Modify: `src/routes.tsx`
- Test: `src/onboarding/Splash.test.tsx`, `src/onboarding/Identificacion.test.tsx`

**Interfaces:**
- Produces:
  - `OnboardingScreen({ children, footer?: ReactNode, className? })` — renders `PhoneFrame` with a scrollable content area; when `footer` is given, renders a curved navy banner pinned at the bottom containing it.
  - `Splash()` — screen 01: "+simple" wordmark, welcome text, a simple BA placeholder graphic, and a full-width `Button` "Comenzar" → navigates to `/identificacion`.
  - `Identificacion()` — screen 02: navy screen, two big buttons "Deseo identificarme" (→ `setIdentified(true)`, navigate `/registro/datos`) and "Sin identificarme" (→ `setIdentified(false)`, navigate `/app/home`).
- Consumes: `useUser`, `useNavigate`, `Button`, `PhoneFrame`.

- [ ] **Step 1: Write failing tests**

`src/onboarding/Splash.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Splash } from './Splash'

test('splash shows welcome and Comenzar navigates to identificación', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/identificacion" element={<div>Pantalla identificación</div>} />
      </Routes>
    </MemoryRouter>,
  )
  expect(screen.getByText(/Bienvenido a/i)).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /Comenzar/i }))
  expect(screen.getByText('Pantalla identificación')).toBeInTheDocument()
})
```

`src/onboarding/Identificacion.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Identificacion } from './Identificacion'
import { UserProvider } from '../state/UserProvider'
import { useUser } from '../state/hooks'

function IdentShow() {
  const { identified } = useUser()
  return <div>identified: {String(identified)}</div>
}

function setup(initial: string) {
  return render(
    <UserProvider>
      <MemoryRouter initialEntries={[initial]}>
        <Routes>
          <Route path="/identificacion" element={<Identificacion />} />
          <Route path="/registro/datos" element={<IdentShow />} />
          <Route path="/app/home" element={<IdentShow />} />
        </Routes>
      </MemoryRouter>
    </UserProvider>,
  )
}

beforeEach(() => localStorage.clear())

test('“Deseo identificarme” sets identified and goes to registro', async () => {
  setup('/identificacion')
  await userEvent.click(screen.getByRole('button', { name: /Deseo identificarme/i }))
  expect(screen.getByText('identified: true')).toBeInTheDocument()
})

test('“Sin identificarme” goes to home as anonymous', async () => {
  setup('/identificacion')
  await userEvent.click(screen.getByRole('button', { name: /Sin identificarme/i }))
  expect(screen.getByText('identified: false')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test src/onboarding`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement wrapper + screens**

`src/onboarding/OnboardingScreen.tsx`:
```tsx
import type { ReactNode } from 'react'
import { PhoneFrame } from '../layout/PhoneFrame'

export function OnboardingScreen(
  { children, footer, className = '' }:
  { children: ReactNode; footer?: ReactNode; className?: string },
) {
  return (
    <PhoneFrame>
      <div className={`flex-1 overflow-y-auto ${className}`}>{children}</div>
      {footer && (
        <div className="bg-navy-900 text-white text-center px-6 pt-8 pb-6 rounded-t-[3rem] text-lg font-medium">
          {footer}
        </div>
      )}
    </PhoneFrame>
  )
}
```

`src/onboarding/Splash.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import { OnboardingScreen } from './OnboardingScreen'
import { Button } from '../ui/Button'

export function Splash() {
  const navigate = useNavigate()
  return (
    <OnboardingScreen>
      <div className="flex flex-col items-center text-center px-6 py-10 gap-6 min-h-full">
        <p className="text-lg text-ink/70">Bienvenido a</p>
        <h1 className="text-5xl font-bold text-navy-900">+simple</h1>
        <div aria-hidden="true"
          className="my-6 h-48 w-48 rounded-full bg-teal/20 grid place-items-center text-teal">
          <svg viewBox="0 0 24 24" className="h-24 w-24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
          </svg>
        </div>
        <p className="text-base text-ink/60">Ciudad de Buenos Aires</p>
        <div className="mt-auto w-full">
          <Button onClick={() => navigate('/identificacion')}>Comenzar</Button>
        </div>
      </div>
    </OnboardingScreen>
  )
}
```

`src/onboarding/Identificacion.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../layout/PhoneFrame'
import { Button } from '../ui/Button'
import { useUser } from '../state/hooks'

export function Identificacion() {
  const navigate = useNavigate()
  const { setIdentified } = useUser()
  const identificarme = () => { setIdentified(true); navigate('/registro/datos') }
  const anonimo = () => { setIdentified(false); navigate('/app/home') }
  return (
    <PhoneFrame>
      <div className="flex-1 bg-navy-900 text-white flex flex-col justify-center items-center gap-6 px-8 text-center">
        <div aria-hidden="true" className="h-28 w-28 rounded-full bg-white/10 grid place-items-center mb-4">
          <svg viewBox="0 0 24 24" className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
        </div>
        <Button variant="secondary" className="bg-white/10 hover:bg-white/20"
          onClick={identificarme}>Deseo identificarme</Button>
        <Button variant="secondary" className="bg-white/10 hover:bg-white/20"
          onClick={anonimo}>Sin identificarme</Button>
      </div>
    </PhoneFrame>
  )
}
```

`src/routes.tsx` — replace the `/` route and add onboarding routes. The file currently is:
```tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { Placeholder } from './screens/Placeholder'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder title="Inicio" />} />
      <Route path="/app" element={<AppShell />}>
        ...
```
Change the imports and the `/` line, and add the onboarding routes above `/app`:
```tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { Placeholder } from './screens/Placeholder'
import { Splash } from './onboarding/Splash'
import { Identificacion } from './onboarding/Identificacion'
import { RegistroDatos } from './onboarding/RegistroDatos'
import { RegistroIntereses } from './onboarding/RegistroIntereses'
import { FotoPreguntar } from './onboarding/FotoPreguntar'
import { FotoCargar } from './onboarding/FotoCargar'
import { FotoLista } from './onboarding/FotoLista'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/identificacion" element={<Identificacion />} />
      <Route path="/registro/datos" element={<RegistroDatos />} />
      <Route path="/registro/intereses" element={<RegistroIntereses />} />
      <Route path="/registro/foto" element={<FotoPreguntar />} />
      <Route path="/registro/foto/cargar" element={<FotoCargar />} />
      <Route path="/registro/foto/lista" element={<FotoLista />} />
      <Route path="/app" element={<AppShell />}>
        {/* ...existing /app child routes unchanged... */}
      </Route>
    </Routes>
  )
}
```
IMPORTANT: keep every existing `/app` child route exactly as-is. Because `RegistroDatos`, `RegistroIntereses`, `FotoPreguntar`, `FotoCargar`, `FotoLista` are created in Tasks 2–4, you must create minimal stub components for them NOW so the app compiles after Task 1 (a stub that renders `<PhoneFrame><div>…</div></PhoneFrame>`), then flesh them out in later tasks. Create the stub files in this task.

Stub example (`src/onboarding/RegistroDatos.tsx` and the other four, each with its own component name):
```tsx
import { PhoneFrame } from '../layout/PhoneFrame'
export function RegistroDatos() {
  return <PhoneFrame><div className="p-6 text-lg">Registro (en construcción)</div></PhoneFrame>
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/onboarding && npm run build`
Expected: onboarding tests PASS; existing `routes.test.tsx` still passes (it renders `/app/home`, unchanged); build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/onboarding src/routes.tsx
git commit -m "feat(onboarding): splash, identificación, and onboarding routes with stubs"
```

---

### Task 2: Registro datos form (screen 03)

**Files:**
- Modify: `src/onboarding/RegistroDatos.tsx` (replace stub)
- Test: `src/onboarding/RegistroDatos.test.tsx`

**Interfaces:**
- Consumes: `useUser().setProfile`, `TextField`, `Button`, `ScreenHeader`, `useNavigate`, `Interest`/`Profile`.
- Produces: `RegistroDatos()` — form with fields Nombre, Apellido, Barrio (placeholder "ej: San Cristóbal"), Fecha de Cumpleaños (`type="date"`), and a "Acepto los términos y condiciones" checkbox. "Continuar" is disabled until nombre, apellido and the checkbox are set; on submit it calls `setProfile({ nombre, apellido, barrio, fechaNacimiento, fotoDataUrl: null, intereses: [] })` and navigates to `/registro/intereses`.

- [ ] **Step 1: Write the failing test**

`src/onboarding/RegistroDatos.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { RegistroDatos } from './RegistroDatos'
import { UserProvider, } from '../state/UserProvider'
import { TtsProvider } from '../state/TtsProvider'
import { useUser } from '../state/hooks'

function ProfileShow() {
  const { profile } = useUser()
  return <div>perfil: {profile ? `${profile.nombre} ${profile.apellido}` : 'ninguno'}</div>
}

function setup() {
  return render(
    <UserProvider><TtsProvider>
      <MemoryRouter initialEntries={['/registro/datos']}>
        <Routes>
          <Route path="/registro/datos" element={<RegistroDatos />} />
          <Route path="/registro/intereses" element={<ProfileShow />} />
        </Routes>
      </MemoryRouter>
    </TtsProvider></UserProvider>,
  )
}

beforeEach(() => localStorage.clear())

test('Continuar is disabled until required fields + T&C are filled', async () => {
  setup()
  expect(screen.getByRole('button', { name: /Continuar/i })).toBeDisabled()
  await userEvent.type(screen.getByLabelText('Nombre'), 'Susana')
  await userEvent.type(screen.getByLabelText('Apellido'), 'Martinez')
  await userEvent.click(screen.getByLabelText(/Acepto los términos/i))
  expect(screen.getByRole('button', { name: /Continuar/i })).toBeEnabled()
})

test('submitting saves the profile and navigates', async () => {
  setup()
  await userEvent.type(screen.getByLabelText('Nombre'), 'Susana')
  await userEvent.type(screen.getByLabelText('Apellido'), 'Martinez')
  await userEvent.type(screen.getByLabelText('Barrio'), 'Recoleta')
  await userEvent.click(screen.getByLabelText(/Acepto los términos/i))
  await userEvent.click(screen.getByRole('button', { name: /Continuar/i }))
  expect(screen.getByText('perfil: Susana Martinez')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/onboarding/RegistroDatos.test.tsx`
Expected: FAIL (stub has no form).

- [ ] **Step 3: Implement the form**

`src/onboarding/RegistroDatos.tsx`:
```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingScreen } from './OnboardingScreen'
import { ScreenHeader } from '../layout/ScreenHeader'
import { TextField } from '../ui/TextField'
import { Button } from '../ui/Button'
import { useUser } from '../state/hooks'

export function RegistroDatos() {
  const navigate = useNavigate()
  const { setProfile } = useUser()
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [barrio, setBarrio] = useState('')
  const [fecha, setFecha] = useState('')
  const [acepta, setAcepta] = useState(false)

  const valido = nombre.trim() !== '' && apellido.trim() !== '' && acepta

  const continuar = () => {
    setProfile({ nombre, apellido, barrio, fechaNacimiento: fecha, fotoDataUrl: null, intereses: [] })
    navigate('/registro/intereses')
  }

  return (
    <OnboardingScreen>
      <ScreenHeader title="Completá tus datos" onBack={() => navigate('/identificacion')} />
      <div className="p-6">
        <TextField label="Nombre" value={nombre} onChange={setNombre} placeholder="Nombre" />
        <TextField label="Apellido" value={apellido} onChange={setApellido} placeholder="Apellido" />
        <TextField label="Barrio" value={barrio} onChange={setBarrio} placeholder="ej: San Cristóbal" />
        <TextField label="Fecha de Cumpleaños" type="date" value={fecha} onChange={setFecha} placeholder="ej: 20/07/1956" />
        <label className="flex items-center gap-3 my-4 text-base">
          <input type="checkbox" className="h-5 w-5" checked={acepta}
            onChange={(e) => setAcepta(e.target.checked)} />
          Acepto los términos y condiciones
        </label>
        <Button disabled={!valido} onClick={continuar}>Continuar</Button>
      </div>
    </OnboardingScreen>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/onboarding/RegistroDatos.test.tsx`
Expected: PASS (both tests).

- [ ] **Step 5: Commit**

```bash
git add src/onboarding/RegistroDatos.tsx src/onboarding/RegistroDatos.test.tsx
git commit -m "feat(onboarding): registro datos form persists profile"
```

---

### Task 3: Intereses chips (screen 04)

**Files:**
- Modify: `src/onboarding/RegistroIntereses.tsx` (replace stub)
- Test: `src/onboarding/RegistroIntereses.test.tsx`

**Interfaces:**
- Consumes: `useUser().updateProfile`, `Chip`, `Button`, `ScreenHeader`, `Interest`.
- Produces: `RegistroIntereses()` — heading "¿Qué temas te interesan?", assistant line "¡Queremos conocerte más!", and toggle `Chip`s for `Gastronomía`, `Idiomas`, `Jardinería`, `Manualidades` (each with a leading emoji). "Continuar" calls `updateProfile({ intereses })` with the selected list and navigates to `/registro/foto`.

- [ ] **Step 1: Write the failing test**

`src/onboarding/RegistroIntereses.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { RegistroIntereses } from './RegistroIntereses'
import { UserProvider } from '../state/UserProvider'
import { TtsProvider } from '../state/TtsProvider'
import { useUser } from '../state/hooks'
import type { Profile } from '../types'

const base: Profile = { nombre: 'Susana', apellido: 'M', barrio: '', fechaNacimiento: '', fotoDataUrl: null, intereses: [] }

function IntShow() {
  const { profile } = useUser()
  return <div>intereses: {(profile?.intereses ?? []).join(',')}</div>
}

function Seed() {
  const { setProfile } = useUser()
  return <button onClick={() => setProfile(base)}>seed</button>
}

function setup() {
  return render(
    <UserProvider><TtsProvider>
      <MemoryRouter initialEntries={['/seed']}>
        <Routes>
          <Route path="/seed" element={<><Seed /><RegistroIntereses /></>} />
          <Route path="/registro/foto" element={<IntShow />} />
        </Routes>
      </MemoryRouter>
    </TtsProvider></UserProvider>,
  )
}

beforeEach(() => localStorage.clear())

test('selecting interests updates the profile and navigates', async () => {
  setup()
  await userEvent.click(screen.getByText('seed'))
  await userEvent.click(screen.getByRole('button', { name: /Gastronomía/i }))
  await userEvent.click(screen.getByRole('button', { name: /Jardinería/i }))
  await userEvent.click(screen.getByRole('button', { name: /Continuar/i }))
  expect(screen.getByText('intereses: Gastronomía,Jardinería')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/onboarding/RegistroIntereses.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/onboarding/RegistroIntereses.tsx`:
```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingScreen } from './OnboardingScreen'
import { ScreenHeader } from '../layout/ScreenHeader'
import { Chip } from '../ui/Chip'
import { Button } from '../ui/Button'
import { useUser } from '../state/hooks'
import type { Interest } from '../types'

const OPCIONES: { key: Interest; emoji: string }[] = [
  { key: 'Gastronomía', emoji: '🍽️' },
  { key: 'Idiomas', emoji: '📚' },
  { key: 'Jardinería', emoji: '🌱' },
  { key: 'Manualidades', emoji: '🎨' },
]

export function RegistroIntereses() {
  const navigate = useNavigate()
  const { updateProfile } = useUser()
  const [sel, setSel] = useState<Interest[]>([])

  const toggle = (k: Interest) =>
    setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))

  const continuar = () => { updateProfile({ intereses: sel }); navigate('/registro/foto') }

  return (
    <OnboardingScreen>
      <ScreenHeader title="Intereses" onBack={() => navigate('/registro/datos')} />
      <div className="p-6 flex flex-col gap-4">
        <p className="text-base text-ink/70">¡Queremos conocerte más!</p>
        <h2 className="text-2xl font-semibold">¿Qué temas te interesan?</h2>
        <div className="flex flex-col gap-3 my-4">
          {OPCIONES.map(({ key, emoji }) => (
            <Chip key={key} selected={sel.includes(key)} onClick={() => toggle(key)}>
              {emoji} {key}
            </Chip>
          ))}
        </div>
        <Button onClick={continuar}>Continuar</Button>
      </div>
    </OnboardingScreen>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/onboarding/RegistroIntereses.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/onboarding/RegistroIntereses.tsx src/onboarding/RegistroIntereses.test.tsx
git commit -m "feat(onboarding): interests picker updates profile"
```

---

### Task 4: Profile-photo flow (screens 05, 06, 07) + StepProgress

**Files:**
- Create: `src/onboarding/StepProgress.tsx`
- Modify: `src/onboarding/FotoPreguntar.tsx`, `src/onboarding/FotoCargar.tsx`, `src/onboarding/FotoLista.tsx` (replace stubs)
- Test: `src/onboarding/StepProgress.test.tsx`, `src/onboarding/FotoFlow.test.tsx`

**Interfaces:**
- Consumes: `useUser().updateProfile` + `profile`, `Button`, `ScreenHeader`, `OnboardingScreen` footer, `FileReader`.
- Produces:
  - `StepProgress({ step, total })` — renders `total` segments, the first `step` filled with `bg-teal`, rest `bg-chip/30`; has `data-testid="step-progress"` and `aria-label={\`Paso ${step} de ${total}\`}`.
  - `FotoPreguntar()` — step 1/total 3; "¿Te gustaría poner una foto de perfil?"; footer "Con cargar tu foto desbloqueás un logro"; "Sí" → `/registro/foto/cargar`, "No" → `/app/home`.
  - `FotoCargar()` — step 2/3; "Tocá el lápiz para sumar tu foto"; a labelled file input (accept `image/*`) that reads the file via `FileReader` to a data URL, calls `updateProfile({ fotoDataUrl })`, and navigates to `/registro/foto/lista`; footer "Estás muy cerca... ¡Vamos!".
  - `FotoLista()` — step 3/3; "Tu foto quedó cargada"; shows `profile.fotoDataUrl` if present; "¿Deseás cambiarla?" Sí → `/registro/foto/cargar`, No → `/app/home`; footer "¡Lo lograste! Felicitaciones".

- [ ] **Step 1: Write failing tests**

`src/onboarding/StepProgress.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { StepProgress } from './StepProgress'

test('renders the right number of segments and fills up to step', () => {
  render(<StepProgress step={2} total={3} />)
  const bar = screen.getByTestId('step-progress')
  expect(bar).toHaveAttribute('aria-label', 'Paso 2 de 3')
  expect(bar.children).toHaveLength(3)
})
```

`src/onboarding/FotoFlow.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { FotoPreguntar } from './FotoPreguntar'
import { FotoCargar } from './FotoCargar'
import { UserProvider } from '../state/UserProvider'
import { TtsProvider } from '../state/TtsProvider'
import { useUser } from '../state/hooks'
import type { Profile } from '../types'

const base: Profile = { nombre: 'S', apellido: 'M', barrio: '', fechaNacimiento: '', fotoDataUrl: null, intereses: [] }
function Seed() { const { setProfile } = useUser(); return <button onClick={() => setProfile(base)}>seed</button> }
function FotoShow() { const { profile } = useUser(); return <div>foto: {profile?.fotoDataUrl ?? 'ninguna'}</div> }

beforeEach(() => localStorage.clear())

test('“No” on the ask step goes to home', async () => {
  render(
    <UserProvider><TtsProvider><MemoryRouter initialEntries={['/registro/foto']}>
      <Routes>
        <Route path="/registro/foto" element={<FotoPreguntar />} />
        <Route path="/app/home" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter></TtsProvider></UserProvider>,
  )
  await userEvent.click(screen.getByRole('button', { name: /^No$/ }))
  expect(screen.getByText('Home')).toBeInTheDocument()
})

test('uploading a file stores a data URL on the profile', async () => {
  render(
    <UserProvider><TtsProvider><MemoryRouter initialEntries={['/seed']}>
      <Routes>
        <Route path="/seed" element={<><Seed /><FotoCargar /></>} />
        <Route path="/registro/foto/lista" element={<FotoShow />} />
      </Routes>
    </MemoryRouter></TtsProvider></UserProvider>,
  )
  await userEvent.click(screen.getByText('seed'))
  const file = new File(['hello'], 'foto.png', { type: 'image/png' })
  await userEvent.upload(screen.getByLabelText(/sumar tu foto/i), file)
  expect(await screen.findByText(/^foto: data:/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test src/onboarding/StepProgress.test.tsx src/onboarding/FotoFlow.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement StepProgress and the three screens**

`src/onboarding/StepProgress.tsx`:
```tsx
export function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div data-testid="step-progress" aria-label={`Paso ${step} de ${total}`}
      className="flex gap-2 px-6 pt-4">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`h-2 flex-1 rounded-full ${i < step ? 'bg-teal' : 'bg-chip/30'}`} />
      ))}
    </div>
  )
}
```

`src/onboarding/FotoPreguntar.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import { OnboardingScreen } from './OnboardingScreen'
import { StepProgress } from './StepProgress'
import { Button } from '../ui/Button'

export function FotoPreguntar() {
  const navigate = useNavigate()
  return (
    <OnboardingScreen footer="Con cargar tu foto desbloqueás un logro">
      <StepProgress step={1} total={3} />
      <div className="p-6 flex flex-col gap-6 text-center">
        <h2 className="text-2xl font-semibold mt-6">¿Te gustaría poner una foto de perfil?</h2>
        <Button onClick={() => navigate('/registro/foto/cargar')}>Sí</Button>
        <Button variant="secondary" onClick={() => navigate('/app/home')}>No</Button>
      </div>
    </OnboardingScreen>
  )
}
```

`src/onboarding/FotoCargar.tsx`:
```tsx
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingScreen } from './OnboardingScreen'
import { StepProgress } from './StepProgress'
import { useUser } from '../state/hooks'

export function FotoCargar() {
  const navigate = useNavigate()
  const { updateProfile } = useUser()
  const inputRef = useRef<HTMLInputElement>(null)

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      updateProfile({ fotoDataUrl: String(reader.result) })
      navigate('/registro/foto/lista')
    }
    reader.readAsDataURL(file)
  }

  return (
    <OnboardingScreen footer="Estás muy cerca... ¡Vamos!">
      <StepProgress step={2} total={3} />
      <div className="p-6 flex flex-col items-center gap-6 text-center">
        <h2 className="text-2xl font-semibold mt-6">Creemos tu foto</h2>
        <label className="cursor-pointer flex flex-col items-center gap-3">
          <span className="text-lg text-ink/70">Tocá el lápiz para sumar tu foto</span>
          <span aria-hidden="true" className="h-40 w-40 rounded-full bg-chip/20 grid place-items-center text-primary">
            <svg viewBox="0 0 24 24" className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
          </span>
          <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={onFile} />
        </label>
      </div>
    </OnboardingScreen>
  )
}
```

`src/onboarding/FotoLista.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import { OnboardingScreen } from './OnboardingScreen'
import { StepProgress } from './StepProgress'
import { Button } from '../ui/Button'
import { useUser } from '../state/hooks'

export function FotoLista() {
  const navigate = useNavigate()
  const { profile } = useUser()
  return (
    <OnboardingScreen footer="¡Lo lograste! Felicitaciones">
      <StepProgress step={3} total={3} />
      <div className="p-6 flex flex-col items-center gap-6 text-center">
        <h2 className="text-2xl font-semibold mt-6">Tu foto quedó cargada</h2>
        {profile?.fotoDataUrl && (
          <img src={profile.fotoDataUrl} alt="Tu foto de perfil"
            className="h-40 w-40 rounded-full object-cover" />
        )}
        <p className="text-lg">¿Deseás cambiarla?</p>
        <div className="flex gap-4 w-full">
          <Button variant="secondary" onClick={() => navigate('/registro/foto/cargar')}>Sí</Button>
          <Button onClick={() => navigate('/app/home')}>No</Button>
        </div>
      </div>
    </OnboardingScreen>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/onboarding && npm run build`
Expected: all onboarding tests PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/onboarding/StepProgress.tsx src/onboarding/StepProgress.test.tsx \
  src/onboarding/FotoPreguntar.tsx src/onboarding/FotoCargar.tsx src/onboarding/FotoLista.tsx \
  src/onboarding/FotoFlow.test.tsx
git commit -m "feat(onboarding): profile-photo flow with step progress"
```

---

## Definition of Done (Phase 1)

- `npm test` and `npm run build` pass.
- Full flow works in the browser: splash → identificación → datos → intereses → foto (Sí→cargar→lista or No) → lands on `/app/home`; profile persists (visible after reload).
- Anonymous path ("Sin identificarme") jumps straight to Home.
- Every task committed.

## Next phase

Phase 2 (Home / Perfil / Configuración) consumes the `profile` written here to render the greeting and profile, and wires the accessibility toggles in Configuración.
