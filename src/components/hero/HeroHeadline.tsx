interface HeroHeadlineProps {
  headline: string;
  description: string;
}

export function HeroHeadline({ headline, description }: HeroHeadlineProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      <h1 className="max-w-3xl text-center text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
        {headline}
      </h1>
      <p className="max-w-2xl text-center text-base leading-relaxed text-white/70">
        {description}
      </p>
    </div>
  );
}
