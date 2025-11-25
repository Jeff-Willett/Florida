bas# Notion MCP Setup Guide

This document explains how to set up and use the official Notion MCP server with Claude Code.

## What is Notion MCP?

Notion MCP (Model Context Protocol) gives AI tools secure access to your Notion workspace. It's hosted by Notion and allows you to read and write to your Notion pages and databases directly within Claude conversations.

## Setup Steps

### 1. Configure Claude Code to Use Notion MCP

The configuration file `claude_mcp_config.json` has already been created in this workspace with the recommended HTTP connection method.

Configuration used:
```json
{
  "mcpServers": {
    "Notion": {
      "url": "https://mcp.notion.com/mcp"
    }
  }
}
```

### 2. Authorize Your Notion Workspace

To enable the Notion MCP connection, you need to authorize it with your Notion account:

1. **Via Notion App (Easiest)**:
   - Open the Notion app on your computer
   - Go to **Settings** → **Connections** → **Notion MCP**
   - Choose **Claude Code** as your AI tool
   - Complete the OAuth flow to authorize access

2. **Manual Authorization**:
   - Visit https://mcp.notion.com/mcp in your browser
   - Sign in with your Notion account
   - Grant the necessary permissions
   - You'll be redirected with authorization tokens

### 3. Update Claude Code Settings (if needed)

If Claude Code doesn't automatically recognize the MCP server, you may need to add a reference to this config file in your Claude settings or environment variables.

## Using Notion MCP

Once authorized, you can ask Claude to:

- **Search across your Notion workspace**: "Search my Notion database for..."
- **Read page content**: "Show me the content of my [Page Name]"
- **Query databases**: "What are all the items in my [Database Name]?"
- **Create pages**: "Create a new page in my Notion workspace with..."
- **Update content**: "Update this page in my Notion database..."
- **Manage tasks**: "Show me my project tasks and their status"

## Connection Methods

The setup uses the **Streamable HTTP** method (recommended):
- **URL**: https://mcp.notion.com/mcp
- **Method**: HTTP-based streaming
- **Advantage**: Works with most AI tools and requires no local setup

Alternative methods available if needed:
- **SSE (Server-Sent Events)**: https://mcp.notion.com/sse
- **STDIO (Local Server)**: npx mcp-remote https://mcp.notion.com/mcp

## Troubleshooting

### Connection Issues
1. **Verify authorization**: Check if you've completed the OAuth flow in Notion
2. **Check workspace permissions**: Ensure your Notion API integration has access to the pages/databases you want to access
3. **Browser cache**: Clear browser cache and try re-authorizing
4. **Multiple workspaces**: If you have multiple Notion workspaces, ensure you're authorizing the correct one

### Access Issues
1. If Claude can't access a page/database, ensure the integration has been granted access to it in Notion
2. Go to **Settings** → **Connections** in Notion to manage API access
3. You can share specific pages with the integration or grant workspace-wide access

## Next Steps

1. ✅ Configuration file created (`claude_mcp_config.json`)
2. 🔄 **Authorize in Notion app**: Follow the authorization steps above
3. 📚 Start using Notion data in your Claude conversations

## Resources

- [Official Notion MCP Documentation](https://developers.notion.com/docs/mcp)
- [Notion MCP Connection Guide](https://developers.notion.com/docs/get-started-with-mcp)
- [Supported Tools & Features](https://developers.notion.com/docs/mcp-supported-tools)
- [Notion Integrations](https://www.notion.so/my-integrations)

## Files Created

- `claude_mcp_config.json` - MCP server configuration
- `NOTION-MCP-SETUP.md` - This file

---

**Last Updated**: November 14, 2025
