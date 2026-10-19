import Link from "next/link";
import Image from "next/image";
import { ArrowButton } from "./ArrowButton";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Our Fleet", href: "/fleet" },
  { label: "Contact Us", href: "/contact" },
];

export function Navbar() {
  return (
    <header
      className="absolute inset-x-0 top-0 z-50 px-8 py-4"
      style={{
        background: "#1E4FD926",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      <nav className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="UTS Blue"
            width={180}
            height={64}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>

        {/* Nav links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="inline-block text-sm text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ArrowButton label="Get Started" href="/get-started" variant="blue" />
          <ArrowButton label="Sign in" href="/signin" variant="outline" />
        </div>
      </nav>
    </header>
  );
}
