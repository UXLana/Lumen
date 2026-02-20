const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} = require("docx");
const fs = require("fs");

// Color constants matching template
const COLORS = {
  headerBlue: "1A5276",
  headerText: "FFFFFF",
  yellowStatus: "F9E79F",
  borderGray: "CCCCCC",
  white: "FFFFFF",
};

const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.borderGray },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.borderGray },
  left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.borderGray },
  right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.borderGray },
};

function createTable(headers, rows) {
  const headerCells = headers.map(
    (h) =>
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: h, bold: true, color: COLORS.headerText })],
          }),
        ],
        shading: { fill: COLORS.headerBlue },
        borders: tableBorders,
      })
  );

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: cell })] })],
              shading: { fill: COLORS.white },
              borders: tableBorders,
            })
        ),
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: headerCells }), ...dataRows],
  });
}

function createIssueTable(rows) {
  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: row[0], bold: true })] })],
            shading: { fill: COLORS.white },
            borders: tableBorders,
            width: { size: 25, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: row[1] })] })],
            shading: { fill: COLORS.white },
            borders: tableBorders,
            width: { size: 75, type: WidthType.PERCENTAGE },
          }),
        ],
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: dataRows,
  });
}

async function generateReport() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: "Accessibility Compliance Report",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Date: January 29, 2026 | Page: Retail ID - Label Template Editor",
                italics: true,
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // Executive Summary
          new Paragraph({
            text: "Executive Summary",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: "The Label Template Editor interface was evaluated against WCAG 2.2 Level AA success criteria. The audit identified 8 accessibility issues that require remediation.",
          }),
          new Paragraph({ text: "" }),

          // Issue Summary Table
          createTable(
            ["Severity", "Count", "Status"],
            [
              ["Serious", "3", "Must fix before release"],
              ["Moderate", "3", "Fix in next iteration"],
              ["Minor", "2", "Recommended improvements"],
            ]
          ),
          new Paragraph({ text: "" }),

          new Paragraph({
            children: [
              new TextRun({ text: "Overall Compliance Status: ", bold: true }),
              new TextRun({ text: "Needs Remediation", bold: true }),
            ],
          }),
          new Paragraph({ text: "" }),

          // Detailed Findings
          new Paragraph({
            text: "Detailed Findings",
            heading: HeadingLevel.HEADING_2,
          }),

          // Serious Issues
          new Paragraph({
            text: "Serious Issues",
            heading: HeadingLevel.HEADING_3,
          }),

          // ISSUE-001
          new Paragraph({
            children: [
              new TextRun({
                text: "ISSUE-001: Form Labels Not Programmatically Associated",
                bold: true,
              }),
            ],
            spacing: { before: 200 },
          }),
          createIssueTable([
            ["Severity", "Serious"],
            ["WCAG Criteria", "1.3.1 Info and Relationships, 3.3.2 Labels or Instructions"],
            ["Location", "Label Editor section - Template name, Width, Height, Units fields"],
            ["Current State", "Labels appear visually above inputs but may not be programmatically associated"],
            ["Impact", "Screen reader users may not understand input purpose"],
            ["Recommendation", "Use <label for=\"\"> to associate labels with inputs"],
          ]),
          new Paragraph({ text: "" }),

          // ISSUE-002
          new Paragraph({
            children: [
              new TextRun({
                text: "ISSUE-002: Component List Items Missing Semantic Markup",
                bold: true,
              }),
            ],
            spacing: { before: 200 },
          }),
          createIssueTable([
            ["Severity", "Serious"],
            ["WCAG Criteria", "4.1.2 Name, Role, Value"],
            ["Location", "Components panel - COA ID, COA LotNumber, COA Batch items"],
            ["Current State", "Interactive/draggable elements without clear role indication"],
            ["Impact", "Assistive technology cannot convey item purpose or drag-and-drop capability"],
            ["Recommendation", "Use <button> with descriptive aria-label for draggable items"],
          ]),
          new Paragraph({ text: "" }),

          // ISSUE-003
          new Paragraph({
            children: [
              new TextRun({
                text: "ISSUE-003: Left Navigation Accessibility",
                bold: true,
              }),
            ],
            spacing: { before: 200 },
          }),
          createIssueTable([
            ["Severity", "Serious"],
            ["WCAG Criteria", "1.1.1 Non-text Content, 2.4.6 Headings and Labels"],
            ["Location", "Left sidebar - Products, Packages, Label Templates, Print Labels, Admin"],
            ["Current State", "Icons with text labels need proper ARIA handling"],
            ["Impact", "Navigation may not be fully accessible to screen reader users"],
            ["Recommendation", "Use <nav> with aria-label, ensure icons have aria-hidden=\"true\""],
          ]),
          new Paragraph({ text: "" }),

          // Moderate Issues
          new Paragraph({
            text: "Moderate Issues",
            heading: HeadingLevel.HEADING_3,
          }),

          // ISSUE-004
          new Paragraph({
            children: [
              new TextRun({
                text: "ISSUE-004: View Toggle Missing ARIA State",
                bold: true,
              }),
            ],
            spacing: { before: 200 },
          }),
          createIssueTable([
            ["Severity", "Moderate"],
            ["WCAG Criteria", "4.1.2 Name, Role, Value"],
            ["Location", "Canvas area - \"Design\" and \"Print Preview\" toggle buttons"],
            ["Current State", "Visual distinction exists but ARIA state not communicated"],
            ["Impact", "Screen reader users cannot determine which view is active"],
            ["Recommendation", "Add aria-pressed=\"true/false\" to toggle buttons"],
          ]),
          new Paragraph({ text: "" }),

          // ISSUE-005
          new Paragraph({
            children: [
              new TextRun({
                text: "ISSUE-005: Search Field Needs Accessible Label",
                bold: true,
              }),
            ],
            spacing: { before: 200 },
          }),
          createIssueTable([
            ["Severity", "Moderate"],
            ["WCAG Criteria", "3.3.2 Labels or Instructions"],
            ["Location", "Components panel - \"Search...\" input field"],
            ["Current State", "Placeholder-only label"],
            ["Impact", "Screen reader users may not understand input purpose"],
            ["Recommendation", "Add visually hidden <label> or aria-label=\"Search components\""],
          ]),
          new Paragraph({ text: "" }),

          // ISSUE-006
          new Paragraph({
            children: [
              new TextRun({
                text: "ISSUE-006: Panel Focus Management",
                bold: true,
              }),
            ],
            spacing: { before: 200 },
          }),
          createIssueTable([
            ["Severity", "Moderate"],
            ["WCAG Criteria", "2.4.3 Focus Order, 2.1.2 No Keyboard Trap"],
            ["Location", "Right side - In-App Guides panel (if present)"],
            ["Current State", "Focus management on panel open/close needs verification"],
            ["Impact", "Keyboard users may have difficulty navigating panels"],
            ["Recommendation", "Move focus to panel on open, allow Escape to close"],
          ]),
          new Paragraph({ text: "" }),

          // Minor Issues
          new Paragraph({
            text: "Minor Issues",
            heading: HeadingLevel.HEADING_3,
          }),

          // ISSUE-007
          new Paragraph({
            children: [
              new TextRun({
                text: "ISSUE-007: Collapse Button Missing aria-expanded",
                bold: true,
              }),
            ],
            spacing: { before: 200 },
          }),
          createIssueTable([
            ["Severity", "Minor"],
            ["WCAG Criteria", "4.1.2 Name, Role, Value"],
            ["Location", "Properties panel - \"Collapse\" button"],
            ["Current State", "Button lacks aria-expanded attribute"],
            ["Recommendation", "Add aria-expanded=\"true/false\" and aria-controls"],
          ]),
          new Paragraph({ text: "" }),

          // ISSUE-008
          new Paragraph({
            children: [
              new TextRun({
                text: "ISSUE-008: Zoom Dropdown Accessibility",
                bold: true,
              }),
            ],
            spacing: { before: 200 },
          }),
          createIssueTable([
            ["Severity", "Minor"],
            ["WCAG Criteria", "4.1.2 Name, Role, Value, 2.1.1 Keyboard"],
            ["Location", "Canvas toolbar - \"100%\" zoom dropdown"],
            ["Current State", "Verify keyboard accessibility and labeling"],
            ["Recommendation", "Add visually hidden label, ensure keyboard operation"],
          ]),
          new Paragraph({ text: "" }),

          // Remediation Priority
          new Paragraph({
            text: "Remediation Priority",
            heading: HeadingLevel.HEADING_2,
          }),

          new Paragraph({
            children: [new TextRun({ text: "Phase 1: Serious (Before Release)", bold: true })],
          }),
          new Paragraph({ text: "1. Add form label associations (ISSUE-001)" }),
          new Paragraph({ text: "2. Add semantic markup to component list (ISSUE-002)" }),
          new Paragraph({ text: "3. Improve navigation accessibility (ISSUE-003)" }),
          new Paragraph({ text: "" }),

          new Paragraph({
            children: [new TextRun({ text: "Phase 2: Moderate (Within 2 Weeks)", bold: true })],
          }),
          new Paragraph({ text: "4. Add ARIA states to view toggle (ISSUE-004)" }),
          new Paragraph({ text: "5. Add accessible label to search field (ISSUE-005)" }),
          new Paragraph({ text: "6. Implement focus management for panels (ISSUE-006)" }),
          new Paragraph({ text: "" }),

          new Paragraph({
            children: [new TextRun({ text: "Phase 3: Minor (Next Iteration)", bold: true })],
          }),
          new Paragraph({ text: "7. Add aria-expanded to collapse button (ISSUE-007)" }),
          new Paragraph({ text: "8. Verify zoom dropdown accessibility (ISSUE-008)" }),
          new Paragraph({ text: "" }),

          // Report Info
          new Paragraph({
            text: "Report Information",
            heading: HeadingLevel.HEADING_2,
          }),
          createTable(
            ["Field", "Value"],
            [
              ["Report Version", "2.0"],
              ["Generated", "2026-01-29"],
              ["Standard", "WCAG 2.2 Level AA"],
              ["Methodology", "Visual inspection + heuristic evaluation"],
            ]
          ),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(
    "/Users/lanaholston/Desktop/Code/a11y-audit-retail-id-label-editor.docx",
    buffer
  );
  console.log("Word document created successfully!");
}

generateReport().catch(console.error);
