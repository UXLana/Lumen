const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  PageBreak,
} = require("docx");
const fs = require("fs");

// Helper to create a styled paragraph
const createParagraph = (text, options = {}) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: options.bold || false,
        italics: options.italics || false,
        size: options.size || 24,
      }),
    ],
    spacing: { after: 200 },
    ...options,
  });
};

// Helper to create bullet points
const createBullet = (text, level = 0) => {
  return new Paragraph({
    children: [new TextRun({ text, size: 24 })],
    bullet: { level },
    spacing: { after: 100 },
  });
};

// Helper to create checkbox items
const createCheckbox = (text) => {
  return new Paragraph({
    children: [new TextRun({ text: `☐ ${text}`, size: 24 })],
    spacing: { after: 100 },
    indent: { left: 360 },
  });
};

// Helper to create a simple table
const createTable = (headers, rows) => {
  const headerCells = headers.map(
    (h) =>
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: h, bold: true, size: 22 })],
          }),
        ],
        shading: { type: ShadingType.SOLID, color: "E8E8E8" },
      })
  );

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: cell, size: 22 })],
                }),
              ],
            })
        ),
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: headerCells }), ...dataRows],
  });
};

const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        // Title
        new Paragraph({
          children: [
            new TextRun({
              text: "Accessibility-First Product Lifecycle Strategy",
              bold: true,
              size: 48,
            }),
          ],
          heading: HeadingLevel.TITLE,
          spacing: { after: 400 },
        }),

        // Metadata
        createParagraph("Prepared for: CTO Review", { bold: true }),
        createParagraph("Date: February 2026"),
        createParagraph(
          "Objective: Provide a fully accessible, consistent, and scalable solution for all products",
          { italics: true }
        ),

        new Paragraph({ spacing: { after: 400 } }),

        // Executive Summary
        new Paragraph({
          children: [
            new TextRun({ text: "Executive Summary", bold: true, size: 32 }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        createParagraph(
          "This proposal outlines a strategy to embed accessibility into every phase of our product lifecycle. Our recommendation: adopt Material UI with custom design tokens as the foundation for a Design Language System (DLS) that delivers WCAG 2.2 AA compliance out of the box."
        ),
        createParagraph("This approach gives us:", { bold: true }),
        createBullet("Immediate accessibility — Battle-tested components with built-in keyboard, focus, and screen reader support"),
        createBullet("Brand consistency — Our design tokens applied via MUI's theming system"),
        createBullet("Faster delivery — 50+ production-ready components vs. 6-12 months building from scratch"),
        createBullet("Lower risk — Proven accessibility patterns used by thousands of production apps"),

        // Strategic Benefits
        new Paragraph({
          children: [
            new TextRun({ text: "Strategic Benefits", bold: true, size: 32 }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),

        new Paragraph({ spacing: { after: 200 } }),
        createTable(
          ["Benefit", "Impact"],
          [
            [
              "Accessibility",
              "WCAG 2.2 AA compliance built into every component. Users with disabilities get equal access from day one.",
            ],
            [
              "Scalability",
              "New products inherit accessibility automatically—no per-product remediation. As the portfolio grows, effort stays flat.",
            ],
            [
              "Consistency",
              "Unified interaction patterns across all products reduce user friction and strengthen brand trust.",
            ],
            [
              "Maintainability",
              "Updates apply once and propagate everywhere—reducing long-term cost and regression risk.",
            ],
          ]
        ),

        createParagraph(
          "These benefits compound over time: the more products that consume the DLS, the greater the return on the initial investment."
        ),

        // Section 1: Current State
        new Paragraph({
          children: [
            new TextRun({
              text: "1. Current State",
              bold: true,
              size: 32,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),

        new Paragraph({ spacing: { after: 200 } }),
        createTable(
          ["Aspect", "Today", "With DLS"],
          [
            ["Technology", "HTML + CSS (no component library)", "MUI + Custom Tokens"],
            ["Accessibility", "Ad-hoc fixes per product", "Built-in to every component"],
            ["Reusability", "Styles duplicated across products", "Single source of truth"],
            ["Testing", "Manual only", "Automated + manual pipeline"],
            ["Documentation", "None centralized", "A11y guidelines per component"],
          ]
        ),

        new Paragraph({
          children: [
            new TextRun({ text: "The Opportunity", bold: true, size: 28 }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 },
        }),
        createParagraph(
          "Since we don't have an existing component library, we can build it right from the start—with accessibility as a foundational requirement, not a retrofit."
        ),

        // Section 2: Recommended Approach
        new Paragraph({
          children: [
            new TextRun({
              text: "2. Recommended Approach: Material UI + Custom Design Tokens",
              bold: true,
              size: 32,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Why MUI?", bold: true, size: 28 }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),

        new Paragraph({ spacing: { after: 200 } }),
        createTable(
          ["What We Get", "Why It Matters"],
          [
            ["WCAG 2.1 AA compliant components", "Keyboard navigation, focus management, and ARIA handled automatically"],
            ["50+ production-ready components", "Buttons, forms, modals, tables, navigation—all accessible by default"],
            ["Powerful theming system", "Map our design tokens directly to MUI's theme provider"],
            ["Active maintenance", "MUI team handles accessibility updates as WCAG evolves"],
            ["Proven at scale", "Used by thousands of companies in production"],
          ]
        ),

        new Paragraph({
          children: [
            new TextRun({ text: "How It Works", bold: true, size: 28 }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 },
        }),

        // Architecture diagram as text
        new Paragraph({
          children: [
            new TextRun({
              text: "┌─────────────────────────────────────────────────────────────┐",
              size: 20,
            }),
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "│                    OUR DESIGN TOKENS                        │",
              size: 20,
              bold: true,
            }),
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "│       Colors • Typography • Spacing • Shadows • Motion      │",
              size: 20,
            }),
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "└─────────────────────────────┬───────────────────────────────┘",
              size: 20,
            }),
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "                              ▼",
              size: 20,
            }),
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "┌─────────────────────────────────────────────────────────────┐",
              size: 20,
            }),
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "│                   MUI THEME PROVIDER                        │",
              size: 20,
              bold: true,
            }),
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "│         Transforms tokens into MUI theme config             │",
              size: 20,
            }),
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "└─────────────────────────────┬───────────────────────────────┘",
              size: 20,
            }),
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "                              ▼",
              size: 20,
            }),
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "┌─────────────────────────────────────────────────────────────┐",
              size: 20,
            }),
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "│              BRANDED, ACCESSIBLE COMPONENTS                 │",
              size: 20,
              bold: true,
            }),
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "│     Our look & feel + MUI's accessibility = Best of both   │",
              size: 20,
            }),
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "└─────────────────────────────────────────────────────────────┘",
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Comparison: Build vs. Buy", bold: true, size: 28 }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 },
        }),

        new Paragraph({ spacing: { after: 200 } }),
        createTable(
          ["Factor", "Build from Scratch", "MUI + Custom Tokens"],
          [
            ["Time to first component", "2-3 months", "Days"],
            ["Full library ready", "6-12+ months", "1-2 months"],
            ["A11y expertise required", "Deep (hire specialists)", "Moderate (learn theming)"],
            ["Risk of a11y gaps", "High", "Low"],
            ["Ongoing maintenance", "We own it all", "MUI handles core"],
            ["Brand customization", "100%", "90-95%"],
            ["Bundle size", "Minimal", "Larger (tree-shaking helps)"],
          ]
        ),

        createParagraph(
          "Recommendation: The speed and accessibility benefits of MUI far outweigh the minor trade-offs in control and bundle size.",
          { bold: true }
        ),

        // Section 3: Workflow
        new Paragraph({
          children: [
            new TextRun({
              text: "3. Accessibility-Integrated Workflow",
              bold: true,
              size: 32,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Phase-by-Phase Ownership", bold: true, size: 28 }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),

        new Paragraph({ spacing: { after: 200 } }),
        createTable(
          ["Phase", "Who", "Does What", "Output"],
          [
            ["Design", "UX", "Annotates designs with a11y specs using DLS components", "Accessible design specs"],
            ["Build", "Dev", "Implements using MUI + tokens (no custom a11y code needed)", "Accessible code"],
            ["Validate", "QA", "Tests against WCAG criteria and assistive technologies", "Certified release"],
          ]
        ),

        new Paragraph({
          children: [
            new TextRun({ text: "What Each Role Delivers", bold: true, size: 28 }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 },
        }),

        createParagraph("UX Designer", { bold: true }),
        createBullet("Annotates: heading hierarchy, tab order, focus states, alt text"),
        createBullet("Uses DLS components in Figma (synced from MUI)"),
        createBullet("Ensures color contrast ratios meet WCAG AA"),

        createParagraph("Developer", { bold: true }),
        createBullet("Pulls components from DLS—does not recreate"),
        createBullet("Follows usage guidelines for each component"),
        createBullet("Tests with keyboard during development"),

        createParagraph("A11y QA", { bold: true }),
        createBullet("Runs automated tests (axe-core, Lighthouse)"),
        createBullet("Manual testing: keyboard, screen readers, zoom, high contrast"),
        createBullet("Documents any gaps for remediation"),

        // Section 4: Training
        new Paragraph({
          children: [
            new TextRun({ text: "4. Training Program", bold: true, size: 32 }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),

        createParagraph(
          "Accessibility is a shared responsibility. All roles should complete training within 6 months."
        ),

        new Paragraph({ spacing: { after: 200 } }),
        createTable(
          ["Role", "Focus Areas"],
          [
            ["Developers", "MUI theming, ARIA patterns, keyboard testing"],
            ["UX Designers", "Inclusive design, annotation standards, contrast"],
            ["Product Managers", "WCAG requirements, compliance, prioritization"],
            ["QA Engineers", "Assistive tech testing, reporting, tooling"],
          ]
        ),

        createParagraph("See Appendix A for recommended resources (free and paid).", { italics: true }),

        // Section 5: Supporting Practices
        new Paragraph({
          children: [
            new TextRun({ text: "5. Supporting Practices", bold: true, size: 32 }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "5.1 Shift-Left Testing", bold: true, size: 26 }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        createBullet("IDE plugins (axe DevTools) catch issues during coding"),
        createBullet("PR checks run automated a11y tests before merge"),
        createBullet("Design review gates require a11y annotation approval"),

        new Paragraph({
          children: [
            new TextRun({ text: "5.2 Accessibility Champions", bold: true, size: 26 }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        createParagraph("Designate 1-2 people per team:"),
        createBullet("First point of contact for a11y questions"),
        createBullet("Conduct internal reviews before QA handoff"),
        createBullet("Deeper training investment"),

        new Paragraph({
          children: [
            new TextRun({ text: "5.3 CI/CD Integration", bold: true, size: 26 }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        createBullet("axe-core or pa11y in build pipeline"),
        createBullet("Block merges on critical violations"),
        createBullet("Generate a11y reports per release"),

        new Paragraph({
          children: [
            new TextRun({ text: "5.4 Acceptance Criteria", bold: true, size: 26 }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        createParagraph("Add to every user story:"),
        createCheckbox("Keyboard accessible"),
        createCheckbox("Screen reader compatible"),
        createCheckbox("WCAG 2.2 AA contrast"),
        createCheckbox("Visible focus states"),
        createCheckbox("Respects reduced motion preference"),

        // Section 6: Success Metrics
        new Paragraph({
          children: [
            new TextRun({ text: "6. Success Metrics", bold: true, size: 32 }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),

        new Paragraph({ spacing: { after: 200 } }),
        createTable(
          ["Metric", "Target"],
          [
            ["Automated a11y test pass rate", "100% critical/serious"],
            ["WCAG 2.2 AA conformance", "Full conformance"],
            ["Time to remediate a11y bugs", "< 1 sprint"],
            ["Team training completion", "100% within 6 months"],
            ["DLS adoption (Canopy)", "100% of components"],
          ]
        ),

        // Summary
        new Paragraph({
          children: [new TextRun({ text: "Summary", bold: true, size: 32 })],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),

        createParagraph(
          "The recommendation: Adopt Material UI with our custom design tokens to build an accessible Design Language System.",
          { bold: true }
        ),

        createParagraph("Why this approach wins:", { bold: true }),
        createBullet("Immediate accessibility — MUI components are WCAG compliant out of the box"),
        createBullet("Faster time-to-market — Weeks, not months, to production-ready components"),
        createBullet("Lower risk — Battle-tested a11y patterns vs. building our own"),
        createBullet("Sustainable — MUI maintains accessibility; we maintain brand"),

        createParagraph("Key Takeaways:", { bold: true }),
        createBullet("DLS is the multiplier—fix once, benefit everywhere"),
        createBullet("MUI gives us accessibility for free; we add brand via tokens"),
        createBullet("Training + process ensures accessibility is everyone's job"),
        createBullet("Automate early, measure constantly"),

        new Paragraph({ spacing: { after: 400 } }),
        createParagraph(
          "Ready to discuss implementation details and resource allocation.",
          { italics: true }
        ),

        // Page break before Appendix
        new Paragraph({
          children: [new PageBreak()],
        }),

        // Appendix A
        new Paragraph({
          children: [
            new TextRun({
              text: "Appendix A: Training Resources",
              bold: true,
              size: 32,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Free Resources", bold: true, size: 28 }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        createBullet("W3C Web Accessibility Initiative (WAI) — Tutorials and guidelines"),
        createBullet("Google web.dev Accessibility — Developer learning path"),
        createBullet("A11y Project Checklist — Practical checklist"),
        createBullet("MUI Accessibility Docs — Component-specific guidance"),

        new Paragraph({
          children: [
            new TextRun({ text: "Paid/Certification", bold: true, size: 28 }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 },
        }),
        createBullet("Deque University — Role-based training tracks"),
        createBullet("IAAP CPACC/WAS — Industry certifications"),
        createBullet("Stark Academy — Design-focused training"),
      ],
    },
  ],
});

// Generate the document
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(
    "/Users/lanaholston/Desktop/Code/A11y-Product-Lifecycle-Strategy.docx",
    buffer
  );
  console.log("Word document created: A11y-Product-Lifecycle-Strategy.docx");
});
