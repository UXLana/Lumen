---
name: confluence-to-prototype-spec
description: Fetch Confluence pages and compile them into a structured prototype spec for use with /prototype-builder
---

# Confluence to Prototype Compiler

## Purpose

Fetches one or more Confluence pages, extracts all relevant product/design/UX content, and compiles it into a single structured markdown file optimized for use with `/prototype-builder`.

## Workflow

### Step 1: Identify Pages

The user provides one or more Confluence page URLs or page IDs.

**URL format**: `https://metrc-tech.atlassian.net/wiki/spaces/SPACE/pages/PAGEID/Title`

Extract the page ID from each URL. If the user provides a search term instead of URLs, use `searchConfluenceUsingCql` to find relevant pages and confirm with the user before proceeding.

**Cloud ID**: `086ab4b0-285b-4f1c-be76-7af58a9c4f72`

### Step 2: Fetch Page Content

For each page:
1. Use `getConfluencePage` with `contentFormat: "markdown"` to get the full body
2. Use `getConfluencePageDescendants` to check for child pages — ask the user if they want to include children
3. If child pages are included, fetch those too

### Step 3: Extract & Organize

Parse each page's content and extract these categories:

#### Requirements
- User stories / jobs to be done
- Functional requirements
- Acceptance criteria
- Business rules / constraints

#### UX & Design
- Screen descriptions / wireframe notes
- User flows and navigation
- Interaction patterns (hover, click, drag, etc.)
- States (loading, empty, error, success)
- Responsive / breakpoint requirements

#### Data & Content
- Data models / field definitions
- Sample data or content examples
- API contracts or data sources
- Validation rules

#### Context
- Target users / personas
- Product area / feature name
- Related features or dependencies
- Out of scope items

### Step 4: Compile Prototype Prompt

Generate a single markdown file with this structure:

```markdown
# Prototype Spec: [Feature/Project Name]

> Compiled from Confluence on [date]
> Sources: [list of page titles with URLs]

## Overview
[High-level summary of what this prototype should demonstrate]

## Target Users
[Who will use this — personas, roles]

## Screens & Views

### Screen 1: [Name]
**Purpose**: [What this screen does]
**Entry points**: [How users get here]
**Layout**:
- [Description of layout sections and content]
**Key interactions**:
- [Clickable elements and what they do]
**States**:
- Default: [description]
- Loading: [description]
- Empty: [description]
- Error: [description]

### Screen 2: [Name]
[... same structure ...]

## User Flows
### Flow 1: [Name]
1. User starts at [Screen]
2. User clicks [element] → navigates to [Screen]
3. [... continue flow ...]

## Data Requirements
### [Entity/Model Name]
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name  | string | yes    | ...   |

## Business Rules
- [Rule 1]
- [Rule 2]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Out of Scope
- [Item 1]
- [Item 2]

## Open Questions
- [Any ambiguities or missing info found during extraction]
```

### Step 5: Save Output

Save the compiled file to:
```
prototypes/[project-name]/spec.md
```

Where `[project-name]` is derived from the main page title (kebab-cased).

Tell the user:
- Where the file was saved
- A summary of what was extracted (screen count, flow count, etc.)
- Any open questions or gaps found
- That they can now run `/prototype-builder` with this spec

## Edge Cases

- **Page has images/diagrams**: Note them as `[Diagram: description]` placeholders and mention they exist on the source page
- **Page has Jira links**: Extract the issue keys and note them as references
- **Page has tables**: Preserve table structure in markdown
- **Multiple pages with overlapping content**: Deduplicate and note the source of each section
- **Page is mostly visual (no structured text)**: Flag this to the user and ask for guidance

## User Input Required

$ARGUMENTS

---

Please provide:
- Confluence page URL(s) to compile
- Project name (optional — will derive from page title if not provided)
- Any specific sections or screens to focus on (optional)
