# Section 508 Compliance

Section 508 of the Rehabilitation Act requires federal agencies to make their electronic and information technology (EIT) accessible to people with disabilities. Since 2018, Section 508 has aligned with WCAG 2.0 Level AA.

## 508 Standards Overview

### Applicable Standards (Revised 2017)
The revised 508 standards incorporate WCAG 2.0 Level A and AA success criteria for web content and software.

| Standard | Applies To | Key Requirements |
|----------|------------|------------------|
| E205 | Electronic Content | WCAG 2.0 AA conformance |
| E501 | Software | Interoperability with AT |
| E502 | Authoring Tools | Accessible output, accessible interface |
| E503 | Applications | Status indicators, alternatives |

### WCAG Mapping

Section 508 E205 incorporates these WCAG 2.0 criteria:

**Perceivable**
- 1.1.1 Non-text Content (A)
- 1.2.1-1.2.5 Time-based Media (A, AA)
- 1.3.1-1.3.3 Adaptable (A)
- 1.4.1-1.4.5 Distinguishable (A, AA)

**Operable**
- 2.1.1-2.1.2 Keyboard Accessible (A)
- 2.2.1-2.2.2 Enough Time (A)
- 2.3.1 Seizures (A)
- 2.4.1-2.4.7 Navigable (A, AA)

**Understandable**
- 3.1.1-3.1.2 Readable (A, AA)
- 3.2.1-3.2.4 Predictable (A, AA)
- 3.3.1-3.3.4 Input Assistance (A, AA)

**Robust**
- 4.1.1-4.1.2 Compatible (A)

## Software-Specific Requirements (E501)

### Interoperability with Assistive Technology

```tsx
// Platform accessibility APIs must be used
// React components must expose:
// - Name (accessible name)
// - Role (component type)
// - State (current state)
// - Value (current value, if applicable)

<select
  id="facility"
  aria-label="Select facility"
  value={selectedFacility}
  onChange={handleChange}
>
  {facilities.map(f => (
    <option key={f.id} value={f.id}>{f.name}</option>
  ))}
</select>
```

### User Preferences for Platform Settings

```tsx
// Respect system-level accessibility settings
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const prefersHighContrast = window.matchMedia(
  '(prefers-contrast: more)'
).matches;

// Inherit color mode from system
const prefersDarkMode = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches;
```

### No Interference with AT Features

```tsx
// ❌ Don't override or interfere with AT
document.addEventListener('keydown', (e) => {
  // Don't capture keys used by screen readers
  if (e.key === 'Insert' || e.key === 'CapsLock') return;
});

// ❌ Don't disable selection or copying
user-select: none; // Avoid for text content

// ✓ Allow AT to function normally
// Let native focus handling work
// Don't trap keyboard focus unexpectedly
```

## Documentation Requirements

### VPAT (Voluntary Product Accessibility Template)

For government contracts, you may need to complete a VPAT documenting conformance.

#### VPAT Structure
```markdown
## Product Information
- Product Name: [Name]
- Product Version: [Version]
- Date: [Date]
- Contact: [Email/Phone]

## Evaluation Methods
- Testing tools used
- Assistive technologies tested
- Testing methodology

## Conformance Summary
| Standard | Conformance Level |
|----------|-------------------|
| WCAG 2.0 Level A | Supports / Partially Supports / Does Not Support |
| WCAG 2.0 Level AA | Supports / Partially Supports / Does Not Support |
| Section 508 | Supports / Partially Supports / Does Not Support |

## Detailed Remarks and Explanations
[For each criterion, document support level and any exceptions]
```

### Conformance Levels

| Level | Definition |
|-------|------------|
| Supports | Fully meets the criterion |
| Partially Supports | Some functionality meets criterion |
| Does Not Support | Majority does not meet criterion |
| Not Applicable | Criterion does not apply to product |

## Regulatory Software Requirements

For Metrc and similar compliance software used by government entities:

### Critical Form Requirements

```tsx
// All form submissions must be:
// 1. Verifiable before submission
// 2. Correctable if errors detected
// 3. Confirmed before irreversible actions

function RegulatoryForm({ onSubmit }) {
  const [step, setStep] = useState('input');
  const [data, setData] = useState({});
  const [errors, setErrors] = useState([]);

  const handleValidate = () => {
    const validationErrors = validateData(data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      // Announce errors to screen readers
      announceToScreenReader(
        `${validationErrors.length} errors found. Please correct before submitting.`
      );
      return;
    }
    setStep('review');
  };

  const handleSubmit = () => {
    setStep('confirm');
  };

  const handleConfirm = () => {
    onSubmit(data);
    setStep('complete');
  };

  return (
    <form>
      {step === 'input' && (
        <FormInputs data={data} onChange={setData} errors={errors} />
      )}
      
      {step === 'review' && (
        <ReviewSummary 
          data={data} 
          onEdit={() => setStep('input')}
          onSubmit={handleSubmit}
        />
      )}
      
      {step === 'confirm' && (
        <ConfirmationDialog
          message="This action will submit the transfer manifest. Continue?"
          onConfirm={handleConfirm}
          onCancel={() => setStep('review')}
        />
      )}
      
      {step === 'complete' && (
        <SuccessMessage data={data} />
      )}
    </form>
  );
}
```

### Audit Trail Accessibility

```tsx
// Audit trail entries must be accessible
function AuditLog({ entries }) {
  return (
    <table aria-label="Audit log">
      <thead>
        <tr>
          <th scope="col">Timestamp</th>
          <th scope="col">User</th>
          <th scope="col">Action</th>
          <th scope="col">Details</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(entry => (
          <tr key={entry.id}>
            <td>
              <time dateTime={entry.timestamp}>
                {formatDateTime(entry.timestamp)}
              </time>
            </td>
            <td>{entry.user}</td>
            <td>{entry.action}</td>
            <td>{entry.details}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Error Handling

```tsx
// Errors must be:
// 1. Identified in text (not just color)
// 2. Specific about what went wrong
// 3. Provide suggestions for correction
// 4. Linked to the invalid field

function FormField({ name, label, error, help, required }) {
  const errorId = error ? `${name}-error` : undefined;
  const helpId = help ? `${name}-help` : undefined;
  const describedBy = [errorId, helpId].filter(Boolean).join(' ') || undefined;

  return (
    <div>
      <label htmlFor={name}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      
      <input
        id={name}
        name={name}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
      />
      
      {help && (
        <p id={helpId} className="help-text">{help}</p>
      )}
      
      {error && (
        <p id={errorId} className="error-text" role="alert">
          <ErrorIcon aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
```

## Testing for 508 Compliance

### Required Testing

1. **Automated testing** (catches ~30% of issues)
   - axe DevTools
   - Lighthouse
   - WAVE

2. **Manual testing** (catches ~70% of issues)
   - Keyboard-only navigation
   - Screen reader testing (NVDA, JAWS, VoiceOver)
   - High contrast mode
   - 200% zoom

3. **Assistive technology testing**
   - NVDA (Windows, free)
   - JAWS (Windows, commercial)
   - VoiceOver (macOS/iOS, built-in)
   - TalkBack (Android, built-in)

### Testing Matrix

| Component | Keyboard | Screen Reader | High Contrast | Zoom |
|-----------|----------|---------------|---------------|------|
| Forms | ✓ | ✓ | ✓ | ✓ |
| Tables | ✓ | ✓ | ✓ | ✓ |
| Modals | ✓ | ✓ | ✓ | ✓ |
| Navigation | ✓ | ✓ | ✓ | ✓ |
| Data entry | ✓ | ✓ | ✓ | ✓ |

## Report Mode Output

For `--report` mode, generate documentation suitable for audits:

```markdown
# Section 508 Compliance Report

## Executive Summary
**Product:** [Name]
**Version:** [Version]
**Evaluation Date:** [Date]
**Evaluator:** [Name/Organization]

### Overall Conformance
- **WCAG 2.0 Level A:** [Supports/Partially Supports/Does Not Support]
- **WCAG 2.0 Level AA:** [Supports/Partially Supports/Does Not Support]
- **Section 508:** [Supports/Partially Supports/Does Not Support]

### Issue Summary
| Severity | Count |
|----------|-------|
| Critical | X |
| Serious | X |
| Moderate | X |
| Minor | X |

## Detailed Findings

### 1.1.1 Non-text Content (Level A)
**Conformance:** Supports
**Remarks:** All images have appropriate alternative text...

### 1.4.3 Contrast (Minimum) (Level AA)
**Conformance:** Partially Supports
**Remarks:** 2 instances of insufficient contrast found...

[Continue for each criterion]

## Remediation Plan
1. [Critical issue] - Target: [Date]
2. [Critical issue] - Target: [Date]
3. [Serious issue] - Target: [Date]

## Testing Methodology
- Automated: axe DevTools 4.x
- Manual: Keyboard navigation, zoom testing
- Assistive Technology: NVDA 2024.x, VoiceOver
```
