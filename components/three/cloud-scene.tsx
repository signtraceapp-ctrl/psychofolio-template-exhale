"use client";

/**
 * EXHALE - 3D cloud ascent scene (cumulus billboard clusters).
 * Camera climbs through a cloud column: mist -> gap -> golden cloud sea.
 * Adapted from the platform's cloud-scene for standalone use.
 */

import { useMemo, useRef, Suspense, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, useTexture } from "@react-three/drei";
import * as THREE from "three";

type ProgressRef = RefObject<number>;

const PUFF_URLS = [
  "/textures/cloud-puff-0.png",
  "/textures/cloud-puff-1.png",
  "/textures/cloud-puff-2.png",
];
const COL_H = 60;
const SEA_Y = COL_H * 0.45 - 4;

function makeRand(seedInit: number) {
  let seed = seedInit;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const ATMOS = [
  { bg: "#9aa7bb", near: 8, far: 46, exp: 1.0 },
  { bg: "#aec4de", near: 10, far: 74, exp: 1.06 },
  { bg: "#f0d6a6", near: 14, far: 130, exp: 1.12 },
];

function lerpAtmos(p: number, key: "near" | "far" | "exp") {
  const t = THREE.MathUtils.clamp(p, 0, 1) * (ATMOS.length - 1);
  const i = Math.min(Math.floor(t), ATMOS.length - 2);
  return THREE.MathUtils.lerp(ATMOS[i][key], ATMOS[i + 1][key], t - i);
}

type Puff = {
  tex: number;
  base: [number, number, number];
  s: number;
  o: number;
  rot: number;
  phase: number;
  amp: number;
  speed: number;
};

function CloudField({ breathRef }: { breathRef?: ProgressRef }) {
  const textures = useTexture(PUFF_URLS);
  const groupRef = useRef<THREE.Group>(null);

  const puffs = useMemo(() => {
    const rand = makeRand(5);
    const list: Puff[] = [];

    const addCloud = (
      x: number,
      y: number,
      z: number,
      size: number,
      opacity = 1,
    ) => {
      const n = 3 + Math.floor(rand() * 3);
      for (let k = 0; k < n; k++) {
        list.push({
          tex: Math.floor(rand() * PUFF_URLS.length),
          base: [
            x + (rand() - 0.5) * size * 1.1,
            y + (rand() - 0.5) * size * 0.34,
            z + (rand() - 0.5) * size * 0.5,
          ],
          s: size * (0.45 + rand() * 0.75),
          o: opacity * (0.78 + rand() * 0.22),
          rot: (rand() - 0.5) * 0.3,
          phase: rand() * Math.PI * 2,
          amp: 0.2 + rand() * 0.5,
          speed: 0.05 + rand() * 0.08,
        });
      }
    };

    // Hero fly-bys
    (
      [
        [-28, 1],
        [-16, -1],
        [-5, 1],
        [6, -1],
        [14, 1],
      ] as const
    ).forEach(([y, side]) => {
      addCloud(side * (7 + rand() * 2), y, -4.5 - rand() * 3, 4.5 + rand() * 2.5);
    });
    // Mid clouds
    for (let i = 0; i < 18; i++) {
      const a = rand() * Math.PI * 2;
      const rad = 9 + rand() * 16;
      addCloud(
        Math.cos(a) * rad,
        rand() * COL_H - COL_H * 0.55,
        Math.sin(a) * rad,
        2 + rand() * 10,
        0.95,
      );
    }
    // Far tiny wisps
    for (let i = 0; i < 10; i++) {
      const a = rand() * Math.PI * 2;
      const rad = 20 + rand() * 18;
      addCloud(
        Math.cos(a) * rad,
        rand() * COL_H - COL_H * 0.55,
        Math.sin(a) * rad,
        1.5 + rand() * 2.5,
        0.8,
      );
    }
    // Cloud sea near the top
    for (let i = 0; i < 22; i++) {
      const a = rand() * Math.PI * 2;
      const rad = 2 + rand() * 30;
      addCloud(
        Math.cos(a) * rad,
        SEA_Y - 1 - rand() * 2,
        Math.sin(a) * rad,
        10 + rand() * 8,
      );
    }
    return list;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = groupRef.current;
    if (!g) return;
    g.rotation.y = Math.sin(t * 0.015) * 0.04;
    const cam = state.camera;
    const breath = THREE.MathUtils.clamp(breathRef?.current ?? 0, 0, 1);
    const part = 1 + breath * 0.32;
    g.children.forEach((child, i) => {
      const pf = puffs[i];
      if (!pf) return;
      const dy = pf.base[1] - cam.position.y;
      if (Math.abs(dy) > 46) {
        child.visible = false;
        return;
      }
      child.visible = true;
      child.position.x =
        pf.base[0] * part + Math.sin(t * pf.speed + pf.phase) * pf.amp;
      child.position.z = pf.base[2] * part;
      child.position.y =
        pf.base[1] + Math.sin(t * pf.speed * 0.7 + pf.phase * 1.3) * pf.amp * 0.3;
      const d = child.position.distanceTo(cam.position);
      const fade = THREE.MathUtils.smoothstep(d, 2, 8);
      const sprite = child as THREE.Sprite;
      sprite.material.opacity = pf.o * fade * (1 - breath * 0.3);
    });
  });

  return (
    <group ref={groupRef}>
      {puffs.map((pf, i) => (
        <sprite key={i} position={pf.base} scale={[pf.s, pf.s * 0.6, 1]}>
          <spriteMaterial
            map={textures[pf.tex]}
            transparent
            opacity={pf.o}
            rotation={pf.rot}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
}

useTexture.preload(PUFF_URLS);

function Atmosphere({
  progressRef,
  breathRef,
}: {
  progressRef: ProgressRef;
  breathRef?: ProgressRef;
}) {
  const { scene, gl } = useThree();
  const bgColor = useRef(new THREE.Color(ATMOS[0].bg));
  const target = useRef(new THREE.Color());
  const cA = useRef(new THREE.Color());
  const cB = useRef(new THREE.Color());

  useFrame(() => {
    const p = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);
    const t = p * (ATMOS.length - 1);
    const i = Math.min(Math.floor(t), ATMOS.length - 2);
    cA.current.set(ATMOS[i].bg);
    cB.current.set(ATMOS[i + 1].bg);
    target.current.lerpColors(cA.current, cB.current, t - i);
    bgColor.current.lerp(target.current, 0.06);

    scene.background = bgColor.current;
    if (!scene.fog) scene.fog = new THREE.Fog(bgColor.current.clone(), 8, 46);
    const fog = scene.fog as THREE.Fog;
    fog.color.copy(bgColor.current);
    const breath = THREE.MathUtils.clamp(breathRef?.current ?? 0, 0, 1);
    fog.near = lerpAtmos(p, "near") * (1 + breath * 0.4);
    fog.far = lerpAtmos(p, "far") * (1 + breath * 0.55);
    gl.toneMappingExposure = lerpAtmos(p, "exp") + breath * 0.08;
  });

  return null;
}

function AscentCamera({ progressRef }: { progressRef: ProgressRef }) {
  const { camera, pointer } = useThree();
  const smooth = useRef(0);

  useFrame(() => {
    smooth.current = THREE.MathUtils.lerp(
      smooth.current,
      THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1),
      0.06,
    );
    const p = smooth.current;
    const y = -COL_H * 0.55 + p * (COL_H * 0.55 + SEA_Y + 3.5);
    camera.position.set(
      Math.sin(p * 1.1) * 1.5 + pointer.x * 0.6,
      y + pointer.y * 0.4,
      0.001,
    );
    const lookY = p < 0.75 ? y + 7 : y + 7 - (p - 0.75) * 38;
    camera.lookAt(pointer.x * 2, lookY, -11);
  });

  return null;
}

interface CloudSceneProps {
  progressRef?: ProgressRef;
  breathRef?: ProgressRef;
}

export function CloudScene({ progressRef, breathRef }: CloudSceneProps) {
  const fallbackRef = useRef(0);
  const pRef = progressRef ?? fallbackRef;

  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{ position: [0, -COL_H * 0.55, 0.001], fov: 52 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      onCreated={() => {
        if (!progressRef) {
          const handleScroll = () => {
            const total =
              document.documentElement.scrollHeight - window.innerHeight;
            if (total <= 0) return;
            fallbackRef.current = Math.min(window.scrollY / total, 1);
          };
          handleScroll();
          window.addEventListener("scroll", handleScroll, { passive: true });
        }
      }}
    >
      <Atmosphere progressRef={pRef} breathRef={breathRef} />
      <Suspense fallback={null}>
        <CloudField breathRef={breathRef} />
      </Suspense>
      <AscentCamera progressRef={pRef} />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
}
