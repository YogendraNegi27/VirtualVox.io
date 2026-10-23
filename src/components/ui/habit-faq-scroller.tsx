'use client';

import React from 'react';
import { HelpCircle, Sparkles, MessageCircle } from 'lucide-react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqRow {
  id: string;
  speed?: string;
  direction?: 'left' | 'right';
  faqItems: FaqItem[];
}

export interface FaqData {
  mainTitle: string;
  mainSubtitle: string;
  rows: FaqRow[];
}

/**
 * FaqCard
 * Reusable card for a single FAQ item with crisp glassmorphism and sky blue accents.
 */
export const FaqCard: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => {
  return (
    <div className="flex flex-col items-start justify-between gap-3 p-5 sm:p-7 bg-white/95 backdrop-blur-md rounded-2xl border border-[#c9d9fd] shadow-[0_4px_25px_rgba(50,80,180,0.07)] hover:shadow-[0_14px_35px_rgba(50,80,180,0.14)] hover:border-[#a8c2fc] w-[285px] sm:w-[360px] md:w-[410px] flex-shrink-0 faq-card transition-all duration-300">
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-[#ebf1ff] text-[#2f54d4] flex items-center justify-center flex-shrink-0">
            <HelpCircle size={14} />
          </span>
          <h3 className="text-base sm:text-lg font-bold text-[#1a2542] tracking-tight leading-snug faq-title">
            {question}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#4d5975] leading-relaxed faq-answer">
          {answer}
        </p>
      </div>

      <div className="pt-2.5 border-t border-[#edf2fd] w-full flex items-center justify-between text-[11px] font-medium text-[#7a88a5]">
        <span className="flex items-center gap-1">
          <Sparkles size={11} className="text-[#3b62ec]" /> VIRTUALVOX Intelligence
        </span>
        <span className="text-[#2b4ec9] font-semibold">Verified FAQ</span>
      </div>
    </div>
  );
};

/**
 * HorizontalScroller
 * Wraps children and creates a seamless horizontal looping animation.
 */
export const HorizontalScroller: React.FC<{
  children: React.ReactNode;
  speed?: string;
  direction?: 'left' | 'right';
}> = ({ children, speed = '45s', direction = 'left' }) => {
  const animationClass =
    direction === 'right'
      ? 'animate-scroll-horizontal-reverse'
      : 'animate-scroll-horizontal';

  // CSS custom property for scroll duration
  const style = { '--scroll-duration': speed } as React.CSSProperties;

  return (
    <div className="w-full overflow-hidden group relative scroller-mask">
      <div className={`flex ${animationClass}`} style={style}>
        <div className="flex items-stretch justify-center flex-shrink-0 gap-6 sm:gap-8 px-3">
          {children}
        </div>
        {/* Duplicate for seamless infinite loop */}
        <div
          className="flex items-stretch justify-center flex-shrink-0 gap-6 sm:gap-8 px-3"
          aria-hidden="true"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const defaultFaqData: FaqData = {
  mainTitle: 'Glad you asked.',
  mainSubtitle:
    'Get to know your next conversation partner. Learn how VIRTUALVOX AI voice agents integrate into your business.',
  rows: [
    {
      id: 'row1',
      speed: '55s',
      direction: 'left',
      faqItems: [
        {
          id: 'q1',
          question: 'What can a VIRTUALVOX agent help with?',
          answer:
            'Voice and text agents handle customer support, appointment scheduling, lead qualification, and immediate CRM handoffs with human escalation protocols.',
        },
        {
          id: 'q2',
          question: 'Can I keep my existing phone numbers & tools?',
          answer:
            'Yes. VIRTUALVOX connects seamlessly via SIP trunking or WebRTC to your existing telephony, CRM (Salesforce, HubSpot), and calendars (Google, Outlook).',
        },
        {
          id: 'q3',
          question: 'Can callers speak with a real person?',
          answer:
            'Production agents are configured with automatic warm transfers, escalating complex inquiries with full caller context and conversation history.',
        },
        {
          id: 'q4',
          question: 'How fast is the spoken voice response?',
          answer:
            'Our neural speech synthesis achieves sub-second latency (under 400ms), delivering natural conversational rhythm without awkward pauses.',
        },
      ],
    },
    {
      id: 'row2',
      speed: '45s',
      direction: 'right',
      faqItems: [
        {
          id: 'q5',
          question: 'Is customer audio & transcript data secure?',
          answer:
            'All voice streams and session logs are end-to-end encrypted with strict SOC-2 compliance standards and HIPAA-conscious data isolation policies.',
        },
        {
          id: 'q6',
          question: 'Is the website interactive preview a live AI call?',
          answer:
            'The preview on this site plays scripted browser audio. Your actual production deployment runs on our ultra-low latency live neural models.',
        },
        {
          id: 'q7',
          question: 'How does pricing and deployment work?',
          answer:
            'We structure transparent plans based on your monthly call volume, custom integrations, and agent voice models, with dedicated onboarding.',
        },
        {
          id: 'q8',
          question: 'How do we get started?',
          answer:
            'Tell us about your call volume, current stack, and workflow goals using the request form below. We will prepare a personalized live demo.',
        },
      ],
    },
    {
      id: 'row3',
      speed: '65s',
      direction: 'left',
      faqItems: [
        {
          id: 'q9',
          question: 'Can agents handle diverse global accents?',
          answer:
            'Yes. Our acoustic speech recognition models are trained on diverse global accents and support over 30 languages with high comprehension.',
        },
        {
          id: 'q10',
          question: 'What happens during after-hours emergency calls?',
          answer:
            'Agents answer 24/7, triage emergency requests, log tickets, and instantly notify on-call technicians according to your escalation rules.',
        },
        {
          id: 'q11',
          question: "Can we customize the agent's tone and brand voice?",
          answer:
            'Every agent persona, vocabulary, boundaries, and tone are tailored to sound like a natural, thoughtful extension of your brand.',
        },
        {
          id: 'q12',
          question: 'How long does custom integration take?',
          answer:
            'Standard deployments with calendar and CRM integrations go live in days, while custom enterprise telephony setups take 1 to 2 weeks.',
        },
      ],
    },
  ],
};

/**
 * FaqSection
 * Assembles title, subtitle, and multiple horizontal scrolling rows with light sky blue gradient backdrop.
 */
export const FaqSection: React.FC<{ data?: FaqData; className?: string }> = ({
  data = defaultFaqData,
  className = '',
}) => {
  return (
    <div
      className={`relative flex flex-col items-center gap-10 md:gap-14 py-8 md:py-12 w-full ${className}`}
    >
      {/* Heading Block */}
      <div className="flex flex-col items-center gap-3.5 text-center z-10 max-w-2xl px-4">
        <span className="eyebrow inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#2446be] bg-white/75 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/80 shadow-sm">
          <MessageCircle size={14} /> A FEW GOOD QUESTIONS
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#141e34] tracking-tight leading-tight">
          Glad you <span className="text-[#6479a6]">asked.</span>
        </h2>
        <p className="text-base sm:text-lg text-[#3e4b67] max-w-xl leading-relaxed">
          {data.mainSubtitle}
        </p>
      </div>

      {/* Scrolling Rows with pause on hover */}
      <div className="flex flex-col gap-6 sm:gap-8 z-10 w-full overflow-hidden">
        {data.rows.map((row) => (
          <HorizontalScroller
            key={row.id}
            speed={row.speed}
            direction={row.direction}
          >
            {row.faqItems.map((item) => (
              <FaqCard
                key={item.id}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </HorizontalScroller>
        ))}
      </div>


    </div>
  );
};

export default FaqSection;
