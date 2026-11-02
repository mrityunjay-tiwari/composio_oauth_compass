# Composio OAuth Compass

### Autonomous Integration Launchpad, BYOC Architecture, and Model Context Protocol (MCP) Server for AI Agents

Built for the Composio APM Integrations Take-Home Assignment.

Composio OAuth Compass bridges the gap between Day-0 prototyping (using Composio Managed Auth) and Enterprise Production (deploying custom OAuth applications under Bring Your Own Credentials / BYOC). It provides an empirical audit of developer platform traps, an autonomous live documentation probe, and a production-grade MCP server for AI coding assistants.

---

## Overview

Moving an AI agent workflow from local prototype to enterprise production exposes a critical drop-off point:

```text
[Day 0: Prototyping] ──> Composio Managed Auth ──> 2-minute setup, shared credentials, instant testing
                                                         │
                                                         ▼
[Day 14+: Production] ─> Custom OAuth App (BYOC) ─> Compliance & Friction Hurdles:
                         • Google Cloud: 3 to 4 week verification plus mandatory demo screencast
                         • Scope Penalty: $3,000 to $15,000 annual CASA Tier 2 assessment fee
                         • 7-Day Silent Expiry: Google Cloud Testing apps silently drop refresh tokens
                         • Slack API: Confusion between Bot and User token scopes
                         • Spotify Web API: Hard quota cap at 25 whitelisted developer accounts
```

Composio OAuth Compass eliminates this drop-off by providing:
1. **Interactive Web Dashboard**: App directory, empirical audit matrix, live documentation probe, and BYOC payload simulator.
2. **Model Context Protocol (MCP) Server**: A globally published CLI and library (`composio-oauth-compass` on npm) enabling agents in Claude Desktop, Cursor, and Antigravity to audit scopes and fetch production manifests programmatically.

---

## Quick Reference

| Resource | URL / Command |
|---|---|
| **Live Web Application** | [https://composio-oauth-compass.vercel.app](https://composio-oauth-compass.vercel.app) |
| **GitHub Repository** | [https://github.com/mrityunjay-tiwari/composio_oauth_compass](https://github.com/mrityunjay-tiwari/composio_oauth_compass) |
| **NPM Package** | [https://www.npmjs.com/package/composio-oauth-compass](https://www.npmjs.com/package/composio-oauth-compass) |
| **Run MCP Server via NPX** | `npx -y composio-oauth-compass` |
| **HTTP Discovery Endpoint** | `https://composio-oauth-compass.vercel.app/api/mcp` |

---

## Model Context Protocol (MCP) Server

The repository includes a production-ready MCP server compliant with the standard `@modelcontextprotocol/sdk`. It equips AI coding agents with direct access to friction metrics, CASA audit risk calculators, unwritten failure modes, and Composio SDK integration snippets.

### Global Execution

Run directly via `npx` without installation:

```bash
npx -y composio-oauth-compass
```

### Agent Client Configuration

#### 1. Claude Desktop
Add to `%APPDATA%\Claude\claude_desktop_config.json` (Windows) or `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

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

#### 2. Cursor
Navigate to **Cursor Settings** -> **Features** -> **MCP Servers** -> **Add New MCP Server**:
- **Name**: `composio-oauth-compass`
- **Type**: `command`
- **Command**: `npx -y composio-oauth-compass`

#### 3. Antigravity IDE
Add to your workspace or global `mcp_config.json`:

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

### Registered Tools

| Tool Name | Parameters | Description |
|---|---|---|
| `list_oauth_providers` | `category` (optional), `max_friction_score` (optional) | Returns cataloged OAuth providers filtered by domain and friction score. |
| `get_oauth_guide` | `provider` (required string) | Retrieves complete integration guide, setup steps, scopes, and gotchas. |
| `audit_scope_risk` | `provider` (required string), `scopes` (required array) | Analyzes requested scopes against CASA Tier 2 ($3k-$15k) audit triggers and recommends least-privilege alternatives. |
| `get_unwritten_gotchas` | `provider` (required string) | Returns production failure modes omitted from official provider documentation. |
| `generate_composio_byoc_payload` | `provider` (required), `client_id` (optional), `client_secret` (optional) | Emits Composio Custom AuthConfig JSON and Python/TypeScript SDK snippets. |
| `investigate_oauth_provider` | `query` (required string or URL) | Probes unfamiliar OAuth platforms via Jina Reader and synthesizes a structured guide in real time. |

---

## Product Architecture & Core Features

### 1. Empirical Ground Truth Audit Matrix
Provider documentation typically details only the ideal setup path. Through real-world verification, Composio OAuth Compass catalogs actual failure modes and solutions:

| Provider | Documented Path | Empirical Developer Reality | Engineering Solution |
|---|---|---|---|
| **Google Cloud** | "Create credentials and begin testing." | **7-Day Silent Token Trap**: Refresh tokens expire after 7 days in Testing mode, causing weekly agent outages. | Configure app to In Production with test accounts to obtain non-expiring refresh tokens. |
| **Google (Scopes)** | "Select desired scopes (e.g. `gmail.modify`)." | **$15,000 CASA Tier 2 Penalty**: Broad scopes trigger mandatory third-party audits costing $3,000 to $15,000 annually. | Downgrade to `gmail.send` (Sensitive) to avoid external audit requirements. |
| **Slack API** | "Submit app to App Directory for distribution." | **App Directory Illusion**: Multi-workspace installs do not require the 14-day directory review. | Enable Direct Public Distribution toggle directly to reduce wait time from 14 days to zero. |
| **Spotify API** | "Authenticate using Authorization Code grant." | **25-User Quota Gate**: Development mode is hard-capped at 25 whitelisted email accounts. Additional users receive a 403 error. | Submit quota extension request during early development to prevent launch delays. |
| **Salesforce** | "Create Connected App and connect." | **10-Minute Cluster Lag**: Newly generated consumer keys take 2 to 10 minutes to propagate across clusters, failing with `invalid_client_id`. | Account for global replication lag before validating credentials. |

### 2. Autonomous Real-Time Investigation Engine
For uncataloged or private APIs, the investigation engine conducts autonomous research:
1. **Targeted Retrieval**: Queries developer documentation portals for canonical OAuth 2.0 specifications.
2. **Headless Ingestion via Jina Reader**: Converts dynamic documentation pages into clean markdown in under two seconds.
3. **Specification Synthesis**: Extracts authorization endpoints, token exchange mechanics, PKCE requirements, and review constraints.
4. **Composio BYOC Export**: Synthesizes custom AuthConfig JSON compatible with Composio's SDK.

### 3. Bring Your Own Credentials (BYOC) Alignment
The system generates ready-to-run Composio SDK payloads:

```python
from composio import Composio

composio = Composio()

# 1. Register Custom Auth Config (BYOC)
auth_config = composio.auth_configs.create(
    app="slack",
    credentials={
        "client_id": "YOUR_SLACK_CLIENT_ID",
        "client_secret": "YOUR_SLACK_CLIENT_SECRET"
    }
)

# 2. Generate Hosted Connect Link for User
connection = composio.connected_accounts.link(
    user_uuid="user_p7a89x",
    auth_config_id=auth_config.id
)

print("Direct user to authenticate:", connection.redirect_url)
```

---

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: Node.js 20+
- **Styling**: Tailwind CSS v4, Lucide Icons, React Icons
- **Design System**: Composio Official Design Principles (Cobalt `#0024BC`, `rounded-none`, `abcDiatype` typography)
- **Syntax Highlighting**: shadcn CodeBlock with `prism-react-renderer`
- **Protocol**: Model Context Protocol (`@modelcontextprotocol/sdk`)
- **Bundler**: `esbuild` for standalone binary distribution

---

## Local Development

### Prerequisites
- Node.js 20 or higher
- `npm` or `pnpm`

### Installation

```bash
# Clone repository
git clone https://github.com/mrityunjay-tiwari/composio_oauth_compass.git
cd composio_oauth_compass

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3005](http://localhost:3005) in your browser.

### MCP Server Local Verification

To run the standalone verification test suite against all six MCP tools:

```bash
node mcp-test/test-all-tools.js
```

To build the standalone MCP executable bundle:

```bash
npm run build:mcp
```

---

## License

This project is licensed under the MIT License.
