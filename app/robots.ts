import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  const c = getContent();
  const seo = (c as Record<string, unknown>).seo as { siteUrl?: string } | undefined;
  const baseUrl = seo?.siteUrl || "";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    ...(baseUrl && { sitemap: `${baseUrl}/sitemap.xml` }),
  };
}
