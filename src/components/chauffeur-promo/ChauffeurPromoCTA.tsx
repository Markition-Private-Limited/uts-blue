import { ArrowRightIcon } from "./icons";

interface ChauffeurPromoCTAProps {
  label: string;
  href: string;
}

export function ChauffeurPromoCTA({ label, href }: ChauffeurPromoCTAProps) {
  return (
    <span className="relative inline-flex">
      <style>{`
        @keyframes ctaPop {
          0%   { transform: translateY(0);    }
          20%  { transform: translateY(-8px); }
          40%  { transform: translateY(0);    }
          100% { transform: translateY(0);    }
        }
      `}</style>

      <a
        href={href}
        style={{ animation: 'ctaPop 1s ease-in-out infinite' }}
        className="btn-fill [--fill-x:1.5rem] group relative inline-flex items-center gap-2 rounded-full bg-blue-600 py-1 pr-5 pl-1 font-[family-name:var(--font-arimo)] text-xs font-semibold text-white shadow-lg shadow-blue-600/30 transition-shadow duration-300 ease-out hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/50 active:scale-100 sm:text-sm"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 transition-transform group-hover:translate-x-0.5 sm:h-8 sm:w-8">
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </span>
        {label}
      </a>
    </span>
  );
}
