"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const Banner = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-4 py-2 border rounded-none bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-800",
        className
      )}
    >
      <div className="flex items-center gap-3 flex-1">{children}</div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BannerIcon = ({ icon: Icon }: { icon: any }) => { 
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-none bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
      <Icon className="w-4 h-4" />
    </div>
  );
};

export const BannerTitle = ({ children }: { children: React.ReactNode }) => {
  return <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{children}</span>;
};

export const BannerAction = ({ children, href, onClick }: { children: React.ReactNode; href?: string; onClick?: () => void }) => {
  const ButtonContent = (
    <button onClick={onClick} className="text-sm font-medium px-3 py-1.5 border rounded-none hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
      {children}
    </button>
  );

  if (href) {
    return <Link href={href}>{ButtonContent}</Link>;
  }
  
  return ButtonContent;
};

export const BannerClose = () => {
  // We'll manage visibility via a simple prop on the closest Banner context, 
  // but for simplicity in this file, we can just hide the parent if we want.
  // A better way is using Context, but let's implement a simple DOM removal for this purely UI component.
  return (
    <button
      onClick={(e) => {
        const banner = e.currentTarget.closest(".flex.items-center.justify-between.gap-4");
        if (banner) {
          (banner as HTMLElement).style.display = "none";
        }
      }}
      className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-none text-neutral-500"
    >
      <X className="w-4 h-4" />
    </button>
  );
};
