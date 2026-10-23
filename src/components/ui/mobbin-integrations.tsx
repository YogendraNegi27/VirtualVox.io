'use client';

import React, { useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate, type MotionValue } from 'motion/react';

export interface MobbinIntegrationsProps {
  eyebrow?: string;
  headlineTop?: string;
  headlineHighlight?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export interface ToolItem {
  id: string;
  name: string;
  bg: string;
  glow: string;
  border?: string;
  icon: React.ReactNode;
}

// 5 Selected Tools for Left Reel (Flows Downward)
const LeftTools: ToolItem[] = [
  {
    id: 'salesforce',
    name: 'Salesforce CRM',
    bg: '#00A1E0',
    glow: 'rgba(0, 161, 224, 0.45)',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-[62%] h-[62%]">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-2.9 0-5.43 1.65-6.68 4.07C2.41 8.44 0 10.94 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.61.1 2.78 1.49 2.78 3.1 0 1.76-1.43 3.2-3.2 3.2z" />
      </svg>
    ),
  },
  {
    id: 'googlecal',
    name: 'Google Calendar',
    bg: '#FFFFFF',
    border: 'border border-slate-200/90',
    glow: 'rgba(66, 133, 244, 0.35)',
    icon: (
      <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full h-[30%] bg-[#4285F4] flex items-center justify-center" />
        <div className="flex-1 flex items-center justify-center">
          <span className="font-black text-[#4285F4] text-xl sm:text-2xl font-mono leading-none tracking-tighter">
            31
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    bg: '#FF7A59',
    glow: 'rgba(255, 122, 89, 0.45)',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-[60%] h-[60%]">
        <path d="M18.8 9.3V6.6c.7-.4 1.2-1.1 1.2-2 0-1.3-1.1-2.4-2.4-2.4s-2.4 1.1-2.4 2.4c0 .9.5 1.6 1.2 2v2.7c-1.3.5-2.3 1.5-2.8 2.8H9.3c-.4-.5-1-.9-1.7-1.1V8.6c.6-.4 1.1-1.1 1.1-1.9 0-1.3-1.1-2.4-2.4-2.4S3.9 5.4 3.9 6.7c0 .8.5 1.5 1.1 1.9v2.4c-1.2.5-2 1.7-2 3.1 0 1.4.8 2.6 2 3.1v2.3c-.6.4-1.1 1.1-1.1 1.9 0 1.3 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4c0-.8-.5-1.5-1.1-1.9v-2.3c.7-.2 1.3-.6 1.7-1.1h4.3c.5 1.3 1.5 2.3 2.8 2.8v2.7c-.7.4-1.2 1.1-1.2 2 0 1.3 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4c0-.9-.5-1.6-1.2-2v-2.7c2.1-.9 3.6-3 3.6-5.4 0-2.5-1.5-4.6-3.6-5.5zm-1.2 7.6c-1.6 0-2.8-1.3-2.8-2.8s1.3-2.8 2.8-2.8 2.8 1.3 2.8 2.8-1.2 2.8-2.8 2.8z" />
      </svg>
    ),
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    bg: '#03363D',
    glow: 'rgba(3, 54, 61, 0.45)',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-[58%] h-[58%]">
        <path d="M5.4 18.6V9.4h9.2v9.2H5.4zm3.9-6.3c0-.6-.5-1.1-1.1-1.1s-1.1.5-1.1 1.1.5 1.1 1.1 1.1 1.1-.5 1.1-1.1zm9.3-2.9h-9.2v9.2h9.2V9.4zm-3.9 6.3c0 .6.5 1.1 1.1 1.1s1.1-.5 1.1-1.1-.5-1.1-1.1-1.1-1.1.5-1.1 1.1z" />
      </svg>
    ),
  },
  {
    id: 'slack',
    name: 'Slack',
    bg: '#4A154B',
    glow: 'rgba(74, 21, 75, 0.45)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[62%] h-[62%]">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A" />
        <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0" />
        <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D" />
        <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E" />
      </svg>
    ),
  },
];

// 5 Selected Tools for Right Reel (Flows Upward)
const RightTools: ToolItem[] = [
  {
    id: 'teams',
    name: 'Microsoft Teams',
    bg: '#5059C9',
    glow: 'rgba(80, 89, 201, 0.45)',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-[60%] h-[60%]">
        <path d="M19.5 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm2 2h-4a1.5 1.5 0 0 0-1.5 1.5v3.5a3 3 0 0 0 2 2.82V20h3v-2.68a3 3 0 0 0 2-2.82V11a1.5 1.5 0 0 0-1.5-1.5zM13 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm3 4H7A2 2 0 0 0 5 12.5V17a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4v-4.5a2 2 0 0 0-2-2z" />
      </svg>
    ),
  },
  {
    id: 'stripe',
    name: 'Stripe Payments',
    bg: '#635BFF',
    glow: 'rgba(99, 91, 255, 0.45)',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-[58%] h-[58%]">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.97 15.684.5 12.518.5 7.026.5 3.328 3.393 3.328 7.954c0 6.143 8.358 5.18 8.358 7.848 0 .984-.858 1.488-2.164 1.488-2.552 0-5.592-1.229-7.44-2.227L1.192 20.6c1.884 1.01 5.32 1.9 9.324 1.9 5.86 0 9.804-2.864 9.804-7.488 0-6.425-8.344-5.056-8.344-5.862z" />
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    bg: '#25D366',
    glow: 'rgba(37, 211, 102, 0.45)',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-[62%] h-[62%]">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.4 1.3-1.93 1.38-.49.07-1.12.1-3.27-.79-2.75-1.14-4.52-3.95-4.66-4.13-.14-.18-1.12-1.49-1.12-2.85 0-1.36.71-2.02.96-2.3.25-.28.55-.35.73-.35.18 0 .36 0 .52.01.17.01.4.06.61.57.24.57.82 2 .89 2.15.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.18-.31.4-.44.54-.15.15-.31.31-.13.61.18.3 1.13 1.86 2.42 3.01 1.67 1.48 3.08 1.94 3.52 2.15.44.22.7.18.96-.11.26-.3.12-1.34 1.42-1.74.3-.4.6-.26.85-.18z" />
      </svg>
    ),
  },
  {
    id: 'zapier',
    name: 'Zapier Webhooks',
    bg: '#FF4A00',
    glow: 'rgba(255, 74, 0, 0.45)',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-[62%] h-[62%]">
        <path d="M13.6 2h-3.2v7.2H3.2v3.2h7.2v7.2h3.2v-7.2h7.2v-3.2h-7.2z" transform="rotate(45 12 12)" />
      </svg>
    ),
  },
  {
    id: 'intercom',
    name: 'Intercom Support',
    bg: '#1F8DED',
    glow: 'rgba(31, 141, 237, 0.45)',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-[60%] h-[60%]">
        <path d="M18.8 3H5.2C3.4 3 2 4.4 2 6.2v11.6C2 19.6 3.4 21 5.2 21h13.6c1.8 0 3.2-1.4 3.2-3.2V6.2C22 4.4 20.6 3 18.8 3zM7 7.5c0-.8.7-1.5 1.5-1.5S10 6.7 10 7.5v6c0 .8-.7 1.5-1.5 1.5S7 14.3 7 13.5v-6zm5 0c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v6c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5v-6zm5 0c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v6c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5v-6z" />
      </svg>
    ),
  },
];

// Mobbin Exact Stations (from mobbin.com source)
const LEFT_STATIONS = [
  { top: 0, left: 69.6, size: 72, blurred: true },
  { top: 50.4, left: 32.0, size: 83.2 },
  { top: 109.6, left: 0.0, size: 99.2 }, // Center Spotlight!
  { top: 184.8, left: 32.0, size: 83.2 },
  { top: 246.4, left: 69.6, size: 72, blurred: true },
];

const RIGHT_STATIONS = [
  { top: 0, left: 0.0, size: 72, blurred: true },
  { top: 50.4, left: 26.4, size: 83.2 },
  { top: 109.6, left: 42.4, size: 99.2 }, // Center Spotlight!
  { top: 184.8, left: 26.4, size: 83.2 },
  { top: 246.4, left: 0.0, size: 72, blurred: true },
];

// Mobbin Cubic Bezier [0.16, 1, 0.3, 1]
const BEZIER_EASE = [0.16, 1, 0.3, 1] as const;

function solveCubicBezier(progress: number): number {
  const [x1, y1, x2, y2] = BEZIER_EASE;
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  const sampleX = (t: number) => 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
  const sampleDerivativeX = (t: number) =>
    3 * (1 - t) * (1 - t) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t * t * (1 - x2);
  let guess = progress;
  for (let k = 0; k < 8; k++) {
    const diff = sampleX(guess) - progress;
    if (Math.abs(diff) < 1e-6) break;
    const d = sampleDerivativeX(guess);
    if (Math.abs(d) < 1e-6) break;
    guess -= diff / d;
  }
  guess = Math.min(Math.max(guess, 0), 1);
  return 3 * (1 - guess) * (1 - guess) * guess * y1 + 3 * (1 - guess) * guess * guess * y2 + guess * guess * guess;
}

interface StationPoint {
  x: number;
  y: number;
  size: number;
  blur: number;
  opacity: number;
}

interface PathKeyframe {
  percent: number;
  station: StationPoint;
}

function interpolateStation(keyframes: PathKeyframe[], percent: number): StationPoint {
  if (percent <= keyframes[0].percent) return keyframes[0].station;
  for (let i = 1; i < keyframes.length; i++) {
    const prev = keyframes[i - 1];
    const curr = keyframes[i];
    if (percent > curr.percent) continue;
    const range = curr.percent - prev.percent;
    const factor = range <= 0 ? 1 : solveCubicBezier((percent - prev.percent) / range);
    const lerp = (a: number, b: number) => a + (b - a) * factor;
    return {
      x: lerp(prev.station.x, curr.station.x),
      y: lerp(prev.station.y, curr.station.y),
      size: lerp(prev.station.size, curr.station.size),
      blur: lerp(prev.station.blur, curr.station.blur),
      opacity: lerp(prev.station.opacity, curr.station.opacity),
    };
  }
  return keyframes[keyframes.length - 1].station;
}

function buildReel(
  stations: typeof LEFT_STATIONS,
  direction: 'down' | 'up',
  tools: ToolItem[]
) {
  const sorted = [...stations].sort((a, b) => a.top - b.top);
  const ordered = direction === 'down' ? sorted : [...sorted].reverse();
  const stationPoints: StationPoint[] = ordered.map((s) => ({
    x: s.left + s.size / 2,
    y: s.top + s.size / 2,
    size: s.size,
    blur: s.blurred ? 2 : 0,
    opacity: 1,
  }));
  const dirSign = direction === 'down' ? 1 : -1;
  const count = stationPoints.length; // 5
  const slotPercent = 100 / count; // 20%
  const holdPercent = 0.7758620689655172 * slotPercent; // ~15.52% hold, ~4.48% transition

  // Arc path
  const firstSt = stationPoints[0];
  const arc: PathKeyframe[] = [];
  stationPoints.forEach((st, i) => {
    arc.push({ percent: i * slotPercent, station: st });
    arc.push({ percent: i * slotPercent + holdPercent, station: st });
  });
  const bPercent = (count - 1) * slotPercent + holdPercent;
  arc.push({
    percent: bPercent + 0.001,
    station: { ...firstSt, y: firstSt.y - 28 * dirSign, opacity: 0 },
  });
  arc.push({ percent: 100, station: firstSt });

  // Exit path for smooth infinite loop wrapping
  const lastSt = stationPoints[count - 1];
  const exit: PathKeyframe[] = [
    { percent: 0, station: { ...lastSt, opacity: 0 } },
    { percent: bPercent - 0.001, station: { ...lastSt, opacity: 0 } },
    { percent: bPercent, station: lastSt },
    {
      percent: 100,
      station: { ...lastSt, y: lastSt.y + 28 * dirSign, opacity: 0 },
    },
  ];

  return {
    tools,
    arc,
    exit,
    offsets: tools.map((_, i) => (i * slotPercent) / 100),
    durationMs: 2320 * count, // 11600ms total loop (2.32s per tool)
  };
}

const leftReelConfig = buildReel(LEFT_STATIONS, 'down', LeftTools);
const rightReelConfig = buildReel(RIGHT_STATIONS, 'up', RightTools);

function MobbinReelIcon({
  tool,
  index,
  reel,
  role,
  progress,
}: {
  tool: ToolItem;
  index: number;
  reel: typeof leftReelConfig;
  role: 'arc' | 'exit';
  progress: MotionValue<number>;
}) {
  const path = role === 'exit' ? reel.exit : reel.arc;
  const offset = reel.offsets[index] ?? 0;

  const currentStation = useTransform(progress, (p) => {
    const cyclePercent = ((p + offset) % 1) * 100;
    return interpolateStation(path, cyclePercent);
  });

  const x = useTransform(currentStation, (st) => st.x - st.size / 2);
  const y = useTransform(currentStation, (st) => st.y - st.size / 2);
  const scale = useTransform(currentStation, (st) => st.size / 99.2);
  const opacity = useTransform(currentStation, (st) => st.opacity);
  const zIndex = useTransform(currentStation, (st) => Math.round(st.size));
  const filter = useTransform(currentStation, (st) => `blur(${st.blur.toFixed(1)}px)`);

  return (
    <motion.div
      className="finance-icon absolute top-0 left-0 will-change-transform pointer-events-auto select-none"
      style={{
        width: 99.2,
        height: 99.2,
        x,
        y,
        scale,
        opacity,
        zIndex,
        filter,
        transformOrigin: '0 0',
      }}
    >
      <div
        className={`w-full h-full rounded-[22%] flex items-center justify-center overflow-hidden transition-shadow duration-300 ${
          tool.border || 'border border-black/8'
        }`}
        style={{
          backgroundColor: tool.bg,
          boxShadow: `0 14px 34px -4px ${tool.glow}, 0 4px 14px rgba(18, 14, 30, 0.12), 0 0 0 1.5px rgba(255, 255, 255, 0.9)`,
        }}
        title={tool.name}
      >
        {tool.icon}
      </div>
    </motion.div>
  );
}

function MobbinReel({
  reel,
  progress,
  className = '',
}: {
  reel: typeof leftReelConfig;
  progress: MotionValue<number>;
  className?: string;
}) {
  return (
    <div
      className={`finance-reel relative shrink-0 select-none w-[92px] sm:w-[120px] lg:w-[141.6px] h-[207px] sm:h-[270px] lg:h-[318.4px] ${className}`}
      style={{ isolation: 'isolate' }}
    >
      {/* Responsive proportional scale wrapper matching mobbin.com */}
      <div className="finance-reel-scale absolute inset-0 origin-top-left scale-[0.65] sm:scale-[0.85] lg:scale-100">
        {reel.tools.map((tool, idx) => (
          <MobbinReelIcon
            key={`arc-${tool.id}`}
            tool={tool}
            index={idx}
            reel={reel}
            role="arc"
            progress={progress}
          />
        ))}
        {reel.tools.map((tool, idx) => (
          <MobbinReelIcon
            key={`exit-${tool.id}`}
            tool={tool}
            index={idx}
            reel={reel}
            role="exit"
            progress={progress}
          />
        ))}
      </div>
    </div>
  );
}

export function MobbinIntegrations({
  eyebrow = 'BETTER, TOGETHER',
  headlineTop = 'Your tools.',
  headlineHighlight = 'One conversation.',
  description = 'Design your agent around the systems your team already uses.',
  ctaText = 'Explore integrations',
  ctaHref = '#contact',
  className = '',
}: MobbinIntegrationsProps) {
  // Single shared master progress motion value: 100% synchronized across left & right
  const progress = useMotionValue(0);

  useEffect(() => {
    // 11.6s seamless infinite loop matching mobbin.com
    const anim = animate(progress, 1, {
      duration: leftReelConfig.durationMs / 1000,
      ease: 'linear',
      repeat: Infinity,
    });
    return () => anim.stop();
  }, [progress]);

  return (
    <section
      className={`relative w-full overflow-hidden py-14 sm:py-18 lg:py-22 bg-gradient-to-b from-white via-[#fcfbfe] to-white ${className}`}
      id="integrations"
      aria-label="Integrations and ecosystem"
    >
      {/* Subtle ambient dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Main Layout: Left Reel | Center Headline | Right Reel */}
        <div className="relative flex items-center justify-center gap-2 sm:gap-6 lg:gap-12 min-h-[340px] sm:min-h-[380px] lg:min-h-[420px]">
          {/* ========================================================
              LEFT COLUMN: Mobbin Engine (Flows DOWN)
          ======================================================== */}
          <div className="relative flex-shrink-0">
            <MobbinReel reel={leftReelConfig} progress={progress} />
          </div>

          {/* ========================================================
              CENTER COLUMN: Mobbin-Style Hero Copy (Image 2 Typography)
          ======================================================== */}
          <div className="flex-1 max-w-xs sm:max-w-md lg:max-w-lg text-center z-10 px-1 sm:px-4 py-4">
            {/* Clean Tracked Eyebrow (Image 2 Reference) */}
            {eyebrow && (
              <div className="text-[10px] sm:text-[11.5px] font-bold tracking-[0.18em] uppercase text-[#7b61d4] mb-2 sm:mb-3">
                {eyebrow}
              </div>
            )}

            {/* Main Headline (Two-Tone from Image 2: Bold Dark + Muted Slate) */}
            <h2 className="text-2xl sm:text-4xl lg:text-[45px] font-extrabold tracking-tight leading-[1.12] m-0">
              <span className="text-[#1c2237] inline">{headlineTop} </span>
              <span className="text-[#8e879c] inline">{headlineHighlight}</span>
            </h2>

            {/* Subtitle (Image 2 Reference) */}
            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-[#676075] leading-relaxed max-w-xs sm:max-w-md mx-auto">
              {description}
            </p>

            {/* Mobbin Tactile Pill Button */}
            <div className="mt-5 sm:mt-7 flex justify-center">
              <a
                href={ctaHref}
                className="group inline-flex items-center gap-2.5 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold text-[#20283d] bg-[#f0edf5] hover:bg-[#e4ddf0] border border-[#e5dff0] transition-all duration-200 shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{ctaText}</span>
                <ArrowRight
                  size={15}
                  className="text-[#7c5cfc] transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Mobbin Engine (Flows UP)
          ======================================================== */}
          <div className="relative flex-shrink-0">
            <MobbinReel reel={rightReelConfig} progress={progress} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default MobbinIntegrations;
