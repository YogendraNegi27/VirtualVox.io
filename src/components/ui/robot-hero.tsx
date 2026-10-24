"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Play, AudioLines } from "lucide-react";

class HeartCurve extends THREE.Curve<THREE.Vector3> {
  constructor() {
    super();
  }
  getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    t = t * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    return optionalTarget.set(x * 0.002, (y + 6) * 0.002, 0);
  }
}

const sharedHeartCurve = new HeartCurve();

function ResponsiveGroup({
  children,
  scale = 1,
  posY,
}: {
  children: React.ReactNode;
  scale?: number;
  posY?: number;
}) {
  const { viewport } = useThree();
  const isMobile = viewport.width < 2.8;
  const isTablet = viewport.width >= 2.8 && viewport.width < 4.0;
  const s = Math.min(1.15, viewport.width / (isMobile ? 2.75 : 3.3)) * scale;
  // Positioned so there is a clean, graceful ~20px-35px gap below the badges without touching
  const defaultPosY = isMobile ? -0.16 : isTablet ? -0.19 : -0.22;
  const finalPosY = posY !== undefined ? posY : defaultPosY;
  return <group position={[0, finalPosY, 0]} scale={s}>{children}</group>;
}

function GlassCapsule({
  color,
  power,
  intensity,
}: {
  color: string;
  power: number;
  intensity: number;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      color: { value: new THREE.Color("#ffffff") },
      power: { value: 2.5 },
      intensity: { value: 0.6 },
    }),
    [],
  );

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.color.value.set(color);
      materialRef.current.uniforms.power.value = power;
      materialRef.current.uniforms.intensity.value = intensity;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[0.3, 64, 64, 0, Math.PI * 2, 0, Math.PI]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          uniform float power;
          uniform float intensity;
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
            fresnel = pow(fresnel, power);
            gl_FragColor = vec4(color, fresnel * intensity);
          }
        `}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

const earBaseMat = new THREE.MeshStandardMaterial({
  color: "#f0f0f0",
  roughness: 0.5,
});
const earRingMat = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  roughness: 0.3,
});
const earCenterMat = new THREE.MeshStandardMaterial({
  color: "#cccccc",
  roughness: 0.8,
});
const antennaBaseMat = new THREE.MeshStandardMaterial({
  color: "#999999",
  roughness: 0.4,
  metalness: 0.5,
});
const antennaStickMat = new THREE.MeshStandardMaterial({
  color: "#d0d0d0",
  roughness: 0.4,
  metalness: 0.2,
});
const antennaTipMat = new THREE.MeshStandardMaterial({
  color: "#ff3366",
  roughness: 0.2,
  toneMapped: false,
});

function RobotEar({
  position,
  scale = 1,
  isLeft = false,
}: {
  position: [number, number, number];
  scale?: number;
  isLeft?: boolean;
}) {
  const dir = isLeft ? -1 : 1;

  return (
    <group position={position} scale={scale}>
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
        material={earBaseMat}
      >
        <cylinderGeometry args={[0.04, 0.04, 0.025, 32]} />
      </mesh>

      <mesh
        position={[dir * 0.012, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
        material={earRingMat}
      >
        <torusGeometry args={[0.032, 0.008, 16, 32]} />
      </mesh>

      <mesh
        position={[dir * 0.012, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
        material={earCenterMat}
      >
        <cylinderGeometry args={[0.03, 0.03, 0.005, 32]} />
      </mesh>

      <group position={[dir * 0.015, 0.035, 0]} rotation={[-0.4, 0, 0]}>
        <mesh
          position={[0, 0.01, 0]}
          castShadow
          receiveShadow
          material={antennaBaseMat}
        >
          <cylinderGeometry args={[0.006, 0.008, 0.02, 16]} />
        </mesh>
        <mesh
          position={[0, 0.06, 0]}
          castShadow
          receiveShadow
          material={antennaStickMat}
        >
          <cylinderGeometry args={[0.003, 0.003, 0.1, 8]} />
        </mesh>
        <mesh
          position={[0, 0.11, 0]}
          castShadow
          receiveShadow
          material={antennaTipMat}
        >
          <sphereGeometry args={[0.006, 16, 16]} />
        </mesh>
      </group>
    </group>
  );
}

const eyeMat = new THREE.MeshBasicMaterial({
  color: new THREE.Color(2, 2, 2),
  toneMapped: false,
  transparent: true,
});
const heartMat = new THREE.MeshBasicMaterial({
  color: "#ff3366",
  toneMapped: false,
});

function RobotEye({
  position,
  rotation,
  scale = 1,
  blinkDuration = 0.15,
  blinkCycle = 3.0,
  isLovedRef,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  blinkDuration?: number;
  blinkCycle?: number;
  isLovedRef: React.MutableRefObject<boolean>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const normalEyesRef = useRef<THREE.Group>(null);
  const heartEyeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !normalEyesRef.current || !heartEyeRef.current)
      return;

    const isHeart = isLovedRef.current;

    normalEyesRef.current.visible = !isHeart;
    heartEyeRef.current.visible = isHeart;

    const cycle = clock.getElapsedTime() % blinkCycle;

    let targetScaleY = 1;

    if (cycle < blinkDuration && !isHeart) {
      const progress = cycle / blinkDuration;
      const blinkClose = Math.sin(progress * Math.PI);

      targetScaleY = Math.max(0.05, 1.0 - blinkClose);
    }

    groupRef.current.scale.set(scale, scale * targetScaleY, scale);
  });

  const { topPath, bottomPath } = useMemo(() => {
    const w = 0.025;
    const h = 0.035;
    const r = 0.02;
    const g = 0.005;

    const tPath = new THREE.CurvePath<THREE.Vector3>();
    tPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(-w, g, 0),
        new THREE.Vector3(-w, h - r, 0),
      ),
    );
    tPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-w, h - r, 0),
        new THREE.Vector3(-w, h, 0),
        new THREE.Vector3(-w + r, h, 0),
      ),
    );
    tPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(-w + r, h, 0),
        new THREE.Vector3(w - r, h, 0),
      ),
    );
    tPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(w - r, h, 0),
        new THREE.Vector3(w, h, 0),
        new THREE.Vector3(w, h - r, 0),
      ),
    );
    tPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(w, h - r, 0),
        new THREE.Vector3(w, g, 0),
      ),
    );

    const bPath = new THREE.CurvePath<THREE.Vector3>();
    bPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(-w, -g, 0),
        new THREE.Vector3(-w, -(h - r), 0),
      ),
    );
    bPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-w, -(h - r), 0),
        new THREE.Vector3(-w, -h, 0),
        new THREE.Vector3(-w + r, -h, 0),
      ),
    );
    bPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(-w + r, -h, 0),
        new THREE.Vector3(w - r, -h, 0),
      ),
    );
    bPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(w - r, -h, 0),
        new THREE.Vector3(w, -h, 0),
        new THREE.Vector3(w, -(h - r), 0),
      ),
    );
    bPath.add(
      new THREE.LineCurve3(
        new THREE.Vector3(w, -(h - r), 0),
        new THREE.Vector3(w, -g, 0),
      ),
    );

    return { topPath: tPath, bottomPath: bPath };
  }, []);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <mesh ref={heartEyeRef} visible={false} material={heartMat}>
        <tubeGeometry args={[sharedHeartCurve, 64, 0.0035, 8, true]} />
      </mesh>

      <group ref={normalEyesRef}>
        <mesh material={eyeMat}>
          <tubeGeometry args={[topPath, 20, 0.0035, 8, false]} />
        </mesh>
        <mesh material={eyeMat}>
          <tubeGeometry args={[bottomPath, 20, 0.0035, 8, false]} />
        </mesh>
      </group>
    </group>
  );
}

function generatePbrTexturesAsync(): Promise<{
  colorMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const size = 512;
      const canvasC = document.createElement("canvas");
      const canvasB = document.createElement("canvas");
      canvasC.width = canvasB.width = size;
      canvasC.height = canvasB.height = size;
      const ctxC = canvasC.getContext("2d");
      const ctxB = canvasB.getContext("2d");

      if (ctxC && ctxB) {
        ctxC.fillStyle = "#dcdcdc";
        ctxC.fillRect(0, 0, size, size);
        ctxB.fillStyle = "#808080";
        ctxB.fillRect(0, 0, size, size);

        for (let i = 0; i < 10000; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const r = 0.5 + Math.random() * 1.5;
          const isDark = Math.random() > 0.15;

          ctxC.beginPath();
          ctxC.arc(x, y, r, 0, Math.PI * 2);
          ctxC.fillStyle = isDark ? "#222222" : "#dddddd";
          ctxC.fill();

          ctxB.beginPath();
          ctxB.arc(x, y, r, 0, Math.PI * 2);
          ctxB.fillStyle = isDark ? "#000000" : "#ffffff";
          ctxB.fill();
        }
      }

      const texC = new THREE.CanvasTexture(canvasC);
      const texB = new THREE.CanvasTexture(canvasB);
      texC.wrapS = texB.wrapS = THREE.RepeatWrapping;
      texC.wrapT = texB.wrapT = THREE.RepeatWrapping;

      texC.repeat.set(6, 3);
      texB.repeat.set(6, 3);
      texC.needsUpdate = true;
      texB.needsUpdate = true;

      resolve({ colorMap: texC, bumpMap: texB });
    }, 0);
  });
}

function RobotPrototype({
  neckParams = {
    baseR: 0.25,
    baseH: -0.01,
    midR: 0.23,
    midH: 0.02,
    lipBottomR: 0.27,
    lipBottomH: 0.025,
    lipTopR: 0.28,
    lipTopH: 0.05,
    innerR: 0.24,
    innerDropH: 0.03,
  },
  bodyParams = { bodyBevelR: 0.21, bodyBevelY: 0.38, bodyBevelT: 0.015 },
  color = "#c4c4c4",
  pantallaColor = "#00ffc6",
  pantallaBrillo = 1.2,
  blinkCycle = 3.0,
  metalness = 0.0,
}: {
  neckParams?: Record<string, number>;
  bodyParams?: Record<string, number>;
  color?: string;
  pantallaColor?: string;
  pantallaBrillo?: number;
  blinkCycle?: number;
  metalness?: number;
}) {
  const isLovedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  const [textures, setTextures] = useState<{
    colorMap: THREE.CanvasTexture | null;
    bumpMap: THREE.CanvasTexture | null;
  }>({ colorMap: null, bumpMap: null });

  const design = {
    pantallaColor: pantallaColor,
    pantallaGrosor: 3.8,
    pantallaBrillo: pantallaBrillo,
    separacionOjos: 0.07,
    tamañoOrejas: 1.3,
    escalaOjos: 1.1,
    parpadeoFrecuencia: blinkCycle,
    parpadeoDuracion: 0.45,
    colorChasis: color,
    alturaCabeza: 0.6,
  };

  const config = {
    moveSpeed: 0.35,
    bodyRotSpeed: 10.0,
    headRotSpeed: 20.0,
    bodyTiltX: 0.0,
    bodyTiltY: 0.95,
    headLookX: 0.3,
    headLookY: 1.8,
  };

  useFrame((state, delta) => {
    if (!bodyRef.current || !headRef.current) return;

    const dt = Math.min(delta, 0.1);

    const tx = state.pointer.x;
    const ty = state.pointer.y;

    const maxMoveX = state.viewport.width / 3.5;
    const targetPosX = tx * maxMoveX;
    bodyRef.current.position.x = THREE.MathUtils.lerp(
      bodyRef.current.position.x,
      targetPosX,
      config.moveSpeed * dt,
    );

    const relativeX = tx - bodyRef.current.position.x / 2.5;

    const bodyTargetRotY = -relativeX * config.bodyTiltY;
    const bodyTargetRotX = relativeX * relativeX * config.bodyTiltX - ty * 0.25;
    const bodyTargetRotZ = -relativeX * 0.15;

    bodyRef.current.rotation.y = THREE.MathUtils.lerp(
      bodyRef.current.rotation.y,
      bodyTargetRotY,
      config.bodyRotSpeed * dt,
    );
    bodyRef.current.rotation.x = THREE.MathUtils.lerp(
      bodyRef.current.rotation.x,
      bodyTargetRotX,
      config.bodyRotSpeed * dt,
    );
    bodyRef.current.rotation.z = THREE.MathUtils.lerp(
      bodyRef.current.rotation.z,
      bodyTargetRotZ,
      config.bodyRotSpeed * dt,
    );

    const headTargetRotY = relativeX * config.headLookY;
    const headTargetRotX = -ty * config.headLookX;

    headRef.current.rotation.y = THREE.MathUtils.lerp(
      headRef.current.rotation.y,
      headTargetRotY,
      config.headRotSpeed * dt,
    );
    headRef.current.rotation.x = THREE.MathUtils.lerp(
      headRef.current.rotation.x,
      headTargetRotX,
      config.headRotSpeed * dt,
    );
  });

  useEffect(() => {
    let mounted = true;
    let generatedMaps: {
      colorMap: THREE.CanvasTexture;
      bumpMap: THREE.CanvasTexture;
    } | null = null;

    generatePbrTexturesAsync().then((res) => {
      if (mounted) {
        generatedMaps = res;
        setTextures(res);
      } else {
        res.colorMap.dispose();
        res.bumpMap.dispose();
      }
    });

    return () => {
      mounted = false;

      if (generatedMaps) {
        generatedMaps.colorMap.dispose();
        generatedMaps.bumpMap.dispose();
      }
    };
  }, []);

  const handlePointerDown = (
    e: import("@react-three/fiber").ThreeEvent<PointerEvent>,
  ) => {
    e.stopPropagation();
    isLovedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isLovedRef.current = false;
    }, 2000);
  };

  const neckProfile = useMemo(() => {
    const points = [];

    points.push(new THREE.Vector2(neckParams.innerR, neckParams.baseH));
    points.push(new THREE.Vector2(neckParams.baseR, neckParams.baseH));
    points.push(new THREE.Vector2(neckParams.midR, neckParams.midH));
    points.push(new THREE.Vector2(neckParams.lipBottomR, neckParams.lipBottomH));
    points.push(new THREE.Vector2(neckParams.lipTopR, neckParams.lipTopH));
    points.push(new THREE.Vector2(neckParams.innerR, neckParams.lipTopH));
    points.push(
      new THREE.Vector2(
        neckParams.innerR,
        neckParams.lipTopH - neckParams.innerDropH,
      ),
    );
    return points;
  }, [neckParams]);

  const headMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#111111",
      roughness: 1.0,
      metalness: 0.0,
    });
  }, []);

  if (!textures.colorMap) return null;

  return (
    <group
      ref={bodyRef}
      position={[0, -0.65, 0]}
      onPointerDown={handlePointerDown}
      onPointerOver={() => {
        if (typeof document !== "undefined") document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        if (typeof document !== "undefined") document.body.style.cursor = "auto";
      }}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry
          args={[0.43, 64, 64, 0, Math.PI * 2, Math.PI * 0.15, Math.PI * 0.85]}
        />
        <meshStandardMaterial
          color={design.colorChasis}
          map={textures.colorMap || undefined}
          bumpMap={textures.bumpMap || undefined}
          bumpScale={0.005}
          roughness={1.0}
          metalness={metalness}
          envMapIntensity={0.0}
        />
      </mesh>

      {bodyParams.bodyBevelT > 0 && (
        <mesh
          position={[0, bodyParams.bodyBevelY, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
          receiveShadow
        >
          <torusGeometry
            args={[bodyParams.bodyBevelR, bodyParams.bodyBevelT, 32, 64]}
          />
          <meshStandardMaterial
            color={design.colorChasis}
            map={textures.colorMap || undefined}
            bumpMap={textures.bumpMap || undefined}
            bumpScale={0.005}
            roughness={1.0}
            metalness={metalness}
            envMapIntensity={0.0}
          />
        </mesh>
      )}

      <mesh position={[0, 0.38, 0]} receiveShadow castShadow>
        <latheGeometry args={[neckProfile, 64]} />
        <meshStandardMaterial
          color={design.colorChasis}
          map={textures.colorMap || undefined}
          bumpMap={textures.bumpMap || undefined}
          bumpScale={0.005}
          roughness={1.0}
          metalness={metalness}
          envMapIntensity={0.0}
        />
      </mesh>

      <group ref={headRef} position={[0, design.alturaCabeza, 0]}>
        <mesh material={headMat} castShadow receiveShadow>
          <sphereGeometry args={[0.28, 64, 64, 0, Math.PI * 2, 0, Math.PI]} />
        </mesh>

        <GlassCapsule
          color={design.pantallaColor}
          power={design.pantallaGrosor}
          intensity={design.pantallaBrillo}
        />

        <group position={[0, -0.02, 0.29]}>
          <RobotEye
            position={[-design.separacionOjos, 0, 0]}
            rotation={[0, -0.2, 0]}
            scale={design.escalaOjos}
            blinkDuration={design.parpadeoDuracion}
            blinkCycle={design.parpadeoFrecuencia}
            isLovedRef={isLovedRef}
          />
          <RobotEye
            position={[design.separacionOjos, 0, 0]}
            rotation={[0, 0.2, 0]}
            scale={design.escalaOjos}
            blinkDuration={design.parpadeoDuracion}
            blinkCycle={design.parpadeoFrecuencia}
            isLovedRef={isLovedRef}
          />
        </group>

        <RobotEar
          position={[-0.29, 0, 0]}
          isLeft={true}
          scale={design.tamañoOrejas}
        />
        <RobotEar
          position={[0.29, 0, 0]}
          isLeft={false}
          scale={design.tamañoOrejas}
        />
      </group>
    </group>
  );
}

export interface NavItem {
  label: string;
  href: string;
  target?: string;
}

export interface RobotHeroProps {
  backgroundText?: string;
  navItemsLeft?: NavItem[];
  contactText?: string;
  contactHref?: string;
  contactTarget?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  color?: string;
  scale?: number;
  robotPosY?: number;
  pantallaColor?: string;
  pantallaBrillo?: number;
  blinkCycle?: number;
  metalness?: number;
  showNav?: boolean;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  badges?: string[];
  fondoArriba?: string;
  fondoMedio?: string;
  fondoAbajo?: string;
  className?: string;
}

function AntennaNavbar({
  leftItems,
  contactText,
  contactHref,
  contactTarget,
  ctaText,
  onCtaClick,
}: {
  leftItems: NavItem[];
  contactText: string;
  contactHref: string;
  contactTarget?: string;
  ctaText: string;
  onCtaClick?: () => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { scrollY } = useScroll();
  const lineOpacity = useTransform(scrollY, [0, 50], [1, 0]);

  return (
    <nav className="sticky top-0 z-50 w-full pt-4 px-6 sm:px-8 pointer-events-none">
      <div className="w-full max-w-[1240px] mx-auto flex flex-col relative pointer-events-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between relative gap-4 lg:gap-0">
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 sm:gap-3 z-20">
            {leftItems.map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                target={item.target}
                rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative px-5 sm:px-6 py-2 rounded-full bg-white/90 backdrop-blur-md text-[#1e1b2e] hover:bg-white text-xs sm:text-sm font-bold transition-all overflow-hidden shadow-sm border border-purple-100"
              >
                {item.label}
                {hoveredIndex === idx && (
                  <motion.div
                    layoutId="navbar-indicator-left"
                    className="absolute inset-0 border-b-[3px] border-[#7c3aed]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-auto cursor-pointer group z-10">
            <a href="#top" aria-label="Home" className="relative flex items-center justify-center h-12 w-16">
              <div className="absolute left-2 w-1.5 h-4 bg-zinc-300 rounded-l-md transition-transform duration-300 group-hover:-translate-x-1" />
              <div className="absolute right-2 w-1.5 h-4 bg-zinc-300 rounded-r-md transition-transform duration-300 group-hover:translate-x-1" />

              <div className="z-10 w-10 h-10 bg-white/70 border-2 border-purple-200 backdrop-blur-md rounded-[12px] flex items-center justify-center shadow-[0_4px_20px_rgba(124,58,237,0.12)] transition-all duration-300 group-hover:bg-white group-hover:shadow-[0_4px_25px_rgba(124,58,237,0.25)]">
                <div className="w-[70%] h-[60%] bg-[#120e20] rounded-lg flex items-center justify-center gap-1.5 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
                  <div className="w-1.5 h-3 bg-[#7c3aed] rounded-[2px] shadow-[0_0_8px_#7c3aed] transition-transform duration-200 group-hover:scale-y-[0.2]" />
                  <div className="w-1.5 h-3 bg-[#7c3aed] rounded-[2px] shadow-[0_0_8px_#7c3aed] transition-transform duration-200 group-hover:scale-y-[0.2]" />
                </div>
              </div>
            </a>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-end items-center gap-2 sm:gap-3 w-full lg:w-auto z-20">
            <a
              href={contactHref}
              target={contactTarget}
              rel={contactTarget === "_blank" ? "noopener noreferrer" : undefined}
              className="px-5 sm:px-6 py-2 rounded-full bg-white/90 backdrop-blur-md text-[#221c32] hover:bg-white text-xs sm:text-sm font-bold transition-all shadow-sm border border-purple-100 flex items-center gap-1.5"
            >
              <Play size={13} fill="currentColor" />
              {contactText}
            </a>
            <a
              href="#contact"
              onClick={onCtaClick}
              className="px-5 sm:px-6 py-2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white text-xs sm:text-sm font-black hover:opacity-95 transition-opacity flex items-center gap-2 shadow-[0_4px_16px_rgba(124,58,237,0.35)] cursor-pointer"
            >
              {ctaText}
              <Sparkles size={15} />
            </a>
          </div>
        </div>

        <motion.div
          style={{ opacity: lineOpacity }}
          className="w-full mt-4 border-b border-purple-200/50"
        />
      </div>
    </nav>
  );
}

export function RobotHero({
  backgroundText = "VIRTUALVOX",
  navItemsLeft = [
    { label: "Products", href: "#platform" },
    { label: "Industries", href: "#industries" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Meet the agents", href: "#team" },
  ],
  contactText = "Hear voice demo",
  contactHref = "#demo",
  contactTarget,
  ctaText = "Book a demo",
  onCtaClick,
  color = "#ede8f7",
  scale = 1.05,
  robotPosY,
  pantallaColor = "#7c3aed",
  pantallaBrillo = 1.35,
  blinkCycle = 3.0,
  metalness = 0.05,
  eyebrow = "HUMAN CONNECTION. REIMAGINED.",
  title = "AI voice and text agents.",
  subtitle = "Never miss another opportunity. Answer every call, respond in seconds, and make every conversation count.",
  secondaryCtaText = "Hear it for yourself",
  secondaryCtaHref = "#demo",
  badges = ["Always ready", "Made for your business", "Built around people"],
  showNav = false,
  fondoArriba = "#ffffff",
  fondoMedio = "#f5effd",
  fondoAbajo = "#eae0fb",
  className = "",
}: RobotHeroProps = {}) {
  const containerRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (!containerRef.current || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const entorno = {
    fondoArriba,
    fondoMedio,
    fondoAbajo,
    luzAmbiente: 0.95,
    luzPrincipal: 0.45,
    luzPrincipalColor: "#c084fc",
    luzRelleno: 0.3,
    luzRellenoColor: "#ffffff",
    sombraOpacidad: 0.45,
    sombraBlur: 2.2,
  };

  return (
    <section
      ref={containerRef}
      className={`relative w-full h-[calc(100svh-var(--header,64px))] min-h-[500px] sm:min-h-[560px] md:min-h-[620px] max-h-[660px] sm:max-h-[740px] md:max-h-[780px] overflow-hidden flex flex-col justify-between ${className}`}
      style={{
        background: `linear-gradient(180deg, ${entorno.fondoArriba} 0%, #fefdff 35%, ${entorno.fondoMedio} 75%, ${entorno.fondoAbajo} 100%)`,
      }}
    >
      {/* Background Big Typography - balanced position framing the lowered robot */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none"
        style={{ zIndex: 0 }}
      >
        <span
          className="font-black whitespace-nowrap tracking-tight select-none transform translate-y-10 sm:translate-y-14 md:translate-y-18 lg:translate-y-20"
          style={{
            color: "#7c3aed",
            opacity: 0.08,
            fontSize: "clamp(3rem, 14vw, 13rem)",
            lineHeight: 1,
            fontFamily: "'Manrope', Arial, sans-serif",
          }}
        >
          {backgroundText}
        </span>
      </div>

      {/* 3D WebGL Canvas (Centered & Framed) */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        {mounted && (
          <Canvas
            shadows
            camera={{ position: [0, -0.05, 5.2], fov: 40 }}
            frameloop={inView ? "always" : "never"}
            className="w-full h-full"
          >
            <ambientLight intensity={entorno.luzAmbiente} color="#ffffff" />

            <directionalLight
              position={[0, 6, 3]}
              intensity={entorno.luzPrincipal}
              color={entorno.luzPrincipalColor}
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-bias={-0.0005}
            >
              <orthographicCamera
                attach="shadow-camera"
                args={[-1.5, 1.5, 1.5, -1.5, 0.1, 20]}
              />
            </directionalLight>

            <directionalLight
              position={[-5, 2, -5]}
              intensity={entorno.luzRelleno}
              color={entorno.luzRellenoColor}
            />

            {/* Self-contained ambient & hemisphere studio lighting - eliminates 7.6s raw.githack.com download */}
            <hemisphereLight
              args={["#ffffff", "#c4b5fd", 0.9]}
            />
            <pointLight position={[0, 4, 3]} intensity={0.9} color="#f5f3ff" />
            <pointLight position={[-4, 1, -2]} intensity={0.6} color="#e9d5ff" />

            <ResponsiveGroup scale={scale} posY={robotPosY}>
              <ContactShadows
                position={[0, -1.15, 0]}
                opacity={entorno.sombraOpacidad}
                scale={15}
                resolution={1024}
                blur={entorno.sombraBlur}
                far={2.5}
                color="#4c1d95"
              />
              <RobotPrototype
                neckParams={{
                  baseR: 0.215,
                  baseH: -0.05,
                  midR: 0.28,
                  midH: 0.02,
                  lipBottomR: 0.295,
                  lipBottomH: 0.045,
                  lipTopR: 0.27,
                  lipTopH: 0.055,
                  innerR: 0.1,
                  innerDropH: 0.0,
                }}
                bodyParams={{
                  bodyBevelR: 0.235,
                  bodyBevelY: 0.34,
                  bodyBevelT: 0.025,
                }}
                color={color}
                pantallaColor={pantallaColor}
                pantallaBrillo={pantallaBrillo}
                blinkCycle={blinkCycle}
                metalness={metalness}
              />
            </ResponsiveGroup>
          </Canvas>
        )}
      </div>

      {/* Foreground Header / Nav (if enabled) */}
      {showNav && (
        <div className="relative z-30 pointer-events-none">
          <AntennaNavbar
            leftItems={navItemsLeft}
            contactText={contactText}
            contactHref={contactHref}
            contactTarget={contactTarget}
            ctaText={ctaText}
            onCtaClick={onCtaClick}
          />
        </div>
      )}

      {/* Top Hero Copy & CTA Overlay: Perfectly balanced padding and margins */}
      <div className="relative z-20 w-full max-w-[1160px] mx-auto px-4 sm:px-8 pt-4 sm:pt-6 md:pt-8 text-center pointer-events-none">
        {eyebrow && (
          <div className="eyebrow pointer-events-auto mb-1.5 sm:mb-2.5 text-[10px] sm:text-xs">
            <AudioLines size={14} className="sm:w-[15px] sm:h-[15px]" />
            <span>{eyebrow}</span>
          </div>
        )}

        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-[#20283d] m-0">
          {title} <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#544370] to-[#9881d0] bg-clip-text text-transparent">
            Remarkably human.
          </span>
        </h1>

        <p className="mt-2 sm:mt-3 max-w-[310px] sm:max-w-xl mx-auto text-[11px] sm:text-sm md:text-base text-[#697084] leading-relaxed px-2">
          {subtitle}
        </p>

        {/* Hero Trust Badges - clean, tight margin that leaves a balanced ~20px-30px gap above the robot */}
        {badges && badges.length > 0 && (
          <div className="hero-note !mt-2.5 sm:!mt-3.5 !mb-0 pointer-events-auto flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 sm:gap-3 max-w-[320px] sm:max-w-none mx-auto text-[10px] sm:text-xs text-[#7d758c]">
            {badges.map((b, i) => (
              <span key={b} className="inline-flex items-center gap-1.5 sm:gap-2.5">
                <span>{b}</span>
                {i < badges.length - 1 && <i />}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Subtle Bottom Ambient Gradient Anchor to next section */}
      <div
        className="relative z-20 w-full h-4 sm:h-6 bg-gradient-to-t from-white/90 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}

export default RobotHero;
