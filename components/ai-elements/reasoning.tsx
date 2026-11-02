"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Brain, ChevronDown } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { Streamdown } from "streamdown";
import { createMathPlugin } from "@streamdown/math";

// Collapsible "thinking" panel (documind / AI Elements behaviour): auto-opens
// while the model streams reasoning, tracks how long it thought, then shows
// "Thought for N seconds" and auto-collapses shortly after.

type ReasoningCtx = {
  isStreaming: boolean;
  isOpen: boolean;
  duration?: number;
};
const ReasoningContext = createContext<ReasoningCtx>({
  isStreaming: false,
  isOpen: false,
});

export function Reasoning({
  className,
  isStreaming = false,
  ...props
}: ComponentProps<typeof Collapsible> & { isStreaming?: boolean }) {
  const [isOpen, setIsOpen] = useState(isStreaming);
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
        }, 1000);
        return () => clearTimeout(t);
      }
    }
  }, [isStreaming]);

  return (
    <ReasoningContext.Provider value={{ isStreaming, isOpen, duration }}>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn("not-prose mb-2", className)}
        {...props}
      />
    </ReasoningContext.Provider>
  );
}

export function ReasoningTrigger({
  className,
  ...props
}: ComponentProps<typeof CollapsibleTrigger>) {
  const { isStreaming, isOpen, duration } = useContext(ReasoningContext);
  const label = isStreaming
    ? "Thinking…"
    : duration === undefined
      ? "Thought for a few seconds"
      : `Thought for ${duration} ${duration === 1 ? "second" : "seconds"}`;

  return (
    <CollapsibleTrigger
      className={cn(
        "flex w-full items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
      {...props}
    >
      <Brain className="size-4" />
      <span className={isStreaming ? "animate-pulse" : ""}>{label}</span>
      <ChevronDown
        className={cn("size-4 transition-transform", isOpen && "rotate-180")}
      />
    </CollapsibleTrigger>
  );
}

const mathPlugin = createMathPlugin({ singleDollarTextMath: true });
const reasoningPlugins = { math: mathPlugin };

export function ReasoningContent({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof CollapsibleContent>, "children"> & {
  children: string;
}) {
  return (
    <CollapsibleContent
      className={cn("mt-2 text-sm text-muted-foreground", className)}
      {...props}
    >
      <Streamdown
        className="[&_li>p:first-child]:inline [&_li>p:first-child]:mb-0 [&_li>div:first-child]:inline [&_li>div:first-child]:mb-0 [&_.katex-display]:overflow-x-auto [&_.katex-display]:py-1 [&_.katex-display]:my-2 [&_.katex]:text-muted-foreground"
        plugins={reasoningPlugins}
        components={{
          p: ({ node, ...pProps }) => (
            <p className="mb-2 last:mb-0 [li_&]:inline [li_&]:mb-0" {...pProps} />
          ),
        }}
      >
        {children}
      </Streamdown>
    </CollapsibleContent>
  );
}
