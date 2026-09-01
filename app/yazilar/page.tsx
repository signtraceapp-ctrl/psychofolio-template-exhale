import { getContent } from "@/lib/content";
import type { Metadata } from "next";
import { ArticlesClient } from "./articles-client";

export const metadata: Metadata = { title: "Yazilar" };

export default function ArticlesPage() {
  const c = getContent();
  return <ArticlesClient content={c} />;
}
