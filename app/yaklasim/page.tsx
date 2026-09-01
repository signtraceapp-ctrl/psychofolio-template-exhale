import { getContent } from "@/lib/content";
import type { Metadata } from "next";
import { ApproachClient } from "./approach-client";

export const metadata: Metadata = { title: "Yaklaşım" };

export default function ApproachPage() {
  const c = getContent();
  return <ApproachClient content={c} />;
}
