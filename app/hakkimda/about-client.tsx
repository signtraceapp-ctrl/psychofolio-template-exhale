"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExhaleShell, useExhaleReveal, Sweep, BreathWave } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SUND = "#b97f35";

const defaultWaypoints = [
  { year: "2013", title: "psikoloji lisansi", note: "Kayginin bedendeki dilini merak etmekle baslayan yolculuk." },
  { year: "2016", title: "klinik psikoloji yuksek lisansi", note: "Bilissel ve kabul temelli yaklasimlar uzerine uzmanlasmak." },
  { year: "2019", title: "mindfulness temelli terapi egitimi", note: "Uluslararasi sertifikasyon ve yogun uygulama donemi." },
  { year: "2022", title: "ozel pratik: terasin acilisi", note: "Kaygi ve tukenmislik odakli kendi klinigi." },
  { year: "2025", title: "nefes atolyeleri", note: "Kucuk gruplarla duzenli farkindalik ve nefes calismalari." },
];

export function AboutClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useExhaleReveal();
  const pathRef = useRef<SVGPathElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const rail = railRef.current;
    if (!path || !rail) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: { trigger: rail, start: "top 72%", end: "bottom 52%", scrub: 0.6 },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const waypoints = c.about.credentials.length > 0
    ? c.about.credentials.map((cred) => ({
        year: cred.year || "--",
        title: cred.title,
        note: cred.detail,
      }))
    : defaultWaypoints;

  return (
    <ExhaleShell
      scopeRef={scopeRef}
      eyebrow="ucus guncesi"
      title="buraya nasil"
      accent="yukseldim?"
      siteName={c.site.name}
    >
      <section className="pb-20 pt-6">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
          <p
            data-reveal
            className="max-w-xl text-left text-lg font-light leading-[2] text-[#5b6478]"
          >
            {c.about.intro || (
              <>
                On yili askin suredir kaygiyla, panikle ve tukenmislikle bogusan
                insanlara ayni seyi soyluyorum:{" "}
                <Sweep>gokyuzu kapanmaz, yalnizca bulutlanir.</Sweep> Benim isim,
                birlikte o bulutlarin uzerine cikmayi ogrenmek.
              </>
            )}
          </p>
        </div>
      </section>

      <section className="pb-28">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
          <div ref={railRef} className="relative mx-auto max-w-2xl">
            <svg
              className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-40 -translate-x-1/2 md:block"
              viewBox="0 0 160 1000"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                ref={pathRef}
                d="M80 0 C 130 120, 30 220, 80 330 C 130 440, 30 540, 80 650 C 130 760, 30 870, 80 1000"
                fill="none"
                stroke={SUND}
                strokeOpacity=".45"
                strokeWidth="1.6"
                strokeDasharray="6 7"
              />
            </svg>

            <div className="space-y-14">
              {waypoints.map((w, i) => (
                <div
                  key={w.year + i}
                  data-reveal
                  className={`relative md:flex ${i % 2 === 0 ? "md:justify-start" : "md:justify-end"}`}
                >
                  <div
                    className="group w-full rounded-[2rem] bg-white/85 p-7 pb-6 shadow-[0_18px_46px_rgba(90,110,140,0.13)] backdrop-blur transition-[transform] duration-500 hover:-translate-y-2 hover:rotate-0 md:w-[46%]"
                    style={{ transform: `rotate(${i % 2 === 0 ? "-1.2" : "1.2"}deg)` }}
                  >
                    <span className="absolute -top-3 right-6 flex h-12 w-12 rotate-6 items-center justify-center rounded-full border border-dashed border-[#b97f35]/50 bg-[#fdf8ef] text-[11px] font-semibold text-[#b97f35] shadow-sm">
                      {w.year}
                    </span>
                    <h3 className="pr-10 text-lg font-medium lowercase text-[#3a4252]">
                      {w.title}
                    </h3>
                    <BreathWave w={54} />
                    <p className="mt-2 text-[13px] font-light leading-[1.95] text-[#5b6478]/90">
                      {w.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div data-reveal className="mt-16 flex flex-col items-center gap-3">
              <svg width="46" height="52" viewBox="0 0 46 52" aria-hidden="true">
                <path d="M23 2 L42 22 L23 40 L4 22 Z" fill="#d99a4e" fillOpacity=".85" />
                <path d="M23 2 L23 40 M4 22 L42 22" stroke="#fff" strokeWidth="1.4" strokeOpacity=".7" />
                <path d="M23 40 C 20 46, 27 47, 23 52" stroke="#b97f35" strokeWidth="1.3" fill="none" />
              </svg>
              <p className="text-sm font-semibold lowercase text-[#b97f35]">
                {c.site.name}
              </p>
              <p className="text-xs font-light lowercase text-[#5b6478]/70">
                {c.site.title}
              </p>
            </div>
          </div>
        </div>
      </section>
    </ExhaleShell>
  );
}
