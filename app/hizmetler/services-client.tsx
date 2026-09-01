"use client";

import { useEffect, useRef } from "react";
import { ExhaleShell, useExhaleReveal, Sweep, CloudDrift, BreathDot } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

const SUN = "#d99a4e";
const SUND = "#b97f35";

const defaultAltitudes = [
  {
    alt: "2.000",
    tag: "kaygi - panik - stres",
    bg: "linear-gradient(120deg,#f6ead8 0%,#fbf4e6 100%)",
  },
  {
    alt: "5.000",
    tag: "is stresi - sinirlar - yenilenme",
    bg: "linear-gradient(120deg,#e8eef7 0%,#f4f7fb 100%)",
  },
  {
    alt: "8.000",
    tag: "kucuk grup - 6 hafta",
    bg: "linear-gradient(120deg,#ffffff 0%,#f2f6fc 100%)",
  },
];

export function ServicesClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useExhaleReveal();
  const stripRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    const plane = planeRef.current;
    if (!strip || !plane) return;
    const onScroll = () => {
      const max = strip.scrollWidth - strip.clientWidth;
      const p = max > 0 ? strip.scrollLeft / max : 0;
      plane.style.left = `${6 + p * 88}%`;
    };
    onScroll();
    strip.addEventListener("scroll", onScroll, { passive: true });
    return () => strip.removeEventListener("scroll", onScroll);
  }, []);

  const services = c.services;

  return (
    <ExhaleShell
      scopeRef={scopeRef}
      eyebrow="irtifa katmanlari"
      title="yukseldikce"
      accent="hafifler."
      siteName={c.site.name}
    >
      <section className="pb-32 pt-2">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
          <p data-reveal className="max-w-md text-[15px] font-light leading-[2] text-[#5b6478]">
            Her irtifa, ayri bir calisma alani. Kartlari <Sweep>yana kaydirarak</Sweep>{" "}
            tirmanin, her katmanda hava biraz daha incelir.
          </p>

          {/* Horizontal altitude ruler + plane */}
          <div data-reveal className="relative mt-10 hidden h-8 md:block">
            <div
              className="absolute inset-x-0 top-1/2 h-px"
              style={{
                background:
                  "repeating-linear-gradient(90deg,#b97f35 0 2px,transparent 2px 28px)",
                opacity: 0.35,
              }}
              aria-hidden="true"
            />
            {services.slice(0, 3).map((_, i) => (
              <span
                key={i}
                className="absolute top-1/2 -translate-y-1/2 text-[11px] font-semibold lowercase text-[#b97f35]/70"
                style={{ left: `${8 + i * 38}%` }}
              >
                {defaultAltitudes[i]?.alt || String((i + 1) * 3000)} m
              </span>
            ))}
            <span
              ref={planeRef}
              className="absolute top-1/2 -translate-y-1/2 text-xl transition-[left] duration-150"
              style={{ left: "6%", color: SUND }}
              aria-hidden="true"
            >
              &#9992;
            </span>
          </div>
        </div>

        {/* Horizontal strip */}
        <div
          ref={stripRef}
          className="mt-8 flex snap-x snap-mandatory gap-7 overflow-x-auto px-6 pb-8 lg:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]"
          style={{ scrollbarWidth: "thin" }}
        >
          {services.map((s, i) => {
            const alt = defaultAltitudes[i];
            return (
              <div
                key={i}
                data-reveal
                className="group relative flex min-h-[420px] w-[82vw] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-[2.6rem] p-9 shadow-[0_24px_60px_rgba(90,110,140,0.14)] transition-transform duration-500 hover:-translate-y-2 sm:w-[420px] md:p-11"
                style={{ background: alt?.bg || "linear-gradient(120deg,#f6ead8 0%,#fbf4e6 100%)" }}
              >
                <span
                  className="pointer-events-none absolute right-4 top-2 select-none text-[150px] font-light leading-none text-transparent"
                  style={{ WebkitTextStroke: `1.2px ${SUND}33` }}
                  aria-hidden="true"
                >
                  {alt?.alt || String(i + 1)}
                </span>
                <CloudDrift density={2} opacity={0.55} />
                <div className="relative">
                  <p className="text-xs font-semibold lowercase text-[#b97f35]/85">
                    {alt ? `${alt.alt} metre ~ ${alt.tag}` : s.method}
                  </p>
                  <h3 className="mt-2 text-2xl font-medium lowercase text-[#3a4252] md:text-3xl">
                    {s.title}
                  </h3>
                  <p className="mt-4 text-[14px] font-light leading-[2] text-[#5b6478]">
                    {s.desc}
                  </p>
                  <p className="mt-2 text-xs font-light lowercase text-[#5b6478]/60">
                    {s.duration} - {s.method}
                  </p>
                  <p className="mt-5 text-sm font-semibold lowercase text-[#b97f35] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    bu irtifaya tirman &rarr;
                  </p>
                </div>
              </div>
            );
          })}
          {/* Summit CTA card */}
          <div
            data-reveal
            className="flex min-h-[420px] w-[70vw] shrink-0 snap-center flex-col items-center justify-center gap-5 rounded-[2.6rem] text-center text-white shadow-[0_24px_60px_rgba(217,154,78,0.35)] sm:w-[340px]"
            style={{ background: `linear-gradient(150deg,${SUN},#c8883b)` }}
          >
            <BreathDot size={12} />
            <p className="px-8 text-2xl font-medium lowercase leading-snug">
              zirvede
              <br />
              goruselim mi?
            </p>
            <a
              href="/iletisim"
              className="rounded-full bg-white/95 px-7 py-3 text-sm font-semibold lowercase text-[#b97f35]"
            >
              randevu al
            </a>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
          <p data-reveal className="mt-4 text-sm font-light lowercase text-[#5b6478]/70">
            tum irtifalara yerden baslanir, ilk gorusme bir tanismadir
          </p>
        </div>
      </section>
    </ExhaleShell>
  );
}
