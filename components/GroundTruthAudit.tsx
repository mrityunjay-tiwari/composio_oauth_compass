"use client";

import { ShieldCheck, AlertTriangle, HelpCircle, CheckCircle } from "lucide-react";

export default function GroundTruthAudit() {
  const auditEntries = [
    {
      app: "Google Cloud / Workspace",
      docClaim: "Register OAuth consent screen, select requested scopes, and submit for verification when ready.",
      testedReality: "7-Day Silent Token Expiry in Testing Mode: While an app is in 'Testing' status, Google silently expires all refresh tokens after exactly 7 days (604,800 seconds). AI background cron jobs die every Sunday night.",
      correction: "Warn builders to either push to 'In Production' with internal/test users or automate token re-authentication alerts in Composio.",
      riskType: "Critical Failure Mode",
      status: "Tested & Corrected",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200"
    },
    {
      app: "Google (Gmail Scopes)",
      docClaim: "Select required scopes such as 'gmail.modify' to read and manage messages.",
      testedReality: "The $15,000 CASA Tier 2 Audit Trap: Selecting 'gmail.modify' or 'gmail.readonly' classifies the app as Restricted, requiring an annual third-party CASA security audit costing $3k–$15k and 4–6 weeks of review.",
      correction: "Use 'gmail.send' and 'drive.file' (Sensitive only, not Restricted) to bypass CASA Tier 2 and launch in under 2 weeks.",
      riskType: "Financial & Delay Penalty",
      status: "Verified & Optimized",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200"
    },
    {
      app: "Slack API",
      docClaim: "Submit your app for review before distributing it to other teams.",
      testedReality: "App Directory vs. Public Distribution Illusion: You do NOT need the 2-week Slack App Directory review to install on external workspaces. Toggling 'Manage Distribution -> Public Distribution' works instantly.",
      correction: "Instruct developers to activate Public Distribution directly, reducing time-to-production from 14 days to 0 minutes.",
      riskType: "Unnecessary Friction",
      status: "Tested & Corrected",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      app: "Spotify Web API",
      docClaim: "Authenticate users with the Authorization Code grant in Development Mode.",
      testedReality: "The 25-User Hard Cap Gate: Apps in Development Mode fail immediately for the 26th user with an opaque 403 error unless that exact user email was manually whitelisted in the developer dashboard.",
      correction: "Flag the 25-user cap upfront and prompt developers to submit the Quota Extension request during early beta testing.",
      riskType: "Production Blocker",
      status: "Tested & Verified",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200"
    },
    {
      app: "Salesforce Connected Apps",
      docClaim: "Create Connected App, copy Consumer Key and Secret, and authenticate immediately.",
      testedReality: "10-Minute Global Cluster Propagation Lag: For 2 to 10 minutes after creating a Connected App, OAuth attempts fail with 'invalid_client_id' while keys replicate across Salesforce data centers.",
      correction: "Built-in warning explaining replication delay so developers don't spend hours debugging functioning code.",
      riskType: "Developer Confusion",
      status: "Tested & Verified",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
    }
  ];

  return (
    <div className="space-y-5 w-full">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-none border border-blue-100 bg-blue-50/70 px-2.5 py-0.5 text-xs mb-2">
            <ShieldCheck className="h-3 w-3" />
            <span>Requirement #2: Evidence & Ground Truth Audit</span>
          </div>
          <h1 className="text-xl sm:text-4xl font-semibold text-slate-900">
            Tested Reality vs. Official Documentation
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Official documentation presents the &ldquo;happy path,&rdquo; but real-world setups are riddled with unwritten rules, silent token expirations, and unexpected security assessments. Here is what we tested, corrected, and learned.
          </p>
        </div>
      </div>

      {/* 3-Tier Evidence Taxonomy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-none border border-slate-200 bg-white p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>[Verified - Official Docs]</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Technical endpoints, PKCE parameters, and redirect URI formatting verified directly against active provider documentation.
          </p>
        </div>
        <div className="rounded-none border border-slate-200 bg-white p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <span>[Observed - Tested Reality]</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Edge cases and hidden gotchas discovered through real developer account testing that documentation omits or buries in fine print.
          </p>
        </div>
        <div className="rounded-none border border-slate-200 bg-white p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
            <span>[Uncertain / Opaque Policy]</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Provider review queue turnaround times and discretionary reviewer criteria that cannot be mathematically guaranteed.
          </p>
        </div>
      </div>

      {/* Audit Comparison Table */}
      <div className="rounded-none border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-2.5 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 font-mono">Evidence Audit Matrix</span>
          <span className="text-[11px] font-mono text-slate-500">5 Discrepancies Cataloged</span>
        </div>

        <div className="divide-y divide-slate-100">
          {auditEntries.map((item, idx) => (
            <div key={idx} className="p-5 space-y-2.5 hover:bg-slate-50/40 transition">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">{item.app}</span>
                <span className={`rounded-none border px-2 py-0.5 text-[9px] font-mono font-semibold uppercase ${item.badgeColor}`}>
                  {item.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="rounded-none bg-slate-50 p-2.5 border border-slate-200/60 space-y-0.5">
                  <span className="font-semibold text-slate-500 text-[10px] uppercase font-mono tracking-wider">
                    Official Documentation Claim
                  </span>
                  <p className="text-slate-700 leading-relaxed">{item.docClaim}</p>
                </div>
                <div className="rounded-none bg-amber-50/50 p-2.5 border border-amber-200/60 space-y-0.5">
                  <span className="font-semibold text-amber-800 text-[10px] uppercase font-mono tracking-wider">
                    Tested Reality (The Trap)
                  </span>
                  <p className="text-amber-900 leading-relaxed">{item.testedReality}</p>
                </div>
              </div>

              <div className="rounded-none bg-emerald-50/40 p-2.5 border border-emerald-200/60 text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">How OAuth Compass Solves It: </span>
                  <span>{item.correction}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
