#!/bin/bash

# Figma MCP Setup Script for Claude Code
# This script helps you set up Figma MCP integration

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Figma MCP Setup for Claude Code"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✓ npm found"

# Step 1: Install Figma MCP server
echo ""
echo "Step 1: Installing Figma MCP server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if npm list -g figma-mcp &> /dev/null; then
    echo "✓ Figma MCP server already installed"
else
    echo "Installing figma-mcp globally..."
    echo "Note: This requires sudo permissions"
    sudo npm install -g figma-mcp
    echo "✓ Figma MCP server installed"
fi

# Step 2: Get Figma token
echo ""
echo "Step 2: Figma Personal Access Token"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "To get your Figma token:"
echo "  1. Visit: https://www.figma.com/developers/api#access-tokens"
echo "  2. Click 'Generate new token'"
echo "  3. Give it a name (e.g., 'Claude Code MCP')"
echo "  4. Copy the token"
echo ""
read -p "Paste your Figma token here: " FIGMA_TOKEN

if [ -z "$FIGMA_TOKEN" ]; then
    echo "❌ No token provided. Exiting."
    exit 1
fi

# Step 3: Create config directory
echo ""
echo "Step 3: Configuring Claude Code"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CONFIG_DIR="$HOME/.config/claude-code"
CONFIG_FILE="$CONFIG_DIR/config.json"

# Create directory if it doesn't exist
mkdir -p "$CONFIG_DIR"
echo "✓ Config directory created/verified: $CONFIG_DIR"

# Create config file
cat > "$CONFIG_FILE" << EOF
{
  "mcpServers": {
    "figma": {
      "command": "figma-mcp",
      "env": {
        "FIGMA_PERSONAL_ACCESS_TOKEN": "$FIGMA_TOKEN"
      }
    }
  }
}
EOF

echo "✓ Config file created: $CONFIG_FILE"

# Step 4: Success!
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Figma MCP Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "  1. Restart Claude Code to load the new configuration"
echo "  2. Test with a Figma URL like:"
echo "     'Access this Figma design: https://www.figma.com/design/...'"
echo ""
echo "Configuration saved to: $CONFIG_FILE"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
