---
name: icon-generator
description: Create SVG icons for the MTR Design System with consistent, accessible conventions
---

# Icon Generator

## When to Use

- Creating navigation icons for design system sidebar
- Adding icons for new components
- Creating UI icons (arrows, actions, status indicators)
- Building custom icons for specific features

## File Ownership

| File Path | Purpose |
|-----------|---------|
| `/components/Icons/Icons.tsx` | Main icon components file |
| `/components/Icons/index.ts` | Icon exports |
| `/public/icons/[icon-name].svg` | Downloadable SVG file |

---

# Icon Design Principles

## 1. Grid System

All icons are designed on a **24x24 pixel grid** with specific zones:

```
┌──────────────────────────┐
│  2px padding (safe zone) │
│  ┌──────────────────┐    │
│  │                  │    │
│  │   20x20 active   │    │
│  │      area        │    │
│  │                  │    │
│  └──────────────────┘    │
│                          │
└──────────────────────────┘
```

| Zone | Pixels | Purpose |
|------|--------|---------|
| **Canvas** | 24x24 | Total icon boundary |
| **Safe zone** | 2px padding | Prevents clipping, ensures breathing room |
| **Active area** | 20x20 | Primary drawing area for icon content |
| **Optical center** | 12,12 | Visual balance point (not always geometric center) |

## 2. Stroke Specifications

| Property | Value | Notes |
|----------|-------|-------|
| **Stroke width** | 1.5px | Default for all outline icons |
| **Stroke linecap** | `round` | Rounded line endings |
| **Stroke linejoin** | `round` | Rounded corner joins |
| **Stroke color** | `currentColor` | Inherits from parent text color |

### When to Use Different Stroke Weights

| Weight | Value | Use Case |
|--------|-------|----------|
| Light | 1px | Delicate details, secondary elements |
| Default | 1.5px | Primary strokes, main icon shapes |
| Bold | 2px | Emphasis, active states, filled variants |

## 3. Visual Weight & Optical Balance

### Optical Adjustments
- **Circles** appear smaller than squares at the same size — extend circles 0.5-1px beyond the grid
- **Pointed shapes** (triangles, arrows) need to extend slightly past the boundary to appear aligned
- **Horizontal lines** appear thinner than vertical lines — can be 0.25px thicker if needed
- **Center alignment** should be optical, not mathematical — trust your eyes

### Consistent Visual Weight
- All icons in a set should have similar "visual density"
- A simple icon (like minus) shouldn't look lighter than a complex icon (like settings)
- Add detail thoughtfully — every element should serve a purpose

## 4. Shape & Form Guidelines

### Corner Radius
| Element | Radius | Example |
|---------|--------|---------|
| **Sharp corners** | 0px | Arrows, chevrons, precise indicators |
| **Soft corners** | 1-2px | Rectangles, documents, cards |
| **Rounded corners** | 2-3px | Buttons, containers, friendly shapes |
| **Fully rounded** | 50% | Circles, dots, pills |

### Gaps & Spacing
- **Minimum gap**: 1.5px between elements (matches stroke width)
- **Preferred gap**: 2px for clear visual separation
- **Overlapping elements**: Use 0.5px overlap for connected shapes

### Alignment
- Align to whole pixels when possible (avoid 0.5px positions for main shapes)
- Center icons optically within the 24x24 canvas
- Directional icons (arrows) can be offset slightly in their direction of motion

## 5. Icon Styles

### Outline (Primary Style)
- 1.5px stroke, no fill
- Use for most UI icons
- Clean, modern, lightweight appearance

```svg
<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      stroke="currentColor" stroke-width="1.5" fill="none"/>
```

### Filled
- Solid fill with `currentColor`
- Use for active/selected states
- Higher visual weight for emphasis

```svg
<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      fill="currentColor"/>
```

### Duotone (Two-tone)
- Combine stroke and partial fill
- Fill uses `fill-opacity="0.2"` or `0.3`
- Creates depth without heaviness

```svg
<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
<path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" fill-opacity="0.3"/>
```

---

# Icon Design Rules

## Do's ✓

1. **Keep it simple** — Use the minimum elements needed to convey meaning
2. **Be consistent** — Match the style of existing icons in the set
3. **Use meaningful metaphors** — Icons should be recognizable and intuitive
4. **Test at small sizes** — Icons must be legible at 16px
5. **Maintain optical balance** — Icons should feel centered and stable
6. **Use the grid** — Align to the 24x24 grid and respect the safe zone
7. **Design for context** — Consider where the icon will be used

## Don'ts ✗

1. **Don't add unnecessary detail** — Avoid decorative elements that don't aid recognition
2. **Don't use text in icons** — Text doesn't scale well and has i18n issues
3. **Don't mix styles** — Don't combine outline and filled in the same icon (except duotone)
4. **Don't break the grid** — Stay within the 24x24 canvas
5. **Don't use absolute colors** — Always use `currentColor` for theming
6. **Don't make icons too thin** — Minimum stroke width is 1px
7. **Don't center mathematically** — Use optical centering instead

---

# Metaphor Guidelines

## Common Icon Metaphors

| Concept | Metaphor | Notes |
|---------|----------|-------|
| **Home** | House silhouette | Universally understood |
| **Settings** | Gear/cog | Technical configuration |
| **User** | Person silhouette | Head + shoulders |
| **Search** | Magnifying glass | Circle + handle |
| **Add** | Plus sign | Cross shape |
| **Delete** | Trash can | Not X (X means close) |
| **Close** | X mark | For dismissing dialogs/modals |
| **Edit** | Pencil | Writing implement |
| **Save** | Floppy disk | Legacy but understood |
| **Download** | Arrow pointing down + line | Into a surface |
| **Upload** | Arrow pointing up + line | Out of a surface |
| **Share** | Connected nodes | Or arrow leaving box |
| **Favorite** | Heart or star | Heart = love, Star = bookmark |
| **Warning** | Triangle + exclamation | Caution signal |
| **Error** | Circle + X | Negative/stop |
| **Success** | Circle + checkmark | Positive/complete |
| **Info** | Circle + i | Information |
| **Lock** | Padlock | Security/private |
| **Visible** | Eye | Show/reveal |
| **Hidden** | Eye with slash | Hide/conceal |

## Direction & Motion

| Direction | Indicates |
|-----------|-----------|
| **→ Right** | Forward, next, proceed, expand |
| **← Left** | Back, previous, return, collapse |
| **↑ Up** | Increase, upload, improve, earlier |
| **↓ Down** | Decrease, download, demote, later |
| **↻ Clockwise** | Refresh, reload, sync |
| **↺ Counter-clockwise** | Undo, revert |

---

# Technical Specifications

## SVG Structure

```svg
<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <!-- Icon paths here -->
</svg>
```

## Required Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `width` | `24` | Default display size |
| `height` | `24` | Default display size |
| `viewBox` | `0 0 24 24` | Coordinate system |
| `fill` | `none` | Default no fill (outline style) |
| `xmlns` | `http://www.w3.org/2000/svg` | SVG namespace |

## Path Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `stroke` | `currentColor` | Inherits text color |
| `stroke-width` | `1.5` | Default stroke weight |
| `stroke-linecap` | `round` | Rounded line ends |
| `stroke-linejoin` | `round` | Rounded corners |
| `fill` | `none` or `currentColor` | Shape fill |

---

# React Component Template

```tsx
// Add to /components/Icons/Icons.tsx

export const IconName: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    {/* SVG paths here */}
    <path d="..." />
  </BaseIcon>
)
IconName.displayName = 'IconName'
```

The `BaseIcon` wrapper in `Icons.tsx` handles:
- Size prop (xs, sm, md, lg, xl, 2xl, or custom number)
- Stroke width prop
- Accessibility (aria-label, aria-hidden)
- Common SVG attributes

---

# Icon Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| **Navigation** | Wayfinding, direction | Home, Menu, Arrows, Chevrons |
| **Actions** | User interactions | Edit, Delete, Copy, Save |
| **Status** | Feedback, states | Check, Warning, Error, Loader |
| **Objects** | Things, entities | File, Folder, User, Calendar |
| **Visibility** | Show/hide, security | Eye, Lock, Unlock |
| **Media** | Audio, video controls | Play, Pause, Volume |
| **UI** | Interface elements | Filter, Sort, Grid, List |
| **Social** | Engagement | Star, Heart, Thumbs |
| **Communication** | Messaging | Mail, Bell, Chat |

---

# Workflow: After Creating an Icon

1. **Add to Icons.tsx** — Add the component to `/components/Icons/Icons.tsx`
2. **Export** — Ensure it's exported from the Icons module
3. **Create SVG file** — Save standalone SVG to `/public/icons/[icon-name].svg`
4. **Update design system** — Call `design-system-builder` to add to icons page
5. **Add to navigation** — If used in sidebar, add to `iconMap` in `shared.tsx`

---

# Quality Checklist

Before finalizing an icon, verify:

- [ ] **Grid**: Fits within 24x24, content in 20x20 active area
- [ ] **Stroke**: 1.5px weight, round caps and joins
- [ ] **Color**: Uses `currentColor` only
- [ ] **Balance**: Optically centered and visually stable
- [ ] **Simplicity**: No unnecessary details
- [ ] **Consistency**: Matches existing icon style
- [ ] **Scalability**: Legible at 16px (sm size)
- [ ] **Metaphor**: Meaning is clear and intuitive

---

## User Input Required

$ARGUMENTS

---

Please describe the icon you need:
- Icon name and purpose
- Visual concept (what should it represent)
- Where it will be used (navigation, component, etc.)
