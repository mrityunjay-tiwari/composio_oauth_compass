"use client";

import { useState } from "react";
import { AppGuide } from "@/data/apps";
import {
  Sparkles,
  Search,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Zap,
  Clock,
  ArrowRight,
  X,
} from "lucide-react";
import { LuPackageSearch } from "react-icons/lu";
import ChatSources, { ChatSource } from "./chat-sources";
import AppCard from "./AppCard";
import { IoMdSearch } from "react-icons/io";

interface LiveInvestigationStudioProps {
  onGuideGenerated: (guide: AppGuide) => void;
  onOpenGuide: (guide: AppGuide, initialTab?: "checklist" | "scopes" | "gotchas" | "composio") => void;
  recentGuides?: AppGuide[];
  onRemoveRecentGuide?: (slug: string) => void;
  onNavigateToDirectory?: (slug?: string) => void;
}

export default function LiveInvestigationStudio({
  onGuideGenerated,
  onOpenGuide,
  recentGuides = [],
  onRemoveRecentGuide,
  onNavigateToDirectory,
}: LiveInvestigationStudioProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<{ title: string; status: "completed" | "in_progress"; detail: string }[]>([]);
  const [sources, setSources] = useState<ChatSource[]>([]);
  const [generatedGuide, setGeneratedGuide] = useState<AppGuide | null>(null);

  const sampleApps = ["Airtable", "Discord", "HubSpot", "Box", "Zoom", "Notion"];

  const handleInvestigate = async (searchQuery: string) => {
    const q = searchQuery.trim();
    if (!q) return;

    // Client-side guardrail 1: Too short / single letter (unless 'x')
    const isUrl = /^https?:\/\//i.test(q);
    if (!isUrl) {
      if (q.length < 2 && q.toLowerCase() !== "x") {
        setError(`"${q}" is too short to identify an OAuth provider. Please enter a full app name (e.g. Airtable, HubSpot, Discord, Box) or official docs URL.`);
        setSteps([]);
        setGeneratedGuide(null);
        setSources([]);
        return;
      }

      // Client-side guardrail 2: Protocol words
      const GENERIC_KEYWORDS = [
        "oauth", "oauth2", "auth", "authentication", "authorization",
        "login", "api", "token", "test", "demo", "app", "docs", "documentation", "webhook"
      ];
      if (GENERIC_KEYWORDS.includes(q.toLowerCase())) {
        setError(`"${q}" is a generic technical protocol term, not a third-party OAuth provider. Please specify an actual platform to investigate (e.g. Airtable, HubSpot, Discord, Box, Zoom).`);
        setSteps([]);
        setGeneratedGuide(null);
        setSources([]);
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setGeneratedGuide(null);
    setSources([]);
    setSteps([
      { title: `Initiating autonomous probe for ${q}`, status: "in_progress", detail: "Connecting to developer search index..." },
    ]);

    try {
      const res = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Investigation pipeline encountered an error");
      }

      const data = await res.json();
      setSteps(data.steps || []);
      if (data.sources) {
        setSources(
          data.sources.map((s: any, idx: number) => ({
            n: idx + 1,
            id: `src-${idx}`,
            title: s.title,
            link: s.url,
          }))
        );
      }
      setGeneratedGuide(data.guide);
      onGuideGenerated(data.guide);
    } catch (err: any) {
      setError(err.message || "Failed to investigate app");
      setSteps([]); // Shut down progress stream so no spinning indicator remains
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5 w-full">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-none border border-blue-100 bg-blue-50/70 px-2.5 py-0.5 text-xs mb-2">
            <LuPackageSearch className="h-3 w-3" />
            <span>Autonomous Probe & Synthesis</span>
          </div> 
          <h1 className="text-xl sm:text-4xl font-semibold text-slate-900">
            Live Investigation Studio
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Submit any unfamiliar developer portal URL or platform name. The autonomous agent queries official documentation, ingests headless specifications via Jina Reader, detects review gates, and synthesizes a production BYOC guide on the fly.
          </p>
        </div>
      </div>

      {/* Search Input Bar - Sharp & Minimalist */}
      <div className="rounded-none border border-slate-200 bg-white p-1.5 shadow-2xs transition focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600/20">
        <div className="flex items-center gap-2 px-2">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleInvestigate(query)}
            placeholder="Enter app name (e.g. Airtable, HubSpot) or documentation URL..."
            className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none py-1.5 font-medium"
            disabled={isLoading}
          />
          <button
            onClick={() => handleInvestigate(query)}
            disabled={isLoading || !query.trim()}
            className="flex items-center gap-1.5 rounded-none bg-[#0024BC] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#001da0] disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Investigating...</span>
              </>
            ) : (
              <> 
                <IoMdSearch className="h-3.5 w-3.5" />
                <span>Investigate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Suggestion Pills */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500">
        <span className="text-[11px] font-mono text-slate-400">Sample targets:</span>
        {sampleApps.map((app) => (
          <button
            key={app}
            onClick={() => {
              setQuery(app);
              handleInvestigate(app);
            }}
            disabled={isLoading}
            className="rounded-none border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
          >
            {app}
          </button>
        ))}
      </div>

      {/* Additional Section: Recent Investigations */}
      {recentGuides && recentGuides.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500 pt-0.5">
          <span className="text-[11px] font-mono text-slate-600 font-semibold flex items-center gap-1">
            <Clock className="h-3 w-3 text-[#0024BC]" />
            <span>Recent Investigations:</span>
          </span>
          {recentGuides.map((rg) => (
            <div
              key={rg.id}
              className="inline-flex items-center gap-1 rounded-none border border-blue-200 bg-blue-50/70 px-2 py-0.5 font-mono text-[11px] text-[#0024BC] transition hover:bg-blue-100"
            >
              <button
                onClick={() => {
                  setGeneratedGuide(rg);
                  onOpenGuide(rg);
                }}
                className="cursor-pointer font-medium hover:underline flex items-center gap-1"
                title={`Open ${rg.name} guide`}
              >
                <span>{rg.name}</span>
                <span className="text-[10px] text-blue-600 font-normal">({rg.frictionScore.toFixed(1)}/5)</span>
              </button>
              {onRemoveRecentGuide && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveRecentGuide(rg.slug);
                  }}
                  title="Remove from history"
                  className="text-blue-400 hover:text-rose-600 cursor-pointer p-0.5 transition-colors"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Investigation Progress & Steps (Agent Reasoning Stream) */}
      {(isLoading || steps.length > 0) && (
        <div className="rounded-none border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <Bot className="h-4 w-4 text-blue-600" />
              <span>Autonomous Investigation Stream</span>
            </div>
            {isLoading && (
              <span className="flex items-center gap-1.5 text-xs text-blue-600 font-medium font-mono text-[11px]">
                <Loader2 className="h-3 w-3 animate-spin" />
                Active Probe
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {steps.map((st, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs">
                {st.status === "completed" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <Loader2 className="h-4 w-4 text-blue-600 animate-spin mt-0.5 shrink-0" />
                )}
                <div>
                  <div className="font-semibold text-slate-800">{st.title}</div>
                  <div className="text-slate-500 font-mono text-[11px] mt-0.5">{st.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Sources Discovered */}
          {sources.length > 0 && <ChatSources sources={sources} />}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-none border border-rose-200 bg-rose-50/70 p-4 text-xs text-rose-900 space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-rose-950">Investigation Query Unresolved</div>
              <p className="text-rose-800 leading-relaxed">{error}</p>
            </div>
          </div>
          <div className="pt-2 border-t border-rose-200/60 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="font-mono text-rose-700">Try an active unfamiliar platform:</span>
            {["Airtable", "Discord", "HubSpot", "Box", "Zoom"].map((suggested) => (
              <button
                key={suggested}
                onClick={() => {
                  setQuery(suggested);
                  handleInvestigate(suggested);
                }}
                className="rounded-none border border-rose-300 bg-white px-2 py-0.5 text-rose-900 font-mono hover:bg-rose-100 transition cursor-pointer"
              >
                {suggested}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Generated Guide Preview */}
      {generatedGuide && (
        <div className="space-y-3 pt-2">
          {/* Notification that this app is now added to the App Directory */}
          <div className="rounded-none border border-emerald-200 bg-emerald-50/70 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                <strong>{generatedGuide.name}</strong> was investigated and added to your <strong>App Directory</strong>.
              </span>
            </div>
            {onNavigateToDirectory && (
              <button
                onClick={() => onNavigateToDirectory(generatedGuide.slug)}
                className="inline-flex items-center gap-1 font-semibold text-[#0024BC] hover:underline cursor-pointer shrink-0"
              >
                <span>View in App Directory</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 font-mono">
              Generated Interactive Guide
            </h3>
            <span className="text-[11px] text-emerald-700 font-mono font-medium">
              ✓ Ready for Composio Integration
            </span>
          </div>

          <AppCard guide={generatedGuide} onSelect={onOpenGuide} />
        </div>
      )}
    </div>
  );
}
