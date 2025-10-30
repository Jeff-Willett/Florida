# How to Use save-session.sh

## Quick Start

1. **During your Claude Code chat session**:
   - Select all chat content: `Cmd+A`
   - Copy to clipboard: `Cmd+C`

2. **Run the script**:
   ```bash
   cd ~/Library/Mobile\ Documents/com~apple~CloudDocs/Code\&Scripts/vscode-Jeff-Willett/Florida
   ./save-session.sh
   ```

3. **Done!** The script will:
   - ✅ Create or update today's log file: `session-logs/2025-10-20.md`
   - ✅ Only add NEW content (skips duplicates)
   - ✅ Add timestamp separators for multiple sessions per day
   - ✅ Show you confirmation of what was added

## What the Script Does

### First Run of the Day
Creates a new file: `session-logs/YYYY-MM-DD.md`
```
✓ Created new session log for 2025-10-20
✓ Added initial content (342 lines)
```

### Subsequent Runs (Same Day)
Compares clipboard with existing file and only adds what's new:
```
✓ Session log updated for 2025-10-20
✓ Added new content (87 lines)
→ Saved to: session-logs/2025-10-20.md
```

### No New Content
If you accidentally run it again with the same content:
```
✓ No new content detected - all clipboard content already in log
```

## Features

- **Smart Duplicate Detection**: Compares clipboard vs existing file, only adds new messages
- **Whitespace Normalization**: Ignores formatting differences, focuses on actual content changes
- **Session Timestamps**: Adds "Session Update: TIME" separator when appending
- **Markdown Formatted**: Preserves all Claude Code formatting, tool calls, and outputs
- **Colored Output**: Green for success, Yellow for warnings, Blue for info

## Tips

- **Run multiple times per day**: The script is designed for this! Copy and run whenever you want to checkpoint your conversation.
- **Works mid-conversation**: You don't have to wait until the end of your session.
- **Safe to re-run**: If you accidentally copy and run with old content, it won't duplicate.

## Troubleshooting

**"Clipboard is empty"**
- Make sure you copied (Cmd+C) the chat content first

**Permission denied**
```bash
chmod +x save-session.sh
```

**Script not found**
Make sure you're in the Florida directory:
```bash
cd ~/Library/Mobile\ Documents/com~apple~CloudDocs/Code\&Scripts/vscode-Jeff-Willett/Florida
```

## File Structure

```
Florida/
├── save-session.sh          ← The script
└── session-logs/
    ├── 2025-10-20.md       ← Daily log files
    ├── 2025-10-21.md
    └── HOW-TO-USE.md       ← This file
```

---

**Pro Tip**: Create an alias in your `~/.zshrc` or `~/.bashrc`:
```bash
alias save-chat='cd ~/Library/Mobile\ Documents/com~apple~CloudDocs/Code\&Scripts/vscode-Jeff-Willett/Florida && ./save-session.sh'
```

Then you can just run `save-chat` from anywhere!
