"use client";

import { ExternalLink, Check, Copy, BookOpen, Key, Zap } from "lucide-react";
import { useState } from "react";

export default function ComposioByocExplainer() {
  const [copied, setCopied] = useState(false);

  const pythonSnippet = `from composio import Composio, App

composio = Composio()

# 1. Register Custom Auth Config (BYOC)
auth_config = composio.auth_configs.create(
    app="slack",
    credentials={
        "client_id": process.env.SLACK_CLIENT_ID,
        "client_secret": process.env.SLACK_CLIENT_SECRET,
    }
)

# 2. Generate Hosted Connect Link for User
connection = composio.connected_accounts.link(
    user_uuid="user_p7a89x",
    auth_config_id=auth_config.id
)

print("Direct user to authenticate:", connection.redirect_url)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1.5 border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 rounded-sm border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-mono font-medium text-blue-700">
          <BookOpen className="h-3 w-3" />
          <span>Composio Architecture Reference</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Managed Auth vs. Custom AuthConfig (BYOC)
        </h1>
        <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
          Composio supports two authentication paradigms. Understanding when to use Managed Auth versus when to migrate to Custom AuthConfig is the core decision point for production agent architectures.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-md border border-slate-200 bg-white p-5 space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Composio Managed Auth</h3>
              <p className="text-[11px] text-slate-500 font-mono">Day 0 to Day 14 (Prototyping)</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Composio maintains pre-registered OAuth credentials for top toolkits. Developers can connect tools in 2 minutes without opening Google Cloud or Slack consoles.
          </p>

          <ul className="space-y-1.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>0 Minutes Setup:</strong> No provider approval or developer accounts needed.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Automated Token Custody:</strong> Auto-refreshes tokens and handles encrypted storage.</span>
            </li>
            <li className="flex items-start gap-2 text-amber-700">
              <span className="font-mono text-xs">⚠️</span>
              <span><strong>Shared Branding:</strong> OAuth consent screen displays &ldquo;Composio&rdquo;.</span>
            </li>
            <li className="flex items-start gap-2 text-amber-700">
              <span className="font-mono text-xs">⚠️</span>
              <span><strong>Shared Rate Limits:</strong> Quotas shared across all Composio developers on that app.</span>
            </li>
          </ul>

          <div className="pt-1">
            <a
              href="https://docs.composio.dev/toolkits/managed-auth"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
            >
              <span>View Managed Auth Documentation</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-blue-50 text-blue-700 border border-blue-200">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Custom AuthConfig (BYOC)</h3>
              <p className="text-[11px] text-slate-500 font-mono">Day 14+ (Production & Enterprise)</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Developers bring their own Client ID and Client Secret from Google, Slack, GitHub, or Salesforce. Mandatory for enterprise compliance and white-labeling.
          </p>

          <ul className="space-y-1.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>100% White-Labeled:</strong> Users see your agent&rsquo;s company logo and name.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Dedicated Rate Limits:</strong> Full provider API quota isolated for your customers.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Custom Scopes:</strong> Request bespoke permissions required by complex agent workflows.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Enterprise Compliance:</strong> Satisfies Okta/Entra and SOC 2 security audits.</span>
            </li>
          </ul>

          <div className="pt-1">
            <a
              href="https://docs.composio.dev/docs/tools-direct/authenticating-tools#hosted-authentication-connect-link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
            >
              <span>View Hosted Authentication Documentation</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Code Blueprint */}
      <div className="rounded-md border border-slate-200 bg-white p-5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm font-mono">2-Step Composio Connection Blueprint</h3>
            <p className="text-[11px] text-slate-500">How Custom Credentials connect to Composio&rsquo;s hosted auth links</p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-sm border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-slate-500" />}
            <span>{copied ? "Copied" : "Copy Blueprint"}</span>
          </button>
        </div>

        <pre className="rounded-sm border border-slate-800 bg-slate-900 p-3.5 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
          {pythonSnippet}
        </pre>
      </div>
    </div>
  );
}
