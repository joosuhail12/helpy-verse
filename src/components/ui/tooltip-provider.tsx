
import * as React from "react";
import { TooltipProvider as RadixTooltipProvider } from "@radix-ui/react-tooltip";

interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
}

export function TooltipProvider({
  children,
  delayDuration = 200,
  skipDelayDuration = 300,
  disableHoverableContent = false,
}: TooltipProviderProps) {
  return (
    <RadixTooltipProvider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      {children}
    </RadixTooltipProvider>
  );
}
