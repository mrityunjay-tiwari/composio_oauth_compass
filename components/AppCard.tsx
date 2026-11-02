"use client";

import { AppGuide } from "@/data/apps";
import { Clock, Calendar, AlertTriangle, ArrowRight, CheckCircle2, Zap } from "lucide-react";

interface AppCardProps {
  guide: AppGuide;
  onSelect: (guide: AppGuide) => void;
}

export default function AppCard({ guide, onSelect }: AppCardProps) {
  const getFrictionBadge = (score: number) => {
    if (score < 2) {
      return {
        label: "Instant",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        icon: <Zap className="h-3 w-3 text-emerald-600" />,
      };
    }
    if (score < 3.5) {
      return {
        label: "Moderate",
        badgeClass: "bg-blue-50 text-[#0024BC] border-blue-200/80",
        icon: <CheckCircle2 className="h-3 w-3 text-[#0024BC]" />,
      };
    }
    return {
      label: "High Friction",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200/80",
      icon: <AlertTriangle className="h-3 w-3 text-rose-600" />,
    };
  };

  const badge = getFrictionBadge(guide.frictionScore);
  const primaryGotcha = guide.gotchas[0];

  return (
    <div
      onClick={() => onSelect(guide)}
      className="group relative flex flex-col justify-between rounded border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-150 hover:border-slate-300 hover:shadow-xs cursor-pointer"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 flex items-center justify-center rounded border border-slate-200 bg-white p-1.5 shadow-2xs">
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
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{guide.category}</p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[10px] font-semibold ${badge.badgeClass}`}
          >
            {badge.icon}
            <span>{guide.frictionScore.toFixed(1)}/5</span>
          </span>
        </div>

        {/* Short Summary */}
        <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-2">
          {guide.summary}
        </p>

        {/* Primary Gotcha Warning */}
        {primaryGotcha && (
          <div className="mt-3 rounded border border-amber-200/70 bg-amber-50/50 px-2.5 py-1.5 text-[11px] text-amber-900">
            <div className="flex items-center gap-1.5 font-medium text-amber-800">
              <AlertTriangle className="h-3 w-3 shrink-0 text-amber-600" />
              <span className="truncate">{primaryGotcha.title}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
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

        <div className="flex items-center gap-1 font-sans text-xs font-semibold text-[#0024BC] group-hover:translate-x-0.5 transition-transform">
          <span>View</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}
