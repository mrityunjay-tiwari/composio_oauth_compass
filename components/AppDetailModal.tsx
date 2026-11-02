"use client";

import { useState } from "react";
import { AppGuide } from "@/data/apps";
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  User,
  Bot,
  FileCode2,
  CheckCircle2,
  Layers,
  Share2
} from "lucide-react";
import ChatSources from "./chat-sources";

interface AppDetailModalProps {
  guide: AppGuide;
  onClose: () => void;
}

export default function AppDetailModal({ guide, onClose }: AppDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"checklist" | "scopes" | "gotchas" | "composio">("checklist");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [selectedScopes, setSelectedScopes] = useState<string[]>(
    guide.scopes.filter((s) => s.riskLevel !== "restricted").map((s) => s.name)
  );

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleStep = (id: number) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleScope = (scopeName: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeName) ? prev.filter((s) => s !== scopeName) : [...prev, scopeName]
    );
  };

  // Has restricted scope selected?
  const hasRestrictedScope = guide.scopes.some(
    (s) => s.riskLevel === "restricted" && selectedScopes.includes(s.name)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-lg border border-slate-200 bg-white shadow-xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Modal Header */}
        <div className="border-b border-slate-200 bg-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-sm border border-slate-200 bg-white p-1.5 shadow-2xs">
              <img
                src={guide.logo}
                alt={guide.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{guide.name}</h2>
                <span className="rounded-sm bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-mono text-slate-700">
                  {guide.category}
                </span>
                {guide.composioManagedAvailable && (
                  <span className="rounded-sm bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                    Composio Managed
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                OAuth 2.0 Integration & BYOC Configuration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(window.location.href, "share")}
              className="flex items-center gap-1.5 rounded-sm border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              {copiedField === "share" ? <Check className="h-3 w-3 text-emerald-600" /> : <Share2 className="h-3 w-3 text-slate-500" />}
              <span>{copiedField === "share" ? "Copied" : "Share"}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-sm p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 bg-slate-50/60 px-6 py-2.5 text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-sans font-medium">Friction Score</span>
            <div className="font-semibold text-slate-900 mt-0.5">
              <span>{guide.frictionScore}/5.0</span>
              <span className="text-[10px] text-slate-500 font-sans ml-1">
                {guide.frictionScore < 2 ? "(Low)" : guide.frictionScore < 3.5 ? "(Medium)" : "(High)"}
              </span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-sans font-medium">Setup Effort</span>
            <div className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
              <Clock className="h-3 w-3 text-slate-400" />
              <span>~{guide.setupTimeMinutes} mins</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-sans font-medium">Approval Wait</span>
            <div className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
              <Calendar className="h-3 w-3 text-slate-400" />
              <span>{guide.approvalWaitDays === 0 ? "0 Days (Instant)" : `${guide.approvalWaitDays} Days`}</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-sans font-medium">Review / Audit Fee</span>
            <div className="font-semibold text-slate-900 mt-0.5 truncate font-sans text-xs" title={guide.financialCost}>
              {guide.financialCost}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 bg-white px-6 flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab("checklist")}
            className={`flex items-center gap-1.5 border-b-2 py-2.5 transition ${
              activeTab === "checklist"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Setup Checklist & Handoff</span>
          </button>
          <button
            onClick={() => setActiveTab("scopes")}
            className={`flex items-center gap-1.5 border-b-2 py-2.5 transition ${
              activeTab === "scopes"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Scope Minimizer</span>
            {hasRestrictedScope && (
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("gotchas")}
            className={`flex items-center gap-1.5 border-b-2 py-2.5 transition ${
              activeTab === "gotchas"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span>Gotchas & Traps ({guide.gotchas.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("composio")}
            className={`flex items-center gap-1.5 border-b-2 py-2.5 transition ${
              activeTab === "composio"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileCode2 className="h-3.5 w-3.5 text-slate-600" />
            <span>Composio BYOC Config</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-700 space-y-6">

          {/* TAB 1: SETUP CHECKLIST & AGENT HANDOFF */}
          {activeTab === "checklist" && (
            <div className="space-y-6">
              {/* Agent vs Human Matrix Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-md border border-slate-200 bg-slate-50/50 p-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 mb-2">
                    <Bot className="h-3.5 w-3.5 text-blue-600" />
                    <span>Agent Automates</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {guide.agentCanDo.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 mb-2">
                    <User className="h-3.5 w-3.5 text-slate-700" />
                    <span>Human Action Required</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {guide.humanMustDo.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step by Step Checklist */}
              <div>
                <h3 className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-3 font-mono">
                  Execution Checklist
                </h3>
                <div className="space-y-2.5">
                  {guide.steps.map((step) => {
                    const isDone = completedSteps[step.id];
                    return (
                      <div
                        key={step.id}
                        className={`rounded-md border p-3.5 transition ${
                          isDone
                            ? "border-emerald-200 bg-emerald-50/20"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={!!isDone}
                            onChange={() => toggleStep(step.id)}
                            className="mt-1 h-3.5 w-3.5 rounded-xs border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-xs font-semibold ${isDone ? "line-through text-slate-400" : "text-slate-900"}`}>
                                Step {step.id}: {step.title}
                              </span>
                              <span
                                className={`rounded-sm px-1.5 py-0.5 text-[9px] font-mono uppercase font-semibold ${
                                  step.actor === "agent"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : step.actor === "human"
                                    ? "bg-slate-100 text-slate-700 border border-slate-200"
                                    : "bg-purple-50 text-purple-700 border border-purple-200"
                                }`}
                              >
                                {step.actor === "agent" ? "Agent" : step.actor === "human" ? "Human" : "Hybrid"}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                              {step.description}
                            </p>

                            {/* Code snippet or callback URL */}
                            {step.codeSnippet && (
                              <div className="mt-2 flex items-center justify-between rounded-sm bg-slate-900 px-3 py-1.5 font-mono text-xs text-slate-200">
                                <span className="truncate">{step.codeSnippet}</span>
                                <button
                                  onClick={() => copyToClipboard(step.codeSnippet!, `step-${step.id}`)}
                                  className="ml-2 flex items-center gap-1 rounded-sm bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 hover:bg-slate-700"
                                >
                                  {copiedField === `step-${step.id}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                                  <span>{copiedField === `step-${step.id}` ? "Copied" : "Copy"}</span>
                                </button>
                              </div>
                            )}

                            {/* Direct portal link */}
                            {step.portalUrl && (
                              <div className="pt-1">
                                <a
                                  href={step.portalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                                >
                                  <span>Open Developer Console</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}

                            {/* Gotcha Callout under step */}
                            {step.gotchaWarning && (
                              <div className="mt-2 rounded-sm border border-amber-200 bg-amber-50/80 p-2 text-xs text-amber-900 flex items-start gap-2">
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                                <span>{step.gotchaWarning}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Verified Sources */}
              {guide.evidence?.docCitations && (
                <ChatSources
                  sources={guide.evidence.docCitations.map((url, i) => ({
                    n: i + 1,
                    id: `cite-${i}`,
                    title: `${guide.name} Official Documentation`,
                    link: url,
                  }))}
                />
              )}
            </div>
          )}

          {/* TAB 2: SCOPE MINIMIZER & CASA CALCULATOR */}
          {activeTab === "scopes" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 font-mono">Least-Privilege Scope Calculator</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select the capabilities your AI agent actually needs. The engine flags permissions that trigger third-party security audits (like Google CASA Tier 2) or delay launch.
                </p>
              </div>

              {/* CASA / Risk Warning Banner */}
              {hasRestrictedScope ? (
                <div className="rounded-md border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-900 space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-rose-800">
                    <ShieldAlert className="h-4 w-4 text-rose-600" />
                    <span>RESTRICTED SCOPE SELECTED: CASA Tier 2 Audit Triggered</span>
                  </div>
                  <p className="leading-relaxed">
                    You selected a <strong>Restricted Scope</strong>. Google requires an annual independent third-party security assessment (CASA Tier 2) costing <strong>$3,000 to $15,000</strong> and 4 to 6 weeks of review.
                  </p>
                  <p className="font-medium text-rose-700">
                    💡 Recommendation: Use specific send or read-only scopes instead to bypass third-party assessment.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Optimal Scope Selection:</strong> Scopes do not trigger restricted CASA third-party audits. Expedited review path.
                  </span>
                </div>
              )}

              {/* Scopes Table */}
              <div className="rounded-md border border-slate-200 overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                    <tr>
                      <th className="py-2 px-3">Include</th>
                      <th className="py-2 px-3">Scope</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3">Risk Tier</th>
                      <th className="py-2 px-3">Composio Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {guide.scopes.map((s) => {
                      const isSelected = selectedScopes.includes(s.name);
                      return (
                        <tr
                          key={s.name}
                          onClick={() => toggleScope(s.name)}
                          className={`hover:bg-slate-50 cursor-pointer transition ${
                            s.riskLevel === "restricted" && isSelected ? "bg-rose-50/30" : ""
                          }`}
                        >
                          <td className="py-2.5 px-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="h-3.5 w-3.5 rounded-xs border-slate-300 text-blue-600 focus:ring-blue-600"
                            />
                          </td>
                          <td className="py-2.5 px-3 font-mono font-medium text-slate-900">
                            {s.name}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {s.description}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`rounded-sm px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase ${
                                s.riskLevel === "restricted"
                                  ? "bg-rose-100 text-rose-800"
                                  : s.riskLevel === "medium"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {s.riskLevel}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex flex-wrap gap-1">
                              {s.composioActions.map((act) => (
                                <span key={act} className="rounded-xs bg-slate-100 px-1 py-0.5 font-mono text-[9px] text-slate-700">
                                  {act}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: UNWRITTEN GOTCHAS & TRAPS */}
          {activeTab === "gotchas" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 font-mono">Unwritten Gotchas & Production Traps</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Edge cases and failure modes omitted from official documentation, discovered through real-world deployment attempts.
                </p>
              </div>

              <div className="space-y-2.5">
                {guide.gotchas.map((gotcha, idx) => (
                  <div
                    key={idx}
                    className={`rounded-md border p-3.5 space-y-1 ${
                      gotcha.severity === "critical"
                        ? "border-rose-200 bg-rose-50/40"
                        : gotcha.severity === "warning"
                        ? "border-amber-200 bg-amber-50/40"
                        : "border-blue-200 bg-blue-50/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold text-xs text-slate-900">
                        <AlertTriangle
                          className={`h-3.5 w-3.5 ${
                            gotcha.severity === "critical"
                              ? "text-rose-600"
                              : gotcha.severity === "warning"
                              ? "text-amber-600"
                              : "text-blue-600"
                          }`}
                        />
                        <span>{gotcha.title}</span>
                      </div>
                      <span className="rounded-sm bg-white border border-slate-200 px-1.5 py-0.5 text-[9px] font-mono text-slate-600 uppercase">
                        {gotcha.evidenceType.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {gotcha.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COMPOSIO BYOC CONFIG & MANIFEST */}
          {activeTab === "composio" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 font-mono">Composio BYOC Configuration Payload</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ready-to-use configuration for the Composio Custom App API and Python/TypeScript SDK.
                </p>
              </div>

              {/* Provider Manifest (if available, e.g., Slack) */}
              {guide.manifestTemplate && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>Provider Manifest ({guide.manifestTemplate.filename})</span>
                    <button
                      onClick={() => copyToClipboard(guide.manifestTemplate!.content, "manifest")}
                      className="flex items-center gap-1 rounded-sm border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-700 hover:bg-slate-50"
                    >
                      {copiedField === "manifest" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedField === "manifest" ? "Copied" : "Copy Manifest"}</span>
                    </button>
                  </div>
                  <pre className="rounded-sm border border-slate-800 bg-slate-900 p-3.5 font-mono text-xs text-slate-200 overflow-x-auto">
                    {guide.manifestTemplate.content}
                  </pre>
                </div>
              )}

              {/* Python SDK Snippet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>Python SDK</span>
                  <button
                    onClick={() => copyToClipboard(guide.composioConfig.sample_sdk_python, "sdk-python")}
                    className="flex items-center gap-1 rounded-sm border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-700 hover:bg-slate-50"
                  >
                    {copiedField === "sdk-python" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedField === "sdk-python" ? "Copied" : "Copy Python"}</span>
                  </button>
                </div>
                <pre className="rounded-sm border border-slate-800 bg-slate-900 p-3.5 font-mono text-xs text-slate-200 overflow-x-auto">
                  {guide.composioConfig.sample_sdk_python}
                </pre>
              </div>

              {/* TypeScript SDK Snippet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>TypeScript SDK</span>
                  <button
                    onClick={() => copyToClipboard(guide.composioConfig.sample_sdk_typescript, "sdk-ts")}
                    className="flex items-center gap-1 rounded-sm border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-700 hover:bg-slate-50"
                  >
                    {copiedField === "sdk-ts" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedField === "sdk-ts" ? "Copied" : "Copy TS"}</span>
                  </button>
                </div>
                <pre className="rounded-sm border border-slate-800 bg-slate-900 p-3.5 font-mono text-xs text-slate-200 overflow-x-auto">
                  {guide.composioConfig.sample_sdk_typescript}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
            <span>Official Docs:</span>
            <a
              href={guide.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-sans font-medium hover:underline flex items-center gap-1"
            >
              <span>{new URL(guide.docsUrl).hostname}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <button
            onClick={onClose}
            className="rounded-sm bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
}
