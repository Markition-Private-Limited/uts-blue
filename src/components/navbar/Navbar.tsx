import Link from "next/link";
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
    <header className="absolute inset-x-0 top-0 z-50">
      {/* Glass panel — same treatment as the booking bar */}
      <div
        className="mx-6 mt-4 rounded-2xl px-6 py-3 lg:mx-8"
        style={{
          background: "#1E4FD926",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-white">
            Logo
          </Link>

          {/* Nav links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-white/80 transition-colors hover:text-white"
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
      </div>
    </header>
  );
}
