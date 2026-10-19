import Link from "next/link";
import type { FooterLink } from "@/types/footer";

interface FooterLinkColumnProps {
  heading: string;
  links: FooterLink[];
}

export function FooterLinkColumn({ heading, links }: FooterLinkColumnProps) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-[family-name:var(--font-arimo)] text-[16px] font-light text-white">
        {heading}
      </h3>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="inline-block font-[family-name:var(--font-arimo)] text-[14px] leading-[100%] text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
