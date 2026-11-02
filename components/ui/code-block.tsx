"use client";

import * as React from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  filename?: string;
  showCopy?: boolean;
  maxHeight?: string;
}

export function CodeBlock({
  code,
  language,
  filename,
  showCopy = true,
  maxHeight,
  className,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div
      data-slot="code-block"
      className={cn(
        "relative rounded-none border border-slate-800 bg-slate-950 text-slate-200 overflow-hidden shadow-xs",
        className
      )}
      {...props}
    >
      {(filename || language || showCopy) && (
        <div
          data-slot="code-block-header"
          className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-3.5 py-1.5 text-[11px] text-slate-400"
        >
          <div className="flex items-center gap-2 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-700/80" />
              <span className="h-2 w-2 rounded-full bg-slate-700/80" />
              <span className="h-2 w-2 rounded-full bg-slate-700/80" />
            </div>
            {filename ? (
              <span className="text-slate-300 font-medium ml-1.5">{filename}</span>
            ) : language ? (
              <span className="text-slate-400 uppercase font-semibold text-[10px] ml-1.5">{language}</span>
            ) : (
              <span className="flex items-center gap-1 text-slate-400 text-[10px] ml-1.5">
                <Terminal className="h-3 w-3" />
                <span>terminal</span>
              </span>
            )}
          </div>

          {showCopy && (
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-none px-2 py-0.5 text-[11px] text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
              aria-label="Copy code to clipboard"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      <pre
        data-slot="code-block-content"
        style={maxHeight ? { maxHeight } : undefined}
        className={cn(
          "overflow-x-auto p-3.5 font-mono text-xs leading-relaxed text-slate-200 select-text",
          maxHeight && "overflow-y-auto"
        )}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function CodeBlockInline({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "rounded-none border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-800",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}
