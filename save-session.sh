#!/bin/bash

# Smart Session Logger for Claude Code
# Saves chat sessions to daily markdown files with duplicate detection and cleanup
# Usage: Copy chat (Cmd+A, Cmd+C), then run: ./save-session.sh

# Configuration
FLORIDA_DIR="/Users/jpw/Library/Mobile Documents/com~apple~CloudDocs/Code&Scripts/vscode-Jeff-Willett/Florida"
SESSION_LOGS_DIR="$FLORIDA_DIR/session-logs"
DATE=$(date +%Y-%m-%d)
TIME=$(date +"%I:%M %p")
LOG_FILE="$SESSION_LOGS_DIR/$DATE.md"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get clipboard content - preserve all formatting and newlines
CLIPBOARD_RAW=$(pbpaste)

# Check if clipboard is empty
if [ -z "$CLIPBOARD_RAW" ]; then
    echo -e "${YELLOW}⚠ Clipboard is empty. Please copy chat content first.${NC}"
    exit 1
fi

# Clean up Claude Code tool execution markers
# Remove lines like: "Read filename", "Glob pattern:", "⎿", "WebSearch", etc.
CLIPBOARD_CONTENT=$(echo "$CLIPBOARD_RAW" | \
    grep -v '^Read ' | \
    grep -v '^Write ' | \
    grep -v '^Edit ' | \
    grep -v '^Bash' | \
    grep -v '^Glob' | \
    grep -v '^WebSearch' | \
    grep -v '^WebFetch' | \
    grep -v '^⎿' | \
    grep -v '^Found [0-9]' | \
    grep -v '^Added [0-9]' | \
    grep -v '^Removed [0-9]' | \
    grep -v '^Modified' | \
    grep -v 'Tool ran without' | \
    grep -v '^pattern:' | \
    sed 's/^IN {$//' | \
    sed 's/^}$//')

# Create session-logs directory if it doesn't exist
mkdir -p "$SESSION_LOGS_DIR"

# Check if log file exists
if [ ! -f "$LOG_FILE" ]; then
    # First session of the day - create new file
    {
        echo "# Session Log - $DATE"
        echo ""
        echo "---"
        echo ""
        echo "## Session: $TIME"
        echo ""
        echo "$CLIPBOARD_CONTENT"
        echo ""
    } > "$LOG_FILE"

    LINE_COUNT=$(echo "$CLIPBOARD_CONTENT" | wc -l | tr -d ' ')

    echo -e "${GREEN}✓ Created new session log for $DATE${NC}"
    echo -e "${BLUE}✓ Added initial content ($LINE_COUNT lines)${NC}"
    exit 0
fi

# File exists - extract only new content
EXISTING_CONTENT=$(cat "$LOG_FILE")

# Remove the header from existing content (first 6 lines) for comparison
EXISTING_CHAT=$(tail -n +7 "$LOG_FILE")

# Strategy: Find the last 50 chars of existing content in clipboard, extract everything after
LAST_CONTENT=$(echo "$EXISTING_CHAT" | tail -c 500)

# Check if clipboard contains the existing content
if ! echo "$CLIPBOARD_CONTENT" | grep -qF "${LAST_CONTENT:0:200}"; then
    # Clipboard doesn't contain existing content - might be completely different
    # Use character count comparison as backup
    CLIPBOARD_SIZE=${#CLIPBOARD_CONTENT}
    EXISTING_SIZE=${#EXISTING_CHAT}

    if [ $CLIPBOARD_SIZE -le $EXISTING_SIZE ]; then
        echo -e "${YELLOW}✓ No new content detected${NC}"
        exit 0
    fi

    # Completely different content, add all
    NEW_CONTENT="$CLIPBOARD_CONTENT"
else
    # Find where existing content ends
    # Get last 3 lines of existing content (non-empty)
    MARKER_LINES=$(echo "$EXISTING_CHAT" | grep -v '^[[:space:]]*$' | tail -3)

    # Find where these lines appear in clipboard and extract after
    TEMP_CLIP=$(mktemp)
    echo "$CLIPBOARD_CONTENT" > "$TEMP_CLIP"

    # Get the very last line as marker
    LAST_LINE=$(echo "$MARKER_LINES" | tail -1)

    if [ -n "$LAST_LINE" ]; then
        # Find this line in clipboard
        LINE_NUM=$(grep -n -F "$LAST_LINE" "$TEMP_CLIP" | tail -1 | cut -d: -f1)

        if [ -n "$LINE_NUM" ]; then
            # Extract everything after that line
            NEW_CONTENT=$(tail -n +$((LINE_NUM + 1)) "$TEMP_CLIP")
        else
            # Couldn't find match, append entire clipboard as new
            NEW_CONTENT="$CLIPBOARD_CONTENT"
        fi
    else
        NEW_CONTENT="$CLIPBOARD_CONTENT"
    fi

    rm -f "$TEMP_CLIP"
fi

# Check if new content is significant (more than just whitespace)
SIGNIFICANT_CONTENT=$(echo "$NEW_CONTENT" | grep -v '^[[:space:]]*$' | head -20)

if [ -z "$SIGNIFICANT_CONTENT" ]; then
    echo -e "${YELLOW}✓ No new content detected${NC}"
    exit 0
fi

# Add session separator and new content
{
    echo ""
    echo "---"
    echo ""
    echo "## Session Update: $TIME"
    echo ""
    echo "$NEW_CONTENT"
    echo ""
} >> "$LOG_FILE"

# Count lines added
LINE_COUNT=$(echo "$NEW_CONTENT" | wc -l | tr -d ' ')

echo -e "${GREEN}✓ Session log updated for $DATE${NC}"
echo -e "${BLUE}✓ Added new content ($LINE_COUNT lines)${NC}"
echo -e "${BLUE}→ Saved to: session-logs/$DATE.md${NC}"
