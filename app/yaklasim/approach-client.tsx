"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExhaleShell, useExhaleReveal, Sweep, BreathDot } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SUN = "#d99a4e";

const breathSteps = [
  {
    phase: "nefes al",
    dur: "fark et",
    text: "Once olan biteni yargilamadan gormek: bedendeki gerginlik, zihindeki donguler, kacinilan duygular. Farkindalik, degisimin ilk yarisidir.",
  },
  {
    phase: "tut",
    dur: "birlikte kal",
    text: "Rahatsiz edici olanla, kacmadan, bastirmadan, guvenli bir cercevede kalmayi ogrenmek. Kaygi, tanik olundukca kuculur.",
  },
  {
    phase: "birak",
    dur: "alan ac",
    text: "Ise yaramayan stratejileri, kati oz-elestiriyi ve tasinmasi gerekmeyen yukleri usulca birakmak. Kalan sey: nefes alan bir hayat.",
  },
];

export function ApproachClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useExhaleReveal();
  const ringRef = useRef<SVGCircleElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ring = ringRef.current;
    const rail = railRef.current;
    if (!ring || !rail) return;
    const CIRC = 2 * Math.PI * 118;
    ring.style.strokeDasharray = `${CIRC}`;
    ring.style.strokeDashoffset = `${CIRC}`;
    const st = ScrollTrigger.create({
      trigger: rail,
      start: "top 55%",
      end: "bottom 60%",
      scrub: 0.4,
      onUpdate: (self) => {
        ring.style.strokeDashoffset = `${CIRC * (1 - self.progress)}`;
        setActive(Math.min(2, Math.floor(self.progress * 3)));
      },
    });
    return () => st.kill();
  }, []);

  // Map content principles to breath steps or use defaults
  const steps = c.approach.principles.length >= 3
    ? c.approach.principles.slice(0, 3).map((p, i) => ({
        phase: breathSteps[i].phase,
        dur: p.title,
        text: p.desc,
      }))
    : breathSteps;

  return (
    <ExhaleShell scopeRef={scopeRef} eyebrow="yontem" title="al. tut." accent="birak." siteName={c.site.name}>
      <section className="pb-14 pt-4">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
          <p
            data-reveal
            className="max-w-xl text-left text-base font-light leading-[2.05] text-[#5b6478]"
          >
            {c.approach.intro || (
              <>
                Yaklasimim bilissel-davranisci temeller ile kabul ve kararlilik
                terapisini, nefes ve beden farkindaligi ile birlestirir. Amac kaygiyi
                yok etmek degil, <Sweep>onunla iliskiyi degistirmektir.</Sweep>
              </>
            )}
          </p>
        </div>
      </section>

      <section className="pb-28">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
          <div ref={railRef} className="mx-auto grid max-w-4xl gap-14 md:grid-cols-[5fr_7fr]">
            <div className="relative hidden md:block">
              <div className="sticky top-36 flex flex-col items-center gap-6">
                <div className="relative flex h-64 w-64 items-center justify-center">
                  <span
                    className="absolute inset-0 rounded-full border border-[#d99a4e]/25"
                    style={{ animation: "exhale-breath 14s ease-in-out infinite" }}
                    aria-hidden="true"
                  />
                  <span className="absolute inset-6 rounded-full bg-white/65 backdrop-blur" aria-hidden="true" />
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 256 256" aria-hidden="true">
                    <circle cx="128" cy="128" r="118" fill="none" stroke="#3a425214" strokeWidth="2" />
                    <circle
                      ref={ringRef}
                      cx="128"
                      cy="128"
                      r="118"
                      fill="none"
                      stroke={SUN}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="relative text-center">
                    <p className="text-2xl font-medium lowercase text-[#b97f35] transition-[color] duration-300">
                      {steps[active].phase}
                    </p>
                    <p className="mt-2 text-xs font-light lowercase text-[#5b6478]/70">
                      {steps[active].dur}
                    </p>
                  </div>
                </div>
                <p className="text-xs font-medium lowercase text-[#5b6478]/55">
                  {active + 1} / 3 ~ nefes dongusu
                </p>
              </div>
            </div>

            <div className="space-y-20 md:space-y-40 md:py-16">
              {steps.map((s, i) => (
                <div key={s.phase} data-reveal className="relative">
                  <span
                    className="pointer-events-none absolute -left-2 -top-10 text-8xl font-light text-[#d99a4e]/12"
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                  <p className="text-sm font-semibold lowercase text-[#b97f35]/85">
                    ~ {s.dur}
                  </p>
                  <h3 className="mt-3 text-3xl font-medium lowercase text-[#3a4252]">
                    {s.phase}
                  </h3>
                  <p className="mt-5 max-w-md text-[15px] font-light leading-[2.15] text-[#5b6478]">
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-28">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
          <div
            data-reveal
            className="mx-auto max-w-2xl rounded-[2.4rem] bg-white/60 p-10 text-center shadow-[0_18px_50px_rgba(90,110,140,0.11)] backdrop-blur md:p-14"
          >
            <BreathDot size={10} />
            <p className="mt-6 text-xl font-light lowercase leading-[1.9] text-[#3a4252]">
              &ldquo;{c.home.quote}&rdquo;
            </p>
            <p className="mt-4 text-sm font-medium lowercase text-[#b97f35]/80">
              ~ {c.home.quoteAuthor} ~
            </p>
          </div>
        </div>
      </section>
    </ExhaleShell>
  );
}
