# +Simple TIF — Phase 8 (Legal / Ayuda / Descuentos) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Complete the app with the informational + discounts screens: Legal/mission docs (Políticas de privacidad, Términos y condiciones, Objetivo de +Simple), the Ayuda FAQ accordion, and the Descuentos y sorteos flow (list → detail → confirmation).

**Architecture:** Typed fixtures drive the legal docs, FAQ, and discounts. `LegalDoc` reads a `:doc` route param; `Ayuda` renders an inline accordion; Descuentos is a nested list → detail → confirmation flow. All render inside `AppShell`. The Configuración "Mi cuenta" links (`/app/legal/*`, `/app/ayuda`) and the Home "Descuentos" card already point here (currently placeholders) — this phase replaces those placeholders with real screens.

**Tech Stack:** Existing foundation — React Router, `ScreenHeader`, `Card`, `Button`.

## Global Constraints
- Offline-first (no network, emoji tiles). Spanish copy from the Figma where captured (Objetivo/Privacidad/Términos/FAQ questions); plausible Spanish placeholder where not (discounts, some FAQ answers).
- Mobile-framed inside `AppShell`. Consumes existing UI. No shared-provider changes.
- Routes in `src/routes.tsx`: replace the existing `legal/:doc` and `ayuda` placeholder routes (added in Phase 2) and the `descuentos` placeholder route; other routes unchanged.
- Conventional commits; do NOT run `npx tsc -b`.

---

## File Structure
```
src/data/legal.ts               # LEGAL doc map + getDoc
src/data/faq.ts                 # FAQ array
src/data/descuentos.ts          # Descuento type + DESCUENTOS + getDescuento
src/data/descuentos.test.ts
src/app/info/LegalDoc.tsx       # screens 11/12/13
src/app/info/Ayuda.tsx          # screen 14 (FAQ accordion)
src/app/descuentos/DescuentosList.tsx      # screen 28
src/app/descuentos/DescuentoDetalle.tsx    # screen 29
src/app/descuentos/DescuentoConfirmado.tsx # screen 30
src/routes.tsx                  # MODIFY: legal/:doc, ayuda, descuentos routes
```

---

### Task 1: Legal / mission docs (screens 11, 12, 13)

**Files:**
- Create: `src/data/legal.ts`, `src/app/info/LegalDoc.tsx`
- Modify: `src/routes.tsx` (legal/:doc route)
- Test: `src/app/info/LegalDoc.test.tsx`

**Interfaces:**
- Produces:
  - `interface LegalDocData { titulo: string; parrafos: string[] }`
  - `LEGAL: Record<'privacidad' | 'terminos' | 'objetivo', LegalDocData>`, `getDoc(key: string): LegalDocData | undefined`
  - `LegalDoc()` — reads `:doc`; unknown → "Documento no encontrado". Else `ScreenHeader title={doc.titulo}` (back → `/app/config`) and the paragraphs.
- Consumes: `useParams`, `ScreenHeader`.

- [ ] **Step 1: Write the failing test**

`src/app/info/LegalDoc.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { LegalDoc } from './LegalDoc'
import { TtsProvider } from '../../state/TtsProvider'

function setup(path: string) {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/app/legal/:doc" element={<LegalDoc />} />
        <Route path="/app/config" element={<div>Config</div>} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('renders the Objetivo doc', () => {
  setup('/app/legal/objetivo')
  expect(screen.getByRole('heading', { name: /Objetivo de \+Simple/i })).toBeInTheDocument()
  expect(screen.getByText(/Creamos \+Simple/)).toBeInTheDocument()
})

test('unknown doc shows not found', () => {
  setup('/app/legal/zzz')
  expect(screen.getByText(/no encontrado/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/app/info/LegalDoc.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/data/legal.ts`:
```ts
export interface LegalDocData { titulo: string; parrafos: string[] }

export const LEGAL: Record<'privacidad' | 'terminos' | 'objetivo', LegalDocData> = {
  privacidad: {
    titulo: 'Políticas de privacidad',
    parrafos: [
      'En +Simple queremos que disfrutes la app de manera segura, simple y acompañada. Al usar la plataforma aceptás nuestras condiciones de uso y privacidad.',
      'La información de tu perfil, mensajes y actividades se utiliza únicamente para mejorar tu experiencia dentro de la app y ayudarte a conectar con otras personas, descubrir actividades, oportunidades y beneficios cercanos.',
      'Tus conversaciones privadas no se comparten con otros usuarios ni con terceros. +Simple tampoco vende información personal.',
      'Podrás modificar o eliminar tu información personal cuando lo desees desde la configuración de tu cuenta. En +Simple queremos que disfrutes la app de manera segura, simple y acompañada.',
    ],
  },
  terminos: {
    titulo: 'Términos y condiciones',
    parrafos: [
      'Bienvenido/a a +Simple. Al utilizar la aplicación aceptás las condiciones de uso de la plataforma y el compromiso de mantener un espacio seguro, respetuoso y pensado para la comunidad.',
      '+Simple ofrece herramientas para conectar personas, participar en actividades, acceder a beneficios, explorar propuestas barriales y utilizar funciones de asistencia digital.',
      'Cada usuario es responsable de la información que comparte en su perfil, publicaciones, cartas y foros. No está permitido publicar contenido ofensivo, discriminatorio o engañoso.',
      'El uso de la plataforma implica la aceptación de estos términos y de nuestra política de privacidad.',
    ],
  },
  objetivo: {
    titulo: 'Objetivo de +Simple',
    parrafos: [
      'Creamos +Simple para que más personas puedan conectar, participar y sentirse parte de una manera simple, cercana y acompañada.',
      'Queremos que la tecnología se sienta amigable, útil y humana. Un espacio donde compartir intereses, descubrir actividades, encontrar oportunidades y generar nuevas conexiones sin sentirse solos ni perdidos.',
      'Nos encanta ver personas participando y ayudándose entre sí, conversaciones respetuosas y amables, nuevas amistades y encuentros, y ganas de aprender, compartir y descubrir.',
      'En +Simple creemos que las conexiones más importantes siguen siendo las humanas. ✨',
    ],
  },
}

export function getDoc(key: string): LegalDocData | undefined {
  return (LEGAL as Record<string, LegalDocData>)[key]
}
```

`src/app/info/LegalDoc.tsx`:
```tsx
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { getDoc } from '../../data/legal'

export function LegalDoc() {
  const navigate = useNavigate()
  const { doc } = useParams<{ doc: string }>()
  const data = getDoc(doc ?? '')

  if (!data) {
    return (
      <div>
        <ScreenHeader title="Información" onBack={() => navigate('/app/config')} />
        <p className="p-6 text-lg">Documento no encontrado.</p>
      </div>
    )
  }

  return (
    <div>
      <ScreenHeader title={data.titulo} onBack={() => navigate('/app/config')} ttsText={data.parrafos.join(' ')} />
      <div className="p-6 flex flex-col gap-4">
        {data.parrafos.map((p, i) => (
          <p key={i} className="text-ink/80 leading-relaxed">{p}</p>
        ))}
      </div>
    </div>
  )
}
```

`src/routes.tsx`: change `<Route path="legal/:doc" element={<Placeholder title="Información" />} />` to `<Route path="legal/:doc" element={<LegalDoc />} />` (add import). Leave other routes unchanged.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/app/info/LegalDoc.test.tsx && npm run build`
Expected: PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/data/legal.ts src/app/info/LegalDoc.tsx src/app/info/LegalDoc.test.tsx src/routes.tsx
git commit -m "feat(info): legal and mission documents"
```

---

### Task 2: Ayuda FAQ accordion (screen 14)

**Files:**
- Create: `src/data/faq.ts`, `src/app/info/Ayuda.tsx`
- Modify: `src/routes.tsx` (ayuda route)
- Test: `src/app/info/Ayuda.test.tsx`

**Interfaces:**
- Produces:
  - `interface FaqItem { pregunta: string; respuesta: string }`, `FAQ: FaqItem[]`
  - `Ayuda()` — `ScreenHeader title="Preguntas frecuentes"` (back → `/app/config`); each `FAQ` item is an expandable row (a `<button aria-expanded>` showing the question; clicking toggles the answer's visibility); a footer line "¿Necesitás más ayuda? Llamanos al 147 o escribinos a (011) 5050-1470".
- Consumes: `useState`, `ScreenHeader`, `Card`.

- [ ] **Step 1: Write the failing test**

`src/app/info/Ayuda.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Ayuda } from './Ayuda'
import { TtsProvider } from '../../state/TtsProvider'
import { FAQ } from '../../data/faq'

function setup() {
  return render(
    <TtsProvider><MemoryRouter initialEntries={['/app/ayuda']}>
      <Routes><Route path="/app/ayuda" element={<Ayuda />} /></Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('shows questions and expands an answer on click', async () => {
  setup()
  const first = FAQ[0]
  const btn = screen.getByRole('button', { name: new RegExp(first.pregunta.slice(0, 15), 'i') })
  expect(btn).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByText(first.respuesta)).not.toBeInTheDocument()
  await userEvent.click(btn)
  expect(btn).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByText(first.respuesta)).toBeInTheDocument()
})

test('shows the contact footer', () => {
  setup()
  expect(screen.getByText(/147/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/app/info/Ayuda.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/data/faq.ts`:
```ts
export interface FaqItem { pregunta: string; respuesta: string }

export const FAQ: FaqItem[] = [
  { pregunta: '¿Cómo envío una carta?', respuesta: 'Podés escribir un mensaje desde la sección Foro y elegir a quién enviarlo, ya sea al foro público o a un amigo en privado.' },
  { pregunta: '¿Cómo participo en actividades?', respuesta: 'Entrá a la sección Actividades, elegí una categoría y tocá "Reservar" o "¡Quiero ir!" en la actividad que te interese.' },
  { pregunta: '¿Cómo participo de los sorteos?', respuesta: 'En la sección Descuentos y sorteos vas a encontrar los sorteos disponibles. Tocá la oferta y seguí los pasos para participar.' },
  { pregunta: '¿Mi información es privada?', respuesta: 'Sí. Tus conversaciones privadas no se comparten con otros usuarios ni con terceros, y nunca vendemos tu información personal.' },
  { pregunta: '¿Qué hace el asistente de IA?', respuesta: 'ARIEL, tu asistente, te ayuda con turnos médicos, actividades de la semana y las novedades del día, siempre de forma simple y acompañada.' },
  { pregunta: '¿Qué hago si veo contenido inapropiado?', respuesta: 'Podés reportarlo desde la misma publicación. Nuestro equipo revisa los reportes para mantener un espacio respetuoso.' },
]
```

`src/app/info/Ayuda.tsx`:
```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { FAQ } from '../../data/faq'

export function Ayuda() {
  const navigate = useNavigate()
  const [abierta, setAbierta] = useState<number | null>(null)
  return (
    <div>
      <ScreenHeader title="Preguntas frecuentes" onBack={() => navigate('/app/config')} />
      <div className="p-4 flex flex-col gap-3">
        {FAQ.map((f, i) => (
          <Card key={i} className="p-0 overflow-hidden">
            <button aria-expanded={abierta === i}
              className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
              onClick={() => setAbierta((prev) => (prev === i ? null : i))}>
              <span className="font-semibold">{f.pregunta}</span>
              <span aria-hidden="true" className="text-2xl leading-none">{abierta === i ? '−' : '+'}</span>
            </button>
            {abierta === i && <p className="px-4 pb-4 text-ink/80">{f.respuesta}</p>}
          </Card>
        ))}
        <p className="text-ink/70 mt-2">
          ¿Necesitás más ayuda? Llamanos al 147 o escribinos a (011) 5050-1470.
        </p>
      </div>
    </div>
  )
}
```

`src/routes.tsx`: change `<Route path="ayuda" element={<Placeholder title="Ayuda" />} />` to `<Route path="ayuda" element={<Ayuda />} />` (add import). Leave other routes unchanged.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/app/info/Ayuda.test.tsx && npm run build`
Expected: PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/data/faq.ts src/app/info/Ayuda.tsx src/app/info/Ayuda.test.tsx src/routes.tsx
git commit -m "feat(info): ayuda FAQ accordion"
```

---

### Task 3: Descuentos y sorteos (screens 28, 29, 30)

**Files:**
- Create: `src/data/descuentos.ts`, `src/data/descuentos.test.ts`, `src/app/descuentos/DescuentosList.tsx`, `src/app/descuentos/DescuentoDetalle.tsx`, `src/app/descuentos/DescuentoConfirmado.tsx`
- Modify: `src/routes.tsx` (descuentos routes)
- Test: `src/app/descuentos/Descuentos.test.tsx`

**Interfaces:**
- Produces:
  - `interface Descuento { id: string; comercio: string; oferta: string; detalle: string }`, `DESCUENTOS: Descuento[]`, `getDescuento(id): Descuento | undefined`
  - `DescuentosList()` — `ScreenHeader title="Descuentos y sorteos"` (back → `/app/home`); a `Card` per `DESCUENTOS` (comercio + oferta) → `/app/descuentos/{id}`.
  - `DescuentoDetalle()` — reads `:id`; unknown → "Descuento no encontrado". Else header, comercio, oferta, detalle, `Button` "¡Lo quiero!" → `/app/descuentos/confirmado` with `state: { comercio }`.
  - `DescuentoConfirmado()` — reads `location.state.comercio`; "¡Listo!" + "Mostrá este cupón en {comercio || 'el comercio'} para usar tu beneficio."; `Button` "Volver" → `/app/descuentos`.
- Consumes: router hooks, `ScreenHeader`, `Card`, `Button`.

- [ ] **Step 1: Write failing tests**

`src/data/descuentos.test.ts`:
```ts
import { DESCUENTOS, getDescuento } from './descuentos'

test('has discounts with unique ids and a lookup', () => {
  expect(DESCUENTOS.length).toBeGreaterThan(0)
  expect(new Set(DESCUENTOS.map((d) => d.id)).size).toBe(DESCUENTOS.length)
  expect(getDescuento(DESCUENTOS[0].id)?.id).toBe(DESCUENTOS[0].id)
  expect(getDescuento('nope')).toBeUndefined()
})
```

`src/app/descuentos/Descuentos.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { DescuentosList } from './DescuentosList'
import { DescuentoDetalle } from './DescuentoDetalle'
import { DescuentoConfirmado } from './DescuentoConfirmado'
import { TtsProvider } from '../../state/TtsProvider'
import { DESCUENTOS } from '../../data/descuentos'

function wrap(initial: string) {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/app/descuentos" element={<DescuentosList />} />
        <Route path="/app/descuentos/confirmado" element={<DescuentoConfirmado />} />
        <Route path="/app/descuentos/:id" element={<DescuentoDetalle />} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('lists discounts, opens one, and claims it', async () => {
  wrap('/app/descuentos')
  expect(screen.getByText(DESCUENTOS[0].comercio)).toBeInTheDocument()
  await userEvent.click(screen.getByText(DESCUENTOS[0].comercio))
  await userEvent.click(screen.getByRole('button', { name: /¡Lo quiero!/i }))
  expect(screen.getByText(/¡Listo!/i)).toBeInTheDocument()
  expect(screen.getByText(new RegExp(DESCUENTOS[0].comercio))).toBeInTheDocument()
})

test('unknown discount shows not found', () => {
  wrap('/app/descuentos/zzz')
  expect(screen.getByText(/no encontrado/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test src/data/descuentos.test.ts src/app/descuentos/Descuentos.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/data/descuentos.ts`:
```ts
export interface Descuento { id: string; comercio: string; oferta: string; detalle: string }

export const DESCUENTOS: Descuento[] = [
  { id: 'farmacia', comercio: 'Farmacia del Barrio', oferta: '20% en medicamentos', detalle: 'Presentá tu cupón +Simple y obtené un 20% de descuento en medicamentos de venta libre, de lunes a viernes.' },
  { id: 'optica', comercio: 'Óptica Visión', oferta: '2x1 en anteojos de lectura', detalle: 'Llevá dos pares de anteojos de lectura al precio de uno. Válido durante todo el mes.' },
  { id: 'cafe', comercio: 'Café Las Violetas', oferta: '15% en la merienda', detalle: 'Disfrutá la merienda completa con un 15% de descuento presentando tu perfil de +Simple.' },
  { id: 'sorteo', comercio: 'Sorteo mensual', oferta: 'Participá por una tarde de spa', detalle: 'Todos los meses sorteamos una tarde de spa entre los miembros de la comunidad. ¡Participá gratis!' },
]

export function getDescuento(id: string): Descuento | undefined {
  return DESCUENTOS.find((d) => d.id === id)
}
```

`src/app/descuentos/DescuentosList.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { DESCUENTOS } from '../../data/descuentos'

export function DescuentosList() {
  const navigate = useNavigate()
  return (
    <div>
      <ScreenHeader title="Descuentos y sorteos" onBack={() => navigate('/app/home')} />
      <div className="p-4 flex flex-col gap-3">
        {DESCUENTOS.map((d) => (
          <button key={d.id} className="text-left" onClick={() => navigate(`/app/descuentos/${d.id}`)}>
            <Card className="flex flex-col gap-1">
              <span className="text-lg font-semibold">{d.comercio}</span>
              <span className="text-primary">{d.oferta}</span>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
```

`src/app/descuentos/DescuentoDetalle.tsx`:
```tsx
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { getDescuento } from '../../data/descuentos'

export function DescuentoDetalle() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const d = getDescuento(id ?? '')

  if (!d) {
    return (
      <div>
        <ScreenHeader title="Descuentos y sorteos" onBack={() => navigate('/app/descuentos')} />
        <p className="p-6 text-lg">Descuento no encontrado.</p>
      </div>
    )
  }

  return (
    <div>
      <ScreenHeader title="Descuentos y sorteos" onBack={() => navigate('/app/descuentos')} />
      <div className="p-4 flex flex-col gap-4">
        <div className="h-32 rounded-2xl bg-teal/20 grid place-items-center text-5xl" aria-hidden="true">🏷️</div>
        <h1 className="text-2xl font-bold">{d.comercio}</h1>
        <p className="text-primary text-xl font-semibold">{d.oferta}</p>
        <Card><p className="text-ink/80 leading-relaxed">{d.detalle}</p></Card>
        <Button onClick={() => navigate('/app/descuentos/confirmado', { state: { comercio: d.comercio } })}>¡Lo quiero!</Button>
      </div>
    </div>
  )
}
```

`src/app/descuentos/DescuentoConfirmado.tsx`:
```tsx
import { useLocation, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'

export function DescuentoConfirmado() {
  const navigate = useNavigate()
  const location = useLocation()
  const comercio = (location.state as { comercio?: string } | null)?.comercio
  return (
    <div>
      <ScreenHeader title="Descuentos y sorteos" />
      <div className="p-6 flex flex-col items-center gap-6 text-center">
        <div className="text-6xl" aria-hidden="true">🎉</div>
        <Card className="w-full flex flex-col gap-2">
          <h1 className="text-2xl font-bold">¡Listo!</h1>
          <p className="text-lg">Mostrá este cupón en {comercio ?? 'el comercio'} para usar tu beneficio.</p>
        </Card>
        <Button onClick={() => navigate('/app/descuentos')}>Volver</Button>
      </div>
    </div>
  )
}
```

`src/routes.tsx`: replace `<Route path="descuentos" element={<Placeholder title="Descuentos" />} />` with:
```tsx
<Route path="descuentos" element={<DescuentosList />} />
<Route path="descuentos/confirmado" element={<DescuentoConfirmado />} />
<Route path="descuentos/:id" element={<DescuentoDetalle />} />
```
Add imports for the three screens. Leave other routes unchanged.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/data/descuentos.test.ts src/app/descuentos && npm run build`
Expected: PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/data/descuentos.ts src/data/descuentos.test.ts src/app/descuentos src/routes.tsx
git commit -m "feat(descuentos): discounts list, detail, and coupon confirmation"
```

---

## Definition of Done (Phase 8)
- `npm test` and `npm run build` pass.
- Configuración links open the legal/mission docs and the FAQ (accordion expands); Home "Descuentos y sorteos" → list → detail → "¡Lo quiero!" → coupon confirmation. Unknown doc/discount ids show graceful not-found.
- Every task committed.

## App complete
After Phase 8 the app covers all 12 modules of the Figma. A final full-app review + end-to-end smoke can wrap up the project.
