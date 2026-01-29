/**
 * Accessibility Report Generator
 *
 * Generates Word documents matching the VPAT Remediation template style.
 *
 * Usage:
 *   node generate-report.js --input findings.json --output report.docx
 *   node generate-report.js --from-axe axe-results.json --output report.docx
 */

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
  BorderStyle,
} = require("docx");
const fs = require("fs");

// =============================================================================
// TEMPLATE COLORS (matching VPAT template)
// =============================================================================

const COLORS = {
  headerBlue: "1A5276",      // Dark blue for table headers
  headerText: "FFFFFF",       // White text on headers
  yellowStatus: "F9E79F",     // Yellow for "Partially Supports"
  greenStatus: "ABEBC6",      // Green for "Supports"
  redStatus: "F5B7B1",        // Red for "Does Not Support"
  borderGray: "CCCCCC",       // Light gray borders
  white: "FFFFFF",
};

const SEVERITY_COLORS = {
  critical: "E74C3C",
  serious: "E67E22",
  moderate: "F39C12",
  minor: "3498DB",
};

// =============================================================================
// TABLE HELPERS
// =============================================================================

const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.borderGray },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.borderGray },
  left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.borderGray },
  right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.borderGray },
};

function createHeaderCell(text) {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, color: COLORS.headerText })],
      }),
    ],
    shading: { fill: COLORS.headerBlue },
    borders: tableBorders,
  });
}

function createDataCell(text, options = {}) {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, ...options.textOptions })],
      }),
    ],
    shading: { fill: options.fill || COLORS.white },
    borders: tableBorders,
  });
}

function createTable(headers, rows) {
  const headerRow = new TableRow({
    children: headers.map(h => createHeaderCell(h)),
  });

  const dataRows = rows.map(row =>
    new TableRow({
      children: row.map((cell, idx) => {
        if (typeof cell === "object") {
          return createDataCell(cell.text, { fill: cell.fill, textOptions: cell.textOptions });
        }
        return createDataCell(cell);
      }),
    })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });
}

// =============================================================================
// AXE RESULTS PARSER
// =============================================================================

function parseAxeResults(axeJson) {
  const findings = [];

  // Map axe impact to our severity
  const impactToSeverity = {
    critical: "critical",
    serious: "serious",
    moderate: "moderate",
    minor: "minor",
  };

  // Map axe tags to WCAG criteria
  const getWcagFromTags = (tags) => {
    const wcagTag = tags.find(t => t.startsWith("wcag"));
    if (wcagTag) {
      const match = wcagTag.match(/wcag(\d)(\d)(\d)/);
      if (match) {
        return `${match[1]}.${match[2]}.${match[3]}`;
      }
    }
    return "N/A";
  };

  // Process violations
  if (axeJson.violations) {
    axeJson.violations.forEach((violation, idx) => {
      findings.push({
        id: `A11Y-${String(idx + 1).padStart(3, "0")}`,
        title: violation.description,
        severity: impactToSeverity[violation.impact] || "moderate",
        wcag: getWcagFromTags(violation.tags),
        criterion: violation.id,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.map(n => ({
          html: n.html,
          target: n.target.join(", "),
          failureSummary: n.failureSummary,
        })),
      });
    });
  }

  return findings;
}

// =============================================================================
// REPORT GENERATOR
// =============================================================================

async function generateReport(options) {
  const {
    title = "Accessibility Compliance Report",
    date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    product = "Application",
    standard = "WCAG 2.2 Level AA",
    findings = [],
    outputPath = "a11y-report.docx",
  } = options;

  // Count by severity
  const severityCounts = {
    critical: findings.filter(f => f.severity === "critical").length,
    serious: findings.filter(f => f.severity === "serious").length,
    moderate: findings.filter(f => f.severity === "moderate").length,
    minor: findings.filter(f => f.severity === "minor").length,
  };

  // Group by WCAG criterion
  const byWcag = {};
  findings.forEach(f => {
    if (!byWcag[f.wcag]) byWcag[f.wcag] = [];
    byWcag[f.wcag].push(f);
  });

  // Build document sections
  const children = [
    // Title
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Date: ${date} | Product: ${product}`,
          italics: true,
        }),
      ],
    }),
    new Paragraph({ text: "" }),

    // WCAG Conformance Summary
    new Paragraph({
      text: "WCAG Conformance Summary",
      heading: HeadingLevel.HEADING_2,
    }),
    new Paragraph({
      text: `This audit identified ${findings.length} issues against ${standard}:`,
    }),
    createTable(
      ["WCAG Criterion", "Status", "Tickets"],
      Object.entries(byWcag).map(([wcag, issues]) => [
        wcag,
        { text: "Partially Supports", fill: COLORS.yellowStatus },
        issues.map(i => i.id).join(", "),
      ])
    ),
    new Paragraph({ text: "" }),

    // Executive Summary
    new Paragraph({
      text: "Executive Summary",
      heading: HeadingLevel.HEADING_2,
    }),
    createTable(
      ["Severity", "Count", "Status"],
      [
        ["Critical", String(severityCounts.critical), severityCounts.critical > 0 ? "Must fix immediately" : "None"],
        ["Serious", String(severityCounts.serious), severityCounts.serious > 0 ? "Fix before release" : "None"],
        ["Moderate", String(severityCounts.moderate), severityCounts.moderate > 0 ? "Fix in next iteration" : "None"],
        ["Minor", String(severityCounts.minor), severityCounts.minor > 0 ? "Backlog" : "None"],
      ]
    ),
    new Paragraph({ text: "" }),

    // Detailed Findings
    new Paragraph({
      text: "Detailed Findings",
      heading: HeadingLevel.HEADING_2,
    }),
  ];

  // Add each finding
  findings.forEach(finding => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${finding.id}: `, bold: true }),
          new TextRun({ text: finding.title, bold: true }),
        ],
        spacing: { before: 200 },
      }),
      createTable(
        ["Attribute", "Details"],
        [
          ["Severity", finding.severity.charAt(0).toUpperCase() + finding.severity.slice(1)],
          ["WCAG Criterion", finding.wcag],
          ["Rule", finding.criterion],
          ["Description", finding.help],
          ["Affected Elements", finding.nodes ? finding.nodes.map(n => n.target).join("\n") : "N/A"],
          ["Recommendation", finding.nodes?.[0]?.failureSummary || "See axe documentation"],
        ]
      ),
      new Paragraph({ text: "" })
    );
  });

  // Remediation Priority
  children.push(
    new Paragraph({
      text: "Remediation Priority",
      heading: HeadingLevel.HEADING_2,
    }),
    new Paragraph({
      children: [new TextRun({ text: "Phase 1: Critical (Immediate)", bold: true })],
    }),
    ...findings
      .filter(f => f.severity === "critical")
      .map(f => new Paragraph({ text: `• ${f.id}: ${f.title}` })),
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [new TextRun({ text: "Phase 2: Serious (Before Release)", bold: true })],
    }),
    ...findings
      .filter(f => f.severity === "serious")
      .map(f => new Paragraph({ text: `• ${f.id}: ${f.title}` })),
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [new TextRun({ text: "Phase 3: Moderate (Next Sprint)", bold: true })],
    }),
    ...findings
      .filter(f => f.severity === "moderate")
      .map(f => new Paragraph({ text: `• ${f.id}: ${f.title}` })),
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [new TextRun({ text: "Phase 4: Minor (Backlog)", bold: true })],
    }),
    ...findings
      .filter(f => f.severity === "minor")
      .map(f => new Paragraph({ text: `• ${f.id}: ${f.title}` }))
  );

  // Create document
  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Report generated: ${outputPath}`);
  return outputPath;
}

// =============================================================================
// CLI
// =============================================================================

async function main() {
  const args = process.argv.slice(2);

  let inputFile = null;
  let outputFile = "a11y-report.docx";
  let fromAxe = false;
  let title = "Accessibility Compliance Report";
  let product = "Application";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" || args[i] === "-i") {
      inputFile = args[++i];
    } else if (args[i] === "--output" || args[i] === "-o") {
      outputFile = args[++i];
    } else if (args[i] === "--from-axe") {
      fromAxe = true;
      inputFile = args[++i];
    } else if (args[i] === "--title") {
      title = args[++i];
    } else if (args[i] === "--product") {
      product = args[++i];
    }
  }

  if (!inputFile) {
    console.log("Usage:");
    console.log("  node generate-report.js --from-axe axe-results.json --output report.docx");
    console.log("  node generate-report.js --input findings.json --output report.docx");
    console.log("");
    console.log("Options:");
    console.log("  --from-axe <file>  Parse axe-core JSON results");
    console.log("  --input <file>     Use pre-formatted findings JSON");
    console.log("  --output <file>    Output Word document path");
    console.log("  --title <text>     Report title");
    console.log("  --product <text>   Product name");
    process.exit(1);
  }

  const inputData = JSON.parse(fs.readFileSync(inputFile, "utf8"));
  const findings = fromAxe ? parseAxeResults(inputData) : inputData;

  await generateReport({
    title,
    product,
    findings,
    outputPath: outputFile,
  });
}

// Export for programmatic use
module.exports = { generateReport, parseAxeResults };

// Run CLI if called directly
if (require.main === module) {
  main().catch(console.error);
}
