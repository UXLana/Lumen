# Canopy Registry: Consuming the MTR Design System

## What this is

canopy-registry is a Vite + React + Tailwind prototype. It should consume the MTR Design System as an npm package to get themed colors, components, and tokens -- not hardcode Tailwind color utilities.

## Step 1: Install the design system

```bash
npm install mtr-design-system
```

(If not yet published to npm, use a git dependency for now:)
```bash
npm install github:your-org/mtr-design-system
```

This gives you access to:
- **Theme provider** (`useColors`, `useTheme`, `useThemeSwitcher`)
- **Components** (Button, Badge, Header, Input, etc.)
- **Shared tokens** (fontFamilies, fontWeights, shadows, borderRadius, zIndex)

---

## Step 2: Wrap the app in the theme provider

In your main App.tsx or providers file:

```tsx
import { SwitchableThemeProvider } from 'mtr-design-system/styles/themes'

function App() {
  return (
    <SwitchableThemeProvider>
      <RouterOrLayout />
    </SwitchableThemeProvider>
  )
}
```

---

## Step 3: Replace Tailwind color classes with useColors()

In every component that uses color, add the hook:

```tsx
import { useColors } from 'mtr-design-system/styles/themes'

function MyComponent() {
  const colors = useColors()

  return (
    <div
      className="flex items-center gap-4 p-6 rounded-lg"
      style={{
        backgroundColor: colors.surface.light,
        borderColor: colors.border.lowEmphasis.onLight,
      }}
    >
      <h2
        className="text-lg font-semibold"
        style={{ color: colors.text.highEmphasis.onLight }}
      >
        Title
      </h2>
    </div>
  )
}
```

**Keep Tailwind for:** layout (flex, grid, gap), spacing (p-4, m-2), sizing (w-full, h-12), rounded corners, font sizes, responsive breakpoints.

**Replace with useColors() for:** ALL color values -- backgrounds, text colors, borders, status indicators, brand colors.

---

## Step 4: Use design system components instead of custom ones

Instead of building your own buttons, badges, inputs, etc., import them:

```tsx
import { Button, Badge, Header, Input } from 'mtr-design-system/components'
```

These components already use `useColors()` internally, so they theme automatically.

---

## Tailwind-to-token mapping

When you find a Tailwind color class, replace it like this:

**Brand:**
- `bg-teal-700` / `bg-brand-500` → `colors.brand.default`
- `bg-teal-800` → `colors.brand.darker`
- `bg-teal-500` → `colors.brand.lighter`

**Surfaces:**
- `bg-white` → `colors.surface.light`
- `bg-gray-50` / `bg-gray-100` → `colors.surface.lightDarker`
- `bg-gray-700` → `colors.surface.dark`
- `bg-gray-800` / `bg-gray-900` → `colors.surface.darkDarker`

**Text:**
- `text-gray-900` → `colors.text.highEmphasis.onLight`
- `text-white` → `colors.text.highEmphasis.onDark`
- `text-gray-500` / `text-gray-600` → `colors.text.lowEmphasis.onLight`
- `text-blue-600` → `colors.text.action.enabled`

**Borders:**
- `border-gray-200` → `colors.border.lowEmphasis.onLight`
- `border-gray-300` → `colors.border.midEmphasis.onLight`

**Status:**
- `text-red-600` / `bg-red-600` → `colors.status.important`
- `bg-red-50` → `colors.surface.important`
- `text-green-600` → `colors.status.success`
- `bg-green-50` → `colors.surface.success`
- `text-yellow-600` → `colors.status.warning`
- `bg-yellow-50` → `colors.surface.warning`

**Actions (buttons):**
- `bg-blue-600` → `colors.action.enabled`
- `hover:bg-blue-700` → `colors.action.hover`

---

## Shared tokens (not themed, import directly)

```tsx
import {
  fontFamilies,  // { display, body, mono }
  fontWeights,   // { regular, medium, semibold, bold }
  shadows,       // elevation levels
  borderRadius,  // shape tokens
  zIndex,        // layering
} from 'mtr-design-system/styles/design-tokens'
```

---

## Full useColors() shape reference

```
colors.brand.default / .darker / .lighter

colors.surface.light / .lightDarker / .dark / .darkDarker
colors.surface.disabled.onLight / .onDark
colors.surface.info / .success / .warning / .important

colors.text.highEmphasis.onLight / .onDark
colors.text.lowEmphasis.onLight / .onDark
colors.text.disabled.onLight / .onDark
colors.text.action.enabled / .hover / .active
colors.text.success / .warning / .important

colors.border.lowEmphasis.onLight / .onDark
colors.border.midEmphasis.onLight / .onDark
colors.border.highEmphasis.onLight / .onDark

colors.icon.enabled.onLight / .onDark
colors.action.enabled / .hover / .active
colors.action.important.enabled / .hover / .active
colors.status.info / .success / .warning / .important
colors.badge.info / .success / .warning / .important / etc.
colors.scrim
colors.hover.onLight / .onDark
colors.focusBorder.onLight / .onDark
```
