"use client";

import Link from "next/link";
import { Compass, Sparkles, ShieldCheck, BookOpen, ExternalLink } from "lucide-react";

interface NavbarProps {
  activeTab: "directory" | "live-studio" | "ground-truth" | "composio-byoc";
  setActiveTab: (tab: "directory" | "live-studio" | "ground-truth" | "composio-byoc") => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF6600] text-white shadow-xs">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-slate-900 text-base">
                Composio
              </span>
              <span className="rounded-full bg-orange-50 border border-orange-200/60 px-2 py-0.5 text-[10px] font-medium text-[#FF6600]">
                OAuth Compass
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Integration Launchpad & BYOC Guide for AI Agents
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab("directory")}
            className={`rounded-md px-3 py-1.5 transition ${
              activeTab === "directory"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "hover:text-slate-900"
            }`}
          >
            App Directory
          </button>
          <button
            onClick={() => setActiveTab("live-studio")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
              activeTab === "live-studio"
                ? "bg-white text-[#FF6600] shadow-xs font-semibold"
                : "hover:text-slate-900"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#FF6600]" />
            Live Investigation
          </button>
          <button
            onClick={() => setActiveTab("ground-truth")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
              activeTab === "ground-truth"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Ground Truth Audit
          </button>
          <button
            onClick={() => setActiveTab("composio-byoc")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
              activeTab === "composio-byoc"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "hover:text-slate-900"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-slate-500" />
            Composio BYOC Docs
          </button>
        </nav>

        {/* External Quick Links */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="https://docs.composio.dev/toolkits/managed-auth"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 transition"
          >
            <span>Managed Auth Docs</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://backend.composio.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-slate-800"
          >
            Composio Dashboard
          </a>
        </div>
      </div>
    </header>
  );
}
