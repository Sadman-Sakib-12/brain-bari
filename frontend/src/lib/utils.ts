import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard shadcn/ui cn() helper function
 * Combines conditional classNames (clsx) and resolves Tailwind conflicts (twMerge).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
