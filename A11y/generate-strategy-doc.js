const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeadingLevel, PageBreak } = require("docx");
const fs = require("fs");

// Colors matching VPAT template
const headerBlue = "1A5276";
const borderGray = "CCCCCC";

function createHeaderCell(text) {
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 22 })],
      alignment: AlignmentType.CENTER
    })],
    shading: { fill: headerBlue },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: borderGray },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: borderGray },
      left: { style: BorderStyle.SINGLE, size: 1, color: borderGray },
      right: { style: BorderStyle.SINGLE, size: 1, color: borderGray }
    }
  });
}

function createCell(text, bold = false) {
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text, bold, size: 22 })]
    })],
    shading: { fill: "FFFFFF" },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: borderGray },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: borderGray },
      left: { style: BorderStyle.SINGLE, size: 1, color: borderGray },
      right: { style: BorderStyle.SINGLE, size: 1, color: borderGray }
    }
  });
}

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      // Title
      new Paragraph({
        children: [new TextRun({ text: "Accessibility Testing Strategy", bold: true, size: 48, color: headerBlue })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),

      // Metadata
      new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("January 29, 2026")] }),
      new Paragraph({ children: [new TextRun({ text: "Owner: ", bold: true }), new TextRun("Design System Team")] }),
      new Paragraph({ children: [new TextRun({ text: "Standard: ", bold: true }), new TextRun("WCAG 2.2 Level AA + Section 508")], spacing: { after: 400 } }),

      // Executive Summary
      new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Paragraph({
        text: "This document outlines our multi-layered approach to accessibility testing, combining automated tools, screen reader testing, manual verification, and Claude Code skills to achieve VPAT compliance.",
        spacing: { after: 200 }
      }),
      new Paragraph({ children: [new TextRun({ text: "Coverage Target: ", bold: true }), new TextRun("100% of WCAG 2.2 AA criteria")] }),
      new Paragraph({ children: [new TextRun({ text: "Automation Level: ", bold: true }), new TextRun("~80% automated, ~20% manual")], spacing: { after: 400 } }),

      // Claude Code Integration
      new Paragraph({ text: "Claude Code Integration", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Paragraph({
        text: "This strategy leverages custom Claude Code skills to automate accessibility audits, generate reports, and streamline VPAT compliance. Developers can use these skills directly in their workflow.",
        spacing: { after: 200 }
      }),
      new Paragraph({ children: [new TextRun({ text: "Skill Location: ", bold: true }), new TextRun("https://github.com/UXLana/mtr-design-system/blob/main/Skills/design-accessibility/SKILL.md")], spacing: { after: 200 } }),
      new Paragraph({ children: [new TextRun({ text: "Quick Start Commands:", bold: true })], spacing: { before: 200 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [createHeaderCell("Command"), createHeaderCell("Purpose")] }),
          new TableRow({ children: [createCell("/design-accessibility [target]"), createCell("Audit local components for WCAG violations")] }),
          new TableRow({ children: [createCell("/design-accessibility --from-axe"), createCell("Import and process axe DevTools JSON results")] }),
          new TableRow({ children: [createCell("/design-accessibility --external"), createCell("Audit pages behind login walls (manual input)")] }),
          new TableRow({ children: [createCell("/design-accessibility --screen-reader"), createCell("Generate screen reader test scripts")] }),
          new TableRow({ children: [createCell("/design-accessibility --manual"), createCell("Interactive manual testing checklist")] }),
          new TableRow({ children: [createCell("/design-accessibility --report"), createCell("Generate VPAT-style compliance report")] }),
        ]
      }),
      new Paragraph({ children: [new TextRun({ text: "How to Use:", bold: true })], spacing: { before: 200 } }),
      new Paragraph({ text: "1. Open your project in Claude Code" }),
      new Paragraph({ text: "2. Run any command above in the chat" }),
      new Paragraph({ text: "3. Follow the prompts to complete the audit" }),
      new Paragraph({ text: "4. Share generated reports with stakeholders", spacing: { after: 400 } }),

      // Testing Layers
      new Paragraph({ text: "Testing Layers", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [createHeaderCell("Layer"), createHeaderCell("Method"), createHeaderCell("Coverage"), createHeaderCell("Automation")] }),
          new TableRow({ children: [createCell("1"), createCell("Axe + Static Analysis"), createCell("30%"), createCell("✓ Fully automated")] }),
          new TableRow({ children: [createCell("2"), createCell("Virtual Screen Reader"), createCell("+20% (50% total)"), createCell("✓ Fully automated")] }),
          new TableRow({ children: [createCell("3"), createCell("Real Screen Reader E2E"), createCell("+30% (80% total)"), createCell("✓ Fully automated")] }),
          new TableRow({ children: [createCell("4"), createCell("Manual Screen Reader"), createCell("+20% (100% total)"), createCell("✗ Human required")] }),
        ]
      }),

      // Layer 1
      new Paragraph({ text: "Layer 1: Automated Code Analysis", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Paragraph({ children: [new TextRun({ text: "Tools: ", bold: true }), new TextRun("axe-core (via axe DevTools or jest-axe), ESLint jsx-a11y plugin")] }),
      new Paragraph({ children: [new TextRun({ text: "What It Catches:", bold: true })], spacing: { before: 200 } }),
      new Paragraph({ text: "• Missing labels and ARIA attributes" }),
      new Paragraph({ text: "• Color contrast failures" }),
      new Paragraph({ text: "• Semantic markup issues" }),
      new Paragraph({ text: "• Keyboard traps" }),
      new Paragraph({ text: "• Form accessibility" }),
      new Paragraph({ children: [new TextRun({ text: "Integration: ", bold: true }), new TextRun("Runs on every commit (CI/CD), blocks deployment if critical issues found")], spacing: { before: 200 } }),
      new Paragraph({ children: [new TextRun({ text: "Setup: ", bold: true }), new TextRun("npm install --save-dev axe-core jest-axe eslint-plugin-jsx-a11y")], spacing: { before: 200 } }),

      // Layer 2
      new Paragraph({ text: "Layer 2: Virtual Screen Reader (Unit Tests)", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Paragraph({ children: [new TextRun({ text: "Tool: ", bold: true }), new TextRun("@guidepup/virtual-screen-reader")] }),
      new Paragraph({ children: [new TextRun({ text: "What It Catches:", bold: true })], spacing: { before: 200 } }),
      new Paragraph({ text: "• Incorrect announcements" }),
      new Paragraph({ text: "• Missing accessible names" }),
      new Paragraph({ text: "• Role/state issues" }),
      new Paragraph({ text: "• Basic navigation order" }),
      new Paragraph({ children: [new TextRun({ text: "Integration: ", bold: true }), new TextRun("Runs with unit tests, part of standard test suite")], spacing: { before: 200 } }),
      new Paragraph({ children: [new TextRun({ text: "Setup: ", bold: true }), new TextRun("npm install --save-dev @guidepup/virtual-screen-reader")], spacing: { before: 200 } }),

      // Layer 3
      new Paragraph({ text: "Layer 3: Real Screen Reader E2E", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Paragraph({ children: [new TextRun({ text: "Tools: ", bold: true }), new TextRun("@guidepup/guidepup + Playwright (VoiceOver, NVDA), AssistivLabs (JAWS, cloud-based)")] }),
      new Paragraph({ children: [new TextRun({ text: "What It Catches:", bold: true })], spacing: { before: 200 } }),
      new Paragraph({ text: "• Timing issues" }),
      new Paragraph({ text: "• Live region behavior" }),
      new Paragraph({ text: "• Complex interaction patterns" }),
      new Paragraph({ text: "• Browser-specific SR behavior" }),
      new Paragraph({ children: [new TextRun({ text: "Integration: ", bold: true }), new TextRun("Runs on PR to main branch, requires macOS runner for VoiceOver")], spacing: { before: 200 } }),
      new Paragraph({ children: [new TextRun({ text: "Setup: ", bold: true }), new TextRun("npm install --save-dev @guidepup/guidepup @playwright/test")], spacing: { before: 200 } }),

      // Layer 4
      new Paragraph({ text: "Layer 4: Manual Screen Reader Testing", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Paragraph({ children: [new TextRun({ text: "When Required:", bold: true })], spacing: { before: 200 } }),
      new Paragraph({ text: "• Before major releases" }),
      new Paragraph({ text: "• New feature launches" }),
      new Paragraph({ text: "• VPAT documentation" }),
      new Paragraph({ text: "• Subjective UX verification" }),
      new Paragraph({ children: [new TextRun({ text: "Screen Readers to Test:", bold: true })], spacing: { before: 200 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [createHeaderCell("Screen Reader"), createHeaderCell("OS"), createHeaderCell("Priority")] }),
          new TableRow({ children: [createCell("VoiceOver"), createCell("Mac"), createCell("Required")] }),
          new TableRow({ children: [createCell("NVDA"), createCell("Windows"), createCell("Required")] }),
          new TableRow({ children: [createCell("JAWS"), createCell("Windows"), createCell("For government contracts")] }),
        ]
      }),
      new Paragraph({ children: [new TextRun({ text: "Time Estimate: ", bold: true }), new TextRun("Key user flows: 30-60 minutes per release. Full audit: 4-8 hours.")], spacing: { before: 200 } }),

      // Page break
      new Paragraph({ children: [new PageBreak()] }),

      // Testing by Phase
      new Paragraph({ text: "Testing by Phase", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),

      new Paragraph({ text: "Development Phase", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [createHeaderCell("Test"), createHeaderCell("When"), createHeaderCell("Who")] }),
          new TableRow({ children: [createCell("ESLint jsx-a11y"), createCell("On save"), createCell("Developer")] }),
          new TableRow({ children: [createCell("Axe DevTools"), createCell("During development"), createCell("Developer")] }),
          new TableRow({ children: [createCell("Virtual SR tests"), createCell("With unit tests"), createCell("Automated")] }),
        ]
      }),

      new Paragraph({ text: "PR/Code Review Phase", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [createHeaderCell("Test"), createHeaderCell("When"), createHeaderCell("Who")] }),
          new TableRow({ children: [createCell("jest-axe tests"), createCell("CI pipeline"), createCell("Automated")] }),
          new TableRow({ children: [createCell("Virtual SR tests"), createCell("CI pipeline"), createCell("Automated")] }),
          new TableRow({ children: [createCell("Real SR E2E (critical paths)"), createCell("CI pipeline"), createCell("Automated")] }),
        ]
      }),

      new Paragraph({ text: "Pre-Release Phase", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [createHeaderCell("Test"), createHeaderCell("When"), createHeaderCell("Who")] }),
          new TableRow({ children: [createCell("Full axe scan"), createCell("Before release"), createCell("QA")] }),
          new TableRow({ children: [createCell("Manual SR testing (key flows)"), createCell("Before release"), createCell("QA")] }),
          new TableRow({ children: [createCell("Keyboard navigation"), createCell("Before release"), createCell("QA")] }),
        ]
      }),

      new Paragraph({ text: "Annual/VPAT Phase", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [createHeaderCell("Test"), createHeaderCell("When"), createHeaderCell("Who")] }),
          new TableRow({ children: [createCell("Full manual SR audit"), createCell("Annually"), createCell("QA or external firm")] }),
          new TableRow({ children: [createCell("JAWS testing"), createCell("For VPAT"), createCell("AssistivLabs or external")] }),
          new TableRow({ children: [createCell("VPAT documentation"), createCell("As required"), createCell("Compliance lead")] }),
        ]
      }),

      // Tools Summary
      new Paragraph({ text: "Tools Summary", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),

      new Paragraph({ text: "Installed in Repo", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [createHeaderCell("Package"), createHeaderCell("Purpose")] }),
          new TableRow({ children: [createCell("axe-core"), createCell("Automated accessibility scanning")] }),
          new TableRow({ children: [createCell("jest-axe"), createCell("Axe integration for Jest")] }),
          new TableRow({ children: [createCell("@guidepup/virtual-screen-reader"), createCell("Simulated SR for unit tests")] }),
          new TableRow({ children: [createCell("@guidepup/guidepup"), createCell("Real SR automation")] }),
          new TableRow({ children: [createCell("@playwright/test"), createCell("E2E test runner")] }),
          new TableRow({ children: [createCell("eslint-plugin-jsx-a11y"), createCell("Lint-time a11y checks")] }),
        ]
      }),

      new Paragraph({ text: "External Services (Optional)", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [createHeaderCell("Service"), createHeaderCell("Purpose"), createHeaderCell("When to Use")] }),
          new TableRow({ children: [createCell("AssistivLabs"), createCell("Cloud SR testing"), createCell("JAWS testing, VPAT evidence")] }),
          new TableRow({ children: [createCell("Deque/Level Access"), createCell("External audit"), createCell("Formal VPAT certification")] }),
        ]
      }),

      new Paragraph({ text: "Claude Code Skills", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
      new Paragraph({ children: [new TextRun({ text: "Skill Location: ", bold: true }), new TextRun("https://github.com/UXLana/mtr-design-system/blob/main/Skills/design-accessibility/SKILL.md")], spacing: { after: 100 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [createHeaderCell("Command"), createHeaderCell("Purpose")] }),
          new TableRow({ children: [createCell("/design-accessibility [target]"), createCell("Audit local components for WCAG violations")] }),
          new TableRow({ children: [createCell("/design-accessibility --from-axe"), createCell("Import and process axe DevTools JSON results")] }),
          new TableRow({ children: [createCell("/design-accessibility --external"), createCell("Audit pages behind login walls")] }),
          new TableRow({ children: [createCell("/design-accessibility --screen-reader"), createCell("Generate screen reader test scripts")] }),
          new TableRow({ children: [createCell("/design-accessibility --manual"), createCell("Interactive manual testing checklist")] }),
          new TableRow({ children: [createCell("/design-accessibility --report"), createCell("Generate VPAT-style compliance report")] }),
        ]
      }),

      // VPAT Compliance Workflow
      new Paragraph({ text: "VPAT Compliance Workflow", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Paragraph({ text: "1. Run automated scans (axe + virtual SR)" }),
      new Paragraph({ text: "2. Generate report: /design-accessibility --report" }),
      new Paragraph({ text: "3. Run manual SR tests on key flows" }),
      new Paragraph({ text: "4. Document results in test templates" }),
      new Paragraph({ text: "5. Compile VPAT with evidence" }),
      new Paragraph({ text: "6. (Optional) External audit for certification" }),

      // Success Metrics
      new Paragraph({ text: "Success Metrics", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [createHeaderCell("Metric"), createHeaderCell("Target")] }),
          new TableRow({ children: [createCell("Automated test coverage"), createCell("80% of WCAG criteria")] }),
          new TableRow({ children: [createCell("Critical issues in production"), createCell("0")] }),
          new TableRow({ children: [createCell("Time to audit new feature"), createCell("< 1 hour")] }),
          new TableRow({ children: [createCell("VPAT refresh cycle"), createCell("Annually or on major release")] }),
        ]
      }),

      // Responsibilities
      new Paragraph({ text: "Responsibilities", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [createHeaderCell("Role"), createHeaderCell("Responsibilities")] }),
          new TableRow({ children: [createCell("Developers", true), createCell("Run axe during development, write SR unit tests")] }),
          new TableRow({ children: [createCell("QA", true), createCell("Manual SR testing, pre-release audits")] }),
          new TableRow({ children: [createCell("Design System Team", true), createCell("Maintain skill, update test patterns")] }),
          new TableRow({ children: [createCell("Compliance Lead", true), createCell("VPAT documentation, external audit coordination")] }),
        ]
      }),

      // Next Steps
      new Paragraph({ text: "Next Steps", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Paragraph({ text: "☐ Install packages: npm install --save-dev axe-core jest-axe @guidepup/virtual-screen-reader @guidepup/guidepup @playwright/test eslint-plugin-jsx-a11y" }),
      new Paragraph({ text: "☐ Add axe tests to existing test suite" }),
      new Paragraph({ text: "☐ Set up CI/CD pipeline for automated checks" }),
      new Paragraph({ text: "☐ Train QA on manual SR testing" }),
      new Paragraph({ text: "☐ Schedule first full audit" }),

      // Resources
      new Paragraph({ text: "Resources", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Paragraph({ text: "• Guidepup Documentation: https://www.guidepup.dev/docs/intro" }),
      new Paragraph({ text: "• axe-core Rules: https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md" }),
      new Paragraph({ text: "• WCAG 2.2 Quick Reference: https://www.w3.org/WAI/WCAG22/quickref/" }),
      new Paragraph({ text: "• AssistivLabs: https://assistivlabs.com/" }),
      new Paragraph({ text: "• Claude Code Accessibility Skill: https://github.com/UXLana/mtr-design-system/blob/main/Skills/design-accessibility/SKILL.md" }),
    ]
  }]
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/Users/lanaholston/Desktop/Code/A11Y/Accessibility-Testing-Strategy.docx", buffer);
  console.log("✅ Strategy document created: /Users/lanaholston/Desktop/Code/A11Y/Accessibility-Testing-Strategy.docx");
});
