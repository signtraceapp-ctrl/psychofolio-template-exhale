import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { z } from "zod";

const metin = z.string().max(5000);

const siteContentInputSchema = z.object({
  site: z
    .object({
      name: metin,
      title: metin,
      email: metin,
      phone: metin,
      address: metin,
      hours: metin,
      copyright: metin,
    })
    .partial()
    .optional(),

  home: z
    .object({
      badge: metin,
      headline: metin,
      headlineAccent: metin,
      headlineSuffix: metin,
      description: metin,
      cta: metin,
      cardTitle: metin,
      cardSubtitle: metin,
      quote: metin,
      quoteAuthor: metin,
    })
    .partial()
    .optional(),

  services: z
    .array(
      z.object({
        title: metin,
        desc: metin,
        duration: metin,
        method: metin,
        alt: metin.optional(),
        tag: metin.optional(),
      }),
    )
    .optional(),

  about: z
    .object({
      title: metin,
      intro: metin,
      credentials: z.array(
        z.object({ year: metin, title: metin, detail: metin }),
      ),
    })
    .partial()
    .optional(),

  approach: z
    .object({
      title: metin,
      intro: metin,
      principles: z.array(z.object({ title: metin, desc: metin })),
    })
    .partial()
    .optional(),

  articles: z
    .array(
      z.object({
        title: metin,
        category: metin,
        readTime: metin,
        date: metin,
        excerpt: metin.optional(),
      }),
    )
    .optional(),

  faq: z.array(z.object({ q: metin, a: metin })).optional(),

  contact: z
    .object({
      title: metin,
      intro: metin,
      formName: metin,
      formEmail: metin,
      formMessage: metin,
      formSubmit: metin,
    })
    .partial()
    .optional(),
});

export interface SiteContent {
  site: {
    name: string;
    title: string;
    email: string;
    phone?: string;
    address: string;
    hours?: string;
    copyright: string;
  };
  home: {
    badge: string;
    headline: string;
    headlineAccent: string;
    headlineSuffix: string;
    description: string;
    cta: string;
    cardTitle: string;
    cardSubtitle: string;
    quote: string;
    quoteAuthor: string;
  };
  services: {
    title: string;
    desc: string;
    duration: string;
    method: string;
    alt?: string;
    tag?: string;
  }[];
  about: {
    title: string;
    intro: string;
    credentials: { year: string; title: string; detail: string }[];
  };
  approach: {
    title: string;
    intro: string;
    principles: { title: string; desc: string }[];
  };
  articles: {
    title: string;
    category: string;
    readTime: string;
    date: string;
    excerpt?: string;
  }[];
  faq: { q: string; a: string }[];
  contact: {
    title: string;
    intro: string;
    formName: string;
    formEmail: string;
    formMessage: string;
    formSubmit: string;
  };
}

const DEFAULTS: SiteContent = {
  site: {
    name: "Exhale",
    title: "Mindfulness Temelli Terapi",
    email: "teras@exhale.studio",
    address: "Istanbul",
    copyright: "Tum haklari saklidir.",
  },
  home: {
    badge: "EXHALE",
    headline: "Nefes al,",
    headlineAccent: "kendine yer ac",
    headlineSuffix: ".",
    description: "Kaygi, tukenmislik ve stres yonetiminde farkindalik temelli yaklasimlarla sizi destekliyorum.",
    cta: "Iletisime Gecin",
    cardTitle: "Nefes & Farkindalik",
    cardSubtitle: "Mindfulness Temelli Terapi",
    quote: "Bulutlar gokyuzu degildir. Kaygi da siz degilsiniz.",
    quoteAuthor: "exhale yaklasimi",
  },
  services: [
    { title: "Bireysel Terapi", desc: "Kayginin gundelik yukunu birlikte tanimak.", duration: "50 dk", method: "Yuzyuze / Cevrimici" },
  ],
  about: {
    title: "Hakkimda",
    intro: "Kaygi ve farkindalik odakli calisma yapiyorum.",
    credentials: [
      { year: "2013", title: "Psikoloji Lisansi", detail: "Universite mezuniyeti" },
    ],
  },
  approach: {
    title: "Yaklasimim",
    intro: "Farkindalik temelli yaklasim.",
    principles: [
      { title: "Fark et", desc: "Once olan biteni yargilamadan gormek." },
    ],
  },
  articles: [
    { title: "Panik bir alarm, yangin degil", category: "kaygi", readTime: "6 dk", date: "2026" },
  ],
  faq: [
    { q: "Terapiye baslamak icin ne yapmaliyim?", a: "Iletisim formunu doldurun." },
  ],
  contact: {
    title: "Iletisim",
    intro: "Nefes almak icin bir adim atin.",
    formName: "Adim",
    formEmail: "E-postam",
    formMessage: "Yazmak istediklerim...",
    formSubmit: "Mektubu ucur",
  },
};

function birlestir<T extends Record<string, unknown>>(
  varsayilan: T,
  gelen?: Partial<T>,
): T {
  if (!gelen) return varsayilan;
  const cikti = { ...varsayilan };
  for (const [k, v] of Object.entries(gelen)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    (cikti as Record<string, unknown>)[k] = v;
  }
  return cikti;
}

let cached: SiteContent | null = null;

export function getContent(): SiteContent {
  if (cached) return cached;

  const defaultsPath = join(process.cwd(), "content", "site.json");
  let base: SiteContent = DEFAULTS;

  if (existsSync(defaultsPath)) {
    try {
      const raw = JSON.parse(readFileSync(defaultsPath, "utf-8"));
      const parsed = siteContentInputSchema.safeParse(raw);

      if (parsed.success) {
        const g = parsed.data;
        base = {
          site: birlestir(DEFAULTS.site, g.site),
          home: birlestir(DEFAULTS.home, g.home),
          services:
            g.services && g.services.length > 0
              ? (g.services as SiteContent["services"])
              : DEFAULTS.services,
          about: birlestir(DEFAULTS.about, g.about),
          approach: birlestir(DEFAULTS.approach, g.approach),
          articles:
            g.articles && g.articles.length > 0
              ? (g.articles as SiteContent["articles"])
              : DEFAULTS.articles,
          faq:
            g.faq && g.faq.length > 0
              ? (g.faq as SiteContent["faq"])
              : DEFAULTS.faq,
          contact: birlestir(DEFAULTS.contact, g.contact),
        };
      } else {
        base = {
          site: birlestir(DEFAULTS.site, raw.site),
          home: birlestir(DEFAULTS.home, raw.home),
          services: Array.isArray(raw.services) && raw.services.length > 0 ? raw.services : DEFAULTS.services,
          about: birlestir(DEFAULTS.about, raw.about),
          approach: birlestir(DEFAULTS.approach, raw.approach),
          articles: Array.isArray(raw.articles) && raw.articles.length > 0 ? raw.articles : DEFAULTS.articles,
          faq: Array.isArray(raw.faq) && raw.faq.length > 0 ? raw.faq : DEFAULTS.faq,
          contact: birlestir(DEFAULTS.contact, raw.contact),
        };
      }
    } catch (e) {
      console.error("[content] site.json okunamadi, varsayilanlar kullaniliyor:", e);
    }
  }

  const overridesPath = join(process.cwd(), "content", "content.json");
  if (existsSync(overridesPath)) {
    try {
      const raw = JSON.parse(readFileSync(overridesPath, "utf-8"));
      const parsed = siteContentInputSchema.safeParse(raw);

      if (parsed.success && Object.keys(parsed.data).length > 0) {
        const g = parsed.data;
        base = {
          site: birlestir(base.site, g.site),
          home: birlestir(base.home, g.home),
          services:
            g.services && g.services.length > 0
              ? (g.services as SiteContent["services"])
              : base.services,
          about: birlestir(base.about, g.about),
          approach: birlestir(base.approach, g.approach),
          articles:
            g.articles && g.articles.length > 0
              ? (g.articles as SiteContent["articles"])
              : base.articles,
          faq:
            g.faq && g.faq.length > 0
              ? (g.faq as SiteContent["faq"])
              : base.faq,
          contact: birlestir(base.contact, g.contact),
        };
      }
    } catch (e) {
      console.error("[content] content.json gecersiz, atlaniyor:", e);
    }
  }

  cached = base;
  return cached;
}
