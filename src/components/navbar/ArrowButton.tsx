import Link from "next/link";

interface ArrowButtonProps {
  label: string;
  href: string;
  variant: "blue" | "outline";
  className?: string;
  /** When set, the click runs this instead of navigating (href stays as the no-JS fallback). */
  onClick?: () => void;
}

export function ArrowButton({ label, href, variant, className = "", onClick }: ArrowButtonProps) {
  const blueStyle: React.CSSProperties = {
    background:
      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 51.44%, rgba(255,255,255,0) 100%), linear-gradient(0deg, #1648D8, #1648D8)",
  };

  const outlineStyle: React.CSSProperties = {
    background: "#1E4FD926",
    border: "1px solid rgba(255,255,255,0.35)",
    backdropFilter: "blur(8px)",
  };

  return (
    <Link
      href={href}
      onClick={
        onClick
          ? (e) => {
              e.preventDefault();
              onClick();
            }
          : undefined
      }
      className={`group btn-fill [--fill-x:1.5rem] inline-flex items-center gap-3 rounded-full py-1 pl-1 pr-5 text-sm font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-100 ${className}`}
      style={variant === "blue" ? blueStyle : outlineStyle}
    >
      {/* Solid white circle — flush to left edge (pl-1 gives ~4px gap).
          Inverts to a blue circle with a white arrow on hover, in step with the
          pill's own white hover fill, so it stays legible instead of vanishing into it. */}
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#1648D8] transition-colors duration-300 ease-out group-hover:bg-[#1648D8] group-hover:text-white">
        <ArrowIcon />
      </span>
      {label}
    </Link>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2 7H12M8 3L12 7L8 11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
