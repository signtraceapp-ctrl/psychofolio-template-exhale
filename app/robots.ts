import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  const c = getContent();
  const baseUrl = c.seo?.siteUrl || "";

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
