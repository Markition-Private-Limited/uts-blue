export function HeroCircleBadge() {
  // Repeat the phrase so the full circumference is always covered with text
  const text = "THE UTS EXPERIENCE •";
  const radius = 34;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="relative flex items-center justify-center rounded-full bg-white"
      style={{ width: 100, height: 100, boxShadow: '0 4px 24px rgba(0,0,0,0.13)' }}
    >
      {/* Thin guide ring */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="0.6" />
      </svg>

      {/* Spinning text ring */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full animate-[spin_22s_linear_infinite]"
        aria-hidden
      >
        <defs>
          <path
            id="circle-text-path"
            d={`M 50,50 m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
          />
        </defs>
        <text
          fontSize="8.5"
          fontWeight="500"
          fill="#111111"
          letterSpacing="1.2"
          fontFamily="Inter, system-ui, sans-serif"
        >
          <textPath
            href="#circle-text-path"
            startOffset="0%"
            textLength={circumference}
            lengthAdjust="spacing"
          >
            {text}
          </textPath>
        </text>
      </svg>

      {/* Inner circle with arrow */}
      <div
        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
        style={{ backgroundColor: "#1648D8" }}
      >
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M4 16L16 4M16 4H8M16 4V12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
