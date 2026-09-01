import { getContent } from "@/lib/content";
import type { Metadata } from "next";
import { AboutClient } from "./about-client";

export const metadata: Metadata = { title: "Hakkımda" };

export default function AboutPage() {
  const c = getContent();
  return <AboutClient content={c} />;
}
