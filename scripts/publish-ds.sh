#!/bin/bash
# ─────────────────────────────────────────────────────────────────────
# publish-ds.sh — Package the Lumen Design System and test it
#
# What this does (in plain English):
#   1. Zips up your components and tokens into a .tgz file
#   2. Copies that zip into the prototype starter project
#   3. Updates the starter to use the new version
#   4. Installs everything fresh
#   5. Builds the starter to make sure nothing is broken
#   6. Tells you if it worked or not
#
# Usage:
#   cd ~/Desktop/Code
#   ./scripts/publish-ds.sh
#
# After it passes, push the starter so your team gets the update:
#   cd ~/path/to/lumen.prototype.starter
#   git add .
#   git commit -m "Update Lumen design system to vX.X.X"
#   git push
# ─────────────────────────────────────────────────────────────────────

set -e  # Stop immediately if anything fails

# ── Configuration ──────────────────────────────────────────────────
DS_DIR="$(cd "$(dirname "$0")/.." && pwd)"  # The design system repo
STARTER_DIR=""  # Will be set below

# Find the starter repo — check common locations
for candidate in \
    "$DS_DIR/../lumen.prototype.starter" \
    "$HOME/Desktop/lumen.prototype.starter" \
    "/tmp/test-starter"; do
    if [ -d "$candidate/.git" ]; then
        STARTER_DIR="$(cd "$candidate" && pwd)"
        break
    fi
done

if [ -z "$STARTER_DIR" ]; then
    echo ""
    echo "ERROR: Can't find the lumen.prototype.starter repo."
    echo ""
    echo "I looked in:"
    echo "  - $DS_DIR/../lumen.prototype.starter"
    echo "  - $HOME/Desktop/lumen.prototype.starter"
    echo "  - /tmp/test-starter"
    echo ""
    echo "Either clone it or set STARTER_DIR:"
    echo "  STARTER_DIR=/path/to/starter ./scripts/publish-ds.sh"
    exit 1
fi

# Allow override via environment variable
STARTER_DIR="${STARTER_DIR_OVERRIDE:-$STARTER_DIR}"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  Lumen Design System — Package & Test                   ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "  Design system:  $DS_DIR"
echo "  Starter repo:   $STARTER_DIR"
echo ""

# ── Step 1: Package the design system ──────────────────────────────
echo "📦 Step 1/5 — Packaging the design system..."
cd "$DS_DIR"
VERSION=$(node -p "require('./package.json').version")
TARBALL="lumen-design-system-${VERSION}.tgz"

npm pack --quiet 2>&1 | tail -1
echo "   Created: $TARBALL ($VERSION)"
echo ""

# ── Step 2: Copy to starter's vendor folder ────────────────────────
echo "📂 Step 2/5 — Copying to starter project..."
mkdir -p "$STARTER_DIR/vendor"
cp "$TARBALL" "$STARTER_DIR/vendor/"
echo "   Copied to: $STARTER_DIR/vendor/$TARBALL"
echo ""

# ── Step 3: Update starter's package.json ──────────────────────────
echo "📝 Step 3/5 — Updating starter to use v${VERSION}..."
cd "$STARTER_DIR"
python3 -c "
import json
with open('package.json', 'r') as f:
    pkg = json.load(f)
pkg['dependencies']['@lumen/design-system'] = 'file:./vendor/$TARBALL'
with open('package.json', 'w') as f:
    json.dump(pkg, f, indent=2)
    f.write('\n')
"
echo "   Updated package.json → file:./vendor/$TARBALL"
echo ""

# ── Step 4: Clean install ──────────────────────────────────────────
echo "🔄 Step 4/5 — Installing everything fresh (this takes a moment)..."
rm -rf node_modules package-lock.json
npm install --quiet 2>&1 | tail -3
echo "   Install complete."
echo ""

# ── Step 5: Build test ─────────────────────────────────────────────
echo "🏗️  Step 5/5 — Building to check for errors..."
BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_EXIT=$?

if [ $BUILD_EXIT -eq 0 ]; then
    echo "   Build passed!"
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║  ✅  ALL GOOD — v${VERSION} is ready to ship            "
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    echo "  Next steps:"
    echo "    cd $STARTER_DIR"
    echo "    git add ."
    echo "    git commit -m \"Update Lumen design system to v${VERSION}\""
    echo "    git push"
    echo ""
    echo "  Then tell your team: 'New DS version is out — run:"
    echo "    git pull && npm install'"
    echo ""

    # Clean up tarball from DS directory
    rm -f "$DS_DIR/$TARBALL"
else
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║  ❌  BUILD FAILED — check the errors below              "
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    echo "$BUILD_OUTPUT" | tail -20
    echo ""

    # Clean up tarball from DS directory
    rm -f "$DS_DIR/$TARBALL"
    exit 1
fi
