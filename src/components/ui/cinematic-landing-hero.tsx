// src/components/ui/cinematic-landing-hero.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Phone, ArrowRight, Mic, MicOff, Volume2, Check } from "lucide-react";
import { usePriyaCall } from "../usePriyaCall";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  .bg-grid-theme {
      background-size: 50px 50px;
      background-image: 
          linear-gradient(to right, rgba(124, 58, 237, 0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(124, 58, 237, 0.06) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 72%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 72%);
  }

  .text-3d-matte {
      color: #20283d;
      text-shadow: 
          0 10px 24px rgba(124, 58, 237, 0.12), 
          0 2px 4px rgba(32, 40, 61, 0.08);
  }

  .text-silver-matte {
      background: linear-gradient(180deg, #544370 0%, #7c3aed 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
  }

  .text-card-silver-matte {
      background: linear-gradient(180deg, #3b2064 0%, #6d28d9 55%, #9333ea 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0px 4px 10px rgba(124, 58, 237, 0.15));
  }

  /* Mix of Light Purple and Soft Lavender Depth Card */
  .premium-depth-card {
      background: linear-gradient(145deg, #faf7fe 0%, #f1eafc 50%, #e6dcf9 100%);
      box-shadow: 
          0 24px 60px -15px rgba(124, 58, 237, 0.14),
          0 10px 24px -10px rgba(78, 55, 128, 0.08),
          inset 0 1px 2px rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(168, 85, 247, 0.22);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(650px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.35) 0%, transparent 40%);
      mix-blend-mode: overlay; transition: opacity 0.3s ease;
  }

  .iphone-bezel {
      background-color: #ffffff;
      box-shadow: 
          inset 0 0 0 2px #e9e4f5, 
          inset 0 0 0 6px #f3eefb, 
          0 25px 60px -10px rgba(124, 58, 237, 0.18),
          0 10px 20px -5px rgba(32, 24, 60, 0.08);
      transform-style: preserve-3d;
  }

  .screen-glare {
      background: linear-gradient(110deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%);
  }

  .btn-modern-light {
      background: linear-gradient(180deg, #FFFFFF 0%, #F5F3FF 100%);
      color: #20283d;
      box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.15), 0 2px 4px rgba(0,0,0,0.06), 0 10px 20px -4px rgba(124, 58, 237, 0.15);
      transition: all 0.25s ease;
  }
  .btn-modern-light:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.28), 0 6px 14px -2px rgba(124, 58, 237, 0.25);
  }

  .btn-modern-dark {
      background: linear-gradient(180deg, #24212c 0%, #17141b 100%);
      color: #FFFFFF;
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15), 0 3px 5px rgba(32, 23, 40, 0.15), 0 10px 24px -4px rgba(32, 23, 40, 0.3);
      transition: all 0.25s ease;
  }
  .btn-modern-dark:hover {
      transform: translateY(-2px);
      background: linear-gradient(180deg, #373342 0%, #24212c 100%);
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.25);
  }

  /* Light Purple & Lavender Priya Phone Screen */
  .priya-phone-bg {
      background: linear-gradient(180deg, #fcfbff 0%, #f4eeff 55%, #eadefe 100%);
  }

  .priya-answer-btn {
      --call-icon-size: 38px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 48px;
      padding: 0;
      border: 1px solid #a78aff;
      border-radius: 60px;
      background: rgba(255, 255, 255, 0.85);
      color: #17141b;
      font-size: 13px;
      font-weight: 600;
      line-height: 1.2;
      transition: background .2s, box-shadow .2s, transform .15s;
      cursor: pointer;
      user-select: none;
      backdrop-filter: blur(10px);
  }
  .priya-answer-btn:hover {
      background: #ffffff;
      box-shadow: 0 4px 20px rgba(124, 58, 237, 0.2);
  }
  .priya-answer-btn:active {
      transform: scale(0.98);
  }
  .priya-answer-btn[aria-pressed='true'] {
      border-color: #f43f5e;
      background: #fff1f2;
      color: #be123c;
  }
  .priya-answer-btn[aria-pressed='true'] .priya-phone-icon {
      color: #e11d48;
      transform: rotate(135deg);
  }
  .priya-phone-icon {
      position: absolute;
      left: 6px;
      top: calc(50% - var(--call-icon-size) / 2);
      width: var(--call-icon-size);
      height: var(--call-icon-size);
      display: grid;
      place-items: center;
      border-radius: 100%;
      background: white;
      color: #7c3aed;
      box-shadow: 0 2px 5px rgba(37, 32, 54, 0.2);
      transition: transform .2s, color .2s;
  }
  .priya-wave-bar {
      width: 2px;
      height: 12px;
      background: #7c3aed;
      border-radius: 4px;
      animation: voiceWavePulse .7s ease-in-out infinite alternate;
  }
  @keyframes voiceWavePulse {
      to { transform: scaleY(0.3); }
  }
`;

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
      gsap.set(".main-card", { y: window.innerHeight + 120, autoAlpha: 1 });
      gsap.set([".card-left-text", ".card-right-text", ".mockup-scroll-wrapper"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.95, y: 15 });

      const introTl = gsap.timeline({ delay: 0.05 });
      introTl
        .to(".text-track", { duration: 0.8, autoAlpha: 1, y: 0, scale: 1, ease: "power2.out" })
        .to(".text-days", { duration: 0.8, autoAlpha: 1, y: 0, scale: 1, ease: "power2.out" }, "-=0.4");

      // Smooth scroll distance: 1200px on desktop, 850px on mobile
      const scrollDistance = isMobile ? "+=850" : "+=1250";

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: scrollDistance,
          pin: true,
          scrub: 0.4, // Responsive & fluid
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
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-60" aria-hidden="true" />

      {/* BACKGROUND LAYER 1: Hero Texts */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-full max-w-5xl px-4 sm:px-6 top-[28%] sm:top-1/2 -translate-y-1/2 will-change-transform">
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
                  <div className="absolute inset-[5px] priya-phone-bg rounded-[2.2rem] overflow-hidden shadow-[inset_0_0_12px_rgba(124,58,237,0.1)] text-[#1f1a2e] z-10 flex flex-col justify-between p-4 pt-6">
                    <div className="absolute inset-0 screen-glare z-40 pointer-events-none" aria-hidden="true" />

                    {/* Dynamic Island Notch */}
                    <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[84px] h-[22px] bg-[#1a1429] rounded-full z-50 flex items-center justify-center px-2 shadow-inner">
                      <div className="w-2 h-2 rounded-full bg-[#111]" />
                    </div>

                    {/* Top Status & Priya Avatar Header */}
                    <div className="relative w-full text-center mt-2 z-20">
                      {/* Avatar Image */}
                      <div className="relative w-24 h-24 sm:w-26 sm:h-26 mx-auto mb-1.5 overflow-hidden rounded-full border-3 border-white shadow-md shadow-purple-500/15">
                        <img 
                          src="/images/priya.webp" 
                          alt="Priya, AI Voice Agent" 
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      {/* Agent Name & VirtualVox Brand */}
                      <h4 className="text-lg font-bold text-[#1f1a2e] tracking-tight">Priya</h4>
                      <img 
                        src="/images/virtualvox-brand.png" 
                        alt="VIRTUALVOX" 
                        className="w-20 h-auto mx-auto mt-0.5 opacity-75"
                      />
                    </div>

                    {/* Call Status & Interactive Answer Button */}
                    <div className="relative w-full text-center z-20 pb-1">
                      {/* Live Call Timer & Waveform */}
                      {call.state === 'live' && (
                        <div className="flex items-center justify-center gap-1.5 text-violet-700 text-[11px] font-semibold mb-1.5">
                          <span>
                            {Math.floor(call.seconds / 60)}:{String(call.seconds % 60).padStart(2, '0')}
                          </span>
                          <span className="flex items-center gap-1 h-2.5">
                            {[0, 1, 2, 3, 4].map(i => (
                              <i key={i} className="priya-wave-bar" style={{ animationDelay: `${i * 0.12}s` }} />
                            ))}
                          </span>
                        </div>
                      )}

                      {/* Main Interactive Button */}
                      {call.used && !playing ? (
                        <a 
                          href="#contact" 
                          className="priya-answer-btn !h-[44px] !text-[12px]"
                        >
                          <span>Contact for subscription</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="priya-answer-btn !h-[46px] !text-[13px]"
                          aria-pressed={playing}
                          onClick={() => {
                            if (playing) {
                              call.stop();
                            } else if (call.available) {
                              void call.start();
                            } else {
                              void call.retryAvailability();
                            }
                          }}
                          disabled={call.state === 'ending' || (!playing && call.checking)}
                        >
                          <span className="priya-phone-icon !w-[32px] !h-[32px]">
                            <Phone size={15} fill="currentColor" />
                          </span>
                          <span className="pl-7">
                            {call.state === 'ending' ? 'Ending…' 
                              : playing ? 'End call' 
                              : call.checking ? 'Checking…' 
                              : !call.available ? 'Check again' 
                              : 'Click to answer'}
                          </span>
                        </button>
                      )}

                      {/* Call Note */}
                      <small className="block text-[9px] text-[#766d86] mt-1.5 font-medium">
                        {playing ? 'Up to 60 seconds · End any time' 
                          : call.used ? 'Free demo used' 
                          : !call.available ? 'Tap to check availability' 
                          : 'Live demo · Microphone required'}
                      </small>

                      {/* Audio Controls during live call */}
                      {call.state === 'live' && (
                        <div className="flex items-center justify-center gap-1.5 mt-1.5">
                          <button
                            onClick={call.toggleMute}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/80 border border-purple-200 text-purple-800 shadow-sm"
                          >
                            {call.muted ? <MicOff size={11} /> : <Mic size={11} />}
                            <span>{call.muted ? 'Unmute' : 'Mute'}</span>
                          </button>
                          {call.playbackBlocked && (
                            <button
                              onClick={call.playAudio}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-600 text-white shadow-sm"
                            >
                              <Volume2 size={11} />
                              <span>Play Audio</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Error Banner */}
                      {call.error && (call.available || playing) && !(call.used && !playing) && (
                        <p className="text-[9px] text-rose-600 mt-1 font-medium bg-rose-50 rounded-lg p-1 border border-rose-200">
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
