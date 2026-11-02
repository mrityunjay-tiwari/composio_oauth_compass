# Composio OAuth Compass MCP Server

Model Context Protocol (MCP) server for Composio OAuth Compass. Equips AI coding assistants with OAuth friction metrics, scope risk auditing, unwritten production gotchas, and 1-click Bring Your Own Credentials (BYOC) payloads.

Published globally on npm: [`composio-oauth-compass`](https://www.npmjs.com/package/composio-oauth-compass)

---

## Installation & Execution

### 1. Zero-Install Execution via NPX

No local installation required. Run directly in any MCP client or shell:

```bash
npx -y composio-oauth-compass
```

### 2. Global Installation (Optional)

```bash
npm install -g composio-oauth-compass
composio-oauth-compass
```

---

## Client Configurations

### Claude Desktop

Add the server definition to your configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "composio-oauth-compass": {
      "command": "npx",
      "args": ["-y", "composio-oauth-compass"]
    }
  }
}
```

Restart Claude Desktop. The hammer icon will appear in the interface with all six tools loaded.

---

### Cursor

1. Open **Cursor Settings** -> **Features** -> **MCP Servers**.
2. Click **Add New MCP Server**.
3. Configure the following values:
   - **Name**: `composio-oauth-compass`
   - **Type**: `command`
   - **Command**: `npx -y composio-oauth-compass`
4. In Agent or Chat mode, the model will autonomously call tools when answering questions regarding OAuth architecture, scope risks, or Composio BYOC setup.

---

### Google Antigravity IDE

Add to your project's `mcp_config.json` or global user configuration:

```json
{
  "mcpServers": {
    "composio-oauth-compass": {
      "command": "npx",
      "args": ["-y", "composio-oauth-compass"]
    }
  }
}
```

---

### VS Code (Cline / Roo Code)

In your VS Code extension settings (`cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "composio-oauth-compass": {
      "command": "npx",
      "args": ["-y", "composio-oauth-compass"]
    }
  }
}
```

---

## Tool Reference

### 1. `list_oauth_providers`

List cataloged third-party OAuth 2.0 providers with friction scores, approval wait times, and review gates.

**Parameters:**
- `category` (string, optional): Filter by category (`Productivity`, `Communication`, `Developer Tools`, `CRM & Sales`, `Media & Content`).
- `max_friction_score` (number, optional): Maximum friction score filter (1.0 = instant self-serve, 5.0 = strict annual audit).

**Example Call:**
```json
{
  "name": "list_oauth_providers",
  "arguments": {
    "category": "Productivity",
    "max_friction_score": 3.0
  }
}
```

---

### 2. `get_oauth_guide`

Retrieve the complete integration guide for a provider, including friction metrics, step-by-step human vs agent setup checklist, least-privilege scopes, gotchas, and Composio SDK payloads.

**Parameters:**
- `provider` (string, required): App name or slug (e.g. `google`, `slack`, `spotify`, `salesforce`, `linear`, `github`, `notion`).

**Example Call:**
```json
{
  "name": "get_oauth_guide",
  "arguments": {
    "provider": "slack"
  }
}
```

---

### 3. `audit_scope_risk`

Audit a list of requested OAuth scopes against Google CASA Tier 2 ($3,000 to $15,000) audits, admin reviews, and failure modes. Recommends least-privilege alternatives.

**Parameters:**
- `provider` (string, required): App name or slug (e.g. `google`, `slack`).
- `scopes` (array of strings, required): List of requested OAuth scopes (e.g. `["gmail.readonly"]` or `["chat:write"]`).

**Example Response:**
```json
{
  "provider": "Google Workspace (Gmail & Drive)",
  "triggersCASAOrReview": true,
  "riskLevel": "CRITICAL - Triggers Annual CASA Tier 2 Audit ($3k-$15k)",
  "restrictedScopes": [
    {
      "scope": "https://www.googleapis.com/auth/gmail.readonly",
      "risk": "restricted",
      "warning": "Triggers third-party audit assessor fee ($3,000 to $15,000 annually) and 4-6 weeks delay."
    }
  ],
  "recommendations": [
    "Downgrade restricted scopes to sensitive or read-only scopes (e.g. use 'gmail.send')."
  ]
}
```

---

### 4. `get_unwritten_gotchas`

Retrieve unwritten production failure modes, undocumented traps, and developer pitfalls that official documentation omits (e.g. 7-day token expiration, 25-user quota gates, cluster replication lag).

**Parameters:**
- `provider` (string, required): App name or slug.

**Example Call:**
```json
{
  "name": "get_unwritten_gotchas",
  "arguments": {
    "provider": "spotify"
  }
}
```

---

### 5. `generate_composio_byoc_payload`

Generate the exact Composio Custom AuthConfig payload (JSON) and copy-paste Python/TypeScript SDK snippets for connecting custom credentials to Composio Hosted Connect links.

**Parameters:**
- `provider` (string, required): App name or slug.
- `client_id` (string, optional): OAuth Client ID.
- `client_secret` (string, optional): OAuth Client Secret.

**Example Call:**
```json
{
  "name": "generate_composio_byoc_payload",
  "arguments": {
    "provider": "slack",
    "client_id": "482910482910.849201849201",
    "client_secret": "9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d"
  }
}
```

---

### 6. `investigate_oauth_provider`

Conducts real-time autonomous research on unfamiliar OAuth platforms or documentation URLs via Jina Reader, analyzes review gates, and synthesizes a production BYOC guide on the fly.

**Parameters:**
- `query` (string, required): App name (e.g. `Airtable`, `HubSpot`, `Box`, `Zoom`) or official documentation URL.

---

## Local Verification & Development

From the repository root:

```bash
# Build the standalone binary
npm run build:mcp

# Run the 6-tool automated verification suite
node mcp-test/test-all-tools.js
```

## License

MIT License.
