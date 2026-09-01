"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SUN = "#d99a4e";
const SUND = "#b97f35";

/* Breathing dot (4-4-6 rhythm) */
export function BreathDot({ size = 8 }: { size?: number }) {
  return (
    <span
      className="inline-block rounded-full bg-[#d99a4e]"
      style={{
        width: size,
        height: size,
        animation: "exhale-breath 14s ease-in-out infinite",
      }}
      aria-hidden="true"
    />
  );
}

/* Breath wave motif */
export function BreathWave({ w = 120 }: { w?: number }) {
  return (
    <svg
      width={w}
      height="14"
      viewBox="0 0 120 14"
      fill="none"
      className="mx-auto"
      aria-hidden="true"
    >
      <path
        d="M2 7 C 12 1, 22 1, 32 7 S 52 13, 62 7 S 82 1, 92 7 S 112 13, 118 7"
        stroke={SUND}
        strokeOpacity=".55"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Sunlight sweep accent */
export function Sweep({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="rounded-full px-[0.35em] pb-[0.05em] text-[#8a5f22]"
      style={{ background: "linear-gradient(120deg,#f3d9ae7a,#eec27f66)" }}
    >
      {children}
    </span>
  );
}

/* Drifting clouds backdrop */
export function CloudDrift({
  density = 7,
  opacity = 0.8,
}: {
  density?: number;
  opacity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const host = ref.current;
    if (!host) return;

    // Dynamically import gsap to avoid SSR issues
    let cleanup: (() => void) | undefined;
    import("gsap").then(({ gsap }) => {
      const clouds: HTMLSpanElement[] = [];
      for (let i = 0; i < density; i++) {
        const c = document.createElement("span");
        const w = 180 + ((i * 97) % 260);
        c.style.cssText = `position:absolute;border-radius:9999px;filter:blur(34px);opacity:${opacity * (0.5 + ((i * 37) % 50) / 100)};background:#ffffff;width:${w}px;height:${w * 0.38}px;left:${(i * 53) % 100}%;top:${(i * 41) % 90}%;`;
        host.appendChild(c);
        clouds.push(c);
        gsap.to(c, {
          x: 40 + ((i * 29) % 70),
          duration: 16 + ((i * 13) % 14),
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }
      cleanup = () => clouds.forEach((c) => c.remove());
    });
    return () => cleanup?.();
  }, [mounted, density, opacity]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}

/* Breath cursor (desktop only, canvas-based) */
export function BreathCursor() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const resize = () => {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; born: number; r: number; dx: number; dy: number };
    const trail: P[] = [];
    const burst: P[] = [];
    let mx = -100;
    let my = -100;
    let lastAdd = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const now = performance.now();
      if (now - lastAdd > 26) {
        trail.push({ x: mx, y: my, born: now, r: 3 + Math.random() * 3, dx: 0, dy: 0 });
        lastAdd = now;
        if (trail.length > 60) trail.shift();
      }
    };
    const onDown = () => {
      for (let i = 0; i < 9; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.6 + Math.random() * 1.4;
        burst.push({
          x: mx, y: my, born: performance.now(),
          r: 2 + Math.random() * 3,
          dx: Math.cos(a) * sp, dy: Math.sin(a) * sp - 0.4,
        });
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);

    let raf = 0;
    const puff = (x: number, y: number, r: number, a: number) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(255,255,255,${a})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      ctx.clearRect(0, 0, W, H);
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        const age = (now - p.born) / 1500;
        if (age >= 1) { trail.splice(i, 1); continue; }
        puff(p.x, p.y - age * 8, p.r + age * 26, (1 - age) * 0.16);
      }
      for (let i = burst.length - 1; i >= 0; i--) {
        const p = burst[i];
        const age = (now - p.born) / 900;
        if (age >= 1) { burst.splice(i, 1); continue; }
        p.x += p.dx; p.y += p.dy;
        puff(p.x, p.y, p.r + age * 14, (1 - age) * 0.3);
      }
      // 4-4-6 breath ring
      const t = (now / 1000) % 14;
      const s = t < 4 ? 1 + (t / 4) * 0.5 : t < 8 ? 1.5 : 1.5 - ((t - 8) / 6) * 0.5;
      ctx.strokeStyle = "rgba(185,127,53,0.85)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(mx, my, 11 * s, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#d99a4e";
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, Math.PI * 2);
      ctx.fill();
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[60] hidden lg:block"
      aria-hidden="true"
    />
  );
}

/* Navigation: left vertical dock (desktop) + mini top bar (mobile) */
const navLinks = [
  { label: "ana sayfa", path: "/" },
  { label: "hakkinda", path: "/hakkimda" },
  { label: "hizmetler", path: "/hizmetler" },
  { label: "yaklasim", path: "/yaklasim" },
  { label: "yazilar", path: "/yazilar" },
  { label: "sss", path: "/sss" },
] as const;

interface ExhaleHeaderProps {
  siteName?: string;
}

export function ExhaleHeader({ siteName = "exhale" }: ExhaleHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Desktop: left vertical dock */}
      <aside
        className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
        aria-label="Site menusu"
      >
        <div className="flex w-40 flex-col gap-1 rounded-[2rem] bg-white/80 p-4 shadow-[0_24px_60px_rgba(90,110,140,0.20)] backdrop-blur-xl">
          {/* Wordmark */}
          <Link
            href="/"
            className="mb-2 flex items-baseline justify-center gap-1.5 pb-3"
            style={{ borderBottom: "1px dashed #b97f3540" }}
          >
            <span className="text-lg font-semibold lowercase tracking-tight text-[#3a4252]">
              {siteName}
            </span>
            <BreathDot size={8} />
          </Link>

          {navLinks.map((l) => (
            <Link
              key={l.path}
              href={l.path}
              className={`flex items-center gap-2.5 rounded-full px-3.5 py-2.5 text-[13px] font-medium lowercase transition-[background-color,color,transform,box-shadow] duration-300 ${
                isActive(l.path)
                  ? "bg-[#3a4252] text-white shadow-[0_8px_20px_rgba(58,66,82,0.28)]"
                  : "text-[#5b6478] hover:translate-x-1 hover:bg-[#eef2f8] hover:text-[#3a4252]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  isActive(l.path) ? "bg-[#d99a4e]" : "bg-[#b97f35]/35"
                }`}
                aria-hidden="true"
              />
              {l.label}
            </Link>
          ))}

          <Link
            href="/iletisim"
            className="mt-3 rounded-full px-4 py-3 text-center text-[13px] font-semibold lowercase text-white shadow-[0_12px_28px_rgba(217,154,78,0.4)] transition-transform duration-300 hover:-translate-y-0.5"
            style={{ background: `linear-gradient(120deg,${SUN},#c8883b)` }}
          >
            randevu
          </Link>
        </div>
      </aside>

      {/* Mobile: mini top bar */}
      <header
        className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between bg-[#eef2f8]/85 px-5 backdrop-blur-md lg:hidden"
      >
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="text-lg font-semibold lowercase text-[#3a4252]">{siteName}</span>
          <BreathDot size={8} />
        </Link>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Menuyu kapat" : "Menuyu ac"}
          aria-expanded={menuOpen}
        >
          <span className="relative block h-3 w-4" aria-hidden="true">
            <span className={`absolute left-0 top-0 h-[1.5px] w-full rounded bg-[#3a4252] transition-[top,transform] duration-300 ${menuOpen ? "top-1/2 rotate-45" : ""}`} />
            <span className={`absolute bottom-0 left-0 h-[1.5px] w-full rounded bg-[#3a4252] transition-[bottom,transform] duration-300 ${menuOpen ? "bottom-1/2 -rotate-45" : ""}`} />
          </span>
        </button>
      </header>

      {/* Mobile fullscreen menu */}
      <div
        className={`fixed inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-[#eef2f8]/97 backdrop-blur-xl transition-opacity duration-300 lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        {[...navLinks, { label: "randevu", path: "/iletisim" }].map((l, i) => (
          <Link
            key={l.path}
            href={l.path}
            onClick={() => setMenuOpen(false)}
            className={`rounded-full px-7 py-3 text-lg font-medium lowercase shadow-[0_10px_28px_rgba(90,110,140,0.14)] transition-[background-color,color,transform,opacity] duration-300 ${
              isActive(l.path) ? "bg-[#3a4252] text-white" : "bg-white/85 text-[#3a4252]"
            } ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
            style={{ transitionDelay: menuOpen ? `${80 + i * 50}ms` : "0ms" }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
}
