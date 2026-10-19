"use client";

import { useState } from "react";
import { SendIcon } from "./icons";

interface FooterNewsletterProps {
  heading: string;
  placeholder: string;
  note: string;
}

export function FooterNewsletter({
  heading,
  placeholder,
  note,
}: FooterNewsletterProps) {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmail("");
  }

  return (
    <div className="flex w-full max-w-[280px] flex-col gap-5">
      <h3 className="font-[family-name:var(--font-arimo)] text-[16px] font-light text-white">
        {heading}
      </h3>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="w-full min-w-0 rounded-full border border-white/10 bg-white/10 px-5 py-3 font-[family-name:var(--font-arimo)] text-[14px] text-white placeholder:text-white/50 outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-110 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/40 active:scale-100"
        >
          <SendIcon className="h-4 w-4 -translate-x-px translate-y-px" />
        </button>
      </form>
      <p className="font-[family-name:var(--font-arimo)] text-[14px] leading-relaxed text-white/60">
        {note}
      </p>
    </div>
  );
}
