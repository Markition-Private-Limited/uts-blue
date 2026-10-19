export function HeroCircleBadge() {
  const text = "THE UTS EXPERIENCE •";
  const radius = 34;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white">
      {/* Outer ring with circular text */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full animate-[spin_12s_linear_infinite]"
        aria-hidden
      >
        <defs>
          <path
            id="circle-text-path"
            d={`M 50,50 m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
          />
        </defs>
        <text className="fill-gray-900 font-semibold uppercase" style={{ fontSize: "7px" }}>
          <textPath
            href="#circle-text-path"
            startOffset="0%"
            letterSpacing="9"
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
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
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
