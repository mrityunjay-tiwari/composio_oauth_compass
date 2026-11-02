"use client";

import * as React from "react";
import { Check, Copy, FileCode2, Terminal } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { cn } from "@/lib/utils";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  filename?: string;
  showCopy?: boolean;
  showLineNumbers?: boolean;
  maxHeight?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  showCopy = true,
  showLineNumbers = true,
  maxHeight,
  className,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const cleanCode = (code || "").trim();

  // Normalize language for prism
  const normalizedLanguage = React.useMemo(() => {
    const lang = (language || "").toLowerCase();
    if (lang === "ts" || lang === "typescript") return "tsx";
    if (lang === "js" || lang === "javascript") return "jsx";
    if (lang === "py" || lang === "python") return "python";
    if (lang === "json") return "json";
    if (lang === "sh" || lang === "bash" || lang === "shell") return "bash";
    if (lang === "http") return "bash";
    return "tsx";
  }, [language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const lineCount = cleanCode.split("\n").length;
  const shouldShowLineNumbers = showLineNumbers && lineCount > 1;

  return (
    <div
      data-slot="code-block"
      className={cn(
        "relative rounded-none border border-slate-800 bg-[#0d1117] text-slate-200 overflow-hidden shadow-xs",
        className
      )}
      {...props}
    >
      {/* Header Bar */}
      {(filename || language || showCopy) && (
        <div
          data-slot="code-block-header"
          className="flex items-center justify-between border-b border-slate-800/80 bg-[#161b22] px-3.5 py-1.5 text-[11px]"
        >
          <div className="flex items-center gap-2">
            <FileCode2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            {filename ? (
              <span className="font-mono text-slate-200 font-medium">{filename}</span>
            ) : (
              <span className="font-mono text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                {language}
              </span>
            )}
          </div>

          {showCopy && (
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-none px-2 py-0.5 text-[11px] font-mono text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition"
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

      {/* Syntax Highlighted Code with Line Numbers */}
      <Highlight theme={themes.oneDark} code={cleanCode} language={normalizedLanguage}>
        {({ className: highlightClass, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            data-slot="code-block-content"
            style={{ ...style, maxHeight }}
            className={cn(
              "overflow-x-auto p-3.5 font-mono text-xs leading-relaxed bg-[#0d1117]! select-text",
              maxHeight && "overflow-y-auto",
              highlightClass
            )}
          >
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })} className="table-row">
                  {shouldShowLineNumbers && (
                    <span className="table-cell select-none pr-4 text-right text-[11px] font-mono text-slate-600/80 w-6">
                      {i + 1}
                    </span>
                  )}
                  <span className="table-cell">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
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
