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
} from "lucide-react";
import ChatSources, { ChatSource } from "./chat-sources";
import AppCard from "./AppCard";

interface LiveInvestigationStudioProps {
  onGuideGenerated: (guide: AppGuide) => void;
  onOpenGuide: (guide: AppGuide) => void;
}

export default function LiveInvestigationStudio({
  onGuideGenerated,
  onOpenGuide,
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
        throw new Error("Investigation pipeline encountered an error");
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Studio Header */}
      <div className="space-y-1.5 border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 rounded-sm border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-mono font-medium text-blue-700">
          <Sparkles className="h-3 w-3" />
          <span>Real-Time Autonomous Agent</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Live OAuth Investigation Engine
        </h1>
        <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
          Submit any developer portal URL or platform name. The agent queries official documentation, ingests headless specifications via Jina Reader, detects review gates, and synthesizes a production BYOC guide on the fly.
        </p>
      </div>

      {/* Search Input Bar - Sharp & Minimalist */}
      <div className="rounded-md border border-slate-200 bg-white p-1.5 shadow-2xs transition focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600/20">
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
            className="flex items-center gap-1.5 rounded-sm bg-[#0024BC] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#001da0] disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Investigating...</span>
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5" />
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
            className="rounded-sm border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
          >
            {app}
          </button>
        ))}
      </div>

      {/* Investigation Progress & Steps (Agent Reasoning Stream) */}
      {(isLoading || steps.length > 0) && (
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
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
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Generated Guide Preview */}
      {generatedGuide && (
        <div className="space-y-3 pt-2">
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
