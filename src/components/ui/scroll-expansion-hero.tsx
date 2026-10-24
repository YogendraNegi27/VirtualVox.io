"use client";

import React, { useEffect, useRef, useState, useCallback, ReactNode } from "react";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Phone, ChevronRight, Mic } from "lucide-react";
import { usePriyaCall } from "../usePriyaCall";
import { cn } from "@/lib/utils";

// Interactive Slide-To-Action Button for Priya Voice Demo
interface SlideToActionButtonProps {
  label: string;
  isLive?: boolean;
  disabled?: boolean;
  onTrigger: () => void;
}

export function SlideToActionButton({
  label,
  isLive = false,
  disabled = false,
  onTrigger,
}: SlideToActionButtonProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const startXRef = useRef(0);
  const currentDragRef = useRef(0);
  const maxDragRef = useRef(140);
  const dragDistanceRef = useRef(0);

  const updateBounds = useCallback(() => {
    if (trackRef.current) {
      const trackWidth = trackRef.current.clientWidth;
      const thumbWidth = 38;
      const padding = 8;
      maxDragRef.current = Math.max(0, trackWidth - thumbWidth - padding);
    }
  }, []);

  useEffect(() => {
    updateBounds();
    window.addEventListener("resize", updateBounds, { passive: true });
    return () => window.removeEventListener("resize", updateBounds);
  }, [updateBounds]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled || isCompleted) return;
    updateBounds();
    setIsDragging(true);
    startXRef.current = e.clientX;
    dragDistanceRef.current = 0;
    currentDragRef.current = 0;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || disabled || isCompleted) return;
    const delta = e.clientX - startXRef.current;
    dragDistanceRef.current = Math.abs(delta);
    const clamped = Math.min(Math.max(0, delta), maxDragRef.current);
    currentDragRef.current = clamped;
    setDragX(clamped);
  };

  const triggerActivation = () => {
    setIsCompleted(true);
    setDragX(maxDragRef.current);
    onTrigger();
    setTimeout(() => {
      setIsCompleted(false);
      setDragX(0);
      currentDragRef.current = 0;
    }, 600);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch {}

    const threshold = maxDragRef.current * 0.45;
    if (currentDragRef.current >= threshold || dragDistanceRef.current < 6) {
      triggerActivation();
    } else {
      setDragX(0);
      currentDragRef.current = 0;
    }
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    setDragX(0);
    currentDragRef.current = 0;
  };

  const progress = maxDragRef.current > 0 ? dragX / maxDragRef.current : 0;
  const labelOpacity = Math.max(0.12, 1 - progress * 1.5);

  return (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled && !isCompleted) {
          e.preventDefault();
          triggerActivation();
        }
      }}
      className={cn(
        "relative w-full h-[46px] sm:h-[48px] rounded-full overflow-hidden select-none touch-none transition-all duration-200 border cursor-pointer pointer-events-auto",
        isLive
          ? "bg-rose-50/95 border-rose-300 shadow-[0_2px_10px_rgba(244,63,94,0.18)]"
          : "bg-white/95 border-[#a78aff]/70 shadow-[0_2px_12px_rgba(124,58,237,0.12)]",
        disabled && "opacity-60 cursor-not-allowed"
      )}
    >
      {/* Dynamic progress track fill behind thumb */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 pointer-events-none transition-all",
          isLive
            ? "bg-gradient-to-r from-rose-200/70 to-rose-300/80"
            : "bg-gradient-to-r from-purple-200/70 to-violet-300/80"
        )}
        style={{
          width: `${dragX + 38}px`,
        }}
      />

      {/* Centered label and directional chevrons */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none pl-6 pr-2 transition-opacity duration-150"
        style={{ opacity: labelOpacity }}
      >
        <span
          className={cn(
            "text-[12.5px] sm:text-[13px] font-semibold tracking-tight transition-colors",
            isLive ? "text-rose-700" : "text-[#2e2640]"
          )}
        >
          {label}
        </span>
        <ChevronRight
          className={cn(
            "w-3.5 h-3.5 ml-1 transition-colors opacity-60",
            isLive ? "text-rose-500" : "text-purple-600"
          )}
        />
      </div>

      {/* Draggable thumb with Phone icon matching Image 1 */}
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-9 h-9 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-75 shadow-md",
          isLive
            ? "bg-rose-600 text-white shadow-rose-500/30"
            : "bg-white text-purple-700 shadow-purple-500/20 border border-purple-100"
        )}
        style={{
          left: `calc(4px + ${dragX}px)`,
        }}
      >
        {isLive ? <Mic className="w-4 h-4 animate-pulse" /> : <Phone className="w-4 h-4" />}
      </div>
    </div>
  );
}

// Priya Phone Card Format matching Image 1
export function PriyaPhoneCard({ call }: { call: ReturnType<typeof usePriyaCall> }) {
  const isLive = call.active;

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#f8f5fd] via-[#f1ecfa] to-[#e8e0f6]">
      {/* Top ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-[#e8e0f6]/60 pointer-events-none" />

      {/* Dedicated Phone Interface Container: Fixed size, centered, remains as it is */}
      <div className="relative z-10 w-full max-w-[340px] sm:max-w-[360px] h-full max-h-[480px] sm:max-h-[500px] flex flex-col justify-between items-center px-4 py-2 sm:py-3">
        {/* Top Status Area */}
        <div className="relative z-10 w-full flex items-center justify-center pt-1 min-h-[28px]">
          {isLive ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-violet-100/90 border border-violet-200 text-violet-800 text-[11px] font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {Math.floor(call.seconds / 60)}:{String(call.seconds % 60).padStart(2, '0')}
              </span>
              <span className="flex items-center gap-0.5 h-2.5 ml-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <i key={i} className="priya-wave-bar" style={{ animationDelay: `${i * 0.12}s` }} />
                ))}
              </span>
            </div>
          ) : (
            <div className="h-6" />
          )}
        </div>

        {/* Priya Avatar Section: Constant dimensions! NEVER expands while scrolling */}
        <div className="relative z-0 w-[240px] sm:w-[260px] h-[200px] sm:h-[220px] flex items-center justify-center overflow-hidden shrink-0">
          {isLive && (
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-purple-400/25 animate-ping pointer-events-none" />
          )}
          <img
            src="/images/priya.webp"
            alt="Priya, AI Voice Agent"
            className="w-full h-full object-contain object-top drop-shadow-sm filter contrast-[1.02] shrink-0"
          />
          {/* Seamless bottom fade into card background */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#f1ecfa] via-[#f1ecfa]/85 to-transparent pointer-events-none" />
        </div>

        {/* Middle & Bottom: Name, Logo, Slider matching Image 1 with balanced spacing */}
        <div className="relative z-10 w-full flex flex-col items-center pb-2">
          {/* Agent Name */}
          <h4 className="text-2xl sm:text-[26px] font-bold text-[#1f1a2e] tracking-tight">
            Priya
          </h4>
          
          {/* VirtualVox Brand Logo */}
          <img
            src="/images/virtualvox-brand.png"
            alt="VIRTUALVOX"
            width={88}
            height={32}
            className="w-22 sm:w-24 h-auto mx-auto mt-1 mb-3.5 opacity-85 object-contain"
          />

          {/* Slider Action Button matching Image 1 */}
          <div className="w-full max-w-[260px] sm:max-w-[280px] mx-auto flex flex-col items-center">
          <SlideToActionButton
            label={
              call.state === 'ending'
                ? 'Ending…'
                : isLive
                ? 'Slide to end'
                : call.checking
                ? 'Checking…'
                : !call.available
                ? 'Check again'
                : 'Slide to answer'
            }
            isLive={isLive}
            disabled={call.state === 'ending' || (!isLive && call.checking)}
            onTrigger={() => {
              if (isLive) {
                call.stop();
              } else if (call.available) {
                void call.start();
              } else {
                void call.retryAvailability();
              }
            }}
          />
          <small className="block text-[10.5px] sm:text-[11px] text-[#6b6280] mt-2 font-medium tracking-tight text-center">
            {isLive
              ? 'Up to 60 seconds · End any time'
              : !call.available
              ? 'Tap to check availability'
              : 'Live demo · Microphone required'}
          </small>
        </div>
      </div>
    </div>
  </div>
);
}

export interface ScrollExpandMediaProps {
  mediaType?: "video" | "image" | "custom";
  mediaSrc?: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
  customMedia?: ReactNode;
  className?: string;
}

export const ScrollExpandMedia = ({
  mediaType = "video",
  mediaSrc = "",
  posterSrc,
  bgImageSrc,
  title = "Never miss a call, never lose a customer",
  date,
  scrollToExpand,
  textBlend = false,
  children,
  customMedia,
  className = "",
}: ScrollExpandMediaProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  // Responsiveness listener
  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile, { passive: true });
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Track scroll progress non-invasively through container sticky track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const clamped = Math.min(Math.max(latest, 0), 1);
    setScrollProgress(clamped);

    // Show content when progress >= 0.42
    if (clamped >= 0.42) {
      setShowContent(true);
    } else if (clamped < 0.32) {
      setShowContent(false);
    }
  });

  // Fixed dialer card dimensions - remains as it is, does not expand on scroll
  const cardWidth = isMobileState ? 320 : 360;
  const cardHeight = isMobileState ? 460 : 500;

  // Only the text heading moves horizontally on scroll
  const textTranslateX = scrollProgress * (isMobileState ? 115 : 110);
  const textOpacity = Math.max(0, 1 - scrollProgress * 2.2);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[150vh] sm:h-[175vh] transition-colors duration-700 ease-in-out ${className}`}
    >
      {/* Sticky viewport frame: locks during scroll progression then releases smoothly */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        {/* Background Ambient Layer */}
        <motion.div
          className="absolute inset-0 z-0 h-full w-full pointer-events-none"
          style={{ opacity: Math.max(0.18, 1 - scrollProgress * 0.85) }}
        >
          <Image
            src={bgImageSrc}
            alt="VirtualVox Ambient Background"
            fill
            sizes="100vw"
            className="object-cover object-center filter blur-[1px] brightness-[0.98]"
            priority
            unoptimized
          />
          {/* Light theme gradient mask for gentle SaaS look */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf8fc]/90 via-[#ffffff]/70 to-[#faf8fc]/95 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100/40 via-transparent to-transparent" />
        </motion.div>

        {/* Content Container */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full h-full flex flex-col items-center justify-center">
          {/* Centered Media & Text Canvas */}
          <div className="flex flex-col items-center justify-center w-full h-full relative">
            
            {/* Split Title: Positioned naturally across upper chest/collar, completely clear of Priya's face */}
            <div
              className={`flex items-center justify-center text-center gap-1 sm:gap-1.5 w-full absolute z-20 pointer-events-none flex-col top-[50%] sm:top-[50%] md:top-[50.5%] -translate-y-1/2 transition-none px-4 ${
                textBlend ? "mix-blend-difference" : ""
              }`}
              style={{ opacity: textOpacity }}
            >
              <motion.h2
                className="text-2xl sm:text-3xl md:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.08] drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]"
                style={{ transform: `translateX(-${textTranslateX}vw)` }}
              >
                {firstWord}
              </motion.h2>
              <motion.h2
                className="text-2xl sm:text-3xl md:text-5xl lg:text-[54px] font-black text-center text-purple-700 tracking-tight leading-[1.08] drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]"
                style={{ transform: `translateX(${textTranslateX}vw)` }}
              >
                {restOfTitle}
              </motion.h2>
            </div>

            {/* Dialer Card Box: Fixed dimensions, remains as it is without expanding */}
            <div
              className="relative z-10 rounded-2xl sm:rounded-3xl overflow-hidden border border-purple-200/80 bg-white"
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                maxWidth: "min(360px, 92vw)",
                maxHeight: isMobileState ? "78vh" : "84vh",
                boxShadow: "0 25px 65px -12px rgba(124, 58, 237, 0.22), 0 0 0 1px rgba(124, 58, 237, 0.12)",
              }}
            >
              {customMedia ? (
                customMedia
              ) : mediaType === "video" ? (
                mediaSrc.includes("youtube.com") ? (
                  <div className="relative w-full h-full pointer-events-none">
                    <iframe
                      width="100%"
                      height="100%"
                      src={
                        mediaSrc.includes("embed")
                          ? `${mediaSrc}${mediaSrc.includes("?") ? "&" : "?"}autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1`
                          : `${mediaSrc.replace("watch?v=", "embed/")}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=${mediaSrc.split("v=")[1] || ""}`
                      }
                      className="w-full h-full rounded-2xl sm:rounded-3xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={mediaSrc}
                      poster={posterSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover rounded-2xl sm:rounded-3xl"
                      controls={false}
                      disablePictureInPicture
                      disableRemotePlayback
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-slate-950/40 pointer-events-none" />
                  </div>
                )
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={mediaSrc}
                    alt={title || "VirtualVox Media"}
                    fill
                    sizes="(max-width: 768px) 94vw, 1200px"
                    className="object-cover rounded-2xl sm:rounded-3xl"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-slate-950/40 pointer-events-none" />
                </div>
              )}

              {/* Optional Children Showcase: Only rendered if children are passed */}
              {children && (
                <motion.div
                  className="absolute inset-0 z-30 p-3 sm:p-5 md:p-8 flex flex-col justify-end overflow-y-auto pointer-events-auto"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{
                    opacity: showContent ? 1 : 0,
                    y: showContent ? 0 : 15,
                    pointerEvents: showContent ? "auto" : "none",
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {children}
                </motion.div>
              )}
            </div>

            {/* Scroll Prompter positioned below the card so it never blocks the slider */}
            {scrollToExpand && (
              <div
                className="absolute -bottom-10 sm:-bottom-12 inset-x-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none z-20"
                style={{ opacity: textOpacity }}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-purple-200/80 text-slate-700 text-[11px] sm:text-xs font-semibold shadow-md">
                  <span>{scrollToExpand}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollExpandMedia;

/**
 * VirtualVoxHeroExpansion:
 * Fully pre-configured, niche-aligned hero expansion section for VirtualVox.
 * Uses Image 1 Priya Card format with interactive Slide-To-Action button inside Image 2 Expanding Card.
 */
export function VirtualVoxHeroExpansion() {
  const call = usePriyaCall();

  return (
    <ScrollExpandMedia
      bgImageSrc="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80"
      title="Never miss another customer."
      textBlend={false}
      customMedia={<PriyaPhoneCard call={call} />}
    />
  );
}
