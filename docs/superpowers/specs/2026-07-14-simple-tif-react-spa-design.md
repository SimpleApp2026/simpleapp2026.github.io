# +Simple TIF → React SPA — Design Spec

**Date:** 2026-07-14
**Source:** Figma file "+Simple TIF" (`HYH6ZxicbOJSCjyn0fWv8P`)
**Goal:** Convert the full Figma mobile-app flow into a working React single-page application.

---

## 1. Overview

**+Simple** is a Spanish-language community app for older adults ("adultos mayores")
in Buenos Aires. The design emphasizes accessibility: navy/cream/teal palette, oversized
touch targets and type, and mic + text-to-speech controls on nearly every screen. The
Figma contains ~68 frames across 12 feature modules.

This SPA reproduces the app as a **working, navigable** application (real routing, stateful
forms, clickable flows) with mock data, visually close to the Figma. Content stays in Spanish.

## 2. Constraints & non-goals

- **Offline-first.** No runtime dependency on the internet: no external APIs, no CDN fonts
  or scripts. Fonts, icons, and imagery are bundled locally or rendered as inline SVG/data URIs.
  The built app must run fully offline (a static `dist/` served from disk).
- **Mobile-framed.** Each screen renders inside a centered ~430px mobile viewport; on desktop
  it appears as a phone frame centered on a neutral backdrop.
- **Accessibility is a feature, not decoration.** Large-text and high-contrast toggles actually
  change the UI. The speaker (TTS) icon reads screen content aloud via the browser Web Speech API.
- **No backend, no auth.** "Registro"/"identificarme" are local-only; profile persists in
  `localStorage`. No network calls of any kind.
- **Scripted AI.** The ARIEL chat replays a canned, keyword-matched conversation offline.
  No LLM/API.
- **Not in scope:** real payments, real job applications, server sync, native mobile packaging,
  pixel-perfect 1:1 reproduction (we aim "visually close"), the author's TODO sticky note.

## 3. Tech stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** (design tokens in `tailwind.config`) + a small amount of component CSS
- **React Router v6** (data routers not required)
- **Vitest + React Testing Library** for unit/component tests
- **Local assets:** a bundled variable font (e.g. Inter, self-hosted in `/src/assets/fonts`),
  icons as inline SVG components, photos as local placeholder images (or SVG avatars).
- Mic dictation: none. TTS: native `window.speechSynthesis` (graceful no-op if unavailable).

## 4. Architecture

### 4.1 App shell & layout
- `PhoneFrame` — centered 430px column, max-height mobile, neutral desktop backdrop.
- `AppShell` — wraps tabbed screens; renders a screen and the persistent `BottomNav`.
- `BottomNav` — 5 items: **Inicio** (Home), **Comunidad** (Foro), center **Asistente** (ARIEL,
  raised FAB-style), **Mapa**, **Perfil**. Highlights active route.
- `ScreenHeader` — navy bar with optional back button, title, mic (decorative) and TTS (functional)
  icons. Reused across nearly all screens.
- Onboarding screens render **outside** `AppShell` (no bottom nav).

### 4.2 Routing
React Router, one route per screen. Sketch:
```
/                         → Splash (Inicio)
/identificacion           → identify choice
/registro/*               → onboarding steps (datos, intereses, foto-1..3)
/app (AppShell)
  /home                   → Home
  /perfil                 → Perfil
  /config                 → Configuración
  /ayuda, /legal/:doc     → FAQ, Privacidad/Términos/Objetivo
  /actividades/*          → categorías, listado, detalle, reserva, confirmación
  /descuentos/*           → listado, detalle, confirmación
  /empleo/*               → menú, cv-builder, cv, oportunidades, postular, confirmación, capacitaciones
  /foro/*                 → cartas públicas (+comentarios), privadas (compose/abrir/responder), amigos
  /asistente              → Chat ARIEL
  /clubes/*               → listado, /clubes/:club (board + comentar)
```

### 4.3 State management (React Context, no external store)
- `UserProvider` — profile (nombre, apellido, barrio, fecha nacimiento, foto, intereses),
  identified vs. anonymous, CV data. Persisted to `localStorage`.
- `AccessibilityProvider` — `largeText`, `highContrast` booleans → toggle CSS classes on the
  root; persisted.
- `TtsProvider` (or a `useTts` hook) — wraps `speechSynthesis`; `speak(text)` / `stop()`.
- Feature data (activities, jobs, letters, clubs, chat script) is static, imported from `/src/data`.
  Mutable interactions (sent letters, posted comments, applications) update in-memory context
  state so flows feel real within a session.

### 4.4 Design system (`/src/ui`)
Tailwind theme tokens:
- **Colors:** `navy-900 #101F3C`, `navy-800 #16305C`, `primary #24528C` (buttons/"Sí"/"Continuar"),
  `teal #4FC9BB` (accents, back-button circle, tab labels), `cream #F5EFE2` (cartas paper),
  `surface #FFFFFF`, `bg #F7F8FA`, `ink #1A1A1A`, `chip #6E7E8E`.
  High-contrast variant swaps to stronger navy/black + white.
- **Type scale:** base 18px, headings 24–32px; larger under `largeText`.
- **Radius:** cards 16–20px, buttons pill/large-radius. Generous padding.
- Primitives: `Button` (primary/secondary/ghost, all large), `Card`, `Chip`, `Avatar`,
  `ProgressDots` (1-3 / 2-3 / 3-3), `Toggle`, `TextField`, `Accordion` (FAQ),
  `Postcard` (cream + stamp frame for cartas), `ChatBubble` (sent/received), `Fab`,
  `IconButton`, `TabBar` (Cartas públicas/privadas/Amigos), `ListItemCard` (icon + title + subtitle).

### 4.5 Mock data (`/src/data`)
Typed fixtures matching the Figma copy, e.g. `activities.ts` (Cine/teatro/museos, Ferias y
gastronomía, Paseos y salidas, Vida Saludable with real listings), `jobs.ts`, `letters.ts`
(public + private + comments), `clubs.ts` (Lectura, Manualidades, Cocina, Bienestar, Mascotas),
`arielScript.ts` (chat flow), `agenda.ts`, `faq.ts`, `discounts.ts`, `legal.ts`.

## 5. Screen inventory (by module)

> Full frame-by-frame notes captured during design live in the working notes; summarized here.

1. **Onboarding** — Splash (mapa BA, logo); identify choice ("Deseo identificarme" / "Sin
   identificarme"); Registro ("Completá tus datos": nombre, apellido, barrio, fecha, T&C);
   Intereses (Gastronomía/Idiomas/Jardinería/Manualidades chips); Foto flow (¿querés foto? →
   cargar → cargada, con progress 1-3/2-3/3-3 + mensaje de logro).
2. **Perfil** — datos + intereses editables, Guardar; bottom nav.
3. **Home** — "Hola, {nombre}" + barrio; feature cards (Empleo, Foro, Descuentos y sorteos,
   Actividades); agenda del día.
4. **Configuración** — Accesibilidad (Textos grandes, Contrastes toggles); Mi cuenta (links a
   legal/FAQ).
5. **Legal/Info** — Políticas de privacidad, Términos y condiciones, Objetivo de +Simple (texto).
6. **Ayuda** — Preguntas frecuentes (accordion) + contacto (147 / (011) 5050-1470).
7. **Chat IA (ARIEL)** — burbujas, quick-replies, input "Escribí acá"; scripted responses.
8. **Actividades** — categorías → listado por categoría → detalle → Reservar/¡Quiero ir! →
   Confirmación de inscripción.
9. **Descuentos y sorteos** — listado → detalle (¡Lo quiero!) → confirmación.
10. **Empleo** — menú (Oportunidades/Cargá experiencia/Capacitaciones); CV builder →
    CV preliminar (Guardar); Oportunidades laborales → Postular → "Ya te postulaste";
    Capacitaciones.
11. **Foro / Cartas** — tabs Cartas públicas | privadas | Amigos. Tutorial de carta (3 pasos);
    escribir carta pública → enviada; comentar carta pública (hilo de comentarios); carta privada
    (Para: {amigo}) compose/abrir/responder (texto o mensaje de voz) → enviada; Amigos =
    conversaciones.
12. **Clubes** — listado de clubes (Lectura, Manualidades, Cocina, Bienestar, Mascotas); board por
    club con posts + "Comentar en el club".

## 6. Build phases (incremental, each independently verifiable)

- **Phase 0 — Foundation:** Vite+TS+Tailwind scaffold, tokens, fonts, `PhoneFrame`, `AppShell`,
  `BottomNav`, `ScreenHeader`, routing skeleton, providers (User/Accessibility/Tts), UI primitives.
- **Phase 1 — Onboarding:** splash → identify → registro → intereses → foto flow; writes profile.
- **Phase 2 — Home / Perfil / Configuración:** dashboard, profile edit, accessibility toggles (wired).
- **Phase 3 — Actividades:** categorías → detalle → reserva → confirmación.
- **Phase 4 — Empleo:** menú, CV builder, oportunidades, postular, capacitaciones.
- **Phase 5 — Foro / Cartas:** públicas + comentarios, privadas compose/reply, Amigos.
- **Phase 6 — Clubes:** listado + boards + comentar.
- **Phase 7 — Chat IA (ARIEL):** scripted assistant.
- **Phase 8 — Legal / Ayuda / Descuentos + polish:** static docs, FAQ accordion, discounts, TTS pass,
  final visual polish.

## 7. Testing & verification

- Component tests (Vitest/RTL) for primitives and each key flow: registro persists profile;
  accessibility toggles change classes; activity reserve → confirmación; letter send updates state;
  club comment appends; ARIEL script advances on keyword.
- Manual/visual verification per phase against the Figma captures (browser-driven).
- Build must produce a static `dist/` that runs offline (no network requests at runtime).

## 8. Open assumptions

- Photos in the Figma (real people) are replaced with **local placeholder imagery / SVG avatars**
  to preserve the offline + no-external-assets constraint.
- Numbers/dates/copy are taken verbatim from the Figma where legible; minor gaps filled with
  plausible Spanish placeholder text consistent with the design.
- The "Mapa" bottom-nav tab has no dedicated Figma screen; it will show a simple placeholder
  ("Próximamente") rather than an interactive map (which would need external tiles).
