"use client";

import { motion } from "framer-motion";
import { Wind, Quote, ArrowRight } from "lucide-react";
import type { SiteContent } from "@/lib/content";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

export function HomeClient({ content: c }: { content: SiteContent }) {
  return (
    <div className="font-sans selection:bg-primary/15 bg-bg text-fg">
      {/* Hero - centered, ethereal */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/20 via-bg to-bg-secondary/30" />
        <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-2xl text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-5 py-2 text-xs font-semibold tracking-wider text-primary uppercase">
              <Wind className="h-3.5 w-3.5" /> {c.home.badge}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-fg leading-[1.15]">
              {c.home.headline}<br />
              <span className="text-primary">{c.home.headlineAccent}</span>{c.home.headlineSuffix}
            </h1>
            <p className="mx-auto max-w-md text-base leading-relaxed text-fg-muted">
              {c.home.description}
            </p>
            <div className="pt-2">
              <a
                href="/iletisim"
                className="inline-flex items-center justify-center gap-2 rounded-full px-10 py-3.5 text-sm font-semibold shadow-lg shadow-primary/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/15 bg-primary text-primary-fg hover:bg-primary-hover"
              >
                {c.home.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-24 bg-bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mx-auto max-w-2xl text-center space-y-8"
          >
            <Quote className="h-10 w-10 text-primary/20 mx-auto" />
            <p className="font-display text-2xl md:text-3xl leading-relaxed text-fg/80 font-medium">
              &ldquo;{c.home.quote}&rdquo;
            </p>
            <p className="text-xs tracking-[0.25em] uppercase text-fg-muted font-display">{c.home.quoteAuthor}</p>
          </motion.div>
        </div>
      </section>

      {/* Services - soft pill cards */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-14">
            <div className="text-center space-y-4">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-fg tracking-tight">Calisma Alanlari</h2>
              <p className="text-sm text-fg-muted">Seans bilgisi icin iletisime gecin.</p>
            </div>
            <motion.div
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid gap-5 sm:grid-cols-2"
            >
              {c.services.map((s, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group rounded-[28px] border border-border/50 bg-bg-secondary/40 p-8 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-xl font-semibold text-fg group-hover:text-primary transition-colors">{s.title}</h3>
                      <span className="flex-shrink-0 text-[10px] tracking-wider uppercase text-primary bg-primary/8 rounded-full px-3 py-1 font-semibold">
                        {s.duration}
                      </span>
                    </div>
                    <p className="text-sm text-fg-muted leading-relaxed">{s.desc}</p>
                    <p className="text-xs text-fg-muted/60">{s.method}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-24 bg-bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-14">
            <h2 className="font-display text-3xl font-bold text-center text-fg tracking-tight">Yazilar</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {c.articles.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group rounded-[24px] border border-border/40 bg-bg p-6 hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer"
                >
                  <span className="inline-block text-[10px] tracking-wider uppercase text-primary-fg bg-primary/80 rounded-full px-3 py-1 font-semibold mb-4">
                    {a.category}
                  </span>
                  <h3 className="font-display text-base font-semibold text-fg group-hover:text-primary transition-colors leading-snug">
                    {a.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-fg-muted">
                    <span>{a.readTime}</span>
                    <span className="text-border">|</span>
                    <span>{a.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
