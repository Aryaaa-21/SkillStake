import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";
import { cn } from "../lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass rounded-[20px] border border-border/80 p-6 text-sm transition-all duration-200 hover:shadow-md dark:hover:shadow-black/20", className)} {...props} />;
}

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; variant?: "primary" | "secondary" | "ghost" }>(function Button(
  { className, variant = "primary", asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  const styles =
    variant === "primary"
      ? "bg-accent text-accentFg shadow-soft hover:bg-accent/90 focus-visible:ring-accent"
      : variant === "secondary"
        ? "border border-border bg-transparent hover:bg-black/5 dark:hover:bg-white/5 focus-visible:ring-border"
        : "bg-transparent hover:bg-black/5 dark:hover:bg-white/5 focus-visible:ring-accent";

  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]",
        styles,
        className,
      )}
      {...props}
    />
  );
});

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/15 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/15 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />;
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted", className)} {...props} />;
}

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-2xl bg-black/5 dark:bg-white/5", className)} {...props} />;
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
      <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

// UI library integrated with Radix and Tailwind
