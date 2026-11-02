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
  Sparkles
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
      title: "Rapid Prototyping & POC",
      paradigm: "Composio Managed Auth",
      badge: "Zero Friction",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      description: "Focus 100% on agent prompts and tool definitions. No developer consoles, no DNS records, no OAuth app reviews.",
      deliverable: "Working agent prototype connected to Slack, Gmail, or GitHub in under 2 minutes."
    },
    {
      stage: "Stage 2",
      timing: "Day 7 – 14",
      title: "Scope Pruning & Team Beta",
      paradigm: "Pre-Production Audit",
      badge: "Risk Mitigation",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      description: "Audit required scopes using the Scope Minimizer. Swap restricted scopes to bypass the $15,000 CASA Tier 2 audit.",
      deliverable: "Clean scope manifest ready for provider developer console registration."
    },
    {
      stage: "Stage 3",
      timing: "Day 14+",
      title: "Enterprise Production & Scale",
      paradigm: "Custom AuthConfig (BYOC)",
      badge: "Enterprise Ready",
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
      description: "Deploy dedicated client credentials into Composio. White-label the consent screen with your logo and dedicate rate limits.",
      deliverable: "SOC 2 compliant enterprise integration running on isolated rate quotas."
    }
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-none border border-blue-100 bg-blue-50/70 px-2.5 py-0.5 text-xs mb-2">
            <BookOpen className="h-3 w-3 text-[#0024BC]" />
            <span className="font-semibold text-[#0024BC]">Composio Architecture Reference</span>
          </div>
          <h1 className="text-xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
            Managed Auth vs. Custom AuthConfig (BYOC)
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Composio supports two distinct authentication paradigms. Understanding when to stay on Managed Auth versus when and how to migrate to Custom AuthConfig is the core decision point for enterprise AI agent systems.
          </p>
        </div>

        {onNavigateTab && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab("ground-truth")}
              className="inline-flex items-center gap-1.5 rounded-none border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <span>View Ground Truth Audit</span>
              <ArrowRight className="h-3 w-3 text-slate-400" />
            </button>
          </div>
        )}
      </div>

      {/* 3-Stage Agent Auth Maturity Lifecycle */}
      <div className="rounded-none border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-mono">Agent Auth Maturity Lifecycle</h2>
            <p className="text-xs text-slate-500">The 3-phase progression from Day-0 prototype to enterprise scale</p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Click any phase to inspect</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {lifecycleStages.map((item, idx) => {
            const isSelected = activeLifecycleStage === idx;

            return (
              <div
                key={idx}
                onClick={() => setActiveLifecycleStage(idx)}
                className={`cursor-pointer p-4 rounded-none border transition ${
                  isSelected
                    ? "border-[#0024BC] bg-blue-50/20 ring-1 ring-[#0024BC]"
                    : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                    {item.stage} • {item.timing}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <div className="text-xs font-mono text-[#0024BC] font-semibold mt-0.5 mb-2">
                  {item.paradigm}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-700">
                  <span className="font-semibold text-slate-900">Output: </span>
                  <span>{item.deliverable}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Paradigm Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Managed Auth */}
        <div className="rounded-none border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-none bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Composio Managed Auth</h3>
                <p className="text-[11px] text-slate-500 font-mono">Day 0 to Day 14 (Prototyping &amp; POC)</p>
              </div>
            </div>
            <span className="rounded-none border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-800">
              Instant Setup
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Composio maintains pre-registered OAuth credentials for hundreds of developer tools. Developers connect tools in 2 minutes without registering accounts on Google Cloud, Slack, or GitHub.
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 text-slate-700">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>0 Minutes Setup:</strong> No provider approval, developer keys, or redirect URIs required.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Automated Token Custody:</strong> Tokens stored in AES-256 vault with automated refresh on 401s.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Hosted Auth Connect Links:</strong> Ready-made secure redirect links for testing agent tool actions.</span>
            </div>
            <div className="flex items-start gap-2 text-amber-800 bg-amber-50/50 p-2 border border-amber-200/60">
              <span className="font-mono text-xs">⚠️</span>
              <span><strong>Shared Branding:</strong> End-user OAuth consent screen displays &ldquo;Composio&rdquo; rather than your agent brand.</span>
            </div>
            <div className="flex items-start gap-2 text-amber-800 bg-amber-50/50 p-2 border border-amber-200/60">
              <span className="font-mono text-xs">⚠️</span>
              <span><strong>Shared API Quotas:</strong> Provider rate limits are pooled across developers building in sandbox environments.</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <a
              href="https://docs.composio.dev/toolkits/managed-auth"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0024BC] hover:underline"
            >
              <span>View Managed Auth Documentation</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Custom AuthConfig (BYOC) */}
        <div className="rounded-none border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-none bg-blue-50 text-blue-700 border border-blue-200">
                <Key className="h-4 w-4 text-[#0024BC]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Custom AuthConfig (BYOC)</h3>
                <p className="text-[11px] text-slate-500 font-mono">Day 14+ (Production &amp; Enterprise)</p>
              </div>
            </div>
            <span className="rounded-none border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#0024BC]">
              Enterprise Scale
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Developers provide their own Client ID and Client Secret created in the provider developer console. Essential for customer-facing applications requiring white-label branding and dedicated quotas.
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 text-slate-700">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>100% White-Labeled:</strong> End users see your company logo, terms of service, and privacy policy.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Dedicated Rate Limits:</strong> Full provider API quotas isolated exclusively for your paying customers.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Bespoke Scopes:</strong> Request exact enterprise scopes without being constrained to shared presets.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Zero Infra Burden:</strong> Composio still handles AES-256 token custody, secret rotation, and 401 recovery.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Enterprise Compliance:</strong> Satisfies enterprise Okta, Google Workspace, and SOC 2 vendor security reviews.</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <a
              href="https://docs.composio.dev/docs/tools-direct/authenticating-tools#hosted-authentication-connect-link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0024BC] hover:underline"
            >
              <span>View Hosted Auth Documentation</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="rounded-none border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-3 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">
            Architecture Capability Matrix
          </span>
          <span className="text-[11px] font-mono text-slate-500">Managed vs. BYOC</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-mono uppercase text-slate-600">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Evaluation Vector</th>
                <th className="py-2.5 px-4 font-semibold text-emerald-800">Managed Auth (Day 0–14)</th>
                <th className="py-2.5 px-4 font-semibold text-blue-800">Custom AuthConfig (BYOC)</th>
                <th className="py-2.5 px-4 font-semibold text-slate-700">The Composio Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Setup Velocity</td>
                <td className="py-3 px-4 text-emerald-700 font-medium">Under 2 minutes</td>
                <td className="py-3 px-4 text-slate-600">15–45 minutes setup</td>
                <td className="py-3 px-4 text-slate-500">Immediate prototype testing before investing in dev consoles</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Consent Screen Branding</td>
                <td className="py-3 px-4 text-amber-700">Displays &ldquo;Composio&rdquo;</td>
                <td className="py-3 px-4 text-blue-700 font-medium">100% White-Labeled (Your Logo)</td>
                <td className="py-3 px-4 text-slate-500">Seamless transition when ready for external customer signups</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">API Rate Limit Pool</td>
                <td className="py-3 px-4 text-amber-700">Shared multi-tenant pool</td>
                <td className="py-3 px-4 text-blue-700 font-medium">Dedicated company quota</td>
                <td className="py-3 px-4 text-slate-500">Zero quota interference between high-volume enterprise agents</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Token Custody &amp; Refresh</td>
                <td className="py-3 px-4 text-emerald-700 font-medium">Composio AES-256 Vault</td>
                <td className="py-3 px-4 text-emerald-700 font-medium">Composio AES-256 Vault</td>
                <td className="py-3 px-4 text-slate-900 font-medium">Developers never build database encryption or cron refreshers</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Enterprise Review Readiness</td>
                <td className="py-3 px-4 text-slate-500">Internal evaluation only</td>
                <td className="py-3 px-4 text-blue-700 font-medium">SOC 2 / Okta audit ready</td>
                <td className="py-3 px-4 text-slate-500">Passes enterprise vendor assessments without custom auth servers</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent vs. Human Boundary Matrix (The DevOps Handoff) */}
      <div className="rounded-none border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-mono">The Agent vs. Human Boundary Matrix</h2>
            <p className="text-xs text-slate-500">Clear demarcation of responsibilities during BYOC provisioning</p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">DevOps Handoff Protocol</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* What Composio & Agent Automate */}
          <div className="rounded-none border border-emerald-200 bg-emerald-50/30 p-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold font-mono text-xs">
              <Bot className="h-4 w-4 text-emerald-600" />
              <span>What Composio &amp; Agent Automates</span>
            </div>
            <ul className="space-y-2 text-emerald-950">
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

          {/* Where Humans Must Take Over */}
          <div className="rounded-none border border-amber-200 bg-amber-50/30 p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold font-mono text-xs">
              <UserCheck className="h-4 w-4 text-amber-600" />
              <span>Where Human DevOps Must Take Over</span>
            </div>
            <ul className="space-y-2 text-amber-950">
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

      {/* Interactive Multi-Language Code Blueprint */}
      <div className="rounded-none border border-slate-200 bg-white p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-mono">2-Step Composio Connection Blueprint</h2>
            <p className="text-xs text-slate-500">Connecting Custom Credentials to Composio Hosted Connect links</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-none border border-slate-200 bg-slate-50 p-0.5 text-xs font-mono">
              <button
                onClick={() => setActiveLang("python")}
                className={`px-2 py-0.5 transition ${activeLang === "python" ? "bg-white font-bold text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
              >
                Python
              </button>
              <button
                onClick={() => setActiveLang("typescript")}
                className={`px-2 py-0.5 transition ${activeLang === "typescript" ? "bg-white font-bold text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
              >
                TypeScript
              </button>
              <button
                onClick={() => setActiveLang("curl")}
                className={`px-2 py-0.5 transition ${activeLang === "curl" ? "bg-white font-bold text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
              >
                cURL
              </button>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 rounded-none border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
              <span>{copiedCode ? "Copied" : "Copy Code"}</span>
            </button>
          </div>
        </div>

        <pre className="rounded-none border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
          {snippets[activeLang]}
        </pre>
      </div>

      {/* Interactive BYOC Payload Playground */}
      <div className="rounded-none border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#0024BC] font-mono font-semibold mb-0.5">
              <Code2 className="h-3.5 w-3.5" />
              <span>Interactive Simulator</span>
            </div>
            <h2 className="text-sm font-bold text-slate-900">Custom AuthConfig Payload Generator</h2>
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
                className="w-full rounded-none border border-slate-200 bg-white p-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#0024BC]"
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
                className="w-full rounded-none border border-slate-200 bg-white p-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#0024BC]"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Client Secret / Consumer Secret</label>
              <input
                type="text"
                value={simClientSecret}
                onChange={(e) => setSimClientSecret(e.target.value)}
                className="w-full rounded-none border border-slate-200 bg-white p-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#0024BC]"
              />
            </div>

            <div className="pt-2 text-[11px] text-slate-500">
              Credentials injected into Composio&apos;s vault are encrypted at rest using envelope encryption (AES-256-GCM) with key rotation.
            </div>
          </div>

          {/* Live Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-600">
              <span className="font-semibold">composio_auth_config.json</span>
              <button
                onClick={handleCopyPayload}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 transition"
              >
                {copiedPayload ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-slate-400" />}
                <span>{copiedPayload ? "Copied JSON" : "Copy JSON"}</span>
              </button>
            </div>

            <pre className="rounded-none border border-slate-800 bg-slate-900 p-3.5 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed h-[180px]">
              {currentPayloadJson}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
