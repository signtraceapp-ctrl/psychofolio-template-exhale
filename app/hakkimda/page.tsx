import { getContent } from "@/lib/content";
import type { Metadata } from "next";
import { AboutClient } from "./about-client";

export const metadata: Metadata = { title: "Hakkimda" };

export default function AboutPage() {
  const c = getContent();
  return <AboutClient content={c} />;
}
