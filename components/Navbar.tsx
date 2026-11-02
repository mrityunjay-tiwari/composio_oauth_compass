"use client";

import { Sparkles, ShieldCheck, BookOpen, ExternalLink } from "lucide-react";

interface NavbarProps {
  activeTab: "directory" | "live-studio" | "ground-truth" | "composio-byoc";
  setActiveTab: (tab: "directory" | "live-studio" | "ground-truth" | "composio-byoc") => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        
        {/* Composio Wordmark + Sub-System Label */}
        <div className="flex items-center">
          <a
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity"
            aria-label="Composio Home"
          >
            <img
              src="/composio-logo.svg"
              alt="Composio"
              className="h-5 w-auto block object-contain"
            />
          </a>

          <div className="h-4 w-px bg-slate-200 mx-3 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] font-medium text-slate-600 bg-slate-100/80 border border-slate-200/70 px-2 py-0.5 rounded">
            <span>OAuth Compass</span>
          </div>
        </div>

        {/* Navigation Tabs - Fumadocs / Composio Style */}
        <nav className="flex items-center gap-1 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab("directory")}
            className={`rounded px-2.5 py-1.5 transition cursor-pointer ${
              activeTab === "directory"
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            App Directory
          </button>
          
          <button
            onClick={() => setActiveTab("live-studio")}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 transition cursor-pointer ${
              activeTab === "live-studio"
                ? "bg-blue-50 text-[#0024BC] font-semibold border border-blue-200/60"
                : "hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#0024BC]" />
            <span>Live Investigation</span>
          </button>
          
          <button
            onClick={() => setActiveTab("ground-truth")}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 transition cursor-pointer ${
              activeTab === "ground-truth"
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Ground Truth Audit</span>
          </button>
          
          <button
            onClick={() => setActiveTab("composio-byoc")}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 transition cursor-pointer ${
              activeTab === "composio-byoc"
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-slate-500" />
            <span>BYOC Guide</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="https://docs.composio.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 transition font-medium"
          >
            <span>Docs</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
          <a
            href="https://backend.composio.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-[#0024BC] px-3 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-[#001da0]"
          >
            Composio Dashboard
          </a>
        </div>

      </div>
    </header>
  );
}
