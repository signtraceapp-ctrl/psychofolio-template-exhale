import { getContent } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Hakkımda" };

export default function AboutPage() {
  const c = getContent();
  return (
    <div className="font-sans bg-bg text-fg">
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-16">
            <h1 className="font-display text-4xl font-bold text-center tracking-tight text-fg">{c.about.title}</h1>
            <p className="text-center text-lg text-fg-muted leading-relaxed max-w-xl mx-auto">
              {c.about.intro}
            </p>
            <div className="space-y-5">
              {c.about.credentials.map((cred, i) => (
                <div key={i} className="rounded-[24px] border border-border/40 bg-bg-secondary/40 p-6 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-fg">{cred.title}</h3>
                  </div>
                  <p className="text-sm text-fg-muted pl-11">{cred.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
