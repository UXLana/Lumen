# MTR Design System

The official component library and design token system for Metrc products. Built with React, TypeScript, and Next.js.

## Quick Start

```bash
git clone https://github.com/MetrcID/vercel.ux.git
cd vercel.ux
npm install
npm run dev
```

Open [http://localhost:3333](http://localhost:3333) to view the documentation site.

## What's Inside

### Components (42+)

Accordion, AssistiveMessage, Avatar, Badge, Banner, BrandBanner, Button, ChatPanel, Checkbox, Chip, CollectionToolbar, Combobox, ComplianceBanner, ConfirmDialog, DataTable, DetailField, Divider, EmptyState, FullScreenModal, Header, Icons, ImageCarousel, Input, LeftNav, Link, ListItem, MarketplaceCard, Pagination, ProductCard, ProgressBar, Radio, SegmentedControl, Select, Sidebar, Skeleton, StatsCard, Stepper, Switch, Tab, Textarea, Toast, Upload

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

- **Trace** (default) — Core Metrc regulatory platform
- **University** — Training and education
- **Earth** — Environmental/sustainability
- **RID** — Retail ID (light + dark)

## Usage in Your Project

### Import Components

```tsx
import { Button, Input, DataTable } from 'mtr-design-system/components'
```

### Import Tokens

```tsx
import { colors, spacing, typography, borderRadius, shadows } from 'mtr-design-system/styles/design-tokens'
```

### Import Themes

```tsx
import { SwitchableThemeProvider, useColors, useTheme } from 'mtr-design-system/styles/themes'
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

Copyright (c) 2026 Metrc LLC. All rights reserved. See [LICENSE](./LICENSE).
