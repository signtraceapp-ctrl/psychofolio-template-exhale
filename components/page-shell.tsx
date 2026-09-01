"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ExhaleHeader,
  BreathCursor,
  CloudDrift,
  BreathWave,
  BreathDot,
  Sweep,
} from "./exhale-header";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Shared reveal hook */
export function useExhaleReveal() {
  const scopeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    const scope = scopeRef.current;
    if (!scope) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 46,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    }, scope);
    return () => ctx.revert();
  }, []);
  return scopeRef;
}

/* Shared page scaffold */
export function ExhaleShell({
  eyebrow,
  title,
  accent,
  children,
  scopeRef,
  siteName,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  children: React.ReactNode;
  scopeRef: React.RefObject<HTMLDivElement | null>;
  siteName?: string;
}) {
  return (
    <div
      ref={scopeRef}
      className="min-h-screen text-[#3a4252] selection:bg-[#d99a4e]/25 lg:[cursor:none] lg:[&_a]:[cursor:none] lg:[&_button]:[cursor:none]"
      style={{
        colorScheme: "light",
        background:
          "linear-gradient(180deg,#e9eef6 0%,#f4f0e9 34%,#f8f3ea 100%)",
      }}
    >
      <BreathCursor />
      <ExhaleHeader siteName={siteName} />

      {/* Dock offset: content flows right of the dock */}
      <div className="lg:pl-52">
        <header className="relative overflow-hidden pt-32 pb-14 lg:pt-36">
          <CloudDrift density={5} opacity={0.7} />
          {/* Sun disc */}
          <div
            className="pointer-events-none absolute -top-24 right-[-90px] h-[380px] w-[380px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(238,194,127,0.55), rgba(238,194,127,0.18) 55%, transparent 72%)",
            }}
            aria-hidden="true"
          />
          <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
            <div className="max-w-3xl text-left">
              <p data-reveal className="text-sm font-medium lowercase text-[#b97f35]/85">
                ~ {eyebrow} ~
              </p>
              <h1
                data-reveal
                className="mt-4 text-5xl font-light lowercase leading-[1.12] tracking-tight text-[#3a4252] sm:text-6xl md:text-7xl"
              >
                {title}
                <br />
                {accent && <Sweep>{accent}</Sweep>}
              </h1>
              <div data-reveal className="mt-7 [&>svg]:mx-0">
                <BreathWave />
              </div>
            </div>
          </div>
        </header>

        {children}

        <footer className="py-12 pl-6 lg:pl-0">
          <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
            <div className="flex items-center gap-4 text-left">
              <BreathDot size={9} />
              <p className="text-xs font-medium lowercase text-[#3a4252]/40">
                exhale - nefes alan terapi
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* Re-export shared primitives for sub-pages */
export { BreathDot, BreathWave, Sweep, CloudDrift, BreathCursor } from "./exhale-header";
