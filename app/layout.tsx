import type { Metadata } from "next";
import { Inter, Quicksand } from "next/font/google";
import { getContent } from "@/lib/content";
import Link from "next/link";
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
  const c = getContent();
  return {
    title: { default: `${c.site.name} - ${c.site.title}`, template: `%s | ${c.site.name}` },
    description: c.home.description,
    robots: { index: false, follow: false },
  };
}

const navLinks = [
  { href: "/hakkimda", label: "Hakkımda" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/yaklasim", label: "Yaklaşım" },
  { href: "/yazilar", label: "Yazılar" },
  { href: "/sss", label: "SSS" },
  { href: "/iletisim", label: "İletişim" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const c = getContent();

  return (
    <html lang="tr" className={`${inter.variable} ${quicksand.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg text-fg antialiased">
        {/* Demo badge */}
        <div className="sticky top-0 z-[60] flex items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-center text-xs font-medium text-amber-900">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
          Örnek içerik - bu bir şablon önizlemesidir
        </div>

        {/* Header */}
        <header className="sticky top-8 z-50 border-b border-border/40 bg-bg/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="font-display text-xl font-semibold text-fg hover:text-primary transition-colors">
              {c.site.name}
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-fg-muted hover:text-primary transition-colors font-display"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border/40 bg-bg-secondary/50 py-10">
          <div className="mx-auto max-w-7xl px-4 text-center text-sm text-fg-muted sm:px-6 lg:px-8">
            <p className="font-display text-base font-semibold text-fg">{c.site.name}</p>
            <p className="mt-1">{c.site.title}</p>
            <p className="mt-2 text-xs">&copy; {new Date().getFullYear()} - {c.site.copyright}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
