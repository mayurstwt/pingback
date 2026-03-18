import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistanceToNow(input: string | Date | null) {
  if (!input) {
    return "Never";
  }

  const date = typeof input === "string" ? new Date(input) : input;
  const diffMs = Date.now() - date.getTime();

  if (diffMs < 60_000) {
    return "Just now";
  }

  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export function formatFrequency(hours: number) {
  if (hours < 24) {
    return `Every ${hours} hour${hours === 1 ? "" : "s"}`;
  }

  const days = hours / 24;
  return `Every ${days} day${days === 1 ? "" : "s"}`;
}
