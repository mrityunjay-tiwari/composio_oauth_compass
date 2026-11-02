"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import type { ComponentProps } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";

// Auto-scrolls to the latest message while streaming; lets the user scroll up
// freely and offers a jump-to-bottom affordance. (Vercel AI Elements pattern.)
export const Conversation = ({
  className,
  ...props
}: ComponentProps<typeof StickToBottom>) => (
  <StickToBottom
    className={cn("relative flex-1 overflow-y-auto", className)}
    initial="instant"
    resize="instant"
    role="log"
    {...props}
  />
);

export const ConversationContent = ({
  className,
  ...props
}: ComponentProps<typeof StickToBottom.Content>) => (
  <StickToBottom.Content className={cn("flex flex-col gap-4 p-4", className)} {...props} />
);

export const ConversationScrollButton = ({
  className,
  ...props
}: ComponentProps<typeof Button>) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();
  if (isAtBottom) return null;
  return (
    <Button
      className={cn(
        "absolute bottom-3 left-1/2 size-8 -translate-x-1/2 !rounded-full shadow-md",
        className
      )}
      onClick={() => scrollToBottom()}
      size="icon"
      variant="outline"
      aria-label="Scroll to bottom"
      {...props}
    >
      <ArrowDown className="size-4" />
    </Button>
  );
};

export { useStickToBottomContext };

