interface HeroBadgeProps {
  text: string;
  variant?: "light" | "blue" | "dark";
}

export function HeroBadge({ text, variant = "light" }: HeroBadgeProps) {
  if (variant === "dark") {
    return (
      <div className="flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-gray-300" />
        <span className="text-xs font-medium tracking-widest text-gray-500">{text}</span>
        <span className="h-px w-8 bg-gray-300" />
      </div>
    );
  }

  if (variant === "blue") {
    return (
      <div className="flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#1648D8]" />
        <span className="text-xs font-medium uppercase tracking-widest text-[#1648D8]">{text}</span>
        <span className="h-px w-8 bg-[#1648D8]" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <span className="h-px w-16 bg-white/50" />
      <span className="text-xs font-medium uppercase tracking-widest text-white/80">{text}</span>
      <span className="h-px w-16 bg-white/50" />
    </div>
  );
}
