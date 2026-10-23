'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';
import { CalendarDays, Check, Headphones, MessageCircle, Phone, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import styles from './VoiceExperience.module.css';
import { usePrefersReducedMotion } from './usePageMotion';
import { usePriyaCall } from './usePriyaCall';

const introduction = [
  'Meet Priya, the AI voice agent from AIIDL Technologies.',
  'VIRTUALVOX is a voice-first assistant designed to help with customer support, sales, lead generation, and callback handling.',
  'Click to answer, allow your microphone, and speak with Priya live.',
];
const stories = [
  { title: <>Enterprise-ready<br/>voice AI agents</>, text: 'Build your customer experience around natural conversations, clear workflows, and a team that is always ready to help.' },
  { title: <>Integrates with<br/>your favourite tools</>, text: 'Connect your agent to your CRM, calendar, and knowledge base to turn each conversation into a useful next step.' },
  { title: <>A human touch.<br/>At every step.</>, text: 'Shape the knowledge and boundaries. Give your customers helpful answers, with a clear path to your human team.' },
];

export default function VoiceExperience() {
  const section = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [scene, setScene] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const call = usePriyaCall();
  const playing = call.active;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth > 800);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });

  // Spring physics smoothing eliminates mouse-wheel jitter on desktop
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.16,
    restDelta: 0.0005,
  });

  // Shifts phone slightly towards center initially on desktop, then centers at 0 as Priya zooms full-bleed
  const phoneX = useTransform(smoothProgress, [0, 0.2], [32, 0]);

  const frameOpacity = useTransform(smoothProgress, [0, 0.16, 0.28], [1, 1, 0]);
  const panelsOpacity = useTransform(smoothProgress, [0, 0.14, 0.23], [1, 1, 0]);
  const rightX = useTransform(smoothProgress, [0.14, 0.25], [0, 24]);
  const aperture = useTransform(smoothProgress, [0.17, 0.32], ['inset(0% 38.372% 0% 38.372% round 48px)', 'inset(0% 0% 0% 0% round 48px)']);
  const avatarScale = useTransform(smoothProgress, [0, 0.16, 0.36, 1], [1, 1, 1.86, 2.12]);
  const avatarOpacity = useTransform(smoothProgress, [0.18, 0.34], [1, 0.58]);
  const notchOpacity = useTransform(smoothProgress, [0.15, 0.23], [1, 0]);
  const islandOpacity = useTransform(smoothProgress, [0.23, 0.29], [0, 1]);
  const sceneOpacity = useTransform(smoothProgress, [0.25, 0.33], [0, 1]);

  useMotionValueEvent(smoothProgress, 'change', value => {
    const next = value < 0.27 ? 0 : value < 0.53 ? 1 : value < 0.77 ? 2 : 3;
    setScene(prev => (prev !== next ? next : prev));
  });

  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  const stopCall = call.stop;
  useEffect(() => { if (!visible) stopCall(); }, [visible, stopCall]);

  const status = call.state === 'microphone' ? 'Allow microphone access'
    : call.state === 'connecting' ? 'Connecting to Priya…'
    : call.state === 'live' ? (call.muted ? 'Microphone muted' : 'Connected to Priya')
    : call.state === 'ending' ? 'Ending call…'
    : call.state === 'ended' ? 'Call ended' : 'Live voice conversation';

  const holdPhone = !!reduced || playing;
  const phoneActive = scene === 0 || holdPhone;

  return <section id="voice-experience" ref={section} className={styles.experience} aria-label="Meet Priya, your AI voice agent" data-scene={scene}>
    <div className={styles.sticky}>
      <div className={styles.stage}>

        <motion.div
          className={styles.phoneAnchor}
          style={{ x: isDesktop && !reduced ? phoneX : 0 }}
        >
          <motion.div className={styles.phoneFrame} style={{ opacity: holdPhone ? 1 : frameOpacity }} data-testid="phone-frame" />
          <motion.div className={styles.aperture} style={reduced ? undefined : { clipPath: playing ? 'inset(0% 38.372% 0% 38.372% round 48px)' : aperture }}>
            <motion.div className={styles.avatar} style={{ scale: holdPhone ? 1 : avatarScale }} data-testid="priya-avatar">
              <motion.img className={styles.portrait} src="/images/priya.webp" alt="Priya, your AI voice agent" width={1254} height={1254} style={{ opacity: holdPhone ? 1 : avatarOpacity }} />
            </motion.div>
          </motion.div>
          <motion.div className={styles.notch} style={{ opacity: holdPhone ? 1 : notchOpacity }} />
          <motion.div className={styles.phoneContent} style={{ opacity: holdPhone ? 1 : frameOpacity }} inert={!phoneActive}>
            <div className={styles.agentIdentity}><span>Priya</span><img src="/images/virtualvox-brand.png" alt="VIRTUALVOX — AI Voice Agent" width={2080} height={756}/></div>
            <div className={styles.callControls}>
              {call.state === 'live' && <span className={styles.timer} aria-label={`Call connected, ${call.seconds} seconds`}>{Math.floor(call.seconds / 60)}:{String(call.seconds % 60).padStart(2, '0')}<span className={styles.wave}>{[0,1,2,3,4].map(i=><i key={i} style={{animationDelay:`${i * 0.12}s`}}/>)}</span></span>}
              {call.used && !playing ? <a className={`${styles.answer} ${styles.subscribe}`} href="#contact" tabIndex={phoneActive ? 0 : -1}>Contact for subscription</a> : <button className={styles.answer} onClick={() => playing ? call.stop() : call.available ? void call.start() : void call.retryAvailability()} disabled={call.state === 'ending' || (!playing && call.checking)} tabIndex={phoneActive ? 0 : -1} aria-pressed={playing} aria-describedby="voice-call-note" aria-label={playing ? 'End call with Priya' : call.available ? 'Answer Priya live call' : 'Check Priya availability'}>
                <span className={styles.phoneIcon}><Phone size={20} fill="currentColor"/></span>
                <span className={styles.answerLabel}>{call.state === 'ending' ? 'Ending…' : playing ? 'End call' : call.checking ? 'Checking…' : !call.available ? 'Check again' : 'Click to answer'}</span>
              </button>}
              <small id="voice-call-note">{playing ? 'Up to 60 seconds · End any time' : call.used ? 'Free demo used' : !call.available ? 'Tap to check availability' : 'Live demo · Microphone required'}</small>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className={styles.transcript} data-playing={playing} style={{ opacity: holdPhone ? 1 : panelsOpacity, x: holdPhone ? 0 : rightX }} aria-hidden={!phoneActive}>
          <div className={styles.transcriptCard}>
            <div className={styles.transcriptHeader}>
              <div className={styles.speakerBadge}>
                <span className={styles.pulseDot} />
                <span>{playing ? 'Live Call' : !call.available ? 'Voice Network' : 'AI Voice Agent'}</span>
              </div>
              <Sparkles size={16} className={styles.cardSparkle} />
            </div>

            <div className={styles.dialogueList} aria-live="polite" aria-atomic="false">
              {(playing ? [
                { speaker: 'Priya', text: status, highlight: true },
                { speaker: 'Conversation', text: 'After Priya’s greeting, speak naturally. You can mute your microphone or end the call at any time.' }
              ] : call.used ? [
                { speaker: 'Demo Complete', text: 'You’ve used your free voice demo. Contact us for a subscription to keep talking with Priya.', highlight: true }
              ] : !call.available ? [
                { speaker: 'Voice Status', text: call.availabilityMessage, highlight: true }
              ] : [
                { speaker: 'Priya', text: introduction[0], highlight: true },
                { speaker: 'Capability', text: introduction[1] },
                { speaker: 'How to try', text: introduction[2] },
              ]).map((item, i) => (
                <div className={`${styles.line} ${item.highlight ? styles.linePrimary : ''}`} key={i}>
                  <span className={styles.speakerName}>{item.speaker}</span>
                  <p className={styles.lineText}>{item.text}</p>
                </div>
              ))}
            </div>

            {call.state === 'live' && (
              <button className={styles.mute} onClick={call.toggleMute} aria-pressed={call.muted}>
                {call.muted ? 'Unmute microphone' : 'Mute microphone'}
              </button>
            )}
            {call.playbackBlocked && playing && (
              <button className={styles.mute} onClick={call.playAudio}>Play agent audio</button>
            )}

            <p className={styles.privacy}>
              <ShieldCheck size={14} className={styles.privacyIcon} />
              <span>Interactive voice demo. Real-time natural speech processing.</span>
            </p>
            {call.error && (call.available || playing) && !(call.used && !playing) && (
              <p className={styles.audioError} role="alert">{call.error}</p>
            )}
          </div>
        </motion.div>

        <motion.a className={styles.island} style={{ opacity: holdPhone ? 0 : islandOpacity }} href="#voice-experience" tabIndex={phoneActive ? -1 : 0} aria-label="Return to Priya's live voice demo" aria-hidden={phoneActive} inert={phoneActive}>
          <span className={styles.islandLogo}><img src="/images/virtualvox-brand.png" alt="" width={2080} height={756}/></span><span>Priya<small>VIRTUALVOX</small></span><span className={styles.islandPhone}><Phone size={15} fill="currentColor"/></span>
        </motion.a>

        <motion.div className={styles.story} style={{ opacity: holdPhone ? 0 : sceneOpacity }} aria-hidden={phoneActive}>
          {stories.map((story, i) => <div key={i} className={styles.storyScene} data-active={scene === i + 1} aria-hidden={scene !== i + 1}>
            {i === 0 && <div className={styles.orbitCards} aria-hidden="true">{[{Icon:Headphones,label:'Customer support'},{Icon:CalendarDays,label:'Appointments'},{Icon:MessageCircle,label:'Follow-ups'},{Icon:Workflow,label:'Your workflows'}].map(({Icon,label}, index)=><div key={label} style={{'--item':index} as CSSProperties}><Icon size={23}/><span>{label}</span></div>)}</div>}
            {i === 1 && <div className={styles.integrationOrbit} aria-hidden="true">{['CRM','Calendar','Knowledge','Support','Analytics','Workflows'].map((name,index)=><div key={name} style={{'--item':index} as CSSProperties}><span>{[<Workflow key="w"/>,<CalendarDays key="c"/>,<MessageCircle key="m"/>,<Headphones key="h"/>,<Check key="a"/>,<ShieldCheck key="s"/>][index]}</span><small>{name}</small></div>)}</div>}
            {i === 2 && <div className={styles.handoff}><ShieldCheck size={25}/><span>Thoughtful, at every step<small>Helpful answers. Human handoff.</small></span><Check size={17}/></div>}
            <div className={styles.storyCopy}><h2>{story.title}</h2><p>{story.text}</p></div>
          </div>)}
        </motion.div>
      </div>
    </div>
    <div className={styles.staticStories}>{stories.map((story, i)=><div key={i}><h2>{story.title}</h2><p>{story.text}</p></div>)}</div>
  </section>;
}
