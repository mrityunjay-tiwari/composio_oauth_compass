"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/ui/code-block";
import {
  ExternalLink,
  Check,
  Copy,
  BookOpen,
  Key,
  Zap,
  ArrowRight,
  Code2,
  Bot,
  UserCheck,
  AlertTriangle
} from "lucide-react";

interface ComposioByocExplainerProps {
  onOpenAppGuide?: (slug: string, tab?: "checklist" | "scopes" | "gotchas" | "composio") => void;
  onNavigateTab?: (tab: "directory" | "live-studio" | "ground-truth" | "composio-byoc") => void;
}

export default function ComposioByocExplainer({ onOpenAppGuide, onNavigateTab }: ComposioByocExplainerProps) {
  const [activeLang, setActiveLang] = useState<"python" | "typescript" | "curl">("python");
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Interactive BYOC Simulator State
  const [simApp, setSimApp] = useState<string>("slack");
  const [simClientId, setSimClientId] = useState<string>("482910482910.849201849201");
  const [simClientSecret, setSimClientSecret] = useState<string>("9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d");
  const [copiedPayload, setCopiedPayload] = useState(false);

  const snippets = {
    python: `from composio import Composio

composio = Composio()

# 1. Register Custom Auth Config (BYOC)
auth_config = composio.auth_configs.create(
    app="${simApp}",
    credentials={
        "client_id": "${simClientId}",
        "client_secret": "${simClientSecret}",
    }
)

# 2. Generate Hosted Connect Link for User
connection = composio.connected_accounts.link(
    user_uuid="user_p7a89x",
    auth_config_id=auth_config.id
)

print("Direct user to authenticate:", connection.redirect_url)`,

    typescript: `import { Composio } from "composio-core";

const composio = new Composio();

// 1. Register Custom Auth Config (BYOC)
const authConfig = await composio.authConfigs.create({
  app: "${simApp}",
  credentials: {
    clientId: "${simClientId}",
    clientSecret: "${simClientSecret}",
  },
});

// 2. Generate Hosted Connect Link for User
const connection = await composio.connectedAccounts.link({
  userUuid: "user_p7a89x",
  authConfigId: authConfig.id,
});

console.log("Direct user to authenticate:", connection.redirectUrl);`,

    curl: `curl -X POST "https://backend.composio.dev/api/v1/auth_configs" \\
  -H "X-API-KEY: $COMPOSIO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "app": "${simApp}",
    "credentials": {
      "client_id": "${simClientId}",
      "client_secret": "${simClientSecret}"
    }
  }'`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(snippets[activeLang]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const currentPayloadJson = JSON.stringify(
    {
      app: simApp,
      credentials: {
        client_id: simClientId,
        client_secret: simClientSecret
      },
      metadata: {
        environment: "production",
        managed_by: "composio_vault"
      }
    },
    null,
    2
  );

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(currentPayloadJson);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-none border border-blue-100 bg-blue-50/70 px-2.5 py-0.5 text-xs mb-2">
            <BookOpen className="h-3 w-3 text-[#0024BC]" />
            <span className="font-semibold text-[#0024BC]">Composio Architecture Reference</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            Managed Auth vs. Custom AuthConfig (BYOC)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Composio supports two authentication paradigms. Understanding when to use Managed Auth versus when to migrate to Custom AuthConfig is the core decision point for enterprise AI agent systems.
          </p>
        </div>

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab("ground-truth")}
            className="inline-flex items-center gap-1.5 rounded-none border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shrink-0"
          >
            <span>View Ground Truth Audit</span>
            <ArrowRight className="h-3 w-3 text-slate-400" />
          </button>
        )}
      </div>

      {/* Spacious 2-Column Comparison: Managed vs BYOC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Managed Auth Card */}
        <div className="rounded-none border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-none border border-emerald-200 bg-emerald-50 text-emerald-700">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Composio Managed Auth</h3>
                <p className="text-[11px] text-slate-500">Day 0 to Day 14 (Prototyping &amp; POC)</p>
              </div>
            </div>
            <span className="rounded-none border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
              0-Min Setup
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Composio maintains pre-registered OAuth credentials for hundreds of developer tools. Developers connect tools in 2 minutes without opening Google Cloud, Slack, or GitHub developer consoles.
          </p>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>0 Minutes Setup:</strong> No provider approval or developer console registration needed.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Automated Token Custody:</strong> Tokens stored in AES-256 vault with automated refresh on 401s.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Hosted Auth Connect Links:</strong> Ready-made secure redirect links for testing tool actions.</span>
            </li>
            <li className="flex items-start gap-2 text-amber-800">
              <span className="text-xs">⚠️</span>
              <span><strong>Shared Branding:</strong> OAuth consent screen displays &ldquo;Composio&rdquo; rather than your agent brand.</span>
            </li>
            <li className="flex items-start gap-2 text-amber-800">
              <span className="text-xs">⚠️</span>
              <span><strong>Shared API Quotas:</strong> Rate limits are pooled across developers building in sandbox environments.</span>
            </li>
          </ul>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400">Best for: Hackathons, prompt iteration &amp; quick POCs</span>
            <a
              href="https://docs.composio.dev/toolkits/managed-auth"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-[#0024BC] hover:underline"
            >
              <span>View Managed Auth Docs</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Custom AuthConfig (BYOC) Card */}
        <div className="rounded-none border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-none border border-blue-200 bg-blue-50 text-[#0024BC]">
                <Key className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Custom AuthConfig (BYOC)</h3>
                <p className="text-[11px] text-slate-500">Day 14+ (Production &amp; Enterprise)</p>
              </div>
            </div>
            <span className="rounded-none border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-[#0024BC]">
              Enterprise Scale
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Developers bring their own Client ID and Client Secret created in the provider developer console. Mandatory for customer-facing applications requiring white-label branding and dedicated quotas.
          </p>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>100% White-Labeled:</strong> Users see your company logo, legal terms, and domain name.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Dedicated Rate Limits:</strong> Full provider API quotas isolated exclusively for your paying customers.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Zero Infra Burden:</strong> Composio still handles AES-256 token custody, rotation, and 401 recovery.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Custom Scopes:</strong> Request bespoke permissions required by complex enterprise agent workflows.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Enterprise Compliance:</strong> Satisfies enterprise Okta, Google Workspace, and SOC 2 security audits.</span>
            </li>
          </ul>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400">Best for: Production rollouts, paying users &amp; enterprise SOC 2</span>
            <a
              href="https://docs.composio.dev/docs/tools-direct/authenticating-tools#hosted-authentication-connect-link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-[#0024BC] hover:underline"
            >
              <span>View Hosted Auth Docs</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* The DevOps Boundary: Agent vs Human Matrix (Clean, Tasteful Colors) */}
      <div className="rounded-none border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">The Agent vs. Human Boundary Matrix</h2>
            <p className="text-xs text-slate-500">Clear demarcation of responsibilities during BYOC provisioning</p>
          </div>
          <span className="text-[11px] text-slate-400">DevOps Handoff Protocol</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Automated by Composio */}
          <div className="rounded-none border border-emerald-200/80 bg-emerald-50/20 p-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs">
              <Bot className="h-4 w-4 text-emerald-600" />
              <span>What Composio &amp; Agent Automates</span>
            </div>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Scope Minimization:</strong> Recommends lowest-privilege scopes to bypass CASA Tier 2 fees.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Manifest Generation:</strong> Creates Slack/Linear copy-paste application manifests.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>AuthConfig Schema Formatting:</strong> Validates and exports exact JSON required by Composio SDK.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>PKCE &amp; State Token Exchange:</strong> Performs code-for-token authorization exchange behind the scenes.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Token Lifecycle Management:</strong> Transparently refreshes expired tokens before agents execute actions.</span>
              </li>
            </ul>
          </div>

          {/* Requires Human DevOps */}
          <div className="rounded-none border border-amber-200/80 bg-amber-50/20 p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
              <UserCheck className="h-4 w-4 text-amber-600" />
              <span>Where Human DevOps Must Take Over</span>
            </div>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Provider Billing &amp; Payment:</strong> Adding credit cards or activating billing accounts (GCP/AWS).</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Domain DNS Verification:</strong> Inserting <code>TXT</code> records in DNS to prove company domain ownership.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>YouTube Walkthrough Screencasts:</strong> Recording required unlisted videos demonstrating consent flow for Google.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Biometric / 2FA Verification:</strong> Passing hardware security keys or authenticator prompts.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Legal Agreements:</strong> Signing provider Developer Terms of Service and Data Protection Agreements (DPA).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Full-Width Section 1: 2-Step Composio Connection Blueprint */}
      <div className="rounded-none border border-slate-200 bg-white p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">2-Step Composio Connection Blueprint</h2>
            <p className="text-xs text-slate-500">Connecting Custom Credentials to Composio Hosted Connect links</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-none border border-slate-200 bg-slate-50 p-0.5 text-xs">
              <button
                onClick={() => setActiveLang("python")}
                className={`px-2.5 py-1 transition ${activeLang === "python" ? "bg-white font-semibold text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
              >
                Python
              </button>
              <button
                onClick={() => setActiveLang("typescript")}
                className={`px-2.5 py-1 transition ${activeLang === "typescript" ? "bg-white font-semibold text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
              >
                TypeScript
              </button>
              <button
                onClick={() => setActiveLang("curl")}
                className={`px-2.5 py-1 transition ${activeLang === "curl" ? "bg-white font-semibold text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
              >
                cURL
              </button>
            </div>
          </div>
        </div>

        <CodeBlock
          code={snippets[activeLang]}
          language={activeLang}
          filename={`blueprint.${activeLang === "python" ? "py" : activeLang === "typescript" ? "ts" : "sh"}`}
          showCopy={true}
        />
      </div>

      {/* Full-Width Section 2: Custom AuthConfig Payload Generator / Simulator */}
      <div className="rounded-none border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#0024BC] font-semibold mb-0.5">
              <Code2 className="h-3.5 w-3.5" />
              <span>Interactive Simulator</span>
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Custom AuthConfig Payload Generator</h2>
          </div>

          {onOpenAppGuide && (
            <button
              onClick={() => onOpenAppGuide(simApp, "composio")}
              className="inline-flex items-center gap-1.5 rounded-none border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <span>Inspect {simApp} Guide</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Controls */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Target Application</label>
              <select
                value={simApp}
                onChange={(e) => {
                  setSimApp(e.target.value);
                  if (e.target.value === "slack") {
                    setSimClientId("482910482910.849201849201");
                    setSimClientSecret("9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d");
                  } else if (e.target.value === "google-workspace") {
                    setSimClientId("849201948201-abc123xyz.apps.googleusercontent.com");
                    setSimClientSecret("GOCSPX-9a8b7c6d5e4f3a2b1c0d");
                  } else if (e.target.value === "github") {
                    setSimClientId("Iv1.8a9b0c1d2e3f4a5b");
                    setSimClientSecret("9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b");
                  } else if (e.target.value === "salesforce") {
                    setSimClientId("3MVG9...consumer_key");
                    setSimClientSecret("891028491029481029481029");
                  } else {
                    setSimClientId("notion_client_id_live");
                    setSimClientSecret("secret_9a8b7c6d5e4f3a2b1c0d");
                  }
                }}
                className="w-full rounded-none border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:border-[#0024BC]"
              >
                <option value="slack">Slack API</option>
                <option value="google-workspace">Google Workspace / Cloud</option>
                <option value="github">GitHub OAuth App</option>
                <option value="salesforce">Salesforce Connected App</option>
                <option value="notion">Notion Integration</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Client ID / Consumer Key</label>
              <input
                type="text"
                value={simClientId}
                onChange={(e) => setSimClientId(e.target.value)}
                className="w-full rounded-none border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:border-[#0024BC]"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Client Secret / Consumer Secret</label>
              <input
                type="text"
                value={simClientSecret}
                onChange={(e) => setSimClientSecret(e.target.value)}
                className="w-full rounded-none border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:border-[#0024BC]"
              />
            </div>

            <div className="pt-2 text-[11px] text-slate-500">
              Credentials injected into Composio&apos;s vault are encrypted at rest using envelope encryption (AES-256-GCM) with automated secret rotation.
            </div>
          </div>

          {/* Live Output */}
          <div>
            <CodeBlock
              code={currentPayloadJson}
              language="json"
              filename="composio_auth_config.json"
              showCopy={true}
              maxHeight="200px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
