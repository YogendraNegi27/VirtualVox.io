'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PhoneCall,
  HeartPulse,
  Cpu,
  Landmark,
  ShoppingCart,
  Phone,
  CircleCheck,
  Play,
  Pause,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  ExternalLink,
} from 'lucide-react';

export interface IndustryData {
  id: string;
  name: string;
  tag: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  metrics: { value: string; label: string }[];
  integrations: string[];
  callerLabel: string;
  question: string;
  agentName: string;
  answer: string;
  nextStep: string;
  accentColor: string;
  buttonText: string;
}

export const industriesData: IndustryData[] = [
  {
    id: 'bpo',
    name: 'BPO',
    tag: 'BPO & Contact Centers',
    icon: PhoneCall,
    title: 'Scale contact center operations with AI efficiency.',
    description:
      'Handle high call volumes effortlessly, resolve tier-1 queries, and automate caller verification while routing complex workflows to live agents with full context.',
    metrics: [
      { value: '78%', label: 'First-contact resolution' },
      { value: '< 400ms', label: 'Spoken voice latency' },
      { value: '3.4x', label: 'Call capacity surge' },
    ],
    integrations: ['Genesys', 'Salesforce', 'Zendesk', 'Twilio'],
    callerLabel: 'Enterprise Caller',
    question: 'Can you help me update my account details and verify my recent order?',
    agentName: 'Sofia',
    answer:
      "I'd be happy to help with that. For security, please confirm the email address associated with your account.",
    nextStep: 'Caller verified & CRM record updated in real time.',
    accentColor: '#7761d6',
    buttonText: 'Explore BPO solutions',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    tag: 'Healthcare & Clinics',
    icon: HeartPulse,
    title: 'More time for the people in your care.',
    description:
      'Support patients with 24/7 clinic hours, instant appointment scheduling, prescription status, and triage routing with strict HIPAA-conscious guardrails.',
    metrics: [
      { value: '0 min', label: 'Patient hold time' },
      { value: '94%', label: 'Appointment show rate' },
      { value: '100%', label: 'HIPAA-conscious flow' },
    ],
    integrations: ['Epic Systems', 'AthenaHealth', 'Cerner', 'Google Cal'],
    callerLabel: 'Patient',
    question: "I'd like to schedule an appointment with Dr. Sharma for next Tuesday.",
    agentName: 'Alex',
    answer:
      'I can help with that. Dr. Sharma has openings at 10:30 AM and 2:15 PM next Tuesday. Which time works best for you?',
    nextStep: 'Appointment confirmed & automated SMS sent.',
    accentColor: '#e88b64',
    buttonText: 'Explore Healthcare solutions',
  },
  {
    id: 'technology',
    name: 'Technology',
    tag: 'SaaS & Modern Tech',
    icon: Cpu,
    title: 'Instant developer support and SaaS onboarding.',
    description:
      'Guide users through product setup, troubleshoot API endpoints, answer billing questions, and automatically log issues without long ticket queues.',
    metrics: [
      { value: '92%', label: 'Tier-1 self-serve' },
      { value: '< 1s', label: 'API webhook triage' },
      { value: '24/7', label: 'Global developer support' },
    ],
    integrations: ['GitHub', 'Stripe', 'Postman', 'Slack'],
    callerLabel: 'Developer',
    question: 'How do I configure Webhook endpoints in the developer portal?',
    agentName: 'Priya',
    answer:
      'You can configure Webhooks under Project Settings > Integrations. Would you like me to send you the documentation link?',
    nextStep: 'Developer docs sent & webhook debug logs saved.',
    accentColor: '#506ec2',
    buttonText: 'Explore Technology solutions',
  },
  {
    id: 'financial',
    name: 'Financial Services',
    tag: 'Banking & Fintech',
    icon: Landmark,
    title: 'Secure, compliant assistance for modern banking.',
    description:
      'Guide customers through balance checks, fraud alerts, loan pre-qualifications, and branch consultations with multi-factor caller verification.',
    metrics: [
      { value: 'SOC-2', label: 'Compliant security' },
      { value: '99.9%', label: 'Identity verification' },
      { value: '4.8/5', label: 'Customer CSAT' },
    ],
    integrations: ['Plaid', 'Salesforce FinServ', 'Twilio Flex', 'Stripe'],
    callerLabel: 'Account Holder',
    question: 'I noticed an unrecognized charge on my card and want to report it.',
    agentName: 'James',
    answer:
      'I understand that is urgent. Let me verify your card ending in 4082 and flag that transaction for security review immediately.',
    nextStep: 'Card temporarily protected & fraud team alerted.',
    accentColor: '#8e61c5',
    buttonText: 'Explore Financial solutions',
  },
  {
    id: 'retail',
    name: 'Retail',
    tag: 'Retail & E-commerce',
    icon: ShoppingCart,
    title: 'Drive sales and keep shoppers informed 24/7.',
    description:
      'Answer product queries, check live inventory, handle returns and exchanges, and provide real-time package delivery tracking seamlessly.',
    metrics: [
      { value: '35%', label: 'Fewer tracking inquiries' },
      { value: '+22%', label: 'Conversion & cart recovery' },
      { value: 'Live', label: 'Real-time inventory' },
    ],
    integrations: ['Shopify', 'Klaviyo', 'Gorgias', 'WooCommerce'],
    callerLabel: 'Shopper',
    question: 'Can I check the delivery status of order #VX-9421?',
    agentName: 'Sofia',
    answer:
      'Your package is out for delivery today and estimated to arrive by 4:00 PM. Would you like a tracking link sent to your phone?',
    nextStep: 'Carrier tracking link dispatched via SMS.',
    accentColor: '#398e82',
    buttonText: 'Explore Retail solutions',
  },
];

interface IndustryShowcaseProps {
  onPlayVoice?: (index: number) => void;
  isSpeaking?: boolean;
}

export function IndustryShowcase({
  onPlayVoice,
  isSpeaking = false,
}: IndustryShowcaseProps) {
  const [activeTab, setActiveTab] = useState(0);
  const selected = industriesData[activeTab];

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    if (onPlayVoice && isSpeaking) {
      onPlayVoice(index);
    }
  };

  return (
    <div className="w-full">
      {/* 21st.dev Style Sliding Tab Bar */}
      <div className="relative flex items-center justify-start sm:justify-center p-1.5 bg-[#f5f1fa] border border-[#ebe4f4] rounded-2xl max-w-4xl mx-auto overflow-x-auto scrollbar-none shadow-sm">
        <div role="tablist" aria-label="Industry solutions" className="flex items-center gap-1 min-w-max p-0.5">
          {industriesData.map((item, idx) => {
            const Icon = item.icon;
            const isCurrent = idx === activeTab;
            return (
              <button
                key={item.id}
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={isCurrent}
                aria-controls={`panel-${item.id}`}
                onClick={() => handleTabChange(idx)}
                className={`
                  relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-200
                  ${
                    isCurrent
                      ? 'text-[#20283d]'
                      : 'text-[#6f677d] hover:text-[#20283d] hover:bg-white/40'
                  }
                `}
              >
                {/* 21st.dev Framer Motion Layout Pill */}
                {isCurrent && (
                  <motion.div
                    layoutId="activeIndustryPill"
                    transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                    className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_10px_rgba(32,40,61,0.08)] border border-[#e8e2f2]"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon size={16} className={isCurrent ? 'text-[#7761d6]' : 'text-[#8f85a0]'} />
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Showcase Card */}
      <div className="mt-8 md:mt-10 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            role="tabpanel"
            id={`panel-${selected.id}`}
            aria-labelledby={`tab-${selected.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-6 sm:p-8 md:p-10 rounded-[32px] bg-gradient-to-br from-[#faf8fd] via-[#f7f3fb] to-[#f4eef9] border border-[#ebe2f5] shadow-[0_12px_45px_rgba(119,97,214,0.07)]"
          >
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                {/* Industry Pill Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ece2f7] text-[#6d549c] border border-[#dfd0f0] shadow-sm">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: selected.accentColor }}
                  />
                  {selected.tag}
                </span>

                {/* Main Heading */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#20283d] tracking-tight mt-4 mb-3 leading-[1.2]">
                  {selected.title}
                </h3>

                {/* Narrative description */}
                <p className="text-sm sm:text-base text-[#645d73] leading-relaxed max-w-xl">
                  {selected.description}
                </p>
              </div>

              {/* 3 Metric Badges (Bento Style) */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-3 pt-2">
                {selected.metrics.map((metric, i) => (
                  <div
                    key={i}
                    className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/80 border border-[#ebe4f4] backdrop-blur-sm shadow-sm"
                  >
                    <div
                      className="text-base sm:text-2xl font-extrabold tracking-tight"
                      style={{ color: selected.accentColor }}
                    >
                      {metric.value}
                    </div>
                    <div className="text-[10px] sm:text-xs text-[#756e84] font-medium mt-0.5 leading-snug">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Connected Integrations Row */}
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-[#8b819d] tracking-wide uppercase">
                  Connected tools:
                </span>
                {selected.integrations.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#f0e8f8] text-[#55476a] border border-[#e5d8f2]"
                  >
                    <Layers size={11} className="text-[#8c74b8]" />
                    {tool}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className="button button-dark inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  {selected.buttonText}
                  <ArrowRight size={15} />
                </a>

                {onPlayVoice && (
                  <button
                    type="button"
                    onClick={() => onPlayVoice(activeTab)}
                    className="button button-light inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold shadow-sm hover:bg-white transition-all text-[#393343]"
                  >
                    {isSpeaking ? (
                      <>
                        <Pause size={15} className="text-[#7761d6]" /> Pause sample
                      </>
                    ) : (
                      <>
                        <Play size={15} fill="currentColor" className="text-[#7761d6]" /> Hear live sample
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Right Interactive Voice Call Console (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative rounded-2xl bg-white/95 border border-[#e8dfef] p-5 sm:p-6 shadow-[0_10px_35px_rgba(88,65,130,0.06)] backdrop-blur-md">
                {/* Console Header: Live Voice Status & Waveform */}
                <div className="flex items-center justify-between pb-4 border-b border-[#f0eaf7]">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ backgroundColor: selected.accentColor }}
                      />
                      <span
                        className="relative inline-flex rounded-full h-3 w-3"
                        style={{ backgroundColor: selected.accentColor }}
                      />
                    </span>
                    <div>
                      <span className="block text-xs font-bold text-[#20283d] leading-none">
                        {selected.agentName} from VIRTUALVOX
                      </span>
                      <span className="text-[10px] text-[#8e859f]">
                        Interactive Voice Preview
                      </span>
                    </div>
                  </div>

                  {/* Micro waveform audio bars */}
                  <div className="flex items-center gap-0.5 h-4">
                    {[10, 16, 8, 14, 18, 12, 16].map((h, i) => (
                      <span
                        key={i}
                        className="w-[2px] rounded-full transition-all duration-300"
                        style={{
                          height: isSpeaking ? `${h}px` : '6px',
                          backgroundColor: selected.accentColor,
                          opacity: isSpeaking ? 0.9 : 0.4,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Conversation Chat Bubbles */}
                <div className="py-5 space-y-3.5">
                  {/* Caller Message */}
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-semibold text-[#8b829b] mb-1 mr-1">
                      {selected.callerLabel}
                    </span>
                    <div className="bg-[#f3edf9] text-[#4b415a] text-xs sm:text-sm p-3.5 rounded-2xl rounded-tr-sm max-w-[90%] shadow-sm leading-relaxed border border-[#ece3f5]">
                      {selected.question}
                    </div>
                  </div>

                  {/* Agent Response */}
                  <div className="flex flex-col items-start">
                    <span
                      className="text-[10px] font-semibold mb-1 ml-1 flex items-center gap-1"
                      style={{ color: selected.accentColor }}
                    >
                      <Sparkles size={11} />
                      {selected.agentName} (AI Agent)
                    </span>
                    <div className="bg-gradient-to-br from-[#faf7fc] to-[#f4eef9] text-[#241f2e] text-xs sm:text-sm p-3.5 rounded-2xl rounded-tl-sm max-w-[92%] shadow-sm leading-relaxed border border-[#ebdff5]">
                      {selected.answer}
                    </div>
                  </div>
                </div>

                {/* Bottom Step Confirmation Badge */}
                <div className="pt-3.5 border-t border-[#f0eaf7] flex items-center gap-2 text-[11px] font-medium text-[#716685]">
                  <CircleCheck size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>{selected.nextStep}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default IndustryShowcase;
