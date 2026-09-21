"use client";

/**
 * EXHALE - Home: cloud ascent journey.
 * Scroll phases: mist -> release -> threshold (white flash) -> above the clouds.
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LazyCloudScene } from "@/components/three/lazy-cloud-scene";
import {
  ExhaleHeader,
  CloudDrift,
  BreathDot,
  BreathWave,
  BreathCursor,
  Sweep,
} from "@/components/exhale-header";
import type { SiteContent } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ascentPhases = [
  {
    eyebrow: "yerden yükseklik: 0 m",
    title: "omuzlarındaki yük",
    accent: "ne kadar eski?",
    text: "Kaygı, tükenmişlik, durmayan zihin... Hepsi aşağıda, sisin içinde daha ağır görünür.",
  },
  {
    eyebrow: "yükseliyorsunuz",
    title: "bırakmak",
    accent: "bir beceridir.",
    text: "Terapide taşımayı öğrenmeyiz, usulca bırakmayı öğreniriz. Her seans, biraz daha hafiflemektir.",
  },
  {
    eyebrow: "bulutların üzeri",
    title: "nefes al.",
    accent: "yukarısı hep buradaydı.",
    text: "Fırtına dinmeden de güneşi görmek mümkün. Kaygıyla ilişkinizi birlikte değiştirelim.",
    isFinal: true,
  },
];

const floatServices = [
  { t: "bireysel terapi", d: "Kaygı, panik ve stresle 50 dakikalık haftalık nefes alanı.", alt: "2.000 m" },
  { t: "tükenmişlik çalışması", d: "Sürekli 'açık' yaşamaktan sürdürülebilir bir ritme.", alt: "5.000 m" },
  { t: "mindfulness atölyeleri", d: "Altı haftalık küçük grup farkındalık programı.", alt: "8.000 m" },
];

/* Reveal hook */
function useExhaleReveal() {
  const scopeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 46,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    }, scope);
    return () => ctx.revert();
  }, []);
  return scopeRef;
}

export function HomeClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useExhaleReveal();
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [phase, setPhase] = useState(0);

  /* Breath engine: mic + space key -> breathRef (0..1) */
  const breathRef = useRef(0);
  const micLevelRef = useRef(0);
  const spaceRef = useRef(false);
  const haloRef = useRef<HTMLSpanElement>(null);
  const [micState, setMicState] = useState<"off" | "on" | "denied">("off");
  const audioRef = useRef<{ ctx: AudioContext; stream: MediaStream } | null>(null);

  const enableMic = useCallback(async () => {
    if (micState === "on") {
      audioRef.current?.stream.getTracks().forEach((t) => t.stop());
      audioRef.current?.ctx.close();
      audioRef.current = null;
      micLevelRef.current = 0;
      setMicState("off");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      src.connect(analyser);
      audioRef.current = { ctx, stream };
      setMicState("on");
      const data = new Uint8Array(analyser.fftSize);
      const tick = () => {
        if (!audioRef.current) return;
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        const force = Math.min(1, Math.max(0, (rms - 0.05) / 0.16));
        micLevelRef.current = micLevelRef.current * 0.75 + force * 0.25;
        requestAnimationFrame(tick);
      };
      tick();
    } catch {
      setMicState("denied");
    }
  }, [micState]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.code === "Space" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        spaceRef.current = true;
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") spaceRef.current = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const target = Math.max(micLevelRef.current, spaceRef.current ? 1 : 0);
      breathRef.current += (target - breathRef.current) * 0.12;
      if (haloRef.current) {
        haloRef.current.style.transform = `scale(${1 + breathRef.current * 0.9})`;
        haloRef.current.style.opacity = `${0.4 + breathRef.current * 0.6}`;
      }
    };
    loop();
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      cancelAnimationFrame(raf);
      audioRef.current?.stream.getTracks().forEach((t) => t.stop());
      audioRef.current?.ctx.close();
    };
  }, []);

  /* Burden release ritual */
  const [burden, setBurden] = useState("");
  const [flying, setFlying] = useState<string | null>(null);
  const [released, setReleased] = useState(0);
  const balloonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!flying || !balloonRef.current) return;
    const el = balloonRef.current;
    const tl = gsap.timeline({
      onComplete: () => {
        setFlying(null);
        setReleased((n) => n + 1);
      },
    });
    tl.fromTo(
      el,
      { y: 0, x: 0, rotation: 0, opacity: 1, scale: 1 },
      {
        keyframes: [
          { y: "-18vh", x: 30, rotation: 4, duration: 1.6 },
          { y: "-42vh", x: -24, rotation: -5, duration: 1.7 },
          { y: "-68vh", x: 20, rotation: 3, scale: 0.72, duration: 1.7 },
          { y: "-105vh", x: -12, rotation: -2, scale: 0.45, opacity: 0, duration: 2.0 },
        ],
        ease: "power1.inOut",
      },
    );
    return () => {
      tl.kill();
    };
  }, [flying]);

  const onUpdate = useCallback((self: ScrollTrigger) => {
    const p = self.progress;
    progressRef.current = p;
    setPhase(Math.min(2, Math.floor(p * 3)));
    if (flashRef.current) {
      const d = Math.abs(p - 0.67);
      flashRef.current.style.opacity = String(Math.max(0, 0.85 - d * 14));
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      pin,
      scrub: 0.8,
      onUpdate,
    });
    return () => trigger.kill();
  }, [onUpdate]);

  /* Container helper */
  const Container = ({ children }: { children: React.ReactNode }) => (
    <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">{children}</div>
  );

  return (
    <div
      ref={scopeRef}
      className="min-h-screen text-[#3a4252] selection:bg-[#d99a4e]/25 lg:[cursor:none] lg:[&_a]:[cursor:none] lg:[&_button]:[cursor:none]"
      style={{
        colorScheme: "light",
        background: "linear-gradient(180deg,#e9eef6 0%,#f4f0e9 40%,#f8f3ea 100%)",
      }}
    >
      <BreathCursor />
      <ExhaleHeader siteName={c.site.name} />

      {/* ASCENT -- pinned cloud-breakthrough journey */}
      <section ref={sectionRef} className="relative" style={{ height: "340vh" }} aria-label="Bulutların üzerine yükseliş">
        <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
          <LazyCloudScene progressRef={progressRef} breathRef={breathRef} />

          {/* Readability veil */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 55% 42% at 50% 48%, rgba(244,240,233,0.32), transparent 70%)" }}
            aria-hidden="true"
          />

          {/* Threshold flash */}
          <div ref={flashRef} className="pointer-events-none absolute inset-0 bg-white opacity-0" aria-hidden="true" />

          {/* Phase copy */}
          <div className="absolute inset-0 z-10 flex items-center">
            <Container>
              <div className="relative mx-auto h-64 max-w-2xl text-center">
                {ascentPhases.map((ph, i) => (
                  <div
                    key={i}
                    className="absolute inset-x-0 transition-[opacity,transform] duration-300 ease-out"
                    style={{
                      opacity: phase === i ? 1 : 0,
                      transform: phase === i ? "translateY(0)" : phase > i ? "translateY(-48px)" : "translateY(48px)",
                      pointerEvents: phase === i ? "auto" : "none",
                    }}
                  >
                    <p className="text-sm font-medium lowercase text-[#b97f35]/85">~ {ph.eyebrow} ~</p>
                    <h1 className="mt-5 text-4xl font-light lowercase leading-[1.16] tracking-tight text-[#3a4252] sm:text-5xl md:text-6xl">
                      {ph.title} <Sweep>{ph.accent}</Sweep>
                    </h1>
                    <p className="mx-auto mt-6 max-w-md text-[15px] font-light leading-[2] text-[#5b6478]">{ph.text}</p>
                    {ph.isFinal && (
                      <div className="mt-9 flex items-center justify-center gap-5">
                        <a
                          href="/hizmetler"
                          className="rounded-full px-10 py-4 text-sm font-semibold lowercase text-white shadow-[0_12px_30px_rgba(217,154,78,0.4)] transition-transform duration-300 hover:-translate-y-0.5"
                          style={{ background: "linear-gradient(120deg,#d99a4e,#c8883b)" }}
                        >
                          nefes randevusu al
                        </a>
                        <a
                          href="/hizmetler"
                          className="rounded-full bg-white/70 px-7 py-4 text-sm font-medium lowercase text-[#5b6478] shadow-[0_8px_20px_rgba(90,110,140,0.12)] transition-[transform,color] duration-300 hover:-translate-y-0.5 hover:text-[#3a4252]"
                        >
                          terası gez
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Container>
          </div>

          {/* Watermark */}
          <p className="absolute right-8 top-24 z-10 text-xs font-medium lowercase text-[#5b6478]/45">
            ~ {c.site.name.toLowerCase()}
          </p>

          {/* Breath badge */}
          <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
            <button
              onClick={enableMic}
              className="group relative mx-auto flex h-16 w-16 items-center justify-center"
              aria-label={micState === "on" ? "Mikrofonu kapat" : "Nefesinle etkileşimi başlat"}
            >
              <span
                ref={haloRef}
                className="absolute inset-0 rounded-full bg-[#d99a4e]/25 blur-[2px] transition-none"
                aria-hidden="true"
              />
              <span
                className={`absolute inset-0 rounded-full border transition-colors duration-500 ${
                  micState === "on" ? "border-[#b97f35]" : "border-[#b97f35]/40"
                }`}
                style={{ animation: "exhale-breath 14s ease-in-out infinite" }}
                aria-hidden="true"
              />
              <BreathDot size={9} />
            </button>
            <p className="mt-3 max-w-[240px] text-xs font-medium lowercase leading-relaxed text-[#5b6478]/75">
              {micState === "on"
                ? "dinliyorum, mikrofona doğru üfle, bulutlar aralansın"
                : micState === "denied"
                  ? "mikrofon yok, space tuşunu basılı tutup üfle"
                  : "tıkla: nefesinle bulutları arala (ya da space'e bas)"}
            </p>
            {micState === "on" && (
              <p className="mt-1 text-[10px] font-light lowercase text-[#5b6478]/50">
                ses kaydedilmez; yalnızca nefes şiddeti anlık işlenir
              </p>
            )}
          </div>
        </div>
      </section>

      {/* BURDEN RELEASE -- balloon ritual */}
      <section className="relative py-24">
        <Container>
          <div
            data-reveal
            className="relative mx-auto max-w-2xl overflow-visible rounded-[2.6rem] bg-white/70 p-10 text-center shadow-[0_24px_60px_rgba(90,110,140,0.14)] backdrop-blur md:p-14"
          >
            <CloudDrift density={3} opacity={0.5} />
            <div className="relative">
              <p className="text-sm font-medium lowercase text-[#b97f35]/85">~ küçük bir ritüel ~</p>
              <h2 className="mt-3 text-3xl font-light lowercase tracking-tight text-[#3a4252] md:text-4xl">
                yükünü <Sweep>buraya bırak.</Sweep>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[15px] font-light leading-[2] text-[#5b6478]">
                Bugün seni ağırlaştıran şeyi yaz. Bir balona bağlayıp gökyüzüne
                bırakalım. <strong className="font-semibold">Hiçbir yere gönderilmez, kaydedilmez.</strong>{" "}
                Söz uçar, sen hafiflersin.
              </p>

              <form
                className="mx-auto mt-8 flex max-w-md items-center gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!burden.trim() || flying) return;
                  setFlying(burden.trim());
                  setBurden("");
                }}
              >
                <input
                  value={burden}
                  onChange={(e) => setBurden(e.target.value)}
                  maxLength={80}
                  placeholder="bugün beni ağırlaştıran şey..."
                  className="w-full rounded-full border border-[#3a4252]/12 bg-white/85 px-6 py-4 text-sm font-light text-[#3a4252] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-[#5b6478]/45 focus:border-[#d99a4e]/60 focus:ring-2 focus:ring-[#d99a4e]/15"
                  style={{ cursor: "auto" }}
                />
                <button
                  type="submit"
                  disabled={!burden.trim() || !!flying}
                  className="shrink-0 rounded-full px-6 py-4 text-sm font-semibold lowercase text-white shadow-[0_10px_26px_rgba(217,154,78,0.4)] transition-[transform,opacity] duration-300 hover:-translate-y-0.5 disabled:opacity-40"
                  style={{ background: "linear-gradient(120deg,#d99a4e,#c8883b)" }}
                >
                  bırak
                </button>
              </form>

              {released > 0 && !flying && (
                <p className="mt-5 text-sm font-light lowercase text-[#5b6478]/75">
                  bu söz artık gökyüzünün. {released > 1 ? `(${released} yük bırakıldı)` : "istersen bir tane daha bırakabilirsin."}
                </p>
              )}
            </div>

            {/* Flying balloon */}
            {flying && (
              <div className="pointer-events-none absolute inset-x-0 bottom-16 z-20 flex justify-center">
                <div ref={balloonRef} className="flex flex-col items-center">
                  <svg width="54" height="70" viewBox="0 0 54 70" aria-hidden="true">
                    <defs>
                      <radialGradient id="xh-balloon" cx="35%" cy="30%" r="80%">
                        <stop offset="0%" stopColor="#f3c98a" />
                        <stop offset="100%" stopColor="#d99a4e" />
                      </radialGradient>
                    </defs>
                    <ellipse cx="27" cy="24" rx="20" ry="23" fill="url(#xh-balloon)" />
                    <path d="M27 47 l-4 6 h8 z" fill="#c8883b" />
                    <path d="M27 53 C 23 60, 31 63, 27 70" stroke="#b97f35" strokeWidth="1.2" fill="none" />
                  </svg>
                  <span className="mt-1 max-w-[220px] rounded-2xl bg-white/95 px-4 py-2 text-xs font-light lowercase text-[#5b6478] shadow-md">
                    {flying}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* SERVICES TEASER -- floating terrace cards */}
      <section id="hizmetler" className="relative py-28">
        <CloudDrift density={5} opacity={0.6} />
        <Container>
          <div className="relative mx-auto max-w-4xl">
            <div data-reveal className="text-center">
              <p className="text-sm font-medium lowercase text-[#b97f35]/85">~ teras kataloğu ~</p>
              <h2 className="mt-4 text-3xl font-light lowercase tracking-tight text-[#3a4252] md:text-4xl">
                üç irtifa, tek amaç: <Sweep>hafiflemek.</Sweep>
              </h2>
              <div className="mt-6">
                <BreathWave />
              </div>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {floatServices.map((s, i) => (
                <div
                  key={s.t}
                  data-reveal
                  className="group rounded-[2.2rem] bg-white/65 p-8 shadow-[0_16px_44px_rgba(90,110,140,0.10)] backdrop-blur transition-[transform,box-shadow] duration-300 hover:-translate-y-3 hover:shadow-[0_30px_64px_rgba(90,110,140,0.16)]"
                  style={{ marginTop: i === 1 ? "-14px" : i === 2 ? "10px" : "0" }}
                >
                  <p className="text-xs font-semibold lowercase text-[#b97f35]/80">~ {s.alt}</p>
                  <h3 className="mt-3 text-xl font-medium lowercase text-[#3a4252]">{s.t}</h3>
                  <p className="mt-3 text-[13px] font-light leading-[1.95] text-[#5b6478]">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* QUOTE */}
      <section className="py-24">
        <Container>
          <div data-reveal className="mx-auto max-w-2xl text-center">
            <BreathDot size={10} />
            <blockquote className="mt-8 text-2xl font-light lowercase leading-[1.8] text-[#3a4252] md:text-3xl">
              &ldquo;{c.home.quote}&rdquo;
            </blockquote>
            <p className="mt-8 text-sm font-medium lowercase text-[#b97f35]/80">~ {c.home.quoteAuthor} ~</p>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-28">
        <Container>
          <div
            data-reveal
            className="relative mx-auto max-w-3xl overflow-hidden rounded-[2.4rem] p-12 text-center shadow-[0_24px_60px_rgba(90,110,140,0.14)] md:p-16"
            style={{ background: "linear-gradient(140deg,#ffffff 0%,#f3ecdf 100%)" }}
          >
            <CloudDrift density={3} opacity={0.5} />
            <div className="relative">
              <p className="text-sm font-medium lowercase text-[#b97f35]/85">~ ilk adım ~</p>
              <h2 className="mt-4 text-3xl font-light lowercase tracking-tight text-[#3a4252] md:text-4xl">
                bugün tek yapmanız gereken,
                <br />
                <Sweep>bir nefes almak.</Sweep>
              </h2>
              <p className="mx-auto mt-5 max-w-md text-[15px] font-light leading-[2] text-[#5b6478]">
                İlk görüşme bir tanışmadır: ihtiyacınızı birlikte anlar, size
                uygun irtifayı birlikte seçeriz.
              </p>
              <a
                href="/iletisim"
                className="mt-9 inline-block rounded-full px-12 py-4 text-sm font-semibold lowercase text-white shadow-[0_12px_30px_rgba(217,154,78,0.4)] transition-transform duration-300 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(120deg,#d99a4e,#c8883b)" }}
              >
                nefes randevusu al
              </a>
            </div>
          </div>
        </Container>
      </section>

      <footer className="py-12 text-center">
        <BreathWave w={90} />
        <p className="mt-4 text-xs font-medium lowercase text-[#3a4252]/40">
          exhale - nefes alan terapi
        </p>
      </footer>
    </div>
  );
}
