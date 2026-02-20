import type { WCAGCriterionInfo, WCAGCategory, WCAGLevel, DocumentationLink } from './types'

// =============================================================================
// WCAG 2.2 AA Criteria Knowledge Base
// Sourced from Skills/design-accessibility/references/wcag-criteria.md
// Each criterion includes remediation patterns with code examples
// =============================================================================

// Helper: Generate standard documentation links for a WCAG criterion
function wcagDocs(code: string, name: string): DocumentationLink[] {
  const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`
  return [
    { label: `WCAG ${code}: ${name}`, url: `https://www.w3.org/WAI/WCAG22/Understanding/${slug}` },
    { label: 'How to Meet WCAG (Quick Reference)', url: `https://www.w3.org/WAI/WCAG22/quickref/#${slug}` },
  ]
}

export const wcagKnowledge: Record<string, WCAGCriterionInfo> = {
  // ---------------------------------------------------------------------------
  // PERCEIVABLE
  // ---------------------------------------------------------------------------
  '1.1.1': {
    code: '1.1.1', name: 'Non-text Content', level: 'A', category: 'Perceivable',
    requirement: 'All non-text content has a text alternative that serves the equivalent purpose',
    documentationUrls: [
      { label: 'WCAG 1.1.1: Non-text Content', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content' },
      { label: 'MDN: img alt attribute', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#alt' },
      { label: 'W3C Images Tutorial', url: 'https://www.w3.org/WAI/tutorials/images/' },
    ],
    commonPatterns: [
      { issueType: 'Missing alt text on images', fix: 'Add descriptive alt attribute to all informative images; use alt="" for decorative images', effort: 'low', codeExample: '<!-- Informative image: describe the content -->\n<img src="chart.png" alt="Bar chart showing Q4 revenue increased 15% to $2.3M" />\n\n<!-- Decorative image: empty alt -->\n<img src="decorative-border.png" alt="" />\n\n<!-- CSS background for decorative images -->\n<div style="background-image: url(border.png)" role="none"></div>', testingSteps: ['Run axe-core — check for image-alt rule', 'Screen reader: verify images announced with meaningful descriptions'] },
      { issueType: 'Icons without text alternative', fix: 'Add aria-label to icon buttons or use aria-hidden on decorative icons with visible text', effort: 'low', codeExample: '<!-- Icon-only button: needs aria-label -->\n<button aria-label="Close dialog">\n  <svg aria-hidden="true" focusable="false">...</svg>\n</button>\n\n<!-- Icon with visible text: hide icon from AT -->\n<button>\n  <svg aria-hidden="true" focusable="false">...</svg>\n  Download\n</button>', testingSteps: ['Run axe-core — check button-name rule', 'Screen reader: verify icon buttons announced with labels'] },
    ],
  },
  '1.3.1': {
    code: '1.3.1', name: 'Info and Relationships', level: 'A', category: 'Perceivable',
    requirement: 'Information, structure, and relationships conveyed through presentation are programmatically determinable',
    documentationUrls: [
      { label: 'WCAG 1.3.1: Info and Relationships', url: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships' },
      { label: 'MDN: ARIA roles', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles' },
      { label: 'W3C Forms Tutorial', url: 'https://www.w3.org/WAI/tutorials/forms/' },
    ],
    commonPatterns: [
      { issueType: 'Missing form labels', fix: 'Associate labels with inputs using <label for="id"> or aria-labelledby', effort: 'low', codeExample: '<!-- Option 1: Explicit label association -->\n<label for="email">Email address</label>\n<input type="email" id="email" name="email" />\n\n<!-- Option 2: Wrapping label -->\n<label>\n  Email address\n  <input type="email" name="email" />\n</label>\n\n<!-- Option 3: aria-labelledby for complex layouts -->\n<span id="email-label">Email address</span>\n<input type="email" aria-labelledby="email-label" />', testingSteps: ['Run axe-core — check label rule', 'Screen reader: verify each input announces its label'] },
      { issueType: 'Missing semantic markup', fix: 'Use appropriate HTML elements (headings, lists, tables, landmarks) instead of styled divs', effort: 'medium', codeExample: '<!-- Before: styled divs -->\n<div class="nav-wrapper">\n  <div class="nav-item">Home</div>\n</div>\n\n<!-- After: semantic HTML -->\n<nav aria-label="Main navigation">\n  <ul>\n    <li><a href="/home">Home</a></li>\n    <li><a href="/about">About</a></li>\n  </ul>\n</nav>', testingSteps: ['Run axe-core — check region and heading-order rules', 'Screen reader: verify page structure is announced correctly'] },
      { issueType: 'Missing table headers', fix: 'Use <th> elements with scope attribute for data tables', effort: 'low', codeExample: '<table>\n  <caption>Monthly compliance scores</caption>\n  <thead>\n    <tr>\n      <th scope="col">State</th>\n      <th scope="col">Score</th>\n      <th scope="col">Issues</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <th scope="row">California</th>\n      <td>85%</td>\n      <td>12</td>\n    </tr>\n  </tbody>\n</table>', testingSteps: ['Run axe-core — check th-has-data-cells rule', 'Screen reader: verify table headers announced when navigating cells'] },
    ],
  },
  '1.3.2': {
    code: '1.3.2', name: 'Meaningful Sequence', level: 'A', category: 'Perceivable',
    requirement: 'The reading and navigation order is logical and intuitive',
    documentationUrls: [
      { label: 'WCAG 1.3.2: Meaningful Sequence', url: 'https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence' },
      { label: 'MDN: CSS order property', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/order' },
    ],
    commonPatterns: [
      { issueType: 'Visual order differs from DOM order', fix: 'Ensure DOM order matches visual layout; avoid CSS that reorders content', effort: 'medium', codeExample: '<!-- Problem: CSS reorder breaks reading sequence -->\n<style>\n  .sidebar { order: -1; } /* Visually first, but DOM last */\n</style>\n<main>Content</main>\n<aside class="sidebar">Sidebar</aside>\n\n<!-- Fix: Match DOM order to visual order -->\n<aside>Sidebar</aside>\n<main>Content</main>', testingSteps: ['Tab through page — verify focus order matches visual layout', 'Screen reader: verify content read in logical order'] },
    ],
  },
  '1.3.3': {
    code: '1.3.3', name: 'Sensory Characteristics', level: 'A', category: 'Perceivable',
    requirement: 'Instructions do not rely solely on shape, color, size, visual location, or sound',
    documentationUrls: [
      { label: 'WCAG 1.3.3: Sensory Characteristics', url: 'https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics' },
    ],
    commonPatterns: [
      { issueType: 'Instructions rely on color or position', fix: 'Provide text labels in addition to visual cues', effort: 'low', codeExample: '<!-- Problem: relies on color alone -->\n<p>Click the red button to delete.</p>\n<button style="background: red">●</button>\n\n<!-- Fix: text label + color -->\n<p>Click the "Delete" button to remove this item.</p>\n<button style="background: red; color: white">\n  <span aria-hidden="true">🗑</span> Delete item\n</button>', testingSteps: ['Review instructions for references to color, shape, or position alone', 'Verify instructions make sense without visual context'] },
    ],
  },
  '1.3.4': {
    code: '1.3.4', name: 'Orientation', level: 'AA', category: 'Perceivable',
    requirement: 'Content is not restricted to a single display orientation unless essential',
    documentationUrls: [
      { label: 'WCAG 1.3.4: Orientation', url: 'https://www.w3.org/WAI/WCAG22/Understanding/orientation' },
      { label: 'MDN: orientation media query', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/orientation' },
    ],
    commonPatterns: [
      { issueType: 'Content locked to portrait or landscape', fix: 'Remove orientation locks; use responsive CSS that works in both orientations', effort: 'low', codeExample: '/* Problem: hiding content in landscape */\n@media (orientation: landscape) {\n  .important-content { display: none; }\n}\n\n/* Fix: responsive design for both orientations */\n.content {\n  display: flex;\n  flex-wrap: wrap;\n}\n@media (orientation: landscape) {\n  .content { flex-direction: row; }\n}\n@media (orientation: portrait) {\n  .content { flex-direction: column; }\n}', testingSteps: ['Rotate device/viewport between portrait and landscape', 'Verify all content is accessible in both orientations'] },
    ],
  },
  '1.3.5': {
    code: '1.3.5', name: 'Identify Input Purpose', level: 'AA', category: 'Perceivable',
    requirement: 'The purpose of input fields collecting user information can be programmatically determined',
    documentationUrls: [
      { label: 'WCAG 1.3.5: Identify Input Purpose', url: 'https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose' },
      { label: 'MDN: autocomplete attribute', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete' },
      { label: 'HTML Spec: Autofill tokens', url: 'https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill' },
    ],
    commonPatterns: [
      { issueType: 'Missing autocomplete attributes', fix: 'Add autocomplete attribute with appropriate token to personal data inputs', effort: 'low', codeExample: '<form>\n  <label for="fname">First name</label>\n  <input id="fname" type="text" autocomplete="given-name" />\n\n  <label for="lname">Last name</label>\n  <input id="lname" type="text" autocomplete="family-name" />\n\n  <label for="email">Email</label>\n  <input id="email" type="email" autocomplete="email" />\n\n  <label for="tel">Phone</label>\n  <input id="tel" type="tel" autocomplete="tel" />\n\n  <label for="addr">Street address</label>\n  <input id="addr" type="text" autocomplete="street-address" />\n</form>', testingSteps: ['Check all personal info inputs for autocomplete attribute', 'Verify browser autofill works correctly'] },
    ],
  },
  '1.4.1': {
    code: '1.4.1', name: 'Use of Color', level: 'A', category: 'Perceivable',
    requirement: 'Color is not the sole means of conveying information, indicating action, or distinguishing elements',
    documentationUrls: [
      { label: 'WCAG 1.4.1: Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color' },
      { label: 'MDN: aria-invalid', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-invalid' },
    ],
    commonPatterns: [
      { issueType: 'Error states indicated only by color', fix: 'Add text labels, icons, or patterns in addition to color changes', effort: 'low', codeExample: '<!-- Problem: only red border indicates error -->\n<input style="border-color: red" />\n\n<!-- Fix: icon + text + color + aria attributes -->\n<div class="field field--error">\n  <label for="email">Email address</label>\n  <input\n    id="email"\n    aria-invalid="true"\n    aria-describedby="email-error"\n  />\n  <div id="email-error" role="alert" class="error-msg">\n    <svg aria-hidden="true"><!-- error icon --></svg>\n    Please enter a valid email address\n  </div>\n</div>', testingSteps: ['View page in grayscale — verify all information is still conveyed', 'Check that links are distinguishable from text without color alone'] },
    ],
  },
  '1.4.3': {
    code: '1.4.3', name: 'Contrast (Minimum)', level: 'AA', category: 'Perceivable',
    requirement: 'Text has a contrast ratio of at least 4.5:1 (3:1 for large text)',
    documentationUrls: [
      { label: 'WCAG 1.4.3: Contrast (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum' },
      { label: 'WebAIM Contrast Checker', url: 'https://webaim.org/resources/contrastchecker/' },
      { label: 'MDN: color-contrast()', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-contrast' },
    ],
    commonPatterns: [
      { issueType: 'Text contrast too low', fix: 'Darken text or lighten background to achieve 4.5:1 ratio minimum', effort: 'low', codeExample: '/* Problem: #B0B0B0 on #FFFFFF = 2.65:1 ratio — FAIL */\n.text-muted {\n  color: #B0B0B0;\n}\n\n/* Fix: darken text to pass 4.5:1 */\n.text-muted {\n  color: #595959; /* 5.92:1 on white — PASS */\n}\n\n/* Large text (≥18px bold or ≥24px): 3:1 minimum */\n.heading-large {\n  font-size: 24px;\n  color: #767676; /* 4.54:1 on white — PASS */\n}', testingSteps: ['Run axe-core — check color-contrast rule', 'Use contrast checker tool to verify ratios', 'Check all interactive states (hover, focus, disabled)'] },
      { issueType: 'Low contrast on disabled elements', fix: 'Ensure disabled text meets 4.5:1 or use non-text indicators (icons, patterns)', effort: 'low', codeExample: '/* Problem: disabled text nearly invisible */\n.btn:disabled {\n  color: #D0D0D0; /* 1.45:1 — FAIL */\n}\n\n/* Fix: sufficient contrast + non-color indicator */\n.btn:disabled {\n  color: #767676; /* 4.54:1 on white — minimum passing */\n  cursor: not-allowed;\n  opacity: 0.7;\n  text-decoration: line-through; /* non-color indicator */\n}', testingSteps: ['Check contrast of disabled state text', 'Verify disabled state is conveyed by more than color alone'] },
    ],
  },
  '1.4.4': {
    code: '1.4.4', name: 'Resize Text', level: 'AA', category: 'Perceivable',
    requirement: 'Text can be resized up to 200% without loss of content or functionality',
    documentationUrls: [
      { label: 'WCAG 1.4.4: Resize Text', url: 'https://www.w3.org/WAI/WCAG22/Understanding/resize-text' },
      { label: 'MDN: rem unit', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units' },
    ],
    commonPatterns: [
      { issueType: 'Fixed pixel font sizes', fix: 'Use relative units (rem, em) instead of px for font sizes', effort: 'medium', codeExample: '/* Problem: fixed pixel sizes */\n.body-text { font-size: 14px; }\n.heading { font-size: 24px; }\n.small-text { font-size: 11px; }\n\n/* Fix: relative rem units */\nhtml { font-size: 16px; } /* base */\n.body-text { font-size: 0.875rem; }  /* 14px */\n.heading { font-size: 1.5rem; }      /* 24px */\n.small-text { font-size: 0.6875rem; } /* 11px */\n\n/* Container must accommodate growth */\n.card {\n  min-height: auto; /* not fixed height */\n  overflow: visible;\n}', testingSteps: ['Zoom browser to 200%', 'Verify no text is clipped, overlapping, or hidden', 'Check all interactive elements remain usable'] },
    ],
  },
  '1.4.5': {
    code: '1.4.5', name: 'Images of Text', level: 'AA', category: 'Perceivable',
    requirement: 'Use actual text rather than images of text, except for logos or essential presentation',
    documentationUrls: [
      { label: 'WCAG 1.4.5: Images of Text', url: 'https://www.w3.org/WAI/WCAG22/Understanding/images-of-text' },
    ],
    commonPatterns: [
      { issueType: 'Text rendered as image', fix: 'Replace image text with styled HTML text using CSS', effort: 'medium', codeExample: '<!-- Problem: text as image -->\n<img src="welcome-heading.png" alt="Welcome to Our Store" />\n\n<!-- Fix: real text with CSS styling -->\n<h1 style="font-family: \'Playfair Display\', serif;\n  letter-spacing: 2px;\n  text-transform: uppercase;\n  background: linear-gradient(90deg, #005151, #008080);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;">\n  Welcome to Our Store\n</h1>', testingSteps: ['Search for images containing text content', 'Verify logos are the only images of text remaining'] },
    ],
  },
  '1.4.10': {
    code: '1.4.10', name: 'Reflow', level: 'AA', category: 'Perceivable',
    requirement: 'Content reflows without horizontal scrolling at 320px width (400% zoom)',
    documentationUrls: [
      { label: 'WCAG 1.4.10: Reflow', url: 'https://www.w3.org/WAI/WCAG22/Understanding/reflow' },
      { label: 'MDN: Responsive design', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design' },
    ],
    commonPatterns: [
      { issueType: 'Horizontal scroll at narrow widths', fix: 'Use responsive CSS with flexible layouts and breakpoints', effort: 'high', codeExample: '/* Problem: fixed-width layout */\n.container { width: 1200px; }\n.grid { display: grid; grid-template-columns: 1fr 1fr 1fr; }\n\n/* Fix: responsive layout */\n.container {\n  max-width: 100%;\n  padding: 0 16px;\n  overflow-x: hidden;\n}\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 16px;\n}\n/* Stack at narrow widths */\n@media (max-width: 320px) {\n  .grid { grid-template-columns: 1fr; }\n}', testingSteps: ['Set viewport to 320px width', 'Verify no horizontal scrollbar appears', 'Check all content is accessible without side-scrolling'] },
    ],
  },
  '1.4.11': {
    code: '1.4.11', name: 'Non-text Contrast', level: 'AA', category: 'Perceivable',
    requirement: 'UI components and graphical objects have at least 3:1 contrast ratio',
    documentationUrls: [
      { label: 'WCAG 1.4.11: Non-text Contrast', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast' },
      { label: 'WebAIM Contrast Checker', url: 'https://webaim.org/resources/contrastchecker/' },
    ],
    commonPatterns: [
      { issueType: 'Icon contrast too low', fix: 'Darken icon colors to achieve 3:1 contrast ratio against background', effort: 'low', codeExample: '/* Problem: light icon on white background */\n.icon { color: #CCCCCC; } /* 1.60:1 on white — FAIL */\n\n/* Fix: sufficient contrast */\n.icon { color: #595959; } /* 5.92:1 on white — PASS */\n\n/* Form inputs: border must meet 3:1 */\n.input {\n  /* Problem: #E0E0E0 border = 1.35:1 — FAIL */\n  /* Fix: */\n  border: 1px solid #767676; /* 4.54:1 — PASS */\n}', testingSteps: ['Run axe-core for non-text contrast violations', 'Check form input borders, icons, and focus indicators', 'Verify custom checkboxes/radios meet 3:1 ratio'] },
      { issueType: 'Focus indicator insufficient contrast', fix: 'Use a visible focus ring with at least 3:1 contrast against adjacent colors', effort: 'low', codeExample: '/* Problem: no visible focus or low-contrast focus */\nbutton:focus { outline: none; }\n\n/* Fix: clear focus ring */\nbutton:focus-visible {\n  outline: 2px solid #005fcc; /* 4.5:1+ on white */\n  outline-offset: 2px;\n}\n\n/* For dark backgrounds: */\n.dark-bg button:focus-visible {\n  outline: 2px solid #6CB4FF; /* 3:1+ on dark */\n  outline-offset: 2px;\n}', testingSteps: ['Tab through all interactive elements', 'Verify focus indicator is clearly visible against all backgrounds'] },
    ],
  },
  '1.4.12': {
    code: '1.4.12', name: 'Text Spacing', level: 'AA', category: 'Perceivable',
    requirement: 'No loss of content when text spacing is increased (line height 1.5x, paragraph 2x, letter 0.12em, word 0.16em)',
    documentationUrls: [
      { label: 'WCAG 1.4.12: Text Spacing', url: 'https://www.w3.org/WAI/WCAG22/Understanding/text-spacing' },
      { label: 'Text Spacing Bookmarklet', url: 'https://www.html5accessibility.com/tests/tsbookmarklet.html' },
    ],
    commonPatterns: [
      { issueType: 'Content clipped with increased spacing', fix: 'Use flexible containers that grow with text; avoid fixed heights on text containers', effort: 'medium', codeExample: '/* Problem: fixed height clips expanded text */\n.card {\n  height: 100px;\n  overflow: hidden;\n}\n\n/* Fix: flexible height */\n.card {\n  min-height: 100px; /* grows with content */\n  overflow: visible;\n}\n\n/* Avoid: line-clamp that hides text */\n/* If needed, use expandable "Read more" */\n.text {\n  /* Don\'t set max-height on text containers */\n  line-height: 1.5; /* allow natural spacing */\n}', testingSteps: ['Apply text spacing override bookmarklet', 'Verify no text is clipped or overlapping', 'Check buttons and labels remain readable'] },
    ],
  },
  '1.4.13': {
    code: '1.4.13', name: 'Content on Hover or Focus', level: 'AA', category: 'Perceivable',
    requirement: 'Hover/focus triggered content is dismissible, hoverable, and persistent',
    documentationUrls: [
      { label: 'WCAG 1.4.13: Content on Hover or Focus', url: 'https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus' },
      { label: 'WAI-ARIA: tooltip role', url: 'https://www.w3.org/TR/wai-aria-1.2/#tooltip' },
    ],
    commonPatterns: [
      { issueType: 'Tooltip not dismissible', fix: 'Allow Escape key to dismiss; keep content visible while hovering over it', effort: 'medium', codeExample: '// Tooltip requirements:\n// 1. Dismissible — Escape closes it\n// 2. Hoverable — mouse can enter tooltip content\n// 3. Persistent — stays until dismissed/hover removed\n\nfunction Tooltip({ trigger, content }) {\n  const [open, setOpen] = useState(false);\n\n  useEffect(() => {\n    const handler = (e) => {\n      if (e.key === "Escape") setOpen(false);\n    };\n    document.addEventListener("keydown", handler);\n    return () => document.removeEventListener("keydown", handler);\n  }, []);\n\n  return (\n    <div\n      onMouseEnter={() => setOpen(true)}\n      onMouseLeave={() => setOpen(false)}\n      onFocus={() => setOpen(true)}\n      onBlur={() => setOpen(false)}\n    >\n      {trigger}\n      {open && (\n        <div role="tooltip"\n          onMouseEnter={() => setOpen(true)}> {/* hoverable */}\n          {content}\n        </div>\n      )}\n    </div>\n  );\n}', testingSteps: ['Hover over trigger — verify tooltip appears', 'Move mouse to tooltip — verify it stays visible', 'Press Escape — verify tooltip dismisses', 'Tab to trigger — verify tooltip shows on focus'] },
    ],
  },

  // ---------------------------------------------------------------------------
  // OPERABLE
  // ---------------------------------------------------------------------------
  '2.1.1': {
    code: '2.1.1', name: 'Keyboard', level: 'A', category: 'Operable',
    requirement: 'All functionality is accessible via keyboard without requiring specific timings',
    documentationUrls: [
      { label: 'WCAG 2.1.1: Keyboard', url: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard' },
      { label: 'WAI-ARIA Authoring Practices', url: 'https://www.w3.org/WAI/ARIA/apg/' },
      { label: 'MDN: Keyboard-navigable widgets', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets' },
    ],
    commonPatterns: [
      { issueType: 'Mouse-only interaction', fix: 'Add keyboard event handlers (Enter/Space for activation, Arrow keys for navigation)', effort: 'medium', codeExample: '// Problem: click-only handler on non-button element\n<div onClick={handleAction}>Click me</div>\n\n// Fix Option 1: Use a <button> (best)\n<button onClick={handleAction}>Click me</button>\n\n// Fix Option 2: Add keyboard + role if <button> isn\'t possible\n<div\n  role="button"\n  tabIndex={0}\n  onClick={handleAction}\n  onKeyDown={(e) => {\n    if (e.key === "Enter" || e.key === " ") {\n      e.preventDefault();\n      handleAction();\n    }\n  }}\n>\n  Click me\n</div>', testingSteps: ['Tab to every interactive element', 'Verify Enter/Space activates buttons and links', 'Verify Arrow keys work for menus, tabs, and sliders'] },
      { issueType: 'Custom widget not keyboard accessible', fix: 'Follow ARIA Authoring Practices for keyboard patterns (tabs, menus, trees, grids)', effort: 'high', codeExample: '// Tab panel with proper keyboard navigation\nfunction TabList({ tabs, activeIndex, onChange }) {\n  const handleKeyDown = (e, index) => {\n    let newIndex = index;\n    if (e.key === "ArrowRight") newIndex = (index + 1) % tabs.length;\n    if (e.key === "ArrowLeft") newIndex = (index - 1 + tabs.length) % tabs.length;\n    if (e.key === "Home") newIndex = 0;\n    if (e.key === "End") newIndex = tabs.length - 1;\n    if (newIndex !== index) {\n      e.preventDefault();\n      onChange(newIndex);\n    }\n  };\n\n  return (\n    <div role="tablist">\n      {tabs.map((tab, i) => (\n        <button\n          key={i}\n          role="tab"\n          aria-selected={i === activeIndex}\n          tabIndex={i === activeIndex ? 0 : -1}\n          onKeyDown={(e) => handleKeyDown(e, i)}\n          onClick={() => onChange(i)}\n        >\n          {tab.label}\n        </button>\n      ))}\n    </div>\n  );\n}', testingSteps: ['Navigate entire widget using only keyboard', 'Verify all ARIA keyboard patterns are implemented', 'Test with screen reader to confirm announcements'] },
    ],
  },
  '2.1.2': {
    code: '2.1.2', name: 'No Keyboard Trap', level: 'A', category: 'Operable',
    requirement: 'Keyboard focus can always be moved away from any component',
    documentationUrls: [
      { label: 'WCAG 2.1.2: No Keyboard Trap', url: 'https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap' },
      { label: 'WAI-ARIA: Dialog pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/' },
    ],
    commonPatterns: [
      { issueType: 'Focus trapped in modal or panel', fix: 'Implement focus trap with Escape key to exit; manage focus on open/close', effort: 'medium', codeExample: 'function Modal({ open, onClose, children }) {\n  const modalRef = useRef(null);\n  const previousFocus = useRef(null);\n\n  useEffect(() => {\n    if (open) {\n      previousFocus.current = document.activeElement;\n      modalRef.current?.querySelector("button, [tabindex]")?.focus();\n    } else if (previousFocus.current) {\n      previousFocus.current.focus(); // Return focus\n    }\n  }, [open]);\n\n  useEffect(() => {\n    const handler = (e) => {\n      if (e.key === "Escape") onClose();\n    };\n    document.addEventListener("keydown", handler);\n    return () => document.removeEventListener("keydown", handler);\n  }, [onClose]);\n\n  if (!open) return null;\n  return (\n    <div role="dialog" aria-modal="true" ref={modalRef}>\n      {children}\n      <button onClick={onClose}>Close</button>\n    </div>\n  );\n}', testingSteps: ['Tab into the component', 'Verify Tab and Shift+Tab cycle within modal', 'Verify Escape closes and returns focus'] },
    ],
  },
  '2.1.4': {
    code: '2.1.4', name: 'Character Key Shortcuts', level: 'A', category: 'Operable',
    requirement: 'Single-character keyboard shortcuts can be turned off, remapped, or only active on focus',
    documentationUrls: [
      { label: 'WCAG 2.1.4: Character Key Shortcuts', url: 'https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts' },
    ],
    commonPatterns: [
      { issueType: 'Single-key shortcuts interfere with speech input', fix: 'Require modifier key (Ctrl/Alt) or only activate shortcuts when component is focused', effort: 'low', codeExample: '// Problem: global single-key shortcut\ndocument.addEventListener("keydown", (e) => {\n  if (e.key === "d") deleteItem(); // Fires during speech input!\n});\n\n// Fix: require modifier key\ndocument.addEventListener("keydown", (e) => {\n  if (e.ctrlKey && e.key === "d") {\n    e.preventDefault();\n    deleteItem();\n  }\n});\n\n// Or: only when element is focused\ndeleteButton.addEventListener("keydown", (e) => {\n  if (e.key === "d" || e.key === "Delete") deleteItem();\n});', testingSteps: ['Check for single-character shortcut listeners', 'Verify shortcuts require modifier keys or focus'] },
    ],
  },
  '2.2.1': {
    code: '2.2.1', name: 'Timing Adjustable', level: 'A', category: 'Operable',
    requirement: 'Users can turn off, adjust, or extend time limits',
    documentationUrls: [
      { label: 'WCAG 2.2.1: Timing Adjustable', url: 'https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable' },
    ],
    commonPatterns: [
      { issueType: 'Session timeout without warning', fix: 'Warn users before timeout and allow extension', effort: 'medium', codeExample: '// Show warning 2 minutes before timeout\nfunction SessionManager({ timeout = 30 * 60000 }) {\n  const [showWarning, setShowWarning] = useState(false);\n\n  useEffect(() => {\n    const warnTimer = setTimeout(\n      () => setShowWarning(true),\n      timeout - 120000 // 2 min before expiry\n    );\n    return () => clearTimeout(warnTimer);\n  }, [timeout]);\n\n  return showWarning ? (\n    <div role="alertdialog" aria-label="Session expiring">\n      <p>Your session expires in 2 minutes.</p>\n      <button onClick={extendSession}>Extend Session</button>\n      <button onClick={logout}>Log Out</button>\n    </div>\n  ) : null;\n}', testingSteps: ['Trigger timeout warning', 'Verify extend option works', 'Verify user is notified before any timeout'] },
    ],
  },
  '2.2.2': {
    code: '2.2.2', name: 'Pause, Stop, Hide', level: 'A', category: 'Operable',
    requirement: 'Moving, blinking, or auto-updating content can be paused, stopped, or hidden',
    documentationUrls: [
      { label: 'WCAG 2.2.2: Pause, Stop, Hide', url: 'https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide' },
      { label: 'MDN: prefers-reduced-motion', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion' },
    ],
    commonPatterns: [
      { issueType: 'Auto-scrolling content without pause control', fix: 'Add pause/stop button for any auto-playing content', effort: 'low', codeExample: 'function AutoCarousel({ items }) {\n  const [paused, setPaused] = useState(false);\n  const [index, setIndex] = useState(0);\n\n  useEffect(() => {\n    if (paused) return;\n    const timer = setInterval(\n      () => setIndex((i) => (i + 1) % items.length),\n      5000\n    );\n    return () => clearInterval(timer);\n  }, [paused, items.length]);\n\n  // Also respect prefers-reduced-motion\n  useEffect(() => {\n    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");\n    if (mq.matches) setPaused(true);\n  }, []);\n\n  return (\n    <div role="region" aria-label="News carousel" aria-live={paused ? "off" : "polite"}>\n      <button onClick={() => setPaused(!paused)}>\n        {paused ? "Play" : "Pause"}\n      </button>\n      <div>{items[index]}</div>\n    </div>\n  );\n}', testingSteps: ['Verify all auto-playing content has pause controls', 'Verify animations stop when prefers-reduced-motion is set'] },
    ],
  },
  '2.3.1': {
    code: '2.3.1', name: 'Three Flashes or Below', level: 'A', category: 'Operable',
    requirement: 'Nothing flashes more than three times per second',
    documentationUrls: [
      { label: 'WCAG 2.3.1: Three Flashes', url: 'https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold' },
      { label: 'MDN: prefers-reduced-motion', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion' },
    ],
    commonPatterns: [
      { issueType: 'Rapid flashing content', fix: 'Limit flash rate to maximum 3 per second; respect prefers-reduced-motion', effort: 'low', codeExample: '/* Respect user preference for reduced motion */\n@media (prefers-reduced-motion: reduce) {\n  *,\n  *::before,\n  *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n    scroll-behavior: auto !important;\n  }\n}', testingSteps: ['Check all animations for flash rate', 'Verify prefers-reduced-motion is respected'] },
    ],
  },
  '2.4.1': {
    code: '2.4.1', name: 'Bypass Blocks', level: 'A', category: 'Operable',
    requirement: 'Mechanism available to bypass blocks of repeated content',
    documentationUrls: [
      { label: 'WCAG 2.4.1: Bypass Blocks', url: 'https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks' },
      { label: 'WebAIM: Skip Navigation', url: 'https://webaim.org/techniques/skipnav/' },
    ],
    commonPatterns: [
      { issueType: 'No skip navigation link', fix: 'Add a visually hidden skip link as first focusable element', effort: 'low', codeExample: '/* Skip link: hidden until focused */\n.skip-link {\n  position: absolute;\n  top: -100%;\n  left: 16px;\n  padding: 8px 16px;\n  background: #005151;\n  color: white;\n  z-index: 9999;\n  border-radius: 4px;\n}\n.skip-link:focus {\n  top: 16px; /* becomes visible on focus */\n}\n\n<!-- In your layout: -->\n<body>\n  <a href="#main-content" class="skip-link">\n    Skip to main content\n  </a>\n  <header>...</header>\n  <nav>...</nav>\n  <main id="main-content" tabindex="-1">\n    <!-- Page content -->\n  </main>\n</body>', testingSteps: ['Tab to page — verify skip link appears on first Tab press', 'Activate skip link — verify focus moves to main content'] },
    ],
  },
  '2.4.2': {
    code: '2.4.2', name: 'Page Titled', level: 'A', category: 'Operable',
    requirement: 'Pages have titles that describe their topic or purpose',
    documentationUrls: [
      { label: 'WCAG 2.4.2: Page Titled', url: 'https://www.w3.org/WAI/WCAG22/Understanding/page-titled' },
      { label: 'MDN: title element', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title' },
    ],
    commonPatterns: [
      { issueType: 'Missing or generic page title', fix: 'Add descriptive <title> element that includes page-specific content', effort: 'low', codeExample: '<!-- Problem: generic title -->\n<title>App</title>\n\n<!-- Fix: descriptive, specific title -->\n<title>Label Template Editor - Retail ID - Metrc</title>\n\n<!-- For Next.js/React SPA: update on route change -->\n// app/packages/page.tsx\nexport const metadata = {\n  title: "Packages — Retail ID — Metrc",\n};\n\n// Or dynamically:\nuseEffect(() => {\n  document.title = `${pageTitle} — Metrc`;\n}, [pageTitle]);', testingSteps: ['Check document.title in browser tab', 'Verify title changes on navigation', 'Screen reader: verify page title is announced'] },
    ],
  },
  '2.4.3': {
    code: '2.4.3', name: 'Focus Order', level: 'A', category: 'Operable',
    requirement: 'Focus order preserves meaning and operability',
    documentationUrls: [
      { label: 'WCAG 2.4.3: Focus Order', url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-order' },
      { label: 'MDN: tabindex', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex' },
    ],
    commonPatterns: [
      { issueType: 'Focus order illogical', fix: 'Ensure DOM order matches visual order; use tabindex="0" only to add elements to tab order, never positive values', effort: 'medium', codeExample: '<!-- Problem: positive tabindex values -->\n<button tabindex="3">Third action</button>\n<button tabindex="1">First action</button>\n<button tabindex="2">Second action</button>\n\n<!-- Fix: use natural DOM order -->\n<button>First action</button>\n<button>Second action</button>\n<button>Third action</button>\n\n<!-- Only valid tabindex values: -->\n<!-- tabindex="0"  → adds to natural tab order -->\n<!-- tabindex="-1" → focusable via JS only -->\n<!-- NEVER use positive tabindex values -->', testingSteps: ['Tab through entire page', 'Verify focus moves in logical reading order', 'Check no positive tabindex values exist'] },
    ],
  },
  '2.4.4': {
    code: '2.4.4', name: 'Link Purpose (In Context)', level: 'A', category: 'Operable',
    requirement: 'The purpose of each link can be determined from the link text or its context',
    documentationUrls: [
      { label: 'WCAG 2.4.4: Link Purpose', url: 'https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context' },
      { label: 'MDN: aria-label', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label' },
    ],
    commonPatterns: [
      { issueType: 'Vague link text (Click here, Read more)', fix: 'Use descriptive link text or add aria-label for context', effort: 'low', codeExample: '<!-- Problem: vague link text -->\n<p>For details, <a href="/report">click here</a>.</p>\n<a href="/report">Read more</a>\n\n<!-- Fix Option 1: descriptive text -->\n<p><a href="/report">Read the Q4 compliance report</a></p>\n\n<!-- Fix Option 2: aria-label when text must be brief -->\n<a href="/report" aria-label="Read the Q4 compliance report">\n  Read more\n</a>\n\n<!-- Fix Option 3: visually hidden text -->\n<a href="/report">\n  Read more\n  <span class="visually-hidden"> about Q4 compliance</span>\n</a>', testingSteps: ['Review all link text out of context', 'Verify each link purpose is clear from text alone or with aria-label'] },
    ],
  },
  '2.4.5': {
    code: '2.4.5', name: 'Multiple Ways', level: 'AA', category: 'Operable',
    requirement: 'More than one way is available to locate a page within a set of pages',
    documentationUrls: [
      { label: 'WCAG 2.4.5: Multiple Ways', url: 'https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways' },
    ],
    commonPatterns: [
      { issueType: 'Single navigation path only', fix: 'Provide at least two ways to find pages: navigation menu, search, sitemap, or breadcrumbs', effort: 'medium', codeExample: '<!-- Provide multiple navigation methods -->\n<nav aria-label="Breadcrumb">\n  <ol>\n    <li><a href="/">Home</a></li>\n    <li><a href="/reports">Reports</a></li>\n    <li aria-current="page">California</li>\n  </ol>\n</nav>\n\n<nav aria-label="Main navigation">\n  <ul>...</ul>\n</nav>\n\n<form role="search" aria-label="Site search">\n  <label for="search">Search</label>\n  <input type="search" id="search" />\n  <button type="submit">Search</button>\n</form>', testingSteps: ['Verify at least two navigation methods exist', 'Test search functionality if present'] },
    ],
  },
  '2.4.6': {
    code: '2.4.6', name: 'Headings and Labels', level: 'AA', category: 'Operable',
    requirement: 'Headings and labels describe the topic or purpose',
    documentationUrls: [
      { label: 'WCAG 2.4.6: Headings and Labels', url: 'https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels' },
      { label: 'W3C: Headings Tutorial', url: 'https://www.w3.org/WAI/tutorials/page-structure/headings/' },
    ],
    commonPatterns: [
      { issueType: 'Headings not descriptive', fix: 'Use clear, specific heading text; maintain logical heading hierarchy', effort: 'low', codeExample: '<!-- Problem: vague headings -->\n<h1>Dashboard</h1>\n<h2>Section 1</h2>\n<h3>Data</h3>\n\n<!-- Fix: descriptive headings -->\n<h1>Compliance Dashboard</h1>\n  <h2>California — Issue Summary</h2>\n    <h3>Critical Accessibility Issues (5)</h3>\n    <h3>Resolved Issues (12)</h3>\n  <h2>Report Upload</h2>', testingSteps: ['Review all headings for clarity', 'Verify heading hierarchy (h1 > h2 > h3, no skipped levels)', 'Screen reader: use heading navigation to verify structure'] },
    ],
  },
  '2.4.7': {
    code: '2.4.7', name: 'Focus Visible', level: 'AA', category: 'Operable',
    requirement: 'Keyboard focus indicator is visible on all interactive elements',
    documentationUrls: [
      { label: 'WCAG 2.4.7: Focus Visible', url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-visible' },
      { label: 'MDN: :focus-visible', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible' },
    ],
    commonPatterns: [
      { issueType: 'Focus indicator removed or invisible', fix: 'Use :focus-visible to show clear focus ring; never use outline: none without replacement', effort: 'low', codeExample: '/* Problem: focus removed globally */\n*:focus { outline: none; } /* NEVER do this */\n\n/* Fix: visible focus for keyboard users */\n*:focus-visible {\n  outline: 2px solid #005fcc;\n  outline-offset: 2px;\n}\n\n/* Custom focus style example */\nbutton:focus-visible {\n  outline: 2px solid #005fcc;\n  outline-offset: 2px;\n  box-shadow: 0 0 0 4px rgba(0, 95, 204, 0.25);\n}\n\n/* Hide focus for mouse users */\nbutton:focus:not(:focus-visible) {\n  outline: none;\n}', testingSteps: ['Tab through all interactive elements', 'Verify visible focus indicator on every focusable element', 'Check focus is visible against all background colors'] },
    ],
  },
  '2.4.11': {
    code: '2.4.11', name: 'Focus Not Obscured (Minimum)', level: 'AA', category: 'Operable',
    requirement: 'Focused element is not entirely hidden by other content',
    documentationUrls: [
      { label: 'WCAG 2.4.11: Focus Not Obscured', url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum' },
      { label: 'MDN: scroll-padding', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding' },
    ],
    commonPatterns: [
      { issueType: 'Focused element hidden by sticky header/footer', fix: 'Add scroll-padding to account for fixed elements; use scroll-margin on focusable elements', effort: 'low', codeExample: '/* Problem: sticky header covers focused elements */\nheader { position: sticky; top: 0; height: 64px; }\n\n/* Fix: scroll-padding accounts for sticky header */\nhtml {\n  scroll-padding-top: 80px; /* header height + buffer */\n}\n\n/* Also add scroll-margin to individual elements */\n:focus {\n  scroll-margin-top: 80px;\n  scroll-margin-bottom: 80px;\n}', testingSteps: ['Tab through page with sticky header/footer', 'Verify focused elements are never fully obscured'] },
    ],
  },
  '2.5.1': {
    code: '2.5.1', name: 'Pointer Gestures', level: 'A', category: 'Operable',
    requirement: 'Multi-point or path-based gestures have single-pointer alternatives',
    documentationUrls: [
      { label: 'WCAG 2.5.1: Pointer Gestures', url: 'https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures' },
    ],
    commonPatterns: [
      { issueType: 'Pinch-zoom only interaction', fix: 'Provide button controls as alternative to multi-point gestures', effort: 'medium', codeExample: '<!-- Problem: pinch-zoom only -->\n<div onTouchStart={handlePinch}>Map</div>\n\n<!-- Fix: button alternatives -->\n<div>\n  <div id="map">Map content</div>\n  <div role="toolbar" aria-label="Map controls">\n    <button aria-label="Zoom in" onClick={zoomIn}>+</button>\n    <button aria-label="Zoom out" onClick={zoomOut}>−</button>\n    <button aria-label="Reset zoom" onClick={resetZoom}>Reset</button>\n  </div>\n</div>', testingSteps: ['Identify all gesture-based interactions', 'Verify each has a single-click alternative'] },
    ],
  },
  '2.5.2': {
    code: '2.5.2', name: 'Pointer Cancellation', level: 'A', category: 'Operable',
    requirement: 'Functions triggered by pointer down-event can be aborted or undone',
    documentationUrls: [
      { label: 'WCAG 2.5.2: Pointer Cancellation', url: 'https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation' },
    ],
    commonPatterns: [
      { issueType: 'Action fires on mousedown instead of click', fix: 'Use click/mouseup events instead of mousedown for destructive actions', effort: 'low', codeExample: '// Problem: destructive action on mousedown (no cancellation)\nelement.addEventListener("mousedown", deleteItem);\n\n// Fix: use click event (mousedown + mouseup on same element)\nelement.addEventListener("click", deleteItem);\n// User can press down, drag away, and release to cancel\n\n// In React:\n<button onClick={deleteItem}>Delete</button>\n// NOT: <button onMouseDown={deleteItem}>Delete</button>', testingSteps: ['Press mouse button on action, drag away, release — verify action does not fire', 'Verify destructive actions use click (not mousedown) events'] },
    ],
  },
  '2.5.3': {
    code: '2.5.3', name: 'Label in Name', level: 'A', category: 'Operable',
    requirement: 'Visible label text is included in the accessible name',
    documentationUrls: [
      { label: 'WCAG 2.5.3: Label in Name', url: 'https://www.w3.org/WAI/WCAG22/Understanding/label-in-name' },
      { label: 'MDN: Accessible name', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Accessible_name' },
    ],
    commonPatterns: [
      { issueType: 'Accessible name differs from visible label', fix: 'Ensure aria-label includes the visible text, or remove aria-label when visible text is sufficient', effort: 'low', codeExample: '<!-- Problem: visible text "Submit" but aria-label differs -->\n<button aria-label="Send form data">Submit</button>\n<!-- Voice user says "click Submit" but AT name is "Send form data" -->\n\n<!-- Fix Option 1: remove unnecessary aria-label -->\n<button>Submit</button>\n\n<!-- Fix Option 2: start aria-label with visible text -->\n<button aria-label="Submit application form">Submit</button>\n<!-- "Submit" appears at start of accessible name ✓ -->', testingSteps: ['Compare visible labels to accessible names', 'Verify accessible name starts with visible label text'] },
    ],
  },
  '2.5.7': {
    code: '2.5.7', name: 'Dragging Movements', level: 'AA', category: 'Operable',
    requirement: 'Functionality that uses dragging has a single-pointer alternative',
    documentationUrls: [
      { label: 'WCAG 2.5.7: Dragging Movements', url: 'https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements' },
    ],
    commonPatterns: [
      { issueType: 'Drag-only reordering', fix: 'Provide move up/down buttons or a select-based alternative for drag-and-drop', effort: 'high', codeExample: '// Drag-and-drop list with button alternatives\nfunction ReorderableList({ items, onReorder }) {\n  return (\n    <ul role="list" aria-label="Reorderable list">\n      {items.map((item, i) => (\n        <li key={item.id} draggable="true">\n          <span>{item.name}</span>\n          <div role="toolbar" aria-label={`Move ${item.name}`}>\n            <button\n              aria-label={`Move ${item.name} up`}\n              disabled={i === 0}\n              onClick={() => onReorder(i, i - 1)}\n            >\n              ↑ Up\n            </button>\n            <button\n              aria-label={`Move ${item.name} down`}\n              disabled={i === items.length - 1}\n              onClick={() => onReorder(i, i + 1)}\n            >\n              ↓ Down\n            </button>\n          </div>\n        </li>\n      ))}\n    </ul>\n  );\n}', testingSteps: ['Verify all drag operations have button/click alternatives', 'Test reordering using only keyboard'] },
    ],
  },
  '2.5.8': {
    code: '2.5.8', name: 'Target Size (Minimum)', level: 'AA', category: 'Operable',
    requirement: 'Touch/click targets are at least 24x24 CSS pixels',
    documentationUrls: [
      { label: 'WCAG 2.5.8: Target Size', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum' },
    ],
    commonPatterns: [
      { issueType: 'Small click targets', fix: 'Increase element size or add padding to achieve 24x24px minimum', effort: 'low', codeExample: '/* Problem: tiny icon button */\n.icon-btn {\n  width: 16px;\n  height: 16px;\n}\n\n/* Fix: minimum 24x24 target with padding */\n.icon-btn {\n  min-width: 24px;\n  min-height: 24px;\n  padding: 8px; /* total: 24 + 16 = 40px clickable area */\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n\n/* For inline links, use adequate line-height */\na {\n  padding: 4px 0; /* vertical padding increases target */\n  line-height: 1.5;\n}', testingSteps: ['Inspect target sizes of all interactive elements', 'Verify minimum 24x24px clickable area', 'Check spacing between adjacent targets'] },
    ],
  },

  // ---------------------------------------------------------------------------
  // UNDERSTANDABLE
  // ---------------------------------------------------------------------------
  '3.1.1': {
    code: '3.1.1', name: 'Language of Page', level: 'A', category: 'Understandable',
    requirement: 'The default language of the page is programmatically identified',
    documentationUrls: [
      { label: 'WCAG 3.1.1: Language of Page', url: 'https://www.w3.org/WAI/WCAG22/Understanding/language-of-page' },
      { label: 'MDN: lang attribute', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang' },
    ],
    commonPatterns: [
      { issueType: 'Missing lang attribute', fix: 'Add lang attribute to the <html> element', effort: 'low', codeExample: '<!-- Problem: no language set -->\n<html>\n\n<!-- Fix: set document language -->\n<html lang="en">\n\n<!-- For Next.js: app/layout.tsx -->\nexport default function RootLayout({ children }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}', testingSteps: ['Check <html> element for lang attribute', 'Verify lang value matches page content language'] },
    ],
  },
  '3.1.2': {
    code: '3.1.2', name: 'Language of Parts', level: 'AA', category: 'Understandable',
    requirement: 'The language of each passage or phrase can be programmatically determined',
    documentationUrls: [
      { label: 'WCAG 3.1.2: Language of Parts', url: 'https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts' },
      { label: 'MDN: lang attribute', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang' },
    ],
    commonPatterns: [
      { issueType: 'Inline language changes not marked', fix: 'Add lang attribute to elements containing text in a different language', effort: 'low', codeExample: '<!-- Problem: French text not marked -->\n<p>The word bonjour means hello.</p>\n\n<!-- Fix: lang attribute on foreign text -->\n<p>The French word <span lang="fr">bonjour</span> means hello.</p>\n\n<!-- For larger blocks: -->\n<blockquote lang="es">\n  <p>Buenos días, ¿cómo estás?</p>\n</blockquote>', testingSteps: ['Identify text in languages other than the page default', 'Verify lang attribute is set on those elements'] },
    ],
  },
  '3.2.1': {
    code: '3.2.1', name: 'On Focus', level: 'A', category: 'Understandable',
    requirement: 'Receiving focus does not cause a change of context',
    documentationUrls: [
      { label: 'WCAG 3.2.1: On Focus', url: 'https://www.w3.org/WAI/WCAG22/Understanding/on-focus' },
    ],
    commonPatterns: [
      { issueType: 'Focus triggers navigation or form submit', fix: 'Only trigger context changes on explicit user activation (click/Enter)', effort: 'low', codeExample: '// Problem: auto-navigate on focus\nlink.addEventListener("focus", () => {\n  window.location = link.href; // Changes context on focus!\n});\n\n// Fix: only navigate on explicit activation\nlink.addEventListener("click", () => {\n  window.location = link.href;\n});\n\n// Problem: form auto-submits when field receives focus\n// Fix: require explicit submit button press\n<form onSubmit={handleSubmit}>\n  <input type="text" /> {/* no auto-submit on focus */}\n  <button type="submit">Submit</button>\n</form>', testingSteps: ['Tab to every focusable element', 'Verify no unexpected page changes, pop-ups, or form submissions on focus'] },
    ],
  },
  '3.2.2': {
    code: '3.2.2', name: 'On Input', level: 'A', category: 'Understandable',
    requirement: 'Changing a form control does not cause unexpected context change',
    documentationUrls: [
      { label: 'WCAG 3.2.2: On Input', url: 'https://www.w3.org/WAI/WCAG22/Understanding/on-input' },
    ],
    commonPatterns: [
      { issueType: 'Select change triggers navigation', fix: 'Warn users of context changes or use a submit button', effort: 'low', codeExample: '<!-- Problem: auto-navigates on select change -->\n<select onChange={(e) => window.location = e.target.value}>\n  <option value="/ca">California</option>\n  <option value="/co">Colorado</option>\n</select>\n\n<!-- Fix: use a Go button -->\n<label for="state-select">Choose state</label>\n<select id="state-select" value={selected} onChange={setSelected}>\n  <option value="/ca">California</option>\n  <option value="/co">Colorado</option>\n</select>\n<button onClick={() => navigate(selected)}>Go</button>', testingSteps: ['Change form controls — verify no unexpected navigation', 'Verify context changes require explicit action'] },
    ],
  },
  '3.2.3': {
    code: '3.2.3', name: 'Consistent Navigation', level: 'AA', category: 'Understandable',
    requirement: 'Navigation mechanisms are consistent across pages',
    documentationUrls: [
      { label: 'WCAG 3.2.3: Consistent Navigation', url: 'https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation' },
    ],
    commonPatterns: [
      { issueType: 'Navigation changes between pages', fix: 'Use shared layout components for consistent navigation across all pages', effort: 'medium', codeExample: '// Next.js: shared layout ensures consistent nav\n// app/layout.tsx\nexport default function RootLayout({ children }) {\n  return (\n    <html lang="en">\n      <body>\n        <Header />       {/* Same nav on every page */}\n        <SideNav />       {/* Same sidebar */}\n        <main>{children}</main>\n        <Footer />        {/* Same footer */}\n      </body>\n    </html>\n  );\n}\n\n// Each page only defines its unique content\n// app/reports/page.tsx\nexport default function ReportsPage() {\n  return <div>Page content only</div>;\n}', testingSteps: ['Navigate between multiple pages', 'Verify navigation order and items remain consistent'] },
    ],
  },
  '3.2.4': {
    code: '3.2.4', name: 'Consistent Identification', level: 'AA', category: 'Understandable',
    requirement: 'Components with the same functionality are identified consistently',
    documentationUrls: [
      { label: 'WCAG 3.2.4: Consistent Identification', url: 'https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification' },
    ],
    commonPatterns: [
      { issueType: 'Same function labeled differently', fix: 'Use consistent labels, icons, and names for the same functionality across pages', effort: 'low', codeExample: '<!-- Problem: inconsistent naming -->\n<!-- Page 1: -->\n<button>Search</button>\n<!-- Page 2: -->\n<button>Find</button>\n<!-- Page 3: -->\n<button>Look up</button>\n\n<!-- Fix: consistent naming across all pages -->\n<button>Search</button> <!-- Same label everywhere -->\n\n<!-- If icon + text, keep both consistent -->\n<button>\n  <SearchIcon aria-hidden="true" />\n  Search\n</button>', testingSteps: ['Audit common functions across pages (search, navigation, submit)', 'Verify same names and labels used consistently'] },
    ],
  },
  '3.3.1': {
    code: '3.3.1', name: 'Error Identification', level: 'A', category: 'Understandable',
    requirement: 'Input errors are automatically detected and described to the user in text',
    documentationUrls: [
      { label: 'WCAG 3.3.1: Error Identification', url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification' },
      { label: 'MDN: aria-invalid', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-invalid' },
      { label: 'MDN: aria-describedby', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby' },
    ],
    commonPatterns: [
      { issueType: 'Errors not announced', fix: 'Use aria-invalid, aria-describedby, and role="alert" for error messages', effort: 'medium', codeExample: 'function FormField({ label, error, ...props }) {\n  const id = useId();\n  const errorId = `${id}-error`;\n\n  return (\n    <div>\n      <label htmlFor={id}>{label}</label>\n      <input\n        id={id}\n        aria-invalid={!!error}\n        aria-describedby={error ? errorId : undefined}\n        {...props}\n      />\n      {error && (\n        <div id={errorId} role="alert" className="error-text">\n          {error}\n        </div>\n      )}\n    </div>\n  );\n}\n\n// Usage:\n<FormField\n  label="Email address"\n  type="email"\n  error={errors.email && "Please enter a valid email address"}\n/>', testingSteps: ['Submit form with invalid data', 'Verify error messages appear in text', 'Screen reader: verify errors are announced'] },
    ],
  },
  '3.3.2': {
    code: '3.3.2', name: 'Labels or Instructions', level: 'A', category: 'Understandable',
    requirement: 'Labels or instructions are provided when user input is required',
    documentationUrls: [
      { label: 'WCAG 3.3.2: Labels or Instructions', url: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions' },
      { label: 'W3C: Form Labels Tutorial', url: 'https://www.w3.org/WAI/tutorials/forms/labels/' },
    ],
    commonPatterns: [
      { issueType: 'Placeholder-only labels', fix: 'Add persistent visible labels; placeholder text disappears on input', effort: 'low', codeExample: '<!-- Problem: placeholder as only label -->\n<input type="search" placeholder="Search components..." />\n\n<!-- Fix Option 1: visible label -->\n<label for="search">Search components</label>\n<input type="search" id="search" placeholder="Type to search..." />\n\n<!-- Fix Option 2: visually hidden label -->\n<label for="search" class="visually-hidden">Search components</label>\n<input type="search" id="search" placeholder="Search..." />\n\n<!-- .visually-hidden CSS: -->\n.visually-hidden {\n  position: absolute;\n  width: 1px; height: 1px;\n  padding: 0; margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n}', testingSteps: ['Check all inputs have associated <label> or aria-label', 'Verify labels persist when input has value', 'Run axe-core — check label rule'] },
      { issueType: 'Required fields not indicated', fix: 'Mark required fields with aria-required and visible indicator', effort: 'low', codeExample: '<!-- Required field pattern -->\n<div>\n  <label for="name">\n    Full name <span aria-hidden="true" class="required">*</span>\n  </label>\n  <input\n    id="name"\n    aria-required="true"\n    required\n  />\n</div>\n\n<!-- Form-level instruction -->\n<p>Fields marked with <span aria-hidden="true">*</span>\n  <span class="visually-hidden">asterisk</span> are required.\n</p>', testingSteps: ['Check required fields have aria-required="true"', 'Verify visual required indicator exists'] },
    ],
  },
  '3.3.3': {
    code: '3.3.3', name: 'Error Suggestion', level: 'AA', category: 'Understandable',
    requirement: 'When input errors are detected and suggestions are known, they are provided to the user',
    documentationUrls: [
      { label: 'WCAG 3.3.3: Error Suggestion', url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion' },
    ],
    commonPatterns: [
      { issueType: 'Generic error messages', fix: 'Provide specific correction suggestions in error messages', effort: 'low', codeExample: '<!-- Problem: generic error -->\n<div role="alert">Invalid input</div>\n\n<!-- Fix: specific suggestion -->\n<div id="date-error" role="alert">\n  Please enter a date in MM/DD/YYYY format (e.g., 01/15/2026)\n</div>\n\n<!-- More examples: -->\n<div role="alert">\n  Password must be at least 8 characters and include\n  one uppercase letter and one number.\n</div>\n\n<div role="alert">\n  Email format: name@example.com\n</div>', testingSteps: ['Trigger validation errors', 'Verify error messages suggest how to correct the issue'] },
    ],
  },
  '3.3.4': {
    code: '3.3.4', name: 'Error Prevention (Legal, Financial, Data)', level: 'AA', category: 'Understandable',
    requirement: 'Submissions that cause legal/financial commitments are reversible, checked, or confirmed',
    documentationUrls: [
      { label: 'WCAG 3.3.4: Error Prevention', url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data' },
    ],
    commonPatterns: [
      { issueType: 'No confirmation for destructive actions', fix: 'Add confirmation dialog or undo capability for significant actions', effort: 'medium', codeExample: 'function DeleteConfirmation({ itemName, onConfirm, onCancel }) {\n  return (\n    <dialog open aria-modal="true" aria-labelledby="confirm-title">\n      <h2 id="confirm-title">Confirm Deletion</h2>\n      <p>\n        Are you sure you want to delete "{itemName}"?\n        This action cannot be undone.\n      </p>\n      <div>\n        <button onClick={onCancel} autoFocus>Cancel</button>\n        <button onClick={onConfirm} className="btn-danger">\n          Delete permanently\n        </button>\n      </div>\n    </dialog>\n  );\n}', testingSteps: ['Attempt destructive action — verify confirmation appears', 'Verify Cancel returns to previous state'] },
    ],
  },
  '3.3.7': {
    code: '3.3.7', name: 'Redundant Entry', level: 'A', category: 'Understandable',
    requirement: 'Information previously entered is auto-populated or available for selection',
    documentationUrls: [
      { label: 'WCAG 3.3.7: Redundant Entry', url: 'https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry' },
    ],
    commonPatterns: [
      { issueType: 'User must re-enter same data', fix: 'Auto-populate previously entered information or provide select from previous entries', effort: 'medium', codeExample: '// Multi-step form: pre-populate from earlier steps\nfunction ShippingStep({ billingAddress }) {\n  const [sameAsBilling, setSameAsBilling] = useState(true);\n  const [address, setAddress] = useState(billingAddress);\n\n  return (\n    <fieldset>\n      <legend>Shipping Address</legend>\n      <label>\n        <input\n          type="checkbox"\n          checked={sameAsBilling}\n          onChange={(e) => {\n            setSameAsBilling(e.target.checked);\n            if (e.target.checked) setAddress(billingAddress);\n          }}\n        />\n        Same as billing address\n      </label>\n      {/* Pre-populated fields */}\n      <input value={address.street} readOnly={sameAsBilling} />\n    </fieldset>\n  );\n}', testingSteps: ['Complete multi-step form', 'Verify previously entered data is not requested again'] },
    ],
  },
  '3.3.8': {
    code: '3.3.8', name: 'Accessible Authentication (Minimum)', level: 'AA', category: 'Understandable',
    requirement: 'No cognitive function test for authentication unless alternative is provided',
    documentationUrls: [
      { label: 'WCAG 3.3.8: Accessible Authentication', url: 'https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum' },
    ],
    commonPatterns: [
      { issueType: 'CAPTCHA without alternative', fix: 'Provide accessible CAPTCHA alternative or use passwordless authentication', effort: 'high', codeExample: '<!-- Critical: allow paste in password fields -->\n<input\n  type="password"\n  autocomplete="current-password"\n/>  <!-- Do NOT block paste -->\n\n<!-- Provide alternatives to visual CAPTCHA: -->\n<!-- Option 1: Audio CAPTCHA -->\n<!-- Option 2: Logic question -->\n<!-- Option 3: Email/SMS code -->\n<div>\n  <p>We sent a 6-digit code to your email.</p>\n  <label for="code">Enter verification code</label>\n  <input\n    id="code"\n    type="text"\n    inputMode="numeric"\n    autocomplete="one-time-code"\n    maxLength={6}\n  />\n</div>', testingSteps: ['Check auth flow for cognitive tests (puzzles, CAPTCHAs)', 'Verify paste is allowed in password fields', 'Verify alternative auth methods exist'] },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROBUST
  // ---------------------------------------------------------------------------
  '4.1.2': {
    code: '4.1.2', name: 'Name, Role, Value', level: 'A', category: 'Robust',
    requirement: 'All UI components have accessible name, role, and state that are programmatically determinable',
    documentationUrls: [
      { label: 'WCAG 4.1.2: Name, Role, Value', url: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value' },
      { label: 'WAI-ARIA Authoring Practices', url: 'https://www.w3.org/WAI/ARIA/apg/' },
      { label: 'MDN: ARIA states and properties', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes' },
    ],
    commonPatterns: [
      { issueType: 'Custom widget missing ARIA', fix: 'Add appropriate role, aria-label, and state attributes to custom components', effort: 'medium', codeExample: '// Custom tab panel with proper ARIA\nfunction TabPanel({ tabs, activeIndex, onChange }) {\n  return (\n    <>\n      <div role="tablist" aria-label="Report sections">\n        {tabs.map((tab, i) => (\n          <button\n            key={i}\n            role="tab"\n            aria-selected={i === activeIndex}\n            aria-controls={`panel-${i}`}\n            id={`tab-${i}`}\n            tabIndex={i === activeIndex ? 0 : -1}\n            onClick={() => onChange(i)}\n          >\n            {tab.label}\n          </button>\n        ))}\n      </div>\n      <div\n        role="tabpanel"\n        id={`panel-${activeIndex}`}\n        aria-labelledby={`tab-${activeIndex}`}\n      >\n        {tabs[activeIndex].content}\n      </div>\n    </>\n  );\n}', testingSteps: ['Run axe-core — check aria-roles and aria-valid-attr rules', 'Screen reader: verify widget role and state announced', 'Verify state changes (expanded, selected, checked) announced'] },
      { issueType: 'Toggle/expand missing aria-expanded', fix: 'Add aria-expanded to buttons that show/hide content', effort: 'low', codeExample: '// Expandable section with proper ARIA\nfunction Accordion({ title, children }) {\n  const [open, setOpen] = useState(false);\n  const panelId = useId();\n\n  return (\n    <div>\n      <button\n        aria-expanded={open}\n        aria-controls={panelId}\n        onClick={() => setOpen(!open)}\n      >\n        {open ? "▼" : "▶"} {title}\n      </button>\n      <div\n        id={panelId}\n        role="region"\n        aria-labelledby={/* button id */}\n        hidden={!open}\n      >\n        {children}\n      </div>\n    </div>\n  );\n}', testingSteps: ['Activate toggle — verify aria-expanded changes', 'Screen reader: verify expanded/collapsed state announced'] },
      { issueType: 'Missing aria-label on landmark or widget', fix: 'Add descriptive aria-label to navigation, search, and landmark regions', effort: 'low', codeExample: '<!-- Problem: unlabeled landmarks -->\n<nav>...</nav>\n<nav>...</nav>\n\n<!-- Fix: labeled landmarks -->\n<nav aria-label="Main navigation">...</nav>\n<nav aria-label="Footer navigation">...</nav>\n\n<!-- Complex widget -->\n<div role="treegrid" aria-label="Package inventory">\n  ...\n</div>', testingSteps: ['Check all landmark regions and complex widgets for aria-label', 'Screen reader: verify descriptive labels announced'] },
    ],
  },
  '4.1.3': {
    code: '4.1.3', name: 'Status Messages', level: 'AA', category: 'Robust',
    requirement: 'Status messages are announced to assistive technology without receiving focus',
    documentationUrls: [
      { label: 'WCAG 4.1.3: Status Messages', url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages' },
      { label: 'MDN: aria-live', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live' },
      { label: 'MDN: ARIA live regions', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions' },
    ],
    commonPatterns: [
      { issueType: 'Status updates not announced', fix: 'Use role="status", role="alert", or aria-live regions for dynamic messages', effort: 'low', codeExample: '// Live region for search results count\nfunction SearchResults({ query, results }) {\n  return (\n    <>\n      {/* aria-live region must exist in DOM BEFORE content changes */}\n      <div role="status" aria-live="polite" aria-atomic="true">\n        {results.length} results found for "{query}"\n      </div>\n\n      {/* For urgent errors: */}\n      <div role="alert" aria-live="assertive">\n        {error && `Error: ${error.message}`}\n      </div>\n\n      {/* For toast notifications: */}\n      <div\n        role="status"\n        aria-live="polite"\n        className="toast"\n      >\n        {toast && toast.message}\n      </div>\n    </>\n  );\n}', testingSteps: ['Trigger a status change (search, save, error)', 'Screen reader: verify message announced without moving focus', 'Check that aria-live region exists in DOM before content changes'] },
    ],
  },
}

// Helper: Get criterion info by code
export function getCriterionInfo(code: string): WCAGCriterionInfo | undefined {
  return wcagKnowledge[code]
}

// Helper: Get all criteria for a category
export function getCriteriaByCategory(category: WCAGCategory): WCAGCriterionInfo[] {
  return Object.values(wcagKnowledge).filter(c => c.category === category)
}

// Helper: Get related criteria that commonly co-fail
const coFailureMap: Record<string, string[]> = {
  '1.1.1': ['4.1.2', '2.4.4'],
  '1.3.1': ['3.3.2', '4.1.2', '1.3.2'],
  '1.4.3': ['1.4.11', '1.4.1'],
  '1.4.11': ['1.4.3', '2.4.7'],
  '2.1.1': ['2.1.2', '2.4.3', '2.4.7'],
  '2.1.2': ['2.1.1', '2.4.3'],
  '2.4.3': ['2.1.1', '2.4.7'],
  '2.4.6': ['1.3.1', '2.4.2'],
  '2.4.7': ['1.4.11', '2.1.1'],
  '3.3.2': ['1.3.1', '3.3.1', '4.1.2'],
  '4.1.2': ['1.3.1', '2.5.3', '3.3.2'],
}

export function getRelatedCriteria(code: string): string[] {
  return coFailureMap[code] ?? []
}
