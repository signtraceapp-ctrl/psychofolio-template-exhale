import { getContent } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Yazılar" };

export default function ArticlesPage() {
  const c = getContent();
  return (
    <div className="font-sans bg-bg text-fg">
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <h1 className="font-display text-4xl font-bold text-center tracking-tight text-fg">Yazilar</h1>
            <div className="mx-auto max-w-3xl grid gap-5 sm:grid-cols-2">
              {c.articles.map((a, i) => (
                <div key={i} className="group rounded-[24px] border border-border/40 bg-bg p-6 hover:border-primary/20 hover:shadow-md transition-all duration-300 cursor-pointer">
                  <span className="inline-block text-[10px] tracking-wider uppercase text-primary-fg bg-primary/80 rounded-full px-3 py-1 font-semibold mb-4">
                    {a.category}
                  </span>
                  <h2 className="font-display text-lg font-semibold text-fg group-hover:text-primary transition-colors leading-snug">{a.title}</h2>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-fg-muted">
                    <span>{a.readTime}</span>
                    <span className="text-border">|</span>
                    <span>{a.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
