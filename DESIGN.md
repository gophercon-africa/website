# DESIGN.md — GopherCon Africa

The standing style guide for all marketing UI, distilled from
[impeccable.style](https://impeccable.style/). Read this before touching any
page under `src/app` that isn't `/admin` or `/reviews`. When a change conflicts
with this file, this file wins.

## Principles

1. **Strip to essence.** Every section earns its place. Fewer, stronger blocks
   beat many decorated ones. Remove before you add.
2. **Sober palette.** Brand green + neutrals + exactly one tint
   (`brand-tint`). Color is for meaning, not decoration.
3. **Type does the work.** Hierarchy comes from size/weight/spacing, not from
   boxes, gradients, or icons.
4. **Motion is feedback only.** Hover/focus transitions are fine. Entrance
   animations, typewriters, pulsing dots, floating layers are not.
5. **Specific over generic.** Headlines say something concrete. CTAs name the
   action ("Get Tickets", "View Schedule") — never "Learn more".

## Tokens (`src/styles/globals.css`)

**Brand greens are immutable identity — never change these values:**

| Token | Value | Use |
|---|---|---|
| `brand` | `#006b3f` | Accent, primary buttons, links, active states |
| `brand-dark` | `#00552f` | Hover shade |
| `brand-light` | `#008751` | Sparingly, decorative |
| `brand-bright` | `#00a86b` | Sparingly, decorative |
| `brand-tint` | `#e9f5ef` | The ONE tinted background (badges, avatar placeholders, soft callouts) |

**Semantic neutrals** (use these, not raw `gray-*`, on marketing UI):
`ink` (headings) · `body` (paragraphs) · `muted` (secondary) · `faint`
(tertiary/icons) · `line` (borders) · `surface` (white) · `surface-sunken`
(alternate band, `gray-50`).

**Radii — two steps only:** `rounded-control` (8px: buttons, inputs, badges,
tabs, pills) and `rounded-surface` (16px: cards, panels, modals).
`rounded-full` is allowed **only** for circular avatars.

**Spacing rhythm:** sections `py-16 sm:py-24`; heading→content gap `mt-10`;
card padding `p-6` (`p-8` max for feature cards — never `p-12`).

**Type scale:** display `text-4xl sm:text-5xl font-bold tracking-tight`;
section title `text-3xl sm:text-4xl font-bold tracking-tight`; card title
`text-lg font-semibold`; body `text-base text-body`; meta `text-sm text-muted`;
overline `text-xs font-semibold uppercase tracking-wide` (plain text, never a
chip). Font is Plus Jakarta Sans via `next/font` (`layout.tsx`).

## Primitives (`src/components/ui/`) — always use, never ad-hoc

| Component | API | Notes |
|---|---|---|
| `Container` | `size: 'default'\|'narrow'` | `max-w-6xl` / `max-w-3xl`. The only content widths. |
| `Section` | `tone: 'default'\|'sunken'`, `id` | Alternate tones instead of gradient washes. |
| `SectionHeading` | `overline?, title, description?, align` | Overline is plain uppercase text. |
| `Button` | `variant: 'primary'\|'secondary'\|'ghost'`, `size`, `href?/external?` | Renders Link/a/button. The only button. |
| `Badge` | `tone: 'brand'\|'neutral'\|'outline'` | Three tones. Need a 4th color? Use fewer badges. |
| `Card` | `interactive?` | 16px radius, `border-line`. Cards never nest. |

## Forbidden (impeccable slop detectors)

- Nested cards (cards inside cards)
- Status-chip soup (multi-color badge rainbows; >1 badge per row)
- Vague headlines, generic CTAs ("Learn more", "Discover")
- Italic-serif display type; italic titles anywhere
- Purple/multi-hue gradient washes; glassmorphism / `backdrop-blur` panels
- Over-rounding (`rounded-3xl`, `rounded-full` on non-avatars)
- Ghost cards (borders around nothing), icon-tile stacks (colored squares with icons)
- Pulsing dots, entrance animations, typewriter effects, floating/rotated layers
- Eyebrow chips in heroes; emoji as UI

## Hard constraints (break these and you break the app)

- **Dark mode is internal-only** (`/admin`, `/reviews`). No `dark:` variants on
  marketing UI. `Header`/`Modal` route-gate their dark styles — keep that.
- **Middleware allowlist** (`src/middleware.ts`): every new public route needs a
  `publicExact`/`publicPrefixes` entry (exact-match — subroutes need their own).
- **Never hardcode the header height** — the review-workspace body-lock
  (`globals.css`) depends on it staying unknown.
- **Dep changes commit both** `package-lock.json` and `yarn.lock`.
- Cloudflare Workers deploy needs `output: 'standalone'` +
  `images.unoptimized: true` in `next.config.mjs`.
- Copy facts (dates, venue, ticket URL, contact) come from `src/lib/event.ts`
  and `src/lib/links.ts` — never inline them.

Optional: install the full Impeccable toolkit with
`/plugin marketplace add pbakaus/impeccable`.
