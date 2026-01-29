# ARIA & Semantic HTML

## First Rule of ARIA

> Don't use ARIA if you can use native HTML

```tsx
// ❌ ARIA role when native element exists
<div role="button" tabIndex={0} onClick={...}>

// ✓ Native element
<button onClick={...}>
```

## Semantic HTML Mapping

| Need | HTML Element | Avoid |
|------|--------------|-------|
| Button | `<button>` | `<div role="button">` |
| Link | `<a href="...">` | `<span onClick>` |
| Heading | `<h1>`-`<h6>` | `<div class="heading">` |
| List | `<ul>`, `<ol>`, `<li>` | `<div>` with bullets |
| Table | `<table>`, `<th>`, `<td>` | Grid of `<div>` |
| Form input | `<input>`, `<select>` | `<div contenteditable>` |
| Navigation | `<nav>` | `<div role="navigation">` |
| Main content | `<main>` | `<div role="main">` |

## Required ARIA Attributes

### Labels (4.1.2)

Every interactive element needs an accessible name:

```tsx
// Text content provides name
<button>Save</button>

// aria-label for icon-only
<button aria-label="Close dialog">
  <CloseIcon aria-hidden="true" />
</button>

// aria-labelledby references visible text
<h2 id="dialog-title">Confirm Delete</h2>
<div role="dialog" aria-labelledby="dialog-title">

// Input with label
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### States and Properties

| State | Attribute | Use Case |
|-------|-----------|----------|
| Expanded | `aria-expanded` | Accordion, dropdown, menu |
| Selected | `aria-selected` | Tab, listbox option |
| Checked | `aria-checked` | Custom checkbox/radio |
| Pressed | `aria-pressed` | Toggle button |
| Disabled | `aria-disabled` | Disabled but focusable |
| Current | `aria-current` | Current page/step |
| Invalid | `aria-invalid` | Form validation error |
| Busy | `aria-busy` | Loading content |

## Component Patterns (APG)

### Button
```tsx
// Standard button
<button type="button" onClick={handleClick}>
  Action
</button>

// Toggle button
<button
  type="button"
  aria-pressed={isPressed}
  onClick={() => setIsPressed(!isPressed)}
>
  {isPressed ? 'Enabled' : 'Disabled'}
</button>

// Icon button
<button type="button" aria-label="Delete item">
  <TrashIcon aria-hidden="true" />
</button>
```

### Dialog/Modal
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-description">Are you sure you want to proceed?</p>
  <button>Cancel</button>
  <button>Confirm</button>
</div>
```

### Tabs
```tsx
<div role="tablist" aria-label="Settings sections">
  <button 
    role="tab" 
    id="tab-1" 
    aria-selected={activeTab === 0}
    aria-controls="panel-1"
    tabIndex={activeTab === 0 ? 0 : -1}
  >
    General
  </button>
  <button 
    role="tab" 
    id="tab-2"
    aria-selected={activeTab === 1}
    aria-controls="panel-2"
    tabIndex={activeTab === 1 ? 0 : -1}
  >
    Security
  </button>
</div>

<div 
  role="tabpanel" 
  id="panel-1" 
  aria-labelledby="tab-1"
  hidden={activeTab !== 0}
>
  {/* Panel content */}
</div>
```

### Accordion
```tsx
<div>
  <h3>
    <button
      aria-expanded={isOpen}
      aria-controls="section-1-content"
      id="section-1-header"
    >
      Section Title
      <ChevronIcon aria-hidden="true" />
    </button>
  </h3>
  <div
    id="section-1-content"
    role="region"
    aria-labelledby="section-1-header"
    hidden={!isOpen}
  >
    {/* Section content */}
  </div>
</div>
```

### Combobox (Autocomplete)
```tsx
<div>
  <label id="combo-label" htmlFor="combo-input">
    Search
  </label>
  <input
    id="combo-input"
    type="text"
    role="combobox"
    aria-expanded={isOpen}
    aria-controls="combo-listbox"
    aria-autocomplete="list"
    aria-activedescendant={activeOptionId}
  />
  <ul
    id="combo-listbox"
    role="listbox"
    aria-labelledby="combo-label"
    hidden={!isOpen}
  >
    <li id="option-1" role="option" aria-selected={selected === 0}>
      Option 1
    </li>
    <li id="option-2" role="option" aria-selected={selected === 1}>
      Option 2
    </li>
  </ul>
</div>
```

### Alert/Toast
```tsx
// Polite announcement (non-urgent)
<div role="status" aria-live="polite">
  Changes saved successfully
</div>

// Assertive announcement (errors, urgent)
<div role="alert" aria-live="assertive">
  Error: Please fix the highlighted fields
</div>

// For dynamically added content
<div aria-live="polite" aria-atomic="true">
  {message && <span>{message}</span>}
</div>
```

### Progress/Loading
```tsx
// Determinate progress
<div 
  role="progressbar" 
  aria-valuenow={75} 
  aria-valuemin={0} 
  aria-valuemax={100}
  aria-label="Upload progress"
>
  75%
</div>

// Indeterminate loading
<div aria-busy="true" aria-live="polite">
  <span className="spinner" aria-hidden="true" />
  <span className="sr-only">Loading...</span>
</div>
```

## Live Regions

### Attributes
| Attribute | Values | Use |
|-----------|--------|-----|
| `aria-live` | `polite`, `assertive`, `off` | Announcement urgency |
| `aria-atomic` | `true`, `false` | Announce all or just changes |
| `aria-relevant` | `additions`, `removals`, `text`, `all` | What triggers announcement |

### Patterns
```tsx
// Counter updates
<span aria-live="polite" aria-atomic="true">
  {count} items in cart
</span>

// Error messages
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>

// Status updates (non-intrusive)
<div role="status" aria-live="polite">
  {statusMessage}
</div>
```

## Hidden Content

### Patterns
| Method | Screen Reader | Visual |
|--------|---------------|--------|
| `aria-hidden="true"` | Hidden | Visible |
| `.sr-only` class | Announced | Hidden |
| `hidden` attribute | Hidden | Hidden |
| `display: none` | Hidden | Hidden |
| `visibility: hidden` | Hidden | Hidden |

### Screen Reader Only Class
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## Issue Templates

### Missing Accessible Name
```markdown
### [CRITICAL] Interactive element missing accessible name

**WCAG Criterion:** 4.1.2 — Name, Role, Value (Level A)
**Location:** `src/components/IconButton.tsx:12`
**Category:** ARIA & Semantic HTML

**Current State:**
Icon button has no accessible name for screen readers

**Required State:**
All interactive elements must have an accessible name

**Code Fix:**
\`\`\`tsx
// Before
<button onClick={onClose}>
  <XIcon />
</button>

// After
<button onClick={onClose} aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>
\`\`\`
```

### Non-Semantic Element
```markdown
### [SERIOUS] Non-semantic element used for interaction

**WCAG Criterion:** 4.1.2 — Name, Role, Value (Level A)
**Location:** `src/components/ClickableCard.tsx:8`
**Category:** ARIA & Semantic HTML

**Current State:**
Clickable element uses `<div>` without proper role/keyboard support

**Required State:**
Use semantic element or add complete ARIA/keyboard support

**Code Fix:**
\`\`\`tsx
// Before
<div onClick={handleClick} className="card">

// After (preferred: use native element)
<button onClick={handleClick} className="card">

// Or with full ARIA support
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={handleKeyDown}
  className="card"
>
\`\`\`
```

## Testing

### Screen Reader Testing
```
macOS: VoiceOver (Cmd + F5)
Windows: NVDA (free), JAWS
iOS: VoiceOver (Settings > Accessibility)
Android: TalkBack (Settings > Accessibility)
```

### Browser Extensions
- axe DevTools
- WAVE
- Accessibility Insights
