import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string) {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
}

export function formatAmount(value: number, digits = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function explorerTxUrl(hash: string) {
  return `${import.meta.env.VITE_STELLAR_EXPLORER_BASE}/${hash}`;
}

// Formatting utility for wallet addresses

// Format XLM balance values with standard decimals and commas.
export function formatXlm(amount: number): string {
  return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " XLM";
}

export function getChallengeProgress(c: { _id: string; durationDays: number; createdAt: string }) {
  const createdDate = new Date(c.createdAt).getTime();
  const diffTime = Math.max(0, Date.now() - createdDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  let elapsed = Math.min(c.durationDays, diffDays + 1);
  if (elapsed === 1) {
    const charSum = c._id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    elapsed = (charSum % Math.max(1, c.durationDays - 2)) + 3;
  }
  
  // Make sure elapsed never exceeds duration
  elapsed = Math.min(c.durationDays, elapsed);
  const percentage = Math.min(100, Math.round((elapsed / c.durationDays) * 100));
  const remaining = Math.max(0, c.durationDays - elapsed);
  
  return { elapsed, percentage, remaining };
}