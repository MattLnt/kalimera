import { cn } from "@/lib/utils";

export function Chip({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  /** "light" sur fond clair, "dark" sur les panneaux bleu nuit. */
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full py-2 pr-4 pl-3 font-display text-xs font-semibold",
        tone === "light"
          ? "bg-aegean-100 text-aegean-700"
          : "bg-white/10 text-white backdrop-blur-sm",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-[7px] rounded-full",
          tone === "light" ? "bg-aegean-500" : "bg-aegean-400",
        )}
      />
      {children}
    </span>
  );
}

export function Tag({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1.5 font-display text-xs font-semibold transition-colors duration-500",
        tone === "light"
          ? "bg-aegean-50 text-aegean-700"
          : "bg-white/12 text-white/85 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
