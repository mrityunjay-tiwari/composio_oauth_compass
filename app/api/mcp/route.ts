import { NextResponse } from "next/server";
import { APPS_DATABASE } from "@/data/apps";

export async function GET() {
  const tools = [
    {
      name: "list_oauth_providers",
      description: "List all curated third-party OAuth 2.0 providers cataloged in Composio OAuth Compass.",
      parameters: {
        category: "optional string ('Productivity', 'Communication', 'Developer Tools', 'CRM & Sales', 'Media & Content')",
        max_friction_score: "optional number (1.0 to 5.0)",
      },
    },
    {
      name: "get_oauth_guide",
      description: "Retrieve full production BYOC guide, friction metrics, setup steps, scopes, and gotchas for an app.",
      parameters: {
        provider: "string (e.g. 'google', 'slack', 'spotify', 'salesforce', 'linear', 'github', 'notion')",
      },
    },
    {
      name: "audit_scope_risk",
      description: "Audit OAuth scopes against Google CASA Tier 2 ($3k-$15k) audits, admin reviews, and failure modes.",
      parameters: {
        provider: "string",
        scopes: "array of strings",
      },
    },
    {
      name: "get_unwritten_gotchas",
      description: "Retrieve unwritten production failure modes (7-day token expiry, bot vs user scopes, replication lag).",
      parameters: {
        provider: "string",
      },
    },
    {
      name: "generate_composio_byoc_payload",
      description: "Generate Composio Custom AuthConfig payload (JSON) and ready-to-paste Python/TypeScript SDK snippets.",
      parameters: {
        provider: "string",
        client_id: "optional string",
        client_secret: "optional string",
      },
    },
    {
      name: "investigate_oauth_provider",
      description: "Autonomous real-time investigation for any unfamiliar app or doc URL using Jina Reader + search.",
      parameters: {
        query: "string (app name or doc URL)",
      },
    },
  ];

  return NextResponse.json({
    name: "composio-oauth-compass",
    version: "1.0.0",
    description: "Model Context Protocol (MCP) server for Composio OAuth Compass. Equips AI agents with OAuth friction metrics, scope risk auditing, unwritten production gotchas, and 1-click BYOC payloads.",
    status: "active",
    transport: "stdio",
    quickstart: {
      command: "npx tsx mcp-server/index.ts",
      claudeDesktopConfig: {
        mcpServers: {
          "composio-oauth-compass": {
            command: "npx",
            args: ["-y", "tsx", "mcp-server/index.ts"],
          },
        },
      },
    },
    curatedProvidersCount: APPS_DATABASE.length,
    tools,
  });
}
