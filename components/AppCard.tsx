"use client";

import { AppGuide } from "@/data/apps";
import { Clock, Calendar, AlertTriangle, ArrowRight, CheckCircle2, Zap } from "lucide-react";

interface AppCardProps {
  guide: AppGuide;
  onSelect: (guide: AppGuide, initialTab?: "checklist" | "scopes" | "gotchas" | "composio") => void;
}

export default function AppCard({ guide, onSelect }: AppCardProps) {
  const getFrictionBadge = (score: number) => {
    if (score < 2) {
      return {
        label: "Instant",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        icon: <Zap className="h-3 w-3 text-emerald-600" />,
        tier: "Instant / Low Friction (1.0 - 1.9)",
        summary: "Zero review hurdles. Self-serve credentials and test tokens generated instantly in developer portal.",
      };
    }
    if (score < 3.5) {
      return {
        label: "Moderate",
        badgeClass: "bg-blue-50 text-[#0024BC] border-blue-200/80",
        icon: <CheckCircle2 className="h-3 w-3 text-[#0024BC]" />,
        tier: "Moderate Friction (2.0 - 3.4)",
        summary: "Requires workspace admin authorization, granular scope permissions, or handling rigid token expiry.",
      };
    }
    return {
      label: "High Friction",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200/80",
      icon: <AlertTriangle className="h-3 w-3 text-rose-600" />,
      tier: "High Regulatory Gate (3.5 - 5.0)",
      summary: "Strict review required: mandatory directory submission, CASA security audit, or developer verification.",
    };
  };

  const badge = getFrictionBadge(guide.frictionScore);
  const primaryGotcha = guide.gotchas[0];

  return (
    <div
      onClick={() => onSelect(guide)}
      className="group relative flex flex-col justify-between rounded-none border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-150 hover:border-slate-300 hover:shadow-xs hover:z-30 cursor-pointer"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 flex items-center justify-center rounded-none border border-slate-200 bg-white p-1.5 shadow-2xs">
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
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-[#0024BC] transition-colors leading-tight">
                {guide.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-[11px] text-slate-400 font-medium">{guide.category}</p>
                {guide.isLiveInvestigated && (
                  <span className="inline-flex items-center rounded-none border border-blue-200 bg-blue-50 px-1.5 py-0.2 text-[10px] font-medium text-[#0024BC]">
                    Live Probe
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Friction Score Badge with Informative Tooltip */}
          <div
            className="relative group/friction inline-block"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`inline-flex items-center gap-1 rounded-none border px-2 py-0.5 text-[11px] font-medium cursor-help transition-all ${badge.badgeClass} hover:border-slate-400 select-none`}
              tabIndex={0}
              role="button"
              aria-label={`Friction Score: ${guide.frictionScore.toFixed(1)} out of 5. ${badge.label}`}
            >
              {badge.icon}
              <span>{guide.frictionScore.toFixed(1)}/5</span>
            </div>

            {/* Hover Tooltip Popup */}
            <div className="pointer-events-none absolute right-0 top-full mt-1.5 z-50 w-72 origin-top-right rounded-none border border-slate-200 bg-white p-3 text-left shadow-lg opacity-0 transition-all duration-150 group-hover/friction:pointer-events-auto group-hover/friction:opacity-100 group-hover/friction:translate-y-0 translate-y-1">
              {/* Tooltip Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                  {badge.icon}
                  <span>Friction: {guide.frictionScore.toFixed(1)} / 5</span>
                </div>
                <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded-none border ${badge.badgeClass}`}>
                  {badge.label}
                </span>
              </div>

              {/* What this number is */}
              <div className="text-[11px] font-medium text-slate-800 mb-1">
                {badge.tier}
              </div>
              <p className="text-xs leading-relaxed text-slate-600 mb-2.5">
                {badge.summary}
              </p>

              {/* Key Specs Breakdown */}
              <div className="space-y-1.5 border-t border-slate-100 pt-2 text-[11px] text-slate-700">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">Review Gate:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[150px] text-right">
                    {guide.reviewType}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">Approval Wait:</span>
                  <span className="font-semibold text-slate-900">
                    {guide.approvalWaitDays === 0 ? "0 days (Instant)" : `${guide.approvalWaitDays} days wait`}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">Setup Effort:</span>
                  <span className="font-semibold text-slate-900">~{guide.setupTimeMinutes} mins</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">Compliance Cost:</span>
                  <span className="font-semibold text-slate-900">{guide.financialCost}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">PKCE Protocol:</span>
                  <span className="font-semibold text-slate-900">
                    {guide.pkceRequired ? "Enforced (S256)" : "Optional"}
                  </span>
                </div>
              </div>

              {/* Tooltip Footer / Scale Guide */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Scale: 1.0 (Low) → 5.0 (High)</span>
                <span className="text-[#0024BC] font-medium">Click card to view</span>
              </div>
            </div>
          </div>
        </div>

        {/* Short Summary with Clean Hover Popover */}
        <div className="relative group/summary mt-2.5">
          <p
            title={guide.summary}
            className="text-xs leading-relaxed text-slate-600 line-clamp-2 cursor-help"
          >
            {guide.summary}
          </p>

          {/* Full Summary Hover Popover */}
          <div className="pointer-events-none absolute left-0 top-full mt-1.5 z-40 w-80 origin-top-left rounded-none border border-slate-200 bg-white p-3 text-left shadow-lg opacity-0 transition-all duration-150 group-hover/summary:pointer-events-auto group-hover/summary:opacity-100 group-hover/summary:translate-y-0 translate-y-1">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                Platform Architecture Overview
              </span>
              <span className="text-[10px] text-[#0024BC] font-medium">Click card to open</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-700">
              {guide.summary}
            </p>
          </div>
        </div>

        {/* Primary Gotcha Warning with Taxonomy & Rich Popover */}
        {primaryGotcha && (
          <div
            className="relative group/gotcha mt-3"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(guide, "gotchas");
            }}
          >
            <div className="rounded-none border border-amber-200/80 bg-amber-50/60 px-2.5 py-1.5 text-xs text-amber-950 transition hover:border-amber-300 hover:bg-amber-100/70 cursor-pointer">
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                  <span className="font-semibold text-amber-900 text-[10px] uppercase tracking-wide shrink-0">
                    Prod Pitfall:
                  </span>
                  <span className="truncate text-[11px] font-medium text-amber-950">
                    {primaryGotcha.title}
                  </span>
                </div>
                <ArrowRight className="h-3 w-3 shrink-0 text-amber-600 group-hover/gotcha:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Rich Hover Popover explaining the Pitfall */}
            <div className="pointer-events-none absolute left-0 bottom-full mb-1.5 z-40 w-80 sm:w-84 origin-bottom-left rounded-none border border-amber-200 bg-white p-3 text-left shadow-xl opacity-0 transition-all duration-150 group-hover/gotcha:pointer-events-auto group-hover/gotcha:opacity-100 group-hover/gotcha:translate-y-0 translate-y-1">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  <span>Unwritten Production Gotcha</span>
                </div>
                <span className="rounded-none bg-amber-50 border border-amber-200 px-1.5 py-0.2 text-[9px] uppercase font-semibold text-amber-800">
                  {primaryGotcha.severity}
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-900 mb-1">
                {primaryGotcha.title}
              </div>

              <p className="text-xs leading-relaxed text-slate-600 mb-2.5">
                {primaryGotcha.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 capitalize">
                  Evidence: {primaryGotcha.evidenceType.replace("_", " ")}
                </span>
                <span className="text-[#0024BC] font-semibold flex items-center gap-0.5 hover:underline">
                  <span>Open Gotchas tab</span>
                  <ArrowRight className="h-2.5 w-2.5" />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-slate-400" />
            <span>{guide.setupTimeMinutes}m</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-slate-400" />
            <span>{guide.approvalWaitDays === 0 ? "0d wait" : `${guide.approvalWaitDays}d wait`}</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-[#0024BC] group-hover:translate-x-0.5 transition-transform">
          <span>View</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}
