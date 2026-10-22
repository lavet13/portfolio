import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Joins class names, dropping falsy ones (clsx), then removes Tailwind conflicts, last one wins (twMerge). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
