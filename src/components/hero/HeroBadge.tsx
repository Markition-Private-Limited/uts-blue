interface HeroBadgeProps {
  text: string;
}

export function HeroBadge({ text }: HeroBadgeProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="h-px w-16 bg-white/50" />
      <span className="text-xs font-medium uppercase tracking-widest text-white/80">{text}</span>
      <span className="h-px w-16 bg-white/50" />
    </div>
  );
}
