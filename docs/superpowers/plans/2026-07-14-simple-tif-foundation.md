# +Simple TIF — Foundation (Phase 0) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the +Simple React SPA and build the reusable foundation — design tokens, phone-framed shell, bottom nav, header, state providers (User/Accessibility/TTS), and UI primitives — that every feature module builds on.

**Architecture:** Vite + React + TypeScript app rendered inside a centered ~430px phone frame. React Router drives one route per screen; tabbed screens sit under an `AppShell` with a persistent `BottomNav`. Cross-cutting state lives in three React Contexts (User, Accessibility, TTS), persisted to `localStorage`. Styling uses Tailwind with a custom token theme; shared UI primitives live in `src/ui`.

**Tech Stack:** Vite 5, React 18, TypeScript 5, Tailwind CSS 3.4, React Router 6, Vitest + React Testing Library + jsdom, `@fontsource/inter` (self-hosted font, no CDN).

## Global Constraints

- **Offline-first:** no runtime network requests — no CDN fonts/scripts, no external APIs. Fonts via `@fontsource/inter` (bundled at build). Images local/SVG only.
- **Language:** all UI copy in **Spanish** (Argentina), verbatim from the Figma where given.
- **Mobile-framed:** app content is constrained to a 430px-wide column; desktop shows it as a centered phone frame on a neutral backdrop.
- **Accessibility real, not decorative:** `largeText` and `highContrast` toggles change the UI; the speaker/TTS icon reads content aloud via `window.speechSynthesis`; mic icon is decorative.
- **No backend/auth:** profile and settings persist only in `localStorage`.
- **Palette tokens (verbatim):** `navy-900 #101F3C`, `navy-800 #16305C`, `primary #24528C`, `teal #4FC9BB`, `cream #F5EFE2`, `bg #F7F8FA`, `surface #FFFFFF`, `ink #1A1A1A`, `chip #6E7E8E`.
- **Node:** v20+ (repo uses v24). Package manager: `npm`.
- **Commit style:** conventional commits (`feat:`, `chore:`, `test:`), frequent, one per task.

---

## File Structure

```
package.json, tsconfig.json, tsconfig.node.json, vite.config.ts, tailwind.config.ts,
postcss.config.js, index.html, .eslintrc (optional), vitest.setup.ts
src/
  main.tsx                      # React root, mounts <App/> with providers + router
  App.tsx                       # <RouterProvider> / <BrowserRouter> + routes
  index.css                     # Tailwind directives + base layer + font import + a11y classes
  routes.tsx                    # route table (skeleton screens for now)
  types.ts                      # shared domain types (Profile, Interest, etc.)
  state/
    UserProvider.tsx            # profile + identified + CV; localStorage
    AccessibilityProvider.tsx   # largeText + highContrast; localStorage; toggles root classes
    TtsProvider.tsx             # speak()/stop() over speechSynthesis
    hooks.ts                    # useUser, useAccessibility, useTts
  ui/
    Button.tsx  Card.tsx  Chip.tsx  Avatar.tsx  TextField.tsx  Toggle.tsx
    ProgressDots.tsx  Accordion.tsx  ChatBubble.tsx  Postcard.tsx  ListItemCard.tsx
    IconButton.tsx  icons.tsx    # inline SVG icon components
    index.ts                     # barrel export
  layout/
    PhoneFrame.tsx  AppShell.tsx  BottomNav.tsx  ScreenHeader.tsx
  screens/
    Placeholder.tsx              # temporary "Próximamente" screen used by skeleton routes
  data/
    .gitkeep                     # fixtures added in later phases
```

Test files live next to source as `*.test.tsx` / `*.test.ts`.

---

### Task 1: Project scaffold (Vite + TS + Tailwind + Router + Vitest)

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `postcss.config.js`, `tailwind.config.ts`, `index.html`, `vitest.setup.ts`, `src/main.tsx`, `src/App.tsx`, `src/index.css`
- Test: `src/smoke.test.tsx`

**Interfaces:**
- Produces: a runnable dev server (`npm run dev`), a passing test runner (`npm test`), and a working Tailwind pipeline. `App` renders a `<BrowserRouter>` with a single placeholder route.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "simple-tif",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@fontsource/inter": "5.0.18",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-router-dom": "6.26.2"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "6.4.8",
    "@testing-library/react": "16.0.1",
    "@testing-library/user-event": "14.5.2",
    "@types/react": "18.3.5",
    "@types/react-dom": "18.3.0",
    "@vitejs/plugin-react": "4.3.1",
    "autoprefixer": "10.4.20",
    "jsdom": "25.0.0",
    "postcss": "8.4.45",
    "tailwindcss": "3.4.10",
    "typescript": "5.5.4",
    "vite": "5.4.3",
    "vitest": "2.0.5"
  }
}
```

- [ ] **Step 2: Create config files**

`vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // relative paths so the built app runs offline from any folder
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
} as any)
```

`vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest'
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "vitest.setup.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts", "tailwind.config.ts"]
}
```

`postcss.config.js`:
```js
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}
```

`tailwind.config.ts` (tokens filled in Task 2 — start minimal):
```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
} satisfies Config
```

- [ ] **Step 3: Create `index.html`, entry, and CSS**

`index.html`:
```html
<!doctype html>
<html lang="es-AR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>+Simple</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/index.css`:
```css
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/inter/700.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

:root { font-family: 'Inter', system-ui, sans-serif; }
html, body, #root { height: 100%; margin: 0; }
```

`src/main.tsx`:
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

`src/App.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>+Simple</div>} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 4: Write the smoke test**

`src/smoke.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders app root', () => {
  render(<App />)
  expect(screen.getByText('+Simple')).toBeInTheDocument()
})
```

- [ ] **Step 5: Install and run**

Run: `npm install && npm test`
Expected: install succeeds; 1 test passes (`renders app root`).

Run: `npm run dev` (start), open the printed URL, confirm "+Simple" renders, then stop the dev server.
Expected: no console errors, no network requests to external hosts.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TS + Tailwind + Router + Vitest"
```

---

### Task 2: Design tokens & global accessibility CSS

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/index.css`
- Test: `src/tokens.test.tsx`

**Interfaces:**
- Produces: Tailwind color tokens (`navy-900`, `navy-800`, `primary`, `teal`, `cream`, `bg`, `surface`, `ink`, `chip`), radius tokens, and two root CSS classes — `.a11y-large` (scales base font) and `.a11y-contrast` (stronger contrast). Consumed by every component and by `AccessibilityProvider` (Task 5).

- [ ] **Step 1: Fill in `tailwind.config.ts` tokens**

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#101F3C', 800: '#16305C' },
        primary: { DEFAULT: '#24528C', dark: '#1B3E6E' },
        teal: { DEFAULT: '#4FC9BB', dark: '#37B0A2' },
        cream: '#F5EFE2',
        bg: '#F7F8FA',
        surface: '#FFFFFF',
        ink: '#1A1A1A',
        chip: '#6E7E8E',
      },
      borderRadius: { xl2: '1.25rem' },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 2: Add accessibility classes to `src/index.css`**

Append:
```css
@layer base {
  body { @apply bg-bg text-ink; font-size: 18px; }
  /* Large-text mode: bump the root font size; rem-based sizes scale with it */
  html.a11y-large body { font-size: 21px; }
  /* High-contrast mode: darker surfaces, pure-black text, stronger borders */
  html.a11y-contrast { --tw-prose: initial; }
  html.a11y-contrast body { @apply text-black; }
  html.a11y-contrast .contrast-surface { @apply border-2 border-black; }
}
```

- [ ] **Step 3: Write a token smoke test**

`src/tokens.test.tsx`:
```tsx
import { render } from '@testing-library/react'

test('primary token class applies a background color', () => {
  const { container } = render(<div className="bg-primary" data-testid="x">hola</div>)
  const el = container.firstChild as HTMLElement
  // jsdom does not compute Tailwind output, so assert the class is present.
  expect(el).toHaveClass('bg-primary')
})
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add design tokens and accessibility CSS classes"
```

---

### Task 3: Shared domain types

**Files:**
- Create: `src/types.ts`
- Test: `src/types.test.ts`

**Interfaces:**
- Produces: `Interest`, `Profile`, `CvData` types consumed by `UserProvider` and feature modules.

- [ ] **Step 1: Write the type-usage test (compile-time guard)**

`src/types.test.ts`:
```ts
import type { Profile, Interest } from './types'

test('Profile shape is usable', () => {
  const interests: Interest[] = ['Gastronomía', 'Jardinería']
  const p: Profile = {
    nombre: 'Susana', apellido: 'Martinez', barrio: 'Recoleta',
    fechaNacimiento: '1956-10-17', fotoDataUrl: null, intereses: interests,
  }
  expect(p.nombre).toBe('Susana')
  expect(p.intereses).toContain('Jardinería')
})
```

- [ ] **Step 2: Create `src/types.ts`**

```ts
export type Interest =
  | 'Gastronomía' | 'Idiomas' | 'Jardinería' | 'Manualidades'
  | 'Truco' | 'Cocinar' | 'Películas'

export interface Profile {
  nombre: string
  apellido: string
  barrio: string
  /** ISO date yyyy-mm-dd */
  fechaNacimiento: string
  /** data: URL of uploaded photo, or null */
  fotoDataUrl: string | null
  intereses: Interest[]
}

export interface CvData {
  telefono: string
  email: string
  disponibilidad: 'Media jornada' | 'Jornada completa' | null
}
```

- [ ] **Step 3: Run test**

Run: `npm test src/types.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add shared domain types"
```

---

### Task 4: TTS provider (`speechSynthesis`)

**Files:**
- Create: `src/state/TtsProvider.tsx`
- Create: `src/state/hooks.ts`
- Test: `src/state/TtsProvider.test.tsx`

**Interfaces:**
- Produces: `<TtsProvider>` and `useTts(): { speak(text: string): void; stop(): void; supported: boolean }`. `speak` calls `window.speechSynthesis.speak` with a `SpeechSynthesisUtterance` (lang `es-AR`); no-ops when unsupported. Consumed by `ScreenHeader` and any screen's speaker icon.

- [ ] **Step 1: Write the failing test**

`src/state/TtsProvider.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TtsProvider } from './TtsProvider'
import { useTts } from './hooks'

function Probe() {
  const { speak, supported } = useTts()
  return <button onClick={() => speak('hola mundo')}>{supported ? 'on' : 'off'}</button>
}

test('speak() sends an utterance to speechSynthesis', async () => {
  const speakSpy = vi.fn()
  ;(window as any).speechSynthesis = { speak: speakSpy, cancel: vi.fn() }
  ;(window as any).SpeechSynthesisUtterance = class { text = ''; lang = ''; constructor(t: string){ this.text = t } }

  render(<TtsProvider><Probe /></TtsProvider>)
  await userEvent.click(screen.getByText('on'))
  expect(speakSpy).toHaveBeenCalledTimes(1)
  expect(speakSpy.mock.calls[0][0].text).toBe('hola mundo')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/state/TtsProvider.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement provider + hook**

`src/state/TtsProvider.tsx`:
```tsx
import { createContext, useCallback, useMemo, type ReactNode } from 'react'

export interface TtsApi { speak: (text: string) => void; stop: () => void; supported: boolean }
export const TtsContext = createContext<TtsApi | null>(null)

export function TtsProvider({ children }: { children: ReactNode }) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const speak = useCallback((text: string) => {
    if (!supported) return
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'es-AR'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }, [supported])
  const stop = useCallback(() => { if (supported) window.speechSynthesis.cancel() }, [supported])
  const value = useMemo<TtsApi>(() => ({ speak, stop, supported }), [speak, stop, supported])
  return <TtsContext.Provider value={value}>{children}</TtsContext.Provider>
}
```

`src/state/hooks.ts`:
```ts
import { useContext } from 'react'
import { TtsContext } from './TtsProvider'

export function useTts() {
  const ctx = useContext(TtsContext)
  if (!ctx) throw new Error('useTts must be used within TtsProvider')
  return ctx
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/state/TtsProvider.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add TTS provider over speechSynthesis"
```

---

### Task 5: Accessibility provider (large text + high contrast)

**Files:**
- Create: `src/state/AccessibilityProvider.tsx`
- Modify: `src/state/hooks.ts`
- Test: `src/state/AccessibilityProvider.test.tsx`

**Interfaces:**
- Produces: `<AccessibilityProvider>` and `useAccessibility(): { largeText: boolean; highContrast: boolean; toggleLargeText(): void; toggleHighContrast(): void }`. Applies `a11y-large` / `a11y-contrast` classes to `document.documentElement`; persists to `localStorage` key `simple.a11y`.

- [ ] **Step 1: Write the failing test**

`src/state/AccessibilityProvider.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccessibilityProvider } from './AccessibilityProvider'
import { useAccessibility } from './hooks'

function Probe() {
  const { largeText, toggleLargeText } = useAccessibility()
  return <button onClick={toggleLargeText}>{largeText ? 'grande' : 'normal'}</button>
}

beforeEach(() => { localStorage.clear(); document.documentElement.className = '' })

test('toggling large text adds the root class and persists', async () => {
  render(<AccessibilityProvider><Probe /></AccessibilityProvider>)
  expect(screen.getByText('normal')).toBeInTheDocument()
  await userEvent.click(screen.getByText('normal'))
  expect(screen.getByText('grande')).toBeInTheDocument()
  expect(document.documentElement).toHaveClass('a11y-large')
  expect(JSON.parse(localStorage.getItem('simple.a11y')!).largeText).toBe(true)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/state/AccessibilityProvider.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement provider**

`src/state/AccessibilityProvider.tsx`:
```tsx
import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export interface A11yApi {
  largeText: boolean; highContrast: boolean
  toggleLargeText: () => void; toggleHighContrast: () => void
}
export const AccessibilityContext = createContext<A11yApi | null>(null)
const KEY = 'simple.a11y'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const initial = load()
  const [largeText, setLargeText] = useState<boolean>(!!initial.largeText)
  const [highContrast, setHighContrast] = useState<boolean>(!!initial.highContrast)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('a11y-large', largeText)
    root.classList.toggle('a11y-contrast', highContrast)
    localStorage.setItem(KEY, JSON.stringify({ largeText, highContrast }))
  }, [largeText, highContrast])

  const value = useMemo<A11yApi>(() => ({
    largeText, highContrast,
    toggleLargeText: () => setLargeText(v => !v),
    toggleHighContrast: () => setHighContrast(v => !v),
  }), [largeText, highContrast])

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}
```

Append to `src/state/hooks.ts`:
```ts
import { AccessibilityContext } from './AccessibilityProvider'

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext)
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider')
  return ctx
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/state/AccessibilityProvider.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add accessibility provider (large text, high contrast)"
```

---

### Task 6: User provider (profile + persistence)

**Files:**
- Create: `src/state/UserProvider.tsx`
- Modify: `src/state/hooks.ts`
- Test: `src/state/UserProvider.test.tsx`

**Interfaces:**
- Produces: `<UserProvider>` and `useUser(): { profile: Profile | null; identified: boolean; setProfile(p: Profile): void; updateProfile(patch: Partial<Profile>): void; setIdentified(v: boolean): void; reset(): void }`. Persists `profile` + `identified` to `localStorage` key `simple.user`. Consumed by onboarding, Perfil, Home, Empleo.

- [ ] **Step 1: Write the failing test**

`src/state/UserProvider.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserProvider } from './UserProvider'
import { useUser } from './hooks'
import type { Profile } from '../types'

const sample: Profile = {
  nombre: 'Susana', apellido: 'Martinez', barrio: 'Recoleta',
  fechaNacimiento: '1956-10-17', fotoDataUrl: null, intereses: ['Jardinería'],
}

function Probe() {
  const { profile, setProfile } = useUser()
  return <button onClick={() => setProfile(sample)}>{profile ? profile.nombre : 'sin perfil'}</button>
}

beforeEach(() => localStorage.clear())

test('setProfile stores and persists the profile', async () => {
  render(<UserProvider><Probe /></UserProvider>)
  await userEvent.click(screen.getByText('sin perfil'))
  expect(screen.getByText('Susana')).toBeInTheDocument()
  expect(JSON.parse(localStorage.getItem('simple.user')!).profile.nombre).toBe('Susana')
})

test('profile is rehydrated from localStorage on mount', () => {
  localStorage.setItem('simple.user', JSON.stringify({ profile: sample, identified: true }))
  render(<UserProvider><Probe /></UserProvider>)
  expect(screen.getByText('Susana')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/state/UserProvider.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement provider**

`src/state/UserProvider.tsx`:
```tsx
import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Profile } from '../types'

export interface UserApi {
  profile: Profile | null
  identified: boolean
  setProfile: (p: Profile) => void
  updateProfile: (patch: Partial<Profile>) => void
  setIdentified: (v: boolean) => void
  reset: () => void
}
export const UserContext = createContext<UserApi | null>(null)
const KEY = 'simple.user'

function load(): { profile: Profile | null; identified: boolean } {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '{}'); return { profile: v.profile ?? null, identified: !!v.identified } }
  catch { return { profile: null, identified: false } }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const initial = load()
  const [profile, setProfileState] = useState<Profile | null>(initial.profile)
  const [identified, setIdentified] = useState<boolean>(initial.identified)

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify({ profile, identified })) }, [profile, identified])

  const value = useMemo<UserApi>(() => ({
    profile, identified,
    setProfile: (p) => setProfileState(p),
    updateProfile: (patch) => setProfileState(prev => (prev ? { ...prev, ...patch } : prev)),
    setIdentified,
    reset: () => { setProfileState(null); setIdentified(false) },
  }), [profile, identified])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
```

Append to `src/state/hooks.ts`:
```ts
import { UserContext } from './UserProvider'

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/state/UserProvider.test.tsx`
Expected: PASS (both tests).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add user provider with localStorage persistence"
```

---

### Task 7: Inline SVG icons + core UI primitives (Button, Card, Chip, TextField, Toggle)

**Files:**
- Create: `src/ui/icons.tsx`, `src/ui/Button.tsx`, `src/ui/Card.tsx`, `src/ui/Chip.tsx`, `src/ui/TextField.tsx`, `src/ui/Toggle.tsx`, `src/ui/index.ts`
- Test: `src/ui/Button.test.tsx`, `src/ui/Toggle.test.tsx`

**Interfaces:**
- Produces:
  - `Button({ variant?: 'primary'|'secondary'|'ghost', ...buttonProps })` — large pill button.
  - `Card({ className?, children })` — white rounded surface (`contrast-surface` class for a11y borders).
  - `Chip({ selected?, onClick?, children })` — pill.
  - `TextField({ label, value, onChange, placeholder?, type? })`.
  - `Toggle({ checked, onChange, label })` — accessible switch.
  - `icons.tsx` exports `MicIcon`, `SpeakerIcon`, `BackIcon`, `HomeIcon`, `UsersIcon`, `MapIcon`, `SettingsIcon`, `SendIcon` as `({ className }) => JSX`.
- Consumed by every screen and layout component.

- [ ] **Step 1: Write failing tests**

`src/ui/Button.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

test('Button renders label and fires onClick', async () => {
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Continuar</Button>)
  await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))
  expect(onClick).toHaveBeenCalled()
})
```

`src/ui/Toggle.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toggle } from './Toggle'

test('Toggle reflects checked state and fires onChange', async () => {
  const onChange = vi.fn()
  render(<Toggle checked={false} onChange={onChange} label="Textos grandes" />)
  const sw = screen.getByRole('switch', { name: 'Textos grandes' })
  expect(sw).toHaveAttribute('aria-checked', 'false')
  await userEvent.click(sw)
  expect(onChange).toHaveBeenCalled()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test src/ui`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement icons and primitives**

`src/ui/icons.tsx`:
```tsx
import type { ReactNode } from 'react'
type P = { className?: string }
const svg = (path: ReactNode) => ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>
)
export const MicIcon = svg(<><path d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="19" x2="12" y2="23"/></>)
export const SpeakerIcon = svg(<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></>)
export const BackIcon = svg(<path d="M15 18l-6-6 6-6"/>)
export const HomeIcon = svg(<><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></>)
export const UsersIcon = svg(<><circle cx="9" cy="8" r="3"/><path d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/><circle cx="18" cy="9" r="2"/></>)
export const MapIcon = svg(<><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></>)
export const SettingsIcon = svg(<><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.3 1a7 7 0 0 0-1.7-1L14.5 3h-4l-.4 2.5a7 7 0 0 0-1.7 1l-2.3-1-2 3.5 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.3-1a7 7 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7 7 0 0 0 1.7-1l2.3 1 2-3.5-2-1.5a7 7 0 0 0 .1-1z"/></>)
export const SendIcon = svg(<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>)
```

`src/ui/Button.tsx`:
```tsx
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
const styles: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-navy-800 text-white hover:bg-navy-900',
  ghost: 'bg-transparent text-primary border-2 border-primary',
}
export function Button(
  { variant = 'primary', className = '', ...props }:
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant },
) {
  return (
    <button
      className={`w-full rounded-full py-3 px-6 text-lg font-semibold transition
        disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  )
}
```

`src/ui/Card.tsx`:
```tsx
import type { ReactNode } from 'react'
export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`contrast-surface bg-surface rounded-2xl shadow-sm p-4 ${className}`}>{children}</div>
}
```

`src/ui/Chip.tsx`:
```tsx
import type { ReactNode } from 'react'
export function Chip(
  { selected = false, onClick, children }:
  { selected?: boolean; onClick?: () => void; children: ReactNode },
) {
  return (
    <button type="button" onClick={onClick} aria-pressed={selected}
      className={`rounded-full px-4 py-2 text-base font-medium
        ${selected ? 'bg-primary text-white' : 'bg-chip/20 text-ink'}`}>
      {children}
    </button>
  )
}
```

`src/ui/TextField.tsx`:
```tsx
import { useId, type ChangeEvent } from 'react'
export function TextField(
  { label, value, onChange, placeholder, type = 'text' }:
  { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string },
) {
  const id = useId()
  return (
    <label htmlFor={id} className="block mb-4">
      <span className="block mb-1 text-lg font-semibold">{label}</span>
      <input id={id} type={type} value={value} placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="contrast-surface w-full rounded-xl border border-chip/40 bg-surface px-4 py-3 text-lg" />
    </label>
  )
}
```

`src/ui/Toggle.tsx`:
```tsx
export function Toggle(
  { checked, onChange, label }:
  { checked: boolean; onChange: (v: boolean) => void; label: string },
) {
  return (
    <button role="switch" aria-checked={checked} aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-14 rounded-full transition ${checked ? 'bg-teal' : 'bg-chip/40'}`}>
      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${checked ? 'left-7' : 'left-1'}`} />
    </button>
  )
}
```

`src/ui/index.ts`:
```ts
export * from './Button'
export * from './Card'
export * from './Chip'
export * from './TextField'
export * from './Toggle'
export * from './icons'
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/ui`
Expected: PASS (Button + Toggle tests).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add inline icons and core UI primitives"
```

---

### Task 8: Layout shell (PhoneFrame, ScreenHeader, BottomNav, AppShell)

**Files:**
- Create: `src/layout/PhoneFrame.tsx`, `src/layout/ScreenHeader.tsx`, `src/layout/BottomNav.tsx`, `src/layout/AppShell.tsx`
- Test: `src/layout/BottomNav.test.tsx`, `src/layout/ScreenHeader.test.tsx`

**Interfaces:**
- Consumes: `useTts` (Task 4), icons + no primitives strictly required, React Router `NavLink`/`Outlet`.
- Produces:
  - `PhoneFrame({ children })` — centered 430px column on a neutral backdrop.
  - `ScreenHeader({ title, onBack?, ttsText? })` — navy bar; back button when `onBack`; mic (decorative) + speaker (calls `useTts().speak(ttsText ?? title)`).
  - `BottomNav()` — 5 `NavLink`s (`/app/home`, `/app/foro`, `/app/asistente`, `/app/mapa`, `/app/perfil`); active link gets `aria-current="page"`.
  - `AppShell()` — `PhoneFrame` > `<Outlet/>` (scrollable) + `BottomNav`.

- [ ] **Step 1: Write failing tests**

`src/layout/ScreenHeader.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ScreenHeader } from './ScreenHeader'
import { TtsProvider } from '../state/TtsProvider'

test('speaker button reads the tts text', async () => {
  const speakSpy = vi.fn()
  ;(window as any).speechSynthesis = { speak: speakSpy, cancel: vi.fn() }
  ;(window as any).SpeechSynthesisUtterance = class { text=''; lang=''; constructor(t:string){this.text=t} }
  render(<TtsProvider><ScreenHeader title="Perfil" ttsText="Esta es tu página de perfil" /></TtsProvider>)
  await userEvent.click(screen.getByRole('button', { name: /leer/i }))
  expect(speakSpy).toHaveBeenCalled()
  expect(speakSpy.mock.calls[0][0].text).toBe('Esta es tu página de perfil')
})
```

`src/layout/BottomNav.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BottomNav } from './BottomNav'

test('marks the active route', () => {
  render(<MemoryRouter initialEntries={['/app/home']}><BottomNav /></MemoryRouter>)
  const inicio = screen.getByRole('link', { name: /inicio/i })
  expect(inicio).toHaveAttribute('aria-current', 'page')
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test src/layout`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement layout components**

`src/layout/PhoneFrame.tsx`:
```tsx
import type { ReactNode } from 'react'
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-neutral-200 flex justify-center">
      <div className="relative w-full max-w-[430px] min-h-screen bg-bg flex flex-col shadow-xl overflow-hidden">
        {children}
      </div>
    </div>
  )
}
```

`src/layout/ScreenHeader.tsx`:
```tsx
import { useTts } from '../state/hooks'
import { BackIcon, MicIcon, SpeakerIcon } from '../ui/icons'

export function ScreenHeader(
  { title, onBack, ttsText }:
  { title: string; onBack?: () => void; ttsText?: string },
) {
  const { speak } = useTts()
  return (
    <header className="bg-navy-900 text-white px-4 py-4 flex items-center gap-3">
      {onBack && (
        <button aria-label="Volver" onClick={onBack}
          className="grid place-items-center h-10 w-10 rounded-full bg-teal text-navy-900">
          <BackIcon className="h-6 w-6" />
        </button>
      )}
      <h1 className="text-xl font-semibold flex-1">{title}</h1>
      <MicIcon className="h-6 w-6 opacity-90" />
      <button aria-label="Leer en voz alta" onClick={() => speak(ttsText ?? title)}>
        <SpeakerIcon className="h-6 w-6" />
      </button>
    </header>
  )
}
```

`src/layout/BottomNav.tsx`:
```tsx
import { NavLink } from 'react-router-dom'
import { HomeIcon, UsersIcon, MapIcon, SettingsIcon } from '../ui/icons'

const items = [
  { to: '/app/home', label: 'Inicio', Icon: HomeIcon },
  { to: '/app/foro', label: 'Comunidad', Icon: UsersIcon },
  { to: '/app/asistente', label: 'Asistente', Icon: UsersIcon, center: true },
  { to: '/app/mapa', label: 'Mapa', Icon: MapIcon },
  { to: '/app/perfil', label: 'Perfil', Icon: SettingsIcon },
]

export function BottomNav() {
  return (
    <nav className="bg-navy-900 text-white flex justify-around items-center py-2">
      {items.map(({ to, label, Icon, center }) => (
        <NavLink key={to} to={to}
          className={({ isActive }) => `flex flex-col items-center text-xs px-2 ${isActive ? 'text-teal' : 'text-white/80'}`}>
          <span className={center ? 'grid place-items-center h-11 w-11 -mt-4 rounded-full bg-teal text-navy-900' : ''}>
            <Icon className="h-6 w-6" />
          </span>
          <span className="sr-only">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
```

Note: `NavLink` sets `aria-current="page"` on the active link automatically. The visually-hidden `<span>` supplies each link's accessible name for the test's `name:` query.

`src/layout/AppShell.tsx`:
```tsx
import { Outlet } from 'react-router-dom'
import { PhoneFrame } from './PhoneFrame'
import { BottomNav } from './BottomNav'

export function AppShell() {
  return (
    <PhoneFrame>
      <main className="flex-1 overflow-y-auto"><Outlet /></main>
      <BottomNav />
    </PhoneFrame>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test src/layout`
Expected: PASS (both tests).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add phone frame, header, bottom nav, and app shell"
```

---

### Task 9: Providers wiring + routing skeleton + placeholder screens

**Files:**
- Create: `src/screens/Placeholder.tsx`, `src/routes.tsx`
- Modify: `src/App.tsx`, `src/main.tsx`
- Test: `src/routes.test.tsx`

**Interfaces:**
- Consumes: all providers (Tasks 4–6), `AppShell` (Task 8).
- Produces: `AppProviders({ children })` wrapping User/Accessibility/Tts; a route table mounting `AppShell` at `/app` with placeholder children for every module route; `/` renders a placeholder splash. Later phases replace `Placeholder` elements route-by-route.

- [ ] **Step 1: Write the failing test**

`src/routes.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import { AppProviders } from './App'

test('renders the home placeholder under /app/home with bottom nav', () => {
  render(
    <AppProviders>
      <MemoryRouter initialEntries={['/app/home']}><AppRoutes /></MemoryRouter>
    </AppProviders>,
  )
  expect(screen.getByRole('heading', { name: 'Inicio' })).toBeInTheDocument()
  expect(screen.getByText(/Próximamente/i)).toBeInTheDocument()
  expect(screen.getByRole('navigation')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/routes.test.tsx`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement placeholder, routes, providers**

`src/screens/Placeholder.tsx`:
```tsx
import { ScreenHeader } from '../layout/ScreenHeader'
export function Placeholder({ title }: { title: string }) {
  return (
    <>
      <ScreenHeader title={title} />
      <div className="p-6 text-lg text-ink/70">{title} — Próximamente</div>
    </>
  )
}
```

`src/routes.tsx`:
```tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { Placeholder } from './screens/Placeholder'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder title="Inicio" />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Placeholder title="Inicio" />} />
        <Route path="perfil" element={<Placeholder title="Perfil" />} />
        <Route path="config" element={<Placeholder title="Configuración" />} />
        <Route path="foro" element={<Placeholder title="Comunidad" />} />
        <Route path="asistente" element={<Placeholder title="Asistente" />} />
        <Route path="mapa" element={<Placeholder title="Mapa" />} />
        <Route path="actividades" element={<Placeholder title="Actividades" />} />
        <Route path="empleo" element={<Placeholder title="Empleo" />} />
        <Route path="descuentos" element={<Placeholder title="Descuentos" />} />
        <Route path="clubes" element={<Placeholder title="Clubes" />} />
      </Route>
    </Routes>
  )
}
```

Replace `src/App.tsx`:
```tsx
import { BrowserRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { UserProvider } from './state/UserProvider'
import { AccessibilityProvider } from './state/AccessibilityProvider'
import { TtsProvider } from './state/TtsProvider'
import { AppRoutes } from './routes'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AccessibilityProvider><UserProvider><TtsProvider>{children}</TtsProvider></UserProvider></AccessibilityProvider>
  )
}

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter><AppRoutes /></BrowserRouter>
    </AppProviders>
  )
}
```

Note: `src/main.tsx` already renders `<App/>` — no change needed. Delete the obsolete `src/smoke.test.tsx` (it asserted the old inline "+Simple" route) and rely on `routes.test.tsx`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS across the suite (remove/replace the old smoke test if it now fails).

- [ ] **Step 5: Verify the app runs**

Run: `npm run dev`, open the URL, navigate to `/app/home`; confirm the phone frame, "Inicio — Próximamente", and bottom nav render with no external network requests. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: wire providers and routing skeleton with placeholder screens"
```

---

## Definition of Done (Phase 0)

- `npm install`, `npm test`, and `npm run build` all succeed.
- The built app runs offline (no external network requests at runtime — verify in devtools Network tab).
- Phone frame + bottom nav render; placeholder routes reachable; accessibility toggles and TTS providers available app-wide.
- Every task committed.

## Next phase

Phase 1 (Onboarding) gets its own plan authored just before implementation, consuming: `useUser`, `useAccessibility`, `useTts`, the UI primitives (`Button`, `Chip`, `TextField`, `Card`), `ScreenHeader`, and the `/` + `/registro/*` routes (which replace the `/` placeholder).
