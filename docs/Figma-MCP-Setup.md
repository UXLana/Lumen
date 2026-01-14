# Figma MCP Setup for Claude Code

This guide will help you set up the Figma MCP (Model Context Protocol) server so Claude Code can directly access your Figma designs.

## Prerequisites

- Node.js and npm installed
- A Figma account with access to your design files
- Claude Code installed

## Step 1: Install Figma MCP Server

Open your terminal and run:

```bash
npm install -g @modelcontextprotocol/server-figma
```

## Step 2: Get Your Figma Personal Access Token

1. Go to [Figma Settings → Personal Access Tokens](https://www.figma.com/developers/api#access-tokens)
2. Click "Generate new token"
3. Give it a descriptive name (e.g., "Claude Code MCP")
4. Copy the token (you won't be able to see it again!)
5. Store it safely (you'll need it in the next step)

## Step 3: Configure Claude Code

### Option A: Automatic Setup (Recommended)

Run this command to automatically configure:

```bash
# Create config directory if it doesn't exist
mkdir -p ~/.config/claude-code

# Create or update config.json
cat > ~/.config/claude-code/config.json << 'EOF'
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-figma"],
      "env": {
        "FIGMA_API_TOKEN": "YOUR_FIGMA_TOKEN_HERE"
      }
    }
  }
}
EOF
```

**Important:** Replace `YOUR_FIGMA_TOKEN_HERE` with your actual Figma token!

### Option B: Manual Setup

1. Create the config directory:
   ```bash
   mkdir -p ~/.config/claude-code
   ```

2. Create or edit `~/.config/claude-code/config.json`:
   ```json
   {
     "mcpServers": {
       "figma": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-figma"],
         "env": {
           "FIGMA_API_TOKEN": "your-actual-token-here"
         }
       }
     }
   }
   ```

3. Save the file

## Step 4: Restart Claude Code

Close and reopen Claude Code to load the new MCP configuration.

## Step 5: Verify Installation

In Claude Code, you should now be able to access Figma files. Try:

```
"Can you access my Figma file at https://www.figma.com/design/FILE_ID?node-id=NODE_ID"
```

## How to Use Figma MCP

Once configured, Claude Code can:

1. **Read Figma designs** - Access node properties, styles, and specifications
2. **Extract design tokens** - Pull colors, typography, spacing from Figma
3. **Build components** - Generate React components matching Figma designs
4. **Compare implementations** - Check if code matches Figma specs

### Example Figma URL Structure

```
https://www.figma.com/design/FILE_KEY/FILE_NAME?node-id=NODE_ID&t=VERSION_HASH-1
                              ^^^^^^^^                   ^^^^^^^
                              File Key                   Node ID
```

- **File Key**: The unique identifier for your Figma file
- **Node ID**: The specific frame/component you want to access (format: `1234-56789`)

### Example Commands

```
"Access this Figma component: [URL] and tell me its specifications"

"Build a React component based on this Figma design: [URL]"

"Extract all colors from this Figma file: [URL]"

"Compare my Button component to this Figma design: [URL]"
```

## Troubleshooting

### "MCP server not found" error

- Verify installation: `npm list -g @modelcontextprotocol/server-figma`
- Reinstall if needed: `npm install -g @modelcontextprotocol/server-figma`

### "Authentication failed" error

- Check your Figma token is correct in config.json
- Generate a new token if the old one expired
- Make sure there are no extra spaces in the token

### "Cannot access file" error

- Verify you have access to the Figma file
- Check the file URL is correct
- Make sure the file isn't in a private team you don't belong to

### Config not loading

- Check file location: `cat ~/.config/claude-code/config.json`
- Verify JSON syntax (use https://jsonlint.com/)
- Restart Claude Code completely

## Security Best Practices

1. **Never commit your token** to version control
2. **Use environment variables** for extra security:
   ```json
   {
     "mcpServers": {
       "figma": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-figma"],
         "env": {
           "FIGMA_API_TOKEN": "${FIGMA_TOKEN}"
         }
       }
     }
   }
   ```
   Then set: `export FIGMA_TOKEN=your-token-here` in your shell

3. **Rotate tokens regularly** - Generate new tokens every few months
4. **Use minimal permissions** - Only grant access to what you need

## Alternative: Using Figma Export

If you can't use MCP, you can:

1. **Export Figma to JSON** - Use Figma's "Copy as → Copy properties" or export plugins
2. **Screenshot approach** - Share screenshots with Claude Code
3. **Manual specs** - Provide written specifications

## Additional Resources

- [Figma API Documentation](https://www.figma.com/developers/api)
- [Model Context Protocol Docs](https://modelcontextprotocol.io/)
- [Claude Code Documentation](https://github.com/anthropics/claude-code)

## Quick Reference Card

```bash
# Install MCP server
npm install -g @modelcontextprotocol/server-figma

# Get Figma token
# Visit: https://www.figma.com/developers/api#access-tokens

# Configure Claude Code
# Edit: ~/.config/claude-code/config.json

# Restart Claude Code
# Close and reopen the application
```

---

**Need help?** Open an issue or ask Claude Code for assistance with setup!
