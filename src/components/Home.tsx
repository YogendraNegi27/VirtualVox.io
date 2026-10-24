'use client';

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, MotionConfig, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import AnimatedVideo from './AnimatedVideo';
import { usePageMotion } from './usePageMotion';
import { VirtualVoxHeroExpansion } from '@/components/ui/scroll-expansion-hero';
import { LandingAccordionItem } from '@/components/ui/interactive-image-accordion';
import { IndustryStoryScroll } from '@/components/ui/industry-story-scroll';
import FaqSection from '@/components/ui/habit-faq-scroller';
import DitheredFooter from '@/components/ui/dithered-footer';
import MobbinIntegrations from '@/components/ui/mobbin-integrations';
import VapiHowItWorks from '@/components/ui/vapi-how-it-works';
import VapiContactSection from '@/components/ui/vapi-contact-section';
import { AnimatedVoiceGlobe } from '@/components/ui/animated-voice-globe';
import { CardHandGallery, type FanCardItem } from '@/components/ui/card-hand-gallery';

import RobotHero from '@/components/ui/robot-hero';
import { Activity, AudioLines, CalendarDays, Check, ChevronDown, CircleCheck, Cpu, Headphones, HeartPulse, Landmark, Layers3, Menu, MessageCircle, Mic, Pause, Phone, PhoneCall, Play, Plus, ShieldCheck, ShoppingCart, Sparkles, Workflow, X } from 'lucide-react';

const hosted = process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'cloudflare';

const agents = [
  {name:'Sofia', role:'Your first impression, perfected.', tag:'Customer support', video:'alex', color:'lavender'},
  {name:'Alex', role:'Turn a question into a connection.', tag:'Appointments', video:'sofia', color:'peach'},
  {name:'James', role:'Make every opportunity count.', tag:'Lead qualification', video:'james', color:'blue'},
  {name:'Priya', role:'Remarkably human conversations.', tag:'Voice assistant', video:'alex', color:'lavender'},
  {name:'Marcus', role:'Always ready when the next job calls.', tag:'After-hours dispatch', video:'james', color:'blue'},
];
const industries = [
  {name:'BPO', icon:PhoneCall, title:'Scale contact center operations with AI efficiency.', text:'Handle high call volumes, answer repetitive enquiries, and streamline caller verification while routing complex workflows to live agents.', question:'Can you help me update my account details and verify my recent order?', answer:'I would be happy to help with that. For security, please confirm the email address associated with your account.', buttonText:'Explore BPO solutions'},
  {name:'Healthcare', icon:HeartPulse, title:'More time for the people in your care.', text:'Help callers with clinic hours, appointment requests, prescription refill status, and routine information with HIPAA-conscious flows.', question:'I would like to schedule an appointment with Dr. Sharma for next Tuesday.', answer:'I can help with that. Dr. Sharma has openings at 10:30 AM and 2:15 PM next Tuesday. Which time works best for you?', buttonText:'Explore Healthcare solutions'},
  {name:'Technology', icon:Cpu, title:'Instant developer support and SaaS onboarding.', text:'Guide users through setup, troubleshoot API endpoints, answer billing questions, and log bug reports without long ticket queues.', question:'How do I configure Webhook endpoints in the developer portal?', answer:'You can configure Webhooks under Project Settings > Integrations. Would you like me to send you the documentation link?', buttonText:'Explore Technology solutions'},
  {name:'Financial Services', icon:Landmark, title:'Secure, compliant assistance for modern banking.', text:'Guide customers through loan applications, balance checks, fraud alerts, and branch consultations with multi-factor verification.', question:'I noticed an unrecognized charge on my card and want to report it.', answer:'I understand that is urgent. Let me verify your card ending in 4082 and flag that transaction for security review immediately.', buttonText:'Explore Financial solutions'},
  {name:'Retail', icon:ShoppingCart, title:'Drive sales and keep shoppers informed 24/7.', text:'Answer product enquiries, check real-time inventory, handle returns and exchanges, and track shipment status seamlessly.', question:'Can I check the delivery status of order #VX-9421?', answer:'Your package is out for delivery today and estimated to arrive by 4:00 PM. Would you like a tracking link sent to your phone?', buttonText:'Explore Retail solutions'},
];
const platformCards: FanCardItem[] = [
  {
    id: 'voice-agents',
    title: 'Voice Agents',
    description: 'Natural, low-latency conversations that listen, understand, and guide your callers with human emotional intelligence and zero awkward delays.',
    tag: 'REAL-TIME SPEECH',
    badge: 'Sub-Second AI',
    stat: '99.4%',
    statLabel: 'Intent Resolution Rate',
    icon: Headphones,
    features: [
      'Ultra-low latency conversational speech',
      'Natural interruption & barge-in handling',
      'Human emotional tone matching',
    ],
  },
  {
    id: 'text-agents',
    title: 'Text Agents',
    description: 'Always-on customer messaging across SMS, WhatsApp, and Web Chat with persistent context, instant memory, and automated next steps.',
    tag: 'OMNICHANNEL CHAT',
    badge: 'Instant Context',
    stat: '< 2s',
    statLabel: 'Average First Response',
    icon: MessageCircle,
    features: [
      'SMS, WhatsApp & Web Chat in sync',
      'Persistent customer journey memory',
      'Automated booking & follow-ups',
    ],
  },
  {
    id: 'connected-workflows',
    title: 'Connected Workflows',
    description: 'Move seamlessly from conversation to execution. Your agents read and write live data directly to your CRM, calendars, and enterprise backends.',
    tag: 'TOOL INTEGRATIONS',
    badge: 'Full Automation',
    stat: '100+',
    statLabel: 'Native Connectors & APIs',
    icon: Workflow,
    features: [
      'Live two-way CRM record syncing',
      'Instant calendar booking & dispatch',
      'Custom webhook triggers & logic',
    ],
  },
  {
    id: 'enterprise-control',
    title: 'Enterprise Control',
    description: 'Define precise business boundaries, security compliance, and knowledge guardrails with effortless warm transfers to your human team.',
    tag: 'GUARDRAILS & COMPLIANCE',
    badge: 'Zero Hallucinations',
    stat: '100%',
    statLabel: 'Knowledge Enforcement',
    icon: ShieldCheck,
    features: [
      'Custom knowledge base guardrails',
      'Frictionless human agent warm transfer',
      'Full call audio & text audit logs',
    ],
  },
  {
    id: 'instant-intelligence',
    title: 'Instant Intelligence',
    description: 'Transform every call and message into structured intelligence with real-time sentiment tracking, automated summaries, and conversion alerts.',
    tag: 'CONVERSATION DATA',
    badge: 'Deep Analytics',
    stat: '24/7',
    statLabel: 'Live Telemetry & Tracking',
    icon: Sparkles,
    features: [
      'Real-time customer sentiment scoring',
      'Automated call summaries & tagging',
      'Drop-off & objection bottleneck alerts',
    ],
  },
];

const faqs = [
  ['What can a VIRTUALVOX agent help with?','Voice and text agents can support common enquiries, appointment requests, lead qualification, and handoffs. Each agent should be configured around your business information and approved workflows.'],
  ['Can I keep my existing tools?','The site includes an integration overview. Connecting your actual CRM, calendar, or telephony system requires API credentials and a configured backend integration. We can plan the right connections for your workflow.'],
  ['Can callers speak with a person?','A production agent can be configured to hand off to your team when a caller asks, when a question falls outside its knowledge, or when a workflow needs human review.'],
  ['Is the interactive preview a live AI call?','The preview on this website plays a scripted sample using your browser’s speech capabilities. It does not record your microphone or connect to a live AI agent.'],
  ['How do we get started?','Tell us about your business, your call volume, and what you want your agent to handle using the demo request form below. Requests are recorded for review.'],
];

function Reveal({children,className='',delay=0}:{children:ReactNode;className?:string;delay?:number}) {
  return <div className={`reveal ${className}`} data-reveal="" style={{'--reveal-delay':`${delay}s`} as CSSProperties}>{children}</div>;
}
function Wave({active=false}:{active?:boolean}) { return <div className={`wave ${active?'active':''}`} aria-hidden="true">{Array.from({length:25},(_,i)=><i key={i} style={{height:`${(10+Math.sin(i*1.7)**2*30).toFixed(2)}px`,animationDelay:`${(i*0.065).toFixed(3)}s`}} />)}</div>; }
function Logo({footer=false, onTopClick}:{footer?:boolean; onTopClick?: (e: React.MouseEvent) => void}) {
  return (
    <a
      className={`brand ${footer?'brand-footer':''}`}
      href="#top"
      onClick={onTopClick}
      aria-label="VIRTUALVOX home"
    >
      <img src="/images/virtualvox-brand.png" alt="VIRTUALVOX — AI Voice Agent" width="2080" height="756" />
    </a>
  );
}
function BrandIcon() { return <span className="brand-icon" aria-hidden="true"><img src="/images/virtualvox-brand.png" alt="" width="2080" height="756"/></span>; }
function DemoLink({children='Book a demo',className='button button-dark'}:{children?:ReactNode;className?:string}) { return <a className={className} href={process.env.NEXT_PUBLIC_BOOKING_URL || '#contact'}>{children}</a>; }

function PreviewVideo({file,className=''}:{file:string;className?:string}) {
  return <AnimatedVideo className={className} src={`/media/agent-${file}.mp4`} poster={`/images/agent-${file}.jpg`} />;
}

export default function Home() {
  usePageMotion();
  const [menu,setMenu]=useState(false);
  const [productMenu,setProductMenu]=useState(false);
  const [industry,setIndustry]=useState(0);
  const [faq,setFaq]=useState<number|null>(0);
  const [speaking,setSpeaking]=useState(false);
  const [audioMessage,setAudioMessage]=useState('');
  const [sample,setSample]=useState(0);
  const [activeAgent,setActiveAgent]=useState(0);
  const [formState,setFormState]=useState<'idle'|'sending'|'success'|'error'>('idle');
  const [formError,setFormError]=useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const productRef=useRef<HTMLDivElement>(null);
  const mobileRef=useRef<HTMLButtonElement>(null);
  const heroRef=useRef<HTMLDivElement>(null);
  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const selected = industries[industry];

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const heroEl = heroRef.current || document.getElementById('hero-section');
      const heroHeight = heroEl ? heroEl.offsetHeight : (window.innerHeight * 0.85);
      // Switch to compact dock only when first section has finished scrolling down
      const switchDownThreshold = Math.max(heroHeight - 110, 420);
      // Switch back to large capsule when scrolling back up into the first section
      const switchUpThreshold = Math.max(switchDownThreshold - 120, 300);

      if (y >= switchDownThreshold) {
        setIsScrolled(true);
      } else if (y < switchUpThreshold) {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true } as EventListenerOptions);
      document.removeEventListener('scroll', handleScroll, { capture: true } as EventListenerOptions);
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const heroEl = heroRef.current || document.getElementById('hero-section');
    const heroHeight = heroEl ? heroEl.offsetHeight : (window.innerHeight * 0.85);
    const switchDownThreshold = Math.max(heroHeight - 110, 420);
    const switchUpThreshold = Math.max(switchDownThreshold - 120, 300);

    if (latest >= switchDownThreshold) {
      setIsScrolled(true);
    } else if (latest < switchUpThreshold) {
      setIsScrolled(false);
    }
  });

  useEffect(()=>{
    function close(event:KeyboardEvent){if(event.key==='Escape'){setMenu(false);setProductMenu(false);mobileRef.current?.focus();}}
    function outside(event:PointerEvent){if(!productRef.current?.contains(event.target as Node))setProductMenu(false);}
    document.addEventListener('keydown',close);document.addEventListener('pointerdown',outside);
    return ()=>{document.removeEventListener('keydown',close);document.removeEventListener('pointerdown',outside);};
  },[]);
  useEffect(()=>()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel();},[]);
  function stopSample(){if('speechSynthesis' in window)window.speechSynthesis.cancel();setSpeaking(false);}
  function playSample(index=sample){
    if(speaking){stopSample();return;}
    setAudioMessage('');setSample(index);
    if(!('speechSynthesis' in window)){setAudioMessage('Audio is unavailable in this browser. You can read the sample conversation below.');return;}
    const line=new SpeechSynthesisUtterance(`Hello, you’re speaking with ${agents[activeAgent].name}, your Virtual Vox assistant. ${industries[index].answer}`);
    line.rate=0.94;line.pitch=1;line.onend=()=>setSpeaking(false);line.onerror=()=>{setSpeaking(false);setAudioMessage('Audio could not play. The sample transcript is available below.');};
    window.speechSynthesis.cancel();window.speechSynthesis.speak(line);setSpeaking(true);
  }
  const scrollToTop = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const form=event.currentTarget;const values=new FormData(form);setFormState('sending');
    try{const res=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...Object.fromEntries(values),consent:values.get('consent')==='on'})});const body=await res.json();if(!res.ok)throw new Error(body.error);setFormState('success');form.reset();}
    catch(error){setFormError(error instanceof Error?error.message:'Something went wrong. Please try again.');setFormState('error');}
  }
  return <MotionConfig reducedMotion="user">
    <div id="top" className="absolute top-0 left-0 w-px h-px pointer-events-none -z-50" aria-hidden="true" />
    <a className="skip-link" href="#main">Skip to content</a>
    <motion.div className="scroll-progress" style={{scaleX:progress}} />
    <header className="site-header" suppressHydrationWarning>
      <div className={`nav-pill ${isScrolled ? 'is-scrolled' : 'is-initial'}`}>
        {/* Brand / Logo (Left in Initial State, Img 1 style) */}
        <AnimatePresence initial={false}>
          {!isScrolled && (
            <motion.div
              key="nav-logo"
              className="nav-brand-container"
              initial={{ opacity: 0, width: 0, scale: 0.95 }}
              animate={{ opacity: 1, width: 'auto', scale: 1 }}
              exit={{ opacity: 0, width: 0, scale: 0.95 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <Logo onTopClick={scrollToTop} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main navigation">
          {/* Home link appears only when scrolled (Img 2 style) */}
          <AnimatePresence initial={false}>
            {isScrolled && (
              <motion.a
                key="home-link"
                href="#top"
                onClick={scrollToTop}
                className="nav-item cursor-pointer"
                initial={{ opacity: 0, width: 0, scale: 0.88 }}
                animate={{ opacity: 1, width: 'auto', scale: 1 }}
                exit={{ opacity: 0, width: 0, scale: 0.88 }}
                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              >
                Home
              </motion.a>
            )}
          </AnimatePresence>

          {/* Products dropdown */}
          <div className="nav-dropdown" ref={productRef}>
            <button
              className="nav-item"
              type="button"
              aria-expanded={productMenu}
              aria-controls={productMenu ? "product-menu" : undefined}
              onClick={() => setProductMenu(!productMenu)}
              suppressHydrationWarning
            >
              Products <ChevronDown size={14} className={productMenu ? "nav-chevron is-open" : "nav-chevron"} />
            </button>
            <AnimatePresence>
              {productMenu && (
                <motion.div
                  id="product-menu"
                  className="dropdown-panel"
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                >
                  <a href="#platform" onClick={() => setProductMenu(false)}>
                    <Phone size={19} />
                    <span>Voice agents<small>A better conversation starts here</small></span>
                  </a>
                  <a href="#platform" onClick={() => setProductMenu(false)}>
                    <MessageCircle size={19} />
                    <span>Text agents<small>Keep every channel connected</small></span>
                  </a>
                  <a href="#integrations" onClick={() => setProductMenu(false)}>
                    <Workflow size={19} />
                    <span>Integrations<small>Fit into the way you work</small></span>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a href="#industries" className="nav-item">Industries</a>
          <a href="#how-it-works" className="nav-item">How it works</a>
          <a href="#team" className="nav-item">{isScrolled ? "Agents" : "Meet the agents"}</a>
        </nav>

        {/* Desktop CTA Button (Right in Initial State, Img 1 style) */}
        <AnimatePresence initial={false}>
          {!isScrolled && (
            <motion.div
              key="nav-cta"
              className="nav-cta-container"
              initial={{ opacity: 0, width: 0, scale: 0.95 }}
              animate={{ opacity: 1, width: 'auto', scale: 1 }}
              exit={{ opacity: 0, width: 0, scale: 0.95 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <DemoLink className="nav-pill-cta">Book a demo</DemoLink>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Nav Controls: Starting State (Img 1 style) */}
        <AnimatePresence initial={false}>
          {!isScrolled && (
            <motion.div
              key="mobile-initial"
              className="nav-mobile-initial"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              <DemoLink className="nav-pill-cta-mobile">Book demo</DemoLink>
              <button
                className="nav-toggle-btn"
                ref={mobileRef}
                type="button"
                aria-label={menu ? 'Close navigation' : 'Open navigation'}
                aria-expanded={menu}
                aria-controls={menu ? "mobile-nav" : undefined}
                onClick={() => setMenu(!menu)}
                suppressHydrationWarning
              >
                {menu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Nav Controls: Scrolled State (Img 2 style) */}
        <AnimatePresence initial={false}>
          {isScrolled && (
            <motion.div
              key="mobile-scrolled"
              className="nav-mobile-scrolled"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              <a href="#top" onClick={scrollToTop} className="nav-mobile-link cursor-pointer">Home</a>
              <a href="#platform" className="nav-mobile-link">Platform</a>
              <a href="#team" className="nav-mobile-link">Agents</a>
              <button
                className="nav-mobile-toggle"
                type="button"
                aria-label={menu ? 'Close navigation' : 'Open navigation'}
                aria-expanded={menu}
                onClick={() => setMenu(!menu)}
              >
                {menu ? <X size={17} /> : <Menu size={17} />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Mobile Drawer */}
      <AnimatePresence>
        {menu && (
          <motion.nav
            className="mobile-nav-drawer"
            id="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href="#top"
              onClick={(e) => {
                scrollToTop(e);
                setMenu(false);
              }}
              className="cursor-pointer"
            >
              Home
            </a>
            <a href="#platform" onClick={() => setMenu(false)}>Platform & Agents</a>
            <a href="#industries" onClick={() => setMenu(false)}>Industries</a>
            <a href="#how-it-works" onClick={() => setMenu(false)}>How it works</a>
            <a href="#team" onClick={() => setMenu(false)}>Meet the agents</a>
            <a href="#contact" onClick={() => setMenu(false)} className="drawer-cta">Book a demo</a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
    <main id="main" className="pt-2 sm:pt-4">
      <div ref={heroRef} id="hero-section" className="relative w-full">
        <RobotHero
          backgroundText="VIRTUALVOX"
          eyebrow="HUMAN CONNECTION. REIMAGINED."
          title="AI voice and text agents."
          subtitle="Never miss another opportunity. Answer every call, respond in seconds, and make every conversation count."
          badges={["Always ready", "Made for your business", "Built around people"]}
          color="#ede8f7"
          pantallaColor="#7c3aed"
          pantallaBrillo={1.4}
          showNav={false}
        />
      </div>
      <div className="relative z-20 pt-2 sm:pt-4">
        <VirtualVoxHeroExpansion />
      </div>

      <section className="container py-6 sm:py-10 relative z-30" id="platform">
        <Reveal delay={0.06} className="w-full">
          <CardHandGallery cards={platformCards} className="max-w-6xl mx-auto" />
        </Reveal>
      </section>

      <section className="demo-section" id="demo"><div className="container demo-layout"><Reveal className="demo-copy"><span className="eyebrow">DON’T JUST TAKE OUR WORD FOR IT</span><h2>It starts with<br/>a simple <em>hello.</em></h2><p>A little warmth. A natural rhythm. A conversation that feels effortless. Explore a sample of the experience.</p><div className="sample-selector" aria-label="Choose a sample">{industries.map((item,index)=><button key={item.name} type="button" suppressHydrationWarning className={sample===index?'selected':''} onClick={()=>{stopSample();setSample(index);}}>{item.name}</button>)}</div><span className="sample-disclaimer">Scripted audio preview · No microphone required</span></Reveal>
        <Reveal className="audio-card"><AnimatedVoiceGlobe active={speaking} className="my-1 sm:my-2"/><Wave active={speaking}/><button className="button play-button" type="button" suppressHydrationWarning onClick={()=>playSample()} aria-label={speaking?'Stop sample':'Play sample'}>{speaking?<Pause size={17}/>:<Play size={17} fill="currentColor"/>}{speaking?'Stop sample':'Play sample'}</button><div className="sample-transcript" aria-live="polite"><p><span>Customer</span>{industries[sample].question}</p><p><span>{agents[activeAgent].name}</span>{industries[sample].answer}</p></div>{audioMessage&&<p className="audio-error" role="status">{audioMessage}</p>}</Reveal></div></section>

      <Reveal delay={0.08}>
        <MobbinIntegrations
          eyebrow="BETTER, TOGETHER"
          headlineTop="Your tools."
          headlineHighlight="One conversation."
          description="Design your agent around the systems your team already uses."
          ctaText="Explore integrations"
          ctaHref="#contact"
        />
      </Reveal>

      <div id="industries" className="relative w-full">
        <IndustryStoryScroll
          onPlayVoice={(idx) => {
            stopSample();
            playSample(idx);
          }}
          isSpeaking={speaking}
        />
      </div>

      <Reveal delay={0.06}>
        <VapiHowItWorks />
      </Reveal>

      <section className="team-section" id="team"><div className="container"><Reveal delay={0.1}><LandingAccordionItem defaultActiveIndex={activeAgent} onSelectAgent={(index)=>{stopSample();setActiveAgent(index);}} /></Reveal></div></section>

      <Reveal delay={0.08}>
        <VapiContactSection />
      </Reveal>

      <section className="faq-scroller-section overflow-hidden" id="faq"><Reveal delay={0.1}><FaqSection /></Reveal></section>
    </main>
    <DitheredFooter
      brand="VIRTUALVOX"
      brandHref="#top"
      tagline="Remarkably human AI voice and text agents. Never miss another opportunity, answer every call in seconds, and make every customer conversation count."
      accent="#7c3aed"
      status={null}
      copyright={`© ${new Date().getFullYear()} VIRTUALVOX, Inc. All rights reserved.`}
      legal={[
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Security & HIPAA", href: "#" },
      ]}
      columns={[
        {
          title: "Platform",
          links: [
            { label: "Voice Agents", href: "#platform" },
            { label: "Text Agents", href: "#platform" },
            { label: "Integrations", href: "#integrations" },
            { label: "Interactive Voice Demo", href: "#demo" },
          ],
        },
        {
          title: "Industries",
          links: [
            { label: "BPO & Call Centers", href: "#industries" },
            { label: "Healthcare & Clinics", href: "#industries" },
            { label: "Technology & SaaS", href: "#industries" },
            { label: "Financial Services", href: "#industries" },
            { label: "Retail & Commerce", href: "#industries" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "Meet the Agents", href: "#team" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Frequently Asked Questions", href: "#faq" },
            { label: "Request a Demo", href: "#contact" },
          ],
        },
      ]}
      onSubscribe={async (_email) => {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }}
    />
  </MotionConfig>;
}
