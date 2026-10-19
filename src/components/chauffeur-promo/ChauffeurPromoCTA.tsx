import { ArrowRightIcon } from "./icons";

interface ChauffeurPromoCTAProps {
  label: string;
  href: string;
}

export function ChauffeurPromoCTA({ label, href }: ChauffeurPromoCTAProps) {
  return (
    <a
      href={href}
      className="group mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 py-1 pr-5 pl-1 font-[family-name:var(--font-arimo)] text-xs font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/50 active:scale-100 sm:mt-6 sm:text-sm"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 transition-transform group-hover:translate-x-0.5 sm:h-8 sm:w-8">
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </span>
      {label}
    </a>
  );
}
