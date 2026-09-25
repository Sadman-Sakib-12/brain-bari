import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "brand";
}

const badgeVariants: Record<string, string> = {
  default:
    "border-transparent bg-gray-900 text-white shadow hover:bg-gray-800",
  brand:
    "border-[#c8c2eb] bg-[#ebe8fd] text-[#8a421a] hover:bg-[#ded9fa]",
  secondary:
    "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
  destructive:
    "border-transparent bg-red-500 text-white shadow hover:bg-red-600",
  outline: "text-gray-900 border-gray-200",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
