# Changelog

All notable changes to the MTR Design System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Components
- **Button** - Primary action component with high/mid/low emphasis variants
- **Avatar** - User/entity representation with size variants and fallback support
- **Tab / TabGroup** - Navigation tabs with active/inactive states, light and dark modes
- **Banner** - Notification component with info, success, warning, error variants
- **SegmentedControl** - Tab-style selection control for switching views
- **Badge** - Status indicator with filled/outlined/subtle variants and semantic colors
- **MarketplaceCard** - App store card with three variants (default, compact, horizontal)
  - Displays app info, rating, status badges, and verification
  - Supports installed/uninstalled/update-available states
  - Composed from Avatar, Badge, and Icon primitives
- **Icons** - Library of 30+ SVG icons with consistent styling
  - Navigation: Home, Menu, ChevronLeft/Right/Down/Up, ArrowLeft/Right, ExternalLink
  - Actions: Search, Plus, Edit, Trash, Download, Upload, Copy, Share, Settings
  - Status: Check, X, AlertCircle, Info, Bell, BellOff, Eye, EyeOff
  - Objects: User, Mail, Calendar, File, Folder, Image
  - Media: Play, Pause
  - UI: Cart, Apps, Maximize, Minimize, MoreHorizontal, MoreVertical, Filter, RefreshCw, LogOut

#### Design Tokens
- Colors (brand, neutral, semantic, text, background, border)
- Typography (font families, sizes, weights, line heights)
- Spacing scale (4px base unit)
- Border radius (none, sm, md, lg, xl, full)
- Shadows (sm, md, lg, xl)
- Transitions and z-index scale

#### Documentation
- Design system pages: Colors, Typography, Spacing, Shadows, Radius, Breakpoints
- Component pages: Button, Avatar, Tab, Banner, SegmentedControl, Badge, MarketplaceCard
- Icons gallery with search and copy-to-clipboard

#### Skills (Claude Code)
- **component-generator** - Create components using atomic design principles
- **icon-generator** - Generate SVG icons with design system integration
- **design-system-builder** - Manage shell/UI and documentation pages

### Infrastructure
- Next.js 14 with App Router
- TypeScript strict mode
- Vercel deployment at mtr-design-system.vercel.app
