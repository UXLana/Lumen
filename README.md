# Lumen Design System

A React + TypeScript design system with design tokens, themeable components, and a multi-theme provider. Built with Next.js.

## Quick Start

```bash
git clone https://github.com/UXLana/Lumen.git
cd Lumen
npm install
npm run dev
```

Open [http://localhost:3344](http://localhost:3344) to view the documentation site.

## What's Inside

### Components (42+)

Accordion, AssistiveMessage, Avatar, Badge, Banner, BrandBanner, Button, ChatPanel, Checkbox, Chip, CollectionToolbar, Combobox, ConfirmDialog, DataTable, DetailField, Divider, EmptyState, FullScreenModal, Header, Icons, ImageCarousel, Input, LeftNav, Link, ListItem, MarketplaceCard, Pagination, ProductCard, ProgressBar, Radio, SegmentedControl, Select, Sidebar, Skeleton, StatsCard, Stepper, Switch, Tab, Textarea, Toast, Upload

### Design Tokens

All tokens are in `styles/design-tokens.ts`:

- **Colors** — Brand, semantic, text, surface, border (CSS-variable-backed, themeable)
- **Typography** — DM Sans (display, heading, body, label) + JetBrains Mono (code)
- **Spacing** — 4px-based scale with semantic aliases
- **Border Radius** — Scale from none to full
- **Shadows** — Elevation levels for depth
- **Breakpoints** — Responsive breakpoints
- **Z-Index** — Layer management

### Themes

The system supports multiple product themes via `SwitchableThemeProvider`:

- **Lumen** / **Lumen Dark** — Default
- **Spring**, **Fall**, **Foliage** / **Foliage Dark**
- **Pampas**, **Rainy Night**

## Usage in Your Project

### Import Components

```tsx
import { Button, Input, DataTable } from '@lumen/design-system/components'
```

### Import Tokens

```tsx
import { colors, spacing, typography, borderRadius, shadows } from '@lumen/design-system/styles/design-tokens'
```

### Import Themes

```tsx
import { SwitchableThemeProvider, useColors, useTheme } from '@lumen/design-system/styles/themes'
```

## Project Structure

```
├── app/                    # Next.js pages and component documentation
│   ├── design-system/      # Token documentation
│   └── components/         # Component spec pages
├── components/             # React components
│   ├── index.ts            # All component exports
│   └── {Name}/             # One folder per component
│       ├── {Name}.tsx      # Component implementation
│       └── index.ts        # Component exports
├── styles/
│   ├── design-tokens.ts    # All design tokens
│   └── themes/             # Product themes + provider
├── hooks/                  # Shared hooks (useMediaQuery, etc.)
└── public/                 # Static assets
```

## For Claude Code Users

This repo includes a `CLAUDE.md` file that teaches Claude Code how to use the design system correctly — components, tokens, layout patterns, and accessibility requirements. Clone the repo and start building.

## License

See [LICENSE](./LICENSE).
