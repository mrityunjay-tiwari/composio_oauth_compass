"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  Brain,
  ChevronDown,
  CheckCircle2,
  Circle,
  AlertCircle,
  Search,
  ExternalLink,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Streamdown } from "streamdown";

type ChainOfThoughtContextType = {
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  duration?: number;
  stepCount: number;
  completedCount: number;
};

const ChainOfThoughtContext = createContext<ChainOfThoughtContextType>({
  isStreaming: false,
  isOpen: false,
  setIsOpen: () => {},
  stepCount: 0,
  completedCount: 0,
});

export interface ChainOfThoughtProps
  extends Omit<ComponentProps<typeof Collapsible>, "children"> {
  isStreaming?: boolean;
  stepCount?: number;
  completedCount?: number;
  children: ReactNode;
}

export function ChainOfThought({
  className,
  isStreaming = false,
  stepCount = 0,
  completedCount = 0,
  children,
  defaultOpen,
  ...props
}: ChainOfThoughtProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? isStreaming);
  const [duration, setDuration] = useState<number>();
  const startRef = useRef<number | null>(null);
  const autoClosed = useRef(false);

  useEffect(() => {
    if (isStreaming) {
      if (startRef.current === null) startRef.current = Date.now();
      setIsOpen(true);
      return;
    }
    if (startRef.current !== null) {
      setDuration(Math.max(1, Math.ceil((Date.now() - startRef.current) / 1000)));
      startRef.current = null;
      if (!autoClosed.current) {
        const t = setTimeout(() => {
          setIsOpen(false);
          autoClosed.current = true;
        }, 1200);
        return () => clearTimeout(t);
      }
    }
  }, [isStreaming]);

  return (
    <ChainOfThoughtContext.Provider
      value={{
        isStreaming,
        isOpen,
        setIsOpen,
        duration,
        stepCount,
        completedCount,
      }}
    >
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn("not-prose mb-3 w-full", className)}
        {...props}
      >
        {children}
      </Collapsible>
    </ChainOfThoughtContext.Provider>
  );
}

export interface ChainOfThoughtHeaderProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  activeStepTitle?: string;
  className?: string;
  children?: ReactNode;
}

export function ChainOfThoughtHeader({
  className,
  activeStepTitle,
  children,
  ...props
}: ChainOfThoughtHeaderProps) {
  const { isStreaming, isOpen, duration, stepCount, completedCount } =
    useContext(ChainOfThoughtContext);

  const defaultLabel = isStreaming
    ? activeStepTitle || (stepCount > 0 ? `Thinking… (${completedCount + 1}/${stepCount})` : "Thinking…")
    : duration !== undefined
      ? `Thought for ${duration}s (${stepCount || completedCount || 1} ${(stepCount || completedCount || 1) === 1 ? "step" : "steps"})`
      : `Researched in ${stepCount || completedCount || 1} ${(stepCount || completedCount || 1) === 1 ? "step" : "steps"}`;

  return (
    <CollapsibleTrigger
      className={cn(
        "group/cot flex w-full items-center justify-between gap-2 force-rounded-lg border border-border/80 bg-muted/30 px-3 py-2 text-xs text-muted-foreground transition-all hover:bg-muted/60 hover:text-foreground cursor-pointer select-none",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 min-w-0">
        {isStreaming ? (
          <Spinner className="size-3.5 text-primary shrink-0" />
        ) : (
          <Brain className="size-3.5 text-muted-foreground shrink-0" />
        )}
        <span
          className={cn(
            "truncate font-medium",
            isStreaming && "animate-pulse text-foreground font-semibold"
          )}
        >
          {children || defaultLabel}
        </span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        {!isStreaming && (
          <span className="text-[10px] text-muted-foreground/80 font-mono">
            {isOpen ? "Hide" : "Show"}
          </span>
        )}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200 text-muted-foreground",
            isOpen && "rotate-180"
          )}
        />
      </div>
    </CollapsibleTrigger>
  );
}

export function ChainOfThoughtContent({
  className,
  children,
  ...props
}: ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent
      className={cn(
        "mt-2 pl-3.5 pr-1 py-1.5 border-l-2 border-border/60 ml-2 space-y-2.5 text-xs text-muted-foreground animate-in fade-in-50 duration-200",
        className
      )}
      {...props}
    >
      {children}
    </CollapsibleContent>
  );
}

export type StepStatus = "complete" | "active" | "pending" | "error";

export interface ChainOfThoughtStepProps {
  status?: StepStatus;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function ChainOfThoughtStep({
  status = "complete",
  title,
  description,
  icon,
  className,
  children,
}: ChainOfThoughtStepProps) {
  const renderIcon = () => {
    if (icon) return icon;
    switch (status) {
      case "active":
        return <Spinner className="size-3 text-primary shrink-0 mt-0.5" />;
      case "complete":
        return <CheckCircle2 className="size-3 text-emerald-500 shrink-0 mt-0.5" />;
      case "error":
        return <AlertCircle className="size-3 text-destructive shrink-0 mt-0.5" />;
      case "pending":
      default:
        return <Circle className="size-2.5 text-muted-foreground/40 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className={cn("flex flex-col gap-1 text-xs", className)}>
      <div className="flex items-start gap-2">
        <div className="flex size-4 items-center justify-center shrink-0">
          {renderIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "font-medium leading-tight",
              status === "active" && "text-foreground font-semibold",
              status === "complete" && "text-foreground/90",
              status === "error" && "text-destructive",
              status === "pending" && "text-muted-foreground/60"
            )}
          >
            {title}
          </div>
          {description && (
            <div className="mt-0.5 text-[11px] text-muted-foreground/80 leading-normal">
              {typeof description === "string" ? (
                <Streamdown>{description}</Streamdown>
              ) : (
                description
              )}
            </div>
          )}
          {children && <div className="mt-1">{children}</div>}
        </div>
      </div>
    </div>
  );
}

export interface SearchResultItem {
  title: string;
  url?: string;
  snippet?: string;
}

export function ChainOfThoughtSearchResults({
  results,
  className,
}: {
  results: SearchResultItem[];
  className?: string;
}) {
  if (!results.length) return null;

  return (
    <div className={cn("mt-1.5 flex flex-wrap gap-1.5", className)}>
      {results.map((r, i) => (
        <a
          key={i}
          href={r.url || undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 force-rounded-md border border-border/80 bg-background/80 px-2 py-0.5 text-[11px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer max-w-[260px] truncate"
          title={r.title}
        >
          <Search className="size-2.5 text-muted-foreground shrink-0" />
          <span className="truncate">{r.title}</span>
          {r.url && <ExternalLink className="size-2 opacity-50 shrink-0" />}
        </a>
      ))}
    </div>
  );
}
