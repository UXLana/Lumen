# Accessibility Testing Strategy

**Date:** January 29, 2026
**Owner:** Design System Team
**Standard:** WCAG 2.2 Level AA + Section 508

---

## Executive Summary

This document outlines our multi-layered approach to accessibility testing, combining automated tools, screen reader testing, manual verification, and **Claude Code skills** to achieve VPAT compliance.

### 🤖 Claude Code Integration

This strategy leverages custom Claude Code skills to automate accessibility audits, generate reports, and streamline VPAT compliance. Developers can use these skills directly in their workflow.

**Skill Location:** [`/Skills/design-accessibility/SKILL.md`](https://github.com/UXLana/mtr-design-system/blob/main/Skills/design-accessibility/SKILL.md)

**Quick Start:**
```bash
# Run accessibility audit on a component
/design-accessibility components/Button

# Import axe DevTools results
/design-accessibility --from-axe

# Generate screen reader test scripts
/design-accessibility --screen-reader

# Generate VPAT compliance report
/design-accessibility --report
```

**Coverage Target:** 100% of WCAG 2.2 AA criteria
**Automation Level:** ~80% automated, ~20% manual

---

## Testing Layers

| Layer | Method | Coverage | Automation |
|-------|--------|----------|------------|
| 1 | Axe + Static Analysis | 30% | ✅ Fully automated |
| 2 | Virtual Screen Reader | +20% (50% total) | ✅ Fully automated |
| 3 | Real Screen Reader E2E | +30% (80% total) | ✅ Fully automated |
| 4 | Manual Screen Reader | +20% (100% total) | ❌ Human required |

---

## Layer 1: Automated Code Analysis

**Tools:**
- axe-core (via axe DevTools or jest-axe)
- ESLint jsx-a11y plugin

**What It Catches:**
- Missing labels and ARIA attributes
- Color contrast failures
- Semantic markup issues
- Keyboard traps
- Form accessibility

**Integration:**
- Runs on every commit (CI/CD)
- Blocks deployment if critical issues found

**Setup:**
```bash
npm install --save-dev axe-core jest-axe eslint-plugin-jsx-a11y
```

---

## Layer 2: Virtual Screen Reader (Unit Tests)

**Tool:** @guidepup/virtual-screen-reader

**What It Catches:**
- Incorrect announcements
- Missing accessible names
- Role/state issues
- Basic navigation order

**Integration:**
- Runs with unit tests
- Part of standard test suite

**Setup:**
```bash
npm install --save-dev @guidepup/virtual-screen-reader
```

**Example Test:**
```typescript
import { virtual } from "@guidepup/virtual-screen-reader";

test("Button announces correctly", async () => {
  document.body.innerHTML = `<button>Submit</button>`;
  await virtual.start({ container: document.body });
  await virtual.next();
  expect(await virtual.lastSpokenPhrase()).toBe("Submit, button");
  await virtual.stop();
});
```

---

## Layer 3: Real Screen Reader E2E

**Tools:**
- @guidepup/guidepup + Playwright (VoiceOver, NVDA)
- AssistivLabs (JAWS, cloud-based)

**What It Catches:**
- Timing issues
- Live region behavior
- Complex interaction patterns
- Browser-specific SR behavior

**Integration:**
- Runs on PR to main branch
- Requires macOS runner for VoiceOver

**Setup:**
```bash
npm install --save-dev @guidepup/guidepup @playwright/test
```

**CI/CD (GitHub Actions):**
```yaml
screen-reader-tests:
  runs-on: macos-latest
  steps:
    - uses: guidepup/setup-action@v1
    - run: npx playwright test --project=voiceover
```

---

## Layer 4: Manual Screen Reader Testing

**When Required:**
- Before major releases
- New feature launches
- VPAT documentation
- Subjective UX verification

**Screen Readers to Test:**
| Screen Reader | OS | Priority |
|---------------|-----|----------|
| VoiceOver | Mac | Required |
| NVDA | Windows | Required |
| JAWS | Windows | For government contracts |

**Process:**
1. Use `/design-accessibility --screen-reader` to generate test scripts
2. Tester follows script with real screen reader
3. Document results in test template
4. Log issues found

**Time Estimate:**
- Key user flows: 30-60 minutes per release
- Full audit: 4-8 hours

---

## Testing by Phase

### Development Phase
| Test | When | Who |
|------|------|-----|
| ESLint jsx-a11y | On save | Developer |
| Axe DevTools | During development | Developer |
| Virtual SR tests | With unit tests | Automated |

### PR/Code Review Phase
| Test | When | Who |
|------|------|-----|
| jest-axe tests | CI pipeline | Automated |
| Virtual SR tests | CI pipeline | Automated |
| Real SR E2E (critical paths) | CI pipeline | Automated |

### Pre-Release Phase
| Test | When | Who |
|------|------|-----|
| Full axe scan | Before release | QA |
| Manual SR testing (key flows) | Before release | QA |
| Keyboard navigation | Before release | QA |

### Annual/VPAT Phase
| Test | When | Who |
|------|------|-----|
| Full manual SR audit | Annually | QA or external firm |
| JAWS testing | For VPAT | AssistivLabs or external |
| VPAT documentation | As required | Compliance lead |

---

## Tools Summary

### Installed in Repo
| Package | Purpose |
|---------|---------|
| `axe-core` | Automated accessibility scanning |
| `jest-axe` | Axe integration for Jest |
| `@guidepup/virtual-screen-reader` | Simulated SR for unit tests |
| `@guidepup/guidepup` | Real SR automation |
| `@playwright/test` | E2E test runner |
| `eslint-plugin-jsx-a11y` | Lint-time a11y checks |

### External Services (Optional)
| Service | Purpose | When to Use |
|---------|---------|-------------|
| AssistivLabs | Cloud SR testing | JAWS testing, VPAT evidence |
| Deque/Level Access | External audit | Formal VPAT certification |

### Claude Code Skills
> 📁 **Skill Location:** [`/Skills/design-accessibility/SKILL.md`](https://github.com/UXLana/mtr-design-system/blob/main/Skills/design-accessibility/SKILL.md)

| Command | Purpose |
|---------|---------|
| `/design-accessibility [target]` | Audit local components for WCAG violations |
| `/design-accessibility --from-axe` | Import and process axe DevTools JSON results |
| `/design-accessibility --external` | Audit pages behind login walls (manual input) |
| `/design-accessibility --screen-reader` | Generate screen reader test scripts |
| `/design-accessibility --manual` | Interactive manual testing checklist |
| `/design-accessibility --report` | Generate VPAT-style compliance report |

**How to Use:**
1. Open your project in Claude Code
2. Run any command above in the chat
3. Follow the prompts to complete the audit
4. Share generated reports with stakeholders

---

## VPAT Compliance Workflow

```
┌─────────────────────────────────────────────────────────┐
│                    VPAT WORKFLOW                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Run automated scans (axe + virtual SR)              │
│           ↓                                             │
│  2. Generate report: /design-accessibility --report     │
│           ↓                                             │
│  3. Run manual SR tests on key flows                    │
│           ↓                                             │
│  4. Document results in test templates                  │
│           ↓                                             │
│  5. Compile VPAT with evidence                          │
│           ↓                                             │
│  6. (Optional) External audit for certification         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Automated test coverage | 80% of WCAG criteria |
| Critical issues in production | 0 |
| Time to audit new feature | < 1 hour |
| VPAT refresh cycle | Annually or on major release |

---

## Responsibilities

| Role | Responsibilities |
|------|------------------|
| **Developers** | Run axe during development, write SR unit tests |
| **QA** | Manual SR testing, pre-release audits |
| **Design System Team** | Maintain skill, update test patterns |
| **Compliance Lead** | VPAT documentation, external audit coordination |

---

## Next Steps

1. [ ] Install packages: `npm install --save-dev axe-core jest-axe @guidepup/virtual-screen-reader @guidepup/guidepup @playwright/test eslint-plugin-jsx-a11y`
2. [ ] Add axe tests to existing test suite
3. [ ] Set up CI/CD pipeline for automated checks
4. [ ] Train QA on manual SR testing
5. [ ] Schedule first full audit

---

## Resources

- [Guidepup Documentation](https://www.guidepup.dev/docs/intro)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [AssistivLabs](https://assistivlabs.com/)
- [Claude Code Accessibility Skill](https://github.com/UXLana/mtr-design-system/blob/main/Skills/design-accessibility/SKILL.md)
