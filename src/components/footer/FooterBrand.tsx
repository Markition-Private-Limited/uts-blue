import Image from "next/image";

interface FooterBrandProps {
  logo: string;
  description: string;
}

export function FooterBrand({ description }: FooterBrandProps) {
  return (
    <div className="flex flex-col gap-5" style={{ maxWidth: 360 }}>
      <Image
        src="/logo.png"
        alt="UTS Blue"
        width={220}
        height={76}
        className="h-16 w-auto object-contain object-left"
      />
      <p className="font-[family-name:var(--font-arimo)] text-[14px] leading-[145%] text-white/60">
        {description}
      </p>
    </div>
  );
}
