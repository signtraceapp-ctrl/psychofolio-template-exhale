import { getContent } from "@/lib/content";
import { HomeClient } from "./home-client";

export default function HomePage() {
  const c = getContent();
  return <HomeClient content={c} />;
}
