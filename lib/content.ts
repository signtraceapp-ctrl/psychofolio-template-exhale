import { readFileSync } from "fs";
import { join } from "path";

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

let cached: SiteContent | null = null;

export function getContent(): SiteContent {
  if (cached) return cached;
  const filePath = join(process.cwd(), "content", "site.json");
  const raw = readFileSync(filePath, "utf-8");
  cached = JSON.parse(raw) as SiteContent;
  return cached;
}
