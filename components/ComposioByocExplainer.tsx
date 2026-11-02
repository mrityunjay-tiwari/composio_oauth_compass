"use client";

import { useState } from "react";
import {
  ExternalLink,
  Check,
  Copy,
  BookOpen,
  Key,
  Zap,
  ArrowRight,
  ShieldCheck,
  Layers,
  Code2,
  Terminal,
  UserCheck,
  Bot,
  AlertTriangle,
  Sparkles,
  ArrowDown
} from "lucide-react";

interface ComposioByocExplainerProps {
  onOpenAppGuide?: (slug: string, tab?: "checklist" | "scopes" | "gotchas" | "composio") => void;
  onNavigateTab?: (tab: "directory" | "live-studio" | "ground-truth" | "composio-byoc") => void;
}

export default function ComposioByocExplainer({ onOpenAppGuide, onNavigateTab }: ComposioByocExplainerProps) {
  const [activeLang, setActiveLang] = useState<"python" | "typescript" | "curl">("python");
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeLifecycleStage, setActiveLifecycleStage] = useState<number>(0);
  
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

  const lifecycleStages = [
    {
      stage: "Stage 1",
      timing: "Day 0 – 7",
      title: "Rapid Prototyping",
      paradigm: "Composio Managed Auth",
      badge: "2-Min Setup",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      punchline: "Validate agent prompts & tool calling without opening provider dev consoles."
    },
    {
      stage: "Stage 2",
      timing: "Day 7 – 14",
      title: "Scope Pruning & Audit",
      paradigm: "Pre-Production Beta",
      badge: "Risk Minimizer",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      punchline: "Audit scopes to bypass $15k CASA Tier 2 audits before registering custom apps."
    },
    {
      stage: "Stage 3",
      timing: "Day 14+",
      title: "Enterprise Production",
      paradigm: "Custom AuthConfig (BYOC)",
      badge: "Enterprise Ready",
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
      punchline: "Bring your own client keys for 100% white-labeled consent screens & isolated quotas."
    }
  ];

  return (
    <div className="space-y-5 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-none border border-blue-100 bg-blue-50/70 px-2 py-0.5 text-xs mb-1.5">
            <BookOpen className="h-3 w-3 text-[#0024BC]" />
            <span className="font-semibold text-[#0024BC]">Composio Architecture Reference</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            Managed Auth vs. Custom AuthConfig (BYOC)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Composio supports two authentication paradigms. Understanding when to use Managed Auth versus when to migrate to Custom AuthConfig is the core decision for production agent systems.
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

      {/* Visual Architecture Flowchart (Glanceable In 2 Seconds) */}
      <div className="rounded-none border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">
            Architecture Blueprint &amp; Data Flow
          </span>
          <span className="text-[11px] font-mono text-slate-400">2-Second Visual Summary</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center text-xs">
          {/* Box 1: The AI Agent */}
          <div className="rounded-none border border-slate-200 bg-slate-50 p-3.5 text-center space-y-1">
            <div className="text-[10px] font-mono font-semibold uppercase text-slate-400">Step 1</div>
            <div className="font-bold text-slate-900">Your AI Agent / Runner</div>
            <p className="text-[11px] text-slate-500">Initiates tool calls (Slack, Gmail, GitHub)</p>
          </div>

          {/* Box 2: Composio Vault (The Glue) */}
          <div className="rounded-none border-2 border-[#0024BC] bg-blue-50/30 p-3.5 text-center space-y-1 relative">
            <div className="text-[10px] font-mono font-bold uppercase text-[#0024BC]">Composio Core Engine</div>
            <div className="font-bold text-slate-900">AES-256 Vault &amp; Auto-Refresh</div>
            <p className="text-[11px] text-slate-600">Handles token encryption, rotation &amp; 401 recovery</p>
          </div>

          {/* Box 3: Decision Branch */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="rounded-none border border-emerald-200 bg-emerald-50/40 p-2.5 space-y-0.5">
              <div className="font-bold text-emerald-900 text-[11px]">Managed Auth</div>
              <div className="text-[10px] text-emerald-700">Day 0–14 Prototype</div>
              <div className="text-[9px] font-mono text-emerald-800">Shared Keys • 0m Setup</div>
            </div>
            <div className="rounded-none border border-blue-200 bg-blue-50/40 p-2.5 space-y-0.5">
              <div className="font-bold text-blue-900 text-[11px]">Custom (BYOC)</div>
              <div className="text-[10px] text-blue-700">Day 14+ Enterprise</div>
              <div className="text-[9px] font-mono text-blue-800">Your Keys • White-Label</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Stage Lifecycle Cards (Clickable, Low-Text) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {lifecycleStages.map((item, idx) => {
          const isSelected = activeLifecycleStage === idx;

          return (
            <div
              key={idx}
              onClick={() => setActiveLifecycleStage(idx)}
              className={`cursor-pointer p-3 rounded-none border transition ${
                isSelected
                  ? "border-[#0024BC] bg-blue-50/30 ring-1 ring-[#0024BC]"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                  {item.stage} • {item.timing}
                </span>
                <span className={`px-1.5 py-0.2 text-[9px] font-mono font-semibold border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h3>
              <p className="text-[11px] text-slate-600 leading-snug mt-1">
                {item.punchline}
              </p>
            </div>
          );
        })}
      </div>

      {/* Glanceable Side-by-Side Comparison (Pill Badges) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Managed Auth Card */}
        <div className="rounded-none border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-none bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Composio Managed Auth</h3>
                <p className="text-[10px] text-slate-500 font-mono">Day 0 to 14 (Prototyping &amp; POC)</p>
              </div>
            </div>
            <span className="rounded-none border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-800">
              0 Min Setup
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-none bg-slate-50 p-2 border border-slate-200/60">
              <span className="font-mono text-[9px] text-slate-400 block uppercase">Setup Speed</span>
              <strong className="text-emerald-700">Instant (Under 2m)</strong>
            </div>
            <div className="rounded-none bg-slate-50 p-2 border border-slate-200/60">
              <span className="font-mono text-[9px] text-slate-400 block uppercase">Consent Branding</span>
              <strong className="text-amber-700">Composio Logo</strong>
            </div>
            <div className="rounded-none bg-slate-50 p-2 border border-slate-200/60">
              <span className="font-mono text-[9px] text-slate-400 block uppercase">Rate Limits</span>
              <strong className="text-amber-700">Shared Sandbox Pool</strong>
            </div>
            <div className="rounded-none bg-slate-50 p-2 border border-slate-200/60">
              <span className="font-mono text-[9px] text-slate-400 block uppercase">Token Vault</span>
              <strong className="text-emerald-700">AES-256 Auto-Refresh</strong>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500">Best for: Hackathons, prompt testing, MVP</span>
            <a
              href="https://docs.composio.dev/toolkits/managed-auth"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#0024BC] text-[11px] hover:underline"
            >
              <span>Docs</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Custom AuthConfig (BYOC) Card */}
        <div className="rounded-none border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-none bg-blue-50 text-blue-700 border border-blue-200">
                <Key className="h-3.5 w-3.5 text-[#0024BC]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Custom AuthConfig (BYOC)</h3>
                <p className="text-[10px] text-slate-500 font-mono">Day 14+ (Production &amp; Enterprise)</p>
              </div>
            </div>
            <span className="rounded-none border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#0024BC]">
              Enterprise Scale
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-none bg-slate-50 p-2 border border-slate-200/60">
              <span className="font-mono text-[9px] text-slate-400 block uppercase">Setup Speed</span>
              <strong className="text-slate-800">15–30m Credential Setup</strong>
            </div>
            <div className="rounded-none bg-slate-50 p-2 border border-slate-200/60">
              <span className="font-mono text-[9px] text-slate-400 block uppercase">Consent Branding</span>
              <strong className="text-blue-700">100% Your Company Logo</strong>
            </div>
            <div className="rounded-none bg-slate-50 p-2 border border-slate-200/60">
              <span className="font-mono text-[9px] text-slate-400 block uppercase">Rate Limits</span>
              <strong className="text-blue-700">Dedicated Provider Quota</strong>
            </div>
            <div className="rounded-none bg-slate-50 p-2 border border-slate-200/60">
              <span className="font-mono text-[9px] text-slate-400 block uppercase">Token Vault</span>
              <strong className="text-emerald-700">AES-256 Auto-Refresh</strong>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500">Best for: Production, SOC 2 compliance, client launch</span>
            <a
              href="https://docs.composio.dev/docs/tools-direct/authenticating-tools#hosted-authentication-connect-link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#0024BC] text-[11px] hover:underline"
            >
              <span>Docs</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Agent vs Human Handoff Matrix (Glanceable Tag Cloud) */}
      <div className="rounded-none border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">
            Agent vs. Human DevOps Boundary
          </span>
          <span className="text-[11px] font-mono text-slate-400">Responsibility Matrix</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Automated by Composio */}
          <div className="rounded-none border border-emerald-200 bg-emerald-50/20 p-3 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-[11px]">
              <Bot className="h-3.5 w-3.5 text-emerald-600" />
              <span>Automated by Composio &amp; Agent</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 bg-white border border-emerald-200 text-emerald-900 text-[11px] font-medium">
                ✓ Scope Minimization (Prevents $15k CASA)
              </span>
              <span className="px-2 py-1 bg-white border border-emerald-200 text-emerald-900 text-[11px] font-medium">
                ✓ Slack / Linear Manifest Generation
              </span>
              <span className="px-2 py-1 bg-white border border-emerald-200 text-emerald-900 text-[11px] font-medium">
                ✓ PKCE &amp; State Token Exchange
              </span>
              <span className="px-2 py-1 bg-white border border-emerald-200 text-emerald-900 text-[11px] font-medium">
                ✓ AES-256 Vault Token Custody
              </span>
              <span className="px-2 py-1 bg-white border border-emerald-200 text-emerald-900 text-[11px] font-medium">
                ✓ Transparent 401 Silent Token Refresh
              </span>
            </div>
          </div>

          {/* Requires Human DevOps */}
          <div className="rounded-none border border-amber-200 bg-amber-50/20 p-3 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-800 text-[11px]">
              <UserCheck className="h-3.5 w-3.5 text-amber-600" />
              <span>Requires Human DevOps / Legal</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 bg-white border border-amber-200 text-amber-900 text-[11px] font-medium">
                ⚠️ Provider Billing &amp; Credit Card
              </span>
              <span className="px-2 py-1 bg-white border border-amber-200 text-amber-900 text-[11px] font-medium">
                ⚠️ DNS TXT Domain Ownership Verification
              </span>
              <span className="px-2 py-1 bg-white border border-amber-200 text-amber-900 text-[11px] font-medium">
                ⚠️ YouTube Walkthrough Screencast (Google)
              </span>
              <span className="px-2 py-1 bg-white border border-amber-200 text-amber-900 text-[11px] font-medium">
                ⚠️ Hardware 2FA / Biometric Passkey
              </span>
              <span className="px-2 py-1 bg-white border border-amber-200 text-amber-900 text-[11px] font-medium">
                ⚠️ Enterprise DPA &amp; Terms Acceptance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Code Blueprint & Live Simulator (Side-by-Side or Compact) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* 2-Step SDK Blueprint */}
        <div className="rounded-none border border-slate-200 bg-white p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 font-mono">2-Step Composio Connection</span>
            <div className="flex items-center gap-1.5">
              <div className="flex rounded-none border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-mono">
                <button
                  onClick={() => setActiveLang("python")}
                  className={`px-1.5 py-0.2 transition ${activeLang === "python" ? "bg-white font-bold text-slate-900" : "text-slate-500"}`}
                >
                  Python
                </button>
                <button
                  onClick={() => setActiveLang("typescript")}
                  className={`px-1.5 py-0.2 transition ${activeLang === "typescript" ? "bg-white font-bold text-slate-900" : "text-slate-500"}`}
                >
                  TS
                </button>
                <button
                  onClick={() => setActiveLang("curl")}
                  className={`px-1.5 py-0.2 transition ${activeLang === "curl" ? "bg-white font-bold text-slate-900" : "text-slate-500"}`}
                >
                  cURL
                </button>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 rounded-none border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                {copiedCode ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-slate-400" />}
                <span>{copiedCode ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          <pre className="rounded-none border border-slate-800 bg-slate-900 p-3 font-mono text-[11px] text-slate-200 overflow-x-auto leading-relaxed h-[175px]">
            {snippets[activeLang]}
          </pre>
        </div>

        {/* Live Payload Simulator */}
        <div className="rounded-none border border-slate-200 bg-white p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#0024BC]">
              <Code2 className="h-3.5 w-3.5" />
              <span>Live BYOC Config Simulator</span>
            </div>

            <div className="flex items-center gap-2">
              {onOpenAppGuide && (
                <button
                  onClick={() => onOpenAppGuide(simApp, "composio")}
                  className="text-[11px] font-medium text-[#0024BC] hover:underline"
                >
                  Inspect {simApp} Guide ↗
                </button>
              )}
              <button
                onClick={handleCopyPayload}
                className="flex items-center gap-1 rounded-none border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                {copiedPayload ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-slate-400" />}
                <span>{copiedPayload ? "Copied" : "Copy JSON"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">App Preset</label>
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
                className="w-full rounded-none border border-slate-200 bg-white p-1 text-[11px] text-slate-800 font-mono focus:outline-none focus:border-[#0024BC]"
              >
                <option value="slack">Slack API</option>
                <option value="google-workspace">Google Workspace</option>
                <option value="github">GitHub</option>
                <option value="salesforce">Salesforce</option>
                <option value="notion">Notion</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Client ID</label>
              <input
                type="text"
                value={simClientId}
                onChange={(e) => setSimClientId(e.target.value)}
                className="w-full rounded-none border border-slate-200 bg-white p-1 text-[11px] font-mono text-slate-800 focus:outline-none focus:border-[#0024BC] truncate"
              />
            </div>
          </div>

          <pre className="rounded-none border border-slate-800 bg-slate-900 p-2.5 font-mono text-[10px] text-emerald-400 overflow-x-auto leading-relaxed h-[105px]">
            {currentPayloadJson}
          </pre>
        </div>
      </div>
    </div>
  );
}
