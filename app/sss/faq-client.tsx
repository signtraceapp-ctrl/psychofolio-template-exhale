"use client";

import { useState } from "react";
import { ExhaleShell, useExhaleReveal, Sweep } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

const SUND = "#b97f35";

export function FaqClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useExhaleReveal();
  const [open, setOpen] = useState(-1);

  return (
    <ExhaleShell scopeRef={scopeRef} eyebrow="merak edilenler" title="havada kalan" accent="sorular." siteName={c.site.name}>
      <section className="pb-32 pt-6">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl">
            {c.faq.map((b, i) => {
              const isOpen = open === i;
              return (
                <div key={i} data-reveal className="relative pb-9">
                  <svg
                    className="pointer-events-none absolute left-1/2 top-full -mt-9 h-9 w-6 -translate-x-1/2"
                    viewBox="0 0 24 36"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 0 C 6 12, 18 20, 12 36"
                      fill="none"
                      stroke={SUND}
                      strokeOpacity=".35"
                      strokeWidth="1.2"
                    />
                  </svg>
                  <div
                    className={`overflow-hidden rounded-[2rem] backdrop-blur transition-[transform,background-color,box-shadow] duration-300 ${
                      isOpen
                        ? "-translate-y-1.5 bg-white/90 shadow-[0_26px_58px_rgba(217,154,78,0.22)] ring-1 ring-[#d99a4e]/30"
                        : "bg-white/60 shadow-[0_12px_34px_rgba(90,110,140,0.09)] hover:-translate-y-1"
                    }`}
                    style={{
                      animation: isOpen
                        ? "none"
                        : `exhale-bob 6s ease-in-out ${i * -1.3}s infinite`,
                    }}
                  >
                    <button
                      className="flex w-full items-center gap-5 px-7 py-6 text-left"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm transition-[transform,border-color,color] duration-300 ${
                          isOpen
                            ? "rotate-45 border-[#b97f35]/55 text-[#b97f35]"
                            : "border-[#5b6478]/25 text-[#5b6478]/60"
                        }`}
                        aria-hidden="true"
                      >
                        +
                      </span>
                      <span
                        className={`flex-1 text-base font-medium lowercase sm:text-lg ${
                          isOpen ? "text-[#b97f35]" : "text-[#3a4252]"
                        }`}
                      >
                        {b.q}
                      </span>
                    </button>
                    <div
                      className="grid transition-[grid-template-rows] duration-500 ease-out"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="px-7 pb-7 pl-20 text-sm font-light leading-[2.05] text-[#5b6478]">
                          {b.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <p data-reveal className="mt-6 text-center text-sm font-light lowercase text-[#5b6478]/75">
              sorunuz burada yoksa - <Sweep>iletisim sayfasindan</Sweep> cekinmeden
              yazin.
            </p>
          </div>
        </div>
      </section>
    </ExhaleShell>
  );
}
