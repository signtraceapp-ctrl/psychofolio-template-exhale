import { getContent } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "SSS" };

export default function FaqPage() {
  const c = getContent();
  return (
    <div className="font-sans bg-bg text-fg">
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl space-y-12">
            <h1 className="font-display text-4xl font-bold text-center tracking-tight text-fg">Sik Sorulan Sorular</h1>
            <div className="space-y-4">
              {c.faq.map((item, i) => (
                <details key={i} className="group rounded-[20px] border border-border/40 bg-bg overflow-hidden transition-all duration-300 hover:border-primary/20">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-7 py-5 text-left font-display text-lg font-semibold text-fg hover:text-primary transition-colors list-none [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <span className="flex-shrink-0 text-primary/40 text-xl leading-none transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <div className="px-7 pb-6">
                    <p className="text-sm text-fg-muted leading-relaxed">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
