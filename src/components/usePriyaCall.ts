'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type State = 'idle' | 'microphone' | 'connecting' | 'live' | 'ending' | 'ended' | 'error';
type Session = { ice_servers: RTCIceServer[]; limit_seconds: number };
type Eligibility = { used: boolean; available: boolean; message?: string };
type Runtime = {
  generation: number; busy: boolean; request?: string; admission?: Promise<Session>; finishing?: Promise<void>;
  pc?: RTCPeerConnection; channel?: RTCDataChannel; stream?: MediaStream; audio?: HTMLAudioElement;
  timer?: ReturnType<typeof setInterval>; keepalive?: ReturnType<typeof setInterval>; timeout?: ReturnType<typeof setTimeout>;
};
function demoURL(path: string) {
  const base = ['127.0.0.1', 'localhost'].includes(location.hostname)
    ? `http://${location.hostname}:${Number(location.port || 3000) + 101}` : location.origin;
  return new URL(`/api/demo/${path}`, base);
}

async function demoRequest(path: string, init: RequestInit = {}, milliseconds = 12000) {
  // AbortSignal.timeout is missing in some otherwise WebRTC-capable mobile browsers.
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), milliseconds);
  try {
    const response = await fetch(demoURL(path), { ...init, signal: controller.signal });
    return { response, body: await response.json() };
  } finally { clearTimeout(timer); }
}
function requestId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64; bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function usePriyaCall() {
  const [state, setState] = useState<State>('idle'), [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0), [muted, setMuted] = useState(false), [received, setReceived] = useState(false);
  const [used, setUsed] = useState<boolean | null>(null), [checking, setChecking] = useState(true), [available, setAvailable] = useState(true);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [playbackBlocked, setPlaybackBlocked] = useState(false);
  const runtime = useRef<Runtime>({ generation: 0, busy: false }), mounted = useRef(true);
  const eligibilityRead = useRef<Promise<Eligibility> | null>(null);
  const refreshEligibility = useCallback(() => {
    if (eligibilityRead.current) return eligibilityRead.current;
    eligibilityRead.current = (async () => {
      try {
        const { response, body: status } = await demoRequest('status', { cache: 'no-store' });
        if (!response.ok || typeof status.used !== 'boolean' || typeof status.available !== 'boolean')
          throw new Error('Availability could not be checked.');
        if (mounted.current) {
          setUsed(status.used); setAvailable(status.available);
          setAvailabilityMessage(status.available ? '' : status.message || 'Priya is on another call or temporarily unavailable. Check again shortly.');
        }
        return status as Eligibility;
      } finally { eligibilityRead.current = null; }
    })();
    return eligibilityRead.current;
  }, []);
  const retryAvailability = useCallback(async () => {
    if (runtime.current.busy) return;
    setChecking(true);
    try { await refreshEligibility(); }
    catch {
      if (mounted.current && !runtime.current.busy) {
        setAvailable(false);
        setAvailabilityMessage("We couldn't check Priya's availability. Check your connection and try again.");
      }
    } finally { if (mounted.current) setChecking(false); }
  }, [refreshEligibility]);
  const command = useCallback(async <T,>(action: 'start' | 'offer' | 'end', request_id: string, extra = {}): Promise<T> => {
    const { response, body } = await demoRequest('browser-call', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, request_id, ...extra }), keepalive: action === 'end',
    }, 45000);
    if (mounted.current && typeof body.used === 'boolean') setUsed(body.used);
    if (!response.ok) throw new Error(body.error || 'The voice connection could not complete this request.');
    return body as T;
  }, []);
  const release = useCallback((r: Runtime) => {
    clearInterval(r.timer); clearInterval(r.keepalive); clearTimeout(r.timeout);
    r.stream?.getTracks().forEach(track => { track.onended = null; track.stop(); });
    if (r.audio) { r.audio.pause(); r.audio.srcObject = null; }
    if (r.pc) { r.pc.ontrack = null; r.pc.onconnectionstatechange = null; }
    if (r.channel) { r.channel.onopen = null; r.channel.onmessage = null; r.channel.onclose = null; r.channel.close(); }
    r.pc?.close();
  }, []);
  const stop = useCallback(() => {
    const r = runtime.current;
    if (!r.busy || r.finishing) return;
    r.generation++; release(r);
    if (mounted.current) setState('ending');
    r.finishing = (async () => {
      try {
        // A cancellation during admission still ends that same request once it settles.
        await r.admission?.catch(() => {});
        if (r.request) await command('end', r.request);
      } catch { if (mounted.current) setError('Your audio has stopped. The call will close automatically.'); }
      finally {
        r.busy = false;
        if (mounted.current) { setState('ended'); void refreshEligibility().catch(() => {}); }
      }
    })();
  }, [command, refreshEligibility, release]);
  useEffect(() => {
    mounted.current = true;
    const check = () => { if (!document.hidden) void retryAvailability(); };
    check(); const interval = setInterval(check, 30000);
    const onVisibility = () => { if (document.hidden) stop(); else check(); };
    document.addEventListener('visibilitychange', onVisibility); window.addEventListener('pagehide', stop);
    window.addEventListener('online', check); window.addEventListener('focus', check);
    return () => {
      mounted.current = false; clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility); window.removeEventListener('pagehide', stop);
      window.removeEventListener('online', check); window.removeEventListener('focus', check); stop();
    };
  }, [retryAvailability, stop]);

  async function start() {
    if (runtime.current.busy || used || !available) return;
    const r: Runtime = { generation: runtime.current.generation + 1, busy: true }; runtime.current = r;
    const generation = r.generation, current = () => mounted.current && runtime.current === r && generation === r.generation;
    setError(''); setSeconds(0); setMuted(false); setReceived(false); setPlaybackBlocked(false); setState('microphone');
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.RTCPeerConnection) throw new Error('Use a browser with microphone support and open this website over HTTPS.');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false });
      if (!current()) { stream.getTracks().forEach(track => track.stop()); return; }
      r.stream = stream;
      for (const track of stream.getTracks()) track.onended = stop;
      const eligibility = await refreshEligibility();
      if (!current()) return;
      if (eligibility.used || eligibility.available === false) throw new Error(eligibility.used ? 'Your free demo has already been used.' : 'Priya is busy. Please try again shortly.');
      setState('connecting'); r.request = requestId();
      r.admission = command<Session>('start', r.request);
      const session = await r.admission;
      if (!current()) return;
      const began = Date.now(); r.timer = setInterval(() => setSeconds(Math.floor((Date.now() - began) / 1000)), 500);
      r.timeout = setTimeout(stop, Math.min(60, session.limit_seconds) * 1000);
      const pc = new RTCPeerConnection({ iceServers: session.ice_servers }); r.pc = pc;
      pc.addTransceiver(stream.getAudioTracks()[0], { direction: 'sendrecv' }); pc.addTransceiver('video', { direction: 'recvonly' });
      const audio = new Audio(); audio.autoplay = true; audio.setAttribute('playsinline', ''); r.audio = audio;
      pc.ontrack = event => {
        if (!current() || event.track.kind !== 'audio') return;
        audio.srcObject = new MediaStream([event.track]); setReceived(true);
        void audio.play().catch(() => { if (current()) setPlaybackBlocked(true); });
      };
      pc.onconnectionstatechange = () => {
        if (current() && pc.connectionState === 'failed') { setError('The audio connection failed. Please try a more stable connection.'); stop(); }
      };
      const channel = pc.createDataChannel('chat', { ordered: true }); r.channel = channel;
      const send = (value: unknown) => { if (channel.readyState === 'open') channel.send(JSON.stringify(value)); };
      channel.onopen = () => {
        if (!current()) return;
        send({ type: 'signalling', message: { type: 'trackStatus', receiver_index: 0, enabled: true } });
        send({ label: 'rtvi-ai', id: requestId(), type: 'client-ready', data: { version: '1.4.0', about: { library: 'voice-vox', library_version: '0.1.0' } } });
        r.keepalive = setInterval(() => { if (channel.readyState === 'open') channel.send(`ping: ${Date.now()}`); }, 1000);
      };
      channel.onclose = () => { if (current()) stop(); };
      channel.onmessage = event => {
        if (!current() || typeof event.data !== 'string' || event.data.length > 65536) return;
        try {
          const message = JSON.parse(event.data);
          if (message.label === 'rtvi-ai' && message.type === 'bot-ready') setState('live');
          if (message.type === 'signalling' && message.message?.type === 'peerLeft') stop();
          if (message.label === 'rtvi-ai' && message.type === 'error' && message.data?.fatal !== false) { setError('The voice session ended unexpectedly.'); stop(); }
        } catch { /* Keepalive replies are not JSON. */ }
      };
      await pc.setLocalDescription(await pc.createOffer());
      if (pc.iceGatheringState !== 'complete') await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => { pc.removeEventListener('icegatheringstatechange', check); reject(new Error('The browser could not prepare its audio connection.')); }, 10000);
        function check() { if (pc.iceGatheringState === 'complete') { clearTimeout(timer); pc.removeEventListener('icegatheringstatechange', check); resolve(); } }
        pc.addEventListener('icegatheringstatechange', check); check();
      });
      if (!current()) return;
      const answer = await command<RTCSessionDescriptionInit>('offer', r.request, { sdp: pc.localDescription!.sdp });
      if (current()) await pc.setRemoteDescription(answer);
    } catch (cause) {
      if (!current()) return;
      const e = cause as Error;
      setError(e.name === 'NotAllowedError' ? 'Allow microphone access in your browser, then click to answer again.'
        : e.name === 'NotFoundError' ? 'No microphone was found. Connect one and try again.' : e.message);
      if (r.request) stop(); else { r.generation++; r.busy = false; release(r); setState('error'); }
    }
  }
  function toggleMute() {
    const next = !muted, r = runtime.current;
    r.stream?.getAudioTracks().forEach(track => { track.enabled = !next; });
    if (r.channel?.readyState === 'open') r.channel.send(JSON.stringify({ type: 'signalling', message: { type: 'trackStatus', receiver_index: 0, enabled: !next } }));
    setMuted(next);
  }
  function playAudio() { void runtime.current.audio?.play().then(() => setPlaybackBlocked(false)).catch(() => setError('Your browser could not play audio.')); }
  return { state, error, seconds, muted, received, used, checking, available, availabilityMessage, retryAvailability, start, stop, toggleMute, playbackBlocked, playAudio,
    active: ['microphone', 'connecting', 'live', 'ending'].includes(state) };
}
