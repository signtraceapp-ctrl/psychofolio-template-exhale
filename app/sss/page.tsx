import { getContent } from "@/lib/content";
import type { Metadata } from "next";
import { FaqClient } from "./faq-client";

export const metadata: Metadata = { title: "SSS" };

export default function FaqPage() {
  const c = getContent();
  return <FaqClient content={c} />;
}
