import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const c = getContent();
  const seo = (c as Record<string, unknown>).seo as { siteUrl?: string } | undefined;
  const baseUrl = seo?.siteUrl || "";
  if (!baseUrl) return [];

  const now = new Date().toISOString();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/hakkimda`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/hizmetler`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/yaklasim`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/yazilar`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/sss`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/iletisim`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
