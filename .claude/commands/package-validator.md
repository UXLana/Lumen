---
name: package-validator
description: Pre-publish validation for the Lumen Design System package. Runs 5 automated checks — barrel exports, token resolution, theme completeness, CLAUDE.md API accuracy, and package.json sanity — and outputs a structured PASS/WARN/FAIL report. Use this skill whenever the user mentions "validate package", "pre-publish check", "check package", "ready to publish", "publish check", "check exports", "verify package", or before any npm pack / tarball creation. Also use proactively before any package release, tarball build, or starter repo update.
---

# Package Validator

$ARGUMENTS

Pre-publish validation for the Lumen Design System package. This skill exists because a prototype starter testing session surfaced an entire class of bugs that silently ship — hardcoded `file:` paths in package.json, tokens resolving to undefined in consumer builds, documented components that aren't actually exported, wrong prop names in CLAUDE.md. These bugs are invisible to the author but block every consumer.

Run all 5 checks below, then output the report.

---

## Check 1: Barrel Export Completeness

**Why:** If a component exists in `components/` but isn't re-exported from `components/index.ts`, consumers get `undefined` on import. This happened with 14+ components in the v1.1.1 tarball.

**How:**
1. Read `components/index.ts` — collect every component name that IS exported
2. List all directories in `components/` — each directory is a component that SHOULD be exported
3. Cross-reference: flag any component directory that has no corresponding export in `index.ts`
4. Also check for type exports — each component should export its Props type

**Verdict:**
- PASS: Every component directory has a matching export (component + types)
- WARN: Component directory exists but only the component is exported (missing type export)
- FAIL: Component directory exists with no export at all

---

## Check 2: Token Resolution

**Why:** `tokensToVarRefs()` runs at module init and produces `var(--lumen-*)` strings. But if the function has a bug or the token structure changes, values silently resolve to `undefined`. DS-internal components work (they use the `@/` alias) but consumer imports break.

**How:**
1. Read `styles/design-tokens.ts`
2. Check that `tokensToVarRefs()` is called and its output is exported
3. Spot-check key token paths — verify they produce `var(--lumen-*)` strings, not raw hex or undefined:
   - `colors.brand.default`
   - `colors.surface.light`
   - `colors.text.highEmphasis.onLight`
   - `colors.border.lowEmphasis.onLight`
   - `colors.action.primary`
4. Check `spacing` — should be numeric keys (`spacing[1]`, `spacing[4]`), not named (`spacing.xs`)
5. Check `spacingSemantics` — should have named keys (`spacingSemantics.xs`, `.md`, `.xl`)
6. Check `borderRadius` and `borderRadiusSemantics` — verify `var(--lumen-radius-*)` pattern
7. Flag any exported token value that is `undefined`, empty string, or raw hex (not wrapped in `var()`)

**Verdict:**
- PASS: All spot-checked tokens resolve to `var(--lumen-*)` strings
- WARN: Deprecated aliases exist but map correctly
- FAIL: Any token resolves to undefined, empty, or raw value

---

## Check 3: Theme Completeness

**Why:** The v1.1.1 tarball shipped without RID and RID-Dark themes. Consumers building for those products got runtime errors.

**How:**
1. Read `styles/themes/index.ts` — check which themes are exported
2. Verify ALL expected themes are present and exported:
   - `traceTheme` from `./trace`
   - `universityTheme` from `./university`
   - `earthTheme` from `./earth`
   - `ridTheme` from `./rid`
   - `ridDarkTheme` from `./rid-dark`
   - `claudeLightTheme` from `./claude-light`
3. For each theme file, verify it exports an object that satisfies `ProductTheme` (has `name`, `colors`, `typography`, `borderRadius`, `elevation`, `spacing`, `iconStyle`)
4. Check that `themeMap` and `availableThemes` include all themes

**Verdict:**
- PASS: All 6 themes present, exported, and structurally complete
- WARN: Theme exists but is missing optional fields
- FAIL: Expected theme file missing or not exported from index

---

## Check 4: CLAUDE.md API Accuracy

**Why:** CLAUDE.md in the package/starter repo is the primary source PMs and AI agents use to write prototype code. If it documents `items` but the component uses `segments`, every generated prototype breaks. This happened with SegmentedControl, Input onChange, and spacing tokens.

**How:**
1. Read the project's `CLAUDE.md` (root level)
2. For each component mentioned in CLAUDE.md with API documentation:
   a. Read the actual component's TypeScript interface (the `*Props` type)
   b. Compare documented prop names against actual prop names
   c. Compare documented prop types against actual types
   d. Check callback signatures (e.g., `onChange` — is first arg the event or the value?)
3. Check documented token paths:
   - If CLAUDE.md says `spacing.xs` → FAIL (actual: `spacingSemantics.xs`)
   - If CLAUDE.md says `colors.stroke.*` → FAIL (actual: `colors.border.*`)
   - If CLAUDE.md says `borderRadiusSemantics.card` → verify it exists
4. Check documented component list against actual barrel exports:
   - If CLAUDE.md lists a component as available but it's not in `components/index.ts` → FAIL

**Known historical mismatches to specifically check:**
- SegmentedControl: `items` vs `segments`, `{ label, value }` vs `{ id, label }`
- Input: `onChange` signature — `(e) => e.target.value` vs `(value, event) => value`
- Spacing tokens: `spacing.xs` vs `spacingSemantics.xs`

**Verdict:**
- PASS: All documented APIs match actual TypeScript interfaces
- WARN: Minor differences (e.g., optional props not documented)
- FAIL: Wrong prop names, wrong callback signatures, wrong token paths, or documented components that don't exist

---

## Check 5: Package.json Sanity

**Why:** A `"file:../../Code/.claude/worktrees/xenodochial-herschel"` dependency shipped in the starter's package.json. `npm install` succeeded but created a broken symlink. This is a P0 blocker that's invisible to the author.

**How:**
1. Read `package.json`
2. Check ALL dependency fields (`dependencies`, `devDependencies`, `peerDependencies`, `optionalDependencies`):
   - Flag any `file:` protocol references (hardcoded local paths)
   - Flag any `link:` protocol references
   - Flag any absolute paths
3. Verify `version` is valid semver (X.Y.Z, optional pre-release suffix)
4. If `exports` field exists, verify each entry points to a file that actually exists
5. If `main`, `module`, or `types` fields exist, verify those files exist
6. Check for `files` field — if present, verify it includes `components/`, `styles/`, and any other required directories

**Verdict:**
- PASS: No local paths, valid semver, all entry points exist
- WARN: Missing `files` field (npm will use .npmignore or include everything)
- FAIL: Any `file:` or `link:` dependency, invalid semver, broken entry points

---

## Scoring

After running all checks, compute a publish-readiness score out of 100:

| Check | PASS | WARN | FAIL |
|-------|------|------|------|
| 1. Barrel Exports | 25 | 10 | 0 |
| 2. Token Resolution | 25 | 10 | 0 |
| 3. Theme Completeness | 20 | 10 | 0 |
| 4. CLAUDE.md Accuracy | 15 | 8 | 0 |
| 5. Package.json Sanity | 15 | 8 | 0 |

**Grade scale:**
- **100** — Ship it ✓
- **85–99** — Ship with notes (advisories only)
- **70–84** — Fix warns before shipping
- **< 70** — Do not ship (blocking failures present)

---

## Report Format

Output the report in this exact structure:

```
═══════════════════════════════════════════════════════
  LUMEN DESIGN SYSTEM — PRE-PUBLISH VALIDATION REPORT
═══════════════════════════════════════════════════════

  Package: [name from package.json]
  Version: [from package.json]
  Date:    [today]

───────────────────────────────────────────────────────

  1. BARREL EXPORTS          [PASS|WARN|FAIL]  +[pts]/25
     [Details — components checked, any missing]

  2. TOKEN RESOLUTION         [PASS|WARN|FAIL]  +[pts]/25
     [Details — tokens spot-checked, any failures]

  3. THEME COMPLETENESS       [PASS|WARN|FAIL]  +[pts]/20
     [Details — themes found, any missing]

  4. CLAUDE.md API ACCURACY   [PASS|WARN|FAIL]  +[pts]/15
     [Details — APIs checked, any mismatches]

  5. PACKAGE.JSON SANITY      [PASS|WARN|FAIL]  +[pts]/15
     [Details — deps checked, any issues]

───────────────────────────────────────────────────────

  SCORE:  [total]/100  —  [grade label]

  [If FAIL: list of blocking issues with file:line refs]
  [If WARN: list of advisories]
  [If 100: "Ready to publish."]

═══════════════════════════════════════════════════════
```

For each finding, include:
- The specific file and line number (`components/index.ts:42`)
- What was expected vs what was found
- A suggested fix

---

## When to Run

- Before `npm pack` or tarball creation
- Before updating any starter repo's DS dependency
- After adding/removing components
- After modifying `design-tokens.ts` or any theme file
- After editing CLAUDE.md component documentation
- When the user says "ready to publish" or "check the package"
