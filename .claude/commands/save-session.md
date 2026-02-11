# Save Session to iCloud

Save a summary of the current Claude Code session to your iCloud Desktop for future reference.

## When invoked, follow these steps:

### Step 1: Gather Session Information

Collect the following from the current conversation:
- **Date**: Today's date in YYYY-MM-DD format
- **Project**: The current working directory name
- **Main topic**: What was the primary focus of this session?
- **Key decisions**: Any important choices or directions taken
- **Code changes**: Files created, modified, or deleted
- **Outcomes**: What was accomplished?
- **Open items**: Anything left unfinished or to follow up on

### Step 2: Generate Summary

Create a markdown file with this structure:

```markdown
# Session: [Brief descriptive title]

**Date:** YYYY-MM-DD
**Project:** [project name]
**Duration:** [approximate if known]

## Summary
[2-3 sentence overview of what happened in this session]

## Key Decisions
- [Decision 1 and rationale]
- [Decision 2 and rationale]

## Changes Made
- [File or feature 1]
- [File or feature 2]

## Code Snippets (if relevant)
[Any important code worth preserving]

## Open Items / Next Steps
- [ ] [Follow-up task 1]
- [ ] [Follow-up task 2]

## Notes
[Any additional context, links, or references]
```

### Step 3: Save the File

1. Create the logs directory if it doesn't exist:
   ```bash
   mkdir -p ~/Desktop/Claude-Logs
   ```

2. Save the file with naming convention:
   ```
   ~/Desktop/Claude-Logs/YYYY-MM-DD-[project]-[brief-topic].md
   ```

   Example: `2026-01-26-mtr-design-system-stepper-component.md`

3. Confirm the file was saved and show the path.

### Step 4: Confirm with User

After saving, display:
- The file path
- A brief preview of what was saved
- Offer to open the file or the folder

## Guidelines

- **Be concise**: Summaries should be scannable, not exhaustive
- **Focus on value**: Capture decisions and outcomes, not every detail
- **Use clear titles**: The filename should tell you what the session was about at a glance
- **Include actionable items**: Open items should be specific enough to act on later
- **Skip boilerplate**: Don't include routine things like "read files" or "ran commands"

## Example Output

After running `/save-session`, you might see:

```
Saved session log to:
~/Desktop/Claude-Logs/2026-01-26-mtr-design-system-stepper-component.md

Preview:
# Session: Added Stepper Component with Animations

**Date:** 2026-01-26
**Project:** mtr-design-system

## Summary
Created a new Stepper component for multi-step forms with
smooth animations and accessibility support.

## Key Decisions
- Used CSS transitions instead of Framer Motion for simplicity
- Made steps clickable for non-linear navigation
...
```
