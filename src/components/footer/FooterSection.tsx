import { footerContent } from "@/content/footer.content";
import { FooterBrand } from "./FooterBrand";
import { FooterLinkColumn } from "./FooterLinkColumn";
import { FooterNewsletter } from "./FooterNewsletter";
import { FooterBottom } from "./FooterBottom";

// ─── LAYOUT OWNER: this file controls the overall footer layout ───────────────
// Sub-components live next to this file — each one is independently editable.
// Content (copy/text) lives in src/content/footer.content.ts.

export function FooterSection() {
  const {
    logo,
    description,
    quickLinksHeading,
    quickLinks,
    servicesHeading,
    services,
    newsletter,
    copyright,
    socials,
  } = footerContent;

  return (
    <footer className="relative z-10 bg-white px-4 py-6 sm:px-6">
      <div
        className="relative mx-auto overflow-hidden rounded-[32px] bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000_70%)] bg-cover bg-center px-8 py-10 sm:px-12 lg:px-16"
        style={{
          backgroundImage:
            "url(/footer-chevron.png), radial-gradient(ellipse at top right, #2a2a2a, #000000 65%)",
          backgroundRepeat: "repeat, no-repeat",
          backgroundSize: "640px auto, cover",
        }}
      >
        <div className="flex flex-col gap-y-12 md:flex-row md:items-start md:justify-between">
          <FooterBrand logo={logo} description={description} />
          <FooterLinkColumn heading={quickLinksHeading} links={quickLinks} />
          <FooterLinkColumn heading={servicesHeading} links={services} />
          <FooterNewsletter
            heading={newsletter.heading}
            placeholder={newsletter.placeholder}
            note={newsletter.note}
          />
        </div>

        <div className="mt-12">
          <FooterBottom copyright={copyright} socials={socials} />
        </div>
      </div>
    </footer>
  );
}
