import { getContent } from "@/lib/content";
import type { Metadata } from "next";
import { ServicesClient } from "./services-client";

export const metadata: Metadata = { title: "Hizmetler" };

export default function ServicesPage() {
  const c = getContent();
  return <ServicesClient content={c} />;
}
