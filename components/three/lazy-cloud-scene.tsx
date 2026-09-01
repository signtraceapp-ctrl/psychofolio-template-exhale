"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CloudScene = dynamic(
  () => import("./cloud-scene").then((mod) => mod.CloudScene),
  { ssr: false },
);

interface LazyCloudSceneProps {
  progressRef?: React.RefObject<number>;
  breathRef?: React.RefObject<number>;
}

export function LazyCloudScene({ progressRef, breathRef }: LazyCloudSceneProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  if (reducedMotion) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,#a7b1c2 0%,#ccd6e3 50%,#f2e3c8 100%)",
        }}
        aria-hidden="true"
      />
    );
  }

  return <CloudScene progressRef={progressRef} breathRef={breathRef} />;
}
