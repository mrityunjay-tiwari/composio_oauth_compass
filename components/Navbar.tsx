"use client";

import { Sparkles, ShieldCheck, BookOpen, ExternalLink } from "lucide-react";

interface NavbarProps {
  activeTab: "directory" | "live-studio" | "ground-truth" | "composio-byoc";
  setActiveTab: (tab: "directory" | "live-studio" | "ground-truth" | "composio-byoc") => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        
        {/* Composio Official Wordmark Logo + Project Label */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
            aria-label="Composio Home"
          >
            {/* Official Composio Logo Vector */}
            <img
              src="/composio-logo.svg"
              alt="Composio"
              className="h-6 w-auto block object-contain"
            />
            
            <span className="text-slate-300 font-light text-sm select-none">/</span>
            
            <span className="font-mono text-xs font-semibold tracking-tight text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-sm">
              OAuth Compass
            </span>
          </a>
        </div>

        {/* Navigation Tabs - Sharp, Modern, Restrained */}
        <nav className="flex items-center gap-1 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab("directory")}
            className={`rounded-md px-3 py-1.5 transition cursor-pointer ${
              activeTab === "directory"
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            App Directory
          </button>
          
          <button
            onClick={() => setActiveTab("live-studio")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition cursor-pointer ${
              activeTab === "live-studio"
                ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200/60"
                : "hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Live Investigation</span>
          </button>
          
          <button
            onClick={() => setActiveTab("ground-truth")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition cursor-pointer ${
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
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition cursor-pointer ${
              activeTab === "composio-byoc"
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-slate-500" />
            <span>Composio BYOC</span>
          </button>
        </nav>

        {/* External Links */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="https://docs.composio.dev/toolkits/managed-auth"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 transition font-medium"
          >
            <span>Managed Auth</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
          <a
            href="https://backend.composio.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-blue-700"
          >
            Composio Dashboard
          </a>
        </div>

      </div>
    </header>
  );
}
