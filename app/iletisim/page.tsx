import { getContent } from "@/lib/content";
import type { Metadata } from "next";
import { ContactClient } from "./contact-client";

export const metadata: Metadata = { title: "İletişim" };

export default function ContactPage() {
  const c = getContent();
  return <ContactClient content={c} />;
}
