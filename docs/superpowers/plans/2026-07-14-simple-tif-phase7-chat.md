# +Simple TIF — Phase 7 (Chat IA / ARIEL) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build the ARIEL assistant chat — a scripted, offline, keyword-matched conversation with message bubbles, quick-reply chips, and a text input — on the center "Asistente" bottom-nav tab.

**Architecture:** A pure function `arielRespond(text)` maps user input to a canned Spanish reply by keyword (no LLM, no network). The `ChatARIEL` screen holds the message list in local state, seeded with a personalized greeting; sending appends the user message then ARIEL's reply. Quick-reply chips send common prompts.

**Tech Stack:** Existing foundation — React, React Router, `useUser` (greeting name), `Chip`, `Button`, `SendIcon`/`MicIcon`/`SpeakerIcon`, `useTts`.

## Global Constraints
- Offline-first: fully scripted, NO network/LLM. Spanish copy (from the Figma conversation; plausible where extended).
- Mobile-framed inside `AppShell` (bottom nav visible; ARIEL is the center tab). Consumes existing UI. No shared-provider changes.
- Route `/app/asistente` in `src/routes.tsx` replaced; other routes unchanged.
- Conventional commits; do NOT run `npx tsc -b`.

---

## File Structure
```
src/data/ariel.ts             # arielRespond, GREETING builder, QUICK_REPLIES
src/data/ariel.test.ts
src/app/asistente/ChatARIEL.tsx
src/app/asistente/ChatARIEL.test.tsx
src/routes.tsx                # MODIFY: /app/asistente → <ChatARIEL />
```

---

### Task 1: ARIEL script engine + route

**Files:**
- Create: `src/data/ariel.ts`, `src/data/ariel.test.ts`, and a minimal STUB `src/app/asistente/ChatARIEL.tsx`
- Modify: `src/routes.tsx`
- Test: (data test only)

**Interfaces:**
- Produces:
  - `type ChatFrom = 'ariel' | 'user'`
  - `interface ChatMsg { id: string; from: ChatFrom; texto: string }`
  - `greeting(nombre?: string): string` — `"¡Hola ${nombre}! Me alegra tenerte acá, contame ¿qué necesitás?"` (drops the name gracefully when empty: `"¡Hola! Me alegra tenerte acá, contame ¿qué necesitás?"`).
  - `QUICK_REPLIES: string[]` — e.g. `['Turnos médicos', 'Actividades de la semana', 'Noticias de hoy']`.
  - `arielRespond(text: string): string` — keyword-matched canned reply; sensible default when nothing matches.
- Consumes: nothing.

- [ ] **Step 1: Write the failing test**

`src/data/ariel.test.ts`:
```ts
import { arielRespond, greeting, QUICK_REPLIES } from './ariel'

test('greeting includes the name when given, omits gracefully when not', () => {
  expect(greeting('Susana')).toMatch(/Hola Susana/)
  expect(greeting()).toMatch(/Hola/)
  expect(greeting()).not.toMatch(/undefined/)
})

test('arielRespond matches health, activities, and news keywords', () => {
  expect(arielRespond('Tengo que hacerme una endoscopía, ¿qué centros hay cerca?')).toMatch(/Centros TCBA|centro/i)
  expect(arielRespond('¿Qué actividades hay esta semana?')).toMatch(/actividad|Yoga|Taller/i)
  expect(arielRespond('Quiero las noticias de hoy')).toMatch(/noticias/i)
})

test('arielRespond has a helpful default', () => {
  const r = arielRespond('asdfghjkl')
  expect(r.length).toBeGreaterThan(0)
  expect(r).toMatch(/ayudar|turnos|actividades|noticias/i)
})

test('quick replies are non-empty', () => {
  expect(QUICK_REPLIES.length).toBeGreaterThan(0)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/data/ariel.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/data/ariel.ts`:
```ts
export type ChatFrom = 'ariel' | 'user'
export interface ChatMsg { id: string; from: ChatFrom; texto: string }

export function greeting(nombre?: string): string {
  const n = nombre?.trim()
  return n
    ? `¡Hola ${n}! Me alegra tenerte acá, contame ¿qué necesitás?`
    : '¡Hola! Me alegra tenerte acá, contame ¿qué necesitás?'
}

export const QUICK_REPLIES = ['Turnos médicos', 'Actividades de la semana', 'Noticias de hoy']

export function arielRespond(text: string): string {
  const t = text.toLowerCase()
  if (/endoscop|centro|m[eé]dic|turno|salud|estudio/.test(t))
    return 'El centro más cercano a tu zona es Centros TCBA Recoleta. ¿Querés que te contacte con ellos?'
  if (/^s[ií]\b|s[ií],? por favor|dale|contact/.test(t))
    return 'Llamando a Centros TCBA... No salgas del chat, te comunico enseguida.'
  if (/actividad|evento|hacer esta semana|salida/.test(t))
    return 'Esta semana podés participar de: Yoga en plaza Vicente López, Taller de escritura en plaza Rubén Darío y una visita guiada por el barrio de La Boca.'
  if (/noticia|diario|novedad/.test(t))
    return 'Estas son las noticias más importantes de hoy: 1) Mirtha Legrand celebró el 25 de Mayo con un festejo especial. 2) Se debate una nueva ley para facilitar la compra de medicamentos.'
  if (/gracias/.test(t))
    return '¡De nada! Estoy para ayudarte cuando lo necesites.'
  if (/hola|buenas|buen d[ií]a/.test(t))
    return '¡Hola! ¿En qué te puedo ayudar hoy?'
  return 'Puedo ayudarte con turnos médicos, actividades de la semana y las noticias del día. ¿Sobre qué te gustaría saber?'
}
```

`src/routes.tsx`: change `<Route path="asistente" element={<Placeholder title="Asistente" />} />` to `<Route path="asistente" element={<ChatARIEL />} />` (add `import { ChatARIEL } from './app/asistente/ChatARIEL'`). Create the STUB `src/app/asistente/ChatARIEL.tsx` (`export function ChatARIEL(){ return <div className="p-6 text-lg">Asistente (en construcción)</div> }`). Leave other routes unchanged.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/data/ariel.test.ts && npm run build`
Expected: PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/data/ariel.ts src/data/ariel.test.ts src/app/asistente src/routes.tsx
git commit -m "feat(asistente): scripted ARIEL response engine and route"
```

---

### Task 2: ChatARIEL screen (bubbles, input, quick replies)

**Files:**
- Modify: `src/app/asistente/ChatARIEL.tsx` (replace stub)
- Test: `src/app/asistente/ChatARIEL.test.tsx`

**Interfaces:**
- Consumes: `useUser().profile` (greeting name), `greeting`/`arielRespond`/`QUICK_REPLIES`/`ChatMsg`, `Chip`, `SendIcon`/`MicIcon`/`SpeakerIcon`, `useTts`.
- Produces: `ChatARIEL()` — a custom navy header (avatar 🧑‍🦰 + "ARIEL" + "En línea" + mic + TTS icons); a scrollable message list seeded with `{ from: 'ariel', texto: greeting(profile?.nombre) }`; user bubbles right-aligned (navy), ARIEL bubbles left-aligned (surface); `QUICK_REPLIES` as `Chip`s that send that text; a bottom input row (text `<input>` "Escribí acá..." + a send `<button aria-label="Enviar">`). Sending a non-empty message appends the user msg then ARIEL's reply (`arielRespond`) and clears the input. Empty send is a no-op.

- [ ] **Step 1: Write the failing test**

`src/app/asistente/ChatARIEL.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ChatARIEL } from './ChatARIEL'
import { UserProvider } from '../../state/UserProvider'
import { TtsProvider } from '../../state/TtsProvider'
import type { Profile } from '../../types'

const susana: Profile = { nombre: 'Susana', apellido: 'M', barrio: '', fechaNacimiento: '', fotoDataUrl: null, intereses: [] }

// Seed the profile into localStorage BEFORE render so UserProvider rehydrates it
// on mount — the greeting is computed from profile at ChatARIEL's first render
// (this mirrors the real app, where the profile is already loaded from storage).
function setup() {
  localStorage.setItem('simple.user', JSON.stringify({ profile: susana, identified: true }))
  return render(
    <UserProvider><TtsProvider><MemoryRouter>
      <ChatARIEL />
    </MemoryRouter></TtsProvider></UserProvider>,
  )
}
beforeEach(() => localStorage.clear())

test('greets by name and answers a typed question', async () => {
  setup()
  expect(screen.getByText(/Hola Susana/)).toBeInTheDocument()
  await userEvent.type(screen.getByPlaceholderText(/Escribí acá/i), '¿Qué actividades hay esta semana?')
  await userEvent.click(screen.getByRole('button', { name: /Enviar/i }))
  expect(screen.getByText('¿Qué actividades hay esta semana?')).toBeInTheDocument()
  expect(screen.getByText(/Yoga en plaza Vicente López/)).toBeInTheDocument()
})

test('a quick reply sends and gets an answer', async () => {
  setup()
  await userEvent.click(screen.getByRole('button', { name: /Noticias de hoy/i }))
  expect(screen.getByText(/noticias más importantes/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/app/asistente/ChatARIEL.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/app/asistente/ChatARIEL.tsx`:
```tsx
import { useState } from 'react'
import { useUser, useTts } from '../../state/hooks'
import { Chip } from '../../ui/Chip'
import { MicIcon, SpeakerIcon, SendIcon } from '../../ui/icons'
import { greeting, arielRespond, QUICK_REPLIES, type ChatMsg } from '../../data/ariel'

export function ChatARIEL() {
  const { profile } = useUser()
  const { speak } = useTts()
  const [mensajes, setMensajes] = useState<ChatMsg[]>([
    { id: 'greeting', from: 'ariel', texto: greeting(profile?.nombre) },
  ])
  const [texto, setTexto] = useState('')

  const enviar = (contenido: string) => {
    const t = contenido.trim()
    if (!t) return
    setMensajes((prev) => [
      ...prev,
      { id: `u-${prev.length}`, from: 'user', texto: t },
      { id: `a-${prev.length}`, from: 'ariel', texto: arielRespond(t) },
    ])
    setTexto('')
  }

  return (
    <div className="flex flex-col h-full">
      <header className="bg-navy-900 text-white px-4 py-3 flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-teal/30 grid place-items-center text-xl" aria-hidden="true">🧑‍🦰</div>
        <div className="flex-1">
          <p className="font-semibold">ARIEL</p>
          <p className="text-xs text-teal">En línea</p>
        </div>
        <MicIcon className="h-6 w-6 opacity-90" />
        <button aria-label="Leer en voz alta" onClick={() => speak(mensajes[mensajes.length - 1].texto)}>
          <SpeakerIcon className="h-6 w-6" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {mensajes.map((m) => (
          <div key={m.id} className={m.from === 'user' ? 'self-end max-w-[80%]' : 'self-start max-w-[80%]'}>
            <div className={`rounded-2xl px-4 py-2 text-base ${m.from === 'user' ? 'bg-navy-800 text-white' : 'bg-surface text-ink border border-chip/20'}`}>
              {m.texto}
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 py-2 flex gap-2 overflow-x-auto">
        {QUICK_REPLIES.map((q) => (
          <Chip key={q} onClick={() => enviar(q)}>{q}</Chip>
        ))}
      </div>

      <form className="p-3 flex items-center gap-2 border-t border-chip/20"
        onSubmit={(e) => { e.preventDefault(); enviar(texto) }}>
        <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribí acá..."
          className="flex-1 rounded-full border border-chip/40 px-4 py-2 text-base" />
        <button type="submit" aria-label="Enviar"
          className="h-11 w-11 grid place-items-center rounded-full bg-primary text-white">
          <SendIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/app/asistente/ChatARIEL.test.tsx && npm run build`
Expected: PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/asistente/ChatARIEL.tsx src/app/asistente/ChatARIEL.test.tsx
git commit -m "feat(asistente): ARIEL chat screen with bubbles and quick replies"
```

---

## Definition of Done (Phase 7)
- `npm test` and `npm run build` pass.
- The center "Asistente" tab opens the ARIEL chat; it greets by name; typing a question or tapping a quick reply produces a relevant scripted answer; empty send is a no-op. Fully offline.
- Every task committed.

## Next phase
Phase 8 (Legal / Ayuda / Descuentos): static legal/mission docs, FAQ accordion, and the discounts flow — completing the app.
