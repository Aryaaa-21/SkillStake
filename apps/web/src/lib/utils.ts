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