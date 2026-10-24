'use client';

import React, { useState } from 'react';
import FlowArt, { FlowSection } from '@/components/ui/story-scroll';
import {
  PhoneCall,
  HeartPulse,
  Cpu,
  Landmark,
  ShoppingCart,
  Play,
  Pause,
  ArrowRight,
} from 'lucide-react';

export interface IndustryStoryScrollProps {
  onPlayVoice?: (index: number) => void;
  isSpeaking?: boolean;
}

const industries = [
  {
    num: '01',
    tag: 'BPO & Contact Centers',
    icon: PhoneCall,
    line1: 'Zero Hold.',
    line2: 'Instant',
    line3: 'Answers.',
    desc: 'Autonomous tier-1 call handling that verifies callers in seconds and routes complex inquiries with real-time CRM sync.',
    metrics: [
      { val: '78%', label: 'First-contact resolution' },
      { val: '< 400ms', label: 'Voice latency' },
    ],
    bg: '#f3eefa',
    ink: '#1c132e',
    accent: '#7c3aed',
    border: 'rgba(124, 58, 237, 0.22)',
  },
  {
    num: '02',
    tag: 'Healthcare & Clinics',
    icon: HeartPulse,
    line1: 'More Time',
    line2: 'For Care.',
    line3: '24/7.',
    desc: 'Instant appointment scheduling, clinic hours, and patient triage built with strict HIPAA-conscious guardrails.',
    metrics: [
      { val: '0 min', label: 'Patient hold time' },
      { val: '94%', label: 'Show rate' },
    ],
    bg: '#fcedf3',
    ink: '#2d111e',
    accent: '#e11d48',
    border: 'rgba(225, 29, 72, 0.22)',
  },
  {
    num: '03',
    tag: 'Technology & SaaS',
    icon: Cpu,
    line1: 'Instant',
    line2: 'Developer',
    line3: 'Support.',
    desc: 'Automate API webhook debugging, developer onboarding, and billing questions without long ticket queues.',
    metrics: [
      { val: '92%', label: 'Tier-1 self-serve' },
      { val: '< 1s', label: 'Webhook triage' },
    ],
    bg: '#edf5fc',
    ink: '#0d2238',
    accent: '#0284c7',
    border: 'rgba(2, 132, 199, 0.22)',
  },
  {
    num: '04',
    tag: 'Banking & Fintech',
    icon: Landmark,
    line1: 'Secure.',
    line2: 'Compliant.',
    line3: 'Banking.',
    desc: 'Multi-factor caller verification for balances, branch bookings, and instant fraud escalation with audit-grade security.',
    metrics: [
      { val: 'SOC-2', label: 'Compliant security' },
      { val: '99.9%', label: 'Identity accuracy' },
    ],
    bg: '#eef8f2',
    ink: '#0c271b',
    accent: '#059669',
    border: 'rgba(5, 150, 105, 0.22)',
  },
  {
    num: '05',
    tag: 'Retail & Commerce',
    icon: ShoppingCart,
    line1: 'Drive Sales.',
    line2: 'Answer',
    line3: 'Every Call.',
    desc: 'Real-time package delivery tracking, returns, and inventory checks that keep shoppers informed and buying 24/7.',
    metrics: [
      { val: '+22%', label: 'Cart recovery' },
      { val: '35%', label: 'Fewer support tickets' },
    ],
    bg: '#fef4e8',
    ink: '#2f180a',
    accent: '#ea580c',
    border: 'rgba(234, 88, 12, 0.22)',
  },
];

export function IndustryStoryScroll({
  onPlayVoice,
  isSpeaking = false,
}: IndustryStoryScrollProps) {
  const [activeVoiceIndex, setActiveVoiceIndex] = useState<number | null>(null);

  const handleVoiceToggle = (index: number) => {
    setActiveVoiceIndex(index);
    if (onPlayVoice) {
      onPlayVoice(index);
    }
  };

  return (
    <FlowArt aria-label="VirtualVox Industry Solutions Flow">
      {industries.map((item, index) => {
        const Icon = item.icon;
        const speakingNow = isSpeaking && activeVoiceIndex === index;

        return (
          <FlowSection
            key={item.num}
            aria-label={`${item.num} — ${item.tag}`}
            style={{ backgroundColor: item.bg, color: item.ink }}
          >
            {/* Top Row: Category Pill & Section Number */}
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2.5">
                <span
                  className="px-2.5 py-1 rounded-md text-[11px] font-black tracking-wider text-white"
                  style={{ backgroundColor: item.accent }}
                >
                  {item.num}
                </span>
                <span className="flex items-center gap-1.5 font-bold tracking-wider text-xs sm:text-sm">
                  <Icon size={15} style={{ color: item.accent }} />
                  {item.tag}
                </span>
              </div>

              <span className="hidden sm:inline-block text-[11px] font-semibold tracking-widest uppercase opacity-50">
                VirtualVox Solution
              </span>
            </div>

            <hr className="my-3 sm:my-6 border-none border-t" style={{ borderColor: item.border }} />

            {/* Giant Editorial Typographic Title (3 Lines) */}
            <div className="my-auto">
              <h2 className="text-[clamp(2.6rem,8vw,7.5rem)] font-black leading-[0.88] uppercase tracking-tighter m-0">
                {item.line1}
                <br />
                <span style={{ color: item.accent }}>{item.line2}</span>
                <br />
                {item.line3}
              </h2>
            </div>

            <hr className="my-3 sm:my-6 border-none border-t" style={{ borderColor: item.border }} />

            {/* Bottom Row: Minimalist Description, 2 Metric Pills, Voice Sample and CTA */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mt-auto">
              <p className="max-w-[46ch] text-[clamp(1rem,1.8vw,1.35rem)] font-normal leading-relaxed opacity-80 m-0">
                {item.desc}
              </p>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {item.metrics.map((m, i) => (
                  <div
                    key={i}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white/70 backdrop-blur-md border text-xs font-semibold shadow-xs"
                    style={{ borderColor: item.border }}
                  >
                    <span style={{ color: item.accent }} className="font-extrabold mr-1.5">
                      {m.val}
                    </span>
                    <span className="opacity-75">{m.label}</span>
                  </div>
                ))}

                {onPlayVoice && (
                  <button
                    type="button"
                    onClick={() => handleVoiceToggle(index)}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white text-xs font-bold shadow-xs border transition-transform hover:scale-105 active:scale-95"
                    style={{ borderColor: item.border, color: item.ink }}
                  >
                    {speakingNow ? (
                      <>
                        <Pause size={13} style={{ color: item.accent }} />
                        <span>Pause sample</span>
                      </>
                    ) : (
                      <>
                        <Play size={13} fill="currentColor" style={{ color: item.accent }} />
                        <span>Hear sample</span>
                      </>
                    )}
                  </button>
                )}

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: item.accent }}
                >
                  <span>Deploy</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </FlowSection>
        );
      })}
    </FlowArt>
  );
}

export default IndustryStoryScroll;
