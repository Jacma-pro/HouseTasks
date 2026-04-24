# Handoff · HouseTasks Design System + 8 Screens

## Overview
HouseTasks is a mobile-first family task management app for 3 users (Marc, Belle-mère, Dorian). It solves last-minute scheduling conflicts by making tasks, assignments, dependencies and availability explicit in one shared surface.

This handoff contains the **complete design system** (tokens + components) plus **high-fidelity mockups for all 8 MVP screens**.

## About the Design Files
The files in `design-reference/` are **design references created in HTML/React** — they are prototypes showing intended look, layout, copy and interaction. **They are not production code.**

Your task is to **recreate these designs in the target codebase**: React 18 + Vite + TypeScript + TailwindCSS (as specified in the project brief). Use the Tailwind tokens and component snippets provided in `tailwind-tokens.md` as your canonical starting point — they are already written in idiomatic Tailwind and React/TSX. The HTML prototypes use inline styles because they are standalone; translate them to Tailwind classes using the token file.

## Fidelity
**High-fidelity (hifi).** All colors, typography, spacing, and interactions are final. Recreate pixel-perfectly. The only exceptions flagged as placeholders are: illustrations/imagery (none used), and OS-level chrome (iOS status bar is part of the `IOSDevice` frame, which you do not ship — it's just a preview wrapper).

---

## Design Tokens

All values are codified in `tailwind-tokens.md` (drop-in `tailwind.config.js`). Quick reference:

### Colors
- **Primary** (Forest — brand): `#2D6A4F` (500). Full 50–900 scale.
- **Accent** (Terracotta — urgent, CTA sec.): `#D97757` (500). Scale 50/100/300/500/700.
- **Neutral** (warm gray): `#FFFFFF` (0) → `#FAFAF8` → `#F3F3F0` → `#E6E6E1` → `#D1D1CA` → `#A8A89F` → `#78786F` → `#5A5A52` → `#3F3F39` → `#191917` (900).
- **Semantic**: success `#2D6A4F` · warning `#D4A017` · danger `#C2410C` · info `#2B6CB0`.

**Usage rule**: max 3 colors visible per screen (primary + accent + 1 neutral shade). All other neutral values provide depth, not color.

### Typography — Plus Jakarta Sans (400/500/600/700)
Load via Google Fonts. Mobile-first scale:

| Token  | px | line-height | letter-spacing | Use                          |
|--------|----|-------------|----------------|------------------------------|
| xs     | 12 | 1.5         | 0              | Meta, captions               |
| sm     | 14 | 1.45        | 0              | Body small, labels           |
| base   | 16 | 1.5         | 0              | Body                         |
| lg     | 18 | 1.45        | -0.01em        | Emphasized body              |
| xl     | 20 | 1.35        | -0.01em        | Card titles                  |
| 2xl    | 24 | 1.3         | -0.015em       | Section titles               |
| 3xl    | 28 | 1.25        | -0.02em        | Page titles                  |
| 4xl    | 34 | 1.15        | -0.025em       | Display                      |

### Spacing (4px base)
`0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80`

### Radii
`sm:6 · md:10 · lg:14 · xl:20 · 2xl:24 · full:9999`

### Elevation
- `xs` · `0 1px 2px rgba(25,25,23,0.04)`
- `sm` · `0 1px 3px rgba(25,25,23,0.06), 0 1px 2px rgba(25,25,23,0.04)`
- `md` · `0 4px 12px rgba(25,25,23,0.06), 0 2px 4px rgba(25,25,23,0.04)`
- `lg` · `0 12px 28px rgba(25,25,23,0.10), 0 4px 8px rgba(25,25,23,0.04)`
- `focus` · `0 0 0 3px rgba(45,106,79,0.25)` — **required on every interactive element**.

### Constraints (non-negotiable)
- Baseline width **375px** (iPhone mini).
- Touch targets **≥ 48 × 48 px** (`h-12` min on buttons, rows, toggles).
- WCAG AA contrast: don't use `neutral-400` as text on white (fails). Secondary text → `neutral-500` minimum.
- 1 font family. No emoji except in the one greeting string (`Bonjour Dorian 👋`).

---

## Components

Full TSX snippets are in `tailwind-tokens.md`. Build these as shared components in `src/components/ui/`:

| Component      | Variants / sizes                                  | Notes                                          |
|----------------|---------------------------------------------------|------------------------------------------------|
| `Button`       | primary/secondary/outline/ghost/danger · sm/md/lg | md = 48px touch target. Pill (`rounded-full`). |
| `IconButton`   | primary/secondary/ghost · 44px                    | Always needs `aria-label`.                     |
| `Input`        | with optional leading/trailing icons              | 48px height, `rounded-xl`.                     |
| `Textarea`     | —                                                 | minHeight 96px.                                |
| `Field`        | label + helper/error wrapper                      | Required indicator `*` in danger color.        |
| `Badge`        | neutral/primary/accent/success/warning/danger/info · sm/md | Optional dot.                         |
| `Priority`     | low / medium / high                               | Flag icon + label.                             |
| `Card`         | padding + border                                  | `rounded-2xl border border-neutral-200`.       |
| `Avatar`       | 28/36/44/64/96                                    | Initial-based, color hashed from name.         |
| `StatusDot`    | available/busy/away/offline                       | 10px dot, 2px white outline, bottom-right of avatar. |
| `Segmented`    | iOS-style control                                 | Filter tabs.                                   |
| `CategoryChip` | selected / unselected                             | Icon + label, 36px height.                     |
| `TaskRow`      | checkbox + title + meta + assignees              | **Core primitive**. See `ui.jsx`.              |
| `BottomNav`    | 5 tabs                                            | Safe-area-aware padding.                       |
| `AppHeader`    | large-title iOS-ish                               | Optional leading/trailing slots.               |
| `BottomSheet`  | 24px top radius, drag handle                      | Grab handle `36×5 rounded-full bg-neutral-300`. |

---

## Screens

Each screen is in `design-reference/screens.jsx` as a named export. Launch any of the `*-mobile.html` files in a browser to see it running.

### 1 · Login (`LoginScreen`)
**Purpose**: email/password auth + link to create family account.
**Layout**: vertical stack, 24px padding. Logo mark (40px green square + wordmark) → H1 "Content de te revoir." + subtitle → email field → password field (with eye toggle) → "Mot de passe oublié" link (right-aligned, primary-500) → primary CTA (full, lg) → divider ("ou") → outline CTA "Créer un compte famille".
**States**: empty, filled, error (border `danger`, `shadow` red at 15% alpha), loading (spinner in button).
**Validation**: email regex, password ≥ 8 chars. Surface errors via `<Field error="..."/>`.

### 2 · Dashboard (`DashboardScreen`)
**Purpose**: at-a-glance overview of what needs to happen today.
**Layout** (scrollable under sticky BottomNav):
1. `AppHeader` — greeting + date/stats subtitle + Bell IconButton.
2. **Stat strip** (3 cards, grid-cols-3, gap-2.5): "Pour moi" (primary-50 bg), "En retard" (danger tint bg), "Cette sem." (neutral-100 bg). Number 26px/700 + label.
3. **À faire aujourd'hui** — section title + "Tout voir" link, then `Card` containing 3 `TaskRow`s.
4. **La famille maintenant** — `Card` with one row per member (avatar+status dot, name, status text, task count).
5. **Smart nudge** — primary-50 card with sparkle icon, "Marc a besoin de toi", actions `[Accepter]` primary sm / `[Plus tard]` ghost sm.

### 3 · Tasks list (`TasksScreen`)
**Purpose**: full task index, filterable.
**Layout**: header ("Tâches") with Search + Filter IconButtons → `Segmented` [Toutes / Pour moi / Besoin d'aide] → sectioned cards (uppercase kicker "EN RETARD · 1", etc.) each containing `TaskRow`s → **FAB** bottom-right (56px, primary-500, `+` 26px, shadow green) sitting above the BottomNav.
**Sections**: En retard / Aujourd'hui / Cette semaine / Terminées (completed rows at 0.55 opacity + strikethrough).

### 4 · Task detail (`TaskDetailScreen`)
**Purpose**: read + act on a single task.
**Layout**: header with Back + Edit + More IconButtons (compact) → badge row (priority + category + "Besoin d'aide") → H1 title → description (neutral-700) → **meta card** (Calendar/User/Flag rows, 90px label col, right-aligned values) → **Assigné à** card (avatar + role + availability badge per person) → **actions** stack: primary "Marquer comme fait" (lg, full, CheckCircle icon) + secondary "Commencer (en cours)".

### 5 · Create task (`CreateTaskScreen`)
**Purpose**: new-task form as a bottom sheet over the tasks list (which stays visible, blurred).
**Layout**: `BottomSheet` max-height 85%. Top bar: `[Annuler]` left (primary-500, ghost text) — **"Nouvelle tâche"** center — `[Créer]` right (primary-500 bold). Scrollable body: Title (required) → Description textarea → **Catégorie** CategoryChip row → **Assigner à** (avatar chips, selected = primary-50 bg + primary-500 border + check) → Date + Heure side-by-side → **Priorité** Segmented [Basse/Moyenne/Haute].
**Behavior**: opening = slide up from bottom, 280ms ease-out. Backdrop `neutral-900/45`. Tapping backdrop or "Annuler" closes.

### 6 · Calendar (`CalendarScreen`)
**Purpose**: weekly availability + tasks overlaid, whole family at a glance.
**Layout**: header with week label + prev/next IconButtons → Segmented [Jour/Semaine/Moi] → legend row (4 color swatches) → **grid**: 8 columns (time col 36px + 7 days), rows = hours 8–22 at 28px each. Today's column is primary-500. Events = abs-positioned blocks with name + short label; "Tâche" events get a `1.5px solid primary-500` border. Bottom CTA: "Marquer indisponible" (primary, full, md, Plus icon).
**Data model** (per event): `{ dayIdx, startHour, endHour, personName, label, tone: 'busy'|'away'|'task' }`.

### 7 · Family (`FamilyScreen`)
**Purpose**: browse members and their current state.
**Layout**: header ("Famille · 3 membres") + Plus IconButton (primary variant, for invite) → search `Input` → one `Card` per member (avatar 56 + status dot 14, name + "Toi" badge if self, role · email, availability + task-count badges, chevron) → **dashed Card** at bottom with "Inviter un membre" + "Envoie un lien par email" + Plus circle.

### 8 · Profile (`ProfileScreen`)
**Purpose**: user settings + quick availability edit + logout.
**Layout**: header ("Profil") with Edit IconButton → **hero** (centered): avatar 96 + 18px status dot, name 22/700, email, badge row ("Disponible" + "Membre depuis avril") → **stats** 3-col (Terminées · En cours · Streak j.) → **Disponibilité** section (icon rows: "Mes créneaux récurrents · 3 blocs"; "Indisponibilité rapide · Définir") → **Préférences** section (Notifications toggle, Apparence · Système, Compte) → **logout** ghost button, danger color.

---

## Interactions & Behavior

### Global
- **Focus ring**: every focusable element gets `focus-visible:shadow-[0_0_0_3px_rgba(45,106,79,0.25)]` with `outline-none`.
- **Transitions**: buttons `transition-colors 120ms`. Bottom sheets `transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1)`.
- **Haptics** (iOS PWA): `navigator.vibrate(10)` on task complete toggle (if supported).
- **Safe areas**: `paddingBottom: 'max(18px, env(safe-area-inset-bottom))'` on BottomNav.

### Task flows
- **Toggle complete**: optimistic; PATCH `/api/tasks/:id/status`. On error, revert + toast.
- **Create**: POST on `[Créer]`. Close sheet on 2xx, prepend to "Aujourd'hui" section.
- **Nudge accept**: `[Accepter]` = add self as assignee via PATCH. `[Plus tard]` = dismiss in local state only.

### Loading / empty / error
- **Loading lists**: skeleton rows at neutral-100 bg, `animate-pulse`, same 60px height as real `TaskRow`.
- **Empty state**: centered illustration placeholder (64×64 neutral-100 circle + icon) + title + subtitle + primary CTA.
- **Error**: banner at top of section, danger tint bg, AlertTri icon, "Réessayer" inline ghost button.

### Responsive
Mobile-first — designs target 375–430px. Above 500px (tablet/desktop), **show a centered iPhone frame** (as the `*-mobile.html` previews do) OR let content reflow to a max-width container. App is fundamentally phone-shaped.

---

## State Management

Minimal. Suggested: React Query (or SWR) for server state + useState/useReducer for UI state.

**Server resources** (match brief §4.3):
- `currentUser` — `GET /api/auth/me`
- `tasks` — `GET /api/tasks` (params: `filter`, `assignee`, `status`)
- `task(id)` — `GET /api/tasks/:id`
- `family` — `GET /api/users`
- `availability(userId, week)` — `GET /api/availability/week/:userId`
- `dashboard` — `GET /api/dashboard` (aggregated)

**UI state**:
- Active bottom-nav tab (from URL / router).
- Task list filter (Segmented value).
- Create-task sheet open/closed + form draft.
- Toast queue.

---

## Assets

- **Icons**: All icons are inline SVGs from a Lucide-derived set in `design-reference/icons.jsx`. In your codebase, **use `lucide-react`** (same geometry, tree-shakable). Icon mapping is 1:1 by name.
- **Font**: Plus Jakarta Sans via Google Fonts (`@400;500;600;700`).
- **Images**: none. Avatars are initials-based, colored via `hashName()` → 5-palette cycle.
- **Illustrations**: none in v1.

---

## Files (in `design-reference/`)

| File                      | Purpose                                                     |
|---------------------------|-------------------------------------------------------------|
| `index.html`              | Master canvas (tokens + components + all 8 screens).        |
| `dashboard-mobile.html`   | Dashboard isolated, iPhone frame on desktop.                |
| `login-mobile.html`       | Login isolated.                                             |
| `tasks-mobile.html`       | Tasks list isolated.                                        |
| `task-detail-mobile.html` | Task detail isolated.                                       |
| `create-task-mobile.html` | Create-task modal over tasks list.                          |
| `calendar-mobile.html`    | Calendar isolated.                                          |
| `family-mobile.html`      | Family list isolated.                                       |
| `profile-mobile.html`     | Profile isolated.                                           |
| `tokens.jsx`              | Design tokens (JS object). Mirrors `tailwind-tokens.md`.    |
| `icons.jsx`               | Inline SVG icon set.                                        |
| `ui.jsx`                  | Component implementations (reference behavior).             |
| `screens.jsx`             | All 8 screen implementations.                               |
| `tokens-doc.jsx`          | Token showcase artboards (swatches, type scale).            |
| `ios-frame.jsx`           | Preview-only iOS bezel — **not shipped**.                   |
| `design-canvas.jsx`       | Preview-only canvas host — **not shipped**.                 |

## Primary dev artifact

**`tailwind-tokens.md`** (at handoff root) contains:
- Full `tailwind.config.js` drop-in.
- `index.css` base layer.
- TSX component snippets (`Button`, `Input`, `Field`, `Badge`, `Card`, `BottomNav`, `BottomSheet`, `TaskCheckbox`) — paste into `src/components/ui/`.
- Usage rules (color limits, contrast, touch targets, safe areas).

Start there.
