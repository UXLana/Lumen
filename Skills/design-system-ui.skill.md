# Design System UI Skill

## Overview

**Name:** design-system-ui  
**Trigger:** `/design-system-ui` or when improving visual design, fixing layouts, enhancing interactions, or polishing the design system documentation app

**Description:** Improve the visual design, interactions, and UX of the MTR Design System documentation app. Use this skill when polishing the UI, fixing layout issues, improving responsiveness, or enhancing micro-interactions. This skill focuses on the app's presentation layer, not adding new documented components.

---

## File Ownership

This skill owns and maintains styling/layout concerns in:

| File Path | Styling Concerns |
|-----------|------------------|
| `/app/design-system/shared.tsx` | Layout components, navigation styles, shared UI patterns |
| `/app/design-system/page.tsx` | Landing page layout, card grid, visual hierarchy |
| `/app/design-system/[token]/page.tsx` | Token page layouts, swatch displays, table styling |
| `/app/components/[component]/page.tsx` | Component doc layouts, playground styling |
| `/styles/*.css` | Global styles, CSS custom properties |
| Any Tailwind config related to design system app | Theme extensions, custom utilities |

**This skill modifies HOW things look, not WHAT is documented.**

---

## Scope Definition

### ✓ What This Skill Handles

| Category | Examples |
|----------|----------|
| **Navigation** | Sidebar design, collapse/expand behavior, active states, mobile drawer |
| **Layouts** | Page structure, grid systems, responsive breakpoints, content flow |
| **Visual Hierarchy** | Typography scale, spacing rhythm, color usage, visual weight |
| **Interactions** | Hover states, focus rings, transitions, micro-animations |
| **Cards & Containers** | Preview cards, code blocks, spec tables, section dividers |
| **Headers & Banners** | Page titles, breadcrumbs, status badges |
| **Accessibility** | Focus states, contrast ratios, reduced motion, screen reader hints |
| **Responsiveness** | Mobile layouts, tablet breakpoints, fluid typography |
| **Polish** | Shadows, borders, rounded corners, visual consistency |

### ✗ What This Skill Does NOT Handle

| Task | Correct Skill |
|------|---------------|
| Adding new documented components | `/design-system-builder` |
| Creating navigation or UI icons | `/icon-generator` |
| Building reusable UI components | `/component-generator` |
| Updating design token values | `/brand-tokens-translator` |
| Content writing or documentation text | Manual or `/design-system-builder` |

---

## Skill Orchestration

### CRITICAL: Design Before Implementation

**Always invoke `/frontend-design` before making UI/UX changes.** This ensures:
- Thoughtful consideration of alternatives
- Alignment with UX best practices
- Accessibility is considered upfront
- Consistent design decisions

### Workflow Pattern

```
1. User requests UI improvement
   ↓
2. Invoke /frontend-design for analysis and recommendations
   ↓
3. Review design guidance
   ↓
4. Implement changes using design tokens
   ↓
5. Verify accessibility and responsiveness
   ↓
6. Test interactions and transitions
```

### When to Invoke `/frontend-design`

**Always invoke for:**
- Layout restructuring
- Navigation pattern changes
- New interaction patterns
- Visual hierarchy adjustments
- Responsive behavior changes
- Any change affecting multiple pages

**May skip for:**
- Single property tweaks (padding adjustment)
- Bug fixes with obvious solutions
- Direct implementation of user-specified values

---

## Design Token Usage

### CRITICAL: Never Hardcode Values

All visual properties must use design tokens:

```tsx
// ✗ WRONG - Hardcoded values
<div className="bg-[#10B981] p-[24px] rounded-[8px]">

// ✓ CORRECT - Design tokens
<div className="bg-primary-500 p-6 rounded-lg">
```

### Token Imports

```tsx
import {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  breakpoints,
  transitionPresets,
} from '@/styles/design-tokens';
```

### Token Categories Reference

| Category | Usage | Example Tokens |
|----------|-------|----------------|
| `colors` | All color values | `colors.primary[500]`, `colors.neutral[100]` |
| `typography` | Font sizes, weights, line heights | `typography.fontSize.lg`, `typography.fontWeight.semibold` |
| `spacing` | Margins, padding, gaps | `spacing[4]`, `spacing[8]` |
| `radius` | Border radius values | `radius.md`, `radius.lg`, `radius.full` |
| `shadows` | Box shadows | `shadows.sm`, `shadows.md`, `shadows.lg` |
| `breakpoints` | Responsive breakpoints | `breakpoints.sm`, `breakpoints.md`, `breakpoints.lg` |
| `transitionPresets` | Animation timing | `transitionPresets.default`, `transitionPresets.fast` |

---

## Core UI Patterns

### Sidebar Navigation

```tsx
// Current pattern in shared.tsx
const SidebarNav = () => {
  return (
    <nav className="w-64 border-r border-neutral-200 bg-white">
      <div className="p-4 border-b border-neutral-200">
        {/* Logo/Title */}
      </div>
      <div className="py-4">
        {navSections.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
};
```

**Key styling concerns:**
- Active state indication (background, left border accent)
- Hover transitions (smooth, not jarring)
- Focus states (visible, accessible)
- Icon + label alignment
- Section header typography
- Collapse/expand animation (if applicable)

### NavItem States

```tsx
const NavItem = ({ label, href, icon, isActive }) => {
  return (
    <Link
      href={href}
      className={cn(
        // Base styles
        "flex items-center gap-3 px-4 py-2 text-sm transition-colors",
        // Default state
        "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50",
        // Active state
        isActive && "text-primary-600 bg-primary-50 border-l-2 border-primary-500",
        // Focus state
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
      )}
    >
      {icon && <span className="w-5 h-5 text-current">{iconMap[icon]()}</span>}
      <span>{label}</span>
    </Link>
  );
};
```

### Card Grid Pattern

```tsx
// Landing page cards
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        "group block p-6 rounded-xl border border-neutral-200 bg-white",
        "hover:border-primary-300 hover:shadow-md",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
          {iconMap[item.icon]()}
        </div>
        <div>
          <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            {item.description}
          </p>
        </div>
      </div>
    </Link>
  ))}
</div>
```

### Page Header Pattern

```tsx
<header className="mb-8">
  <h1 className="text-3xl font-semibold text-neutral-900">
    {title}
  </h1>
  <p className="mt-2 text-lg text-neutral-600 max-w-2xl">
    {description}
  </p>
</header>
```

### Section Pattern

```tsx
<section className="space-y-4">
  <h2 className="text-xl font-medium text-neutral-900">
    {sectionTitle}
  </h2>
  <div className="prose prose-neutral max-w-none">
    {content}
  </div>
</section>
```

---

## Interaction Standards

### Transitions

Always use consistent transition timing:

```tsx
// Standard transitions
const transitions = {
  fast: "transition-all duration-150 ease-out",      // Hovers, small UI
  default: "transition-all duration-200 ease-out",  // Most interactions
  slow: "transition-all duration-300 ease-out",     // Layout changes
  spring: "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]", // Playful
};
```

### Hover States

```tsx
// Buttons/Links
"hover:bg-primary-600 hover:text-white"

// Cards
"hover:shadow-md hover:border-primary-300"

// Icons
"hover:text-primary-600"

// Subtle backgrounds
"hover:bg-neutral-50"
```

### Focus States

**CRITICAL: All interactive elements must have visible focus states**

```tsx
// Standard focus ring
"focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"

// Inset focus (for items with backgrounds)
"focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"

// Dark backgrounds
"focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-600"
```

### Active/Pressed States

```tsx
"active:scale-[0.98] active:bg-primary-700"
```

---

## Responsive Patterns

### Breakpoint Strategy

```tsx
// Mobile-first approach
// Base: mobile (< 640px)
// sm: tablet portrait (≥ 640px)
// md: tablet landscape (≥ 768px)
// lg: desktop (≥ 1024px)
// xl: large desktop (≥ 1280px)
```

### Sidebar Responsive Behavior

```tsx
// Mobile: Hidden by default, slide-in drawer
// md+: Visible, collapsible to icons only
// lg+: Fully expanded

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <>
      {/* Mobile overlay */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(true)}>Menu</button>
        {isOpen && <MobileDrawer onClose={() => setIsOpen(false)} />}
      </div>
      
      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col border-r border-neutral-200 bg-white transition-all",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Content */}
      </aside>
    </>
  );
};
```

### Content Width Management

```tsx
// Full-width container with max-width
<div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

// Prose content (narrower for readability)
<div className="max-w-2xl">
```

---

## Accessibility Checklist

### Color Contrast

- [ ] Body text on background: minimum 4.5:1 ratio
- [ ] Large text (18px+): minimum 3:1 ratio
- [ ] Interactive elements: minimum 3:1 ratio against adjacent colors
- [ ] Focus indicators: minimum 3:1 ratio

### Focus Management

- [ ] All interactive elements are focusable
- [ ] Focus order follows logical reading order
- [ ] Focus is visible (never `outline: none` without replacement)
- [ ] Skip links for main content (if applicable)

### Motion

```tsx
// Respect reduced motion preference
"motion-safe:transition-all motion-safe:duration-200"
"motion-reduce:transition-none"

// Or in CSS
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Readers

```tsx
// Visually hidden but accessible
<span className="sr-only">Description for screen readers</span>

// Icon-only buttons need labels
<button aria-label="Close sidebar">
  <IconClose />
</button>

// Current page indication
<a aria-current={isActive ? "page" : undefined}>
```

---

## Common UI Tasks

### Task: Improve Sidebar Hover States

```
1. Invoke /frontend-design:
   "Analyze the current sidebar navigation hover states. 
    Consider: transition timing, color intensity, visual feedback clarity.
    Propose improvements that feel responsive but not jarring."

2. Implement recommendations in shared.tsx:
   - Update NavItem hover classes
   - Ensure consistent transition duration
   - Add subtle background transition
   - Verify focus states still work

3. Test:
   - Mouse hover feels smooth
   - Keyboard navigation shows clear focus
   - No layout shift on hover
```

### Task: Fix Card Grid Responsiveness

```
1. Invoke /frontend-design:
   "The landing page card grid breaks awkwardly at tablet sizes.
    Current: 1 col → 2 col → 3 col
    Propose breakpoint adjustments and spacing changes."

2. Implement in page.tsx:
   - Adjust grid-cols breakpoints
   - Update gap spacing per breakpoint
   - Consider card min-width constraints

3. Test at all breakpoints:
   - 320px (mobile)
   - 640px (sm)
   - 768px (md)
   - 1024px (lg)
   - 1280px (xl)
```

### Task: Add Page Transition Animation

```
1. Invoke /frontend-design:
   "Should we add page transition animations to the design system app?
    Consider: performance impact, user preference (reduced motion),
    implementation complexity, perceived benefit."

2. If approved, implement:
   - Use CSS transitions or Framer Motion
   - Respect prefers-reduced-motion
   - Keep duration short (200-300ms)
   - Use opacity + subtle transform

3. Verify:
   - No layout shift during transition
   - Reduced motion preference honored
   - Performance is acceptable
```

### Task: Improve Code Block Styling

```
1. Invoke /frontend-design:
   "Review the CodeBlock component styling:
    - Syntax highlighting color scheme
    - Header/title bar design
    - Copy button placement and feedback
    - Line numbers appearance
    - Scrollbar styling for overflow"

2. Implement in shared.tsx CodeBlock component:
   - Update syntax theme colors (use tokens)
   - Improve header visual hierarchy
   - Add copy success feedback animation
   - Style scrollbars for consistency

3. Test:
   - Various code lengths (short, long, overflow)
   - Different languages render correctly
   - Copy function works and provides feedback
```

---

## Visual Hierarchy Guidelines

### Typography Scale

```tsx
// Page titles
"text-3xl font-semibold text-neutral-900"  // 30px

// Section headings
"text-xl font-medium text-neutral-900"     // 20px

// Subsection headings
"text-lg font-medium text-neutral-800"     // 18px

// Body text
"text-base text-neutral-700"               // 16px

// Secondary/helper text
"text-sm text-neutral-600"                 // 14px

// Captions/labels
"text-xs text-neutral-500 uppercase tracking-wider"  // 12px
```

### Spacing Scale

```tsx
// Section spacing
"space-y-8"   // 32px between major sections

// Subsection spacing
"space-y-6"   // 24px between subsections

// Element spacing
"space-y-4"   // 16px between related elements

// Tight spacing
"space-y-2"   // 8px between closely related items

// Component internal
"p-4" to "p-6"  // 16-24px internal padding
```

### Visual Weight Hierarchy

```
1. Primary actions (filled buttons, primary color)
2. Page titles (large, semibold)
3. Section headings (medium size, medium weight)
4. Interactive elements (links, nav items)
5. Body content (base size, regular weight)
6. Secondary information (smaller, muted color)
7. Decorative elements (subtle, low contrast)
```

---

## Quality Checklist

Before completing any UI improvement:

### Visual
- [ ] Uses design tokens exclusively (no hardcoded values)
- [ ] Consistent with existing patterns in shared.tsx
- [ ] Typography follows established scale
- [ ] Spacing follows established scale
- [ ] Colors have sufficient contrast

### Interaction
- [ ] Hover states are present and consistent
- [ ] Focus states are visible and accessible
- [ ] Transitions are smooth (200ms default)
- [ ] No layout shift on interaction

### Responsive
- [ ] Tested at mobile (320px)
- [ ] Tested at tablet (768px)
- [ ] Tested at desktop (1024px+)
- [ ] No horizontal overflow

### Accessibility
- [ ] Focus order is logical
- [ ] Color contrast meets WCAG AA
- [ ] Reduced motion is respected
- [ ] Screen reader text where needed

---

## Related Skills

| Skill | Relationship |
|-------|--------------|
| `/frontend-design` | **Always invoke first** for design decisions |
| `/design-system-builder` | Adds new documented items (not styling) |
| `/component-generator` | Creates reusable components |
| `/icon-generator` | Creates icons |
| `/brand-tokens-translator` | Updates token values |

---

## Quick Reference

```
# UI improvement workflow
1. /frontend-design → Get design recommendations
2. Review and confirm approach
3. Implement using design tokens
4. Test interactions + responsiveness
5. Verify accessibility

# Key files
- shared.tsx → Layout components, nav styles
- page.tsx → Landing page grid, cards
- [token]/page.tsx → Token visualization layouts
- [component]/page.tsx → Doc page layouts

# Never hardcode
- Colors → use colors.* tokens
- Spacing → use spacing.* or Tailwind scale
- Radius → use radius.* tokens
- Shadows → use shadows.* tokens
- Transitions → use transitionPresets.*
```
