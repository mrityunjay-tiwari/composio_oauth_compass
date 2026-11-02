"use client";

import { useState, useEffect } from "react";
import { APPS_DATABASE, AppGuide } from "@/data/apps";
import Navbar from "@/components/Navbar";
import AppCard from "@/components/AppCard";
import AppDetailModal from "@/components/AppDetailModal";
import LiveInvestigationStudio from "@/components/LiveInvestigationStudio";
import GroundTruthAudit from "@/components/GroundTruthAudit";
import ComposioByocExplainer from "@/components/ComposioByocExplainer";
import { Search, Sparkles, Zap, Layers, AlertTriangle } from "lucide-react";
import { LuPackageSearch } from "react-icons/lu";
import { IoShieldOutline } from "react-icons/io5";

type TabType = "directory" | "live-studio" | "ground-truth" | "composio-byoc";

export default function Home() {
  const [activeTab, setActiveTabState] = useState<TabType>("directory");
  const [apps, setApps] = useState<AppGuide[]>(APPS_DATABASE);
  const [selectedGuide, setSelectedGuide] = useState<AppGuide | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [frictionFilter, setFrictionFilter] = useState<string>("all");

  // Sync tab with URL search parameter & localStorage on load and refresh
  useEffect(() => {
    const validTabs: TabType[] = ["directory", "live-studio", "ground-truth", "composio-byoc"];
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab") as TabType | null;

    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTabState(tabParam);
    } else {
      const savedTab = localStorage.getItem("composio_active_tab") as TabType | null;
      if (savedTab && validTabs.includes(savedTab)) {
        setActiveTabState(savedTab);
        const newUrl = new URL(window.location.href);
        if (savedTab !== "directory") {
          newUrl.searchParams.set("tab", savedTab);
          window.history.replaceState({}, "", newUrl.toString());
        }
      }
    }

    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      const currentTab = currentParams.get("tab") as TabType | null;
      if (currentTab && validTabs.includes(currentTab)) {
        setActiveTabState(currentTab);
      } else {
        setActiveTabState("directory");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Restore custom investigated apps from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("composio_custom_apps");
      if (stored) {
        const customApps: AppGuide[] = JSON.parse(stored);
        if (Array.isArray(customApps) && customApps.length > 0) {
          setApps((prev) => {
            const map = new Map<string, AppGuide>();
            customApps.forEach((ca) => map.set(ca.slug, { ...ca, isLiveInvestigated: true }));
            prev.forEach((pa) => {
              if (!map.has(pa.slug)) map.set(pa.slug, pa);
            });
            return Array.from(map.values());
          });
        }
      }
    } catch {
      // ignore JSON parse error
    }
  }, []);

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem("composio_active_tab", tab);
    } catch {
      // ignore storage quota errors
    }

    const newUrl = new URL(window.location.href);
    if (tab === "directory") {
      newUrl.searchParams.delete("tab");
    } else {
      newUrl.searchParams.set("tab", tab);
    }
    window.history.pushState({}, "", newUrl.toString());
  };

  const handleGuideGenerated = (newGuide: AppGuide) => {
    const tagged: AppGuide = { ...newGuide, isLiveInvestigated: true };
    setApps((prev) => {
      const filtered = prev.filter((a) => a.slug !== tagged.slug);
      const nextApps = [tagged, ...filtered];
      try {
        const customOnly = nextApps.filter((a) => a.isLiveInvestigated);
        localStorage.setItem("composio_custom_apps", JSON.stringify(customOnly));
      } catch {
        // ignore
      }
      return nextApps;
    });
  };

  const handleRemoveRecentGuide = (slug: string) => {
    setApps((prev) => {
      const nextApps = prev.filter((a) => a.slug !== slug);
      try {
        const customOnly = nextApps.filter((a) => a.isLiveInvestigated);
        localStorage.setItem("composio_custom_apps", JSON.stringify(customOnly));
      } catch {
        // ignore
      }
      return nextApps;
    });
  };

  const handleNavigateToDirectory = (slug?: string) => {
    setActiveTab("directory");
    if (slug) {
      setSearchQuery("");
      setCategoryFilter("All");
      setFrictionFilter("all");
    }
  };

  const recentGuides = apps.filter((a) => a.isLiveInvestigated);

  const categories = ["All", "Developer Tools", "Communication", "Productivity", "Media & Content"];

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "All" || app.category === categoryFilter;

    let matchesFriction = true;
    if (frictionFilter === "instant") {
      matchesFriction = app.approvalWaitDays === 0;
    } else if (frictionFilter === "manifest") {
      matchesFriction = app.manifestSupported;
    } else if (frictionFilter === "review") {
      matchesFriction = app.reviewRequiredForLaunch;
    } else if (frictionFilter === "probes") {
      matchesFriction = Boolean(app.isLiveInvestigated);
    } else if (frictionFilter === "casa") {
      matchesFriction = app.frictionScore >= 4.0;
    }

    return matchesSearch && matchesCategory && matchesFriction;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Sleek Top Navigation with Composio Wordmark */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* VIEW 1: APP DIRECTORY */}
        {activeTab === "directory" && (
          <div className="space-y-5">
            {/* Hero Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-none border border-blue-100 bg-blue-50/70 px-2.5 py-0.5 text-xs mb-2">
                  <IoShieldOutline className="h-3 w-3" />
                  <span>OAuth Provider Catalog</span>
                </div>
                <h1 className="text-xl sm:text-4xl font-semibold text-slate-900">
                  Integration & Setup Guides
                </h1>
                <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
                  Friction scores, unwritten failure modes, least-privilege scope mappings, and 1-click Composio AuthConfigs.
                </p>
              </div>

              <button
                onClick={() => setActiveTab("live-studio")}
                className="inline-flex items-center gap-1.5 rounded-none bg-[#0024BC] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#001da0] shrink-0 self-start md:self-auto cursor-pointer shadow-2xs"
              >
                <LuPackageSearch className="h-3.5 w-3.5" />
                <span>Investigate Unfamiliar App</span>
              </button>
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search apps, scopes, failure modes..."
                  className="w-full rounded-none border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0024BC] focus:outline-none focus:ring-1 focus:ring-[#0024BC]/20 transition"
                />
              </div>

              {/* Friction / Review Filters */}
              <div className="flex items-center gap-1 overflow-x-auto text-xs">
                <button
                  onClick={() => setFrictionFilter("all")}
                  className={`rounded-none px-2.5 py-1 text-xs transition cursor-pointer ${
                    frictionFilter === "all"
                      ? "bg-slate-900 text-white font-medium"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  All ({apps.length})
                </button>
                {recentGuides.length > 0 && (
                  <button
                    onClick={() => setFrictionFilter("probes")}
                    className={`flex items-center gap-1 rounded-none px-2.5 py-1 text-xs transition cursor-pointer ${
                      frictionFilter === "probes"
                        ? "bg-purple-600 text-white font-medium"
                        : "bg-white border border-purple-200 text-purple-700 hover:bg-purple-50"
                    }`}
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Live Probes ({recentGuides.length})</span>
                  </button>
                )}
                <button
                  onClick={() => setFrictionFilter("instant")}
                  className={`flex items-center gap-1 rounded-none px-2.5 py-1 text-xs transition cursor-pointer ${
                    frictionFilter === "instant"
                      ? "bg-emerald-600 text-white font-medium"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Zap className="h-3 w-3" />
                  <span>Instant</span>
                </button>
                <button
                  onClick={() => setFrictionFilter("manifest")}
                  className={`flex items-center gap-1 rounded-none px-2.5 py-1 text-xs transition cursor-pointer ${
                    frictionFilter === "manifest"
                      ? "bg-[#0024BC] text-white font-medium"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Layers className="h-3 w-3" />
                  <span>Manifest Supported</span>
                </button>
                <button
                  onClick={() => setFrictionFilter("review")}
                  className={`flex items-center gap-1 rounded-none px-2.5 py-1 text-xs transition cursor-pointer ${
                    frictionFilter === "review"
                      ? "bg-amber-600 text-white font-medium"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <AlertTriangle className="h-3 w-3" />
                  <span>Review Required</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs text-slate-500 pb-0.5">
              <span className="font-mono text-[11px] text-slate-400 mr-1">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-none px-2 py-0.5 text-xs transition cursor-pointer ${
                    categoryFilter === cat
                      ? "bg-slate-100 text-slate-900 font-semibold border border-slate-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* App Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredApps.map((guide) => (
                <AppCard
                  key={guide.id}
                  guide={guide}
                  onSelect={(g) => setSelectedGuide(g)}
                />
              ))}
            </div>

            {filteredApps.length === 0 && (
              <div className="rounded-none border border-dashed border-slate-200 bg-white p-10 text-center space-y-2">
                <p className="text-xs font-semibold text-slate-800">No matching apps found in directory</p>
                <p className="text-xs text-slate-500">
                  Submit &ldquo;{searchQuery}&rdquo; to the Live Investigation Agent to analyze it in real time.
                </p>
                <button
                  onClick={() => setActiveTab("live-studio")}
                  className="inline-flex items-center gap-1.5 rounded-none bg-[#0024BC] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#001da0] transition"
                >
                  <LuPackageSearch className="h-3.5 w-3.5" />
                  <span>Investigate with Live Agent</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: LIVE INVESTIGATION STUDIO */}
        {activeTab === "live-studio" && (
          <LiveInvestigationStudio
            onGuideGenerated={handleGuideGenerated}
            onOpenGuide={(g) => setSelectedGuide(g)}
            recentGuides={recentGuides}
            onRemoveRecentGuide={handleRemoveRecentGuide}
            onNavigateToDirectory={handleNavigateToDirectory}
          />
        )}

        {/* VIEW 3: GROUND TRUTH & AUDIT */}
        {activeTab === "ground-truth" && <GroundTruthAudit />}

        {/* VIEW 4: COMPOSIO BYOC EXPLAINER */}
        {activeTab === "composio-byoc" && <ComposioByocExplainer />}

      </main>

      {/* Selected App Guide Modal */}
      {selectedGuide && (
        <AppDetailModal
          guide={selectedGuide}
          onClose={() => setSelectedGuide(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-5">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="font-semibold text-slate-800">Composio OAuth Compass</span>
            <span>/</span>
            <span>APM Integrations Assignment</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://docs.composio.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition"
            >
              Composio Docs
            </a>
            <a
              href="https://github.com/ComposioHQ/composio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition"
            >
              GitHub
            </a>
            <a
              href="https://connect.composio.dev/mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition"
            >
              Claude MCP
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
