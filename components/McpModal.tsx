"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, Terminal, ShieldAlert, Sparkles, Code2, ExternalLink } from "lucide-react";
import { VscMcp } from "react-icons/vsc";
import { CodeBlock } from "@/components/ui/code-block";

interface McpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function McpModal({ isOpen, onClose }: McpModalProps) {
  const [activeTab, setActiveTab] = useState<"antigravity" | "claude" | "codex" | "cli">("antigravity");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const antigravityConfig = JSON.stringify(
    {
      mcpServers: {
        "oauth-compass": {
          command: "npx",
          args: ["-y", "tsx", "mcp-server/index.ts"],
        },
      },
    },
    null,
    2
  );

  const claudeConfig = JSON.stringify(
    {
      mcpServers: {
        "composio-oauth-compass": {
          command: "npx",
          args: ["-y", "tsx", "mcp-server/index.ts"],
        },
      },
    },
    null,
    2
  );

  const codexPythonSnippet = `# Universal MCP Client for OpenAI Codex / Custom Agent Frameworks
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

params = StdioServerParameters(command="npx", args=["-y", "tsx", "mcp-server/index.ts"])

async with stdio_client(params) as (read, write):
    async with ClientSession(read, write) as session:
        await session.initialize()
        # Pre-flight audit to avoid $15k CASA Tier 2 audit
        result = await session.call_tool("audit_scope_risk", {
            "provider": "google",
            "scopes": ["gmail.modify"]
        })
        print("Scope Risk:", result.content)
`;

  const cliCommand = "npx tsx mcp-server/index.ts";

  const tools = [
    {
      name: "audit_scope_risk",
      badge: "Compliance Defense",
      desc: "Audits requested scopes to flag $3k-$15k CASA Tier 2 audits or approval blocks before writing code.",
    },
    {
      name: "get_unwritten_gotchas",
      badge: "Trap Detection",
      desc: "Returns unwritten developer traps (Google 7-day token expiry, Slack bot/user scopes, Salesforce lag).",
    },
    {
      name: "generate_composio_byoc_payload",
      badge: "Code Gen",
      desc: "Outputs ready-to-run Python/TypeScript Composio SDK snippets and AuthConfig manifests.",
    },
    {
      name: "investigate_oauth_provider",
      badge: "Autonomous Probe",
      desc: "Performs real-time headless doc reading (via Jina Reader) for unfamiliar platforms on the fly.",
    },
    {
      name: "get_oauth_guide",
      badge: "Archetype Guide",
      desc: "Retrieves complete integration checklist, human vs agent demarcation, and least-privilege scopes.",
    },
    {
      name: "list_oauth_providers",
      badge: "Catalog Discovery",
      desc: "Lists all curated OAuth providers filtered by friction score or application category.",
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-none border border-slate-200 bg-white shadow-xl flex flex-col max-h-[90vh] overflow-hidden cursor-default animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Header */}
        <div className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 flex items-center justify-center rounded-none bg-[#0024BC] text-white">
              <VscMcp className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">OAuth Compass MCP Server</h2>
                <span className="rounded-none bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-semibold text-[#0024BC]">
                  Model Context Protocol
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Universal Model Context Protocol support: Compatible with Google Antigravity, Cursor, Claude, OpenAI Codex, Windsurf, and custom agent SDKs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-none p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700">
          {/* Value Prop Banner */}
          <div className="rounded-none border border-blue-200 bg-blue-50/60 p-3.5 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-[#0024BC] text-sm">
              {/* <Sparkles className="h-4 w-4" /> */}
              <span>Let Agents build for Agents (Universal MCP Support)</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-xs">
              Instead of humans clicking dashboards, your coding agent directly checks for <strong>$15,000 CASA audits</strong>, fetches <strong>unwritten failure modes</strong>, and generates <strong>Composio BYOC configurations</strong> while scaffolding integrations in your editor.
            </p>
          </div>

          {/* Quickstart Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setActiveTab("antigravity")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-none transition cursor-pointer ${
                    activeTab === "antigravity"
                      ? "border-b-2 border-[#0024BC] text-[#0024BC]"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Antigravity & Cursor
                </button>
                <button
                  onClick={() => setActiveTab("claude")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-none transition cursor-pointer ${
                    activeTab === "claude"
                      ? "border-b-2 border-[#0024BC] text-[#0024BC]"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Claude Desktop
                </button>
                <button
                  onClick={() => setActiveTab("codex")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-none transition cursor-pointer ${
                    activeTab === "codex"
                      ? "border-b-2 border-[#0024BC] text-[#0024BC]"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Codex & Custom Agents
                </button>
                <button
                  onClick={() => setActiveTab("cli")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-none transition cursor-pointer ${
                    activeTab === "cli"
                      ? "border-b-2 border-[#0024BC] text-[#0024BC]"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  CLI Stdio
                </button>
              </div>

              <button
                onClick={() =>
                  copyText(
                    activeTab === "antigravity"
                      ? antigravityConfig
                      : activeTab === "claude"
                      ? claudeConfig
                      : activeTab === "codex"
                      ? codexPythonSnippet
                      : cliCommand,
                    "active-snippet"
                  )
                }
                className="inline-flex items-center gap-1 rounded-none bg-[#0024BC] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#001da0] transition cursor-pointer"
              >
                {copied === "active-snippet" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied === "active-snippet" ? "Copied" : "Copy Configuration"}</span>
              </button>
            </div>

            {/* Code Block */}
            <div className="relative">
              <CodeBlock
                code={
                  activeTab === "antigravity"
                    ? antigravityConfig
                    : activeTab === "claude"
                    ? claudeConfig
                    : activeTab === "codex"
                    ? codexPythonSnippet
                    : cliCommand
                }
                language={
                  activeTab === "codex"
                    ? "python"
                    : activeTab === "cli"
                    ? "bash"
                    : "json"
                }
                filename={
                  activeTab === "antigravity"
                    ? ".mcp.json"
                    : activeTab === "claude"
                    ? "claude_desktop_config.json"
                    : activeTab === "codex"
                    ? "mcp_client.py"
                    : "terminal command"
                }
                showCopy={true}
                maxHeight="220px"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {activeTab === "antigravity"
                ? "Standard project-level MCP config. Save as '.mcp.json' or '.cursor/mcp.json' in your workspace root. Google Antigravity, Cursor, and Windsurf load it automatically."
                : activeTab === "claude"
                ? "Paste this JSON into your %APPDATA%\\Claude\\claude_desktop_config.json on Windows or ~/Library/Application Support/Claude/claude_desktop_config.json on macOS."
                : activeTab === "codex"
                ? "Universal Python client to invoke OAuth Compass tools from OpenAI Codex, ChatGPT agents, LangChain, or CrewAI."
                : "Run this command in any terminal to start the MCP server directly over standard input/output (stdio)."}
            </p>
          </div>

          {/* Available MCP Tools */}
          <div className="space-y-2 pt-2">
            <h3 className="text-lg  text-slate-900 ">
              Available MCP Tools (6 Exposed Tools)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {tools.map((t) => (
                <div
                  key={t.name}
                  className="rounded-none border border-slate-200 bg-white p-3 space-y-1 hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-medium text-slate-900">{t.name}</span>
                    <span className="rounded-none bg-slate-100 border border-slate-200 px-1.5 py-0.2 text-[10px] text-slate-700">
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <span>Official Protocol:</span>
            <a
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0024BC] font-medium hover:underline inline-flex items-center gap-1"
            >
              <span>modelcontextprotocol.io</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <button
            onClick={onClose}
            className="rounded-none bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
