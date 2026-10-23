'use client';

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, MotionConfig, useScroll, useSpring } from 'motion/react';
import AnimatedVideo from './AnimatedVideo';
import { usePageMotion } from './usePageMotion';
import { CinematicHero } from '@/components/ui/cinematic-landing-hero';
import { LandingAccordionItem } from '@/components/ui/interactive-image-accordion';
import { IndustryShowcase } from '@/components/ui/industry-showcase';
import FaqSection from '@/components/ui/habit-faq-scroller';
import DitheredFooter from '@/components/ui/dithered-footer';
import RobotHero from '@/components/ui/robot-hero';
import MobbinIntegrations from '@/components/ui/mobbin-integrations';
import VapiHowItWorks from '@/components/ui/vapi-how-it-works';
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
function Logo({footer=false}:{footer?:boolean}) { return <a className={`brand ${footer?'brand-footer':''}`} href="#top" aria-label="VIRTUALVOX home"><img src="/images/virtualvox-brand.png" alt="VIRTUALVOX — AI Voice Agent" width="2080" height="756" /></a>; }
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
  const {scrollYProgress}=useScroll();
  const progress=useSpring(scrollYProgress,{stiffness:100,damping:30});
  const selected=industries[industry];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const form=event.currentTarget;const values=new FormData(form);setFormState('sending');
    try{const res=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...Object.fromEntries(values),consent:values.get('consent')==='on'})});const body=await res.json();if(!res.ok)throw new Error(body.error);setFormState('success');form.reset();}
    catch(error){setFormError(error instanceof Error?error.message:'Something went wrong. Please try again.');setFormState('error');}
  }
  return <MotionConfig reducedMotion="user">
    <a className="skip-link" href="#main">Skip to content</a>
    <motion.div className="scroll-progress" style={{scaleX:progress}} />
    <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`} id="top">
      <div className="nav-shell"><Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          <div className="nav-dropdown" ref={productRef}><button className="nav-item" aria-expanded={productMenu} aria-controls="product-menu" onClick={()=>setProductMenu(!productMenu)}>Products <ChevronDown size={14} /></button>
            <AnimatePresence>{productMenu&&<motion.div id="product-menu" className="dropdown-panel" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}><a href="#platform" onClick={()=>setProductMenu(false)}><Phone size={19}/><span>Voice agents<small>A better conversation starts here</small></span></a><a href="#platform" onClick={()=>setProductMenu(false)}><MessageCircle size={19}/><span>Text agents<small>Keep every channel connected</small></span></a><a href="#integrations" onClick={()=>setProductMenu(false)}><Workflow size={19}/><span>Integrations<small>Fit into the way you work</small></span></a></motion.div>}</AnimatePresence>
          </div><a href="#industries">Industries</a><a href="#how-it-works">How it works</a><a href="#team">Meet the agents</a>
        </nav><DemoLink /><button className="menu-toggle" ref={mobileRef} aria-label={menu?'Close navigation':'Open navigation'} aria-expanded={menu} aria-controls="mobile-nav" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
      </div>
      <AnimatePresence>{menu&&<motion.nav className="mobile-nav" id="mobile-nav" aria-label="Mobile navigation" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>{[['Platform','#platform'],['Industries','#industries'],['How it works','#how-it-works'],['Meet the agents','#team'],['Book a demo','#contact']].map(([label,href])=><a key={href} href={href} onClick={()=>setMenu(false)}>{label}</a>)}</motion.nav>}</AnimatePresence>
    </header>
    <main id="main">
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
      <CinematicHero />

      <section className="section container !pt-8 sm:!pt-10 md:!pt-14 -mt-12 sm:-mt-16 md:-mt-28 relative z-30" id="platform"><Reveal className="section-heading"><span className="eyebrow">A LITTLE LESS BUSYWORK. A LOT MORE POSSIBILITY.</span><h2>A human touch.<br/><span>At a whole new scale.</span></h2><p>Your best customer experience shouldn’t depend on<br className="desktop-break"/> whether someone is free to pick up the phone.</p></Reveal>
        <div className="feature-grid"><Reveal className="feature-card feature-large"><div className="card-label"><Headphones size={20}/> Voice agents</div><h3>Every call deserves<br/>a great conversation.</h3><p>Natural conversations that listen, understand, and guide your customers to the next step.</p><div className="conversation-visual"><span className="conversation-status"><span/> A sample conversation</span><div className="chat-bubble customer">Hi, can I book an appointment?</div><div className="chat-bubble agent">Absolutely. Let’s find a time that works for you.<span className="typing"><i/><i/><i/></span></div><div className="conversation-wave"><Mic size={18}/><Wave active/><img className="inline-brand" src="/images/virtualvox-brand.png" alt="VIRTUALVOX" width="2080" height="756"/></div></div></Reveal>
          <Reveal className="feature-card" delay={0.1}><div className="card-label"><MessageCircle size={20}/> Text agents</div><h3>Keep the conversation<br/>going. Everywhere.</h3><p>Helpful replies and consistent context, from the first hello to the follow-up.</p><div className="message-visual"><div><BrandIcon /><span>VIRTUALVOX<small>Your conversation assistant</small></span><CircleCheck size={18}/></div><p>Your appointment request is ready.<br/>Would tomorrow at 10 am work?</p><span className="reply-chip">That works for me <Check size={14}/></span></div></Reveal>
          <Reveal className="feature-card compact"><div className="icon-box"><Workflow/></div><h3>Fits your workflow.</h3><p>Move from a conversation to a useful next step with connected tools and clear handoffs.</p><div className="workflow-visual"><Phone/><span/><CalendarDays/><span/><CircleCheck/></div></Reveal>
          <Reveal className="feature-card compact" delay={0.1}><div className="icon-box"><ShieldCheck/></div><h3>You stay in control.</h3><p>Define the knowledge, boundaries, and moments when your human team takes over.</p><div className="control-tags"><span><Check size={14}/> Your knowledge</span><span><Check size={14}/> Human handoff</span></div></Reveal>
        </div>
      </section>

      <section className="demo-section" id="demo"><div className="container demo-layout"><Reveal className="demo-copy"><span className="eyebrow">DON’T JUST TAKE OUR WORD FOR IT</span><h2>It starts with<br/>a simple <em>hello.</em></h2><p>A little warmth. A natural rhythm. A conversation that feels effortless. Explore a sample of the experience.</p><div className="sample-selector" aria-label="Choose a sample">{industries.map((item,index)=><button key={item.name} className={sample===index?'selected':''} onClick={()=>{stopSample();setSample(index);}}>{item.name}</button>)}</div><span className="sample-disclaimer">Scripted audio preview · No microphone required</span></Reveal>
        <Reveal className="audio-card"><div className="audio-card-top"><BrandIcon /><div><strong>{agents[activeAgent].name} from VIRTUALVOX</strong><small>Interactive voice preview</small></div><AudioLines size={23}/></div><div className="audio-orb"><div/><div/><Mic size={38}/></div><Wave active={speaking}/><button className="button button-dark play-button" onClick={()=>playSample()} aria-label={speaking?'Stop sample':'Play sample'}>{speaking?<Pause size={17}/>:<Play size={17} fill="currentColor"/>}{speaking?'Stop sample':'Play sample'}</button><div className="sample-transcript" aria-live="polite"><p><span>Customer</span>{industries[sample].question}</p><p><span>{agents[activeAgent].name}</span>{industries[sample].answer}</p></div>{audioMessage&&<p className="audio-error" role="status">{audioMessage}</p>}</Reveal></div></section>

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

      <section className="section container" id="industries">
        <Reveal className="section-heading left-heading">
          <span className="eyebrow">BUILT AROUND YOUR WORLD</span>
          <h2>A new voice.<br/><span>For the work you do.</span></h2>
        </Reveal>
        <Reveal delay={0.1}>
          <IndustryShowcase
            onPlayVoice={(idx) => {
              stopSample();
              playSample(idx);
            }}
            isSpeaking={speaking}
          />
        </Reveal>
      </section>

      <Reveal delay={0.06}>
        <VapiHowItWorks />
      </Reveal>

      <section className="team-section" id="team"><div className="container"><Reveal delay={0.1}><LandingAccordionItem defaultActiveIndex={activeAgent} onSelectAgent={(index)=>{stopSample();setActiveAgent(index);}} /></Reveal></div></section>

      <section className="contact-section" id="contact"><div className="container contact-layout"><Reveal><span className="eyebrow">LET’S MAKE ROOM FOR WHAT’S NEXT</span><h2>Your next great<br/>conversation<br/><span>starts here.</span></h2><p>Tell us a little about your business.<br/>Let’s explore what VIRTUALVOX could do for you.</p><div className="contact-benefits"><span><Check/> A conversation about your goals</span><span><Check/> A look at your customer journeys</span><span><Check/> A clear plan for your first agent</span></div><div className="contact-mark"><BrandIcon /><span>More connection.<br/>Less missed opportunity.</span></div></Reveal><Reveal className="contact-card"><h3>Let’s talk.</h3><p>Make your first connection with VIRTUALVOX.</p>{formState==='success'?<div className="form-success" role="status"><CircleCheck size={40}/><h4>Your request is recorded.</h4><p>{hosted ? 'Thank you for sharing your goals. Your demo request has been securely recorded.' : 'Thank you for sharing your goals. This local preview saves your request on this computer; it does not send email.'}</p><button className="button button-light" onClick={()=>setFormState('idle')}>Send another request</button></div>:<form onSubmit={submit}><label>Your name<input name="name" autoComplete="name" placeholder="Alex Morgan" required maxLength={120}/></label><label>Work email<input type="email" name="email" autoComplete="email" placeholder="alex@company.com" required maxLength={254}/></label><label>Company<input name="company" autoComplete="organization" placeholder="Your company" required maxLength={180}/></label><label>What would you like your agent to help with?<textarea name="message" rows={3} placeholder="Tell us a little about your goals…" maxLength={3000}/></label><label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label><label className="consent"><input type="checkbox" name="consent" required/><span>I agree to share these details for this demo request.</span></label>{formState==='error'&&<p role="alert" className="form-error">{formError}</p>}<button className="button button-dark" disabled={formState==='sending'} type="submit">{formState==='sending'?'Saving your request…':'Request a demo'}</button><small className="form-caption">Your details are used for this request only.</small></form>}</Reveal></div></section>

      <section className="faq-scroller-section overflow-hidden py-16 md:py-24" id="faq"><Reveal delay={0.1}><FaqSection /></Reveal></section>
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
