"use client";

import { ArrowUpRight, Globe } from "lucide-react";

export type ChatSource = {
  n: number;
  id: string;
  title: string;
  link: string;
  provider?: string | null;
  thumbnail?: string | null;
};

function hostOf(link: string) {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return link;
  }
}

function faviconOf(link: string) {
  return `https://www.google.com/s2/favicons?domain=${hostOf(link)}&sz=64`;
}

export default function ChatSources({ sources }: { sources: ChatSource[] }) {
  if (!sources || !sources.length) return null;

  return (
    <div className="flex flex-col gap-1.5 pt-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <Globe className="h-3.5 w-3.5 text-slate-400" />
        <span>Verified Sources & Provider Documentation</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((s, idx) => (
          <a
            key={s.id || idx}
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50"
          >
            <img
              src={faviconOf(s.link)}
              alt=""
              className="h-3.5 w-3.5 rounded-xs"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <span className="font-medium text-slate-800 truncate max-w-[180px]">
              {s.title || hostOf(s.link)}
            </span>
            <span className="text-[10px] text-slate-400">{hostOf(s.link)}</span>
            <ArrowUpRight className="h-3 w-3 text-slate-400 transition group-hover:text-slate-600" />
          </a>
        ))}
      </div>
    </div>
  );
}
