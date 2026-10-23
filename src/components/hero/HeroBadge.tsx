interface HeroBadgeProps {
  text: string;
  variant?: "light" | "blue" | "dark";
  align?: "center" | "left";
  dividerWidth?: number;
  bold?: boolean;
  textColorClass?: string;
}

export function HeroBadge({ text, variant = "light", align = "center", dividerWidth, bold, textColorClass }: HeroBadgeProps) {
  const justify = align === "left" ? "justify-start" : "justify-center";
  const dividerStyle = dividerWidth ? { width: dividerWidth } : undefined;
  const weight = bold ? "font-semibold" : "font-medium";

  if (variant === "dark") {
    return (
      <div className={`flex items-center ${justify} gap-3`}>
        <span className="h-px w-8 bg-gray-300" style={dividerStyle} />
        <span className={`text-xs ${weight} tracking-widest ${textColorClass ?? 'text-gray-500'}`}>{text}</span>
        <span className="h-px w-8 bg-gray-300" style={dividerStyle} />
      </div>
    );
  }

  if (variant === "blue") {
    return (
      <div className={`flex items-center ${justify} gap-3`}>
        <span className="h-px w-8 bg-[#1648D8]" style={dividerStyle} />
        <span className={`text-xs ${weight} uppercase tracking-widest ${textColorClass ?? 'text-[#1648D8]'}`}>{text}</span>
        <span className="h-px w-8 bg-[#1648D8]" style={dividerStyle} />
      </div>
    );
  }

  return (
    <div className={`flex items-center ${justify} gap-3`}>
      <span className="h-px w-16 bg-white/50" style={dividerStyle} />
      <span className={`text-xs ${weight} uppercase tracking-widest ${textColorClass ?? 'text-white/80'}`}>{text}</span>
      <span className="h-px w-16 bg-white/50" style={dividerStyle} />
    </div>
  );
}
