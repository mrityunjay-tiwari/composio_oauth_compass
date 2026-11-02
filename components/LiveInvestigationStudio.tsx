"use client";

import { useState } from "react";
import { AppGuide } from "@/data/apps";
import {
  Sparkles,
  Search,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Globe,
  AlertTriangle,
  Bot,
  Zap,
  ExternalLink,
  Plus
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
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Studio Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-[#FF6600]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Autonomous Real-Time Investigation Agent</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Investigate Any App Outside the Library
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Submit any platform name or developer documentation URL. Our agent searches live developer portals, ingests documentation via Jina Reader, detects review gates, and generates a Composio-ready setup guide in real time.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition focus-within:border-[#FF6600] focus-within:ring-2 focus-within:ring-[#FF6600]/10">
        <div className="flex items-center gap-3 px-3">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleInvestigate(query)}
            placeholder="Enter app name (e.g. Airtable, HubSpot) or docs URL..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none py-2 font-medium"
            disabled={isLoading}
          />
          <button
            onClick={() => handleInvestigate(query)}
            disabled={isLoading || !query.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-[#FF6600] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#E65C00] disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Investigating...</span>
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5" />
                <span>Investigate App</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Suggestion Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500">
        <span className="font-medium">Or test an unfamiliar app:</span>
        {sampleApps.map((app) => (
          <button
            key={app}
            onClick={() => {
              setQuery(app);
              handleInvestigate(app);
            }}
            disabled={isLoading}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            {app}
          </button>
        ))}
      </div>

      {/* Investigation Progress & Steps (Agent Reasoning Stream) */}
      {(isLoading || steps.length > 0) && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Bot className="h-4 w-4 text-[#FF6600]" />
              <span>Autonomous Investigation Stream</span>
            </div>
            {isLoading && (
              <span className="flex items-center gap-1.5 text-xs text-[#FF6600] font-medium">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Live Agent Active
              </span>
            )}
          </div>

          <div className="space-y-3">
            {steps.map((st, i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                {st.status === "completed" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <Loader2 className="h-4 w-4 text-[#FF6600] animate-spin mt-0.5 shrink-0" />
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
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Generated Guide Preview */}
      {generatedGuide && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Generated Interactive Guide
            </h3>
            <span className="text-xs text-emerald-600 font-medium">
              ✓ Ready for Composio Integration
            </span>
          </div>

          <AppCard guide={generatedGuide} onSelect={onOpenGuide} />
        </div>
      )}
    </div>
  );
}
