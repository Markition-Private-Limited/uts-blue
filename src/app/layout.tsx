import type { Metadata } from "next";
import { Arimo } from "next/font/google";
import { LenisProvider } from "@/providers/LenisProvider";
import "./globals.css";
import { FooterSection } from "@/components/footer";

const arimo = Arimo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arimo",
});

export const metadata: Metadata = {
  title: "UTS Blue — Executive Chauffeur Services",
  description: "Luxury chauffeur services across London and beyond.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${arimo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-[family-name:var(--font-arimo)]">
        <LenisProvider>
          {children}
          <FooterSection />
        </LenisProvider>
      </body>
    </html>
  );
}
