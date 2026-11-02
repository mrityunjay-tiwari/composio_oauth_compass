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
        label: "Instant & Frictionless",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
        icon: <Zap className="h-3.5 w-3.5 text-emerald-600" />,
      };
    }
    if (score < 3.5) {
      return {
        label: "Manifest / Light Review",
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200/60",
        icon: <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />,
      };
    }
    return {
      label: "High Friction / Security Audit",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-200/60",
      icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />,
    };
  };

  const badge = getFrictionBadge(guide.frictionScore);
  const primaryGotcha = guide.gotchas[0];

  return (
    <div
      onClick={() => onSelect(guide)}
      className="group relative flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md cursor-pointer"
    >
      <div>
        {/* Top Header: Logo + Name + Category + Friction Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-100 bg-slate-50 p-1.5 shadow-2xs">
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
              <h3 className="font-semibold text-slate-900 group-hover:text-[#FF6600] transition">
                {guide.name}
              </h3>
              <p className="text-xs text-slate-500">{guide.category}</p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${badge.badgeClass}`}
          >
            {badge.icon}
            {guide.frictionScore.toFixed(1)}/5
          </span>
        </div>

        {/* Short Summary */}
        <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-2">
          {guide.summary}
        </p>

        {/* Primary Gotcha Warning (if any) */}
        {primaryGotcha && (
          <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50/60 p-2 text-[11px] text-amber-900">
            <div className="flex items-center gap-1.5 font-medium text-amber-800">
              <AlertTriangle className="h-3 w-3 shrink-0 text-amber-600" />
              <span className="truncate">{primaryGotcha.title}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-slate-400" />
            {guide.setupTimeMinutes}m setup
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-slate-400" />
            {guide.approvalWaitDays === 0 ? "0d wait" : `${guide.approvalWaitDays}d wait`}
          </span>
        </div>

        <div className="flex items-center gap-1 font-medium text-[#FF6600] group-hover:translate-x-0.5 transition-transform">
          <span>View Guide</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}
