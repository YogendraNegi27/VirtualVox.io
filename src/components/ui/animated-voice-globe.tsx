'use client';

import React from 'react';
import Image from 'next/image';

interface AnimatedVoiceGlobeProps {
  active?: boolean;
  className?: string;
  size?: number;
}

export function AnimatedVoiceGlobe({ active = false, className = '' }: AnimatedVoiceGlobeProps) {
  return (
    <div
      className={`relative mx-auto my-2 sm:my-3 flex items-center justify-center select-none ${className}`}
      style={{ perspective: 1000 }}
      aria-hidden="true"
    >
      {/* 1. Ambient Background Glow (Multi-color cyan & lilac aura) */}
      <div
        className={`absolute rounded-full pointer-events-none transition-all duration-700 ease-out ${
          active
            ? 'w-[180px] h-[180px] sm:w-[210px] sm:h-[210px] opacity-90 blur-2xl'
            : 'w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] opacity-60 blur-xl'
        }`}
        style={{
          background: active
            ? 'radial-gradient(circle, rgba(96, 165, 250, 0.55) 0%, rgba(168, 85, 247, 0.45) 45%, rgba(139, 92, 246, 0.15) 70%, transparent 85%)'
            : 'radial-gradient(circle, rgba(96, 165, 250, 0.35) 0%, rgba(168, 85, 247, 0.25) 50%, transparent 75%)',
        }}
      />

      {/* 2. Concentric Soundwave Ripple Rings (Active state pulse, Idle state subtle breathe) */}
      <div
        className={`absolute rounded-full border pointer-events-none transition-opacity duration-500 ${
          active
            ? 'border-purple-400/40 animate-[voiceRipple_2.2s_cubic-bezier(0.1,0.7,0.3,1)_infinite]'
            : 'w-[130px] h-[130px] sm:w-[148px] sm:h-[148px] border-purple-400/15 animate-[subtlePulse_4s_ease-in-out_infinite]'
        }`}
      />
      <div
        className={`absolute rounded-full border pointer-events-none transition-opacity duration-500 ${
          active
            ? 'border-sky-400/35 animate-[voiceRipple_2.2s_cubic-bezier(0.1,0.7,0.3,1)_infinite_0.75s]'
            : 'w-[155px] h-[155px] sm:w-[175px] sm:h-[175px] border-sky-400/10 animate-[subtlePulse_4s_ease-in-out_infinite_1.5s]'
        }`}
      />

      {/* 3. Floating 3D Globe Wrapper */}
      <div
        className={`relative z-10 w-[112px] h-[112px] sm:w-[132px] sm:h-[132px] rounded-full transition-transform duration-500 ${
          active ? 'scale-105' : 'scale-100'
        }`}
        style={{
          animation: active
            ? 'globeFloatActive 2.8s ease-in-out infinite'
            : 'globeFloatIdle 4.5s ease-in-out infinite',
        }}
      >
        {/* Continuous 360° Rotating Sphere */}
        <div
          className="relative w-full h-full rounded-full overflow-hidden"
          style={{
            animation: active
              ? 'globeRotate 8s linear infinite'
              : 'globeRotate 20s linear infinite',
            boxShadow: active
              ? '0 0 35px rgba(96, 165, 250, 0.55), 0 0 50px rgba(168, 85, 247, 0.4), inset 0 2px 6px rgba(255, 255, 255, 0.6)'
              : '0 0 25px rgba(96, 165, 250, 0.35), 0 0 35px rgba(168, 85, 247, 0.25), inset 0 1px 4px rgba(255, 255, 255, 0.4)',
          }}
        >
          {/* Globe Image from User (Transparent cropped circle) */}
          <Image
            src="/images/voice-globe-transparent.png"
            alt="AI Voice Globe"
            fill
            sizes="(max-width: 640px) 112px, 132px"
            className="object-cover rounded-full select-none pointer-events-none filter brightness-[1.04] contrast-[1.03]"
            priority
          />

          {/* Ethereal Surface Specular Sheen (gives glassy 3D orb depth) */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 60%)',
              mixBlendMode: 'screen',
            }}
          />

          {/* Soft Bottom-Rim Shade (enhances spherical form) */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow:
                'inset -4px -6px 14px rgba(17, 12, 34, 0.45), inset 2px 2px 8px rgba(255, 255, 255, 0.3)',
            }}
          />
        </div>
      </div>

      {/* Embedded CSS Animations */}
      <style jsx>{`
        @keyframes globeRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes globeFloatIdle {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-5px) scale(1.015);
          }
        }
        @keyframes globeFloatActive {
          0%,
          100% {
            transform: translateY(0px) scale(1.05);
          }
          50% {
            transform: translateY(-7px) scale(1.08);
          }
        }
        @keyframes voiceRipple {
          0% {
            width: 100px;
            height: 100px;
            opacity: 0.85;
            transform: scale(0.95);
          }
          70% {
            opacity: 0.35;
          }
          100% {
            width: 210px;
            height: 210px;
            opacity: 0;
            transform: scale(1.55);
          }
        }
        @keyframes subtlePulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.35;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
