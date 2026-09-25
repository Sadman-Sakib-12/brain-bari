"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

/**
 * ShinyText component from React Bits (reactbits.dev/text-animations/shiny-text)
 * Renders high-end animated metallic text shine.
 */
export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = "",
}: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent transition-all",
        !disabled && "animate-shine",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(138, 66, 26, 0.9) 0%, rgba(245, 158, 11, 1) 40%, rgba(255, 255, 255, 0.9) 50%, rgba(245, 158, 11, 1) 60%, rgba(138, 66, 26, 0.9) 100%)",
        backgroundSize: "200% 100%",
        animationDuration,
      }}
    >
      {text}
    </span>
  );
}
