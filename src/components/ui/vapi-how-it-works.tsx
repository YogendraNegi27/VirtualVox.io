'use client';

import React from 'react';

export interface VapiStep {
  id: string;
  pill: string;
  pillBg: string;
  pillTextColor: string;
  description: string;
}

export interface VapiHowItWorksProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  id?: string;
}

const DEFAULT_STEPS: VapiStep[] = [
  {
    id: 'context',
    pill: 'Give your agent context',
    pillBg: '#88BFA8',
    pillTextColor: '#143527',
    description: 'Provide instructions and tools, and configure as if you were building it yourself',
  },
  {
    id: 'models',
    pill: 'Pick your models',
    pillBg: '#B55325',
    pillTextColor: '#FFFFFF',
    description: 'Choose from 200+ built-in integrations or connect your own model.',
  },
  {
    id: 'data',
    pill: 'Integrate your business data',
    pillBg: '#C49E44',
    pillTextColor: '#FFFFFF',
    description: 'Integrate your authenticated internal API services to fetch data and perform actions',
  },
  {
    id: 'production',
    pill: 'Tune and observe in production',
    pillBg: '#0A0A0A',
    pillTextColor: '#FFFFFF',
    description: 'Catch hallucinations before they go live with evals and observability stack support.',
  },
];

const BORDER_COLOR = '#CDC7BA';

export function VapiHowItWorks({
  eyebrow = 'HOW IT WORKS',
  title = 'From silence to speech in minutes',
  subtitle = 'Deploy production-ready voice agents in minutes, then customize every interaction as you scale.',
  className = '',
  id = 'how-it-works',
}: VapiHowItWorksProps) {
  return (
    <section
      id={id}
      className={`relative w-full py-10 sm:py-14 bg-[#F4F2ED] text-[#161614] overflow-hidden ${className}`}
      aria-label="How it works"
    >
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* ========================================================
            HEADER AREA:
            Clean off-white canvas with NO background grid lines behind text
        ======================================================== */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          {eyebrow && (
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#6E6B63] uppercase mb-2 sm:mb-3">
              {eyebrow}
            </p>
          )}

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#161614] leading-[1.15]">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-[#6E6B63] leading-relaxed max-w-lg mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* ========================================================
            DESKTOP STAIRCASE (md:grid >= 768px):
            Compact 4-tier diagonal staircase:
            - Step 4 on its OWN separate line (Row 4)
            - Reduced space between columns and rows
            - NO top or bottom border lines
            - NO leftmost or rightmost vertical lines
            - Lines closely attached to the colored text & steps
        ======================================================== */}
        <div className="hidden md:grid grid-cols-4 w-full max-w-4xl mx-auto">
          {/* ROW 1: Step 1 (Col 1) */}
          <div
            className="py-2.5 px-3 lg:py-3 lg:px-4 flex flex-col justify-start items-start"
            style={{
              borderRight: `1px solid ${BORDER_COLOR}`,
              borderBottom: `1px solid ${BORDER_COLOR}`,
            }}
          >
            <span
              className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight shadow-xs transition-transform duration-200 hover:scale-[1.02] cursor-default"
              style={{
                backgroundColor: DEFAULT_STEPS[0].pillBg,
                color: DEFAULT_STEPS[0].pillTextColor,
              }}
            >
              {DEFAULT_STEPS[0].pill}
            </span>
            <p className="mt-2 text-xs lg:text-[13px] text-[#2C2924] font-normal leading-snug max-w-[210px]">
              {DEFAULT_STEPS[0].description}
            </p>
          </div>
          {/* Row 1 Col 2..4: Clean blank canvas */}
          <div />
          <div />
          <div />

          {/* ROW 2: Step 2 (Col 2) */}
          {/* Row 2 Col 1: Vertical divider continuation */}
          <div style={{ borderRight: `1px solid ${BORDER_COLOR}` }} />
          {/* Row 2 Col 2: Step 2 Card */}
          <div
            className="py-2.5 px-3 lg:py-3 lg:px-4 flex flex-col justify-start items-start"
            style={{
              borderRight: `1px solid ${BORDER_COLOR}`,
              borderBottom: `1px solid ${BORDER_COLOR}`,
            }}
          >
            <span
              className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight shadow-xs transition-transform duration-200 hover:scale-[1.02] cursor-default"
              style={{
                backgroundColor: DEFAULT_STEPS[1].pillBg,
                color: DEFAULT_STEPS[1].pillTextColor,
              }}
            >
              {DEFAULT_STEPS[1].pill}
            </span>
            <p className="mt-2 text-xs lg:text-[13px] text-[#2C2924] font-normal leading-snug max-w-[210px]">
              {DEFAULT_STEPS[1].description}
            </p>
          </div>
          {/* Row 2 Col 3..4: Clean blank canvas */}
          <div />
          <div />

          {/* ROW 3: Step 3 (Col 3) */}
          {/* Row 3 Col 1: Clean blank canvas */}
          <div />
          {/* Row 3 Col 2: Vertical divider continuation */}
          <div style={{ borderRight: `1px solid ${BORDER_COLOR}` }} />
          {/* Row 3 Col 3: Step 3 Card */}
          <div
            className="py-2.5 px-3 lg:py-3 lg:px-4 flex flex-col justify-start items-start"
            style={{
              borderRight: `1px solid ${BORDER_COLOR}`,
              borderBottom: `1px solid ${BORDER_COLOR}`,
            }}
          >
            <span
              className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight shadow-xs transition-transform duration-200 hover:scale-[1.02] cursor-default"
              style={{
                backgroundColor: DEFAULT_STEPS[2].pillBg,
                color: DEFAULT_STEPS[2].pillTextColor,
              }}
            >
              {DEFAULT_STEPS[2].pill}
            </span>
            <p className="mt-2 text-xs lg:text-[13px] text-[#2C2924] font-normal leading-snug max-w-[210px]">
              {DEFAULT_STEPS[2].description}
            </p>
          </div>
          {/* Row 3 Col 4: Clean blank canvas */}
          <div />

          {/* ROW 4: Step 4 (Col 4 - SEPARATE LINE) */}
          {/* Row 4 Col 1..2: Clean blank canvas */}
          <div />
          <div />
          {/* Row 4 Col 3: Vertical divider continuation */}
          <div style={{ borderRight: `1px solid ${BORDER_COLOR}` }} />
          {/* Row 4 Col 4: Step 4 Card (NO right or bottom border) */}
          <div className="py-2.5 px-3 lg:py-3 lg:px-4 flex flex-col justify-start items-start">
            <span
              className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight shadow-xs transition-transform duration-200 hover:scale-[1.02] cursor-default"
              style={{
                backgroundColor: DEFAULT_STEPS[3].pillBg,
                color: DEFAULT_STEPS[3].pillTextColor,
              }}
            >
              {DEFAULT_STEPS[3].pill}
            </span>
            <p className="mt-2 text-xs lg:text-[13px] text-[#2C2924] font-normal leading-snug max-w-[210px]">
              {DEFAULT_STEPS[3].description}
            </p>
          </div>
        </div>

        {/* ========================================================
            MOBILE / TABLET VIEW (< 768px):
            Clean Steps Separated by Thin Dividing Lines.
            NO top or bottom outer borders, NO side borders.
        ======================================================== */}
        <div className="block md:hidden w-full max-w-md mx-auto">
          {DEFAULT_STEPS.map((step, idx) => (
            <div
              key={step.id}
              className="py-3.5 px-1 sm:px-2 flex flex-col items-start"
              style={{
                borderBottom: idx === DEFAULT_STEPS.length - 1 ? 'none' : `1px solid ${BORDER_COLOR}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight shadow-2xs"
                  style={{
                    backgroundColor: step.pillBg,
                    color: step.pillTextColor,
                  }}
                >
                  {step.pill}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#36332E] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default VapiHowItWorks;
