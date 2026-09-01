import type { Metadata } from "next";
import { Inter, Quicksand } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-sans",
});

const quicksand = Quicksand({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-display",
});

export function generateMetadata(): Metadata {
  return {
    title: { default: "Exhale - Nefes Alan Terapi", template: "%s | Exhale" },
    description: "Kaygi, tukenmislik ve stres yonetiminde farkindalik temelli yaklasimlarla sizi destekliyorum.",
    robots: { index: false, follow: false },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${quicksand.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
