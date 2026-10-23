'use client';

import React, { useState, useRef, useEffect } from "react";
import { Check, Plus, Volume2, AudioLines } from "lucide-react";

export interface AgentAccordionItem {
  id: number;
  name: string;
  tag: string;
  role: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  fallbackUrl?: string;
  bgGradient: string;
  fadeGradient: string;
  tagColor: string;
  borderColor: string;
  capabilities: string[];
}

// Sofia = Female Portrait (Agent 1), Alex = Male Portrait (Agent 2)
export const defaultAgents: AgentAccordionItem[] = [
  {
    id: 1,
    name: "Sofia",
    tag: "Customer support",
    role: "Your first impression, perfected.",
    description:
      "Answers customer queries instantly, resolves routine questions, and delivers thoughtful, human-first care 24/7.",
    imageUrl: "/images/agent-alex.jpg", // female portrait
    videoUrl: "/media/agent-alex.mp4",
    fallbackUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    bgGradient: "linear-gradient(180deg, #f5effc 0%, #e6d8f5 100%)",
    fadeGradient: "from-[#e6d8f5] via-[#e6d8f5]/85 to-transparent",
    tagColor: "#775cb5",
    borderColor: "#d8c7ed",
    capabilities: ["24/7 Care", "FAQ resolution", "Empathetic tone"],
  },
  {
    id: 2,
    name: "Alex",
    tag: "Appointments",
    role: "Turn a question into a connection.",
    description:
      "Connects with your calendar to book discovery calls, send timely reminders, and manage rescheduling without hassle.",
    imageUrl: "/images/agent-sofia.jpg", // male portrait
    videoUrl: "/media/agent-sofia.mp4",
    fallbackUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    bgGradient: "linear-gradient(180deg, #f8eff8 0%, #ecdcf0 100%)",
    fadeGradient: "from-[#ecdcf0] via-[#ecdcf0]/85 to-transparent",
    tagColor: "#b25f82",
    borderColor: "#dfc6e6",
    capabilities: ["Calendar sync", "Auto reminders", "Smart booking"],
  },
  {
    id: 3,
    name: "James",
    tag: "Lead qualification",
    role: "Make every opportunity count.",
    description:
      "Gathers prospect intent, qualifies budget and timeline, and seamlessly routes high-priority deals to your team.",
    imageUrl: "/images/agent-james.jpg",
    videoUrl: "/media/agent-james.mp4",
    fallbackUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    bgGradient: "linear-gradient(180deg, #eff3fc 0%, #dbe3f5 100%)",
    fadeGradient: "from-[#dbe3f5] via-[#dbe3f5]/85 to-transparent",
    tagColor: "#506ec2",
    borderColor: "#c9d5ee",
    capabilities: ["Intent scoring", "CRM routing", "Data capture"],
  },
  {
    id: 4,
    name: "Priya",
    tag: "Voice assistant",
    role: "Remarkably human conversations.",
    description:
      "Natural bidirectional voice AI with instant speech interruption handling, realistic pauses, and fluid comprehension.",
    imageUrl: "/images/priya.webp",
    fallbackUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    bgGradient: "linear-gradient(180deg, #f6edf9 0%, #e4d0f3 100%)",
    fadeGradient: "from-[#e4d0f3] via-[#e4d0f3]/85 to-transparent",
    tagColor: "#8e61c5",
    borderColor: "#d7bde9",
    capabilities: ["Sub-second latency", "Voice interruption", "Neural voice"],
  },
  {
    id: 5,
    name: "Marcus",
    tag: "After-hours dispatch",
    role: "Always ready when the next job calls.",
    description:
      "Captures after-hours calls, triages emergency service requests, logs tickets, and alerts on-call teams immediately.",
    imageUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    fallbackUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    bgGradient: "linear-gradient(180deg, #eef5f6 0%, #d4e7e6 100%)",
    fadeGradient: "from-[#d4e7e6] via-[#d4e7e6]/85 to-transparent",
    tagColor: "#398e82",
    borderColor: "#bfdedc",
    capabilities: ["Emergency triage", "Automated logs", "Weekend alerts"],
  },
];

interface AccordionItemProps {
  item: AgentAccordionItem;
  isActive: boolean;
  onActivate: () => void;
  onHover: () => void;
  onPreviewClick?: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  item,
  isActive,
  onActivate,
  onHover,
  onPreviewClick,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Performance: Only decode/play video when card is active to eliminate scroll/click lag
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      const p = videoRef.current.play();
      if (p !== undefined) p.catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isActive]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-label={`${item.name} - ${item.tag}: ${item.role}`}
      onClick={onActivate}
      onMouseEnter={onHover}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
      className={`
        relative rounded-[22px] sm:rounded-[24px] overflow-hidden cursor-pointer select-none
        border
        /* Snappy 400ms Apple-smooth transition: eliminates freezing, sticking & lag */
        transition-[width,height,box-shadow,border-color,opacity,transform] duration-[400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]
        will-change-[width,height,transform] transform-gpu
        touch-manipulation
        /* Responsive widths & heights: vertical stack on mobile, horizontal cards on md+ */
        w-full
        ${
          isActive
            ? "h-[360px] sm:h-[390px] md:h-[460px] md:w-[320px] lg:w-[370px] shadow-xl ring-2 ring-purple-400/40"
            : "h-[64px] sm:h-[68px] md:h-[460px] md:w-[60px] lg:w-[68px] shadow-sm hover:shadow-md opacity-90 hover:opacity-100"
        }
      `}
      style={{
        background: item.bgGradient,
        borderColor: isActive ? item.borderColor : "#decfe9",
      }}
    >
      {/* Background waveform graphic */}
      <div
        className="absolute inset-0 pointer-events-none opacity-35 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 flex items-center justify-center gap-[2.5px]">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="w-[2px] rounded-full transition-opacity duration-500"
              style={{
                height: `${16 + Math.sin(i * 0.65) ** 2 * 80}px`,
                backgroundColor: item.tagColor,
                opacity: 0.5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Avatar Media: Video or high-res Image */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        {item.videoUrl ? (
          <video
            ref={videoRef}
            src={item.videoUrl}
            poster={item.imageUrl}
            autoPlay={isActive}
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{
              transform: isActive ? "scale(1.04)" : "scale(1.0)",
              mixBlendMode: "multiply",
              WebkitMaskImage: "linear-gradient(180deg, #000 65%, transparent 98%)",
              maskImage: "linear-gradient(180deg, #000 65%, transparent 98%)",
            }}
          />
        ) : (
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{
              transform: isActive ? "scale(1.04)" : "scale(1.0)",
              mixBlendMode: item.imageUrl.includes('priya') ? 'normal' : 'multiply',
              WebkitMaskImage: "linear-gradient(180deg, #000 65%, transparent 98%)",
              maskImage: "linear-gradient(180deg, #000 65%, transparent 98%)",
            }}
            onError={(e) => {
              const target = e.currentTarget;
              target.style.mixBlendMode = "normal";
              if (item.fallbackUrl && target.src !== item.fallbackUrl) {
                target.src = item.fallbackUrl;
              }
            }}
          />
        )}
      </div>

      {/* Soft natural bottom gradient in light purple - NO white */}
      <div
        className={`
          absolute inset-0 pointer-events-none transition-opacity duration-500
          bg-gradient-to-t ${item.fadeGradient}
          ${isActive ? "opacity-95" : "opacity-80"}
        `}
      />

      {/* Tag Badge (Top Left) - visible ONLY when active to prevent collisions */}
      <div
        className={`
          absolute top-3.5 left-3.5 z-10 pointer-events-none transition-opacity duration-300
          ${isActive ? "opacity-100" : "opacity-0"}
        `}
      >
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide bg-[#ede3f7]/95 backdrop-blur-md border border-[#ded0ec] shadow-sm"
          style={{ color: item.tagColor }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: item.tagColor }}
          />
          {item.tag}
        </span>
      </div>

      {/* Circular Action Button (Bottom Right when active, Middle Right when collapsed) */}
      <div
        className={`
          absolute z-10 transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)]
          ${
            isActive
              ? "bottom-4 right-4"
              : "right-4 top-1/2 -translate-y-1/2 md:top-auto md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:translate-y-0"
          }
        `}
      >
        <span
          className={`
            w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300
            ${
              isActive
                ? "bg-[#24212c] text-white shadow-md scale-100"
                : "bg-[#e8daf5] text-[#6d578b] border border-[#d6c3ea] hover:bg-[#deccf2] shadow-sm"
            }
          `}
          aria-hidden="true"
        >
          {isActive ? (
            <Check className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </span>
      </div>

      {/* Active Card Body Content with smooth entrance */}
      <div
        className={`
          absolute inset-x-0 bottom-0 p-5 md:p-5 z-10 flex flex-col justify-end
          transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
          ${
            isActive
              ? "opacity-100 translate-y-0 delay-75 pointer-events-auto"
              : "opacity-0 translate-y-3 pointer-events-none"
          }
        `}
      >
        <div className="pr-10">
          <h3 className="text-2xl md:text-3xl font-semibold text-[#20283d] tracking-tight leading-tight">
            {item.name}
          </h3>
          <p className="text-xs md:text-sm text-[#5d5671] font-medium mt-0.5">
            {item.role}
          </p>
        </div>

        <p className="text-xs text-[#524a64] mt-2 line-clamp-2 leading-relaxed max-w-sm">
          {item.description}
        </p>

        {/* Capability chips */}
        <div className="hidden sm:flex flex-wrap gap-1 mt-2.5">
          {item.capabilities.map((cap) => (
            <span
              key={cap}
              className="text-[10px] font-medium text-[#4d3d63] bg-[#ece2f7] backdrop-blur-sm px-2 py-0.5 rounded-md border border-[#decfe9]"
            >
              {cap}
            </span>
          ))}
        </div>

        {/* Quick Voice Preview Button */}
        <div className="mt-3 flex items-center gap-2">
          <a
            href="#demo"
            onClick={(e) => {
              e.stopPropagation();
              if (onPreviewClick) onPreviewClick();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#24212c] text-white hover:bg-[#443557] transition-colors shadow-sm"
          >
            <Volume2 className="w-3.5 h-3.5 text-purple-300" />
            Try voice preview
          </a>
        </div>
      </div>

      {/* Inactive Card Label: Crisp clean row on mobile without any text collision */}
      <div
        className={`
          absolute pointer-events-none transition-opacity duration-200
          ${!isActive ? "opacity-100 delay-50" : "opacity-0 pointer-events-none"}
          /* Mobile clean horizontal row */
          left-4 sm:left-5 top-1/2 -translate-y-1/2 flex items-center gap-2.5 z-10
          /* Desktop vertical layout */
          md:left-1/2 md:top-auto md:bottom-24 md:-translate-x-1/2 md:translate-y-0 md:rotate-90 md:w-max
        `}
      >
        <span className="text-[#20283d] text-sm md:text-base font-bold tracking-tight whitespace-nowrap">
          {item.name}
        </span>
        <span
          className="md:hidden inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/80 border border-[#decfe9] shadow-2xs"
          style={{ color: item.tagColor }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: item.tagColor }}
          />
          {item.tag}
        </span>
      </div>
    </div>
  );
};

export interface LandingAccordionProps {
  items?: AgentAccordionItem[];
  defaultActiveIndex?: number;
  onSelectAgent?: (index: number) => void;
  className?: string;
}

export function LandingAccordionItem({
  items = defaultAgents,
  defaultActiveIndex = 0,
  onSelectAgent,
  className = "",
}: LandingAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  const handleHover = (index: number) => {
    // Crucial: Only trigger hover activation with a mouse (pointer: fine).
    // On touch screens (phones/tablets), hover events fire during drag/scroll and cause
    // severe scroll hitching and accordion sticking.
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    if (index === activeIndex) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      setActiveIndex(index);
      if (onSelectAgent) {
        onSelectAgent(index);
      }
    }, 120);
  };

  const handleActivate = (index: number) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setActiveIndex(index);
    if (onSelectAgent) {
      onSelectAgent(index);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Two-Column Layout: Clean Heading to the Left, 5-Card Image Accordion to the Right */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 w-full">
        {/* Left Side: Clean Minimal Heading & Subtitle */}
        <div className="w-full lg:w-[38%] text-center lg:text-left">
          <span className="eyebrow inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#7761d6]">
            <AudioLines size={15} /> A VOICE FOR EVERY HELLO
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#20283d] tracking-tight mt-3 mb-4 leading-[1.12]">
            Meet your <span className="text-[#9393a5]">new team.</span>
          </h2>

          <p className="text-base md:text-lg text-[#697084] leading-relaxed max-w-lg mx-auto lg:mx-0">
            Different personalities. The same thoughtful experience.
          </p>
        </div>

        {/* Right Side: 5-Card Smooth Interactive Image Accordion */}
        <div className="w-full lg:w-[62%]">
          <div
            className="flex flex-col md:flex-row items-center justify-center lg:justify-end gap-2.5 md:gap-3 w-full"
            role="region"
            aria-label="Meet your new team interactive agent showcase"
          >
            {items.map((item, index) => (
              <AccordionItem
                key={item.id}
                item={item}
                isActive={index === activeIndex}
                onActivate={() => handleActivate(index)}
                onHover={() => handleHover(index)}
                onPreviewClick={() => handleActivate(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingAccordionItem;
