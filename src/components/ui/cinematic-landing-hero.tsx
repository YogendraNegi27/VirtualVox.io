// src/components/ui/cinematic-landing-hero.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Phone, ArrowRight, Mic, MicOff, Volume2, Check, ChevronRight } from "lucide-react";
import { usePriyaCall } from "../usePriyaCall";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SlideToActionButtonProps {
  label: string;
  isLive?: boolean;
  disabled?: boolean;
  onTrigger: () => void;
}

function SlideToActionButton({
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
      const thumbWidth = 36;
      const padding = 8; // 4px each side
      maxDragRef.current = Math.max(0, trackWidth - thumbWidth - padding);
    }
  }, []);

  useEffect(() => {
    updateBounds();
    window.addEventListener("resize", updateBounds);
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
    } catch {
      // fallback
    }
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
    } catch {
      // fallback
    }

    const threshold = maxDragRef.current * 0.48;
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
  const labelOpacity = Math.max(0.08, 1 - progress * 1.6);

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
        "relative w-full h-[46px] rounded-full overflow-hidden select-none touch-none transition-all duration-200 border cursor-pointer",
        isLive
          ? "bg-rose-50/90 border-rose-300 shadow-[0_2px_10px_rgba(244,63,94,0.15)]"
          : "bg-white/85 border-[#a78aff]/70 shadow-[0_2px_12px_rgba(124,58,237,0.12)]",
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
          width: `${dragX + 36}px`,
        }}
      />

      {/* Centered label and directional chevrons */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none pl-6 pr-2 transition-opacity duration-150"
        style={{ opacity: labelOpacity }}
      >
        <span
          className={cn(
            "text-[12px] sm:text-[12.5px] font-semibold tracking-tight transition-colors",
            isLive ? "text-rose-700 font-bold" : "text-violet-950"
          )}
        >
          {label}
        </span>
        {!disabled && !isLive && (
          <div className="flex items-center -space-x-1 ml-1.5 opacity-60">
            <ChevronRight size={13} className="text-violet-600 animate-pulse" />
            <ChevronRight size={13} className="text-violet-600 animate-pulse" style={{ animationDelay: '0.15s' }} />
          </div>
        )}
      </div>

      {/* Draggable thumb button */}
      <div
        className={cn(
          "absolute top-[4px] left-[4px] w-[36px] h-[36px] rounded-full flex items-center justify-center text-white shadow-md z-10",
          isDragging ? "transition-none scale-105" : "transition-transform duration-250 ease-out",
          isLive
            ? "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/40"
            : "bg-gradient-to-br from-violet-600 to-purple-500 shadow-purple-600/35"
        )}
        style={{
          transform: `translateX(${dragX}px)`,
        }}
      >
        <Phone
          size={15}
          fill="currentColor"
          className={cn(
            "transition-transform duration-200",
            isLive ? "rotate-[135deg]" : ""
          )}
        />
      </div>
    </div>
  );
}

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  ctaHeading?: string;
  ctaDescription?: string;
}

export function CinematicHero({ 
  brandName = "VIRTUALVOX",
  tagline1 = "Never miss a call,",
  tagline2 = "never lose a customer.",
  cardHeading = "Conversations, perfected.",
  cardDescription = (
    <>
      <span className="text-[#20283d] font-bold">VIRTUALVOX</span> powers enterprise operations with intelligent voice AI agents that answer instantly, handle complex inquiries, schedule appointments, and integrate directly with your tools.
    </>
  ),
  ctaHeading = "Elevate your voice operations.",
  ctaDescription = "Join forward-thinking teams delivering instant, remarkably human customer conversations 24/7.",
  className, 
  ...props 
}: CinematicHeroProps) {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  // Priya Live Call Hook
  const call = usePriyaCall();
  const playing = call.active;

  // 1. Mouse Interaction Logic (Lightweight & Throttled)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 1.5) return;

      cancelAnimationFrame(requestRef.current);
      
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          
          mainCardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);

          if (window.innerWidth >= 1024) {
            const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
            const yVal = (e.clientY / window.innerHeight - 0.5) * 2;

            gsap.to(mockupRef.current, {
              rotationY: xVal * 6,
              rotationX: -yVal * 6,
              ease: "power2.out",
              duration: 0.6,
            });
          }
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 2. Hyper-Optimized Snappy Scroll Timeline (Zero Sticking, Instant Up & Down)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      gsap.set(".text-track", { autoAlpha: 0, y: 35, scale: 0.96 });
      gsap.set(".text-days", { autoAlpha: 0, y: 35, scale: 0.96 });
      const initialCardY = isMobile ? window.innerHeight * 0.72 : window.innerHeight + 120;
      gsap.set(".main-card", { y: initialCardY, autoAlpha: 1 });
      gsap.set([".card-left-text", ".card-right-text", ".mockup-scroll-wrapper"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.95, y: 15 });

      const introTl = gsap.timeline({ delay: 0.05 });
      introTl
        .to(".text-track", { duration: 0.8, autoAlpha: 1, y: 0, scale: 1, ease: "power2.out" })
        .to(".text-days", { duration: 0.8, autoAlpha: 1, y: 0, scale: 1, ease: "power2.out" }, "-=0.4");

      // Smooth scroll distance: 1250px on desktop/laptop, 520px responsive & fast on mobile
      const scrollDistance = isMobile ? "+=520" : "+=1250";

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: scrollDistance,
          pin: true,
          scrub: isMobile ? 0.6 : 0.4, // Responsive & fluid dampening
          anticipatePin: 1,
        },
      });

      scrollTl
        .to(".hero-text-wrapper", { y: -45, autoAlpha: 0, ease: "power2.out", duration: 0.4 }, 0)
        .to(".main-card", { y: 0, autoAlpha: 1, ease: "power2.out", duration: 0.55 }, 0)
        .to(".mockup-scroll-wrapper", { autoAlpha: 1, scale: 1, ease: "power2.out", duration: 0.45 }, 0.15)
        .to([".card-left-text", ".card-right-text"], { autoAlpha: 1, ease: "power2.out", duration: 0.45 }, 0.2)
        .to({}, { duration: 0.55 }) // Interactive hold for Priya call demo
        .to([".mockup-scroll-wrapper", ".card-left-text", ".card-right-text"], {
          y: -25, autoAlpha: 0, ease: "power2.in", duration: 0.35,
        })
        // CRITICAL FIX: Animate main-card completely off-screen AND fade to 0 so it never overlaps or hides CTA content
        .to(".main-card", { 
          y: -window.innerHeight * 1.25, 
          autoAlpha: 0, 
          ease: "power2.in", 
          duration: 0.55 
        }, "-=0.1")
        // CTA smoothly scales in with full clearance and high z-index
        .to(".cta-wrapper", { 
          autoAlpha: 1, 
          scale: 1, 
          y: 0, 
          ease: "power2.out", 
          duration: 0.45 
        }, "-=0.2")
        .to({}, { duration: 0.35 });

    }, containerRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []); 

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-[100svh] min-h-[520px] overflow-hidden flex items-center justify-center bg-gradient-to-b from-white via-[#faf7fe] to-white text-[#20283d] font-sans antialiased", className)}
      style={{ perspective: "1200px" }}
      {...props}
    >
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-60" aria-hidden="true" />

      {/* BACKGROUND LAYER 1: Hero Texts */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-full max-w-5xl px-4 sm:px-6 top-[20%] sm:top-[23%] md:top-[25%] -translate-y-1/2 will-change-transform">
        <span className="eyebrow mb-1.5 sm:mb-2 uppercase tracking-widest text-[10px] sm:text-[11px] font-bold text-[#7c3aed]">
          Enterprise Voice AI Engine
        </span>
        <h1 className="text-track gsap-reveal text-3d-matte text-2xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.2rem] font-bold tracking-tight mb-1 sm:mb-2 leading-[1.12]">
          {tagline1}
        </h1>
        <h1 className="text-days gsap-reveal text-silver-matte text-2xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.2rem] font-extrabold tracking-tighter leading-[1.12]">
          {tagline2}
        </h1>
      </div>

      {/* BACKGROUND LAYER 2: Tactile CTA Buttons */}
      <div className="cta-wrapper absolute z-30 flex flex-col items-center justify-center text-center w-full max-w-4xl px-4 sm:px-6 gsap-reveal pointer-events-auto will-change-transform">
        <span className="eyebrow mb-2 sm:mb-3 uppercase tracking-widest text-[10px] sm:text-xs font-bold text-[#7c3aed]">
          Enterprise Voice AI Engine
        </span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2.5 sm:mb-4 tracking-tight text-[#20283d] leading-[1.12]">
          {ctaHeading}
        </h2>
        <p className="text-[#697084] text-xs sm:text-base md:text-lg mb-6 sm:mb-8 max-w-xl mx-auto font-normal leading-relaxed px-3">
          {ctaDescription}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
          <a 
            href="#contact" 
            aria-label="Book a demonstration" 
            className="btn-modern-dark w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-[1.25rem] group font-semibold text-xs sm:text-sm shadow-md"
          >
            <span>Book a Demo</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a 
            href="#demo" 
            aria-label="Hear voice demo" 
            className="btn-modern-light w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-[1.25rem] group font-semibold text-xs sm:text-sm"
          >
            <span>Hear Voice Demo</span>
          </a>
        </div>
      </div>

      {/* FOREGROUND LAYER: The Physical Light Purple & Lavender Card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1200px" }}>
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[94vw] sm:w-[92vw] max-w-6xl h-[82svh] sm:h-[86vh] max-h-[580px] sm:max-h-[640px] rounded-[22px] sm:rounded-[28px] md:rounded-[32px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          {/* BALANCED 3-COLUMN RESPONSIVE LAYOUT */}
          <div className="relative w-full h-full mx-auto px-3 sm:px-6 lg:px-8 flex flex-col justify-center md:flex-row md:items-center md:justify-around lg:grid lg:grid-cols-12 lg:gap-4 z-10 py-3 sm:py-4 lg:py-2">
            
            {/* 1. LEFT COLUMN: ELEGANT LIVE VOICE CONVERSATION CARD (Matching Screenshot 3) */}
            <div className="card-left-text gsap-reveal order-2 md:order-1 lg:order-1 lg:col-span-4 flex flex-col justify-center items-center lg:items-start z-20 w-full px-1 sm:px-2">
              <div className="w-full max-w-[285px] sm:max-w-[340px] bg-white/95 backdrop-blur-md rounded-[16px] sm:rounded-[20px] p-2.5 sm:p-4 md:p-5 border border-purple-200/80 shadow-[0_8px_28px_rgba(124,58,237,0.06)]">
                {/* Conversation Status */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] text-[#7c6a99] font-bold uppercase tracking-wider mb-2.5 sm:mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>A sample conversation</span>
                </div>

                {/* Customer Chat Bubble */}
                <div className="bg-[#f2eff8] text-[#544666] text-[11.5px] sm:text-[12.5px] md:text-[13px] leading-relaxed font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-[13px] sm:rounded-[15px] rounded-br-[3px] ml-auto max-w-[88%] mb-2 sm:mb-2.5 shadow-xs">
                  Hi, can I book an appointment?
                </div>

                {/* Agent Chat Bubble */}
                <div className="bg-[#f8f8fc] border border-[#ece8f4] text-[#20283d] text-[11.5px] sm:text-[12.5px] md:text-[13px] leading-relaxed font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-[13px] sm:rounded-[15px] rounded-bl-[3px] max-w-[92%] shadow-xs">
                  Absolutely. Let’s find a time that works for you.
                  <span className="flex items-center gap-1 mt-1 sm:mt-1.5 h-2">
                    <i className="w-1.5 h-1.5 rounded-full bg-[#9b8db3] animate-pulse" />
                    <i className="w-1.5 h-1.5 rounded-full bg-[#9b8db3] animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <i className="w-1.5 h-1.5 rounded-full bg-[#9b8db3] animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </span>
                </div>

                {/* Voice Recording Waveform Bar */}
                <div className="flex items-center gap-2 sm:gap-3 mt-2.5 sm:mt-3.5 pt-2 sm:pt-2.5 border-t border-purple-100/70">
                  <Mic size={16} className="text-[#7c3aed] flex-shrink-0 animate-pulse" />
                  <div className="flex items-center gap-[2px] h-5 sm:h-6 overflow-hidden flex-1">
                    {[10, 16, 24, 12, 28, 18, 22, 14, 26, 20, 15, 27, 11, 19, 23, 16, 21, 9, 17, 25, 13, 20].map((h, i) => (
                      <i
                        key={i}
                        className="w-[2px] sm:w-[2.5px] rounded-full bg-[#9b83ed] animate-pulse"
                        style={{
                          height: `${h}px`,
                          animationDuration: `${0.7 + (i % 4) * 0.18}s`,
                          animationDelay: `${(i * 0.05).toFixed(2)}s`,
                        }}
                      />
                    ))}
                  </div>
                  <img
                    src="/images/virtualvox-brand.png"
                    alt="VIRTUALVOX"
                    width={84}
                    height={31}
                    className="inline-brand !w-[72px] sm:!w-[84px] h-auto opacity-75 ml-auto object-contain flex-shrink-0"
                  />
                </div>
              </div>
            </div>

            {/* 2. CENTER COLUMN: IPHONE MOCKUP WITH PRIYA CALL FUNCTIONALITY */}
            <div className="mockup-scroll-wrapper order-1 md:order-2 lg:order-2 lg:col-span-4 relative w-full h-[270px] sm:h-[340px] md:h-[400px] lg:h-[480px] flex items-center justify-center z-10">
              
              <div className="relative flex items-center justify-center transform scale-[0.58] xs:scale-[0.66] sm:scale-[0.74] md:scale-[0.82] lg:scale-[0.92] xl:scale-100">
                
                {/* The iPhone Bezel */}
                <div
                  ref={mockupRef}
                  className="relative w-[240px] sm:w-[250px] h-[460px] sm:h-[480px] rounded-[2.5rem] iphone-bezel flex flex-col will-change-transform transform-style-3d"
                >
                  {/* Physical Hardware Buttons */}
                  <div className="absolute top-[90px] -left-[3px] w-[3px] h-[20px] bg-purple-300 rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[125px] -left-[3px] w-[3px] h-[35px] bg-purple-300 rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[170px] -left-[3px] w-[3px] h-[35px] bg-purple-300 rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[135px] -right-[3px] w-[3px] h-[55px] bg-purple-300 rounded-r-md z-0 scale-x-[-1]" aria-hidden="true" />

                  {/* Inner Screen: Light Purple & Lavender Priya Live Demo */}
                  <div className="absolute inset-[5px] priya-phone-bg rounded-[2.2rem] overflow-hidden shadow-[inset_0_0_12px_rgba(124,58,237,0.1)] text-[#1f1a2e] z-10 flex flex-col justify-between p-4 pt-7 pb-3.5">
                    <div className="absolute inset-0 screen-glare z-40 pointer-events-none" aria-hidden="true" />

                    {/* Dynamic Island Notch */}
                    <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[84px] h-[22px] bg-[#1a1429] rounded-full z-50 flex items-center justify-center px-2 shadow-inner">
                      <div className="w-2 h-2 rounded-full bg-[#111]" />
                    </div>

                    {/* Top Status Area */}
                    <div className="relative w-full text-center z-20 h-5">
                      {call.state === 'live' ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[11px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>
                            {Math.floor(call.seconds / 60)}:{String(call.seconds % 60).padStart(2, '0')}
                          </span>
                          <span className="flex items-center gap-0.5 h-2.5 ml-0.5">
                            {[0, 1, 2, 3, 4].map(i => (
                              <i key={i} className="priya-wave-bar" style={{ animationDelay: `${i * 0.12}s` }} />
                            ))}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600/75">
                          VirtualVox Voice
                        </span>
                      )}
                    </div>

                    {/* Centered Priya Avatar & Agent Info */}
                    <div className="relative w-full my-auto flex flex-col items-center justify-center text-center z-20 py-1">
                      {/* Avatar Image with subtle ring */}
                      <div className="relative mx-auto mb-2">
                        {playing && (
                          <span className="absolute -inset-1 rounded-full bg-purple-400/30 animate-ping pointer-events-none" />
                        )}
                        <div className="relative w-24 h-24 sm:w-26 sm:h-26 overflow-hidden rounded-full border-3 border-white shadow-md shadow-purple-500/20 bg-purple-50">
                          <img 
                            src="/images/priya.webp" 
                            alt="Priya, AI Voice Agent" 
                            width={104}
                            height={104}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      </div>

                      {/* Agent Name & VirtualVox Brand */}
                      <h4 className="text-xl font-bold text-[#1f1a2e] tracking-tight">Priya</h4>
                      <p className="text-[11px] font-semibold text-purple-700 tracking-wide mt-0.5">
                        AI Voice Agent
                      </p>
                      <img 
                        src="/images/virtualvox-brand.png" 
                        alt="VIRTUALVOX" 
                        width={80}
                        height={29}
                        className="w-20 h-auto mx-auto mt-1 opacity-80"
                      />
                    </div>

                    {/* Bottom Call Controls & Slider */}
                    <div className="relative w-full text-center z-20 pb-1">
                      {/* Interactive Slider Button */}
                      {call.used && !playing ? (
                        <a 
                          href="#contact" 
                          className="flex items-center justify-center w-full h-[46px] rounded-full text-[12px] font-semibold text-purple-900 bg-white/90 hover:bg-white border border-[#a78aff]/70 shadow-sm transition-all"
                        >
                          <span>Contact for subscription</span>
                        </a>
                      ) : (
                        <SlideToActionButton
                          label={
                            call.state === 'ending'
                              ? 'Ending…'
                              : playing
                              ? 'Slide to end'
                              : call.checking
                              ? 'Checking…'
                              : !call.available
                              ? 'Slide to check again'
                              : 'Slide to answer'
                          }
                          isLive={playing}
                          disabled={call.state === 'ending' || (!playing && call.checking)}
                          onTrigger={() => {
                            if (playing) {
                              call.stop();
                            } else if (call.available) {
                              void call.start();
                            } else {
                              void call.retryAvailability();
                            }
                          }}
                        />
                      )}

                      {/* Call Note */}
                      <small className="block text-[9.5px] text-[#766d86] mt-2 font-medium">
                        {playing
                          ? 'Up to 60 seconds · End any time'
                          : call.used
                          ? 'Free demo used'
                          : !call.available
                          ? 'Slide or tap to check availability'
                          : 'Live demo · Microphone required'}
                      </small>

                      {/* Audio Controls during live call */}
                      {call.state === 'live' && (
                        <div className="flex items-center justify-center gap-1.5 mt-2">
                          <button
                            onClick={call.toggleMute}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/90 border border-purple-200 text-purple-800 shadow-sm hover:bg-white transition-colors"
                          >
                            {call.muted ? <MicOff size={11} /> : <Mic size={11} />}
                            <span>{call.muted ? 'Unmute' : 'Mute'}</span>
                          </button>
                          {call.playbackBlocked && (
                            <button
                              onClick={call.playAudio}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-violet-600 text-white shadow-sm hover:bg-violet-700 transition-colors"
                            >
                              <Volume2 size={11} />
                              <span>Play Audio</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Error Banner */}
                      {call.error && (call.available || playing) && !(call.used && !playing) && (
                        <p className="text-[9px] text-rose-600 mt-1.5 font-medium bg-rose-50 rounded-lg p-1 border border-rose-200">
                          {call.error}
                        </p>
                      )}
                    </div>

                    {/* Bottom Home Indicator Bar */}
                    <div className="w-20 h-1 bg-black/15 rounded-full mx-auto" />
                  </div>
                </div>

              </div>
            </div>

            {/* 3. RIGHT COLUMN: ELEGANT LIVE VOICE CONFIRMATION CARD (Matching Screenshot 3, visible on lg+ desktop) */}
            <div className="card-right-text gsap-reveal hidden lg:flex order-3 lg:col-span-4 flex-col justify-center items-center lg:items-end z-20 w-full px-2">
              <div className="w-full max-w-[340px] bg-white/95 backdrop-blur-md rounded-[20px] p-4 sm:p-5 border border-purple-200/80 shadow-[0_12px_32px_rgba(124,58,237,0.08)]">
                {/* Conversation Status */}
                <div className="flex items-center gap-2 text-[10px] text-[#7c6a99] font-bold uppercase tracking-wider mb-3">
                  <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                  <span>Real-time voice handoff</span>
                </div>

                {/* Customer Chat Bubble */}
                <div className="bg-[#f2eff8] text-[#544666] text-[12.5px] sm:text-[13px] leading-relaxed font-medium px-4 py-2.5 rounded-[15px] rounded-br-[4px] ml-auto max-w-[88%] mb-2.5 shadow-xs">
                  Would tomorrow at 10:30 am work?
                </div>

                {/* Agent Chat Bubble */}
                <div className="bg-[#f8f8fc] border border-[#ece8f4] text-[#20283d] text-[12.5px] sm:text-[13px] leading-relaxed font-medium px-4 py-2.5 rounded-[15px] rounded-bl-[4px] max-w-[92%] shadow-xs">
                  That works for me. Your appointment is confirmed.
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-1.5 block">
                    <Check size={13} className="text-emerald-500" /> Synced to calendar & CRM
                  </span>
                </div>

                {/* Voice Recording Waveform Bar */}
                <div className="flex items-center gap-3 mt-3.5 pt-2.5 border-t border-purple-100/70">
                  <Mic size={18} className="text-[#7c3aed] flex-shrink-0 animate-pulse" />
                  <div className="flex items-center gap-[2px] h-6 overflow-hidden flex-1">
                    {[12, 20, 14, 26, 17, 10, 23, 28, 15, 21, 9, 24, 18, 27, 12, 19, 15, 22, 8, 25, 14, 21].map((h, i) => (
                      <i
                        key={i}
                        className="w-[2.5px] rounded-full bg-[#9b83ed] animate-pulse"
                        style={{
                          height: `${h}px`,
                          animationDuration: `${0.8 + (i % 4) * 0.16}s`,
                          animationDelay: `${(i * 0.06).toFixed(2)}s`,
                        }}
                      />
                    ))}
                  </div>
                  <img
                    src="/images/virtualvox-brand.png"
                    alt="VIRTUALVOX"
                    width={84}
                    height={31}
                    className="inline-brand !w-[84px] h-auto opacity-75 ml-auto object-contain flex-shrink-0"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CinematicHero;
