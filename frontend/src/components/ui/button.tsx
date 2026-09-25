import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "brand";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const variantStyles: Record<string, string> = {
  default:
    "bg-gray-900 text-white shadow hover:bg-gray-800 active:scale-95",
  brand:
    "bg-[#602b0c] text-white shadow-sm hover:bg-[#8a421a] hover:shadow-md active:scale-95",
  destructive:
    "bg-red-500 text-white shadow-xs hover:bg-red-600 active:scale-95",
  outline:
    "border border-gray-200 bg-white shadow-xs hover:bg-gray-100 hover:text-gray-900 active:scale-95",
  secondary:
    "bg-gray-100 text-gray-900 shadow-xs hover:bg-gray-200 active:scale-95",
  ghost:
    "hover:bg-gray-100 hover:text-gray-900",
  link:
    "text-[#8a421a] underline-offset-4 hover:underline",
};

const sizeStyles: Record<string, string> = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-11 rounded-lg px-8 text-base",
  icon: "h-9 w-9 p-0",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a421a]/30 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variantStyles[variant] || variantStyles.default,
          sizeStyles[size] || sizeStyles.default,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
