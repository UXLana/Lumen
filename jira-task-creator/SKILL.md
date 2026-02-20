---
name: jira-task-creator
description: >
  Turn reports, analyses, conversation context, or uploaded documents into structured Jira Epics and Tasks on a specified board.
  Use this skill whenever the user says "create jira tasks", "create jira epics", "add to jira", "make tickets",
  or provides a report/analysis and wants actionable items tracked in Jira. Also trigger when the user mentions
  a Jira board link and wants work items created from any content in the conversation. The skill remembers
  previously provided board links so the user doesn't have to repeat them. Even if the user just says
  "create tickets from this" or "turn this into tasks", this skill should activate.
---

# Jira Task Creator

You turn reports, analyses, and documents into well-structured Jira Epics and Tasks. You read whatever the user gives you — uploaded files, pasted text, Notion pages, conversation context — extract the actionable work, organize it into Epics and Tasks, confirm the plan with the user, and then create everything in Jira.

## When This Skill Activates

This skill should activate when:
- The user says "create jira tasks", "create jira epics", "add to jira", "make tickets", or similar
- The user provides a report or analysis and wants work items created from it
- The user mentions a Jira board URL and wants items created
- The user references a previously saved board and wants to add tasks to it
- The user says "turn this into tasks" or "create tickets from this" after discussing or uploading content

## Workflow

### Step 1: Identify the Board

Check the config file at the skill's `references/board-config.json` for saved board links.

- **If the user provides a board link in this conversation**: Extract the project key, save it to the config, and use it.
- **If the user doesn't provide a link but one or more are saved**: Show them the saved board(s) and ask which one to use. If there's only one saved board, suggest using it by default.
- **If no board link exists anywhere**: Ask the user to provide one.

To extract the project key from a board URL, look for the segment after `/projects/`:
- `https://metrc-tech.atlassian.net/jira/software/projects/UX/boards/123` → project key is `UX`
- `https://metrc-tech.atlassian.net/jira/software/projects/SDE/...` → project key is `SDE`

The Atlassian cloud ID for Metrc is: `086ab4b0-285b-4f1c-be76-7af58a9c4f72`. Use this for all Jira API calls.

### Step 2: Gather Source Material

The input can come from anywhere — the skill needs to handle all of these:

- **Uploaded documents**: PDFs, Word docs, spreadsheets. Read them using the file system tools or appropriate extraction methods.
- **Pasted text**: Analyze text the user pastes directly in chat.
- **Notion pages**: If the user provides a Notion link, use the Notion MCP tools to fetch the page content.
- **Conversation context**: Use analysis, reports, or discussions already in the conversation history.
- **Any combination**: The user might reference multiple sources at once.

Read and understand the full content before moving on. Don't rush to create structure — take a moment to understand the themes and action items in the material.

### Step 3: Analyze and Propose Structure

Extract actionable work items and organize them into Epics and Tasks.

**How to decide what becomes an Epic vs. a Task:**

Epics represent a body of related work — they're the big themes. Look for: section headings, distinct feature areas, major recommendations, project phases, or workstreams. If the source material has clear sections or categories, those are natural Epic boundaries.

Tasks are specific, concrete action items someone can pick up and do. A good task summary should tell the assignee what to do without needing to read the full report. Look for: recommendations, action items, findings that need follow-up, specific deliverables, or steps in a process.

**Present the proposed structure clearly:**

```
Epic 1: [Epic Name]
  - Task 1.1: [Task summary]
  - Task 1.2: [Task summary]

Epic 2: [Epic Name]
  - Task 2.1: [Task summary]
  - Task 2.2: [Task summary]
```

For each item, also prepare (but show only if the user asks for details):
- **Description**: Markdown description with relevant context from the source material
- **Priority**: Inferred from language cues — use High, Medium, or Low
- **Labels**: Relevant labels extracted from the content

Then ask: "Here's how I'd organize this into Jira. Want me to go ahead, or would you like to adjust anything?"

Wait for the user's approval before creating anything.

### Step 4: Create in Jira

Once approved, create the issues. Order matters — Epics first, then Tasks under them.

**Create Epics:**
```
createJiraIssue(
  cloudId: "086ab4b0-285b-4f1c-be76-7af58a9c4f72",
  projectKey: "<PROJECT_KEY>",
  issueTypeName: "Epic",
  summary: "<Epic title>",
  description: "<Markdown description with context>"
)
```

**Create Tasks under each Epic:**
```
createJiraIssue(
  cloudId: "086ab4b0-285b-4f1c-be76-7af58a9c4f72",
  projectKey: "<PROJECT_KEY>",
  issueTypeName: "Task",
  summary: "<Task title>",
  description: "<Markdown description>",
  parent: "<EPIC-KEY>"
)
```

The `parent` field links the Task to its Epic. Use the Epic's issue key (e.g., `UX-42`) returned from the Epic creation call.

**Setting priority and labels:**
Use the `additional_fields` parameter:
```
additional_fields: {
  "priority": { "name": "High" },
  "labels": ["design", "q1-2026"]
}
```

**Assigning people:**
If the user wants to assign someone, use `lookupJiraAccountId` to find their account ID by name, then pass it as `assignee_account_id` when creating the issue.

### Step 5: Report Results

After creating everything, summarize what was done:
- List each Epic with its Jira key and a clickable link
- Under each Epic, list its Tasks with their keys
- State the total: "Created X Epics and Y Tasks on the [PROJECT] board"

Format links as: `https://metrc-tech.atlassian.net/browse/{ISSUE_KEY}`

## Board Config Persistence

Board links are remembered across sessions using a config file.

**Config file location**: `references/board-config.json` (relative to the skill directory)

**Structure:**
```json
{
  "boards": [
    {
      "project_key": "UX",
      "board_url": "https://metrc-tech.atlassian.net/jira/software/projects/UX/boards/123",
      "project_name": "User Experience",
      "added_date": "2026-02-12"
    }
  ],
  "default_board": "UX"
}
```

**On every invocation:**
1. Read the config file. If it doesn't exist, treat it as empty (`{"boards": [], "default_board": null}`).
2. When the user provides a new board link, add it to the `boards` array and write the file.
3. If it's the first/only board, automatically set it as `default_board`.
4. If there are multiple boards and the user doesn't specify which to use, show the list and ask.

## Edge Cases

- **No actionable items found**: Tell the user the content doesn't have clear action items. Suggest what works well: reports with recommendations, analyses with findings, meeting notes with action items.
- **Very large reports (20+ potential tasks)**: Group aggressively into Epics and suggest breaking the work into phases. Don't create an overwhelming number of tickets in one go.
- **User wants just Tasks, no Epics**: Create standalone Tasks without a parent. This is fine when the user explicitly asks for it.
- **Adding to an existing Epic**: Use `searchJiraIssuesUsingJql` to find existing Epics in the project, show them, and let the user pick which one to attach tasks to.
- **Different Atlassian instance**: If the board URL doesn't match `metrc-tech.atlassian.net`, note that this skill is configured for the Metrc workspace.

## Available Jira Tools

| Tool | Purpose |
|------|---------|
| `createJiraIssue` | Create Epics and Tasks |
| `searchJiraIssuesUsingJql` | Find existing Epics or issues |
| `getJiraIssue` | Get details of a specific issue |
| `getVisibleJiraProjects` | List available projects |
| `lookupJiraAccountId` | Find a user's ID for assignment |
| `editJiraIssue` | Update an existing issue |
| `getAccessibleAtlassianResources` | Get cloud ID and available sites |
