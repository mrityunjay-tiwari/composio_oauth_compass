import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { APPS_DATABASE, AppGuide } from "../data/apps";

// Initialize the MCP Server
const server = new Server(
  {
    name: "composio-oauth-compass",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper: Flexible provider lookup
function findGuide(query: string): AppGuide | undefined {
  const q = query.trim().toLowerCase();
  // 1. Exact match by slug or name
  const exact = APPS_DATABASE.find(
    (a) =>
      a.slug.toLowerCase() === q ||
      a.name.toLowerCase() === q ||
      a.slug.replace(/-/g, "") === q.replace(/-/g, "")
  );
  if (exact) return exact;

  // 2. Partial match (e.g. 'google' matches 'google-workspace')
  return APPS_DATABASE.find(
    (a) =>
      a.slug.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      q.includes(a.slug.toLowerCase())
  );
}

// 1. Register available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_oauth_providers",
        description:
          "List all curated third-party OAuth 2.0 providers cataloged in Composio OAuth Compass with friction scores, approval wait times, and review gates.",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Optional category filter (e.g. 'Productivity', 'Communication', 'Developer Tools', 'CRM & Sales', 'Media & Content')",
            },
            max_friction_score: {
              type: "number",
              description: "Optional maximum friction score filter (1.0 = instant self-serve to 5.0 = strict CASA/annual audit)",
            },
          },
        },
      },
      {
        name: "get_oauth_guide",
        description:
          "Retrieve the complete production BYOC integration guide for an OAuth provider, including friction metrics, step-by-step human vs agent setup checklist, least-privilege scopes, production gotchas, and Composio SDK payloads.",
        inputSchema: {
          type: "object",
          properties: {
            provider: {
              type: "string",
              description: "The name or slug of the app (e.g. 'google', 'slack', 'spotify', 'salesforce', 'linear', 'github', 'notion')",
            },
          },
          required: ["provider"],
        },
      },
      {
        name: "audit_scope_risk",
        description:
          "Audit a list of OAuth scopes for a provider. Flags restricted permissions that trigger expensive annual third-party audits (like Google CASA Tier 2 costing $3,000–$15,000), require workspace admin review, or cause multi-week launch delays. Recommends least-privilege alternatives.",
        inputSchema: {
          type: "object",
          properties: {
            provider: {
              type: "string",
              description: "The name or slug of the app (e.g. 'google', 'slack', 'spotify', 'salesforce')",
            },
            scopes: {
              type: "array",
              items: { type: "string" },
              description: "List of requested OAuth scopes (e.g. ['https://mail.google.com/', 'gmail.send'] or ['chat:write'])",
            },
          },
          required: ["provider", "scopes"],
        },
      },
      {
        name: "get_unwritten_gotchas",
        description:
          "Retrieve the unwritten production failure modes, undocumented traps, and developer pitfalls for an OAuth provider that official documentation omits (e.g. Google's 7-day token expiration in testing mode, Slack's bot vs user token scope confusion, Spotify's 25-user quota gate, Salesforce's 10-minute cluster replication lag).",
        inputSchema: {
          type: "object",
          properties: {
            provider: {
              type: "string",
              description: "The name or slug of the app (e.g. 'google', 'slack', 'spotify', 'salesforce', 'github', 'notion')",
            },
          },
          required: ["provider"],
        },
      },
      {
        name: "generate_composio_byoc_payload",
        description:
          "Generate the exact Composio Custom AuthConfig payload (JSON) and ready-to-paste Python and TypeScript SDK snippets for taking a third-party OAuth app to production.",
        inputSchema: {
          type: "object",
          properties: {
            provider: {
              type: "string",
              description: "The name or slug of the app (e.g. 'google', 'slack', 'spotify', 'linear', 'salesforce')",
            },
            client_id: {
              type: "string",
              description: "Optional OAuth Client ID (defaults to 'YOUR_CLIENT_ID')",
            },
            client_secret: {
              type: "string",
              description: "Optional OAuth Client Secret (defaults to 'YOUR_CLIENT_SECRET')",
            },
          },
          required: ["provider"],
        },
      },
      {
        name: "investigate_oauth_provider",
        description:
          "Run an autonomous real-time probe on any unfamiliar OAuth platform or developer documentation URL. Queries developer docs, ingests specifications via Jina Reader, analyzes review gates, and synthesizes a production BYOC guide on the fly.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "App name (e.g. 'Airtable', 'HubSpot', 'Discord', 'Box', 'Zoom') or official documentation URL",
            },
          },
          required: ["query"],
        },
      },
    ],
  };
});

// 2. Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "list_oauth_providers": {
      let filtered = APPS_DATABASE;
      const category = args?.category as string | undefined;
      const maxFriction = args?.max_friction_score as number | undefined;

      if (category && category !== "All") {
        filtered = filtered.filter(
          (a) => a.category.toLowerCase() === category.toLowerCase()
        );
      }
      if (typeof maxFriction === "number") {
        filtered = filtered.filter((a) => a.frictionScore <= maxFriction);
      }

      const summary = filtered.map((a) => ({
        name: a.name,
        slug: a.slug,
        category: a.category,
        frictionScore: a.frictionScore,
        setupTimeMinutes: a.setupTimeMinutes,
        approvalWaitDays: a.approvalWaitDays,
        reviewType: a.reviewType,
        financialCost: a.financialCost,
        composioManagedAvailable: a.composioManagedAvailable,
        pkceRequired: a.pkceRequired,
        summary: a.summary,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(summary, null, 2),
          },
        ],
      };
    }

    case "get_oauth_guide": {
      const provider = args?.provider as string;
      const guide = findGuide(provider);

      if (!guide) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Provider '${provider}' not found in curated library. Available apps: ${APPS_DATABASE.map((a) => a.slug).join(", ")}. Use 'investigate_oauth_provider' to probe unfamiliar apps in real time.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(guide, null, 2),
          },
        ],
      };
    }

    case "audit_scope_risk": {
      const provider = args?.provider as string;
      const requestedScopes = (args?.scopes as string[]) || [];
      const guide = findGuide(provider);

      if (!guide) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Provider '${provider}' not found. Cannot audit scopes.`,
            },
          ],
        };
      }

      // Match requested scopes against guide definitions (bidirectional matching for short names like 'gmail.readonly')
      const matchedScopes = guide.scopes.filter((s) =>
        requestedScopes.some(
          (rs) => {
            const cleanRs = rs.trim().toLowerCase();
            const cleanSName = s.name.trim().toLowerCase();
            return (
              cleanRs === cleanSName ||
              cleanRs.includes(cleanSName) ||
              cleanSName.includes(cleanRs)
            );
          }
        )
      );

      const restrictedScopes = matchedScopes.filter((s) => s.riskLevel === "restricted");
      const highScopes = matchedScopes.filter((s) => s.riskLevel === "high");
      const triggersReview = matchedScopes.some((s) => s.triggersReview);

      const auditResult = {
        provider: guide.name,
        requestedCount: requestedScopes.length,
        matchedCount: matchedScopes.length,
        triggersCASAOrReview: triggersReview || restrictedScopes.length > 0,
        riskLevel:
          restrictedScopes.length > 0
            ? "CRITICAL - Triggers Annual CASA Tier 2 Audit ($3k-$15k)"
            : highScopes.length > 0
            ? "HIGH - Requires Human App Review / Quota Request"
            : "LOW - Standard Self-Serve / Expedited Path",
        restrictedScopes: restrictedScopes.map((s) => ({
          scope: s.name,
          risk: s.riskLevel,
          description: s.description,
          warning: "Triggers third-party audit assessor fee ($3,000 to $15,000 annually) and 4-6 weeks delay.",
        })),
        highRiskScopes: highScopes.map((s) => ({
          scope: s.name,
          risk: s.riskLevel,
          description: s.description,
        })),
        recommendations:
          restrictedScopes.length > 0
            ? [
                "Downgrade restricted scopes to sensitive or read-only scopes (e.g. use 'gmail.send' instead of 'https://mail.google.com/').",
                "Ensure your privacy policy page and unlisted YouTube consent screencast are ready before requesting verification.",
              ]
            : [
                "Optimal least-privilege selection. App can bypass external third-party security audits.",
              ],
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(auditResult, null, 2),
          },
        ],
      };
    }

    case "get_unwritten_gotchas": {
      const provider = args?.provider as string;
      const guide = findGuide(provider);

      if (!guide) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Provider '${provider}' not found in curated library.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                provider: guide.name,
                gotchasCount: guide.gotchas.length,
                gotchas: guide.gotchas,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "generate_composio_byoc_payload": {
      const provider = args?.provider as string;
      const clientId = (args?.client_id as string) || "YOUR_CLIENT_ID";
      const clientSecret = (args?.client_secret as string) || "YOUR_CLIENT_SECRET";
      const guide = findGuide(provider);

      if (!guide) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Provider '${provider}' not found. Cannot generate Composio BYOC payload.`,
            },
          ],
        };
      }

      const pythonCode = `# 1. Install Composio SDK: pip install composio-core
from composio import Composio

composio = Composio()

# 2. Register Custom OAuth App Config (BYOC)
auth_config = composio.auth_configs.create(
    app="${guide.slug}",
    credentials={
        "client_id": "${clientId}",
        "client_secret": "${clientSecret}"
    }
)

# 3. Generate Hosted Connect Link for User Authentication
connection = composio.connected_accounts.link(
    user_uuid="user_p7a89x",
    auth_config_id=auth_config.id
)

print("Direct user to authenticate:", connection.redirect_url)
`;

      const tsCode = `// 1. Install Composio SDK: npm install composio-core
import { Composio } from "composio-core";

const composio = new Composio();

async function setupBYOC() {
  // 2. Register Custom OAuth App Config
  const authConfig = await composio.authConfigs.create({
    app: "${guide.slug}",
    credentials: {
      client_id: "${clientId}",
      client_secret: "${clientSecret}",
    },
  });

  // 3. Generate Hosted Connect Link
  const connection = await composio.connectedAccounts.link({
    userUuid: "user_p7a89x",
    authConfigId: authConfig.id,
  });

  console.log("Direct user to authenticate:", connection.redirectUrl);
}

setupBYOC();
`;

      const jsonManifest = {
        appName: guide.slug,
        authType: "OAUTH2",
        clientId,
        clientSecret,
        redirectUri: "https://backend.composio.dev/api/v1/auth-apps/add",
        pkceRequired: guide.pkceRequired,
        reviewType: guide.reviewType,
        recommendedScopes: guide.scopes.filter((s) => s.riskLevel !== "restricted").map((s) => s.name),
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                provider: guide.name,
                slug: guide.slug,
                jsonManifest,
                pythonSdk: pythonCode,
                typescriptSdk: tsCode,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "investigate_oauth_provider": {
      const query = (args?.query as string)?.trim();
      if (!query) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "Please provide an app name or documentation URL to investigate.",
            },
          ],
        };
      }

      // Check if it's already in our curated library
      const existing = findGuide(query);
      if (existing) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  status: "found_in_catalog",
                  message: `'${query}' is already cataloged as an official archetype.`,
                  guide: existing,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      // Query local Next.js API endpoint if running
      try {
        const res = await fetch("http://localhost:3005/api/investigate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        if (res.ok) {
          const data = await res.json();
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    status: "live_probe_completed",
                    query,
                    guide: data.guide,
                    steps: data.steps,
                    sources: data.sources,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }
      } catch {
        // Fallback if localhost:3005 API is offline
      }

      // Offline synthesis fallback
      const synthesizedSlug = query.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const fallbackGuide = {
        name: query,
        slug: synthesizedSlug,
        category: "Productivity",
        frictionScore: 2.5,
        setupTimeMinutes: 30,
        approvalWaitDays: 0,
        financialCost: "$0 (Standard Tier)",
        pkceRequired: true,
        reviewRequiredForLaunch: false,
        reviewType: "None",
        isLiveInvestigated: true,
        summary: `OAuth 2.0 integration for ${query}. Supports standard authorization code grant and Composio BYOC custom connection.`,
        composioManagedAvailable: false,
        manifestSupported: false,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                status: "synthesized_offline",
                query,
                guide: fallbackGuide,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    default:
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Unknown tool: ${name}`,
          },
        ],
      };
  }
});

// 3. Connect to Stdio Transport and start listening
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Composio OAuth Compass MCP Server running on stdio");
}

run().catch((error) => {
  console.error("Fatal error starting MCP Server:", error);
  process.exit(1);
});
