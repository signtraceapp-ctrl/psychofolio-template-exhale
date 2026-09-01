"use client";

import { ExhaleShell, useExhaleReveal, Sweep, BreathDot } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

const SUND = "#b97f35";
const AIRMAIL =
  "repeating-linear-gradient(45deg,#d66a5a 0 12px,#ffffff 12px 24px,#7d98c4 24px 36px,#ffffff 36px 48px)";

export function ArticlesClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useExhaleReveal();
  const articles = c.articles;
  const [featured, ...rest] = articles;

  return (
    <ExhaleShell scopeRef={scopeRef} eyebrow="hava postası" title="gökyüzünden" accent="mektuplar." siteName={c.site.name}>
      {featured && (
        <section className="pb-16 pt-6">
          <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
            <article
              data-reveal
              className="group mx-auto max-w-3xl cursor-pointer rounded-[1.8rem] bg-white p-2 shadow-[0_24px_60px_rgba(90,110,140,0.15)] transition-transform duration-500 hover:-translate-y-2 hover:-rotate-[0.4deg]"
            >
              <div className="rounded-[1.5rem] p-[6px]" style={{ background: AIRMAIL }}>
                <div className="relative rounded-[1.2rem] bg-[#fffdf8] p-9 md:p-12">
                  <div className="absolute right-7 top-7 flex h-16 w-14 rotate-3 flex-col items-center justify-center gap-1 border border-dashed border-[#b97f35]/45 bg-[#fdf4e3]">
                    <BreathDot size={9} />
                    <span className="text-[7px] lowercase text-[#b97f35]/75">exhale</span>
                  </div>
                  <div
                    className="pointer-events-none absolute right-20 top-9 h-14 w-14 -rotate-12 rounded-full border border-[#5b6478]/25"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold lowercase text-[#b97f35]/85">
                    ~ öne çıkan - {featured.category} {featured.date ? `- ${featured.date}` : ""}
                  </p>
                  <h2 className="mt-5 max-w-md text-2xl font-medium lowercase leading-[1.3] text-[#3a4252] transition-colors duration-500 group-hover:text-[#b97f35] sm:text-3xl md:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 max-w-lg text-[15px] font-light leading-[2] text-[#5b6478]">
                    {featured.readTime}
                  </p>
                  <p className="mt-7 text-sm font-semibold lowercase text-[#b97f35]">
                    mektubu aç &rarr;
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      <section className="pb-32">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-3">
            {rest.map((n, i) => (
              <article
                key={n.title + i}
                data-reveal
                className="group relative cursor-pointer overflow-hidden rounded-[1.8rem] bg-white/80 p-7 shadow-[0_16px_44px_rgba(90,110,140,0.11)] backdrop-blur transition-[transform,box-shadow] duration-300 hover:-translate-y-3 hover:shadow-[0_30px_64px_rgba(90,110,140,0.18)]"
                style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 0.7}deg)` }}
              >
                <span
                  className="absolute right-0 top-0 h-0 w-0 rotate-90 border-b-[24px] border-l-[24px] border-b-transparent border-l-[#e9eef6] transition-colors duration-500 group-hover:border-l-[#d99a4e]/35"
                  aria-hidden="true"
                />
                <p className="text-xs font-semibold lowercase text-[#b97f35]/85">~ {n.category}</p>
                <h3 className="mt-3 text-lg font-medium lowercase leading-snug text-[#3a4252] transition-colors duration-500 group-hover:text-[#b97f35]">
                  {n.title}
                </h3>
                <p className="mt-3 text-[13px] font-light leading-[1.9] text-[#5b6478]/90">
                  {n.readTime}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-light lowercase text-[#5b6478]/60">{n.date}</span>
                  <span
                    className="translate-x-0 text-[#b97f35]/0 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:text-[#b97f35]"
                    aria-hidden="true"
                  >
                    &#9992;
                  </span>
                </div>
              </article>
            ))}
          </div>
          <p
            data-reveal
            className="mt-14 text-center text-sm font-light lowercase text-[#5b6478]/70"
          >
            yeni mektuplar her mevsim gökyüzüne bırakılır
          </p>
        </div>
      </section>
    </ExhaleShell>
  );
}
