"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { Sparkles } from "lucide-react";
import { MdSettingsSuggest } from "react-icons/md";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { VscLightbulbSparkle } from "react-icons/vsc";
import { VscSearchFuzzy } from "react-icons/vsc";

export const SuggestionList = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-4 flex flex-col gap-2.5", className)} {...props}>
    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
      <VscSearchFuzzy className="size-3 text-primary animate-pulse" />
      <span>Suggested Follow-ups</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {children}
    </div>
  </div>
);

export type SuggestionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: string;
};

export const Suggestion = ({ className, children, ...props }: SuggestionProps) => (
  <button
    className={cn(
      "rounded-none border border-border bg-card px-3.5 py-2 text-left text-xs text-foreground",
      "hover:bg-muted/70 hover:text-foreground transition-all duration-200 cursor-pointer max-w-full truncate",
      className
    )}
    title={children}
    type="button"
    {...props}
  >
    {children}
  </button>
);
