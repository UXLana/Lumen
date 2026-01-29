# Screen Reader Testing Guide

## Overview

Screen reader testing verifies that users who rely on assistive technology can understand and operate your application. Automated tools catch ~30% of issues; the remaining ~70% require screen reader testing.

---

## Testing Approaches

### 1. Virtual Screen Reader (Automated - Unit Tests)

Use **Guidepup Virtual Screen Reader** for automated unit tests. It simulates screen reader behavior in your test suite.

**Install:**
```bash
npm install --save-dev @guidepup/virtual-screen-reader
```

**Example Test:**
```typescript
import { virtual } from "@guidepup/virtual-screen-reader";

describe("Button", () => {
  it("announces correctly", async () => {
    document.body.innerHTML = `
      <button type="button">Submit Form</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("Submit Form, button");

    await virtual.stop();
  });

  it("announces disabled state", async () => {
    document.body.innerHTML = `
      <button type="button" disabled>Submit Form</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toMatch(/Submit Form.*button.*disabled|dimmed|unavailable/i);

    await virtual.stop();
  });
});
```

**Coverage:**
- What elements announce
- Accessible names
- Roles and states
- Basic navigation order

**Limitations:**
- Not a real screen reader
- May not catch timing/live region issues
- Browser-specific behaviors not tested

---

### 2. Real Screen Reader Automation (E2E Tests)

Use **Guidepup** with **Playwright** for real screen reader testing in CI/CD.

**Install:**
```bash
npm install --save-dev @guidepup/guidepup @guidepup/playwright @playwright/test
```

**GitHub Actions Setup:**
```yaml
- name: Setup Screen Reader
  uses: guidepup/setup-action@v1

- name: Run Screen Reader Tests
  run: npx playwright test
```

**Example Test:**
```typescript
import { voiceOver } from "@guidepup/guidepup";
import { test, expect } from "@playwright/test";

test("can complete checkout flow", async ({ page }) => {
  await page.goto("https://your-app.com/checkout");

  await voiceOver.start();

  // Navigate to first form field
  await voiceOver.perform(voiceOver.keyboardCommands.findNextFormControl);
  expect(await voiceOver.lastSpokenPhrase()).toContain("Email");

  // Fill and continue
  await voiceOver.type("user@example.com");
  await voiceOver.perform(voiceOver.keyboardCommands.findNextFormControl);

  // ... continue flow

  await voiceOver.stop();
});
```

**Coverage:**
- Real VoiceOver (Mac) or NVDA (Windows)
- Actual announcements
- Timing and live regions
- Full user flows

---

### 3. AssistivLabs (Cloud-Based Real SR)

**AssistivLabs** provides cloud access to real screen readers without local setup.

**Features:**
- JAWS, NVDA, VoiceOver, Narrator, ZoomText
- Browser automation integration
- Test on localhost via tunnel
- Records sessions for evidence

**Best For:**
- Testing JAWS (expensive to license locally)
- Cross-platform SR testing from Mac
- VPAT evidence/documentation

**Integration:**
- API available for CI/CD
- Contact sales for enterprise integration
- Manual testing available via web interface

---

### 4. Manual Testing (Required for VPAT)

Some things must be tested manually by a human.

**When Manual is Required:**
- "Does this make sense?" (subjective)
- Complex interaction patterns
- Content comprehension
- Error recovery flows

**See:** `testing-checklist.md` for manual test scripts

---

## Expected Announcements by Component

### Button
| State | Expected Announcement |
|-------|----------------------|
| Default | "{label}, button" |
| Disabled | "{label}, button, dimmed/unavailable" |
| Pressed (toggle) | "{label}, toggle button, pressed/not pressed" |
| Loading | "{label}, button, busy" or live region: "Loading..." |

### Link
| State | Expected Announcement |
|-------|----------------------|
| Default | "{text}, link" |
| Visited | "{text}, visited, link" |
| Current page | "{text}, current page, link" |

### Text Input
| State | Expected Announcement |
|-------|----------------------|
| Empty | "{label}, edit text" |
| With value | "{label}, {value}, edit text" |
| Required | "{label}, required, edit text" |
| Invalid | "{label}, invalid entry, edit text" |
| With description | "{label}, {description}, edit text" |

### Checkbox
| State | Expected Announcement |
|-------|----------------------|
| Unchecked | "{label}, checkbox, not checked" |
| Checked | "{label}, checkbox, checked" |
| Indeterminate | "{label}, checkbox, mixed" |

### Select/Dropdown
| State | Expected Announcement |
|-------|----------------------|
| Collapsed | "{label}, {selected value}, popup button" |
| Expanded | "{label}, {selected value}, popup button, expanded" |
| Option | "{option text}" or "{option text}, selected" |

### Modal/Dialog
| Event | Expected Announcement |
|-------|----------------------|
| Opens | "{title}, dialog" or web dialog announcement |
| Focus | First focusable element announced |
| Close | Focus returns, no special announcement needed |

### Tab/TabPanel
| State | Expected Announcement |
|-------|----------------------|
| Tab | "{label}, tab, {n} of {total}" |
| Selected tab | "{label}, selected, tab, {n} of {total}" |
| Panel | Content of panel when selected |

### Alert/Notification
| Type | Expected Announcement |
|------|----------------------|
| Alert (assertive) | Interrupts: "{message}" |
| Status (polite) | Waits for pause: "{message}" |
| Error | "Error: {message}" or similar |

### Table
| Element | Expected Announcement |
|---------|----------------------|
| Table | "{caption}, table, {rows} rows, {cols} columns" |
| Header cell | "{text}, column header" |
| Data cell | "{column header}, {text}" |

---

## CI/CD Integration

### Recommended Pipeline

```yaml
name: Accessibility Tests

on: [push, pull_request]

jobs:
  # Fast - runs on every push
  automated-a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:axe      # axe-core scans
      - run: npm run test:a11y     # virtual screen reader

  # Slower - runs on PR to main only
  screen-reader-e2e:
    runs-on: macos-latest  # Required for VoiceOver
    if: github.base_ref == 'main'
    steps:
      - uses: actions/checkout@v4
      - uses: guidepup/setup-action@v1
      - run: npm ci
      - run: npx playwright test --project=voiceover
```

### Test Organization

```
tests/
├── unit/
│   └── components/
│       ├── Button.a11y.test.ts    # Virtual SR tests
│       └── Modal.a11y.test.ts
├── e2e/
│   └── flows/
│       ├── checkout.sr.test.ts    # Real SR tests
│       └── login.sr.test.ts
└── manual/
    └── checklists/
        ├── checkout-flow.md       # Manual test scripts
        └── admin-dashboard.md
```

---

## Quick Start Checklist

- [ ] Install `@guidepup/virtual-screen-reader` for unit tests
- [ ] Add virtual SR tests for each component
- [ ] Set up Guidepup + Playwright for E2E (optional)
- [ ] Create manual test scripts for key flows
- [ ] Run manual SR testing before releases
- [ ] Document results for VPAT evidence

---

## Resources

- [Guidepup Documentation](https://www.guidepup.dev/docs/intro)
- [Virtual Screen Reader API](https://www.guidepup.dev/docs/api/class-guidepup-virtual-screen-reader)
- [AssistivLabs](https://assistivlabs.com/)
- [WebAIM Screen Reader Survey](https://webaim.org/projects/screenreadersurvey/)
