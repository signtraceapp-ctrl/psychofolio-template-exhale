"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ExhaleShell, useExhaleReveal, Sweep, CloudDrift, BreathDot } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

const SUN = "#d99a4e";

export function ContactClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useExhaleReveal();
  const [sent, setSent] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const letter = letterRef.current;
    if (letter) {
      gsap.to(letter, {
        x: 340,
        y: -240,
        rotate: -16,
        scale: 0.7,
        opacity: 0,
        duration: 1.1,
        ease: "power2.in",
        onComplete: () => setSent(true),
      });
    } else {
      setSent(true);
    }
  };

  const lined =
    "repeating-linear-gradient(180deg,transparent 0 33px,#7d98c422 33px 34px)";

  return (
    <ExhaleShell scopeRef={scopeRef} eyebrow="iletisim" title="gokyuzune bir" accent="mektup birakin." siteName={c.site.name}>
      <section className="pb-32 pt-6">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-[5fr_7fr]">
            <div data-reveal className="space-y-8">
              <div className="relative overflow-hidden rounded-[2.4rem] bg-gradient-to-b from-[#dfe9f5] to-[#f6efe2] p-8 shadow-[0_18px_48px_rgba(90,110,140,0.12)]">
                <CloudDrift density={4} opacity={0.7} />
                <div className="relative">
                  <BreathDot size={10} />
                  <p className="mt-5 text-base font-light leading-[2] text-[#3a4252]">
                    {c.contact.intro || (
                      <>
                        Ilk adim cogu zaman en agiridir.{" "}
                        <Sweep>Kisa bir not yeterli</Sweep> - en gec iki is gunu
                        icinde donus yapilir.
                      </>
                    )}
                  </p>
                  <div className="mt-7 space-y-4">
                    {[
                      ["e-posta", c.site.email],
                      ["adres", c.site.address],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-baseline justify-between gap-4 border-b border-[#3a4252]/8 pb-2.5"
                      >
                        <span className="text-xs font-semibold lowercase text-[#b97f35]/80">
                          {k}
                        </span>
                        <span className="text-sm font-light text-[#3a4252]">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="px-2 text-xs font-light leading-[1.9] text-[#5b6478]/70">
                Acil bir kriz anindaysaniz lutfen 112&apos;yi arayin ya da en
                yakin acil servise basvurun; bu form acil destek icin uygun
                degildir.
              </p>
            </div>

            <div data-reveal className="relative">
              {sent ? (
                <div className="flex h-full min-h-[380px] flex-col items-center justify-center rounded-[2.4rem] bg-white/75 p-10 text-center shadow-[0_18px_50px_rgba(90,110,140,0.12)] backdrop-blur">
                  <span className="text-3xl" aria-hidden="true">&#9992;</span>
                  <div
                    className="mt-5 flex h-16 w-16 -rotate-12 items-center justify-center rounded-full border border-[#b97f35]/40 text-center text-[8px] lowercase leading-tight text-[#b97f35]/75"
                    aria-hidden="true"
                  >
                    exhale
                    <br />
                    postasi
                  </div>
                  <p className="mt-5 text-xl font-medium lowercase text-[#3a4252]">
                    mektubunuz gokyuzunde.
                  </p>
                  <p className="mt-3 max-w-xs text-[13px] font-light leading-[1.9] text-[#5b6478]/90">
                    En gec iki is gunu icinde size donus yapilacak. (Bu bir
                    sablon onizlemesidir - mesaj gonderilmedi.)
                  </p>
                </div>
              ) : (
                <div ref={letterRef}>
                  <form
                    onSubmit={handleSubmit}
                    className="relative overflow-hidden rounded-[2rem] bg-[#fffdf8] p-9 shadow-[0_22px_56px_rgba(90,110,140,0.15)] md:p-11"
                    style={{ backgroundImage: lined }}
                  >
                    <span
                      className="pointer-events-none absolute bottom-0 left-8 top-0 w-px bg-[#d66a5a]/30"
                      aria-hidden="true"
                    />
                    <div className="absolute right-7 top-7 flex h-14 w-12 rotate-3 flex-col items-center justify-center gap-1 border border-dashed border-[#b97f35]/45 bg-[#fdf4e3]">
                      <BreathDot size={8} />
                      <span className="text-[7px] lowercase text-[#b97f35]/75">exhale</span>
                    </div>

                    <p className="pl-6 text-sm font-light italic text-[#5b6478]">
                      Sevgili Teras,
                    </p>

                    <div className="mt-6 space-y-6 pl-6">
                      {[
                        { id: "x-ad", label: c.contact.formName || "adim", type: "text" },
                        { id: "x-eposta", label: c.contact.formEmail || "e-postam", type: "email" },
                      ].map((f) => (
                        <div key={f.id} className="flex items-baseline gap-4">
                          <label
                            htmlFor={f.id}
                            className="w-20 shrink-0 text-sm font-semibold lowercase text-[#b97f35]"
                          >
                            {f.label}
                          </label>
                          <input
                            id={f.id}
                            type={f.type}
                            required
                            className="w-full border-b border-[#3a4252]/15 bg-transparent py-1.5 text-base font-light italic text-[#3a4252] outline-none transition-colors duration-300 focus:border-[#d99a4e]"
                          />
                        </div>
                      ))}
                      <div>
                        <label
                          htmlFor="x-mesaj"
                          className="text-sm font-semibold lowercase text-[#b97f35]"
                        >
                          {c.contact.formMessage || "yazmak istediklerim..."}
                        </label>
                        <textarea
                          id="x-mesaj"
                          rows={5}
                          required
                          className="mt-2 w-full resize-none bg-transparent text-base font-light italic leading-[34px] text-[#3a4252] outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between pl-6">
                      <p className="text-xs font-light lowercase text-[#5b6478]/50">
                        pul gerekmez
                      </p>
                      <button
                        type="submit"
                        className="rounded-full px-9 py-3.5 text-sm font-semibold lowercase text-white shadow-[0_10px_26px_rgba(217,154,78,0.4)] transition-transform duration-300 hover:-translate-y-0.5"
                        style={{ background: `linear-gradient(120deg,${SUN},#c8883b)` }}
                      >
                        {c.contact.formSubmit || "mektubu ucur"} &#9992;
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </ExhaleShell>
  );
}
